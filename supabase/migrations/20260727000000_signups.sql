-- FBC × Ledger Invite Contest schema

create table if not exists public.signups (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  department text not null,
  level text not null,
  niche text not null,
  skill_level text not null,
  x_handle text not null,
  telegram_username text not null,
  ref_code text unique not null,
  referred_by text references public.signups(ref_code),
  joined_ledger boolean default false,
  joined_fbc boolean default false,
  followed_x boolean default false,
  created_at timestamptz default now()
);

create index if not exists signups_referred_by_idx on public.signups (referred_by);
create index if not exists signups_created_at_idx on public.signups (created_at desc);

-- Anonymized leaderboard view (aggregated referral counts)
create or replace view public.leaderboard
with (security_invoker = false)
as
select
  s.ref_code,
  s.full_name,
  coalesce(c.referral_count, 0)::bigint as referral_count
from public.signups s
left join (
  select referred_by as ref_code, count(*)::bigint as referral_count
  from public.signups
  where referred_by is not null
  group by referred_by
) c on c.ref_code = s.ref_code
where coalesce(c.referral_count, 0) > 0
order by referral_count desc;

-- RLS
alter table public.signups enable row level security;

-- Public may insert their own signup (anon key path; we primarily use service role via API)
create policy "Anyone can insert signups"
  on public.signups
  for insert
  to anon, authenticated
  with check (true);

-- No direct public select on raw signups (PII protection)
-- Leaderboard is served via server route using service role.

-- Grant usage on leaderboard view to service role only by default;
-- revoke from anon for safety (server uses service role).
revoke all on public.leaderboard from anon, authenticated, public;
grant select on public.leaderboard to service_role;

revoke all on public.signups from anon, authenticated;
grant insert on public.signups to anon, authenticated;
grant all on public.signups to service_role;
