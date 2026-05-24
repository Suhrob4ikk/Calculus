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
        note: 'Увеличиваем показатель на 1 и делим на новый показатель. Пример: \\(\\int x^3\\,dx = \\frac{x^4}{4}+C\\)'
      },
      {
        title: 'Логарифмический интеграл',
        formula: '\\[\\int \\frac{1}{x}\\,dx = \\ln|x| + C\\]',
        note: 'Частный случай при n = −1. Модуль нужен, т.к. ln определён только для x > 0. Пример: \\(\\int \\frac{3}{x}\\,dx = 3\\ln|x|+C\\)'
      },
      {
        title: 'Экспонента',
        formula: '\\[\\int e^x\\,dx = e^x + C \\qquad \\int a^x\\,dx = \\frac{a^x}{\\ln a} + C\\]',
        note: 'Экспонента — единственная функция, равная своей производной и своему интегралу. Пример: \\(\\int e^{2x}\\,dx = \\frac{1}{2}e^{2x}+C\\)'
      },
      {
        title: 'Тригонометрия',
        formula: '\\[\\int \\sin x\\,dx = -\\cos x + C \\qquad \\int \\cos x\\,dx = \\sin x + C\\]',
        note: 'При интегрировании синуса появляется минус. Пример: \\(\\int \\sin 3x\\,dx = -\\frac{1}{3}\\cos 3x+C\\)'
      },
      {
        title: 'Линейная замена',
        formula: '\\[\\int f(ax + b)\\,dx = \\frac{1}{a}\\,F(ax + b) + C\\]',
        note: 'Линейный аргумент (ax + b) → делим результат на a. Пример: \\(\\int (2x+1)^4\\,dx = \\frac{(2x+1)^5}{10}+C\\)'
      },
      {
        title: 'Метод подстановки',
        formula: '\\[\\int f(g(x))\\cdot g\'(x)\\,dx = F(g(x)) + C\\]',
        note: 'Замена t = g(x), dt = g′(x)dx. Пример: \\(\\int 2x\\cdot e^{x^2}\\,dx = e^{x^2}+C\\) (t = x²)'
      },
      {
        title: 'Интегрирование по частям',
        formula: '\\[\\int u\\,dv = uv - \\int v\\,du\\]',
        note: 'Правило ЛАТЕ: Логарифм, Алгебра, Тригонометрия, Экспонента — выбираем u в этом порядке. Пример: \\(\\int x e^x\\,dx = xe^x - e^x + C\\)'
      },
      {
        title: 'Свойства неопределённого интеграла',
        formula: '\\[\\int (\\alpha f + \\beta g)\\,dx = \\alpha\\int f\\,dx + \\beta\\int g\\,dx\\]',
        note: 'Интеграл линеен: константу выносим за знак, интеграл суммы — сумма интегралов. Пример: \\(\\int (3x^2 + 5)\\,dx = x^3 + 5x + C\\)'
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
        note: 'Степень выносим вперёд, уменьшаем на 1. Примеры: \\((x^5)'=5x^4\\), \\((\\sqrt{x})'=\\frac{1}{2\\sqrt{x}}\\)'
      },
      {
        title: 'Экспонента и логарифм',
        formula: "\\[(e^x)'= e^x \\qquad (\\ln x)'= \\frac{1}{x} \\qquad (a^x)'= a^x\\ln a\\]",
        note: 'Производная eˣ — сам eˣ. Пример: \\((e^{3x})'=3e^{3x}\\), \\((\\ln 5x)'=\\frac{1}{x}\\)'
      },
      {
        title: 'Тригонометрия',
        formula: "\\[(\\sin x)'= \\cos x \\qquad (\\cos x)'= -\\sin x\\]",
        note: 'Производная синуса — косинус (без минуса). Производная косинуса — минус синус. Дальше по кругу.'
      },
      {
        title: 'Тригонометрия — продолжение',
        formula: "\\[(\\tan x)'= \\frac{1}{\\cos^2 x} \\qquad (\\cot x)'= -\\frac{1}{\\sin^2 x}\\]",
        note: 'Пример: \\((\\tan 2x)' = \\frac{2}{\\cos^2 2x}\\). Не забываем цепное правило!'
      },
      {
        title: 'Правило произведения',
        formula: "\\[(uv)'= u'v + uv'\\]",
        note: 'Каждый множитель дифференцируется по очереди, результаты складываются. Пример: \\((x^2 e^x)' = 2xe^x + x^2 e^x\\)'
      },
      {
        title: 'Правило частного',
        formula: "\\[\\left(\\frac{u}{v}\\right)'= \\frac{u'v - uv'}{v^2}\\]",
        note: '"Числитель минус числитель, делённые на знаменатель в квадрате". Пример: \\(\\left(\\frac{x}{e^x}\\right)'=\\frac{e^x - xe^x}{e^{2x}}\\)'
      },
      {
        title: 'Цепное правило',
        formula: "\\[(f(g(x)))'= f'(g(x))\\cdot g'(x)\\]",
        note: 'Внешняя производная умножается на внутреннюю. Пример: \\((\\sin x^2)'= \\cos(x^2)\\cdot 2x\\)'
      },
      {
        title: 'Обратные тригонометрические',
        formula: "\\[(\\arcsin x)'= \\frac{1}{\\sqrt{1-x^2}} \\qquad (\\arctan x)'= \\frac{1}{1+x^2}\\]",
        note: 'Используются при интегрировании выражений с \\(\\sqrt{1-x^2}\\) и \\(1+x^2\\).'
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
        note: 'Если общий член не стремится к нулю — ряд точно расходится. Обратное неверно! Пример: гармонический ряд \\(\\sum \\frac{1}{n}\\) расходится, хотя \\(\\frac{1}{n}\\to 0\\).'
      },
      {
        title: 'Признак Даламбера',
        formula: '\\[L = \\lim_{n\\to\\infty}\\left|\\frac{a_{n+1}}{a_n}\\right|: \\quad L < 1 \\Rightarrow \\text{сх.}, \\quad L > 1 \\Rightarrow \\text{расх.}, \\quad L=1 \\Rightarrow \\text{?}\\]',
        note: 'Удобен при наличии факториалов и показательных функций. Пример: \\(\\sum\\frac{n!}{n^n}\\) — Даламбер даёт L < 1, сходится.'
      },
      {
        title: 'Признак Коши (радикальный)',
        formula: '\\[L = \\lim_{n\\to\\infty}\\sqrt[n]{|a_n|}: \\quad L < 1 \\Rightarrow \\text{сходится}, \\quad L > 1 \\Rightarrow \\text{расходится}\\]',
        note: 'Удобен, когда aₙ имеет вид (f(n))ⁿ. Пример: \\(\\sum\\left(\\frac{2n}{n+1}\\right)^n\\) — Коши даёт L = 2 > 1, расходится.'
      },
      {
        title: 'Признак Лейбница',
        formula: '\\[\\text{Если } |a_n| \\searrow 0, \\text{ то } \\sum_{n=1}^{\\infty}(-1)^{n-1}a_n \\text{ сходится}\\]',
        note: 'Для знакочередующихся рядов. Пример: \\(\\sum\\frac{(-1)^{n-1}}{n} = 1 - \\frac{1}{2} + \\frac{1}{3} - \\cdots = \\ln 2\\)'
      },
      {
        title: 'Признак сравнения',
        formula: '\\[0 \\le a_n \\le b_n:\\quad \\sum b_n \\text{ сх.} \\Rightarrow \\sum a_n \\text{ сх.}; \\quad \\sum a_n \\text{ расх.} \\Rightarrow \\sum b_n \\text{ расх.}\\]',
        note: 'Сравниваем с эталонным рядом (геометрическим или обобщённым гармоническим \\(\\sum\\frac{1}{n^p}\\)).'
      },
      {
        title: 'Эталонные ряды',
        formula: '\\[\\sum_{n=1}^{\\infty}\\frac{1}{n^p}: \\quad p > 1 \\Rightarrow \\text{сходится}, \\quad p \\le 1 \\Rightarrow \\text{расходится}\\]',
        note: 'Обобщённый гармонический ряд. Пример: \\(\\sum\\frac{1}{n^2}=\\frac{\\pi^2}{6}\\) — сходится; \\(\\sum\\frac{1}{n}\\) — расходится.'
      },
      {
        title: 'Степенные ряды',
        formula: '\\[\\sum_{n=0}^{\\infty} c_n(x-a)^n, \\quad R = \\frac{1}{\\limsup|c_n|^{1/n}}\\]',
        note: 'Радиус сходимости R определяет интервал (a−R, a+R), внутри которого ряд сходится абсолютно.'
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
        note: 'Аналогично: \\(\\lim\\frac{\\tan x}{x}=1\\), \\(\\lim\\frac{\\arcsin x}{x}=1\\) при x→0. Пример: \\(\\lim\\frac{\\sin 3x}{x}=3\\)'
      },
      {
        title: 'Второй замечательный предел',
        formula: '\\[\\lim_{x \\to \\infty}\\left(1 + \\frac{1}{x}\\right)^x = e \\qquad \\lim_{x\\to 0}(1+x)^{1/x} = e\\]',
        note: 'Число e ≈ 2.71828. Пример: \\(\\lim\\left(1+\\frac{2}{n}\\right)^n = e^2\\)'
      },
      {
        title: 'Правило Лопиталя',
        formula: "\\[\\lim_{x\\to a}\\frac{f(x)}{g(x)} = \\lim_{x\\to a}\\frac{f'(x)}{g'(x)} \\quad \\left[\\frac{0}{0}\\text{ или }\\frac{\\infty}{\\infty}\\right]\\]",
        note: 'Применяется при неопределённостях 0/0 или ∞/∞. Пример: \\(\\lim_{x\\to 0}\\frac{\\sin x}{x}=\\lim_{x\\to 0}\\frac{\\cos x}{1}=1\\)'
      },
      {
        title: 'Эквивалентные бесконечно малые',
        formula: '\\[x\\to 0:\\quad \\sin x \\sim x,\\quad \\tan x \\sim x,\\quad \\ln(1+x)\\sim x,\\quad e^x-1\\sim x\\]',
        note: 'При x→0 можно заменять в произведениях и частных. Пример: \\(\\lim\\frac{\\ln(1+x)}{\\sin x}=\\lim\\frac{x}{x}=1\\)'
      },
      {
        title: 'Непрерывность функции',
        formula: '\\[f \\text{ непрерывна в } x_0 \\Leftrightarrow \\lim_{x\\to x_0}f(x) = f(x_0)\\]',
        note: 'Три условия: f(x₀) определена, предел существует, и предел равен значению функции.'
      },
      {
        title: 'Односторонние пределы',
        formula: '\\[\\lim_{x\\to a^-}f(x) = L^- \\qquad \\lim_{x\\to a^+}f(x) = L^+\\]',
        note: 'Предел существует ⟺ L⁻ = L⁺. Пример: у \\(|x|/x\\) при x→0: L⁻ = −1, L⁺ = 1 → предела нет.'
      },
      {
        title: 'Теорема о сжатой переменной',
        formula: '\\[g(x) \\le f(x) \\le h(x), \\quad \\lim g = \\lim h = L \\implies \\lim f = L\\]',
        note: 'Если функция зажата между двумя, стремящимися к одному пределу, то и она стремится к тому же. Пример: \\(\\lim x\\sin\\frac{1}{x}=0\\)'
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
        note: 'Простейший случай: правая часть зависит только от x. Пример: \\(y\'=3x^2 \\implies y=x^3+C\\)'
      },
      {
        title: 'Экспоненциальный рост и убывание',
        formula: "\\[y' = ky \\implies y = Ce^{kx}\\]",
        note: 'k > 0 — рост, k < 0 — убывание. Пример: задача Коши \\(y\'=2y,\\,y(0)=3 \\implies y=3e^{2x}\\)'
      },
      {
        title: 'Разделение переменных',
        formula: '\\[\\frac{dy}{dx} = f(x)\\cdot g(y) \\implies \\int\\frac{dy}{g(y)} = \\int f(x)\\,dx + C\\]',
        note: 'Переносим всё с y влево, всё с x — вправо, затем интегрируем обе части независимо.'
      },
      {
        title: 'Линейное ДУ первого порядка',
        formula: "\\[y' + P(x)\\,y = Q(x), \\quad \\mu = e^{\\int P(x)\\,dx}\\]",
        note: 'Решается умножением на интегрирующий множитель μ. Тогда (μy)′ = μQ(x), и берём интеграл.'
      },
      {
        title: 'Задача Коши',
        formula: "\\[y' = f(x,\\,y), \\quad y(x_0) = y_0\\]",
        note: 'Начальное условие выделяет единственное решение. Пример: \\(y\'=y,\\,y(0)=1 \\implies y=e^x\\)'
      },
      {
        title: 'Однородные уравнения',
        formula: "\\[y' = f\\!\\left(\\frac{y}{x}\\right) \\xrightarrow{t=y/x} \\text{разделение переменных}\\]",
        note: 'Замена t = y/x превращает однородное ДУ в уравнение с разделяемыми переменными.'
      },
      {
        title: 'ДУ второго порядка с пост. коэфф.',
        formula: "\\[y'' + py' + qy = 0, \\quad k^2 + pk + q = 0\\]",
        note: 'Составляем характеристическое уравнение. Корни k₁, k₂ — действительные или комплексные — определяют вид решения.'
      },
      {
        title: 'Типы решений по корням',
        formula: "\\[k_1 \\neq k_2 \\in \\mathbb{R}:\\; C_1e^{k_1 x}+C_2e^{k_2 x} \\quad k_{1,2}=\\alpha\\pm\\beta i:\\; e^{\\alpha x}(C_1\\cos\\beta x+C_2\\sin\\beta x)\\]",
        note: 'Три случая: различные вещественные корни, кратный корень, комплексные сопряжённые корни.'
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
  window.scrollTo(0, 0)
  if (window.MathJax) MathJax.typesetPromise()
}

window.backFromTheory = function () {
  if (_theoryKey && THEORY_DATA[_theoryKey]) {
    showPage(THEORY_DATA[_theoryKey].backTo)
    window.scrollTo(0, 0)
  }
}
