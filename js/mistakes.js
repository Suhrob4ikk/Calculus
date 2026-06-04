// ── Модуль ошибок ─────────────────────────────────────────
// Сохраняет неверно отвеченные вопросы, показывает список,
// позволяет повторить только «плохие» вопросы.

import { st } from './state.js'
import { showPage } from './ui.js'
import { saveMistake, markMistakeCorrect, fetchMistakes } from './supabase.js'

// ── Метки разделов ────────────────────────────────────────
const SUBJECT_LABELS = {
  integrals:   'Интегралы',
  derivatives: 'Производные',
  limits:      'Пределы',
  series:      'Ряды',
  ode:         'Дифф. уравнения',
  probability: 'Теория вер.',
  linalg:      'Лин. алгебра',
  exam:        'Экзамен',
  daily:       'Ежедневный вызов',
}

// ── Hash первых 120 символов текста вопроса ───────────────
function hashQuestion(text) {
  const str = String(text || '').slice(0, 120)
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0
  }
  return Math.abs(h).toString(36)
}

// ── Сохранение ошибок после теста (вызывается из test.js) ──
// results    — массив { question, userAnswer, correctAnswer, isCorrect }
// questions  — исходный массив вопросов (нормализованных)
// section    — раздел ('integrals', 'exam' и т.д.)
// difficulty — сложность
// userId     — id пользователя
st.saveMistakesFromResults = async function(results, questions, section, difficulty, userId) {
  if (!userId || !results || results.length === 0) return

  for (let i = 0; i < results.length; i++) {
    const r = results[i]
    const q = questions[i]
    if (!q) continue

    const questionHash = hashQuestion(r.question || q.question || '')

    if (!r.isCorrect) {
      // Сохраняем или обновляем ошибку
      await saveMistake({
        userId,
        questionHash,
        questionData: {
          question: r.question || q.question,
          options:  q.options || q.o || [],
          correct:  q.correct !== undefined ? q.correct : (q.a !== undefined ? q.a : 0),
          open:     q.open || null,
        },
        subject:    q.subject || section,
        difficulty: difficulty || q.difficulty || 'medium',
      }).catch(e => console.warn('[Mistakes] saveMistake:', e))
    } else {
      // Правильно ответили — помечаем как исправленную
      await markMistakeCorrect({ userId, questionHash })
        .catch(e => console.warn('[Mistakes] markMistakeCorrect:', e))
    }
  }
}

// ── Показать страницу ошибок ──────────────────────────────
window.showMistakesPage = async function() {
  showPage('mistakesPage')
  renderMistakesLoading()

  if (!st.currentUser) {
    renderMistakesNotLoggedIn()
    return
  }

  const { data, error } = await fetchMistakes(st.currentUser.id)
  if (error) {
    renderMistakesError(error.message)
    return
  }

  renderMistakesList(data || [])
}

// ── Рендер: загрузка ──────────────────────────────────────
function renderMistakesLoading() {
  const container = document.getElementById('mistakesPage')
  if (!container) return
  container.innerHTML = `
    <div class="page-content" style="max-width:700px;margin:0 auto;padding:2rem 1rem;text-align:center">
      <div style="font-size:2rem;margin-bottom:1rem">🎯</div>
      <div style="color:var(--text-sub)">Загрузка ошибок…</div>
    </div>
  `
}

// ── Рендер: не авторизован ────────────────────────────────
function renderMistakesNotLoggedIn() {
  const container = document.getElementById('mistakesPage')
  if (!container) return
  container.innerHTML = `
    <div class="page-content" style="max-width:700px;margin:0 auto;padding:2rem 1rem;text-align:center">
      <div style="font-size:2rem;margin-bottom:1rem">🔐</div>
      <div style="color:var(--text-sub);margin-bottom:1rem">
        Войдите в аккаунт, чтобы видеть свои ошибки
      </div>
      <button onclick="showHome()" style="padding:10px 24px;border-radius:12px;
        border:none;background:#6366f1;color:white;cursor:pointer;font-weight:600">
        ← Главная
      </button>
    </div>
  `
}

// ── Рендер: ошибка загрузки ───────────────────────────────
function renderMistakesError(msg) {
  const container = document.getElementById('mistakesPage')
  if (!container) return
  container.innerHTML = `
    <div class="page-content" style="max-width:700px;margin:0 auto;padding:2rem 1rem;text-align:center">
      <div style="color:#f87171;margin-bottom:1rem">Ошибка: ${msg}</div>
      <button onclick="window.showMistakesPage()" style="padding:8px 20px;border-radius:10px;
        border:none;background:#6366f1;color:white;cursor:pointer;font-weight:600">
        Повторить загрузку
      </button>
    </div>
  `
}

// ── Рендер: список ошибок ─────────────────────────────────
function renderMistakesList(mistakes) {
  const container = document.getElementById('mistakesPage')
  if (!container) return

  if (mistakes.length === 0) {
    container.innerHTML = `
      <div class="page-content" style="max-width:700px;margin:0 auto;padding:2rem 1rem;text-align:center">
        <div style="font-size:3rem;margin-bottom:1rem">🎉</div>
        <h2 style="font-size:1.4rem;font-weight:700;margin-bottom:0.5rem">Ошибок нет!</h2>
        <p style="color:var(--text-sub);margin-bottom:1.5rem">
          Вы ещё не допустили ни одной ошибки, или все они исправлены.
        </p>
        <button onclick="showHome()" style="padding:10px 24px;border-radius:12px;
          border:none;background:#6366f1;color:white;cursor:pointer;font-weight:600">
          ← Главная
        </button>
      </div>
    `
    return
  }

  // Группируем по предмету
  const bySubject = {}
  for (const m of mistakes) {
    const subj = m.subject || 'other'
    if (!bySubject[subj]) bySubject[subj] = []
    bySubject[subj].push(m)
  }

  const totalCount = mistakes.length

  container.innerHTML = `
    <div class="page-content" style="max-width:700px;margin:0 auto;padding:2rem 1rem">
      <div style="display:flex;align-items:center;justify-content:space-between;
                  flex-wrap:wrap;gap:1rem;margin-bottom:1.5rem">
        <div>
          <h1 style="font-size:1.8rem;font-weight:800;margin-bottom:0.25rem">🎯 Мои ошибки</h1>
          <p style="color:var(--text-sub);font-size:0.9rem">
            Всего: ${totalCount} вопросов из ${Object.keys(bySubject).length} разделов
          </p>
        </div>
        <button onclick="window._startMistakePractice()"
          style="padding:10px 20px;border-radius:12px;border:none;cursor:pointer;font-weight:700;
                 background:linear-gradient(135deg,#6366f1,#8b5cf6);color:white;font-size:0.9rem">
          Повторить всё
        </button>
      </div>

      ${Object.entries(bySubject).map(([subj, items]) => {
        const label = SUBJECT_LABELS[subj] || subj
        const diffCounts = {}
        items.forEach(m => { diffCounts[m.difficulty] = (diffCounts[m.difficulty] || 0) + 1 })
        return `
          <div style="background:var(--bg-card);border-radius:16px;border:1px solid rgba(100,116,139,0.2);
                      margin-bottom:1rem;overflow:hidden">
            <!-- Заголовок раздела -->
            <div style="padding:0.9rem 1.25rem;display:flex;align-items:center;
                        justify-content:space-between;border-bottom:1px solid rgba(100,116,139,0.15)">
              <div style="font-weight:700;font-size:1rem">${label}</div>
              <div style="display:flex;gap:8px;align-items:center">
                <span style="background:rgba(239,68,68,0.15);color:#f87171;border:1px solid rgba(239,68,68,0.3);
                             padding:2px 10px;border-radius:20px;font-size:0.78rem;font-weight:600">
                  ${items.length} ошибок
                </span>
                <button onclick="window._startMistakePractice('${subj}')"
                  style="padding:4px 12px;border-radius:8px;border:none;cursor:pointer;font-weight:600;
                         background:#6366f1;color:white;font-size:0.78rem">
                  Повторить
                </button>
              </div>
            </div>

            <!-- Список вопросов -->
            <div style="padding:0.75rem 1.25rem">
              ${items.slice(0, 5).map((m, i) => {
                const qData = typeof m.question_data === 'string'
                  ? JSON.parse(m.question_data) : (m.question_data || {})
                const qText = qData.question || '—'
                const diffLabel = { easy: 'Лёгкий', medium: 'Средний', hard: 'Сложный' }[m.difficulty] || m.difficulty
                const diffColor = { easy: '#10b981', medium: '#f59e0b', hard: '#ef4444' }[m.difficulty] || '#94a3b8'
                return `
                  <div style="padding:0.6rem 0;border-bottom:${i < items.slice(0, 5).length - 1 ? '1px solid rgba(100,116,139,0.1)' : 'none'}">
                    <div style="display:flex;gap:6px;align-items:flex-start">
                      <span style="background:${diffColor}22;color:${diffColor};border:1px solid ${diffColor}44;
                                   padding:1px 7px;border-radius:10px;font-size:0.72rem;font-weight:600;
                                   flex-shrink:0;margin-top:2px">
                        ${diffLabel}
                      </span>
                      <span style="font-size:0.85rem;color:var(--text-main);line-height:1.4">
                        ${qText.slice(0, 100)}${qText.length > 100 ? '…' : ''}
                      </span>
                    </div>
                  </div>
                `
              }).join('')}
              ${items.length > 5 ? `
                <div style="text-align:center;padding:0.5rem;color:var(--text-sub);font-size:0.82rem">
                  + ещё ${items.length - 5} вопросов
                </div>
              ` : ''}
            </div>
          </div>
        `
      }).join('')}

      <button onclick="showHome()" style="width:100%;padding:0.8rem;border-radius:12px;
        border:1px solid rgba(100,116,139,0.4);background:transparent;color:var(--text-sub);
        cursor:pointer;font-size:0.95rem;margin-top:0.5rem">← Главная</button>
    </div>
  `
}

// ── Запуск практики ошибок ────────────────────────────────
// subject — опционально, для фильтрации по разделу
window._startMistakePractice = async function(subject) {
  if (!st.currentUser) return

  const { data, error } = await fetchMistakes(st.currentUser.id)
  if (error || !data || data.length === 0) {
    alert('Нет ошибок для повторения!')
    return
  }

  // Фильтруем по разделу если указан
  const filtered = subject ? data.filter(m => m.subject === subject) : data

  if (filtered.length === 0) {
    alert('Нет ошибок по этому разделу!')
    return
  }

  // Строим массив вопросов в формате совместимом с test.js
  const questions = filtered.map(m => {
    const qData = typeof m.question_data === 'string'
      ? JSON.parse(m.question_data) : (m.question_data || {})
    return {
      question: qData.question || '—',
      options:  qData.options  || qData.o || [],
      correct:  qData.correct  !== undefined ? qData.correct : (qData.a !== undefined ? qData.a : 0),
      open:     qData.open     || null,
      subject:  m.subject,
      difficulty: m.difficulty,
    }
  })

  // Перемешиваем (максимум 20 вопросов за один прогон)
  const shuffled = questions.sort(() => Math.random() - 0.5).slice(0, 20)

  // Запускаем через механизм startTest
  if (window.startTest) {
    // Подготавливаем тест вручную через st
    st.currentTest      = shuffled
    st.currentSection   = subject || 'mistakes'
    st.currentDifficulty = 'mixed'
    st.userAnswers      = new Array(shuffled.length).fill(null)
    st.currentQuestionIndex = 0
    st.testMode         = 'choice'
    st.isStudyMode      = false
    st.timeRemaining    = shuffled.length * 90 // 90 сек/вопрос
    showPage('testPage')
    st.startTimer?.()
    st.displayQuestion?.()
  } else {
    alert('Механизм теста недоступен. Пожалуйста, обновите страницу.')
  }
}
