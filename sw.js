const CACHE = 'calculus-v2'
const ASSETS = [
  '/Calculus/',
  '/Calculus/index.html',
  '/Calculus/css/style.css',
  '/Calculus/js/script.js',
  '/Calculus/js/supabase.js',
  '/Calculus/js/mathjax-config.js',
  '/Calculus/js/integrals-questions.js',
  '/Calculus/js/derivatives-questions.js',
  '/Calculus/js/series-questions.js',
  '/Calculus/js/limits-questions.js',
  '/Calculus/manifest.json',
  '/Calculus/icons/icon.svg',
  '/Calculus/icons/badge.svg',
]

// ── Установка: кэшируем все статические ресурсы ────────────
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(ASSETS))
      .then(() => self.skipWaiting())
  )
})

// ── Активация: удаляем старые кэши ────────────────────────
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  )
})

// ── Fetch: JS/CSS — сначала сеть (всегда свежий код),
//           остальное — сначала кэш (быстрее) ───────────────
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return
  if (e.request.url.includes('supabase.co')) return

  const url = e.request.url
  // For JS and CSS always try network first so code updates are instant
  const isCode = url.endsWith('.js') || url.endsWith('.css')

  if (isCode) {
    // Network-first: fetch fresh, update cache, fall back to cache if offline
    e.respondWith(
      fetch(e.request).then(res => {
        if (res && res.status === 200 && res.type === 'basic') {
          const resClone = res.clone()
          caches.open(CACHE).then(c => c.put(e.request, resClone))
        }
        return res
      }).catch(() => caches.match(e.request))
    )
  } else {
    // Cache-first for HTML, images, fonts
    e.respondWith(
      caches.match(e.request).then(cached => {
        const network = fetch(e.request).then(res => {
          if (res && res.status === 200 && res.type === 'basic') {
            const resClone = res.clone()
            caches.open(CACHE).then(c => c.put(e.request, resClone))
          }
          return res
        })
        return cached || network
      })
    )
  }
})

// ── Push-уведомление ─────────────────────────────────────
self.addEventListener('push', e => {
  let payload = { title: 'Математический анализ', body: 'Не забудь позаниматься сегодня! 📚', url: '/Calculus/' }
  try { if (e.data) payload = { ...payload, ...e.data.json() } } catch {}

  e.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      icon: '/Calculus/icons/icon.svg',
      badge: '/Calculus/icons/badge.svg',
      data: { url: payload.url },
      vibrate: [100, 50, 100],
      requireInteraction: false,
      actions: [
        { action: 'open',    title: '📖 Заниматься' },
        { action: 'dismiss', title: 'Позже'         }
      ]
    })
  )
})

// ── Клик по уведомлению ──────────────────────────────────
self.addEventListener('notificationclick', e => {
  e.notification.close()
  if (e.action === 'dismiss') return

  const target = e.notification.data?.url || '/Calculus/'
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const c of list) {
        if (c.url.includes('/Calculus/') && 'focus' in c) return c.focus()
      }
      return clients.openWindow(target)
    })
  )
})

// ── Синхронизация в фоне (при восстановлении сети) ───────
self.addEventListener('sync', e => {
  if (e.tag === 'sync-results') {
    // Здесь можно добавить логику синхронизации офлайн-результатов
  }
})
