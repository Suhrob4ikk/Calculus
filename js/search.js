import { st } from './state.js'
import { showPage } from './ui.js'
import { searchProfiles, getProfileByUsername } from './supabase.js'
import { getUserLevel, computeBadges } from './profile.js'

function formatLastSeenVP(iso) {
  if (!iso) return null
  const diff  = Date.now() - new Date(iso).getTime()
  const mins  = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days  = Math.floor(diff / 86400000)
  if (mins  <  2) return '<span style="color:#10b981;font-weight:600;font-size:0.78rem">● онлайн сейчас</span>'
  if (mins  < 60) return `<span style="font-size:0.78rem;color:var(--text-muted)">Был(а) ${mins} мин назад</span>`
  if (hours < 24) return `<span style="font-size:0.78rem;color:var(--text-muted)">Был(а) ${hours} ч назад</span>`
  if (days  < 30) return `<span style="font-size:0.78rem;color:var(--text-muted)">Был(а) ${days} дн назад</span>`
  return `<span style="font-size:0.78rem;color:var(--text-muted)">Был(а) ${Math.floor(days/30)} мес назад</span>`
}

window.showSearchProfiles = async function() {
  showPage('searchProfilesPage')
  const { data } = await searchProfiles('')
  renderSearchResults(data)
  setTimeout(() => {
    const input = document.getElementById('searchInputField')
    if (!input) return
    input.focus(); input.value = ''
    let _searchTimeout = null
    input.oninput = () => {
      clearTimeout(_searchTimeout)
      _searchTimeout = setTimeout(async () => {
        const q = input.value.trim()
        const { data } = await searchProfiles(q)
        if (!q) { renderSearchResults(data); return }
        if (!data || data.length === 0) {
          document.getElementById('searchResults').innerHTML =
            `<p class="text-gray-400 text-center py-4">Пользователь "${q}" не найден</p>`
        } else {
          renderSearchResults(data)
        }
      }, 300)
    }
  }, 50)
}

function renderSearchResults(data) {
  const container = document.getElementById('searchResults')
  if (!container) return
  if (!data || data.length === 0) {
    container.innerHTML = '<p class="text-gray-400 text-center py-4">Пользователи не найдены</p>'
    return
  }
  container.innerHTML = data.map(p => `
    <div class="flex items-center justify-between p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-blue-50 transition-colors"
         onclick="viewProfile('${p.username}')">
      <div class="flex items-center gap-3">
        ${p.avatar_url
          ? `<img src="${p.avatar_url}" class="w-10 h-10 rounded-full object-cover">`
          : `<div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#3b82f6,#8b5cf6);display:flex;align-items:center;justify-content:center;color:white;font-weight:700">${p.username.charAt(0).toUpperCase()}</div>`
        }
        <span class="font-semibold" style="color:var(--text-main)">${p.username}</span>
        ${p.username === 'Suhrob' ? '<span style="background:linear-gradient(135deg,#f59e0b,#d97706);color:white;font-size:0.6rem;font-weight:700;padding:1px 6px;border-radius:10px;margin-left:4px">👑</span>' : ''}
      </div>
      <span class="text-blue-500 text-sm">Посмотреть →</span>
    </div>`).join('')
}

window.handleSearch = async function() {
  const q = (document.getElementById('searchInputField') || document.getElementById('searchInput'))?.value.trim() || ''
  const { data } = await searchProfiles(q)
  renderSearchResults(data)
}

window.viewProfile = async function(username) {
  st.viewProfileFrom = sessionStorage.getItem('lastPage') || 'searchProfilesPage'
  showPage('viewProfilePage')

  // Обновляем десктопную кнопку "Назад" в зависимости от откуда пришли
  const backBtn = document.querySelector('#viewProfilePage .page-back-btn')
  if (backBtn) {
    if (st.viewProfileFrom === 'leaderboardPage') {
      backBtn.textContent = '← Назад к рейтингу'
      backBtn.onclick = () => window.showLeaderboard()
    } else {
      backBtn.textContent = '← Назад к поиску'
      backBtn.onclick = () => window.showSearchProfiles()
    }
  }

  document.getElementById('viewProfileContent').innerHTML = '<p class="text-gray-400 text-center py-8">Загрузка...</p>'

  const { profile, results } = await getProfileByUsername(username)
  if (!profile) {
    document.getElementById('viewProfileContent').innerHTML = '<p class="text-gray-400 text-center py-4">Профиль не найден</p>'
    return
  }

  // Исключаем дуэли из статистики (как в собственном профиле)
  const data  = results.filter(r => r.section !== 'duel')
  const total = data.length
  const best  = total ? Math.max(...data.map(r => r.score)) : 0
  const avg   = total ? Math.round(data.reduce((s,r) => s+r.score, 0) / total) : 0
  const level = getUserLevel(total, avg)

  // Используем computeBadges (как в собственном профиле) для единообразия
  const { badges } = computeBadges(data, ['integrals','derivatives','series','limits','ode'])

  const isCreator = profile.username === 'Suhrob'
  const creatorBadge = isCreator
    ? ' <span style="display:inline-flex;align-items:center;gap:3px;background:linear-gradient(135deg,#f59e0b,#d97706);color:white;font-size:0.65rem;font-weight:700;padding:2px 8px;border-radius:20px;vertical-align:middle">👑 Разработчик</span>'
    : ''

  const viewNameEl = document.getElementById('viewProfileName')
  if (viewNameEl) viewNameEl.innerHTML = profile.username + creatorBadge

  // Last seen под именем
  const lastSeenHtml = formatLastSeenVP(profile.last_seen_at)
  const viewSubEl = document.getElementById('viewProfileSub')
  if (viewSubEl) viewSubEl.innerHTML = lastSeenHtml || ''

  const avatarEl    = document.getElementById('viewProfileAvatar')
  const avatarImgEl = document.getElementById('viewProfileAvatarImg')
  if (profile.avatar_url) {
    avatarImgEl.src = profile.avatar_url; avatarImgEl.style.display = 'block'; avatarImgEl.style.cursor = 'pointer'
    avatarImgEl.onclick = () => window.openPhotoPreview(profile.avatar_url, profile.username)
    avatarEl.style.display = 'none'
  } else {
    avatarEl.textContent = profile.username.charAt(0).toUpperCase()
    avatarEl.style.display = 'flex'; avatarImgEl.style.display = 'none'
  }

  document.getElementById('viewProfileContent').innerHTML = `
    <div class="rounded-xl p-4 mb-4" style="background:linear-gradient(135deg,${level.color}18,${level.color}08);border:1.5px solid ${level.color}30">
      <div class="flex items-center gap-3">
        <span style="font-size:1.8rem">${level.icon}</span>
        <div class="font-bold text-lg" style="color:${level.color}">${level.name}</div>
      </div>
    </div>
    <div class="grid grid-cols-3 gap-3 mb-4">
      <div class="profile-stat"><div class="profile-stat-value">${total}</div><div class="profile-stat-label">Тестов</div></div>
      <div class="profile-stat"><div class="profile-stat-value">${best}%</div><div class="profile-stat-label">Лучший</div></div>
      <div class="profile-stat"><div class="profile-stat-value">${avg}%</div><div class="profile-stat-label">Средний</div></div>
    </div>
    <h3 class="text-lg font-bold text-gray-800 mb-3">🏅 Достижения</h3>
    <div class="flex flex-wrap gap-2 mb-4">
      ${badges.length ? badges.map(b => `<span class="badge ${b.cls}">${b.icon} ${b.text}</span>`).join('') : '<p class="text-gray-400 text-sm">Нет достижений</p>'}
    </div>
    <h3 class="text-lg font-bold text-gray-800 mb-3">📋 Последние результаты</h3>
    <div class="space-y-2">
      ${data.filter(r => r.section !== 'daily').slice(0,5).map(r => {
        const sLabel = {integrals:'Интегралы',derivatives:'Производные',series:'Ряды',limits:'Пределы',ode:'Дифф. уравнения'}
        const dLabel = {easy:'Лёгкий',medium:'Средний',hard:'Сложный'}
        return `
        <div class="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
          <div>
            <span class="font-semibold" style="color:var(--text-main)">${sLabel[r.section] || r.section}</span>
            <span class="text-gray-500 text-sm ml-2">${dLabel[r.difficulty] || r.difficulty}</span>
          </div>
          <span class="font-bold ${r.score>=70?'text-green-600':'text-red-600'}">${r.score}%</span>
        </div>`}).join('') || '<p class="text-gray-400 text-sm">Нет результатов</p>'}
    </div>
  `
}

window.openPhotoPreview = function(url, name) {
  const overlay = document.createElement('div')
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.9);z-index:9999;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer'
  overlay.onclick = () => document.body.removeChild(overlay)
  overlay.innerHTML = `
    <div style="position:relative;max-width:90vw;max-height:90vh">
      <img src="${url}" style="max-width:90vw;max-height:80vh;border-radius:12px;object-fit:contain;box-shadow:0 25px 50px rgba(0,0,0,0.5)">
      <div style="text-align:center;color:white;margin-top:12px;font-size:1.1rem;font-weight:600">${name}</div>
    </div>
    <div style="position:absolute;top:20px;right:20px;color:white;font-size:1.5rem;cursor:pointer">✕</div>
  `
  document.body.appendChild(overlay)
}
