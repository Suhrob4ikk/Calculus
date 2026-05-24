// ── Главный модуль инициализации ─────────────────────────
// Импортирует все остальные модули и содержит только логику запуска:
// onAuthStateChange, DOMContentLoaded, beforeunload, realtime подписки.

import { st } from './state.js'
import { supabase } from './supabase.js'
import { applyTheme, showPage, updateUserUI, renderStreakBadge, showContinueTestBanner } from './ui.js'
import { registerSW } from './pwa.js'
import { setupSessionGuard, teardownSessionGuard } from './auth.js'
import { clearTestState, saveTestState } from './test.js'
import { updateLastSeen } from './supabase.js'

// Подключаем все модули, которые регистрируют window.* функции
import './daily.js'
import './profile.js'
import './stats.js'
import './duel.js'
import './search.js'
import './theory.js'

// ── Применяем тему сразу (до DOMContentLoaded) ───────────
;(function() {
  const saved      = localStorage.getItem('theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  applyTheme(saved === 'dark' || (!saved && prefersDark))
})()

// ── Слушатель сессии Supabase ────────────────────────────
supabase.auth.onAuthStateChange(async (event, session) => {
  if (event === 'PASSWORD_RECOVERY') {
    st.currentUser = session?.user || null
    showPage('updatePasswordPage')
    const updateBtn = document.getElementById('updatePasswordBtn')
    if (updateBtn) { updateBtn.disabled = false; updateBtn.textContent = 'Сохранить пароль' }
    const updateErr = document.getElementById('updatePasswordError')
    if (updateErr) updateErr.textContent = ''

  } else if (event === 'SIGNED_IN') {
    st.currentUser = session?.user || null
    const updatePage = document.getElementById('updatePasswordPage')
    if (updatePage && updatePage.style.display !== 'none') return
    if (st.currentUser) {
      const authPage   = document.getElementById('authPage')
      const onAuthPage = authPage && authPage.style.display !== 'none'
      if (onAuthPage) {
        // Свежий вход — ждём guard, чтобы не пустить второе устройство
        const loginBtn = document.getElementById('loginBtn')
        if (loginBtn) { loginBtn.disabled = true; loginBtn.textContent = '⏳ Проверяем…' }
        updateLastSeen(st.currentUser.id)
        setupSessionGuard(st.currentUser.id, () => {
          if (loginBtn) { loginBtn.disabled = false; loginBtn.textContent = 'Войти' }
          showPage('homePage')
          updateUserUI()
          // После успешного входа запускаем канал инвайтов
          initInvitesChannel()
        })
      } else {
        // Обновление токена — guard уже активен, просто переподпишемся
        setupSessionGuard(st.currentUser.id)
      }
    }

  } else if (event === 'SIGNED_OUT') {
    teardownSessionGuard()
    st.currentUser = null
    clearTestState()
    showPage('authPage')
    if (window._kickedOut) {
      window._kickedOut = false
      setTimeout(() => {
        const errEl = document.getElementById('loginError')
        if (errEl) errEl.textContent = '⚠️ Аккаунт уже используется на другом устройстве.'
      }, 50)
    }
  }
})

// ── Канал инвайтов дуэлей (глобальный) ─────────────────
function initInvitesChannel() {
  if (window._duelInvitesChannel) return
  const username = st.currentUser?.user_metadata?.username
  if (!username) {
    setTimeout(initInvitesChannel, 1000)
    return
  }
  console.log('🟡 Подписываемся на duel-invites как', username)
  window._duelInvitesChannel = supabase.channel('duel-invites')
  window._duelInvitesChannel
    .on('broadcast', { event: 'invite' }, ({ payload }) => {
      console.log('📩 Получен инвайт:', payload)
      const myName = username.toLowerCase()
      if (payload.invitedUsername && payload.invitedUsername !== myName) return
      console.log('🟢 Показываю баннер')
      showDuelInviteBanner(payload)
    })
    .on('broadcast', { event: 'invite_decline' }, ({ payload }) => {
      if (payload.code === window._duelCode && window._duelRole === 'host') {
        _duelSetStatus('duelCreateStatus', '❌ ' + payload.declinedBy + ' отказался от дуэли')
        setTimeout(function() {
          if (document.getElementById('duelCreateStatus')?.textContent?.includes('отказался')) {
            _duelSetStatus('duelCreateStatus', 'Нажми кнопку чтобы создать дуэль')
          }
        }, 10000)
      }
    })
    .on('broadcast', { event: 'invite_accepted' }, ({ payload }) => {
      if (payload.code === window._duelCode && window._duelRole === 'host') {
        _duelSetStatus('duelCreateStatus', '✅ ' + payload.acceptedBy + ' принял приглашение! Ожидаем входа…')
      }
    })
    .subscribe(function(status) {
      console.log('🟡 Статус подписки duel-invites:', status)
      if (status === 'SUBSCRIBED') {
        window._duelInvitesChannelReady = true
        console.log('✅ duel-invites готов')
      } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
        window._duelInvitesChannel = null
        window._duelInvitesChannelReady = false
        setTimeout(initInvitesChannel, 2000)
      }
    })
}

// ── Инициализация приложения ─────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  registerSW()

  // Инициализируем Lucide SVG-иконки (заменяет <i data-lucide="..."> → <svg>)
  /* global lucide */
  if (typeof lucide !== 'undefined') lucide.createIcons()

  // Плавающие математические символы (декор тёмной темы)
  const mathBg = document.getElementById('mathBg')
  if (mathBg) {
    const symbols = ['∫','∑','∏','√','∞','∂','∇','∈','∀','∃','≈','≠','≤','≥','lim','dx',"f'(x)",'π','e']
    for (let i = 0; i < 25; i++) {
      const span = document.createElement('span')
      span.className          = 'math-symbol'
      span.textContent        = symbols[Math.floor(Math.random() * symbols.length)]
      span.style.left         = Math.random() * 100 + '%'
      span.style.top          = '100vh'
      span.style.animationDuration = (Math.random() * 20 + 15) + 's'
      span.style.animationDelay   = -(Math.random() * 25) + 's'
      span.style.fontSize     = (Math.random() * 1.2 + 0.8) + 'rem'
      span.style.opacity      = '0'
      mathBg.appendChild(span)
    }
  }

  // Применяем тему
  const saved      = localStorage.getItem('theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const startDark  = saved === 'dark' || (!saved && prefersDark)
  applyTheme(startDark)

  // Обрабатываем URL-параметры (сброс пароля, подтверждение email)
  const urlParams = new URLSearchParams(window.location.search)
  const tokenType = urlParams.get('type')
  if (tokenType) history.replaceState(null, '', window.location.pathname)

  if (tokenType === 'recovery') {
    showPage('updatePasswordPage')
    const updateBtn = document.getElementById('updatePasswordBtn')
    if (updateBtn) { updateBtn.disabled = true; updateBtn.textContent = '⏳ Проверяем ссылку…' }
    // Фолбэк: если PASSWORD_RECOVERY не пришёл за 8 с — показываем ошибку
    setTimeout(() => {
      const btn = document.getElementById('updatePasswordBtn')
      if (btn && btn.disabled) {
        btn.disabled = false; btn.textContent = 'Сохранить пароль'
        const errEl = document.getElementById('updatePasswordError')
        if (errEl && !errEl.textContent)
          errEl.textContent = 'Ссылка устарела или уже использована. Запросите новую.'
      }
    }, 8000)
  } else {
    // Обычная загрузка — восстанавливаем сессию
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) throw error
      if (session) {
        st.currentUser = session.user
        updateLastSeen(st.currentUser.id)
        setupSessionGuard(st.currentUser.id)
        showPage('homePage')
        updateUserUI()
        renderStreakBadge()
        // Запускаем канал инвайтов после восстановления сессии
        initInvitesChannel()
        window.updateDailyChallengeCard?.()
        if (localStorage.getItem('testState')) {
          showContinueTestBanner()
        }
      } else {
        showPage('authPage')
      }
    } catch (err) {
      // Токен истёк или стал невалидным — тихо выходим и показываем вход
      await supabase.auth.signOut().catch(() => {})
      showPage('authPage')
    }
  }

  // Сохраняем прогресс при уходе со страницы
  window.addEventListener('beforeunload', e => {
    if (st.currentTest.length > 0) {
      saveTestState()
      e.preventDefault()
      e.returnValue = 'Вы не закончили тест. При следующем входе тест восстановится.'
      return e.returnValue
    }
  })

  // ── Прячем шапку при скролле вниз, показываем при скролле вверх ──
  ;(function() {
    let lastY = 0
    window.addEventListener('scroll', () => {
      const y = window.scrollY
      const scrollingDown = y > lastY && y > 60

      const nav = document.getElementById('desktopNav')
      if (nav && nav.style.display !== 'none') {
        nav.style.transform = scrollingDown ? 'translateY(-100%)' : 'translateY(0)'
      }

      const mobileBack = document.getElementById('mobileBackBar')
      if (mobileBack && mobileBack.style.display !== 'none') {
        mobileBack.style.transform = scrollingDown ? 'translateY(-110%)' : 'translateY(0)'
      }

      lastY = y
    }, { passive: true })
  })()

  // Realtime: обновляем таблицу лидеров при новых результатах
  supabase.channel('leaderboard-live')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'test_results' }, () => {
      const ind = document.getElementById('liveIndicator')
      if (ind) ind.style.display = 'inline'
      const lb = document.getElementById('leaderboardPage')
      if (lb && lb.style.display !== 'none') {
        window.showLeaderboard()
      }
    })
    .subscribe()
})