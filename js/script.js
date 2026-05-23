import { supabase, signUp, signIn, signOut, getUser, saveResult, getUserResults, getLeaderboard, uploadAvatar, getAvatarUrl, searchProfiles, getProfileByUsername, resetPassword, updatePassword, savePushSubscription, deletePushSubscription, getDailyLeaderboard, getDuelHistory } from './supabase.js'

// ── VAPID публичный ключ (замени после npx web-push generate-vapid-keys) ──
const VAPID_PUBLIC_KEY = 'BFvc73Owpo8t4uZ_F-_w8Xdt4Bh05LtAHe_4F4aaSsVuHe7_3tpiGhr2jJLabkeYD-uZMRHfIuhs0jaDZP7diR4'

function urlBase64ToUint8Array(b64) {
  const pad = '='.repeat((4 - b64.length % 4) % 4)
  const raw = atob((b64 + pad).replace(/-/g, '+').replace(/_/g, '/'))
  return Uint8Array.from(raw, c => c.charCodeAt(0))
}


// ── Применение темы (вызывается до DOMContentLoaded) ─────
function applyTheme(dark) {
  const body = document.body
  const html = document.documentElement
  if (dark) {
    html.classList.add('dark')
    body.classList.remove('light-theme')
    body.classList.add('dark-theme')
  } else {
    html.classList.remove('dark')
    body.classList.remove('dark-theme')
    body.classList.add('light-theme')
  }
}

// ── Глобальные переменные ─────────────────────────────────
let testTimer, timeRemaining = 25 * 60
let timerInitialTime = 25 * 60, timerStartTime = null
let currentTest = [], currentQuestionIndex = 0
let userAnswers = [], testStartTime
let currentDifficulty = '', currentSection = ''
let currentUser = null
let isStudyMode = false

// ── Инициализация ─────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  registerSW()

  // Генерируем плавающие математические символы для тёмной темы
  const mathBg = document.getElementById('mathBg')
  if (mathBg) {
    const mathSymbols = ['∫','∑','∏','√','∞','∂','∇','∈','∀','∃','≈','≠','≤','≥','lim','dx','f\'(x)','π','e']
    for (let i = 0; i < 25; i++) {
      const span = document.createElement('span')
      span.className = 'math-symbol'
      span.textContent = mathSymbols[Math.floor(Math.random() * mathSymbols.length)]
      span.style.left = Math.random() * 100 + '%'
      span.style.top = '100vh'
      span.style.animationDuration = (Math.random() * 20 + 15) + 's'
      span.style.animationDelay = -(Math.random() * 25) + 's'
      span.style.fontSize = (Math.random() * 1.2 + 0.8) + 'rem'
      span.style.opacity = '0'
      mathBg.appendChild(span)
    }
  }
  // Применяем тему
  const saved = localStorage.getItem('theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const startDark = saved === 'dark' || (!saved && prefersDark)
  applyTheme(startDark)
  const btn = document.getElementById('themeToggle')
  if (btn) btn.textContent = startDark ? '☀️' : '🌙'

  // Слушаем изменения сессии — срабатывает когда Supabase обрабатывает токен из URL
  supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'PASSWORD_RECOVERY') {
      currentUser = session?.user || null
      showPage('updatePasswordPage')
    } else if (event === 'SIGNED_IN') {
      currentUser = session?.user || null
      const updatePage = document.getElementById('updatePasswordPage')
      if (updatePage && updatePage.style.display !== 'none') return
      if (currentUser) {
        // ВАЖНО: навигируем на homePage ТОЛЬКО если пользователь был на authPage.
        // При сворачивании вкладки Supabase обновляет токен и снова стреляет SIGNED_IN —
        // без этой проверки пользователя выбрасывало бы из теста на главную.
        const authPage = document.getElementById('authPage')
        const onAuthPage = authPage && authPage.style.display !== 'none'
        if (onAuthPage) {
          showPage('homePage')
          updateUserUI()
        }
        // Если уже на другой странице (тест, профиль и т.д.) — не трогаем
      }
    } else if (event === 'SIGNED_OUT') {
      currentUser = null
      clearTestState()
      showPage('authPage')
    }
  })

  // Supabase верифицирует токен сам и редиректит с ?type=recovery или ?type=signup
  const urlParams = new URLSearchParams(window.location.search)
  const tokenType = urlParams.get('type')
  const tokenHash = urlParams.get('token_hash')

  // Очищаем URL если есть параметры
  if (tokenType) {
    history.replaceState(null, '', window.location.pathname)
  }

  // Если пришли по ссылке сброса пароля — сразу показываем форму, не идём на главную.
  // onAuthStateChange PASSWORD_RECOVERY тоже сработает, но гонка могла бы перекрыть форму.
  if (tokenType === 'recovery') {
    showPage('updatePasswordPage')
    // currentUser будет установлен когда PASSWORD_RECOVERY сработает
  } else {
    // Обычная загрузка — проверяем сессию
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      currentUser = session.user
      showPage('homePage')
      updateUserUI()
      renderStreakBadge()
      renderXPBadge()
      updateDailyChallengeCard()
      // Если есть сохранённый тест — предлагаем продолжить, а не входим автоматически
      if (localStorage.getItem('testState')) {
        showContinueTestBanner()
      }
    } else {
      showPage('authPage')
    }
  }

  // Сохраняем прогресс и предупреждаем перед уходом со страницы
  window.addEventListener('beforeunload', (e) => {
    if (currentTest.length > 0) {
      saveTestState()
      e.preventDefault()
      e.returnValue = 'Вы не закончили тест. При следующем входе тест восстановится.'
      return e.returnValue
    }
  })

  // ── Realtime leaderboard ────────────────────────────────
  supabase.channel('leaderboard-live')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'test_results' }, () => {
      // Показываем LIVE-индикатор всегда
      const ind = document.getElementById('liveIndicator')
      if (ind) ind.style.display = 'inline'
      // Обновляем таблицу лидеров если она открыта
      const lb = document.getElementById('leaderboardPage')
      if (lb && lb.style.display !== 'none') {
        window.showLeaderboard()
      }
    })
    .subscribe()

})

// ── Оверлей приватности (анти-читерство) ────────────────
function showPrivacyScreen() {
  const overlay = document.getElementById('privacyOverlay')
  if (overlay) overlay.style.display = 'flex'
}
function hidePrivacyScreen() {
  const overlay = document.getElementById('privacyOverlay')
  if (overlay) overlay.style.display = 'none'
}
window.hidePrivacyScreen = hidePrivacyScreen

// Когда пользователь скрывает вкладку/сворачивает окно во время теста
document.addEventListener('visibilitychange', () => {
  const testPage = document.getElementById('testPage')
  const isOnTest = testPage && testPage.style.display !== 'none'
  if (document.hidden && isOnTest) {
    showPrivacyScreen()
  }
})
// Дополнительно: blur окна (работает на десктопе)
window.addEventListener('blur', () => {
  const testPage = document.getElementById('testPage')
  if (testPage && testPage.style.display !== 'none') {
    showPrivacyScreen()
  }
})

// ── Баннер "Продолжить тест?" ────────────────────────────
function showContinueTestBanner() {
  // Удаляем старый баннер, если есть
  document.getElementById('continueTestBanner')?.remove()
  const banner = document.createElement('div')
  banner.id = 'continueTestBanner'
  banner.style.cssText = `
    position:fixed; top:1rem; left:50%; transform:translateX(-50%);
    z-index:10000; background:rgba(30,41,59,0.96); color:#f1f5f9;
    border:1px solid rgba(59,130,246,0.4); border-radius:1rem;
    padding:1rem 1.5rem; display:flex; align-items:center; gap:1rem;
    box-shadow:0 8px 32px rgba(0,0,0,0.4); backdrop-filter:blur(12px);
    font-size:0.9rem; max-width:90vw;
  `
  banner.innerHTML = `
    <span style="font-size:1.4rem">📝</span>
    <span>У вас есть незавершённый тест</span>
    <button onclick="resumeTestFromBanner()" style="
      background:#3b82f6;color:white;border:none;padding:6px 16px;
      border-radius:8px;cursor:pointer;font-weight:600;font-size:0.85rem;
    ">Продолжить</button>
    <button onclick="dismissContinueTestBanner()" style="
      background:rgba(239,68,68,0.2);color:#fca5a5;border:1px solid rgba(239,68,68,0.3);
      padding:6px 14px;border-radius:8px;cursor:pointer;font-size:0.85rem;
    ">Начать заново</button>
  `
  document.body.appendChild(banner)
}
window.resumeTestFromBanner = function() {
  document.getElementById('continueTestBanner')?.remove()
  if (restoreTestState()) {
    showPage('testPage')
    startTimer()
    displayQuestion()
  } else {
    clearTestState()
  }
}
window.dismissContinueTestBanner = function() {
  document.getElementById('continueTestBanner')?.remove()
  clearTestState()
}

// ── Навигация между страницами ────────────────────────────
function showPage(pageId) {
  // Убираем экран загрузки при первом показе любой страницы
  const ls = document.getElementById('loadingScreen')
  if (ls) ls.remove()

  const pages = ['authPage','homePage','integralsSection','derivativesSection',
                 'seriesSection','limitsSection','testPage','resultsPage','statisticsPage',
                 'leaderboardPage','profilePage','searchProfilesPage','viewProfilePage','updatePasswordPage']
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
    target.style.display = (pageId === 'authPage' || pageId === 'updatePasswordPage') ? 'flex' : 'block'
    try { sessionStorage.setItem('lastPage', pageId) } catch(e) {}
  }
  const noNavPages = ['authPage', 'updatePasswordPage']
  const showNav   = !noNavPages.includes(pageId)
  const bottomNav = document.getElementById('bottomNav')
  const menuBtn   = document.getElementById('menuBtn')
  const headerAvatar = document.querySelector('.header-avatar')
  // bottomNav: CSS hides on desktop (min-width:641px), JS controls auth visibility
  if (bottomNav) bottomNav.style.display = showNav ? 'flex' : 'none'
  // menuBtn: CSS hides on mobile (max-width:640px), JS controls auth visibility
  if (menuBtn) menuBtn.style.display = showNav ? '' : 'none'
  if (!showNav) window.closeNavMenu?.()
  if (headerAvatar) headerAvatar.style.display = showNav ? 'flex' : 'none'

  // Подсвечиваем активную вкладку в нижней навигации
  const bnMap = {
    profilePage: 'bnProfile', homePage: 'bnHome',
    statisticsPage: 'bnStats', leaderboardPage: 'bnLeader',
    searchProfilesPage: 'bnPeople'
  }
  document.querySelectorAll('#bottomNav button').forEach(b => b.classList.remove('bn-active'))
  const active = bnMap[pageId]
  if (active) document.getElementById(active)?.classList.add('bn-active')
}

function updateUserUI() {
  const el = document.getElementById('userGreeting')
  if (el && currentUser) {
    const username = currentUser.user_metadata?.username || currentUser.email.split('@')[0]
    const isCreator = currentUser.email === 'davlatovsurob@gmail.com'
    el.innerHTML = `👤 ${username}` + (isCreator
      ? ' <span style="background:linear-gradient(135deg,#f59e0b,#d97706);color:white;font-size:0.6rem;font-weight:700;padding:1px 6px;border-radius:10px">👑</span>'
      : '')
  }
  // Шапка: аватар убран, но sidebar Профиль-кнопку можно обновить если нужно
  // (headerAvatarImg и др. элементы скрыты, но ID сохранены для совместимости)
}

// ── Service Worker + PWA ─────────────────────────────────
async function registerSW() {
  if (!('serviceWorker' in navigator)) return
  try {
    const reg = await navigator.serviceWorker.register('/Calculus/sw.js', { scope: '/Calculus/' })
    console.log('SW registered:', reg.scope)
    // Если отложенный запрос на показ prompt установки
    window._swReg = reg
  } catch (e) {
    console.warn('SW registration failed:', e)
  }
}

// ── PWA: кнопка "Установить приложение" ─────────────────
let _deferredInstallPrompt = null
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault()
  _deferredInstallPrompt = e
  const btn = document.getElementById('installAppBtn')
  if (btn) btn.style.display = 'flex'
})
window.addEventListener('appinstalled', () => {
  _deferredInstallPrompt = null
  const btn = document.getElementById('installAppBtn')
  if (btn) btn.style.display = 'none'
})

window.installApp = async function() {
  if (!_deferredInstallPrompt) return
  _deferredInstallPrompt.prompt()
  const { outcome } = await _deferredInstallPrompt.userChoice
  if (outcome === 'accepted') _deferredInstallPrompt = null
}

// ── Push-уведомления ────────────────────────────────────
async function subscribePush() {
  if (!('Notification' in window) || !('PushManager' in window)) return null
  if (VAPID_PUBLIC_KEY === 'REPLACE_WITH_YOUR_VAPID_PUBLIC_KEY') return null

  const perm = await Notification.requestPermission()
  if (perm !== 'granted') return null

  try {
    const reg = window._swReg || await navigator.serviceWorker.ready
    const existing = await reg.pushManager.getSubscription()
    if (existing) return existing

    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
    })
    if (currentUser) await savePushSubscription(currentUser.id, sub.toJSON())
    return sub
  } catch (e) {
    console.warn('Push subscribe failed:', e)
    return null
  }
}

async function unsubscribePush() {
  try {
    const reg = await navigator.serviceWorker.ready
    const sub = await reg.pushManager.getSubscription()
    if (sub) await sub.unsubscribe()
    if (currentUser) await deletePushSubscription(currentUser.id)
  } catch (e) {
    console.warn('Push unsubscribe failed:', e)
  }
}

window.togglePushNotifications = async function() {
  const btn = document.getElementById('pushToggleBtn')
  if (!btn) return
  const reg = await navigator.serviceWorker.ready
  const existing = await reg.pushManager.getSubscription()
  if (existing) {
    await unsubscribePush()
    btn.textContent = '🔔 Включить уведомления'
    btn.classList.remove('active-push')
    localStorage.setItem('pushEnabled', 'false')
  } else {
    const sub = await subscribePush()
    if (sub) {
      btn.textContent = '🔕 Отключить уведомления'
      btn.classList.add('active-push')
      localStorage.setItem('pushEnabled', 'true')
    }
  }
}

// ── Streak (серия дней) ──────────────────────────────────
function updateStreak() {
  const today    = new Date().toDateString()
  const lastVisit = localStorage.getItem('lastVisit')
  let streak     = parseInt(localStorage.getItem('streak') || '0', 10)

  if (lastVisit === today) {
    // Уже считали сегодня — ничего не меняем
  } else {
    const yesterday = new Date(Date.now() - 86400000).toDateString()
    streak = lastVisit === yesterday ? streak + 1 : 1
    localStorage.setItem('streak', streak)
    localStorage.setItem('lastVisit', today)
  }
  return streak
}

function renderStreakBadge() {
  const streak = updateStreak()
  const el = document.getElementById('streakBadge')
  if (!el) return
  if (streak >= 2) {
    el.style.display = 'flex'
    el.innerHTML = `🔥 <span style="font-weight:700">${streak}</span> <span style="font-size:0.75rem;opacity:0.8">дней подряд</span>`
  } else {
    el.style.display = 'none'
  }
}

// ── Конфетти при 100% ───────────────────────────────────
function launchConfetti() {
  const canvas = document.createElement('canvas')
  canvas.style.cssText = 'position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:9999'
  document.body.appendChild(canvas)
  const ctx = canvas.getContext('2d')
  canvas.width  = window.innerWidth
  canvas.height = window.innerHeight

  const pieces = Array.from({ length: 140 }, () => ({
    x:    Math.random() * canvas.width,
    y:    Math.random() * -canvas.height,
    w:    Math.random() * 10 + 5,
    h:    Math.random() * 6 + 3,
    r:    Math.random() * Math.PI * 2,
    dr:   (Math.random() - 0.5) * 0.2,
    dy:   Math.random() * 3 + 2,
    dx:   (Math.random() - 0.5) * 2,
    color: `hsl(${Math.random() * 360},90%,60%)`
  }))

  let frame, elapsed = 0
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    pieces.forEach(p => {
      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate(p.r)
      ctx.fillStyle = p.color
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
      ctx.restore()
      p.y  += p.dy
      p.x  += p.dx
      p.r  += p.dr
      p.dy += 0.04
    })
    elapsed++
    if (elapsed < 180) frame = requestAnimationFrame(draw)
    else { cancelAnimationFrame(frame); canvas.remove() }
  }
  frame = requestAnimationFrame(draw)
}

// ── Звуки (Web Audio API) ────────────────────────────────
let _audioCtx = null
function _getAudioCtx() {
  if (!_audioCtx) _audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  return _audioCtx
}

function playSound(type) {
  if (localStorage.getItem('soundEnabled') === 'false') return
  try {
    const ctx = _getAudioCtx()
    if (ctx.state === 'suspended') ctx.resume()
    const now = ctx.currentTime
    const note = (freq, start, dur, vol = 0.25, wave = 'sine') => {
      const osc = ctx.createOscillator()
      const g = ctx.createGain()
      osc.type = wave; osc.frequency.value = freq
      osc.connect(g); g.connect(ctx.destination)
      g.gain.setValueAtTime(vol, now + start)
      g.gain.exponentialRampToValueAtTime(0.001, now + start + dur)
      osc.start(now + start); osc.stop(now + start + dur + 0.01)
    }
    if (type === 'correct') {
      note(523, 0, 0.18); note(659, 0.1, 0.22)
    } else if (type === 'wrong') {
      note(220, 0, 0.22, 0.12, 'sawtooth')
      note(140, 0.08, 0.18, 0.1, 'sawtooth')
    } else if (type === 'perfect') {
      // C-E-G-C fanfare
      ;[523, 659, 784, 1047].forEach((f, i) => note(f, i * 0.14, 0.32, 0.28))
    } else if (type === 'finish') {
      note(440, 0, 0.25); note(554, 0.12, 0.28)
    }
  } catch (e) { /* audio not supported */ }
}

window.toggleSound = function() {
  const on = localStorage.getItem('soundEnabled') !== 'false'
  localStorage.setItem('soundEnabled', on ? 'false' : 'true')
  const btn = document.getElementById('soundToggle')
  if (btn) btn.textContent = on ? '🔇' : '🔊'
  if (!on) playSound('correct') // demo sound when turning on
}

// Инициализировать иконку кнопки звука
;(function initSoundBtn() {
  const on = localStorage.getItem('soundEnabled') !== 'false'
  const btn = document.getElementById('soundToggle')
  if (btn) btn.textContent = on ? '🔊' : '🔇'
})()

// ── XP система ───────────────────────────────────────────
const XP_TABLE = { easy: 10, medium: 20, hard: 30 }

function getXP() { return parseInt(localStorage.getItem('totalXP') || '0', 10) }
function addXP(amount) {
  const xp = getXP() + amount
  localStorage.setItem('totalXP', String(xp))
  return xp
}

function getXPLevel(xp) {
  const levels = [
    { min: 5000, name: 'Эксперт',     icon: '🏆', color: '#f59e0b', nextAt: null  },
    { min: 2500, name: 'Знаток',      icon: '💡', color: '#3b82f6', nextAt: 5000  },
    { min: 1000, name: 'Продвинутый', icon: '🔥', color: '#10b981', nextAt: 2500  },
    { min: 500,  name: 'Практик',     icon: '📚', color: '#8b5cf6', nextAt: 1000  },
    { min: 200,  name: 'Студент',     icon: '🎓', color: '#06b6d4', nextAt: 500   },
    { min: 0,    name: 'Новичок',     icon: '⭐', color: '#6b7280', nextAt: 200   },
  ]
  return levels.find(l => xp >= l.min)
}

function showXPToast(gained, total) {
  document.getElementById('xpToast')?.remove()
  const lvl = getXPLevel(total)
  const toast = document.createElement('div')
  toast.id = 'xpToast'
  toast.style.cssText = `
    position:fixed;bottom:5.5rem;left:50%;transform:translateX(-50%) translateY(16px);
    z-index:10001;background:rgba(15,23,42,0.97);border:1px solid ${lvl.color}55;
    border-radius:14px;padding:11px 20px;display:flex;align-items:center;gap:12px;
    box-shadow:0 8px 32px rgba(0,0,0,0.45);backdrop-filter:blur(12px);
    font-size:0.9rem;opacity:0;transition:transform 0.3s,opacity 0.3s;pointer-events:none
  `
  toast.innerHTML = `
    <span style="font-size:1.5rem">${lvl.icon}</span>
    <div>
      <div style="font-weight:700;color:${lvl.color}">+${gained} XP</div>
      <div style="color:#94a3b8;font-size:0.75rem">${lvl.name} · ${total} XP всего</div>
    </div>`
  document.body.appendChild(toast)
  requestAnimationFrame(() => {
    toast.style.transform = 'translateX(-50%) translateY(0)'
    toast.style.opacity = '1'
  })
  setTimeout(() => {
    toast.style.transform = 'translateX(-50%) translateY(-10px)'
    toast.style.opacity = '0'
    setTimeout(() => toast.remove(), 350)
  }, 3200)
}

function renderXPBadge() {
  const xp = getXP()
  const lvl = getXPLevel(xp)
  const el = document.getElementById('xpBadge')
  if (!el) return
  el.style.display = 'flex'
  el.style.color = lvl.color
  el.style.borderColor = lvl.color + '55'
  el.style.background = lvl.color + '18'
  el.innerHTML = `${lvl.icon} <span style="font-weight:700">${xp}</span><span style="font-size:0.72rem;opacity:0.75"> XP</span>`
}

// ── Ежедневный вызов ─────────────────────────────────────
function getDailyDate() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

function hashCode(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) h = Math.imul(31, h) + str.charCodeAt(i) | 0
  return h >>> 0
}

function mulberry32(seed) {
  return function() {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed)
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t
    return ((t ^ t >>> 14) >>> 0) / 4294967296
  }
}

function getDailyQuestions() {
  const rng = mulberry32(hashCode(getDailyDate()))
  const all = [
    ...easyIntegralsQuestions, ...mediumIntegralsQuestions,
    ...easyDerivativesQuestions, ...mediumDerivativesQuestions,
    ...easySeriesQuestions, ...mediumSeriesQuestions,
    ...easyLimitsQuestions, ...mediumLimitsQuestions
  ].flat().filter(q => q && q.options && q.options.length === 4)

  // Fisher-Yates with seeded rng
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]]
  }
  // Pick 10 and shuffle their answer options (also seeded)
  return all.slice(0, 10).map(q => {
    const order = [0,1,2,3]
    for (let i = 3; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]]
    }
    return { ...q, options: order.map(i => q.options[i]), correct: order.indexOf(q.correct) }
  })
}

window.startDailyChallenge = function() {
  const today = getDailyDate()
  if (localStorage.getItem('dailyChallengeDate') === today) {
    showDailyLeaderboard()
    return
  }
  clearTestState()
  isStudyMode = false
  currentSection = 'daily'
  currentDifficulty = 'medium'
  currentTest = getDailyQuestions()
  currentQuestionIndex = 0
  userAnswers = new Array(currentTest.length).fill(null)
  testStartTime = Date.now()
  timeRemaining = 15 * 60
  timerInitialTime = timeRemaining

  showPage('testPage')
  document.getElementById('totalQuestions').textContent = currentTest.length
  document.getElementById('testTitle').textContent = '🌟 Ежедневный вызов'
  document.getElementById('difficultyLabel').textContent = `${today} · 10 вопросов из всех разделов`
  startTimer()
  displayQuestion()
}

function updateDailyChallengeCard() {
  const today = getDailyDate()
  const doneToday = localStorage.getItem('dailyChallengeDate') === today
  const score = localStorage.getItem('dailyChallengeScore')
  const btn = document.getElementById('dailyChallengeBtn')
  const countdown = document.getElementById('dailyChallengeCountdown')
  const card = document.getElementById('dailyChallengeCard')
  if (!btn) return

  if (doneToday) {
    btn.textContent = `✅ ${score}%`
    btn.style.background = 'linear-gradient(135deg,#10b981,#059669)'
    if (card) card.onclick = showDailyLeaderboard
    if (countdown) {
      if (window._dailyCountdownInterval) clearInterval(window._dailyCountdownInterval)
      const tick = () => {
        const now = new Date()
        const tomorrow = new Date(now)
        tomorrow.setDate(tomorrow.getDate() + 1)
        tomorrow.setHours(0, 0, 0, 0)
        const diff = tomorrow - now
        const h = Math.floor(diff / 3600000)
        const m = Math.floor((diff % 3600000) / 60000)
        const s = Math.floor((diff % 60000) / 1000)
        countdown.textContent = `Следующий через ${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
      }
      tick()
      window._dailyCountdownInterval = setInterval(tick, 1000)
    }
  } else {
    btn.textContent = '🎯 Начать'
    btn.style.background = ''
    if (countdown) countdown.textContent = ''
    if (card) card.onclick = window.startDailyChallenge
  }
}

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
  // Keep only best attempt per user
  const seen = new Set()
  const unique = data.filter(r => { if (seen.has(r.username)) return false; seen.add(r.username); return true })
  const medals = ['🥇','🥈','🥉']
  const myName = currentUser?.user_metadata?.username || currentUser?.email?.split('@')[0]

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

// ── Keyboard shortcuts ───────────────────────────────────
document.addEventListener('keydown', e => {
  const testVisible = document.getElementById('testPage')?.style.display !== 'none'
  if (!testVisible) return

  // 1-4 → выбор ответа
  if (['1','2','3','4'].includes(e.key)) {
    const idx = parseInt(e.key) - 1
    const labels = document.querySelectorAll('.option-label')
    if (labels[idx] && userAnswers[currentQuestionIndex] === null) {
      window.selectAnswer(idx)
    }
  }
  // Enter → следующий вопрос / завершить
  if (e.key === 'Enter') {
    const finish = document.getElementById('finishBtn')
    const next   = document.getElementById('nextBtn')
    if (finish?.style.display !== 'none') window.finishTest()
    else if (next?.style.display !== 'none') window.nextQuestion()
  }
  // Стрелка влево → предыдущий
  if (e.key === 'ArrowLeft') window.previousQuestion()
  // Escape → выйти
  if (e.key === 'Escape') window.exitTest()
})

// ── Авторизация ───────────────────────────────────────────
window.showAuthTab = function(tab) {
  document.getElementById('loginForm').classList.toggle('hidden', tab !== 'login')
  document.getElementById('registerForm').classList.toggle('hidden', tab !== 'register')
  document.getElementById('tabLogin').classList.toggle('active', tab === 'login')
  document.getElementById('tabRegister').classList.toggle('active', tab !== 'login')
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


// ── Загрузка аватара ──────────────────────────────────────
window.triggerAvatarUpload = function() {
  document.getElementById('avatarInput').click()
}

async function handleAvatarUpload(event) {
  const file = event.target.files[0]
  if (!file || !currentUser) return
  if (file.size > 2 * 1024 * 1024) { alert('Файл слишком большой. Максимум 2MB'); return }

  const btn = document.getElementById('avatarUploadBtn')
  if (btn) { btn.textContent = '⏳ Загрузка...'; btn.disabled = true }

  const { url, error } = await uploadAvatar(currentUser.id, file)
  if (error) {
    alert('Ошибка загрузки: ' + error.message)
  } else {
    // Update avatar display
    const img = document.getElementById('profileAvatarImg')
    const letter = document.getElementById('profileAvatar')
    if (img) { img.src = url; img.style.display = 'block' }
    if (letter) letter.style.display = 'none'
    if (btn) { btn.textContent = '✅ Загружено!'; setTimeout(() => { btn.textContent = '📷 Сменить фото'; btn.disabled = false }, 2000) }
  }
  if (btn && btn.disabled) { btn.textContent = '📷 Сменить фото'; btn.disabled = false }
}

// ── Поиск профилей ────────────────────────────────────────
window.showSearchProfiles = async function() {
  showPage('searchProfilesPage')
  const { data } = await searchProfiles('')
  renderSearchResults(data)
  setTimeout(() => {
    const input = document.getElementById('searchInputField')
    if (!input) return
    input.focus()
    input.value = ''
    let _searchTimeout = null
    input.oninput = () => {
      clearTimeout(_searchTimeout)
      _searchTimeout = setTimeout(async () => {
        const q = input.value.trim()
        const { data } = await searchProfiles(q)
        if (!q) {
          renderSearchResults(data)
          return
        }
        if (!data || data.length === 0) {
          document.getElementById('searchResults').innerHTML =
            `<p class="text-gray-400 text-center py-4">Пользователь "${q}" не найден</p>`
        } else {
          renderSearchResults(data)
        }
      }, 300)
    }
  }, 50)
}

function renderSearchResults(data) {
  const container = document.getElementById('searchResults')
  if (!container) return
  if (!data || data.length === 0) {
    container.innerHTML = '<p class="text-gray-400 text-center py-4">Пользователи не найдены</p>'
    return
  }
  container.innerHTML = data.map(p => `
    <div class="flex items-center justify-between p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-blue-50 transition-colors"
         onclick="viewProfile('${p.username}')">
      <div class="flex items-center gap-3">
        ${p.avatar_url
          ? `<img src="${p.avatar_url}" class="w-10 h-10 rounded-full object-cover">`
          : `<div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#3b82f6,#8b5cf6);display:flex;align-items:center;justify-content:center;color:white;font-weight:700">${p.username.charAt(0).toUpperCase()}</div>`
        }
        <span class="font-semibold" style="color:var(--text-main)">${p.username}</span>
        ${p.username === 'Suhrob' ? '<span style="background:linear-gradient(135deg,#f59e0b,#d97706);color:white;font-size:0.6rem;font-weight:700;padding:1px 6px;border-radius:10px;margin-left:4px">👑</span>' : ''}
      </div>
      <span class="text-blue-500 text-sm">Посмотреть →</span>
    </div>`).join('')
}

window.handleSearch = async function() {
  const q = (document.getElementById('searchInputField') || document.getElementById('searchInput'))?.value.trim() || ''
  const { data } = await searchProfiles(q)
  renderSearchResults(data)
}

window.viewProfile = async function(username) {
  showPage('viewProfilePage')
  document.getElementById('viewProfileContent').innerHTML = '<p class="text-gray-400 text-center py-8">Загрузка...</p>'

  const { profile, results } = await getProfileByUsername(username)
  if (!profile) {
    document.getElementById('viewProfileContent').innerHTML = '<p class="text-gray-400 text-center py-4">Профиль не найден</p>'
    return
  }

  const total = results.length
  const best = total ? Math.max(...results.map(r => r.score)) : 0
  const avg = total ? Math.round(results.reduce((s,r) => s+r.score, 0) / total) : 0
  const level = getUserLevel(total, avg)

  const badges = []
  if (total >= 1)   badges.push({ icon: '🎯', text: 'Первый тест', cls: 'badge-silver' })
  if (total >= 5)   badges.push({ icon: '📚', text: '5 тестов', cls: 'badge-silver' })
  if (total >= 10)  badges.push({ icon: '🔥', text: '10 тестов', cls: 'badge-gold' })
  if (total >= 20)  badges.push({ icon: '💎', text: '20 тестов', cls: 'badge-gold' })
  if (best === 100) badges.push({ icon: '🏆', text: 'Идеальный балл', cls: 'badge-gold' })
  if (best >= 90)   badges.push({ icon: '⭐', text: 'Отличник', cls: 'badge-gold' })
  if (avg >= 70)    badges.push({ icon: '✅', text: 'Стабильный', cls: 'badge-green' })

  const CREATOR_USERNAME = 'Suhrob'
  const isProfileCreator = profile.username === CREATOR_USERNAME
  const creatorBadge = isProfileCreator
    ? ' <span title="Создатель сайта" style="display:inline-flex;align-items:center;gap:3px;background:linear-gradient(135deg,#f59e0b,#d97706);color:white;font-size:0.65rem;font-weight:700;padding:2px 8px;border-radius:20px;vertical-align:middle;box-shadow:0 2px 8px rgba(245,158,11,0.4)">👑 Разработчик</span>'
    : ''
  const viewNameEl = document.getElementById('viewProfileName')
  if (viewNameEl) viewNameEl.innerHTML = profile.username + creatorBadge
  const avatarEl = document.getElementById('viewProfileAvatar')
  const avatarImgEl = document.getElementById('viewProfileAvatarImg')
  if (profile.avatar_url) {
    avatarImgEl.src = profile.avatar_url
    avatarImgEl.style.display = 'block'
    avatarImgEl.style.cursor = 'pointer'
    avatarImgEl.onclick = () => openPhotoPreview(profile.avatar_url, profile.username)
    avatarEl.style.display = 'none'
  } else {
    avatarEl.textContent = profile.username.charAt(0).toUpperCase()
    avatarEl.style.display = 'flex'
    avatarImgEl.style.display = 'none'
  }

  document.getElementById('viewProfileContent').innerHTML = `
    <div class="rounded-xl p-4 mb-4" style="background:linear-gradient(135deg,${level.color}18,${level.color}08);border:1.5px solid ${level.color}30">
      <div class="flex items-center gap-3">
        <span style="font-size:1.8rem">${level.icon}</span>
        <div class="font-bold text-lg" style="color:${level.color}">${level.name}</div>
      </div>
    </div>
    <div class="grid grid-cols-3 gap-3 mb-4">
      <div class="profile-stat"><div class="profile-stat-value">${total}</div><div class="profile-stat-label">Тестов</div></div>
      <div class="profile-stat"><div class="profile-stat-value">${best}%</div><div class="profile-stat-label">Лучший</div></div>
      <div class="profile-stat"><div class="profile-stat-value">${avg}%</div><div class="profile-stat-label">Средний</div></div>
    </div>
    <h3 class="text-lg font-bold text-gray-800 mb-3">🏅 Достижения</h3>
    <div class="flex flex-wrap gap-2 mb-4">
      ${badges.length ? badges.map(b => `<span class="badge ${b.cls}">${b.icon} ${b.text}</span>`).join('') : '<p class="text-gray-400 text-sm">Нет достижений</p>'}
    </div>
    <h3 class="text-lg font-bold text-gray-800 mb-3">📋 Последние результаты</h3>
    <div class="space-y-2">
      ${results.slice(0,5).map(r => `
        <div class="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
          <div>
            <span class="font-semibold">${r.section==='integrals'?'Интегралы':r.section==='derivatives'?'Производные':r.section==='series'?'Ряды':'Пределы'}</span>
            <span class="text-gray-500 text-sm ml-2">${r.difficulty==='easy'?'Лёгкий':r.difficulty==='medium'?'Средний':'Сложный'}</span>
          </div>
          <span class="font-bold ${r.score>=70?'text-green-600':'text-red-600'}">${r.score}%</span>
        </div>`).join('') || '<p class="text-gray-400 text-sm">Нет результатов</p>'}
    </div>
  `
}


// ── Просмотр фото на весь экран ──────────────────────────
window.openPhotoPreview = function(url, name) {
  const overlay = document.createElement('div')
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.9);z-index:9999;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer'
  overlay.onclick = () => document.body.removeChild(overlay)
  overlay.innerHTML = `
    <div style="position:relative;max-width:90vw;max-height:90vh">
      <img src="${url}" style="max-width:90vw;max-height:80vh;border-radius:12px;object-fit:contain;box-shadow:0 25px 50px rgba(0,0,0,0.5)">
      <div style="text-align:center;color:white;margin-top:12px;font-size:1.1rem;font-weight:600">${name}</div>
    </div>
    <div style="position:absolute;top:20px;right:20px;color:white;font-size:1.5rem;cursor:pointer">✕</div>
  `
  document.body.appendChild(overlay)
}


// ── Сброс пароля ──────────────────────────────────────────
function showForgotPassword() {
  document.getElementById('loginForm').style.display = 'none'
  document.getElementById('forgotForm').style.display = 'block'
}

function showLoginFromForgot() {
  document.getElementById('forgotForm').style.display = 'none'
  document.getElementById('loginForm').style.display = 'block'
}

async function handleForgotPassword() {
  const email = document.getElementById('forgotEmail').value.trim()
  const errEl = document.getElementById('forgotError')
  errEl.textContent = ''
  if (!email) { errEl.textContent = 'Введите email'; return }

  const btn = document.getElementById('forgotBtn')
  btn.textContent = 'Отправляем...'
  btn.disabled = true

  const { error } = await resetPassword(email)
  btn.textContent = 'Отправить'
  btn.disabled = false

  if (error) {
    errEl.textContent = 'Ошибка: ' + error.message
  } else {
    errEl.style.color = '#10b981'
    errEl.textContent = '✅ Письмо отправлено! Проверьте почту.'
  }
}

async function handleUpdatePassword() {
  const password = document.getElementById('newPassword').value
  const confirm = document.getElementById('confirmPassword').value
  const errEl = document.getElementById('updatePasswordError')
  errEl.textContent = ''

  if (!password) { errEl.textContent = 'Введите новый пароль'; return }
  if (password.length < 6) { errEl.textContent = 'Пароль минимум 6 символов'; return }
  if (password !== confirm) { errEl.textContent = 'Пароли не совпадают'; return }

  const btn = document.getElementById('updatePasswordBtn')
  btn.textContent = 'Сохраняем...'
  btn.disabled = true

  const { error } = await updatePassword(password)
  btn.textContent = 'Сохранить пароль'
  btn.disabled = false

  if (error) {
    errEl.textContent = 'Ошибка: ' + error.message
  } else {
    errEl.style.color = '#10b981'
    errEl.textContent = '✅ Пароль успешно изменён!'
    setTimeout(() => { showPage('homePage'); updateUserUI() }, 1500)
  }
}


// ── Показать/скрыть пароль ────────────────────────────────
window.togglePasswordVisibility = function(inputId, eyeId) {
  const input = document.getElementById(inputId)
  const eye = document.getElementById(eyeId)
  if (!input) return
  if (input.type === 'password') {
    input.type = 'text'
    if (eye) eye.textContent = '🙈'
  } else {
    input.type = 'password'
    if (eye) eye.textContent = '👁'
  }
}

// Слушаем ввод пароля для индикатора надёжности
document.addEventListener('DOMContentLoaded', () => {
  const newPasswordInput = document.getElementById('newPassword')
  if (newPasswordInput) {
    newPasswordInput.addEventListener('input', () => {
      const val = newPasswordInput.value
      const fill = document.getElementById('strengthFill')
      const text = document.getElementById('strengthText')
      const req1 = document.getElementById('req1')
      const req2 = document.getElementById('req2')
      const req3 = document.getElementById('req3')

      const hasLength = val.length >= 6
      const hasDigit = /\d/.test(val)
      const hasLetter = /[a-zA-Zа-яА-Я]/.test(val)

      if (req1) req1.textContent = (hasLength ? '✅' : '⚪') + ' Минимум 6 символов'
      if (req2) req2.textContent = (hasDigit ? '✅' : '⚪') + ' Содержит цифры'
      if (req3) req3.textContent = (hasLetter ? '✅' : '⚪') + ' Содержит буквы'

      const score = [hasLength, hasDigit, hasLetter].filter(Boolean).length
      const colors = ['', '#ef4444', '#f59e0b', '#10b981']
      const labels = ['', 'Слабый', 'Средний', 'Надёжный']
      if (fill) { fill.style.width = (score * 33) + '%'; fill.style.background = colors[score] }
      if (text) { text.textContent = val ? labels[score] : ''; text.style.color = colors[score] }
    })
  }
})

// ── Главная и разделы ─────────────────────────────────────
window.showHome = function() {
  stopTimer()
  showPage('homePage')
  renderStreakBadge()
  renderXPBadge()
  updateDailyChallengeCard()
}

window.showSection = function(section) {
  currentSection = section
  const map = { integrals: 'integralsSection', derivatives: 'derivativesSection', series: 'seriesSection', limits: 'limitsSection' }
  showPage(map[section])
}

// ── Таймер ────────────────────────────────────────────────
function startTimer() {
  updateTimerDisplay()
  if (testTimer) clearInterval(testTimer)
  testTimer = setInterval(() => {
    timeRemaining--
    updateTimerDisplay()
    if (timeRemaining <= 0) {
      clearInterval(testTimer)
      // Мягкое уведомление вместо блокирующего alert()
      const timerEl = document.getElementById('timerDisplay')
      if (timerEl) {
        timerEl.textContent = '⏱️ Время вышло!'
        timerEl.className = 'text-lg font-semibold text-red-600 bg-red-100 px-4 py-2 rounded-lg animate-pulse'
      }
      setTimeout(() => finishTest(), 1500)
    }
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


// ── Сохранение / очистка / восстановление состояния теста ─
function saveTestState() {
  if (currentSection === 'duel' || currentSection === 'daily') return
  try {
    localStorage.setItem('testState', JSON.stringify({
      section: currentSection,
      difficulty: currentDifficulty,
      currentQuestionIndex,
      userAnswers,
      timeRemaining,
      currentTest
    }))
  } catch (e) {
    console.error('saveTestState failed:', e)
  }
}

function clearTestState() {
  localStorage.removeItem('testState')
}

function restoreTestState() {
  const saved = localStorage.getItem('testState')
  if (!saved) return false
  try {
    const state = JSON.parse(saved)
    if (!state.currentTest || !state.currentTest.length) return false
    currentSection          = state.section
    currentDifficulty       = state.difficulty
    currentQuestionIndex    = state.currentQuestionIndex || 0
    userAnswers             = state.userAnswers || []
    timeRemaining           = state.timeRemaining || 25 * 60
    timerInitialTime        = state.timeRemaining || 25 * 60
    currentTest             = state.currentTest
    testStartTime           = Date.now()
    timerStartTime          = null
    return true
  } catch (e) {
    console.error('restoreTestState failed:', e)
    localStorage.removeItem('testState')
    return false
  }
}

// ── Запуск теста ──────────────────────────────────────────
function startTest(section, difficulty, pool, countSelectId, sectionEl) {
  clearTestState()
  currentSection = section
  currentDifficulty = difficulty

  // Количество вопросов выбирает пользователь
  const countEl = document.getElementById(countSelectId)
  const questionCount = countEl ? parseInt(countEl.value) : 15

  // Время определяется автоматически по уровню и количеству
  const timePerQuestion = difficulty === 'easy' ? 60 : difficulty === 'medium' ? 90 : 120
  timeRemaining = questionCount * timePerQuestion

  let questions = pool.flat().filter(q => q && q.options && q.options.every(o => o != null))
  // Перемешиваем вопросы случайно
  const shuffled = [...questions].sort(() => Math.random() - 0.5).slice(0, Math.min(questionCount, questions.length))
  // Перемешиваем варианты ответов в каждом вопросе и пересчитываем индекс correct
  currentTest = shuffled.map(q => {
    const order = [0, 1, 2, 3].sort(() => Math.random() - 0.5)  // новый порядок индексов
    return {
      ...q,
      options: order.map(i => q.options[i]),  // перемешанные варианты
      correct: order.indexOf(q.correct)        // новая позиция правильного ответа
    }
  })
  currentQuestionIndex = 0
  userAnswers = new Array(currentTest.length).fill(null)
  testStartTime = Date.now()

  document.getElementById(sectionEl).classList.add('hidden')
  showPage('testPage')
  document.getElementById('totalQuestions').textContent = currentTest.length
  const sectionName = { integrals: 'Интегралы', derivatives: 'Производные', series: 'Ряды', limits: 'Пределы' }[section] || section
  const diffName    = difficulty === 'easy' ? 'Лёгкий' : difficulty === 'medium' ? 'Средний' : 'Сложный'
  document.getElementById('testTitle').textContent = `${isStudyMode ? '📖 Изучение' : 'Тест'}: ${sectionName}`
  document.getElementById('difficultyLabel').textContent = `Уровень: ${diffName}${isStudyMode ? ' · Без таймера · Результат не сохраняется' : ''}`

  const timerEl = document.getElementById('timerDisplay')
  if (timerEl) timerEl.style.display = isStudyMode ? 'none' : ''

  if (!isStudyMode) startTimer()
  displayQuestion()
}





window.startIntegralsTest = function(d, study = false) {
  isStudyMode = study
  const pool = d==='easy' ? easyIntegralsQuestions : d==='medium' ? mediumIntegralsQuestions : hardIntegralsQuestions
  startTest('integrals', d, pool, 'integralsCount', 'integralsSection')
}
window.startLimitsTest = function(d, study = false) {
  isStudyMode = study
  const pool = d==='easy' ? easyLimitsQuestions : d==='medium' ? mediumLimitsQuestions : hardLimitsQuestions
  startTest('limits', d, pool, 'limitsCount', 'limitsSection')
}
window.startDerivativesTest = function(d, study = false) {
  isStudyMode = study
  const pool = d==='easy' ? easyDerivativesQuestions : d==='medium' ? mediumDerivativesQuestions : hardDerivativesQuestions
  startTest('derivatives', d, pool, 'derivativesCount', 'derivativesSection')
}
window.startSeriesTest = function(d, study = false) {
  isStudyMode = study
  const pool = d==='easy' ? easySeriesQuestions : d==='medium' ? mediumSeriesQuestions : hardSeriesQuestions
  startTest('series', d, pool, 'seriesCount', 'seriesSection')
}

window.restartTest = function() {
  if (currentSection === 'daily') { showHome(); return }
  if (currentSection === 'duel') { showDuelModal(); return }
  ;(currentSection==='limits'?window.startLimitsTest:currentSection==='series'?window.startSeriesTest:currentSection==='derivatives'?window.startDerivativesTest:window.startIntegralsTest)(currentDifficulty)
}

// ── Вопросы ───────────────────────────────────────────────
window.selectAnswer = function(answerIndex) {
  if (userAnswers[currentQuestionIndex] !== null) return
  userAnswers[currentQuestionIndex] = answerIndex
  const correct = currentTest[currentQuestionIndex].correct
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
  if (confirm('Выйти? Прогресс будет потерян.')) {
    clearTestState()
    // Сбрасываем in-memory данные теста, иначе beforeunload пересохранит состояние
    currentTest = []
    userAnswers = []
    currentQuestionIndex = 0
    stopTimer()
    showHome()
  }
}

// ── Завершение теста ──────────────────────────────────────
window.finishTest = async function() {
  // Защита от двойного нажатия
  if (window._finishInProgress) return
  window._finishInProgress = true
  const finishBtn = document.getElementById('finishBtn')
  if (finishBtn) { finishBtn.disabled = true; finishBtn.textContent = 'Сохраняем...' }

  stopTimer()
  let correct = 0
  const results = currentTest.map((q, i) => {
    const ok = userAnswers[i] === q.correct
    if (ok) correct++
    return { question: q.question, userAnswer: userAnswers[i]!=null?q.options[userAnswers[i]]:'Не отвечено', correctAnswer: q.options[q.correct], isCorrect: ok }
  })
  const percentage = Math.round(correct / currentTest.length * 100)

  // ── Дуэль: отдельный флоу ──────────────────────────────
  if (currentSection === 'duel') {
    _duelMyScore = percentage
    _broadcastDuelScore(percentage)

    // Save to Supabase — difficulty stores the duel code to link both players' records
    if (currentUser) {
      await saveResult({
        userId: currentUser.id,
        username: _duelMyName,
        section: 'duel',
        difficulty: _duelCode,
        score: _duelMyScore,
        correctAnswers: correct,
        totalQuestions: currentTest.length
      })
    }

    // Award XP for duel
    const xpGained = correct * (XP_TABLE[_duelDiff] || 20)
    const newXP = addXP(xpGained)
    setTimeout(() => { showXPToast(xpGained, newXP); renderXPBadge() }, 700)

    window._finishInProgress = false
    clearTestState()
    showPage('resultsPage')
    playSound(percentage === 100 ? 'perfect' : 'finish')
    const scoreDisplay = document.getElementById('scoreDisplay')
    scoreDisplay.textContent = `${correct}/${currentTest.length}`
    scoreDisplay.className = percentage >= 70 ? 'text-6xl font-bold mb-4 text-green-600' : 'text-6xl font-bold mb-4 text-red-600'
    document.getElementById('scoreText').textContent = `Дуэль завершена — результат ${percentage}%`
    const detailedResults = document.getElementById('detailedResults')
    detailedResults.innerHTML = `<p style="color:#94a3b8;text-align:center;padding:1rem">⏳ Ожидаем результата соперника…</p>`
    _checkDuelComplete()
    return
  }

  // Сохраняем в Supabase (только не в режиме изучения)
  if (currentUser && !isStudyMode) {
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

  // Mark daily challenge as done
  if (currentSection === 'daily') {
    localStorage.setItem('dailyChallengeDate', getDailyDate())
    localStorage.setItem('dailyChallengeScore', percentage)
  }

  // Award XP
  if (!isStudyMode) {
    const ptsPerQ = XP_TABLE[currentDifficulty] || 10
    let xpGained = correct * ptsPerQ
    if (percentage === 100) xpGained += 25          // идеальный результат
    if (currentSection === 'daily') xpGained += 50  // ежедневный бонус
    const newXP = addXP(xpGained)
    setTimeout(() => { showXPToast(xpGained, newXP); renderXPBadge() }, 700)
  }

  window._finishInProgress = false
  if (!isStudyMode) clearTestState()
  isStudyMode = false
  showPage('resultsPage')
  if (percentage === 100) {
    setTimeout(launchConfetti, 400)
    playSound('perfect')
  } else {
    playSound('finish')
  }

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
  const sectionNames = { integrals: 'Интегралы', derivatives: 'Производные', series: 'Ряды', limits: 'Пределы', daily: 'Ежедневный вызов' }
  const section = sectionNames[currentSection] || currentSection
  const diff = currentDifficulty==='easy'?'Лёгкий':currentDifficulty==='medium'?'Средний':'Сложный'
  const emoji = percentage===100?'🏆':percentage>=90?'🌟':percentage>=70?'✅':percentage>=50?'📚':'💪'
  const text = `${emoji} Результат теста!\n\n📖 ${section} (${diff})\n📊 ${correct}/${total} — ${percentage}%\n\n🔗 https://suhrob4ikk.github.io/Calculus`
  const btn = document.getElementById('shareBtn')
  const orig = btn.textContent
  const onCopied = () => {
    btn.textContent = '✅ Скопировано!'
    btn.style.backgroundColor = '#10b981'
    setTimeout(() => { btn.textContent = orig; btn.style.backgroundColor = '' }, 2500)
  }
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).then(onCopied).catch(() => {
      // Fallback: создаём временный textarea
      const ta = document.createElement('textarea')
      ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0'
      document.body.appendChild(ta); ta.select()
      try { document.execCommand('copy'); onCopied() } catch(e) {}
      document.body.removeChild(ta)
    })
  } else {
    // Fallback для Safari и старых браузеров
    const ta = document.createElement('textarea')
    ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0'
    document.body.appendChild(ta); ta.select()
    try { document.execCommand('copy'); onCopied() } catch(e) {}
    document.body.removeChild(ta)
  }
}


// ── Уровни пользователя ──────────────────────────────────────
function getUserLevel(total, avg) {
  if (total >= 20 && avg >= 85) return { name: 'Эксперт', icon: '🏆', color: '#f59e0b', next: null, progress: 100 }
  if (total >= 10 && avg >= 75) return { name: 'Продвинутый', icon: '🔥', color: '#3b82f6', next: 'Эксперт (20 тестов, ср. 85%)', progress: Math.min(100, Math.round((total/20)*100)) }
  if (total >= 5  && avg >= 60) return { name: 'Практик', icon: '📚', color: '#10b981', next: 'Продвинутый (10 тестов, ср. 75%)', progress: Math.min(100, Math.round((total/10)*100)) }
  if (total >= 1)               return { name: 'Студент', icon: '🎓', color: '#8b5cf6', next: 'Практик (5 тестов, ср. 60%)', progress: Math.min(100, Math.round((total/5)*100)) }
  return { name: 'Новичок', icon: '⭐', color: '#6b7280', next: 'Студент (1 тест)', progress: 0 }
}



function computeBadges(data, sections) {
  const total = data.length
  const best = total ? Math.max(...data.map(r => r.score)) : 0
  const avg = total ? Math.round(data.reduce((s, r) => s + r.score, 0) / total) : 0
  const badges = []
  if (total >= 1)   badges.push({ icon: '🎯', text: 'Первый тест',    cls: 'badge-silver' })
  if (total >= 5)   badges.push({ icon: '📚', text: '5 тестов',       cls: 'badge-silver' })
  if (total >= 10)  badges.push({ icon: '🔥', text: '10 тестов',      cls: 'badge-gold'   })
  if (total >= 20)  badges.push({ icon: '💎', text: '20 тестов',      cls: 'badge-gold'   })
  if (best === 100) badges.push({ icon: '🏆', text: 'Идеальный балл', cls: 'badge-gold'   })
  if (best >= 90)   badges.push({ icon: '⭐', text: 'Отличник',       cls: 'badge-gold'   })
  if (avg >= 70)    badges.push({ icon: '✅', text: 'Стабильный',     cls: 'badge-green'  })
  const covered = sections.filter(s => data.some(r => r.section === s))
  if (covered.length >= 4) badges.push({ icon: '🌟', text: 'Всесторонний', cls: 'badge-green' })
  let maxStreak = 0, cur = 0
  const reversed = data.slice().reverse()
  reversed.forEach(r => { if (r.score >= 70) { cur++; maxStreak = Math.max(maxStreak, cur) } else cur = 0 })
  if (maxStreak >= 3) badges.push({ icon: '🔆', text: `Серия ${maxStreak} побед`, cls: 'badge-gold' })
  if (maxStreak >= 5) badges.push({ icon: '⚡', text: 'Горячая серия',            cls: 'badge-gold' })
  return { badges, total, best, avg }
}

// ── Профиль ───────────────────────────────────────────────
window.showProfile = async function() {
  showPage('profilePage')
  if (!currentUser) return

  // Обновляем состояние кнопки push-уведомлений
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    navigator.serviceWorker.ready.then(reg => {
      reg.pushManager.getSubscription().then(sub => {
        const btn = document.getElementById('pushToggleBtn')
        if (!btn) return
        if (sub) {
          btn.textContent = '🔕 Отключить уведомления'
          btn.classList.add('active-push')
        } else {
          btn.textContent = '🔔 Включить уведомления'
          btn.classList.remove('active-push')
        }
      })
    })
  }

  setTimeout(() => {
    const avatarBtn = document.getElementById('avatarUploadBtn')
    if (avatarBtn) avatarBtn.onclick = () => document.getElementById('avatarInput').click()
    const avatarInput = document.getElementById('avatarInput')
    if (avatarInput) avatarInput.onchange = handleAvatarUpload
    // Кнопка удаления аватара
    const avatarDeleteBtn = document.getElementById('avatarDeleteBtn')
    if (avatarDeleteBtn) avatarDeleteBtn.onclick = async () => {
      if (!currentUser) return
      if (!confirm('Удалить фото профиля?')) return
      const { data: files } = await supabase.storage.from('avatars').list(currentUser.id)
      if (files && files.length > 0) {
        const paths = files.map(f => `${currentUser.id}/${f.name}`)
        await supabase.storage.from('avatars').remove(paths)
      }
      await supabase.from('profiles').update({ avatar_url: null }).eq('id', currentUser.id)
      const img    = document.getElementById('profileAvatarImg')
      const letter = document.getElementById('profileAvatar')
      if (img)    { img.src = ''; img.style.display = 'none' }
      if (letter) letter.style.display = 'flex'
      updateUserUI()
    }
  }, 50)

  const username = currentUser.user_metadata?.username || currentUser.email.split('@')[0]
  const email = currentUser.email

  const avatar = document.getElementById('profileAvatar')
  if (avatar) { avatar.textContent = username.charAt(0).toUpperCase(); avatar.style.display = 'flex' }
  const avatarImg = document.getElementById('profileAvatarImg')
  if (avatarImg) {
    const url = await getAvatarUrl(currentUser.id)
    if (url) {
      avatarImg.src = url; avatarImg.style.display = 'block'; avatarImg.style.cursor = 'pointer'
      avatarImg.onclick = () => openPhotoPreview(url, username)
      if (avatar) avatar.style.display = 'none'
    } else {
      avatarImg.style.display = 'none'
      if (avatar) avatar.style.display = 'flex'
    }
  }
  const nameEl = document.getElementById('profileName')
  const isCreator = currentUser.email === 'davlatovsurob@gmail.com'
  if (nameEl) {
    nameEl.innerHTML = username + (isCreator
      ? ' <span title="Создатель сайта" style="display:inline-flex;align-items:center;gap:3px;background:linear-gradient(135deg,#f59e0b,#d97706);color:white;font-size:0.65rem;font-weight:700;padding:2px 8px;border-radius:20px;vertical-align:middle">👑 Разработчик</span>'
      : '')
  }
  const emailEl = document.getElementById('profileEmail')
  if (emailEl) emailEl.textContent = email

  const { data: allData } = await getUserResults(currentUser.id)
  const profileContent = document.getElementById('profileContent')
  if (!profileContent) return

  // Separate duel records — they use a different scoring context
  const data = (allData || []).filter(r => r.section !== 'duel')

  if (!data || data.length === 0) {
    profileContent.innerHTML = '<p class="text-slate-400 text-sm text-center py-4">Пройдите тесты чтобы увидеть статистику!</p><div id="duelHistoryBlock"></div>'
    // Still load duel history even if no regular tests
    const block = document.getElementById('duelHistoryBlock')
    if (block) {
      const { data: duels } = await getDuelHistory(currentUser.id)
      if (duels && duels.length > 0) block.innerHTML = '<p class="text-slate-400 text-sm text-center">⚔️ У вас есть история дуэлей — см. ниже</p>'
    }
    return
  }

  const sections = ['integrals', 'derivatives', 'series', 'limits']
  const { badges, total, best, avg } = computeBadges(data, sections)
  const level = getUserLevel(total, avg)

  // Лучшие результаты по разделам
  const sectionLabelsLocal = { integrals: 'Интегралы', derivatives: 'Производные', series: 'Ряды', limits: 'Пределы' }
  const bestResults = sections.map(sec => {
    const secData = data.filter(r => r.section === sec)
    if (!secData.length) return null
    const b = secData.reduce((a, b) => a.score > b.score ? a : b)
    return { ...b, sectionName: sectionLabelsLocal[sec] || sec }
  }).filter(Boolean)

  // Место в рейтинге
  const { data: lbData } = await getLeaderboard(null, null)
  let compareHTML = ''
  if (lbData && lbData.length > 0) {
    const allAvgs = {}
    lbData.forEach(r => {
      if (!allAvgs[r.username]) allAvgs[r.username] = []
      allAvgs[r.username].push(r.score)
    })
    const rankings = Object.entries(allAvgs)
      .map(([name, scores]) => ({ name, avg: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) }))
      .sort((a, b) => b.avg - a.avg)
    const myRank = rankings.findIndex(r => r.name === username) + 1
    compareHTML = `
      <h3 class="text-lg font-bold text-slate-200 mb-3">📊 Место в рейтинге</h3>
      <div class="rounded-xl p-4 mb-4" style="background:rgba(59,130,246,0.1);border:1px solid rgba(59,130,246,0.2)">
        <div class="text-center mb-3">
          <div class="text-3xl font-bold text-blue-400">#${myRank}</div>
          <div class="text-slate-400 text-sm">из ${rankings.length} пользователей</div>
        </div>
        <div class="space-y-2">
          ${rankings.slice(0, 3).map((r, i) => `
            <div class="flex justify-between items-center p-2 rounded-lg ${r.name === username ? 'bg-blue-900/40 font-bold' : 'bg-slate-800/40'}">
              <span class="text-slate-200">${['🥇','🥈','🥉'][i]} ${r.name}</span>
              <span class="text-blue-400 font-semibold">${r.avg}%</span>
            </div>`).join('')}
          ${myRank > 3 ? `
            <div class="text-center text-slate-500 text-xs">...</div>
            <div class="flex justify-between items-center p-2 rounded-lg bg-blue-900/40 font-bold">
              <span class="text-slate-200">#${myRank} ${username}</span>
              <span class="text-blue-400 font-semibold">${avg}%</span>
            </div>` : ''}
        </div>
      </div>`
  }

  // График прогресса
  const recent = [...data].slice(0, 7).reverse()
  const chartBars = recent.map(r => {
    const h = Math.round((r.score / 100) * 80)
    const color = r.score >= 70 ? '#10b981' : r.score >= 50 ? '#f59e0b' : '#ef4444'
    const date = new Date(r.created_at).toLocaleDateString('ru', { day: 'numeric', month: 'short' })
    return `<div class="flex flex-col items-center gap-1" style="flex:1">
      <div class="text-xs font-bold" style="color:${color}">${r.score}%</div>
      <div style="height:${h}px;width:100%;background:${color};border-radius:4px 4px 0 0;min-height:4px"></div>
      <div style="font-size:0.6rem;color:#64748b">${date}</div>
    </div>`
  }).join('')

  profileContent.innerHTML = `
    <h3 class="text-lg font-bold text-slate-200 mb-3">🎮 Уровень</h3>
    <div class="rounded-xl p-4 mb-4" style="background:linear-gradient(135deg,${level.color}18,${level.color}08);border:1.5px solid ${level.color}30">
      <div class="flex items-center gap-3 mb-2">
        <span style="font-size:2rem">${level.icon}</span>
        <div>
          <div class="font-bold text-lg" style="color:${level.color}">${level.name}</div>
          ${level.next ? `<div class="text-xs text-slate-400">Следующий: ${level.next}</div>` : '<div class="text-xs text-slate-400">Максимальный уровень!</div>'}
        </div>
      </div>
      <div style="height:8px;background:#334155;border-radius:4px;overflow:hidden">
        <div style="height:100%;width:${level.progress}%;background:${level.color};border-radius:4px;transition:width 0.5s"></div>
      </div>
    </div>

    <h3 class="text-lg font-bold text-slate-200 mb-3">📊 Статистика</h3>
    <div class="grid grid-cols-3 gap-3 mb-4">
      <div class="profile-stat"><div class="profile-stat-value">${total}</div><div class="profile-stat-label">Тестов</div></div>
      <div class="profile-stat"><div class="profile-stat-value">${best}%</div><div class="profile-stat-label">Лучший</div></div>
      <div class="profile-stat"><div class="profile-stat-value">${avg}%</div><div class="profile-stat-label">Средний</div></div>
    </div>

    ${recent.length > 1 ? `
    <h3 class="text-lg font-bold text-slate-200 mb-3">📈 График прогресса</h3>
    <div class="rounded-xl p-4 mb-4" style="background:rgba(30,41,59,0.6)">
      <div class="flex items-end gap-1" style="height:100px">${chartBars}</div>
    </div>` : ''}

    <h3 class="text-lg font-bold text-slate-200 mb-3">🏅 Достижения</h3>
    <div class="flex flex-wrap gap-2 mb-4">
      ${badges.length ? badges.map(b => `<span class="badge ${b.cls}">${b.icon} ${b.text}</span>`).join('') : '<p class="text-slate-400 text-sm">Пройдите больше тестов!</p>'}
    </div>

    ${compareHTML}

    <h3 class="text-lg font-bold text-slate-200 mb-3">⭐ Лучшие результаты</h3>
    <div class="space-y-2">
      ${bestResults.map(r => `
        <div class="flex justify-between items-center p-3 rounded-xl" style="background:rgba(30,41,59,0.6)">
          <div>
            <span class="font-semibold text-slate-200">${r.sectionName}</span>
            <span class="text-slate-400 text-sm ml-2">${r.difficulty==='easy'?'Лёгкий':r.difficulty==='medium'?'Средний':'Сложный'}</span>
          </div>
          <span class="font-bold text-lg ${r.score>=70?'text-green-400':'text-red-400'}">${r.score}%</span>
        </div>`).join('') || '<p class="text-slate-400 text-sm">Нет данных</p>'}
    </div>
    <div id="duelHistoryBlock"></div>
  `

  // Load duel history asynchronously and inject into placeholder
  const block = document.getElementById('duelHistoryBlock')
  if (block) {
    const { data: duels } = await getDuelHistory(currentUser.id)
    if (duels && duels.length > 0) {
      const rows = duels.map(d => {
        const date  = new Date(d.created_at).toLocaleDateString('ru', { day:'numeric', month:'short' })
        const rIcon = d.result==='win'?'🏆':d.result==='draw'?'🤝':d.result==='loss'?'💪':'❓'
        const rText = d.result==='win'?'Победа':d.result==='draw'?'Ничья':d.result==='loss'?'Поражение':'Ожидание'
        const rClr  = d.result==='win'?'#10b981':d.result==='draw'?'#f59e0b':'#ef4444'
        const opp   = d.opponent ? `vs <b>${d.opponent.username}</b> (${d.opponent.score}%)` : 'vs <span style="color:#64748b">???</span>'
        return `
          <div style="display:flex;justify-content:space-between;align-items:center;
            padding:10px 14px;border-radius:12px;background:rgba(139,92,246,0.1);
            border:1px solid rgba(139,92,246,0.2);margin-bottom:6px">
            <div>
              <div style="font-weight:600;color:#e2e8f0;font-size:0.9rem">${rIcon} ${rText}</div>
              <div style="font-size:0.78rem;color:#94a3b8;margin-top:2px">${opp} · ${date}</div>
            </div>
            <div style="text-align:right">
              <div style="font-weight:700;font-size:1.1rem;color:${rClr}">${d.score}%</div>
              <div style="font-size:0.72rem;color:#64748b">${d.correct_answers}/${d.total_questions}</div>
            </div>
          </div>`
      }).join('')
      block.innerHTML = `
        <h3 class="text-lg font-bold text-slate-200 mb-3" style="margin-top:1rem">⚔️ Дуэли</h3>
        ${rows}`
    }
  }
}

// ── Статистика ────────────────────────────────────────────
let _chartScore = null, _chartSection = null

window.showStatistics = async function() {
  showPage('statisticsPage')
  if (!currentUser) return

  const { data: allData } = await getUserResults(currentUser.id)
  const data = (allData || []).filter(r => r.section !== 'duel')
  if (!data || data.length === 0) {
    document.getElementById('testsHistory').innerHTML = '<p class="text-gray-500 text-center py-4">История пуста</p>'
    document.getElementById('statsChartsContainer').innerHTML = ''
    return
  }

  const mainData = data.filter(r => r.section !== 'daily')
  const total = data.length
  const best  = Math.max(...data.map(r => r.score))
  const avg   = Math.round(data.reduce((s,r) => s+r.score, 0) / total)

  document.getElementById('totalTests').textContent = total
  document.getElementById('bestScore').textContent  = best + '%'
  document.getElementById('averageScore').textContent = avg + '%'

  // Прогресс-бары по разделам
  const sections = ['integrals','derivatives','series','limits']
  sections.forEach(sec => {
    const sd  = data.filter(r => r.section === sec)
    const sav = sd.length ? Math.round(sd.reduce((s,r)=>s+r.score,0)/sd.length) : 0
    const el  = document.getElementById(`${sec}Progress`)
    const bar = document.getElementById(`${sec}ProgressBar`)
    if (el)  el.textContent  = sav + '%'
    if (bar) bar.style.width = sav + '%'
  })

  // ── Chart.js ──────────────────────────────────────────
  const container = document.getElementById('statsChartsContainer')
  container.innerHTML = `
    <h3 class="text-xl font-bold text-gray-800 mb-3">📈 Динамика результатов</h3>
    <div style="position:relative;height:200px;margin-bottom:1.5rem">
      <canvas id="scoreChart"></canvas>
    </div>
    <h3 class="text-xl font-bold text-gray-800 mb-3">📊 Средний балл по разделам</h3>
    <div style="position:relative;height:180px;margin-bottom:1.5rem">
      <canvas id="sectionChart"></canvas>
    </div>`

  // Destroy old charts if they exist
  if (_chartScore)   { _chartScore.destroy();   _chartScore   = null }
  if (_chartSection) { _chartSection.destroy(); _chartSection = null }

  // Line chart: last 20 results (chronological)
  const recent = [...mainData].reverse().slice(-20)
  _chartScore = new Chart(document.getElementById('scoreChart'), {
    type: 'line',
    data: {
      labels: recent.map((r,i) => {
        const d = new Date(r.created_at)
        return `${d.getDate()}.${String(d.getMonth()+1).padStart(2,'0')}`
      }),
      datasets: [{
        label: 'Результат (%)',
        data: recent.map(r => r.score),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59,130,246,0.12)',
        tension: 0.35,
        fill: true,
        pointBackgroundColor: recent.map(r => r.score >= 70 ? '#10b981' : r.score >= 50 ? '#f59e0b' : '#ef4444'),
        pointRadius: 5,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { min: 0, max: 100, ticks: { callback: v => v + '%', font: { size: 11 } }, grid: { color: 'rgba(0,0,0,0.06)' } },
        x: { ticks: { font: { size: 10 } }, grid: { display: false } }
      }
    }
  })

  // Bar chart: avg score by section
  const secLabels  = ['Интегралы','Производные','Ряды','Пределы']
  const secColors  = ['#3b82f6','#10b981','#f43f5e','#8b5cf6']
  const secAvgs    = sections.map(sec => {
    const sd = data.filter(r => r.section === sec)
    return sd.length ? Math.round(sd.reduce((s,r)=>s+r.score,0)/sd.length) : 0
  })
  _chartSection = new Chart(document.getElementById('sectionChart'), {
    type: 'bar',
    data: {
      labels: secLabels,
      datasets: [{
        data: secAvgs,
        backgroundColor: secColors.map(c => c + '33'),
        borderColor: secColors,
        borderWidth: 2,
        borderRadius: 6,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { min: 0, max: 100, ticks: { callback: v => v + '%', font: { size: 11 } }, grid: { color: 'rgba(0,0,0,0.06)' } },
        x: { ticks: { font: { size: 11 } }, grid: { display: false } }
      }
    }
  })

  // История
  const sLabel = { integrals:'Интегралы', derivatives:'Производные', series:'Ряды', limits:'Пределы', daily:'🌟 Ежедневный' }
  document.getElementById('testsHistory').innerHTML = data.slice(0,10).map(r => `
    <div class="bg-gray-50 rounded-lg p-4">
      <div class="flex justify-between items-start">
        <div>
          <h4 class="font-semibold">${sLabel[r.section]||r.section} — ${r.difficulty==='easy'?'Лёгкий':r.difficulty==='medium'?'Средний':'Сложный'}</h4>
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
// Система очков: каждый правильный ответ приносит очки в зависимости от сложности
// easy=1 · medium=2 · hard=3
// Берётся лучший результат на каждой уникальной комбинации секция+сложность.
// Итоговый рейтинг = сумма очков по всем комбинациям.
// Это честно: нужно играть больше и сложнее, чтобы занять высокое место.
const DIFF_POINTS = { easy: 1, medium: 2, hard: 3 }
const SECTION_ICONS = { integrals: '∫', derivatives: "f'(x)", series: '∑', limits: 'lim' }
const SECTION_COLORS = { integrals: '#3b82f6', derivatives: '#10b981', series: '#f43f5e', limits: '#8b5cf6' }

function calcRatingPoints(row) {
  return (row.correct_answers || 0) * (DIFF_POINTS[row.difficulty] || 1)
}

window.showLeaderboard = async function() {
  showPage('leaderboardPage')
  const container = document.getElementById('leaderboardList')
  container.innerHTML = '<p class="text-center py-8" style="color:var(--text-muted)">Загрузка...</p>'

  const sectionFilter   = document.getElementById('lbSection')?.value   || null
  const diffFilter = document.getElementById('lbDifficulty')?.value || null

  const { data } = await getLeaderboard(sectionFilter, diffFilter)
  if (!data || data.length === 0) {
    container.innerHTML = '<p class="text-center py-8" style="color:var(--text-muted)">Пока нет результатов</p>'
    return
  }

  // Группируем все попытки по username → section_difficulty → берём лучшую
  const userMap = {}
  data.forEach(r => {
    const name = r.username || 'Аноним'
    if (!userMap[name]) userMap[name] = {}
    const key = `${r.section}_${r.difficulty}`
    const pts = calcRatingPoints(r)
    const prev = userMap[name][key]
    // «Лучшая» = больше очков, при равенстве — выше процент
    if (!prev || pts > calcRatingPoints(prev) || (pts === calcRatingPoints(prev) && (r.score || 0) > (prev.score || 0))) {
      userMap[name][key] = r
    }
  })

  // Считаем итоговый рейтинг каждого пользователя
  const rankings = Object.entries(userMap).map(([username, comboMap]) => {
    const combos    = Object.values(comboMap)
    const totalPts  = combos.reduce((s, r) => s + calcRatingPoints(r), 0)
    const totalCorr = combos.reduce((s, r) => s + (r.correct_answers || 0), 0)
    const bestPct   = Math.max(...combos.map(r => r.score || 0))
    const sections  = [...new Set(combos.map(r => r.section))]
    const maxDiff   = combos.some(r => r.difficulty === 'hard')   ? 'hard'
                    : combos.some(r => r.difficulty === 'medium') ? 'medium' : 'easy'
    return { username, totalPts, totalCorr, bestPct, sections, maxDiff, combos: combos.length }
  }).sort((a, b) =>
    b.totalPts - a.totalPts ||    // 1й критерий: больше очков
    b.totalCorr - a.totalCorr ||  // 2й: больше правильных ответов
    b.bestPct - a.bestPct         // 3й: лучший процент
  )

  const medals = ['🥇','🥈','🥉']
  const diffLabel = { easy: '🟢 Лёгкий', medium: '🟡 Средний', hard: '🔴 Сложный' }
  const rowBg = [
    'background:linear-gradient(135deg,rgba(234,179,8,0.12),rgba(234,179,8,0.04));border:1px solid rgba(234,179,8,0.25)',
    'background:linear-gradient(135deg,rgba(148,163,184,0.12),rgba(148,163,184,0.04));border:1px solid rgba(148,163,184,0.2)',
    'background:linear-gradient(135deg,rgba(249,115,22,0.12),rgba(249,115,22,0.04));border:1px solid rgba(249,115,22,0.2)',
  ]

  container.innerHTML = rankings.map((r, i) => {
    const sectionBadges = r.sections.map(s =>
      `<span style="display:inline-block;padding:1px 8px;border-radius:99px;font-size:0.7rem;font-weight:700;
       background:${SECTION_COLORS[s]}22;color:${SECTION_COLORS[s]};border:1px solid ${SECTION_COLORS[s]}44;
       font-family:'Playfair Display',serif">${SECTION_ICONS[s] || s}</span>`
    ).join(' ')

    const isAdmin = r.username === 'Suhrob'
    const crown = isAdmin ? ' <span style="background:linear-gradient(135deg,#f59e0b,#d97706);color:white;font-size:0.6rem;font-weight:700;padding:1px 6px;border-radius:10px">👑</span>' : ''
    const rowStyle = i < 3 ? rowBg[i] : 'background:var(--bg-card);border:1px solid var(--border)'

    return `
    <div style="${rowStyle};border-radius:0.875rem;padding:0.875rem 1rem;margin-bottom:0.5rem;display:flex;align-items:center;gap:0.75rem">
      <span style="font-size:1.6rem;width:2rem;text-align:center;flex-shrink:0">${medals[i] || `<span style="font-size:0.9rem;color:var(--text-muted)">${i+1}</span>`}</span>
      <div style="flex:1;min-width:0">
        <div style="font-weight:700;color:var(--text-main);display:flex;align-items:center;gap:4px;flex-wrap:wrap">
          ${r.username}${crown}
          <span style="font-size:0.7rem;font-weight:500;color:var(--text-muted);margin-left:2px">${diffLabel[r.maxDiff]}</span>
        </div>
        <div style="margin-top:3px;display:flex;flex-wrap:wrap;gap:3px">${sectionBadges}</div>
        <div style="font-size:0.72rem;color:var(--text-muted);margin-top:3px">
          ${r.combos} комбо · ${r.totalCorr} правильных ответов
        </div>
      </div>
      <div style="text-align:right;flex-shrink:0">
        <div style="font-size:1.4rem;font-weight:800;color:${i===0?'#f59e0b':i===1?'#94a3b8':i===2?'#f97316':'var(--text-main)'}">
          ${r.totalPts}<span style="font-size:0.7rem;font-weight:500;color:var(--text-muted)"> pts</span>
        </div>
        <div style="font-size:0.72rem;color:var(--text-muted)">лучший: ${r.bestPct}%</div>
      </div>
    </div>`
  }).join('')
}
window.toggleTheory = function(id) { document.getElementById(id).classList.toggle('hidden') }

window.toggleTheme = function() {
  const isDark = document.documentElement.classList.toggle('dark')
  localStorage.setItem('theme', isDark ? 'dark' : 'light')
  document.getElementById('themeToggle').textContent = isDark ? '☀️' : '🌙'
}

// ── ДУЭЛЬ ──────────────────────────────────────────────────
let _duelChannel = null
let _duelCode = ''
let _duelRole = ''        // 'host' | 'guest'
let _duelMyScore = null
let _duelOpponentScore = null
let _duelOpponentName = ''
let _duelMyName = ''
let _duelSection = 'mixed'   // выбор раздела
let _duelDiff = 'medium'     // выбор уровня
let _duelIsRematchRequester = false

function generateDuelCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)]
  return code
}

function getDuelQuestions(code, section = 'mixed', difficulty = 'medium') {
  // Build pool depending on section/difficulty choice
  const poolsBySection = {
    integrals:   { easy: easyIntegralsQuestions,   medium: mediumIntegralsQuestions,   hard: hardIntegralsQuestions },
    derivatives: { easy: easyDerivativesQuestions, medium: mediumDerivativesQuestions, hard: hardDerivativesQuestions },
    series:      { easy: easySeriesQuestions,      medium: mediumSeriesQuestions,      hard: hardSeriesQuestions },
    limits:      { easy: easyLimitsQuestions,      medium: mediumLimitsQuestions,      hard: hardLimitsQuestions },
  }
  let rawPool
  if (section === 'mixed') {
    rawPool = [
      ...poolsBySection.integrals[difficulty]   || [],
      ...poolsBySection.derivatives[difficulty] || [],
      ...poolsBySection.series[difficulty]      || [],
      ...poolsBySection.limits[difficulty]      || [],
    ]
  } else {
    rawPool = poolsBySection[section]?.[difficulty] || poolsBySection.integrals.medium
  }
  const pool = rawPool.flat().filter(q => q && q.options && q.options.length === 4)

  const seed = hashCode(code + '_duel_' + section + '_' + difficulty)
  const rng = mulberry32(seed)
  const shuffled = [...pool]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  // Shuffle answer options with same seed so both players see identical order
  return shuffled.slice(0, 10).map(q => {
    const order = [0,1,2,3]
    for (let i = 3; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]]
    }
    return { ...q, options: order.map(k => q.options[k]), correct: order.indexOf(q.correct) }
  })
}

function _duelSetStatus(panelId, msg) {
  const el = document.getElementById(panelId)
  if (el) el.innerHTML = msg
}

window.showDuelModal = function() {
  _duelMyScore = null; _duelOpponentScore = null
  _duelCode = ''; _duelRole = ''
  if (_duelChannel) { _duelChannel.unsubscribe(); _duelChannel = null }
  document.getElementById('duelCodeDisplay').textContent = '——————'
  document.getElementById('duelCreateStatus').textContent = 'Нажми кнопку чтобы создать дуэль'
  document.getElementById('duelCreateBtn').disabled = false
  document.getElementById('duelCreateBtn').textContent = '⚔️ Создать дуэль'
  const ji = document.getElementById('duelJoinInput')
  if (ji) ji.value = ''
  document.getElementById('duelJoinStatus').textContent = ''
  document.getElementById('duelCreatePanel').style.display = ''
  document.getElementById('duelJoinPanel').style.display = 'none'
  document.getElementById('duelLobby').style.display = 'none'
  document.getElementById('duelTabsBar').style.display = ''
  // Restore pickers to saved state
  _refreshDuelPickers()
  showDuelTab('create')
  const modal = document.getElementById('duelModal')
  modal.style.display = 'flex'
}

function _refreshDuelPickers() {
  document.querySelectorAll('#duelSectPicker .duel-pick-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.sect === _duelSection)
  })
  document.querySelectorAll('#duelDiffPicker .duel-pick-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.diff === _duelDiff)
  })
}

window.setDuelSection = function(sect) {
  _duelSection = sect
  _refreshDuelPickers()
}
window.setDuelDiff = function(diff) {
  _duelDiff = diff
  _refreshDuelPickers()
}

window.closeDuelModal = function() {
  if (_duelChannel) { _duelChannel.unsubscribe(); _duelChannel = null }
  document.getElementById('duelModal').style.display = 'none'
}

window.showDuelTab = function(tab) {
  document.getElementById('duelCreatePanel').style.display = tab === 'create' ? '' : 'none'
  document.getElementById('duelJoinPanel').style.display = tab === 'join' ? '' : 'none'
  document.getElementById('duelTabCreate').style.background = tab === 'create' ? 'rgba(139,92,246,0.8)' : 'transparent'
  document.getElementById('duelTabCreate').style.color = tab === 'create' ? 'white' : '#94a3b8'
  document.getElementById('duelTabJoin').style.background = tab === 'join' ? 'rgba(139,92,246,0.8)' : 'transparent'
  document.getElementById('duelTabJoin').style.color = tab === 'join' ? 'white' : '#94a3b8'
}

window.copyDuelCode = function() {
  if (_duelCode) {
    navigator.clipboard.writeText(_duelCode).then(() => {
      const el = document.getElementById('duelCodeDisplay')
      const orig = el.textContent
      el.textContent = '✓ Скопировано!'
      setTimeout(() => { el.textContent = orig }, 1500)
    })
  }
}

window.createDuel = async function() {
  if (!currentUser) { alert('Войди в аккаунт, чтобы создать дуэль'); return }
  const btn = document.getElementById('duelCreateBtn')
  btn.disabled = true; btn.textContent = '⏳ Создаём…'

  _duelCode = generateDuelCode()
  _duelRole = 'host'
  _duelMyName = currentUser.user_metadata?.username || currentUser.email.split('@')[0]
  document.getElementById('duelCodeDisplay').textContent = _duelCode
  _duelSetStatus('duelCreateStatus', '⏳ Ожидаем соперника…')

  if (_duelChannel) { _duelChannel.unsubscribe(); _duelChannel = null }
  _duelChannel = supabase.channel('duel:' + _duelCode, { config: { broadcast: { self: false } } })

  _duelChannel
    .on('broadcast', { event: 'join' }, ({ payload }) => {
      _duelOpponentName = payload.name
      _duelSetStatus('duelCreateStatus', `✅ ${_duelOpponentName} подключился! Начинаем…`)
      // Broadcast start with section/difficulty so guest uses same pool
      _duelChannel.send({ type: 'broadcast', event: 'start', payload: { code: _duelCode, section: _duelSection, difficulty: _duelDiff } })
      _beginDuelCountdown()
    })
    .on('broadcast', { event: 'score' }, ({ payload }) => {
      _duelOpponentScore = payload.score
      _duelOpponentName = payload.name || _duelOpponentName
      _checkDuelComplete()
    })
    .on('broadcast', { event: 'rematch_request' }, ({ payload }) => { _showRematchRequest(payload.name) })
    .on('broadcast', { event: 'rematch_accept' },  () => { _onRematchAccepted() })
    .on('broadcast', { event: 'rematch_start' },   ({ payload }) => { _onRematchStart(payload) })
    .on('broadcast', { event: 'rematch_decline' }, () => {
      const btn = document.getElementById('rematchBtn')
      if (btn) { btn.textContent = '❌ Соперник отказался'; btn.disabled = true }
    })
    .subscribe()
}

window.joinDuel = async function() {
  if (!currentUser) { alert('Войди в аккаунт, чтобы принять участие'); return }
  const input = document.getElementById('duelJoinInput')
  const code = input.value.trim().toUpperCase()
  if (code.length < 4) { _duelSetStatus('duelJoinStatus', '❌ Введи код (минимум 4 символа)'); return }

  _duelCode = code
  _duelRole = 'guest'
  _duelMyName = currentUser.user_metadata?.username || currentUser.email.split('@')[0]
  _duelSetStatus('duelJoinStatus', '⏳ Подключаемся…')

  if (_duelChannel) { _duelChannel.unsubscribe(); _duelChannel = null }
  _duelChannel = supabase.channel('duel:' + _duelCode, { config: { broadcast: { self: false } } })

  _duelChannel
    .on('broadcast', { event: 'start' }, ({ payload }) => {
      // Receive host's section/difficulty choice
      if (payload?.section) _duelSection = payload.section
      if (payload?.difficulty) _duelDiff = payload.difficulty
      _beginDuelCountdown()
    })
    .on('broadcast', { event: 'score' }, ({ payload }) => {
      _duelOpponentScore = payload.score
      _duelOpponentName = payload.name || _duelOpponentName
      _checkDuelComplete()
    })
    .on('broadcast', { event: 'rematch_request' }, ({ payload }) => { _showRematchRequest(payload.name) })
    .on('broadcast', { event: 'rematch_accept' },  () => { _onRematchAccepted() })
    .on('broadcast', { event: 'rematch_start' },   ({ payload }) => { _onRematchStart(payload) })
    .on('broadcast', { event: 'rematch_decline' }, () => {
      const btn = document.getElementById('rematchBtn')
      if (btn) { btn.textContent = '❌ Соперник отказался'; btn.disabled = true }
    })
    .subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        // Tell host we joined
        _duelChannel.send({ type: 'broadcast', event: 'join', payload: { name: _duelMyName } })
        _duelSetStatus('duelJoinStatus', `✅ Подключился! Ожидаем старта…`)
        // Hide tabs, show lobby
        document.getElementById('duelJoinPanel').style.display = 'none'
        document.getElementById('duelTabsBar').style.display = 'none'
        document.getElementById('duelLobby').style.display = ''
        document.getElementById('duelLobbyMsg').textContent = 'Подключился! Ожидаем старта…'
      }
    })
}

function _beginDuelCountdown() {
  document.getElementById('duelCreatePanel').style.display = 'none'
  document.getElementById('duelJoinPanel').style.display = 'none'
  document.getElementById('duelTabsBar').style.display = 'none'
  document.getElementById('duelLobby').style.display = ''
  const lobbyMsg = document.getElementById('duelLobbyMsg')
  const countEl = document.getElementById('duelStartCountdown')
  lobbyMsg.textContent = 'Соперник найден! Начинаем через…'
  countEl.style.display = ''
  let c = 3
  countEl.textContent = c
  const iv = setInterval(() => {
    c--
    if (c > 0) { countEl.textContent = c }
    else {
      clearInterval(iv)
      document.getElementById('duelModal').style.display = 'none'
      _beginDuelTest()
    }
  }, 1000)
}

function _beginDuelTest() {
  const questions = getDuelQuestions(_duelCode, _duelSection, _duelDiff)
  currentSection = 'duel'
  currentDifficulty = _duelDiff
  currentTest = questions
  currentQuestionIndex = 0
  userAnswers = new Array(questions.length).fill(null)
  isStudyMode = false
  _duelMyScore = null; _duelOpponentScore = null
  const timePerQ = _duelDiff === 'easy' ? 60 : _duelDiff === 'hard' ? 120 : 90
  timeRemaining = questions.length * timePerQ
  timerInitialTime = timeRemaining
  timerStartTime = null
  clearTestState()
  showPage('testPage')
  // Set test header info (same as startTest does)
  document.getElementById('totalQuestions').textContent = questions.length
  const sectNames = { mixed:'Все разделы', integrals:'Интегралы', derivatives:'Производные', series:'Ряды', limits:'Пределы' }
  const diffName = _duelDiff === 'easy' ? 'Лёгкий' : _duelDiff === 'hard' ? 'Сложный' : 'Средний'
  document.getElementById('testTitle').textContent = `⚔️ Дуэль: ${sectNames[_duelSection] || 'Смешанный'}`
  document.getElementById('difficultyLabel').textContent = `Уровень: ${diffName} · Дуэль 1v1`
  const timerEl = document.getElementById('timerDisplay')
  if (timerEl) timerEl.style.display = ''
  displayQuestion()
  startTimer()
}

function _broadcastDuelScore(percentage) {
  if (_duelChannel) {
    _duelChannel.send({
      type: 'broadcast',
      event: 'score',
      payload: { score: percentage, name: _duelMyName }
    })
  }
}

function _checkDuelComplete() {
  if (_duelMyScore !== null && _duelOpponentScore !== null) {
    _showDuelResults()
  }
}

window.requestRematch = function() {
  _duelIsRematchRequester = true
  const btn = document.getElementById('rematchBtn')
  if (btn) { btn.textContent = '⏳ Ожидаем ответа…'; btn.disabled = true }
  _duelChannel?.send({ type: 'broadcast', event: 'rematch_request', payload: { name: _duelMyName } })
}

window.acceptRematch = function() {
  _duelIsRematchRequester = false
  document.getElementById('rematchRequestBanner').style.display = 'none'
  const btn = document.getElementById('rematchBtn')
  if (btn) { btn.textContent = '⏳ Начинаем…'; btn.disabled = true }
  _duelChannel?.send({ type: 'broadcast', event: 'rematch_accept' })
}

window.declineRematch = function() {
  document.getElementById('rematchRequestBanner').style.display = 'none'
  _duelChannel?.send({ type: 'broadcast', event: 'rematch_decline' })
}

function _showRematchRequest(name) {
  const banner = document.getElementById('rematchRequestBanner')
  if (!banner) return
  document.getElementById('rematchRequesterName').textContent = `⚔️ ${name} предлагает реванш!`
  banner.style.display = 'block'
  document.getElementById('duelResultsModal').style.display = 'flex'
}

// Called by both players when rematch_accept is received — only requester acts
function _onRematchAccepted() {
  if (!_duelIsRematchRequester) return
  _duelIsRematchRequester = false
  const newCode = generateDuelCode()
  _duelCode = newCode
  _duelMyScore = null; _duelOpponentScore = null
  _duelChannel.send({ type: 'broadcast', event: 'rematch_start', payload: { code: newCode, section: _duelSection, difficulty: _duelDiff } })
  document.getElementById('duelResultsModal').style.display = 'none'
  _beginDuelCountdown()
}

// Called by both players when rematch_start is received — only accepter acts
function _onRematchStart(payload) {
  if (_duelIsRematchRequester) return
  _duelCode = payload.code
  if (payload.section) _duelSection = payload.section
  if (payload.difficulty) _duelDiff = payload.difficulty
  _duelMyScore = null; _duelOpponentScore = null
  document.getElementById('duelResultsModal').style.display = 'none'
  _beginDuelCountdown()
}

function _showDuelResults() {
  const modal = document.getElementById('duelResultsModal')
  const emojiEl = document.getElementById('duelResultsEmoji')
  const titleEl = document.getElementById('duelResultsTitle')
  const scoresEl = document.getElementById('duelResultsScores')

  // Reset rematch UI
  const rematchBtn = document.getElementById('rematchBtn')
  if (rematchBtn) { rematchBtn.textContent = '🔄 Реванш!'; rematchBtn.disabled = false }
  const rematchBanner = document.getElementById('rematchRequestBanner')
  if (rematchBanner) rematchBanner.style.display = 'none'

  let emoji, title
  if (_duelMyScore > _duelOpponentScore) {
    emoji = '🏆'; title = 'Ты победил!'
  } else if (_duelMyScore < _duelOpponentScore) {
    emoji = '💪'; title = 'Соперник победил — реванш?'
  } else {
    emoji = '🤝'; title = 'Ничья!'
  }
  emojiEl.textContent = emoji
  titleEl.textContent = title

  const card = (name, score, highlight) => `
    <div style="flex:1;min-width:120px;padding:1rem;border-radius:14px;
      background:${highlight ? 'rgba(139,92,246,0.2)' : 'rgba(15,23,42,0.8)'};
      border:1.5px solid ${highlight ? 'rgba(139,92,246,0.5)' : 'rgba(51,65,85,0.5)'}">
      <div style="font-size:0.8rem;color:#94a3b8;margin-bottom:4px">${name}</div>
      <div style="font-size:2rem;font-weight:700;color:${score>=70?'#10b981':'#f59e0b'}">${score}%</div>
    </div>`
  scoresEl.innerHTML =
    card(_duelMyName + ' (ты)', _duelMyScore, _duelMyScore >= _duelOpponentScore) +
    card(_duelOpponentName || 'Соперник', _duelOpponentScore, _duelOpponentScore > _duelMyScore)

  modal.style.display = 'flex'
}

// ── Навигационное меню (гамбургер) ──────────────────────
let _navOpen = false
window.toggleNavMenu = function() {
  _navOpen = !_navOpen
  const menu = document.getElementById('navMenu')
  const btn = document.getElementById('menuBtn')
  menu.style.display = _navOpen ? 'block' : 'none'
  btn.textContent = _navOpen ? '✕' : '☰'
  btn.style.color = _navOpen ? '#60a5fa' : ''
}
window.closeNavMenu = function() {
  _navOpen = false
  const menu = document.getElementById('navMenu')
  if (menu) menu.style.display = 'none'
  const btn = document.getElementById('menuBtn')
  if (btn) { btn.textContent = '☰'; btn.style.color = '' }
}
// Close menu when clicking outside
document.addEventListener('click', e => {
  if (_navOpen && !e.target.closest('#navMenu') && !e.target.closest('#menuBtn')) {
    window.closeNavMenu()
  }
})

// ── Глобальный доступ к функциям ────────────────────────
window.showForgotPassword = showForgotPassword
window.showLoginFromForgot = showLoginFromForgot
window.handleForgotPassword = handleForgotPassword
window.handleUpdatePassword = handleUpdatePassword
window.togglePasswordVisibility = togglePasswordVisibility
