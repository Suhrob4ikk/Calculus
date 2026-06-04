// ── Центральный хаб банков вопросов ──────────────────────
// Единая точка импорта для всех потребителей (test, duel, daily, exam).

import { easyIntegralsQuestions,   mediumIntegralsQuestions,   hardIntegralsQuestions   } from './integrals-questions.js'
import { easyDerivativesQuestions, mediumDerivativesQuestions, hardDerivativesQuestions } from './derivatives-questions.js'
import { easySeriesQuestions,      mediumSeriesQuestions,      hardSeriesQuestions      } from './series-questions.js'
import { easyLimitsQuestions,      mediumLimitsQuestions,      hardLimitsQuestions      } from './limits-questions.js'
import { easyODEQuestions,         mediumODEQuestions,         hardODEQuestions         } from './ode-questions.js'
import { easyProbabilityQuestions, mediumProbabilityQuestions, hardProbabilityQuestions } from './probability-questions.js'
import { easyLinalgQuestions,      mediumLinalgQuestions,      hardLinalgQuestions      } from './linalg-questions.js'
import { easyDerivativesOpenQuestions, mediumDerivativesOpenQuestions, hardDerivativesOpenQuestions } from './open-questions.js'

export const QUESTIONS = {
  integrals:   { easy: easyIntegralsQuestions,   medium: mediumIntegralsQuestions,   hard: hardIntegralsQuestions   },
  derivatives: { easy: easyDerivativesQuestions, medium: mediumDerivativesQuestions, hard: hardDerivativesQuestions },
  series:      { easy: easySeriesQuestions,      medium: mediumSeriesQuestions,      hard: hardSeriesQuestions      },
  limits:      { easy: easyLimitsQuestions,      medium: mediumLimitsQuestions,      hard: hardLimitsQuestions      },
  ode:         { easy: easyODEQuestions,         medium: mediumODEQuestions,         hard: hardODEQuestions         },
  probability: { easy: easyProbabilityQuestions, medium: mediumProbabilityQuestions, hard: hardProbabilityQuestions },
  linalg:      { easy: easyLinalgQuestions,      medium: mediumLinalgQuestions,      hard: hardLinalgQuestions      },
}

export const OPEN_QUESTIONS = {
  derivatives: { easy: easyDerivativesOpenQuestions, medium: mediumDerivativesOpenQuestions, hard: hardDerivativesOpenQuestions },
}
