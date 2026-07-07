# legacy/ — архив не-веб обвязки

Эти файлы **не входят в веб-приложение и не участвуют в деплое** (Vercel раздаёт
статику из корня репозитория). Вынесены сюда при переходе на web-only, чтобы не
засорять корень. Ничего не удалено — всё обратимо через git-историю.

| Файл | Что это |
|---|---|
| `main.js` | Точка входа Electron (десктоп-оболочка) |
| `package.json` | Манифест для Electron-сборки + Node-скриптов ниже |
| `send-emails.js` | Node-скрипт email-напоминаний (nodemailer + Gmail) |
| `send-notifications.js` | Node-скрипт web-push уведомлений (web-push + Supabase) |
| `generate-icons.html` | Одноразовый генератор PWA-иконок |
| `update_theme.py`, `write_css.py` | Одноразовые генераторы CSS |
| `build/icon.png` | Иконка для electron-builder |

## Как запустить (если понадобится)

```bash
cd legacy
npm install
npm run electron      # запустить десктоп-версию
npm run build:win     # собрать Windows-инсталлятор
node send-notifications.js   # разослать push (нужен .env с ключами)
node send-emails.js          # разослать email-напоминания
```

> ⚠️ Пути внутри `main.js` / electron-builder рассчитаны на прежнее расположение
> в корне репозитория. После переноса их, возможно, придётся поправить
> (например, ссылки на `index.html`, `icons/`, `sw.js`, которые остались в корне).

Секреты (VAPID private key, Gmail app-password, Supabase service_role) берутся из
корневого `.env` — см. `../.env.example`.
