# RLS / доступ — результаты эмпирического аудита

> Проверено 2026-07-13 неразрушающими пробами с публичным (`sb_publishable_...`)
> ключом — тем же, что раздаётся в браузере. Роль `anon` (без user-JWT).
> Ни одна строка не создана и не удалена (INSERT-проба без `user_id`; UPDATE/DELETE
> с заведомо несуществующим фильтром). Скрипты: см. историю (scratchpad rls-probe*.mjs).

## ✅ Что безопасно (подтверждено)

| Проба | Результат | Вывод |
|---|---|---|
| `INSERT test_results` (anon) | `401 / 42501 permission denied` | Клиент **не может подделать результат** в обход Edge Function |
| `UPDATE test_results` (anon) | `401 / 42501` | Клиент не может править баллы |
| `POST /functions/v1/submit-test` без user-JWT | `401 Unauthorized` | Серверная валидация обязательна |
| `SELECT user_mistakes` (anon) | `200 []` | Чужие ошибки не читаются |
| `SELECT push_subscriptions` (anon) | `200 []` | Подписки не читаются |
| `SELECT profiles?select=*` (anon) | `401 / 42501` | Колоночные гранты: полная строка недоступна |
| `SELECT profiles?select=username` (anon) | `200` | Публичны только ник (и, вероятно, avatar/last_seen) — by design |
| колонка `profiles.email` | `42703 does not exist` | Email в `profiles` не хранится → PII не утекает |

Итог по главному риску (накрутка баллов): **закрыт**. Запись в `test_results`
идёт только через `submit-test` под service-role.

## ⚠️ Требует проверки/исправления

**У роли `anon` есть привилегия `DELETE` на `test_results` и `push_subscriptions`.**
Пробы `DELETE ... where id = <несуществующий>` вернули `204` (а не `42501`, как
INSERT/UPDATE). Значит грант DELETE выдан роли `anon`. Эксплуатируемость зависит
от USING-политики RLS для DELETE (её из-под anon не прочитать):

- если RLS включён и политика ограничивает `auth.uid() = user_id` — по факту
  анонимно ничего не удалить (все строки отфильтрованы), риск низкий;
- если RLS выключен или политика DELETE разрешающая для anon/public —
  **неаутентифицированный пользователь может удалять чужие результаты/подписки**
  (потеря данных лидерборда/истории).

### Что сделать (в Supabase → SQL Editor)

1. Посмотреть политики (уже есть скрипт `rls-check.sql`, раздел 2) — конкретно
   строки `cmd = DELETE` для `test_results` и `push_subscriptions`.
2. В любом случае убрать лишний грант у анонимной роли:

```sql
REVOKE DELETE ON public.test_results       FROM anon;
REVOKE DELETE ON public.push_subscriptions FROM anon;
-- (при желании — и на других пользовательских таблицах, где anon-DELETE не нужен)
```

3. Убедиться, что DELETE для `authenticated` ограничен владельцем:

```sql
-- пример правильной политики
-- CREATE POLICY "own rows delete" ON public.test_results
--   FOR DELETE TO authenticated USING (auth.uid() = user_id);
```

Клиентские `deleteResultById` / `deleteAllUserResults` работают под user-JWT
(роль `authenticated`), поэтому revoke у `anon` их не сломает.
