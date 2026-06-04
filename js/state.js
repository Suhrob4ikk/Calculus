// ── Общий изменяемый стейт приложения ─────────────────────
// Все модули импортируют этот объект и читают/пишут через st.*
export const st = {
  currentUser: null,

  // Таймер
  testTimer: null,
  timeRemaining: 25 * 60,
  timerInitialTime: 25 * 60,
  timerStartTime: null,

  // Тест
  currentTest: [],
  currentQuestionIndex: 0,
  userAnswers: [],
  testStartTime: null,
  currentDifficulty: '',
  currentSection: '',
  isStudyMode: false,
  testMode: 'closed',   // 'closed' | 'open'

  // Флаги приложения
  finishInProgress: false,
  kickedOut: false,
  pendingDuelCode: null,

  // Навигационный флаг
  viewProfileFrom: 'searchProfilesPage',

  // SW registration (устанавливается в pwa.js)
  swReg: null,

  // Коллбэки из test.js (избегаем циклических импортов ui.js ↔ test.js)
  startTimer: null,
  stopTimer: null,
  displayQuestion: null,
  clearTestState: null,
  restoreTestState: null,
  saveMistakesFromResults: null,

  // Дуэль
  duel: {
    channel: null,
    invitesChannel: null,
    invitesChannelReady: false,
    code: '',
    role: '',               // 'host' | 'guest'
    myScore: null,
    opponentScore: null,
    opponentName: '',
    myName: '',
    section: 'mixed',
    diff: 'medium',
    phase: 'idle',          // 'idle' | 'countdown' | 'active' | 'finished'
    isRematchRequester: false,
    invitedUsername: null,
    pendingInvite: null,
    joinHandled: false,
    startHandled: false,
    countdownInterval: null,
    opponentTimeout: null,
    // Коллбэки из duel.js для test.js
    broadcastScore: null,
    checkComplete: null,
    showResults: null,
  },
}
