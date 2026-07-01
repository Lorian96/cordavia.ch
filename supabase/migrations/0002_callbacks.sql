-- VitaWay callbacks (Rückruf-Anforderungen)
-- Run this in Supabase Dashboard -> SQL Editor

create table if not exists public.callbacks (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  phone text not null,
  preferred_time text,
  note text,
  status text not null default 'pending' check (status in ('pending','done')),
  created_at timestamptz not null default now(),
  done_at timestamptz
);

create index if not exists callbacks_status_created_idx on public.callbacks (status, created_at desc);

grant usage on schema public to anon, authenticated;
grant select, insert on public.callbacks to anon;
grant select, insert, update, delete on public.callbacks to authenticated;
grant select, insert, update, delete on public.callbacks to service_role;

alter table public.callbacks enable row level security;

drop policy if exists "Anyone can create a callback" on public.callbacks;
create policy "Anyone can create a callback"
  on public.callbacks
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Only authenticated can read callbacks" on public.callbacks;
create policy "Only authenticated can read callbacks"
  on public.callbacks
  for select
  to authenticated
  using (true);

drop policy if exists "Only authenticated can update callbacks" on public.callbacks;
create policy "Only authenticated can update callbacks"
  on public.callbacks
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Only authenticated can delete callbacks" on public.callbacks;
create policy "Only authenticated can delete callbacks"
  on public.callbacks
  for delete
  to authenticated
  using (true);
