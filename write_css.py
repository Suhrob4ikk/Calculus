css_path = 'c:/Users/Suhrob/Documents/site/Calculus/Calculus/css/style.css'
css_content = '''/* -- CSS переменные ---------------------------------------- */
:root {
  --glass-bg: rgba(30, 41, 59, 0.7);
  --glass-border: rgba(148, 163, 184, 0.1);
  --glass-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  --math-color: rgba(255, 255, 255, 0.05);

  --bg-main: #0f172a;
  --bg-card: #1e293b;
  --text-main: #f8fafc;
  --text-muted: #94a3b8;
  --border: #334155;
  --input-bg: #1e293b;
  
  --result-green: rgba(6, 78, 59, 0.5);
  --result-red: rgba(69, 10, 10, 0.5);
  --result-green-border: #10b981;
  --result-red-border: #ef4444;
  --result-green-text: #a7f3d0;
  --result-red-text: #fca5a5;
  --history-bg: rgba(39, 52, 71, 0.5);
}

body.dark-theme {
  background-color: var(--bg-main);
  color: var(--text-main);
}

body {
  overflow-x: hidden;
  background-color: var(--bg-main);
  color: var(--text-main);
}

/* Математический фон через SVG Data URI */
.math-bg {
  position: relative;
  background-color: #0f172a;
  background-image: radial-gradient(circle at 50% 50%, #1e293b 0%, #0f172a 100%);
}

.math-bg::before {
  content: '';
  position: fixed;
  top: 0; left: 0; width: 100vw; height: 100vh;
  z-index: 0;
  opacity: 0.07;
  pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg width='800' height='600' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23ffffff' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Ctext x='50' y='100' font-family='serif' font-size='24' fill='%23ffffff' stroke='none'%3E? f(x) dx = F(x) + C%3C/text%3E%3Ctext x='300' y='250' font-family='serif' font-size='20' fill='%23ffffff' stroke='none'%3Ed/dx [e^x] = e^x%3C/text%3E%3Ctext x='550' y='120' font-family='serif' font-size='28' fill='%23ffffff' stroke='none'%3E?(n=1 to ?) 1/n? = ??/6%3C/text%3E%3Ctext x='100' y='400' font-family='serif' font-size='22' fill='%23ffffff' stroke='none'%3Elim (x>0) sin(x)/x = 1%3C/text%3E%3Ctext x='400' y='500' font-family='serif' font-size='26' fill='%23ffffff' stroke='none'%3E? ? B = ??J + ????(?E/?t)%3C/text%3E%3Ctext x='650' y='350' font-family='serif' font-size='24' fill='%23ffffff' stroke='none'%3Ee^(i?) + 1 = 0%3C/text%3E%3Cpath d='M200 150 Q 250 50 300 150 T 400 150' /%3E%3Cpath d='M600 450 L 650 400 L 700 450' /%3E%3Ccircle cx='150' cy='250' r='40' /%3E%3Crect x='500' y='200' width='60' height='40' /%3E%3C/g%3E%3C/svg%3E");
  background-size: cover;
  background-position: center;
}

.glass-panel {
  background: var(--glass-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--glass-border);
  box-shadow: var(--glass-shadow);
}

.glass-card {
  background: rgba(30, 41, 59, 0.4);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.glass-btn {
  background: rgba(30, 41, 59, 0.5);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

/* -- Анимации ---------------------------------------------- */
.fade-in {
  animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.card-hover {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.card-hover:hover {
  transform: translateY(-8px);
}

/* -- Кнопка темы ------------------------------------------- */
#themeToggle {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 1000;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid rgba(148, 163, 184, 0.2);
  background: rgba(30, 41, 59, 0.6);
  backdrop-filter: blur(12px);
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(0,0,0,0.3);
  transition: all 0.3s ease;
}

#themeToggle:hover {
  background: rgba(51, 65, 85, 0.8);
}

/* -- Инпуты и селекты -------------------------------------- */
input, select {
  background-color: var(--input-bg);
  color: var(--text-main);
  border-color: var(--border);
}

input:focus, select:focus {
  border-color: #60a5fa;
  background: #1e293b;
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* -- Варианты ответов -------------------------------------- */
.option-label {
  display: flex;
  align-items: flex-start;
  width: 100%;
  min-width: 0;
  padding: 1rem;
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  break-inside: avoid;
  background: rgba(30, 41, 59, 0.6);
  color: var(--text-main);
}

.option-label:hover {
  background-color: rgba(51, 65, 85, 0.8);
  border-color: rgba(148, 163, 184, 0.4);
}

.option-label.selected {
  border-color: rgba(59, 130, 246, 0.6);
  background-color: rgba(59, 130, 246, 0.1);
  box-shadow: 0 0 15px rgba(59, 130, 246, 0.15);
}

.option-text {
  flex: 1;
  min-width: 0;
  word-wrap: break-word;
  overflow-wrap: break-word;
  font-size: 0.875rem;
  color: #e2e8f0;
}

@media (min-width: 640px) {
  .option-text { font-size: 1rem; }
}

/* -- Карточки результатов --------------- */
.result-card-correct {
  background-color: var(--result-green);
  border-left: 4px solid var(--result-green-border);
  border-radius: 0.5rem;
  padding: 0.75rem;
  color: var(--result-green-text);
}
.result-card-wrong {
  background-color: var(--result-red);
  border-left: 4px solid var(--result-red-border);
  border-radius: 0.5rem;
  padding: 0.75rem;
  color: var(--result-red-text);
}

/* -- Математические формулы -------------------------------- */
.math-container { overflow-x: auto; max-width: 100%; }
.math-content { display: inline-block; min-width: min-content; }

/* -- Статистика -------------------------------------------- */
.stat-card {
  padding: 1.5rem;
  border-radius: 1rem;
  border: 1px solid rgba(148, 163, 184, 0.1);
  background: rgba(30, 41, 59, 0.4);
}

.stat-value {
  font-size: 2.5rem;
  font-weight: bold;
  color: #93c5fd;
}

.stat-label {
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: 0.5rem;
  color: var(--text-muted);
}

.progress-bar {
  border-radius: 9999px;
  overflow: hidden;
  background-color: #334155;
  height: 8px;
}

.progress-fill {
  height: 100%;
  border-radius: 9999px;
  background: linear-gradient(90deg, #3b82f6, #1d4ed8);
  transition: width 1s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Кастомный скроллбар */
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: rgba(30, 41, 59, 0.5); border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(71, 85, 105, 0.8); border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(148, 163, 184, 0.8); }

/* Мобильная адаптация */
@media (max-width: 640px) {
  .flex.justify-between { flex-direction: column; gap: 1rem; }
  .flex.justify-between>button { width: 100%; margin: 0.25rem 0; }
  .flex.gap-4.justify-center { flex-direction: column; align-items: center; }
  .flex.gap-4.justify-center>button { width: 100%; max-width: 250px; margin: 0.25rem 0; }
}
@media (max-width: 768px) {
  .container { padding-left: 1rem; padding-right: 1rem; }
  .text-4xl { font-size: 1.875rem !important; }
  .text-6xl { font-size: 2.25rem !important; }
}
'''

with open(css_path, 'w', encoding='utf-8') as f:
    f.write(css_content)
print("Updated CSS")
