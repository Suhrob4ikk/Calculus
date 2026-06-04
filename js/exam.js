// ── Модуль экзамена ───────────────────────────────────────
// Режим «Экзамен»: вопросы из всех разделов, строгий таймер,
// сертификат с оценкой по результату.

import { st } from './state.js'
import { showPage, launchConfetti, playSound } from './ui.js'
import { saveResult } from './supabase.js'

// ── Состояние экзамена ────────────────────────────────────
const examSt = {
  questions:    [],   // нормализованные вопросы
  answers:      [],   // индексы ответов (null = не отвечено)
  current:      0,    // текущий вопрос
  timeLeft:     0,    // секунды
  timer:        null, // setInterval
  format:       null, // 'quick' | 'standard' | 'full'
  startedAt:    null, // Date
}

// ── Форматы экзамена ──────────────────────────────────────
const FORMATS = {
  quick:    { label: 'Быстрый',     count: 10, minutes: 15 },
  standard: { label: 'Стандартный', count: 20, minutes: 30 },
  full:     { label: 'Полный',      count: 30, minutes: 45 },
}

// ── Разделы и их лейблы ───────────────────────────────────
const SUBJECTS = {
  integrals:   'Интегралы',
  derivatives: 'Производные',
  limits:      'Пределы',
  series:      'Ряды',
  ode:         'Дифф. уравнения',
  probability: 'Теория вер.',
  linalg:      'Лин. алгебра',
}

// ── Нормализация вопроса к единому формату ────────────────
function normalizeQ(q, subject, difficulty) {
  return {
    question:   q.q       || q.question || '',
    options:    q.o       || q.options  || [],
    correct:    q.a       !== undefined ? q.a : (q.correct !== undefined ? q.correct : 0),
    open:       q.open,
    subject,
    difficulty,
  }
}

// ── Получение вопросов из глобальных массивов ─────────────
function getSubjectPool(subject, difficulty) {
  // Строим имя глобального массива, например: easyIntegralsQuestions
  const subjCap = subject.charAt(0).toUpperCase() + subject.slice(1)
  const diffCap = difficulty.charAt(0).toUpperCase() + difficulty.slice(1)
  const key = `${difficulty}${subjCap}Questions`
  const arr = window[key] || []
  // probability/linalg уже нормализованы (формат B через адаптер),
  // остальные — формат A; normalizeQ обрабатывает оба варианта.
  return arr.map(q => normalizeQ(q, subject, difficulty))
}

// ── Перемешать массив (Fisher-Yates) ─────────────────────
function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ── Сборка вопросов для экзамена ──────────────────────────
function buildExamQuestions(count) {
  const subjects   = Object.keys(SUBJECTS)
  const diffs      = ['easy', 'medium', 'hard']
  const allQs      = []

  for (const subj of subjects) {
    for (const diff of diffs) {
      const pool = getSubjectPool(subj, diff)
      allQs.push(...pool)
    }
  }

  if (allQs.length === 0) {
    console.warn('[Exam] Банк вопросов пуст — файлы вопросов не загружены?')
    return []
  }

  return shuffle(allQs).slice(0, count)
}

// ── Оценка по процентам ───────────────────────────────────
function getGrade(pct) {
  if (pct >= 90) return { grade: 5, label: 'Отлично',  color: '#10b981' }
  if (pct >= 75) return { grade: 4, label: 'Хорошо',   color: '#3b82f6' }
  if (pct >= 60) return { grade: 3, label: 'Удовл.',   color: '#f59e0b' }
  return            { grade: 2, label: 'Неудовл.', color: '#ef4444' }
}

// ── Показать страницу выбора формата ─────────────────────
window.showExamPage = function() {
  showPage('examPage')
  renderExamSetup()
}

function renderExamSetup() {
  const container = document.getElementById('examPage')
  if (!container) return
  container.innerHTML = `
    <div class="page-content" style="max-width:960px;margin:0 auto;padding:2.5rem 1.5rem">
      <h1 style="font-size:2.4rem;font-weight:800;margin-bottom:0.6rem;text-align:center">
        🎓 Режим экзамена
      </h1>
      <p style="color:var(--text-sub);text-align:center;margin-bottom:2.5rem;font-size:1rem;max-width:560px;margin-left:auto;margin-right:auto">
        Вопросы из всех разделов. Строгий таймер — ответы подаются автоматически при истечении времени.
      </p>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1.25rem;margin-bottom:2rem">
        ${Object.entries(FORMATS).map(([key, f]) => `
          <div onclick="window._startExam('${key}')"
            style="background:var(--bg-card);border:1px solid rgba(99,102,241,0.3);border-radius:20px;
                   padding:2rem 1.75rem;cursor:pointer;transition:all 0.2s;display:flex;
                   flex-direction:column;gap:0.75rem"
            onmouseenter="this.style.borderColor='rgba(99,102,241,0.7)';this.style.transform='translateY(-3px)';this.style.boxShadow='0 8px 32px rgba(99,102,241,0.15)'"
            onmouseleave="this.style.borderColor='rgba(99,102,241,0.3)';this.style.transform='translateY(0)';this.style.boxShadow='none'">
            <div style="font-size:2.5rem;line-height:1">${{ quick: '⚡', standard: '📝', full: '🏆' }[key]}</div>
            <div style="font-size:1.35rem;font-weight:700">${f.label}</div>
            <div style="color:var(--text-sub);font-size:0.95rem">${f.count} вопросов · ${f.minutes} минут</div>
          </div>
        `).join('')}
      </div>
      <button onclick="showHome()" style="width:100%;padding:0.9rem;border-radius:14px;
        border:1px solid rgba(100,116,139,0.4);background:transparent;color:var(--text-sub);
        cursor:pointer;font-size:0.95rem">← Назад</button>
    </div>
  `
}

// ── Запуск экзамена ───────────────────────────────────────
window._startExam = function(formatKey) {
  const fmt = FORMATS[formatKey]
  if (!fmt) return

  const qs = buildExamQuestions(fmt.count)
  if (qs.length === 0) {
    alert('Не удалось загрузить вопросы. Убедитесь, что все файлы вопросов подключены.')
    return
  }

  Object.assign(examSt, {
    questions: qs,
    answers:   new Array(qs.length).fill(null),
    current:   0,
    timeLeft:  fmt.minutes * 60,
    timer:     null,
    format:    formatKey,
    startedAt: new Date(),
  })

  renderExamActive()
  startExamTimer()
}

// ── Таймер ────────────────────────────────────────────────
function startExamTimer() {
  if (examSt.timer) clearInterval(examSt.timer)
  examSt.timer = setInterval(() => {
    examSt.timeLeft--
    updateExamTimerDisplay()
    if (examSt.timeLeft <= 0) {
      clearInterval(examSt.timer)
      examSt.timer = null
      finishExam(true) // авто-сабмит при истечении
    }
  }, 1000)
}

function stopExamTimer() {
  if (examSt.timer) { clearInterval(examSt.timer); examSt.timer = null }
}

function updateExamTimerDisplay() {
  const el = document.getElementById('examTimer')
  if (!el) return
  const m = Math.floor(examSt.timeLeft / 60)
  const s = examSt.timeLeft % 60
  el.textContent = `⏱️ ${m}:${s.toString().padStart(2, '0')}`
  el.style.color = examSt.timeLeft <= 120 ? '#ef4444'
    : examSt.timeLeft <= 300 ? '#f59e0b' : 'var(--text-main)'
}

// ── Рендер активного экзамена ─────────────────────────────
function renderExamActive() {
  const container = document.getElementById('examPage')
  if (!container) return

  const n       = examSt.current
  const q       = examSt.questions[n]
  const total   = examSt.questions.length
  const pct     = Math.round((n / total) * 100)
  const answered = examSt.answers.filter(a => a !== null).length
  const subjLabel = SUBJECTS[q.subject] || q.subject
  const diffLabel = { easy: 'Лёгкий', medium: 'Средний', hard: 'Сложный' }[q.difficulty] || q.difficulty
  const diffColor = { easy: '#10b981', medium: '#f59e0b', hard: '#ef4444' }[q.difficulty] || '#94a3b8'

  container.innerHTML = `
    <div style="max-width:960px;margin:0 auto;padding:1.5rem">
      <!-- Шапка экзамена -->
      <div style="display:flex;justify-content:space-between;align-items:center;gap:1rem;
                  flex-wrap:wrap;margin-bottom:1rem">
        <div style="font-weight:700;font-size:1rem">
          Вопрос ${n + 1} / ${total}
          <span style="font-size:0.8rem;color:var(--text-sub);margin-left:8px">
            (отвечено: ${answered})
          </span>
        </div>
        <span id="examTimer" style="font-size:1.1rem;font-weight:600">⏱️ …</span>
        <button onclick="window._finishExamConfirm()"
          style="padding:6px 16px;border-radius:10px;border:none;cursor:pointer;font-weight:600;
                 background:#3b82f6;color:white;font-size:0.85rem">Завершить</button>
      </div>

      <!-- Прогресс-бар -->
      <div style="height:6px;background:rgba(99,102,241,0.15);border-radius:3px;margin-bottom:1.25rem">
        <div style="height:100%;width:${pct}%;background:linear-gradient(90deg,#6366f1,#8b5cf6);
                    border-radius:3px;transition:width 0.3s"></div>
      </div>

      <!-- Бейджи раздела и сложности -->
      <div style="display:flex;gap:8px;margin-bottom:1.25rem;flex-wrap:wrap">
        <span style="background:rgba(99,102,241,0.15);color:#818cf8;border:1px solid rgba(99,102,241,0.3);
                     padding:3px 10px;border-radius:20px;font-size:0.78rem;font-weight:600">
          ${subjLabel}
        </span>
        <span style="background:${diffColor}22;color:${diffColor};border:1px solid ${diffColor}44;
                     padding:3px 10px;border-radius:20px;font-size:0.78rem;font-weight:600">
          ${diffLabel}
        </span>
      </div>

      <!-- Вопрос -->
      <div style="background:var(--bg-card);border-radius:18px;padding:1.75rem 2rem;margin-bottom:1.5rem;
                  border:1px solid rgba(99,102,241,0.2);font-size:1.1rem;line-height:1.7">
        ${q.question}
      </div>

      <!-- Варианты ответа -->
      <div style="display:grid;gap:0.85rem;margin-bottom:1.75rem">
        ${q.options.map((opt, i) => {
          const selected = examSt.answers[n] === i
          return `<button onclick="window._selectExamAnswer(${i})"
            style="text-align:left;padding:1.1rem 1.5rem;border-radius:14px;cursor:pointer;
                   font-size:1rem;line-height:1.5;transition:all 0.15s;
                   background:${selected ? 'rgba(99,102,241,0.2)' : 'var(--bg-card)'};
                   border:${selected ? '2px solid #6366f1' : '1px solid rgba(100,116,139,0.25)'};
                   color:${selected ? '#a5b4fc' : 'var(--text-main)'}">
              <span style="font-weight:700;margin-right:0.75rem;color:${selected ? '#818cf8' : 'var(--text-sub)'}">
                ${String.fromCharCode(65 + i)}.
              </span>${opt}
          </button>`
        }).join('')}
      </div>

      <!-- Навигация вперёд-назад -->
      <div style="display:flex;gap:0.75rem;justify-content:center;flex-wrap:wrap;margin-bottom:1.5rem">
        <button onclick="window._examNav(-1)" ${n === 0 ? 'disabled' : ''}
          style="padding:8px 20px;border-radius:10px;border:1px solid rgba(100,116,139,0.4);
                 background:transparent;color:var(--text-main);cursor:pointer;font-size:0.9rem;
                 opacity:${n === 0 ? '0.4' : '1'}">← Назад</button>
        <button onclick="window._examNav(1)" ${n === total - 1 ? 'disabled' : ''}
          style="padding:8px 20px;border-radius:10px;border:none;
                 background:#6366f1;color:white;cursor:pointer;font-size:0.9rem;font-weight:600;
                 opacity:${n === total - 1 ? '0.4' : '1'}">Далее →</button>
      </div>

      <!-- Навигационная сетка вопросов -->
      <div style="background:var(--bg-card);border-radius:12px;padding:1rem;
                  border:1px solid rgba(100,116,139,0.15)">
        <div style="font-size:0.8rem;color:var(--text-sub);margin-bottom:0.6rem;font-weight:600">
          Перейти к вопросу:
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:6px">
          ${examSt.questions.map((_, i) => {
            const ans   = examSt.answers[i]
            const isCur = i === n
            return `<button onclick="window._examGoTo(${i})"
              style="width:34px;height:34px;border-radius:8px;border:none;cursor:pointer;font-size:0.8rem;
                     font-weight:700;transition:all 0.15s;
                     background:${isCur ? '#6366f1' : ans !== null ? 'rgba(16,185,129,0.25)' : 'rgba(100,116,139,0.1)'};
                     color:${isCur ? 'white' : ans !== null ? '#34d399' : 'var(--text-sub)'};
                     outline:${isCur ? '2px solid #818cf8' : 'none'};outline-offset:2px">
              ${i + 1}
            </button>`
          }).join('')}
        </div>
      </div>
    </div>
  `

  updateExamTimerDisplay()
  // Перетипесетим MathJax если доступен
  if (window.MathJax?.typesetPromise) {
    window.MathJax.typesetPromise([container]).catch(() => {})
  }
}

// ── Выбор ответа ─────────────────────────────────────────
window._selectExamAnswer = function(idx) {
  examSt.answers[examSt.current] = idx
  renderExamActive()
}

// ── Навигация по вопросам ─────────────────────────────────
window._examNav = function(dir) {
  const next = examSt.current + dir
  if (next < 0 || next >= examSt.questions.length) return
  examSt.current = next
  renderExamActive()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

window._examGoTo = function(idx) {
  if (idx < 0 || idx >= examSt.questions.length) return
  examSt.current = idx
  renderExamActive()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// ── Подтверждение завершения ──────────────────────────────
window._finishExamConfirm = function() {
  const unanswered = examSt.answers.filter(a => a === null).length
  const msg = unanswered > 0
    ? `Без ответа: ${unanswered} вопросов. Завершить экзамен?`
    : 'Завершить экзамен?'
  if (confirm(msg)) finishExam(false)
}

// ── Подсчёт результатов и показ сертификата ───────────────
async function finishExam(autoSubmit) {
  stopExamTimer()

  let correct = 0
  const results = examSt.questions.map((q, i) => {
    const ok = examSt.answers[i] === q.correct
    if (ok) correct++
    return {
      question:      q.question,
      userAnswer:    examSt.answers[i] !== null ? (q.options[examSt.answers[i]] || '—') : 'Не отвечено',
      correctAnswer: q.options[q.correct] || '—',
      isCorrect:     ok,
      subject:       q.subject,
    }
  })

  const total    = examSt.questions.length
  const pct      = Math.round(correct / total * 100)
  const grade    = getGrade(pct)
  const username = st.currentUser?.user_metadata?.username
    || st.currentUser?.email?.split('@')[0]
    || 'Студент'

  // Сохраняем результат в Supabase в фоне
  if (st.currentUser) {
    saveResult({
      userId:         st.currentUser.id,
      username,
      section:        'exam',
      difficulty:     examSt.format,
      score:          pct,
      correctAnswers: correct,
      totalQuestions: total,
    }).catch(e => console.warn('[Exam] saveResult:', e))
  }

  // Сохраняем ошибки в фоне
  if (st.currentUser) {
    window._saveMistakesFromResults?.(
      results, examSt.questions, 'exam', examSt.format, st.currentUser.id
    )
  }

  // Спецэффекты
  if (pct === 100) setTimeout(launchConfetti, 400)
  playSound(pct >= 75 ? 'perfect' : 'finish')

  renderCertificate(username, correct, total, pct, grade, autoSubmit)
}

// ── Рендер сертификата ────────────────────────────────────
function renderCertificate(username, correct, total, pct, grade, autoSubmit) {
  const container = document.getElementById('examPage')
  if (!container) return

  const dateStr  = new Date().toLocaleDateString('ru-RU', { day:'2-digit', month:'long', year:'numeric' })
  const fmtLabel = FORMATS[examSt.format]?.label || ''

  container.innerHTML = `
    <div class="page-content" style="max-width:960px;margin:0 auto;padding:2rem 1.5rem">
      ${autoSubmit ? `<div style="background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.4);
        border-radius:12px;padding:0.75rem 1.25rem;margin-bottom:1.5rem;text-align:center;
        color:#fca5a5;font-weight:600">⏱️ Время вышло — ответы поданы автоматически</div>` : ''}

      <!-- Сертификат -->
      <div class="certificate-card" style="
        background:var(--bg-card);border-radius:20px;padding:2.5rem;
        border:2px solid ${grade.color}44;
        box-shadow:0 0 40px ${grade.color}22;
        text-align:center;margin-bottom:1.5rem;position:relative;overflow:hidden">

        <!-- Декоративная внутренняя рамка -->
        <div style="position:absolute;inset:8px;border:1px solid ${grade.color}22;
                    border-radius:14px;pointer-events:none"></div>

        <!-- Шапка -->
        <div style="font-size:2.5rem;margin-bottom:0.5rem">🎓</div>
        <div style="font-size:0.85rem;color:var(--text-sub);letter-spacing:0.15em;
                    text-transform:uppercase;font-weight:600;margin-bottom:0.25rem">
          Сертификат об успешном прохождении
        </div>
        <div style="font-size:0.8rem;color:var(--text-sub);margin-bottom:1.5rem">
          Математический анализ · ${fmtLabel} экзамен
        </div>

        <!-- Имя студента -->
        <div style="font-size:1.8rem;font-weight:800;color:${grade.color};
                    font-family:'Playfair Display',serif;margin-bottom:1.5rem;
                    border-bottom:1px solid ${grade.color}33;padding-bottom:1rem">
          ${username}
        </div>

        <!-- Статистика -->
        <div style="display:flex;justify-content:center;gap:2rem;flex-wrap:wrap;margin-bottom:1.5rem">
          <div>
            <div style="font-size:3rem;font-weight:900;color:${grade.color}">${pct}%</div>
            <div style="font-size:0.8rem;color:var(--text-sub)">Результат</div>
          </div>
          <div>
            <div style="font-size:3rem;font-weight:900;color:${grade.color}">${correct}/${total}</div>
            <div style="font-size:0.8rem;color:var(--text-sub)">Верных ответов</div>
          </div>
          <div>
            <div style="font-size:3rem;font-weight:900;color:${grade.color}">${grade.grade}</div>
            <div style="font-size:0.8rem;color:var(--text-sub)">${grade.label}</div>
          </div>
        </div>

        <!-- Печать/оценка -->
        <div style="display:inline-flex;align-items:center;gap:8px;
                    background:${grade.color}15;border:2px solid ${grade.color}44;
                    border-radius:100px;padding:8px 20px;font-size:0.85rem;
                    font-weight:700;color:${grade.color}">
          ✦ ${grade.label.toUpperCase()} · Оценка ${grade.grade} ✦
        </div>

        <!-- Дата -->
        <div style="margin-top:1.5rem;font-size:0.8rem;color:var(--text-sub)">${dateStr}</div>
      </div>

      <!-- Детальные результаты (сворачиваемые) -->
      <details style="margin-bottom:1.5rem">
        <summary style="cursor:pointer;font-weight:600;padding:0.75rem;border-radius:10px;
          background:var(--bg-card);border:1px solid rgba(100,116,139,0.2)">
          Подробные результаты
        </summary>
        <div style="margin-top:0.75rem;display:grid;gap:0.5rem">
          ${results.map((r, i) => `
            <div style="background:var(--bg-card);border-radius:10px;padding:0.75rem 1rem;
              border-left:3px solid ${r.isCorrect ? '#10b981' : '#ef4444'};font-size:0.85rem">
              <div style="color:${r.isCorrect ? '#34d399' : '#f87171'};font-weight:600;margin-bottom:0.25rem">
                ${r.isCorrect ? '✓' : '✗'} Вопрос ${i + 1}
                <span style="color:var(--text-sub);font-weight:400;font-size:0.78rem;margin-left:6px">
                  ${SUBJECTS[r.subject] || ''}
                </span>
              </div>
              <div style="color:var(--text-sub);margin-bottom:0.2rem;line-height:1.4">
                ${r.question.slice(0, 120)}${r.question.length > 120 ? '…' : ''}
              </div>
              ${!r.isCorrect ? `
                <div style="color:#f87171;font-size:0.78rem">Ваш ответ: ${r.userAnswer}</div>
                <div style="color:#34d399;font-size:0.78rem">Верно: ${r.correctAnswer}</div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      </details>

      <!-- Кнопки действий -->
      <div style="display:flex;gap:0.75rem;flex-wrap:wrap;justify-content:center">
        <button onclick="window.print()"
          style="padding:10px 24px;border-radius:12px;border:none;cursor:pointer;font-weight:700;
                 background:linear-gradient(135deg,#6366f1,#8b5cf6);color:white;font-size:0.95rem">
          🖨️ Распечатать / Скачать PDF
        </button>
        <button onclick="window.showExamPage()"
          style="padding:10px 24px;border-radius:12px;border:1px solid rgba(100,116,139,0.4);
                 background:transparent;color:var(--text-main);cursor:pointer;font-size:0.95rem;font-weight:600">
          Новый экзамен
        </button>
        <button onclick="showHome()"
          style="padding:10px 24px;border-radius:12px;border:1px solid rgba(100,116,139,0.3);
                 background:transparent;color:var(--text-sub);cursor:pointer;font-size:0.9rem">
          ← Главная
        </button>
      </div>
    </div>
  `
}
