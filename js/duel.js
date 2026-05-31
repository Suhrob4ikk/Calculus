import { st } from './state.js'
import { showPage } from './ui.js'
import { supabase, searchProfiles } from './supabase.js'
import { hashCode, mulberry32 } from './utils.js'
import { startTimer, displayQuestion, clearTestState } from './test.js'

/* global easyIntegralsQuestions, mediumIntegralsQuestions, hardIntegralsQuestions,
          easyDerivativesQuestions, mediumDerivativesQuestions, hardDerivativesQuestions,
          easySeriesQuestions, mediumSeriesQuestions, hardSeriesQuestions,
          easyLimitsQuestions, mediumLimitsQuestions, hardLimitsQuestions,
          easyODEQuestions, mediumODEQuestions, hardODEQuestions */

// ── Mutable дуэльное состояние ──
window._duelChannel            = null
window._duelCode               = ''
window._duelRole               = ''
window._duelMyScore            = null
window._duelOpponentScore      = null
window._duelOpponentName       = ''
window._duelMyName             = ''
window._duelSection            = 'mixed'
window._duelDiff               = 'medium'
window._duelIsRematchRequester = false
window._duelInvitedUsername    = null
window._pendingDuelInvite      = null

// Канал инвайтов (инициализируется из script.js после входа)
window._duelInvitesChannel      = null
window._duelInvitesChannelReady = false

// Фаза дуэли: 'idle' | 'countdown' | 'active' | 'finished'
// Защищает от повторного срабатывания событий join/start/rematch
window._duelPhase = 'idle'

window._clearDuelGlobals = function() {
  window._duelJoinHandled  = false
  window._duelStartHandled = false
  window._duelInvitedUsername = null
  if (window._duelCountdownInterval) {
    clearInterval(window._duelCountdownInterval)
    window._duelCountdownInterval = null
  }
}

function generateDuelCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)]
  return code
}

function getDuelQuestions(code, section = 'mixed', difficulty = 'medium') {
  const poolsBySection = {
    integrals:   { easy: easyIntegralsQuestions,     medium: mediumIntegralsQuestions,     hard: hardIntegralsQuestions     },
    derivatives: { easy: easyDerivativesQuestions,   medium: mediumDerivativesQuestions,   hard: hardDerivativesQuestions   },
    series:      { easy: easySeriesQuestions,        medium: mediumSeriesQuestions,        hard: hardSeriesQuestions        },
    limits:      { easy: easyLimitsQuestions,        medium: mediumLimitsQuestions,        hard: hardLimitsQuestions        },
    ode:         { easy: easyODEQuestions,           medium: mediumODEQuestions,           hard: hardODEQuestions           },
    probability: { easy: easyProbabilityQuestions,   medium: mediumProbabilityQuestions,   hard: hardProbabilityQuestions   },
  }
  const seed = hashCode(code + '_duel_' + section + '_' + difficulty)
  const rng  = mulberry32(seed)
  let pool

  if (section === 'mixed') {
    const sects = ['integrals', 'derivatives', 'series', 'limits', 'ode', 'probability']
    const selected = []
    for (const s of sects) {
      const sPool = (poolsBySection[s]?.[difficulty] || []).flat().filter(q => q && q.options && q.options.length === 4)
      const copy = [...sPool]
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]]
      }
      selected.push(...copy.slice(0, 2))
    }
    for (let i = selected.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [selected[i], selected[j]] = [selected[j], selected[i]]
    }
    pool = selected
  } else {
    const rawPool = (poolsBySection[section]?.[difficulty] || poolsBySection.integrals.medium)
      .flat().filter(q => q && q.options && q.options.length === 4)
    const shuffled = [...rawPool]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    pool = shuffled
  }

  return pool.slice(0, 10).map(q => {
    const order = [0, 1, 2, 3]
    for (let i = 3; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]]
    }
    const origCorrect = q.correct !== undefined ? q.correct : q.answerIndex
    return { ...q, options: order.map(k => q.options[k]), correct: order.indexOf(origCorrect) }
  })
}

window._duelSetStatus = function(panelId, msg) {
  const el = document.getElementById(panelId)
  if (el) el.innerHTML = msg
}

function _refreshDuelPickers() {
  document.querySelectorAll('#duelSectPicker .duel-pick-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.sect === window._duelSection)
  })
  document.querySelectorAll('#duelDiffPicker .duel-pick-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.diff === window._duelDiff)
  })
}

// ── Публичные функции ──

window.showDuelModal = function() {
  window._duelPhase = 'idle'
  window._duelMyScore = null; window._duelOpponentScore = null
  window._duelCode = ''; window._duelRole = ''
  if (window._duelCountdownInterval) { clearInterval(window._duelCountdownInterval); window._duelCountdownInterval = null }
  if (window._duelChannel) { window._duelChannel.unsubscribe(); window._duelChannel = null }
  document.getElementById('duelCodeDisplay').textContent    = '——————'
  document.getElementById('duelCreateStatus').textContent   = 'Нажми кнопку чтобы создать дуэль'
  document.getElementById('duelCreateBtn').disabled         = false
  document.getElementById('duelCreateBtn').textContent      = '⚔️ Создать дуэль'
  const ji = document.getElementById('duelJoinInput')
  if (ji) ji.value = ''
  document.getElementById('duelJoinStatus').textContent     = ''
  document.getElementById('duelCreatePanel').style.display  = ''
  document.getElementById('duelJoinPanel').style.display    = 'none'
  document.getElementById('duelLobby').style.display        = 'none'
  document.getElementById('duelTabsBar').style.display      = ''
  _refreshDuelPickers()
  window.showDuelTab('create')
  document.getElementById('duelModal').style.display = 'flex'
}

window.closeDuelModal = function() {
  if (window._duelChannel) { window._duelChannel.unsubscribe(); window._duelChannel = null }
  document.getElementById('duelModal').style.display = 'none'
}

window.showDuelTab = function(tab) {
  document.getElementById('duelCreatePanel').style.display  = tab === 'create' ? '' : 'none'
  document.getElementById('duelJoinPanel').style.display    = tab === 'join'   ? '' : 'none'
  document.getElementById('duelTabCreate').style.background = tab === 'create' ? 'rgba(139,92,246,0.8)' : 'transparent'
  document.getElementById('duelTabCreate').style.color      = tab === 'create' ? 'white' : '#94a3b8'
  document.getElementById('duelTabJoin').style.background   = tab === 'join'   ? 'rgba(139,92,246,0.8)' : 'transparent'
  document.getElementById('duelTabJoin').style.color        = tab === 'join'   ? 'white' : '#94a3b8'
}

window.setDuelSection = function(sect) { window._duelSection = sect; _refreshDuelPickers() }
window.setDuelDiff    = function(diff) { window._duelDiff    = diff; _refreshDuelPickers() }

window.validateInviteUsername = async function() {
  const input   = document.getElementById('inviteUsernameInput')
  const errorEl = document.getElementById('inviteError')
  if (!input) return true
  const username = input.value.trim().toLowerCase()
  if (!username) {
    if (errorEl) errorEl.style.display = 'none'
    input.style.borderColor = 'rgba(139,92,246,0.3)'
    return true
  }
  const { data, error } = await searchProfiles(username)
  if (error || !data || !data.some(p => p.username && p.username.toLowerCase() === username)) {
    if (errorEl) { errorEl.textContent = 'Пользователь не найден'; errorEl.style.display = 'block' }
    input.style.borderColor = '#f87171'
    return false
  }
  if (errorEl) errorEl.style.display = 'none'
  input.style.borderColor = '#10b981'
  return true
}

window.copyDuelCode = function() {
  if (!window._duelCode) return
  const el = document.getElementById('duelCodeDisplay')
  const orig = el.textContent
  navigator.clipboard.writeText(window._duelCode).then(() => {
    el.textContent = '✓ Скопировано!'
    setTimeout(() => { el.textContent = orig }, 1500)
  }).catch(() => {})
}

window.createDuel = async function() {
  if (!st.currentUser) { alert('Войди в аккаунт, чтобы создать дуэль'); return }

  const valid = await window.validateInviteUsername()
  if (!valid) return

  const btn = document.getElementById('duelCreateBtn')
  btn.disabled = true; btn.textContent = 'Создаём…'

  const inviteInput = document.getElementById('inviteUsernameInput')
  const invited = inviteInput?.value?.trim() || ''
  window._duelInvitedUsername = invited ? invited.toLowerCase() : null

  window._duelCode   = generateDuelCode()
  window._duelRole   = 'host'
  window._duelMyName = st.currentUser.user_metadata?.username || st.currentUser.email.split('@')[0]
  document.getElementById('duelCodeDisplay').textContent = window._duelCode
  _duelSetStatus('duelCreateStatus', window._duelInvitedUsername
    ? `⏳ Ожидаем ${invited}…`
    : '⏳ Ожидаем соперника…')

  if (window._duelChannel) { window._duelChannel.unsubscribe(); window._duelChannel = null }
  window._duelChannel = supabase.channel('duel:' + window._duelCode, { config: { broadcast: { self: false } } })

  window._duelJoinHandled  = false
  window._duelStartHandled = false
  window._duelCountdownInterval = null

  window._duelChannel
    .on('broadcast', { event: 'join' }, ({ payload }) => {
      if (window._duelJoinHandled) return
      if (window._duelPhase !== 'idle') return
      window._duelJoinHandled = true
      window._duelOpponentName = payload.name
      _duelSetStatus('duelCreateStatus', `✅ ${window._duelOpponentName} подключился! Начинаем…`)
      window._duelChannel.send({
        type: 'broadcast', event: 'start',
        payload: { code: window._duelCode, section: window._duelSection, difficulty: window._duelDiff }
      })
      if (window._duelStartHandled) return
      window._duelStartHandled = true
      _beginDuelCountdown()
    })
    .on('broadcast', { event: 'score' }, ({ payload }) => {
      window._duelOpponentScore = payload.score
      window._duelOpponentName  = payload.name || window._duelOpponentName
      _checkDuelComplete()
    })
    .on('broadcast', { event: 'rematch_request' }, ({ payload }) => {
      if (window._duelIsRematchRequester) { _resolveSimultaneousRematch(payload.name); return }
      _showRematchRequest(payload.name)
    })
    .on('broadcast', { event: 'rematch_accept' },  () => { _onRematchAccepted() })
    .on('broadcast', { event: 'rematch_start' },   ({ payload }) => { _onRematchStart(payload) })
    .on('broadcast', { event: 'rematch_decline' }, () => {
      const btn = document.getElementById('rematchBtn')
      if (btn) { btn.textContent = 'Соперник отказался'; btn.disabled = true }
    })
    .subscribe()

  // Отправляем инвайт, если указан username
  if (window._duelInvitedUsername) {
    const isValid = /^[a-zA-Zа-яА-ЯёЁ0-9_][a-zA-Zа-яА-ЯёЁ0-9_]{1,30}$/.test(window._duelInvitedUsername);
    if (!isValid) {
      _duelSetStatus('duelCreateStatus', '❌ Некорректный ник приглашённого');
    } else {
      window._duelInvitesChannel?.send({
        type: 'broadcast',
        event: 'invite',
        payload: {
          invitedUsername: window._duelInvitedUsername,
          code: window._duelCode,
          inviterName: window._duelMyName
        }
      });
    }
  }
}

window.joinDuel = async function() {
  if (!st.currentUser) { alert('Войди в аккаунт, чтобы принять участие'); return }
  const input = document.getElementById('duelJoinInput')
  const code  = input.value.trim().toUpperCase()
  if (code.length < 4) { _duelSetStatus('duelJoinStatus', '❌ Введи код (минимум 4 символа)'); return }

  const myName = st.currentUser.user_metadata?.username?.toLowerCase()
  if (window._duelInvitedUsername && window._duelInvitedUsername !== myName) {
    _duelSetStatus('duelJoinStatus', '❌ Эта дуэль только для приглашённого участника')
    return
  }

  window._duelCode   = code
  window._duelRole   = 'guest'
  window._duelMyName = st.currentUser.user_metadata?.username || st.currentUser.email.split('@')[0]
  _duelSetStatus('duelJoinStatus', '⏳ Подключаемся…')

  if (window._duelChannel) { window._duelChannel.unsubscribe(); window._duelChannel = null }
  window._duelChannel = supabase.channel('duel:' + window._duelCode, { config: { broadcast: { self: false } } })

  window._duelChannel
    .on('broadcast', { event: 'start' }, ({ payload }) => {
      if (window._duelPhase !== 'idle') return
      if (payload?.section)    window._duelSection = payload.section
      if (payload?.difficulty) window._duelDiff    = payload.difficulty
      _beginDuelCountdown()
    })
    .on('broadcast', { event: 'score' }, ({ payload }) => {
      window._duelOpponentScore = payload.score
      window._duelOpponentName  = payload.name || window._duelOpponentName
      _checkDuelComplete()
    })
    .on('broadcast', { event: 'rematch_request' }, ({ payload }) => {
      if (window._duelIsRematchRequester) { _resolveSimultaneousRematch(payload.name); return }
      _showRematchRequest(payload.name)
    })
    .on('broadcast', { event: 'rematch_accept' },  () => { _onRematchAccepted() })
    .on('broadcast', { event: 'rematch_start' },   ({ payload }) => { _onRematchStart(payload) })
    .on('broadcast', { event: 'rematch_decline' }, () => {
      const btn = document.getElementById('rematchBtn')
      if (btn) { btn.textContent = 'Соперник отказался'; btn.disabled = true }
    })
    .subscribe(status => {
      if (status === 'SUBSCRIBED') {
        window._duelChannel.send({ type: 'broadcast', event: 'join', payload: { name: window._duelMyName } })
        _duelSetStatus('duelJoinStatus', '✅ Подключился! Ожидаем старта…')
        document.getElementById('duelJoinPanel').style.display  = 'none'
        document.getElementById('duelTabsBar').style.display    = 'none'
        document.getElementById('duelLobby').style.display      = ''
        document.getElementById('duelLobbyMsg').textContent     = 'Подключился! Ожидаем старта…'
      }
    })
}

window.joinDuelByCode = function(code) {
  const input = document.getElementById('duelJoinInput')
  if (input) input.value = code
  window.joinDuel()
}

function _beginDuelCountdown() {
  // Re-entry guard: only start countdown from idle phase
  if (window._duelPhase !== 'idle') return
  window._duelPhase = 'countdown'
  if (window._duelCountdownInterval) { clearInterval(window._duelCountdownInterval); window._duelCountdownInterval = null }
  document.getElementById('duelCreatePanel').style.display = 'none'
  document.getElementById('duelJoinPanel').style.display   = 'none'
  document.getElementById('duelTabsBar').style.display     = 'none'
  document.getElementById('duelLobby').style.display       = ''
  document.getElementById('duelLobbyMsg').textContent      = 'Соперник найден! Начинаем через…'
  const countEl = document.getElementById('duelStartCountdown')
  countEl.style.display = ''
  let c = 3
  countEl.textContent = c
  const iv = setInterval(() => {
    c--
    if (c > 0) { countEl.textContent = c }
    else {
      clearInterval(iv)
      window._duelCountdownInterval = null
      document.getElementById('duelModal').style.display = 'none'
      _beginDuelTest()
    }
  }, 1000)
  window._duelCountdownInterval = iv
}

function _beginDuelTest() {
  window._duelPhase = 'active'
  // Cancel any leftover opponent timeout from a previous round
  if (window._duelOpponentTimeout) { clearTimeout(window._duelOpponentTimeout); window._duelOpponentTimeout = null }
  const questions = getDuelQuestions(window._duelCode, window._duelSection, window._duelDiff)
  st.currentSection    = 'duel'
  st.currentDifficulty = window._duelDiff
  st.currentTest       = questions
  st.currentQuestionIndex = 0
  st.userAnswers       = new Array(questions.length).fill(null)
  st.isStudyMode       = false
  window._duelMyScore  = null
  window._duelOpponentScore = null
  const timePerQ = window._duelSection === 'ode'
    ? (window._duelDiff === 'easy' ? 60 : window._duelDiff === 'hard' ? 120 : 90)
    : (window._duelDiff === 'easy' ? 30 : window._duelDiff === 'hard' ? 90  : 60)
  st.timeRemaining    = questions.length * timePerQ
  st.timerInitialTime = st.timeRemaining
  st.timerStartTime   = null
  clearTestState()
  showPage('testPage')
  ;['menuBtn', 'bottomNav', 'desktopNav'].forEach(id => {
    const el = document.getElementById(id)
    if (el) el.style.display = 'none'
  })
  document.getElementById('totalQuestions').textContent = questions.length
  const sectNames = { mixed: 'Все разделы', integrals: 'Интегралы', derivatives: 'Производные', series: 'Ряды', limits: 'Пределы', ode: 'Дифф. уравнения' }
  const diffName  = window._duelDiff === 'easy' ? 'Лёгкий' : window._duelDiff === 'hard' ? 'Сложный' : 'Средний'
  document.getElementById('testTitle').textContent       = `Дуэль: ${sectNames[window._duelSection] || 'Смешанный'}`
  document.getElementById('difficultyLabel').textContent = `Уровень: ${diffName} · Дуэль 1v1`
  const timerEl = document.getElementById('timerDisplay')
  if (timerEl) timerEl.style.display = ''
  displayQuestion()
  startTimer()
}

function _broadcastDuelScore(percentage) {
  if (window._duelChannel) {
    window._duelChannel.send({ type: 'broadcast', event: 'score', payload: { score: percentage, name: window._duelMyName } })
  }
}
window._broadcastDuelScore = _broadcastDuelScore

function _checkDuelComplete() {
  if (window._duelMyScore !== null && window._duelOpponentScore !== null) {
    _showDuelResults()
  }
}
window._checkDuelComplete = _checkDuelComplete

// ── Реванш ──
window.requestRematch = function() {
  window._duelIsRematchRequester = true
  const btn = document.getElementById('rematchBtn')
  if (btn) { btn.textContent = 'Ожидаем ответа…'; btn.disabled = true }
  window._duelChannel?.send({ type: 'broadcast', event: 'rematch_request', payload: { name: window._duelMyName } })
}

// Если оба нажали реванш одновременно — разрешаем конфликт по алфавитному порядку имён.
// Тот, чьё имя меньше, становится хостом (отправляет rematch_start).
function _resolveSimultaneousRematch(opponentName) {
  if (!window._duelIsRematchRequester) return  // мы ещё не нажимали
  const weAreHost = window._duelMyName.toLowerCase() < opponentName.toLowerCase()
  if (weAreHost) {
    // Мы — «хост»: отправляем rematch_start
    _onRematchAccepted()
  } else {
    // Мы — «гость»: ждём rematch_start от соперника
    window._duelIsRematchRequester = false
    const btn = document.getElementById('rematchBtn')
    if (btn) { btn.textContent = 'Начинаем…'; btn.disabled = true }
  }
}

window.acceptRematch = function() {
  window._duelIsRematchRequester = false
  document.getElementById('rematchRequestBanner').style.display = 'none'
  const btn = document.getElementById('rematchBtn')
  if (btn) { btn.textContent = 'Начинаем…'; btn.disabled = true }
  window._duelChannel?.send({ type: 'broadcast', event: 'rematch_accept' })
}

window.declineRematch = function() {
  document.getElementById('rematchRequestBanner').style.display = 'none'
  window._duelChannel?.send({ type: 'broadcast', event: 'rematch_decline' })
}

// ── Инвайт-баннер ──
window.showDuelInviteBanner = function(payload) {
  const banner = document.getElementById('duelInviteBanner')
  if (!banner) return
  const name = payload.inviterName || payload.invitedUsername || 'Соперник'
  document.getElementById('duelInviterName').textContent = `${name} приглашает тебя в дуэль`
  window._pendingDuelInvite = payload
  banner.style.display = 'block'
}

window.acceptDuelInvite = function() {
  const payload = window._pendingDuelInvite
  if (!payload) return
  document.getElementById('duelInviteBanner').style.display = 'none'

  window._duelInvitesChannel?.send({
    type: 'broadcast',
    event: 'invite_accepted',
    payload: {
      acceptedBy: st.currentUser?.user_metadata?.username || 'Пользователь',
      code: payload.code
    }
  })

  window._pendingDuelInvite = null
  window.joinDuelByCode(payload.code)
}

window.declineDuelInvite = function() {
  const payload = window._pendingDuelInvite
  document.getElementById('duelInviteBanner').style.display = 'none'

  if (payload) {
    window._duelInvitesChannel?.send({
      type: 'broadcast',
      event: 'invite_decline',
      payload: {
        declinedBy: st.currentUser?.user_metadata?.username || 'Пользователь',
        code: payload.code
      }
    })
  }

  window._pendingDuelInvite = null
}

function _showRematchRequest(name) {
  const banner = document.getElementById('rematchRequestBanner')
  if (!banner) return
  document.getElementById('rematchRequesterName').textContent = `${name} предлагает реванш`
  banner.style.display = 'block'
  document.getElementById('duelResultsModal').style.display = 'flex'
}

function _onRematchAccepted() {
  if (!window._duelIsRematchRequester) return
  window._duelIsRematchRequester = false
  const newCode = generateDuelCode()
  window._duelCode = newCode
  window._duelMyScore = null; window._duelOpponentScore = null
  window._duelChannel.send({
    type: 'broadcast', event: 'rematch_start',
    payload: { code: newCode, section: window._duelSection, difficulty: window._duelDiff }
  })
  document.getElementById('duelResultsModal').style.display = 'none'
  // Reset phase so countdown guard passes
  window._duelPhase = 'idle'
  _beginDuelCountdown()
}

function _onRematchStart(payload) {
  if (window._duelIsRematchRequester) return
  window._duelCode = payload.code
  if (payload.section)    window._duelSection = payload.section
  if (payload.difficulty) window._duelDiff    = payload.difficulty
  window._duelMyScore = null; window._duelOpponentScore = null
  document.getElementById('duelResultsModal').style.display = 'none'
  // Reset phase so countdown guard passes
  window._duelPhase = 'idle'
  _beginDuelCountdown()
}

function _showDuelResults() {
  if (window._duelOpponentTimeout) {
    clearTimeout(window._duelOpponentTimeout)
    window._duelOpponentTimeout = null
  }
  ;['menuBtn', 'bottomNav', 'desktopNav'].forEach(id => {
    const el = document.getElementById(id)
    if (el) el.style.display = ''
  })
  const modal      = document.getElementById('duelResultsModal')
  const emojiEl    = document.getElementById('duelResultsEmoji')
  const titleEl    = document.getElementById('duelResultsTitle')
  const scoresEl   = document.getElementById('duelResultsScores')
  const rematchBtn = document.getElementById('rematchBtn')
  if (rematchBtn) { rematchBtn.textContent = 'Реванш'; rematchBtn.disabled = false }
  const rematchBanner = document.getElementById('rematchRequestBanner')
  if (rematchBanner) rematchBanner.style.display = 'none'
  const opponentTimedOut = window._duelOpponentScore === -1
  const opponentScore    = opponentTimedOut ? 0 : window._duelOpponentScore
  let emoji, title
  if (opponentTimedOut)                         { emoji = '🏆'; title = 'Соперник отключился — ты победил!' }
  else if (window._duelMyScore > opponentScore) { emoji = '🏆'; title = 'Ты победил!' }
  else if (window._duelMyScore < opponentScore) { emoji = '💪'; title = 'Соперник победил — реванш?' }
  else                                          { emoji = '🤝'; title = 'Ничья!' }
  emojiEl.textContent = emoji
  titleEl.textContent = title
  const card = (name, score, highlight, timedOut = false) => `
    <div style="flex:1;min-width:120px;padding:1rem;border-radius:14px;
      background:${highlight ? 'rgba(139,92,246,0.2)' : 'rgba(15,23,42,0.8)'};
      border:1.5px solid ${highlight ? 'rgba(139,92,246,0.5)' : 'rgba(51,65,85,0.5)'}">
      <div style="font-size:0.8rem;color:#94a3b8;margin-bottom:4px">${name}</div>
      <div style="font-size:2rem;font-weight:700;color:${timedOut?'#64748b':score>=70?'#10b981':'#f59e0b'}">${timedOut ? '—' : score + '%'}</div>
      ${timedOut ? '<div style="font-size:0.75rem;color:#64748b">отключился</div>' : ''}
    </div>`
  scoresEl.innerHTML =
    card(window._duelMyName + ' (ты)', window._duelMyScore, !opponentTimedOut ? window._duelMyScore >= opponentScore : true) +
    card(window._duelOpponentName || 'Соперник', opponentScore, opponentScore > window._duelMyScore, opponentTimedOut)
  modal.style.display = 'flex'
}
window._showDuelResults = _showDuelResults