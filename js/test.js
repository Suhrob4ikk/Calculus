import { st } from './state.js'
import { showPage, playSound, XP_TABLE, addXP, showXPToast, renderXPBadge, launchConfetti } from './ui.js'
import { saveResult } from './supabase.js'
import { getDailyDate } from './utils.js'

// ── Таймер ────────────────────────────────────────────────
export function startTimer() {
  updateTimerDisplay()
  if (st.testTimer) clearInterval(st.testTimer)
  st.testTimer = setInterval(() => {
    st.timeRemaining--
    updateTimerDisplay()
    if (st.timeRemaining <= 0) {
      clearInterval(st.testTimer)
      const timerEl = document.getElementById('timerDisplay')
      if (timerEl) {
        timerEl.textContent = '⏱️ Время вышло!'
        timerEl.className = 'text-lg font-semibold text-red-600 bg-red-100 px-4 py-2 rounded-lg animate-pulse'
      }
      setTimeout(() => window.finishTest(), 1500)
    }
  }, 1000)
}

function updateTimerDisplay() {
  const m  = Math.floor(st.timeRemaining / 60)
  const s  = st.timeRemaining % 60
  const el = document.getElementById('timerDisplay')
  if (!el) return
  el.textContent = `⏱️ ${m}:${s.toString().padStart(2, '0')}`
  el.className = st.timeRemaining <= 300
    ? 'text-lg font-semibold text-red-600 bg-red-50 px-4 py-2 rounded-lg animate-pulse'
    : st.timeRemaining <= 600
      ? 'text-lg font-semibold text-orange-600 bg-orange-50 px-4 py-2 rounded-lg'
      : 'text-lg font-semibold text-green-600 bg-green-50 px-4 py-2 rounded-lg'
}

export function stopTimer() {
  if (st.testTimer) { clearInterval(st.testTimer); st.testTimer = null }
}

// ── Сохранение / очистка / восстановление состояния теста ─
export function saveTestState() {
  if (st.currentSection === 'duel' || st.currentSection === 'daily') return
  try {
    localStorage.setItem('testState', JSON.stringify({
      section: st.currentSection,
      difficulty: st.currentDifficulty,
      currentQuestionIndex: st.currentQuestionIndex,
      userAnswers: st.userAnswers,
      timeRemaining: st.timeRemaining,
      currentTest: st.currentTest
    }))
  } catch (e) { console.error('saveTestState failed:', e) }
}
export function clearTestState() {
  localStorage.removeItem('testState')
}
export function restoreTestState() {
  const saved = localStorage.getItem('testState')
  if (!saved) return false
  try {
    const data = JSON.parse(saved)
    if (!data.currentTest || !data.currentTest.length) return false
    st.currentSection       = data.section
    st.currentDifficulty    = data.difficulty
    st.currentQuestionIndex = data.currentQuestionIndex || 0
    st.userAnswers          = data.userAnswers || []
    st.timeRemaining        = data.timeRemaining || 25 * 60
    st.timerInitialTime     = data.timeRemaining || 25 * 60
    st.currentTest          = data.currentTest
    st.testStartTime        = Date.now()
    st.timerStartTime       = null
    return true
  } catch (e) {
    console.error('restoreTestState failed:', e)
    localStorage.removeItem('testState')
    return false
  }
}

// Регистрируем как window callbacks для других модулей
window._startTimer       = startTimer
window._stopTimer        = stopTimer
window._displayQuestion  = displayQuestion
window._clearTestState   = clearTestState
window._restoreTestState = restoreTestState

// ── Запуск теста ──────────────────────────────────────────
export function startTest(section, difficulty, pool, countSelectId, sectionEl) {
  clearTestState()
  st.currentSection    = section
  st.currentDifficulty = difficulty
  const countEl = document.getElementById(countSelectId)
  const questionCount = countEl ? parseInt(countEl.value) : 15
  const minutesMap = {
    easy:   {5: 25, 7: 30, 10: 35, 15: 40, 20: 50, 25: 60},
    medium: {5: 30, 7: 35, 10: 40, 15: 50, 20: 60, 25: 75},
    hard:   {5: 35, 7: 40, 10: 50, 15: 60, 20: 75, 25: 90},
  }
  const totalMinutes = (minutesMap[difficulty]?.[questionCount]) || (questionCount * 25 / 5)
  st.timeRemaining = totalMinutes * 60
  let questions = pool.flat().filter(q => q && q.options && q.options.every(o => o != null))
  const shuffled = [...questions].sort(() => Math.random() - 0.5).slice(0, Math.min(questionCount, questions.length))
  st.currentTest = shuffled.map(q => {
    const order = [0, 1, 2, 3].sort(() => Math.random() - 0.5)
    return {
      ...q,
      options: order.map(i => q.options[i]),
      correct: order.indexOf(q.correct !== undefined ? q.correct : q.answerIndex)
    }
  })
  st.currentQuestionIndex = 0
  st.userAnswers  = new Array(st.currentTest.length).fill(null)
  st.testStartTime = Date.now()
  document.getElementById(sectionEl).classList.add('hidden')
  showPage('testPage')
  document.getElementById('totalQuestions').textContent = st.currentTest.length
  const sectionName = { integrals: 'Интегралы', derivatives: 'Производные', series: 'Ряды', limits: 'Пределы', ode: 'Дифф. уравнения' }[section] || section
  const diffName    = difficulty === 'easy' ? 'Лёгкий' : difficulty === 'medium' ? 'Средний' : 'Сложный'
  document.getElementById('testTitle').textContent      = `${st.isStudyMode ? '📖 Изучение' : 'Тест'}: ${sectionName}`
  document.getElementById('difficultyLabel').textContent = `Уровень: ${diffName}${st.isStudyMode ? ' · Без таймера · Результат не сохраняется' : ''}`
  const timerEl = document.getElementById('timerDisplay')
  if (timerEl) timerEl.style.display = st.isStudyMode ? 'none' : ''
  if (!st.isStudyMode) startTimer()
  displayQuestion()
}

window.startIntegralsTest = function(d, study = false) {
  st.isStudyMode = study
  /* global easyIntegralsQuestions, mediumIntegralsQuestions, hardIntegralsQuestions */
  const pool = d==='easy' ? easyIntegralsQuestions : d==='medium' ? mediumIntegralsQuestions : hardIntegralsQuestions
  startTest('integrals', d, pool, 'integralsCount', 'integralsSection')
}
window.startLimitsTest = function(d, study = false) {
  st.isStudyMode = study
  /* global easyLimitsQuestions, mediumLimitsQuestions, hardLimitsQuestions */
  const pool = d==='easy' ? easyLimitsQuestions : d==='medium' ? mediumLimitsQuestions : hardLimitsQuestions
  startTest('limits', d, pool, 'limitsCount', 'limitsSection')
}
window.startDerivativesTest = function(d, study = false) {
  st.isStudyMode = study
  /* global easyDerivativesQuestions, mediumDerivativesQuestions, hardDerivativesQuestions */
  const pool = d==='easy' ? easyDerivativesQuestions : d==='medium' ? mediumDerivativesQuestions : hardDerivativesQuestions
  startTest('derivatives', d, pool, 'derivativesCount', 'derivativesSection')
}
window.startSeriesTest = function(d, study = false) {
  st.isStudyMode = study
  /* global easySeriesQuestions, mediumSeriesQuestions, hardSeriesQuestions */
  const pool = d==='easy' ? easySeriesQuestions : d==='medium' ? mediumSeriesQuestions : hardSeriesQuestions
  startTest('series', d, pool, 'seriesCount', 'seriesSection')
}
window.startODETest = function(d, study = false) {
  st.isStudyMode = study
  /* global easyODEQuestions, mediumODEQuestions, hardODEQuestions */
  const pool = d==='easy' ? easyODEQuestions : d==='medium' ? mediumODEQuestions : hardODEQuestions
  startTest('ode', d, pool, 'odeCount', 'odeSection')
}
window.restartTest = function() {
  if (st.currentSection === 'daily') { window.showHome(); return }
  if (st.currentSection === 'duel')  { window.showDuelModal(); return }
  const fn = st.currentSection==='ode' ? window.startODETest
    : st.currentSection==='limits'      ? window.startLimitsTest
    : st.currentSection==='series'      ? window.startSeriesTest
    : st.currentSection==='derivatives' ? window.startDerivativesTest
    : window.startIntegralsTest
  fn(st.currentDifficulty)
}

// ── Вопросы ───────────────────────────────────────────────
window.selectAnswer = function(answerIndex) {
  if (st.userAnswers[st.currentQuestionIndex] !== null) return
  st.userAnswers[st.currentQuestionIndex] = answerIndex
  const correct = st.currentTest[st.currentQuestionIndex].correct
  playSound(answerIndex === correct ? 'correct' : 'wrong')
  const isDark = document.documentElement.classList.contains('dark')
  document.querySelectorAll('.option-label').forEach((label, i) => {
    label.style.pointerEvents = 'none'
    const radio = label.querySelector('input[type="radio"]')
    if (radio) radio.disabled = true
    if (i === correct) {
      label.style.borderColor = '#10b981'
      label.style.backgroundColor = isDark ? '#064e3b' : '#ecfdf5'
      label.style.color = isDark ? '#a7f3d0' : '#064e3b'
    } else if (i === answerIndex && answerIndex !== correct) {
      label.style.borderColor = '#ef4444'
      label.style.backgroundColor = isDark ? '#450a0a' : '#fef2f2'
      label.style.color = isDark ? '#fca5a5' : '#7f1d1d'
    }
  })
}

export function displayQuestion() {
  const question  = st.currentTest[st.currentQuestionIndex]
  const container = document.getElementById('questionContainer')
  const answered  = st.userAnswers[st.currentQuestionIndex] !== null
  const correct   = question.correct
  const chosen    = st.userAnswers[st.currentQuestionIndex]
  const isDark    = document.documentElement.classList.contains('dark')

  container.innerHTML = `
    <div class="mb-6">
      <h3 class="text-xl font-semibold mb-4 math-container" style="color:var(--text-main)">
        <div class="math-content">${question.question}</div>
      </h3>
    </div>
    <div class="space-y-3">
      ${question.options.map((option, i) => {
        let border = '', bg = '', color = '', pe = ''
        if (answered) {
          pe = 'pointer-events:none;'
          if (i === correct) {
            border = 'border-color:#10b981;'
            bg     = `background-color:${isDark ? '#064e3b' : '#ecfdf5'};`
            color  = `color:${isDark ? '#a7f3d0' : '#064e3b'};`
          } else if (i === chosen && chosen !== correct) {
            border = 'border-color:#ef4444;'
            bg     = `background-color:${isDark ? '#450a0a' : '#fef2f2'};`
            color  = `color:${isDark ? '#fca5a5' : '#7f1d1d'};`
          }
        }
        return `<label class="option-label${chosen===i?' selected':''}" style="${border}${bg}${color}${pe}">
          <input type="radio" name="answer" value="${i}" class="mr-3 mt-1 flex-shrink-0"
            ${chosen===i?'checked':''} ${answered?'disabled':''} onchange="selectAnswer(${i})">
          <span class="option-text">${option}</span>
        </label>`
      }).join('')}
    </div>`

  document.getElementById('currentQuestion').textContent = st.currentQuestionIndex + 1
  document.getElementById('progressBar').style.width = ((st.currentQuestionIndex+1)/st.currentTest.length*100) + '%'
  document.getElementById('prevBtn').disabled = st.currentQuestionIndex === 0
  const isLast = st.currentQuestionIndex === st.currentTest.length - 1
  document.getElementById('nextBtn').style.display   = isLast ? 'none'         : 'inline-block'
  document.getElementById('finishBtn').style.display = isLast ? 'inline-block' : 'none'
  if (window.MathJax) MathJax.typesetPromise([container]).catch(console.error)
}

window.nextQuestion     = function() {
  if (st.currentQuestionIndex < st.currentTest.length - 1) { st.currentQuestionIndex++; displayQuestion() }
  else window.finishTest()
}
window.previousQuestion = function() {
  if (st.currentQuestionIndex > 0) { st.currentQuestionIndex--; displayQuestion() }
}
window.exitTest = function() {
  if (confirm('Выйти? Прогресс будет потерян.')) {
    clearTestState()
    st.currentTest = []; st.userAnswers = []; st.currentQuestionIndex = 0
    stopTimer()
    if (st.currentSection === 'duel') {
      if (window._duelOpponentTimeout) { clearTimeout(window._duelOpponentTimeout); window._duelOpponentTimeout = null }
      if (window._duelChannel) { window._duelChannel.unsubscribe(); window._duelChannel = null }
      window._duelMyScore = null; window._duelOpponentScore = null
    }
    window.showHome()
  }
}

// ── Завершение теста ──────────────────────────────────────
window.finishTest = async function() {
  if (window._finishInProgress) return
  window._finishInProgress = true
  const finishBtn = document.getElementById('finishBtn')
  if (finishBtn) { finishBtn.disabled = true; finishBtn.textContent = 'Сохраняем...' }
  stopTimer()

  let correct = 0
  const results = st.currentTest.map((q, i) => {
    const ok = st.userAnswers[i] === q.correct
    if (ok) correct++
    return {
      question: q.question,
      userAnswer: st.userAnswers[i] != null ? q.options[st.userAnswers[i]] : 'Не отвечено',
      correctAnswer: q.options[q.correct],
      isCorrect: ok
    }
  })
  const percentage = Math.round(correct / st.currentTest.length * 100)

  // ── Дуэль ──────────────────────────────────────────────
  if (st.currentSection === 'duel') {
    window._duelMyScore = percentage
    window._broadcastDuelScore?.(percentage)
    if (st.currentUser) {
      await saveResult({
        userId: st.currentUser.id,
        username: window._duelMyName,
        section: 'duel',
        difficulty: window._duelCode,
        score: percentage,
        correctAnswers: correct,
        totalQuestions: st.currentTest.length
      })
    }
    const xpGained = correct * (XP_TABLE[window._duelDiff] || 20)
    const newXP = addXP(xpGained)
    setTimeout(() => { showXPToast(xpGained, newXP); renderXPBadge() }, 700)
    window._finishInProgress = false
    clearTestState()
    showPage('resultsPage')
    playSound(percentage === 100 ? 'perfect' : 'finish')
    const scoreDisplay = document.getElementById('scoreDisplay')
    scoreDisplay.textContent = `${correct}/${st.currentTest.length}`
    scoreDisplay.className = percentage >= 70 ? 'text-6xl font-bold mb-4 text-green-600' : 'text-6xl font-bold mb-4 text-red-600'
    document.getElementById('scoreText').textContent = `Дуэль завершена — результат ${percentage}%`
    document.getElementById('detailedResults').innerHTML =
      `<p style="color:#94a3b8;text-align:center;padding:1rem">⏳ Ожидаем результата соперника…</p>`
    if (window._duelOpponentTimeout) clearTimeout(window._duelOpponentTimeout)
    const _duelWaitMs = Math.max((st.timeRemaining + 30) * 1000, 15000)
    window._duelOpponentTimeout = setTimeout(() => {
      if (window._duelOpponentScore === null) {
        window._duelOpponentScore = -1
        window._showDuelResults?.()
      }
    }, _duelWaitMs)
    window._checkDuelComplete?.()
    return
  }

  // ── Обычный тест ───────────────────────────────────────
  if (st.currentUser && !st.isStudyMode) {
    const username = st.currentUser.user_metadata?.username || st.currentUser.email.split('@')[0]
    await saveResult({
      userId: st.currentUser.id,
      username,
      section: st.currentSection,
      difficulty: st.currentDifficulty,
      score: percentage,
      correctAnswers: correct,
      totalQuestions: st.currentTest.length
    })
  }
  if (st.currentSection === 'daily') {
    localStorage.setItem('dailyChallengeDate', getDailyDate())
    localStorage.setItem('dailyChallengeScore', percentage)
  }
  if (!st.isStudyMode) {
    const ptsPerQ  = XP_TABLE[st.currentDifficulty] || 10
    let xpGained   = correct * ptsPerQ
    if (percentage === 100) xpGained += 25
    if (st.currentSection === 'daily') xpGained += 50
    const newXP = addXP(xpGained)
    setTimeout(() => { showXPToast(xpGained, newXP); renderXPBadge() }, 700)
  }

  window._finishInProgress = false
  if (!st.isStudyMode) clearTestState()
  st.isStudyMode = false
  showPage('resultsPage')
  if (percentage === 100) { setTimeout(launchConfetti, 400); playSound('perfect') }
  else playSound('finish')

  const scoreDisplay = document.getElementById('scoreDisplay')
  scoreDisplay.textContent = `${correct}/${st.currentTest.length}`
  scoreDisplay.className = percentage >= 70 ? 'text-6xl font-bold mb-4 text-green-600' : 'text-6xl font-bold mb-4 text-red-600'

  const username = st.currentUser?.user_metadata?.username || st.currentUser?.email?.split('@')[0] || 'Студент'
  const comments = { 100: '🏆 Феноменально! Все баллы!', 90: '🌟 Отлично!', 70: '✅ Хорошо! Можно ещё лучше.', 50: '📚 Неплохо, но есть над чем поработать.', 0: '💪 Не отчаивайся, попробуй ещё раз!' }
  const comment = Object.entries(comments).reverse().find(([k]) => percentage >= +k)?.[1] || comments[0]
  document.getElementById('scoreText').textContent = `${username}, ${comment}`

  const detailedResults = document.getElementById('detailedResults')
  detailedResults.innerHTML = `
    <h3 class="text-lg font-semibold mb-4" style="color:var(--text-main)">Детальные результаты:</h3>
    <div class="max-h-64 overflow-y-auto space-y-2">
      ${results.map((r, i) => `
        <div class="${r.isCorrect ? 'result-card-correct' : 'result-card-wrong'}">
          <div class="text-sm font-medium mb-1">Вопрос ${i+1}:</div>
          <div class="text-sm mb-1 math-content">${r.question}</div>
          <div class="text-xs">Ваш: ${r.userAnswer}<br>Правильный: ${r.correctAnswer}<br>${r.isCorrect?'✓ Правильно':'✗ Неправильно'}</div>
        </div>`).join('')}
    </div>`

  const shareBtn = document.getElementById('shareBtn')
  if (shareBtn) shareBtn.onclick = () => window.shareResult(correct, st.currentTest.length, percentage)
  if (window.MathJax) MathJax.typesetPromise([detailedResults]).catch(console.error)
  // Обновляем карточку ежедневного вызова если нужно
  window.updateDailyChallengeCard?.()
}

window.shareResult = function(correct, total, percentage) {
  const sectionNames = { integrals: 'Интегралы', derivatives: 'Производные', series: 'Ряды', limits: 'Пределы', ode: 'Дифф. уравнения', daily: 'Ежедневный вызов' }
  const section = sectionNames[st.currentSection] || st.currentSection
  const diff  = st.currentDifficulty==='easy'?'Лёгкий':st.currentDifficulty==='medium'?'Средний':'Сложный'
  const emoji = percentage===100?'🏆':percentage>=90?'🌟':percentage>=70?'✅':percentage>=50?'📚':'💪'
  const text  = `${emoji} Результат теста!\n\n📖 ${section} (${diff})\n📊 ${correct}/${total} — ${percentage}%\n\n🔗 https://suhrob4ikk.github.io/Calculus`
  const btn = document.getElementById('shareBtn')
  const orig = btn.textContent
  const onCopied = () => {
    btn.textContent = '✅ Скопировано!'; btn.style.backgroundColor = '#10b981'
    setTimeout(() => { btn.textContent = orig; btn.style.backgroundColor = '' }, 2500)
  }
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).then(onCopied).catch(() => fallbackCopy(text, onCopied))
  } else {
    fallbackCopy(text, onCopied)
  }
}
function fallbackCopy(text, cb) {
  const ta = document.createElement('textarea')
  ta.value = text; ta.style.cssText = 'position:fixed;opacity:0'
  document.body.appendChild(ta); ta.select()
  try { document.execCommand('copy'); cb() } catch(e) {}
  document.body.removeChild(ta)
}

// Keyboard shortcuts
document.addEventListener('keydown', e => {
  const testVisible = document.getElementById('testPage')?.style.display !== 'none'
  if (!testVisible) return
  if (['1','2','3','4'].includes(e.key)) {
    const idx = parseInt(e.key) - 1
    const labels = document.querySelectorAll('.option-label')
    if (labels[idx] && st.userAnswers[st.currentQuestionIndex] === null) window.selectAnswer(idx)
  }
  if (e.key === 'Enter') {
    const finish = document.getElementById('finishBtn')
    const next   = document.getElementById('nextBtn')
    if (finish?.style.display !== 'none') window.finishTest()
    else if (next?.style.display !== 'none') window.nextQuestion()
  }
  if (e.key === 'ArrowLeft') window.previousQuestion()
  if (e.key === 'Escape')    window.exitTest()
})
