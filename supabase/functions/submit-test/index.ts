/**
 * Supabase Edge Function: submit-test
 *
 * Validates quiz answers server-side and writes to test_results.
 * Prevents score manipulation: the client sends raw answers (question text +
 * selected option text); the server computes correct_answers and score.
 *
 * Supports three modes:
 *   quiz  — regular section quiz (validates against subject+difficulty pool)
 *   daily — daily challenge (regenerates today's questions from date seed)
 *   duel  — PvP duel (regenerates questions from duel code seed)
 *
 * Question pool is loaded from Supabase Storage bucket "question-bank"
 * (public, files named "{subject}_{difficulty}.json").
 *
 * One-time setup:
 *   1. supabase storage create question-bank --public
 *   2. Upload all 21 JSON files from Android assets/questions/ to the bucket
 *
 * Env vars required (set in Supabase Dashboard → Settings → Edge Functions):
 *   SUPABASE_URL              — project URL
 *   SUPABASE_ANON_KEY         — anon/public key (for user auth verification)
 *   SUPABASE_SERVICE_ROLE_KEY — service role (for trusted test_results INSERT)
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// ── Types ─────────────────────────────────────────────────────────────────────

interface Question {
  question: string
  options?: string[]
  correct?: number
  type?: string
  answer?: string
}

/** One answer entry sent by the client. */
interface AnswerEntry {
  /** The full question text — used as the server-side lookup key. */
  questionText: string
  /**
   * For multiple-choice: the TEXT of the selected option (not the index).
   * For open questions: the typed answer string.
   * Empty string means "unanswered" — always counted as wrong.
   */
  selected: string
}

interface SubmitBody {
  answers: AnswerEntry[]
  /** Section stored in DB: "limits", "daily", "duel:XXXX", etc. */
  section: string
  difficulty: string
  username: string
  /** Required for daily mode: "YYYY-MM-DD" */
  dailyDate?: string
  /** Required for duel mode: original subject (e.g. "limits", "mixed") */
  duelSection?: string
  /** Required for duel mode: difficulty used in duel */
  duelDifficulty?: string
}

interface SubmitResult {
  correctAnswers: number
  totalQuestions: number
  score: number
  xpGained: number
}

// ── Environment ───────────────────────────────────────────────────────────────

const SUPABASE_URL  = Deno.env.get('SUPABASE_URL')!
const ANON_KEY      = Deno.env.get('SUPABASE_ANON_KEY')!
const SERVICE_KEY   = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const STORAGE_BASE  = `${SUPABASE_URL}/storage/v1/object/public/question-bank`

// ── Question pool cache (warm between requests in the same Deno isolate) ──────

const questionCache = new Map<string, Question[]>()

async function loadPool(subject: string, difficulty: string): Promise<Question[]> {
  const key = `${subject}_${difficulty}`
  if (questionCache.has(key)) return questionCache.get(key)!

  const url = `${STORAGE_BASE}/${key}.json`
  try {
    const res = await fetch(url)
    if (!res.ok) return []
    const data = await res.json() as Question[]
    // Normalise Gson-style nulls from Android asset export
    const normalised = data.map(q => ({
      ...q,
      options: q.options ?? [],
      type:    q.type    ?? 'choice',
      answer:  q.answer  ?? '',
    }))
    questionCache.set(key, normalised)
    return normalised
  } catch {
    return []
  }
}

// ── Daily question generation (mirrors client-side hashCode + mulberry32) ─────

const DAILY_SUBJECTS = ['integrals', 'derivatives', 'series', 'limits', 'ode', 'probability', 'linalg']

function hashCode(str: string): number {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(31, h) + str.charCodeAt(i) | 0
  }
  return h >>> 0
}

function mulberry32(seed: number): () => number {
  return function () {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = t + Math.imul(t ^ (t >>> 7), 61 | t) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function shuffle<T>(arr: T[], rng: () => number): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

async function getDailyPool(date: string): Promise<Question[]> {
  const cacheKey = `__daily_${date}`
  if (questionCache.has(cacheKey)) return questionCache.get(cacheKey)!

  // Load all easy+medium pools in parallel
  const pools = await Promise.all(
    DAILY_SUBJECTS.flatMap(s => [loadPool(s, 'easy'), loadPool(s, 'medium')])
  )
  const all = pools.flat().filter(q =>
    q && q.options && q.options.length === 4 && q.type !== 'open'
  )

  const rng = mulberry32(hashCode(date))
  const shuffled = shuffle(all, rng)
  const questions = shuffled.slice(0, 10)
  questionCache.set(cacheKey, questions)
  return questions
}

async function getDuelPool(code: string, section: string, difficulty: string): Promise<Question[]> {
  const cacheKey = `__duel_${code}_${section}_${difficulty}`
  if (questionCache.has(cacheKey)) return questionCache.get(cacheKey)!

  const seed = hashCode(`${code}_duel_${section}_${difficulty}`)
  const rng  = mulberry32(seed)

  let pool: Question[]
  if (section === 'mixed') {
    const perSubjectPools = await Promise.all(DAILY_SUBJECTS.map(s => loadPool(s, difficulty)))
    const selected: Question[] = []
    for (const sPool of perSubjectPools) {
      const valid = sPool.filter(q => q.options && q.options.length === 4)
      const shuf  = shuffle(valid, rng)
      selected.push(...shuf.slice(0, 2))
    }
    pool = shuffle(selected, rng)
  } else {
    const raw  = await loadPool(section, difficulty)
    const valid = raw.filter(q => q.options && q.options.length === 4)
    pool = shuffle(valid, rng)
  }

  const questions = pool.slice(0, 10)
  questionCache.set(cacheKey, questions)
  return questions
}

// ── Answer scoring ────────────────────────────────────────────────────────────

/** Mirrors web test.js normalizeAnswer() and Android normalizeAnswer(). */
function normalizeAnswer(s: string): string {
  const t = s.trim().toLowerCase().replace(/\s+/g, '').replace(/,/g, '.')
  return t.includes('.') ? t.replace(/0+$/, '').replace(/\.$/, '') : t
}

function getCorrectText(q: Question): string {
  if (q.type === 'open') return q.answer ?? ''
  if (!q.options || q.correct === undefined) return ''
  return q.options[q.correct] ?? ''
}

function isCorrect(q: Question, selected: string): boolean {
  if (!selected) return false
  const correctText = getCorrectText(q)
  if (q.type === 'open') {
    return normalizeAnswer(selected) === normalizeAnswer(correctText)
  }
  // Multiple-choice: compare option text directly
  return selected === correctText
}

// ── XP formula (mirrors Android XpUtils.kt and web ui.js XP_TABLE) ───────────

function computeXp(correctAnswers: number, difficulty: string, score: number): number {
  const mult = difficulty === 'easy' ? 10 : difficulty === 'hard' ? 30 : 20
  return correctAnswers * mult + (score === 100 ? 25 : 0)
}

// ── CORS headers ──────────────────────────────────────────────────────────────

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type, apikey',
}

// ── Main handler ──────────────────────────────────────────────────────────────

Deno.serve(async (req: Request) => {
  // Pre-flight
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS })
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 })
  }

  // ── Step 1: Verify JWT — extract userId from the user's access token ─────
  const authHeader = req.headers.get('Authorization') ?? ''
  if (!authHeader.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'Missing Authorization header' }), {
      status: 401, headers: CORS
    })
  }

  const supabaseUser = createClient(SUPABASE_URL, ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
  })
  const { data: { user }, error: authErr } = await supabaseUser.auth.getUser()
  if (authErr || !user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401, headers: CORS
    })
  }

  // ── Step 2: Parse request body ────────────────────────────────────────────
  let body: SubmitBody
  try {
    body = await req.json() as SubmitBody
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400, headers: CORS
    })
  }

  const { answers, section, difficulty, username, dailyDate, duelSection, duelDifficulty } = body

  if (!answers?.length || !section || !difficulty || !username) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), {
      status: 400, headers: CORS
    })
  }
  if (answers.length > 50) {
    return new Response(JSON.stringify({ error: 'Too many answers' }), {
      status: 400, headers: CORS
    })
  }

  // ── Step 3: Load the canonical question pool ──────────────────────────────
  let pool: Question[]

  if (section === 'daily') {
    if (!dailyDate) {
      return new Response(JSON.stringify({ error: 'dailyDate required for daily mode' }), {
        status: 400, headers: CORS
      })
    }
    // Allow today ± 1 day (timezone tolerance)
    const serverToday     = new Date().toISOString().slice(0, 10)
    const serverYesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10)
    if (dailyDate !== serverToday && dailyDate !== serverYesterday) {
      return new Response(JSON.stringify({ error: 'Stale daily date' }), {
        status: 400, headers: CORS
      })
    }
    pool = await getDailyPool(dailyDate)

  } else if (section.startsWith('duel:')) {
    const code    = section.slice(5)           // "duel:XXXX" → "XXXX"
    const ds      = duelSection   ?? 'mixed'
    const dd      = duelDifficulty ?? difficulty
    pool = await getDuelPool(code, ds, dd)

  } else {
    // Regular quiz (section = subject name)
    pool = await loadPool(section, difficulty)
  }

  if (pool.length === 0) {
    return new Response(JSON.stringify({ error: 'Could not load question pool' }), {
      status: 500, headers: CORS
    })
  }

  // Build lookup map: question text → Question object
  const qMap = new Map<string, Question>(pool.map(q => [q.question, q]))

  // ── Step 4: Score each answer ─────────────────────────────────────────────
  const totalQuestions = answers.length
  let correctAnswers   = 0

  for (const { questionText, selected } of answers) {
    const q = qMap.get(questionText)
    if (q && isCorrect(q, selected)) correctAnswers++
    // Unrecognised question text → treated as wrong (prevents fabricated questions)
  }

  const score = totalQuestions > 0
    ? Math.round((correctAnswers / totalQuestions) * 100)
    : 0

  // ── Step 5: Write to test_results (service role — trusted write) ──────────
  const admin = createClient(SUPABASE_URL, SERVICE_KEY)
  const { error: insertErr } = await admin.from('test_results').insert({
    user_id:         user.id,
    username,
    section,
    difficulty,
    score,
    correct_answers: correctAnswers,
    total_questions: totalQuestions,
  })

  if (insertErr) {
    console.error('test_results insert error:', insertErr.message)
    return new Response(JSON.stringify({ error: `DB error: ${insertErr.message}` }), {
      status: 500, headers: CORS
    })
  }

  // ── Step 6: Return server-computed result ─────────────────────────────────
  const dailyBonus = section === 'daily' ? 50 : 0
  const xpGained   = computeXp(correctAnswers, difficulty, score) + dailyBonus

  const result: SubmitResult = { correctAnswers, totalQuestions, score, xpGained }
  return new Response(JSON.stringify(result), {
    headers: { 'Content-Type': 'application/json', ...CORS }
  })
})
