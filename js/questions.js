  // Вопросы для раздела "Ряды и последовательности"
    
    // Легкие вопросы
    const easySeriesQuestions = [
      {
        question: "Чему равен предел последовательности $a_n = \\frac{1}{n}$ при $n \\to \\infty$?",
        options: ["$0$", "$1$", "$\\infty$", "$-\\infty$"],
        correct: 0
      },
      {
        question: "Какой из следующих рядов является гармоническим?",
        options: ["$\\sum_{n=1}^{\\infty} \\frac{1}{n}$", "$\\sum_{n=1}^{\\infty} \\frac{1}{n^2}$", "$\\sum_{n=1}^{\\infty} \\frac{1}{2^n}$", "$\\sum_{n=1}^{\\infty} n$"],
        correct: 0
      },
      {
        question: "Что означает сходимость ряда?",
        options: ["Сумма ряда конечна", "Последовательность частичных сумм имеет предел", "Члены ряда стремятся к нулю", "Все члены ряда положительны"],
        correct: 1
      },
      {
        question: "Какая из этих последовательностей сходится?",
        options: ["$a_n = (-1)^n$", "$a_n = \\frac{n}{n+1}$", "$a_n = n^2$", "$a_n = 2^n$"],
        correct: 1
      },
      {
        question: "Чему равна сумма геометрической прогрессии $1 + \\frac{1}{2} + \\frac{1}{4} + \\frac{1}{8} + \\ldots$?",
        options: ["$2$", "$1$", "$\\infty$", "$\\frac{1}{2}$"],
        correct: 0
      }
    ];

    // Средние вопросы
    const mediumSeriesQuestions = [
      {
        question: "Сходится ли ряд $\\sum_{n=1}^{\\infty} \\frac{1}{n^2}$?",
        options: ["Да, сходится", "Нет, расходится", "Сходится только для четных n", "Сходится только для нечетных n"],
        correct: 0
      },
      {
        question: "Что показывает признак Даламбера?",
        options: ["Сходимость ряда через отношение соседних членов", "Сходимость ряда через интеграл", "Сходимость ряда через корень n-ой степени", "Сходимость знакопеременного ряда"],
        correct: 0
      },
      {
        question: "Какой из этих рядов сходится по признаку Лейбница?",
        options: ["$\\sum_{n=1}^{\\infty} (-1)^n \\frac{1}{n}$", "$\\sum_{n=1}^{\\infty} \\frac{1}{n}$", "$\\sum_{n=1}^{\\infty} (-1)^n n$", "$\\sum_{n=1}^{\\infty} (-1)^n \\frac{1}{n^2}$"],
        correct: 0
      },
      {
        question: "Чему равен радиус сходимости степенного ряда $\\sum_{n=0}^{\\infty} \\frac{x^n}{n!}$?",
        options: ["$\\infty$", "$1$", "$0$", "$e$"],
        correct: 0
      },
      {
        question: "Что такое частичная сумма ряда?",
        options: ["Сумма первых n членов ряда", "Сумма всех членов ряда", "Сумма четных членов ряда", "Сумма нечетных членов ряда"],
        correct: 0
      }
    ];

    // Сложные вопросы
    const hardSeriesQuestions = [
      {
        question: "Сходится ли ряд $\\sum_{n=1}^{\\infty} \\frac{\\sin(n)}{n^2}$?",
        options: ["Да, абсолютно сходится", "Сходится условно", "Расходится", "Сходится только для некоторых n"],
        correct: 0
      },
      {
        question: "Какой из следующих рядов сходится равномерно на всей числовой прямой?",
        options: ["$\\sum_{n=0}^{\\infty} \\frac{x^n}{n!}$", "$\\sum_{n=1}^{\\infty} \\frac{x^n}{n}$", "$\\sum_{n=1}^{\\infty} n x^n$", "$\\sum_{n=1}^{\\infty} \\frac{x^n}{n^2}$"],
        correct: 0
      },
      {
        question: "Что такое ряд Тейлора для функции $e^x$?",
        options: ["$\\sum_{n=0}^{\\infty} \\frac{x^n}{n!}$", "$\\sum_{n=0}^{\\infty} \\frac{x^n}{n}$", "$\\sum_{n=0}^{\\infty} (-1)^n \\frac{x^n}{n!}$", "$\\sum_{n=0}^{\\infty} \\frac{x^{2n}}{(2n)!}$"],
        correct: 0
      },
      {
        question: "Какой признак сходимости используется для рядов с положительными членами?",
        options: ["Признак сравнения", "Признак Лейбница", "Признак Абеля", "Признак Дирихле"],
        correct: 0
      },
      {
        question: "Что такое условная сходимость ряда?",
        options: ["Ряд сходится, но не абсолютно", "Ряд сходится абсолютно", "Ряд сходится только при определенных условиях", "Ряд сходится медленно"],
        correct: 0
      }
    ];
          // Легкие вопросы
const easyDerivativesQuestions = [
    {
        question: "Найдите производную функции $f(x) = x^2$",
        options: ["$f'(x) = 2x$", "$f'(x) = x$", "$f'(x) = 2x^2$", "$f'(x) = x^3$"],
        correct: 0
    },
    {
        question: "Найдите производную функции $f(x) = \\sin(x)$",
        options: ["$f'(x) = -\\cos(x)$", "$f'(x) = \\cos(x)$", "$f'(x) = \\sin(x)$", "$f'(x) = -\\sin(x)$"],
        correct: 1
    },
    {
        question: "Найдите производную функции $f(x) = e^x$",
        options: ["$f'(x) = xe^{x-1}$", "$f'(x) = e^x$", "$f'(x) = \\ln(x)$", "$f'(x) = x$"],
        correct: 1
    },
    {
        question: "Найдите производную функции $f(x) = \\cos(x)$",
        options: ["$f'(x) = \\sin(x)$", "$f'(x) = -\\cos(x)$", "$f'(x) = -\\sin(x)$", "$f'(x) = \\cos(x)$"],
        correct: 2
    },
    {
        question: "Найдите производную функции $f(x) = \\ln(x)$",
        options: ["$f'(x) = \\frac{1}{x}$", "$f'(x) = e^x$", "$f'(x) = x$", "$f'(x) = -\\frac{1}{x^2}$"],
        correct: 0
    },
    {
        question: "Найдите производную функции $f(x) = a$, где $a = const$",
        options: ["$f'(x) = 0$", "$f'(x) = a$", "$f'(x) = ax$", "$f'(x) = 1$"],
        correct: 0
    },
    {
        question: "Найдите производную функции $f(x) = x^7$",
        options: ["$f'(x) = 7x^6$", "$f'(x) = 6x^7$", "$f'(x) = 7x^8$", "$f'(x) = x^6$"],
        correct: 0
    },
    {
        question: "Найдите производную функции $f(x) = \\sqrt{x}$",
        options: ["$f'(x) = \\frac{1}{\\sqrt{x}}$", "$f'(x) = \\frac{1}{2\\sqrt{x}}$", "$f'(x) = 2\\sqrt{x}$", "$f'(x) = \\sqrt{x}$"],
        correct: 1
    },
    {
        question: "Найдите производную функции $f(x) = \\frac{1}{x}$",
        options: ["$f'(x) = -\\frac{1}{x}$", "$f'(x) = \\ln|x|$", "$f'(x) = -\\frac{1}{x^2}$", "$f'(x) = \\frac{1}{x^2}$"],
        correct: 2
    },
    {
        question: "Найдите производную функции $f(x) = 3x^4 - 2x^3 + 5x - 7$",
        options: ["$f'(x) = 12x^3 - 6x^2 + 5$", "$f'(x) = 12x^3 - 2x^2 + 5$", "$f'(x) = 3x^3 - 2x^2 + 5$", "$f'(x) = 4x^3 - 3x^2 + 5$"],
        correct: 0
    },
    {
        question: "Найдите производную функции $f(x) = x \\cdot \\sin(x)$",
        options: ["$f'(x) = \\sin(x) + x\\cos(x)$", "$f'(x) = \\cos(x)$", "$f'(x) = x\\cos(x)$", "$f'(x) = \\sin(x) \\cdot \\cos(x)$"],
        correct: 0
    },
    {
        question: "Найдите производную функции $f(x) = e^{2x}$",
        options: ["$f'(x) = 2e^{2x}$", "$f'(x) = e^{2x}$", "$f'(x) = 2e^{x}$", "$f'(x) = e^{2}$"],
        correct: 0
    },
    {
        question: "Найдите производную функции $f(x) = \\sin(3x)$",
        options: ["$f'(x) = 3\\cos(3x)$", "$f'(x) = \\cos(3x)$", "$f'(x) = -3\\cos(3x)$", "$f'(x) = 3\\sin(3x)$"],
        correct: 0
    },
    {
        question: "Найдите производную функции $f(x) = \\ln(x^2)$",
        options: [ "$f'(x) = \\frac{2}{x^2}$","$f'(x) = \\frac{1}{x^2}$", "$f'(x) = \\frac{2}{x}$", "$f'(x) = 2\\ln(x)$"],
        correct: 2
    },
    {
        question: "Найдите производную функции $f(x) = (2x + 1)^5$",
        options: ["$f'(x) = 10(2x + 1)^4$", "$f'(x) = 5(2x + 1)^4$", "$f'(x) = 2(2x + 1)^4$", "$f'(x) = (2x + 1)^4$"],
        correct: 0
    }
];
// Средние вопросы
const mediumDerivativesQuestions = [
    { 
        question: "f(x) = \\(x^2 \\cdot \\sin(x)\\). Найдите f'(x)", 
        options: [ "\\(x^2\\cos(x)\\)", "\\(2x\\sin(x)\\)", "\\(2x\\sin(x) + x^2\\cos(x)\\)","\\(\\cos(x)\\)"], 
        correct: 2 
    },
    { 
        question: "f(x) = \\(e^x \\cdot \\ln(x)\\). Найдите f'(x)", 
        options: [ "\\(e^x\\ln(x)\\)", "\\(\\frac{e^x}{x}\\)", "\\(\\ln(x)\\)","\\(\\frac{e^x}{x} + e^x\\ln(x)\\)"], 
        correct: 3 
    },
    { 
        question: "f(x) = \\((x^3 + 2x)^4\\). Найдите f'(x)", 
        options: ["\\(4(x^3 + 2x)^3\\)", "\\(12x^2(x^3 + 2x)^3\\)","\\(4(x^3 + 2x)^3(3x^2 + 2)\\)",  "\\((3x^2 + 2)^4\\)"], 
        correct: 2 
    },
    { 
        question: "f(x) = \\(\\sqrt{x^2 + 1}\\). Найдите f'(x)", 
        options: [ "\\(\\frac{1}{2\\sqrt{x^2 + 1}}\\)", "\\(\\frac{2x}{\\sqrt{x^2 + 1}}\\)","\\(\\frac{x}{\\sqrt{x^2 + 1}}\\)", "\\(\\sqrt{2x}\\)"], 
        correct: 2
    },
    { 
        question: "f(x) = \\(\\sin(2x) \\cdot \\cos(3x)\\). Найдите f'(x)", 
        options: ["\\(\\cos(2x)\\cos(3x) - \\sin(2x)\\sin(3x)\\)", "\\(2\\cos(2x) + 3\\cos(3x)\\)", "\\(5\\cos(5x)\\)","\\(2\\cos(2x)\\cos(3x) - 3\\sin(2x)\\sin(3x)\\)"], 
        correct: 3 
    },
    { 
        question: "f(x) = \\(\\ln(x^2 + 4)\\). Найдите f'(x)", 
        options: ["\\(\\frac{x}{x^2 + 4}\\)", "\\(\\frac{1}{x^2 + 4}\\)", "\\(\\frac{2}{x}\\)", "\\(\\frac{2x}{x^2 + 4}\\)"], 
        correct: 3 
    },
    { 
        question: "f(x) = \\(e^{2x} \\cdot \\sin(x)\\). Найдите f'(x)", 
        options: ["\\(e^{2x}(\\sin(x) + \\cos(x))\\)", "\\(e^{2x}\\cos(x)\\)", "\\(2e^{2x}\\sin(x)\\)","\\(e^{2x}(\\2\\sin(x) + \\cos(x))\\)"], 
        correct: 0 
    },
    { 
        question: "f(x) = \\(\\frac{2x + 1}{x - 3}\\). Найдите f'(x)", 
        options: [ "\\(\\frac{2}{x - 3}\\)", "\\(\\frac{5}{(x-3)^2}\\)", "\\(-\\frac{7}{(x - 3)^2}\\)","\\(\\frac{1}{(x-3)^2}\\)"], 
        correct: 2 
    },
    { 
        question: "f(x) = \\(x \\cdot \\arctan(x)\\). Найдите f'(x)", 
        options: [ "\\(\\frac{1}{1 + x^2}\\)","\\(\\arctan(x) + \\frac{x}{1 + x^2}\\)", "\\(\\frac{x}{1 + x^2}\\)", "\\(\\arctan(x) + \\frac{1}{1 + x^2}\\)"], 
        correct: 1 
    },
    { 
        question: "f(x) = \\(\\cos^2(x)\\). Найдите f'(x)", 
        options: ["\\(2\\cos(x)\\sin(x)\\)", "\\(-\\sin^2(x)\\)", "\\(2\\cos(x)\\)", "\\(-2\\cos(x)\\sin(x)\\)"], 
        correct: 3 
    },
    { 
        question: "f(x) = \\(\\sqrt{x} \\cdot \\ln(x)\\). Найдите f'(x)", 
        options: [ "\\(\\frac{1}{2\\sqrt{x}}\\)","\\(\\frac{\\ln(x)}{2\\sqrt{x}} + \\frac{1}{\\sqrt{x}}\\)", "\\(\\frac{\\ln(x)}{2\\sqrt{x}} + \\frac{1}{x}\\)", "\\(\\frac{\\ln(x)}{2\\sqrt{x}}\\)"], 
        correct: 1 
    },
    { 
        question: "f(x) = \\(e^{x^2}\\). Найдите f'(x)", 
        options: ["\\(e^{x^2}\\)", "\\(2x \\cdot e^x\\)", "\\(x^2 \\cdot e^{x^2}\\)","\\(2x \\cdot e^{x^2}\\)" ], 
        correct: 3 
    },
    { 
        question: "f(x) = \\(\\frac{\\sin(x)}{x}\\). Найдите f'(x)", 
        options: ["\\(\\frac{x\\cos(x) - \\sin(x)}{x^2}\\)", "\\(\\frac{\\cos(x)}{x}\\)", "\\(\\frac{\\cos(x) - \\sin(x)}{x^2}\\)", "\\(x\\cos(x) - \\sin(x)\\)"], 
        correct: 0 
    },
    { 
        question: "f(x) = \\((x^2 + 1)^5\\). Найдите f'(x)", 
        options: ["\\(10x(x^2 + 1)^4\\)", "\\(5(x^2 + 1)^4\\)", "\\(10x^2(x^2 + 1)^4\\)", "\\(5x(x^2 + 1)^4\\)"], 
        correct: 0 
    },
    { 
        question: "f(x) = \\(\\tan(3x)\\). Найдите f'(x)", 
        options: [ "\\(\\sec^2(3x)\\)", "\\(3\\tan^2(3x)\\)", "\\(3\\sec^2(x)\\)","\\(3\\sec^2(3x)\\)"], 
        correct: 3 
    },
    { 
        question: "f(x) = \\(x \\cdot e^{-x}\\). Найдите f'(x)", 
        options: ["\\(e^{-x}(1 + x)\\)", "\\(e^{-x}\\)", "\\(-x e^{-x}\\)", "\\(e^{-x}(1 - x)\\)"], 
        correct: 3 
    },
    { 
        question: "f(x) = \\(\\ln(\\cos(x))\\). Найдите f'(x)", 
        options: ["\\(-\\frac{\\sin(x)}{\\cos(x)}\\)", "\\(\\frac{1}{\\cos(x)}\\)", "\\(-\\frac{1}{\\sin(x)}\\)","\\(-\\tan(x)\\)"], 
        correct: 3 
    },
    { 
        question: "f(x) = \\((\\sin(x) + \\cos(x))^2\\). Найдите f'(x)", 
        options: [ "\\(2(\\sin(x)+\\cos(x))\\)", "\\(2(\\cos(x)-\\sin(x))\\)","\\(2(\\cos^2(x)-\\sin^2(x))\\)", "\\(4\\sin(x)\\cos(x)\\)"], 
        correct: 2 
    },
    { 
        question: "f(x) = \\(\\frac{x^2}{x + 1}\\). Найдите f'(x)", 
        options: ["\\(\\frac{2x(x+1) - x^2}{(x+1)^2}\\)", "\\(\\frac{2x}{x+1}\\)", "\\(\\frac{x^2 + 2x}{(x+1)^2}\\)", "\\(\\frac{x(2x + 1)}{(x+1)^2}\\)"], 
        correct: 0 
    },
    { 
        question: "f(x) = \\(\\arcsin(2x)\\). Найдите f'(x)", 
        options: ["\\(\\frac{2}{\\sqrt{1 - 4x^2}}\\)", "\\(\\frac{1}{\\sqrt{1 - 4x^2}}\\)", "\\(\\frac{2}{\\sqrt{1 - x^2}}\\)", "\\(\\frac{1}{\\sqrt{1 - 2x^2}}\\)"], 
        correct: 0 
    },
    { 
        question: "f(x) = \\(e^{\\sin(x)}\\). Найдите f'(x)", 
        options: ["\\(\\cos(x) \\cdot e^{\\sin(x)}\\)", "\\(e^{\\sin(x)}\\)", "\\(\\cos(x) \\cdot e^{\\cos(x)}\\)", "\\(\\sin(x) \\cdot e^{\\sin(x)}\\)"], 
        correct: 0 
    },
    { 
        question: "f(x) = \\(\\frac{x^3 - 1}{x^2 + 1}\\). Найдите f'(x)", 
        options: [ "\\(\\frac{3x^2}{2x}\\)", "\\(\\frac{x^4+3x^2-2x}{(x^2+1)^2}\\)","\\(\\frac{x^4+3x^2+2x}{(x^2+1)^2}\\)", "\\(\\frac{3x^2}{x^2+1}\\)"], 
        correct: 2 
    },
    { 
        question: "f(x) = \\(\\sqrt{\\sin(x)}\\). Найдите f'(x)", 
        options: ["\\(\\frac{\\cos(x)}{2\\sqrt{\\sin(x)}}\\)", "\\(\\frac{\\cos(x)}{\\sqrt{\\sin(x)}}\\)", "\\(\\frac{1}{2\\sqrt{\\sin(x)}}\\)", "\\(\\sqrt{\\cos(x)}\\)"], 
        correct: 0 
    },
    { 
        question: "f(x) = \\(x \\cdot 2^x\\). Найдите f'(x)", 
        options: ["\\(2^x + x \\cdot 2^x \\cdot \\ln(2)\\)", "\\(2^x\\)", "\\(x \\cdot 2^x\\)", "\\(2^x \\cdot \\ln(2)\\)"], 
        correct: 0 
    },
    { 
        question: "f(x) = \\(\\cos(\\ln(x))\\). Найдите f'(x)", 
        options: [ "\\(-\\frac{\\cos(\\ln(x))}{x}\\)","\\(-\\sin(\\ln(x))\\)", "\\(-\\frac{\\sin(\\ln(x))}{x}\\)", "\\(\\frac{\\sin(\\ln(x))}{x}\\)"], 
        correct: 2 
    },
    { 
        question: "f(x) = \\(\\sqrt{1 + x^2}\\). Найдите f'(x)", 
        options: ["\\(\\frac{x}{\\sqrt{1 + x^2}}\\)", "\\(\\frac{1}{2\\sqrt{1+x^2}}\\)", "\\(\\sqrt{1+x^2}\\)", "\\(x\\sqrt{1+x^2}\\)"], 
        correct: 0 
    },
    { 
        question: "f(x) = \\(\\sin(x) \\cdot \\cos(2x)\\). Найдите f'(x)", 
        options: ["\\(\\cos(x)\\cos(2x) - 2\\sin(x)\\sin(2x)\\)", "\\(\\cos(x)\\cos(2x)\\)", "\\(-2\\sin(x)\\sin(2x)\\)", "\\(\\cos(3x)\\)"], 
        correct: 0 
    },
    { 
        question: "f(x) = \\(\\ln(x^2 + x)\\). Найдите f'(x)", 
        options: [ "\\(\\frac{1}{x^2 + x}\\)","\\(\\frac{2x + 1}{x^2 + x}\\)", "\\(\\frac{2x}{x^2 + x}\\)", "\\(\\frac{2x + 1}{x}\\)"], 
        correct: 1 
    },
    { 
        question: "f(x) = \\(e^{-x^2}\\). Найдите f'(x)", 
        options: ["\\(-2x \\cdot e^{-x^2}\\)", "\\(-e^{-x^2}\\)", "\\(2x \\cdot e^{-x^2}\\)", "\\(-2x \\cdot e^{-2x}\\)"], 
        correct: 0 
    },
    { 
        question: "f(x) = \\(\\left(x + \\frac{1}{x}\\right)^2\\). Найдите f'(x)", 
        options: [ "\\(2\\left(x + \\frac{1}{x}\\right)\\)","\\(2\\left(x - \\frac{1}{x^3}\\right)\\)", "\\(2\\left(1 - \\frac{1}{x^2}\\right)\\)", "\\(4x - \\frac{2}{x^3}\\)"], 
        correct: 1 
    },
    { 
        question: "f(x) = \\(\\arctan(\\sqrt{x})\\). Найдите f'(x)", 
        options: ["\\(\\frac{1}{2\\sqrt{x}(1 + x)}\\)", "\\(\\frac{1}{1 + x}\\)", "\\(\\frac{1}{2\\sqrt{x}}\\)", "\\(\\frac{\\sqrt{x}}{1 + x}\\)"], 
        correct: 0 
    },
    { 
        question: "f(x) = \\(x \\cdot \\sin\\left(\\frac{1}{x}\\right)\\). Найдите f'(x)", 
        options: ["\\(\\sin\\left(\\frac{1}{x}\\right) + \\frac{\\cos\\left(\\frac{1}{x}\\right)}{x}\\)", "\\(\\sin\\left(\\frac{1}{x}\\right) + \\cos\\left(\\frac{1}{x}\\right)\\)", "\\(\\sin\\left(\\frac{1}{x}\\right) - \\frac{\\cos\\left(\\frac{1}{x}\\right)}{x}\\)", "\\(\\sin\\left(\\frac{1}{x}\\right) - \\cos\\left(\\frac{1}{x}\\right)\\)"], 
        correct: 2 
    },
    { 
        question: "f(x) = \\(\\frac{e^x - e^{-x}}{2}\\). Найдите f'(x)", 
        options: ["\\(\\frac{e^x + e^{-x}}{2}\\)", "\\(\\frac{e^x}{2}\\)", "\\(\\frac{e^x - e^{-x}}{2}\\)", "\\(\\cosh(x)\\)"], 
        correct: 0 
    },
    { 
        question: "f(x) = \\(\\ln|\\sec(x)|\\). Найдите f'(x)", 
        options: ["\\(\\tan(x)\\)", "\\(\\sec(x)\\tan(x)\\)", "\\(\\frac{1}{\\sec(x)}\\)", "\\(\\cos(x)\\)"], 
        correct: 0 
    },
    { 
        question: "f(x) = \\(x^2 \\cdot e^{3x}\\). Найдите f'(x)", 
        options: ["\\(e^{3x}(2x - 3x^2)\\)", "\\(2x e^{3x}\\)", "\\(3x^2 e^{3x}\\)", "\\(e^{3x}(2x + 3x^2)\\)"], 
        correct: 3 
    },
    { 
        question: "f(x) = \\(\\sin(x^2)\\). Найдите f'(x)", 
        options: ["\\(2x\\cos(x^2)\\)", "\\(\\cos(x^2)\\)", "\\(2x\\sin(x^2)\\)", "\\(x\\cos(x^2)\\)"], 
        correct: 0 
    },
    { 
        question: "f(x) = \\((2x - 1)^3\\). Найдите f'(x)", 
        options: ["\\(6(2x - 1)^2\\)", "\\(3(2x - 1)^2\\)", "\\(2(2x - 1)^2\\)", "\\(6x(2x - 1)^2\\)"], 
        correct: 0 
    },
    { 
        question: "f(x) = \\(\\frac{x}{\\sqrt{1 - x^2}}\\). Найдите f'(x)", 
        options: ["\\(\\frac{x}{1-x^2}\\)", "\\(\\frac{-1}{(1 - x^2)^{3/2}}\\)", "\\(\\frac{1}{\\sqrt{1-x^2}}\\)", "\\(\\frac{1}{(1 - x^2)^{3/2}}\\)"], 
        correct: 3 
    },
    { 
        question: "f(x) = \\(e^{2x} \\cdot \\cos(3x)\\). Найдите f'(x)", 
        options: ["\\(e^{2x}(cos(3x) - 3\\sin(3x))\\)", "\\(e^{2x}\\cos(3x) - e^{2x}\\sin(3x)\\)", "\\(2e^{2x}\\cos(3x)\\)", "\\(e^{2x}(2\\cos(3x) - 3\\sin(3x))\\)"], 
        correct: 3 
    },
    { 
        question: "f(x) = \\(\\ln\\left(\\frac{x+1}{x-1}\\right)\\). Найдите f'(x)", 
        options: ["\\(-\\frac{2}{x^2 - 1}\\)", "\\(\\frac{1}{x+1} - \\frac{1}{x-1}\\)", "\\(\\frac{2}{1-x^2}\\)", "\\(\\frac{x-1 - x-1}{x^2-1}\\)"], 
        correct: 0 
    },
    { 
        question: "f(x) = \\(x \\cdot \\arcsin(x)\\). Найдите f'(x)", 
        options: ["\\(\\arcsin(x) + \\frac{x}{\\sqrt{1-x^2}}\\)", "\\(\\frac{1}{\\sqrt{1-x^2}}\\)", "\\(\\arcsin(x) + \\frac{1}{\\sqrt{1-x^2}}\\)", "\\(\\frac{x}{\\sqrt{1-x^2}}\\)"], 
        correct: 0 
    },
    { 
        question: "f(x) = \\((\\sin(x) + x)^2\\). Найдите f'(x)", 
        options: [ "\\(2(\\sin(x)+x)\\)", "\\(2(\\cos(x)+1)\\)","\\(2(\\sin(x)+x)(\\cos(x)+1)\\)", "\\(2\\sin(x)\\cos(x) + 2x\\)"], 
        correct: 2 
    },
    { 
        question: "f(x) = \\(e^{\\ln(x^2)}\\). Найдите f'(x)", 
        options: ["\\(2x\\)", "\\(e^{2\\ln(x)}\\)", "\\(2x e^{\\ln(x^2)}\\)", "\\(x^2\\)"], 
        correct: 0 
    },
    { 
        question: "f(x) = \\(\\sqrt{x^2 + 4x}\\). Найдите f'(x)", 
        options: ["\\(\\frac{x + 2}{\\sqrt{x^2 + 4x}}\\)", "\\(\\frac{1}{2\\sqrt{x^2+4x}}\\)", "\\(\\frac{2x+4}{\\sqrt{x^2+4x}}\\)", "\\(\\sqrt{2x+4}\\)"], 
        correct: 0 
    },
    { 
        question: "f(x) = \\(\\cos(2x) \\cdot \\sin(3x)\\). Найдите f'(x)", 
        options: ["\\(-2\\sin(2x)\\sin(3x) + 3\\cos(2x)\\cos(3x)\\)", "\\(-\\sin(2x)\\sin(3x) + \\cos(2x)\\cos(3x)\\)", "\\(-2\\sin(2x) + 3\\cos(3x)\\)", "\\(\\cos(5x)\\)"], 
        correct: 0 
    },
    { 
        question: "f(x) = \\(\\frac{x^2 + 1}{x}\\). Найдите f'(x)", 
        options: ["\\(1 - \\frac{1}{x^2}\\)", "\\(2x - \\frac{1}{x^2}\\)", "\\(\\frac{2x}{x}\\)", "\\(\\frac{2x \\cdot x - (x^2+1)}{x^2}\\)"], 
        correct: 0 
    },
    { 
        question: "f(x) = \\(\\tan(x^2)\\). Найдите f'(x)", 
        options: ["\\(2x \\cdot \\sec^2(x^2)\\)", "\\(\\sec^2(x^2)\\)", "\\(2x \\cdot \\tan(x^2)\\)", "\\(x \\cdot \\sec^2(x^2)\\)"], 
        correct: 0 
    },
    { 
        question: "f(x) = \\(e^{x} \\cdot \\sin(x) \\cdot \\cos(x)\\). Найдите f'(x)", 
        options: ["\\(e^x(\\sin(x)\\cos(x) + \\cos^2(x) - \\sin^2(x))\\)", "\\(e^x(\\cos^2(x) - \\sin^2(x))\\)", "\\(e^x(\\sin(x)\\cos(x))\\)", "\\(2e^x\\cos(2x))\\)"], 
        correct: 0 
    },
    { 
        question: "f(x) = \\(\\ln(x + \\sqrt{x^2+1})\\). Найдите f'(x)", 
        options: ["\\(\\frac{1}{\\sqrt{x^2+1}}\\)", "\\(\\frac{1 + \\frac{x}{\\sqrt{x^2+1}}}{x+\\sqrt{x^2+1}}\\)", "\\(\\frac{x}{\\sqrt{x^2+1}}\\)", "\\(\\sqrt{x^2+1}\\)"], 
        correct: 0 
    },
    { 
        question: "f(x) = \\(\\frac{1 - \\cos(2x)}{2}\\). Найдите f'(x)", 
        options: [ "\\(\\sin(x)\\cos(x)\\)","\\(\\sin(2x)\\)", "\\(\\cos(2x)\\)", "\\(2\\sin(2x)\\)"], 
        correct: 1 
    },
    { 
        question: "f(x) = \\(x^2 \\cdot \\ln(2x)\\). Найдите f'(x)", 
        options: ["\\(\\frac{x}{2} + 2x\\ln(2x)\\)", "\\(2x\\ln(2x)\\)", "\\(2x\\ln(2x) + x\\)", "\\(x + x\\ln(2x)\\)"], 
        correct: 2 
    },
    { 
        question: "f(x) = \\(\\sin\\left(\\frac{1}{x}\\right)\\). Найдите f'(x)", 
        options: ["\\(-\\frac{\\cos\\left(\\frac{1}{x}\\right)}{x^2}\\)", "\\(\\cos\\left(\\frac{1}{x}\\right)\\)", "\\(-\\cos\\left(\\frac{1}{x}\\right)\\)", "\\(\\frac{\\cos\\left(\\frac{1}{x}\\right)}{x^2}\\)"], 
        correct: 0 
    },
    { 
        question: "f(x) = \\((e^x + e^{-x})^2\\). Найдите f'(x)", 
        options: ["\\(2(e^{2x} + e^{-2x})\\)", "\\(2(e^x+e^{-x})\\)", "\\(4(e^{2x} - e^{-2x})\\)", "\\(2(e^{2x} - e^{-2x})\\)"], 
        correct: 3 
    }
];


// Сложные вопросы
   const hardDerivativesQuestions = [
           {
        question: "Найдите производную функции $f(x) = e^{\\sin(x^2)}$",
        options: [
            "$f'(x) = 2x \\cos(x^2) e^{\\sin(x^2)}$",
            "$f'(x) = \\cos(x^2) e^{\\sin(x^2)}$", 
            "$f'(x) = e^{\\cos(x^2)}$",
            "$f'(x) = 2x e^{\\sin(x^2)}$"
        ],
        correct: 0
    },
    {
        question: "Найдите производную функции $f(x) = \\ln(\\sqrt[3]{x^2 + 1})$",
        options: [
            "$f'(x) = \\frac{2x}{3(x^2 + 1)}$",
            "$f'(x) = \\frac{1}{3\\sqrt[3]{(x^2 + 1)^2}}$",
            "$f'(x) = \\frac{2x}{x^2 + 1}$",
            "$f'(x) = \\frac{3}{2x}$"
        ],
        correct: 0
    },
    {
        question: "Найдите производную функции $f(x) = \\arctan(\\ln x)$",
        options: [
            "$f'(x) = \\frac{1}{x(1 + (\\ln x)^2)}$",
            "$f'(x) = \\frac{1}{1 + x^2}$",
            "$f'(x) = \\frac{\\ln x}{1 + x^2}$",
            "$f'(x) = \\frac{1}{x\\sqrt{1 - (\\ln x)^2}}$"
        ],
        correct: 0
    },
    {
        question: "Найдите производную функции $f(x) = \\sin(2^x)$",
        options: [
            "$f'(x) = 2^x \\ln 2 \\cdot \\cos(2^x)$",
            "$f'(x) = \\cos(2^x)$",
            "$f'(x) = x2^{x-1} \\cos(2^x)$",
            "$f'(x) = 2^x \\cos(2^x)$"
        ],
        correct: 0
    },
    {
        question: "Найдите производную функции $f(x) = \\sqrt{\\tan(3x)}$",
        options: [
            "$f'(x) = \\frac{3\\sec^2(3x)}{2\\sqrt{\\tan(3x)}}$",
            "$f'(x) = \\frac{\\sec^2(3x)}{\\sqrt{\\tan(3x)}}$",
            "$f'(x) = \\frac{3}{2\\sqrt{\\tan(3x)}}$",
            "$f'(x) = \\sqrt{\\sec^2(3x)}$"
        ],
        correct: 0
    },
    {
        question: "Найдите производную функции $f(x) = x^{\\sin x}$ (используйте логарифмическое дифференцирование)",
        options: [
            "$f'(x) = x^{\\sin x}(\\frac{\\sin x}{x} + \\cos x \\cdot \\ln x)$",
            "$f'(x) = \\sin x \\cdot x^{\\sin x - 1}$",
            "$f'(x) = x^{\\sin x} \\cos x$",
            "$f'(x) = x^{\\sin x} \\ln x$"
        ],
        correct: 0
    },
    {
        question: "Найдите производную функции $f(x) = \\arcsin(\\sqrt{x})$",
        options: [
            "$f'(x) = \\frac{1}{2\\sqrt{x(1 - x)}}$",
            "$f'(x) = \\frac{1}{\\sqrt{1 - x}}$",
            "$f'(x) = \\frac{1}{2\\sqrt{1 - x}}$",
            "$f'(x) = \\frac{\\sqrt{x}}{1 - x}$"
        ],
        correct: 0
    },
    {
        question: "Найдите производную функции $f(x) = \\cos(e^{x^2})$",
        options: [
            "$f'(x) = -2x e^{x^2} \\sin(e^{x^2})$",
            "$f'(x) = -e^{x^2} \\sin(e^{x^2})$",
            "$f'(x) = 2x \\sin(e^{x^2})$",
            "$f'(x) = -\\sin(e^{x^2})$"
        ],
        correct: 0
    },
    {
        question: "Найдите производную функции $f(x) = \\ln(\\cosh x)$",
        options: [
            "$f'(x) = \\tanh x$",
            "$f'(x) = \\frac{1}{\\cosh x}$",
            "$f'(x) = \\sinh x$",
            "$f'(x) = \\frac{\\sinh x}{\\cosh x}$"
        ],
        correct: 0
    },
    {
        question: "Найдите производную функции $f(x) = \\frac{e^{-x}}{x^2 + 1}$",
        options: [
            "$f'(x) = -\\frac{e^{-x}(x^2 + 2x + 1)}{(x^2 + 1)^2}$",
            "$f'(x) = \\frac{e^{-x}(x^2 - 1)}{(x^2 + 1)^2}$",
            "$f'(x) = -\\frac{e^{-x}}{x^2 + 1}$",
            "$f'(x) = \\frac{e^{-x}(2x - 1)}{(x^2 + 1)^2}$"
        ],
        correct: 0
    },
    {
        question: "Найдите производную функции $f(x) = \\sqrt[4]{\\ln(1 + x^2)}$",
        options: [
            "$f'(x) = \\frac{x}{2(1 + x^2)(\\ln(1 + x^2))^{3/4}}$",
            "$f'(x) = \\frac{1}{4(\\ln(1 + x^2))^{3/4}}$",
            "$f'(x) = \\frac{x}{(1 + x^2)\\sqrt[4]{\\ln(1 + x^2)}}$",
            "$f'(x) = \\frac{2x}{\\sqrt[4]{(1 + x^2)^3}}$"
        ],
        correct: 0
    },
    {
        question: "Найдите производную функции $f(x) = \\arctan(\\sinh x)$",
        options: [
            "$f'(x) = \\frac{\\cosh x}{1 + \\sinh^2 x}$",
            "$f'(x) = \\frac{1}{\\cosh x}$",
            "$f'(x) = \\frac{\\sinh x}{1 + \\cosh^2 x}$",
            "$f'(x) = \\frac{1}{1 + \\sinh^2 x}$"
        ],
        correct: 0
    },
    {
        question: "Найдите производную функции $f(x) = (1 + x^2)^{\\cos x}$",
        options: [
            "$f'(x) = (1 + x^2)^{\\cos x}(\\frac{2x \\cos x}{1 + x^2} - \\sin x \\cdot \\ln(1 + x^2))$",
            "$f'(x) = \\cos x (1 + x^2)^{\\cos x - 1} \\cdot 2x$",
            "$f'(x) = (1 + x^2)^{\\cos x} \\ln(1 + x^2)$",
            "$f'(x) = -\\sin x (1 + x^2)^{\\cos x}$"
        ],
        correct: 0
    },
    {
        question: "Найдите производную функции $f(x) = \\frac{\\sin(\\sqrt{x})}{e^x}$",
        options: [
            "$f'(x) = \\frac{e^{-x}(\\cos(\\sqrt{x}) - 2\\sqrt{x} \\sin(\\sqrt{x}))}{2\\sqrt{x}}$",
            "$f'(x) = \\frac{\\cos(\\sqrt{x})}{2\\sqrt{x} e^x}$",
            "$f'(x) = \\frac{\\sin(\\sqrt{x}) - \\cos(\\sqrt{x})}{e^x}$",
            "$f'(x) = \\frac{e^{-x}}{2\\sqrt{x}}(\\cos(\\sqrt{x}) - \\sin(\\sqrt{x}))$"
        ],
        correct: 0
    },
    {
        question: "Найдите производную функции $f(x) = \\ln|\\sec(x^2) + \\tan(x^2)|$",
        options: [
            "$f'(x) = 2x \\sec(x^2)$",
            "$f'(x) = \\sec(x^2)$",
            "$f'(x) = \\frac{2x}{\\cos(x^2)}$",
            "$f'(x) = x \\sec(x^2) \\tan(x^2)$"
        ],
        correct: 0
    },
    {
        question: "Найдите производную функции $f(x) = \\sqrt{x + \\sqrt{x + \\sqrt{x}}}$",
        options: [
            "$f'(x) = \\frac{1 + \\frac{1 + \\frac{1}{2\\sqrt{x}}}{2\\sqrt{x + \\sqrt{x}}}}{2\\sqrt{x + \\sqrt{x + \\sqrt{x}}}}$",
            "$f'(x) = \\frac{1}{2\\sqrt{x + \\sqrt{x + \\sqrt{x}}}}$",
            "$f'(x) = \\frac{1}{2\\sqrt{x}} \\cdot \\frac{1}{2\\sqrt{x + \\sqrt{x}}} \\cdot \\frac{1}{2\\sqrt{x + \\sqrt{x + \\sqrt{x}}}}$",
            "$f'(x) = \\frac{1}{4\\sqrt{x + \\sqrt{x + \\sqrt{x}}}}$"
        ],
        correct: 0
    },
    {
        question: "Найдите производную функции $f(x) = \\arcsin(\\cos x)$",
        options: [
            "$f'(x) = -\\frac{\\sin x}{\\sqrt{1 - \\cos^2 x}}$",
            "$f'(x) = \\frac{\\sin x}{\\sqrt{1 - \\cos^2 x}}$",
            "$f'(x) = -\\frac{1}{\\sqrt{1 - \\cos^2 x}}$",
            "$f'(x) = \\frac{\\cos x}{\\sqrt{1 - \\sin^2 x}}$"
        ],
        correct: 0
    },
    {
        question: "Найдите производную функции $f(x) = x \\arctan(x) - \\frac{1}{2}\\ln(1 + x^2)$",
        options: [
            "$f'(x) = \\arctan(x)$",
            "$f'(x) = x \\arctan(x)$",
            "$f'(x) = \\frac{x}{1 + x^2}$",
            "$f'(x) = \\arctan(x) + \\frac{x}{1 + x^2}$"
        ],
        correct: 0
    },
    {
        question: "Найдите производную функции $f(x) = \\frac{\\sqrt[3]{\\sin x}}{e^{2x}}$",
        options: [
            "$f'(x) = \\frac{e^{-2x}(\\cos x - 6\\sqrt[3]{\\sin^2 x})}{3\\sqrt[3]{\\sin^2 x}}$",
            "$f'(x) = \\frac{\\cos x}{3e^{2x}\\sqrt[3]{\\sin^2 x}}$",
            "$f'(x) = \\frac{\\sqrt[3]{\\sin x}(\\cos x - 6\\sin x)}{3e^{2x}\\sqrt[3]{\\sin^2 x}}$",
            "$f'(x) = -\\frac{2\\sqrt[3]{\\sin x}}{e^{2x}}$"
        ],
        correct: 0
    },
    {
        question: "Найдите производную функции $f(x) = \\ln\\left(\\frac{\\sqrt{x + 1} - \\sqrt{x - 1}}{\\sqrt{x + 1} + \\sqrt{x - 1}}\\right)$",
        options: [
            "$f'(x) = -\\frac{1}{\\sqrt{x^2 - 1}}$",
            "$f'(x) = \\frac{1}{\\sqrt{x + 1} - \\sqrt{x - 1}}$",
            "$f'(x) = \\frac{1}{2\\sqrt{x^2 - 1}}$",
            "$f'(x) = -\\frac{1}{x\\sqrt{x^2 - 1}}$"
        ],
        correct: 0
    },
    {
        question: "Найдите производную функции $f(x) = \\sin(x \\ln x)$",
        options: [
            "$f'(x) = (\\ln x + 1) \\cos(x \\ln x)$",
            "$f'(x) = \\cos(x \\ln x)$",
            "$f'(x) = \\frac{\\cos(x \\ln x)}{x}$",
            "$f'(x) = \\ln x \\cdot \\cos(x \\ln x)$"
        ],
        correct: 1
    },
    {
        question: "Найдите производную функции $f(x) = \\frac{\\arctan(2x)}{\\sqrt{1 + 4x^2}}$",
        options: [
            "$f'(x) = \\frac{2}{(1 + 4x^2)^{3/2}} - \\frac{4x \\arctan(2x)}{(1 + 4x^2)^{3/2}}$",
            "$f'(x) = \\frac{2}{(1 + 4x^2)^{3/2}}$",
            "$f'(x) = \\frac{1}{(1 + 4x^2)\\sqrt{1 + 4x^2}}$",
            "$f'(x) = \\frac{\\arctan(2x)}{2(1 + 4x^2)^{3/2}}$"
        ],
        correct: 1
    },
    {
        question: "Найдите производную функции $f(x) = \\cos(\\sqrt[3]{x^2 + 1})$",
        options: [
            "$f'(x) = -\\frac{2x \\sin(\\sqrt[3]{x^2 + 1})}{3\\sqrt[3]{(x^2 + 1)^2}}$",
            "$f'(x) = -\\sin(\\sqrt[3]{x^2 + 1})$",
            "$f'(x) = \\frac{2x}{3\\sqrt[3]{(x^2 + 1)^2}}$",
            "$f'(x) = -\\frac{2x}{3}\\sin(\\sqrt[3]{x^2 + 1})$"
        ],
        correct: 1
    },
    {
        question: "Найдите производную функции $f(x) = \\frac{e^{\\sin x} - e^{-\\sin x}}{e^{\\sin x} + e^{-\\sin x}}$",
        options: [
            "$f'(x) = \\frac{2\\cos x}{(e^{\\sin x} + e^{-\\sin x})^2}$",
            "$f'(x) = \\frac{\\cos x}{e^{\\sin x} + e^{-\\sin x}}$",
            "$f'(x) = \\frac{e^{\\sin x} - e^{-\\sin x}}{(e^{\\sin x} + e^{-\\sin x})^2}$",
            "$f'(x) = \\cos x \\cdot \\tanh(\\sin x)$"
        ],
        correct: 1
    },
    {
        question: "Найдите производную функции $f(x) = \\ln\\left(\\frac{x}{\\sqrt{x^2 + 1}}\\right)$",
        options: [
            "$f'(x) = \\frac{1}{x} - \\frac{x}{x^2 + 1}$",
            "$f'(x) = \\frac{1}{x\\sqrt{x^2 + 1}}$",
            "$f'(x) = \\frac{1}{x^2 + 1}$",
            "$f'(x) = \\frac{\\sqrt{x^2 + 1} - x}{x(x^2 + 1)}$"
        ],
        correct: 1
    },
    {
        question: "Найдите производную функции $f(x) = x^{\\arcsin x}$",
        options: [
            "$f'(x) = x^{\\arcsin x}\\left(\\frac{\\arcsin x}{x} + \\frac{\\ln x}{\\sqrt{1 - x^2}}\\right)$",
            "$f'(x) = \\arcsin x \\cdot x^{\\arcsin x - 1}$",
            "$f'(x) = x^{\\arcsin x} \\ln x$",
            "$f'(x) = \\frac{x^{\\arcsin x}}{\\sqrt{1 - x^2}}$"
        ],
        correct: 1
    },
    {
        question: "Найдите производную функции $f(x) = \\sqrt{\\frac{1 - \\cos x}{1 + \\cos x}}$",
        options: [
            "$f'(x) = \\frac{\\sin x}{\\sqrt{(1 - \\cos x)(1 + \\cos x)^3}}$",
            "$f'(x) = \\frac{1}{2\\sqrt{\\frac{1 - \\cos x}{1 + \\cos x}}}$",
            "$f'(x) = \\frac{\\sin x}{(1 + \\cos x)^2}$",
            "$f'(x) = \\frac{1}{\\sin x}$"
        ],
        correct: 1
    },
    {
        question: "Найдите производную функции $f(x) = \\frac{\\sin(ax)}{\\cos(bx)}$",
        options: [
            "$f'(x) = \\frac{a \\cos(ax) \\cos(bx) + b \\sin(ax) \\sin(bx)}{\\cos^2(bx)}$",
            "$f'(x) = \\frac{a \\cos(ax)}{\\cos(bx)}$",
            "$f'(x) = \\frac{a \\cos(ax) \\cos(bx) - b \\sin(ax) \\sin(bx)}{\\cos^2(bx)}$",
            "$f'(x) = \\frac{\\cos(ax)}{\\cos(bx)} + \\frac{\\sin(ax) \\sin(bx)}{\\cos^2(bx)}$"
        ],
        correct: 1
    },
    {
        question: "Найдите производную функции $f(x) = \\ln(\\sinh(\\sqrt{x}))$",
        options: [
            "$f'(x) = \\frac{\\cosh(\\sqrt{x})}{2\\sqrt{x} \\sinh(\\sqrt{x})}$",
            "$f'(x) = \\frac{1}{2\\sqrt{x} \\tanh(\\sqrt{x})}$",
            "$f'(x) = \\frac{1}{\\sinh(\\sqrt{x})}$",
            "$f'(x) = \\frac{\\cosh(\\sqrt{x})}{\\sqrt{x}}$"
        ],
        correct: 1
    },
    {
        question: "Найдите производную функции $f(x) = \\arctan(\\sqrt{\\frac{1 - x}{1 + x}})$",
        options: [
            "$f'(x) = -\\frac{1}{2\\sqrt{1 - x^2}}$",
            "$f'(x) = \\frac{1}{2(1 + x)\\sqrt{1 - x}}$",
            "$f'(x) = -\\frac{1}{\\sqrt{1 - x^2}}$",
            "$f'(x) = \\frac{1}{2\\sqrt{1 - x^2}}$"
        ],
        correct: 1
    },
    {
        question: "Найдите производную функции $f(x) = e^{x \\sin x} \\cos(x \\cos x)$",
        options: [
            "$f'(x) = e^{x \\sin x}[(\\sin x + x \\cos x) \\cos(x \\cos x) - (\\cos x - x \\sin x) \\sin(x \\cos x)]$",
            "$f'(x) = e^{x \\sin x}[\\sin x \\cos(x \\cos x) - \\cos x \\sin(x \\cos x)]$",
            "$f'(x) = e^{x \\sin x}(\\sin x + x \\cos x) \\cos(x \\cos x)$",
            "$f'(x) = e^{x \\sin x}(\\cos x - x \\sin x) \\sin(x \\cos x)$"
        ],
        correct: 2
    },
    {
        question: "Найдите производную функции $f(x) = \\frac{\\sqrt{x^2 + a^2} - \\sqrt{x^2 - a^2}}{\\sqrt{x^2 + a^2} + \\sqrt{x^2 - a^2}}$",
        options: [
            "$f'(x) = \\frac{2a^2x}{\\sqrt{x^2 + a^2}\\sqrt{x^2 - a^2}(\\sqrt{x^2 + a^2} + \\sqrt{x^2 - a^2})^2}$",
            "$f'(x) = \\frac{x}{\\sqrt{x^2 + a^2}} - \\frac{x}{\\sqrt{x^2 - a^2}}$",
            "$f'(x) = \\frac{1}{(\\sqrt{x^2 + a^2} + \\sqrt{x^2 - a^2})^2}$",
            "$f'(x) = \\frac{2x}{\\sqrt{x^2 + a^2}\\sqrt{x^2 - a^2}}$"
        ],
        correct: 2
    },
    {
        question: "Найдите производную функции $f(x) = \\ln\\left(\\frac{\\sqrt{1 + e^x} - \\sqrt{1 - e^x}}{\\sqrt{1 + e^x} + \\sqrt{1 - e^x}}\\right)$",
        options: [
            "$f'(x) = \\frac{e^x}{\\sqrt{1 - e^{2x}}}$",
            "$f'(x) = \\frac{1}{\\sqrt{1 - e^{2x}}}$",
            "$f'(x) = \\frac{e^x}{2\\sqrt{1 - e^{2x}}}$",
            "$f'(x) = \\frac{1}{2\\sqrt{1 - e^{2x}}}$"
        ],
        correct: 2
    },
    {
        question: "Найдите производную функции $f(x) = \\sin(\\arctan(\\sqrt{x}))$",
        options: [
            "$f'(x) = \\frac{1}{2\\sqrt{x}(1 + x)}$",
            "$f'(x) = \\frac{\\cos(\\arctan(\\sqrt{x}))}{1 + x}$",
            "$f'(x) = \\frac{1}{2(1 + x)\\sqrt{x}}$",
            "$f'(x) = \\frac{\\sqrt{x}}{2(1 + x)^{3/2}}$"
        ],
        correct: 2
    },
    {
        question: "Найдите производную функции $f(x) = \\frac{\\arcsin(3x)}{\\sqrt{1 - 9x^2}}$",
        options: [
            "$f'(x) = \\frac{3}{(1 - 9x^2)} + \\frac{9x \\arcsin(3x)}{(1 - 9x^2)^{3/2}}$",
            "$f'(x) = \\frac{3}{1 - 9x^2}$",
            "$f'(x) = \\frac{3\\sqrt{1 - 9x^2} + 9x \\arcsin(3x)}{(1 - 9x^2)^{3/2}}$",
            "$f'(x) = \\frac{1}{(1 - 9x^2)^{3/2}}$"
        ],
        correct: 2
    },
    {
        question: "Найдите производную функции $f(x) = x^{x^x}$",
        options: [
            "$f'(x) = x^{x^x} \\cdot x^x \\left(\\frac{1}{x} + \\ln x + (\\ln x)^2\\right)$",
            "$f'(x) = x^{x^x} \\cdot x^x (\\ln x + 1)$",
            "$f'(x) = x^{x^x} \\cdot x^{x-1} \\cdot x$",
            "$f'(x) = x^{x^x} \\ln x$"
        ],
        correct: 2
    },
    {
        question: "Найдите производную функции $f(x) = \\frac{\\tan(\\sqrt[3]{x})}{\\ln(1 + x^2)}$",
        options: [
            "$f'(x) = \\frac{\\frac{\\sec^2(\\sqrt[3]{x})}{3\\sqrt[3]{x^2}} \\ln(1 + x^2) - \\tan(\\sqrt[3]{x}) \\cdot \\frac{2x}{1 + x^2}}{\\ln^2(1 + x^2)}$",
            "$f'(x) = \\frac{\\sec^2(\\sqrt[3]{x})}{3\\sqrt[3]{x^2} \\ln(1 + x^2)}$",
            "$f'(x) = \\frac{\\tan(\\sqrt[3]{x})}{\\ln(1 + x^2)} \\left(\\frac{\\sec^2(\\sqrt[3]{x})}{3\\sqrt[3]{x^2} \\tan(\\sqrt[3]{x})} - \\frac{2x}{(1 + x^2)\\ln(1 + x^2)}\\right)$",
            "$f'(x) = \\frac{1}{3\\sqrt[3]{x^2}\\ln(1 + x^2)}$"
        ],
        correct: 2
    },
    {
        question: "Найдите производную функции $f(x) = \\cos(\\ln(\\sin(e^x)))$",
        options: [
            "$f'(x) = -\\sin(\\ln(\\sin(e^x))) \\cdot \\frac{e^x \\cos(e^x)}{\\sin(e^x)}$",
            "$f'(x) = -\\frac{e^x \\cos(e^x)}{\\sin(e^x)}$",
            "$f'(x) = -\\sin(\\ln(\\sin(e^x))) \\cdot \\frac{\\cos(e^x)}{\\sin(e^x)}$",
            "$f'(x) = \\sin(\\ln(\\sin(e^x))) \\cdot e^x \\cot(e^x)$"
        ],
        correct: 2
    },
    {
        question: "Найдите производную функции $f(x) = \\frac{\\sqrt{1 + x^2} - 1}{x}$",
        options: [
            "$f'(x) = \\frac{1}{x\\sqrt{1 + x^2}} - \\frac{\\sqrt{1 + x^2} - 1}{x^2}$",
            "$f'(x) = \\frac{1}{\\sqrt{1 + x^2}}$",
            "$f'(x) = \\frac{x}{\\sqrt{1 + x^2}} - \\frac{1}{x^2}$",
            "$f'(x) = \\frac{1}{x^2\\sqrt{1 + x^2}}$"
        ],
        correct: 3
    },
    {
        question: "Найдите производную функции $f(x) = \\arctan(\\frac{\\sqrt{1 + x} - \\sqrt{1 - x}}{\\sqrt{1 + x} + \\sqrt{1 - x}})$",
        options: [
            "$f'(x) = \\frac{1}{\\sqrt{1 - x^2}}$",
            "$f'(x) = \\frac{1}{2\\sqrt{1 - x^2}}$",
            "$f'(x) = \\frac{x}{\\sqrt{1 - x^2}}$",
            "$f'(x) = \\frac{1}{\\sqrt{1 + x} \\sqrt{1 - x}}$"
        ],
        correct: 3
    },
    {
        question: "Найдите производную функции $f(x) = \\ln\\left(\\frac{\\sqrt{1 + \\sin x} + \\sqrt{1 - \\sin x}}{\\sqrt{1 + \\sin x} - \\sqrt{1 - \\sin x}}\\right)$",
        options: [
            "$f'(x) = \\frac{1}{\\sqrt{1 - \\sin^2 x}}$",
            "$f'(x) = \\frac{\\cos x}{\\sin x}$",
            "$f'(x) = \\frac{1}{\\cos x}$",
            "$f'(x) = \\frac{\\cos x}{\\sqrt{1 - \\sin^2 x}}$"
        ],
        correct: 3
    },
    {
        question: "Найдите производную функции $f(x) = \\frac{\\sin(\\arctan x) - \\cos(\\arctan x)}{\\sin(\\arctan x) + \\cos(\\arctan x)}$",
        options: [
            "$f'(x) = \\frac{2}{(1 + x^2)(\\sin(\\arctan x) + \\cos(\\arctan x))^2}$",
            "$f'(x) = \\frac{1}{1 + x^2}$",
            "$f'(x) = \\frac{2}{1 + x^2}$",
            "$f'(x) = \\frac{2x}{(1 + x^2)^2}$"
        ],
        correct: 3
    },
    {
        question: "Найдите производную функции $f(x) = x \\cdot \\arcsin(\\frac{x}{a}) + \\sqrt{a^2 - x^2}$",
        options: [
            "$f'(x) = \\arcsin(\\frac{x}{a})$",
            "$f'(x) = \\frac{x}{\\sqrt{a^2 - x^2}} + \\arcsin(\\frac{x}{a})$",
            "$f'(x) = \\frac{a}{\\sqrt{a^2 - x^2}}$",
            "$f'(x) = \\arcsin(\\frac{x}{a}) + \\frac{x}{\\sqrt{a^2 - x^2}} - \\frac{x}{\\sqrt{a^2 - x^2}}$"
        ],
        correct: 3
    },
    {
        question: "Найдите производную функции $f(x) = \\frac{\\tan(\\ln x) - \\cot(\\ln x)}{\\tan(\\ln x) + \\cot(\\ln x)}$",
        options: [
            "$f'(x) = \\frac{2}{x(\\tan(\\ln x) + \\cot(\\ln x))^2}$",
            "$f'(x) = \\frac{4}{x\\sin^2(2\\ln x)}$",
            "$f'(x) = \\frac{1}{x}\\sin(2\\ln x)$",
            "$f'(x) = \\frac{2}{x}\\cos(2\\ln x)$"
        ],
        correct: 3
    },
    {
        question: "Найдите производную функции $f(x) = \\arctan(\\frac{2x}{1 - x^2})$",
        options: [
            "$f'(x) = \\frac{2}{1 + x^2}$",
            "$f'(x) = \\frac{4x}{(1 - x^2)^2}$",
            "$f'(x) = \\frac{2(1 + x^2)}{(1 - x^2)^2 + 4x^2}$",
            "$f'(x) = \\frac{2}{1 - x^2}$"
        ],
        correct: 3
    },
    {
        question: "Найдите производную функции $f(x) = \\ln\\left(\\sqrt{\\frac{1 - \\cos x}{1 + \\cos x}}\\right)$",
        options: [
            "$f'(x) = \\csc x$",
            "$f'(x) = \\frac{1}{\\sin x}$",
            "$f'(x) = \\frac{\\cos x}{\\sin x}$",
            "$f'(x) = \\frac{1}{\\sin x \\cos x}$"
        ],
        correct: 3
    },
    {
        question: "Найдите производную функции $f(x) = \\frac{\\sqrt{1 + x^2} (x - \\sqrt{1 + x^2})}{x}$",
        options: [
            "$f'(x) = -\\frac{1}{x^2}$",
            "$f'(x) = \\frac{1}{\\sqrt{1 + x^2}}$",
            "$f'(x) = \\frac{x}{\\sqrt{1 + x^2}} - 1$",
            "$f'(x) = \\frac{1}{x^2\\sqrt{1 + x^2}}$"
        ],
        correct: 3
    }
        ];
// легкие интегралы
const easyIntegralsQuestions = [
    {
        question: "Вычислите интеграл $\\int x dx$",
        options: [
            
            "$x^2 + C$",
            "$\\ln(x) + C$",
            "$x + C$",
            "$\\frac{x^2}{2} + C$"
        ],
        correct: 3
    },
    {
        question: "Вычислите интеграл $\\int 2x dx$",
        options: [
            "$x^2 + C$",
            "$2x^2 + C$",
            "$x + C$",
            "$\\frac{x^2}{2} + C$"
        ],
        correct: 0
    },
    {
        question: "Вычислите интеграл $\\int 3 dx$",
        options: [
            "$x^3 + C$",
            "$\\frac{3}{2}x^2 + C$",
            "$3x + C$",
            "$x + C$"
        ],
        correct: 2
    },
    {
        question: "Вычислите интеграл $\\int x^2 dx$",
        options: [
            "$x^3 + C$",
            "$2x + C$",
            "$x^2 + C$",
            "$\\frac{x^3}{3} + C$",
        ],
        correct: 3
    },
    {
        question: "Вычислите интеграл $\\int 5x^4 dx$",
        options: [
            "$x^5 + C$",
            "$5x^5 + C$",
            "$\\frac{5x^5}{5} + C$",
            "$\\frac{x^5}{4} + C$"
        ],
        correct: 0
    },
    {
        question: "Вычислите интеграл $\\int \\frac{1}{x} dx$",
        options: [
            "$x + C$",
            "$\\frac{1}{x^2} + C$",
            "$\\ln|x| + C$",
            "$x^2 + C$"
        ],
        correct: 2
    },
    {
        question: "Вычислите интеграл $\\int 4x^3 dx$",
        options: [
            "$\\frac{4x^4}{3} + C$",
            "$4x^4 + C$",
            "$x^4 + C$",
            "$x^3 + C$"
        ],
        correct: 2
    },
    {
        question: "Вычислите интеграл $\\int (2x + 1) dx$",
        options: [
            "$2x^2 + x + C$",
            "$x^2 + x + C$",
            "$x^2 + 1 + C$",
            "$2x + C$"
        ],
        correct: 1
    },
    {
        question: "Вычислите интеграл $\\int (3x^2 + 2x) dx$",
        options: [
            "$\\frac{3x^3}{2} + \\frac{2x^2}{3} + C$",
            "$3x^3 + 2x^2 + C$",
            "$x^2 + x + C$",
            "$x^3 + x^2 + C$"
        ],
        correct: 3
    },
    {
        question: "Вычислите интеграл $\\int 6 dx$",
        options: [
            
            "$x^6 + C$",
            "$3x + C$",
            "$x + C$",
            "$6x + C$"
        ],
        correct: 3
    },
    {
        question: "Вычислите интеграл $\\int x^3 dx$",
        options: [
            "$x^4 + C$",
            "$3x + C$",
            "$x^3 + C$",
            "$\\frac{x^4}{4} + C$"
        ],
        correct: 3
    },
    {
        question: "Вычислите интеграл $\\int 7x^2 dx$",
        options: [
            "$\\frac{7x^3}{3} + C$",
            "$7x^3 + C$",
            "$x^3 + C$",
            "$\\frac{x^3}{3} + C$"
        ],
        correct: 0
    },
    {
        question: "Вычислите интеграл $\\int 5 dx$",
        options: [
            "$x^5 + C$",
            "$x + C$",
            "$5x + C$",
            "$25x + C$"
        ],
        correct: 2
    },
    {
        question: "Вычислите интеграл $\\int (x^2 + 2) dx$",
        options: [
            "$\\frac{x^2}{2} + 2 + C$",
            "$x^2 + 2x + C$",
            "$\\frac{x^3}{3} + 2x + C$",
            "$x^3 + 2 + C$"
        ],
        correct: 2
    },
    {
        question: "Вычислите интеграл $\\int (3 + x^2) dx$",
        options: [
            "$x^3/3 + 3x + C$",
            "$3 + x^2 + C$",
            "$3x + x^3 + C$",
            "$x^2 + 3x + C$"
        ],
        correct: 0
    }
];
// Средние интегралы
const mediumIntegralsQuestions = [
    { 
        question: "Вычислите \\(\\int x^2  dx\\)", 
        options: ["\\(x^3 + C\\)", "\\(2x + C\\)", "\\(x^2 + C\\)", "\\(\\frac{x^3}{3} + C\\)"], 
        correct: 3 
    },
    { 
        question: "Вычислите \\(\\int \\sin(x)  dx\\)", 
        options: ["\\(\\cos(x) + C\\)", "\\(-\\cos(x) + C\\)", "\\(\\sin(x) + C\\)", "\\(-\\sin(x) + C\\)"], 
        correct: 1 
    },
    { 
        question: "Вычислите \\(\\int e^x  dx\\)", 
        options: ["\\(e^x + C\\)", "\\(xe^x + C\\)", "\\(\\ln(x) + C\\)", "\\(\\frac{e^x}{x} + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int \\frac{1}{x}  dx\\)", 
        options: ["\\(\\ln|x| + C\\)", "\\(x + C\\)", "\\(\\frac{1}{x^2} + C\\)", "\\(-\\frac{1}{x^2} + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int \\cos(x)  dx\\)", 
        options: ["\\(\\sin(x) + C\\)", "\\(-\\sin(x) + C\\)", "\\(\\cos(x) + C\\)", "\\(-\\cos(x) + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int (3x^2 + 2x + 1)  dx\\)", 
        options: ["\\(x^3 + x^2 + x + C\\)", "\\(6x + 2 + C\\)", "\\(3x^3 + 2x^2 + x + C\\)", "\\(x^3 + x^2 + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int \\frac{1}{x^2}  dx\\)", 
        options: ["\\(-\\frac{1}{x} + C\\)", "\\(\\frac{1}{x} + C\\)", "\\(\\ln|x| + C\\)", "\\(-\\frac{1}{2x^2} + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int \\sqrt{x}  dx\\)", 
        options: ["\\(\\frac{2}{3}x^{3/2} + C\\)", "\\(\\frac{1}{2\\sqrt{x}} + C\\)", "\\(\\sqrt{x} + C\\)", "\\(\\frac{3}{2}x^{3/2} + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int (x^3 - 2x + 5)  dx\\)", 
        options: ["\\(\\frac{x^4}{4} - x^2 + 5x + C\\)", "\\(3x^2 - 2 + C\\)", "\\(x^4 - x^2 + 5x + C\\)", "\\(\\frac{x^3}{3} - x^2 + 5x + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int \\frac{1}{\\sqrt{x}}  dx\\)", 
        options: ["\\(2\\sqrt{x} + C\\)", "\\(\\frac{1}{2\\sqrt{x}} + C\\)", "\\(\\sqrt{x} + C\\)", "\\(-\\frac{1}{2x^{3/2}} + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int \\sec^2(x)  dx\\)", 
        options: ["\\(\\tan(x) + C\\)", "\\(\\sec(x) + C\\)", "\\(\\sec(x)\\tan(x) + C\\)", "\\(\\cot(x) + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int (e^x + \\sin(x))  dx\\)", 
        options: ["\\(e^x - \\cos(x) + C\\)", "\\(e^x + \\cos(x) + C\\)", "\\(e^x - \\sin(x) + C\\)", "\\(e^x + \\sin(x) + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int \\frac{2x}{x^2 + 1}  dx\\)", 
        options: ["\\(\\ln|x^2 + 1| + C\\)", "\\(\\frac{1}{x^2 + 1} + C\\)", "\\(2\\ln|x^2 + 1| + C\\)", "\\(\\arctan(x) + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int x\\cdot e^{x^2}  dx\\)", 
        options: ["\\(\\frac{1}{2}e^{x^2} + C\\)", "\\(e^{x^2} + C\\)", "\\(2x e^{x^2} + C\\)", "\\(\\frac{1}{x}e^{x^2} + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int \\frac{1}{1 + x^2}  dx\\)", 
        options: ["\\(\\arctan(x) + C\\)", "\\(\\ln|1 + x^2| + C\\)", "\\(\\frac{1}{2}\\ln|1 + x^2| + C\\)", "\\(\\arcsin(x) + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int \\sin(2x)  dx\\)", 
        options: ["\\(-\\frac{1}{2}\\cos(2x) + C\\)", "\\(-\\cos(2x) + C\\)", "\\(\\frac{1}{2}\\cos(2x) + C\\)", "\\(2\\cos(2x) + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int \\frac{x}{\\sqrt{1 - x^2}}  dx\\)", 
        options: ["\\(-\\sqrt{1 - x^2} + C\\)", "\\(\\sqrt{1 - x^2} + C\\)", "\\(\\frac{1}{2\\sqrt{1 - x^2}} + C\\)", "\\(\\arcsin(x) + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int \\ln(x)  dx\\)", 
        options: ["\\(x\\ln(x) - x + C\\)", "\\(\\frac{1}{x} + C\\)", "\\(\\ln(x) + C\\)", "\\(x\\ln(x) + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int \\cos(3x)  dx\\)", 
        options: ["\\(\\frac{1}{3}\\sin(3x) + C\\)", "\\(3\\sin(3x) + C\\)", "\\(\\sin(3x) + C\\)", "\\(-\\frac{1}{3}\\sin(3x) + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int \\frac{e^x}{e^x + 1}  dx\\)", 
        options: ["\\(\\ln|e^x + 1| + C\\)", "\\(\\frac{1}{e^x + 1} + C\\)", "\\(e^x\\ln|e^x + 1| + C\\)", "\\(\\arctan(e^x) + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int x\\cdot\\cos(x^2)  dx\\)", 
        options: ["\\(\\frac{1}{2}\\sin(x^2) + C\\)", "\\(\\sin(x^2) + C\\)", "\\(2x\\sin(x^2) + C\\)", "\\(\\cos(x^2) + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int \\frac{1}{x\\ln(x)}  dx\\)", 
        options: ["\\(\\ln|\\ln(x)| + C\\)", "\\(\\frac{1}{\\ln(x)} + C\\)", "\\(\\ln(x) + C\\)", "\\(\\frac{1}{x\\ln(x)} + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int \\tan(x)  dx\\)", 
        options: ["\\(-\\ln|\\cos(x)| + C\\)", "\\(\\ln|\\cos(x)| + C\\)", "\\(\\sec^2(x) + C\\)", "\\(\\ln|\\sin(x)| + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int \\frac{2x + 1}{x^2 + x}  dx\\)", 
        options: ["\\(\\ln|x^2 + x| + C\\)", "\\(\\frac{1}{x^2 + x} + C\\)", "\\(2\\ln|x^2 + x| + C\\)", "\\(\\arctan(x^2 + x) + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int e^{3x}  dx\\)", 
        options: ["\\(\\frac{1}{3}e^{3x} + C\\)", "\\(3e^{3x} + C\\)", "\\(e^{3x} + C\\)", "\\(\\frac{1}{x}e^{3x} + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int \\frac{1}{\\sqrt{1 - x^2}}  dx\\)", 
        options: ["\\(\\arcsin(x) + C\\)", "\\(\\arccos(x) + C\\)", "\\(\\ln|\\sqrt{1 - x^2}| + C\\)", "\\(\\arctan(x) + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int x\\cdot\\sqrt{x^2 + 1}  dx\\)", 
        options: ["\\(\\frac{1}{3}(x^2 + 1)^{3/2} + C\\)", "\\(\\sqrt{x^2 + 1} + C\\)", "\\(\\frac{1}{2}\\sqrt{x^2 + 1} + C\\)", "\\(\\frac{2}{3}(x^2 + 1)^{3/2} + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int \\frac{\\cos(x)}{\\sin(x)}  dx\\)", 
        options: ["\\(\\ln|\\sin(x)| + C\\)", "\\(-\\ln|\\sin(x)| + C\\)", "\\(\\tan(x) + C\\)", "\\(\\cot(x) + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int (x^2 + 2)^2  dx\\)", 
        options: ["\\(\\frac{x^5}{5} + \\frac{4x^3}{3} + 4x + C\\)", "\\(2x(x^2 + 2) + C\\)", "\\(x^4 + 4x^2 + 4 + C\\)", "\\(\\frac{x^3}{3} + 2x^2 + 4x + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int \\frac{1}{x^2 + 4}  dx\\)", 
        options: ["\\(\\frac{1}{2}\\arctan(\\frac{x}{2}) + C\\)", "\\(\\arctan(\\frac{x}{2}) + C\\)", "\\(\\frac{1}{4}\\arctan(x) + C\\)", "\\(\\ln|x^2 + 4| + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int x\\cdot\\ln(x)  dx\\)", 
        options: ["\\(\\frac{x^2}{2}\\ln(x) - \\frac{x^2}{4} + C\\)", "\\(x\\ln(x) - x + C\\)", "\\(\\frac{1}{x} + C\\)", "\\(\\frac{x^2}{2}\\ln(x) + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int \\sin(x)\\cdot\\cos(x)  dx\\)", 
        options: ["\\(\\frac{1}{2}\\sin^2(x) + C\\)", "\\(\\sin^2(x) + C\\)", "\\(\\cos^2(x) + C\\)", "\\(-\\frac{1}{2}\\cos^2(x) + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int \\frac{e^{\\sqrt{x}}}{\\sqrt{x}}  dx\\)", 
        options: ["\\(2e^{\\sqrt{x}} + C\\)", "\\(e^{\\sqrt{x}} + C\\)", "\\(\\frac{1}{2}e^{\\sqrt{x}} + C\\)", "\\(\\sqrt{x}e^{\\sqrt{x}} + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int \\frac{1}{x\\sqrt{\\ln(x)}}  dx\\)", 
        options: ["\\(2\\sqrt{\\ln(x)} + C\\)", "\\(\\sqrt{\\ln(x)} + C\\)", "\\(\\frac{1}{2\\sqrt{\\ln(x)}} + C\\)", "\\(\\ln|\\sqrt{\\ln(x)}| + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int \\frac{x}{x^2 + 9}  dx\\)", 
        options: ["\\(\\frac{1}{2}\\ln|x^2 + 9| + C\\)", "\\(\\ln|x^2 + 9| + C\\)", "\\(\\frac{1}{x^2 + 9} + C\\)", "\\(\\arctan(\\frac{x}{3}) + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int \\sec(x)\\cdot\\tan(x)  dx\\)", 
        options: ["\\(\\sec(x) + C\\)", "\\(\\tan(x) + C\\)", "\\(\\sec^2(x) + C\\)", "\\(\\ln|\\sec(x) + \\tan(x)| + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int \\frac{1}{\\sqrt{4 - x^2}}  dx\\)", 
        options: ["\\(\\arcsin(\\frac{x}{2}) + C\\)", "\\(\\frac{1}{2}\\arcsin(x) + C\\)", "\\(\\ln|\\sqrt{4 - x^2}| + C\\)", "\\(\\arccos(\\frac{x}{2}) + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int x\\cdot e^{-x}  dx\\)", 
        options: ["\\(-e^{-x}(x + 1) + C\\)", "\\(e^{-x}(x - 1) + C\\)", "\\(-e^{-x} + C\\)", "\\(e^{-x} + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int \\frac{\\sin(x)}{\\cos^2(x)}  dx\\)", 
        options: ["\\(\\frac{1}{\\cos(x)} + C\\)", "\\(-\\frac{1}{\\cos(x)} + C\\)", "\\(\\tan(x) + C\\)", "\\(\\ln|\\cos(x)| + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int (2x + 3)^4  dx\\)", 
        options: ["\\(\\frac{1}{10}(2x + 3)^5 + C\\)", "\\(8(2x + 3)^3 + C\\)", "\\((2x + 3)^5 + C\\)", "\\(\\frac{1}{5}(2x + 3)^5 + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int \\frac{e^x - e^{-x}}{e^x + e^{-x}}  dx\\)", 
        options: ["\\(\\ln|e^x + e^{-x}| + C\\)", "\\(\\arctan(e^x) + C\\)", "\\(\\frac{1}{e^x + e^{-x}} + C\\)", "\\(e^x - e^{-x} + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int x\\cdot\\sin(x)  dx\\)", 
        options: ["\\(-x\\cdot\\cos(x) + \\sin(x) + C\\)", "\\(x\\cdot\\cos(x) - \\sin(x) + C\\)", "\\(-\\cos(x) + C\\)", "\\(\\sin(x) - x\\cdot\\cos(x) + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int \\frac{1}{x^2 - 1}  dx\\)", 
        options: ["\\(\\frac{1}{2}\\ln|\\frac{x-1}{x+1}| + C\\)", "\\(\\ln|x^2 - 1| + C\\)", "\\(\\frac{1}{x-1} - \\frac{1}{x+1} + C\\)", "\\(\\arctan(x) + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int \\sqrt{1 + x}  dx\\)", 
        options: ["\\(\\frac{2}{3}(1 + x)^{3/2} + C\\)", "\\(\\sqrt{1 + x} + C\\)", "\\(\\frac{1}{2\\sqrt{1 + x}} + C\\)", "\\(\\frac{3}{2}(1 + x)^{3/2} + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int \\frac{\\cos(x)}{1 + \\sin(x)}  dx\\)", 
        options: ["\\(\\ln|1 + \\sin(x)| + C\\)", "\\(\\frac{1}{1 + \\sin(x)} + C\\)", "\\(-\\ln|1 + \\sin(x)| + C\\)", "\\(\\arctan(\\sin(x)) + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int x^2\\cdot e^{x^3}  dx\\)", 
        options: ["\\(\\frac{1}{3}e^{x^3} + C\\)", "\\(e^{x^3} + C\\)", "\\(3x e^{x^3} + C\\)", "\\(\\frac{1}{x}e^{x^3} + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int \\frac{1}{x\\ln^2(x)}  dx\\)", 
        options: ["\\(-\\frac{1}{\\ln(x)} + C\\)", "\\(\\frac{1}{\\ln(x)} + C\\)", "\\(\\ln|\\ln(x)| + C\\)", "\\(-\\frac{1}{2\\ln^2(x)} + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int \\tan^2(x)  dx\\)", 
        options: ["\\(\\tan(x) - x + C\\)", "\\(\\tan(x) + x + C\\)", "\\(\\sec^2(x) + C\\)", "\\(\\ln|\\cos(x)| + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int \\frac{x + 1}{x^2 + 2x}  dx\\)", 
        options: ["\\(\\frac{1}{2}\\ln|x^2 + 2x| + C\\)", "\\(\\ln|x^2 + 2x| + C\\)", "\\(\\frac{1}{x^2 + 2x} + C\\)", "\\(\\arctan(x^2 + 2x) + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int e^{2x}\\cdot\\sin(x)  dx\\)", 
        options: ["\\(\\frac{e^{2x}}{5}(2\\sin(x) - \\cos(x)) + C\\)", "\\(e^{2x}\\sin(x) + C\\)", "\\(\\frac{e^{2x}}{2}\\sin(x) + C\\)", "\\(e^{2x}(\\sin(x) - \\cos(x)) + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int \\frac{1}{\\sqrt{x}(1 + \\sqrt{x})}  dx\\)", 
        options: ["\\(2\\ln|1 + \\sqrt{x}| + C\\)", "\\(\\ln|1 + \\sqrt{x}| + C\\)", "\\(\\frac{1}{1 + \\sqrt{x}} + C\\)", "\\(\\sqrt{x}\\ln|1 + \\sqrt{x}| + C\\)"], 
        correct: 0 
    }
];
// Сложные интегралы
const hardIntegralsQuestions = [
    { 
        question: "Вычислите \\(\\int x e^x  dx\\)", 
        options: ["\\(e^x(x-1) + C\\)", "\\(e^x(x+1) + C\\)", "\\(xe^x + C\\)", "\\(\\frac{x^2 e^x}{2} + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int \\ln(x)  dx\\)", 
        options: ["\\(x \\ln(x) - x + C\\)", "\\(\\frac{\\ln^2(x)}{2} + C\\)", "\\(x + C\\)", "\\(x \\ln(x) + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int \\sin^2(x)  dx\\)", 
        options: ["\\(\\frac{x}{2} - \\frac{\\sin(2x)}{4} + C\\)", "\\(-\\frac{\\cos^2(x)}{2} + C\\)", "\\(\\frac{\\sin(x)}{2} + C\\)", "\\(-\\frac{\\cos(2x)}{2} + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int \\frac{x^2}{\\sqrt{1 - x^2}}  dx\\)", 
        options: ["\\(\\frac{1}{2}\\arcsin(x) - \\frac{x}{2}\\sqrt{1 - x^2} + C\\)", "\\(\\arcsin(x) + C\\)", "\\(x\\sqrt{1 - x^2} + C\\)", "\\(-\\sqrt{1 - x^2} + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int e^x \\sin(x)  dx\\)", 
        options: ["\\(\\frac{e^x}{2}(\\sin(x) - \\cos(x)) + C\\)", "\\(e^x\\sin(x) + C\\)", "\\(e^x(\\sin(x) + \\cos(x)) + C\\)", "\\(\\frac{e^x}{2}(\\sin(x) + \\cos(x)) + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int \\frac{dx}{x^2\\sqrt{x^2 - 1}}\\)", 
        options: ["\\(\\frac{\\sqrt{x^2 - 1}}{x} + C\\)", "\\(\\arcsec(x) + C\\)", "\\(\\frac{1}{\\sqrt{x^2 - 1}} + C\\)", "\\(\\ln|x + \\sqrt{x^2 - 1}| + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int \\arctan(x)  dx\\)", 
        options: ["\\(x\\arctan(x) - \\frac{1}{2}\\ln(1 + x^2) + C\\)", "\\(\\frac{\\arctan^2(x)}{2} + C\\)", "\\(\\frac{x}{1 + x^2} + C\\)", "\\(\\ln(1 + x^2) + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int \\frac{dx}{\\sin(x)\\cos(x)}\\)", 
        options: ["\\(\\ln|\\tan(x)| + C\\)", "\\(\\ln|\\sin(x)\\cos(x)| + C\\)", "\\(\\tan(x) + C\\)", "\\(\\frac{1}{2}\\ln|\\sin(2x)| + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int x^2 \\ln(x)  dx\\)", 
        options: ["\\(\\frac{x^3}{3}\\ln(x) - \\frac{x^3}{9} + C\\)", "\\(\\frac{x^3}{2}\\ln(x) + C\\)", "\\(x^2\\ln(x) - x^2 + C\\)", "\\(\\frac{x^3}{3}\\ln(x) + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int \\frac{dx}{x^3\\sqrt{x^2 + 1}}\\)", 
        options: ["\\(-\\frac{\\sqrt{x^2 + 1}}{2x^2} + \\frac{1}{2}\\ln\\left|\\frac{1 + \\sqrt{x^2 + 1}}{x}\\right| + C\\)", "\\(-\\frac{1}{x^2\\sqrt{x^2 + 1}} + C\\)", "\\(\\frac{\\sqrt{x^2 + 1}}{x} + C\\)", "\\(\\ln|x + \\sqrt{x^2 + 1}| + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int \\sin(\\ln(x))  dx\\)", 
        options: ["\\(\\frac{x}{2}(\\sin(\\ln(x)) - \\cos(\\ln(x))) + C\\)", "\\(x\\sin(\\ln(x)) + C\\)", "\\(\\cos(\\ln(x)) + C\\)", "\\(\\frac{x}{2}(\\sin(\\ln(x)) + \\cos(\\ln(x))) + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int \\frac{x^2 + 1}{x^4 + 1}  dx\\)", 
        options: ["\\(\\frac{1}{\\sqrt{2}}\\arctan\\left(\\frac{x^2 - 1}{x\\sqrt{2}}\\right) + C\\)", "\\(\\arctan(x^2) + C\\)", "\\(\\frac{1}{2}\\ln\\left|\\frac{x^2 + 1}{x^2 - 1}\\right| + C\\)", "\\(\\frac{x}{x^4 + 1} + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int \\sqrt{x^2 + a^2}  dx\\)", 
        options: ["\\(\\frac{x}{2}\\sqrt{x^2 + a^2} + \\frac{a^2}{2}\\ln|x + \\sqrt{x^2 + a^2}| + C\\)", "\\(x\\sqrt{x^2 + a^2} + C\\)", "\\(\\frac{1}{3}(x^2 + a^2)^{3/2} + C\\)", "\\(\\ln|x + \\sqrt{x^2 + a^2}| + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int \\frac{dx}{x\\sqrt{x^2 - 4}}\\)", 
        options: ["\\(\\frac{1}{2}\\arcsec\\left(\\frac{x}{2}\\right) + C\\)", "\\(\\frac{1}{\\sqrt{x^2 - 4}} + C\\)", "\\(\\ln|x + \\sqrt{x^2 - 4}| + C\\)", "\\(\\frac{1}{2}\\ln\\left|\\frac{x - 2}{x + 2}\\right| + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int x^2 e^{-x}  dx\\)", 
        options: ["\\(-e^{-x}(x^2 + 2x + 2) + C\\)", "\\(e^{-x}(x^2 - 2x + 2) + C\\)", "\\(-e^{-x}x^2 + C\\)", "\\(\\frac{x^3}{3}e^{-x} + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int \\frac{dx}{\\sqrt{x^2 + 2x + 5}}\\)", 
        options: ["\\(\\ln|x + 1 + \\sqrt{x^2 + 2x + 5}| + C\\)", "\\(\\arcsin\\left(\\frac{x + 1}{2}\\right) + C\\)", "\\(\\sqrt{x^2 + 2x + 5} + C\\)", "\\(\\frac{x + 1}{\\sqrt{x^2 + 2x + 5}} + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int \\cos^3(x)  dx\\)", 
        options: ["\\(\\sin(x) - \\frac{\\sin^3(x)}{3} + C\\)", "\\(\\frac{\\cos^4(x)}{4} + C\\)", "\\(\\sin(x)\\cos^2(x) + C\\)", "\\(\\frac{3\\sin(x)}{4} + \\frac{\\sin(3x)}{12} + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int \\frac{x^3}{\\sqrt{1 - x^2}}  dx\\)", 
        options: ["\\(-\\frac{1}{3}(1 - x^2)^{3/2} - \\sqrt{1 - x^2} + C\\)", "\\(-\\sqrt{1 - x^2} + C\\)", "\\(\\frac{x^4}{4\\sqrt{1 - x^2}} + C\\)", "\\(-\\frac{1}{2}x^2\\sqrt{1 - x^2} + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int \\frac{dx}{x^2 + 4x + 13}\\)", 
        options: ["\\(\\frac{1}{3}\\arctan\\left(\\frac{x + 2}{3}\\right) + C\\)", "\\(\\frac{1}{2}\\ln|x^2 + 4x + 13| + C\\)", "\\(\\arctan(x + 2) + C\\)", "\\(\\frac{1}{x + 2} + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int x\\arcsin(x)  dx\\)", 
        options: ["\\(\\frac{x^2}{2}\\arcsin(x) + \\frac{x}{4}\\sqrt{1 - x^2} - \\frac{1}{4}\\arcsin(x) + C\\)", "\\(x\\arcsin(x) + \\sqrt{1 - x^2} + C\\)", "\\(\\frac{x^2}{2}\\arcsin(x) + C\\)", "\\(\\arcsin(x) - x\\sqrt{1 - x^2} + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int \\frac{dx}{e^x + e^{-x}}\\)", 
        options: ["\\(\\arctan(e^x) + C\\)", "\\(\\ln|e^x + e^{-x}| + C\\)", "\\(\\frac{1}{2}\\ln\\left|\\frac{e^x - 1}{e^x + 1}\\right| + C\\)", "\\(\\frac{e^x}{e^{2x} + 1} + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int \\sqrt{\\frac{1 + x}{1 - x}}  dx\\)", 
        options: ["\\(\\arcsin(x) - \\sqrt{1 - x^2} + C\\)", "\\(\\sqrt{1 - x^2} + C\\)", "\\(\\frac{1}{2}\\ln\\left|\\frac{1 + x}{1 - x}\\right| + C\\)", "\\(x\\sqrt{\\frac{1 + x}{1 - x}} + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int \\frac{x^2}{x^4 + 1}  dx\\)", 
        options: ["\\(\\frac{1}{2\\sqrt{2}}\\ln\\left|\\frac{x^2 - x\\sqrt{2} + 1}{x^2 + x\\sqrt{2} + 1}\\right| + C\\)", "\\(\\arctan(x^2) + C\\)", "\\(\\frac{1}{2}\\ln|x^4 + 1| + C\\)", "\\(\\frac{x}{x^4 + 1} + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int e^{\\sqrt{x}}  dx\\)", 
        options: ["\\(2e^{\\sqrt{x}}(\\sqrt{x} - 1) + C\\)", "\\(e^{\\sqrt{x}} + C\\)", "\\(2\\sqrt{x}e^{\\sqrt{x}} + C\\)", "\\(\\frac{e^{\\sqrt{x}}}{2\\sqrt{x}} + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int \\frac{dx}{x\\sqrt{1 - x^3}}\\)", 
        options: ["\\(-\\frac{1}{3}\\ln\\left|\\frac{1 + \\sqrt{1 - x^3}}{1 - \\sqrt{1 - x^3}}\\right| + C\\)", "\\(\\arcsin(x^{3/2}) + C\\)", "\\(\\frac{2}{3}\\sqrt{1 - x^3} + C\\)", "\\(\\ln|x\\sqrt{1 - x^3}| + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int \\sin(x)\\cos^4(x)  dx\\)", 
        options: ["\\(-\\frac{\\cos^5(x)}{5} + C\\)", "\\(\\frac{\\sin^2(x)\\cos^3(x)}{2} + C\\)", "\\(\\frac{\\cos^5(x)}{5} + C\\)", "\\(-\\frac{\\sin^2(x)}{2}\\cos^3(x) + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int \\frac{x^3 + 1}{x^2 - 1}  dx\\)", 
        options: ["\\(\\frac{x^2}{2} + \\ln|x - 1| + C\\)", "\\(x + \\ln|x^2 - 1| + C\\)", "\\(\\frac{x^2}{2} + \\ln|x + 1| + C\\)", "\\(x + \\frac{1}{x - 1} + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int \\frac{dx}{\\sqrt{x} + \\sqrt[4]{x}}\\)", 
        options: ["\\(2\\sqrt{x} - 4\\sqrt[4]{x} + 4\\ln|1 + \\sqrt[4]{x}| + C\\)", "\\(\\ln|\\sqrt{x} + \\sqrt[4]{x}| + C\\)", "\\(2\\sqrt{x} + 4\\sqrt[4]{x} + C\\)", "\\(\\frac{4}{3}x^{3/4} + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int x^2\\sqrt{1 - x^2}  dx\\)", 
        options: ["\\(\\frac{x}{8}(2x^2 - 1)\\sqrt{1 - x^2} + \\frac{1}{8}\\arcsin(x) + C\\)", "\\(\\frac{x^3}{3}\\sqrt{1 - x^2} + C\\)", "\\(-\\frac{1}{3}(1 - x^2)^{3/2} + C\\)", "\\(\\frac{x}{2}\\sqrt{1 - x^2} + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int \\frac{dx}{x^2\\sqrt{x^2 + 9}}\\)", 
        options: ["\\(-\\frac{\\sqrt{x^2 + 9}}{9x} + C\\)", "\\(\\frac{1}{3}\\arcsin\\left(\\frac{x}{3}\\right) + C\\)", "\\(-\\frac{1}{x\\sqrt{x^2 + 9}} + C\\)", "\\(\\ln|x + \\sqrt{x^2 + 9}| + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int \\ln(x + \\sqrt{1 + x^2})  dx\\)", 
        options: ["\\(x\\ln(x + \\sqrt{1 + x^2}) - \\sqrt{1 + x^2} + C\\)", "\\(\\ln(x + \\sqrt{1 + x^2}) + C\\)", "\\(\\frac{1}{2}\\ln^2(x + \\sqrt{1 + x^2}) + C\\)", "\\(x + \\sqrt{1 + x^2} + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int \\frac{x^5}{x^2 + 1}  dx\\)", 
        options: ["\\(\\frac{x^4}{4} - \\frac{x^2}{2} + \\frac{1}{2}\\ln(x^2 + 1) + C\\)", "\\(\\frac{x^4}{4} + \\frac{x^2}{2} + C\\)", "\\(\\frac{x^6}{6(x^2 + 1)} + C\\)", "\\(x^3 - x + \\arctan(x) + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int \\frac{dx}{\\sin^4(x)}\\)", 
        options: ["\\(-\\frac{\\cot(x)}{3}(\\csc^2(x) + 2) + C\\)", "\\(-\\frac{\\cos(x)}{3\\sin^3(x)} + C\\)", "\\(\\frac{1}{3}\\tan^3(x) + C\\)", "\\(-\\cot(x) - \\frac{\\cot^3(x)}{3} + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int \\sqrt{x}\\ln(x)  dx\\)", 
        options: ["\\(\\frac{2}{3}x^{3/2}\\ln(x) - \\frac{4}{9}x^{3/2} + C\\)", "\\(\\sqrt{x}\\ln(x) - 2\\sqrt{x} + C\\)", "\\(\\frac{2}{3}x^{3/2}\\ln(x) + C\\)", "\\(\\frac{1}{2\\sqrt{x}}\\ln(x) + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int \\frac{x^2}{\\sqrt{4x - x^2}}  dx\\)", 
        options: ["\\(-\\frac{x}{2}\\sqrt{4x - x^2} + 2\\sqrt{4x - x^2} + 6\\arcsin\\left(\\frac{x - 2}{2}\\right) + C\\)", "\\(\\sqrt{4x - x^2} + C\\)", "\\(\\frac{x^3}{3\\sqrt{4x - x^2}} + C\\)", "\\(2\\arcsin\\left(\\frac{x}{2}\\right) + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int e^{2x}\\cos(3x)  dx\\)", 
        options: ["\\(\\frac{e^{2x}}{13}(2\\cos(3x) + 3\\sin(3x)) + C\\)", "\\(e^{2x}\\cos(3x) + C\\)", "\\(\\frac{e^{2x}}{2}\\cos(3x) + C\\)", "\\(\\frac{e^{2x}}{5}(\\cos(3x) + \\sin(3x)) + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int \\frac{dx}{x^4 + 4}\\)", 
        options: ["\\(\\frac{1}{4\\sqrt{2}}\\arctan\\left(\\frac{x^2 - 2}{x\\sqrt{2}}\\right) + \\frac{1}{8\\sqrt{2}}\\ln\\left|\\frac{x^2 + 2x + 2}{x^2 - 2x + 2}\\right| + C\\)", "\\(\\frac{1}{4}\\arctan\\left(\\frac{x^2}{2}\\right) + C\\)", "\\(\\frac{x}{x^4 + 4} + C\\)", "\\(\\frac{1}{2}\\ln|x^4 + 4| + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int \\sqrt{\\tan(x)}  dx\\)", 
        options: ["\\(\\frac{1}{\\sqrt{2}}\\arctan\\left(\\frac{\\sqrt{\\tan(x)} - 1}{\\sqrt{2\\tan(x)}}\\right) + \\frac{1}{2\\sqrt{2}}\\ln\\left|\\frac{\\sqrt{\\tan(x)} - \\sqrt{2\\tan(x)} + 1}{\\sqrt{\\tan(x)} + \\sqrt{2\\tan(x)} + 1}\\right| + C\\)", "\\(\\frac{2}{3}\\tan^{3/2}(x) + C\\)", "\\(\\ln|\\sqrt{\\tan(x)}| + C\\)", "\\(\\sqrt{\\tan(x)} + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int \\frac{x^3}{\\sqrt{x^2 + 4}}  dx\\)", 
        options: ["\\(\\frac{1}{3}(x^2 - 8)\\sqrt{x^2 + 4} + C\\)", "\\(x^2\\sqrt{x^2 + 4} + C\\)", "\\(\\frac{x^4}{4\\sqrt{x^2 + 4}} + C\\)", "\\(\\frac{1}{2}x^2\\sqrt{x^2 + 4} + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int \\frac{dx}{\\sin^3(x)}\\)", 
        options: ["\\(-\\frac{\\cos(x)}{2\\sin^2(x)} + \\frac{1}{2}\\ln|\\csc(x) - \\cot(x)| + C\\)", "\\(-\\frac{\\cot(x)}{2\\sin^2(x)} + C\\)", "\\(\\frac{1}{2}\\tan^2(x) + C\\)", "\\(-\\frac{1}{2}\\cot(x)\\csc(x) + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int x^2\\arctan(x)  dx\\)", 
        options: ["\\(\\frac{x^3}{3}\\arctan(x) - \\frac{x^2}{6} + \\frac{1}{6}\\ln(1 + x^2) + C\\)", "\\(x\\arctan(x) - \\frac{1}{2}\\ln(1 + x^2) + C\\)", "\\(\\frac{x^3}{3}\\arctan(x) + C\\)", "\\(\\arctan(x) - \\frac{x}{1 + x^2} + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int \\frac{dx}{x^4 - 1}\\)", 
        options: ["\\(\\frac{1}{4}\\ln\\left|\\frac{x - 1}{x + 1}\\right| - \\frac{1}{2}\\arctan(x) + C\\)", "\\(\\frac{1}{2}\\ln|x^2 - 1| + C\\)", "\\(\\frac{1}{x^3} + C\\)", "\\(\\frac{1}{4}\\ln\\left|\\frac{x + 1}{x - 1}\\right| + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int \\sqrt{\\frac{1 - x}{1 + x}}  dx\\)", 
        options: ["\\(\\arcsin(x) + \\sqrt{1 - x^2} + C\\)", "\\(\\sqrt{1 - x^2} + C\\)", "\\(-\\frac{1}{2}\\ln\\left|\\frac{1 + x}{1 - x}\\right| + C\\)", "\\(x\\sqrt{\\frac{1 - x}{1 + x}} + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int \\frac{x^2 + x + 1}{x^3 + 1}  dx\\)", 
        options: ["\\(\\ln|x + 1| + \\frac{1}{\\sqrt{3}}\\arctan\\left(\\frac{2x - 1}{\\sqrt{3}}\\right) + C\\)", "\\(\\ln|x^3 + 1| + C\\)", "\\(\\frac{1}{3}\\ln|x + 1| + C\\)", "\\(\\arctan(x) + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int \\frac{dx}{x\\sqrt{x^2 + x + 1}}\\)", 
        options: ["\\(-\\frac{1}{\\sqrt{3}}\\ln\\left|\\frac{\\sqrt{x^2 + x + 1} + \\sqrt{3}/2}{x}\\right| + C\\)", "\\(\\ln|x + \\sqrt{x^2 + x + 1}| + C\\)", "\\(\\frac{1}{\\sqrt{x^2 + x + 1}} + C\\)", "\\(\\frac{2x + 1}{\\sqrt{x^2 + x + 1}} + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int \\sin(2x)\\cos(3x)  dx\\)", 
        options: ["\\(-\\frac{1}{2}\\cos(x) + \\frac{1}{10}\\cos(5x) + C\\)", "\\(\\frac{1}{2}\\sin(x) + \\frac{1}{10}\\sin(5x) + C\\)", "\\(-\\frac{1}{5}\\cos(5x) + C\\)", "\\(\\frac{1}{2}\\cos(x) + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int \\frac{x^4}{x^2 + 2x + 2}  dx\\)", 
        options: ["\\(\\frac{x^3}{3} - x^2 + 2x - 2\\arctan(x + 1) + C\\)", "\\(\\frac{x^3}{3} + x^2 + C\\)", "\\(x^2 - 2x + 2\\ln|x^2 + 2x + 2| + C\\)", "\\(\\frac{x^5}{5(x^2 + 2x + 2)} + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int \\frac{dx}{\\sqrt{x} + \\sqrt[3]{x}}\\)", 
        options: ["\\(2\\sqrt{x} - 3\\sqrt[3]{x} + 6\\sqrt[6]{x} - 6\\ln|1 + \\sqrt[6]{x}| + C\\)", "\\(\\ln|\\sqrt{x} + \\sqrt[3]{x}| + C\\)", "\\(2\\sqrt{x} + 3\\sqrt[3]{x} + C\\)", "\\(\\frac{6}{5}x^{5/6} + C\\)"], 
        correct: 0 
    },
    { 
        question: "Вычислите \\(\\int \\frac{x^2}{\\sqrt{1 + x^3}}  dx\\)", 
        options: ["\\(\\frac{2}{3}\\sqrt{1 + x^3} + C\\)", "\\(x\\sqrt{1 + x^3} + C\\)", "\\(\\frac{x^3}{3\\sqrt{1 + x^3}} + C\\)", "\\(\\frac{2}{9}(1 + x^3)^{3/2} + C\\)"], 
        correct: 0 
    }
];

