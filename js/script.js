import { supabase, signUp, signIn, signOut, getUser, saveResult, getUserResults, getLeaderboard } from './supabase.js'

// ── Глобальные переменные ─────────────────────────────────
let testTimer, timeRemaining = 25 * 60
let currentTest = [], currentQuestionIndex = 0
let userAnswers = [], testStartTime
let currentDifficulty = '', currentSection = ''
let currentUser = null

// ── Инициализация ─────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  // Применяем тему
  const saved = localStorage.getItem('theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  if (saved === 'dark' || (!saved && prefersDark)) {
    document.documentElement.classList.add('dark')
    const btn = document.getElementById('themeToggle')
    if (btn) btn.textContent = '☀️'
  }

  // Проверяем авторизацию
  currentUser = await getUser()
  if (currentUser) {
    showPage('homePage')
    updateUserUI()
  } else {
    showPage('authPage')
  }
})

// ── Навигация между страницами ────────────────────────────
function showPage(pageId) {
  const pages = ['authPage','homePage','integralsSection','derivativesSection',
                 'seriesSection','testPage','resultsPage','statisticsPage','leaderboardPage']
  pages.forEach(p => {
    const el = document.getElementById(p)
    if (el) el.classList.add('hidden')
  })
  const target = document.getElementById(pageId)
  if (target) target.classList.remove('hidden')
}

function updateUserUI() {
  const el = document.getElementById('userGreeting')
  if (el && currentUser) {
    const username = currentUser.user_metadata?.username || currentUser.email.split('@')[0]
    el.textContent = `👤 ${username}`
  }
}

// ── Авторизация ───────────────────────────────────────────
window.showAuthTab = function(tab) {
  document.getElementById('loginForm').classList.toggle('hidden', tab !== 'login')
  document.getElementById('registerForm').classList.toggle('hidden', tab !== 'register')
  document.getElementById('tabLogin').classList.toggle('font-bold', tab === 'login')
  document.getElementById('tabRegister').classList.toggle('font-bold', tab === 'register')
}

window.handleLogin = async function() {
  const email = document.getElementById('loginEmail').value.trim()
  const password = document.getElementById('loginPassword').value
  const errEl = document.getElementById('loginError')
  errEl.textContent = ''

  if (!email || !password) { errEl.textContent = 'Заполните все поля'; return }

  const btn = document.getElementById('loginBtn')
  btn.textContent = 'Входим...'
  btn.disabled = true

  const { data, error } = await signIn(email, password)
  btn.textContent = 'Войти'
  btn.disabled = false

  if (error) { errEl.textContent = 'Неверный email или пароль'; return }

  currentUser = data.user
  updateUserUI()
  showPage('homePage')
}

window.handleRegister = async function() {
  const username = document.getElementById('regUsername').value.trim()
  const email    = document.getElementById('regEmail').value.trim()
  const password = document.getElementById('regPassword').value
  const errEl    = document.getElementById('registerError')
  errEl.textContent = ''

  if (!username || !email || !password) { errEl.textContent = 'Заполните все поля'; return }
  if (password.length < 6) { errEl.textContent = 'Пароль минимум 6 символов'; return }

  const btn = document.getElementById('registerBtn')
  btn.textContent = 'Регистрируем...'
  btn.disabled = true

  const { data, error } = await signUp(email, password, username)
  btn.textContent = 'Зарегистрироваться'
  btn.disabled = false

  if (error) { errEl.textContent = error.message; return }

  errEl.style.color = '#10b981'
  errEl.textContent = '✅ Проверьте почту для подтверждения!'
}

window.handleLogout = async function() {
  await signOut()
  currentUser = null
  showPage('authPage')
}

// ── Главная и разделы ─────────────────────────────────────
window.showHome = function() {
  stopTimer()
  showPage('homePage')
}

window.showSection = function(section) {
  currentSection = section
  const map = { integrals: 'integralsSection', derivatives: 'derivativesSection', series: 'seriesSection' }
  showPage(map[section])
}

// ── Таймер ────────────────────────────────────────────────
function startTimer() {
  updateTimerDisplay()
  if (testTimer) clearInterval(testTimer)
  testTimer = setInterval(() => {
    timeRemaining--
    updateTimerDisplay()
    if (timeRemaining <= 0) { clearInterval(testTimer); alert('Время вышло!'); finishTest() }
  }, 1000)
}

function updateTimerDisplay() {
  const m = Math.floor(timeRemaining / 60)
  const s = timeRemaining % 60
  const el = document.getElementById('timerDisplay')
  if (!el) return
  el.textContent = `⏱️ ${m}:${s.toString().padStart(2, '0')}`
  el.className = timeRemaining <= 300
    ? 'text-lg font-semibold text-red-600 bg-red-50 px-4 py-2 rounded-lg animate-pulse'
    : timeRemaining <= 600
      ? 'text-lg font-semibold text-orange-600 bg-orange-50 px-4 py-2 rounded-lg'
      : 'text-lg font-semibold text-green-600 bg-green-50 px-4 py-2 rounded-lg'
}

function stopTimer() {
  if (testTimer) { clearInterval(testTimer); testTimer = null }
}

// ── Запуск теста ──────────────────────────────────────────
function startTest(section, difficulty, pool, timeSelectId, sectionEl) {
  currentSection = section
  currentDifficulty = difficulty
  const t = parseInt(document.getElementById(timeSelectId).value) * 60
  timeRemaining = t

  let questions = pool.flat().filter(q => q && q.options && q.options.every(o => o != null))
  currentTest = [...questions].sort(() => 0.5 - Math.random()).slice(0, Math.min(20, questions.length))
  currentQuestionIndex = 0
  userAnswers = new Array(currentTest.length).fill(null)
  testStartTime = Date.now()

  document.getElementById(sectionEl).classList.add('hidden')
  showPage('testPage')
  document.getElementById('totalQuestions').textContent = currentTest.length
  document.getElementById('testTitle').textContent = `Тест: ${section === 'integrals' ? 'Интегралы' : section === 'derivatives' ? 'Производные' : 'Ряды'}`
  document.getElementById('difficultyLabel').textContent = `Уровень: ${difficulty === 'easy' ? 'Лёгкий' : difficulty === 'medium' ? 'Средний' : 'Сложный'}`

  startTimer()
  displayQuestion()
}

window.startIntegralsTest   = (d) => startTest('integrals',   d, easyIntegralsQuestions.concat(d==='easy'?[]:[]).concat(d==='medium'?mediumIntegralsQuestions:[]).concat(d==='hard'?hardIntegralsQuestions:[]) || (d==='easy'?easyIntegralsQuestions:d==='medium'?mediumIntegralsQuestions:hardIntegralsQuestions), 'integralsTime', 'integralsSection')
window.startDerivativesTest = (d) => startTest('derivatives', d, d==='easy'?easyDerivativesQuestions:d==='medium'?mediumDerivativesQuestions:hardDerivativesQuestions, 'derivativesTime', 'derivativesSection')
window.startSeriesTest      = (d) => startTest('series',      d, d==='easy'?easySeriesQuestions:d==='medium'?mediumSeriesQuestions:hardSeriesQuestions, 'seriesTime', 'seriesSection')

window.startIntegralsTest = function(d) {
  const pool = d==='easy' ? easyIntegralsQuestions : d==='medium' ? mediumIntegralsQuestions : hardIntegralsQuestions
  startTest('integrals', d, pool, 'integralsTime', 'integralsSection')
}
window.startDerivativesTest = function(d) {
  const pool = d==='easy' ? easyDerivativesQuestions : d==='medium' ? mediumDerivativesQuestions : hardDerivativesQuestions
  startTest('derivatives', d, pool, 'derivativesTime', 'derivativesSection')
}
window.startSeriesTest = function(d) {
  const pool = d==='easy' ? easySeriesQuestions : d==='medium' ? mediumSeriesQuestions : hardSeriesQuestions
  startTest('series', d, pool, 'seriesTime', 'seriesSection')
}

window.restartTest = function() {
  window[`start${currentSection.charAt(0).toUpperCase()+currentSection.slice(1)}Test`](currentDifficulty)
}

// ── Вопросы ───────────────────────────────────────────────
window.selectAnswer = function(answerIndex) {
  if (userAnswers[currentQuestionIndex] !== null) return
  userAnswers[currentQuestionIndex] = answerIndex
  const correct = currentTest[currentQuestionIndex].correct
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

function displayQuestion() {
  const question = currentTest[currentQuestionIndex]
  const container = document.getElementById('questionContainer')
  const answered = userAnswers[currentQuestionIndex] !== null
  const correct = question.correct
  const chosen = userAnswers[currentQuestionIndex]
  const isDark = document.documentElement.classList.contains('dark')

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
            bg = `background-color:${isDark ? '#064e3b' : '#ecfdf5'};`
            color = `color:${isDark ? '#a7f3d0' : '#064e3b'};`
          } else if (i === chosen && chosen !== correct) {
            border = 'border-color:#ef4444;'
            bg = `background-color:${isDark ? '#450a0a' : '#fef2f2'};`
            color = `color:${isDark ? '#fca5a5' : '#7f1d1d'};`
          }
        }
        return `<label class="option-label${chosen===i?' selected':''}" style="${border}${bg}${color}${pe}">
          <input type="radio" name="answer" value="${i}" class="mr-3 mt-1 flex-shrink-0"
            ${chosen===i?'checked':''} ${answered?'disabled':''} onchange="selectAnswer(${i})">
          <span class="option-text">${option}</span>
        </label>`
      }).join('')}
    </div>`

  document.getElementById('currentQuestion').textContent = currentQuestionIndex + 1
  document.getElementById('progressBar').style.width = ((currentQuestionIndex+1)/currentTest.length*100) + '%'
  document.getElementById('prevBtn').disabled = currentQuestionIndex === 0

  const isLast = currentQuestionIndex === currentTest.length - 1
  document.getElementById('nextBtn').style.display = isLast ? 'none' : 'inline-block'
  document.getElementById('finishBtn').style.display = isLast ? 'inline-block' : 'none'

  if (window.MathJax) MathJax.typesetPromise([container]).catch(console.error)
}

window.nextQuestion = function() {
  if (currentQuestionIndex < currentTest.length - 1) { currentQuestionIndex++; displayQuestion() }
  else finishTest()
}
window.previousQuestion = function() {
  if (currentQuestionIndex > 0) { currentQuestionIndex--; displayQuestion() }
}
window.exitTest = function() {
  if (confirm('Выйти? Прогресс будет потерян.')) showHome()
}

// ── Завершение теста ──────────────────────────────────────
window.finishTest = async function() {
  stopTimer()
  let correct = 0
  const results = currentTest.map((q, i) => {
    const ok = userAnswers[i] === q.correct
    if (ok) correct++
    return { question: q.question, userAnswer: userAnswers[i]!=null?q.options[userAnswers[i]]:'Не отвечено', correctAnswer: q.options[q.correct], isCorrect: ok }
  })
  const percentage = Math.round(correct / currentTest.length * 100)

  // Сохраняем в Supabase
  if (currentUser) {
    const username = currentUser.user_metadata?.username || currentUser.email.split('@')[0]
    await saveResult({
      userId: currentUser.id,
      username,
      section: currentSection,
      difficulty: currentDifficulty,
      score: percentage,
      correctAnswers: correct,
      totalQuestions: currentTest.length
    })
  }

  showPage('resultsPage')

  const scoreDisplay = document.getElementById('scoreDisplay')
  scoreDisplay.textContent = `${correct}/${currentTest.length}`
  scoreDisplay.className = percentage >= 70 ? 'text-6xl font-bold mb-4 text-green-600' : 'text-6xl font-bold mb-4 text-red-600'

  const username = currentUser?.user_metadata?.username || currentUser?.email?.split('@')[0] || 'Студент'
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
  if (shareBtn) shareBtn.onclick = () => shareResult(correct, currentTest.length, percentage)

  if (window.MathJax) MathJax.typesetPromise([detailedResults]).catch(console.error)
}

window.shareResult = function(correct, total, percentage) {
  const section = currentSection==='integrals'?'Интегралы':currentSection==='derivatives'?'Производные':'Ряды'
  const diff = currentDifficulty==='easy'?'Лёгкий':currentDifficulty==='medium'?'Средний':'Сложный'
  const emoji = percentage===100?'🏆':percentage>=90?'🌟':percentage>=70?'✅':percentage>=50?'📚':'💪'
  const text = `${emoji} Результат теста!\n\n📖 ${section} (${diff})\n📊 ${correct}/${total} — ${percentage}%\n\n🔗 https://suhrob4ikk.github.io/Calculus`
  navigator.clipboard?.writeText(text).then(() => {
    const btn = document.getElementById('shareBtn')
    const orig = btn.textContent
    btn.textContent = '✅ Скопировано!'
    btn.style.backgroundColor = '#10b981'
    setTimeout(() => { btn.textContent = orig; btn.style.backgroundColor = '' }, 2500)
  })
}

// ── Статистика ────────────────────────────────────────────
window.showStatistics = async function() {
  showPage('statisticsPage')
  if (!currentUser) return

  const { data } = await getUserResults(currentUser.id)
  if (!data || data.length === 0) {
    document.getElementById('testsHistory').innerHTML = '<p class="text-gray-500 text-center py-4">История пуста</p>'
    return
  }

  const total = data.length
  const best = Math.max(...data.map(r => r.score))
  const avg = Math.round(data.reduce((s,r) => s+r.score, 0) / total)

  document.getElementById('totalTests').textContent = total
  document.getElementById('bestScore').textContent = best + '%'
  document.getElementById('averageScore').textContent = avg + '%'

  // Прогресс по разделам
  const sections = ['integrals','derivatives','series']
  sections.forEach(sec => {
    const secResults = data.filter(r => r.section === sec)
    const secAvg = secResults.length ? Math.round(secResults.reduce((s,r)=>s+r.score,0)/secResults.length) : 0
    const nameMap = {integrals:'integrals',derivatives:'derivatives',series:'series'}
    const el = document.getElementById(`${nameMap[sec]}Progress`)
    const bar = document.getElementById(`${nameMap[sec]}ProgressBar`)
    if (el) el.textContent = secAvg + '%'
    if (bar) bar.style.width = secAvg + '%'
  })

  document.getElementById('testsHistory').innerHTML = data.slice(0,10).map(r => `
    <div class="bg-gray-50 rounded-lg p-4">
      <div class="flex justify-between items-start">
        <div>
          <h4 class="font-semibold">${r.section==='integrals'?'Интегралы':r.section==='derivatives'?'Производные':'Ряды'} — ${r.difficulty==='easy'?'Лёгкий':r.difficulty==='medium'?'Средний':'Сложный'}</h4>
          <p class="text-sm text-gray-500">${new Date(r.created_at).toLocaleString('ru')}</p>
        </div>
        <div class="text-right">
          <span class="font-bold ${r.score>=70?'text-green-600':r.score>=50?'text-yellow-600':'text-red-600'}">${r.score}%</span>
          <p class="text-sm text-gray-500">${r.correct_answers}/${r.total_questions}</p>
        </div>
      </div>
    </div>`).join('')
}

window.resetStatistics = function() {
  alert('Для сброса статистики обратитесь к администратору.')
}

// ── Таблица лидеров ───────────────────────────────────────
window.showLeaderboard = async function() {
  showPage('leaderboardPage')

  const section = document.getElementById('lbSection')?.value || null
  const difficulty = document.getElementById('lbDifficulty')?.value || null

  const { data } = await getLeaderboard(section, difficulty)
  const container = document.getElementById('leaderboardList')
  if (!data || data.length === 0) {
    container.innerHTML = '<p class="text-gray-500 text-center py-8">Пока нет результатов</p>'
    return
  }

  const medals = ['🥇','🥈','🥉']
  container.innerHTML = data.map((r, i) => `
    <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl mb-2">
      <div class="flex items-center gap-3">
        <span class="text-2xl">${medals[i] || `${i+1}.`}</span>
        <div>
          <div class="font-semibold" style="color:var(--text-main)">${r.username}</div>
          <div class="text-xs text-gray-500">${r.section==='integrals'?'Интегралы':r.section==='derivatives'?'Производные':'Ряды'} · ${r.difficulty==='easy'?'Лёгкий':r.difficulty==='medium'?'Средний':'Сложный'}</div>
        </div>
      </div>
      <div class="text-right">
        <div class="font-bold text-lg ${r.score>=70?'text-green-600':'text-red-600'}">${r.score}%</div>
        <div class="text-xs text-gray-500">${r.correct_answers}/${r.total_questions}</div>
      </div>
    </div>`).join('')
}

// ── Вспомогательные ───────────────────────────────────────
window.toggleTheory = function(id) { document.getElementById(id).classList.toggle('hidden') }

window.toggleTheme = function() {
  const isDark = document.documentElement.classList.toggle('dark')
  localStorage.setItem('theme', isDark ? 'dark' : 'light')
  document.getElementById('themeToggle').textContent = isDark ? '☀️' : '🌙'
}