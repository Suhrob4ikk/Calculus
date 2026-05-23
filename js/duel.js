import { st } from './state.js'
import { showPage } from './ui.js'
import { supabase } from './supabase.js'
import { hashCode, mulberry32 } from './utils.js'
import { startTimer, displayQuestion, clearTestState } from './test.js'

/* global easyIntegralsQuestions, mediumIntegralsQuestions, hardIntegralsQuestions,
          easyDerivativesQuestions, mediumDerivativesQuestions, hardDerivativesQuestions,
          easySeriesQuestions, mediumSeriesQuestions, hardSeriesQuestions,
          easyLimitsQuestions, mediumLimitsQuestions, hardLimitsQuestions,
          easyODEQuestions, mediumODEQuestions, hardODEQuestions */

// ── Мutable дуэльное состояние (на window, чтобы test.js имел прямой доступ) ──
window._duelChannel            = null
window._duelCode               = ''
window._duelRole               = ''   // 'host' | 'guest'
window._duelMyScore            = null
window._duelOpponentScore      = null
window._duelOpponentName       = ''
window._duelMyName             = ''
window._duelSection            = 'mixed'
window._duelDiff               = 'medium'
window._duelIsRematchRequester = false

function generateDuelCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)]
  return code
}

function getDuelQuestions(code, section = 'mixed', difficulty = 'medium') {
  const poolsBySection = {
    integrals:   { easy: easyIntegralsQuestions,   medium: mediumIntegralsQuestions,   hard: hardIntegralsQuestions   },
    derivatives: { easy: easyDerivativesQuestions, medium: mediumDerivativesQuestions, hard: hardDerivativesQuestions },
    series:      { easy: easySeriesQuestions,      medium: mediumSeriesQuestions,      hard: hardSeriesQuestions      },
    limits:      { easy: easyLimitsQuestions,      medium: mediumLimitsQuestions,      hard: hardLimitsQuestions      },
    ode:         { easy: easyODEQuestions,         medium: mediumODEQuestions,         hard: hardODEQuestions         },
  }

  const seed = hashCode(code + '_duel_' + section + '_' + difficulty)
  const rng  = mulberry32(seed)

  let pool
  if (section === 'mixed') {
    // Стратифицированная выборка: 2 вопроса из каждого из 5 разделов
    const sects   = ['integrals', 'derivatives', 'series', 'limits', 'ode']
    const selected = []
    for (const s of sects) {
      const sPool = (poolsBySection[s]?.[difficulty] || [])
        .flat().filter(q => q && q.options && q.options.length === 4)
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

  // Перемешиваем варианты ответов тем же rng, чтобы у обоих игроков порядок совпадал
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

function _duelSetStatus(panelId, msg) {
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

// ── Публичные функции (window) ────────────────────────────

window.showDuelModal = function() {
  window._duelMyScore = null; window._duelOpponentScore = null
  window._duelCode = ''; window._duelRole = ''
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

window.setDuelSection = function(sect) {
  window._duelSection = sect
  _refreshDuelPickers()
}
window.setDuelDiff = function(diff) {
  window._duelDiff = diff
  _refreshDuelPickers()
}

window.copyDuelCode = function() {
  if (window._duelCode) {
    navigator.clipboard.writeText(window._duelCode).then(() => {
      const el   = document.getElementById('duelCodeDisplay')
      const orig = el.textContent
      el.textContent = '✓ Скопировано!'
      setTimeout(() => { el.textContent = orig }, 1500)
    })
  }
}

window.createDuel = async function() {
  if (!st.currentUser) { alert('Войди в аккаунт, чтобы создать дуэль'); return }
  const btn = document.getElementById('duelCreateBtn')
  btn.disabled = true; btn.textContent = '⏳ Создаём…'

  window._duelCode   = generateDuelCode()
  window._duelRole   = 'host'
  window._duelMyName = st.currentUser.user_metadata?.username || st.currentUser.email.split('@')[0]
  document.getElementById('duelCodeDisplay').textContent = window._duelCode
  _duelSetStatus('duelCreateStatus', '⏳ Ожидаем соперника…')

  if (window._duelChannel) { window._duelChannel.unsubscribe(); window._duelChannel = null }
  window._duelChannel = supabase.channel('duel:' + window._duelCode, { config: { broadcast: { self: false } } })

  window._duelChannel
    .on('broadcast', { event: 'join' }, ({ payload }) => {
      window._duelOpponentName = payload.name
      _duelSetStatus('duelCreateStatus', `✅ ${window._duelOpponentName} подключился! Начинаем…`)
      window._duelChannel.send({
        type: 'broadcast', event: 'start',
        payload: { code: window._duelCode, section: window._duelSection, difficulty: window._duelDiff }
      })
      _beginDuelCountdown()
    })
    .on('broadcast', { event: 'score' }, ({ payload }) => {
      window._duelOpponentScore = payload.score
      window._duelOpponentName  = payload.name || window._duelOpponentName
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
  if (!st.currentUser) { alert('Войди в аккаунт, чтобы принять участие'); return }
  const input = document.getElementById('duelJoinInput')
  const code  = input.value.trim().toUpperCase()
  if (code.length < 4) { _duelSetStatus('duelJoinStatus', '❌ Введи код (минимум 4 символа)'); return }

  window._duelCode   = code
  window._duelRole   = 'guest'
  window._duelMyName = st.currentUser.user_metadata?.username || st.currentUser.email.split('@')[0]
  _duelSetStatus('duelJoinStatus', '⏳ Подключаемся…')

  if (window._duelChannel) { window._duelChannel.unsubscribe(); window._duelChannel = null }
  window._duelChannel = supabase.channel('duel:' + window._duelCode, { config: { broadcast: { self: false } } })

  window._duelChannel
    .on('broadcast', { event: 'start' }, ({ payload }) => {
      if (payload?.section)    window._duelSection = payload.section
      if (payload?.difficulty) window._duelDiff    = payload.difficulty
      _beginDuelCountdown()
    })
    .on('broadcast', { event: 'score' }, ({ payload }) => {
      window._duelOpponentScore = payload.score
      window._duelOpponentName  = payload.name || window._duelOpponentName
      _checkDuelComplete()
    })
    .on('broadcast', { event: 'rematch_request' }, ({ payload }) => { _showRematchRequest(payload.name) })
    .on('broadcast', { event: 'rematch_accept' },  () => { _onRematchAccepted() })
    .on('broadcast', { event: 'rematch_start' },   ({ payload }) => { _onRematchStart(payload) })
    .on('broadcast', { event: 'rematch_decline' }, () => {
      const btn = document.getElementById('rematchBtn')
      if (btn) { btn.textContent = '❌ Соперник отказался'; btn.disabled = true }
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

function _beginDuelCountdown() {
  document.getElementById('duelCreatePanel').style.display = 'none'
  document.getElementById('duelJoinPanel').style.display   = 'none'
  document.getElementById('duelTabsBar').style.display     = 'none'
  document.getElementById('duelLobby').style.display       = ''
  const lobbyMsg = document.getElementById('duelLobbyMsg')
  const countEl  = document.getElementById('duelStartCountdown')
  lobbyMsg.textContent   = 'Соперник найден! Начинаем через…'
  countEl.style.display  = ''
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
  const questions = getDuelQuestions(window._duelCode, window._duelSection, window._duelDiff)
  st.currentSection         = 'duel'
  st.currentDifficulty      = window._duelDiff
  st.currentTest            = questions
  st.currentQuestionIndex   = 0
  st.userAnswers            = new Array(questions.length).fill(null)
  st.isStudyMode            = false
  window._duelMyScore       = null
  window._duelOpponentScore = null

  const timePerQ = window._duelSection === 'ode'
    ? (window._duelDiff === 'easy' ? 60 : window._duelDiff === 'hard' ? 120 : 90)
    : (window._duelDiff === 'easy' ? 30 : window._duelDiff === 'hard' ? 90  : 60)
  st.timeRemaining    = questions.length * timePerQ
  st.timerInitialTime = st.timeRemaining
  st.timerStartTime   = null
  clearTestState()

  showPage('testPage')
  // Скрываем навигацию на время дуэли
  ;['menuBtn', 'bottomNav', 'desktopNav'].forEach(id => {
    const el = document.getElementById(id)
    if (el) el.style.display = 'none'
  })

  document.getElementById('totalQuestions').textContent = questions.length
  const sectNames = { mixed: 'Все разделы', integrals: 'Интегралы', derivatives: 'Производные', series: 'Ряды', limits: 'Пределы', ode: 'Дифф. уравнения' }
  const diffName  = window._duelDiff === 'easy' ? 'Лёгкий' : window._duelDiff === 'hard' ? 'Сложный' : 'Средний'
  document.getElementById('testTitle').textContent      = `⚔️ Дуэль: ${sectNames[window._duelSection] || 'Смешанный'}`
  document.getElementById('difficultyLabel').textContent = `Уровень: ${diffName} · Дуэль 1v1`
  const timerEl = document.getElementById('timerDisplay')
  if (timerEl) timerEl.style.display = ''

  displayQuestion()
  startTimer()
}

// Эти функции нужны test.js — регистрируем на window
function _broadcastDuelScore(percentage) {
  if (window._duelChannel) {
    window._duelChannel.send({
      type: 'broadcast', event: 'score',
      payload: { score: percentage, name: window._duelMyName }
    })
  }
}
window._broadcastDuelScore = _broadcastDuelScore

function _checkDuelComplete() {
  if (window._duelMyScore !== null && window._duelOpponentScore !== null) {
    _showDuelResults()
  }
}
window._checkDuelComplete = _checkDuelComplete

// ── Реванш ────────────────────────────────────────────────
window.requestRematch = function() {
  window._duelIsRematchRequester = true
  const btn = document.getElementById('rematchBtn')
  if (btn) { btn.textContent = '⏳ Ожидаем ответа…'; btn.disabled = true }
  window._duelChannel?.send({ type: 'broadcast', event: 'rematch_request', payload: { name: window._duelMyName } })
}

window.acceptRematch = function() {
  window._duelIsRematchRequester = false
  document.getElementById('rematchRequestBanner').style.display = 'none'
  const btn = document.getElementById('rematchBtn')
  if (btn) { btn.textContent = '⏳ Начинаем…'; btn.disabled = true }
  window._duelChannel?.send({ type: 'broadcast', event: 'rematch_accept' })
}

window.declineRematch = function() {
  document.getElementById('rematchRequestBanner').style.display = 'none'
  window._duelChannel?.send({ type: 'broadcast', event: 'rematch_decline' })
}

function _showRematchRequest(name) {
  const banner = document.getElementById('rematchRequestBanner')
  if (!banner) return
  document.getElementById('rematchRequesterName').textContent = `⚔️ ${name} предлагает реванш!`
  banner.style.display = 'block'
  document.getElementById('duelResultsModal').style.display = 'flex'
}

function _onRematchAccepted() {
  if (!window._duelIsRematchRequester) return
  window._duelIsRematchRequester = false
  const newCode = generateDuelCode()
  window._duelCode          = newCode
  window._duelMyScore       = null
  window._duelOpponentScore = null
  window._duelChannel.send({
    type: 'broadcast', event: 'rematch_start',
    payload: { code: newCode, section: window._duelSection, difficulty: window._duelDiff }
  })
  document.getElementById('duelResultsModal').style.display = 'none'
  _beginDuelCountdown()
}

function _onRematchStart(payload) {
  if (window._duelIsRematchRequester) return
  window._duelCode          = payload.code
  if (payload.section)    window._duelSection = payload.section
  if (payload.difficulty) window._duelDiff    = payload.difficulty
  window._duelMyScore       = null
  window._duelOpponentScore = null
  document.getElementById('duelResultsModal').style.display = 'none'
  _beginDuelCountdown()
}

// ── Показ результатов дуэли ───────────────────────────────
function _showDuelResults() {
  if (window._duelOpponentTimeout) {
    clearTimeout(window._duelOpponentTimeout)
    window._duelOpponentTimeout = null
  }

  // Восстанавливаем навигацию
  ;[
    ['menuBtn',    ''],
    ['bottomNav',  'flex'],
    ['desktopNav', ''],
  ].forEach(([id, val]) => {
    const el = document.getElementById(id)
    if (el) el.style.display = val
  })

  const modal    = document.getElementById('duelResultsModal')
  const emojiEl  = document.getElementById('duelResultsEmoji')
  const titleEl  = document.getElementById('duelResultsTitle')
  const scoresEl = document.getElementById('duelResultsScores')

  const rematchBtn = document.getElementById('rematchBtn')
  if (rematchBtn) { rematchBtn.textContent = '🔄 Реванш!'; rematchBtn.disabled = false }
  const rematchBanner = document.getElementById('rematchRequestBanner')
  if (rematchBanner) rematchBanner.style.display = 'none'

  const opponentTimedOut = window._duelOpponentScore === -1
  const opponentScore    = opponentTimedOut ? 0 : window._duelOpponentScore

  let emoji, title
  if (opponentTimedOut)                             { emoji = '🏆'; title = 'Соперник отключился — ты победил!' }
  else if (window._duelMyScore > opponentScore)     { emoji = '🏆'; title = 'Ты победил!' }
  else if (window._duelMyScore < opponentScore)     { emoji = '💪'; title = 'Соперник победил — реванш?' }
  else                                              { emoji = '🤝'; title = 'Ничья!' }

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
    card(window._duelMyName + ' (ты)', window._duelMyScore,
         !opponentTimedOut ? window._duelMyScore >= opponentScore : true) +
    card(window._duelOpponentName || 'Соперник', opponentScore,
         opponentScore > window._duelMyScore, opponentTimedOut)

  modal.style.display = 'flex'
}
window._showDuelResults = _showDuelResults
