// ─────────────────────────────────────────────────────────
//  Скрипт отправки email-напоминаний
//  Запуск: node send-emails.js
//
//  Опции:
//    --dry-run        не отправлять, только показать кому
//    --days N         не заходили N+ дней (по умолчанию 1)
//    --to email       отправить только одному пользователю
//    --list           показать всех пользователей и их активность
// ─────────────────────────────────────────────────────────
require('dotenv').config()
const nodemailer  = require('nodemailer')
const { createClient } = require('@supabase/supabase-js')

const {
  GMAIL_USER,
  GMAIL_APP_PASSWORD,
  SUPABASE_SERVICE_KEY,
} = process.env

const SUPABASE_URL = 'https://xahjwhoywxgudsefqowd.supabase.co'
const APP_URL      = 'https://suhrob4ikk.github.io/Calculus/'

if (!GMAIL_USER || !GMAIL_APP_PASSWORD || !SUPABASE_SERVICE_KEY) {
  console.error('\n❌  Не хватает переменных в .env:')
  if (!GMAIL_USER)          console.error('    GMAIL_USER — твой Gmail адрес')
  if (!GMAIL_APP_PASSWORD)  console.error('    GMAIL_APP_PASSWORD — App Password из настроек Google')
  if (!SUPABASE_SERVICE_KEY) console.error('    SUPABASE_SERVICE_KEY — service_role ключ из Supabase')
  console.error()
  process.exit(1)
}

// ── Аргументы ─────────────────────────────────────────────
const args     = process.argv.slice(2)
const isDryRun = args.includes('--dry-run')
const isList   = args.includes('--list')
const daysIdx  = args.indexOf('--days')
const days     = daysIdx !== -1 ? parseInt(args[daysIdx + 1], 10) || 1 : 1
const toIdx    = args.indexOf('--to')
const toEmail  = toIdx !== -1 ? args[toIdx + 1] : null

// ── Supabase ──────────────────────────────────────────────
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// ── Gmail транспорт ───────────────────────────────────────
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
})

// ── Получить всех auth-пользователей ─────────────────────
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

// ── HTML-письмо ───────────────────────────────────────────
function buildEmail(name) {
  return {
    subject: `👋 Добрый день, ${name}! Давно тебя не было`,
    html: `
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#f0f4ff;font-family:'Segoe UI',Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4ff;padding:32px 16px">
    <tr><td align="center">
      <table width="100%" style="max-width:520px;background:#ffffff;border-radius:18px;
        box-shadow:0 4px 24px rgba(59,130,246,0.10);overflow:hidden">

        <!-- Шапка -->
        <tr>
          <td style="background:linear-gradient(135deg,#3b82f6,#6d28d9);
            padding:32px 32px 24px;text-align:center">
            <div style="font-size:2.8rem;margin-bottom:6px">∫</div>
            <div style="color:#ffffff;font-size:1.3rem;font-weight:700;
              letter-spacing:0.02em">Математический анализ</div>
            <div style="color:rgba(255,255,255,0.75);font-size:0.85rem;margin-top:4px">
              Тренажёр для студентов МГУ Душанбе
            </div>
          </td>
        </tr>

        <!-- Тело -->
        <tr>
          <td style="padding:32px 32px 24px">
            <p style="margin:0 0 16px;font-size:1.05rem;color:#1e293b;font-weight:600">
              Добрый день, ${name}! 👋
            </p>
            <p style="margin:0 0 14px;font-size:0.95rem;color:#475569;line-height:1.65">
              Давно тебя не было видно на тренажёре. Пока ты отсутствовал, у нас появилось
              много нового:
            </p>
            <ul style="margin:0 0 20px;padding-left:20px;color:#475569;
              font-size:0.95rem;line-height:2">
              <li>📚 Расширенные теории с подробными объяснениями и примерами</li>
              <li>🎯 Новые задачи по интегралам, производным и пределам</li>
              <li>🔥 Ежедневные вызовы — проверь себя за 5 минут</li>
              <li>🏆 Таблица лидеров — посмотри где ты стоишь</li>
            </ul>
            <p style="margin:0 0 28px;font-size:0.95rem;color:#475569;line-height:1.65">
              Заходи, пройди пару тестов — это займёт всего несколько минут,
              зато навыки останутся надолго 💪
            </p>

            <!-- Кнопка -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr><td align="center">
                <a href="${APP_URL}"
                  style="display:inline-block;background:linear-gradient(135deg,#3b82f6,#6d28d9);
                  color:#ffffff;text-decoration:none;font-size:1rem;font-weight:600;
                  padding:14px 40px;border-radius:50px;
                  box-shadow:0 4px 15px rgba(59,130,246,0.35)">
                  Открыть тренажёр →
                </a>
              </td></tr>
            </table>
          </td>
        </tr>

        <!-- Подвал -->
        <tr>
          <td style="padding:16px 32px 28px;border-top:1px solid #f1f5f9;text-align:center">
            <p style="margin:0;font-size:0.78rem;color:#94a3b8;line-height:1.6">
              Ты получил это письмо, потому что зарегистрирован на
              <a href="${APP_URL}" style="color:#3b82f6;text-decoration:none">suhrob4ikk.github.io/Calculus</a>
              <br>Просто зайди на сайт и продолжай практиковаться 📐
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`,
    text:
      `Добрый день, ${name}!\n\n` +
      `Давно тебя не было на тренажёре по матанализу.\n` +
      `Пока ты отсутствовал, у нас появилось много нового — расширенные теории, ` +
      `новые задачи и ежедневные вызовы.\n\n` +
      `Заходи и проверь себя: ${APP_URL}\n\n` +
      `Удачи в учёбе! 📐`,
  }
}

// ── Главная функция ───────────────────────────────────────
async function main() {
  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

  // Все пользователи
  console.log('\n👥  Загружаем пользователей из Supabase...')
  const authUsers = await getAllAuthUsers()

  // Имена из profiles
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, username')
  const profileMap = {}
  ;(profiles || []).forEach(p => { profileMap[p.id] = p })

  // Собираем список
  let rows = authUsers
    .filter(u => u.email)   // только с email
    .map(u => {
      const lastActivity = u.last_sign_in_at
        ? new Date(u.last_sign_in_at)
        : new Date(u.created_at)
      return {
        id:           u.id,
        email:        u.email,
        username:     profileMap[u.id]?.username || u.email.split('@')[0],
        lastActivity,
      }
    })

  // Фильтр --to
  if (toEmail) {
    const found = rows.find(r => r.email.toLowerCase() === toEmail.toLowerCase())
    if (!found) {
      console.error(`\n❌  Пользователь "${toEmail}" не найден.\n`)
      process.exit(1)
    }
    rows = [found]
    console.log(`🎯  Режим --to: только ${found.username} (${found.email})`)
  }

  // Режим --list
  if (isList) {
    console.log(`\n📋  Все зарегистрированные пользователи (${rows.length}):\n`)
    rows
      .sort((a, b) => a.lastActivity - b.lastActivity)
      .forEach((r, i) => {
        const daysAgo = Math.floor((Date.now() - r.lastActivity) / 86400000)
        const badge   = daysAgo >= days ? `💤 ${daysAgo} дн. назад` : `✅ ${daysAgo === 0 ? 'сегодня' : daysAgo + ' дн. назад'}`
        console.log(`  ${i + 1}. ${r.username} (${r.email})  ${badge}`)
      })
    console.log()
    return
  }

  // Фильтруем неактивных (если не --to, который уже отфильтровал)
  const targets = toEmail
    ? rows
    : rows.filter(r => r.lastActivity < cutoff)

  console.log(`📅  Фильтр: не заходили ${days}+ дн. (до ${cutoff.toLocaleString('ru-RU')})`)
  if (isDryRun) console.log('⚠️   Режим DRY-RUN — письма не будут отправлены')

  console.log(`\n👥  Всего пользователей: ${authUsers.length}`)
  console.log(`💤  Подходят под условие: ${targets.length}`)

  if (targets.length === 0) {
    console.log(`\n✅  Нет пользователей, которые не заходили ${days}+ дн.\n`)
    return
  }

  console.log('\n   Кому отправим:')
  targets.forEach(r => {
    const daysAgo = Math.floor((Date.now() - r.lastActivity) / 86400000)
    console.log(`   → ${r.username} (${r.email})  — ${daysAgo} дн. назад`)
  })

  // Пример письма
  const sample = buildEmail(targets[0].username)
  console.log(`\n📨  Тема письма: "${sample.subject}"`)

  if (isDryRun) {
    console.log(`\n📊  DRY-RUN: отправили бы ${targets.length} письм(о/а)\n`)
    return
  }

  // Проверка соединения
  console.log('\n🔌  Проверяем подключение к Gmail...')
  await transporter.verify()
  console.log('✅  Подключение OK\n')

  let sent = 0, failed = 0

  for (const row of targets) {
    const email = buildEmail(row.username)
    try {
      await transporter.sendMail({
        from:    `"МатАнализ 📐" <${GMAIL_USER}>`,
        to:      row.email,
        subject: email.subject,
        html:    email.html,
        text:    email.text,
      })
      console.log(`    ✅ ${row.username} → ${row.email}`)
      sent++
    } catch (err) {
      console.log(`    ❌ ${row.username} → ${row.email}: ${err.message}`)
      failed++
    }
  }

  console.log(`\n📊  Готово: отправлено ${sent}, ошибок ${failed}\n`)
}

main().catch(err => {
  console.error('\n💥 Неожиданная ошибка:', err.message)
  process.exit(1)
})
