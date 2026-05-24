// ── Теория в стиле Степика ───────────────────────────────
import { showPage } from './ui.js'

const THEORY_DATA = {
  integrals: {
    title: 'Интегралы',
    accent: '#3b82f6',
    icon: '∫',
    backTo: 'integralsSection',
    steps: [
      {
        title: 'Степенная функция',
        formula: '\\[\\int x^n\\,dx = \\frac{x^{n+1}}{n+1} + C, \\quad n \\neq -1\\]',
        note: 'Увеличиваем показатель на 1 и делим на новый показатель. Работает для любого n ≠ −1.'
      },
      {
        title: 'Логарифмический интеграл',
        formula: '\\[\\int \\frac{1}{x}\\,dx = \\ln|x| + C\\]',
        note: 'Частный случай при n = −1. Модуль нужен, т.к. ln определён только для положительных чисел.'
      },
      {
        title: 'Экспонента',
        formula: '\\[\\int e^x\\,dx = e^x + C\\]',
        note: 'Экспонента — единственная функция, равная своей производной и своему интегралу.'
      },
      {
        title: 'Тригонометрия',
        formula: '\\[\\int \\sin x\\,dx = -\\cos x + C \\qquad \\int \\cos x\\,dx = \\sin x + C\\]',
        note: 'При интегрировании синуса появляется минус — не забудьте его!'
      },
      {
        title: 'Линейная замена',
        formula: '\\[\\int f(ax + b)\\,dx = \\frac{1}{a}\\,F(ax + b) + C\\]',
        note: 'Если аргумент линейный (ax + b), делим результат на коэффициент a при x.'
      }
    ]
  },

  derivatives: {
    title: 'Производные',
    accent: '#eab308',
    icon: "f'(x)",
    backTo: 'derivativesSection',
    steps: [
      {
        title: 'Степенная функция',
        formula: "\\[(x^n)'= nx^{n-1}\\]",
        note: 'Степень выносим вперёд как коэффициент, затем уменьшаем степень на 1.'
      },
      {
        title: 'Экспонента и логарифм',
        formula: "\\[(e^x)'= e^x \\qquad (\\ln x)'= \\frac{1}{x}\\]",
        note: 'Производная eˣ — сам eˣ. Производная ln x — величина 1/x.'
      },
      {
        title: 'Тригонометрия',
        formula: "\\[(\\sin x)'= \\cos x \\qquad (\\cos x)'= -\\sin x\\]",
        note: 'Производная синуса — косинус (без минуса). Производная косинуса — минус синус.'
      },
      {
        title: 'Произведение и частное',
        formula: "\\[(uv)'= u'v + uv' \\qquad \\left(\\frac{u}{v}\\right)'= \\frac{u'v - uv'}{v^2}\\]",
        note: 'Каждый множитель дифференцируется по очереди. В частном — числитель минус числитель.'
      },
      {
        title: 'Цепное правило',
        formula: "\\[(f(g(x)))'= f'(g(x))\\cdot g'(x)\\]",
        note: 'Внешняя производная умножается на внутреннюю. Ключ к дифференцированию сложных функций.'
      }
    ]
  },

  series: {
    title: 'Ряды и последовательности',
    accent: '#ef4444',
    icon: '∑',
    backTo: 'seriesSection',
    steps: [
      {
        title: 'Сходимость ряда',
        formula: '\\[S = \\sum_{n=1}^{\\infty} a_n = \\lim_{N\\to\\infty} S_N, \\quad S_N = a_1 + a_2 + \\cdots + a_N\\]',
        note: 'Ряд сходится, если последовательность частичных сумм имеет конечный предел.'
      },
      {
        title: 'Необходимый признак расходимости',
        formula: '\\[\\lim_{n\\to\\infty} a_n \\neq 0 \\implies \\sum a_n \\text{ расходится}\\]',
        note: 'Если общий член не стремится к нулю — ряд точно расходится. Обратное неверно!'
      },
      {
        title: 'Признак Даламбера',
        formula: '\\[L = \\lim_{n\\to\\infty}\\left|\\frac{a_{n+1}}{a_n}\\right|: \\quad L < 1 \\Rightarrow \\text{сходится}, \\quad L > 1 \\Rightarrow \\text{расходится}\\]',
        note: 'Удобен при наличии факториалов и степеней. При L = 1 признак не даёт ответа.'
      },
      {
        title: 'Признак Коши (радикальный)',
        formula: '\\[L = \\lim_{n\\to\\infty}\\sqrt[n]{|a_n|}: \\quad L < 1 \\Rightarrow \\text{сходится}, \\quad L > 1 \\Rightarrow \\text{расходится}\\]',
        note: 'Особенно удобен, когда aₙ имеет вид (f(n))ⁿ.'
      },
      {
        title: 'Признак Лейбница',
        formula: '\\[\\text{Если } |a_n| \\searrow 0, \\text{ то } \\sum_{n=1}^{\\infty}(-1)^{n-1}a_n \\text{ сходится}\\]',
        note: 'Для знакочередующихся рядов: члены по модулю монотонно убывают к нулю.'
      }
    ]
  },

  limits: {
    title: 'Пределы и непрерывность',
    accent: '#a855f7',
    icon: 'lim',
    backTo: 'limitsSection',
    steps: [
      {
        title: 'Определение предела',
        formula: '\\[\\lim_{x \\to a} f(x) = L\\]',
        note: 'f(x) приближается к L сколь угодно близко при x → a. Само значение f(a) может не существовать.'
      },
      {
        title: 'Первый замечательный предел',
        formula: '\\[\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1\\]',
        note: 'Аналогично: lim(tan x)/x = 1 и lim(arcsin x)/x = 1 при x → 0.'
      },
      {
        title: 'Второй замечательный предел',
        formula: '\\[\\lim_{x \\to \\infty}\\left(1 + \\frac{1}{x}\\right)^x = e\\]',
        note: 'Аналогично: lim(1 + x)^(1/x) = e при x → 0. Число e ≈ 2.71828.'
      },
      {
        title: 'Правило Лопиталя',
        formula: "\\[\\lim_{x\\to a}\\frac{f(x)}{g(x)} = \\lim_{x\\to a}\\frac{f'(x)}{g'(x)} \\quad \\left[\\frac{0}{0}\\text{ или }\\frac{\\infty}{\\infty}\\right]\\]",
        note: 'Применяется только при неопределённостях 0/0 или ∞/∞. Можно применять несколько раз подряд.'
      },
      {
        title: 'Непрерывность функции',
        formula: '\\[f \\text{ непрерывна в } x_0 \\Leftrightarrow \\lim_{x\\to x_0}f(x) = f(x_0)\\]',
        note: 'Три условия: f(x₀) существует, предел существует, и они равны друг другу.'
      }
    ]
  },

  ode: {
    title: 'Дифференциальные уравнения',
    accent: '#f97316',
    icon: "y'",
    backTo: 'odeSection',
    steps: [
      {
        title: 'Прямое интегрирование',
        formula: "\\[y' = f(x) \\implies y = \\int f(x)\\,dx + C\\]",
        note: 'Простейший случай: правая часть зависит только от x. Берём интеграл, добавляем константу.'
      },
      {
        title: 'Экспоненциальный рост и убывание',
        formula: "\\[y' = ky \\implies y = Ce^{kx}\\]",
        note: 'k > 0 — рост, k < 0 — убывание. Константа C определяется из начального условия.'
      },
      {
        title: 'Разделение переменных',
        formula: '\\[\\frac{dy}{dx} = f(x)\\cdot g(y) \\implies \\int\\frac{dy}{g(y)} = \\int f(x)\\,dx\\]',
        note: 'Переносим всё с y влево, всё с x — вправо, затем интегрируем обе части.'
      },
      {
        title: 'Линейное ДУ первого порядка',
        formula: "\\[y' + P(x)\\,y = Q(x)\\]",
        note: 'Решается через интегрирующий множитель μ = e^{∫P(x)dx} или методом вариации постоянной.'
      },
      {
        title: 'Задача Коши',
        formula: "\\[y' = f(x,\\,y), \\quad y(x_0) = y_0\\]",
        note: 'Начальное условие y(x₀) = y₀ выделяет единственное решение из общего семейства кривых.'
      }
    ]
  }
}

let _theoryKey = null

window.showTheory = function (key) {
  _theoryKey = key
  const d = THEORY_DATA[key]
  if (!d) return

  const hex2rgba = (hex, a) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgba(${r},${g},${b},${a})`
  }

  const stepsHtml = d.steps.map((s, i) => `
    <div class="theory-step">
      <div class="theory-step-num"
           style="background:${hex2rgba(d.accent, 0.12)};color:${d.accent};border:2px solid ${hex2rgba(d.accent, 0.3)}">
        ${i + 1}
      </div>
      <div class="theory-step-body">
        <div class="theory-step-title">${s.title}</div>
        <div class="theory-step-formula">${s.formula}</div>
        <div class="theory-step-note">${s.note}</div>
      </div>
    </div>
  `).join('')

  document.getElementById('theoryPageContent').innerHTML = `
    <div class="theory-header" style="border-bottom:2px solid ${hex2rgba(d.accent, 0.25)}">
      <div class="theory-header-icon" style="color:${d.accent}">${d.icon}</div>
      <h2 class="theory-header-title">${d.title}</h2>
      <p class="theory-header-sub">${d.steps.length} шагов · Базовые формулы и правила</p>
    </div>
    <div style="margin-top:1.5rem">${stepsHtml}</div>
    <button onclick="backFromTheory()"
            class="theory-start-btn"
            style="background:${d.accent}">
      Перейти к тесту →
    </button>
  `

  showPage('theoryPage')
  if (window.MathJax) MathJax.typesetPromise()
}

window.backFromTheory = function () {
  if (_theoryKey && THEORY_DATA[_theoryKey]) {
    showPage(THEORY_DATA[_theoryKey].backTo)
  }
}
