// ── [РЕК-9] Service Worker v7 ──────────────────────────────────────────────
// Стратегии кэширования:
//   navigate   → network-first + offline fallback на /index.html из кэша
//   CDN        → cache-first   (лазурное кэширование при первом обращении)
//   JS / CSS   → network-first + cache fallback (всегда свежий код)
//   остальное  → stale-while-revalidate (кэш сразу, сеть обновляет фоново)
//   supabase   → bypass (API не кэшируем никогда)
//
// ВАЖНО: CDN-URL больше НЕ передаются в c.addAll() при установке.
// Если хотя бы один URL вернёт ошибку — вся установка SW падала (v6 баг).
// Теперь SHELL содержит только same-origin файлы; CDN кэшируется лениво.

const CACHE = 'mathcore-v8'

// Только same-origin статика — install гарантированно успешен
const SHELL = [
  '/',
  '/index.html',
  '/css/style.css',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/badge.svg',
  // Основные модули
  '/js/script.js',
  '/js/state.js',
  '/js/utils.js',
  '/js/supabase.js',
  '/js/ui.js',
  '/js/auth.js',
  '/js/test.js',
  '/js/daily.js',
  '/js/duel.js',
  '/js/profile.js',
  '/js/stats.js',
  '/js/search.js',
  '/js/theory.js',
  '/js/section-theory.js',
  '/js/exam.js',
  '/js/mistakes.js',
  '/js/pwa.js',
  '/js/mathjax-config.js',
  // Банки вопросов
  '/js/questions.js',
  '/js/open-questions.js',
  '/js/integrals-questions.js',
  '/js/derivatives-questions.js',
  '/js/series-questions.js',
  '/js/limits-questions.js',
  '/js/ode-questions.js',
  '/js/probability-questions.js',
  '/js/linalg-questions.js',
  // Теория
  '/js/calculus-chapters.js',
  '/js/prob-chapters.js',
  '/js/prob-theory.js',
]

// ── Установка: кэшируем только same-origin SHELL ────────────────────────────
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(SHELL))
      .then(() => self.skipWaiting())
  )
})

// ── Активация: удаляем старые кэши ──────────────────────────────────────────
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  )
})

// ── Fetch ────────────────────────────────────────────────────────────────────
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return
  if (e.request.url.includes('supabase.co')) return   // API — всегда сеть
  if (e.request.url.endsWith('.apk')) return           // APK — без кэша

  const url = e.request.url

  // 1. Навигация (page load) — network-first, при офлайне отдаём /index.html
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request)
        .then(res => {
          if (res.ok) {
            const toCache = res.clone()
            caches.open(CACHE).then(c => c.put(e.request, toCache))
          }
          return res
        })
        .catch(() =>
          caches.match(e.request)
            .then(hit => hit || caches.match('/'))
            .then(hit => hit || caches.match('/index.html'))
        )
    )
    return
  }

  // 2. CDN-ресурсы — cache-first, лениво кэшируем при первом обращении.
  //    Включает MathJax, KaTeX, Chart.js, Tailwind, Lucide, Google Fonts.
  const isCDN = (
    url.includes('cdn.tailwindcss.com') ||
    url.includes('unpkg.com') ||
    url.includes('cdn.jsdelivr.net') ||
    url.includes('cdn.mathjax.org') ||
    url.includes('cdnjs.cloudflare.com') ||
    url.includes('fonts.googleapis.com') ||
    url.includes('fonts.gstatic.com')
  )
  if (isCDN) {
    e.respondWith(
      caches.match(e.request).then(cached => {
        if (cached) return cached
        return fetch(e.request)
          .then(res => {
            if (res && res.status === 200) {
              const toCache = res.clone()
              caches.open(CACHE).then(c => c.put(e.request, toCache))
            }
            return res
          })
          .catch(() =>
            // Офлайн и не закэшировано — вернём пустой ответ вместо сетевой ошибки.
            // Формулы не отобразятся, но приложение не упадёт.
            new Response('', { status: 503, statusText: 'Offline – CDN not cached' })
          )
      })
    )
    return
  }

  // 3. Same-origin JS / CSS — network-first (всегда свежий код), кэш как запасной
  if (url.endsWith('.js') || url.endsWith('.css')) {
    e.respondWith(
      fetch(e.request)
        .then(res => {
          if (res && res.status === 200 && res.type === 'basic') {
            const toCache = res.clone()
            caches.open(CACHE).then(c => c.put(e.request, toCache))
          }
          return res
        })
        .catch(() => caches.match(e.request))
    )
    return
  }

  // 4. Всё остальное (иконки, изображения, прочее) — stale-while-revalidate:
  //    сразу возвращаем кэш, в фоне обновляем. Если кэша нет — ждём сети.
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) {
        // Фоновое обновление кэша (не блокирует ответ)
        fetch(e.request)
          .then(res => {
            if (res && res.status === 200 && res.type === 'basic') {
              caches.open(CACHE).then(c => c.put(e.request, res.clone()))
            }
          })
          .catch(() => {})
        return cached
      }
      // Ничего в кэше — идём в сеть
      return fetch(e.request).then(res => {
        if (res && res.status === 200 && res.type === 'basic') {
          const toCache = res.clone()
          caches.open(CACHE).then(c => c.put(e.request, toCache))
        }
        return res
      })
    })
  )
})

// ── Push-уведомление ─────────────────────────────────────────────────────────
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

// ── Клик по уведомлению ──────────────────────────────────────────────────────
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
