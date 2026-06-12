/**
 * Edge Function: find-email
 *
 * Wraps get_email_by_username RPC (restricted to service role after #15 fix).
 * Called before login when the user types their username instead of email.
 *
 * POST { "username": "..." } → { "email": "..." | null }
 *
 * Security:
 *   - No auth required (pre-login flow)
 *   - Rate-limited: 10 requests / minute per IP
 *   - Input validated: username non-empty, max 50 chars
 *
 * Note: rate limiting is per-isolate (in-memory). On Deno Deploy this is a
 * best-effort first layer; for global enforcement add a Redis-backed counter.
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SERVICE_KEY  = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

// ── In-memory rate limiter ────────────────────────────────────────────────────

const RATE_LIMIT = 10       // requests
const WINDOW_MS  = 60_000   // per minute

const ipWindow = new Map<string, { count: number; start: number }>()

function allowRequest(ip: string): boolean {
  const now   = Date.now()
  const entry = ipWindow.get(ip)
  if (!entry || now - entry.start > WINDOW_MS) {
    ipWindow.set(ip, { count: 1, start: now })
    return true
  }
  if (entry.count >= RATE_LIMIT) return false
  entry.count++
  return true
}

// ── CORS ─────────────────────────────────────────────────────────────────────

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, apikey, Authorization',
}

// ── Handler ───────────────────────────────────────────────────────────────────

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS })
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: CORS }
    )
  }

  // ── Rate limit ────────────────────────────────────────────────────────────
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim()
           ?? req.headers.get('cf-connecting-ip')
           ?? 'unknown'
  if (!allowRequest(ip)) {
    return new Response(
      JSON.stringify({ error: 'Too many requests. Try again in a minute.' }),
      { status: 429, headers: CORS }
    )
  }

  // ── Parse body ────────────────────────────────────────────────────────────
  let body: { username?: unknown }
  try {
    body = await req.json()
  } catch {
    return new Response(
      JSON.stringify({ error: 'Invalid JSON body' }),
      { status: 400, headers: CORS }
    )
  }

  // ── Validate ──────────────────────────────────────────────────────────────
  const username = typeof body.username === 'string' ? body.username.trim() : ''
  if (!username) {
    return new Response(
      JSON.stringify({ error: 'username is required' }),
      { status: 400, headers: CORS }
    )
  }
  if (username.length > 50) {
    return new Response(
      JSON.stringify({ error: 'username too long (max 50 chars)' }),
      { status: 400, headers: CORS }
    )
  }

  // ── Lookup via service role (bypasses RLS, can call restricted RPC) ───────
  const supabase = createClient(SUPABASE_URL, SERVICE_KEY)
  const { data: email, error } = await supabase.rpc('get_email_by_username', {
    p_username: username,
  })

  if (error) {
    console.error('get_email_by_username error:', error.message)
    return new Response(
      JSON.stringify({ error: 'Internal error' }),
      { status: 500, headers: CORS }
    )
  }

  return new Response(
    JSON.stringify({ email: email ?? null }),
    { headers: { 'Content-Type': 'application/json', ...CORS } }
  )
})
