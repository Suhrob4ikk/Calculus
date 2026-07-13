# MathCore Web

A Progressive Web App for higher mathematics practice. Covers seven subjects with theory, quizzes across three difficulty levels, a real-time duel system, daily challenges, and full cross-platform synchronization with the [MathCore Android](https://github.com/Suhrob4ikk/MathCoreAndroid) application.

[![Supabase](https://img.shields.io/badge/Supabase-2.x-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com)
[![PWA](https://img.shields.io/badge/PWA-ready-5A0FC8?style=flat-square&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES2022-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

**Live:** [mathcore-app.vercel.app](https://mathcore-app.vercel.app)

---

## Overview

MathCore is a cross-platform mathematics training system. The web client and the Android client share the same Supabase backend — results, XP, mistakes, leaderboards, and real-time duels are synchronized across both platforms in real time.

The web client is built with no framework — plain HTML, CSS, and ES module JavaScript — with Supabase as the sole backend dependency.

---

## Features

### Study

| Feature | Description |
|---|---|
| 7 subjects | Integrals, Derivatives, Limits, Series, ODEs, Probability, Linear Algebra |
| 3 difficulty levels | Easy / Medium / Hard, each with its own question pool |
| Open-answer questions | Numeric input with smart normalization (`1.0 = 1 = 1,0`) |
| Theory | 85+ steps per subject with MathJax-rendered formulas |
| Study mode | Practice without timer or result saving |
| Exam mode | Timed, randomized questions across all subjects |

### Progress & Ranking

| Feature | Description |
|---|---|
| XP system | +10 / +20 / +30 XP per correct answer by difficulty; +25 for 100% |
| Daily challenge | 10 questions seeded by date — identical for all users on both platforms |
| Global leaderboard | Best-per-combo aggregation (best result per subject + difficulty combination) |
| Mistake tracker | Wrong answers saved to Supabase; available for review and retry |
| Streaks | Consecutive-day activity counter |

### Duels

| Feature | Description |
|---|---|
| Real-time 1v1 | Supabase Realtime — Phoenix WebSocket protocol |
| Invites | Send a challenge by username; accepted in-app notification |
| Rematch | Immediate rematch flow after a duel ends |
| Cross-platform | Web and Android clients share the same channel protocol |

### Platform

| Feature | Description |
|---|---|
| PWA | Installable on desktop and mobile; offline-capable via Service Worker |
| Dark mode | System preference detection + manual toggle |
| Responsive | Optimized for mobile, tablet, and desktop |

---

## Tech Stack

```
Frontend        Vanilla HTML + CSS + ES Modules (no build step)
Backend         Supabase (PostgreSQL, Auth, Storage, Realtime)
Auth            Supabase Auth (email/password, JWT)
Realtime        Supabase Realtime — Phoenix WebSocket protocol
Math rendering  MathJax 3 (via CDN)
Charts          Chart.js
PWA             Service Worker + Web App Manifest
```

---

## Project Structure

```
├── index.html              # Single-page application shell
├── css/
│   └── style.css
├── js/
│   ├── state.js            # Global application state
│   ├── supabase.js         # All Supabase interactions
│   ├── auth.js             # Authentication flow
│   ├── test.js             # Quiz engine + answer normalization
│   ├── daily.js            # Daily challenge
│   ├── duel.js             # Real-time duel system
│   ├── stats.js            # Leaderboard
│   ├── profile.js          # User profile
│   ├── mistakes.js         # Mistake tracker
│   ├── exam.js             # Exam mode
│   ├── theory.js           # Theory viewer
│   ├── search.js           # User search
│   ├── utils.js            # mulberry32, hashCode, shared utilities
│   ├── questions.js        # Question bank (all subjects)
│   └── open-questions.js   # Open-answer question bank
├── sw.js                   # Service Worker
├── manifest.json           # PWA manifest
└── mathcore.apk            # Latest Android build
```

---

## Getting Started

No build step required. Open `index.html` in a browser or serve the directory:

```bash
npx serve .
# or
python3 -m http.server 8080
```

### Supabase Configuration

Edit the project URL and anon key in `js/supabase.js`:

```js
const supabase = createClient(
  'https://<project>.supabase.co',
  '<anon-key>'
)
```

### Required Database Tables

```
profiles        — id, username, avatar_url, xp, streak, last_seen_at
test_results    — user_id, username, section, difficulty, score, correct_answers, total_questions
user_mistakes   — user_id, question_hash, question_data, subject, difficulty, mistake_count, corrected
```

---

## Cross-Platform Synchronization

Both clients target the same Supabase instance. The following are guaranteed to be identical across platforms:

| Component | Mechanism |
|---|---|
| Daily questions | `mulberry32(hashCode(dateString))` seeded Fisher-Yates |
| Duel questions | `mulberry32(hashCode("${code}_duel_${section}_${difficulty}"))` |
| XP formula | `correctAnswers × (10/20/30) + (score === 100 ? 25 : 0)` |
| Answer normalization | trim → lowercase → remove whitespace → comma→dot → strip trailing zeros |
| Leaderboard ranking | Best result per `section+difficulty` combo, sum across combos |
| Mistake hashing | `Math.imul(31, h)` — first 120 chars of question text, base-36 output |
| Duel WebSocket | `realtime:duel:<code>` topic, Phoenix heartbeat every 25s |

---

## Related

- [MathCore Android](https://github.com/Suhrob4ikk/MathCoreAndroid) — the native Android client
