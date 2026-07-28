-- Single-row contest schedule (admin can end early or extend)

create table if not exists public.contest_settings (
  id int primary key default 1 check (id = 1),
  ends_at timestamptz not null default '2026-08-01 23:59:59+01',
  updated_at timestamptz default now(),
  updated_by text
);

insert into public.contest_settings (id, ends_at, updated_by)
values (1, '2026-08-01 23:59:59+01', 'system')
on conflict (id) do nothing;

alter table public.contest_settings enable row level security;

-- Public read so countdown can use anon if needed; we serve via service role API
create policy "Public can read contest settings"
  on public.contest_settings for select
  to anon, authenticated
  using (true);

revoke insert, update, delete on public.contest_settings from anon, authenticated;
grant select on public.contest_settings to anon, authenticated;
grant all on public.contest_settings to service_role;
