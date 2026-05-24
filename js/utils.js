// ── Утилиты ────────────────────────────────────────────────
export const VAPID_PUBLIC_KEY = 'BHsONHfLYKW7HZtnpi_1_OaXrtbCJQrQ2I3-gXYbIx-4HK9AkLUAEyGDqJuQyN_ym7XQcIlGD-z0qfmY89iAJRo'

export function urlBase64ToUint8Array(b64) {
  const pad = '='.repeat((4 - b64.length % 4) % 4)
  const raw = atob((b64 + pad).replace(/-/g, '+').replace(/_/g, '/'))
  return Uint8Array.from(raw, c => c.charCodeAt(0))
}

// Детерминированный хеш строки (для сидирования RNG)
export function hashCode(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) h = Math.imul(31, h) + str.charCodeAt(i) | 0
  return h >>> 0
}

// Генератор псевдослучайных чисел с сидом
export function mulberry32(seed) {
  return function() {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed)
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t
    return ((t ^ t >>> 14) >>> 0) / 4294967296
  }
}

export function getDailyDate() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}
