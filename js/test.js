import { st } from './state.js'
import { showPage, playSound, XP_TABLE, addXP, showXPToast, launchConfetti } from './ui.js'
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
      st.testTimer = null   // Bug 6 fix: null out so stale interval can't fire again
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
  const m = Math.floor(st.timeRemaining / 60)
  const s = st.timeRemaining % 60
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
      testMode: st.testMode,
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
    st.currentSection = data.section
    st.currentDifficulty = data.difficulty
    st.currentQuestionIndex = data.currentQuestionIndex || 0
    st.userAnswers = data.userAnswers || []
    st.timeRemaining = data.timeRemaining || 25 * 60
    st.timerInitialTime = data.timeRemaining || 25 * 60
    st.currentTest = data.currentTest
    st.testMode = data.testMode || 'closed'
    st.testStartTime = Date.now()
    st.timerStartTime = null
    return true
  } catch (e) {
    console.error('restoreTestState failed:', e)
    localStorage.removeItem('testState')
    return false
  }
}

// Регистрируем как window callbacks для других модулей
window._startTimer = startTimer
window._stopTimer = stopTimer
window._displayQuestion = displayQuestion
window._clearTestState = clearTestState
window._restoreTestState = restoreTestState

// ── Запуск теста ──────────────────────────────────────────
export function startTest(section, difficulty, pool, countSelectId, sectionEl) {
  clearTestState()
  st.currentSection = section
  st.currentDifficulty = difficulty
  const countEl = document.getElementById(countSelectId)
  const questionCount = countEl ? parseInt(countEl.value) : 15
  const minutesMap = {
    easy: { 5: 25, 7: 30, 10: 35, 15: 40, 20: 50, 25: 60 },
    medium: { 5: 30, 7: 35, 10: 40, 15: 50, 20: 60, 25: 75 },
    hard: { 5: 35, 7: 40, 10: 50, 15: 60, 20: 75, 25: 90 },
  }
  const totalMinutes = (minutesMap[difficulty]?.[questionCount]) || (questionCount * 25 / 5)
  st.timeRemaining = totalMinutes * 60
  st.timerInitialTime = st.timeRemaining
  let questions = pool.flat().filter(q => q && q.question && q.options && q.options.length === 4 && q.options.every(o => o != null))
// Generate simple numeric open answers when in open mode
if (st.testMode === 'open') {
  questions = questions.map(q => {
    const correctIdx = q.correct !== undefined ? q.correct : q.answerIndex
    const correctOption = q.options && correctIdx !== undefined ? q.options[correctIdx] : null
    if (correctOption && /^-?\d+(\.\d+)?$/.test(correctOption.trim())) {
      q.open = [correctOption.trim()]
    }
    return q
  })
}
if (st.testMode === 'open') {
  questions = questions.filter(q => {
    if (!q.open || q.open.length === 0) return false
    // Оставляем только печатаемые ответы — без кириллицы (словесных ответов) и не слишком длинные
    const typeable = q.open.filter(a => !/[а-яёА-ЯЁ]/.test(String(a)) && String(a).trim().length <= 22)
    if (typeable.length === 0) return false
    q.open = typeable   // обновляем — только то, что можно набрать
    return true
  })
  if (questions.length === 0) {
    alert('Нет вопросов с открытым ответом для этого раздела/уровня. Попробуйте другой.')
    return
  }
}
if (questions.length === 0) {
    alert('Вопросы для этого раздела не найдены. Попробуйте другой уровень сложности.')
    return
  }
  const shuffled = [...questions].sort(() => Math.random() - 0.5).slice(0, Math.min(questionCount, questions.length))
  // Generate simple numeric open answers for open mode
  const processed = shuffled.map(q => {
    // Determine correct option text (may be stored in q.correct or q.answerIndex)
    const correctIdx = q.correct !== undefined ? q.correct : q.answerIndex
    const correctOption = q.options && correctIdx !== undefined ? q.options[correctIdx] : null
    if (st.testMode === 'open' && correctOption && /^-?\d+(\.\d+)?$/.test(correctOption.trim())) {
      q.open = [correctOption.trim()]
    }
    return q
  })
  st.currentTest = processed.map(q => {
    const order = [0, 1, 2, 3].sort(() => Math.random() - 0.5)
    return {
      ...q,
      options: order.map(i => q.options[i]),
      correct: order.indexOf(q.correct !== undefined ? q.correct : q.answerIndex)
    }
  })
  st.currentQuestionIndex = 0
  st.userAnswers = new Array(st.currentTest.length).fill(null)
  st.testStartTime = Date.now()
  document.getElementById(sectionEl).classList.add('hidden')
  showPage('testPage')
  document.getElementById('totalQuestions').textContent = st.currentTest.length
  const sectionName = { integrals: 'Интегралы', derivatives: 'Производные', series: 'Ряды', limits: 'Пределы', ode: 'Дифф. уравнения', probability: 'Вероятность' }[section] || section
  const diffName = difficulty === 'easy' ? 'Лёгкий' : difficulty === 'medium' ? 'Средний' : 'Сложный'
  const modeName = st.testMode === 'open' ? ' · Открытый' : ''
  document.getElementById('testTitle').textContent = `${st.isStudyMode ? 'Изучение' : 'Тест'}: ${sectionName}${modeName}`
  document.getElementById('difficultyLabel').textContent = `Уровень: ${diffName}${st.isStudyMode ? ' · Без таймера · Результат не сохраняется' : ''}`
  const timerEl = document.getElementById('timerDisplay')
  if (timerEl) timerEl.style.display = st.isStudyMode ? 'none' : ''
  if (!st.isStudyMode) startTimer()
  displayQuestion()
}

window.startIntegralsTest = function (d, study = false) {
  st.isStudyMode = study; st.testMode = 'closed'
  /* global easyIntegralsQuestions, mediumIntegralsQuestions, hardIntegralsQuestions */
  const pool = d === 'easy' ? easyIntegralsQuestions : d === 'medium' ? mediumIntegralsQuestions : hardIntegralsQuestions
  startTest('integrals', d, pool, 'integralsCount', 'integralsSection')
}
window.startLimitsTest = function (d, study = false) {
  st.isStudyMode = study
  const openBtn = document.getElementById('limitsOpenBtn')
  st.testMode = (openBtn && openBtn.classList.contains('active')) ? 'open' : 'closed'
  /* global easyLimitsQuestions, mediumLimitsQuestions, hardLimitsQuestions */
  const pool = d === 'easy' ? easyLimitsQuestions : d === 'medium' ? mediumLimitsQuestions : hardLimitsQuestions
  startTest('limits', d, pool, 'limitsCount', 'limitsSection')
}
window.startDerivativesTest = function (d, study = false) {
  st.isStudyMode = study
  const openBtn = document.getElementById('derivOpenBtn')
  st.testMode = (openBtn && openBtn.classList.contains('active')) ? 'open' : 'closed'
  /* global easyDerivativesQuestions, mediumDerivativesQuestions, hardDerivativesQuestions */
  /* global easyDerivativesOpenQuestions, mediumDerivativesOpenQuestions, hardDerivativesOpenQuestions */
  const pool = st.testMode === 'open'
    ? (d === 'easy' ? easyDerivativesOpenQuestions : d === 'medium' ? mediumDerivativesOpenQuestions : hardDerivativesOpenQuestions)
    : (d === 'easy' ? easyDerivativesQuestions : d === 'medium' ? mediumDerivativesQuestions : hardDerivativesQuestions)
  startTest('derivatives', d, pool, 'derivativesCount', 'derivativesSection')
}
window.startSeriesTest = function (d, study = false) {
  st.isStudyMode = study; st.testMode = 'closed'
  /* global easySeriesQuestions, mediumSeriesQuestions, hardSeriesQuestions */
  const pool = d === 'easy' ? easySeriesQuestions : d === 'medium' ? mediumSeriesQuestions : hardSeriesQuestions
  startTest('series', d, pool, 'seriesCount', 'seriesSection')
}
window.startODETest = function (d, study = false) {
  st.isStudyMode = study
  const openBtn = document.getElementById('odeOpenBtn')
  st.testMode = (openBtn && openBtn.classList.contains('active')) ? 'open' : 'closed'
  /* global easyODEQuestions, mediumODEQuestions, hardODEQuestions */
  const pool = d === 'easy' ? easyODEQuestions : d === 'medium' ? mediumODEQuestions : hardODEQuestions
  startTest('ode', d, pool, 'odeCount', 'odeSection')
}
window.startProbabilityTest = function (d, study = false) {
  st.isStudyMode = study
  const openBtn = document.getElementById('probOpenBtn')
  st.testMode = (openBtn && openBtn.classList.contains('active')) ? 'open' : 'closed'
  /* global easyProbabilityQuestions, mediumProbabilityQuestions, hardProbabilityQuestions */
  const pool = d === 'easy' ? easyProbabilityQuestions : d === 'medium' ? mediumProbabilityQuestions : hardProbabilityQuestions
  startTest('probability', d, pool, 'probabilityCount', 'probabilitySection')
}
window.restartTest = function () {
  if (st.currentSection === 'daily') { window.showHome(); return }
  if (st.currentSection === 'duel') { window.showDuelModal(); return }
  const fn = st.currentSection === 'ode' ? window.startODETest
    : st.currentSection === 'limits' ? window.startLimitsTest
      : st.currentSection === 'series' ? window.startSeriesTest
        : st.currentSection === 'derivatives' ? window.startDerivativesTest
          : st.currentSection === 'probability' ? window.startProbabilityTest
            : window.startIntegralsTest
  fn(st.currentDifficulty)
}

// ── Вопросы ───────────────────────────────────────────────
window.selectAnswer = function (answerIndex) {
  if (st.testMode === 'open') return
  if (st.userAnswers[st.currentQuestionIndex] !== null) return
  st.userAnswers[st.currentQuestionIndex] = answerIndex
  const correct = st.currentTest[st.currentQuestionIndex].correct
  playSound(answerIndex === correct ? 'correct' : 'wrong')
  document.querySelectorAll('.option-label').forEach((label, i) => {
    const radio = label.querySelector('input[type="radio"]')
    if (radio) radio.disabled = true
    if (i === correct) {
      label.classList.add('answered-correct')
    } else if (i === answerIndex && answerIndex !== correct) {
      label.classList.add('answered-wrong')
    } else {
      label.classList.add('answered-locked')
    }
  })
}

// ── Открытый ответ ────────────────────────────────────────
function normalizeAnswer(s) {
  return String(s).trim().toLowerCase()
    .replace(/\s+/g, '')
    .replace(/,/g, '.')
}
function checkOpenCorrect(userInput, openAnswers) {
  if (!openAnswers || openAnswers.length === 0) return false
  const norm = normalizeAnswer(userInput)
  return openAnswers.some(a => normalizeAnswer(a) === norm)
}

window.submitOpenAnswer = function () {
  if (st.testMode !== 'open') return
  if (st.userAnswers[st.currentQuestionIndex] !== null) return
  const input = document.getElementById('openAnswerInput')
  if (!input) return
  const val = input.value.trim()
  if (!val) return
  const q = st.currentTest[st.currentQuestionIndex]
  const isCorrect = checkOpenCorrect(val, q.open || [])
  st.userAnswers[st.currentQuestionIndex] = val
  playSound(isCorrect ? 'correct' : 'wrong')
  displayQuestion()
}

window.setDerivativesTestMode = function (mode) {
  st.testMode = mode
  document.querySelectorAll('#derivativesSection .test-type-btn').forEach(btn => btn.classList.remove('active'))
  const activeId = mode === 'open' ? 'derivOpenBtn' : 'derivClosedBtn'
  const btn = document.getElementById(activeId)
  if (btn) btn.classList.add('active')
}

window.setLimitsTestMode = function (mode) {
  st.testMode = mode
  document.querySelectorAll('#limitsSection .test-type-btn').forEach(btn => btn.classList.remove('active'))
  const activeId = mode === 'open' ? 'limitsOpenBtn' : 'limitsClosedBtn'
  const btn = document.getElementById(activeId)
  if (btn) btn.classList.add('active')
}

window.setODETestMode = function (mode) {
  st.testMode = mode
  document.querySelectorAll('#odeSection .test-type-btn').forEach(btn => btn.classList.remove('active'))
  const activeId = mode === 'open' ? 'odeOpenBtn' : 'odeClosedBtn'
  const btn = document.getElementById(activeId)
  if (btn) btn.classList.add('active')
}

window.setProbTestMode = function (mode) {
  st.testMode = mode
  document.querySelectorAll('#probabilitySection .test-type-btn').forEach(btn => btn.classList.remove('active'))
  const activeId = mode === 'open' ? 'probOpenBtn' : 'probClosedBtn'
  const btn = document.getElementById(activeId)
  if (btn) btn.classList.add('active')
}

export function displayQuestion() {
  const question = st.currentTest[st.currentQuestionIndex]
  const container = document.getElementById('questionContainer')
  const answered = st.userAnswers[st.currentQuestionIndex] !== null

  const questionHeader = `
    <div class="mb-6">
      <h3 class="text-xl font-semibold mb-4 math-container" style="color:var(--text-main)">
        <div class="math-content">${question.question}</div>
      </h3>
    </div>`

  if (st.testMode === 'open') {
    // ── Открытый режим ─────────────────────────────────────
    const userVal = answered ? (st.userAnswers[st.currentQuestionIndex] || '') : ''
    let openResult = ''
    if (answered) {
      const isCorrect = checkOpenCorrect(userVal, question.open || [])
      if (isCorrect) {
        openResult = `<div class="open-answer-result open-correct">✓ Правильно!</div>`
      } else {
        const correctAns = question.open ? question.open[0] : '?'
        openResult = `<div class="open-answer-result open-wrong">✗ Неправильно. Правильный ответ: <strong>${correctAns}</strong></div>`
      }
    }
    container.innerHTML = questionHeader + `
      <div class="open-answer-wrap">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
          <button onclick="(function(btn){var h=btn.parentElement.nextElementSibling;var open=h.style.display!=='none';h.style.display=open?'none':'block';btn.querySelector('.hint-arrow').textContent=open?'▼':'▲'})(this)"
            style="font-size:0.76rem;background:transparent;border:1.5px solid var(--text-muted);color:var(--text-muted);padding:2px 10px;border-radius:20px;cursor:pointer;font-family:inherit;display:flex;align-items:center;gap:4px;transition:border-color 0.2s,color 0.2s"
            onmouseover="this.style.borderColor='#38bdf8';this.style.color='#38bdf8'"
            onmouseout="this.style.borderColor='var(--text-muted)';this.style.color='var(--text-muted)'">
            💡 Формат <span class="hint-arrow">▼</span>
          </button>
        </div>
        <div class="open-answer-hint" style="display:none">
          целые: <code>3</code> <code>-2</code> &nbsp;·&nbsp;
          дроби: <code>1/2</code> <code>-3/4</code> &nbsp;·&nbsp;
          дес.: <code>0.5</code> <code>-1.25</code> &nbsp;·&nbsp;
          корни: <code>sqrt(2)</code> <code>sqrt(3)/2</code> &nbsp;·&nbsp;
          конст.: <code>pi</code> <code>e</code> &nbsp;·&nbsp;
          лог.: <code>ln(2)</code> <code>ln2</code> &nbsp;·&nbsp;
          степени: <code>e^2</code> <code>pi/4</code> <code>1/e</code> &nbsp;·&nbsp;
          смешан.: <code>-pi/2</code> <code>1/sqrt(2)</code> <code>3*pi</code>
        </div>
        <input type="text" id="openAnswerInput" class="open-answer-input"
          placeholder="Введите ответ..."
          value="${answered ? userVal.replace(/"/g, '&quot;') : ''}"
          ${answered ? 'disabled' : ''}
          onkeydown="if(event.key==='Enter'&&!this.disabled){event.stopPropagation();window.submitOpenAnswer()}">
        <button onclick="window.submitOpenAnswer()" class="open-answer-btn" ${answered ? 'disabled' : ''}>
          Ответить
        </button>
        ${openResult}
      </div>`
    if (!answered) {
      setTimeout(() => { const inp = document.getElementById('openAnswerInput'); if (inp) inp.focus() }, 50)
    }
  } else {
    // ── Закрытый режим (radio buttons) ─────────────────────
    const correct = question.correct
    const chosen = st.userAnswers[st.currentQuestionIndex]
    container.innerHTML = questionHeader + `
      <div class="space-y-3">
        ${question.options.map((option, i) => {
      let labelClass = 'option-label'
      if (answered) {
        if (i === correct) labelClass += ' answered-correct'
        else if (i === chosen && chosen !== correct) labelClass += ' answered-wrong'
        else labelClass += ' answered-locked'
      } else if (chosen === i) {
        labelClass += ' selected'
      }
      return `<label class="${labelClass}">
            <input type="radio" name="answer" value="${i}" class="mr-3 mt-1 flex-shrink-0"
              ${chosen === i ? 'checked' : ''} ${answered ? 'disabled' : ''} onchange="selectAnswer(${i})">
            <span class="option-text">${option}</span>
          </label>`
    }).join('')}
      </div>`
  }

  document.getElementById('currentQuestion').textContent = st.currentQuestionIndex + 1
  document.getElementById('progressBar').style.width = ((st.currentQuestionIndex + 1) / st.currentTest.length * 100) + '%'
  document.getElementById('prevBtn').disabled = st.currentQuestionIndex === 0
  const isLast = st.currentQuestionIndex === st.currentTest.length - 1
  document.getElementById('nextBtn').style.display = isLast ? 'none' : 'inline-block'
  document.getElementById('finishBtn').style.display = isLast ? 'inline-block' : 'none'
  if (window.MathJax) MathJax.typesetPromise([container]).catch(console.error)
}

// Автосохранение открытого ответа при навигации (без клика «Ответить»)
function autoSaveOpenAnswer() {
  if (st.testMode !== 'open') return
  if (st.userAnswers[st.currentQuestionIndex] !== null) return // уже сохранён
  const input = document.getElementById('openAnswerInput')
  if (!input || !input.value.trim()) return // поле пустое
  st.userAnswers[st.currentQuestionIndex] = input.value.trim()
}

window.nextQuestion = function () {
  autoSaveOpenAnswer()
  if (st.currentQuestionIndex < st.currentTest.length - 1) { st.currentQuestionIndex++; displayQuestion() }
  else window.finishTest()
}
window.previousQuestion = function () {
  autoSaveOpenAnswer()
  if (st.currentQuestionIndex > 0) { st.currentQuestionIndex--; displayQuestion() }
}
window.exitTest = async function () {
  // Ежедневка: выход = сохранение результата, продолжить нельзя
  if (st.currentSection === 'daily') {
    const answered = st.userAnswers.filter(a => a !== null).length
    if (answered === 0) {
      if (confirm('Выйти из ежедневного вызова? Попытка будет засчитана как 0%.')) {
        _saveDailyAndExit(0, 0)
      }
      return
    }
    const correct = st.userAnswers.reduce((sum, ans, i) => {
      if (ans === null) return sum
      const q = st.currentTest[i]
      return sum + (ans === (q.correct !== undefined ? q.correct : q.answerIndex) ? 1 : 0)
    }, 0)
    const percentage = Math.round(correct / st.currentTest.length * 100)
    if (confirm(`Выйти? Результат будет сохранён: ${correct}/${st.currentTest.length} (${percentage}%). Переиграть нельзя.`)) {
      _saveDailyAndExit(correct, percentage)
    }
    return
  }

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

async function _saveDailyAndExit(correct, percentage) {
  stopTimer()
  clearTestState()
  const uid = st.currentUser?.id || 'guest'
  localStorage.setItem(`dailyChallengeDate_${uid}`, getDailyDate())
  localStorage.setItem(`dailyChallengeScore_${uid}`, percentage)
  if (st.currentUser) {
    const username = st.currentUser.user_metadata?.username || st.currentUser.email.split('@')[0]
    try {
      await saveResult({
        userId: st.currentUser.id,
        username,
        section: 'daily',
        difficulty: 'medium',
        score: percentage,
        correctAnswers: correct,
        totalQuestions: st.currentTest.length
      })
    } catch (e) { console.warn('daily saveResult failed:', e) }
  }
  st.currentTest = []; st.userAnswers = []; st.currentQuestionIndex = 0
  window.showHome()
  window.updateDailyChallengeCard?.()
}

// ── Завершение теста ──────────────────────────────────────
window.finishTest = async function () {
  if (window._finishInProgress) return
  autoSaveOpenAnswer()  // сохранить ответ на текущий вопрос если не был отправлен
  window._finishInProgress = true
  const finishBtn = document.getElementById('finishBtn')
  if (finishBtn) { finishBtn.disabled = true; finishBtn.textContent = 'Сохраняем...' }
  stopTimer()

  let correct = 0
  const results = st.currentTest.map((q, i) => {
    let ok
    if (st.testMode === 'open') {
      ok = st.userAnswers[i] !== null && checkOpenCorrect(st.userAnswers[i], q.open || [])
    } else {
      ok = st.userAnswers[i] === q.correct
    }
    if (ok) correct++
    const userAnswer = st.userAnswers[i] != null
      ? (st.testMode === 'open' ? st.userAnswers[i] : q.options[st.userAnswers[i]])
      : 'Не отвечено'
    const correctAnswer = st.testMode === 'open'
      ? (q.open ? q.open[0] : q.options[q.correct])
      : q.options[q.correct]
    return { question: q.question, userAnswer, correctAnswer, isCorrect: ok }
  })
  const percentage = Math.round(correct / st.currentTest.length * 100)

  // ── Дуэль ──────────────────────────────────────────────
  if (st.currentSection === 'duel') {
    // Set phase to finished so no late event can restart the test
    if (window._duelPhase !== undefined) window._duelPhase = 'finished'
    window._duelMyScore = percentage
    window._broadcastDuelScore?.(percentage)
    if (st.currentUser) {
      try {
        await saveResult({
          userId: st.currentUser.id,
          username: window._duelMyName,
          section: 'duel',
          difficulty: window._duelCode,
          score: percentage,
          correctAnswers: correct,
          totalQuestions: st.currentTest.length
        })
      } catch (e) {
        console.warn('Duel saveResult failed:', e)
      }
    }
    const xpGained = correct * (XP_TABLE[window._duelDiff] || 20)
    const newXP = addXP(xpGained)
    setTimeout(() => { showXPToast(xpGained, newXP) }, 700)
    clearTestState()
    showPage('resultsPage')
    playSound(percentage === 100 ? 'perfect' : 'finish')
    const scoreDisplay = document.getElementById('scoreDisplay')
    scoreDisplay.textContent = `${correct}/${st.currentTest.length}`
    scoreDisplay.className = percentage >= 70 ? 'text-6xl font-bold mb-4 text-green-600' : 'text-6xl font-bold mb-4 text-red-600'
    document.getElementById('scoreText').textContent = `Дуэль завершена — результат ${percentage}%`
    document.getElementById('detailedResults').innerHTML =
      `<p style="color:#94a3b8;text-align:center;padding:1rem">Ожидаем результата соперника…</p>`
    // Cancel any existing opponent timeout before setting a new one
    if (window._duelOpponentTimeout) { clearTimeout(window._duelOpponentTimeout); window._duelOpponentTimeout = null }
    const _duelWaitMs = Math.max((st.timeRemaining + 30) * 1000, 15000)
    window._duelOpponentTimeout = setTimeout(() => {
      if (window._duelOpponentScore === null) {
        window._duelOpponentScore = -1
        window._showDuelResults?.()
      }
    }, _duelWaitMs)
    window._finishInProgress = false   // Bug 5 fix: reset only after all sync work
    window._checkDuelComplete?.()
    return
  }

  // ── Обычный тест ───────────────────────────────────────
  if (st.currentUser && !st.isStudyMode) {
    const username = st.currentUser.user_metadata?.username || st.currentUser.email.split('@')[0]
    try {
      await saveResult({
        userId: st.currentUser.id,
        username,
        section: st.currentSection,
        difficulty: st.currentDifficulty,
        score: percentage,
        correctAnswers: correct,
        totalQuestions: st.currentTest.length
      })
    } catch (e) {
      console.warn('saveResult failed:', e)
    }
  }
  if (st.currentSection === 'daily') {
    const uid = st.currentUser?.id || 'guest'
    localStorage.setItem(`dailyChallengeDate_${uid}`, getDailyDate())
    localStorage.setItem(`dailyChallengeScore_${uid}`, percentage)
  }
  if (!st.isStudyMode) {
    const ptsPerQ = XP_TABLE[st.currentDifficulty] || 10
    let xpGained = correct * ptsPerQ
    if (percentage === 100) xpGained += 25
    if (st.currentSection === 'daily') xpGained += 50
    const newXP = addXP(xpGained)
    setTimeout(() => { showXPToast(xpGained, newXP) }, 700)
  }

  window._finishInProgress = false
  if (!st.isStudyMode) clearTestState()
  st.isStudyMode = false
  // testMode is NOT reset here so restartTest preserves the mode
  showPage('resultsPage')
  if (percentage === 100) { setTimeout(launchConfetti, 400); playSound('perfect') }
  else playSound('finish')

  const scoreDisplay = document.getElementById('scoreDisplay')
  scoreDisplay.textContent = `${correct}/${st.currentTest.length}`
  scoreDisplay.className = percentage >= 70 ? 'text-6xl font-bold mb-4 text-green-600' : 'text-6xl font-bold mb-4 text-red-600'

  const username = st.currentUser?.user_metadata?.username || st.currentUser?.email?.split('@')[0] || 'Студент'
  const comments = { 100: 'Феноменально! Все баллы!', 90: 'Отлично!', 70: 'Хорошо! Можно ещё лучше.', 50: 'Неплохо, но есть над чем поработать.', 0: 'Не отчаивайся, попробуй ещё раз!' }
  const comment = Object.entries(comments).reverse().find(([k]) => percentage >= +k)?.[1] || comments[0]
  document.getElementById('scoreText').textContent = `${username}, ${comment}`

  const detailedResults = document.getElementById('detailedResults')
  detailedResults.innerHTML = `
    <h3 class="text-lg font-semibold mb-4" style="color:var(--text-main)">Детальные результаты:</h3>
    <div class="max-h-64 overflow-y-auto space-y-2">
      ${results.map((r, i) => `
        <div class="${r.isCorrect ? 'result-card-correct' : 'result-card-wrong'}">
          <div class="text-sm font-medium mb-1">Вопрос ${i + 1}:</div>
          <div class="text-sm mb-1 math-content">${r.question}</div>
          <div class="text-xs">Ваш: ${r.userAnswer}<br>Правильный: ${r.correctAnswer}<br>${r.isCorrect ? '✓ Правильно' : '✗ Неправильно'}</div>
        </div>`).join('')}
    </div>`

  const shareBtn = document.getElementById('shareBtn')
  if (shareBtn) shareBtn.onclick = () => window.shareResult(correct, st.currentTest.length, percentage)
  if (window.MathJax) MathJax.typesetPromise([detailedResults]).catch(console.error)
  // Обновляем карточку ежедневного вызова если нужно
  window.updateDailyChallengeCard?.()
}

window.shareResult = function (correct, total, percentage) {
  const sectionNames = { integrals: 'Интегралы', derivatives: 'Производные', series: 'Ряды', limits: 'Пределы', ode: 'Дифф. уравнения', daily: 'Ежедневный вызов' }
  const section = sectionNames[st.currentSection] || st.currentSection
  const diff = st.currentDifficulty === 'easy' ? 'Лёгкий' : st.currentDifficulty === 'medium' ? 'Средний' : 'Сложный'
  const emoji = percentage === 100 ? '🏆' : percentage >= 90 ? '🌟' : percentage >= 70 ? '✅' : percentage >= 50 ? '📚' : '💪'
  const text = `${emoji} Результат теста!\n\n📖 ${section} (${diff})\n📊 ${correct}/${total} — ${percentage}%\n\n🔗 https://suhrob4ikk.github.io/Calculus`
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
  try { document.execCommand('copy'); cb() } catch (e) { }
  document.body.removeChild(ta)
}

// Keyboard shortcuts
document.addEventListener('keydown', e => {
  const testVisible = document.getElementById('testPage')?.style.display !== 'none'
  if (!testVisible) return
  if (st.testMode !== 'open' && ['1', '2', '3', '4'].includes(e.key)) {
    const idx = parseInt(e.key) - 1
    const labels = document.querySelectorAll('.option-label')
    if (labels[idx] && st.userAnswers[st.currentQuestionIndex] === null) window.selectAnswer(idx)
  }
  if (e.key === 'Enter') {
    if (st.testMode === 'open') {
      // Input's own onkeydown with stopPropagation handles submission — nothing here
    } else {
      const finish = document.getElementById('finishBtn')
      const next = document.getElementById('nextBtn')
      if (finish?.style.display !== 'none') window.finishTest()
      else if (next?.style.display !== 'none') window.nextQuestion()
    }
  }
  if (e.key === 'ArrowLeft') window.previousQuestion()
  if (e.key === 'Escape') window.exitTest()
})
