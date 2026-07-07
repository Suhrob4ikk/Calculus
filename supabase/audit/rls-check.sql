-- ============================================================================
--  MathCore — Аудит Row-Level Security (только чтение, ничего не меняет)
-- ============================================================================
--  Как запустить:
--    Supabase Dashboard → SQL Editor → New query → вставить весь файл → Run.
--    Ни одна команда ниже не изменяет данные или схему — только SELECT'ы.
--
--  Зачем: клиент ходит в БД с публичным ключом (sb_publishable_...).
--  Единственная защита от подделки результатов и чтения/правки чужих данных —
--  это RLS-политики. Их нет в репозитории (живут только в облаке Supabase),
--  поэтому проверяем вручную.
--
--  Модель доступа этого приложения (что ДОЛЖНО быть):
--    • test_results   — клиент SELECT (лидерборд/профиль) и DELETE своих строк;
--                       INSERT/UPDATE с клиента ЗАПРЕЩЁН (пишет только Edge
--                       Function submit-test под service_role). Прямой INSERT
--                       с клиента = дыра: накрутка баллов в обход проверки.
--    • profiles       — клиент SELECT (публичные профили) и UPDATE ТОЛЬКО своей
--                       строки (аватар, last_seen_at, streak). Не чужой.
--    • user_mistakes  — клиент читает/пишет ТОЛЬКО свои строки (user_id = auth.uid()).
--    • push_subscriptions — клиент пишет/удаляет ТОЛЬКО свои строки.
-- ============================================================================


-- ── 1. Включён ли RLS на каждой таблице public ──────────────────────────────
--  Ожидание: rls_enabled = true для ВСЕХ таблиц с пользовательскими данными.
--  Любая false в этом списке — критично: таблица открыта на чтение/запись всем.
SELECT
  n.nspname               AS schema,
  c.relname               AS table_name,
  c.relrowsecurity        AS rls_enabled,
  c.relforcerowsecurity   AS rls_forced
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relkind = 'r'
ORDER BY c.relrowsecurity ASC, c.relname;   -- сначала показать таблицы БЕЗ RLS


-- ── 2. Все политики RLS (что именно разрешено и кому) ───────────────────────
--  cmd      — на какую операцию (SELECT / INSERT / UPDATE / DELETE / ALL)
--  roles    — для каких ролей ({public}, {authenticated}, {anon}, …)
--  qual     — условие USING (для чтения/удаления/апдейта существующих строк)
--  with_check — условие WITH CHECK (для вставки/апдейта новых значений)
--
--  🚩 На что смотреть:
--    • Политика INSERT на test_results для authenticated/anon → красный флаг
--      (клиент сможет вставлять произвольные результаты в обход submit-test).
--    • qual = 'true' на UPDATE/DELETE profiles → любой правит чужой профиль.
--    • Отсутствие "user_id = auth.uid()" в qual/with_check на приватных
--      таблицах (user_mistakes, push_subscriptions) → доступ к чужим строкам.
SELECT
  tablename,
  policyname,
  cmd,
  roles,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, cmd, policyname;


-- ── 3. Прямые GRANT'ы ролям anon / authenticated ────────────────────────────
--  RLS работает поверх GRANT: если у роли нет GRANT INSERT — политика неважна.
--  Здесь видно «сырые» привилегии на таблицы для клиентских ролей.
--  🚩 INSERT/UPDATE/DELETE на test_results у anon/authenticated в связке с
--     разрешающей политикой = возможность писать напрямую.
SELECT
  table_name,
  grantee,
  string_agg(privilege_type, ', ' ORDER BY privilege_type) AS privileges
FROM information_schema.role_table_grants
WHERE table_schema = 'public'
  AND grantee IN ('anon', 'authenticated')
GROUP BY table_name, grantee
ORDER BY table_name, grantee;


-- ── 4. Таблицы без единой политики (но с включённым RLS) ─────────────────────
--  RLS включён, но политик нет → таблица полностью закрыта для клиентских
--  ролей (все запросы вернут пусто). Если приложение при этом читает такую
--  таблицу с клиента — это функциональный баг, а не дыра. Полезно знать.
SELECT c.relname AS table_with_rls_but_no_policies
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relkind = 'r'
  AND c.relrowsecurity = true
  AND NOT EXISTS (
    SELECT 1 FROM pg_policies p
    WHERE p.schemaname = 'public' AND p.tablename = c.relname
  )
ORDER BY c.relname;


-- ── 5. Функции с SECURITY DEFINER (обходят RLS вызывающего) ──────────────────
--  get_email_by_username и upsert_mistakes должны быть SECURITY DEFINER и
--  вызываться под контролем. Проверяем, нет ли неожиданных definer-функций,
--  доступных роли anon/authenticated, которые могли бы утечь данные.
SELECT
  p.proname                                   AS function_name,
  pg_get_function_identity_arguments(p.oid)   AS args,
  CASE WHEN p.prosecdef THEN 'DEFINER' ELSE 'INVOKER' END AS security
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'public'
  AND p.prosecdef = true
ORDER BY p.proname;
