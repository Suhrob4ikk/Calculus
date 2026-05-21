// ── Подключение к Supabase ────────────────────────────────
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

// NOTE: This file contains the Supabase URL and the publishable (anon) key
// The publishable key *must* remain public for client-side SDK usage.
// IMPORTANT: Ensure Row Level Security (RLS) is enabled in your Supabase
// project and create appropriate policies for `test_results` and `profiles`.
// Example policy: allow insert for authenticated users and allow select for
// public read where appropriate. Without RLS, your DB is writable by anyone.
const SUPABASE_URL = 'https://xahjwhoywxgudsefqowd.supabase.co'
const SUPABASE_KEY = 'sb_publishable_l-Ync04W2cC3hcveYjL0rA_tG0iSvsv'

if (SUPABASE_KEY && SUPABASE_KEY.startsWith('sb_')) {
  console.info('Supabase publishable key present. Ensure RLS policies are configured on the server.')
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// ── Авторизация ───────────────────────────────────────────
export async function signUp(email, password, username) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username } }
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
  const { error } = await supabase.from('test_results').insert({
    user_id: userId,
    username,
    section,
    difficulty,
    score,
    correct_answers: correctAnswers,
    total_questions: totalQuestions
  })
  return { error }
}

export async function getUserResults(userId) {
  const { data, error } = await supabase
    .from('test_results')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(20)
  return { data, error }
}

export async function getLeaderboard(section = null, difficulty = null) {
  // Fetch a reasonable number of recent attempts then aggregate client-side
  // to present each user's best score. This avoids relying on a single-row
  // database ordering which may return multiple attempts per user.
  let query = supabase
    .from('test_results')
    .select('username, user_id, section, difficulty, score, correct_answers, total_questions, created_at')
    .order('created_at', { ascending: false })
    .limit(1000) // safety cap to avoid huge result sets

  if (section) query = query.eq('section', section)
  if (difficulty) query = query.eq('difficulty', difficulty)

  const { data, error } = await query
  if (error) return { data: [], error }

  // Aggregate best score per username (or user_id if username missing)
  const bestMap = new Map()
  for (const row of data || []) {
    const key = row.username || row.user_id || 'anonymous'
    const prev = bestMap.get(key)
    if (!prev) { bestMap.set(key, row); continue }
    const prevScore = prev.score || 0
    const curScore = row.score || 0
    if (curScore > prevScore) bestMap.set(key, row)
    else if (curScore === prevScore) {
      // prefer more recent attempt
      if (new Date(row.created_at) > new Date(prev.created_at)) bestMap.set(key, row)
    }
  }

  const aggregated = Array.from(bestMap.values())
    .sort((a, b) => (b.score || 0) - (a.score || 0) || new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 50)

  return { data: aggregated, error: null }
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
    .limit(10)
  return { data, error }
}

export async function resetPassword(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'https://suhrob4ikk.github.io/Calculus?type=recovery'
  })
  return { error }
}

export async function updatePassword(newPassword) {
  const { error } = await supabase.auth.updateUser({ password: newPassword })
  return { error }
}

export async function getProfileByUsername(username) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, username, avatar_url, created_at')
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