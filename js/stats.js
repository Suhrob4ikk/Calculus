import { st } from './state.js'
import { showPage } from './ui.js'
import { getUserResults, getLeaderboard } from './supabase.js'

// ── Статистика ────────────────────────────────────────────
let _chartScore = null, _chartSection = null

window.showStatistics = async function() {
  showPage('statisticsPage')
  if (!st.currentUser) return

  const { data: allData } = await getUserResults(st.currentUser.id)
  const data = (allData || []).filter(r => r.section !== 'duel')
  if (!data || data.length === 0) {
    document.getElementById('testsHistory').innerHTML = '<p class="text-gray-500 text-center py-4">История пуста</p>'
    document.getElementById('statsChartsContainer').innerHTML = ''
    return
  }

  const mainData = data.filter(r => r.section !== 'daily')
  const total    = data.length
  const best     = Math.max(...data.map(r => r.score))
  const avg      = Math.round(data.reduce((s, r) => s + r.score, 0) / total)

  document.getElementById('totalTests').textContent    = total
  document.getElementById('bestScore').textContent     = best + '%'
  document.getElementById('averageScore').textContent  = avg + '%'

  // Прогресс-бары по разделам
  const sections = ['integrals', 'derivatives', 'series', 'limits', 'ode']
  sections.forEach(sec => {
    const sd  = data.filter(r => r.section === sec)
    const sav = sd.length ? Math.round(sd.reduce((s, r) => s + r.score, 0) / sd.length) : 0
    const el  = document.getElementById(`${sec}Progress`)
    const bar = document.getElementById(`${sec}ProgressBar`)
    if (el)  el.textContent  = sav + '%'
    if (bar) bar.style.width = sav + '%'
  })

  // Chart.js графики
  const container = document.getElementById('statsChartsContainer')
  container.innerHTML = `
    <h3 class="text-xl font-bold text-gray-800 mb-3">📈 Динамика результатов</h3>
    <div style="position:relative;height:200px;margin-bottom:1.5rem">
      <canvas id="scoreChart"></canvas>
    </div>
    <h3 class="text-xl font-bold text-gray-800 mb-3">📊 Средний балл по разделам</h3>
    <div style="position:relative;height:180px;margin-bottom:1.5rem">
      <canvas id="sectionChart"></canvas>
    </div>`

  if (_chartScore)   { _chartScore.destroy();   _chartScore   = null }
  if (_chartSection) { _chartSection.destroy(); _chartSection = null }

  /* global Chart */
  const recent = [...mainData].reverse().slice(-20)
  _chartScore = new Chart(document.getElementById('scoreChart'), {
    type: 'line',
    data: {
      labels: recent.map(r => {
        const d = new Date(r.created_at)
        return `${d.getDate()}.${String(d.getMonth() + 1).padStart(2, '0')}`
      }),
      datasets: [{
        label: 'Результат (%)',
        data: recent.map(r => r.score),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59,130,246,0.12)',
        tension: 0.35,
        fill: true,
        pointBackgroundColor: recent.map(r => r.score >= 70 ? '#10b981' : r.score >= 50 ? '#f59e0b' : '#ef4444'),
        pointRadius: 5,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { min: 0, max: 100, ticks: { callback: v => v + '%', font: { size: 11 } }, grid: { color: 'rgba(0,0,0,0.06)' } },
        x: { ticks: { font: { size: 10 } }, grid: { display: false } }
      }
    }
  })

  const secLabels = ['Интегралы', 'Производные', 'Ряды', 'Пределы', 'Дифф. ур.']
  const secColors = ['#3b82f6', '#10b981', '#f43f5e', '#8b5cf6', '#f97316']
  const secAvgs   = sections.map(sec => {
    const sd = data.filter(r => r.section === sec)
    return sd.length ? Math.round(sd.reduce((s, r) => s + r.score, 0) / sd.length) : 0
  })
  _chartSection = new Chart(document.getElementById('sectionChart'), {
    type: 'bar',
    data: {
      labels: secLabels,
      datasets: [{
        data: secAvgs,
        backgroundColor: secColors.map(c => c + '33'),
        borderColor: secColors,
        borderWidth: 2,
        borderRadius: 6,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { min: 0, max: 100, ticks: { callback: v => v + '%', font: { size: 11 } }, grid: { color: 'rgba(0,0,0,0.06)' } },
        x: { ticks: { font: { size: 11 } }, grid: { display: false } }
      }
    }
  })

  // История тестов
  const sLabel = { integrals: 'Интегралы', derivatives: 'Производные', series: 'Ряды', limits: 'Пределы', ode: 'Дифф. уравнения', daily: '🌟 Ежедневный' }
  document.getElementById('testsHistory').innerHTML = data.slice(0, 10).map(r => `
    <div class="bg-gray-50 rounded-lg p-4">
      <div class="flex justify-between items-start">
        <div>
          <h4 class="font-semibold">${sLabel[r.section] || r.section} — ${r.difficulty==='easy'?'Лёгкий':r.difficulty==='medium'?'Средний':'Сложный'}</h4>
          <p class="text-sm text-gray-500">${new Date(r.created_at).toLocaleString('ru')}</p>
        </div>
        <div class="text-right">
          <span class="font-bold ${r.score>=70?'text-green-600':r.score>=50?'text-yellow-600':'text-red-600'}">${r.score}%</span>
          <p class="text-sm text-gray-500">${r.correct_answers}/${r.total_questions}</p>
        </div>
      </div>
    </div>`).join('')
}

window.resetStatistics = function() {
  alert('Для сброса статистики обратитесь к администратору.')
}

window.toggleTheory = function(id) {
  document.getElementById(id).classList.toggle('hidden')
}

// ── Таблица лидеров ───────────────────────────────────────
// Очки: easy=1 · medium=2 · hard=3 за каждый правильный ответ.
// Берётся лучший результат на каждой уникальной комбинации секция+сложность.
const DIFF_POINTS   = { easy: 1, medium: 2, hard: 3 }
const SECTION_ICONS  = { integrals: '∫', derivatives: "f'(x)", series: '∑', limits: 'lim', ode: "y'" }
const SECTION_COLORS = { integrals: '#3b82f6', derivatives: '#10b981', series: '#f43f5e', limits: '#8b5cf6', ode: '#f97316' }

function calcRatingPoints(row) {
  return (row.correct_answers || 0) * (DIFF_POINTS[row.difficulty] || 1)
}

window.showLeaderboard = async function() {
  showPage('leaderboardPage')
  const container = document.getElementById('leaderboardList')
  container.innerHTML = '<p class="text-center py-8" style="color:var(--text-muted)">Загрузка...</p>'

  const sectionFilter = document.getElementById('lbSection')?.value   || null
  const diffFilter    = document.getElementById('lbDifficulty')?.value || null

  const { data } = await getLeaderboard(sectionFilter, diffFilter)
  if (!data || data.length === 0) {
    container.innerHTML = '<p class="text-center py-8" style="color:var(--text-muted)">Пока нет результатов</p>'
    return
  }

  // Лучшая попытка на каждую комбинацию секция+сложность по пользователю
  const userMap = {}
  data.forEach(r => {
    const name = r.username || 'Аноним'
    if (!userMap[name]) userMap[name] = {}
    const key  = `${r.section}_${r.difficulty}`
    const pts  = calcRatingPoints(r)
    const prev = userMap[name][key]
    if (!prev || pts > calcRatingPoints(prev) || (pts === calcRatingPoints(prev) && (r.score || 0) > (prev.score || 0))) {
      userMap[name][key] = r
    }
  })

  const rankings = Object.entries(userMap).map(([username, comboMap]) => {
    const combos    = Object.values(comboMap)
    const totalPts  = combos.reduce((s, r) => s + calcRatingPoints(r), 0)
    const totalCorr = combos.reduce((s, r) => s + (r.correct_answers || 0), 0)
    const bestPct   = Math.max(...combos.map(r => r.score || 0))
    const sections  = [...new Set(combos.map(r => r.section))]
    const maxDiff   = combos.some(r => r.difficulty === 'hard')   ? 'hard'
                    : combos.some(r => r.difficulty === 'medium') ? 'medium' : 'easy'
    return { username, totalPts, totalCorr, bestPct, sections, maxDiff, combos: combos.length }
  }).sort((a, b) =>
    b.totalPts  - a.totalPts  ||
    b.totalCorr - a.totalCorr ||
    b.bestPct   - a.bestPct
  )

  const medals    = ['🥇', '🥈', '🥉']
  const diffLabel = { easy: '🟢 Лёгкий', medium: '🟡 Средний', hard: '🔴 Сложный' }
  const rowBg = [
    'background:linear-gradient(135deg,rgba(234,179,8,0.12),rgba(234,179,8,0.04));border:1px solid rgba(234,179,8,0.25)',
    'background:linear-gradient(135deg,rgba(148,163,184,0.12),rgba(148,163,184,0.04));border:1px solid rgba(148,163,184,0.2)',
    'background:linear-gradient(135deg,rgba(249,115,22,0.12),rgba(249,115,22,0.04));border:1px solid rgba(249,115,22,0.2)',
  ]

  container.innerHTML = rankings.map((r, i) => {
    const sectionBadges = r.sections.map(s =>
      `<span style="display:inline-block;padding:1px 8px;border-radius:99px;font-size:0.7rem;font-weight:700;
       background:${SECTION_COLORS[s]}22;color:${SECTION_COLORS[s]};border:1px solid ${SECTION_COLORS[s]}44;
       font-family:'Playfair Display',serif">${SECTION_ICONS[s] || s}</span>`
    ).join(' ')
    const crown    = r.username === 'Suhrob'
      ? ' <span style="background:linear-gradient(135deg,#f59e0b,#d97706);color:white;font-size:0.6rem;font-weight:700;padding:1px 6px;border-radius:10px">👑</span>'
      : ''
    const rowStyle = i < 3 ? rowBg[i] : 'background:var(--bg-card);border:1px solid var(--border)'
    return `
    <div style="${rowStyle};border-radius:0.875rem;padding:0.875rem 1rem;margin-bottom:0.5rem;display:flex;align-items:center;gap:0.75rem">
      <span style="font-size:1.6rem;width:2rem;text-align:center;flex-shrink:0">${medals[i] || `<span style="font-size:0.9rem;color:var(--text-muted)">${i+1}</span>`}</span>
      <div style="flex:1;min-width:0">
        <div style="font-weight:700;color:var(--text-main);display:flex;align-items:center;gap:4px;flex-wrap:wrap">
          ${r.username}${crown}
          <span style="font-size:0.7rem;font-weight:500;color:var(--text-muted);margin-left:2px">${diffLabel[r.maxDiff]}</span>
        </div>
        <div style="margin-top:3px;display:flex;flex-wrap:wrap;gap:3px">${sectionBadges}</div>
        <div style="font-size:0.72rem;color:var(--text-muted);margin-top:3px">
          ${r.combos} комбо · ${r.totalCorr} правильных ответов
        </div>
      </div>
      <div style="text-align:right;flex-shrink:0">
        <div style="font-size:1.4rem;font-weight:800;color:${i===0?'#f59e0b':i===1?'#94a3b8':i===2?'#f97316':'var(--text-main)'}">
          ${r.totalPts}<span style="font-size:0.7rem;font-weight:500;color:var(--text-muted)"> pts</span>
        </div>
        <div style="font-size:0.72rem;color:var(--text-muted)">лучший: ${r.bestPct}%</div>
      </div>
    </div>`
  }).join('')
}
