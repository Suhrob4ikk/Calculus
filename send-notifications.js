// ─────────────────────────────────────────────────────────
//  Скрипт отправки push-уведомлений
//  Запуск: node send-notifications.js
//
//  Опции:
//    --dry-run              не отправлять, только показать кому
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
const args      = process.argv.slice(2)
const isDryRun  = args.includes('--dry-run')
const textArgs  = args.filter(a => !a.startsWith('--'))
const msgTitle  = textArgs[0] || null
const msgBody   = textArgs[1] || null

// ── Главная функция ───────────────────────────────────────
async function main() {
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)

  console.log('\n📅  Ищем пользователей, не заходивших сегодня...')
  if (isDryRun) console.log('⚠️   Режим DRY-RUN — уведомления не будут отправлены\n')

  // 1. Получаем все подписки
  const { data: subs, error: subsErr } = await supabase
    .from('push_subscriptions')
    .select('user_id, subscription')

  if (subsErr) {
    console.error('❌  Ошибка запроса push_subscriptions:', subsErr.message)
    process.exit(1)
  }
  if (!subs || subs.length === 0) {
    console.log('ℹ️   Нет ни одной подписки в базе.\n')
    return
  }

  // 2. Получаем профили этих пользователей
  const userIds = subs.map(s => s.user_id)
  const { data: profiles, error: profErr } = await supabase
    .from('profiles')
    .select('id, username, last_seen_at')
    .in('id', userIds)

  if (profErr) {
    console.warn('⚠️   Не удалось загрузить профили:', profErr.message)
  }

  // 3. Объединяем вручную
  const profileMap = {}
  ;(profiles || []).forEach(p => { profileMap[p.id] = p })

  const data = subs.map(s => ({
    user_id:    s.user_id,
    subscription: s.subscription,
    profiles:   profileMap[s.user_id] || null,
  }))

  // Фильтруем тех, кто не заходил сегодня
  const inactive = data.filter(row => {
    const lastSeen = row.profiles?.last_seen_at
    if (!lastSeen) return true               // никогда не заходил → включаем
    return new Date(lastSeen) < todayStart   // последний вход раньше сегодняшнего дня
  })

  console.log(`👥  Всего подписок: ${(data || []).length}`)
  console.log(`💤  Не заходили сегодня: ${inactive.length}\n`)

  if (inactive.length === 0) {
    console.log('✅  Все пользователи уже заходили сегодня!\n')
    return
  }

  // Текст уведомления
  const title = msgTitle || '🌟 Ежедневный вызов ждёт!'
  const body  = msgBody  || 'Ты ещё не прошёл сегодняшний тест по матанализу. Зайди и проверь себя! 📐'
  const url   = APP_URL

  console.log(`📨  Сообщение: "${title}"`)
  console.log(`    "${body}"\n`)

  let sent = 0, failed = 0, removed = 0

  for (const row of inactive) {
    const name = row.profiles?.username || row.user_id.slice(0, 8)

    if (isDryRun) {
      console.log(`    [skip] → ${name}`)
      sent++
      continue
    }

    try {
      await webpush.sendNotification(
        row.subscription,
        JSON.stringify({ title, body, url })
      )
      console.log(`    ✅ ${name}`)
      sent++
    } catch (err) {
      if (err.statusCode === 410 || err.statusCode === 404) {
        // Подписка истекла — удаляем из базы
        await supabase.from('push_subscriptions').delete().eq('user_id', row.user_id)
        console.log(`    🗑  ${name}  (устаревшая подписка удалена)`)
        removed++
      } else {
        console.log(`    ❌ ${name}: ${err.message}`)
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
