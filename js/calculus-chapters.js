/* ═══════════════════════════════════════════════════════
   ТЕОРИЯ ПО РАЗДЕЛАМ МАТЕМАТИЧЕСКОГО АНАЛИЗА
   Используется section-theory.js для браузера глав
═══════════════════════════════════════════════════════ */
window.CALC_CHAPTERS = {

/* ╔══════════════════════════════════════════╗
   ║          ИНТЕГРАЛЫ  (7 глав)             ║
   ╚══════════════════════════════════════════╝ */
integrals: [

{id:'int-def', num:1, title:'Неопределённый интеграл', tag:'Основы', tagCls:'tag-blue',
intro:'Понятие первообразной и неопределённого интеграла. Свойства и базовые формулы.',
html:`
<div class="tb">
  <h2>Первообразная функция</h2>
  <div class="def"><b>Первообразная</b>
    <p>Функция \\(F(x)\\) называется первообразной функции \\(f(x)\\) на интервале \\(I\\), если \\(F'(x)=f(x)\\) для всех \\(x \\in I\\).</p>
  </div>
  <div class="note"><p>📌 Если \\(F(x)\\) — первообразная \\(f(x)\\), то \\(F(x)+C\\) тоже первообразная для любой константы \\(C\\).</p></div>
  <div class="ex"><b>Пример</b>
    <p>\\(F(x)=x^3\\) — первообразная \\(f(x)=3x^2\\), так как \\((x^3)'=3x^2\\).</p>
    <p>Все первообразные: \\(x^3+C\\).</p>
  </div>
</div>

<div class="tb">
  <h2>Неопределённый интеграл</h2>
  <div class="def"><b>Неопределённый интеграл</b>
    <p>Совокупность всех первообразных функции \\(f(x)\\) называется неопределённым интегралом и обозначается:</p>
  </div>
  <div class="fml">\\[\\int f(x)\\,dx = F(x)+C\\]</div>
  <p>Здесь \\(f(x)\\) — <strong>подынтегральная функция</strong>, \\(dx\\) — <strong>знак переменной интегрирования</strong>.</p>
</div>

<div class="tb">
  <h2>Основные свойства интеграла</h2>
  <div class="fml">\\[\\int [f(x)\\pm g(x)]\\,dx = \\int f(x)\\,dx \\pm \\int g(x)\\,dx\\]</div>
  <div class="fml">\\[\\int k\\cdot f(x)\\,dx = k\\int f(x)\\,dx \\quad (k=\\mathrm{const})\\]</div>
  <div class="fml">\\[\\left(\\int f(x)\\,dx\\right)' = f(x), \\qquad d\\left(\\int f(x)\\,dx\\right) = f(x)\\,dx\\]</div>
  <div class="fml">\\[\\int dF(x) = F(x) + C\\]</div>
</div>

<div class="tb">
  <h2>Таблица основных интегралов</h2>
  <table class="ttbl">
    <tr><th>Интеграл</th><th>Результат</th></tr>
    <tr><td>\\(\\int x^n\\,dx\\)</td><td>\\(\\dfrac{x^{n+1}}{n+1}+C,\\; n\\neq-1\\)</td></tr>
    <tr><td>\\(\\int \\dfrac{dx}{x}\\)</td><td>\\(\\ln|x|+C\\)</td></tr>
    <tr><td>\\(\\int e^x\\,dx\\)</td><td>\\(e^x+C\\)</td></tr>
    <tr><td>\\(\\int a^x\\,dx\\)</td><td>\\(\\dfrac{a^x}{\\ln a}+C\\)</td></tr>
    <tr><td>\\(\\int \\sin x\\,dx\\)</td><td>\\(-\\cos x+C\\)</td></tr>
    <tr><td>\\(\\int \\cos x\\,dx\\)</td><td>\\(\\sin x+C\\)</td></tr>
    <tr><td>\\(\\int \\dfrac{dx}{\\cos^2 x}\\)</td><td>\\(\\tan x+C\\)</td></tr>
    <tr><td>\\(\\int \\dfrac{dx}{\\sin^2 x}\\)</td><td>\\(-\\cot x+C\\)</td></tr>
    <tr><td>\\(\\int \\dfrac{dx}{\\sqrt{1-x^2}}\\)</td><td>\\(\\arcsin x+C\\)</td></tr>
    <tr><td>\\(\\int \\dfrac{dx}{1+x^2}\\)</td><td>\\(\\arctan x+C\\)</td></tr>
    <tr><td>\\(\\int \\dfrac{dx}{\\sqrt{x^2\\pm a^2}}\\)</td><td>\\(\\ln|x+\\sqrt{x^2\\pm a^2}|+C\\)</td></tr>
    <tr><td>\\(\\int \\dfrac{dx}{a^2-x^2}\\)</td><td>\\(\\dfrac{1}{2a}\\ln\\left|\\dfrac{a+x}{a-x}\\right|+C\\)</td></tr>
  </table>
</div>
`},

{id:'int-sub', num:2, title:'Метод подстановки', tag:'Метод', tagCls:'tag-violet',
intro:'Замена переменной (подстановка) — самый универсальный метод интегрирования.',
html:`
<div class="tb">
  <h2>Суть метода</h2>
  <p>Если подынтегральное выражение содержит сложную функцию, вводят новую переменную \\(t = \\varphi(x)\\), тогда \\(dt = \\varphi'(x)\\,dx\\).</p>
  <div class="fml">\\[\\int f(\\varphi(x))\\cdot\\varphi'(x)\\,dx = \\int f(t)\\,dt\\]</div>
  <div class="note"><p>📌 После интегрирования нужно вернуться к переменной \\(x\\): подставить \\(t = \\varphi(x)\\).</p></div>
</div>

<div class="tb">
  <h2>Обобщённые формулы (линейная подстановка)</h2>
  <p>Если аргумент линейный \\((ax+b)\\), просто делим на \\(a\\):</p>
  <div class="fml">\\[\\int f(ax+b)\\,dx = \\frac{1}{a}F(ax+b)+C\\]</div>
  <div class="ex"><b>Примеры</b>
    <p>\\(\\int e^{3x}\\,dx = \\dfrac{1}{3}e^{3x}+C\\)</p>
    <p>\\(\\int \\sin(2x-1)\\,dx = -\\dfrac{1}{2}\\cos(2x-1)+C\\)</p>
    <p>\\(\\int (5x+2)^4\\,dx = \\dfrac{(5x+2)^5}{25}+C\\)</p>
  </div>
</div>

<div class="tb">
  <h2>Типичные подстановки</h2>
  <table class="ttbl">
    <tr><th>Выражение</th><th>Подстановка</th></tr>
    <tr><td>\\(\\sqrt{a^2-x^2}\\)</td><td>\\(x = a\\sin t\\)</td></tr>
    <tr><td>\\(\\sqrt{x^2+a^2}\\)</td><td>\\(x = a\\tan t\\) или \\(x = a\\sinh t\\)</td></tr>
    <tr><td>\\(\\sqrt{x^2-a^2}\\)</td><td>\\(x = \\dfrac{a}{\\cos t}\\)</td></tr>
    <tr><td>\\(\\sqrt[n]{ax+b}\\)</td><td>\\(t = \\sqrt[n]{ax+b}\\)</td></tr>
    <tr><td>\\(e^x\\) вместе с алгебр. частью</td><td>\\(t = e^x\\)</td></tr>
    <tr><td>\\(\\ln x\\) вместе с алгебр. частью</td><td>\\(t = \\ln x\\)</td></tr>
  </table>
  <div class="ex"><b>Пример с тригонометрической подстановкой</b>
    <p>\\(\\int \\sqrt{4-x^2}\\,dx\\). Пусть \\(x=2\\sin t\\), \\(dx=2\\cos t\\,dt\\).</p>
    <p>\\(\\sqrt{4-4\\sin^2 t}=2\\cos t\\)</p>
    <p>\\(\\int 2\\cos t\\cdot 2\\cos t\\,dt = 4\\int\\cos^2 t\\,dt = 2t+\\sin 2t+C\\)</p>
    <p>Возвращаясь: \\(= 2\\arcsin\\dfrac{x}{2}+\\dfrac{x}{2}\\sqrt{4-x^2}+C\\)</p>
  </div>
</div>
`},

{id:'int-parts', num:3, title:'Интегрирование по частям', tag:'Метод', tagCls:'tag-green',
intro:'Формула интегрирования по частям для произведений функций. Правило ILATE.',
html:`
<div class="tb">
  <h2>Формула интегрирования по частям</h2>
  <div class="fml">\\[\\int u\\,dv = uv - \\int v\\,du\\]</div>
  <p>Произведение \\(f(x)\\cdot g(x)\\) разбивается так: одна функция — это \\(u\\), дифференциал другой — \\(dv\\).</p>
</div>

<div class="tb">
  <h2>Правило выбора u (ILATE)</h2>
  <p>Выбирай \\(u\\) в порядке убывания приоритета:</p>
  <table class="ttbl">
    <tr><th>Приоритет</th><th>Тип</th><th>Примеры</th></tr>
    <tr><td>1 (высший)</td><td>Логарифмические</td><td>\\(\\ln x,\\; \\log_a x\\)</td></tr>
    <tr><td>2</td><td>Обратные тригон.</td><td>\\(\\arcsin x,\\; \\arctan x\\)</td></tr>
    <tr><td>3</td><td>Алгебраические</td><td>\\(x^n,\\; \\sqrt{x}\\)</td></tr>
    <tr><td>4</td><td>Тригонометрические</td><td>\\(\\sin x,\\; \\cos x\\)</td></tr>
    <tr><td>5 (низший)</td><td>Экспоненциальные</td><td>\\(e^x,\\; a^x\\)</td></tr>
  </table>
  <div class="note"><p>📌 То, что в таблице выше — берём как \\(u\\); то, что ниже — берём как \\(dv\\).</p></div>
</div>

<div class="tb">
  <h2>Примеры</h2>
  <div class="ex"><b>\\(\\int x\\,e^x\\,dx\\)</b>
    <p>\\(u=x,\\; dv=e^x\\,dx \\Rightarrow du=dx,\\; v=e^x\\)</p>
    <p>\\(= xe^x - \\int e^x\\,dx = xe^x - e^x + C = e^x(x-1)+C\\)</p>
  </div>
  <div class="ex"><b>\\(\\int x^2\\sin x\\,dx\\)</b>
    <p>Применяем дважды: сначала \\(u=x^2\\), затем \\(u=2x\\).</p>
    <p>\\(= -x^2\\cos x + 2x\\sin x + 2\\cos x + C\\)</p>
  </div>
  <div class="ex"><b>\\(\\int \\ln x\\,dx\\)</b>
    <p>\\(u=\\ln x,\\; dv=dx \\Rightarrow du=\\dfrac{1}{x}dx,\\; v=x\\)</p>
    <p>\\(= x\\ln x - \\int x\\cdot\\dfrac{1}{x}\\,dx = x\\ln x - x + C\\)</p>
  </div>
  <div class="ex"><b>Цикличность: \\(\\int e^x\\sin x\\,dx\\)</b>
    <p>После двух применений получаем:</p>
    <p>\\(I = e^x\\sin x - e^x\\cos x - I\\)</p>
    <p>\\(2I = e^x(\\sin x - \\cos x) \\Rightarrow I = \\dfrac{e^x(\\sin x-\\cos x)}{2}+C\\)</p>
  </div>
</div>
`},

{id:'int-rational', num:4, title:'Интегрирование дробей', tag:'Метод', tagCls:'tag-amber',
intro:'Разложение рациональных дробей на простейшие и их интегрирование.',
html:`
<div class="tb">
  <h2>Рациональные дроби</h2>
  <p>Рациональная дробь \\(\\dfrac{P(x)}{Q(x)}\\) — отношение многочленов. Если степень числителя \\(\\geq\\) степени знаменателя, нужно выполнить деление с остатком.</p>
  <div class="def"><b>Правильная дробь</b>
    <p>Дробь, у которой \\(\\deg P < \\deg Q\\).</p>
  </div>
</div>

<div class="tb">
  <h2>Простейшие дроби (разложение)</h2>
  <p>Любая правильная рациональная дробь раскладывается на сумму простейших:</p>
  <table class="ttbl">
    <tr><th>Корень Q(x)</th><th>Вклад в разложение</th></tr>
    <tr><td>\\((x-a)^k\\)</td><td>\\(\\dfrac{A_1}{x-a}+\\dfrac{A_2}{(x-a)^2}+\\cdots+\\dfrac{A_k}{(x-a)^k}\\)</td></tr>
    <tr><td>\\((x^2+px+q)^k\\)</td><td>\\(\\dfrac{M_1 x+N_1}{x^2+px+q}+\\cdots+\\dfrac{M_k x+N_k}{(x^2+px+q)^k}\\)</td></tr>
  </table>
</div>

<div class="tb">
  <h2>Пример разложения</h2>
  <div class="ex"><b>\\(\\int\\dfrac{2x+1}{(x-1)(x+2)}\\,dx\\)</b>
    <p>Раскладываем: \\(\\dfrac{2x+1}{(x-1)(x+2)}=\\dfrac{A}{x-1}+\\dfrac{B}{x+2}\\)</p>
    <p>Умножаем на \\((x-1)(x+2)\\): \\(2x+1=A(x+2)+B(x-1)\\)</p>
    <p>При \\(x=1\\): \\(3=3A \\Rightarrow A=1\\)</p>
    <p>При \\(x=-2\\): \\(-3=-3B \\Rightarrow B=1\\)</p>
    <p>\\(\\int\\left(\\dfrac{1}{x-1}+\\dfrac{1}{x+2}\\right)dx = \\ln|x-1|+\\ln|x+2|+C\\)</p>
  </div>
</div>

<div class="tb">
  <h2>Интегрирование \\(\\dfrac{Mx+N}{x^2+px+q}\\)</h2>
  <p>Выделяем производную знаменателя в числителе и дополняем до квадрата:</p>
  <div class="fml">\\[\\int\\frac{Mx+N}{x^2+px+q}\\,dx = \\frac{M}{2}\\ln(x^2+px+q)+\\frac{N-\\frac{Mp}{2}}{\\sqrt{q-\\frac{p^2}{4}}}\\arctan\\frac{x+\\frac{p}{2}}{\\sqrt{q-\\frac{p^2}{4}}}+C\\]</div>
</div>
`},

{id:'int-definite', num:5, title:'Определённый интеграл', tag:'Теорема', tagCls:'tag-cyan',
intro:'Определение определённого интеграла, его свойства и формула Ньютона–Лейбница.',
html:`
<div class="tb">
  <h2>Интегральные суммы Римана</h2>
  <p>Разобьём \\([a,b]\\) на \\(n\\) частей точками \\(a=x_0&lt;x_1&lt;\\cdots&lt;x_n=b\\). На каждом отрезке \\([x_{i-1},x_i]\\) выберем точку \\(\\xi_i\\).</p>
  <div class="def"><b>Интегральная сумма Римана</b>
    <p>\\(\\sigma_n = \\sum_{i=1}^{n} f(\\xi_i)\\,\\Delta x_i\\), где \\(\\Delta x_i = x_i - x_{i-1}\\).</p>
  </div>
  <div class="def"><b>Определённый интеграл</b>
    <p>\\(\\displaystyle\\int_a^b f(x)\\,dx = \\lim_{\\lambda\\to 0}\\sigma_n\\), где \\(\\lambda=\\max\\Delta x_i\\).</p>
  </div>
</div>

<div class="tb">
  <h2>Формула Ньютона–Лейбница</h2>
  <div class="fml">\\[\\int_a^b f(x)\\,dx = F(b) - F(a) = \\Big[F(x)\\Big]_a^b\\]</div>
  <p>где \\(F(x)\\) — любая первообразная \\(f(x)\\).</p>
  <div class="ex"><b>Пример</b>
    <p>\\(\\displaystyle\\int_0^{\\pi} \\sin x\\,dx = [-\\cos x]_0^{\\pi} = -\\cos\\pi+\\cos 0 = 1+1 = 2\\)</p>
  </div>
</div>

<div class="tb">
  <h2>Свойства определённого интеграла</h2>
  <div class="fml">\\[\\int_a^b f\\,dx = -\\int_b^a f\\,dx, \\qquad \\int_a^a f\\,dx = 0\\]</div>
  <div class="fml">\\[\\int_a^b f\\,dx = \\int_a^c f\\,dx + \\int_c^b f\\,dx\\]</div>
  <div class="fml">\\[\\left|\\int_a^b f\\,dx\\right| \\leq \\int_a^b |f|\\,dx\\]</div>
  <p><strong>Теорема о среднем:</strong> \\(\\displaystyle\\int_a^b f\\,dx = f(c)(b-a)\\) для некоторого \\(c\\in(a,b)\\).</p>
</div>

<div class="tb">
  <h2>Замена переменной в определённом интеграле</h2>
  <div class="fml">\\[\\int_a^b f(x)\\,dx \\xrightarrow{x=\\varphi(t)} \\int_{\\alpha}^{\\beta} f(\\varphi(t))\\,\\varphi'(t)\\,dt\\]</div>
  <p>Пределы интегрирования меняются: \\(\\alpha=\\varphi^{-1}(a),\\; \\beta=\\varphi^{-1}(b)\\). Возвращаться к \\(x\\) не нужно.</p>
</div>
`},

{id:'int-apps', num:6, title:'Геометрические приложения', tag:'Приложения', tagCls:'tag-rose',
intro:'Площадь фигуры, длина дуги и объём тела вращения через определённый интеграл.',
html:`
<div class="tb">
  <h2>Площадь плоской фигуры</h2>
  <div class="fml">\\[S = \\int_a^b |f(x)|\\,dx\\]</div>
  <p>Площадь между двумя кривыми \\(f(x) \\geq g(x)\\):</p>
  <div class="fml">\\[S = \\int_a^b [f(x)-g(x)]\\,dx\\]</div>
  <div class="ex"><b>Пример</b>
    <p>Площадь под параболой \\(y=x^2\\) на \\([0,2]\\):</p>
    <p>\\(S=\\displaystyle\\int_0^2 x^2\\,dx = \\dfrac{x^3}{3}\\Big|_0^2 = \\dfrac{8}{3}\\)</p>
  </div>
</div>

<div class="tb">
  <h2>Длина дуги</h2>
  <div class="fml">\\[L = \\int_a^b \\sqrt{1+[f'(x)]^2}\\,dx\\]</div>
  <p>В параметрической форме \\(x=x(t),\\; y=y(t)\\):</p>
  <div class="fml">\\[L = \\int_{t_1}^{t_2}\\sqrt{\\dot x^2+\\dot y^2}\\,dt\\]</div>
</div>

<div class="tb">
  <h2>Объём тела вращения</h2>
  <p><strong>Вокруг оси Ox</strong> (метод дисков):</p>
  <div class="fml">\\[V = \\pi\\int_a^b [f(x)]^2\\,dx\\]</div>
  <p><strong>Вокруг оси Oy</strong> (метод цилиндрических оболочек):</p>
  <div class="fml">\\[V = 2\\pi\\int_a^b x\\,|f(x)|\\,dx\\]</div>
  <div class="ex"><b>Пример: конус</b>
    <p>Вращаем \\(y=\\dfrac{r}{h}x\\) на \\([0,h]\\) вокруг Ox:</p>
    <p>\\(V=\\pi\\displaystyle\\int_0^h\\dfrac{r^2}{h^2}x^2\\,dx = \\dfrac{\\pi r^2 h}{3}\\) — формула объёма конуса ✓</p>
  </div>
</div>
`},

{id:'int-improper', num:7, title:'Несобственные интегралы', tag:'Продвинутое', tagCls:'tag-red',
intro:'Интегралы с бесконечными пределами и от неограниченных функций.',
html:`
<div class="tb">
  <h2>Интеграл с бесконечным пределом</h2>
  <div class="fml">\\[\\int_a^{+\\infty} f(x)\\,dx = \\lim_{b\\to+\\infty}\\int_a^b f(x)\\,dx\\]</div>
  <p>Если предел существует и конечен — интеграл <strong>сходится</strong>, иначе <strong>расходится</strong>.</p>
  <div class="ex"><b>\\(\\int_1^{+\\infty}\\dfrac{dx}{x^p}\\)</b>
    <p>При \\(p>1\\): \\(\\dfrac{1}{p-1}\\) (сходится)</p>
    <p>При \\(p\\leq 1\\): \\(+\\infty\\) (расходится)</p>
  </div>
</div>

<div class="tb">
  <h2>Интеграл от неограниченной функции</h2>
  <p>Если \\(f(x)\\to\\infty\\) при \\(x\\to c \\in [a,b]\\):</p>
  <div class="fml">\\[\\int_a^b f(x)\\,dx = \\lim_{\\varepsilon\\to 0^+}\\int_a^{c-\\varepsilon} f\\,dx + \\lim_{\\delta\\to 0^+}\\int_{c+\\delta}^b f\\,dx\\]</div>
  <div class="ex"><b>\\(\\int_0^1 \\dfrac{dx}{\\sqrt{x}}\\)</b>
    <p>\\(=\\lim_{\\varepsilon\\to 0^+}\\int_{\\varepsilon}^1 x^{-1/2}\\,dx = \\lim_{\\varepsilon\\to 0^+}[2\\sqrt{x}]_{\\varepsilon}^1 = 2\\) (сходится)</p>
  </div>
</div>

<div class="tb">
  <h2>Признаки сходимости</h2>
  <table class="ttbl">
    <tr><th>Признак</th><th>Формулировка</th></tr>
    <tr><td>Сравнения</td><td>Если \\(0\\leq f\\leq g\\) и \\(\\int g\\) сходится, то и \\(\\int f\\) сходится</td></tr>
    <tr><td>Предельный</td><td>Если \\(\\lim_{x\\to\\infty}\\dfrac{f(x)}{g(x)}=L\\neq 0\\), то оба одновременно сходятся/расходятся</td></tr>
    <tr><td>Дирихле</td><td>\\(f\\) монотонно\\(\\to 0\\), \\(G(b)=\\int_a^b g\\) ограничено \\(\\Rightarrow \\int fg\\) сходится</td></tr>
  </table>
</div>
`}
],

/* ╔══════════════════════════════════════════╗
   ║         ПРОИЗВОДНЫЕ  (7 глав)            ║
   ╚══════════════════════════════════════════╝ */
derivatives: [

{id:'der-def', num:1, title:'Понятие производной', tag:'Основы', tagCls:'tag-blue',
intro:'Определение производной как предела, геометрический и физический смысл. Уравнение касательной.',
html:`
<div class="tb">
  <h2>Определение производной</h2>
  <div class="def"><b>Производная функции в точке</b>
    <p>Производная функции \\(y=f(x)\\) в точке \\(x_0\\) — предел отношения приращения функции к приращению аргумента:</p>
  </div>
  <div class="fml">\\[f'(x_0) = \\lim_{\\Delta x\\to 0}\\frac{f(x_0+\\Delta x)-f(x_0)}{\\Delta x}\\]</div>
  <p>Обозначения: \\(f'(x),\\; \\dfrac{dy}{dx},\\; \\dot y,\\; Df(x)\\).</p>
  <div class="note"><p>📌 Функция дифференцируема в точке \\(x_0\\), если этот предел существует и конечен.</p></div>
</div>

<div class="tb">
  <h2>Геометрический смысл</h2>
  <p>\\(f'(x_0)\\) — угловой коэффициент касательной к графику \\(y=f(x)\\) в точке \\((x_0, f(x_0))\\).</p>
  <div class="fml">\\[y - f(x_0) = f'(x_0)(x - x_0)\\quad\\text{— уравнение касательной}\\]</div>
  <div class="fml">\\[y - f(x_0) = -\\frac{1}{f'(x_0)}(x - x_0)\\quad\\text{— уравнение нормали}\\]</div>
</div>

<div class="tb">
  <h2>Физический смысл</h2>
  <p>Если \\(s(t)\\) — пройденный путь, то:</p>
  <div class="fml">\\[v(t) = s'(t)\\quad\\text{— мгновенная скорость}\\]</div>
  <div class="fml">\\[a(t) = v'(t) = s''(t)\\quad\\text{— ускорение}\\]</div>
</div>

<div class="tb">
  <h2>Связь дифференцируемости и непрерывности</h2>
  <div class="note"><p>📌 Если \\(f\\) дифференцируема в точке \\(x_0\\), то она непрерывна в этой точке. Обратное неверно!</p></div>
  <div class="ex"><b>Контрпример</b>
    <p>\\(f(x)=|x|\\) непрерывна в \\(x=0\\), но не дифференцируема (левая и правая производные: \\(-1\\) и \\(+1\\)).</p>
  </div>
</div>
`},

{id:'der-table', num:2, title:'Таблица производных', tag:'Формулы', tagCls:'tag-violet',
intro:'Все стандартные производные, которые нужно знать наизусть.',
html:`
<div class="tb">
  <h2>Основные производные</h2>
  <table class="ttbl">
    <tr><th>Функция</th><th>Производная</th></tr>
    <tr><td>\\(C\\) (константа)</td><td>\\(0\\)</td></tr>
    <tr><td>\\(x^n\\)</td><td>\\(nx^{n-1}\\)</td></tr>
    <tr><td>\\(\\sqrt{x}\\)</td><td>\\(\\dfrac{1}{2\\sqrt{x}}\\)</td></tr>
    <tr><td>\\(\\dfrac{1}{x}\\)</td><td>\\(-\\dfrac{1}{x^2}\\)</td></tr>
    <tr><td>\\(e^x\\)</td><td>\\(e^x\\)</td></tr>
    <tr><td>\\(a^x\\)</td><td>\\(a^x\\ln a\\)</td></tr>
    <tr><td>\\(\\ln x\\)</td><td>\\(\\dfrac{1}{x}\\)</td></tr>
    <tr><td>\\(\\log_a x\\)</td><td>\\(\\dfrac{1}{x\\ln a}\\)</td></tr>
    <tr><td>\\(\\sin x\\)</td><td>\\(\\cos x\\)</td></tr>
    <tr><td>\\(\\cos x\\)</td><td>\\(-\\sin x\\)</td></tr>
    <tr><td>\\(\\tan x\\)</td><td>\\(\\dfrac{1}{\\cos^2 x}\\)</td></tr>
    <tr><td>\\(\\cot x\\)</td><td>\\(-\\dfrac{1}{\\sin^2 x}\\)</td></tr>
    <tr><td>\\(\\arcsin x\\)</td><td>\\(\\dfrac{1}{\\sqrt{1-x^2}}\\)</td></tr>
    <tr><td>\\(\\arccos x\\)</td><td>\\(-\\dfrac{1}{\\sqrt{1-x^2}}\\)</td></tr>
    <tr><td>\\(\\arctan x\\)</td><td>\\(\\dfrac{1}{1+x^2}\\)</td></tr>
    <tr><td>\\(\\text{arccot}\\,x\\)</td><td>\\(-\\dfrac{1}{1+x^2}\\)</td></tr>
    <tr><td>\\(\\sinh x\\)</td><td>\\(\\cosh x\\)</td></tr>
    <tr><td>\\(\\cosh x\\)</td><td>\\(\\sinh x\\)</td></tr>
  </table>
</div>
`},

{id:'der-rules', num:3, title:'Правила дифференцирования', tag:'Правила', tagCls:'tag-green',
intro:'Арифметические правила для нахождения производных сложных выражений.',
html:`
<div class="tb">
  <h2>Основные правила</h2>
  <div class="fml">\\[(u \\pm v)' = u' \\pm v'\\]</div>
  <div class="fml">\\[(cu)' = c\\,u' \\quad (c = \\mathrm{const})\\]</div>
  <div class="fml">\\[(uv)' = u'v + uv' \\quad\\text{(правило Лейбница)}\\]</div>
  <div class="fml">\\[\\left(\\frac{u}{v}\\right)' = \\frac{u'v - uv'}{v^2} \\quad (v\\neq 0)\\]</div>
</div>

<div class="tb">
  <h2>Примеры применения</h2>
  <div class="ex"><b>Произведение</b>
    <p>\\((x^2\\sin x)' = 2x\\sin x + x^2\\cos x\\)</p>
  </div>
  <div class="ex"><b>Частное</b>
    <p>\\(\\left(\\dfrac{x}{x^2+1}\\right)' = \\dfrac{(x^2+1)-x\\cdot 2x}{(x^2+1)^2} = \\dfrac{1-x^2}{(x^2+1)^2}\\)</p>
  </div>
  <div class="ex"><b>Правило Лейбница для n-й производной</b>
    <p>\\((uv)^{(n)} = \\displaystyle\\sum_{k=0}^n C_n^k\\, u^{(k)} v^{(n-k)}\\)</p>
  </div>
</div>
`},

{id:'der-chain', num:4, title:'Производная сложной функции', tag:'Chain rule', tagCls:'tag-amber',
intro:'Правило цепочки для производной сложной функции. Логарифмическое дифференцирование.',
html:`
<div class="tb">
  <h2>Правило цепочки (chain rule)</h2>
  <p>Если \\(y=f(u)\\) и \\(u=g(x)\\), то:</p>
  <div class="fml">\\[(f(g(x)))' = f'(g(x))\\cdot g'(x)\\]</div>
  <p>Или в дифференциалах: \\(\\dfrac{dy}{dx} = \\dfrac{dy}{du}\\cdot\\dfrac{du}{dx}\\).</p>
  <div class="ex"><b>Примеры</b>
    <p>\\((\\sin(x^2))' = \\cos(x^2)\\cdot 2x\\)</p>
    <p>\\((e^{\\cos x})' = e^{\\cos x}\\cdot(-\\sin x)\\)</p>
    <p>\\((\\ln(x^2+1))' = \\dfrac{2x}{x^2+1}\\)</p>
    <p>\\(\\left(\\left(x^3+5\\right)^7\\right)' = 7(x^3+5)^6\\cdot 3x^2 = 21x^2(x^3+5)^6\\)</p>
  </div>
</div>

<div class="tb">
  <h2>Логарифмическое дифференцирование</h2>
  <p>Применяется для функций вида \\(y=[f(x)]^{g(x)}\\) или сложных произведений.</p>
  <p>Берём \\(\\ln\\) от обеих частей, затем дифференцируем:</p>
  <div class="fml">\\[y = f^g \\Rightarrow \\ln y = g\\ln f \\Rightarrow \\frac{y'}{y} = g'\\ln f + g\\cdot\\frac{f'}{f}\\]</div>
  <div class="ex"><b>\\(y = x^x\\)</b>
    <p>\\(\\ln y = x\\ln x \\Rightarrow \\dfrac{y'}{y} = \\ln x + 1 \\Rightarrow y' = x^x(\\ln x+1)\\)</p>
  </div>
</div>

<div class="tb">
  <h2>Производная неявной функции</h2>
  <p>Если \\(F(x,y)=0\\) задаёт \\(y\\) как функцию \\(x\\) неявно:</p>
  <div class="fml">\\[y' = -\\frac{F'_x}{F'_y}\\]</div>
  <div class="ex"><b>\\(x^2+y^2=R^2\\)</b>
    <p>Дифференцируем: \\(2x+2yy'=0 \\Rightarrow y'=-\\dfrac{x}{y}\\)</p>
  </div>
</div>
`},

{id:'der-high', num:5, title:'Производные высших порядков', tag:'Продвинутое', tagCls:'tag-cyan',
intro:'n-я производная, формула Лейбница для произведения, производная параметрической функции.',
html:`
<div class="tb">
  <h2>Производные n-го порядка</h2>
  <p>\\(f^{(n)}(x) = (f^{(n-1)}(x))'\\)</p>
  <table class="ttbl">
    <tr><th>Функция</th><th>n-я производная</th></tr>
    <tr><td>\\(x^m\\)</td><td>\\(m(m-1)\\cdots(m-n+1)\\,x^{m-n}\\)</td></tr>
    <tr><td>\\(e^x\\)</td><td>\\(e^x\\)</td></tr>
    <tr><td>\\(a^x\\)</td><td>\\(a^x\\,(\\ln a)^n\\)</td></tr>
    <tr><td>\\(\\sin x\\)</td><td>\\(\\sin\\left(x+\\dfrac{\\pi n}{2}\\right)\\)</td></tr>
    <tr><td>\\(\\cos x\\)</td><td>\\(\\cos\\left(x+\\dfrac{\\pi n}{2}\\right)\\)</td></tr>
    <tr><td>\\(\\ln x\\)</td><td>\\(\\dfrac{(-1)^{n-1}(n-1)!}{x^n}\\)</td></tr>
  </table>
</div>

<div class="tb">
  <h2>Формула Лейбница</h2>
  <div class="fml">\\[(uv)^{(n)} = \\sum_{k=0}^{n} C_n^k\\, u^{(k)} v^{(n-k)}\\]</div>
  <div class="ex"><b>\\((x^2 e^x)'' = ?\\)</b>
    <p>\\(u=x^2,\\; v=e^x\\)</p>
    <p>\\((x^2 e^x)'' = x^2 e^x + 2\\cdot 2x e^x + e^x\\cdot 2 = e^x(x^2+4x+2)\\)</p>
  </div>
</div>

<div class="tb">
  <h2>Производная параметрической функции</h2>
  <p>Если \\(x=x(t),\\; y=y(t)\\):</p>
  <div class="fml">\\[y'_x = \\frac{y'_t}{x'_t}, \\qquad y''_{xx} = \\frac{(y'_x)'_t}{x'_t}\\]</div>
  <div class="ex"><b>Окружность: \\(x=\\cos t,\\; y=\\sin t\\)</b>
    <p>\\(y'_x = \\dfrac{\\cos t}{-\\sin t} = -\\cot t\\)</p>
  </div>
</div>
`},

{id:'der-research', num:6, title:'Исследование функции', tag:'Приложения', tagCls:'tag-rose',
intro:'Монотонность, экстремумы, выпуклость, перегибы и асимптоты через производные.',
html:`
<div class="tb">
  <h2>Монотонность и экстремумы</h2>
  <table class="ttbl">
    <tr><th>Условие</th><th>Вывод</th></tr>
    <tr><td>\\(f'(x)&gt;0\\) на \\((a,b)\\)</td><td>\\(f\\) возрастает на \\((a,b)\\)</td></tr>
    <tr><td>\\(f'(x)&lt;0\\) на \\((a,b)\\)</td><td>\\(f\\) убывает на \\((a,b)\\)</td></tr>
    <tr><td>\\(f'(x_0)=0\\) — смена \\(+\\to-\\)</td><td>\\(x_0\\) — точка максимума</td></tr>
    <tr><td>\\(f'(x_0)=0\\) — смена \\(-\\to+\\)</td><td>\\(x_0\\) — точка минимума</td></tr>
  </table>
  <div class="note"><p>📌 Достаточный признак: если \\(f'(x_0)=0\\) и \\(f''(x_0)&lt;0\\) — максимум; \\(f''(x_0)&gt;0\\) — минимум.</p></div>
</div>

<div class="tb">
  <h2>Выпуклость и точки перегиба</h2>
  <table class="ttbl">
    <tr><th>Условие</th><th>Вывод</th></tr>
    <tr><td>\\(f''(x)&gt;0\\)</td><td>График выпуклый вниз (вогнутый)</td></tr>
    <tr><td>\\(f''(x)&lt;0\\)</td><td>График выпуклый вверх</td></tr>
    <tr><td>\\(f''(x_0)=0\\), смена знака \\(f''\\)</td><td>\\(x_0\\) — точка перегиба</td></tr>
  </table>
</div>

<div class="tb">
  <h2>Асимптоты</h2>
  <p><strong>Вертикальная:</strong> \\(x=a\\), если \\(\\lim_{x\\to a}f(x)=\\pm\\infty\\)</p>
  <p><strong>Горизонтальная:</strong> \\(y=b\\), если \\(\\lim_{x\\to\\pm\\infty}f(x)=b\\)</p>
  <p><strong>Наклонная:</strong> \\(y=kx+b\\), если</p>
  <div class="fml">\\[k = \\lim_{x\\to\\infty}\\frac{f(x)}{x}, \\qquad b = \\lim_{x\\to\\infty}(f(x)-kx)\\]</div>
</div>

<div class="tb">
  <h2>Схема полного исследования</h2>
  <p>1. Область определения. 2. Чётность/нечётность/периодичность. 3. Нули и знак. 4. Асимптоты. 5. Монотонность и экстремумы (\\(f'=0\\)). 6. Выпуклость и перегибы (\\(f''=0\\)). 7. Построение графика.</p>
</div>
`},

{id:'der-theorems', num:7, title:'Теоремы Ролля и Лагранжа', tag:'Теоремы', tagCls:'tag-red',
intro:'Основные теоремы дифференциального исчисления и формула Тейлора.',
html:`
<div class="tb">
  <h2>Теорема Ролля</h2>
  <div class="def"><b>Теорема Ролля</b>
    <p>Если \\(f\\) непрерывна на \\([a,b]\\), дифференцируема на \\((a,b)\\) и \\(f(a)=f(b)\\), то \\(\\exists\\, c\\in(a,b)\\colon f'(c)=0\\).</p>
  </div>
  <p>Геометрический смысл: существует точка с горизонтальной касательной.</p>
</div>

<div class="tb">
  <h2>Теорема Лагранжа (о среднем значении)</h2>
  <div class="def"><b>Теорема Лагранжа</b>
    <p>Если \\(f\\) непрерывна на \\([a,b]\\) и дифференцируема на \\((a,b)\\), то</p>
  </div>
  <div class="fml">\\[\\exists\\, c\\in(a,b)\\colon f'(c) = \\frac{f(b)-f(a)}{b-a}\\]</div>
  <p>Смысл: существует точка, где мгновенная скорость равна средней скорости на отрезке.</p>
</div>

<div class="tb">
  <h2>Формула Тейлора</h2>
  <div class="fml">\\[f(x) = \\sum_{k=0}^{n}\\frac{f^{(k)}(x_0)}{k!}(x-x_0)^k + o((x-x_0)^n)\\]</div>
  <p>При \\(x_0=0\\) — <strong>формула Маклорена</strong>.</p>
  <table class="ttbl">
    <tr><th>Функция</th><th>Разложение Маклорена</th></tr>
    <tr><td>\\(e^x\\)</td><td>\\(1+x+\\dfrac{x^2}{2!}+\\dfrac{x^3}{3!}+\\cdots\\)</td></tr>
    <tr><td>\\(\\sin x\\)</td><td>\\(x-\\dfrac{x^3}{3!}+\\dfrac{x^5}{5!}-\\cdots\\)</td></tr>
    <tr><td>\\(\\cos x\\)</td><td>\\(1-\\dfrac{x^2}{2!}+\\dfrac{x^4}{4!}-\\cdots\\)</td></tr>
    <tr><td>\\((1+x)^\\alpha\\)</td><td>\\(1+\\alpha x+\\dfrac{\\alpha(\\alpha-1)}{2!}x^2+\\cdots\\)</td></tr>
    <tr><td>\\(\\ln(1+x)\\)</td><td>\\(x-\\dfrac{x^2}{2}+\\dfrac{x^3}{3}-\\cdots\\quad|x|\\leq 1\\)</td></tr>
  </table>
</div>
`}
],

/* ╔══════════════════════════════════════════╗
   ║           РЯДЫ  (7 глав)                 ║
   ╚══════════════════════════════════════════╝ */
series: [

{id:'ser-def', num:1, title:'Числовые ряды. Сходимость', tag:'Основы', tagCls:'tag-blue',
intro:'Определение ряда, частичные суммы, критерий Коши и необходимый признак расходимости.',
html:`
<div class="tb">
  <h2>Что такое числовой ряд?</h2>
  <div class="def"><b>Числовой ряд</b>
    <p>Выражение \\(\\displaystyle\\sum_{n=1}^{\\infty} a_n = a_1+a_2+a_3+\\cdots\\)</p>
    <p>Здесь \\(a_n\\) — <strong>общий член</strong> ряда.</p>
  </div>
  <div class="def"><b>Частичная сумма</b>
    <p>\\(S_n = a_1+a_2+\\cdots+a_n = \\displaystyle\\sum_{k=1}^n a_k\\)</p>
  </div>
  <div class="def"><b>Сходимость ряда</b>
    <p>Ряд сходится, если \\(\\lim_{n\\to\\infty} S_n = S\\) (конечное число). Тогда \\(S\\) — <strong>сумма ряда</strong>.</p>
  </div>
</div>

<div class="tb">
  <h2>Необходимый признак расходимости</h2>
  <div class="fml">\\[\\text{Если ряд }\\sum a_n\\text{ сходится, то }\\lim_{n\\to\\infty}a_n = 0\\]</div>
  <div class="note"><p>📌 Обратное неверно! \\(\\lim a_n=0\\) не гарантирует сходимость (пример: гармонический ряд).</p></div>
</div>

<div class="tb">
  <h2>Эталонные ряды</h2>
  <table class="ttbl">
    <tr><th>Ряд</th><th>Условие</th><th>Результат</th></tr>
    <tr><td>Геометрический \\(\\sum q^{n-1}\\)</td><td>\\(|q|&lt;1\\)</td><td>Сходится: \\(S=\\dfrac{a_1}{1-q}\\)</td></tr>
    <tr><td>Геометрический</td><td>\\(|q|\\geq 1\\)</td><td>Расходится</td></tr>
    <tr><td>Гармонический \\(\\sum \\dfrac{1}{n}\\)</td><td>—</td><td>Расходится</td></tr>
    <tr><td>Ряд Дирихле \\(\\sum \\dfrac{1}{n^p}\\)</td><td>\\(p&gt;1\\)</td><td>Сходится</td></tr>
    <tr><td>Ряд Дирихле</td><td>\\(p\\leq 1\\)</td><td>Расходится</td></tr>
  </table>
</div>
`},

{id:'ser-compare', num:2, title:'Признаки сравнения', tag:'Признаки', tagCls:'tag-green',
intro:'Прямой и предельный признаки сравнения для знакоположительных рядов.',
html:`
<div class="tb">
  <h2>Признаки сравнения</h2>
  <div class="note"><p>📌 Признаки применяются к рядам с <strong>неотрицательными</strong> членами.</p></div>
  <div class="def"><b>Прямой признак сравнения</b>
    <p>Пусть \\(0 \\leq a_n \\leq b_n\\) для всех \\(n\\).</p>
    <p>• Если \\(\\sum b_n\\) сходится, то \\(\\sum a_n\\) сходится.</p>
    <p>• Если \\(\\sum a_n\\) расходится, то \\(\\sum b_n\\) расходится.</p>
  </div>
  <div class="def"><b>Предельный признак сравнения</b>
    <p>Пусть \\(a_n,b_n>0\\) и \\(\\lim_{n\\to\\infty}\\dfrac{a_n}{b_n}=L\\neq 0\\). Тогда \\(\\sum a_n\\) и \\(\\sum b_n\\) сходятся или расходятся одновременно.</p>
  </div>
</div>

<div class="tb">
  <h2>Примеры</h2>
  <div class="ex"><b>\\(\\sum_{n=1}^\\infty \\dfrac{1}{n^2+n}\\)</b>
    <p>Сравниваем с \\(\\dfrac{1}{n^2}\\): \\(\\dfrac{1}{n^2+n}&lt;\\dfrac{1}{n^2}\\), ряд \\(\\sum \\frac{1}{n^2}\\) сходится \\(\\Rightarrow\\) данный ряд сходится.</p>
  </div>
  <div class="ex"><b>\\(\\sum_{n=1}^\\infty \\dfrac{1}{\\sqrt{n^2+1}}\\)</b>
    <p>\\(\\lim_{n\\to\\infty}\\dfrac{1/\\sqrt{n^2+1}}{1/n} = \\lim\\dfrac{n}{\\sqrt{n^2+1}} = 1\\neq 0\\)</p>
    <p>Ряд \\(\\sum 1/n\\) расходится \\(\\Rightarrow\\) данный ряд расходится.</p>
  </div>
</div>
`},

{id:'ser-dalbert', num:3, title:'Признаки Даламбера и Коши', tag:'Признаки', tagCls:'tag-violet',
intro:'Радикальный и признак отношения — наиболее частые инструменты проверки сходимости.',
html:`
<div class="tb">
  <h2>Признак Даламбера (отношения)</h2>
  <div class="fml">\\[L = \\lim_{n\\to\\infty}\\frac{a_{n+1}}{a_n}\\]</div>
  <table class="ttbl">
    <tr><th>\\(L\\)</th><th>Вывод</th></tr>
    <tr><td>\\(L &lt; 1\\)</td><td>Ряд сходится абсолютно</td></tr>
    <tr><td>\\(L &gt; 1\\)</td><td>Ряд расходится</td></tr>
    <tr><td>\\(L = 1\\)</td><td>Нельзя сделать вывод</td></tr>
  </table>
  <div class="ex"><b>\\(\\sum \\dfrac{2^n}{n!}\\)</b>
    <p>\\(L = \\lim\\dfrac{2^{n+1}/(n+1)!}{2^n/n!} = \\lim\\dfrac{2}{n+1} = 0 &lt; 1\\) — сходится.</p>
  </div>
</div>

<div class="tb">
  <h2>Признак Коши (радикальный)</h2>
  <div class="fml">\\[L = \\lim_{n\\to\\infty}\\sqrt[n]{a_n}\\]</div>
  <table class="ttbl">
    <tr><th>\\(L\\)</th><th>Вывод</th></tr>
    <tr><td>\\(L &lt; 1\\)</td><td>Сходится абсолютно</td></tr>
    <tr><td>\\(L &gt; 1\\)</td><td>Расходится</td></tr>
    <tr><td>\\(L = 1\\)</td><td>Нельзя сделать вывод</td></tr>
  </table>
  <div class="ex"><b>\\(\\sum \\dfrac{1}{(\\ln n)^n}\\)</b>
    <p>\\(L = \\lim\\sqrt[n]{\\dfrac{1}{(\\ln n)^n}} = \\lim\\dfrac{1}{\\ln n} = 0 &lt; 1\\) — сходится.</p>
  </div>
</div>

<div class="tb">
  <h2>Признак Раабе</h2>
  <p>Работает, когда признак Даламбера даёт \\(L=1\\):</p>
  <div class="fml">\\[R = \\lim_{n\\to\\infty} n\\left(\\frac{a_n}{a_{n+1}}-1\\right)\\]</div>
  <p>\\(R>1\\) — сходится, \\(R&lt;1\\) — расходится, \\(R=1\\) — нельзя судить.</p>
</div>
`},

{id:'ser-alternating', num:4, title:'Знакочередующиеся ряды', tag:'Признаки', tagCls:'tag-amber',
intro:'Признак Лейбница. Абсолютная и условная сходимость.',
html:`
<div class="tb">
  <h2>Признак Лейбница</h2>
  <div class="def"><b>Знакочередующийся ряд</b>
    <p>Ряд вида \\(\\sum (-1)^{n+1}a_n = a_1-a_2+a_3-\\cdots\\), где \\(a_n>0\\).</p>
  </div>
  <div class="def"><b>Признак Лейбница</b>
    <p>Если \\(a_n\\) монотонно убывает к нулю \\((a_{n+1}\\leq a_n\\) и \\(\\lim a_n=0)\\), то ряд <strong>сходится</strong>.</p>
  </div>
  <div class="fml">\\[|S - S_n| \\leq a_{n+1}\\quad\\text{— оценка погрешности}\\]</div>
  <div class="ex"><b>Знакочередующийся гармонический ряд</b>
    <p>\\(\\displaystyle\\sum_{n=1}^\\infty\\dfrac{(-1)^{n+1}}{n} = 1-\\dfrac{1}{2}+\\dfrac{1}{3}-\\cdots = \\ln 2\\) — сходится (по Лейбницу)</p>
  </div>
</div>

<div class="tb">
  <h2>Абсолютная и условная сходимость</h2>
  <div class="def"><b>Абсолютно сходящийся ряд</b>
    <p>Ряд \\(\\sum a_n\\) сходится <strong>абсолютно</strong>, если сходится \\(\\sum |a_n|\\).</p>
  </div>
  <div class="def"><b>Условно сходящийся ряд</b>
    <p>Ряд сходится, но \\(\\sum |a_n|\\) расходится.</p>
  </div>
  <div class="note"><p>📌 Абсолютная сходимость ⟹ сходимость. Обратное неверно.</p></div>
  <p>Знакочередующийся гармонический ряд — условно сходящийся (\\(\\sum 1/n\\) расходится).</p>
</div>
`},

{id:'ser-power', num:5, title:'Степенные ряды', tag:'Степенные', tagCls:'tag-cyan',
intro:'Степенные ряды, радиус и интервал сходимости, формула Коши–Адамара.',
html:`
<div class="tb">
  <h2>Степенной ряд</h2>
  <div class="def"><b>Степенной ряд</b>
    <p>\\(\\displaystyle\\sum_{n=0}^\\infty c_n(x-x_0)^n = c_0 + c_1(x-x_0)+c_2(x-x_0)^2+\\cdots\\)</p>
  </div>
  <div class="def"><b>Радиус сходимости R</b>
    <p>Ряд сходится абсолютно при \\(|x-x_0|&lt;R\\) и расходится при \\(|x-x_0|&gt;R\\).</p>
  </div>
  <div class="fml">\\[R = \\frac{1}{\\limsup_{n\\to\\infty}\\sqrt[n]{|c_n|}}\\quad\\text{(формула Коши–Адамара)}\\]</div>
  <div class="fml">\\[R = \\lim_{n\\to\\infty}\\left|\\frac{c_n}{c_{n+1}}\\right|\\quad\\text{(формула из признака Даламбера)}\\]</div>
</div>

<div class="tb">
  <h2>Свойства степенных рядов</h2>
  <p>Внутри интервала сходимости:</p>
  <p>• Можно дифференцировать почленно: \\(\\left(\\sum c_n x^n\\right)' = \\sum n c_n x^{n-1}\\)</p>
  <p>• Можно интегрировать почленно: \\(\\int\\sum c_n x^n\\,dx = \\sum\\dfrac{c_n x^{n+1}}{n+1}+C\\)</p>
  <p>• Радиус сходимости после дифференцирования/интегрирования не меняется.</p>
</div>

<div class="tb">
  <h2>Пример нахождения радиуса</h2>
  <div class="ex"><b>\\(\\displaystyle\\sum_{n=1}^\\infty\\dfrac{x^n}{n\\cdot 2^n}\\)</b>
    <p>\\(R=\\lim\\left|\\dfrac{c_n}{c_{n+1}}\\right| = \\lim\\dfrac{1/(n\\cdot 2^n)}{1/((n+1)\\cdot 2^{n+1})} = \\lim\\dfrac{2(n+1)}{n} = 2\\)</p>
    <p>Интервал сходимости \\((-2,2)\\). На концах проверяем отдельно.</p>
  </div>
</div>
`},

{id:'ser-taylor', num:6, title:'Ряды Тейлора и Маклорена', tag:'Тейлор', tagCls:'tag-rose',
intro:'Разложение функций в степенные ряды. Стандартные разложения.',
html:`
<div class="tb">
  <h2>Ряд Тейлора</h2>
  <div class="fml">\\[f(x) = \\sum_{n=0}^\\infty \\frac{f^{(n)}(x_0)}{n!}(x-x_0)^n\\]</div>
  <p>При \\(x_0=0\\) — <strong>ряд Маклорена</strong>.</p>
</div>

<div class="tb">
  <h2>Стандартные разложения (Маклорен, \\(x_0=0\\))</h2>
  <table class="ttbl">
    <tr><th>Функция</th><th>Разложение</th><th>Область</th></tr>
    <tr><td>\\(e^x\\)</td><td>\\(\\displaystyle\\sum_{n=0}^\\infty\\dfrac{x^n}{n!}\\)</td><td>\\((-\\infty,+\\infty)\\)</td></tr>
    <tr><td>\\(\\sin x\\)</td><td>\\(\\displaystyle\\sum_{n=0}^\\infty\\dfrac{(-1)^n x^{2n+1}}{(2n+1)!}\\)</td><td>\\((-\\infty,+\\infty)\\)</td></tr>
    <tr><td>\\(\\cos x\\)</td><td>\\(\\displaystyle\\sum_{n=0}^\\infty\\dfrac{(-1)^n x^{2n}}{(2n)!}\\)</td><td>\\((-\\infty,+\\infty)\\)</td></tr>
    <tr><td>\\(\\ln(1+x)\\)</td><td>\\(\\displaystyle\\sum_{n=1}^\\infty\\dfrac{(-1)^{n+1}x^n}{n}\\)</td><td>\\((-1,1]\\)</td></tr>
    <tr><td>\\(\\dfrac{1}{1-x}\\)</td><td>\\(\\displaystyle\\sum_{n=0}^\\infty x^n\\)</td><td>\\((-1,1)\\)</td></tr>
    <tr><td>\\((1+x)^\\alpha\\)</td><td>\\(\\displaystyle\\sum_{n=0}^\\infty\\binom{\\alpha}{n}x^n\\)</td><td>\\((-1,1)\\)</td></tr>
    <tr><td>\\(\\arctan x\\)</td><td>\\(\\displaystyle\\sum_{n=0}^\\infty\\dfrac{(-1)^n x^{2n+1}}{2n+1}\\)</td><td>\\([-1,1]\\)</td></tr>
  </table>
</div>
`},

{id:'ser-apps', num:7, title:'Применения рядов', tag:'Приложения', tagCls:'tag-red',
intro:'Вычисление пределов, интегралов и приближённые вычисления с помощью рядов.',
html:`
<div class="tb">
  <h2>Вычисление пределов через ряды</h2>
  <div class="ex"><b>\\(\\lim_{x\\to 0}\\dfrac{e^x-1-x}{x^2}\\)</b>
    <p>\\(e^x = 1+x+\\dfrac{x^2}{2}+o(x^2)\\)</p>
    <p>\\(e^x-1-x = \\dfrac{x^2}{2}+o(x^2)\\)</p>
    <p>\\(\\lim = \\dfrac{x^2/2}{x^2} = \\dfrac{1}{2}\\)</p>
  </div>
  <div class="ex"><b>\\(\\lim_{x\\to 0}\\dfrac{\\sin x - x}{x^3}\\)</b>
    <p>\\(\\sin x = x - \\dfrac{x^3}{6} + o(x^3)\\)</p>
    <p>\\(\\lim = \\dfrac{-x^3/6}{x^3} = -\\dfrac{1}{6}\\)</p>
  </div>
</div>

<div class="tb">
  <h2>Приближённое вычисление интегралов</h2>
  <div class="ex"><b>\\(\\displaystyle\\int_0^{0.5}\\dfrac{\\sin x}{x}\\,dx\\)</b>
    <p>\\(\\dfrac{\\sin x}{x} = 1 - \\dfrac{x^2}{6}+\\dfrac{x^4}{120}-\\cdots\\)</p>
    <p>\\(\\displaystyle\\int_0^{0.5}\\approx\\left[x-\\dfrac{x^3}{18}+\\dfrac{x^5}{600}\\right]_0^{0.5} \\approx 0.4931\\)</p>
  </div>
</div>

<div class="tb">
  <h2>Вычисление значений функций</h2>
  <div class="ex"><b>\\(e \\approx ?\\) (5 знаков)</b>
    <p>\\(e = \\displaystyle\\sum_{n=0}^\\infty\\dfrac{1}{n!} = 1+1+\\dfrac{1}{2}+\\dfrac{1}{6}+\\dfrac{1}{24}+\\dfrac{1}{120}+\\cdots\\approx 2.71828\\)</p>
  </div>
</div>
`}
],

/* ╔══════════════════════════════════════════╗
   ║           ПРЕДЕЛЫ  (7 глав)              ║
   ╚══════════════════════════════════════════╝ */
limits: [

{id:'lim-seq', num:1, title:'Предел последовательности', tag:'Основы', tagCls:'tag-blue',
intro:'Определение предела по Вейерштрассу, свойства пределов, теоремы о пределах.',
html:`
<div class="tb">
  <h2>Определение предела последовательности</h2>
  <div class="def"><b>Предел последовательности (Вейерштрасс)</b>
    <p>Число \\(A\\) называется пределом последовательности \\(\\{a_n\\}\\), если для любого \\(\\varepsilon>0\\) существует \\(N\\in\\mathbb{N}\\) такое, что для всех \\(n>N\\) выполняется \\(|a_n-A|&lt;\\varepsilon\\).</p>
  </div>
  <div class="fml">\\[\\lim_{n\\to\\infty} a_n = A \\iff \\forall\\varepsilon>0\\;\\exists N:\\;\\forall n>N\\;|a_n-A|&lt;\\varepsilon\\]</div>
</div>

<div class="tb">
  <h2>Свойства пределов последовательностей</h2>
  <div class="fml">\\[\\lim(a_n\\pm b_n)=\\lim a_n \\pm\\lim b_n\\]</div>
  <div class="fml">\\[\\lim(a_n\\cdot b_n)=\\lim a_n\\cdot\\lim b_n\\]</div>
  <div class="fml">\\[\\lim\\frac{a_n}{b_n}=\\frac{\\lim a_n}{\\lim b_n}\\quad(\\lim b_n\\neq 0)\\]</div>
  <div class="note"><p>📌 <strong>Теорема о сжатой переменной (squeeze):</strong> если \\(a_n\\leq c_n\\leq b_n\\) и \\(\\lim a_n=\\lim b_n=A\\), то \\(\\lim c_n=A\\).</p></div>
</div>

<div class="tb">
  <h2>Важные пределы последовательностей</h2>
  <table class="ttbl">
    <tr><th>Предел</th><th>Значение</th></tr>
    <tr><td>\\(\\lim\\dfrac{1}{n}\\)</td><td>\\(0\\)</td></tr>
    <tr><td>\\(\\lim q^n,\\;|q|&lt;1\\)</td><td>\\(0\\)</td></tr>
    <tr><td>\\(\\lim\\sqrt[n]{n}\\)</td><td>\\(1\\)</td></tr>
    <tr><td>\\(\\lim\\sqrt[n]{a},\\;a>0\\)</td><td>\\(1\\)</td></tr>
    <tr><td>\\(\\lim\\left(1+\\dfrac{1}{n}\\right)^n\\)</td><td>\\(e\\)</td></tr>
    <tr><td>\\(\\lim\\dfrac{n!}{n^n}\\)</td><td>\\(0\\)</td></tr>
  </table>
</div>
`},

{id:'lim-func', num:2, title:'Предел функции', tag:'Основы', tagCls:'tag-violet',
intro:'Определения предела функции по Коши и Гейне. Односторонние пределы и бесконечные пределы.',
html:`
<div class="tb">
  <h2>Определение предела по Коши</h2>
  <div class="fml">\\[\\lim_{x\\to a}f(x)=A \\iff \\forall\\varepsilon>0\\;\\exists\\delta>0:\\;0&lt;|x-a|&lt;\\delta\\Rightarrow|f(x)-A|&lt;\\varepsilon\\]</div>
  <div class="def"><b>Определение по Гейне</b>
    <p>\\(\\lim_{x\\to a}f(x)=A\\), если для любой последовательности \\(x_n\\to a\\), \\(x_n\\neq a\\), выполняется \\(f(x_n)\\to A\\).</p>
  </div>
</div>

<div class="tb">
  <h2>Односторонние пределы</h2>
  <div class="fml">\\[\\lim_{x\\to a^-}f(x) = A^-\\quad\\text{— левый предел}\\]</div>
  <div class="fml">\\[\\lim_{x\\to a^+}f(x) = A^+\\quad\\text{— правый предел}\\]</div>
  <div class="note"><p>📌 \\(\\lim_{x\\to a}f(x)=A \\iff A^-=A^+=A\\)</p></div>
  <div class="ex"><b>Пример</b>
    <p>\\(f(x)=\\dfrac{|x|}{x}\\): \\(A^-=\-1\\), \\(A^+=1\\). Предел в \\(x=0\\) не существует.</p>
  </div>
</div>

<div class="tb">
  <h2>Бесконечно малые и бесконечно большие</h2>
  <div class="def"><b>Бесконечно малая (б.м.)</b>
    <p>Функция \\(\\alpha(x)\\), у которой \\(\\lim\\alpha(x)=0\\).</p>
  </div>
  <div class="def"><b>Бесконечно большая (б.б.)</b>
    <p>Функция \\(f(x)\\), у которой \\(|f(x)|\\to\\infty\\).</p>
  </div>
  <div class="fml">\\[\\lim_{x\\to a}f(x)=A \\iff f(x)=A+\\alpha(x),\\;\\lim\\alpha(x)=0\\]</div>
</div>
`},

{id:'lim-first', num:3, title:'Первый замечательный предел', tag:'Формулы', tagCls:'tag-green',
intro:'Предел sin(x)/x и его многочисленные следствия.',
html:`
<div class="tb">
  <h2>Первый замечательный предел</h2>
  <div class="fml">\\[\\lim_{x\\to 0}\\frac{\\sin x}{x} = 1\\]</div>
  <p>Из него вытекают важные эквивалентности при \\(x\\to 0\\):</p>
  <div class="fml">\\[\\sin x \\sim x, \\quad \\tan x \\sim x, \\quad \\arcsin x \\sim x, \\quad \\arctan x \\sim x\\]</div>
</div>

<div class="tb">
  <h2>Следствия</h2>
  <div class="fml">\\[\\lim_{x\\to 0}\\frac{\\tan x}{x}=1, \\quad \\lim_{x\\to 0}\\frac{\\arcsin x}{x}=1, \\quad \\lim_{x\\to 0}\\frac{\\arctan x}{x}=1\\]</div>
  <div class="fml">\\[\\lim_{x\\to 0}\\frac{1-\\cos x}{x^2}=\\frac{1}{2}\\]</div>
</div>

<div class="tb">
  <h2>Примеры вычисления</h2>
  <div class="ex"><b>\\(\\lim_{x\\to 0}\\dfrac{\\sin 5x}{x}\\)</b>
    <p>\\(=\\lim_{x\\to 0}\\dfrac{\\sin 5x}{5x}\\cdot 5 = 1\\cdot 5 = 5\\)</p>
  </div>
  <div class="ex"><b>\\(\\lim_{x\\to 0}\\dfrac{\\sin 3x}{\\sin 7x}\\)</b>
    <p>\\(=\\lim\\dfrac{\\sin 3x}{3x}\\cdot\\dfrac{7x}{\\sin 7x}\\cdot\\dfrac{3}{7} = 1\\cdot 1\\cdot\\dfrac{3}{7} = \\dfrac{3}{7}\\)</p>
  </div>
  <div class="ex"><b>\\(\\lim_{x\\to 0}\\dfrac{1-\\cos x}{x\\sin x}\\)</b>
    <p>\\(=\\lim\\dfrac{1-\\cos x}{x^2}\\cdot\\dfrac{x}{\\sin x} = \\dfrac{1}{2}\\cdot 1 = \\dfrac{1}{2}\\)</p>
  </div>
</div>
`},

{id:'lim-second', num:4, title:'Второй замечательный предел', tag:'Формулы', tagCls:'tag-amber',
intro:'Число e как предел. Все формы второго замечательного предела.',
html:`
<div class="tb">
  <h2>Второй замечательный предел</h2>
  <div class="fml">\\[\\lim_{n\\to\\infty}\\left(1+\\frac{1}{n}\\right)^n = e \\approx 2.71828\\ldots\\]</div>
  <div class="fml">\\[\\lim_{x\\to\\infty}\\left(1+\\frac{1}{x}\\right)^x = e \\qquad\\lim_{x\\to 0}(1+x)^{1/x} = e\\]</div>
</div>

<div class="tb">
  <h2>Следствия при \\(x\\to 0\\)</h2>
  <div class="fml">\\[e^x \\sim 1+x, \\quad \\ln(1+x)\\sim x, \\quad a^x-1\\sim x\\ln a\\]</div>
  <div class="fml">\\[(1+x)^\\alpha - 1 \\sim \\alpha x\\]</div>
</div>

<div class="tb">
  <h2>Примеры</h2>
  <div class="ex"><b>\\(\\lim_{x\\to\\infty}\\left(1+\\dfrac{3}{x}\\right)^x\\)</b>
    <p>\\(=\\lim\\left[\\left(1+\\dfrac{3}{x}\\right)^{x/3}\\right]^3 = e^3\\)</p>
  </div>
  <div class="ex"><b>\\(\\lim_{x\\to 0}\\dfrac{\\ln(1+2x)}{x}\\)</b>
    <p>\\(\\ln(1+2x)\\sim 2x\\), поэтому \\(\\lim = \\dfrac{2x}{x} = 2\\)</p>
  </div>
  <div class="ex"><b>\\(\\lim_{x\\to\\infty}\\left(\\dfrac{x+1}{x-1}\\right)^x\\)</b>
    <p>\\(\\dfrac{x+1}{x-1} = 1+\\dfrac{2}{x-1}\\)</p>
    <p>\\(=\\lim\\left(1+\\dfrac{2}{x-1}\\right)^x = e^2\\)</p>
  </div>
</div>
`},

{id:'lim-equiv', num:5, title:'Эквивалентные бесконечно малые', tag:'Метод', tagCls:'tag-cyan',
intro:'Таблица эквивалентностей при x→0. Техника замены б.м. для вычисления пределов.',
html:`
<div class="tb">
  <h2>Таблица эквивалентных б.м. при \\(x\\to 0\\)</h2>
  <table class="ttbl">
    <tr><th>Функция</th><th>Эквивалентна</th></tr>
    <tr><td>\\(\\sin x\\)</td><td>\\(x\\)</td></tr>
    <tr><td>\\(\\tan x\\)</td><td>\\(x\\)</td></tr>
    <tr><td>\\(\\arcsin x\\)</td><td>\\(x\\)</td></tr>
    <tr><td>\\(\\arctan x\\)</td><td>\\(x\\)</td></tr>
    <tr><td>\\(1-\\cos x\\)</td><td>\\(\\dfrac{x^2}{2}\\)</td></tr>
    <tr><td>\\(e^x-1\\)</td><td>\\(x\\)</td></tr>
    <tr><td>\\(\\ln(1+x)\\)</td><td>\\(x\\)</td></tr>
    <tr><td>\\((1+x)^\\alpha-1\\)</td><td>\\(\\alpha x\\)</td></tr>
    <tr><td>\\(\\sinh x\\)</td><td>\\(x\\)</td></tr>
    <tr><td>\\(\\tanh x\\)</td><td>\\(x\\)</td></tr>
  </table>
  <div class="note"><p>📌 При замене в дроби заменяем только в числителе и знаменателе по отдельности, не в сумме!</p></div>
</div>

<div class="tb">
  <h2>Применение</h2>
  <div class="ex"><b>\\(\\lim_{x\\to 0}\\dfrac{e^{2x}-1}{\\sin 3x}\\)</b>
    <p>\\(e^{2x}-1\\sim 2x,\\; \\sin 3x\\sim 3x\\)</p>
    <p>\\(\\lim = \\dfrac{2x}{3x} = \\dfrac{2}{3}\\)</p>
  </div>
  <div class="ex"><b>\\(\\lim_{x\\to 0}\\dfrac{\\tan x - \\sin x}{x^3}\\)</b>
    <p>\\(\\tan x - \\sin x = \\dfrac{\\sin x(1-\\cos x)}{\\cos x}\\sim x\\cdot\\dfrac{x^2}{2} = \\dfrac{x^3}{2}\\)</p>
    <p>\\(\\lim = \\dfrac{x^3/2}{x^3} = \\dfrac{1}{2}\\)</p>
  </div>
</div>
`},

{id:'lim-lopital', num:6, title:'Правило Лопиталя', tag:'Метод', tagCls:'tag-rose',
intro:'Раскрытие неопределённостей 0/0 и ∞/∞ через производные.',
html:`
<div class="tb">
  <h2>Правило Лопиталя</h2>
  <div class="def"><b>Теорема (Лопиталь)</b>
    <p>Если \\(\\lim_{x\\to a}f(x)=\\lim_{x\\to a}g(x)=0\\) (или \\(\\infty\\)), и предел \\(\\lim_{x\\to a}\\dfrac{f'(x)}{g'(x)}\\) существует, то:</p>
  </div>
  <div class="fml">\\[\\lim_{x\\to a}\\frac{f(x)}{g(x)} = \\lim_{x\\to a}\\frac{f'(x)}{g'(x)}\\]</div>
  <div class="note"><p>📌 Применяется только для неопределённостей \\(\\dfrac{0}{0}\\) и \\(\\dfrac{\\infty}{\\infty}\\). Другие нужно свести к ним.</p></div>
</div>

<div class="tb">
  <h2>Примеры</h2>
  <div class="ex"><b>\\(\\lim_{x\\to 0}\\dfrac{\\sin x}{x}\\) (тип \\(0/0\\))</b>
    <p>\\(=\\lim_{x\\to 0}\\dfrac{\\cos x}{1} = 1\\)</p>
  </div>
  <div class="ex"><b>\\(\\lim_{x\\to\\infty}\\dfrac{x^n}{e^x}\\) (тип \\(\\infty/\\infty\\))</b>
    <p>Применяем \\(n\\) раз: \\(\\lim = \\dfrac{n!}{e^x}\\to 0\\)</p>
  </div>
  <div class="ex"><b>\\(\\lim_{x\\to 0^+} x\\ln x\\) (тип \\(0\\cdot\\infty\\))</b>
    <p>\\(= \\lim_{x\\to 0^+}\\dfrac{\\ln x}{1/x} = \\lim\\dfrac{1/x}{-1/x^2} = \\lim(-x) = 0\\)</p>
  </div>
  <div class="ex"><b>\\(\\lim_{x\\to 0^+} x^x\\) (тип \\(0^0\\))</b>
    <p>\\(x^x = e^{x\\ln x}\\to e^0 = 1\\)</p>
  </div>
</div>

<div class="tb">
  <h2>Таблица неопределённостей и преобразований</h2>
  <table class="ttbl">
    <tr><th>Неопределённость</th><th>Преобразование</th></tr>
    <tr><td>\\(0/0,\\; \\infty/\\infty\\)</td><td>Лопиталь напрямую</td></tr>
    <tr><td>\\(0\\cdot\\infty\\)</td><td>\\(\\dfrac{f}{1/g}\\) или \\(\\dfrac{g}{1/f}\\)</td></tr>
    <tr><td>\\(\\infty-\\infty\\)</td><td>Привести к общему знаменателю</td></tr>
    <tr><td>\\(0^0,\\;1^\\infty,\\;\\infty^0\\)</td><td>\\(e^{\\lim(\\ln f)}\\)</td></tr>
  </table>
</div>
`},

{id:'lim-continuity', num:7, title:'Непрерывность функции', tag:'Теория', tagCls:'tag-red',
intro:'Определение непрерывности, точки разрыва и их классификация, теорема о нулях.',
html:`
<div class="tb">
  <h2>Непрерывность в точке</h2>
  <div class="def"><b>Непрерывность</b>
    <p>Функция \\(f\\) непрерывна в точке \\(x_0\\), если:</p>
  </div>
  <div class="fml">\\[\\lim_{x\\to x_0}f(x) = f(x_0)\\]</div>
  <p>Три условия: 1) \\(f(x_0)\\) определена; 2) предел существует; 3) предел равен значению.</p>
</div>

<div class="tb">
  <h2>Точки разрыва</h2>
  <table class="ttbl">
    <tr><th>Тип</th><th>Определение</th><th>Пример</th></tr>
    <tr><td>Устранимый</td><td>\\(\\lim_{x\\to a}f(x)\\) существует, но \\(\\neq f(a)\\)</td><td>\\(\\dfrac{\\sin x}{x}\\) при \\(x=0\\)</td></tr>
    <tr><td>Скачок (I рода)</td><td>Оба односторонних предела конечны, но \\(\\neq\\)</td><td>\\(\\text{sign}(x)\\) при \\(x=0\\)</td></tr>
    <tr><td>Существенный (II рода)</td><td>Хотя бы один односторонний предел \\(=\\infty\\)</td><td>\\(\\sin(1/x)\\) при \\(x=0\\)</td></tr>
  </table>
</div>

<div class="tb">
  <h2>Теоремы о непрерывных функциях</h2>
  <div class="def"><b>Теорема Больцано–Коши (о нулях)</b>
    <p>Если \\(f\\) непрерывна на \\([a,b]\\) и \\(f(a)\\cdot f(b)&lt;0\\), то \\(\\exists\\,c\\in(a,b)\\colon f(c)=0\\).</p>
  </div>
  <div class="def"><b>Теорема о промежуточных значениях</b>
    <p>Непрерывная на \\([a,b]\\) функция принимает все значения между \\(f(a)\\) и \\(f(b)\\).</p>
  </div>
  <div class="def"><b>Теорема Вейерштрасса</b>
    <p>Непрерывная на \\([a,b]\\) функция ограничена и достигает своих наибольшего и наименьшего значений.</p>
  </div>
</div>
`}
],

/* ╔══════════════════════════════════════════╗
   ║           ОДУ  (7 глав)                  ║
   ╚══════════════════════════════════════════╝ */
ode: [

{id:'ode-def', num:1, title:'Основные понятия ОДУ', tag:'Основы', tagCls:'tag-blue',
intro:'Что такое ОДУ, его порядок, решение, общее и частное решение, задача Коши.',
html:`
<div class="tb">
  <h2>Что такое ОДУ?</h2>
  <div class="def"><b>Обыкновенное дифференциальное уравнение (ОДУ)</b>
    <p>Уравнение, связывающее независимую переменную \\(x\\), искомую функцию \\(y(x)\\) и её производные \\(y',y'',\\ldots,y^{(n)}\\):</p>
  </div>
  <div class="fml">\\[F(x,\\,y,\\,y',\\,y'',\\,\\ldots,\\,y^{(n)})=0\\]</div>
  <p><strong>Порядок ОДУ</strong> — наибольший порядок входящей производной.</p>
</div>

<div class="tb">
  <h2>Общее и частное решения</h2>
  <div class="def"><b>Общее решение</b>
    <p>Функция \\(y=\\Phi(x,C_1,C_2,\\ldots,C_n)\\), удовлетворяющая уравнению при любых постоянных \\(C_i\\).</p>
  </div>
  <div class="def"><b>Частное решение</b>
    <p>Решение, полученное из общего при конкретных значениях произвольных постоянных.</p>
  </div>
</div>

<div class="tb">
  <h2>Задача Коши</h2>
  <p>Найти решение ОДУ, удовлетворяющее начальным условиям:</p>
  <div class="fml">\\[y^{(n)}=f(x,y,y',\\ldots) \\text{ при } y(x_0)=y_0,\\; y'(x_0)=y'_0,\\;\\ldots\\]</div>
  <div class="def"><b>Теорема Пикара (существование и единственность)</b>
    <p>Если \\(f\\) непрерывна и имеет ограниченную частную производную по \\(y\\) в окрестности \\((x_0,y_0)\\), то задача Коши имеет единственное решение.</p>
  </div>
</div>

<div class="tb">
  <h2>Геометрическая интерпретация</h2>
  <p>Решение ОДУ первого порядка \\(y'=f(x,y)\\) — это семейство <strong>интегральных кривых</strong> в плоскости \\(xOy\\). Задача Коши выделяет одну кривую через точку \\((x_0,y_0)\\).</p>
</div>
`},

{id:'ode-sep', num:2, title:'ОДУ с разделяющимися переменными', tag:'Метод', tagCls:'tag-green',
intro:'Метод разделения переменных — простейший способ решения ОДУ первого порядка.',
html:`
<div class="tb">
  <h2>Форма уравнения</h2>
  <div class="fml">\\[y' = f(x)\\cdot g(y)\\quad\\text{или}\\quad P(x)\\,dx + Q(y)\\,dy = 0\\]</div>
  <p>Переменные разделяются, если правая часть — произведение функций только от \\(x\\) и только от \\(y\\).</p>
</div>

<div class="tb">
  <h2>Метод решения</h2>
  <p>1. Перегруппировать: \\(\\dfrac{dy}{g(y)} = f(x)\\,dx\\)</p>
  <p>2. Интегрировать обе части: \\(\\displaystyle\\int\\dfrac{dy}{g(y)} = \\int f(x)\\,dx + C\\)</p>
  <p>3. Выразить \\(y\\) через \\(x\\) (если возможно).</p>
  <div class="ex"><b>\\(y' = xy\\)</b>
    <p>\\(\\dfrac{dy}{y}=x\\,dx \\Rightarrow \\ln|y|=\\dfrac{x^2}{2}+C_1 \\Rightarrow y=Ce^{x^2/2}\\)</p>
  </div>
</div>

<div class="tb">
  <h2>Примеры</h2>
  <div class="ex"><b>\\(y'=\\dfrac{x}{y}\\)</b>
    <p>\\(y\\,dy = x\\,dx \\Rightarrow \\dfrac{y^2}{2}=\\dfrac{x^2}{2}+C \\Rightarrow x^2-y^2=C_1\\) — семейство гипербол.</p>
  </div>
  <div class="ex"><b>\\((1+x^2)y'=2xy\\), \\(y(0)=1\\)</b>
    <p>\\(\\dfrac{dy}{y}=\\dfrac{2x\\,dx}{1+x^2} \\Rightarrow \\ln|y|=\\ln(1+x^2)+C\\)</p>
    <p>\\(y = A(1+x^2)\\). При \\(y(0)=1\\): \\(A=1\\). Ответ: \\(y=1+x^2\\).</p>
  </div>
</div>
`},

{id:'ode-homogen', num:3, title:'Однородные ОДУ первого порядка', tag:'Метод', tagCls:'tag-violet',
intro:'Однородные уравнения. Подстановка y = vx и сведение к разделяющимся переменным.',
html:`
<div class="tb">
  <h2>Однородное уравнение</h2>
  <div class="def"><b>Однородная функция степени k</b>
    <p>\\(f(tx,ty) = t^k f(x,y)\\)</p>
  </div>
  <div class="def"><b>Однородное ОДУ</b>
    <p>Уравнение \\(y'=f(x,y)\\), где \\(f\\) однородна степени 0, то есть \\(f(tx,ty)=f(x,y)\\). Это означает, что \\(f\\) зависит только от отношения \\(y/x\\):</p>
  </div>
  <div class="fml">\\[y' = \\Phi\\left(\\frac{y}{x}\\right)\\]</div>
</div>

<div class="tb">
  <h2>Подстановка v = y/x</h2>
  <p>Пусть \\(y=vx\\), тогда \\(y'=v'x+v\\).</p>
  <div class="fml">\\[v'x + v = \\Phi(v) \\Rightarrow v'x = \\Phi(v)-v \\Rightarrow \\frac{dv}{\\Phi(v)-v}=\\frac{dx}{x}\\]</div>
  <p>Переменные разделились!</p>
  <div class="ex"><b>\\(y'=\\dfrac{y}{x}+\\tan\\dfrac{y}{x}\\)</b>
    <p>Замена \\(v=y/x\\): \\(v'x+v = v+\\tan v\\)</p>
    <p>\\(v'x = \\tan v \\Rightarrow \\dfrac{dv}{\\tan v}=\\dfrac{dx}{x}\\)</p>
    <p>\\(\\ln|\\sin v|=\\ln|x|+C \\Rightarrow \\sin\\dfrac{y}{x}=Cx\\)</p>
  </div>
</div>
`},

{id:'ode-linear', num:4, title:'Линейные ОДУ первого порядка', tag:'Метод', tagCls:'tag-amber',
intro:'Линейное ОДУ первого порядка. Метод вариации постоянной (Лагранжа). Формула Коши.',
html:`
<div class="tb">
  <h2>Форма уравнения</h2>
  <div class="fml">\\[y' + P(x)\\,y = Q(x)\\]</div>
  <p>Если \\(Q(x)\\equiv 0\\) — однородное, иначе — неоднородное.</p>
</div>

<div class="tb">
  <h2>Интегрирующий множитель</h2>
  <p>Умножим уравнение на \\(\\mu(x)=e^{\\int P\\,dx}\\):</p>
  <div class="fml">\\[\\left(\\mu y\\right)' = \\mu Q\\]</div>
  <div class="fml">\\[\\mu y = \\int \\mu Q\\,dx + C \\Rightarrow y = e^{-\\int P\\,dx}\\left(\\int Q e^{\\int P\\,dx}\\,dx + C\\right)\\]</div>
</div>

<div class="tb">
  <h2>Метод вариации постоянной</h2>
  <p>1. Решаем однородное: \\(y_0=Ce^{-\\int P\\,dx}\\)</p>
  <p>2. Заменяем \\(C\\) на \\(C(x)\\), подставляем в неоднородное, находим \\(C(x)\\).</p>
  <div class="ex"><b>\\(y'-\\dfrac{y}{x}=x^2\\)</b>
    <p>Однородное: \\(y_0=Cx\\)</p>
    <p>Замена: \\(y=C(x)\\cdot x\\), \\(y'=C'x+C\\)</p>
    <p>\\(C'x+C-C=x^2 \\Rightarrow C'=x \\Rightarrow C(x)=\\dfrac{x^2}{2}+A\\)</p>
    <p>Ответ: \\(y=\\dfrac{x^3}{2}+Ax\\)</p>
  </div>
</div>
`},

{id:'ode-bernoulli', num:5, title:'Уравнение Бернулли', tag:'Метод', tagCls:'tag-cyan',
intro:'Уравнение Бернулли — нелинейное ОДУ, сводимое к линейному заменой переменной.',
html:`
<div class="tb">
  <h2>Форма уравнения Бернулли</h2>
  <div class="fml">\\[y' + P(x)\\,y = Q(x)\\,y^n, \\quad n\\neq 0,1\\]</div>
  <p>При \\(n=0\\) — линейное, при \\(n=1\\) — линейное однородное.</p>
</div>

<div class="tb">
  <h2>Замена</h2>
  <p>Делим на \\(y^n\\): \\(y^{-n}y' + Py^{1-n}=Q\\)</p>
  <p>Замена \\(z=y^{1-n}\\), тогда \\(z'=(1-n)y^{-n}y'\\):</p>
  <div class="fml">\\[\\frac{z'}{1-n}+Pz=Q \\Rightarrow z'+(1-n)Pz=(1-n)Q\\]</div>
  <p>Получаем линейное ОДУ относительно \\(z\\).</p>
</div>

<div class="tb">
  <h2>Пример</h2>
  <div class="ex"><b>\\(y'-\\dfrac{2y}{x}=-x^2y^3\\)</b>
    <p>Это Бернулли с \\(n=3\\). Замена \\(z=y^{-2}\\), \\(z'=-2y^{-3}y'\\).</p>
    <p>Делим на \\(y^3\\): \\(y^{-3}y'-\\dfrac{2}{x}y^{-2}=-x^2\\)</p>
    <p>\\(-\\dfrac{z'}{2}-\\dfrac{2z}{x}=-x^2 \\Rightarrow z'+\\dfrac{4z}{x}=2x^2\\)</p>
    <p>Решаем как линейное: \\(z=\\dfrac{x^3}{3}+\\dfrac{C}{x^4}\\)</p>
    <p>Ответ: \\(\\dfrac{1}{y^2}=\\dfrac{x^3}{3}+\\dfrac{C}{x^4}\\)</p>
  </div>
</div>
`},

{id:'ode-linear2', num:6, title:'Линейные ОДУ 2-го порядка', tag:'2-й порядок', tagCls:'tag-rose',
intro:'Однородные линейные ОДУ 2-го порядка с постоянными коэффициентами. Характеристическое уравнение.',
html:`
<div class="tb">
  <h2>Форма уравнения</h2>
  <div class="fml">\\[y'' + py' + qy = 0 \\quad (p,q = \\mathrm{const})\\]</div>
</div>

<div class="tb">
  <h2>Характеристическое уравнение</h2>
  <p>Ищем решение \\(y=e^{kx}\\). Подставляя, получаем:</p>
  <div class="fml">\\[k^2 + pk + q = 0\\quad\\text{— характеристическое уравнение}\\]</div>
  <p>Корни: \\(k_{1,2} = \\dfrac{-p\\pm\\sqrt{p^2-4q}}{2}\\)</p>
</div>

<div class="tb">
  <h2>Три случая</h2>
  <table class="ttbl">
    <tr><th>Дискриминант</th><th>Корни</th><th>Общее решение</th></tr>
    <tr><td>\\(D>0\\)</td><td>\\(k_1\\neq k_2\\) (вещ.)</td><td>\\(y=C_1e^{k_1 x}+C_2e^{k_2 x}\\)</td></tr>
    <tr><td>\\(D=0\\)</td><td>\\(k_1=k_2=k\\)</td><td>\\(y=(C_1+C_2 x)e^{kx}\\)</td></tr>
    <tr><td>\\(D&lt;0\\)</td><td>\\(k=\\alpha\\pm i\\beta\\)</td><td>\\(y=e^{\\alpha x}(C_1\\cos\\beta x+C_2\\sin\\beta x)\\)</td></tr>
  </table>
  <div class="ex"><b>\\(y''-5y'+6y=0\\)</b>
    <p>\\(k^2-5k+6=0 \\Rightarrow k_1=2,\\; k_2=3\\)</p>
    <p>\\(y=C_1e^{2x}+C_2e^{3x}\\)</p>
  </div>
  <div class="ex"><b>\\(y''+4y=0\\)</b>
    <p>\\(k^2+4=0 \\Rightarrow k=\\pm 2i\\;(\\alpha=0,\\beta=2)\\)</p>
    <p>\\(y=C_1\\cos 2x+C_2\\sin 2x\\)</p>
  </div>
</div>
`},

{id:'ode-nonhomogen', num:7, title:'Неоднородные ОДУ 2-го порядка', tag:'2-й порядок', tagCls:'tag-red',
intro:'Метод вариации постоянных. Метод подбора для правой части специального вида.',
html:`
<div class="tb">
  <h2>Структура общего решения</h2>
  <div class="fml">\\[y'' + py' + qy = f(x)\\]</div>
  <div class="fml">\\[y = y_{\\text{одн}} + y^*\\]</div>
  <p>\\(y_{\\text{одн}}\\) — общее решение однородного, \\(y^*\\) — частное решение неоднородного.</p>
</div>

<div class="tb">
  <h2>Метод подбора: правая часть \\(f(x)=e^{ax}P_m(x)\\)</h2>
  <p>Ищем \\(y^* = x^s e^{ax}Q_m(x)\\), где \\(Q_m\\) — многочлен степени \\(m\\), а</p>
  <table class="ttbl">
    <tr><th>Случай</th><th>s</th></tr>
    <tr><td>\\(a\\) не является корнем характер. ур-я</td><td>\\(0\\)</td></tr>
    <tr><td>\\(a\\) — простой корень</td><td>\\(1\\)</td></tr>
    <tr><td>\\(a\\) — двукратный корень</td><td>\\(2\\)</td></tr>
  </table>
  <div class="ex"><b>\\(y''-3y'+2y=e^{3x}\\)</b>
    <p>Хар. уравнение: \\(k^2-3k+2=0 \\Rightarrow k=1,2\\). Число \\(a=3\\) не корень.</p>
    <p>\\(y^*=Ae^{3x}\\). Подставляем: \\(9A-9A+2A=1 \\Rightarrow A=1/2\\)</p>
    <p>\\(y=C_1e^x+C_2e^{2x}+\\dfrac{1}{2}e^{3x}\\)</p>
  </div>
</div>

<div class="tb">
  <h2>Метод вариации постоянных (Лагранжа)</h2>
  <p>Пусть \\(y_{\\text{одн}}=C_1y_1+C_2y_2\\). Заменяем \\(C_i\\) на \\(C_i(x)\\):</p>
  <div class="fml">\\[\\begin{cases}C_1'y_1+C_2'y_2=0\\\\C_1'y_1'+C_2'y_2'=f(x)\\end{cases}\\]</div>
  <p>Решаем методом Крамера, интегрируем.</p>
</div>
`}
]

}; // конец window.CALC_CHAPTERS
