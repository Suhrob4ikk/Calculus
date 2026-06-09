/**
 * [Unit tests — web functions]
 *
 * Tests three groups of pure functions:
 *   1. normalizeAnswer   — canonical answer normalisation (mirrors test.js)
 *   2. hashCode          — deterministic 32-bit string hash (utils.js)
 *   3. mulberry32        — seeded PRNG (utils.js)
 *
 * Cross-platform golden values are shared with the Android test suite
 * (SeedUtilsTest.kt / NormalizeAnswerTest.kt).  Any mismatch means
 * Android and web would produce different daily / duel question orders.
 *
 * Usage:
 *   node test/utils.test.mjs
 *
 * Node.js 18+ recommended (uses built-in assert, no extra dependencies).
 */

import { strict as assert } from 'node:assert'
import { hashCode, mulberry32 } from '../js/utils.js'

// ── helpers ──────────────────────────────────────────────────────────────────

let passed = 0
let failed = 0

function test(label, fn) {
  try {
    fn()
    passed++
    process.stdout.write(`  ✓ ${label}\n`)
  } catch (err) {
    failed++
    process.stderr.write(`  ✗ ${label}\n    ${err.message}\n`)
  }
}

function group(name, fn) {
  console.log(`\n── ${name} ${'─'.repeat(Math.max(0, 58 - name.length))}`)
  fn()
}

// ── normalizeAnswer (duplicated from test.js — pure function, no imports) ────

function normalizeAnswer(s) {
  const t = s.trim().toLowerCase().replace(/\s+/g, '').replace(/,/g, '.')
  return t.includes('.') ? t.replace(/0+$/, '').replace(/\.$/, '') : t
}

group('normalizeAnswer', () => {
  // Integers
  test('integer unchanged',           () => assert.strictEqual(normalizeAnswer('10'),      '10'))
  test('zero unchanged',              () => assert.strictEqual(normalizeAnswer('0'),       '0'))
  test('large integer unchanged',     () => assert.strictEqual(normalizeAnswer('1000'),    '1000'))

  // Decimal trimming
  test('trailing zero removed',       () => assert.strictEqual(normalizeAnswer('1.0'),     '1'))
  test('0.0 collapses to 0',          () => assert.strictEqual(normalizeAnswer('0.0'),     '0'))
  test('whitespace + trailing zeros', () => assert.strictEqual(normalizeAnswer(' 2.500 '), '2.5'))
  test('significant decimals kept',   () => assert.strictEqual(normalizeAnswer('3.140'),   '3.14'))
  test('no trailing zeros unchanged', () => assert.strictEqual(normalizeAnswer('1.5'),     '1.5'))

  // Comma decimal separator
  test('comma to dot',                () => assert.strictEqual(normalizeAnswer('1,5'),     '1.5'))
  test('comma zero collapses',        () => assert.strictEqual(normalizeAnswer('1,0'),     '1'))

  // Whitespace
  test('leading/trailing space',      () => assert.strictEqual(normalizeAnswer('  42  '),  '42'))
  test('internal whitespace removed', () => assert.strictEqual(normalizeAnswer('sin x'),   'sinx'))
  test('uppercase lowercased',        () => assert.strictEqual(normalizeAnswer('SIN X'),   'sinx'))
  test('mixed case + space',          () => assert.strictEqual(normalizeAnswer('Ln X'),    'lnx'))

  // Edge cases
  test('empty string',                () => assert.strictEqual(normalizeAnswer(''),        ''))
  test('only dot',                    () => assert.strictEqual(normalizeAnswer('.'),        ''))
  test('.0 collapses',                () => assert.strictEqual(normalizeAnswer('.0'),       ''))
})

// ── hashCode ─────────────────────────────────────────────────────────────────

group('hashCode (cross-platform)', () => {
  test('empty string → 0',
    () => assert.strictEqual(hashCode('') >>> 0, 0))

  test('single char "a" → 97',
    // 31×0 + 97 = 97  (no overflow)
    () => assert.strictEqual(hashCode('a') >>> 0, 97))

  test('"ab" → 3105',
    // 31×97 + 98 = 3105  (no overflow)
    () => assert.strictEqual(hashCode('ab') >>> 0, 3105))

  /**
   * Cross-platform golden value — must match Android SeedUtilsTest:
   *   webHashCode("hello") === 99162322
   *
   * Verified manually (no 32-bit overflow for these 5 ASCII chars):
   *   h=104 → 3325 → 103183 → 3198781 → 99162322
   */
  test('"hello" → 99162322 (cross-platform golden)',
    () => assert.strictEqual(hashCode('hello') >>> 0, 99162322))

  test('deterministic — same input same output', () => {
    assert.strictEqual(hashCode('calculus') >>> 0, hashCode('calculus') >>> 0)
  })

  test('different inputs differ', () => {
    assert.notStrictEqual(hashCode('abc') >>> 0, hashCode('abd') >>> 0)
  })
})

// ── mulberry32 ────────────────────────────────────────────────────────────────

group('mulberry32 — range & determinism', () => {
  test('outputs are in [0, 1)', () => {
    const rng = mulberry32(42)
    for (let i = 0; i < 200; i++) {
      const v = rng()
      assert.ok(v >= 0 && v < 1, `Step ${i}: expected [0,1), got ${v}`)
    }
  })

  test('same seed → same sequence', () => {
    const a = mulberry32(12345)
    const b = mulberry32(12345)
    for (let i = 0; i < 20; i++) {
      const va = a()
      const vb = b()
      assert.strictEqual(va, vb, `Diverged at step ${i}: ${va} ≠ ${vb}`)
    }
  })

  test('different seeds → different first values', () => {
    assert.notStrictEqual(mulberry32(1)(), mulberry32(2)())
  })

  test('successive calls differ', () => {
    const rng = mulberry32(99)
    assert.notStrictEqual(rng(), rng())
  })

  test('floor indices stay in [0, 9]', () => {
    const rng = mulberry32(777)
    for (let i = 0; i < 500; i++) {
      const idx = Math.floor(rng() * 10)
      assert.ok(idx >= 0 && idx <= 9, `Step ${i}: index ${idx} out of [0,9]`)
    }
  })
})

// ── Cross-platform integration ─────────────────────────────────────────────────

group('Cross-platform integration', () => {
  /**
   * Seeds mulberry32 with the "hello" golden hash (99162322) and verifies
   * Fisher-Yates indices.  The IDENTICAL assertion lives in Android
   * SeedUtilsTest.integration_prng_seeded_from_hello_hash().
   */
  test('PRNG seeded from "hello" hash produces valid Fisher-Yates indices', () => {
    const seed = hashCode('hello') >>> 0
    assert.strictEqual(seed, 99162322, `Hash guard: expected 99162322, got ${seed}`)
    const rng = mulberry32(seed)
    for (let i = 0; i < 100; i++) {
      const idx = Math.floor(rng() * 10)
      assert.ok(idx >= 0 && idx <= 9, `Step ${i}: index ${idx} out of [0,9]`)
    }
  })

  /**
   * "2026-06" (7 chars) overflows to a negative 32-bit value (h = -1_447_427_407
   * after the multiply at step 7).  After `seed |= 0` in mulberry32, JS and
   * Kotlin see the same signed int, so the sequence must be identical.
   * (Same assertion lives in SeedUtilsTest.integration_overflow_seed_determinism.)
   */
  test('overflow seed is still deterministic', () => {
    const seed = hashCode('2026-06') | 0   // signed 32-bit — same as Kotlin webHashCode()
    assert.ok(seed < 0, `Expected negative (overflow) hash for '2026-06', got ${seed}`)

    const seq1 = (() => { const r = mulberry32(seed); return Array.from({ length: 10 }, r) })()
    const seq2 = (() => { const r = mulberry32(seed); return Array.from({ length: 10 }, r) })()
    for (let i = 0; i < seq1.length; i++) {
      assert.strictEqual(seq1[i], seq2[i], `Diverged at step ${i}`)
    }
  })
})

// ── Summary ───────────────────────────────────────────────────────────────────

console.log(`\n${'═'.repeat(62)}`)
if (failed === 0) {
  console.log(`✅  All ${passed} tests passed.`)
} else {
  console.log(`❌  ${failed} failed, ${passed} passed (${passed + failed} total)`)
  process.exitCode = 1
}
