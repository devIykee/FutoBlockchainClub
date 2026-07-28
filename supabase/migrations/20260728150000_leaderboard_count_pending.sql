-- Leaderboard counts active referrals (pending + verified).
-- Rejected stays linked but does not score; removed has referred_by cleared.

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
    and coalesce(referral_status, 'pending') in ('pending', 'verified')
  group by referred_by
) c on c.ref_code = s.ref_code
where coalesce(c.referral_count, 0) > 0
order by referral_count desc;

revoke all on public.leaderboard from anon, authenticated, public;
grant select on public.leaderboard to service_role;
