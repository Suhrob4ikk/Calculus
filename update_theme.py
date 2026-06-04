import re
from pathlib import Path

html_path = Path(__file__).parent / "index.html"
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

# Make body dark theme
html = re.sub(r'<body class="bg-gray-50 min-h-screen transition-colors duration-300">', r'<body class="bg-slate-900 min-h-screen text-slate-100 math-bg dark-theme">', html)

# Replace all bg-white with glass-panel or glass-card
# 1. Auth card
html = re.sub(r'class="auth-card"', r'class="auth-card glass-panel"', html)

# 2. Main containers and cards
html = html.replace('bg-white rounded-2xl shadow-lg p-8', 'glass-panel rounded-3xl shadow-xl p-8 border border-slate-700/50')
html = html.replace('bg-white rounded-2xl shadow-lg p-6', 'glass-panel rounded-3xl shadow-xl p-6 border border-slate-700/50')

# 3. Small cards
html = html.replace('bg-blue-50 rounded-xl p-6 text-center card-hover cursor-pointer', 'glass-card rounded-xl p-6 text-center card-hover cursor-pointer border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]')
html = html.replace('bg-yellow-50 rounded-xl p-6 text-center card-hover cursor-pointer', 'glass-card rounded-xl p-6 text-center card-hover cursor-pointer border border-yellow-500/20 shadow-[0_0_15px_rgba(234,179,8,0.1)]')
html = html.replace('bg-red-50 rounded-xl p-6 text-center card-hover cursor-pointer', 'glass-card rounded-xl p-6 text-center card-hover cursor-pointer border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]')
html = html.replace('bg-indigo-50 rounded-xl p-6 text-center card-hover cursor-pointer', 'glass-card rounded-xl p-6 text-center card-hover cursor-pointer border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.1)]')

# 4. Buttons
html = html.replace('bg-blue-600 hover:bg-blue-700', 'bg-blue-600 hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.4)]')
html = html.replace('bg-green-600 hover:bg-green-700', 'bg-emerald-600 hover:bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]')
html = html.replace('bg-red-600 hover:bg-red-700', 'bg-rose-600 hover:bg-rose-500 shadow-[0_0_15px_rgba(225,29,72,0.4)]')
html = html.replace('bg-yellow-600 hover:bg-yellow-700', 'bg-amber-600 hover:bg-amber-500 shadow-[0_0_15px_rgba(217,119,6,0.4)]')
html = html.replace('bg-indigo-600 hover:bg-indigo-700', 'bg-indigo-600 hover:bg-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.4)]')
html = html.replace('bg-purple-600 hover:bg-purple-700', 'bg-purple-600 hover:bg-purple-500 shadow-[0_0_15px_rgba(147,51,234,0.4)]')
html = html.replace('bg-gray-600 hover:bg-gray-700', 'bg-slate-700 hover:bg-slate-600 border border-slate-500/30')

# 5. Text colors
html = html.replace('text-gray-800', 'text-slate-100')
html = html.replace('text-gray-700', 'text-slate-300')
html = html.replace('text-gray-600', 'text-slate-400')
html = html.replace('text-blue-600 hover:text-blue-800', 'text-blue-400 hover:text-blue-300')

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html)
print("Updated HTML")
