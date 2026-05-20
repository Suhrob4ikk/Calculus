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
                 'seriesSection','testPage','resultsPage','statisticsPage','leaderboardPage','profilePage']
  pages.forEach(p => {
    const el = document.getElementById(p)
    if (el) {
      el.classList.add('hidden')
      el.style.display = 'none'
    }
  })
  const target = document.getElementById(pageId)
  if (target) {
    target.classList.remove('hidden')
    target.style.display = pageId === 'authPage' ? 'flex' : 'block'
  }
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


// ── Уровни пользователя ──────────────────────────────────────
function getUserLevel(total, avg) {
  if (total >= 20 && avg >= 85) return { name: 'Эксперт', icon: '🏆', color: '#f59e0b', next: null, progress: 100 }
  if (total >= 10 && avg >= 75) return { name: 'Продвинутый', icon: '🔥', color: '#3b82f6', next: 'Эксперт (20 тестов, ср. 85%)', progress: Math.min(100, Math.round((total/20)*100)) }
  if (total >= 5  && avg >= 60) return { name: 'Практик', icon: '📚', color: '#10b981', next: 'Продвинутый (10 тестов, ср. 75%)', progress: Math.min(100, Math.round((total/10)*100)) }
  if (total >= 1)               return { name: 'Студент', icon: '🎓', color: '#8b5cf6', next: 'Практик (5 тестов, ср. 60%)', progress: Math.min(100, Math.round((total/5)*100)) }
  return { name: 'Новичок', icon: '⭐', color: '#6b7280', next: 'Студент (1 тест)', progress: 0 }
}

// ── Профиль ───────────────────────────────────────────────
window.showProfile = async function() {
  showPage('profilePage')
  if (!currentUser) return

  const username = currentUser.user_metadata?.username || currentUser.email.split('@')[0]
  const email = currentUser.email

  const avatar = document.getElementById('profileAvatar')
  if (avatar) avatar.textContent = username.charAt(0).toUpperCase()
  const nameEl = document.getElementById('profileName')
  if (nameEl) nameEl.textContent = username
  const emailEl = document.getElementById('profileEmail')
  if (emailEl) emailEl.textContent = email

  const { data } = await getUserResults(currentUser.id)
  const profileContent = document.getElementById('profileContent')

  if (!data || data.length === 0) {
    profileContent.innerHTML = '<p class="text-gray-400 text-sm text-center py-4">Пройдите тесты чтобы увидеть статистику!</p>'
    return
  }

  const total = data.length
  const best = Math.max(...data.map(r => r.score))
  const avg = Math.round(data.reduce((s,r) => s+r.score, 0) / total)
  const sections = ['integrals','derivatives','series']

  // Уровень
  const level = getUserLevel(total, avg)

  // Достижения
  const badges = []
  if (total >= 1)   badges.push({ icon: '🎯', text: 'Первый тест', cls: 'badge-silver' })
  if (total >= 5)   badges.push({ icon: '📚', text: '5 тестов', cls: 'badge-silver' })
  if (total >= 10)  badges.push({ icon: '🔥', text: '10 тестов', cls: 'badge-gold' })
  if (total >= 20)  badges.push({ icon: '💎', text: '20 тестов', cls: 'badge-gold' })
  if (best === 100) badges.push({ icon: '🏆', text: 'Идеальный балл', cls: 'badge-gold' })
  if (best >= 90)   badges.push({ icon: '⭐', text: 'Отличник', cls: 'badge-gold' })
  if (avg >= 70)    badges.push({ icon: '✅', text: 'Стабильный', cls: 'badge-green' })
  const covered = sections.filter(s => data.some(r => r.section === s))
  if (covered.length === 3) badges.push({ icon: '🌟', text: 'Всесторонний', cls: 'badge-green' })
  // Серия побед
  let streak = 0, maxStreak = 0, cur = 0
  ;[...data].reverse().forEach(r => { if(r.score>=70){cur++;maxStreak=Math.max(maxStreak,cur)}else cur=0 })
  if (maxStreak >= 3) badges.push({ icon: '🔆', text: `Серия ${maxStreak} побед`, cls: 'badge-gold' })
  if (maxStreak >= 5) badges.push({ icon: '⚡', text: 'Горячая серия', cls: 'badge-gold' })

  // Лучшие результаты по разделам
  const bestResults = sections.map(sec => {
    const secData = data.filter(r => r.section === sec)
    if (!secData.length) return null
    const b = secData.reduce((a,b) => a.score > b.score ? a : b)
    return { ...b, sectionName: sec==='integrals'?'Интегралы':sec==='derivatives'?'Производные':'Ряды' }
  }).filter(Boolean)

  // Сравнение с другими (топ из leaderboard)
  const { data: lbData } = await getLeaderboard(null, null)
  let compareHTML = ''
  if (lbData && lbData.length > 0) {
    const allAvgs = {}
    lbData.forEach(r => {
      if (!allAvgs[r.username]) allAvgs[r.username] = []
      allAvgs[r.username].push(r.score)
    })
    const rankings = Object.entries(allAvgs)
      .map(([name, scores]) => ({ name, avg: Math.round(scores.reduce((a,b)=>a+b,0)/scores.length) }))
      .sort((a,b) => b.avg - a.avg)
    const myRank = rankings.findIndex(r => r.name === username) + 1
    const total_users = rankings.length
    compareHTML = `
      <h3 class="text-lg font-bold text-gray-800 mb-3">📊 Место в рейтинге</h3>
      <div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-4">
        <div class="text-center">
          <div class="text-3xl font-bold text-blue-600">#${myRank}</div>
          <div class="text-gray-500 text-sm">из ${total_users} пользователей</div>
        </div>
        <div class="mt-3 space-y-2">
          ${rankings.slice(0,3).map((r,i) => `
            <div class="flex justify-between items-center p-2 rounded-lg ${r.name===username?'bg-blue-100 font-bold':'bg-white'}">
              <span>${['🥇','🥈','🥉'][i]} ${r.name}</span>
              <span class="text-blue-600 font-semibold">${r.avg}%</span>
            </div>`).join('')}
          ${myRank > 3 ? `
            <div class="text-center text-gray-400 text-xs">...</div>
            <div class="flex justify-between items-center p-2 rounded-lg bg-blue-100 font-bold">
              <span>#${myRank} ${username}</span>
              <span class="text-blue-600 font-semibold">${avg}%</span>
            </div>` : ''}
        </div>
      </div>`
  }

  // График прогресса (последние 7 тестов)
  const recent = [...data].slice(0, 7).reverse()
  const maxScore = 100
  const chartBars = recent.map((r, i) => {
    const h = Math.round((r.score / maxScore) * 80)
    const color = r.score >= 70 ? '#10b981' : r.score >= 50 ? '#f59e0b' : '#ef4444'
    const date = new Date(r.created_at).toLocaleDateString('ru', {day:'numeric',month:'short'})
    return `<div class="flex flex-col items-center gap-1" style="flex:1">
      <div class="text-xs font-bold" style="color:${color}">${r.score}%</div>
      <div style="height:${h}px;width:100%;background:${color};border-radius:4px 4px 0 0;min-height:4px"></div>
      <div class="text-xs text-gray-400" style="font-size:0.6rem">${date}</div>
    </div>`
  }).join('')

  profileContent.innerHTML = `
    <!-- Уровень -->
    <h3 class="text-lg font-bold text-gray-800 mb-3">🎮 Уровень</h3>
    <div class="rounded-xl p-4 mb-4" style="background:linear-gradient(135deg,${level.color}18,${level.color}08);border:1.5px solid ${level.color}30">
      <div class="flex items-center gap-3 mb-2">
        <span style="font-size:2rem">${level.icon}</span>
        <div>
          <div class="font-bold text-lg" style="color:${level.color}">${level.name}</div>
          ${level.next ? `<div class="text-xs text-gray-500">Следующий: ${level.next}</div>` : '<div class="text-xs text-gray-500">Максимальный уровень!</div>'}
        </div>
      </div>
      <div style="height:8px;background:#e5e7eb;border-radius:4px;overflow:hidden">
        <div style="height:100%;width:${level.progress}%;background:${level.color};border-radius:4px;transition:width 0.5s"></div>
      </div>
    </div>

    <!-- Статистика -->
    <h3 class="text-lg font-bold text-gray-800 mb-3">📊 Статистика</h3>
    <div class="grid grid-cols-3 gap-3 mb-4">
      <div class="profile-stat"><div class="profile-stat-value">${total}</div><div class="profile-stat-label">Тестов</div></div>
      <div class="profile-stat"><div class="profile-stat-value">${best}%</div><div class="profile-stat-label">Лучший</div></div>
      <div class="profile-stat"><div class="profile-stat-value">${avg}%</div><div class="profile-stat-label">Средний</div></div>
    </div>

    <!-- График -->
    ${recent.length > 1 ? `
    <h3 class="text-lg font-bold text-gray-800 mb-3">📈 График прогресса</h3>
    <div class="bg-gray-50 rounded-xl p-4 mb-4">
      <div class="flex items-end gap-1" style="height:100px">${chartBars}</div>
    </div>` : ''}

    <!-- Достижения -->
    <h3 class="text-lg font-bold text-gray-800 mb-3">🏅 Достижения</h3>
    <div class="flex flex-wrap gap-2 mb-4">
      ${badges.length ? badges.map(b => `<span class="badge ${b.cls}">${b.icon} ${b.text}</span>`).join('') : '<p class="text-gray-400 text-sm">Пройдите больше тестов!</p>'}
    </div>

    <!-- Сравнение -->
    ${compareHTML}

    <!-- Лучшие результаты -->
    <h3 class="text-lg font-bold text-gray-800 mb-3">⭐ Лучшие результаты</h3>
    <div class="space-y-2">
      ${bestResults.map(r => `
        <div class="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
          <div><span class="font-semibold">${r.sectionName}</span><span class="text-gray-500 text-sm ml-2">${r.difficulty==='easy'?'Лёгкий':r.difficulty==='medium'?'Средний':'Сложный'}</span></div>
          <span class="font-bold text-lg ${r.score>=70?'text-green-600':'text-red-600'}">${r.score}%</span>
        </div>`).join('') || '<p class="text-gray-400 text-sm">Нет данных</p>'}
    </div>
  `
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