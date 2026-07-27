# FBC × Ledger Invite Contest

Production site for the FUTO Blockchain Club (FBC) × Ledger invite contest. Students join the Ledger community, join FBC, follow FBC socials, and climb a live referral leaderboard.

## Stack

- **Next.js 14** (App Router) + TypeScript + Tailwind CSS
- **Supabase** (Postgres + RLS)
- **Vercel** deployment target

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing — hero, how-it-works, countdown (ends **August 1**) |
| `/signup` | Form + social click-gated verification |
| `/thank-you` | Personal referral link + share intents |
| `/leaderboard` | Live anonymized rankings (poll every 15s) |
| `/admin` | Password-gated signup table + CSV export |

## Setup

### 1. Install

```bash
npm install
```

### 2. Environment

Copy `.env.example` → `.env.local` and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_PASSWORD=
NEXT_PUBLIC_LEDGER_TG_LINK=
NEXT_PUBLIC_FBC_TG_LINK=
NEXT_PUBLIC_FBC_X_LINK=
```

- Supabase keys: project **Settings → API**
- `ADMIN_PASSWORD`: shared password for `/admin` (checked server-side; session cookie)
- Social links: real Telegram / X URLs for the verification buttons

### 3. Database

Schema lives in `supabase/migrations/`. Apply via Supabase CLI (linked project) or run the SQL in the dashboard SQL editor.

Core table:

```sql
create table signups (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  department text not null,
  level text not null,
  niche text not null,
  skill_level text not null,
  x_handle text not null,
  telegram_username text not null,
  ref_code text unique not null,
  referred_by text references signups(ref_code),
  joined_ledger boolean default false,
  joined_fbc boolean default false,
  followed_x boolean default false,
  created_at timestamptz default now()
);
```

RLS is enabled. Public anon can insert; raw PII is **not** selectable via the anon key. Leaderboard and admin reads go through Next.js API routes using the **service role** key (server-only).

### 4. Local dev

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Deploy (Vercel)

```bash
vercel
```

Set the same env vars in the Vercel project settings (or via `vercel env`).

## Referral flow

1. Visitor hits `/?ref=CODE` (or any page with `?ref=`)
2. Code is stored in `localStorage` (`fbc_ref`) + a cookie
3. Signup form prefills “Referred by” when present
4. On submit, a new 7-char `ref_code` is generated and the user is sent to `/thank-you?ref=…`

## Assumptions

- **Levels:** 100, 200, 300, 400, 500, Postgrad (FUTO-style)
- **Niches:** Development, Design, Content & Marketing, Community & Growth, Research, Trading/DeFi, Other
- **Skill levels:** Beginner, Intermediate, Advanced
- **Admin auth:** shared password + httpOnly session cookie (not full user auth)
- **Contest end:** August 1, 2026 (WAT)
- **Social verification:** click-gated self-attestation (no live X follow API)
- Social link env vars may still be placeholders — update them before launch

## Project ownership

Built and maintained by **Iyke** ([@devIykee](https://github.com/devIykee)).
