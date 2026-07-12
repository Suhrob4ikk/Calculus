// ── Подключение к Supabase ────────────────────────────────
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'
import { withTimeout } from './utils.js'

const SUPABASE_URL = 'https://xahjwhoywxgudsefqowd.supabase.co'
const SUPABASE_KEY = 'sb_publishable_l-Ync04W2cC3hcveYjL0rA_tG0iSvsv'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// ── Авторизация ───────────────────────────────────────────
export async function checkUsernameAvailable(username) {
  const { data } = await supabase.from('profiles').select('id').ilike('username', username).maybeSingle()
  return !data
}

export async function signUp(email, password, username) {
  const taken = !(await checkUsernameAvailable(username))
  if (taken) return { data: null, error: { message: 'Это имя пользователя уже занято' } }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username },
      emailRedirectTo: 'https://mathcore-app.vercel.app/'
    }
  })
  if (!error && data.user) {
    await supabase.from('profiles').upsert({ id: data.user.id, username, email }, { onConflict: 'id' })
  }
  return { data, error }
}

export async function getEmailByUsername(username) {
  try {
    const res = await withTimeout(
      fetch(`${SUPABASE_URL}/functions/v1/find-email`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'apikey': SUPABASE_KEY },
        body:    JSON.stringify({ username }),
      })
    )
    if (!res.ok) return null
    const { email } = await res.json()
    return email || null
  } catch {
    return null
  }
}

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  return { data, error }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function getUser() {
  try {
    const { data: { user } } = await withTimeout(supabase.auth.getUser())
    return user
  } catch {
    return null
  }
}

// ── Результаты ────────────────────────────────────────────
/**
 * [КРИТ-2] Validates answers server-side via Edge Function and writes to test_results.
 * The server computes correct_answers and score from the canonical question pool —
 * preventing any client-side score manipulation.
 *
 * @param answers    Array of {questionText, selected} — option TEXT, not index
 * @param section    DB section value ("limits", "daily", "duel:CODE", …)
 * @param difficulty "easy" | "medium" | "hard"
 * @param username   Supabase profile username
 * @param dailyDate  "YYYY-MM-DD" — required when section === "daily"
 * @param duelSection   Original duel subject ("mixed", "limits", …) — required for duels
 * @param duelDifficulty Duel difficulty — required for duels
 * @returns { correctAnswers, totalQuestions, score, xpGained } from server
 */
export async function submitTestResult({
  answers, section, difficulty, username,
  dailyDate = null, duelSection = null, duelDifficulty = null
}) {
  const { data: { session } } = await supabase.auth.getSession()
  const token = session?.access_token
  if (!token) throw new Error('Not authenticated')

  const body = { answers, section, difficulty, username }
  if (dailyDate)     body.dailyDate     = dailyDate
  if (duelSection)   body.duelSection   = duelSection
  if (duelDifficulty) body.duelDifficulty = duelDifficulty

  const res = await fetch(`${SUPABASE_URL}/functions/v1/submit-test`, {
    method:  'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${token}`,
      'apikey':        SUPABASE_KEY,
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || `Edge Function error HTTP ${res.status}`)
  }
  return res.json()  // { correctAnswers, totalQuestions, score, xpGained }
}

export async function getUserResults(userId) {
  try {
    const { data, error } = await withTimeout(
      supabase.from('test_results').select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(200)
    )
    return { data: data ?? null, error }
  } catch (e) {
    console.warn('getUserResults error:', e.message)
    return { data: null, error: e }
  }
}

export async function deleteResultById(id, userId) {
  const { error } = await supabase
    .from('test_results')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)
  return { error }
}

export async function deleteAllUserResults(userId) {
  const { error } = await supabase
    .from('test_results')
    .delete()
    .eq('user_id', userId)
  return { error }
}

export async function getLeaderboard(section = null, difficulty = null) {
  try {
    let query = supabase
      .from('test_results')
      .select('username, section, difficulty, score, correct_answers, total_questions, created_at')
      .not('section', 'ilike', 'duel%')
      .order('score', { ascending: false })
      .limit(2000)
    if (section) query = query.eq('section', section)
    if (difficulty) query = query.eq('difficulty', difficulty)
    const { data, error } = await withTimeout(query)
    return { data: data ?? null, error }
  } catch (e) {
    console.warn('getLeaderboard error:', e.message)
    return { data: null, error: e }
  }
}

// ── Аватар ────────────────────────────────────────────────
export async function uploadAvatar(userId, file) {
  const path = `${userId}.jpg`
  try {
    const { error } = await withTimeout(
      supabase.storage.from('avatars').upload(path, file, { upsert: true }),
      15000
    )
    if (error) return { error }
    const { data } = supabase.storage.from('avatars').getPublicUrl(path)
    await withTimeout(
      supabase.from('profiles').update({ avatar_url: data.publicUrl }).eq('id', userId)
    )
    return { url: data.publicUrl, error: null }
  } catch (e) {
    console.warn('uploadAvatar error:', e.message)
    return { error: e }
  }
}

export async function getAvatarUrl(userId) {
  try {
    const { data } = await withTimeout(
      supabase.from('profiles').select('avatar_url').eq('id', userId).single()
    )
    return data?.avatar_url || null
  } catch {
    return null
  }
}

// ── Поиск профилей ────────────────────────────────────────
export async function searchProfiles(query) {
  try {
    const { data, error } = await withTimeout(
      supabase.from('profiles')
        .select('id, username, avatar_url, created_at')
        .ilike('username', query ? `${query}%` : '%')
        .limit(20)
    )
    return { data: data ?? null, error }
  } catch (e) {
    console.warn('searchProfiles error:', e.message)
    return { data: null, error: e }
  }
}

export async function resetPassword(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin + '/'
  })
  return { error }
}

export async function updatePassword(newPassword) {
  const { error } = await supabase.auth.updateUser({ password: newPassword })
  return { error }
}

// ── Push-подписки ─────────────────────────────────────────
export async function savePushSubscription(userId, subscription) {
  const { error } = await supabase
    .from('push_subscriptions')
    .upsert({ user_id: userId, subscription }, { onConflict: 'user_id' })
  return { error }
}

export async function deletePushSubscription(userId) {
  const { error } = await supabase
    .from('push_subscriptions')
    .delete()
    .eq('user_id', userId)
  return { error }
}

// ── Ежедневный вызов ─────────────────────────────────────
export async function getTodayDailyResult(userId, date) {
  // Primary: use daily_date column (new rows). Fallback: created_at range (old rows).
  const { data: byDate } = await supabase
    .from('test_results')
    .select('score')
    .eq('user_id', userId)
    .eq('section', 'daily')
    .eq('daily_date', date)
    .limit(1)
    .maybeSingle()
  if (byDate) return byDate

  // Fallback for rows saved before daily_date column was added (UTC midnight boundaries)
  const [y, m, d] = date.split('-').map(Number)
  const startUTC = new Date(Date.UTC(y, m - 1, d)).toISOString()
  const endUTC   = new Date(Date.UTC(y, m - 1, d + 1)).toISOString()
  const { data } = await supabase
    .from('test_results')
    .select('score')
    .eq('user_id', userId)
    .eq('section', 'daily')
    .gte('created_at', startUTC)
    .lt('created_at', endUTC)
    .limit(1)
    .maybeSingle()
  return data
}

export async function getDailyLeaderboard(date) {
  // Primary: use daily_date column (new rows — timezone-safe).
  const { data: byDate, error: err1 } = await supabase
    .from('test_results')
    .select('username, score, correct_answers, total_questions, created_at')
    .eq('section', 'daily')
    .eq('daily_date', date)
    .order('score', { ascending: false })
    .order('created_at', { ascending: true })
    .limit(100)
  if (err1) console.warn('[DailyLeaderboard] daily_date query error:', err1.message)
  if (!err1 && byDate && byDate.length > 0) return { data: byDate, error: null }

  // Fallback: created_at window for rows without daily_date (UTC midnight boundaries)
  const [y, m, d] = date.split('-').map(Number)
  const startUTC = new Date(Date.UTC(y, m - 1, d)).toISOString()
  const endUTC   = new Date(Date.UTC(y, m - 1, d + 1)).toISOString()
  const { data, error } = await supabase
    .from('test_results')
    .select('username, score, correct_answers, total_questions, created_at')
    .eq('section', 'daily')
    .gte('created_at', startUTC)
    .lt('created_at', endUTC)
    .order('score', { ascending: false })
    .order('created_at', { ascending: true })
    .limit(100)
  if (error) console.warn('[DailyLeaderboard] fallback query error:', error.message)
  return { data, error }
}

// ── Обновление времени последнего визита ──────────────────
export async function updateLastSeen(userId) {
  supabase.from('profiles')
    .update({ last_seen_at: new Date().toISOString() })
    .eq('id', userId)
    .then(() => {})
    .catch(() => {})
}

// ── Ранг пользователя в лидерборде ───────────────────────
export async function getUserRankData(username) {
  try {
    const { data, error } = await withTimeout(
      supabase.from('test_results').select('username, score, correct_answers, difficulty, section')
        .not('section', 'ilike', 'duel%').limit(2000)
    )
    if (error || !data) return { rank: null, total: null, error }
    const DIFF_XP = { easy: 10, medium: 20, hard: 30, quick: 20, standard: 20, full: 30 }
    const xpByUser = {}
    data.forEach(r => {
      const pts = (r.correct_answers || 0) * (DIFF_XP[r.difficulty] || 20)
        + (r.score === 100 ? 25 : 0)
        + (r.section === 'daily' ? 50 : 0)
      xpByUser[r.username] = (xpByUser[r.username] || 0) + pts
    })
    const rankings = Object.entries(xpByUser)
      .map(([name, xp]) => ({ name, xp }))
      .sort((a, b) => b.xp - a.xp)
    const rank = rankings.findIndex(r => r.name === username) + 1
    return { rank: rank || null, total: rankings.length, rankings, error: null }
  } catch (e) {
    console.warn('getUserRankData error:', e.message)
    return { rank: null, total: null, error: e }
  }
}

// ── Профили нескольких пользователей по именам ────────────
export async function getProfilesByUsernames(usernames) {
  if (!usernames || usernames.length === 0) return []
  const { data } = await supabase
    .from('profiles')
    .select('username, avatar_url, last_seen_at')
    .in('username', usernames)
  return data || []
}

export async function getProfileByUsername(username) {
  try {
    const { data: profile } = await withTimeout(
      supabase.from('profiles')
        .select('id, username, avatar_url, created_at, last_seen_at')
        .eq('username', username).single()
    )
    if (!profile) return { profile: null, results: [] }
    const { data: results } = await withTimeout(
      supabase.from('test_results').select('*')
        .eq('user_id', profile.id).order('created_at', { ascending: false })
    )
    return { profile, results: results || [] }
  } catch (e) {
    console.warn('getProfileByUsername error:', e.message)
    return { profile: null, results: [] }
  }
}

// ── XP пользователя (для синхронизации из БД) ────────────
// Считает суммарный XP пользователя по всем его результатам (кроме дуэлей).
// Используется ui.js::syncXpFromDB при каждом входе.
export async function getUserXpTotal(userId) {
  try {
    const { data } = await withTimeout(
      supabase.from('test_results')
        .select('score, correct_answers, difficulty, section')
        .eq('user_id', userId)
        .not('section', 'ilike', 'duel%')
        .limit(2000)
    )
    if (!data) return 0
    const DIFF_XP = { easy: 10, medium: 20, hard: 30, quick: 20, standard: 20, full: 30 }
    return data.reduce((sum, r) =>
      sum
      + (r.correct_answers || 0) * (DIFF_XP[r.difficulty] || 20)
      + (r.score === 100 ? 25 : 0)
      + (r.section === 'daily' ? 50 : 0), 0)
  } catch {
    return 0
  }
}

// ── История дуэлей ────────────────────────────────────────
export async function getDuelHistory(userId) {
  let mine, error
  try {
    const res = await withTimeout(
      supabase.from('test_results').select('*')
        .eq('user_id', userId).ilike('section', 'duel:%')
        .order('created_at', { ascending: false }).limit(20)
    )
    mine = res.data; error = res.error
  } catch (e) {
    console.warn('getDuelHistory error:', e.message)
    return { data: [], error: e }
  }

  if (!mine || mine.length === 0) return { data: [], error }

  // Fetch opponent records sharing the same duel section (which encodes the unique code)
  const duelSections = mine.map(d => d.section)
  const { data: theirs } = await supabase
    .from('test_results')
    .select('username, score, correct_answers, total_questions, section, difficulty')
    .ilike('section', 'duel:%')
    .in('section', duelSections)
    .neq('user_id', userId)

  const oppMap = {}
  theirs?.forEach(d => { oppMap[d.section] = d })

  // Auto-delete orphaned records (no opponent) older than 1 hour — fire-and-forget
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
  const orphanIds = mine
    .filter(d => !oppMap[d.section] && d.created_at < oneHourAgo)
    .map(d => d.id)
  if (orphanIds.length > 0) {
    supabase.from('test_results').delete().in('id', orphanIds).then(() => {})
  }

  // Only return completed duels (opponent found) — skip "Ожидание" entries
  return {
    data: mine
      .filter(d => oppMap[d.section])
      .map(d => {
        const opp = oppMap[d.section]
        const result = d.score > opp.score ? 'win'
          : d.score < opp.score ? 'loss'
          : 'draw'
        return { ...d, opponent: opp, result }
      }),
    error
  }
}

// ── Ошибки пользователя ───────────────────────────────────

/**
 * Batch upsert wrong answers via the upsert_mistakes DB RPC (1 request).
 * items: [{ hash, data, subject, difficulty }]
 * Replaces the old N+1 saveMistake loop in mistakes.js.
 */
export async function saveMistakeBatch(userId, items) {
  if (!userId || !items.length) return
  const { data: { session } } = await supabase.auth.getSession()
  const token = session?.access_token
  if (!token) return
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/rpc/upsert_mistakes`, {
      method:  'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${token}`,
        'apikey':        SUPABASE_KEY,
      },
      body: JSON.stringify({ p_user_id: userId, p_items: items }),
    })
  } catch (e) {
    console.warn('[saveMistakeBatch]', e)
  }
}

/** Batch mark correctly-answered mistakes as corrected (1 UPDATE request). */
export async function markMistakesCorrectBatch(userId, questionHashes) {
  if (!userId || !questionHashes.length) return
  await supabase.from('user_mistakes')
    .update({ corrected: true, updated_at: new Date().toISOString() })
    .eq('user_id', userId)
    .in('question_hash', questionHashes)
    .catch(e => console.warn('[markMistakesCorrectBatch]', e))
}

// Загрузить все активные (неисправленные) ошибки пользователя
export async function fetchMistakes(userId) {
  const { data, error } = await supabase
    .from('user_mistakes')
    .select('*')
    .eq('user_id', userId)
    .eq('corrected', false)
    .order('updated_at', { ascending: false })
    .limit(500)
  return { data, error }
}

// ── Серия дней: чтение и запись ───────────────────────────
export async function loadStreakFromDB(userId) {
  try {
    const { data } = await withTimeout(
      supabase.from('profiles').select('streak, streak_last_date').eq('id', userId).single()
    )
    return { dbStreak: data?.streak ?? 0, dbLastDate: data?.streak_last_date ?? null }
  } catch {
    return { dbStreak: 0, dbLastDate: null }
  }
}

export async function saveStreakToDB(userId, streak, lastDate) {
  if (!userId) return
  supabase.from('profiles')
    .update({ streak, streak_last_date: lastDate })
    .eq('id', userId)
    .then(() => {})
    .catch(e => console.warn('[saveStreakToDB]', e))
}