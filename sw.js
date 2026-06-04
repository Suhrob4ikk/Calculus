const CACHE = 'mathcore-v3'
const ASSETS = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/script.js',
  '/js/supabase.js',
  '/js/mathjax-config.js',
  '/js/integrals-questions.js',
  '/js/derivatives-questions.js',
  '/js/series-questions.js',
  '/js/limits-questions.js',
  '/js/ode-questions.js',
  '/js/probability-questions.js',
  '/js/linalg-questions.js',
  '/js/prob-chapters.js',
  '/js/calculus-chapters.js',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/badge.svg',
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/lucide@latest',
  'https://cdn.jsdelivr.net/npm/chart.js@4/dist/chart.umd.min.js',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@700;900&display=swap',
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
  const isCDN = url.includes('cdn.tailwindcss.com') || url.includes('unpkg.com') ||
                url.includes('cdn.jsdelivr.net') || url.includes('fonts.googleapis.com') ||
                url.includes('fonts.gstatic.com')

  // CDN ресурсы — cache-first (меняются редко)
  if (isCDN) {
    e.respondWith(
      caches.match(e.request).then(cached => {
        if (cached) return cached
        return fetch(e.request).then(res => {
          if (res && res.status === 200) {
            const clone = res.clone()
            caches.open(CACHE).then(c => c.put(e.request, clone))
          }
          return res
        })
      })
    )
    return
  }

  const isCode = url.endsWith('.js') || url.endsWith('.css')

  if (isCode) {
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
  let payload = { title: 'MathCore', body: 'Не забудь позаниматься сегодня! 📚', url: '/' }
  try { if (e.data) payload = { ...payload, ...e.data.json() } } catch {}

  e.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      icon: '/icons/icon-192.png',
      badge: '/icons/badge.svg',
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

  const target = e.notification.data?.url || '/'
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const c of list) {
        if ('focus' in c) return c.focus()
      }
      return clients.openWindow(target)
    })
  )
})

// ── Синхронизация в фоне ────────────────────────────────
self.addEventListener('sync', e => {
  if (e.tag === 'sync-results') {}
})
