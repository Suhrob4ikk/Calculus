import { st } from './state.js'
import { showPage } from './ui.js'
import { getUserResults, getLeaderboard, getProfilesByUsernames, deleteResultById, deleteAllUserResults } from './supabase.js'
import { escapeHtml } from './utils.js'

// ── Статистика ────────────────────────────────────────────
let _chartScore = null, _chartSection = null

window.showStatistics = async function() {
  showPage('statisticsPage')
  if (!st.currentUser) return

  let allData = null
  try {
    const result = await getUserResults(st.currentUser.id)
    if (result.error) throw result.error
    allData = result.data
  } catch (_) {
    document.getElementById('testsHistory').innerHTML = '<p class="text-red-400 text-center py-4">Ошибка загрузки. Проверьте соединение.</p>'
    return
  }
  const data = (allData || []).filter(r => !r.section?.startsWith('duel'))
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
  const sections = ['integrals', 'derivatives', 'series', 'limits', 'ode', 'probability', 'linalg']
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

  const secLabels = ['Интегралы', 'Производные', 'Ряды', 'Пределы', 'Дифф. ур.', 'Вероятность', 'Лин. алгебра']
  const secColors = ['#3b82f6', '#10b981', '#f43f5e', '#8b5cf6', '#f97316', '#38bdf8', '#a78bfa']
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
  const sLabel = { integrals: 'Интегралы', derivatives: 'Производные', series: 'Ряды', limits: 'Пределы', ode: 'Дифф. уравнения', probability: 'Вероятность', linalg: 'Линейная алгебра', daily: '🌟 Ежедневный' }
  document.getElementById('testsHistory').innerHTML = data.slice(0, 10).map(r => `
    <div class="bg-gray-50 rounded-lg p-4" id="hist-${r.id}">
      <div class="flex justify-between items-start">
        <div>
          <h4 class="font-semibold">${sLabel[r.section] || r.section} — ${r.difficulty==='easy'?'Лёгкий':r.difficulty==='medium'?'Средний':'Сложный'}</h4>
          <p class="text-sm text-gray-500">${new Date(r.created_at).toLocaleString('ru')}</p>
        </div>
        <div class="flex items-center gap-3">
          <div class="text-right">
            <span class="font-bold ${r.score>=70?'text-green-600':r.score>=50?'text-yellow-600':'text-red-600'}">${r.score}%</span>
            <p class="text-sm text-gray-500">${r.correct_answers}/${r.total_questions}</p>
          </div>
          <button onclick="window.deleteTestResult('${r.id}')"
            style="width:26px;height:26px;border-radius:50%;border:1px solid #e5e7eb;background:transparent;color:#9ca3af;cursor:pointer;font-size:0.8rem;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all 0.2s"
            onmouseover="this.style.borderColor='#ef4444';this.style.color='#ef4444'"
            onmouseout="this.style.borderColor='#e5e7eb';this.style.color='#9ca3af'"
            title="Удалить">✕</button>
        </div>
      </div>
    </div>`).join('')
}

window.deleteTestResult = async function(id) {
  if (!st.currentUser) return
  const { error } = await deleteResultById(id, st.currentUser.id)
  if (!error) {
    const el = document.getElementById('hist-' + id)
    if (el) el.remove()
  }
}

window.resetStatistics = async function() {
  if (!st.currentUser) return
  if (!confirm('Удалить всю историю тестов?')) return
  const { error } = await deleteAllUserResults(st.currentUser.id)
  if (!error) window.showStatistics()
}

window.toggleTheory = function(id) {
  document.getElementById(id).classList.toggle('hidden')
}

// ── Таблица лидеров ───────────────────────────────────────
// Очки: easy=1 · medium=2 · hard=3 за каждый правильный ответ.
// Берётся лучший результат на каждой уникальной комбинации секция+сложность.

function formatLastSeen(iso) {
  if (!iso) return ''
  const diff  = Date.now() - new Date(iso).getTime()
  const mins  = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days  = Math.floor(diff / 86400000)
  if (mins  <  2) return '<span style="color:#10b981;font-weight:600">● онлайн</span>'
  if (mins  < 60) return `${mins} мин назад`
  if (hours < 24) return `${hours} ч назад`
  if (days  < 30) return `${days} дн назад`
  return `${Math.floor(days / 30)} мес назад`
}

const DIFF_POINTS   = { easy: 10, medium: 20, hard: 30 }
const SECTION_ICONS  = { integrals: '∫', derivatives: "f'(x)", series: '∑', limits: 'lim', ode: "y'", probability: 'P', linalg: 'Ax' }
const SECTION_COLORS = { integrals: '#3b82f6', derivatives: '#10b981', series: '#f43f5e', limits: '#8b5cf6', ode: '#f97316', probability: '#38bdf8', linalg: '#6366f1' }

function calcRatingPoints(row) {
  return (row.correct_answers || 0) * (DIFF_POINTS[row.difficulty] || 20)
    + (row.score === 100 ? 25 : 0)
}

window.showLeaderboard = async function() {
  showPage('leaderboardPage')
  const container = document.getElementById('leaderboardList')
  container.innerHTML = '<p class="text-center py-8" style="color:var(--text-muted)">Загрузка...</p>'

  const sectionFilter = document.getElementById('lbSection')?.value   || null
  const diffFilter    = document.getElementById('lbDifficulty')?.value || null

  let data = null
  try {
    const result = await getLeaderboard(sectionFilter, diffFilter)
    if (result.error) throw result.error
    data = result.data
  } catch (_) {
    container.innerHTML = '<p class="text-center py-8 text-red-400">Ошибка загрузки. Проверьте соединение.</p>'
    return
  }
  if (!data || data.length === 0) {
    container.innerHTML = '<p class="text-center py-8" style="color:var(--text-muted)">Пока нет результатов</p>'
    return
  }

  const rankings = []

  if (!sectionFilter && !diffFilter) {
    // Глобальный рейтинг: суммируем все тесты
    const userMap = {}
    data.forEach(r => {
      const name = r.username || 'Аноним'
      if (!userMap[name]) userMap[name] = []
      userMap[name].push(r)
    })

    Object.entries(userMap).forEach(([username, entries]) => {
      const totalPts = entries.reduce((s, r) => s + calcRatingPoints(r) + (r.section === 'daily' ? 50 : 0), 0)
      const totalCorr = entries.reduce((s, r) => s + (r.correct_answers || 0), 0)
      const bestPct = Math.max(...entries.map(r => r.score || 0))
      const sections = [...new Set(entries.map(r => r.section))]
      const maxDiff = entries.some(r => r.difficulty === 'hard') ? 'hard'
                    : entries.some(r => r.difficulty === 'medium') ? 'medium' : 'easy'
      rankings.push({ username, totalPts, totalCorr, bestPct, sections, maxDiff, totalTests: entries.length })
    })
  } else {
    // Рейтинг по разделу: лучшая попытка пользователя
    const userMap = {}
    data.forEach(r => {
      const name = r.username || 'Аноним'
      const pts = calcRatingPoints(r)
      const prev = userMap[name]
      if (!prev || pts > calcRatingPoints(prev) || (pts === calcRatingPoints(prev) && (r.score || 0) > (prev.score || 0))) {
        userMap[name] = r
      }
    })

    Object.entries(userMap).forEach(([username, bestRow]) => {
      const totalPts = calcRatingPoints(bestRow)
      const totalCorr = bestRow.correct_answers || 0
      const bestPct = bestRow.score || 0
      const sections = [bestRow.section]
      const maxDiff = bestRow.difficulty
      rankings.push({ username, totalPts, totalCorr, bestPct, sections, maxDiff, totalTests: 1 })
    })
  }

  rankings.sort((a, b) =>
    b.totalPts  - a.totalPts  ||
    b.totalCorr - a.totalCorr ||
    b.bestPct   - a.bestPct
  )

  // Подгружаем аватарки + last_seen_at одним запросом
  const profiles = await getProfilesByUsernames(rankings.map(r => r.username))
  const profMap  = {}
  profiles.forEach(p => { profMap[p.username] = p })

  const medals    = ['🥇', '🥈', '🥉']
  const diffLabel = { easy: '🟢 Лёгкий', medium: '🟡 Средний', hard: '🔴 Сложный' }
  const rowBg = [
    'background:linear-gradient(135deg,rgba(234,179,8,0.12),rgba(234,179,8,0.04));border:1px solid rgba(234,179,8,0.25)',
    'background:linear-gradient(135deg,rgba(148,163,184,0.12),rgba(148,163,184,0.04));border:1px solid rgba(148,163,184,0.2)',
    'background:linear-gradient(135deg,rgba(249,115,22,0.12),rgba(249,115,22,0.04));border:1px solid rgba(249,115,22,0.2)',
  ]

  container.innerHTML = rankings.map((r, i) => {
    const prof = profMap[r.username] || {}

    // Аватарка: фото или инициал
    const avatarBorder = i===0?'rgba(234,179,8,0.5)':i===1?'rgba(148,163,184,0.4)':i===2?'rgba(249,115,22,0.4)':'var(--border)'
    const avatarHtml = prof.avatar_url
      ? `<img src="${escapeHtml(prof.avatar_url)}" style="width:38px;height:38px;border-radius:50%;object-fit:cover;flex-shrink:0;border:2px solid ${avatarBorder}">`
      : `<div style="width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,#3b82f6,#8b5cf6);display:flex;align-items:center;justify-content:center;font-weight:700;color:white;font-size:1rem;flex-shrink:0;border:2px solid ${avatarBorder}">${escapeHtml(r.username[0]?.toUpperCase() || '?')}</div>`

    const lastSeen = formatLastSeen(prof.last_seen_at)

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
    <div data-username="${escapeHtml(r.username)}" onclick="viewProfile(this.dataset.username)" style="${rowStyle};border-radius:0.875rem;padding:0.75rem 0.875rem;margin-bottom:0.5rem;display:flex;align-items:center;gap:0.625rem;cursor:pointer">
      <span style="font-size:1.5rem;width:1.75rem;text-align:center;flex-shrink:0">${medals[i] || `<span style="font-size:0.85rem;color:var(--text-muted)">${i+1}</span>`}</span>
      ${avatarHtml}
      <div style="flex:1;min-width:0">
        <div style="font-weight:700;color:var(--text-main);display:flex;align-items:center;gap:4px;flex-wrap:wrap">
          ${escapeHtml(r.username)}${crown}
          <span style="font-size:0.7rem;font-weight:500;color:var(--text-muted);margin-left:2px">${diffLabel[r.maxDiff]}</span>
        </div>
        <div style="margin-top:2px;display:flex;flex-wrap:wrap;gap:3px">${sectionBadges}</div>
        <div style="font-size:0.7rem;color:var(--text-muted);margin-top:2px;display:flex;align-items:center;gap:6px;flex-wrap:wrap">
          <span>${r.totalTests} тестов · ${r.totalCorr} отв.</span>
          ${lastSeen ? `<span style="opacity:0.8">${lastSeen}</span>` : ''}
        </div>
      </div>
      <div style="text-align:right;flex-shrink:0">
        <div style="font-size:1.3rem;font-weight:800;color:${i===0?'#f59e0b':i===1?'var(--text-muted)':i===2?'#f97316':'var(--text-main)'}">
          ${r.totalPts}<span style="font-size:0.65rem;font-weight:500;color:var(--text-muted)"> pts</span>
        </div>
        <div style="font-size:0.7rem;color:var(--text-muted)">лучший: ${r.bestPct}%</div>
      </div>
    </div>`
  }).join('')
}
