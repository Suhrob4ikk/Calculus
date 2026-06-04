<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&height=200&color=0:03080f,50:0e2236,100:03080f&text=MathCore&fontSize=46&fontColor=38bdf8&animation=fadeIn&fontAlignY=52&desc=Интерактивный%20тренажёр%20по%20высшей%20математике&descSize=16&descAlignY=70&descColor=7eb8d8" width="100%" />

</div>

<div align="center">

![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Electron](https://img.shields.io/badge/Electron-47848F?style=for-the-badge&logo=electron&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

🌐 **[Открыть сайт](https://mathcore-app.vercel.app)**

</div>

---

## 📖 О проекте

Интерактивный веб-тренажёр для проверки знаний по математическому анализу.  
Разработан для студентов МГУ (филиал в Душанбе) как инструмент самоподготовки к экзаменам.  
Доступен как **веб-сайт**, **десктопное приложение (Windows)** и **Android APK**.

---

## 📦 Платформы

| Платформа | Способ |
|---|---|
| 🌐 Браузер (любое устройство) | [mathcore-app.netlify.app](https://mathcore-app.vercel.app) |
| 🖥 Windows | `npm run build` → установить `dist/MathCore Setup 1.0.0.exe` |
| 📱 Android | Скачать APK с PWABuilder или установить через браузер |
| 🍎 iPhone / iPad | Safari → Поделиться → На экран Домой |

---

## ✨ Возможности

| Функция | Описание |
|---|---|
| 🔐 Авторизация | Вход по **email или имени пользователя**, регистрация, сброс пароля |
| 👤 Профиль | Фото, уровень, XP, достижения, график прогресса, место в рейтинге |
| 👥 Поиск пользователей | Живой поиск с автодополнением, просмотр профилей |
| 🏆 Таблица лидеров | Рейтинг по разделам и уровням сложности |
| ⚔️ Дуэли 1v1 | Реальное время, приглашение по нику, таймер, результаты, реванш |
| 📅 Ежедневный вызов | Новый набор задач каждый день, бонусный XP, таблица лидеров дня |
| 📚 Браузер теории | Полноэкранный браузер для всех 6 разделов — 40+ глав с формулами |
| ✍️ Открытый формат | Ввод числового ответа вручную; справочник допустимых форматов |
| ∫ Интегралы | 3 уровня сложности, 240+ задач |
| f′(x) Производные | 3 уровня, 190+ задач; открытый режим |
| ∑ Ряды | 3 уровня сложности, 156+ задач |
| lim Пределы | 3 уровня сложности, 292+ задач |
| dy/dx Дифф. уравнения | Задачи Коши, 3 уровня, 150+ задач |
| P Теория вероятностей | 3 уровня, 200+ задач; открытый режим |
| ⏱ Таймер | Автоматически по уровню и количеству вопросов |
| 📊 Статистика | История, лучший результат, прогресс по всем разделам |
| 🎮 XP и уровни | Опыт за каждый тест, система прокачки профиля |
| 🔔 Push-уведомления | Напоминания о занятиях прямо в браузер/телефон |
| 🌙 Тёмная / светлая тема | Переключатель, запоминает выбор |
| 📱 PWA | Устанавливается на телефон, кеширование для офлайн-режима |

---

## 🚀 Как запустить

### Веб (рекомендуется)
Просто открой [mathcore-app.netlify.app](https://mathcore-app.vercel.app)

### Локально / десктоп
```bash
git clone https://github.com/Suhrob4ikk/Calculus.git
cd Calculus
npm install
npm start          # запустить как десктопное Electron-приложение
npm run dev        # запустить как веб-сервер на localhost:3000
npm run build      # собрать Windows .exe установщик
```

---

## 🛠 Технологии

```
HTML5 + CSS3 + Vanilla JavaScript  — основа приложения
Tailwind CSS (CDN)                 — стилизация интерфейса
MathJax 3                         — рендеринг математических формул
Supabase                          — база данных, авторизация, Realtime, хранилище
Supabase Realtime                 — дуэли и защита сессий в реальном времени
Electron + electron-builder       — десктопное приложение и Windows установщик
Service Worker + Web App Manifest — PWA, кеш CDN, push-уведомления
Netlify                           — хостинг с автодеплоем из GitHub
Node.js (web-push, nodemailer)    — скрипты рассылки уведомлений и писем
```

---

## 📁 Структура проекта

```
Calculus/
├── index.html                    # Главная страница (SPA)
├── main.js                       # Electron точка входа
├── manifest.json                 # PWA манифест
├── sw.js                         # Service Worker (кэш CDN + локальных файлов, push)
├── netlify.toml                  # Настройки Netlify (редиректы, заголовки)
├── .well-known/
│   └── assetlinks.json           # Digital Asset Links для Android TWA
├── build/
│   └── icon.png                  # Иконка приложения (256×256)
├── icons/
│   ├── icon-192.png              # PWA иконка 192×192
│   ├── icon-512.png              # PWA иконка 512×512
│   └── badge.svg                 # Иконка уведомлений
├── css/
│   └── style.css                 # Кастомные стили, Dark/Light темы
├── js/
│   ├── script.js                 # Точка входа: инициализация, сессия
│   ├── state.js                  # Глобальный стейт приложения
│   ├── ui.js                     # Навигация, темы, XP, анимации
│   ├── auth.js                   # Авторизация (email или username)
│   ├── supabase.js               # Клиент Supabase и все DB-запросы
│   ├── pwa.js                    # PWA: установка, push-уведомления
│   ├── test.js                   # Игровой цикл теста, открытый режим
│   ├── daily.js                  # Ежедневный вызов
│   ├── profile.js                # Профиль, уровни, достижения, аватар
│   ├── stats.js                  # Статистика и таблица лидеров
│   ├── duel.js                   # Дуэль 1v1 (Supabase Realtime)
│   ├── search.js                 # Поиск пользователей
│   ├── theory.js                 # Теория (старый формат)
│   ├── utils.js                  # Утилиты и VAPID-ключ
│   ├── mathjax-config.js         # Конфигурация MathJax
│   ├── integrals-questions.js    # 240+ задач по интегралам
│   ├── derivatives-questions.js  # 190+ задач по производным
│   ├── open-questions.js         # Задачи с открытым числовым ответом
│   ├── series-questions.js       # 156+ задач по рядам
│   ├── limits-questions.js       # 292+ задач по пределам
│   ├── ode-questions.js          # 150+ задач по дифф. уравнениям
│   ├── probability-questions.js  # 200+ задач по теорвер
│   ├── prob-chapters.js          # 10+ глав теории по теорвер
│   ├── prob-theory.js            # Браузер теории — теорвер
│   ├── calculus-chapters.js      # 35 глав теории (все 5 разделов)
│   └── section-theory.js        # Универсальный браузер теории
└── send-notifications.js / send-emails.js  # Node.js скрипты рассылок
```

---

## ⚔️ Система дуэлей

- Хост создаёт комнату → получает 6-значный код или приглашает по нику
- Гость вводит код → оба видят таймер обратного отсчёта
- Одинаковые вопросы для обоих (детерминированный генератор)
- Раздел и уровень — на выбор; смешанный режим из всех разделов
- По окончании — сравнение результатов, реванш
- Защита: один аккаунт — одно устройство одновременно

---

## 🎮 Система уровней и XP

| Уровень | Условие |
|---|---|
| ⭐ Новичок | Начальный уровень |
| 🎓 Студент | 1+ тест |
| 📚 Практик | 5+ тестов, ср. 60%+ |
| 🔥 Продвинутый | 10+ тестов, ср. 75%+ |
| 🏆 Эксперт | 20+ тестов, ср. 85%+ |

XP начисляется за каждый правильный ответ, за идеальный результат (+25), за ежедневный вызов (+50).

---

## Автор

**Suhrob Davlatov** — студент 2-го курса, Прикладная математика и информатика  
Филиал МГУ в Душанбе

[![Telegram](https://img.shields.io/badge/Telegram-26A5E4?style=flat&logo=telegram&logoColor=white)](https://t.me/davlatov3007)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white)](https://github.com/Suhrob4ikk)

---

## 🤖 Инструменты разработки

| Инструмент | Применение |
|---|---|
| [Claude Sonnet 4.6](https://claude.ai) (Anthropic) | Основная логика, архитектура, баг-фикс, оптимизация |
| [DeepSeek](https://deepseek.com) | Генерация и проверка задач, формулы |

---

<div align="center">
<img src="https://capsule-render.vercel.app/api?type=waving&height=100&color=0:03080f,50:0e2236,100:03080f&section=footer&animation=fadeIn" width="100%" />
</div>
