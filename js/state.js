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
}
