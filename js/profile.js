import { st } from './state.js'
import { showPage, updateUserUI, renderStreakBadge, renderXPBadge } from './ui.js'
import { supabase, getUserResults, getAvatarUrl, uploadAvatar, getLeaderboard, getDuelHistory } from './supabase.js'

// ── Уровни пользователя ───────────────────────────────────
export function getUserLevel(total, avg) {
  if (total >= 20 && avg >= 85) return { name: 'Эксперт',      icon: '🏆', color: '#f59e0b', next: null,                                        progress: 100 }
  if (total >= 10 && avg >= 75) return { name: 'Продвинутый',  icon: '🔥', color: '#3b82f6', next: 'Эксперт (20 тестов, ср. 85%)',             progress: Math.min(100, Math.round((total/20)*100)) }
  if (total >= 5  && avg >= 60) return { name: 'Практик',      icon: '📚', color: '#10b981', next: 'Продвинутый (10 тестов, ср. 75%)',         progress: Math.min(100, Math.round((total/10)*100)) }
  if (total >= 1)               return { name: 'Студент',      icon: '🎓', color: '#8b5cf6', next: 'Практик (5 тестов, ср. 60%)',              progress: Math.min(100, Math.round((total/5)*100))  }
  return                               { name: 'Новичок',      icon: '⭐', color: '#6b7280', next: 'Студент (1 тест)',                          progress: 0 }
}

// ── Достижения ────────────────────────────────────────────
export function computeBadges(data, sections) {
  const total = data.length
  const best  = total ? Math.max(...data.map(r => r.score)) : 0
  const avg   = total ? Math.round(data.reduce((s, r) => s + r.score, 0) / total) : 0
  const badges = []
  if (total >= 1)   badges.push({ icon: '🎯', text: 'Первый тест',    cls: 'badge-silver' })
  if (total >= 5)   badges.push({ icon: '📚', text: '5 тестов',       cls: 'badge-silver' })
  if (total >= 10)  badges.push({ icon: '🔥', text: '10 тестов',      cls: 'badge-gold'   })
  if (total >= 20)  badges.push({ icon: '💎', text: '20 тестов',      cls: 'badge-gold'   })
  if (best === 100) badges.push({ icon: '🏆', text: 'Идеальный балл', cls: 'badge-gold'   })
  if (best >= 90)   badges.push({ icon: '⭐', text: 'Отличник',       cls: 'badge-gold'   })
  if (avg >= 70)    badges.push({ icon: '✅', text: 'Стабильный',     cls: 'badge-green'  })
  const covered = sections.filter(s => data.some(r => r.section === s))
  if (covered.length >= 4) badges.push({ icon: '🌟', text: 'Всесторонний', cls: 'badge-green' })
  let maxStreak = 0, cur = 0
  data.slice().reverse().forEach(r => {
    if (r.score >= 70) { cur++; maxStreak = Math.max(maxStreak, cur) } else cur = 0
  })
  if (maxStreak >= 3) badges.push({ icon: '🔆', text: `Серия ${maxStreak} побед`, cls: 'badge-gold' })
  if (maxStreak >= 5) badges.push({ icon: '⚡', text: 'Горячая серия',            cls: 'badge-gold' })
  return { badges, total, best, avg }
}

// ── Навигация главной ─────────────────────────────────────
window.showHome = function() {
  window._stopTimer?.()
  showPage('homePage')
  renderStreakBadge()
  renderXPBadge()
  window.updateDailyChallengeCard?.()
}

window.showSection = function(section) {
  st.currentSection = section
  const map = {
    integrals:   'integralsSection',
    derivatives: 'derivativesSection',
    series:      'seriesSection',
    limits:      'limitsSection',
    ode:         'odeSection'
  }
  showPage(map[section])
}

// ── Аватар ────────────────────────────────────────────────
window.triggerAvatarUpload = function() {
  document.getElementById('avatarInput').click()
}

async function handleAvatarUpload(event) {
  const file = event.target.files[0]
  if (!file || !st.currentUser) return
  if (file.size > 2 * 1024 * 1024) { alert('Файл слишком большой. Максимум 2MB'); return }

  const btn = document.getElementById('avatarUploadBtn')
  if (btn) { btn.textContent = '⏳ Загрузка...'; btn.disabled = true }

  const { url, error } = await uploadAvatar(st.currentUser.id, file)
  if (error) {
    alert('Ошибка загрузки: ' + error.message)
  } else {
    const img    = document.getElementById('profileAvatarImg')
    const letter = document.getElementById('profileAvatar')
    if (img)    { img.src = url; img.style.display = 'block' }
    if (letter) letter.style.display = 'none'
    const dhImg    = document.getElementById('dhAvatarImg')
    const dhLetter = document.getElementById('dhAvatarLetter')
    if (dhImg)    { dhImg.src = url; dhImg.style.display = 'block' }
    if (dhLetter) dhLetter.style.display = 'none'
    if (btn) {
      btn.textContent = '✅ Загружено!'
      setTimeout(() => { btn.textContent = '📷 Сменить фото'; btn.disabled = false }, 2000)
    }
  }
  if (btn && btn.disabled) { btn.textContent = '📷 Сменить фото'; btn.disabled = false }
}

// ── Профиль ───────────────────────────────────────────────
window.showProfile = async function() {
  showPage('profilePage')
  if (!st.currentUser) return

  // Состояние кнопки push-уведомлений
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    navigator.serviceWorker.ready.then(reg => {
      reg.pushManager.getSubscription().then(sub => {
        const btn = document.getElementById('pushToggleBtn')
        if (!btn) return
        if (sub) { btn.textContent = '🔕 Отключить уведомления'; btn.classList.add('active-push') }
        else     { btn.textContent = '🔔 Включить уведомления';  btn.classList.remove('active-push') }
      })
    })
  }

  setTimeout(() => {
    const avatarBtn = document.getElementById('avatarUploadBtn')
    if (avatarBtn) avatarBtn.onclick = () => document.getElementById('avatarInput').click()
    const avatarInput = document.getElementById('avatarInput')
    if (avatarInput) avatarInput.onchange = handleAvatarUpload

    const avatarDeleteBtn = document.getElementById('avatarDeleteBtn')
    if (avatarDeleteBtn) avatarDeleteBtn.onclick = async () => {
      if (!st.currentUser) return
      if (!confirm('Удалить фото профиля?')) return
      const { data: files } = await supabase.storage.from('avatars').list(st.currentUser.id)
      if (files && files.length > 0) {
        await supabase.storage.from('avatars').remove(files.map(f => `${st.currentUser.id}/${f.name}`))
      }
      await supabase.from('profiles').update({ avatar_url: null }).eq('id', st.currentUser.id)
      const img    = document.getElementById('profileAvatarImg')
      const letter = document.getElementById('profileAvatar')
      if (img)    { img.src = ''; img.style.display = 'none' }
      if (letter) letter.style.display = 'flex'
      const dhImg    = document.getElementById('dhAvatarImg')
      const dhLetter = document.getElementById('dhAvatarLetter')
      if (dhImg)    dhImg.style.display = 'none'
      if (dhLetter) dhLetter.style.display = ''
      updateUserUI()
    }
  }, 50)

  const username  = st.currentUser.user_metadata?.username || st.currentUser.email.split('@')[0]
  const email     = st.currentUser.email
  const isCreator = st.currentUser.email === 'davlatovsurob@gmail.com'

  const avatar = document.getElementById('profileAvatar')
  if (avatar) { avatar.textContent = username.charAt(0).toUpperCase(); avatar.style.display = 'flex' }

  const avatarImg = document.getElementById('profileAvatarImg')
  if (avatarImg) {
    const url = await getAvatarUrl(st.currentUser.id)
    if (url) {
      avatarImg.src = url; avatarImg.style.display = 'block'; avatarImg.style.cursor = 'pointer'
      avatarImg.onclick = () => window.openPhotoPreview(url, username)
      if (avatar) avatar.style.display = 'none'
      const dhImg    = document.getElementById('dhAvatarImg')
      const dhLetter = document.getElementById('dhAvatarLetter')
      if (dhImg)    { dhImg.src = url; dhImg.style.display = 'block' }
      if (dhLetter) dhLetter.style.display = 'none'
    } else {
      avatarImg.style.display = 'none'
      if (avatar) avatar.style.display = 'flex'
      const dhImg    = document.getElementById('dhAvatarImg')
      const dhLetter = document.getElementById('dhAvatarLetter')
      if (dhImg)    dhImg.style.display = 'none'
      if (dhLetter) { dhLetter.textContent = username[0]?.toUpperCase() || '?'; dhLetter.style.display = '' }
    }
  }

  const nameEl = document.getElementById('profileName')
  if (nameEl) {
    nameEl.innerHTML = username + (isCreator
      ? ' <span title="Создатель сайта" style="display:inline-flex;align-items:center;gap:3px;background:linear-gradient(135deg,#f59e0b,#d97706);color:white;font-size:0.65rem;font-weight:700;padding:2px 8px;border-radius:20px;vertical-align:middle">👑 Разработчик</span>'
      : '')
  }
  const emailEl = document.getElementById('profileEmail')
  if (emailEl) emailEl.textContent = email

  const { data: allData }  = await getUserResults(st.currentUser.id)
  const profileContent     = document.getElementById('profileContent')
  if (!profileContent) return

  const data = (allData || []).filter(r => r.section !== 'duel')

  if (!data || data.length === 0) {
    profileContent.innerHTML = '<p class="text-slate-400 text-sm text-center py-4">Пройдите тесты чтобы увидеть статистику!</p><div id="duelHistoryBlock"></div>'
    const block = document.getElementById('duelHistoryBlock')
    if (block) {
      const { data: duels } = await getDuelHistory(st.currentUser.id)
      if (duels && duels.length > 0)
        block.innerHTML = '<p class="text-slate-400 text-sm text-center">⚔️ У вас есть история дуэлей — см. ниже</p>'
    }
    return
  }

  const sections = ['integrals', 'derivatives', 'series', 'limits', 'ode']
  const { badges, total, best, avg } = computeBadges(data, sections)
  const level = getUserLevel(total, avg)

  const sectionLabels = { integrals: 'Интегралы', derivatives: 'Производные', series: 'Ряды', limits: 'Пределы', ode: 'Дифф. уравнения' }
  const bestResults = sections.map(sec => {
    const secData = data.filter(r => r.section === sec)
    if (!secData.length) return null
    const b = secData.reduce((a, b) => a.score > b.score ? a : b)
    return { ...b, sectionName: sectionLabels[sec] || sec }
  }).filter(Boolean)

  // Место в рейтинге
  const { data: lbData } = await getLeaderboard(null, null)
  let compareHTML = ''
  if (lbData && lbData.length > 0) {
    const allAvgs = {}
    lbData.forEach(r => {
      if (!allAvgs[r.username]) allAvgs[r.username] = []
      allAvgs[r.username].push(r.score)
    })
    const rankings = Object.entries(allAvgs)
      .map(([name, scores]) => ({ name, avg: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) }))
      .sort((a, b) => b.avg - a.avg)
    const myRank = rankings.findIndex(r => r.name === username) + 1
    compareHTML = `
      <h3 class="text-lg font-bold text-slate-200 mb-3">📊 Место в рейтинге</h3>
      <div class="rounded-xl p-4 mb-4" style="background:rgba(59,130,246,0.1);border:1px solid rgba(59,130,246,0.2)">
        <div class="text-center mb-3">
          <div class="text-3xl font-bold text-blue-400">#${myRank}</div>
          <div class="text-slate-400 text-sm">из ${rankings.length} пользователей</div>
        </div>
        <div class="space-y-2">
          ${rankings.slice(0, 3).map((r, i) => `
            <div class="flex justify-between items-center p-2 rounded-lg ${r.name === username ? 'bg-blue-900/40 font-bold' : 'bg-slate-800/40'}">
              <span class="text-slate-200">${['🥇','🥈','🥉'][i]} ${r.name}</span>
              <span class="text-blue-400 font-semibold">${r.avg}%</span>
            </div>`).join('')}
          ${myRank > 3 ? `
            <div class="text-center text-slate-500 text-xs">...</div>
            <div class="flex justify-between items-center p-2 rounded-lg bg-blue-900/40 font-bold">
              <span class="text-slate-200">#${myRank} ${username}</span>
              <span class="text-blue-400 font-semibold">${avg}%</span>
            </div>` : ''}
        </div>
      </div>`
  }

  // График прогресса
  const recent    = [...data].slice(0, 7).reverse()
  const chartBars = recent.map(r => {
    const h     = Math.round((r.score / 100) * 80)
    const color = r.score >= 70 ? '#10b981' : r.score >= 50 ? '#f59e0b' : '#ef4444'
    const date  = new Date(r.created_at).toLocaleDateString('ru', { day: 'numeric', month: 'short' })
    return `<div class="flex flex-col items-center gap-1" style="flex:1">
      <div class="text-xs font-bold" style="color:${color}">${r.score}%</div>
      <div style="height:${h}px;width:100%;background:${color};border-radius:4px 4px 0 0;min-height:4px"></div>
      <div style="font-size:0.6rem;color:#64748b">${date}</div>
    </div>`
  }).join('')

  profileContent.innerHTML = `
    <h3 class="text-lg font-bold text-slate-200 mb-3">🎮 Уровень</h3>
    <div class="rounded-xl p-4 mb-4" style="background:linear-gradient(135deg,${level.color}18,${level.color}08);border:1.5px solid ${level.color}30">
      <div class="flex items-center gap-3 mb-2">
        <span style="font-size:2rem">${level.icon}</span>
        <div>
          <div class="font-bold text-lg" style="color:${level.color}">${level.name}</div>
          ${level.next ? `<div class="text-xs text-slate-400">Следующий: ${level.next}</div>` : '<div class="text-xs text-slate-400">Максимальный уровень!</div>'}
        </div>
      </div>
      <div style="height:8px;background:#334155;border-radius:4px;overflow:hidden">
        <div style="height:100%;width:${level.progress}%;background:${level.color};border-radius:4px;transition:width 0.5s"></div>
      </div>
    </div>

    <h3 class="text-lg font-bold text-slate-200 mb-3">📊 Статистика</h3>
    <div class="grid grid-cols-3 gap-3 mb-4">
      <div class="profile-stat"><div class="profile-stat-value">${total}</div><div class="profile-stat-label">Тестов</div></div>
      <div class="profile-stat"><div class="profile-stat-value">${best}%</div><div class="profile-stat-label">Лучший</div></div>
      <div class="profile-stat"><div class="profile-stat-value">${avg}%</div><div class="profile-stat-label">Средний</div></div>
    </div>

    ${recent.length > 1 ? `
    <h3 class="text-lg font-bold text-slate-200 mb-3">📈 График прогресса</h3>
    <div class="rounded-xl p-4 mb-4" style="background:rgba(30,41,59,0.6)">
      <div class="flex items-end gap-1" style="height:100px">${chartBars}</div>
    </div>` : ''}

    <h3 class="text-lg font-bold text-slate-200 mb-3">🏅 Достижения</h3>
    <div class="flex flex-wrap gap-2 mb-4">
      ${badges.length ? badges.map(b => `<span class="badge ${b.cls}">${b.icon} ${b.text}</span>`).join('') : '<p class="text-slate-400 text-sm">Пройдите больше тестов!</p>'}
    </div>

    ${compareHTML}

    <h3 class="text-lg font-bold text-slate-200 mb-3">⭐ Лучшие результаты</h3>
    <div class="space-y-2">
      ${bestResults.map(r => `
        <div class="flex justify-between items-center p-3 rounded-xl" style="background:rgba(30,41,59,0.6)">
          <div>
            <span class="font-semibold text-slate-200">${r.sectionName}</span>
            <span class="text-slate-400 text-sm ml-2">${r.difficulty==='easy'?'Лёгкий':r.difficulty==='medium'?'Средний':'Сложный'}</span>
          </div>
          <span class="font-bold text-lg ${r.score>=70?'text-green-400':'text-red-400'}">${r.score}%</span>
        </div>`).join('') || '<p class="text-slate-400 text-sm">Нет данных</p>'}
    </div>
    <div id="duelHistoryBlock"></div>
  `

  // История дуэлей — подгружаем отдельно
  const block = document.getElementById('duelHistoryBlock')
  if (block) {
    const { data: duels } = await getDuelHistory(st.currentUser.id)
    if (duels && duels.length > 0) {
      const rows = duels.map(d => {
        const date  = new Date(d.created_at).toLocaleDateString('ru', { day: 'numeric', month: 'short' })
        const rIcon = d.result==='win'?'🏆':d.result==='draw'?'🤝':d.result==='loss'?'💪':'❓'
        const rText = d.result==='win'?'Победа':d.result==='draw'?'Ничья':d.result==='loss'?'Поражение':'Ожидание'
        const rClr  = d.result==='win'?'#10b981':d.result==='draw'?'#f59e0b':'#ef4444'
        const opp   = d.opponent
          ? `vs <b>${d.opponent.username}</b> (${d.opponent.score}%)`
          : 'vs <span style="color:#64748b">???</span>'
        return `
          <div style="display:flex;justify-content:space-between;align-items:center;
            padding:10px 14px;border-radius:12px;background:rgba(139,92,246,0.1);
            border:1px solid rgba(139,92,246,0.2);margin-bottom:6px">
            <div>
              <div style="font-weight:600;color:#e2e8f0;font-size:0.9rem">${rIcon} ${rText}</div>
              <div style="font-size:0.78rem;color:#94a3b8;margin-top:2px">${opp} · ${date}</div>
            </div>
            <div style="text-align:right">
              <div style="font-weight:700;font-size:1.1rem;color:${rClr}">${d.score}%</div>
              <div style="font-size:0.72rem;color:#64748b">${d.correct_answers}/${d.total_questions}</div>
            </div>
          </div>`
      }).join('')
      block.innerHTML = `
        <h3 class="text-lg font-bold text-slate-200 mb-3" style="margin-top:1rem">⚔️ Дуэли</h3>
        ${rows}`
    }
  }
}
