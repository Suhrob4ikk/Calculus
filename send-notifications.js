// ─────────────────────────────────────────────────────────
//  Скрипт отправки push-уведомлений
//  Запуск: node send-notifications.js
//
//  Опции:
//    --dry-run              не отправлять, только показать кому
//    --days N               не заходили N+ дней (по умолчанию 1)
//    --list                 просто показать всех подписчиков и выйти
//    "Заголовок" "Текст"    своё сообщение (в кавычках)
// ─────────────────────────────────────────────────────────
require('dotenv').config()
const webpush = require('web-push')
const { createClient } = require('@supabase/supabase-js')

// ── Конфиг из .env ────────────────────────────────────────
const {
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY,
  VAPID_EMAIL,
  SUPABASE_SERVICE_KEY,
} = process.env

const SUPABASE_URL = 'https://xahjwhoywxgudsefqowd.supabase.co'
const APP_URL      = 'https://suhrob4ikk.github.io/Calculus/'

if (!VAPID_PRIVATE_KEY || !SUPABASE_SERVICE_KEY) {
  console.error('\n❌  Не найден файл .env или в нём нет нужных переменных.')
  console.error('    Скопируй .env.example → .env и заполни значения.\n')
  process.exit(1)
}

// ── Инициализация ─────────────────────────────────────────
webpush.setVapidDetails(
  VAPID_EMAIL || 'mailto:admin@example.com',
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
)

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// ── Аргументы командной строки ────────────────────────────
const args     = process.argv.slice(2)
const isDryRun = args.includes('--dry-run')
const isList   = args.includes('--list')

const daysIdx  = args.indexOf('--days')
const days     = daysIdx !== -1 ? parseInt(args[daysIdx + 1], 10) || 1 : 1

const textArgs = args.filter((a, i) => !a.startsWith('--') && args[i - 1] !== '--days' && isNaN(Number(a)) || (isNaN(Number(a)) && !a.startsWith('--')))
// Проще: берём позиционные аргументы без флагов
const posArgs  = args.filter((a, i) => {
  if (a.startsWith('--')) return false
  if (args[i - 1] === '--days') return false
  return true
})
const msgTitle = posArgs[0] || null
const msgBody  = posArgs[1] || null

// ── Вспомогалка: получить всех auth-пользователей ────────
async function getAllAuthUsers() {
  const users = []
  let page = 1
  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 1000 })
    if (error) throw new Error('auth.admin.listUsers: ' + error.message)
    users.push(...data.users)
    if (data.users.length < 1000) break
    page++
  }
  return users
}

// ── Главная функция ───────────────────────────────────────
async function main() {
  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

  // 1. Все подписки на push
  const { data: subs, error: subsErr } = await supabase
    .from('push_subscriptions')
    .select('user_id, subscription')

  if (subsErr) {
    console.error('❌  Ошибка запроса push_subscriptions:', subsErr.message)
    process.exit(1)
  }
  if (!subs || subs.length === 0) {
    console.log('\nℹ️   Нет ни одной подписки в базе.\n')
    return
  }

  // 2. Данные из auth.users (last_sign_in_at, email, created_at)
  const authUsers = await getAllAuthUsers()
  const authMap = {}
  authUsers.forEach(u => { authMap[u.id] = u })

  // 3. Имена пользователей из profiles
  const userIds = subs.map(s => s.user_id)
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, username')
    .in('id', userIds)
  const profileMap = {}
  ;(profiles || []).forEach(p => { profileMap[p.id] = p })

  // 4. Собираем итоговый список
  const allRows = subs.map(s => {
    const auth    = authMap[s.user_id] || {}
    const profile = profileMap[s.user_id] || {}
    const lastActivity = auth.last_sign_in_at
      ? new Date(auth.last_sign_in_at)
      : auth.created_at
        ? new Date(auth.created_at)
        : null
    return {
      user_id:      s.user_id,
      subscription: s.subscription,
      username:     profile.username || auth.email?.split('@')[0] || s.user_id.slice(0, 8),
      email:        auth.email || '—',
      lastActivity,
    }
  })

  // ── Режим --list: просто таблица всех подписчиков ────────
  if (isList) {
    console.log('\n📋  Все подписчики на уведомления:\n')
    allRows.forEach((r, i) => {
      const seenStr = r.lastActivity
        ? r.lastActivity.toLocaleString('ru-RU')
        : 'никогда'
      const inactive = !r.lastActivity || r.lastActivity < cutoff
      const badge = inactive ? '💤 не заходил ' + days + '+ дн.' : '✅ активен'
      console.log(`  ${i + 1}. ${r.username} (${r.email})  ${badge}  |  последний вход: ${seenStr}`)
    })
    console.log(`\nВсего подписчиков: ${allRows.length}\n`)
    return
  }

  // ── Режим отправки ────────────────────────────────────────
  console.log(`\n📅  Ищем подписчиков, не заходивших ${days}+ дн. (до ${cutoff.toLocaleString('ru-RU')})...`)
  if (isDryRun) console.log('⚠️   Режим DRY-RUN — уведомления не будут отправлены\n')

  const inactive = allRows.filter(r =>
    !r.lastActivity || r.lastActivity < cutoff
  )

  console.log(`👥  Всего подписок: ${allRows.length}`)
  console.log(`💤  Не заходили ${days}+ дн.: ${inactive.length}`)

  if (inactive.length === 0) {
    console.log(`\n✅  Все подписчики заходили в течение последних ${days} дн.!\n`)
    return
  }

  // Список тех, кому отправим
  console.log('\n   Кому отправим:')
  inactive.forEach(r => {
    const seenStr = r.lastActivity ? r.lastActivity.toLocaleString('ru-RU') : 'никогда'
    console.log(`   → ${r.username} (${r.email})  |  последний вход: ${seenStr}`)
  })

  const title = msgTitle || '🌟 Ежедневный вызов ждёт!'
  const body  = msgBody  || 'Ты давно не заходил на тренажёр по матанализу. Зайди и проверь себя! 📐'

  console.log(`\n📨  Сообщение: "${title}"`)
  console.log(`    "${body}"\n`)

  if (isDryRun) {
    console.log(`📊  DRY-RUN: отправили бы ${inactive.length} уведомлений\n`)
    return
  }

  let sent = 0, failed = 0, removed = 0

  for (const row of inactive) {
    try {
      await webpush.sendNotification(
        row.subscription,
        JSON.stringify({ title, body, url: APP_URL })
      )
      console.log(`    ✅ ${row.username}`)
      sent++
    } catch (err) {
      if (err.statusCode === 410 || err.statusCode === 404) {
        await supabase.from('push_subscriptions').delete().eq('user_id', row.user_id)
        console.log(`    🗑  ${row.username}  (устаревшая подписка удалена)`)
        removed++
      } else {
        console.log(`    ❌ ${row.username}: ${err.message}`)
        failed++
      }
    }
  }

  console.log(`\n📊  Готово: отправлено ${sent}, ошибок ${failed}${removed ? `, устаревших удалено ${removed}` : ''}\n`)
}

main().catch(err => {
  console.error('\n💥 Неожиданная ошибка:', err.message)
  process.exit(1)
})
