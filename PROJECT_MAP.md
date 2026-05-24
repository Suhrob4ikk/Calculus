# PROJECT MAP — Математический анализ (Calculus)

> Актуально на: 2026-05-24  
> Сгенерировано автоматически для использования в других AI-инструментах.

---

## 🗂 Общее описание

**Название:** Математический анализ — интерактивный тренажёр  
**URL (prod):** https://suhrob4ikk.github.io/Calculus  
**Стек:** Vanilla JS (ES Modules) + Supabase (BaaS) + Tailwind CSS (CDN) + MathJax (CDN) + Chart.js (CDN) + Lucide Icons (CDN)  
**Хостинг:** GitHub Pages  
**Бэкенд:** Supabase (PostgreSQL + Auth + Storage + Realtime)  
**Цель:** Обучающий тест-тренажёр для студентов по матанализу: интегралы, производные, пределы, ряды, ОДУ. Система профилей, дуэли 1v1, ежедневные задания, таблица лидеров.

---

## 📁 Структура файлов

```
Calculus/
├── index.html                  ← Единственный HTML-файл (SPA)
├── manifest.json               ← PWA-манифест
├── css/
│   └── style.css               ← Все стили приложения
├── icons/
│   ├── icon.svg                ← PWA-иконка
│   └── badge.svg               ← Badge-иконка для уведомлений
├── js/
│   ├── script.js               ← Точка входа (инициализация)
│   ├── state.js                ← Общий мутабельный стейт
│   ├── utils.js                ← Чистые утилиты
│   ├── supabase.js             ← Supabase клиент + все DB-запросы
│   ├── ui.js                   ← UI: темы, навигация, XP, звуки, анимации
│   ├── auth.js                 ← Авторизация + защита от двух сессий
│   ├── pwa.js                  ← PWA: Service Worker, install, push-уведомления
│   ├── test.js                 ← Тест: таймер, вопросы, ответы, результаты
│   ├── daily.js                ← Ежедневный вызов + лидерборд дня
│   ├── profile.js              ← Профиль пользователя, уровни, достижения
│   ├── stats.js                ← Статистика (Chart.js), таблица лидеров
│   ├── duel.js                 ← Дуэль 1v1 (Supabase Realtime Broadcast)
│   ├── search.js               ← Поиск пользователей + просмотр чужого профиля
│   ├── mathjax-config.js       ← Конфигурация MathJax
│   ├── integrals-questions.js  ← Банк вопросов: Интегралы (242 вопроса)
│   ├── derivatives-questions.js← Банк вопросов: Производные (190 вопросов)
│   ├── limits-questions.js     ← Банк вопросов: Пределы (292 вопроса)
│   ├── series-questions.js     ← Банк вопросов: Ряды (156 вопросов)
│   ├── ode-questions.js        ← Банк вопросов: ОДУ (150 вопросов)
│   └── script.original.js      ← Резервная копия монолита (2610 строк, не используется)
└── sw.js                       ← Service Worker (кеширование для PWA)
```

---

## 📄 Детальное описание каждого файла

---

### `index.html` (~1200 строк)

Единственный HTML-файл. Всё приложение — SPA без роутера.

**Страницы (переключаются через `showPage(id)`):**
| ID элемента | Назначение |
|---|---|
| `authPage` | Логин / Регистрация / Сброс пароля |
| `updatePasswordPage` | Форма установки нового пароля (по email-ссылке) |
| `homePage` | Главная: ежедневный вызов, карточки разделов |
| `integralsSection` | Страница раздела «Интегралы» |
| `derivativesSection` | Страница раздела «Производные» |
| `seriesSection` | Страница раздела «Ряды» |
| `limitsSection` | Страница раздела «Пределы» |
| `odeSection` | Страница раздела «Дифференциальные уравнения» |
| `testPage` | Активный тест (вопрос + варианты + таймер) |
| `resultsPage` | Результаты теста |
| `statisticsPage` | Личная статистика + Chart.js графики |
| `leaderboardPage` | Таблица лидеров (заголовок — flex-строка с `?`-кнопкой и `#ptsInfoBox`) |
| `profilePage` | Личный профиль: аватар, бейджи, история |
| `searchProfilesPage` | Поиск других пользователей |
| `viewProfilePage` | Просмотр чужого профиля |

**Модальные окна:**
- `#duelModal` — создание / вход в дуэль
- `#duelResultsModal` — результаты дуэли + реванш
- `#dailyLeaderboardModal` — лидерборд ежедневного задания

**Навигация:**
- `#bottomNav` — мобильная нижняя панель (скрыта на ≥641px через CSS); иконки — SVG через Lucide (`<i data-lucide="...">`)
- `#desktopNav` — десктопная шапка (скрыта на ≤640px через CSS), содержит логотип, nav-ссылки с Lucide SVG, звук/тема, аватар-пилюля, кнопка «Выйти» с Lucide SVG
- `#menuBtn` / `#navMenu` — гамбургер-меню (только мобайл), иконка `<i data-lucide="menu">`

**Ключевые DOM-элементы:**
- `#viewProfileName` — имя пользователя на странице просмотра профиля
- `#viewProfileSub` — строка «был(а) онлайн …» под именем на `#viewProfilePage`
- `#ptsInfoBox` — скрытый блок с объяснением формулы баллов в `#leaderboardPage`
- `#dailyChallengeBtn`, `#dailyChallengeCountdown`, `#dailyChallengeCard` — карточка ежедневного вызова

**Скрипты в `<head>` (не-модули, глобальные):**
```html
<script src="js/mathjax-config.js"></script>
<script src="js/integrals-questions.js"></script>
<script src="js/derivatives-questions.js"></script>
<script src="js/limits-questions.js"></script>
<script src="js/series-questions.js"></script>
<script src="js/ode-questions.js"></script>
<!-- MathJax CDN -->
<!-- Chart.js CDN -->
<!-- Tailwind CSS CDN -->
<!-- Lucide Icons CDN: https://unpkg.com/lucide@latest -->
```

**Точка входа (модуль):**
```html
<script type="module" src="js/script.js"></script>
```

**Инлайн-функции в `<script>` (глобальные):**
```js
function togglePtsInfo()
// Показывает/скрывает #ptsInfoBox с объяснением формулы рейтинговых баллов
```

---

### `css/style.css` (~460 строк)

Все пользовательские стили. Tailwind используется через CDN для утилит, style.css — для кастомных компонентов.

**Ключевые блоки:**
- CSS-переменные для тёмной/светлой темы (`--bg-main`, `--text-main`, `--border`, `--bg-card`, `--text-muted`)
- Тёмная тема: `.dark-theme` / `html.dark`
- Светлая тема: `.light-theme`
- `.option-label` — карточки вариантов ответа в тесте
- `.badge`, `.badge-gold`, `.badge-silver`, `.badge-green` — достижения
- `.profile-stat` — блок статистики в профиле
- `.math-symbol` — плавающие математические символы (анимация)
- `.page-content` — отступ от шапки на десктопе (`padding-top: 3.75rem`)
- Десктопная шапка: `.dh-inner`, `.dh-logo`, `.dh-links`, `.dh-nav-btn`, `.dh-nav-btn.dh-active`, `.dh-right`, `.dh-icon-btn`, `.dh-user-btn`, `.dh-avatar`, `.dh-username`, `.dh-logout-btn`
- **Lucide SVG-иконки:** блок с размерами для разных контекстов:
  - `svg.lucide` — базовые стили (inline-block, stroke:currentColor, fill:none)
  - `.dh-nav-btn svg.lucide` — 15×15px
  - `.dh-logout-btn svg.lucide` — 14×14px
  - `#menuBtn svg.lucide` — 18×18px
  - `.nav-menu-item svg.lucide` — 16×16px
  - `#bottomNav button svg.lucide` — 22×22px (display:block)
  - `button svg.lucide` — 16×16px (общий fallback)
- **Светлая тема — цветовые оверрайды для Tailwind-классов:**
  - `html:not(.dark) .text-green-400` → `#16a34a`
  - `html:not(.dark) .text-red-400` → `#dc2626`
  - `html:not(.dark) .text-blue-400` → `#1d4ed8`
  - `html:not(.dark) .text-yellow-400` → `#b45309`
- Медиазапросы:
  - `@media (min-width: 641px)` — скрывает `#menuBtn`, `#navMenu`, `#themeToggle`, `#soundToggle`
  - `@media (max-width: 640px)` — скрывает `#desktopNav`

---

### `js/script.js` (164 строки) — ТОЧКА ВХОДА

Инициализирует приложение. Сам не содержит бизнес-логики.

**Импортирует:**
- `{ st }` ← state.js
- `{ supabase, updateLastSeen }` ← supabase.js
- `{ applyTheme, showPage, updateUserUI, renderStreakBadge, showContinueTestBanner }` ← ui.js
- `{ registerSW }` ← pwa.js
- `{ setupSessionGuard, teardownSessionGuard }` ← auth.js
- `{ clearTestState, saveTestState }` ← test.js
- side-effects: `./daily.js`, `./profile.js`, `./stats.js`, `./duel.js`, `./search.js`

**Содержит:**
1. IIFE — применяет тему до DOMContentLoaded
2. `supabase.auth.onAuthStateChange` — обработчик событий сессии:
   - `PASSWORD_RECOVERY` → переход на страницу смены пароля
   - `SIGNED_IN` → `updateLastSeen()` → setupSessionGuard → showPage('homePage')
   - `SIGNED_OUT` → teardownSessionGuard → showPage('authPage')
3. `DOMContentLoaded`:
   - `lucide.createIcons()` — инициализация Lucide SVG-иконок (заменяет `<i data-lucide="...">` → `<svg>`)
   - Генерация плавающих математических символов
   - Обработка URL-параметров (`?type=recovery`)
   - Восстановление сессии через `supabase.auth.getSession()` → `updateLastSeen()`
   - `window.addEventListener('beforeunload')` — сохраняет тест
   - Realtime подписка на `test_results` → обновляет лидерборд

---

### `js/state.js` (20 строк)

Единственный источник мутабельного рантайм-стейта. Все модули импортируют `st` и пишут в его свойства.

**Экспортирует:**
```js
export const st = {
  currentUser: null,       // Supabase User object
  testTimer: null,         // ID интервала таймера
  timeRemaining: 25 * 60, // Секунды до конца теста
  timerInitialTime: 25*60,
  timerStartTime: null,
  currentTest: [],         // Массив вопросов текущего теста
  currentQuestionIndex: 0,
  userAnswers: [],         // Массив ответов пользователя (индексы)
  testStartTime: null,
  currentDifficulty: '',   // 'easy' | 'medium' | 'hard'
  currentSection: '',      // 'integrals' | 'derivatives' | ... | 'daily' | 'duel'
  isStudyMode: false,      // true = без таймера, результат не сохраняется
}
```

---

### `js/utils.js` (30 строк)

Чистые функции без побочных эффектов. Используются в daily.js и duel.js.

**Экспортирует:**
```js
export const VAPID_PUBLIC_KEY  // Строка VAPID-ключа для push-уведомлений
export function urlBase64ToUint8Array(b64)  // Конвертация VAPID ключа
export function hashCode(str)              // Детерминированный хэш строки → число
export function mulberry32(seed)           // Seeded PRNG (возвращает функцию rng())
export function getDailyDate()             // 'YYYY-MM-DD' по локальному времени
```

---

### `js/supabase.js` (~230 строк)

Все операции с Supabase. Остальные модули импортируют нужные функции отсюда.

**Подключение:**
- Supabase JS v2 через CDN (jsDelivr ESM)
- URL: `https://xahjwhoywxgudsefqowd.supabase.co`

**Экспортирует:**
```js
export const supabase              // Supabase клиент (для realtime, storage, auth)
export async function signUp(email, password, username)
export async function signIn(email, password)
export async function signOut()
export async function getUser()
export async function saveResult({ userId, username, section, difficulty, score, correctAnswers, totalQuestions })
export async function getUserResults(userId)       // → [{ section, difficulty, score, created_at, ... }]
export async function getLeaderboard(section, difficulty)
export async function uploadAvatar(userId, file)   // → { url, error }
export async function getAvatarUrl(userId)         // → string | null
export async function searchProfiles(query)        // → [{ username, avatar_url }]
export async function resetPassword(email)
export async function updatePassword(newPassword)
export async function savePushSubscription(userId, subscription)
export async function deletePushSubscription(userId)
export async function getDailyLeaderboard(date)
// Timezone-aware: конвертирует 'YYYY-MM-DD' в локальную полночь через new Date(y, m-1, d)
// → результаты за конкретный день по локальному времени пользователя
export async function getProfileByUsername(username)
// → { profile: { username, avatar_url, last_seen_at }, results: [...] }
export async function getDuelHistory(userId)       // → история дуэлей с opponent
export async function updateLastSeen(userId)       // Обновляет last_seen_at = now() в profiles
export async function getProfilesByUsernames(usernames)
// Batch-запрос: [username] → [{ username, avatar_url, last_seen_at }]
```

**Таблицы в Supabase:**
- `profiles` — username, avatar_url, last_seen_at (linked to auth.users)
- `test_results` — userId, username, section, difficulty, score, correct_answers, total_questions, created_at
- `push_subscriptions` — userId, subscription JSON

**Supabase Storage:**
- Bucket `avatars` — папки `{userId}/filename`

---

### `js/ui.js` (346 строк)

Весь UI без бизнес-логики. Управляет страницами, темой, звуками, XP-системой, стриком.

**Импортирует:** `{ st }` ← state.js

**Экспортирует:**
```js
export function applyTheme(dark)         // Переключает dark/light CSS-классы
export function showPage(pageId)         // Скрывает все страницы, показывает нужную
export function updateUserUI()           // Обновляет username в шапках (#userGreeting, #dhUsername)
export function playSound(type)          // 'correct' | 'wrong' | 'perfect' | 'finish' (Web Audio API)
export const XP_TABLE                   // { easy: 10, medium: 20, hard: 30 }
export function getXP()
export function addXP(amount)            // → new total XP
export function getXPLevel(xp)           // → { name, icon, color, nextAt }
export function showXPToast(gained, total) // Тост с уведомлением о начисленных XP
export function renderXPBadge()          // ⚠️ НЕ ИСПОЛЬЗУЕТСЯ — badge удалён из HTML; функция существует, но не вызывается
export function updateStreak()           // Обновляет localStorage streak/lastVisit
export function renderStreakBadge()      // Обновляет #streakBadge
export function launchConfetti()         // Canvas-конфетти при 100%
export function showPrivacyScreen()      // Накладывает overlay при уходе со вкладки
export function hidePrivacyScreen()
export function showContinueTestBanner() // Баннер «продолжить незаконченный тест»
```

**Регистрирует на window:**
```js
window.toggleTheme()           // Переключает тему, сохраняет в localStorage, обновляет #settingsThemeBtn
window.toggleSound()           // Вкл/выкл звук, обновляет #settingsSoundBtn
window.toggleNavMenu()         // Мобильный гамбургер
window.closeNavMenu()
window.hidePrivacyScreen()
window.resumeTestFromBanner()  // Восстанавливает тест из localStorage
window.dismissContinueTestBanner()
```

**Экспортирует дополнительно:**
```js
export function syncSettingsBtns()
// Синхронизирует #settingsThemeBtn и #settingsSoundBtn в профиле
// с текущим состоянием темы и звука.
// Вызывается из profile.js при открытии профиля и изнутри toggleTheme/toggleSound.
```

**Логика `showPage`:**
- Скрывает все page-элементы
- Управляет видимостью `#bottomNav`, `#menuBtn`, `#desktopNav`
- Подсвечивает активную кнопку в `#bottomNav` и `#desktopNav`

---

### `js/auth.js` (183 строки)

Авторизация и защита от одновременного входа с двух устройств.

**Импортирует:**
- `{ st }` ← state.js
- `{ showPage, updateUserUI }` ← ui.js
- `{ supabase, signUp, signIn, signOut, resetPassword, updatePassword }` ← supabase.js

**Экспортирует:**
```js
export function setupSessionGuard(userId, onApproved?)
// Supabase Presence: при логине проверяет, нет ли другого активного устройства.
// Если слот занят — signOut() и ставит window._kickedOut = true.
// Алгоритм: первое устройство, которое успело занять Presence-слот, остаётся.
// session_id хранится в localStorage (_sId) — переживает F5.

export function teardownSessionGuard()
// Отписывается от Presence-канала при выходе.
```

**Регистрирует на window:**
```js
window.showAuthTab(tab)             // 'login' | 'register'
window.handleLogin()
window.handleRegister()
window.handleLogout()
window.showForgotPassword()
window.showLoginFromForgot()
window.handleForgotPassword()
window.handleUpdatePassword()
window.togglePasswordVisibility(inputId, eyeId)
```

**Дополнительно:** DOMContentLoaded-слушатель для индикатора надёжности пароля (`#strengthFill`, `#strengthText`, `#req1/2/3`).

---

### `js/pwa.js` (88 строк)

PWA-функциональность: Service Worker, установка приложения, push-уведомления.

**Импортирует:**
- `{ st }` ← state.js
- `{ savePushSubscription, deletePushSubscription }` ← supabase.js
- `{ VAPID_PUBLIC_KEY, urlBase64ToUint8Array }` ← utils.js

**Экспортирует:**
```js
export async function registerSW()
// Регистрирует /Calculus/sw.js с scope '/Calculus/'
// Сохраняет регистрацию в window._swReg
```

**Регистрирует на window:**
```js
window.installApp()                // Показывает prompt установки (PWA)
window.togglePushNotifications()   // Вкл/выкл push-уведомления
```

**Слушает глобальные события:**
- `beforeinstallprompt` — сохраняет prompt, показывает `#installAppBtn`
- `appinstalled` — скрывает `#installAppBtn`

---

### `js/test.js` (425 строк)

Весь игровой цикл теста: таймер, отображение вопросов, выбор ответов, завершение, сохранение состояния.

**Импортирует:**
- `{ st }` ← state.js
- `{ showPage, playSound, XP_TABLE, addXP, showXPToast, launchConfetti }` ← ui.js
- `{ saveResult }` ← supabase.js
- `{ getDailyDate }` ← utils.js

**Экспортирует:**
```js
export function startTimer()
export function stopTimer()
export function saveTestState()    // Сохраняет в localStorage 'testState' (не для duel/daily)
export function clearTestState()   // Удаляет 'testState' из localStorage
export function restoreTestState() // Восстанавливает из localStorage → true/false
export function startTest(section, difficulty, pool, countSelectId, sectionEl)
// Инициализирует тест: перемешивает вопросы и варианты, запускает таймер
export function displayQuestion()  // Рендерит текущий вопрос в #questionContainer
```

**Регистрирует window-мосты (для других модулей без прямого импорта):**
```js
window._startTimer
window._stopTimer
window._displayQuestion
window._clearTestState
window._restoreTestState
```

**Регистрирует на window:**
```js
window.selectAnswer(answerIndex)
window.nextQuestion()
window.previousQuestion()
window.exitTest()
window.finishTest()        // Сохраняет результат, начисляет XP (toast), показывает resultsPage
window.restartTest()
window.shareResult(correct, total, percentage)
window.startIntegralsTest(difficulty, studyMode?)
window.startDerivativesTest(difficulty, studyMode?)
window.startLimitsTest(difficulty, studyMode?)
window.startSeriesTest(difficulty, studyMode?)
window.startODETest(difficulty, studyMode?)
```

**Клавиатурные сокращения** (работают только на testPage):
- `1`/`2`/`3`/`4` — выбор варианта ответа
- `Enter` — следующий вопрос / завершить
- `ArrowLeft` — предыдущий вопрос
- `Escape` — выход из теста

**Дуэльный флоу в `finishTest`:** если `st.currentSection === 'duel'` — вызывает `window._broadcastDuelScore()`, ждёт ответа соперника через `window._duelOpponentTimeout`, вызывает `window._checkDuelComplete()`.

---

### `js/daily.js` (118 строк)

Ежедневный вызов: 10 вопросов из всех разделов, детерминированных по текущей дате.

**Импортирует:**
- `{ st }` ← state.js
- `{ showPage, renderStreakBadge }` ← ui.js
- `{ getDailyLeaderboard }` ← supabase.js
- `{ getDailyDate, hashCode, mulberry32 }` ← utils.js
- `{ startTimer, displayQuestion, clearTestState }` ← test.js

**Использует глобалы** (не-модульные скрипты): `easyIntegralsQuestions`, `mediumIntegralsQuestions`, `easyDerivativesQuestions`, `mediumDerivativesQuestions`, `easySeriesQuestions`, `mediumSeriesQuestions`, `easyLimitsQuestions`, `mediumLimitsQuestions`, `easyODEQuestions`, `mediumODEQuestions`

**Экспортирует:**
```js
export function updateDailyChallengeCard()
// Обновляет карточку на главной: кнопка «Начать» или «✅ XX%» + countdown до следующего дня
```

**Регистрирует на window:**
```js
window.startDailyChallenge()     // Запускает ежедневный тест (или лидерборд, если уже пройден)
window.showDailyLeaderboard()    // Открывает модальный лидерборд дня (#dailyLeaderboardModal)
window.updateDailyChallengeCard  // Ссылка на export (для вызова из других модулей)
```

**Логика генерации:** `hashCode(date)` → `mulberry32(seed)` → Fisher-Yates shuffle всего пула → 10 вопросов с перемешанными вариантами ответов. Тот же seed каждый день → все пользователи получают одинаковые вопросы.

---

### `js/profile.js` (332 строки)

Профиль текущего пользователя, аватар, вычисление уровней и достижений, навигация главной.

**Импортирует:**
- `{ st }` ← state.js
- `{ showPage, updateUserUI, renderStreakBadge, syncSettingsBtns }` ← ui.js
- `{ supabase, getUserResults, getAvatarUrl, uploadAvatar, getLeaderboard, getDuelHistory }` ← supabase.js

**Экспортирует:**
```js
export function getUserLevel(total, avg)
// Возвращает { name, icon, color, next, progress }
// Уровни: Новичок → Студент → Практик → Продвинутый → Эксперт

export function computeBadges(data, sections)
// Вычисляет достижения по массиву результатов.
// Возвращает { badges: [{icon, text, cls}], total, best, avg }
// Бейджи: Первый тест, 5/10/20 тестов, Идеальный балл, Отличник, Стабильный, Всесторонний, Серия побед, Горячая серия
```

**Регистрирует на window:**
```js
window.showHome()
// stopTimer → showPage('homePage') → renderStreak → updateDailyChallengeCard

window.showSection(section)
// Устанавливает st.currentSection, переходит на нужную секцию

window.showProfile()
// Загружает и рендерит профиль: аватар, имя, email, уровень, статистика,
// график прогресса, достижения, место в рейтинге, лучшие результаты, история дуэлей
// Все inline-стили используют CSS-переменные (var(--bg-card) и т.д.) для светлой темы

window.triggerAvatarUpload()
// Программно кликает на #avatarInput
```

**Светлая тема:** все `innerHTML`-блоки используют CSS-переменные (`var(--bg-card)`, `var(--text-main)`, `var(--text-muted)`, `var(--border)`) вместо хардкоденных тёмных цветов.

**Десктопный аватар:** при загрузке/смене/удалении аватара синхронизирует `#dhAvatarImg` и `#dhAvatarLetter` в шапке.

---

### `js/stats.js` (~260 строк)

Страница статистики с Chart.js-графиками и таблица лидеров с рейтинговой системой.

**Импортирует:**
- `{ st }` ← state.js
- `{ showPage }` ← ui.js
- `{ getUserResults, getLeaderboard, getProfilesByUsernames }` ← supabase.js

**Вспомогательные функции:**
```js
function formatLastSeen(iso)
// Форматирует last_seen_at в человекочитаемый вид:
// < 2 мин → '● онлайн' (зелёный), < 60 мин → 'N мин назад',
// < 24 ч → 'N ч назад', < 30 дн → 'N дн назад', иначе → 'N мес назад'
```

**Регистрирует на window:**
```js
window.showStatistics()
// Строит два Chart.js графика: линейный (динамика) + столбчатый (по разделам).
// Заполняет прогресс-бары по разделам и историю последних 10 тестов.

window.showLeaderboard()
// Рейтинг: easy=1pt, medium=2pt, hard=3pt за каждый правильный ответ.
// Берётся лучшая попытка на каждую уникальную комбинацию section+difficulty.
// Сортировка: totalPts → totalCorrect → bestPct.
// После вычисления rankings — batch-запрос getProfilesByUsernames() для аватаров + last_seen_at.
// Каждая строка: кликабельна (onclick viewProfile), 38px аватар (фото или инициал), отметка «был(а) онлайн».

window.resetStatistics()   // Заглушка (предлагает написать администратору)
window.toggleTheory(id)    // Раскрывает/сворачивает теоретический блок
```

**Рейтинговая формула:**
```
очки = сумма(correct_answers × difficulty_multiplier) по лучшим комбо
difficulty_multiplier: easy=1, medium=2, hard=3
```

---

### `js/duel.js` (431 строка)

Дуэль 1v1 в реальном времени через Supabase Realtime Broadcast.

**Импортирует:**
- `{ st }` ← state.js
- `{ showPage }` ← ui.js
- `{ supabase }` ← supabase.js
- `{ hashCode, mulberry32 }` ← utils.js
- `{ startTimer, displayQuestion, clearTestState }` ← test.js

**Использует глобалы:** все пулы вопросов (easy/medium/hard для всех 5 разделов)

**Стейт дуэли — на `window._duel*`** (чтобы `test.js` имел прямой доступ без импорта):
```js
window._duelChannel            // Supabase RealtimeChannel
window._duelCode               // 6-символьный код комнаты
window._duelRole               // 'host' | 'guest'
window._duelMyScore            // null → число после finishTest
window._duelOpponentScore      // null → число (или -1 при таймауте)
window._duelOpponentName
window._duelMyName
window._duelSection            // 'mixed' | 'integrals' | ...
window._duelDiff               // 'easy' | 'medium' | 'hard'
window._duelIsRematchRequester // boolean
```

**Callbacks для `test.js`** (регистрируются на window):
```js
window._broadcastDuelScore(percentage)  // Отправляет результат сопернику
window._checkDuelComplete()             // Если оба сдали → _showDuelResults()
window._showDuelResults()               // Рендерит модалку с итогами
```

**Регистрирует на window:**
```js
window.showDuelModal()
window.closeDuelModal()
window.showDuelTab(tab)        // 'create' | 'join'
window.setDuelSection(sect)
window.setDuelDiff(diff)
window.copyDuelCode()
window.createDuel()            // Host: создаёт канал, ждёт join
window.joinDuel()              // Guest: подключается, шлёт join
window.requestRematch()
window.acceptRematch()
window.declineRematch()
```

**Broadcast-события по Supabase Realtime:**
```
join        → host получает имя гостя, шлёт start
start       → guest получает section/difficulty, запускает countdown
score       → оба получают результат соперника
rematch_request / rematch_accept / rematch_decline / rematch_start
```

**Генерация вопросов:** детерминирована кодом комнаты (`hashCode(code + '_duel_' + section + '_' + diff)`) — оба игрока видят одинаковые вопросы в одинаковом порядке.

**Смешанный режим (`mixed`):** стратифицированная выборка — по 2 вопроса из каждого раздела → shuffle → 10 вопросов.

---

### `js/search.js` (~180 строк)

Поиск пользователей и просмотр чужого профиля.

**Импортирует:**
- `{ st }` ← state.js
- `{ showPage }` ← ui.js
- `{ searchProfiles, getProfileByUsername }` ← supabase.js
- `{ getUserLevel, computeBadges }` ← profile.js

**Вспомогательные функции:**
```js
function formatLastSeenVP(iso)
// Аналог formatLastSeen из stats.js, но для viewProfilePage.
// Возвращает строку вида «Был(а) онлайн: N мин назад» или «● онлайн» (зелёный).
```

**Регистрирует на window:**
```js
window.showSearchProfiles()
// Открывает страницу поиска, подгружает всех пользователей,
// вешает debounced (300ms) oninput на #searchInputField

window.handleSearch()
// Ручной поиск по кнопке (fallback)

window.viewProfile(username)
// Загружает профиль другого пользователя и рендерит его на #viewProfilePage:
// — аватар, уровень, статистика (только не-дуэльные результаты для корректного avg)
// — computeBadges() для достижений
// — last_seen_at → #viewProfileSub (строка «Был(а) онлайн …»)
// — последние 5 результатов (кроме section='daily') с корректными метками разделов

window.openPhotoPreview(url, name)
// Fullscreen-оверлей для просмотра аватара
```

**Важные детали:**
- Дуэльные результаты (`section === 'duel'`) исключены из подсчёта статистики (total/avg), чтобы не завышать показатели
- Ежедневные результаты (`section === 'daily'`) исключены из «последних результатов» в просмотре профиля
- Метки разделов задаются через map-объект (не ternary-цепочкой), чтобы `'daily'` не падало в дефолтный «Пределы»

---

### `js/mathjax-config.js` (5 строк)

Конфигурация MathJax до его загрузки.

```js
window.MathJax = {
  tex: { inlineMath: [['$','$'], ['\\(','\\)']] },
  svg: { fontCache: 'global' }
}
```

---

### `js/*-questions.js` — Банки вопросов

Загружаются как обычные `<script>` (не модули) → доступны как глобальные переменные.

| Файл | Вопросов | Глобальные переменные |
|---|---|---|
| `integrals-questions.js` | 242 | `easyIntegralsQuestions`, `mediumIntegralsQuestions`, `hardIntegralsQuestions` |
| `derivatives-questions.js` | 190 | `easyDerivativesQuestions`, `mediumDerivativesQuestions`, `hardDerivativesQuestions` |
| `limits-questions.js` | 292 | `easyLimitsQuestions`, `mediumLimitsQuestions`, `hardLimitsQuestions` |
| `series-questions.js` | 156 | `easySeriesQuestions`, `mediumSeriesQuestions`, `hardSeriesQuestions` |
| `ode-questions.js` | 150 | `easyODEQuestions`, `mediumODEQuestions`, `hardODEQuestions` |

**Итого: 1030 вопросов** (3 уровня × 5 разделов)

**Структура каждого вопроса:**
```js
{
  question: "Вычислите $\\int x^2 dx$",   // строка с LaTeX
  options: ["A", "B", "C", "D"],           // 4 варианта
  correct: 0                               // индекс правильного ответа (0–3)
}
```

---

### `manifest.json` (40 строк)

PWA-манифест.

```json
{
  "name": "Математический анализ",
  "short_name": "МатАнализ",
  "start_url": "/Calculus/",
  "scope": "/Calculus/",
  "display": "standalone",
  "background_color": "#0f172a",
  "theme_color": "#3b82f6",
  "lang": "ru",
  "shortcuts": ["Интегралы", "Производные"]
}
```

---

### `sw.js` — Service Worker

Кеширование ресурсов для офлайн-режима PWA. Регистрируется через `pwa.js`.

---

## 🔗 Граф зависимостей модулей

```
script.js (точка входа)
  ├── state.js          (нет зависимостей)
  ├── supabase.js       (нет зависимостей)
  ├── utils.js          (нет зависимостей)
  ├── ui.js             → state.js
  ├── pwa.js            → state.js, supabase.js, utils.js
  ├── auth.js           → state.js, ui.js, supabase.js
  ├── test.js           → state.js, ui.js, supabase.js, utils.js
  ├── daily.js          → state.js, ui.js, supabase.js, utils.js, test.js
  ├── profile.js        → state.js, ui.js, supabase.js
  ├── stats.js          → state.js, ui.js, supabase.js
  ├── duel.js           → state.js, ui.js, supabase.js, utils.js, test.js
  └── search.js         → state.js, ui.js, supabase.js, profile.js
```

**Циклических зависимостей нет.** Взаимные вызовы между модулями идут через `window.*`:

| Вызывает | Функция | Определена в |
|---|---|---|
| `test.js` | `window.showHome()` | profile.js |
| `test.js` | `window.updateDailyChallengeCard()` | daily.js |
| `test.js` | `window._broadcastDuelScore()` | duel.js |
| `test.js` | `window._checkDuelComplete()` | duel.js |
| `test.js` | `window._showDuelResults()` | duel.js |
| `profile.js` | `window._stopTimer()` | test.js (bridge) |
| `profile.js` | `window.updateDailyChallengeCard()` | daily.js |
| `ui.js` (баннер) | `window._restoreTestState()` | test.js (bridge) |
| `ui.js` (баннер) | `window._startTimer()` | test.js (bridge) |
| `script.js` | `window.updateDailyChallengeCard()` | daily.js |
| `script.js` | `window.showLeaderboard()` | stats.js |

---

## 🗄 Supabase — таблицы и политики

### Таблица `profiles`
| Колонка | Тип | Описание |
|---|---|---|
| id | uuid | = auth.users.id |
| username | text | Уникальный никнейм |
| avatar_url | text | URL аватара из Storage |
| last_seen_at | timestamptz | Время последнего входа/открытия приложения |
| created_at | timestamptz | |

> **SQL миграция:** `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_seen_at TIMESTAMPTZ;`

### Таблица `test_results`
| Колонка | Тип | Описание |
|---|---|---|
| id | uuid | |
| user_id | uuid | FK → auth.users.id |
| username | text | Денормализованное имя |
| section | text | integrals / derivatives / series / limits / ode / daily / duel |
| difficulty | text | easy / medium / hard (для дуэли — код комнаты) |
| score | int | Процент правильных ответов (0–100) |
| correct_answers | int | |
| total_questions | int | |
| created_at | timestamptz | |

### Таблица `push_subscriptions`
| Колонка | Тип | Описание |
|---|---|---|
| user_id | uuid | |
| subscription | jsonb | Web Push subscription object |

### Storage bucket `avatars`
- Структура: `{user_id}/{filename}`
- Публичный доступ на чтение

---

## ⚙️ Ключевые алгоритмы

### XP-система
- Очки за вопрос: easy=10, medium=20, hard=30
- Бонус за 100%: +25 XP
- Бонус за ежедневный вызов: +50 XP
- Уровни по суммарному XP: Новичок(0) → Студент(200) → Практик(500) → Продвинутый(1000) → Знаток(2500) → Эксперт(5000)
- XP хранится в `localStorage`; начисление показывается тостом (`showXPToast`)
- **XP-бейдж на главной удалён** (`#xpBadge` убран из HTML, `renderXPBadge()` не вызывается)

### Стрик (серия дней)
- Сохраняется в localStorage: `streak`, `lastVisit`
- Увеличивается если `lastVisit = вчера`, иначе сбрасывается до 1

### Таймер теста
- Время зависит от уровня и количества вопросов (таблица minutesMap в test.js)
- При уходе со вкладки — античит оверлей (#privacyOverlay)
- При истечении — авто-завершение теста через 1.5 с

### Защита от двух сессий
- Supabase Realtime Presence на канале `user-active:{userId}`
- session_id хранится в localStorage (`_sId`)
- При входе: если в Presence уже есть другой session_id → signOut()

### Последний онлайн (`last_seen_at`)
- `updateLastSeen(userId)` вызывается при каждом логине и восстановлении сессии (`script.js`)
- Отображается в таблице лидеров (`stats.js`) и на странице просмотра профиля (`search.js`)
- Форматирование: «● онлайн» (< 2 мин), «N мин/ч/дн/мес назад»

---

## 🚀 Запуск и деплой

```bash
# Локально — просто открыть index.html через Live Server (или любой HTTP-сервер)
# Деплой — git push origin main (GitHub Pages автоматически)
git add .
git commit -m "описание"
git push origin main
```

**GitHub Pages URL:** https://suhrob4ikk.github.io/Calculus

---

## 📝 Планы на будущее (из feedback)

1. **Теория** — отдельная страница в стиле Stepik: темы в правильном порядке, статус «изучено / в процессе / в планах», ссылки на практику в конце каждого блока
2. ✅ **SVG-иконки** — подключены через Lucide CDN; навигация, кнопки и шапка используют `<i data-lucide="...">` вместо эмодзи
3. **Дизайн** — единый стиль, современный UI, адаптив для больших экранов
4. ✅ **Настройки в профиле** — тема и звук перенесены внутрь страницы профиля (`#settingsThemeBtn`, `#settingsSoundBtn`)
