// Supabase Edge Function: send-push
// Отправляет ежедневные push-уведомления всем подписанным пользователям
// Запускается через Supabase Cron (Dashboard → Edge Functions → Schedule)

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// ── Web Push (VAPID) ───────────────────────────────────────────────────────
const VAPID_PUBLIC_KEY  = Deno.env.get('VAPID_PUBLIC_KEY')!
const VAPID_PRIVATE_KEY = Deno.env.get('VAPID_PRIVATE_KEY')!
const VAPID_EMAIL       = Deno.env.get('VAPID_EMAIL') ?? 'mailto:admin@example.com'

// ── FCM (Android) ─────────────────────────────────────────────────────────
// Set FCM_SERVICE_ACCOUNT_JSON to the contents of your Firebase service account
// key JSON (generated in Firebase Console → Project Settings → Service Accounts).
const FCM_SA_JSON = Deno.env.get('FCM_SERVICE_ACCOUNT_JSON')

interface ServiceAccount {
  client_email: string
  private_key: string
  project_id: string
}

// ── Helpers ───────────────────────────────────────────────────────────────

function base64UrlToUint8Array(base64: string): Uint8Array {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4)
  const b64 = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw = atob(b64)
  return Uint8Array.from(raw, c => c.charCodeAt(0))
}

function strToB64url(str: string): string {
  return btoa(str).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

function bytesToB64url(buf: ArrayBuffer): string {
  let str = ''
  for (const b of new Uint8Array(buf)) str += String.fromCharCode(b)
  return btoa(str).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

// ── VAPID signing ─────────────────────────────────────────────────────────

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

// ── FCM JWT + access token ────────────────────────────────────────────────

async function getFcmAccessToken(sa: ServiceAccount): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  const header  = strToB64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))
  const payload = strToB64url(JSON.stringify({
    iss: sa.client_email,
    scope: 'https://www.googleapis.com/auth/firebase.messaging',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  }))

  const pemKey = sa.private_key
    .replace(/-----BEGIN PRIVATE KEY-----/g, '')
    .replace(/-----END PRIVATE KEY-----/g, '')
    .replace(/\s+/g, '')
  const keyData = Uint8Array.from(atob(pemKey), c => c.charCodeAt(0))

  const key = await crypto.subtle.importKey(
    'pkcs8', keyData,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false, ['sign']
  )
  const sigBytes = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5', key,
    new TextEncoder().encode(`${header}.${payload}`)
  )
  const jwt = `${header}.${payload}.${bytesToB64url(sigBytes)}`

  const resp = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`,
  })
  const tokenResp = await resp.json()
  console.log('OAuth token response:', JSON.stringify({ status: resp.status, has_token: !!tokenResp.access_token, error: tokenResp.error, error_description: tokenResp.error_description }))
  if (!tokenResp.access_token) throw new Error(`OAuth failed: ${tokenResp.error} — ${tokenResp.error_description}`)
  return tokenResp.access_token
}

async function sendFcm(
  fcmToken: string,
  msg: { title: string; body: string },
  accessToken: string,
  projectId: string,
  extraData: Record<string, string> = {},
): Promise<{ ok: boolean; stale: boolean }> {
  try {
    const res = await fetch(
      `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: {
            token: fcmToken,
            notification: { title: msg.title, body: msg.body },
            data: { url: '/Calculus/', ...extraData },
          },
        }),
      }
    )
    if (res.ok) return { ok: true, stale: false }
    const body = await res.json().catch(() => ({}))
    console.error(`FCM send failed [${res.status}]:`, JSON.stringify(body))
    const errCode: string = body?.error?.details?.[0]?.errorCode ?? ''
    return { ok: false, stale: errCode === 'UNREGISTERED' }
  } catch (e) {
    console.error('FCM send exception:', e)
    return { ok: false, stale: false }
  }
}

// ── Notification content ─────────────────────────────────────────────────

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

// ── Handler ───────────────────────────────────────────────────────────────

Deno.serve(async (req) => {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // ── Targeted duel invite push ──────────────────────────────────────────
  // Called by web duel.js when a user invites a specific opponent.
  // Body: { type: "duel_invite", targetUserId, code, from, section, difficulty }
  if (req.method === 'POST') {
    let body: Record<string, string> | null = null
    try { body = await req.json() } catch { /* not JSON or empty — fall through to broadcast */ }

    if (body?.type === 'duel_invite') {
      // ── Step 1: Verify caller JWT ─────────────────────────────────────────
      // service-role client can verify any Supabase JWT without a separate anon key
      const authHeader = req.headers.get('Authorization') ?? ''
      if (!authHeader.startsWith('Bearer ')) {
        return new Response(
          JSON.stringify({ error: 'Authorization required' }),
          { status: 401 }
        )
      }
      const { data: { user: callerUser }, error: authErr } = await supabase.auth.getUser(
        authHeader.slice(7)
      )
      if (authErr || !callerUser) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
      }

      const { targetUserId, code, from, section = '', difficulty = '' } = body

      if (!targetUserId || !code || !from) {
        return new Response(
          JSON.stringify({ error: 'targetUserId, code and from are required' }),
          { status: 400 }
        )
      }

      // ── Step 2: Verify `from` matches the caller's own username ──────────
      // Prevents sending invites that claim to come from a different user
      const { data: callerProfile } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', callerUser.id)
        .single()
      if (!callerProfile || callerProfile.username !== from) {
        return new Response(
          JSON.stringify({ error: 'Forbidden: from must match your username' }),
          { status: 403 }
        )
      }

      if (!FCM_SA_JSON) {
        return new Response(JSON.stringify({ error: 'FCM_SERVICE_ACCOUNT_JSON not set' }), { status: 500 })
      }

      // Look up the target user's Android FCM token
      const { data: rows } = await supabase
        .from('push_subscriptions')
        .select('fcm_token')
        .eq('user_id', targetUserId)
        .eq('platform', 'android')
        .limit(1)

      const fcmToken: string | undefined = rows?.[0]?.fcm_token
      if (!fcmToken) {
        // No Android token — user may be on web only, that's fine
        return new Response(JSON.stringify({ sent: 0, reason: 'no_android_token' }))
      }

      const sa: ServiceAccount = JSON.parse(FCM_SA_JSON)
      const accessToken = await getFcmAccessToken(sa)
      const deepLink = `mathcore://duel?code=${code}&from=${encodeURIComponent(from)}&section=${section}&difficulty=${difficulty}`

      const result = await sendFcm(
        fcmToken,
        { title: '⚔️ Вызов на дуэль!', body: `${from} приглашает тебя сыграть` },
        accessToken,
        sa.project_id,
        { type: 'duel_invite', deep_link: deepLink }
      )

      return new Response(
        JSON.stringify({ sent: result.ok ? 1 : 0, stale: result.stale }),
        { headers: { 'Content-Type': 'application/json' } }
      )
    }
  }

  // ── Broadcast daily reminder (existing logic) ─────────────────────────
  const { data: subscriptions, error } = await supabase
    .from('push_subscriptions')
    .select('id, user_id, subscription, fcm_token, platform')

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  if (!subscriptions?.length) return new Response(JSON.stringify({ sent: 0 }))

  const msg = randomMessage()

  // Split by platform (null/missing → treated as web for backward compat)
  const webSubs     = subscriptions.filter(r => (r.platform ?? 'web') === 'web' && r.subscription)
  const androidSubs = subscriptions.filter(r => r.platform === 'android' && r.fcm_token)

  // ── Web Push ───────────────────────────────────────────────────────────
  let webSent = 0, webFailed = 0
  const expiredWebIds: string[] = []

  const payload = JSON.stringify({ title: msg.title, body: msg.body, url: '/Calculus/' })

  await Promise.allSettled(webSubs.map(async row => {
    const sub = row.subscription as { endpoint: string; keys: { p256dh: string; auth: string } }
    try {
      const headers = await buildVapidHeaders(sub.endpoint)
      const res = await fetch(sub.endpoint, { method: 'POST', headers, body: payload })
      if (res.status === 201 || res.status === 200) { webSent++ }
      else if (res.status === 410 || res.status === 404) { expiredWebIds.push(row.id); webFailed++ }
      else { webFailed++ }
    } catch { webFailed++ }
  }))

  if (expiredWebIds.length) {
    await supabase.from('push_subscriptions').delete().in('id', expiredWebIds)
  }

  // ── FCM (Android) ──────────────────────────────────────────────────────
  let fcmSent = 0, fcmFailed = 0
  const staleAndroidIds: string[] = []

  if (FCM_SA_JSON && androidSubs.length > 0) {
    try {
      const sa: ServiceAccount = JSON.parse(FCM_SA_JSON)
      const fcmAccessToken = await getFcmAccessToken(sa)

      await Promise.allSettled(androidSubs.map(async row => {
        const result = await sendFcm(row.fcm_token, msg, fcmAccessToken, sa.project_id)
        if (result.ok) { fcmSent++ }
        else { fcmFailed++; if (result.stale) staleAndroidIds.push(row.id) }
      }))

      if (staleAndroidIds.length) {
        await supabase.from('push_subscriptions').delete().in('id', staleAndroidIds)
      }
    } catch (e) {
      console.error('FCM error:', e)
      fcmFailed += androidSubs.length
    }
  }

  return new Response(
    JSON.stringify({
      web:     { sent: webSent,  failed: webFailed,  expired: expiredWebIds.length },
      android: { sent: fcmSent, failed: fcmFailed, stale: staleAndroidIds.length },
    }),
    { headers: { 'Content-Type': 'application/json' } }
  )
})
