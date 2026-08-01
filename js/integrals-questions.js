// ── Интегралы ─────────────────────────────────────────────

export const easyIntegralsQuestions = [
  {
    question: "Вычислите интеграл $\\int (2x+3)^5 dx$",
    options: [
      "$\\frac{(2x+3)^6}{12} + C$",
      "$\\frac{(2x+3)^6}{6} + C$",
      "$2(2x+3)^6 + C$",
      "$(2x+3)^6 + C$",
    ],
    correct: 0,
    explanation: "Линейная замена: $\\int(ax+b)^n dx=\\frac{(ax+b)^{n+1}}{a(n+1)}$; здесь $\\frac{(2x+3)^6}{2\\cdot 6}=\\frac{(2x+3)^6}{12}$.",
  },
  {
    question: "Вычислите интеграл $\\int e^{3x-2} dx$",
    options: [
      "$\\frac{1}{3}e^{3x-2} + C$",
      "$e^{3x-2} + C$",
      "$3e^{3x-2} + C$",
      "$\\frac{1}{2}e^{3x-2} + C$",
    ],
    correct: 0,
    explanation: "$\\int e^{ax+b}dx=\\frac{1}{a}e^{ax+b}$; делим на $3$.",
  },
  {
    question: "Вычислите интеграл $\\int \\sin(4x+1) dx$",
    options: [
      "$-\\frac{1}{4}\\cos(4x+1) + C$",
      "$-4\\cos(4x+1) + C$",
      "$\\frac{1}{4}\\cos(4x+1) + C$",
      "$-\\cos(4x+1) + C$",
    ],
    correct: 0,
    explanation: "$\\int\\sin(ax+b)dx=-\\frac{1}{a}\\cos(ax+b)$, здесь $a=4$.",
  },
  {
    question: "Вычислите интеграл $\\int \\frac{1}{5x-2} dx$",
    options: [
      "$\\frac{1}{5}\\ln|5x-2| + C$",
      "$5\\ln|5x-2| + C$",
      "$\\ln|5x-2| + C$",
      "$\\frac{1}{2}\\ln|5x-2| + C$",
    ],
    correct: 0,
    explanation: "$\\int\\frac{dx}{ax+b}=\\frac{1}{a}\\ln|ax+b|$, здесь $a=5$.",
  },
  {
    question: "Вычислите интеграл $\\int (3-2x)^4 dx$",
    options: [
      "$-\\frac{(3-2x)^5}{10} + C$",
      "$\\frac{(3-2x)^5}{5} + C$",
      "$-\\frac{(3-2x)^5}{5} + C$",
      "$(3-2x)^5 + C$",
    ],
    correct: 0,
    explanation: "Линейная замена с $a=-2$: $\\frac{(3-2x)^5}{-2\\cdot 5}=-\\frac{(3-2x)^5}{10}$.",
  },
  {
    question: "Вычислите интеграл $\\int \\cos(2x-\\pi) dx$",
    options: [
      "$\\frac{1}{2}\\sin(2x-\\pi) + C$",
      "$2\\sin(2x-\\pi) + C$",
      "$-\\frac{1}{2}\\sin(2x-\\pi) + C$",
      "$\\sin(2x-\\pi) + C$",
    ],
    correct: 0,
    explanation: "$\\int\\cos(ax+b)dx=\\frac{1}{a}\\sin(ax+b)$, здесь $a=2$.",
  },
  {
    question: "Вычислите интеграл $\\int \\sqrt{3x+1} dx$",
    options: [
      "$\\frac{2}{9}(3x+1)^{3/2} + C$",
      "$\\frac{2}{3}(3x+1)^{3/2} + C$",
      "$\\frac{1}{2}(3x+1)^{3/2} + C$",
      "$(3x+1)^{3/2} + C$",
    ],
    correct: 0,
    explanation: "$\\sqrt{3x+1}=(3x+1)^{1/2}$: $\\frac{(3x+1)^{3/2}}{3\\cdot 3/2}=\\frac{2}{9}(3x+1)^{3/2}$.",
  },
  {
    question: "Вычислите интеграл $\\int \\frac{3}{\\sqrt{2x+5}} dx$",
    options: [
      "$3\\sqrt{2x+5} + C$",
      "$\\frac{3}{2}\\sqrt{2x+5} + C$",
      "$\\frac{3}{\\sqrt{2x+5}} + C$",
      "$6\\sqrt{2x+5} + C$",
    ],
    correct: 0,
    explanation: "$\\int(2x+5)^{-1/2}dx=\\frac{(2x+5)^{1/2}}{2\\cdot 1/2}=\\sqrt{2x+5}$; с коэффициентом $3$.",
  },
  {
    question: "Вычислите интеграл $\\int (4x-7)^{10} dx$",
    options: [
      "$\\frac{(4x-7)^{11}}{44} + C$",
      "$\\frac{(4x-7)^{11}}{11} + C$",
      "$4(4x-7)^{11} + C$",
      "$(4x-7)^{11} + C$",
    ],
    correct: 0,
    explanation: "Линейная замена: $\\frac{(4x-7)^{11}}{4\\cdot 11}=\\frac{(4x-7)^{11}}{44}$.",
  },
  {
    question: "Вычислите интеграл $\\int e^{-x+3} dx$",
    options: [
      "$-e^{-x+3} + C$",
      "$e^{-x+3} + C$",
      "$-\\frac{1}{2}e^{-x+3} + C$",
      "$\\frac{1}{3}e^{-x+3} + C$",
    ],
    correct: 0,
    explanation: "$\\int e^{ax+b}dx=\\frac{1}{a}e^{ax+b}$ с $a=-1$: $-e^{-x+3}$.",
  },
  {
    question: "Вычислите интеграл $\\int \\frac{2}{(3x-1)^2} dx$",
    options: [
      "$-\\frac{2}{3(3x-1)} + C$",
      "$-\\frac{2}{(3x-1)} + C$",
      "$\\frac{2}{3(3x-1)} + C$",
      "$-\\frac{6}{(3x-1)^3} + C$",
    ],
    correct: 0,
    explanation: "$\\int(3x-1)^{-2}dx=\\frac{(3x-1)^{-1}}{3\\cdot(-1)}=-\\frac{1}{3(3x-1)}$; с $2$.",
  },
  {
    question: "Вычислите интеграл $\\int \\tan(2x+1) dx$",
    options: [
      "$-\\frac{1}{2}\\ln|\\cos(2x+1)| + C$",
      "$\\frac{1}{2}\\ln|\\cos(2x+1)| + C$",
      "$-\\ln|\\cos(2x+1)| + C$",
      "$\\ln|\\cos(2x+1)| + C$",
    ],
    correct: 0,
    explanation: "$\\int\\tan u\\,du=-\\ln|\\cos u|$; при $u=2x+1$ делим на $2$.",
  },
  {
    question: "Вычислите интеграл $\\int \\frac{5}{2-3x} dx$",
    options: [
      "$-\\frac{5}{3}\\ln|2-3x| + C$",
      "$\\frac{5}{3}\\ln|2-3x| + C$",
      "$-5\\ln|2-3x| + C$",
      "$5\\ln|2-3x| + C$",
    ],
    correct: 0,
    explanation: "$\\int\\frac{dx}{2-3x}=\\frac{1}{-3}\\ln|2-3x|$; с $5$: $-\\frac{5}{3}\\ln|2-3x|$.",
  },
  {
    question: "Вычислите интеграл $\\int \\sin(-3x+4) dx$",
    options: [
      "$\\frac{1}{3}\\cos(-3x+4) + C$",
      "$-\\frac{1}{3}\\cos(-3x+4) + C$",
      "$3\\cos(-3x+4) + C$",
      "$-\\cos(-3x+4) + C$",
    ],
    correct: 0,
    explanation: "$-\\frac{1}{a}\\cos(ax+b)$ с $a=-3$: $\\frac{1}{3}\\cos(-3x+4)$.",
  },
  {
    question: "Вычислите интеграл $\\int (1-4x)^7 dx$",
    options: [
      "$-\\frac{(1-4x)^8}{32} + C$",
      "$\\frac{(1-4x)^8}{8} + C$",
      "$-\\frac{(1-4x)^8}{8} + C$",
      "$(1-4x)^8 + C$",
    ],
    correct: 0,
    explanation: "$a=-4$: $\\frac{(1-4x)^8}{-4\\cdot 8}=-\\frac{(1-4x)^8}{32}$.",
  },
  {
    question: "Вычислите интеграл $\\int \\frac{6x}{\\sqrt{3x^2+2}} dx$",
    options: [
      "$2\\sqrt{3x^2+2} + C$",
      "$6\\sqrt{3x^2+2} + C$",
      "$\\frac{1}{\\sqrt{3x^2+2}} + C$",
      "$\\frac{2}{3}\\sqrt{3x^2+2} + C$",
    ],
    correct: 0,
    explanation: "Замена $u=3x^2+2$, $du=6x\\,dx$: $\\int u^{-1/2}du=2\\sqrt{u}$.",
  },
  {
    question: "Вычислите интеграл $\\int \\cos(\\pi x+2) dx$",
    options: [
      "$\\frac{1}{\\pi}\\sin(\\pi x+2) + C$",
      "$\\pi\\sin(\\pi x+2) + C$",
      "$\\sin(\\pi x+2) + C$",
      "$-\\frac{1}{\\pi}\\sin(\\pi x+2) + C$",
    ],
    correct: 0,
    explanation: "$\\frac{1}{a}\\sin(ax+b)$ с $a=\\pi$: $\\frac{1}{\\pi}\\sin(\\pi x+2)$.",
  },
  {
    question: "Вычислите интеграл $\\int e^{2-5x} dx$",
    options: [
      "$-\\frac{1}{5}e^{2-5x} + C$",
      "$\\frac{1}{5}e^{2-5x} + C$",
      "$-5e^{2-5x} + C$",
      "$e^{2-5x} + C$",
    ],
    correct: 0,
    explanation: "$a=-5$: $\\frac{1}{-5}e^{2-5x}=-\\frac{1}{5}e^{2-5x}$.",
  },
  {
    question: "Вычислите интеграл $\\int \\frac{4}{(1-2x)^3} dx$",
    options: [
      "$\\frac{1}{(1-2x)^2} + C$",
      "$\\frac{4}{(1-2x)^2} + C$",
      "$-\\frac{1}{(1-2x)^2} + C$",
      "$\\frac{2}{(1-2x)^2} + C$",
    ],
    correct: 0,
    explanation: "$\\int(1-2x)^{-3}dx=\\frac{(1-2x)^{-2}}{-2\\cdot(-2)}=\\frac{1}{4(1-2x)^2}$; с $4$: $\\frac{1}{(1-2x)^2}$.",
  },
  {
    question: "Вычислите интеграл $\\int \\frac{3x^2}{(x^3-4)^2} dx$",
    options: [
      "$-\\frac{1}{x^3-4} + C$",
      "$\\frac{1}{x^3-4} + C$",
      "$-\\frac{3}{x^3-4} + C$",
      "$\\frac{3}{x^3-4} + C$",
    ],
    correct: 0,
    explanation: "Замена $u=x^3-4$, $du=3x^2dx$: $\\int u^{-2}du=-\\frac{1}{u}$.",
  },
  {
    question: "Вычислите интеграл $\\int x dx$",
    options: [
      "$x^2 + C$",
      "$\\ln(x) + C$",
      "$x + C$",
      "$\\frac{x^2}{2} + C$",
    ],
    correct: 3,
    explanation: "Степенное правило $\\int x^n dx=\\frac{x^{n+1}}{n+1}$: $\\frac{x^2}{2}$.",
  },
  {
    question: "Вычислите интеграл $\\int 2x dx$",
    options: [
      "$x^2 + C$",
      "$2x^2 + C$",
      "$x + C$",
      "$\\frac{x^2}{2} + C$",
    ],
    correct: 0,
    explanation: "$\\int 2x\\,dx=2\\cdot\\frac{x^2}{2}=x^2$.",
  },
  {
    question: "Вычислите интеграл $\\int 3 dx$",
    options: [
      "$x^3 + C$",
      "$\\frac{3}{2}x^2 + C$",
      "$3x + C$",
      "$x + C$",
    ],
    correct: 2,
    explanation: "$\\int a\\,dx=ax$: $3x$.",
  },
  {
    question: "Вычислите интеграл $\\int x^2 dx$",
    options: [
      "$x^3 + C$",
      "$2x + C$",
      "$x^2 + C$",
      "$\\frac{x^3}{3} + C$",
    ],
    correct: 3,
    explanation: "Степенное правило: $\\frac{x^3}{3}$.",
  },
  {
    question: "Вычислите интеграл $\\int 5x^4 dx$",
    options: [
      "$5x^5 + C$",
      "$\\frac{5x^5}{4} + C$",
      "$x^5 + C$",
      "$\\frac{x^5}{4} + C$",
    ],
    correct: 2,
    explanation: "$5\\cdot\\frac{x^5}{5}=x^5$.",
  },
  {
    question: "Вычислите интеграл $\\int \\frac{1}{x} dx$",
    options: [
      "$\\ln(x) + C$",
      "$-\\frac{1}{x^2} + C$",
      "$\\ln|x| + C$",
      "$\\frac{1}{x^2} + C$",
    ],
    correct: 2,
    explanation: "$\\int\\frac{dx}{x}=\\ln|x|$.",
  },
  {
    question: "Вычислите интеграл $\\int 4x^3 dx$",
    options: [
      "$\\frac{4x^4}{3} + C$",
      "$4x^4 + C$",
      "$x^4 + C$",
      "$x^3 + C$",
    ],
    correct: 2,
    explanation: "$4\\cdot\\frac{x^4}{4}=x^4$.",
  },
  {
    question: "Вычислите интеграл $\\int (2x + 1) dx$",
    options: [
      "$2x^2 + x + C$",
      "$x^2 + x + C$",
      "$x^2 + 1 + C$",
      "$2x + C$",
    ],
    correct: 1,
    explanation: "Почленно: $x^2+x$.",
  },
  {
    question: "Вычислите интеграл $\\int (3x^2 + 2x) dx$",
    options: [
      "$\\frac{3x^3}{2} + \\frac{2x^2}{3} + C$",
      "$3x^3 + 2x^2 + C$",
      "$x^2 + x + C$",
      "$x^3 + x^2 + C$",
    ],
    correct: 3,
    explanation: "Почленно: $x^3+x^2$.",
  },
  {
    question: "Вычислите интеграл $\\int 6 dx$",
    options: ["$x^6 + C$", "$3x + C$", "$x + C$", "$6x + C$"],
    correct: 3,
    explanation: "$\\int 6\\,dx=6x$.",
  },
  {
    question: "Вычислите интеграл $\\int x^3 dx$",
    options: [
      "$x^4 + C$",
      "$3x + C$",
      "$x^3 + C$",
      "$\\frac{x^4}{4} + C$",
    ],
    correct: 3,
    explanation: "Степенное правило: $\\frac{x^4}{4}$.",
  },
  {
    question: "Вычислите интеграл $\\int 7x^2 dx$",
    options: [
      "$\\frac{7x^3}{3} + C$",
      "$7x^3 + C$",
      "$x^3 + C$",
      "$\\frac{x^3}{3} + C$",
    ],
    correct: 0,
    explanation: "$7\\cdot\\frac{x^3}{3}=\\frac{7x^3}{3}$.",
  },
  {
    question: "Вычислите интеграл $\\int 5 dx$",
    options: ["$x^5 + C$", "$x + C$", "$5x + C$", "$25x + C$"],
    correct: 2,
    explanation: "$\\int 5\\,dx=5x$.",
  },
  {
    question: "Вычислите интеграл $\\int (x^2 + 2) dx$",
    options: [
      "$\\frac{x^2}{2} + 2 + C$",
      "$x^2 + 2x + C$",
      "$\\frac{x^3}{3} + 2x + C$",
      "$x^3 + 2 + C$",
    ],
    correct: 2,
    explanation: "Почленно: $\\frac{x^3}{3}+2x$.",
  },
  {
    question: "Вычислите интеграл $\\int (3 + x^2) dx$",
    options: [
      "$x^3/3 + 3x + C$",
      "$3 + x^2 + C$",
      "$3x + x^3 + C$",
      "$x^2 + 3x + C$",
    ],
    correct: 0,
    explanation: "Почленно: $3x+\\frac{x^3}{3}$.",
  },
  // Вложенный массив развёрнут
  {
    question: "Вычислите интеграл $\\int (5x-2)^4 dx$",
    options: [
      "$\\frac{(5x-2)^5}{25} + C$",
      "$\\frac{(5x-2)^5}{5} + C$",
      "$5(5x-2)^5 + C$",
      "$(5x-2)^5 + C$",
    ],
    correct: 0,
    explanation: "Линейная замена: $\\frac{(5x-2)^5}{5\\cdot 5}=\\frac{(5x-2)^5}{25}$.",
  },
  {
    question: "Вычислите интеграл $\\int e^{4x+1} dx$",
    options: [
      "$\\frac{1}{4}e^{4x+1} + C$",
      "$e^{4x+1} + C$",
      "$4e^{4x+1} + C$",
      "$\\frac{1}{2}e^{4x+1} + C$",
    ],
    correct: 0,
    explanation: "$\\frac{1}{a}e^{ax+b}$ с $a=4$: $\\frac{1}{4}e^{4x+1}$.",
  },
  {
    question: "Вычислите интеграл $\\int \\cos(3x-\\pi/2) dx$",
    options: [
      "$\\frac{1}{3}\\sin(3x-\\pi/2) + C$",
      "$3\\sin(3x-\\pi/2) + C$",
      "$\\sin(3x-\\pi/2) + C$",
      "$-\\frac{1}{3}\\sin(3x-\\pi/2) + C$",
    ],
    correct: 0,
    explanation: "$\\frac{1}{a}\\sin(ax+b)$ с $a=3$: $\\frac{1}{3}\\sin(3x-\\pi/2)$.",
  },
  {
    question: "Вычислите интеграл $\\int \\frac{1}{7x+3} dx$",
    options: [
      "$\\frac{1}{7}\\ln|7x+3| + C$",
      "$7\\ln|7x+3| + C$",
      "$\\ln|7x+3| + C$",
      "$\\frac{1}{3}\\ln|7x+3| + C$",
    ],
    correct: 0,
    explanation: "$\\frac{1}{a}\\ln|ax+b|$ с $a=7$: $\\frac{1}{7}\\ln|7x+3|$.",
  },
  {
    question: "Вычислите интеграл $\\int (1-3x)^6 dx$",
    options: [
      "$-\\frac{(1-3x)^7}{21} + C$",
      "$\\frac{(1-3x)^7}{7} + C$",
      "$-\\frac{(1-3x)^7}{7} + C$",
      "$(1-3x)^7 + C$",
    ],
    correct: 0,
    explanation: "$a=-3$: $\\frac{(1-3x)^7}{-3\\cdot 7}=-\\frac{(1-3x)^7}{21}$.",
  },
  {
    question: "Вычислите интеграл $\\int \\sqrt{5x-1} dx$",
    options: [
      "$\\frac{2}{15}(5x-1)^{3/2} + C$",
      "$\\frac{2}{5}(5x-1)^{3/2} + C$",
      "$\\frac{1}{2}(5x-1)^{3/2} + C$",
      "$(5x-1)^{3/2} + C$",
    ],
    correct: 0,
    explanation: "$\\frac{(5x-1)^{3/2}}{5\\cdot 3/2}=\\frac{2}{15}(5x-1)^{3/2}$.",
  },
  {
    question: "Вычислите интеграл $\\int \\frac{4}{(2x-1)^3} dx$",
    options: [
      "$-\\frac{1}{(2x-1)^2} + C$",
      "$-\\frac{4}{(2x-1)^2} + C$",
      "$\\frac{1}{(2x-1)^2} + C$",
      "$\\frac{2}{(2x-1)^2} + C$",
    ],
    correct: 0,
    explanation: "$\\int(2x-1)^{-3}dx=\\frac{(2x-1)^{-2}}{2\\cdot(-2)}=-\\frac{1}{4(2x-1)^2}$; с $4$: $-\\frac{1}{(2x-1)^2}$.",
  },
  {
    question: "Вычислите интеграл $\\int \\sin(-2x+5) dx$",
    options: [
      "$\\frac{1}{2}\\cos(-2x+5) + C$",
      "$-\\frac{1}{2}\\cos(-2x+5) + C$",
      "$2\\cos(-2x+5) + C$",
      "$-\\cos(-2x+5) + C$",
    ],
    correct: 0,
    explanation: "$a=-2$: $-\\frac{1}{-2}\\cos(-2x+5)=\\frac{1}{2}\\cos(-2x+5)$.",
  },
  {
    question: "Вычислите интеграл $\\int \\frac{6x}{\\sqrt{x^2+4}} dx$",
    options: [
      "$6\\sqrt{x^2+4} + C$",
      "$3\\sqrt{x^2+4} + C$",
      "$\\frac{1}{\\sqrt{x^2+4}} + C$",
      "$\\frac{6}{3}\\sqrt{x^2+4} + C$",
    ],
    correct: 0,
    explanation: "Замена $u=x^2+4$, $du=2x\\,dx$: $6x\\,dx=3\\,du$, $\\int 3u^{-1/2}du=6\\sqrt{u}$.",
  },
  {
    question: "Вычислите интеграл $\\int e^{-2x} dx$",
    options: [
      "$-\\frac{1}{2}e^{-2x} + C$",
      "$\\frac{1}{2}e^{-2x} + C$",
      "$-2e^{-2x} + C$",
      "$e^{-2x} + C$",
    ],
    correct: 0,
    explanation: "$a=-2$: $\\frac{1}{-2}e^{-2x}=-\\frac{1}{2}e^{-2x}$.",
  },
  {
    question: "Вычислите интеграл $\\int \\frac{5}{4-3x} dx$",
    options: [
      "$-\\frac{5}{3}\\ln|4-3x| + C$",
      "$\\frac{5}{3}\\ln|4-3x| + C$",
      "$-5\\ln|4-3x| + C$",
      "$5\\ln|4-3x| + C$",
    ],
    correct: 0,
    explanation: "$a=-3$: $\\frac{5}{-3}\\ln|4-3x|=-\\frac{5}{3}\\ln|4-3x|$.",
  },
  {
    question: "Вычислите интеграл $\\int \\tan(5x) dx$",
    options: [
      "$-\\frac{1}{5}\\ln|\\cos(5x)| + C$",
      "$\\frac{1}{5}\\ln|\\cos(5x)| + C$",
      "$-\\ln|\\cos(5x)| + C$",
      "$\\ln|\\cos(5x)| + C$",
    ],
    correct: 0,
    explanation: "$\\int\\tan u\\,du=-\\ln|\\cos u|$; при $u=5x$ делим на $5$.",
  },
  {
    question: "Вычислите интеграл $\\int (3x+2)^9 dx$",
    options: [
      "$\\frac{(3x+2)^{10}}{30} + C$",
      "$\\frac{(3x+2)^{10}}{10} + C$",
      "$3(3x+2)^{10} + C$",
      "$(3x+2)^{10} + C$",
    ],
    correct: 0,
    explanation: "Линейная замена: $\\frac{(3x+2)^{10}}{3\\cdot 10}=\\frac{(3x+2)^{10}}{30}$.",
  },
  {
    question: "Вычислите интеграл $\\int \\cos(\\pi/2 - x) dx$",
    options: [
      "$-\\sin(\\pi/2 - x) + C$",
      "$\\sin(\\pi/2 - x) + C$",
      "$\\cos(\\pi/2 - x) + C$",
      "$-\\cos(\\pi/2 - x) + C$",
    ],
    correct: 0,
    explanation: "$a=-1$: $\\frac{1}{-1}\\sin(\\pi/2-x)=-\\sin(\\pi/2-x)$.",
  },
  {
    question: "Вычислите интеграл $\\int \\frac{3x^2}{(x^3+1)^4} dx$",
    options: [
      "$-\\frac{1}{3(x^3+1)^3} + C$",
      "$\\frac{1}{(x^3+1)^3} + C$",
      "$-\\frac{3}{(x^3+1)^3} + C$",
      "$\\frac{3}{(x^3+1)^3} + C$",
    ],
    correct: 0,
    explanation: "Замена $u=x^3+1$, $du=3x^2dx$: $\\int u^{-4}du=-\\frac{1}{3u^3}$.",
  },
  {
    question: "Вычислите интеграл $\\int 8x^3 dx$",
    options: [
      "$2x^4 + C$",
      "$8x^4 + C$",
      "$\\frac{8x^4}{3} + C$",
      "$x^4 + C$",
    ],
    correct: 0,
    explanation: "$8\\cdot\\frac{x^4}{4}=2x^4$.",
  },
  {
    question: "Вычислите интеграл $\\int (x^3 + 4x) dx$",
    options: [
      "$\\frac{x^4}{4} + 2x^2 + C$",
      "$x^4 + 4x^2 + C$",
      "$\\frac{x^4}{2} + 2x^2 + C$",
      "$3x^2 + 4 + C$",
    ],
    correct: 0,
    explanation: "Почленно: $\\frac{x^4}{4}+2x^2$.",
  },
  {
    question: "Вычислите интеграл $\\int 10 dx$",
    options: [
      "$10x + C$",
      "$x^{10} + C$",
      "$x + C$",
      "$\\frac{10x^2}{2} + C$",
    ],
    correct: 0,
    explanation: "$\\int 10\\,dx=10x$.",
  },
  {
    question: "Вычислите интеграл $\\int \\frac{1}{x^2} dx$",
    options: [
      "$-\\frac{1}{x} + C$",
      "$\\ln|x| + C$",
      "$\\frac{1}{x} + C$",
      "$-\\frac{1}{2x^2} + C$",
    ],
    correct: 0,
    explanation: "$\\int x^{-2}dx=\\frac{x^{-1}}{-1}=-\\frac{1}{x}$.",
  },
  {
    question: "Вычислите интеграл $\\int (2x^2 - 3x + 1) dx$",
    options: [
      "$\\frac{2x^3}{3} - \\frac{3x^2}{2} + x + C$",
      "$2x^3 - 3x^2 + x + C$",
      "$x^3 - x^2 + x + C$",
      "$\\frac{x^3}{3} - \\frac{x^2}{2} + x + C$",
    ],
    correct: 0,
    explanation: "Почленно: $\\frac{2x^3}{3}-\\frac{3x^2}{2}+x$.",
  },
  // ── Базовые степенные интегралы (правило степени) ──
  {
    question: "Вычислите интеграл $\\int x^4 dx$",
    options: [
      "$\\frac{x^5}{5} + C$",
      "$4x^3 + C$",
      "$\\frac{x^5}{4} + C$",
      "$x^5 + C$",
    ],
    correct: 0,
    explanation: "Степенное правило: $\\frac{x^5}{5}$.",
  },
  {
    question: "Вычислите интеграл $\\int 5x^3 dx$",
    options: [
      "$15x^2 + C$",
      "$\\frac{5x^4}{3} + C$",
      "$\\frac{5x^4}{4} + C$",
      "$5x^4 + C$",
    ],
    correct: 2,
    explanation: "$5\\cdot\\frac{x^4}{4}=\\frac{5x^4}{4}$.",
  },
  {
    question: "Вычислите интеграл $\\int (x^2 + 2x + 1) dx$",
    options: [
      "$x^3 + x^2 + x + C$",
      "$2x + 2 + C$",
      "$\\frac{x^3}{3} + x^2 + x + C$",
      "$\\frac{x^3}{3} + x^2 + C$",
    ],
    correct: 2,
    explanation: "Почленно: $\\frac{x^3}{3}+x^2+x$.",
  },
  {
    question: "Вычислите интеграл $\\int \\frac{1}{x^3} dx$",
    options: [
      "$\\frac{1}{x^2} + C$",
      "$-\\frac{1}{2x^2} + C$",
      "$\\ln|x^3| + C$",
      "$-\\frac{3}{x^4} + C$",
    ],
    correct: 1,
    explanation: "$\\int x^{-3}dx=\\frac{x^{-2}}{-2}=-\\frac{1}{2x^2}$.",
  },
  {
    question: "Вычислите интеграл $\\int \\sqrt{x} \\, dx$",
    options: [
      "$\\frac{1}{2\\sqrt{x}} + C$",
      "$\\frac{3}{2}x^{3/2} + C$",
      "$2x\\sqrt{x} + C$",
      "$\\frac{2}{3}x^{3/2} + C$",
    ],
    correct: 3,
    explanation: "$\\sqrt{x}=x^{1/2}$: $\\frac{x^{3/2}}{3/2}=\\frac{2}{3}x^{3/2}$.",
  },
  {
    question: "Вычислите интеграл $\\int (3x^2 - 4x + 5) dx$",
    options: [
      "$6x - 4 + C$",
      "$x^3 - 2x^2 + 5x + C$",
      "$3x^3 - 4x^2 + 5x + C$",
      "$x^3 - 4x^2 + 5x + C$",
    ],
    correct: 1,
    explanation: "Почленно: $x^3-2x^2+5x$.",
  },
  {
    question: "Вычислите интеграл $\\int x^{-1/2} dx$",
    options: [
      "$-\\frac{1}{2}x^{-3/2} + C$",
      "$\\frac{1}{2}\\sqrt{x} + C$",
      "$2\\sqrt{x} + C$",
      "$-2x^{-3/2} + C$",
    ],
    correct: 2,
    explanation: "$\\frac{x^{1/2}}{1/2}=2\\sqrt{x}$.",
  },
  {
    question: "Вычислите интеграл $\\int (x^5 + x) dx$",
    options: [
      "$\\frac{x^6}{6} + \\frac{x^2}{2} + C$",
      "$x^6 + x^2 + C$",
      "$5x^4 + 1 + C$",
      "$\\frac{x^6}{5} + x^2 + C$",
    ],
    correct: 0,
    explanation: "Почленно: $\\frac{x^6}{6}+\\frac{x^2}{2}$.",
  },
  {
    question: "Вычислите интеграл $\\int \\frac{2}{x} dx$",
    options: [
      "$-\\frac{2}{x^2} + C$",
      "$\\frac{2}{x^2} + C$",
      "$2x + C$",
      "$2\\ln|x| + C$",
    ],
    correct: 3,
    explanation: "$2\\int\\frac{dx}{x}=2\\ln|x|$.",
  },
  {
    question: "Вычислите интеграл $\\int x^{2/3} dx$",
    options: [
      "$\\frac{2}{3}x^{-1/3} + C$",
      "$\\frac{3}{5}x^{5/3} + C$",
      "$\\frac{2}{3}x^{5/3} + C$",
      "$x^{5/3} + C$",
    ],
    correct: 1,
    explanation: "$\\frac{x^{5/3}}{5/3}=\\frac{3}{5}x^{5/3}$.",
  },
  {
    question: "Вычислите интеграл $\\int (4x - 3) dx$",
    options: [
      "$4x^2 - 3x + C$",
      "$4 + C$",
      "$2x^2 - 3x + C$",
      "$4x^2 - 3 + C$",
    ],
    correct: 2,
    explanation: "Почленно: $2x^2-3x$.",
  },
  {
    question: "Вычислите интеграл $\\int (x^2 - 5) dx$",
    options: [
      "$\\frac{x^3}{3} - 5x + C$",
      "$x^2 - 5 + C$",
      "$2x + C$",
      "$\\frac{x^3}{3} - 5 + C$",
    ],
    correct: 0,
    explanation: "Почленно: $\\frac{x^3}{3}-5x$.",
  },
  {
    question: "Вычислите интеграл $\\int (2x^3 + 3x^2 - x) dx$",
    options: [
      "$6x^2 + 6x - 1 + C$",
      "$\\frac{x^4}{2} + x^3 - \\frac{x^2}{2} + C$",
      "$2x^4 + 3x^3 - x^2 + C$",
      "$\\frac{x^4}{2} + x^3 + \\frac{x^2}{2} + C$",
    ],
    correct: 1,
    explanation: "Почленно: $\\frac{x^4}{2}+x^3-\\frac{x^2}{2}$.",
  },
  {
    question: "Вычислите интеграл $\\int \\frac{1}{x^4} dx$",
    options: [
      "$\\frac{1}{x^3} + C$",
      "$-\\frac{4}{x^5} + C$",
      "$\\ln|x^4| + C$",
      "$-\\frac{1}{3x^3} + C$",
    ],
    correct: 3,
    explanation: "$\\int x^{-4}dx=\\frac{x^{-3}}{-3}=-\\frac{1}{3x^3}$.",
  },
  {
    question: "Вычислите интеграл $\\int (7x^6 + 1) dx$",
    options: [
      "$42x^5 + C$",
      "$x^7 + x + C$",
      "$7x^7 + x + C$",
      "$x^6 + x + C$",
    ],
    correct: 1,
    explanation: "Почленно: $x^7+x$.",
  },
];
// ── Интегралы (Средний уровень) ──────────────────────────
export const mediumIntegralsQuestions = [
  {
    question: "Вычислите \\(\\int x \\cdot \\sqrt{x + 1}  dx\\)",
    options: [
      "\\(\\frac{2}{3}x(x+1)^{3/2} + C\\)",
      "\\(\\frac{2}{5}(x+1)^{5/2} - \\frac{2}{3}(x+1)^{3/2} + C\\)",
      "\\(\\sqrt{x+1} + C\\)",
      "\\(\\frac{1}{2}(x+1)^{2} + C\\)",
    ],
    correct: 1, explanation: "Подстановка $u=x+1$: $x=u-1$, интеграл $=\\int(u-1)\\sqrt u\\,du=\\frac25u^{5/2}-\\frac23u^{3/2}$." },
  {
    question: "Вычислите \\(\\int \\frac{x}{x^2 + 4x + 5}  dx\\)",
    options: [
      "\\(\\ln|x^2 + 4x + 5| + C\\)",
      "\\(\\arctan(x+2) + C\\)",
      "\\(\\frac{1}{x^2 + 4x + 5} + C\\)",
      "\\(\\frac{1}{2}\\ln|x^2 + 4x + 5| - 2\\arctan(x+2) + C\\)",
    ],
    correct: 3, explanation: "Выделяем производную знаменателя и дополняем до квадрата: $\\frac12\\ln|x^2+4x+5|-2\\arctan(x+2)$." },
  {
    question: "Вычислите \\(\\int \\frac{1}{x^2 + 2x}  dx\\)",
    options: [
      "\\(\\ln|x^2 + 2x| + C\\)",
      "\\(\\frac{1}{2}\\ln|\\frac{x}{x+2}| + C\\)",
      "\\(\\frac{1}{x} - \\frac{1}{x+2} + C\\)",
      "\\(\\arctan(x+1) + C\\)",
    ],
    correct: 1, explanation: "$\\frac1{x(x+2)}=\\frac12\\left(\\frac1x-\\frac1{x+2}\\right)$, интегрируем: $\\frac12\\ln\\left|\\frac{x}{x+2}\\right|$." },
  {
    question: "Вычислите \\(\\int \\frac{3x + 2}{(x-1)(x+3)}  dx\\)",
    options: [
      "\\(\\ln|(x-1)(x+3)| + C\\)",
      "\\(\\frac{1}{x-1} + \\frac{1}{x+3} + C\\)",
      "\\(\\arctan(x-1) + \\arctan(x+3) + C\\)",
      "\\(\\frac{5}{4}\\ln|x-1| + \\frac{7}{4}\\ln|x+3| + C\\)",
    ],
    correct: 3, explanation: "Разложение на простые дроби: $\\frac{3x+2}{(x-1)(x+3)}=\\frac{5/4}{x-1}+\\frac{7/4}{x+3}$." },
  {
    question: "Вычислите \\(\\int \\frac{x^2}{x^2 - 1}  dx\\)",
    options: [
      "\\(x + \\frac{1}{2}\\ln|\\frac{x-1}{x+1}| + C\\)",
      "\\(x - \\ln|x^2 - 1| + C\\)",
      "\\(\\frac{1}{2}\\ln|\\frac{x-1}{x+1}| + C\\)",
      "\\(x + \\arctan(x) + C\\)",
    ],
    correct: 0, explanation: "$\\frac{x^2}{x^2-1}=1+\\frac{1}{x^2-1}$; второе слагаемое даёт $\\frac12\\ln\\left|\\frac{x-1}{x+1}\\right|$." },
  {
    question: "Вычислите \\(\\int \\frac{1}{x^2(x+1)}  dx\\)",
    options: [
      "\\(\\frac{1}{x} + \\ln|x+1| + C\\)",
      "\\(\\frac{1}{x^2} + \\frac{1}{x+1} + C\\)",
      "\\(\\ln|\\frac{x+1}{x}| + C\\)",
      "\\(-\\frac{1}{x} + \\ln\\left|\\frac{x+1}{x}\\right| + C\\)",
    ],
    correct: 3, explanation: "Разложение $\\frac1{x^2(x+1)}=-\\frac1{x^2}+\\frac1x-\\frac1{x+1}$ на простые дроби." },
  {
    question: "Вычислите \\(\\int \\frac{x^3}{x^2 + 1}  dx\\)",
    options: [
      "\\(\\frac{1}{2}x^2 - \\frac{1}{2}\\ln|x^2 + 1| + C\\)",
      "\\(x^2 - \\ln|x^2 + 1| + C\\)",
      "\\(\\frac{1}{2}x^2 + \\ln|x^2 + 1| + C\\)",
      "\\(x - \\arctan(x) + C\\)",
    ],
    correct: 0, explanation: "$\\frac{x^3}{x^2+1}=x-\\frac{x}{x^2+1}$; интегрируем: $\\frac12x^2-\\frac12\\ln(x^2+1)$." },
  {
    question: "Вычислите \\(\\int \\frac{1}{x(x^2 + 1)}  dx\\)",
    options: [
      "\\(\\frac{1}{x} - \\arctan(x) + C\\)",
      "\\(\\ln|x| - \\frac{1}{2}\\ln|x^2 + 1| + C\\)",
      "\\(\\ln|\\frac{x}{\\sqrt{x^2 + 1}}| + C\\)",
      "\\(\\frac{1}{2}\\ln|\\frac{x^2}{x^2 + 1}| + C\\)",
    ],
    correct: 1, explanation: "$\\frac1{x(x^2+1)}=\\frac1x-\\frac{x}{x^2+1}$; интегрируем: $\\ln|x|-\\frac12\\ln(x^2+1)$." },
  {
    question: "Вычислите \\(\\int \\frac{2x + 3}{x^2 + 4x + 13}  dx\\)",
    options: [
      "\\(\\ln|x^2 + 4x + 13| - \\frac{1}{3}\\arctan(\\frac{x+2}{3}) + C\\)",
      "\\(\\ln|x^2 + 4x + 13| + C\\)",
      "\\(\\arctan(\\frac{x+2}{3}) + C\\)",
      "\\(\\frac{1}{x^2 + 4x + 13} + C\\)",
    ],
    correct: 0, explanation: "Выделяем производную знаменателя $(2x+4)$ и остаток; после дополнения квадрата — логарифм и арктангенс." },
  {
    question: "Вычислите \\(\\int \\frac{x}{(x+1)^3}  dx\\)",
    options: [
      "\\(\\frac{1}{(x+1)^2} + C\\)",
      "\\(\\ln|(x+1)^3| + C\\)",
      "\\(-\\frac{1}{x+1} + \\frac{1}{2(x+1)^2} + C\\)",
      "\\(-\\frac{1}{2(x+1)^2} + C\\)",
    ],
    correct: 2, explanation: "Подстановка $u=x+1$: $\\int\\frac{u-1}{u^3}du=-\\frac1u+\\frac1{2u^2}$." },
  {
    question: "Вычислите \\(\\int \\frac{1}{\\sqrt{x}(1 + x)}  dx\\)",
    options: [
      "\\(2\\arctan(\\sqrt{x}) + C\\)",
      "\\(\\arctan(\\sqrt{x}) + C\\)",
      "\\(\\frac{1}{2}\\ln|1 + x| + C\\)",
      "\\(\\frac{2}{\\sqrt{x}} + C\\)",
    ],
    correct: 0, explanation: "Подстановка $t=\\sqrt x$: $\\int\\frac{2\\,dt}{1+t^2}=2\\arctan(\\sqrt x)$." },
  {
    question: "Вычислите \\(\\int \\frac{e^x}{1 + e^{2x}}  dx\\)",
    options: [
      "\\(\\ln|1 + e^{2x}| + C\\)",
      "\\(\\arctan(e^x) + C\\)",
      "\\(\\frac{1}{2}\\arctan(e^x) + C\\)",
      "\\(\\frac{e^x}{1 + e^{2x}} + C\\)",
    ],
    correct: 1, explanation: "Подстановка $t=e^x$: $\\int\\frac{dt}{1+t^2}=\\arctan(e^x)$." },
  {
    question: "Вычислите \\(\\int \\frac{\\sin(x)}{1 + \\cos^2(x)}  dx\\)",
    options: [
      "\\(\\arctan(\\cos(x)) + C\\)",
      "\\(\\ln|1 + \\cos^2(x)| + C\\)",
      "\\(-\\frac{1}{2}\\ln|1 + \\cos^2(x)| + C\\)",
      "\\(-\\arctan(\\cos(x)) + C\\)",
    ],
    correct: 3, explanation: "Подстановка $t=\\cos x$: $\\int\\frac{-dt}{1+t^2}=-\\arctan(\\cos x)$." },
  {
    question: "Вычислите \\(\\int \\frac{\\cos(x)}{\\sqrt{4 - \\sin^2(x)}}  dx\\)",
    options: [
      "\\(\\frac{1}{2}\\arcsin(\\sin(x)) + C\\)",
      "\\(\\sqrt{4 - \\sin^2(x)} + C\\)",
      "\\(\\arcsin(\\frac{\\sin(x)}{2}) + C\\)",
      "\\(\\arccos(\\frac{\\sin(x)}{2}) + C\\)",
    ],
    correct: 2, explanation: "Подстановка $t=\\sin x$: $\\int\\frac{dt}{\\sqrt{4-t^2}}=\\arcsin(t/2)$." },
  {
    question: "Вычислите \\(\\int x\\cdot\\sqrt[3]{x + 2}  dx\\)",
    options: [
      "\\(\\frac{3}{4}x(x+2)^{4/3} + C\\)",
      "\\(\\sqrt[3]{(x+2)^2} + C\\)",
      "\\(\\frac{3}{7}(x+2)^{7/3} - \\frac{3}{2}(x+2)^{4/3} + C\\)",
      "\\(\\frac{1}{2}(x+2)^{2} + C\\)",
    ],
    correct: 2, explanation: "Подстановка $u=x+2$: $\\int(u-2)u^{1/3}du=\\frac37u^{7/3}-\\frac32u^{4/3}$." },
  {
    question: "Вычислите \\(\\int \\frac{\\ln^2(x)}{x}  dx\\)",
    options: [
      "\\(\\ln^3(x) + C\\)",
      "\\(\\frac{2\\ln(x)}{x} + C\\)",
      "\\(\\frac{1}{3}\\ln^3(x) + C\\)",
      "\\(\\frac{1}{x}\\ln^2(x) + C\\)",
    ],
    correct: 2, explanation: "Подстановка $t=\\ln x$: $\\int t^2\\,dt=\\frac13t^3$." },
  {
    question: "Вычислите \\(\\int \\frac{1}{x\\sqrt{1 - \\ln^2(x)}}  dx\\)",
    options: [
      "\\(\\arccos(\\ln(x)) + C\\)",
      "\\(\\ln|\\sqrt{1 - \\ln^2(x)}| + C\\)",
      "\\(\\arcsin(\\ln(x)) + C\\)",
      "\\(\\frac{1}{\\sqrt{1 - \\ln^2(x)}} + C\\)",
    ],
    correct: 2, explanation: "Подстановка $t=\\ln x$: $\\int\\frac{dt}{\\sqrt{1-t^2}}=\\arcsin(\\ln x)$." },
  {
    question: "Вычислите \\(\\int \\frac{x}{\\sqrt{4 - x^4}}  dx\\)",
    options: [
      "\\(\\arcsin(\\frac{x^2}{2}) + C\\)",
      "\\(\\sqrt{4 - x^4} + C\\)",
      "\\(\\frac{1}{4}\\arcsin(x^2) + C\\)",
      "\\(\\frac{1}{2}\\arcsin(\\frac{x^2}{2}) + C\\)",
    ],
    correct: 3, explanation: "Подстановка $u=x^2$: $\\int\\frac{du/2}{\\sqrt{4-u^2}}=\\frac12\\arcsin(u/2)$." },
  {
    question: "Вычислите \\(\\int \\frac{e^{2x}}{\\sqrt{1 - e^{4x}}}  dx\\)",
    options: [
      "\\(\\arcsin(e^{2x}) + C\\)",
      "\\(\\frac{1}{\\sqrt{1 - e^{4x}}} + C\\)",
      "\\(\\frac{1}{2}\\arcsin(e^{2x}) + C\\)",
      "\\(\\ln|e^{2x} + \\sqrt{1 - e^{4x}}| + C\\)",
    ],
    correct: 2, explanation: "Подстановка $u=e^{2x}$: $\\int\\frac{du/2}{\\sqrt{1-u^2}}=\\frac12\\arcsin(e^{2x})$." },
  {
    question: "Вычислите \\(\\int \\frac{\\sin(2x)}{\\sqrt{1 - \\cos^2(x)}}  dx\\)",
    options: [
      "\\(2\\sin(x) + C\\)",
      "\\(\\frac{1}{2}\\sin^2(x) + C\\)",
      "\\(\\ln|\\sin(x)| + C\\)",
      "\\(-2\\cos(x) + C\\)",
    ],
    correct: 0, explanation: "$\\sqrt{1-\\cos^2x}=|\\sin x|$; при $\\sin x>0$: $\\int\\frac{2\\sin x\\cos x}{\\sin x}dx=2\\int\\cos x\\,dx=2\\sin x$." },
  {
    question: "Вычислите \\(\\int \\frac{1}{x^2\\sqrt{x^2 - 9}}  dx\\)",
    options: [
      "\\(\\frac{1}{9}\\operatorname{arcsec}(\\frac{x}{3}) + C\\)",
      "\\(\\frac{\\sqrt{x^2 - 9}}{9x} + C\\)",
      "\\(\\frac{\\sqrt{x^2 - 9}}{x} + C\\)",
      "\\(\\frac{1}{x}\\sqrt{x^2 - 9} + C\\)",
    ],
    correct: 1, explanation: "Тригонометрическая подстановка $x=3\\sec\\theta$ даёт $\\frac{\\sqrt{x^2-9}}{9x}$." },
  {
    question: "Вычислите \\(\\int \\frac{\\sqrt{x}}{1 + x}  dx\\)",
    options: [
      "\\(\\sqrt{x} - \\arctan(\\sqrt{x}) + C\\)",
      "\\(2\\sqrt{x} - 2\\arctan(\\sqrt{x}) + C\\)",
      "\\(\\ln|1 + x| + C\\)",
      "\\(\\frac{2}{3}x^{3/2} + C\\)",
    ],
    correct: 1, explanation: "Подстановка $t=\\sqrt x$: $\\int\\frac{2t^2}{1+t^2}dt=2\\int\\left(1-\\frac1{1+t^2}\\right)dt=2t-2\\arctan t$." },
  {
    question: "Вычислите \\(\\int \\frac{1}{x^2 + 6x + 10}  dx\\)",
    options: [
      "\\(\\frac{1}{3}\\arctan(\\frac{x+3}{3}) + C\\)",
      "\\(\\ln|x^2 + 6x + 10| + C\\)",
      "\\(\\frac{1}{(x+3)^2 + 1} + C\\)",
      "\\(\\arctan(x + 3) + C\\)",
    ],
    correct: 3, explanation: "Дополняем квадрат: $x^2+6x+10=(x+3)^2+1$, значит $\\arctan(x+3)$." },
  {
    question: "Вычислите \\(\\int \\frac{2x - 1}{x^2 - 6x + 13}  dx\\)",
    options: [
      "\\(\\ln|x^2 - 6x + 13| + C\\)",
      "\\(\\arctan(\\frac{x-3}{2}) + C\\)",
      "\\(\\frac{1}{x^2 - 6x + 13} + C\\)",
      "\\(\\ln|x^2 - 6x + 13| + \\frac{5}{2}\\arctan\\left(\\frac{x-3}{2}\\right) + C\\)",
    ],
    correct: 3, explanation: "Выделяем производную знаменателя $(2x-6)$ и остаток $5$; после дополнения квадрата — логарифм плюс арктангенс." },
  {
    question: "Вычислите \\(\\int x^3\\cdot\\sqrt{x^2 + 1}  dx\\)",
    options: [
      "\\(\\frac{1}{5}(x^2 + 1)^{5/2} - \\frac{1}{3}(x^2 + 1)^{3/2} + C\\)",
      "\\(\\frac{1}{2}x^2(x^2 + 1)^{3/2} + C\\)",
      "\\(\\frac{1}{4}(x^2 + 1)^{2} + C\\)",
      "\\(\\frac{2}{3}x(x^2 + 1)^{3/2} + C\\)",
    ],
    correct: 0, explanation: "Подстановка $u=x^2+1$: $x^2=u-1$, $\\int(u-1)\\sqrt u\\cdot\\frac{du}2=\\frac15u^{5/2}-\\frac13u^{3/2}$." },
  {
    question: "Вычислите \\(\\int \\frac{\\cos^3(x)}{\\sin^2(x)}  dx\\)",
    options: [
      "\\(-\\frac{1}{\\sin(x)} - \\sin(x) + C\\)",
      "\\(\\frac{1}{\\sin(x)} + \\sin(x) + C\\)",
      "\\(-\\cos(x) + \\frac{1}{3}\\cos^3(x) + C\\)",
      "\\(\\ln|\\sin(x)| + C\\)",
    ],
    correct: 0, explanation: "$\\cos^3x=\\cos x(1-\\sin^2x)$; подстановка $t=\\sin x$ даёт после деления $-\\frac1t-t$." },
  {
    question: "Вычислите \\(\\int \\frac{1}{x\\ln(x)\\sqrt{\\ln^2(x) - 1}}  dx\\)",
    options: [
      "\\(\\operatorname{arcsec}(|\\ln(x)|) + C\\)",
      "\\(\\ln|\\ln(x) + \\sqrt{\\ln^2(x) - 1}| + C\\)",
      "\\(\\frac{1}{\\sqrt{\\ln^2(x) - 1}} + C\\)",
      "\\(\\arccos(\\frac{1}{|\\ln(x)|}) + C\\)",
    ],
    correct: 0, explanation: "Табличная форма: $\\int\\frac{dx}{x\\ln x\\sqrt{\\ln^2x-1}}=\\operatorname{arcsec}|\\ln x|$ (подстановка $t=\\ln x$)." },
  {
    question: "Вычислите \\(\\int \\frac{x^2}{(x+1)^5}  dx\\)",
    options: [
      "\\(-\\frac{1}{2(x+1)^2} + \\frac{2}{3(x+1)^3} - \\frac{1}{4(x+1)^4} + C\\)",
      "\\(\\frac{1}{(x+1)^3} + C\\)",
      "\\(\\frac{x^3}{3(x+1)^5} + C\\)",
      "\\(-\\frac{1}{3(x+1)^3} + C\\)",
    ],
    correct: 0, explanation: "Подстановка $u=x+1$: $\\int\\frac{(u-1)^2}{u^5}du=\\int(u^{-3}-2u^{-4}+u^{-5})du$." },
  {
    question: "Вычислите \\(\\int \\frac{1}{e^x + e^{-x}}  dx\\)",
    options: [
      "\\(\\frac{1}{2}\\arctan(e^x) + C\\)",
      "\\(\\arctan(e^x) + C\\)",
      "\\(\\ln|e^x + e^{-x}| + C\\)",
      "\\(\\frac{e^x}{e^{2x} + 1} + C\\)",
    ],
    correct: 1, explanation: "$\\frac1{e^x+e^{-x}}=\\frac{e^x}{e^{2x}+1}$; подстановка $t=e^x$ даёт $\\arctan(e^x)$." },
  {
    question: "Вычислите \\(\\int \\frac{\\sin(2x)}{1 + \\cos^4(x)}  dx\\)",
    options: [
      "\\(\\arctan(\\cos^2(x)) + C\\)",
      "\\(\\ln|1 + \\cos^4(x)| + C\\)",
      "\\(\\frac{1}{2}\\sin^2(x) + C\\)",
      "\\(-\\arctan(\\cos^2(x)) + C\\)",
    ],
    correct: 3, explanation: "Подстановка $t=\\cos^2x$ даёт $-\\arctan(\\cos^2x)$." },
  {
    question: "Вычислите \\(\\int x\\cdot(2x + 1)^{7}  dx\\)",
    options: [
      "\\(\\frac{1}{36}(2x+1)^9 - \\frac{1}{32}(2x+1)^8 + C\\)",
      "\\(\\frac{x}{8}(2x+1)^8 + C\\)",
      "\\(\\frac{1}{16}(2x+1)^8 + C\\)",
      "\\(\\frac{1}{2}x^2(2x+1)^7 + C\\)",
    ],
    correct: 0, explanation: "Подстановка $u=2x+1$, $x=(u-1)/2$: $\\int\\frac{u-1}2\\cdot u^7\\cdot\\frac{du}2=\\frac14\\int(u^8-u^7)du$." },
  {
    question: "Вычислите \\(\\int \\frac{\\sqrt{1 + \\sqrt{x}}}{\\sqrt{x}}  dx\\)",
    options: [
      "\\(2\\sqrt{1 + \\sqrt{x}} + C\\)",
      "\\(\\frac{2}{3}(1 + \\sqrt{x})^{3/2} + C\\)",
      "\\(\\frac{4}{3}(1 + \\sqrt{x})^{3/2} + C\\)",
      "\\(\\sqrt{x}\\sqrt{1 + \\sqrt{x}} + C\\)",
    ],
    correct: 2, explanation: "Подстановка $t=1+\\sqrt x$, $dx/\\sqrt x=2\\,dt$: $\\int2\\sqrt t\\,dt=\\frac43t^{3/2}$." },
  {
    question: "Вычислите \\(\\int \\frac{1}{x\\sqrt{4x^2 - 9}}  dx\\)",
    options: [
      "\\(\\frac{1}{2}\\operatorname{arcsec}(\\frac{2x}{3}) + C\\)",
      "\\(\\frac{1}{\\sqrt{4x^2 - 9}} + C\\)",
      "\\(\\ln|2x + \\sqrt{4x^2 - 9}| + C\\)",
      "\\(\\frac{1}{3}\\operatorname{arcsec}(\\frac{2|x|}{3}) + C\\)",
    ],
    correct: 3, explanation: "Тригонометрическая подстановка $2x=3\\sec\\theta$ даёт $\\frac13\\operatorname{arcsec}\\left(\\frac{2|x|}3\\right)$." },
  {
    question: "Вычислите \\(\\int \\frac{\\arctan(x)}{1 + x^2}  dx\\)",
    options: [
      "\\(\\frac{1}{2}\\arctan^2(x) + C\\)",
      "\\(\\arctan^2(x) + C\\)",
      "\\(\\frac{1}{1 + x^2}\\arctan(x) + C\\)",
      "\\(\\ln|1 + x^2| + C\\)",
    ],
    correct: 0, explanation: "Подстановка $t=\\arctan x$: $\\int t\\,dt=\\frac12t^2$." },
  {
    question: "Вычислите \\(\\int \\frac{x + 2}{\\sqrt{x^2 + 4x + 5}}  dx\\)",
    options: [
      "\\(\\sqrt{x^2 + 4x + 5} + C\\)",
      "\\(\\frac{1}{2}\\sqrt{x^2 + 4x + 5} + C\\)",
      "\\(\\ln|x^2 + 4x + 5| + C\\)",
      "\\(\\arctan(x+2) + C\\)",
    ],
    correct: 0, explanation: "Числитель — половина производной подкоренного выражения: $\\int\\frac{(x^2+4x+5)'/2}{\\sqrt{\\ldots}}dx=\\sqrt{x^2+4x+5}$." },
  {
    question: "Вычислите \\(\\int \\frac{\\cos(x)}{\\sin^3(x) + \\sin(x)}  dx\\)",
    options: [
      "\\(\\frac{1}{\\sin(x)} + C\\)",
      "\\(\\ln|\\frac{|\\sin(x)|}{\\sqrt{1 + \\sin^2(x)}}| + C\\)",
      "\\(-\\frac{1}{2\\sin^2(x)} + C\\)",
      "\\(\\arctan(\\sin(x)) + C\\)",
    ],
    correct: 1, explanation: "Подстановка $t=\\sin x$: $\\int\\frac{dt}{t(t^2+1)}=\\ln|t|-\\frac12\\ln(t^2+1)=\\ln\\dfrac{|\\sin x|}{\\sqrt{1+\\sin^2x}}$." },
  {
    question: "Вычислите \\(\\int \\frac{1}{(x+1)\\sqrt{x^2 + 2x}}  dx\\)",
    options: [
      "\\(\\operatorname{arcsec}(|x+1|) + C\\)",
      "\\(\\frac{1}{\\sqrt{x^2 + 2x}} + C\\)",
      "\\(\\ln|x + 1 + \\sqrt{x^2 + 2x}| + C\\)",
      "\\(\\arctan(\\sqrt{x^2 + 2x}) + C\\)",
    ],
    correct: 0, explanation: "Дополняем квадрат $x^2+2x=(x+1)^2-1$ — тригонометрическая подстановка даёт $\\operatorname{arcsec}|x+1|$." },
  {
    question: "Вычислите \\(\\int x^2\\cdot\\ln(x)  dx\\)",
    options: [
      "\\(\\frac{x^3}{3}\\ln(x) - \\frac{x^3}{9} + C\\)",
      "\\(\\frac{x^3}{3}\\ln(x) + C\\)",
      "\\(x\\ln(x) - x + C\\)",
      "\\(\\frac{1}{x} + C\\)",
    ],
    correct: 0, explanation: "По частям: $u=\\ln x,\\,dv=x^2dx$: $\\frac{x^3}3\\ln x-\\int\\frac{x^2}3dx=\\frac{x^3}3\\ln x-\\frac{x^3}9$." },
  {
    question: "Вычислите \\(\\int \\frac{1}{x^2 - 6x + 8}  dx\\)",
    options: [
      "\\(\\frac{1}{2}\\ln|\\frac{x-4}{x-2}| + C\\)",
      "\\(\\ln|x^2 - 6x + 8| + C\\)",
      "\\(\\frac{1}{x-4} - \\frac{1}{x-2} + C\\)",
      "\\(\\arctan(x-3) + C\\)",
    ],
    correct: 0, explanation: "$\\frac1{(x-4)(x-2)}=\\frac12\\left(\\frac1{x-4}-\\frac1{x-2}\\right)$, интегрируем: $\\frac12\\ln\\left|\\frac{x-4}{x-2}\\right|$." },
  {
    question: "Вычислите \\(\\int \\frac{e^{3x}}{e^x + 1}  dx\\)",
    options: [
      "\\(e^{2x} - e^x + \\ln|e^x + 1| + C\\)",
      "\\(\\frac{1}{3}e^{3x}\\ln|e^x + 1| + C\\)",
      "\\(\\frac{e^{2x}}{2} + \\ln|e^x + 1| + C\\)",
      "\\(\\frac{1}{2}e^{2x} - e^x + \\ln|e^x + 1| + C\\)",
    ],
    correct: 3, explanation: "$\\frac{e^{3x}}{e^x+1}$: подстановка $t=e^x$, $\\frac{t^2}{t+1}=t-1+\\frac1{t+1}$, даёт $\\frac12e^{2x}-e^x+\\ln(e^x+1)$." },
  {
    question: "Вычислите \\(\\int \\frac{\\sqrt{1 + x^2}}{x^2}  dx\\)",
    options: [
      "\\(-\\frac{1}{x}\\sqrt{1 + x^2} + C\\)",
      "\\(-\\frac{\\sqrt{1 + x^2}}{x} + \\ln|x + \\sqrt{1 + x^2}| + C\\)",
      "\\(\\frac{\\sqrt{1 + x^2}}{x} + \\arcsinh(x) + C\\)",
      "\\(\\ln|x + \\sqrt{1 + x^2}| + C\\)",
    ],
    correct: 1, explanation: "По частям: $-\\frac{\\sqrt{1+x^2}}x+\\ln|x+\\sqrt{1+x^2}|$ (проверяется дифференцированием)." },
  {
    question: "Вычислите \\(\\int \\frac{1}{x\\sqrt{x^6 - 4}}  dx\\)",
    options: [
      "\\(\\frac{1}{2}\\operatorname{arcsec}(\\frac{x^3}{2}) + C\\)",
      "\\(\\frac{1}{\\sqrt{x^6 - 4}} + C\\)",
      "\\(\\frac{1}{6}\\operatorname{arcsec}(\\frac{x^3}{2}) + C\\)",
      "\\(\\ln|x^3 + \\sqrt{x^6 - 4}| + C\\)",
    ],
    correct: 2, explanation: "Тригонометрическая подстановка $x^3=2\\sec\\theta$ даёт $\\frac16\\operatorname{arcsec}(x^3/2)$." },
  {
    question: "Вычислите \\(\\int \\frac{\\sin(x) + \\cos(x)}{\\sin(x) - \\cos(x)}  dx\\)",
    options: [
      "\\(\\ln|\\sin(x) + \\cos(x)| + C\\)",
      "\\(\\ln|\\sin(x) - \\cos(x)| + C\\)",
      "\\(-\\ln|\\sin(x) + \\cos(x)| + C\\)",
      "\\(-\\ln|\\sin(x) - \\cos(x)| + C\\)",
    ],
    correct: 1, explanation: "Числитель — производная знаменателя: $\\int\\frac{(\\sin x-\\cos x)'}{\\sin x-\\cos x}dx=\\ln|\\sin x-\\cos x|$." },
  {
    question: "Вычислите \\(\\int x\\cdot\\arctan(x)  dx\\)",
    options: [
      "\\(x\\arctan(x) - \\frac{1}{2}\\ln|1 + x^2| + C\\)",
      "\\(\\frac{1}{2}x^2\\arctan(x) + C\\)",
      "\\(\\frac{1}{2}x^2\\arctan(x) - \\frac{1}{2}x + \\frac{1}{2}\\arctan(x) + C\\)",
      "\\(\\arctan(x) + \\frac{1}{1 + x^2} + C\\)",
    ],
    correct: 2, explanation: "По частям: $u=\\arctan x,\\,dv=x\\,dx$: $\\frac12x^2\\arctan x-\\frac12\\int\\frac{x^2}{1+x^2}dx=\\frac12x^2\\arctan x-\\frac12x+\\frac12\\arctan x$." },
  {
    question: "Вычислите \\(\\int \\frac{1}{(x^2 + 1)^2}  dx\\)",
    options: [
      "\\(\\frac{1}{2}\\arctan(x) + \\frac{x}{2(x^2 + 1)} + C\\)",
      "\\(\\arctan(x) + \\frac{x}{x^2 + 1} + C\\)",
      "\\(\\frac{x}{(x^2 + 1)^2} + C\\)",
      "\\(\\frac{1}{2}\\ln|1 + x^2| + C\\)",
    ],
    correct: 0, explanation: "Рекуррентная формула для $\\int\\frac{dx}{(x^2+1)^2}$: $\\frac12\\arctan x+\\frac{x}{2(x^2+1)}$." },
  {
    question: "Вычислите \\(\\int \\frac{x^2 + 1}{x^4 + 1}  dx\\)",
    options: [
      "\\(\\arctan(x^2) + C\\)",
      "\\(\\frac{1}{2}\\ln|\\frac{x^2 + 1}{x^2 - 1}| + C\\)",
      "\\(\\frac{1}{\\sqrt{2}}\\arctan(\\frac{x^2 - 1}{x\\sqrt{2}}) + C\\)",
      "\\(\\frac{x}{x^4 + 1} + C\\)",
    ],
    correct: 2, explanation: "Разложение $x^4+1=(x^2+\\sqrt2x+1)(x^2-\\sqrt2x+1)$; после деления на $x^2$ получаем $\\frac1{\\sqrt2}\\arctan\\dfrac{x^2-1}{x\\sqrt2}$." },
  {
    question: "Вычислите \\(\\int \\frac{\\sqrt{x}}{1 + x^{3/2}}  dx\\)",
    options: [
      "\\(\\ln|1 + x^{3/2}| + C\\)",
      "\\(\\frac{2}{3}\\ln|1 + x^{3/2}| + C\\)",
      "\\(\\frac{1}{1 + x^{3/2}} + C\\)",
      "\\(\\frac{2}{\\sqrt{x}} + C\\)",
    ],
    correct: 1, explanation: "Подстановка $t=1+x^{3/2}$, $dt=\\frac32\\sqrt x\\,dx$: $\\int\\frac{2/3\\,dt}{t}=\\frac23\\ln(1+x^{3/2})$." },
  {
    question: "Вычислите \\(\\int \\frac{\\cos(2x)}{\\sin^2(x)\\cos^2(x)}  dx\\)",
    options: [
      "\\(\\tan(x) - \\cot(x) + C\\)",
      "\\(\\ln|\\sin(x)\\cos(x)| + C\\)",
      "\\(\\frac{1}{\\sin(x)\\cos(x)} + C\\)",
      "\\(-(\\tan(x) + \\cot(x)) + C\\)",
    ],
    correct: 3, explanation: "$\\cos(2x)=\\cos^2x-\\sin^2x$, деление даёт $\\csc^2x-\\sec^2x$; интегрируем: $-\\cot x-\\tan x$." },
  {
    question: "Вычислите \\(\\int \\frac{x^5}{x^2 + 1}  dx\\)",
    options: [
      "\\(\\frac{1}{4}x^4 - \\frac{1}{2}x^2 + \\frac{1}{2}\\ln|x^2 + 1| + C\\)",
      "\\(\\frac{1}{4}x^4 + \\frac{1}{2}\\ln|x^2 + 1| + C\\)",
      "\\(x^3 - x + \\arctan(x) + C\\)",
      "\\(\\frac{1}{6}x^6\\ln|x^2 + 1| + C\\)",
    ],
    correct: 0, explanation: "$\\frac{x^5}{x^2+1}=x^3-x+\\frac{x}{x^2+1}$; интегрируем: $\\frac14x^4-\\frac12x^2+\\frac12\\ln(x^2+1)$." },
  {
    question: "Вычислите \\(\\int \\frac{1}{x\\sqrt{1 - x^3}}  dx\\)",
    options: [
      "\\(\\arcsin(x^{3/2}) + C\\)",
      "\\(\\frac{1}{\\sqrt{1 - x^3}} + C\\)",
      "\\(-\\frac{2}{3}\\ln|\\frac{1 + \\sqrt{1 - x^3}}{x^{3/2}}| + C\\)",
      "\\(-\\frac{2}{3}\\sqrt{1 - x^3} + C\\)",
    ],
    correct: 2, explanation: "Подстановка $t=\\sqrt{1-x^3}$ приводит к $-\\frac23\\ln\\left|\\dfrac{1+\\sqrt{1-x^3}}{x^{3/2}}\\right|$ (проверено дифференцированием)." },
  {
    question: "Вычислите \\(\\int \\frac{\\sin(2x)}{\\sqrt{1 - \\sin^4(x)}}  dx\\)",
    options: [
      "\\(\\arccos(\\sin^2(x)) + C\\)",
      "\\(\\arcsin(\\sin^2(x)) + C\\)",
      "\\(\\ln|1 - \\sin^4(x)| + C\\)",
      "\\(\\frac{1}{2}\\sin^2(x) + C\\)",
    ],
    correct: 1, explanation: "Подстановка $t=\\sin^2x$, $dt=\\sin(2x)dx$: $\\int\\frac{dt}{\\sqrt{1-t^2}}=\\arcsin(\\sin^2x)$." },
  {
    question: "Вычислите \\(\\int \\frac{x^2}{\\sqrt{9 - x^6}}  dx\\)",
    options: [
      "\\(\\arcsin(\\frac{x^3}{3}) + C\\)",
      "\\(\\frac{1}{\\sqrt{9 - x^6}} + C\\)",
      "\\(\\frac{x^3}{3}\\arcsin(\\frac{x^3}{3}) + C\\)",
      "\\(\\frac{1}{3}\\arcsin(\\frac{x^3}{3}) + C\\)",
    ],
    correct: 3, explanation: "Подстановка $u=x^3$: $\\int\\frac{du/3}{\\sqrt{9-u^2}}=\\frac13\\arcsin(u/3)$." },
  {
    question: "Вычислите \\(\\int \\sin^2(x)  dx\\)",
    options: [
      "\\(\\frac{x}{2} - \\frac{\\sin(2x)}{4} + C\\)",
      "\\(\\frac{x}{2} + \\frac{\\sin(2x)}{4} + C\\)",
      "\\(-\\frac{\\cos(2x)}{2} + C\\)",
      "\\(\\sin(x)\\cos(x) + C\\)",
    ],
    correct: 0, explanation: "Формула понижения степени: $\\sin^2x=\\frac{1-\\cos2x}2$; интегрируем: $\\frac x2-\\frac{\\sin2x}4$." },
  {
    question: "Вычислите \\(\\int \\tan(x)  dx\\)",
    options: [
      "\\(\\ln|\\sin(x)| + C\\)",
      "\\(-\\ln|\\cos(x)| + C\\)",
      "\\(\\sec^2(x) + C\\)",
      "\\(-\\cot(x) + C\\)",
    ],
    correct: 1, explanation: "$\\tan x=\\dfrac{\\sin x}{\\cos x}$; подстановка $t=\\cos x$ даёт $-\\ln|\\cos x|$." },
  {
    question: "Вычислите \\(\\int x e^{x^2}  dx\\)",
    options: [
      "\\(e^{x^2} + C\\)",
      "\\(2x e^{x^2} + C\\)",
      "\\(\\frac{1}{2}e^{x^2} + C\\)",
      "\\(\\frac{e^{x^2}}{x} + C\\)",
    ],
    correct: 2, explanation: "Подстановка $t=x^2$: $\\int\\frac12e^t\\,dt=\\frac12e^{x^2}$." },
  {
    question: "Вычислите \\(\\int \\sin(x)\\cos^2(x)  dx\\)",
    options: [
      "\\(\\frac{\\cos^3(x)}{3} + C\\)",
      "\\(-\\frac{\\cos^3(x)}{3} + C\\)",
      "\\(\\frac{\\sin^3(x)}{3} + C\\)",
      "\\(-\\frac{\\sin(2x)}{4} + C\\)",
    ],
    correct: 1, explanation: "Подстановка $t=\\cos x$, $dt=-\\sin x\\,dx$: $-\\int t^2\\,dt=-\\frac13t^3$." },
  {
    question: "Вычислите \\(\\int \\frac{1}{x^2 - 4}  dx\\)",
    options: [
      "\\(\\frac{1}{4}\\ln\\left|\\frac{x-2}{x+2}\\right| + C\\)",
      "\\(\\frac{1}{2}\\arctan\\left(\\frac{x}{2}\\right) + C\\)",
      "\\(\\frac{1}{2}\\ln|x^2 - 4| + C\\)",
      "\\(\\arctan\\left(\\frac{x}{2}\\right) + C\\)",
    ],
    correct: 0, explanation: "$\\frac1{(x-2)(x+2)}=\\frac14\\left(\\frac1{x-2}-\\frac1{x+2}\\right)$, интегрируем: $\\frac14\\ln\\left|\\frac{x-2}{x+2}\\right|$." },
  {
    question: "Вычислите \\(\\int \\frac{\\ln(x)}{x}  dx\\)",
    options: [
      "\\(\\frac{1}{x^2} + C\\)",
      "\\(\\ln^2(x) + C\\)",
      "\\(\\frac{\\ln^2(x)}{2} + C\\)",
      "\\(\\frac{1}{x}\\ln(x) + C\\)",
    ],
    correct: 2, explanation: "Подстановка $t=\\ln x$: $\\int t\\,dt=\\frac{t^2}2$." },
  {
    question: "Вычислите \\(\\int x e^{2x}  dx\\)",
    options: [
      "\\(\\frac{1}{2}x e^{2x} + C\\)",
      "\\(\\frac{1}{4}e^{2x}(2x - 1) + C\\)",
      "\\(x e^{2x} - e^{2x} + C\\)",
      "\\(\\frac{1}{2}e^{2x}(x + 1) + C\\)",
    ],
    correct: 1, explanation: "По частям: $u=x,\\,dv=e^{2x}dx$: $\\frac12xe^{2x}-\\frac14e^{2x}=\\frac14e^{2x}(2x-1)$." },
  {
    question: "Вычислите \\(\\int \\frac{\\cos(x)}{2 + \\sin(x)}  dx\\)",
    options: [
      "\\(-\\ln|2 + \\sin(x)| + C\\)",
      "\\(\\arctan(\\sin(x)) + C\\)",
      "\\(\\ln|2 + \\sin(x)| + C\\)",
      "\\(\\frac{\\sin(x)}{2 + \\sin(x)} + C\\)",
    ],
    correct: 2, explanation: "Числитель — производная знаменателя: $\\int\\frac{(2+\\sin x)'}{2+\\sin x}dx=\\ln(2+\\sin x)$." },
  {
    question: "Вычислите \\(\\int \\frac{x}{x + 1}  dx\\)",
    options: [
      "\\(x - \\ln|x + 1| + C\\)",
      "\\(\\ln|x + 1| + C\\)",
      "\\(\\frac{x^2}{2(x+1)} + C\\)",
      "\\(x + \\ln|x + 1| + C\\)",
    ],
    correct: 0, explanation: "$\\frac{x}{x+1}=1-\\frac1{x+1}$; интегрируем: $x-\\ln|x+1|$." },
  {
    question: "Вычислите \\(\\int e^x \\sin(x)  dx\\)",
    options: [
      "\\(\\frac{e^x}{2}(\\sin(x) + \\cos(x)) + C\\)",
      "\\(e^x \\sin(x) + C\\)",
      "\\(\\frac{e^x}{2}(\\sin(x) - \\cos(x)) + C\\)",
      "\\(e^x(\\sin(x) - \\cos(x)) + C\\)",
    ],
    correct: 2, explanation: "Двукратное интегрирование по частям (табличный результат): $\\frac{e^x}2(\\sin x-\\cos x)$." },
  {
    question: "Вычислите \\(\\int \\frac{x^2}{x^3 + 1}  dx\\)",
    options: [
      "\\(3\\ln|x^3 + 1| + C\\)",
      "\\(\\frac{x^3}{3}\\ln|x^3 + 1| + C\\)",
      "\\(\\ln|x^3 + 1| + C\\)",
      "\\(\\frac{1}{3}\\ln|x^3 + 1| + C\\)",
    ],
    correct: 3, explanation: "Подстановка $t=x^3+1$, $dt=3x^2dx$: $\\int\\frac{dt/3}{t}=\\frac13\\ln|x^3+1|$." },
  {
    question: "Вычислите \\(\\int \\frac{1}{x^2 + 9}  dx\\)",
    options: [
      "\\(\\arctan(x) + C\\)",
      "\\(\\frac{1}{3}\\arctan\\left(\\frac{x}{3}\\right) + C\\)",
      "\\(\\arctan\\left(\\frac{x}{3}\\right) + C\\)",
      "\\(\\frac{1}{9}\\arctan\\left(\\frac{x}{3}\\right) + C\\)",
    ],
    correct: 1, explanation: "Табличная форма $\\int\\frac{dx}{x^2+a^2}=\\frac1a\\arctan\\frac xa$ при $a=3$." },
  {
    question: "Вычислите \\(\\int \\frac{2x}{x^2 + 1}  dx\\)",
    options: [
      "\\(\\frac{1}{x^2 + 1} + C\\)",
      "\\(2\\ln|x^2 + 1| + C\\)",
      "\\(\\ln|x^2 + 1| + C\\)",
      "\\(\\arctan(x) + C\\)",
    ],
    correct: 2, explanation: "Числитель — производная знаменателя: $\\int\\frac{(x^2+1)'}{x^2+1}dx=\\ln(x^2+1)$." },
  {
    question: "Вычислите \\(\\int x\\cdot e^{x^2}  dx\\)",
    options: [
      "\\(e^{x^2} + C\\)",
      "\\(2x e^{x^2} + C\\)",
      "\\(\\frac{1}{2}e^{x^2} + C\\)",
      "\\(\\frac{1}{x}e^{x^2} + C\\)",
    ],
    correct: 2, explanation: "Подстановка $t=x^2$: $\\int\\frac12e^t\\,dt=\\frac12e^{x^2}$." },
  {
    question: "Вычислите \\(\\int \\frac{1}{1 + x^2}  dx\\)",
    options: [
      "\\(\\ln|1 + x^2| + C\\)",
      "\\(\\frac{1}{2}\\ln|1 + x^2| + C\\)",
      "\\(\\arcsin(x) + C\\)",
      "\\(\\arctan(x) + C\\)",
    ],
    correct: 3, explanation: "Табличный интеграл: $\\int\\frac{dx}{1+x^2}=\\arctan x$." },
  {
    question: "Вычислите \\(\\int \\sin(2x)  dx\\)",
    options: [
      "\\(-\\frac{1}{2}\\cos(2x) + C\\)",
      "\\(-\\cos(2x) + C\\)",
      "\\(\\frac{1}{2}\\cos(2x) + C\\)",
      "\\(2\\cos(2x) + C\\)",
    ],
    correct: 0, explanation: "$\\int\\sin(2x)\\,dx=-\\frac12\\cos(2x)$ (внутренняя производная $2$ учтена делением)." },
  {
    question: "Вычислите \\(\\int \\frac{x}{\\sqrt{1 - x^2}}  dx\\)",
    options: [
      "\\(-\\sqrt{1 - x^2} + C\\)",
      "\\(\\sqrt{1 - x^2} + C\\)",
      "\\(\\frac{1}{2\\sqrt{1 - x^2}} + C\\)",
      "\\(\\arcsin(x) + C\\)",
    ],
    correct: 0, explanation: "Подстановка $t=1-x^2$, $dt=-2x\\,dx$: $-\\frac12\\int t^{-1/2}dt=-\\sqrt{1-x^2}$." },
  {
    question: "Вычислите \\(\\int \\ln(x)  dx\\)",
    options: [
      "\\(\\frac{1}{x} + C\\)",
      "\\(x\\ln(x) - x + C\\)",
      "\\(\\ln(x) + C\\)",
      "\\(x\\ln(x) + C\\)",
    ],
    correct: 1, explanation: "По частям: $u=\\ln x,\\,dv=dx$: $x\\ln x-\\int dx=x\\ln x-x$." },
  {
    question: "Вычислите \\(\\int \\cos(3x)  dx\\)",
    options: [
      "\\(\\frac{1}{3}\\sin(3x) + C\\)",
      "\\(3\\sin(3x) + C\\)",
      "\\(\\sin(3x) + C\\)",
      "\\(-\\frac{1}{3}\\sin(3x) + C\\)",
    ],
    correct: 0, explanation: "$\\int\\cos(3x)dx=\\frac13\\sin(3x)$ (внутренняя производная $3$ учтена делением)." },
  {
    question: "Вычислите \\(\\int \\frac{e^x}{e^x + 1}  dx\\)",
    options: [
      "\\(\\ln|e^x + 1| + C\\)",
      "\\(\\frac{1}{e^x + 1} + C\\)",
      "\\(e^x\\ln|e^x + 1| + C\\)",
      "\\(\\arctan(e^x) + C\\)",
    ],
    correct: 0, explanation: "Подстановка $t=e^x+1$: $\\int\\frac{dt}t=\\ln(e^x+1)$." },
  {
    question: "Вычислите \\(\\int x\\cdot\\cos(x^2)  dx\\)",
    options: [
      "\\(\\sin(x^2) + C\\)",
      "\\(\\frac{1}{2}\\sin(x^2) + C\\)",
      "\\(2x\\sin(x^2) + C\\)",
      "\\(\\cos(x^2) + C\\)",
    ],
    correct: 1, explanation: "Подстановка $t=x^2$: $\\int\\frac12\\cos t\\,dt=\\frac12\\sin(x^2)$." },
  {
    question: "Вычислите \\(\\int \\frac{1}{x\\ln(x)}  dx\\)",
    options: [
      "\\(\\ln|\\ln(x)| + C\\)",
      "\\(\\frac{1}{\\ln(x)} + C\\)",
      "\\(\\ln(x) + C\\)",
      "\\(\\frac{1}{x\\ln(x)} + C\\)",
    ],
    correct: 0, explanation: "Подстановка $t=\\ln x$: $\\int\\frac{dt}t=\\ln|\\ln x|$." },
  {
    question: "Вычислите \\(\\int \\cot(x)  dx\\)",
    options: [
      "\\(\\ln|\\sin(x)| + C\\)",
      "\\(-\\ln|\\sin(x)| + C\\)",
      "\\(\\ln|\\cos(x)| + C\\)",
      "\\(-\\csc^2(x) + C\\)",
    ],
    correct: 0, explanation: "$\\cot x=\\dfrac{\\cos x}{\\sin x}$; подстановка $t=\\sin x$ даёт $\\ln|\\sin x|$." },
  {
    question: "Вычислите \\(\\int \\frac{2x + 1}{x^2 + x}  dx\\)",
    options: [
      "\\(\\frac{1}{x^2 + x} + C\\)",
      "\\(2\\ln|x^2 + x| + C\\)",
      "\\(\\ln|x^2 + x| + C\\)",
      "\\(\\arctan(x^2 + x) + C\\)",
    ],
    correct: 2, explanation: "Числитель — производная знаменателя: $\\int\\frac{(x^2+x)'}{x^2+x}dx=\\ln|x^2+x|$." },
  {
    question: "Вычислите \\(\\int e^{3x}  dx\\)",
    options: [
      "\\(\\frac{1}{3}e^{3x} + C\\)",
      "\\(3e^{3x} + C\\)",
      "\\(e^{3x} + C\\)",
      "\\(\\frac{1}{x}e^{3x} + C\\)",
    ],
    correct: 0, explanation: "$\\int e^{3x}dx=\\frac13e^{3x}$ (внутренняя производная $3$ учтена делением)." },
  {
    question: "Вычислите \\(\\int \\frac{1}{\\sqrt{1 - x^2}}  dx\\)",
    options: [
      "\\(\\arcsin(x) + C\\)",
      "\\(\\arccos(x) + C\\)",
      "\\(\\ln|\\sqrt{1 - x^2}| + C\\)",
      "\\(\\arctan(x) + C\\)",
    ],
    correct: 0, explanation: "Табличный интеграл: $\\int\\frac{dx}{\\sqrt{1-x^2}}=\\arcsin x$." },
  {
    question: "Вычислите \\(\\int x\\cdot\\sqrt{x^2 + 1}  dx\\)",
    options: [
      "\\(\\frac{1}{3}(x^2 + 1)^{3/2} + C\\)",
      "\\(\\sqrt{x^2 + 1} + C\\)",
      "\\(\\frac{1}{2}\\sqrt{x^2 + 1} + C\\)",
      "\\(\\frac{2}{3}(x^2 + 1)^{3/2} + C\\)",
    ],
    correct: 0, explanation: "Подстановка $t=x^2+1$: $\\int\\frac12\\sqrt t\\,dt=\\frac13t^{3/2}$." },
  {
    question: "Вычислите \\(\\int \\frac{\\cos(x)}{\\sin(x)}  dx\\)",
    options: [
      "\\(-\\ln|\\sin(x)| + C\\)",
      "\\(\\ln|\\sin(x)| + C\\)",
      "\\(\\tan(x) + C\\)",
      "\\(\\cot(x) + C\\)",
    ],
    correct: 1, explanation: "$\\dfrac{\\cos x}{\\sin x}$; подстановка $t=\\sin x$ даёт $\\ln|\\sin x|$." },
  {
    question: "Вычислите \\(\\int (x^2 + 2)^2  dx\\)",
    options: [
      "\\(\\frac{x^5}{5} + \\frac{4x^3}{3} + 4x + C\\)",
      "\\(2x(x^2 + 2) + C\\)",
      "\\(x^4 + 4x^2 + 4 + C\\)",
      "\\(\\frac{x^3}{3} + 2x^2 + 4x + C\\)",
    ],
    correct: 0, explanation: "Раскрываем скобки: $(x^2+2)^2=x^4+4x^2+4$; интегрируем почленно: $\\frac{x^5}5+\\frac{4x^3}3+4x$." },
  {
    question: "Вычислите \\(\\int \\frac{1}{x^2 + 4}  dx\\)",
    options: [
      "\\(\\arctan(\\frac{x}{2}) + C\\)",
      "\\(\\frac{1}{4}\\arctan(x) + C\\)",
      "\\(\\ln|x^2 + 4| + C\\)",
      "\\(\\frac{1}{2}\\arctan(\\frac{x}{2}) + C\\)",
    ],
    correct: 3, explanation: "Табличная форма $\\int\\frac{dx}{x^2+a^2}=\\frac1a\\arctan\\frac xa$ при $a=2$." },
  {
    question: "Вычислите \\(\\int x\\cdot\\ln(x)  dx\\)",
    options: [
      "\\(\\frac{x^2}{2}\\ln(x) - \\frac{x^2}{4} + C\\)",
      "\\(x\\ln(x) - x + C\\)",
      "\\(\\frac{1}{x} + C\\)",
      "\\(\\frac{x^2}{2}\\ln(x) + C\\)",
    ],
    correct: 0, explanation: "По частям: $u=\\ln x,\\,dv=x\\,dx$: $\\frac{x^2}2\\ln x-\\int\\frac x2dx=\\frac{x^2}2\\ln x-\\frac{x^2}4$." },
  {
    question: "Вычислите \\(\\int \\sin(x)\\cdot\\cos(x)  dx\\)",
    options: [
      "\\(\\frac{1}{2}\\sin^2(x) + C\\)",
      "\\(\\sin^2(x) + C\\)",
      "\\(\\cos^2(x) + C\\)",
      "\\(-\\frac{1}{2}\\cos^2(x) + C\\)",
    ],
    correct: 0, explanation: "Подстановка $t=\\sin x$: $\\int t\\,dt=\\frac{t^2}2$." },
  {
    question: "Вычислите \\(\\int \\frac{e^{\\sqrt{x}}}{\\sqrt{x}}  dx\\)",
    options: [
      "\\(e^{\\sqrt{x}} + C\\)",
      "\\(\\frac{1}{2}e^{\\sqrt{x}} + C\\)",
      "\\(\\sqrt{x}e^{\\sqrt{x}} + C\\)",
      "\\(2e^{\\sqrt{x}} + C\\)",
    ],
    correct: 3, explanation: "Подстановка $t=\\sqrt x$, $dx=2t\\,dt$: $\\int\\frac{e^t}{t}\\cdot2t\\,dt=2\\int e^t\\,dt=2e^{\\sqrt x}$." },
  {
    question: "Вычислите \\(\\int \\frac{1}{x\\sqrt{\\ln(x)}}  dx\\)",
    options: [
      "\\(2\\sqrt{\\ln(x)} + C\\)",
      "\\(\\sqrt{\\ln(x)} + C\\)",
      "\\(\\frac{1}{2\\sqrt{\\ln(x)}} + C\\)",
      "\\(\\ln|\\sqrt{\\ln(x)}| + C\\)",
    ],
    correct: 0, explanation: "Подстановка $t=\\ln x$: $\\int t^{-1/2}dt=2\\sqrt t=2\\sqrt{\\ln x}$." },
  {
    question: "Вычислите \\(\\int \\frac{x}{x^2 + 9}  dx\\)",
    options: [
      "\\(\\frac{1}{2}\\ln|x^2 + 9| + C\\)",
      "\\(\\ln|x^2 + 9| + C\\)",
      "\\(\\frac{1}{x^2 + 9} + C\\)",
      "\\(\\arctan(\\frac{x}{3}) + C\\)",
    ],
    correct: 0, explanation: "Числитель пропорционален производной знаменателя: $\\int\\frac{x}{x^2+9}dx=\\frac12\\ln(x^2+9)$." },
  {
    question: "Вычислите \\(\\int \\sec(x)\\cdot\\tan(x)  dx\\)",
    options: [
      "\\(\\tan(x) + C\\)",
      "\\(\\sec^2(x) + C\\)",
      "\\(\\sec(x) + C\\)",
      "\\(\\ln|\\sec(x) + \\tan(x)| + C\\)",
    ],
    correct: 2, explanation: "Табличный интеграл: $\\int\\sec x\\tan x\\,dx=\\sec x$." },
  {
    question: "Вычислите \\(\\int \\frac{1}{\\sqrt{4 - x^2}}  dx\\)",
    options: [
      "\\(\\arcsin(\\frac{x}{2}) + C\\)",
      "\\(\\frac{1}{2}\\arcsin(x) + C\\)",
      "\\(\\ln|\\sqrt{4 - x^2}| + C\\)",
      "\\(\\arccos(\\frac{x}{2}) + C\\)",
    ],
    correct: 0, explanation: "Табличная форма $\\int\\frac{dx}{\\sqrt{a^2-x^2}}=\\arcsin\\frac xa$ при $a=2$." },
  {
    question: "Вычислите \\(\\int x\\cdot e^{-x}  dx\\)",
    options: [
      "\\(-e^{-x}(x + 1) + C\\)",
      "\\(e^{-x}(x - 1) + C\\)",
      "\\(-e^{-x} + C\\)",
      "\\(e^{-x} + C\\)",
    ],
    correct: 0, explanation: "По частям: $u=x,\\,dv=e^{-x}dx$: $-xe^{-x}-e^{-x}=-e^{-x}(x+1)$." },
  {
    question: "Вычислите \\(\\int \\frac{\\sin(x)}{\\cos^2(x)}  dx\\)",
    options: [
      "\\(\\frac{1}{\\cos(x)} + C\\)",
      "\\(-\\frac{1}{\\cos(x)} + C\\)",
      "\\(\\tan(x) + C\\)",
      "\\(\\ln|\\cos(x)| + C\\)",
    ],
    correct: 0, explanation: "Подстановка $t=\\cos x$: $-\\int t^{-2}dt=\\frac1t=\\frac1{\\cos x}$." },
  {
    question: "Вычислите \\(\\int (2x + 3)^4  dx\\)",
    options: [
      "\\(\\frac{1}{10}(2x + 3)^5 + C\\)",
      "\\(8(2x + 3)^3 + C\\)",
      "\\((2x + 3)^5 + C\\)",
      "\\(\\frac{1}{5}(2x + 3)^5 + C\\)",
    ],
    correct: 0, explanation: "Подстановка $u=2x+3$: $\\int u^4\\cdot\\frac{du}2=\\frac1{10}u^5$." },
  {
    question: "Вычислите \\(\\int \\frac{e^x - e^{-x}}{e^x + e^{-x}}  dx\\)",
    options: [
      "\\(\\ln|e^x + e^{-x}| + C\\)",
      "\\(\\arctan(e^x) + C\\)",
      "\\(\\frac{1}{e^x + e^{-x}} + C\\)",
      "\\(e^x - e^{-x} + C\\)",
    ],
    correct: 0, explanation: "Числитель — производная знаменателя: $\\int\\frac{(e^x+e^{-x})'}{e^x+e^{-x}}dx=\\ln(e^x+e^{-x})$." },
  {
    question: "Вычислите \\(\\int x\\cdot\\sin(x)  dx\\)",
    options: [
      "\\(\\sin(x) - x\\cdot\\cos(x) + C\\)",
      "\\(x\\cdot\\cos(x) - \\sin(x) + C\\)",
      "\\(-\\cos(x) + C\\)",
      "\\(-x\\cdot\\cos(x) + \\sin(x) + C\\)",
    ],
    correct: 3, explanation: "По частям: $u=x,\\,dv=\\sin x\\,dx$: $-x\\cos x+\\int\\cos x\\,dx=-x\\cos x+\\sin x$." },
  {
    question: "Вычислите \\(\\int \\frac{1}{x^2 - 1}  dx\\)",
    options: [
      "\\(\\frac{1}{2}\\ln|\\frac{x-1}{x+1}| + C\\)",
      "\\(\\ln|x^2 - 1| + C\\)",
      "\\(\\frac{1}{x-1} - \\frac{1}{x+1} + C\\)",
      "\\(\\arctan(x) + C\\)",
    ],
    correct: 0, explanation: "$\\frac1{(x-1)(x+1)}=\\frac12\\left(\\frac1{x-1}-\\frac1{x+1}\\right)$, интегрируем: $\\frac12\\ln\\left|\\frac{x-1}{x+1}\\right|$." },
  {
    question: "Вычислите \\(\\int \\sqrt{1 + x}  dx\\)",
    options: [
      "\\(\\frac{2}{3}(1 + x)^{3/2} + C\\)",
      "\\(\\sqrt{1 + x} + C\\)",
      "\\(\\frac{1}{2\\sqrt{1 + x}} + C\\)",
      "\\(\\frac{3}{2}(1 + x)^{3/2} + C\\)",
    ],
    correct: 0, explanation: "Подстановка $t=1+x$: $\\int\\sqrt t\\,dt=\\frac23t^{3/2}$." },
  {
    question: "Вычислите \\(\\int \\frac{\\cos(x)}{1 + \\sin(x)}  dx\\)",
    options: [
      "\\(\\ln|1 + \\sin(x)| + C\\)",
      "\\(\\frac{1}{1 + \\sin(x)} + C\\)",
      "\\(-\\ln|1 + \\sin(x)| + C\\)",
      "\\(\\arctan(\\sin(x)) + C\\)",
    ],
    correct: 0, explanation: "Числитель — производная знаменателя: $\\int\\frac{(1+\\sin x)'}{1+\\sin x}dx=\\ln(1+\\sin x)$." },
  {
    question: "Вычислите \\(\\int x^2\\cdot e^{x^3}  dx\\)",
    options: [
      "\\(e^{x^3} + C\\)",
      "\\(3x e^{x^3} + C\\)",
      "\\(\\frac{1}{3}e^{x^3} + C\\)",
      "\\(\\frac{1}{x}e^{x^3} + C\\)",
    ],
    correct: 2, explanation: "Подстановка $t=x^3$, $dt=3x^2dx$: $\\int\\frac13e^t\\,dt=\\frac13e^{x^3}$." },
  {
    question: "Вычислите \\(\\int \\frac{1}{x\\ln^2(x)}  dx\\)",
    options: [
      "\\(-\\frac{1}{\\ln(x)} + C\\)",
      "\\(\\frac{1}{\\ln(x)} + C\\)",
      "\\(\\ln|\\ln(x)| + C\\)",
      "\\(-\\frac{1}{2\\ln^2(x)} + C\\)",
    ],
    correct: 0, explanation: "Подстановка $t=\\ln x$: $\\int t^{-2}dt=-\\frac1t=-\\frac1{\\ln x}$." },
  {
    question: "Вычислите \\(\\int \\tan^2(x)  dx\\)",
    options: [
      "\\(\\tan(x) - x + C\\)",
      "\\(\\tan(x) + x + C\\)",
      "\\(\\sec^2(x) + C\\)",
      "\\(\\ln|\\cos(x)| + C\\)",
    ],
    correct: 0, explanation: "$\\tan^2x=\\sec^2x-1$; интегрируем: $\\tan x-x$." },
  {
    question: "Вычислите \\(\\int \\frac{x + 1}{x^2 + 2x}  dx\\)",
    options: [
      "\\(\\ln|x^2 + 2x| + C\\)",
      "\\(\\frac{1}{2}\\ln|x^2 + 2x| + C\\)",
      "\\(\\frac{1}{x^2 + 2x} + C\\)",
      "\\(\\arctan(x^2 + 2x) + C\\)",
    ],
    correct: 1, explanation: "Числитель — половина производной знаменателя: $\\int\\frac{(x^2+2x)'/2}{x^2+2x}dx=\\frac12\\ln|x^2+2x|$." },
  {
    question: "Вычислите \\(\\int e^{2x}\\cdot\\sin(x)  dx\\)",
    options: [
      "\\(\\frac{e^{2x}}{5}(2\\sin(x) - \\cos(x)) + C\\)",
      "\\(e^{2x}\\sin(x) + C\\)",
      "\\(\\frac{e^{2x}}{2}\\sin(x) + C\\)",
      "\\(e^{2x}(\\sin(x) - \\cos(x)) + C\\)",
    ],
    correct: 0, explanation: "Двукратное интегрирование по частям (табличный результат для $e^{ax}\\sin bx$): $\\dfrac{e^{2x}}5(2\\sin x-\\cos x)$." },
  {
    question: "Вычислите \\(\\int \\frac{1}{\\sqrt{x}(1 + \\sqrt{x})}  dx\\)",
    options: [
      "\\(2\\ln|1 + \\sqrt{x}| + C\\)",
      "\\(\\ln|1 + \\sqrt{x}| + C\\)",
      "\\(\\frac{1}{1 + \\sqrt{x}} + C\\)",
      "\\(\\sqrt{x}\\ln|1 + \\sqrt{x}| + C\\)",
    ],
    correct: 0, explanation: "Подстановка $t=\\sqrt x$: $\\int\\frac{2\\,dt}{1+t}=2\\ln(1+\\sqrt x)$." },
  {
    question: "Вычислите интеграл \\(\\int x \\cdot e^{2x}  dx\\)",
    options: [
      "\\(x e^{2x} - \\frac{1}{2}e^{2x} + C\\)",
      "\\(\\frac{1}{2}x e^{2x} + \\frac{1}{4}e^{2x} + C\\)",
      "\\(\\frac{1}{2}x e^{2x} - \\frac{1}{4}e^{2x} + C\\)",
      "\\(x e^{2x} + e^{2x} + C\\)",
    ],
    correct: 2, explanation: "По частям: $u=x,\\,dv=e^{2x}dx$: $\\frac12xe^{2x}-\\frac14e^{2x}$." },
  {
    question: "Вычислите интеграл \\(\\int \\frac{x}{x^2 + 4x + 5}  dx\\)",
    options: [
      "\\(\\ln|x^2 + 4x + 5| + \\arctan(x+2) + C\\)",
      "\\(\\frac{1}{2}\\ln|x^2 + 4x + 5| + 2\\arctan(x+2) + C\\)",
      "\\(\\ln|x^2 + 4x + 5| - \\arctan(x+2) + C\\)",
      "\\(\\frac{1}{2}\\ln|x^2 + 4x + 5| - 2\\arctan(x+2) + C\\)",
    ],
    correct: 3, explanation: "Выделяем производную знаменателя и дополняем до квадрата: $\\frac12\\ln(x^2+4x+5)-2\\arctan(x+2)$." },
  {
    question: "Вычислите интеграл \\(\\int \\sin^3(x) \\cos^2(x)  dx\\)",
    options: [
      "\\(-\\frac{1}{3}\\cos^3(x) + \\frac{1}{5}\\cos^5(x) + C\\)",
      "\\(\\frac{1}{3}\\sin^3(x) - \\frac{1}{5}\\sin^5(x) + C\\)",
      "\\(-\\frac{1}{5}\\cos^5(x) + \\frac{1}{3}\\cos^3(x) + C\\)",
      "\\(\\frac{1}{5}\\sin^5(x) - \\frac{1}{3}\\sin^3(x) + C\\)",
    ],
    correct: 0, explanation: "$\\sin^3x=\\sin x(1-\\cos^2x)$; подстановка $t=\\cos x$ даёт $-\\frac13t^3+\\frac15t^5$." },
  {
    question: "Вычислите интеграл \\(\\int \\frac{2x + 3}{x^2 + 2x + 2}  dx\\)",
    options: [
      "\\(\\ln|x^2 + 2x + 2| + 2\\arctan(x+1) + C\\)",
      "\\(\\ln|x^2 + 2x + 2| + \\arctan(x+1) + C\\)",
      "\\(2\\ln|x^2 + 2x + 2| + \\arctan(x+1) + C\\)",
      "\\(\\ln|x^2 + 2x + 2| - \\arctan(x+1) + C\\)",
    ],
    correct: 1, explanation: "Выделяем производную знаменателя $(2x+2)$ и остаток $1$; после дополнения квадрата — логарифм плюс арктангенс." },
  {
    question: "Вычислите интеграл \\(\\int x \\cdot \\ln(2x)  dx\\)",
    options: [
      "\\(\\frac{1}{2}x^2 \\ln(2x) - \\frac{1}{4}x^2 + C\\)",
      "\\(\\frac{1}{2}x^2 \\ln(2x) + \\frac{1}{4}x^2 + C\\)",
      "\\(x^2 \\ln(2x) - \\frac{1}{2}x^2 + C\\)",
      "\\(x^2 \\ln(2x) + x^2 + C\\)",
    ],
    correct: 0, explanation: "По частям: $u=\\ln(2x),\\,dv=x\\,dx$: $\\frac12x^2\\ln(2x)-\\int\\frac x2dx=\\frac12x^2\\ln(2x)-\\frac14x^2$." },
  {
    question: "Вычислите интеграл \\(\\int \\frac{dx}{x^2 \\sqrt{4 - x^2}}\\)",
    options: [
      "\\(\\frac{\\sqrt{4 - x^2}}{4x} + C\\)",
      "\\(-\\frac{\\sqrt{4 - x^2}}{2x} + C\\)",
      "\\(\\frac{\\sqrt{4 - x^2}}{2x} + C\\)",
      "\\(-\\frac{\\sqrt{4 - x^2}}{4x} + C\\)",
    ],
    correct: 3, explanation: "Тригонометрическая подстановка $x=2\\sin\\theta$ даёт $-\\dfrac{\\sqrt{4-x^2}}{4x}$." },
  {
    question: "Вычислите интеграл \\(\\int e^x \\sin(2x)  dx\\)",
    options: [
      "\\(\\frac{e^x}{5}(\\sin(2x) - 2\\cos(2x)) + C\\)",
      "\\(\\frac{e^x}{2}(\\sin(2x) - \\cos(2x)) + C\\)",
      "\\(e^x(\\sin(2x) - 2\\cos(2x)) + C\\)",
      "\\(\\frac{e^x}{5}(2\\sin(2x) - \\cos(2x)) + C\\)",
    ],
    correct: 0, explanation: "Двукратное интегрирование по частям: $\\dfrac{e^x}5(\\sin2x-2\\cos2x)$." },
  {
    question: "Вычислите интеграл \\(\\int \\frac{x^2 + 1}{x^3 - x}  dx\\)",
    options: [
      "\\(\\ln|x| + \\ln|x-1| + \\ln|x+1| + C\\)",
      "\\(-\\ln|x| + \\ln|x-1| + \\ln|x+1| + C\\)",
      "\\(\\ln|x| - \\ln|x-1| - \\ln|x+1| + C\\)",
      "\\(\\frac{1}{2}\\ln|x| - \\ln|x-1| - \\ln|x+1| + C\\)",
    ],
    correct: 1, explanation: "Разложение на простые дроби: $\\frac{x^2+1}{x(x-1)(x+1)}=-\\frac1x+\\frac1{x-1}+\\frac1{x+1}$." },
  {
    question: "Вычислите интеграл \\(\\int \\frac{\\cos(x)}{\\sin^2(x) + 4\\sin(x) + 4}  dx\\)",
    options: [
      "\\(\\frac{1}{\\sin(x) + 2} + C\\)",
      "\\(-\\frac{1}{2(\\sin(x) + 2)^2} + C\\)",
      "\\(-\\frac{1}{\\sin(x) + 2} + C\\)",
      "\\(\\ln|\\sin(x) + 2| + C\\)",
    ],
    correct: 2, explanation: "$\\sin^2x+4\\sin x+4=(\\sin x+2)^2$; подстановка $t=\\sin x$ даёт $-\\dfrac1{\\sin x+2}$." },
  {
    question: "Вычислите интеграл \\(\\int \\sqrt{x} \\cdot \\ln(x)  dx\\)",
    options: [
      "\\(\\frac{2}{3}x^{3/2}\\ln(x) - \\frac{4}{9}x^{3/2} + C\\)",
      "\\(\\frac{2}{3}x^{3/2}\\ln(x) + \\frac{4}{9}x^{3/2} + C\\)",
      "\\(x^{3/2}\\ln(x) - \\frac{2}{3}x^{3/2} + C\\)",
      "\\(\\frac{1}{2}x^{3/2}\\ln(x) - \\frac{1}{3}x^{3/2} + C\\)",
    ],
    correct: 0, explanation: "По частям: $u=\\ln x,\\,dv=\\sqrt x\\,dx$: $\\frac23x^{3/2}\\ln x-\\int\\frac23x^{1/2}dx=\\frac23x^{3/2}\\ln x-\\frac49x^{3/2}$." },
  {
    question: "Вычислите интеграл \\(\\int \\frac{dx}{x^2 + 6x + 13}\\)",
    options: [
      "\\(\\arctan\\left(\\frac{x+3}{2}\\right) + C\\)",
      "\\(\\frac{1}{2}\\arctan\\left(\\frac{x+3}{4}\\right) + C\\)",
      "\\(\\arctan\\left(\\frac{x+3}{4}\\right) + C\\)",
      "\\(\\frac{1}{2}\\arctan\\left(\\frac{x+3}{2}\\right) + C\\)",
    ],
    correct: 3, explanation: "Дополняем квадрат: $x^2+6x+13=(x+3)^2+4$, даёт $\\frac12\\arctan\\dfrac{x+3}2$." },
  {
    question: "Вычислите интеграл \\(\\int \\frac{x^3}{\\sqrt{9 - x^2}}  dx\\)",
    options: [
      "\\(\\frac{1}{3}(9 - x^2)^{3/2} - 9\\sqrt{9 - x^2} + C\\)",
      "\\(-\\frac{1}{3}(9 - x^2)^{3/2} - 9\\sqrt{9 - x^2} + C\\)",
      "\\(-\\frac{1}{3}(9 - x^2)^{3/2} + 9\\sqrt{9 - x^2} + C\\)",
      "\\(\\frac{1}{3}(9 - x^2)^{3/2} + 9\\sqrt{9 - x^2} + C\\)",
    ],
    correct: 0, explanation: "Подстановка $t=9-x^2$: $\\int\\frac{(9-t)}{2\\sqrt t}dt$ приводит к $\\frac13(9-x^2)^{3/2}-9\\sqrt{9-x^2}$." },
  {
    question: "Вычислите интеграл \\(\\int \\frac{\\sin(2x)}{1 + \\cos^2(x)}  dx\\)",
    options: [
      "\\(-\\ln|1 + \\cos^2(x)| + C\\)",
      "\\(\\ln|1 + \\cos^2(x)| + C\\)",
      "\\(-2\\ln|1 + \\cos^2(x)| + C\\)",
      "\\(2\\ln|1 + \\cos^2(x)| + C\\)",
    ],
    correct: 0, explanation: "Подстановка $t=\\cos^2x$: $\\int\\frac{-dt}{1+t}=-\\ln(1+\\cos^2x)$." },
  {
    question: "Вычислите интеграл \\(\\int \\frac{dx}{x\\sqrt{x^2 - 9}}\\)",
    options: [
      "\\(\\frac{1}{3} \\arccos\\left(\\frac{3}{|x|}\\right) + C\\)",
      "\\(\\operatorname{arcsec}\\left(\\frac{|x|}{3}\\right) + C\\)",
      "\\(\\frac{1}{3} \\operatorname{arcsec}\\left(\\frac{|x|}{3}\\right) + C\\)",
      "\\(\\arccos\\left(\\frac{3}{|x|}\\right) + C\\)",
    ],
    correct: 2, explanation: "Тригонометрическая подстановка $x=3\\sec\\theta$ даёт $\\frac13\\operatorname{arcsec}\\dfrac{|x|}3$." },
  {
    question: "Вычислите интеграл \\(\\int x^2 \\cdot \\cos(x)  dx\\)",
    options: [
      "\\(x^2 \\sin(x) + 2x \\cos(x) - 2 \\sin(x) + C\\)",
      "\\(x^2 \\sin(x) - 2x \\cos(x) + 2 \\sin(x) + C\\)",
      "\\(x^2 \\sin(x) + 2x \\cos(x) + 2 \\sin(x) + C\\)",
      "\\(x^2 \\sin(x) - 2x \\cos(x) - 2 \\sin(x) + C\\)",
    ],
    correct: 0, explanation: "Двукратное интегрирование по частям: $x^2\\sin x+2x\\cos x-2\\sin x$." },
  {
    question: "Вычислите интеграл \\(\\int \\frac{x^2 + 2x + 3}{(x+1)^3}  dx\\)",
    options: [
      "\\(\\ln|x+1| - \\frac{1}{x+1} - \\frac{1}{(x+1)^2} + C\\)",
      "\\(\\ln|x+1| - \\frac{1}{(x+1)^2} + C\\)",
      "\\(\\ln|x+1| + \\frac{2}{x+1} + \\frac{2}{(x+1)^2} + C\\)",
      "\\(\\ln|x+1| + \\frac{1}{x+1} + \\frac{1}{(x+1)^2} + C\\)",
    ],
    correct: 1, explanation: "Подстановка $u=x+1$: числитель $=u^2+2$, значит $\\int\\left(\\frac1u+\\frac2{u^3}\\right)du=\\ln|u|-\\frac1{u^2}$." },
  {
    question: "Вычислите интеграл \\(\\int \\frac{dx}{\\sqrt{4x^2 + 12x + 10}}\\)",
    options: [
      "\\(\\frac{1}{2} \\ln|x + \\frac{3}{2} + \\sqrt{x^2 + 3x + \\frac{5}{2}}| + C\\)",
      "\\(\\frac{1}{2} \\ln|2x + 3 + \\sqrt{4x^2 + 12x + 10}| + C\\)",
      "\\(\\ln|2x + 3 + \\sqrt{4x^2 + 12x + 10}| + C\\)",
      "\\(\\ln|x + \\frac{3}{2} + \\sqrt{x^2 + 3x + \\frac{5}{2}}| + C\\)",
    ],
    correct: 1, explanation: "Дополняем квадрат под корнем: $4x^2+12x+10=(2x+3)^2+1$, даёт $\\frac12\\ln|2x+3+\\sqrt{4x^2+12x+10}|$." },
  {
    question: "Вычислите интеграл \\(\\int \\frac{e^{2x}}{e^x + 1}  dx\\)",
    options: [
      "\\(e^x - \\ln|e^x + 1| + C\\)",
      "\\(e^x + \\ln|e^x + 1| + C\\)",
      "\\(\\frac{1}{2}e^{2x} - \\ln|e^x + 1| + C\\)",
      "\\(\\frac{1}{2}e^{2x} + \\ln|e^x + 1| + C\\)",
    ],
    correct: 0, explanation: "Подстановка $t=e^x+1$: $\\int\\left(1-\\frac1t\\right)dt=e^x-\\ln(e^x+1)$." },
  {
    question: "Вычислите интеграл \\(\\int \\frac{\\arctan(x)}{1 + x^2}  dx\\)",
    options: [
      "\\(\\ln|1 + x^2| \\arctan(x) + C\\)",
      "\\(\\arctan(x))^2 + C\\)",
      "\\(\\frac{1}{2}\\ln|1 + x^2| \\arctan(x) + C\\)",
      "\\(\\frac{1}{2}(\\arctan(x))^2 + C\\)",
    ],
    correct: 3, explanation: "Подстановка $t=\\arctan x$: $\\int t\\,dt=\\frac12t^2$." },
  {
    question: "Вычислите интеграл \\(\\int \\sin(\\sqrt{x})  dx\\)",
    options: [
      "\\(-2\\sqrt{x}\\cos(\\sqrt{x}) + 2\\sin(\\sqrt{x}) + C\\)",
      "\\(2\\sqrt{x}\\cos(\\sqrt{x}) - 2\\sin(\\sqrt{x}) + C\\)",
      "\\(-\\sqrt{x}\\cos(\\sqrt{x}) + \\sin(\\sqrt{x}) + C\\)",
      "\\(\\sqrt{x}\\cos(\\sqrt{x}) - \\sin(\\sqrt{x}) + C\\)",
    ],
    correct: 0, explanation: "Подстановка $t=\\sqrt x$, $x=t^2$, $dx=2t\\,dt$: $\\int2t\\sin t\\,dt=2(-t\\cos t+\\sin t)$ (по частям)." },
];

// ── Интегралы (Сложный уровень) ──────────────────────────
export const hardIntegralsQuestions = [
  {
    question: "Вычислите \\(\\int x e^x  dx\\)",
    options: [
      "\\(e^x(x+1) + C\\)",
      "\\(xe^x + C\\)",
      "\\(\\frac{x^2 e^x}{2} + C\\)",
      "\\(e^x(x-1) + C\\)",
    ],
    correct: 3,
  },
  {
    question: "Вычислите \\(\\int x^2 \\ln(x)  dx\\)",
    options: [
      "\\(\\frac{x^3}{3}\\ln(x) - \\frac{x^3}{9} + C\\)",
      "\\(\\frac{x^3}{3}\\ln(x) + C\\)",
      "\\(\\frac{x^2}{2}\\ln(x) - \\frac{x^2}{4} + C\\)",
      "\\(x^3\\ln(x) - \\frac{x^3}{3} + C\\)",
    ],
    correct: 0,
  },
  {
    question: "Вычислите \\(\\int \\cos^2(x)  dx\\)",
    options: [
      "\\(\\frac{x}{2} + \\frac{\\sin(2x)}{4} + C\\)",
      "\\(\\frac{x}{2} - \\frac{\\sin(2x)}{4} + C\\)",
      "\\(-\\frac{\\sin^2(x)}{2} + C\\)",
      "\\(\\frac{\\cos(2x)}{2} + C\\)",
    ],
    correct: 0,
  },
  {
    question: "Вычислите \\(\\int \\frac{x^2}{\\sqrt{1 - x^2}}  dx\\)",
    options: [
      "\\(\\arcsin(x) + C\\)",
      "\\(x\\sqrt{1 - x^2} + C\\)",
      "\\(\\frac{1}{2}\\arcsin(x) - \\frac{x}{2}\\sqrt{1 - x^2} + C\\)",
      "\\(-\\sqrt{1 - x^2} + C\\)",
    ],
    correct: 2,
  },
  {
    question: "Вычислите \\(\\int e^x \\sin(x)  dx\\)",
    options: [
      "\\(\\frac{e^x}{2}(\\sin(x) - \\cos(x)) + C\\)",
      "\\(e^x\\sin(x) + C\\)",
      "\\(e^x(\\sin(x) + \\cos(x)) + C\\)",
      "\\(\\frac{e^x}{2}(\\sin(x) + \\cos(x)) + C\\)",
    ],
    correct: 0,
  },
  {
    question: "Вычислите \\(\\int \\frac{dx}{x^2\\sqrt{x^2 - 1}}\\)",
    options: [
      "\\(\\operatorname{arcsec}(x) + C\\)",
      "\\(\\frac{1}{\\sqrt{x^2 - 1}} + C\\)",
      "\\(\\frac{\\sqrt{x^2 - 1}}{x} + C\\)",
      "\\(\\ln|x + \\sqrt{x^2 - 1}| + C\\)",
    ],
    correct: 2,
  },
  {
    question: "Вычислите \\(\\int \\arctan(x)  dx\\)",
    options: [
      "\\(x\\arctan(x) - \\frac{1}{2}\\ln(1 + x^2) + C\\)",
      "\\(\\frac{\\arctan^2(x)}{2} + C\\)",
      "\\(\\frac{x}{1 + x^2} + C\\)",
      "\\(\\ln(1 + x^2) + C\\)",
    ],
    correct: 0,
  },
  {
    question: "Вычислите \\(\\int \\frac{dx}{\\sin(x)\\cos(x)}\\)",
    options: [
      "\\(\\ln|\\sin(x)\\cos(x)| + C\\)",
      "\\(\\frac{1}{2}\\ln|\\sin(2x)| + C\\)",
      "\\(\\tan(x) + C\\)",
      "\\(\\ln|\\tan(x)| + C\\)",
    ],
    correct: 3,
  },
  {
    question: "Вычислите \\(\\int x^2 \\ln(x)  dx\\)",
    options: [
      "\\(\\frac{x^3}{2}\\ln(x) + C\\)",
      "\\(x^2\\ln(x) - x^2 + C\\)",
      "\\(\\frac{x^3}{3}\\ln(x) - \\frac{x^3}{9} + C\\)",
      "\\(\\frac{x^3}{3}\\ln(x) + C\\)",
    ],
    correct: 2,
  },
  {
    question: "Вычислите \\(\\int \\frac{dx}{x^3\\sqrt{x^2 + 1}}\\)",
    options: [
      "\\(-\\frac{\\sqrt{x^2 + 1}}{2x^2} + \\frac{1}{2}\\ln\\left|\\frac{1 + \\sqrt{x^2 + 1}}{x}\\right| + C\\)",
      "\\(-\\frac{1}{x^2\\sqrt{x^2 + 1}} + C\\)",
      "\\(\\frac{\\sqrt{x^2 + 1}}{x} + C\\)",
      "\\(\\ln|x + \\sqrt{x^2 + 1}| + C\\)",
    ],
    correct: 0,
  },
  {
    question: "Вычислите \\(\\int \\sin(\\ln(x))  dx\\)",
    options: [
      "\\(\\frac{x}{2}(\\sin(\\ln(x)) - \\cos(\\ln(x))) + C\\)",
      "\\(x\\sin(\\ln(x)) + C\\)",
      "\\(\\cos(\\ln(x)) + C\\)",
      "\\(\\frac{x}{2}(\\sin(\\ln(x)) + \\cos(\\ln(x))) + C\\)",
    ],
    correct: 0,
  },
  {
    question: "Вычислите \\(\\int \\frac{x^2 + 1}{x^4 + 1}  dx\\)",
    options: [
      "\\(\\arctan(x^2) + C\\)",
      "\\(\\frac{1}{2}\\ln\\left|\\frac{x^2 + 1}{x^2 - 1}\\right| + C\\)",
      "\\(\\frac{1}{\\sqrt{2}}\\arctan\\left(\\frac{x^2 - 1}{x\\sqrt{2}}\\right) + C\\)",
      "\\(\\frac{x}{x^4 + 1} + C\\)",
    ],
    correct: 2,
  },
  {
    question: "Вычислите \\(\\int \\sqrt{x^2 + a^2}  dx\\)",
    options: [
      "\\(\\frac{x}{2}\\sqrt{x^2 + a^2} + \\frac{a^2}{2}\\ln|x + \\sqrt{x^2 + a^2}| + C\\)",
      "\\(x\\sqrt{x^2 + a^2} + C\\)",
      "\\(\\frac{1}{3}(x^2 + a^2)^{3/2} + C\\)",
      "\\(\\ln|x + \\sqrt{x^2 + a^2}| + C\\)",
    ],
    correct: 0,
  },
  {
    question: "Вычислите \\(\\int \\frac{dx}{x\\sqrt{x^2 - 4}}\\)",
    options: [
      "\\(\\frac{1}{\\sqrt{x^2 - 4}} + C\\)",
      "\\(\\ln|x + \\sqrt{x^2 - 4}| + C\\)",
      "\\(\\frac{1}{2}\\ln\\left|\\frac{x - 2}{x + 2}\\right| + C\\)",
      "\\(\\frac{1}{2}\\operatorname{arcsec}\\left(\\frac{x}{2}\\right) + C\\)",
    ],
    correct: 3,
  },
  {
    question: "Вычислите \\(\\int x^2 e^{-x}  dx\\)",
    options: [
      "\\(e^{-x}(x^2 - 2x + 2) + C\\)",
      "\\(-e^{-x}x^2 + C\\)",
      "\\(\\frac{x^3}{3}e^{-x} + C\\)",
      "\\(-e^{-x}(x^2 + 2x + 2) + C\\)",
    ],
    correct: 3,
  },
  {
    question: "Вычислите \\(\\int \\frac{dx}{\\sqrt{x^2 + 2x + 5}}\\)",
    options: [
      "\\(\\arcsin\\left(\\frac{x + 1}{2}\\right) + C\\)",
      "\\(\\ln|x + 1 + \\sqrt{x^2 + 2x + 5}| + C\\)",
      "\\(\\sqrt{x^2 + 2x + 5} + C\\)",
      "\\(\\frac{x + 1}{\\sqrt{x^2 + 2x + 5}} + C\\)",
    ],
    correct: 1,
  },
  {
    question: "Вычислите \\(\\int \\cos^3(x)  dx\\)",
    options: [
      "\\(\\frac{3\\sin(x)}{4} + \\frac{\\sin(3x)}{12} + C\\)",
      "\\(\\sin(x) - \\frac{\\sin^3(x)}{3} + C\\)",
      "\\(\\frac{\\cos^4(x)}{4} + C\\)",
      "\\(\\sin(x)\\cos^2(x) + C\\)",
    ],
    correct: 1,
  },
  {
    question: "Вычислите \\(\\int \\frac{x^3}{\\sqrt{1 - x^2}}  dx\\)",
    options: [
      "\\(-\\sqrt{1 - x^2} + C\\)",
      "\\(\\frac{x^4}{4\\sqrt{1 - x^2}} + C\\)",
      "\\(-\\frac{1}{2}x^2\\sqrt{1 - x^2} + C\\)",
      "\\(\\frac{1}{3}(1 - x^2)^{3/2} - \\sqrt{1 - x^2} + C\\)",
    ],
    correct: 3,
  },
  {
    question: "Вычислите \\(\\int \\frac{dx}{x^2 + 4x + 13}\\)",
    options: [
      "\\(\\frac{1}{3}\\arctan\\left(\\frac{x + 2}{3}\\right) + C\\)",
      "\\(\\frac{1}{2}\\ln|x^2 + 4x + 13| + C\\)",
      "\\(\\arctan(x + 2) + C\\)",
      "\\(\\frac{1}{x + 2} + C\\)",
    ],
    correct: 0,
  },
  {
    question: "Вычислите \\(\\int x\\arcsin(x)  dx\\)",
    options: [
      "\\(\\arcsin(x) - x\\sqrt{1 - x^2} + C\\)",
      "\\(\\frac{x^2}{2}\\arcsin(x) - \\frac{x}{4}\\sqrt{1 - x^2} - \\frac{1}{4}\\arcsin(x) + C\\)",
      "\\(x\\arcsin(x) + \\sqrt{1 - x^2} + C\\)",
      "\\(\\frac{x^2}{2}\\arcsin(x) + \\frac{x}{4}\\sqrt{1 - x^2} - \\frac{1}{4}\\arcsin(x) + C\\)",
    ],
    correct: 3,
  },
  {
    question: "Вычислите \\(\\int \\frac{dx}{e^x + e^{-x}}\\)",
    options: [
      "\\(\\arctan(e^x) + C\\)",
      "\\(\\ln|e^x + e^{-x}| + C\\)",
      "\\(\\frac{1}{2}\\ln\\left|\\frac{e^x - 1}{e^x + 1}\\right| + C\\)",
      "\\(\\frac{e^x}{e^{2x} + 1} + C\\)",
    ],
    correct: 0,
  },
  {
    question: "Вычислите \\(\\int \\sqrt{\\frac{1 + x}{1 - x}}  dx\\)",
    options: [
      "\\(\\sqrt{1 - x^2} + C\\)",
      "\\(\\frac{1}{2}\\ln\\left|\\frac{1 + x}{1 - x}\\right| + C\\)",
      "\\(\\arcsin(x) - \\sqrt{1 - x^2} + C\\)",
      "\\(x\\sqrt{\\frac{1 + x}{1 - x}} + C\\)",
    ],
    correct: 2,
  },
  {
    question: "Вычислите \\(\\int \\frac{x^2}{x^4 + 1}  dx\\)",
    options: [
      "\\(\\frac{1}{2\\sqrt{2}}\\ln\\left|\\frac{x^2 - x\\sqrt{2} + 1}{x^2 + x\\sqrt{2} + 1}\\right| + C\\)",
      "\\(\\arctan(x^2) + C\\)",
      "\\(\\frac{1}{2}\\ln|x^4 + 1| + C\\)",
      "\\(\\frac{x}{x^4 + 1} + C\\)",
    ],
    correct: 0,
  },
  {
    question: "Вычислите \\(\\int e^{\\sqrt{x}}  dx\\)",
    options: [
      "\\(e^{\\sqrt{x}} + C\\)",
      "\\(2\\sqrt{x}e^{\\sqrt{x}} + C\\)",
      "\\(2e^{\\sqrt{x}}(\\sqrt{x} - 1) + C\\)",
      "\\(\\frac{e^{\\sqrt{x}}}{2\\sqrt{x}} + C\\)",
    ],
    correct: 2,
  },
  {
    question: "Вычислите \\(\\int \\frac{dx}{x\\sqrt{1 - x^3}}\\)",
    options: [
      "\\(-\\frac{1}{3}\\ln\\left|\\frac{1 + \\sqrt{1 - x^3}}{1 - \\sqrt{1 - x^3}}\\right| + C\\)",
      "\\(\\arcsin(x^{3/2}) + C\\)",
      "\\(\\frac{2}{3}\\sqrt{1 - x^3} + C\\)",
      "\\(\\ln|x\\sqrt{1 - x^3}| + C\\)",
    ],
    correct: 0,
  },
  {
    question: "Вычислите \\(\\int \\sin(x)\\cos^4(x)  dx\\)",
    options: [
      "\\(-\\frac{\\cos^5(x)}{5} + C\\)",
      "\\(\\frac{\\sin^2(x)\\cos^3(x)}{2} + C\\)",
      "\\(\\frac{\\cos^5(x)}{5} + C\\)",
      "\\(-\\frac{\\sin^2(x)}{2}\\cos^3(x) + C\\)",
    ],
    correct: 0,
  },
  {
    question: "Вычислите \\(\\int \\frac{x^3 + 1}{x^2 - 1}  dx\\)",
    options: [
      "\\(\\frac{x^2}{2} + \\ln|x - 1| + C\\)",
      "\\(x + \\ln|x^2 - 1| + C\\)",
      "\\(\\frac{x^2}{2} + \\ln|x + 1| + C\\)",
      "\\(x + \\frac{1}{x - 1} + C\\)",
    ],
    correct: 0,
  },
  {
    question: "Вычислите \\(\\int \\frac{dx}{\\sqrt{x} + \\sqrt[4]{x}}\\)",
    options: [
      "\\(2\\sqrt{x} - 4\\sqrt[4]{x} + 4\\ln|1 + \\sqrt[4]{x}| + C\\)",
      "\\(\\ln|\\sqrt{x} + \\sqrt[4]{x}| + C\\)",
      "\\(2\\sqrt{x} + 4\\sqrt[4]{x} + C\\)",
      "\\(\\frac{4}{3}x^{3/4} + C\\)",
    ],
    correct: 0,
  },
  {
    question: "Вычислите \\(\\int x^2\\sqrt{1 - x^2}  dx\\)",
    options: [
      "\\(\\frac{x^3}{3}\\sqrt{1 - x^2} + C\\)",
      "\\(-\\frac{1}{3}(1 - x^2)^{3/2} + C\\)",
      "\\(\\frac{x}{8}(2x^2 - 1)\\sqrt{1 - x^2} + \\frac{1}{8}\\arcsin(x) + C\\)",
      "\\(\\frac{x}{2}\\sqrt{1 - x^2} + C\\)",
    ],
    correct: 2,
  },
  {
    question: "Вычислите \\(\\int \\frac{dx}{x^2\\sqrt{x^2 + 9}}\\)",
    options: [
      "\\(-\\frac{\\sqrt{x^2 + 9}}{9x} + C\\)",
      "\\(\\frac{1}{3}\\arcsin\\left(\\frac{x}{3}\\right) + C\\)",
      "\\(-\\frac{1}{x\\sqrt{x^2 + 9}} + C\\)",
      "\\(\\ln|x + \\sqrt{x^2 + 9}| + C\\)",
    ],
    correct: 0,
  },
  {
    question: "Вычислите \\(\\int \\ln(x + \\sqrt{1 + x^2})  dx\\)",
    options: [
      "\\(x\\ln(x + \\sqrt{1 + x^2}) - \\sqrt{1 + x^2} + C\\)",
      "\\(\\ln(x + \\sqrt{1 + x^2}) + C\\)",
      "\\(\\frac{1}{2}\\ln^2(x + \\sqrt{1 + x^2}) + C\\)",
      "\\(x + \\sqrt{1 + x^2} + C\\)",
    ],
    correct: 0,
  },
  {
    question: "Вычислите \\(\\int \\frac{x^5}{x^2 + 1}  dx\\)",
    options: [
      "\\(\\frac{x^4}{4} + \\frac{x^2}{2} + C\\)",
      "\\(\\frac{x^4}{4} - \\frac{x^2}{2} + \\frac{1}{2}\\ln(x^2 + 1) + C\\)",
      "\\(\\frac{x^6}{6(x^2 + 1)} + C\\)",
      "\\(x^3 - x + \\arctan(x) + C\\)",
    ],
    correct: 1,
  },
  {
    question: "Вычислите \\(\\int \\frac{dx}{\\sin^4(x)}\\)",
    options: [
      "\\(-\\frac{\\cot(x)}{3}(\\csc^2(x) + 2) + C\\)",
      "\\(-\\frac{\\cos(x)}{3\\sin^3(x)} + C\\)",
      "\\(\\frac{1}{3}\\tan^3(x) + C\\)",
      "\\(-\\cot(x) - \\frac{\\cot^3(x)}{3} + C\\)",
    ],
    correct: 0,
  },
  {
    question: "Вычислите \\(\\int \\sqrt{x}\\ln(x)  dx\\)",
    options: [
      "\\(\\sqrt{x}\\ln(x) - 2\\sqrt{x} + C\\)",
      "\\(\\frac{2}{3}x^{3/2}\\ln(x) + C\\)",
      "\\(\\frac{2}{3}x^{3/2}\\ln(x) - \\frac{4}{9}x^{3/2} + C\\)",
      "\\(\\frac{1}{2\\sqrt{x}}\\ln(x) + C\\)",
    ],
    correct: 2,
  },
  {
    question: "Вычислите \\(\\int \\frac{x^2}{\\sqrt{4x - x^2}}  dx\\)",
    options: [
      "\\(-\\frac{x}{2}\\sqrt{4x - x^2} + 2\\sqrt{4x - x^2} + 6\\arcsin\\left(\\frac{x - 2}{2}\\right) + C\\)",
      "\\(\\sqrt{4x - x^2} + C\\)",
      "\\(\\frac{x^3}{3\\sqrt{4x - x^2}} + C\\)",
      "\\(2\\arcsin\\left(\\frac{x}{2}\\right) + C\\)",
    ],
    correct: 0,
  },
  {
    question: "Вычислите \\(\\int e^{2x}\\cos(3x)  dx\\)",
    options: [
      "\\(\\frac{e^{2x}}{5}(\\cos(3x) + \\sin(3x)) + C\\)",
      "\\(e^{2x}\\cos(3x) + C\\)",
      "\\(\\frac{e^{2x}}{2}\\cos(3x) + C\\)",
      "\\(\\frac{e^{2x}}{13}(2\\cos(3x) + 3\\sin(3x)) + C\\)",
    ],
    correct: 3,
  },
  {
    question: "Вычислите \\(\\int \\frac{dx}{x^4 + 4}\\)",
    options: [
      "\\(\\frac{1}{4\\sqrt{2}}\\arctan\\left(\\frac{x^2 - 2}{x\\sqrt{2}}\\right) + \\frac{1}{8\\sqrt{2}}\\ln\\left|\\frac{x^2 + 2x + 2}{x^2 - 2x + 2}\\right| + C\\)",
      "\\(\\frac{1}{4}\\arctan\\left(\\frac{x^2}{2}\\right) + C\\)",
      "\\(\\frac{x}{x^4 + 4} + C\\)",
      "\\(\\frac{1}{2}\\ln|x^4 + 4| + C\\)",
    ],
    correct: 0,
  },
  {
    question: "Вычислите \\(\\int \\sqrt{\\tan(x)}  dx\\)",
    options: [
      "\\(\\frac{1}{\\sqrt{2}}\\arctan\\left(\\frac{\\sqrt{\\tan(x)} - 1}{\\sqrt{2\\tan(x)}}\\right) + \\frac{1}{2\\sqrt{2}}\\ln\\left|\\frac{\\sqrt{\\tan(x)} - \\sqrt{2\\tan(x)} + 1}{\\sqrt{\\tan(x)} + \\sqrt{2\\tan(x)} + 1}\\right| + C\\)",
      "\\(\\frac{2}{3}\\tan^{3/2}(x) + C\\)",
      "\\(\\ln|\\sqrt{\\tan(x)}| + C\\)",
      "\\(\\sqrt{\\tan(x)} + C\\)",
    ],
    correct: 0,
  },
  {
    question: "Вычислите \\(\\int \\frac{x^3}{\\sqrt{x^2 + 4}}  dx\\)",
    options: [
      "\\(x^2\\sqrt{x^2 + 4} + C\\)",
      "\\(\\frac{x^4}{4\\sqrt{x^2 + 4}} + C\\)",
      "\\(\\frac{1}{3}(x^2 - 8)\\sqrt{x^2 + 4} + C\\)",
      "\\(\\frac{1}{2}x^2\\sqrt{x^2 + 4} + C\\)",
    ],
    correct: 2,
  },
  {
    question: "Вычислите \\(\\int \\frac{dx}{\\sin^3(x)}\\)",
    options: [
      "\\(-\\frac{\\cos(x)}{2\\sin^2(x)} + \\frac{1}{2}\\ln|\\csc(x) - \\cot(x)| + C\\)",
      "\\(-\\frac{\\cot(x)}{2\\sin^2(x)} + C\\)",
      "\\(\\frac{1}{2}\\tan^2(x) + C\\)",
      "\\(-\\frac{1}{2}\\cot(x)\\csc(x) + C\\)",
    ],
    correct: 0,
  },
  {
    question: "Вычислите \\(\\int x^2\\arctan(x)  dx\\)",
    options: [
      "\\(\\frac{x^3}{3}\\arctan(x) - \\frac{x^2}{6} + \\frac{1}{6}\\ln(1 + x^2) + C\\)",
      "\\(x\\arctan(x) - \\frac{1}{2}\\ln(1 + x^2) + C\\)",
      "\\(\\frac{x^3}{3}\\arctan(x) + C\\)",
      "\\(\\arctan(x) - \\frac{x}{1 + x^2} + C\\)",
    ],
    correct: 0,
  },
  {
    question: "Вычислите \\(\\int \\frac{dx}{x^4 - 1}\\)",
    options: [
      "\\(\\frac{1}{4}\\ln\\left|\\frac{x - 1}{x + 1}\\right| - \\frac{1}{2}\\arctan(x) + C\\)",
      "\\(\\frac{1}{2}\\ln|x^2 - 1| + C\\)",
      "\\(\\frac{1}{x^3} + C\\)",
      "\\(\\frac{1}{4}\\ln\\left|\\frac{x + 1}{x - 1}\\right| + C\\)",
    ],
    correct: 0,
  },
  {
    question: "Вычислите \\(\\int \\sqrt{\\frac{1 - x}{1 + x}}  dx\\)",
    options: [
      "\\(\\arcsin(x) + \\sqrt{1 - x^2} + C\\)",
      "\\(\\sqrt{1 - x^2} + C\\)",
      "\\(-\\frac{1}{2}\\ln\\left|\\frac{1 + x}{1 - x}\\right| + C\\)",
      "\\(x\\sqrt{\\frac{1 - x}{1 + x}} + C\\)",
    ],
    correct: 0,
  },
  {
    question: "Вычислите \\(\\int \\frac{x^2 + x + 1}{x^3 + 1}  dx\\)",
    options: [
      "\\(\\ln|x + 1| + \\frac{1}{\\sqrt{3}}\\arctan\\left(\\frac{2x - 1}{\\sqrt{3}}\\right) + C\\)",
      "\\(\\ln|x^3 + 1| + C\\)",
      "\\(\\frac{1}{3}\\ln|x + 1| + C\\)",
      "\\(\\arctan(x) + C\\)",
    ],
    correct: 0,
  },
  {
    question: "Вычислите \\(\\int \\frac{dx}{x\\sqrt{x^2 + x + 1}}\\)",
    options: [
      "\\(-\\frac{1}{\\sqrt{3}}\\ln\\left|\\frac{\\sqrt{x^2 + x + 1} + \\sqrt{3}/2}{x}\\right| + C\\)",
      "\\(\\ln|x + \\sqrt{x^2 + x + 1}| + C\\)",
      "\\(\\frac{1}{\\sqrt{x^2 + x + 1}} + C\\)",
      "\\(\\frac{2x + 1}{\\sqrt{x^2 + x + 1}} + C\\)",
    ],
    correct: 0,
  },
  {
    question: "Вычислите \\(\\int \\sin(2x)\\cos(3x)  dx\\)",
    options: [
      "\\(-\\frac{1}{2}\\cos(x) + \\frac{1}{10}\\cos(5x) + C\\)",
      "\\(\\frac{1}{2}\\sin(x) + \\frac{1}{10}\\sin(5x) + C\\)",
      "\\(-\\frac{1}{5}\\cos(5x) + C\\)",
      "\\(\\frac{1}{2}\\cos(x) + C\\)",
    ],
    correct: 0,
  },
  {
    question: "Вычислите \\(\\int \\frac{x^4}{x^2 + 2x + 2}  dx\\)",
    options: [
      "\\(\\frac{x^3}{3} - x^2 + 2x - 2\\arctan(x + 1) + C\\)",
      "\\(\\frac{x^3}{3} + x^2 + C\\)",
      "\\(x^2 - 2x + 2\\ln|x^2 + 2x + 2| + C\\)",
      "\\(\\frac{x^5}{5(x^2 + 2x + 2)} + C\\)",
    ],
    correct: 0,
  },
  {
    question: "Вычислите \\(\\int \\frac{dx}{\\sqrt{x} + \\sqrt[3]{x}}\\)",
    options: [
      "\\(2\\sqrt{x} - 3\\sqrt[3]{x} + 6\\sqrt[6]{x} - 6\\ln|1 + \\sqrt[6]{x}| + C\\)",
      "\\(\\ln|\\sqrt{x} + \\sqrt[3]{x}| + C\\)",
      "\\(2\\sqrt{x} + 3\\sqrt[3]{x} + C\\)",
      "\\(\\frac{6}{5}x^{5/6} + C\\)",
    ],
    correct: 0,
  },
  {
    question: "Вычислите \\(\\int \\frac{x^2}{\\sqrt{1 + x^3}}  dx\\)",
    options: [
      "\\(\\frac{2}{3}\\sqrt{1 + x^3} + C\\)",
      "\\(x\\sqrt{1 + x^3} + C\\)",
      "\\(\\frac{x^3}{3\\sqrt{1 + x^3}} + C\\)",
      "\\(\\frac{2}{9}(1 + x^3)^{3/2} + C\\)",
    ],
    correct: 0,
  },
  { question: "Вычислите $\\int x^2 e^x dx$", options: ["$e^x(x^2-2x+2)+C$","$x^2 e^x - 2xe^x + C$","$e^x(x^2+2x+2)+C$","$\\frac{x^3 e^x}{3}+C$"], correct: 0 },
  { question: "Вычислите $\\int \\frac{dx}{x^2-1}$", options: ["$\\frac{1}{2}\\ln\\left|\\frac{x-1}{x+1}\\right|+C$","$\\ln|x^2-1|+C$","$\\frac{1}{2}\\ln|x^2-1|+C$","$\\arctan x + C$"], correct: 0 },
  { question: "Вычислите $\\int_0^{\\pi/2} \\sin^2 x\\, dx$", options: ["$\\frac{\\pi}{4}$","$\\frac{\\pi}{2}$","$\\frac{1}{2}$","$1$"], correct: 0 },
  { question: "Вычислите $\\int \\frac{dx}{\\sqrt{1-x^2}}$", options: ["$\\arcsin x + C$","$\\arccos x + C$","$-\\arcsin x + C$","$\\arctan x + C$"], correct: 0 },
  { question: "Вычислите $\\int x\\ln x\\, dx$", options: ["$\\frac{x^2}{2}\\ln x - \\frac{x^2}{4}+C$","$\\frac{x^2 \\ln x}{2}+C$","$x^2\\ln x - \\frac{x^2}{2}+C$","$\\frac{x^2}{4}(2\\ln x - 1)+C$"], correct: 0 },
  { question: "Вычислите $\\int \\sec^2 x\\, dx$", options: ["$\\tan x + C$","$\\sec x \\tan x + C$","$\\ln|\\sec x|+C$","$-\\cot x + C$"], correct: 0 },
  { question: "Вычислите $\\int_0^1 \\frac{dx}{1+x^2}$", options: ["$\\frac{\\pi}{4}$","$\\frac{\\pi}{2}$","$1$","$\\frac{1}{2}$"], correct: 0 },
  { question: "Вычислите $\\int \\frac{2x+3}{x^2+3x+2}dx$", options: ["$\\ln|x^2+3x+2|+C$","$\\ln|(x+1)(x+2)|+C$","$2\\ln|x^2+3x+2|+C$","Оба первых варианта верны"], correct: 3 },
  { question: "Вычислите $\\int \\arctan x\\, dx$", options: ["$x\\arctan x - \\frac{1}{2}\\ln(1+x^2)+C$","$\\arctan x + \\frac{x}{1+x^2}+C$","$x\\arctan x + C$","$\\frac{\\arctan^2 x}{2}+C$"], correct: 0 },
  { question: "Вычислите $\\int e^x \\sin x\\, dx$", options: ["$\\frac{e^x(\\sin x - \\cos x)}{2}+C$","$e^x \\sin x - e^x \\cos x + C$","$\\frac{e^x(\\sin x + \\cos x)}{2}+C$","$e^x \\cos x + C$"], correct: 0 },
  { question: "Вычислите $\\int_0^{\\infty} e^{-x} dx$ (несобственный интеграл)", options: ["$1$","$0$","$\\infty$","$e$"], correct: 0 },
  { question: "Вычислите $\\int \\frac{\\ln x}{x^2} dx$", options: ["$-\\frac{\\ln x + 1}{x}+C$","$\\frac{\\ln x}{x}+C$","$-\\frac{\\ln x}{x}+C$","$\\frac{1-\\ln x}{x}+C$"], correct: 0 },
  { question: "Вычислите $\\int \\tan x\\, dx$", options: ["$-\\ln|\\cos x|+C$","$\\ln|\\cos x|+C$","$\\sec^2 x + C$","$\\ln|\\sin x|+C$"], correct: 0 },
  { question: "Вычислите $\\int_1^e \\ln x\\, dx$", options: ["$1$","$e-1$","$e$","$e-2$"], correct: 0 },
  { question: "Вычислите $\\int \\frac{dx}{x(x+1)^2}$", options: ["$\\ln\\left|\\frac{x}{x+1}\\right|+\\frac{1}{x+1}+C$","$\\ln|x|-\\ln|x+1|+C$","$\\frac{1}{x(x+1)}+C$","$\\ln|x|-2\\ln|x+1|+C$"], correct: 0 },
  { question: "Вычислите $\\int \\sin^4 x\\,dx$", options: ["$\\frac{3x}{8} - \\frac{\\sin 2x}{4} + \\frac{\\sin 4x}{32} + C$","$-\\frac{\\cos^4 x}{4} + C$","$\\frac{3x}{8} + \\frac{\\sin 2x}{4} + \\frac{\\sin 4x}{32} + C$","$-\\frac{3\\cos x}{8} + C$"], correct: 0 },
  { question: "Вычислите $\\int \\frac{dx}{1+\\sqrt{x}}$", options: ["$2\\sqrt{x} - 2\\ln(1+\\sqrt{x}) + C$","$\\ln(1+\\sqrt{x}) + C$","$\\frac{1}{2\\sqrt{x}(1+\\sqrt{x})} + C$","$2\\sqrt{x} + 2\\ln(1+\\sqrt{x}) + C$"], correct: 0 },
  { question: "Вычислите $\\int \\frac{x\\,dx}{(1+x^2)^{3/2}}$", options: ["$\\frac{1}{\\sqrt{1+x^2}} + C$","$-\\frac{1}{\\sqrt{1+x^2}} + C$","$\\frac{x^2}{2\\sqrt{1+x^2}} + C$","$\\arctan x + C$"], correct: 1 },
  { question: "Вычислите $\\int_0^1 x\\ln x\\,dx$", options: ["$-\\frac{1}{4}$","$-\\frac{1}{2}$","$0$","$1$"], correct: 0 },
  { question: "Вычислите $\\int \\cos^4 x\\,dx$", options: ["$\\frac{3x}{8} + \\frac{\\sin 2x}{4} + \\frac{\\sin 4x}{32} + C$","$\\frac{3x}{8} - \\frac{\\sin 2x}{4} + \\frac{\\sin 4x}{32} + C$","$\\frac{\\sin^4 x}{4} + C$","$\\frac{3x}{8} + \\frac{\\sin 4x}{32} + C$"], correct: 0 },
  { question: "Вычислите $\\int \\frac{dx}{x^2\\sqrt{4-x^2}}$", options: ["$-\\frac{\\sqrt{4-x^2}}{4x} + C$","$\\frac{\\sqrt{4-x^2}}{4x} + C$","$\\arcsin\\frac{x}{2} + C$","$-\\frac{1}{4x\\sqrt{4-x^2}} + C$"], correct: 0 },
  { question: "Вычислите $\\int x^3 e^{x^2}\\,dx$", options: ["$\\frac{(x^2-1)e^{x^2}}{2} + C$","$x^2 e^{x^2} + C$","$\\frac{x^2 e^{x^2}}{2} + C$","$\\frac{(x^2+1)e^{x^2}}{2} + C$"], correct: 0 },
  { question: "Вычислите $\\int \\ln(1+x^2)\\,dx$", options: ["$x\\ln(1+x^2) - 2x + 2\\arctan x + C$","$x\\ln(1+x^2) + C$","$\\frac{2x}{1+x^2} + C$","$x\\ln(1+x^2) - 2\\arctan x + C$"], correct: 0 },
  { question: "Вычислите $\\int_0^{\\pi/2} \\sin^3 x\\cos^2 x\\,dx$", options: ["$\\frac{1}{6}$","$\\frac{2}{15}$","$\\frac{1}{15}$","$\\frac{1}{3}$"], correct: 1 },
  { question: "Вычислите $\\int \\frac{dx}{x(x^2+1)}$", options: ["$\\ln|x| - \\frac{1}{2}\\ln(x^2+1) + C$","$\\arctan x + C$","$\\frac{1}{x(x^2+1)} + C$","$\\ln|x| + \\frac{1}{2}\\ln(x^2+1) + C$"], correct: 0 },
  { question: "Вычислите $\\int \\frac{x^2\\,dx}{(x^3+1)^2}$", options: ["$-\\frac{1}{3(x^3+1)} + C$","$\\frac{x^3}{3(x^3+1)^2} + C$","$\\frac{1}{3(x^3+1)} + C$","$-\\frac{x^3}{3(x^3+1)} + C$"], correct: 0 },
  { question: "Вычислите $\\int \\sqrt{a^2-x^2}\\,dx$", options: ["$\\frac{x}{2}\\sqrt{a^2-x^2} + \\frac{a^2}{2}\\arcsin\\frac{x}{a} + C$","$\\frac{a^2}{2}\\arcsin\\frac{x}{a} + C$","$\\frac{x^2}{2\\sqrt{a^2-x^2}} + C$","$-\\frac{1}{3}(a^2-x^2)^{3/2} + C$"], correct: 0 },
  { question: "Вычислите $\\int \\frac{dx}{x^2\\sqrt{a^2+x^2}}$", options: ["$-\\frac{\\sqrt{a^2+x^2}}{a^2 x} + C$","$\\frac{\\sqrt{a^2+x^2}}{a^2 x} + C$","$\\ln|x+\\sqrt{a^2+x^2}| + C$","$\\frac{1}{a}\\arctan\\frac{x}{a} + C$"], correct: 0 },
  { question: "Вычислите $\\int \\sin(ax)\\sin(bx)\\,dx$ при $a\\neq b$", options: ["$\\frac{\\sin((a-b)x)}{2(a-b)} - \\frac{\\sin((a+b)x)}{2(a+b)} + C$","$-\\frac{\\cos((a-b)x)}{2} + \\frac{\\cos((a+b)x)}{2} + C$","$\\frac{\\cos((a-b)x)}{2(a-b)} - \\frac{\\cos((a+b)x)}{2(a+b)} + C$","$-\\frac{\\cos(ax)\\cos(bx)}{ab} + C$"], correct: 0 },
  { question: "Вычислите $\\int_0^\\pi x\\sin x\\,dx$", options: ["$0$","$\\pi$","$2\\pi$","$-\\pi$"], correct: 1 },
  { question: "Вычислите $\\int x\\cos^2 x\\,dx$", options: ["$\\frac{x^2}{4} + \\frac{x\\sin 2x}{4} + \\frac{\\cos 2x}{8} + C$","$\\frac{x\\sin 2x}{4} + C$","$\\frac{x^2}{4} + C$","$\\frac{x^2}{2}\\cos^2 x + C$"], correct: 0 },
  { question: "Вычислите $\\int \\frac{x+1}{\\sqrt{x^2+2x+5}}\\,dx$", options: ["$\\sqrt{x^2+2x+5} + C$","$\\frac{1}{2}\\sqrt{x^2+2x+5} + C$","$\\ln|x+1+\\sqrt{x^2+2x+5}| + C$","$\\arcsin\\frac{x+1}{2} + C$"], correct: 0 },
  { question: "Вычислите $\\int \\frac{dx}{\\sqrt{2ax-x^2}}$", options: ["$\\arcsin\\frac{x-a}{a} + C$","$\\arcsin\\frac{x}{a} + C$","$\\arcsin\\frac{x+a}{a} + C$","$\\frac{1}{\\sqrt{2ax-x^2}} + C$"], correct: 0 },
];