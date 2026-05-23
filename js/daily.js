import { st } from './state.js'
import { showPage, renderXPBadge, renderStreakBadge } from './ui.js'
import { getDailyLeaderboard } from './supabase.js'
import { getDailyDate, hashCode, mulberry32 } from './utils.js'
import { startTimer, displayQuestion, clearTestState } from './test.js'

function getDailyQuestions() {
  const rng = mulberry32(hashCode(getDailyDate()))
  /* global easyIntegralsQuestions, mediumIntegralsQuestions, easyDerivativesQuestions,
            mediumDerivativesQuestions, easySeriesQuestions, mediumSeriesQuestions,
            easyLimitsQuestions, mediumLimitsQuestions, easyODEQuestions, mediumODEQuestions */
  const all = [
    ...easyIntegralsQuestions,    ...mediumIntegralsQuestions,
    ...easyDerivativesQuestions,  ...mediumDerivativesQuestions,
    ...easySeriesQuestions,       ...mediumSeriesQuestions,
    ...easyLimitsQuestions,       ...mediumLimitsQuestions,
    ...easyODEQuestions,          ...mediumODEQuestions
  ].flat().filter(q => q && q.options && q.options.length === 4)

  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]]
  }
  return all.slice(0, 10).map(q => {
    const order = [0,1,2,3]
    for (let i = 3; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]]
    }
    const origCorrect = q.correct !== undefined ? q.correct : q.answerIndex
    return { ...q, options: order.map(i => q.options[i]), correct: order.indexOf(origCorrect) }
  })
}

window.startDailyChallenge = function() {
  const today = getDailyDate()
  if (localStorage.getItem('dailyChallengeDate') === today) {
    window.showDailyLeaderboard()
    return
  }
  clearTestState()
  st.isStudyMode       = false
  st.currentSection    = 'daily'
  st.currentDifficulty = 'medium'
  st.currentTest       = getDailyQuestions()
  st.currentQuestionIndex = 0
  st.userAnswers       = new Array(st.currentTest.length).fill(null)
  st.testStartTime     = Date.now()
  st.timeRemaining     = 15 * 60
  st.timerInitialTime  = st.timeRemaining
  showPage('testPage')
  document.getElementById('totalQuestions').textContent = st.currentTest.length
  document.getElementById('testTitle').textContent      = '🌟 Ежедневный вызов'
  document.getElementById('difficultyLabel').textContent = `${today} · 10 вопросов из всех разделов`
  startTimer()
  displayQuestion()
}

export function updateDailyChallengeCard() {
  const today     = getDailyDate()
  const doneToday = localStorage.getItem('dailyChallengeDate') === today
  const score     = localStorage.getItem('dailyChallengeScore')
  const btn       = document.getElementById('dailyChallengeBtn')
  const countdown = document.getElementById('dailyChallengeCountdown')
  const card      = document.getElementById('dailyChallengeCard')
  if (!btn) return
  if (doneToday) {
    btn.textContent = `✅ ${score}%`
    btn.style.background = 'linear-gradient(135deg,#10b981,#059669)'
    if (card) card.onclick = window.showDailyLeaderboard
    if (countdown) {
      if (window._dailyCountdownInterval) clearInterval(window._dailyCountdownInterval)
      const tick = () => {
        const now = new Date(); const tomorrow = new Date(now)
        tomorrow.setDate(tomorrow.getDate() + 1); tomorrow.setHours(0,0,0,0)
        const diff = tomorrow - now
        const h = Math.floor(diff / 3600000)
        const m = Math.floor((diff % 3600000) / 60000)
        const s = Math.floor((diff % 60000) / 1000)
        countdown.textContent = `Следующий через ${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
      }
      tick(); window._dailyCountdownInterval = setInterval(tick, 1000)
    }
  } else {
    btn.textContent = '🎯 Начать'; btn.style.background = ''
    if (countdown) countdown.textContent = ''
    if (card) card.onclick = window.startDailyChallenge
  }
}
window.updateDailyChallengeCard = updateDailyChallengeCard

window.showDailyLeaderboard = async function() {
  const modal = document.getElementById('dailyLeaderboardModal')
  if (!modal) return
  modal.style.display = 'flex'
  const list = document.getElementById('dailyLeaderboardList')
  if (list) list.innerHTML = '<p style="text-align:center;padding:1rem;color:#94a3b8">Загрузка...</p>'
  const today = getDailyDate()
  const { data } = await getDailyLeaderboard(today)
  if (!data || data.length === 0) {
    if (list) list.innerHTML = '<p style="text-align:center;padding:1rem;color:#94a3b8">Пока никто не прошёл сегодняшний вызов</p>'
    return
  }
  const seen = new Set()
  const unique = data.filter(r => { if (seen.has(r.username)) return false; seen.add(r.username); return true })
  const medals = ['🥇','🥈','🥉']
  const myName = st.currentUser?.user_metadata?.username || st.currentUser?.email?.split('@')[0]
  if (list) list.innerHTML = unique.map((r, i) => `
    <div style="display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;margin-bottom:6px;
      ${r.username === myName
        ? 'background:rgba(59,130,246,0.15);border:1px solid rgba(59,130,246,0.35)'
        : 'background:rgba(30,41,59,0.7)'}">
      <span style="font-size:1.25rem;width:2rem;text-align:center;flex-shrink:0">${medals[i] || `<span style="color:#64748b;font-size:0.9rem">${i+1}</span>`}</span>
      <span style="flex:1;font-weight:${r.username===myName?700:500};color:${r.username===myName?'#93c5fd':'#e2e8f0'}">${r.username}</span>
      <span style="font-weight:700;font-size:1rem;color:${r.score>=70?'#10b981':'#f59e0b'}">${r.score}%</span>
      <span style="color:#64748b;font-size:0.8rem">${r.correct_answers}/${r.total_questions}</span>
    </div>`).join('')
}
