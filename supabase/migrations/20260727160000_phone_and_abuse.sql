-- Phone number + anti-abuse uniqueness

-- phone stored E.164-style e.g. +2348012345678
alter table public.signups
  add column if not exists phone text;

-- Backfill placeholder unique phones for any existing rows without phone
-- (dev/test rows only — production may be empty)
update public.signups
set phone = '+000' || replace(id::text, '-', '')
where phone is null or phone = '';

alter table public.signups
  alter column phone set not null;

-- Unique identity keys (case-insensitive handles via lower() indexes)
create unique index if not exists signups_phone_unique
  on public.signups (phone);

create unique index if not exists signups_x_handle_lower_unique
  on public.signups (lower(x_handle));

create unique index if not exists signups_telegram_lower_unique
  on public.signups (lower(telegram_username));

-- Optional: prevent trivial empty strings
alter table public.signups
  add constraint signups_phone_not_blank check (char_length(phone) >= 8);
