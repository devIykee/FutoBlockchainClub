-- Referral moderation: status on each referred signup + admin audit log

-- Status of this signup AS a referral credit for their referrer
-- null = organic (no referrer); pending/verified/rejected while referred_by set;
-- removed = credit stripped (referred_by cleared)
alter table public.signups
  add column if not exists referral_status text;

alter table public.signups
  add column if not exists referral_source text;

alter table public.signups
  add column if not exists referral_reviewed_at timestamptz;

alter table public.signups
  add column if not exists referral_reviewed_by text;

alter table public.signups
  add column if not exists referral_review_reason text;

-- Soft history: last referrer code before a remove action
alter table public.signups
  add column if not exists previous_referred_by text;

-- Backfill existing referred signups as pending
update public.signups
set
  referral_status = 'pending',
  referral_source = coalesce(referral_source, 'referral_link')
where referred_by is not null
  and (referral_status is null or referral_status = '');

-- Organic signups
update public.signups
set referral_status = null
where referred_by is null
  and (referral_status is null or referral_status = 'pending');

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'signups_referral_status_check'
  ) then
    alter table public.signups
      add constraint signups_referral_status_check
      check (
        referral_status is null
        or referral_status in ('pending', 'verified', 'rejected', 'removed')
      );
  end if;
end $$;

create index if not exists signups_referral_status_idx
  on public.signups (referral_status)
  where referral_status is not null;

create index if not exists signups_referred_by_status_idx
  on public.signups (referred_by, referral_status)
  where referred_by is not null;

-- Leaderboard: only VERIFIED referrals count toward rewards
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
    and referral_status = 'verified'
  group by referred_by
) c on c.ref_code = s.ref_code
where coalesce(c.referral_count, 0) > 0
order by referral_count desc;

revoke all on public.leaderboard from anon, authenticated, public;
grant select on public.leaderboard to service_role;

-- Admin audit trail for moderation actions
create table if not exists public.admin_audit_log (
  id uuid primary key default gen_random_uuid(),
  admin_actor text not null default 'admin',
  action text not null,
  target_signup_id uuid references public.signups(id) on delete set null,
  target_ref_code text,
  referrer_ref_code text,
  reason text not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create index if not exists admin_audit_log_created_idx
  on public.admin_audit_log (created_at desc);

create index if not exists admin_audit_log_target_idx
  on public.admin_audit_log (target_signup_id);

alter table public.admin_audit_log enable row level security;

revoke all on public.admin_audit_log from anon, authenticated, public;
grant all on public.admin_audit_log to service_role;
