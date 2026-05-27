// ── Подключение к Supabase ────────────────────────────────
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

const SUPABASE_URL = 'https://xahjwhoywxgudsefqowd.supabase.co'
const SUPABASE_KEY = 'sb_publishable_l-Ync04W2cC3hcveYjL0rA_tG0iSvsv'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// ── Авторизация ───────────────────────────────────────────
export async function signUp(email, password, username) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username },
      // Явно указываем куда редиректить после подтверждения почты,
      // иначе Supabase использует Site URL (suhrob4ikk.github.io без /Calculus/) → 404
      emailRedirectTo: 'https://suhrob4ikk.github.io/Calculus/'
    }
  })
  return { data, error }
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
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// ── Результаты ────────────────────────────────────────────
export async function saveResult({ userId, username, section, difficulty, score, correctAnswers, totalQuestions }) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('save_timeout')), 8000)
  )
  try {
    const { error } = await Promise.race([
      supabase.from('test_results').insert({
        user_id: userId,
        username,
        section,
        difficulty,
        score,
        correct_answers: correctAnswers,
        total_questions: totalQuestions
      }),
      timeout
    ])
    return { error }
  } catch (e) {
    console.warn('saveResult error:', e.message)
    return { error: e }
  }
}

export async function getUserResults(userId) {
  const { data, error } = await supabase
    .from('test_results')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(200)
  return { data, error }
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
  let query = supabase
    .from('test_results')
    .select('username, section, difficulty, score, correct_answers, total_questions, created_at')
    .order('score', { ascending: false })
    .limit(1000)

  if (section) query = query.eq('section', section)
  if (difficulty) query = query.eq('difficulty', difficulty)

  const { data, error } = await query
  return { data, error }
}

// ── Аватар ────────────────────────────────────────────────
export async function uploadAvatar(userId, file) {
  const ext = file.name.split('.').pop()
  const path = `${userId}/avatar.${ext}`
  const { error } = await supabase.storage
    .from('avatars')
    .upload(path, file, { upsert: true })
  if (error) return { error }
  const { data } = supabase.storage.from('avatars').getPublicUrl(path)
  // Save url to profile
  await supabase.from('profiles').update({ avatar_url: data.publicUrl }).eq('id', userId)
  return { url: data.publicUrl, error: null }
}

export async function getAvatarUrl(userId) {
  const { data } = await supabase.from('profiles').select('avatar_url').eq('id', userId).single()
  return data?.avatar_url || null
}

// ── Поиск профилей ────────────────────────────────────────
export async function searchProfiles(query) {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, avatar_url, created_at')
    .ilike('username', query ? `${query}%` : '%')
    .limit(20)
  return { data, error }
}

export async function resetPassword(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'https://suhrob4ikk.github.io/Calculus/?type=recovery'
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
  const [y, m, d] = date.split('-').map(Number)
  const startUTC = new Date(y, m - 1, d).toISOString()
  const endUTC   = new Date(y, m - 1, d + 1).toISOString()
  const { data } = await supabase
    .from('test_results')
    .select('score')
    .eq('user_id', userId)
    .eq('section', 'daily')
    .gte('created_at', startUTC)
    .lt('created_at', endUTC)
    .limit(1)
    .maybeSingle()
  return data   // { score } или null
}

export async function getDailyLeaderboard(date) {
  // date: 'YYYY-MM-DD' (local) — переводим в UTC, чтобы покрыть полный локальный день
  const [y, m, d] = date.split('-').map(Number)
  const startUTC = new Date(y, m - 1, d).toISOString()        // local midnight → UTC
  const endUTC   = new Date(y, m - 1, d + 1).toISOString()   // next local midnight → UTC
  const { data, error } = await supabase
    .from('test_results')
    .select('username, score, correct_answers, total_questions, created_at')
    .eq('section', 'daily')
    .gte('created_at', startUTC)
    .lt('created_at', endUTC)
    .order('score', { ascending: false })
    .order('created_at', { ascending: true })
    .limit(50)
  return { data, error }
}

// ── Обновление времени последнего визита ──────────────────
export async function updateLastSeen(userId) {
  // Колонка last_seen_at добавляется SQL-миграцией (см. PROJECT_MAP.md)
  await supabase.from('profiles')
    .update({ last_seen_at: new Date().toISOString() })
    .eq('id', userId)
}

// ── Ранг пользователя в лидерборде ───────────────────────
export async function getUserRankData(username) {
  const { data, error } = await supabase
    .from('test_results')
    .select('username, score')
    .not('section', 'eq', 'duel')
    .limit(2000)
  if (error || !data) return { rank: null, total: null, error }
  const avgByUser = {}
  data.forEach(r => {
    if (!avgByUser[r.username]) avgByUser[r.username] = { sum: 0, count: 0 }
    avgByUser[r.username].sum += r.score
    avgByUser[r.username].count++
  })
  const rankings = Object.entries(avgByUser)
    .map(([name, { sum, count }]) => ({ name, avg: Math.round(sum / count) }))
    .sort((a, b) => b.avg - a.avg)
  const rank = rankings.findIndex(r => r.name === username) + 1
  return { rank: rank || null, total: rankings.length, rankings, error: null }
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
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, username, avatar_url, created_at, last_seen_at')
    .eq('username', username)
    .single()
  if (!profile) return { profile: null, results: [] }
  const { data: results } = await supabase
    .from('test_results')
    .select('*')
    .eq('user_id', profile.id)
    .order('created_at', { ascending: false })
  return { profile, results: results || [] }
}

// ── История дуэлей ────────────────────────────────────────
export async function getDuelHistory(userId) {
  // Fetch user's duel records (difficulty field stores the duel code)
  const { data: mine, error } = await supabase
    .from('test_results')
    .select('*')
    .eq('user_id', userId)
    .eq('section', 'duel')
    .order('created_at', { ascending: false })
    .limit(20)

  if (!mine || mine.length === 0) return { data: [], error }

  // Fetch opponent records sharing the same duel codes in one query
  const codes = mine.map(d => d.difficulty)
  const { data: theirs } = await supabase
    .from('test_results')
    .select('username, score, correct_answers, total_questions, difficulty')
    .eq('section', 'duel')
    .in('difficulty', codes)
    .neq('user_id', userId)

  const oppMap = {}
  theirs?.forEach(d => { oppMap[d.difficulty] = d })

  // Auto-delete orphaned records (no opponent) older than 1 hour — fire-and-forget
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
  const orphanIds = mine
    .filter(d => !oppMap[d.difficulty] && d.created_at < oneHourAgo)
    .map(d => d.id)
  if (orphanIds.length > 0) {
    supabase.from('test_results').delete().in('id', orphanIds).then(() => {})
  }

  // Only return completed duels (opponent found) — skip "Ожидание" entries
  return {
    data: mine
      .filter(d => oppMap[d.difficulty])
      .map(d => {
        const opp = oppMap[d.difficulty]
        const result = d.score > opp.score ? 'win'
          : d.score < opp.score ? 'loss'
          : 'draw'
        return { ...d, opponent: opp, result }
      }),
    error
  }
}