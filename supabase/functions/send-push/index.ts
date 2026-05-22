// Supabase Edge Function: send-push
// Отправляет ежедневные push-уведомления всем подписанным пользователям
// Запускается через Supabase Cron (Dashboard → Edge Functions → Schedule)

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const VAPID_PUBLIC_KEY  = Deno.env.get('VAPID_PUBLIC_KEY')!
const VAPID_PRIVATE_KEY = Deno.env.get('VAPID_PRIVATE_KEY')!
const VAPID_EMAIL       = Deno.env.get('VAPID_EMAIL') ?? 'mailto:admin@example.com'

// Конвертация Base64URL → Uint8Array
function base64UrlToUint8Array(base64: string): Uint8Array {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4)
  const b64 = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw = atob(b64)
  return Uint8Array.from(raw, c => c.charCodeAt(0))
}

// Подпись VAPID для авторизации
async function buildVapidHeaders(endpoint: string): Promise<Record<string, string>> {
  const url = new URL(endpoint)
  const audience = `${url.protocol}//${url.host}`
  const exp = Math.floor(Date.now() / 1000) + 12 * 3600

  const header  = btoa(JSON.stringify({ typ: 'JWT', alg: 'ES256' })).replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_')
  const payload = btoa(JSON.stringify({ aud: audience, exp, sub: VAPID_EMAIL })).replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_')

  const privKey = await crypto.subtle.importKey(
    'pkcs8', base64UrlToUint8Array(VAPID_PRIVATE_KEY),
    { name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign']
  )
  const sig = await crypto.subtle.sign(
    { name: 'ECDSA', hash: 'SHA-256' },
    privKey,
    new TextEncoder().encode(`${header}.${payload}`)
  )
  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_')

  return {
    Authorization: `vapid t=${header}.${payload}.${sigB64},k=${VAPID_PUBLIC_KEY}`,
    'Content-Type': 'application/json',
    TTL: '86400',
  }
}

// Тело уведомления (случайный из нескольких вариантов)
function randomMessage() {
  const messages = [
    { title: '📚 Время математики!',  body: 'Реши несколько задач сегодня — и серия не прервётся!'   },
    { title: '🔥 Не теряй серию!',   body: 'Зайди и реши хотя бы один тест. Это займёт 5 минут!'    },
    { title: '🎓 Готовишься к сессии?', body: 'Открой тренажёр и прокачай интегралы или производные!' },
    { title: '⭐ Можешь лучше!',      body: 'Вчера был хороший результат — побей его сегодня!'         },
    { title: '∫ Математика ждёт',    body: 'Заходи — у тебя припасены задачи по пределам и рядам!'  },
  ]
  return messages[Math.floor(Math.random() * messages.length)]
}

Deno.serve(async (req) => {
  // Позволяем ручной вызов через POST или автоматический через cron
  if (req.method !== 'POST' && req.method !== 'GET') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const { data: subscriptions, error } = await supabase
    .from('push_subscriptions')
    .select('id, user_id, subscription')

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  if (!subscriptions?.length) return new Response(JSON.stringify({ sent: 0 }))

  const msg = randomMessage()
  const payload = JSON.stringify({ title: msg.title, body: msg.body, url: '/Calculus/' })

  let sent = 0, failed = 0
  const expired: string[] = []

  await Promise.allSettled(subscriptions.map(async row => {
    const sub = row.subscription as { endpoint: string; keys: { p256dh: string; auth: string } }
    try {
      const headers = await buildVapidHeaders(sub.endpoint)
      const res = await fetch(sub.endpoint, {
        method: 'POST',
        headers,
        body: payload,
      })
      if (res.status === 201 || res.status === 200) { sent++ }
      else if (res.status === 410 || res.status === 404) { expired.push(row.id); failed++ }
      else { failed++ }
    } catch { failed++ }
  }))

  // Удаляем просроченные подписки
  if (expired.length) {
    await supabase.from('push_subscriptions').delete().in('id', expired)
  }

  return new Response(JSON.stringify({ sent, failed, expired: expired.length }), {
    headers: { 'Content-Type': 'application/json' }
  })
})
