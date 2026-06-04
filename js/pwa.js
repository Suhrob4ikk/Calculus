import { st } from './state.js'
import { savePushSubscription, deletePushSubscription } from './supabase.js'
import { VAPID_PUBLIC_KEY, urlBase64ToUint8Array } from './utils.js'

// ── Service Worker ────────────────────────────────────────
export async function registerSW() {
  if (!('serviceWorker' in navigator)) return
  try {
    const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' })
    console.log('SW registered:', reg.scope)
    st.swReg = reg
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
  const btnProfile = document.getElementById('installAppBtnProfile')
  if (btn) btn.style.display = 'flex'
  if (btnProfile) btnProfile.style.display = 'flex'
})
window.addEventListener('appinstalled', () => {
  _deferredInstallPrompt = null
  const btn = document.getElementById('installAppBtn')
  if (btn) btn.style.display = 'none'
  const btnProfile = document.getElementById('installAppBtnProfile')
  if (btnProfile) btnProfile.style.display = 'none'
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
    const reg = st.swReg || await navigator.serviceWorker.ready
    const existing = await reg.pushManager.getSubscription()
    if (existing) return existing
    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
    })
    if (st.currentUser) await savePushSubscription(st.currentUser.id, sub.toJSON())
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
    if (st.currentUser) await deletePushSubscription(st.currentUser.id)
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
    btn.innerHTML = '<i data-lucide="bell" style="width:14px;height:14px"></i> Включить уведомления'
    if (window.lucide) window.lucide.createIcons({ el: btn })
    btn.classList.remove('active-push')
    localStorage.setItem('pushEnabled', 'false')
  } else {
    const sub = await subscribePush()
    if (sub) {
      btn.innerHTML = '<i data-lucide="bell-off" style="width:14px;height:14px"></i> Отключить уведомления'
      if (window.lucide) window.lucide.createIcons({ el: btn })
      btn.classList.add('active-push')
      localStorage.setItem('pushEnabled', 'true')
    }
  }
}
