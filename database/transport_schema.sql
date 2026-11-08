-- Space Pack transport foundation for Supabase/PostgreSQL.
-- Review and run in Supabase SQL Editor only after backing up your project.
-- This schema is separate from the browser-only prototype and is not wired to it yet.

create extension if not exists pgcrypto;

create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 2 and 60),
  credits bigint not null default 50000 check (credits >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.star_systems (
  id text primary key,
  name text not null,
  x double precision not null,
  y double precision not null
);

create table if not exists public.stations (
  id uuid primary key default gen_random_uuid(),
  system_id text not null references public.star_systems(id),
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.ships (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  name text not null,
  ship_type text not null check (ship_type in ('courier','hauler','freighter')),
  station_id uuid references public.stations(id),
  status text not null default 'idle' check (status in ('idle','in_transit','maintenance')),
  cargo_capacity integer not null check (cargo_capacity > 0),
  created_at timestamptz not null default now()
);

create table if not exists public.contracts (
  id uuid primary key default gen_random_uuid(),
  origin_station_id uuid not null references public.stations(id),
  destination_station_id uuid not null references public.stations(id),
  cargo_name text not null,
  quantity integer not null check (quantity > 0),
  reward bigint not null check (reward >= 0),
  status text not null default 'available' check (status in ('available','assigned','delivered','cancelled')),
  created_at timestamptz not null default now()
);

create table if not exists public.shipments (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid not null unique references public.contracts(id),
  ship_id uuid not null references public.ships(id),
  company_id uuid not null references public.companies(id) on delete cascade,
  departed_at timestamptz not null default now(),
  arrives_at timestamptz not null,
  delivered_at timestamptz,
  status text not null default 'in_transit' check (status in ('in_transit','delivered','failed'))
);

create table if not exists public.company_transactions (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  amount bigint not null,
  reason text not null,
  created_at timestamptz not null default now()
);

create index if not exists ships_company_idx on public.ships(company_id);
create index if not exists contracts_status_idx on public.contracts(status);
create index if not exists shipments_arrival_idx on public.shipments(status, arrives_at);
create index if not exists transactions_company_time_idx on public.company_transactions(company_id, created_at desc);

alter table public.companies enable row level security;
alter table public.ships enable row level security;
alter table public.shipments enable row level security;
alter table public.company_transactions enable row level security;

-- Owners can read and update only their own company.
drop policy if exists "company owner reads own company" on public.companies;
create policy "company owner reads own company" on public.companies
for select to authenticated using (owner_id = auth.uid());

drop policy if exists "company owner updates own company" on public.companies;
create policy "company owner updates own company" on public.companies
for update to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());

drop policy if exists "company owner creates company" on public.companies;
create policy "company owner creates company" on public.companies
for insert to authenticated with check (owner_id = auth.uid());

drop policy if exists "company owner manages ships" on public.ships;
create policy "company owner manages ships" on public.ships
for all to authenticated
using (exists (select 1 from public.companies c where c.id = company_id and c.owner_id = auth.uid()))
with check (exists (select 1 from public.companies c where c.id = company_id and c.owner_id = auth.uid()));

drop policy if exists "company owner reads shipments" on public.shipments;
create policy "company owner reads shipments" on public.shipments
for select to authenticated
using (exists (select 1 from public.companies c where c.id = company_id and c.owner_id = auth.uid()));

drop policy if exists "company owner reads transactions" on public.company_transactions;
create policy "company owner reads transactions" on public.company_transactions
for select to authenticated
using (exists (select 1 from public.companies c where c.id = company_id and c.owner_id = auth.uid()));

-- Public game data is readable. Do not grant clients direct write access to
-- contracts, shipments or balances. A trusted server/Edge Function must validate
-- dispatches, arrivals, capacity and rewards, then update these tables.
alter table public.star_systems enable row level security;
alter table public.stations enable row level security;
alter table public.contracts enable row level security;

drop policy if exists "systems are readable" on public.star_systems;
create policy "systems are readable" on public.star_systems for select to anon, authenticated using (true);
drop policy if exists "stations are readable" on public.stations;
create policy "stations are readable" on public.stations for select to anon, authenticated using (true);
drop policy if exists "available contracts are readable" on public.contracts;
create policy "available contracts are readable" on public.contracts for select to anon, authenticated using (status = 'available');

-- No client-side payout policy is provided intentionally.
