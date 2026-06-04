-- Cordavia bookings schema
-- Run this in Supabase Dashboard -> SQL Editor

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  booking_number text not null unique,

  transport_type text not null check (transport_type in ('krankenfahrt','liegend','rollstuhl','taxi')),
  pickup text not null,
  destination text not null,
  ride_date date not null,
  ride_time time not null,

  first_name text not null,
  last_name text not null,
  phone text not null,
  email text not null,

  note_wheelchair boolean not null default false,
  note_companion boolean not null default false,
  note_lying boolean not null default false,
  note_insurance boolean not null default false,
  comment text,

  status text not null default 'pending' check (status in ('pending','confirmed','completed','cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists bookings_ride_date_idx on public.bookings (ride_date);
create index if not exists bookings_status_idx on public.bookings (status);
create index if not exists bookings_email_idx on public.bookings (email);

alter table public.bookings enable row level security;

drop policy if exists "Anyone can create a booking" on public.bookings;
create policy "Anyone can create a booking"
  on public.bookings
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Only authenticated can read bookings" on public.bookings;
create policy "Only authenticated can read bookings"
  on public.bookings
  for select
  to authenticated
  using (true);

drop policy if exists "Only authenticated can update bookings" on public.bookings;
create policy "Only authenticated can update bookings"
  on public.bookings
  for update
  to authenticated
  using (true)
  with check (true);
