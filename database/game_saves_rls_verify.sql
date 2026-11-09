-- Verification / reference for public.game_saves RLS
-- Do NOT run blindly if the table already exists with data.
-- User instruction: do not weaken RLS or recreate the table.
-- Confirm in Supabase SQL Editor that every policy uses: auth.uid() = user_id

-- Expected table (for reference only; create only if missing in a new project):
-- create table if not exists public.game_saves (
--   id uuid primary key default gen_random_uuid(),
--   user_id uuid not null references auth.users(id) on delete cascade,
--   slot text not null default 'default',
--   save_data jsonb not null,
--   updated_at timestamptz not null default now(),
--   unique (user_id, slot)
-- );
-- alter table public.game_saves enable row level security;

-- Required policies (drop/create only if you need to align them):
-- SELECT
-- drop policy if exists "game_saves select own" on public.game_saves;
-- create policy "game_saves select own" on public.game_saves
--   for select to authenticated
--   using (auth.uid() = user_id);

-- INSERT
-- drop policy if exists "game_saves insert own" on public.game_saves;
-- create policy "game_saves insert own" on public.game_saves
--   for insert to authenticated
--   with check (auth.uid() = user_id);

-- UPDATE
-- drop policy if exists "game_saves update own" on public.game_saves;
-- create policy "game_saves update own" on public.game_saves
--   for update to authenticated
--   using (auth.uid() = user_id)
--   with check (auth.uid() = user_id);

-- DELETE
-- drop policy if exists "game_saves delete own" on public.game_saves;
-- create policy "game_saves delete own" on public.game_saves
--   for delete to authenticated
--   using (auth.uid() = user_id);

-- Quick check (run in SQL editor while authenticated as a test user, or inspect policies in Dashboard):
-- select polname, polcmd, pg_get_expr(polqual, polrelid) as using_expr,
--        pg_get_expr(polwithcheck, polrelid) as with_check_expr
-- from pg_policy
-- where polrelid = 'public.game_saves'::regclass;
