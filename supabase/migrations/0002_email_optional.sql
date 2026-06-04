-- Make email column nullable (form no longer requires email)
-- Run this in Supabase Dashboard -> SQL Editor

alter table public.bookings alter column email drop not null;
