import { st } from './state.js'
import { showPage, updateUserUI } from './ui.js'
import { supabase, signUp, signIn, signOut, resetPassword, updatePassword, getEmailByUsername } from './supabase.js'

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
  const input    = document.getElementById('loginEmail').value.trim()
  const password = document.getElementById('loginPassword').value
  const errEl    = document.getElementById('loginError')
  errEl.textContent = ''
  if (!input || !password) { errEl.textContent = 'Заполните все поля'; return }
  const btn = document.getElementById('loginBtn')
  btn.textContent = 'Входим...'; btn.disabled = true

  let email = input
  if (!input.includes('@')) {
    const found = await getEmailByUsername(input)
    if (!found) {
      errEl.textContent = 'Пользователь не найден'
      btn.textContent = 'Войти'; btn.disabled = false
      return
    }
    email = found
  }

  const { data, error } = await signIn(email, password)
  btn.textContent = 'Войти'; btn.disabled = false
  if (error) { errEl.textContent = 'Неверный email или пароль'; return }
  st.currentUser = data.user
  const username = data.user.user_metadata?.username || data.user.email.split('@')[0]
  supabase.from('profiles').upsert({ id: data.user.id, username, email }, { onConflict: 'id' }).then(() => {}).catch(() => {})
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
  if (password.length < 8) { errEl.textContent = 'Пароль минимум 8 символов'; return }
  if (!/\d/.test(password)) { errEl.textContent = 'Пароль должен содержать хотя бы одну цифру'; return }
  if (!/[a-zA-Z]/.test(password)) { errEl.textContent = 'Пароль должен содержать хотя бы одну букву'; return }
  const btn = document.getElementById('registerBtn')
  btn.textContent = 'Регистрируем...'; btn.disabled = true
  const { data, error } = await signUp(email, password, username)
  btn.textContent = 'Зарегистрироваться'; btn.disabled = false
  if (error) { errEl.textContent = error.message; return }
  errEl.style.color = '#10b981'
  errEl.textContent = '✅ Проверьте почту для подтверждения!'
}

window.handleLogout = async function() {
  await signOut()
  st.currentUser = null
  showPage('authPage')
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
  btn.textContent = 'Отправляем...'; btn.disabled = true
  const { error } = await resetPassword(email)
  btn.textContent = 'Отправить'; btn.disabled = false
  if (error) { errEl.textContent = 'Ошибка: ' + error.message }
  else { errEl.style.color = '#10b981'; errEl.textContent = '✅ Письмо отправлено! Проверьте почту.' }
}
async function handleUpdatePassword() {
  const password = document.getElementById('newPassword').value
  const confirm  = document.getElementById('confirmPassword').value
  const errEl    = document.getElementById('updatePasswordError')
  errEl.textContent = ''
  if (!password) { errEl.textContent = 'Введите новый пароль'; return }
  if (password.length < 8) { errEl.textContent = 'Пароль минимум 8 символов'; return }
  if (password !== confirm) { errEl.textContent = 'Пароли не совпадают'; return }
  const btn = document.getElementById('updatePasswordBtn')
  btn.textContent = 'Сохраняем...'; btn.disabled = true
  const { data: { session: activeSession } } = await supabase.auth.getSession()
  if (!activeSession) {
    btn.textContent = 'Сохранить пароль'; btn.disabled = false
    errEl.textContent = 'Ссылка устарела или уже использована. Запросите новую.'
    return
  }
  const { error } = await updatePassword(password)
  btn.textContent = 'Сохранить пароль'; btn.disabled = false
  if (error) { errEl.textContent = 'Ошибка: ' + error.message }
  else {
    errEl.style.color = '#10b981'
    errEl.textContent = '✅ Пароль успешно изменён!'
    setTimeout(() => { showPage('homePage'); updateUserUI() }, 1500)
  }
}
window.togglePasswordVisibility = function(inputId, eyeId) {
  const input = document.getElementById(inputId)
  const eye   = document.getElementById(eyeId)
  if (!input) return
  if (input.type === 'password') { input.type = 'text'; if (eye) eye.textContent = '🙈' }
  else { input.type = 'password'; if (eye) eye.textContent = '👁' }
}

// Экспортируем для HTML-вызовов
window.showForgotPassword   = showForgotPassword
window.showLoginFromForgot  = showLoginFromForgot
window.handleForgotPassword = handleForgotPassword
window.handleUpdatePassword = handleUpdatePassword

// Индикатор надёжности пароля
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('newPassword')
  if (!input) return
  input.addEventListener('input', () => {
    const val = input.value
    const fill = document.getElementById('strengthFill')
    const text = document.getElementById('strengthText')
    const req1 = document.getElementById('req1')
    const req2 = document.getElementById('req2')
    const req3 = document.getElementById('req3')
    const hasLength = val.length >= 8
    const hasDigit  = /\d/.test(val)
    const hasLetter = /[a-zA-Zа-яА-Я]/.test(val)
    if (req1) { req1.textContent = 'Минимум 8 символов'; req1.style.color = hasLength ? '#10b981' : '#94a3b8' }
    if (req2) { req2.textContent = 'Содержит цифры';    req2.style.color = hasDigit  ? '#10b981' : '#94a3b8' }
    if (req3) { req3.textContent = 'Содержит буквы';    req3.style.color = hasLetter ? '#10b981' : '#94a3b8' }
    const score = [hasLength, hasDigit, hasLetter].filter(Boolean).length
    const colors = ['', '#ef4444', '#f59e0b', '#10b981']
    const labels = ['', 'Слабый', 'Средний', 'Надёжный']
    if (fill) { fill.style.width = (score * 33) + '%'; fill.style.background = colors[score] }
    if (text) { text.textContent = val ? labels[score] : ''; text.style.color = colors[score] }
  })
})

// ── Защита от одновременного входа (Presence-based) ──────
let _sessionChannel = null
let _sessionGuardUserId = null
let _mySessionId = null

function _blockNewLogin() {
  if (_sessionChannel) { _sessionChannel.unsubscribe(); _sessionChannel = null }
  _sessionGuardUserId = null; _mySessionId = null
  st.kickedOut = true
  supabase.auth.signOut()
}

export function setupSessionGuard(userId, onApproved = null) {
  if (_sessionGuardUserId === userId && _sessionChannel) return
  _sessionGuardUserId = userId
  if (!_mySessionId) {
    _mySessionId = localStorage.getItem('_sId')
    if (!_mySessionId) {
      _mySessionId = Date.now() + '_' + Math.random().toString(36).slice(2)
      localStorage.setItem('_sId', _mySessionId)
    }
  }
  if (_sessionChannel) { _sessionChannel.unsubscribe(); _sessionChannel = null }
  let _firstSync = true
  _sessionChannel = supabase.channel(`user-active:${userId}`)

  // Fallback: if presence.sync never fires within 8s, approve anyway
  let _guardTimeout = null
  if (onApproved) {
    _guardTimeout = setTimeout(() => {
      if (_firstSync) {
        _firstSync = false
        _sessionChannel?.track({ session_id: _mySessionId, joined_at: Date.now() }).catch(() => {})
        onApproved()
      }
    }, 8000)
  }

  _sessionChannel
    .on('presence', { event: 'sync' }, async () => {
      if (!_firstSync) return
      _firstSync = false
      if (_guardTimeout) { clearTimeout(_guardTimeout); _guardTimeout = null }
      const state = _sessionChannel.presenceState()
      const others = Object.values(state).flat().filter(p => p.session_id !== _mySessionId)
      if (others.length > 0) {
        _blockNewLogin()
        return
      }
      await _sessionChannel?.track({ session_id: _mySessionId, joined_at: Date.now() })
      onApproved?.()
    })
    .subscribe()
}

export function teardownSessionGuard() {
  if (_sessionChannel) { _sessionChannel.unsubscribe(); _sessionChannel = null }
  _sessionGuardUserId = null; _mySessionId = null
}
