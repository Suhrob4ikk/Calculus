import { st } from './state.js'
import { showPage } from './ui.js'
import { supabase, searchProfiles } from './supabase.js'
import { hashCode, mulberry32, escapeHtml } from './utils.js'
import { startTimer, displayQuestion, clearTestState } from './test.js'
import { QUESTIONS } from './questions.js'

// Состояние дуэли хранится в st.duel (см. state.js)
function _resetDuelState() {
  st.duel.joinHandled = false
  st.duel.startHandled = false
  st.duel.invitedUsername = null
  if (st.duel.countdownInterval) {
    clearInterval(st.duel.countdownInterval)
    st.duel.countdownInterval = null
  }
}

function generateDuelCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)]
  return code
}

function getDuelQuestions(code, section = 'mixed', difficulty = 'medium') {
  const poolsBySection = QUESTIONS
  const seed = hashCode(code + '_duel_' + section + '_' + difficulty)
  const rng  = mulberry32(seed)
  let pool

  if (section === 'mixed') {
    const sects = ['integrals', 'derivatives', 'series', 'limits', 'ode', 'probability', 'linalg']
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

function _duelSetStatus(panelId, msg) {
  const el = document.getElementById(panelId)
  if (el) el.innerHTML = msg
}
window._duelSetStatus = _duelSetStatus

function _refreshDuelPickers() {
  document.querySelectorAll('#duelSectPicker .duel-pick-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.sect === st.duel.section)
  })
  document.querySelectorAll('#duelDiffPicker .duel-pick-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.diff === st.duel.diff)
  })
}

// ── Публичные функции ──

window.showDuelModal = function() {
  st.duel.phase = 'idle'
  st.duel.myScore = null; st.duel.opponentScore = null
  st.duel.code = ''; st.duel.role = ''
  if (st.duel.countdownInterval) { clearInterval(st.duel.countdownInterval); st.duel.countdownInterval = null }
  if (st.duel.channel) { st.duel.channel.unsubscribe(); st.duel.channel = null }
  document.getElementById('duelCodeDisplay').textContent    = '——————'
  document.getElementById('duelCreateStatus').textContent   = 'Нажми кнопку чтобы создать дуэль'
  document.getElementById('duelCreateBtn').disabled         = false
  document.getElementById('duelCreateBtn').innerHTML      = '<i data-lucide="swords" class="e-ic"></i> Создать дуэль'
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
  if (st.duel.channel) { st.duel.channel.unsubscribe(); st.duel.channel = null }
  document.getElementById('duelModal').style.display = 'none'
}

window.showDuelTab = function(tab) {
  window.transitionHelper?.(() => {
    document.getElementById('duelCreatePanel').style.display = tab === 'create' ? '' : 'none'
    document.getElementById('duelJoinPanel').style.display   = tab === 'join'   ? '' : 'none'
    document.getElementById('duelTabCreate')?.classList.toggle('active', tab === 'create')
    document.getElementById('duelTabJoin')?.classList.toggle('active', tab === 'join')
  })
}

window.setDuelSection = function(sect) { st.duel.section = sect; _refreshDuelPickers() }
window.setDuelDiff    = function(diff) { st.duel.diff    = diff; _refreshDuelPickers() }

window.validateInviteUsername = async function() {
  const input   = document.getElementById('inviteUsernameInput')
  const errorEl = document.getElementById('inviteError')
  if (!input) return true
  const username = input.value.trim().toLowerCase()
  if (!username) {
    if (errorEl) errorEl.style.display = 'none'
    input.style.borderColor = 'rgba(139,92,246,0.3)'
    st.duel.invitedUserId = null
    return true
  }
  const { data, error } = await searchProfiles(username)
  const match = data?.find(p => p.username && p.username.toLowerCase() === username)
  if (error || !match) {
    if (errorEl) { errorEl.textContent = 'Пользователь не найден'; errorEl.style.display = 'block' }
    input.style.borderColor = '#f87171'
    st.duel.invitedUserId = null
    return false
  }
  // Store the user_id so createDuel() can send a targeted FCM push
  st.duel.invitedUserId = match.id ?? null
  if (errorEl) errorEl.style.display = 'none'
  input.style.borderColor = '#10b981'
  return true
}

window.copyDuelCode = function() {
  if (!st.duel.code) return
  const el = document.getElementById('duelCodeDisplay')
  const orig = el.textContent
  navigator.clipboard.writeText(st.duel.code).then(() => {
    el.innerHTML = '<i data-lucide="check" class="e-ic"></i> Скопировано!'
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
  st.duel.invitedUsername = invited ? invited.toLowerCase() : null

  st.duel.code   = generateDuelCode()
  st.duel.role   = 'host'
  st.duel.myName = st.currentUser.user_metadata?.username || st.currentUser.email.split('@')[0]
  document.getElementById('duelCodeDisplay').textContent = st.duel.code
  const shareWrap = document.getElementById('duelShareBtnWrap')
  if (shareWrap) shareWrap.style.display = 'block'
  _duelSetStatus('duelCreateStatus', st.duel.invitedUsername
    ? `<i data-lucide="hourglass" class="e-ic"></i> Ожидаем ${invited}…`
    : '<i data-lucide="hourglass" class="e-ic"></i> Ожидаем соперника…')

  if (st.duel.channel) { st.duel.channel.unsubscribe(); st.duel.channel = null }
  st.duel.channel = supabase.channel('duel:' + st.duel.code, { config: { broadcast: { self: false } } })

  st.duel.joinHandled  = false
  st.duel.startHandled = false
  st.duel.countdownInterval = null

  st.duel.channel
    .on('broadcast', { event: 'join' }, ({ payload }) => {
      if (st.duel.joinHandled) return
      if (st.duel.phase !== 'idle') return
      st.duel.joinHandled = true
      st.duel.opponentName = payload.name
      _duelSetStatus('duelCreateStatus', `<i data-lucide="check-circle-2" class="e-ic"></i> ${escapeHtml(st.duel.opponentName)} подключился! Начинаем…`)
      st.duel.channel.send({
        type: 'broadcast', event: 'start',
        // D4: адресуем старт принятому гостю по имени — если на код успели войти
        // двое, «лишний» гость увидит, что старт не для него, и не начнёт игру.
        payload: { code: st.duel.code, section: st.duel.section, difficulty: st.duel.diff, guestName: payload.name }
      })
      if (st.duel.startHandled) return
      st.duel.startHandled = true
      _beginDuelCountdown()
    })
    .on('broadcast', { event: 'score' }, ({ payload }) => {
      st.duel.opponentScore = payload.score
      st.duel.opponentName  = payload.name || st.duel.opponentName
      _checkDuelComplete()
    })
    .on('broadcast', { event: 'rematch_request' }, ({ payload }) => {
      if (st.duel.isRematchRequester) { _resolveSimultaneousRematch(payload.name); return }
      _showRematchRequest(payload.name)
    })
    .on('broadcast', { event: 'rematch_accept' },  () => { _onRematchAccepted() })
    .on('broadcast', { event: 'rematch_start' },   ({ payload }) => { _onRematchStart(payload) })
    .on('broadcast', { event: 'rematch_decline' }, () => {
      const btn = document.getElementById('rematchBtn')
      if (btn) { btn.textContent = 'Соперник отказался'; btn.disabled = true }
    })
    .subscribe(status => {
      // D5: не оставляем кнопку залипшей на «Создаём…», если канал не поднялся
      if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
        const b = document.getElementById('duelCreateBtn')
        if (b) { b.disabled = false; b.innerHTML = '<i data-lucide="swords" class="e-ic"></i> Создать дуэль' }
        _duelSetStatus('duelCreateStatus', '<i data-lucide="x-circle" class="e-ic"></i> Ошибка соединения. Попробуй ещё раз.')
      }
    })

  // Отправляем инвайт, если указан username
  if (st.duel.invitedUsername) {
    const isValid = /^[a-zA-Zа-яА-ЯёЁ0-9_][a-zA-Zа-яА-ЯёЁ0-9_]{1,30}$/.test(st.duel.invitedUsername);
    if (!isValid) {
      _duelSetStatus('duelCreateStatus', '<i data-lucide="x-circle" class="e-ic"></i> Некорректный ник приглашённого');
    } else {
      // Path A: Realtime broadcast — reaches Android if app is open and WS connected.
      // Guard with invitesChannelReady: if not yet SUBSCRIBED, send() is a no-op and
      // the invite would be silently lost.
      if (st.duel.invitesChannelReady && st.duel.invitesChannel) {
        st.duel.invitesChannel.send({
          type: 'broadcast',
          event: 'invite',
          payload: {
            invitedUsername: st.duel.invitedUsername,
            code: st.duel.code,
            inviterName: st.duel.myName,
            section: st.duel.section,
            difficulty: st.duel.diff
          }
        })
      } else {
        // Channel not ready yet — retry once after 1.5 s (covers race on first load)
        const _snap = { username: st.duel.invitedUsername, code: st.duel.code, name: st.duel.myName, section: st.duel.section, diff: st.duel.diff }
        setTimeout(() => {
          if (st.duel.invitesChannelReady && st.duel.invitesChannel) {
            st.duel.invitesChannel.send({
              type: 'broadcast', event: 'invite',
              payload: { invitedUsername: _snap.username, code: _snap.code, inviterName: _snap.name, section: _snap.section, difficulty: _snap.diff }
            })
          }
        }, 1500)
      }

      // Path B: FCM push — reaches Android even if app is closed/backgrounded
      if (st.duel.invitedUserId) {
        supabase.functions.invoke('send-push', {
          body: {
            type: 'duel_invite',
            targetUserId: st.duel.invitedUserId,
            code: st.duel.code,
            from: st.duel.myName,
            section: st.duel.section,
            difficulty: st.duel.diff
          }
        }).catch(() => { /* best-effort, don't block the game */ })
      }
    }
  }
}

window.joinDuel = async function() {
  if (!st.currentUser) { alert('Войди в аккаунт, чтобы принять участие'); return }
  const input = document.getElementById('duelJoinInput')
  const code  = input.value.trim().toUpperCase()
  if (code.length < 4) { _duelSetStatus('duelJoinStatus', '<i data-lucide="x-circle" class="e-ic"></i> Введи код (минимум 4 символа)'); return }

  st.duel.code   = code
  st.duel.role   = 'guest'
  st.duel.myName = st.currentUser.user_metadata?.username || st.currentUser.email.split('@')[0]
  _duelSetStatus('duelJoinStatus', '<i data-lucide="hourglass" class="e-ic"></i> Подключаемся…')

  if (st.duel.channel) { st.duel.channel.unsubscribe(); st.duel.channel = null }
  st.duel.channel = supabase.channel('duel:' + st.duel.code, { config: { broadcast: { self: false } } })

  st.duel.channel
    .on('broadcast', { event: 'start' }, ({ payload }) => {
      if (st.duel.phase !== 'idle') return
      // D4: старт адресован конкретному гостю — если это не мы, ждём дальше
      // (нас вернёт из лобби фолбэк D1, если хост так и не начнёт с нами).
      if (payload?.guestName && payload.guestName !== st.duel.myName) return
      if (payload?.section)    st.duel.section = payload.section
      if (payload?.difficulty) st.duel.diff    = payload.difficulty
      _beginDuelCountdown()
    })
    .on('broadcast', { event: 'score' }, ({ payload }) => {
      st.duel.opponentScore = payload.score
      st.duel.opponentName  = payload.name || st.duel.opponentName
      _checkDuelComplete()
    })
    .on('broadcast', { event: 'rematch_request' }, ({ payload }) => {
      if (st.duel.isRematchRequester) { _resolveSimultaneousRematch(payload.name); return }
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
        st.duel.channel.send({ type: 'broadcast', event: 'join', payload: { name: st.duel.myName } })
        _duelSetStatus('duelJoinStatus', '<i data-lucide="check-circle-2" class="e-ic"></i> Подключился! Ожидаем старта…')
        document.getElementById('duelJoinPanel').style.display  = 'none'
        document.getElementById('duelTabsBar').style.display    = 'none'
        document.getElementById('duelLobby').style.display      = ''
        document.getElementById('duelLobbyMsg').textContent     = 'Подключился! Ожидаем старта…'
        // D1: не зависаем в лобби навсегда — если host не пришлёт start за 12с,
        // возвращаем к вводу кода с понятной ошибкой.
        if (st.duel.lobbyTimeout) clearTimeout(st.duel.lobbyTimeout)
        st.duel.lobbyTimeout = setTimeout(() => {
          st.duel.lobbyTimeout = null
          if (st.duel.phase !== 'idle') return   // старт уже пришёл
          document.getElementById('duelLobby').style.display   = 'none'
          document.getElementById('duelTabsBar').style.display = ''
          window.showDuelTab('join')
          _duelSetStatus('duelJoinStatus', '<i data-lucide="x-circle" class="e-ic"></i> Соперник не ответил. Проверь код и попробуй снова.')
        }, 12000)
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
  if (st.duel.phase !== 'idle') return
  st.duel.phase = 'countdown'
  if (st.duel.lobbyTimeout) { clearTimeout(st.duel.lobbyTimeout); st.duel.lobbyTimeout = null }
  if (st.duel.countdownInterval) { clearInterval(st.duel.countdownInterval); st.duel.countdownInterval = null }
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
      st.duel.countdownInterval = null
      // Скрываем как модал, так и страницу дуэли (если открыта)
      const duelModal = document.getElementById('duelModal')
      if (duelModal) duelModal.style.display = 'none'
      const duelPageEl = document.getElementById('duelPage')
      if (duelPageEl) { duelPageEl.style.display = 'none'; duelPageEl.classList.add('hidden') }
      _beginDuelTest()
    }
  }, 1000)
  st.duel.countdownInterval = iv
}

function _beginDuelTest() {
  st.duel.phase = 'active'
  // Cancel any leftover opponent timeout from a previous round
  if (st.duel.opponentTimeout) { clearTimeout(st.duel.opponentTimeout); st.duel.opponentTimeout = null }
  const questions = getDuelQuestions(st.duel.code, st.duel.section, st.duel.diff)
  st.currentSection    = 'duel'
  st.currentDifficulty = st.duel.diff
  st.currentTest       = questions
  st.currentQuestionIndex = 0
  st.userAnswers       = new Array(questions.length).fill(null)
  st.isStudyMode       = false
  st.testMode          = 'closed'   // дуэль всегда с вариантами (не наследуем 'open')
  st.duel.myScore  = null
  st.duel.opponentScore = null
  st.duel.resultsShown = false   // D3: новый раунд — можно снова показать результаты
  const timePerQ = st.duel.section === 'ode'
    ? (st.duel.diff === 'easy' ? 60 : st.duel.diff === 'hard' ? 120 : 90)
    : (st.duel.diff === 'easy' ? 30 : st.duel.diff === 'hard' ? 90  : 60)
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
  const sectNames = { mixed: 'Все разделы', integrals: 'Интегралы', derivatives: 'Производные', series: 'Ряды', limits: 'Пределы', ode: 'Дифф. уравнения', probability: 'Вероятность', linalg: 'Линейная алгебра' }
  const diffName  = st.duel.diff === 'easy' ? 'Лёгкий' : st.duel.diff === 'hard' ? 'Сложный' : 'Средний'
  document.getElementById('testTitle').textContent       = `Дуэль: ${sectNames[st.duel.section] || 'Смешанный'}`
  document.getElementById('difficultyLabel').textContent = `Уровень: ${diffName} · Дуэль 1v1`
  const timerEl = document.getElementById('timerDisplay')
  if (timerEl) timerEl.style.display = ''
  displayQuestion()
  startTimer()
}

function _broadcastDuelScore(percentage) {
  if (st.duel.channel) {
    st.duel.channel.send({ type: 'broadcast', event: 'score', payload: { score: percentage, name: st.duel.myName } })
  }
}
st.duel.broadcastScore = _broadcastDuelScore

function _checkDuelComplete() {
  if (st.duel.myScore !== null && st.duel.opponentScore !== null) {
    _showDuelResults()
  }
}
st.duel.checkComplete = _checkDuelComplete

// ── Реванш ──
window.requestRematch = function() {
  st.duel.isRematchRequester = true
  const btn = document.getElementById('rematchBtn')
  if (btn) { btn.textContent = 'Ожидаем ответа…'; btn.disabled = true }
  st.duel.channel?.send({ type: 'broadcast', event: 'rematch_request', payload: { name: st.duel.myName } })
}

// Если оба нажали реванш одновременно — разрешаем конфликт по алфавитному порядку имён.
// Тот, чьё имя меньше, становится хостом (отправляет rematch_start).
function _resolveSimultaneousRematch(opponentName) {
  if (!st.duel.isRematchRequester) return  // мы ещё не нажимали
  const weAreHost = st.duel.myName.toLowerCase() < opponentName.toLowerCase()
  if (weAreHost) {
    // Мы — «хост»: отправляем rematch_start
    _onRematchAccepted()
  } else {
    // Мы — «гость»: ждём rematch_start от соперника
    st.duel.isRematchRequester = false
    const btn = document.getElementById('rematchBtn')
    if (btn) { btn.textContent = 'Начинаем…'; btn.disabled = true }
  }
}

window.acceptRematch = function() {
  st.duel.isRematchRequester = false
  document.getElementById('rematchRequestBanner').style.display = 'none'
  const btn = document.getElementById('rematchBtn')
  if (btn) { btn.textContent = 'Начинаем…'; btn.disabled = true }
  st.duel.channel?.send({ type: 'broadcast', event: 'rematch_accept' })
}

window.declineRematch = function() {
  document.getElementById('rematchRequestBanner').style.display = 'none'
  st.duel.channel?.send({ type: 'broadcast', event: 'rematch_decline' })
}

// ── Инвайт-баннер ──
window.showDuelInviteBanner = function(payload) {
  const banner = document.getElementById('duelInviteBanner')
  if (!banner) return
  const name = payload.inviterName || payload.invitedUsername || 'Соперник'
  document.getElementById('duelInviterName').textContent = `${name} приглашает тебя в дуэль`
  st.duel.pendingInvite = payload
  banner.style.display = 'block'
}

window.acceptDuelInvite = function() {
  const payload = st.duel.pendingInvite
  if (!payload) return
  document.getElementById('duelInviteBanner').style.display = 'none'

  st.duel.invitesChannel?.send({
    type: 'broadcast',
    event: 'invite_accepted',
    payload: {
      acceptedBy: st.currentUser?.user_metadata?.username || 'Пользователь',
      code: payload.code
    }
  })

  if (payload.section)    st.duel.section = payload.section
  if (payload.difficulty) st.duel.diff    = payload.difficulty
  st.duel.pendingInvite = null
  window.joinDuelByCode(payload.code)
}

window.declineDuelInvite = function() {
  const payload = st.duel.pendingInvite
  document.getElementById('duelInviteBanner').style.display = 'none'

  if (payload) {
    st.duel.invitesChannel?.send({
      type: 'broadcast',
      event: 'invite_decline',
      payload: {
        declinedBy: st.currentUser?.user_metadata?.username || 'Пользователь',
        code: payload.code
      }
    })
  }

  st.duel.pendingInvite = null
}

function _showRematchRequest(name) {
  const banner = document.getElementById('rematchRequestBanner')
  if (!banner) return
  document.getElementById('rematchRequesterName').textContent = `${name} предлагает реванш`
  banner.style.display = 'block'
  document.getElementById('duelResultsModal').style.display = 'flex'
}

function _onRematchAccepted() {
  if (!st.duel.isRematchRequester) return
  st.duel.isRematchRequester = false
  const newCode = generateDuelCode()
  st.duel.code = newCode
  st.duel.myScore = null; st.duel.opponentScore = null
  st.duel.channel.send({
    type: 'broadcast', event: 'rematch_start',
    payload: { code: newCode, section: st.duel.section, difficulty: st.duel.diff }
  })
  document.getElementById('duelResultsModal').style.display = 'none'
  // Reset phase so countdown guard passes
  st.duel.phase = 'idle'
  _beginDuelCountdown()
}

function _onRematchStart(payload) {
  if (st.duel.isRematchRequester) return
  st.duel.code = payload.code
  if (payload.section)    st.duel.section = payload.section
  if (payload.difficulty) st.duel.diff    = payload.difficulty
  st.duel.myScore = null; st.duel.opponentScore = null
  document.getElementById('duelResultsModal').style.display = 'none'
  // Reset phase so countdown guard passes
  st.duel.phase = 'idle'
  _beginDuelCountdown()
}

function _showDuelResults() {
  if (st.duel.resultsShown) return   // D3: защита от повторного показа (дубль score / гонка)
  st.duel.resultsShown = true
  if (st.duel.opponentTimeout) {
    clearTimeout(st.duel.opponentTimeout)
    st.duel.opponentTimeout = null
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
  const opponentTimedOut = st.duel.opponentScore === -1
  const opponentScore    = opponentTimedOut ? 0 : st.duel.opponentScore
  // D2: соперник отключился — канал дуэли мёртв, реванш невозможен; прячем кнопку,
  // остаётся «На главную».
  if (rematchBtn) rematchBtn.style.display = opponentTimedOut ? 'none' : ''
  let emoji, title
  if (opponentTimedOut)                         { emoji = '<i data-lucide="trophy" class="e-ic"></i>'; title = 'Соперник отключился — ты победил!' }
  else if (st.duel.myScore > opponentScore) { emoji = '<i data-lucide="trophy" class="e-ic"></i>'; title = 'Ты победил!' }
  else if (st.duel.myScore < opponentScore) { emoji = '<i data-lucide="dumbbell" class="e-ic"></i>'; title = 'Соперник победил — реванш?' }
  else                                          { emoji = '<i data-lucide="handshake" class="e-ic"></i>'; title = 'Ничья!' }
  emojiEl.innerHTML = emoji
  titleEl.textContent = title
  const _dark = document.documentElement.classList.contains('dark')
  const card = (name, score, highlight, timedOut = false) => `
    <div class="${!highlight ? 'duel-score-card-normal' : ''}" style="flex:1;min-width:120px;padding:1rem;border-radius:14px;
      background:${highlight ? 'rgba(139,92,246,0.2)' : (_dark ? 'rgba(15,23,42,0.8)' : 'rgba(241,245,249,0.9)')};
      border:1.5px solid ${highlight ? 'rgba(139,92,246,0.5)' : (_dark ? 'rgba(51,65,85,0.5)' : 'rgba(148,163,184,0.5)')}">
      <div style="font-size:0.8rem;color:#94a3b8;margin-bottom:4px">${escapeHtml(name)}</div>
      <div style="font-size:2rem;font-weight:700;color:${timedOut?'#64748b':score>=70?'#10b981':'#f59e0b'}">${timedOut ? '—' : score + '%'}</div>
      ${timedOut ? '<div style="font-size:0.75rem;color:#64748b">отключился</div>' : ''}
    </div>`
  scoresEl.innerHTML =
    card(st.duel.myName + ' (ты)', st.duel.myScore, !opponentTimedOut ? st.duel.myScore >= opponentScore : true) +
    card(st.duel.opponentName || 'Соперник', opponentScore, opponentScore > st.duel.myScore, opponentTimedOut)
  modal.style.display = 'flex'
}
st.duel.showResults = _showDuelResults

// ── Поделиться приглашением ───────────────────────────────
window._shareDuelInvite = function() {
  const code = st.duel.code
  const url  = `https://mathcore-app.vercel.app/?duel=${code}`
  const text = `Вызываю тебя на дуэль по математике! Код: ${code}\n${url}`
  if (navigator.share) {
    navigator.share({ title: 'MathCore Дуэль', text, url }).catch(() => {})
  } else {
    navigator.clipboard.writeText(text)
      .then(() => alert('Ссылка скопирована!'))
      .catch(() => prompt('Скопируй ссылку:', url))
  }
}

// ── Дуэль как страница ────────────────────────────────────
// Рендерит UI дуэли прямо в #duelPage (без модального окна).
// Все game-функции (joinDuel, createDuel, _beginDuelCountdown и т.д.)
// продолжают работать через те же document.getElementById — они найдут
// элементы в #duelPage, т.к. он будет виден.
window.showDuelPage = function() {
  // Сбрасываем состояние
  st.duel.phase = 'idle'
  st.duel.myScore = null; st.duel.opponentScore = null
  st.duel.code = ''; st.duel.role = ''
  st.duel.resultsShown = false
  if (st.duel.lobbyTimeout) { clearTimeout(st.duel.lobbyTimeout); st.duel.lobbyTimeout = null }
  if (st.duel.countdownInterval) { clearInterval(st.duel.countdownInterval); st.duel.countdownInterval = null }
  if (st.duel.channel) { st.duel.channel.unsubscribe(); st.duel.channel = null }

  const container = document.getElementById('duelPage')
  if (!container) return

  container.innerHTML = `
    <div class="duel-container" style="padding:1.5rem clamp(1rem,3vw,1.75rem);max-width:560px;margin:1rem auto">
      <h1 class="duel-hero-title"><i data-lucide="swords" class="e-ic"></i> Дуэль-Арена 1v1</h1>
      <p class="duel-hero-sub">
        Сразись с другом или найди достойного соперника.<br>
        Одинаковые вопросы — кто ответит быстрее и точнее?
      </p>

      <!-- Режимы: Создать / Принять вызов -->
      <div id="duelTabsBar" class="duel-modes">
        <button id="duelTabCreate" class="duel-mode-card active" onclick="showDuelTab('create')">
          <span class="dmc-ico"><i data-lucide="crown"></i></span>
          <span><span class="dmc-t">Создать вызов</span><span class="dmc-s">Стань создателем и брось вызов</span></span>
        </button>
        <button id="duelTabJoin" class="duel-mode-card" onclick="showDuelTab('join')">
          <span class="dmc-ico"><i data-lucide="swords"></i></span>
          <span><span class="dmc-t">Принять вызов</span><span class="dmc-s">Введи код и прими бой</span></span>
        </button>
      </div>

      <!-- Панель «Создать» -->
      <div id="duelCreatePanel">
        <div class="duel-arena-panel">
          <div class="duel-field-label">Выбери дисциплину</div>
          <div class="duel-arena" id="duelSectPicker">
            <svg class="orbit-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <polygon points="50,10 81.3,25.1 89,58.9 67.4,86 32.6,86 11,58.9 18.7,25.1"/>
              <line x1="50" y1="50" x2="50" y2="10"/><line x1="50" y1="50" x2="81.3" y2="25.1"/>
              <line x1="50" y1="50" x2="89" y2="58.9"/><line x1="50" y1="50" x2="67.4" y2="86"/>
              <line x1="50" y1="50" x2="32.6" y2="86"/><line x1="50" y1="50" x2="11" y2="58.9"/>
              <line x1="50" y1="50" x2="18.7" y2="25.1"/>
            </svg>
            <button class="duel-pick-btn duel-arena-center" data-sect="mixed" onclick="setDuelSection('mixed')" title="Все разделы">
              <span class="dac-title">Все</span><span class="dac-sub">разделы</span>
            </button>
            <button class="duel-pick-btn duel-orb os-1" data-sect="limits"      style="left:50%;top:10%"   onclick="setDuelSection('limits')">
              <span class="orb-circle"><span class="subject-emoji">lim</span></span><span class="subject-name">Пределы</span></button>
            <button class="duel-pick-btn duel-orb os-2" data-sect="derivatives" style="left:81.3%;top:25.1%" onclick="setDuelSection('derivatives')">
              <span class="orb-circle"><span class="subject-emoji">f'(x)</span></span><span class="subject-name">Производные</span></button>
            <button class="duel-pick-btn duel-orb os-3" data-sect="integrals"   style="left:89%;top:58.9%"  onclick="setDuelSection('integrals')">
              <span class="orb-circle"><span class="subject-emoji">∫</span></span><span class="subject-name">Интегралы</span></button>
            <button class="duel-pick-btn duel-orb os-4" data-sect="series"       style="left:67.4%;top:86%"  onclick="setDuelSection('series')">
              <span class="orb-circle"><span class="subject-emoji">∑</span></span><span class="subject-name">Ряды</span></button>
            <button class="duel-pick-btn duel-orb os-5" data-sect="ode"          style="left:32.6%;top:86%"  onclick="setDuelSection('ode')">
              <span class="orb-circle"><span class="subject-emoji">y'</span></span><span class="subject-name">Дифф. ур.</span></button>
            <button class="duel-pick-btn duel-orb os-6" data-sect="probability"  style="left:11%;top:58.9%"  onclick="setDuelSection('probability')">
              <span class="orb-circle"><span class="subject-emoji">P</span></span><span class="subject-name">Вероятность</span></button>
            <button class="duel-pick-btn duel-orb os-7" data-sect="linalg"       style="left:18.7%;top:25.1%" onclick="setDuelSection('linalg')">
              <span class="orb-circle"><span class="subject-emoji">Ax</span></span><span class="subject-name">Лин. алгебра</span></button>
          </div>

          <div class="duel-field-label" style="margin-top:0.35rem">Уровень сложности</div>
          <div class="duel-diffs" id="duelDiffPicker">
            <button class="duel-pick-btn duel-diff diff-easy"   data-diff="easy"   onclick="setDuelDiff('easy')">Лёгкий</button>
            <button class="duel-pick-btn duel-diff diff-medium active" data-diff="medium" onclick="setDuelDiff('medium')">Средний</button>
            <button class="duel-pick-btn duel-diff diff-hard"   data-diff="hard"   onclick="setDuelDiff('hard')">Сложный</button>
          </div>
        </div>

        <!-- Код вызова -->
        <div class="duel-code-block">
          <div class="duel-code-left">
            <div class="duel-code-cap">Код вызова</div>
            <span id="duelCodeDisplay" onclick="copyDuelCode()" title="Нажми чтобы скопировать">——————</span>
          </div>
          <button class="duel-copy-btn" onclick="copyDuelCode()"><i data-lucide="copy"></i> Скопировать</button>
        </div>
        <div id="duelShareBtnWrap" style="margin:-0.4rem 0 0.8rem;display:none">
          <button onclick="window._shareDuelInvite()"
            style="width:100%;padding:8px;border-radius:10px;border:1px solid rgba(139,92,246,0.4);
                   background:rgba(139,92,246,0.12);color:#c4b5fd;cursor:pointer;font-size:0.88rem;font-weight:600">
            <i data-lucide="send" class="e-ic"></i> Пригласить друга
          </button>
        </div>

        <div id="duelCreateStatus" style="text-align:center;color:var(--text-sub);font-size:0.88rem;margin-bottom:0.75rem">
          Нажми кнопку чтобы создать дуэль
        </div>
        <input id="inviteUsernameInput" class="duel-input" type="text" placeholder="Имя противника (опционально)"
          style="width:100%;padding:11px 14px;border-radius:12px;font-size:0.92rem;
                 outline:none;margin-bottom:8px;box-sizing:border-box"
          onblur="validateInviteUsername()">
        <p id="inviteError" style="color:#f87171;font-size:0.75rem;margin-top:4px;display:none"></p>
        <button onclick="createDuel()" id="duelCreateBtn" class="btn-start-duel duel-fire"
          style="width:100%;padding:14px;border-radius:14px;border:none;cursor:pointer;font-weight:800;
                 font-size:1.05rem;color:white;transition:all 0.2s">
          <i data-lucide="swords" class="e-ic"></i> Начать Дуэль
        </button>
      </div>

      <!-- Панель «Войти» -->
      <div id="duelJoinPanel" class="duel-arena-panel" style="display:none">
        <p style="color:var(--text-sub);font-size:0.9rem;margin-bottom:1rem;text-align:center">Введи код дуэли от друга.</p>
        <input id="duelJoinInput" class="duel-input" type="text" maxlength="6" placeholder="ABCD12"
          style="width:100%;padding:12px 16px;border-radius:12px;font-size:1.5rem;font-family:monospace;
                 letter-spacing:0.15em;text-align:center;text-transform:uppercase;
                 margin-bottom:1rem;outline:none;box-sizing:border-box"
          oninput="this.value=this.value.toUpperCase()">
        <div id="duelJoinStatus" style="text-align:center;color:var(--text-sub);font-size:0.9rem;margin-bottom:1rem"></div>
        <button onclick="joinDuel()" class="btn-start-duel duel-fire"
          style="width:100%;padding:14px;border-radius:14px;border:none;cursor:pointer;font-weight:800;
                 font-size:1.05rem;color:white;transition:all 0.2s">
          <i data-lucide="swords" class="e-ic"></i> Принять бой
        </button>
      </div>

      <!-- Лобби (ожидание / обратный отсчёт) -->
      <div id="duelLobby" style="display:none;text-align:center;padding:2rem 0">
        <div style="width:44px;height:44px;border-radius:50%;border:3px solid rgba(139,92,246,0.2);
                    border-top-color:#c4b5fd;animation:spin 0.9s linear infinite;margin:0 auto 0.75rem"></div>
        <div id="duelLobbyMsg" style="color:var(--text-main);font-weight:600;font-size:1rem;margin-bottom:0.5rem">
          Ожидаем соперника…
        </div>
        <div id="duelLobbyPlayers" style="color:var(--text-sub);font-size:0.85rem;margin-bottom:1.2rem"></div>
        <div id="duelStartCountdown"
          style="display:none;font-size:3rem;font-weight:700;color:#c4b5fd;margin-bottom:1rem"></div>
      </div>

      <button onclick="showHome()" style="margin-top:1.5rem;width:100%;padding:0.9rem;border-radius:14px;
        border:1px solid rgba(100,116,139,0.4);background:transparent;color:var(--text-sub);
        cursor:pointer;font-size:0.95rem">← Назад</button>
    </div>
  `

  showPage('duelPage')
  _refreshDuelPickers()
  window.showDuelTab('create')
}

// Алиас: showDuelModal → showDuelPage (сохраняем обратную совместимость)
window.showDuelModal = window.showDuelPage

// closeDuelModal теперь возвращает на главную
window.closeDuelModal = function() {
  if (st.duel.channel) { st.duel.channel.unsubscribe(); st.duel.channel = null }
  showHome()
}