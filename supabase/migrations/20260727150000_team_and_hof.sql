-- Core team + Hall of Fame (admin-editable content)

create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  photo text,
  x text,
  github text,
  linkedin text,
  sort_order int not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists team_members_sort_idx on public.team_members (sort_order, created_at);

create table if not exists public.hall_of_fame (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  achievement text not null,
  prize_usd numeric not null check (prize_usd >= 100),
  date text not null,
  project_url text,
  description text,
  sort_order int not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists hall_of_fame_sort_idx on public.hall_of_fame (sort_order, prize_usd desc);

alter table public.team_members enable row level security;
alter table public.hall_of_fame enable row level security;

-- Public read (no PII beyond what we publish on the site)
create policy "Public can read team"
  on public.team_members for select
  to anon, authenticated
  using (true);

create policy "Public can read hall of fame"
  on public.hall_of_fame for select
  to anon, authenticated
  using (true);

-- Writes only via service role (admin API)
revoke insert, update, delete on public.team_members from anon, authenticated;
revoke insert, update, delete on public.hall_of_fame from anon, authenticated;
grant select on public.team_members to anon, authenticated;
grant select on public.hall_of_fame to anon, authenticated;
grant all on public.team_members to service_role;
grant all on public.hall_of_fame to service_role;
