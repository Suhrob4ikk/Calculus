import { st } from './state.js'

// ── Тема ─────────────────────────────────────────────────
export function applyTheme(dark) {
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

window.toggleTheme = function() {
  const isDark = document.documentElement.classList.toggle('dark')
  localStorage.setItem('theme', isDark ? 'dark' : 'light')
  document.body.classList.toggle('dark-theme', isDark)
  document.body.classList.toggle('light-theme', !isDark)
  syncSettingsBtns()
}

// ── Навигация между страницами ────────────────────────────
export function showPage(pageId) {
  const ls = document.getElementById('loadingScreen')
  if (ls) ls.remove()

  const pages = ['authPage','homePage','integralsSection','derivativesSection',
                 'seriesSection','limitsSection','odeSection','testPage','resultsPage','statisticsPage',
                 'leaderboardPage','profilePage','searchProfilesPage','viewProfilePage','updatePasswordPage',
                 'theoryPage']
  pages.forEach(p => {
    const el = document.getElementById(p)
    if (el) { el.classList.add('hidden'); el.style.display = 'none' }
  })
  const target = document.getElementById(pageId)
  if (target) {
    target.classList.remove('hidden')
    target.style.display = (pageId === 'authPage' || pageId === 'updatePasswordPage') ? 'flex' : 'block'
    try { sessionStorage.setItem('lastPage', pageId) } catch(e) {}
  }

  const noNavPages = ['authPage', 'updatePasswordPage']
  const showNav = !noNavPages.includes(pageId)
  const bottomNav  = document.getElementById('bottomNav')
  const menuBtn    = document.getElementById('menuBtn')
  const desktopNav = document.getElementById('desktopNav')
  if (bottomNav)  bottomNav.style.display  = showNav ? 'flex' : 'none'
  if (menuBtn)    menuBtn.style.display    = showNav ? '' : 'none'
  if (desktopNav) desktopNav.style.display = showNav ? '' : 'none'
  if (!showNav) window.closeNavMenu?.()

  // Подсветка активной вкладки — нижняя навигация
  const bnMap = {
    profilePage: 'bnProfile', homePage: 'bnHome',
    statisticsPage: 'bnStats', leaderboardPage: 'bnLeader',
    searchProfilesPage: 'bnPeople'
  }
  document.querySelectorAll('#bottomNav button').forEach(b => b.classList.remove('bn-active'))
  const active = bnMap[pageId]
  if (active) document.getElementById(active)?.classList.add('bn-active')

  // Мобильная кнопка «Назад»
  const PAGE_BACK = {
    integralsSection:   { label: '← Разделы',   fn: 'showHome()' },
    derivativesSection: { label: '← Разделы',   fn: 'showHome()' },
    seriesSection:      { label: '← Разделы',   fn: 'showHome()' },
    limitsSection:      { label: '← Разделы',   fn: 'showHome()' },
    odeSection:         { label: '← Разделы',   fn: 'showHome()' },
    theoryPage:         { label: '← К разделу', fn: 'backFromTheory()' },
    testPage:           { label: '← Выйти',     fn: 'exitTest()' },
    resultsPage:        { label: '← Главная',   fn: 'showHome()' },
    statisticsPage:     { label: '← Главная',   fn: 'showHome()' },
    leaderboardPage:    { label: '← Главная',   fn: 'showHome()' },
    profilePage:        { label: '← Главная',   fn: 'showHome()' },
    searchProfilesPage: { label: '← Главная',   fn: 'showHome()' },
    viewProfilePage:    window._viewProfileFrom === 'leaderboardPage'
      ? { label: '← Рейтинг', fn: 'showLeaderboard()' }
      : { label: '← Поиск',   fn: 'showSearchProfiles()' },
  }
  const mbb   = document.getElementById('mobileBackBar')
  const mbbtn = document.getElementById('mobileBackBtn')
  const back  = PAGE_BACK[pageId]
  if (mbb && mbbtn) {
    const isMobile = window.innerWidth <= 640
    if (back && isMobile) {
      mbbtn.textContent = back.label
      mbbtn.setAttribute('onclick', back.fn)
      mbb.style.display = 'flex'
      mbb.style.transform = 'translateY(0)'
      document.body.classList.add('has-back-bar')
    } else {
      mbb.style.display = 'none'
      document.body.classList.remove('has-back-bar')
    }
  }

  // Подсветка активной кнопки — десктоп-шапка
  const dhMap = {
    homePage: 'dhHome', statisticsPage: 'dhStats',
    leaderboardPage: 'dhLeader', searchProfilesPage: 'dhPeople'
  }
  document.querySelectorAll('#desktopNav .dh-nav-btn').forEach(b => b.classList.remove('dh-active'))
  const dhActive = dhMap[pageId]
  if (dhActive) document.getElementById(dhActive)?.classList.add('dh-active')

  // Боковая панель: видимость + активная кнопка
  const desktopSidebar = document.getElementById('desktopSidebar')
  if (desktopSidebar) desktopSidebar.style.display = showNav ? '' : 'none'

  const sbMap = {
    homePage:           'sbHome',
    integralsSection:   'sbHome',
    derivativesSection: 'sbHome',
    seriesSection:      'sbHome',
    limitsSection:      'sbHome',
    odeSection:         'sbHome',
    theoryPage:         'sbHome',
    testPage:           'sbHome',
    resultsPage:        'sbHome',
    statisticsPage:     'sbStats',
    leaderboardPage:    'sbLeader',
    searchProfilesPage: 'sbPeople',
    viewProfilePage:    window._viewProfileFrom === 'leaderboardPage' ? 'sbLeader' : 'sbPeople',
  }
  document.querySelectorAll('#desktopSidebar .sb-item').forEach(b => b.classList.remove('sb-active'))
  const sbActive = sbMap[pageId]
  if (sbActive) document.getElementById(sbActive)?.classList.add('sb-active')
}

export function updateUserUI() {
  if (!st.currentUser) return
  const username = st.currentUser.user_metadata?.username || st.currentUser.email.split('@')[0]
  const isCreator = st.currentUser.email === 'davlatovsurob@gmail.com'
  const el = document.getElementById('userGreeting')
  if (el) {
    el.innerHTML = `👤 ${username}` + (isCreator
      ? ' <span style="background:linear-gradient(135deg,#f59e0b,#d97706);color:white;font-size:0.6rem;font-weight:700;padding:1px 6px;border-radius:10px">👑</span>'
      : '')
  }
  const dhUsername = document.getElementById('dhUsername')
  const dhLetter   = document.getElementById('dhAvatarLetter')
  if (dhUsername) dhUsername.textContent = username
  if (dhLetter)   dhLetter.textContent   = username[0]?.toUpperCase() || '?'

  // Боковая панель — имя и аватар-буква
  const sbUsername = document.getElementById('sbUsername')
  const sbLetter   = document.getElementById('sbAvatarLetter')
  if (sbUsername) sbUsername.textContent = username
  if (sbLetter)   sbLetter.textContent   = username[0]?.toUpperCase() || '?'
}

// ── Навигационное меню (гамбургер) ──────────────────────
let _navOpen = false
window.toggleNavMenu = function() {
  _navOpen = !_navOpen
  const menu = document.getElementById('navMenu')
  const btn  = document.getElementById('menuBtn')
  menu.style.display = _navOpen ? 'block' : 'none'
  btn.textContent    = _navOpen ? '✕' : '☰'
  btn.style.color    = _navOpen ? '#60a5fa' : ''
}
window.closeNavMenu = function() {
  _navOpen = false
  const menu = document.getElementById('navMenu')
  if (menu) menu.style.display = 'none'
  const btn = document.getElementById('menuBtn')
  if (btn) { btn.textContent = '☰'; btn.style.color = '' }
}
document.addEventListener('click', e => {
  if (_navOpen && !e.target.closest('#navMenu') && !e.target.closest('#menuBtn')) {
    window.closeNavMenu()
  }
})

// ── Звуки (Web Audio API) ────────────────────────────────
let _audioCtx = null
function _getAudioCtx() {
  if (!_audioCtx) _audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  return _audioCtx
}

export function playSound(type) {
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
      ;[523, 659, 784, 1047].forEach((f, i) => note(f, i * 0.14, 0.32, 0.28))
    } else if (type === 'finish') {
      note(440, 0, 0.25); note(554, 0.12, 0.28)
    }
  } catch (e) { /* audio not supported */ }
}

window.toggleSound = function() {
  const on = localStorage.getItem('soundEnabled') !== 'false'
  localStorage.setItem('soundEnabled', on ? 'false' : 'true')
  syncSettingsBtns()
  if (!on) playSound('correct')
}

// ── Синхронизация кнопок настроек в профиле ──────────────
export function syncSettingsBtns() {
  const isDark  = document.documentElement.classList.contains('dark')
  const soundOn = localStorage.getItem('soundEnabled') !== 'false'

  const themeBtn = document.getElementById('settingsThemeBtn')
  if (themeBtn) {
    const themeIcon = isDark ? 'moon' : 'sun'
    themeBtn.innerHTML = `<i data-lucide="${themeIcon}" style="width:13px;height:13px"></i> ${isDark ? 'Тёмная' : 'Светлая'}`
    if (window.lucide) window.lucide.createIcons({ el: themeBtn })
    themeBtn.style.background   = isDark ? 'rgba(59,130,246,0.12)' : 'rgba(234,179,8,0.12)'
    themeBtn.style.borderColor  = isDark ? 'rgba(59,130,246,0.35)'  : 'rgba(234,179,8,0.4)'
    themeBtn.style.color        = isDark ? '#60a5fa'                : '#d97706'
  }

  const soundBtn = document.getElementById('settingsSoundBtn')
  if (soundBtn) {
    const soundIcon = soundOn ? 'volume-2' : 'volume-x'
    soundBtn.innerHTML          = `<i data-lucide="${soundIcon}" style="width:13px;height:13px"></i> ${soundOn ? 'Включён' : 'Выключен'}`
    if (window.lucide) window.lucide.createIcons({ el: soundBtn })
    soundBtn.style.background   = soundOn ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.1)'
    soundBtn.style.borderColor  = soundOn ? 'rgba(16,185,129,0.35)' : 'rgba(239,68,68,0.3)'
    soundBtn.style.color        = soundOn ? '#34d399'               : '#f87171'
  }
}

// Expose to window for inline scripts (e.g. toggleTheme in index.html)
window.syncSettingsBtns = syncSettingsBtns

// ── XP система ───────────────────────────────────────────
export const XP_TABLE = { easy: 10, medium: 20, hard: 30 }

export function getXP() { return parseInt(localStorage.getItem('totalXP') || '0', 10) }
export function addXP(amount) {
  const xp = getXP() + amount
  localStorage.setItem('totalXP', String(xp))
  return xp
}
export function getXPLevel(xp) {
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
export function showXPToast(gained, total) {
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
export function renderXPBadge() {
  const xp  = getXP()
  const lvl = getXPLevel(xp)
  const el  = document.getElementById('xpBadge')
  if (!el) return
  el.style.display     = 'flex'
  el.style.color       = lvl.color
  el.style.borderColor = lvl.color + '55'
  el.style.background  = lvl.color + '18'
  el.innerHTML = `${lvl.icon} <span style="font-weight:700">${xp}</span><span style="font-size:0.72rem;opacity:0.75"> XP</span>`
}

// ── Streak (серия дней) ──────────────────────────────────
export function updateStreak() {
  const today     = new Date().toDateString()
  const lastVisit = localStorage.getItem('lastVisit')
  let streak      = parseInt(localStorage.getItem('streak') || '0', 10)
  if (lastVisit !== today) {
    const yesterday = new Date(Date.now() - 86400000).toDateString()
    streak = lastVisit === yesterday ? streak + 1 : 1
    localStorage.setItem('streak', streak)
    localStorage.setItem('lastVisit', today)
  }
  return streak
}
export function renderStreakBadge() {
  const streak = updateStreak()
  const el = document.getElementById('streakBadge')
  if (!el) return
  if (streak >= 2) {
    el.style.display = 'flex'
    el.innerHTML = `<span style="font-weight:700">${streak}</span> <span style="font-size:0.75rem;opacity:0.8">дней подряд</span>`
  } else {
    el.style.display = 'none'
  }
}

// ── Конфетти ─────────────────────────────────────────────
export function launchConfetti() {
  const canvas = document.createElement('canvas')
  canvas.style.cssText = 'position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:9999'
  document.body.appendChild(canvas)
  const ctx = canvas.getContext('2d')
  canvas.width  = window.innerWidth
  canvas.height = window.innerHeight
  const pieces = Array.from({ length: 140 }, () => ({
    x: Math.random() * canvas.width, y: Math.random() * -canvas.height,
    w: Math.random() * 10 + 5, h: Math.random() * 6 + 3,
    r: Math.random() * Math.PI * 2, dr: (Math.random() - 0.5) * 0.2,
    dy: Math.random() * 3 + 2, dx: (Math.random() - 0.5) * 2,
    color: `hsl(${Math.random() * 360},90%,60%)`
  }))
  let frame, elapsed = 0
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    pieces.forEach(p => {
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r)
      ctx.fillStyle = p.color; ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h); ctx.restore()
      p.y += p.dy; p.x += p.dx; p.r += p.dr; p.dy += 0.04
    })
    elapsed++
    if (elapsed < 180) frame = requestAnimationFrame(draw)
    else { cancelAnimationFrame(frame); canvas.remove() }
  }
  frame = requestAnimationFrame(draw)
}

// ── Оверлей приватности (анти-читерство) ────────────────
export function showPrivacyScreen() {
  const overlay = document.getElementById('privacyOverlay')
  if (overlay) overlay.style.display = 'flex'
}
export function hidePrivacyScreen() {
  const overlay = document.getElementById('privacyOverlay')
  if (overlay) overlay.style.display = 'none'
}
window.hidePrivacyScreen = hidePrivacyScreen

document.addEventListener('visibilitychange', () => {
  const testPage = document.getElementById('testPage')
  if (document.hidden && testPage && testPage.style.display !== 'none') showPrivacyScreen()
})
window.addEventListener('blur', () => {
  const testPage = document.getElementById('testPage')
  if (testPage && testPage.style.display !== 'none') showPrivacyScreen()
})

// ── Баннер "Продолжить тест?" ────────────────────────────
export function showContinueTestBanner() {
  document.getElementById('continueTestBanner')?.remove()
  const banner = document.createElement('div')
  banner.id = 'continueTestBanner'
  banner.style.cssText = `
    position:fixed;top:1rem;left:50%;transform:translateX(-50%);
    z-index:10000;background:rgba(30,41,59,0.96);color:#f1f5f9;
    border:1px solid rgba(59,130,246,0.4);border-radius:1rem;
    padding:1rem 1.5rem;display:flex;align-items:center;gap:1rem;
    box-shadow:0 8px 32px rgba(0,0,0,0.4);backdrop-filter:blur(12px);
    font-size:0.9rem;max-width:90vw;
  `
  banner.innerHTML = `
    <span style="font-size:1.4rem">📝</span>
    <span>У вас есть незавершённый тест</span>
    <button onclick="resumeTestFromBanner()" style="
      background:#3b82f6;color:white;border:none;padding:6px 16px;
      border-radius:8px;cursor:pointer;font-weight:600;font-size:0.85rem">Продолжить</button>
    <button onclick="dismissContinueTestBanner()" style="
      background:rgba(239,68,68,0.2);color:#fca5a5;border:1px solid rgba(239,68,68,0.3);
      padding:6px 14px;border-radius:8px;cursor:pointer;font-size:0.85rem">Начать заново</button>
  `
  document.body.appendChild(banner)
}
window.resumeTestFromBanner = function() {
  document.getElementById('continueTestBanner')?.remove()
  if (window._restoreTestState?.()) {
    showPage('testPage')
    window._startTimer?.()
    window._displayQuestion?.()
  } else {
    window._clearTestState?.()
  }
}
window.dismissContinueTestBanner = function() {
  document.getElementById('continueTestBanner')?.remove()
  window._clearTestState?.()
}
