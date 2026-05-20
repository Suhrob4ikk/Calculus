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
  let query = supabase
    .from('test_results')
    .select('username, section, difficulty, score, correct_answers, total_questions, created_at')
    .order('score', { ascending: false })
    .limit(10)

  if (section) query = query.eq('section', section)
  if (difficulty) query = query.eq('difficulty', difficulty)

  const { data, error } = await query
  return { data, error }
}