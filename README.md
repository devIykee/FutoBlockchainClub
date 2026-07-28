# FutoBlockchainClub

Official public website for **FutoBlockchainClub** (FUTO Blockchain Club / FBC). The Ledger Invite Contest is a time-boxed campaign under `/ledger-contest`, not the site’s primary brand.

**Repository:** [github.com/devIykee/FutoBlockchainClub](https://github.com/devIykee/FutoBlockchainClub)

## Stack

- **Next.js 14** (App Router) + TypeScript + Tailwind CSS
- **Supabase** (Postgres + RLS) for contest signups / leaderboard
- **Vercel** deployment

## Design

**Refined Velocity** system: deep navy (`#0A0C10`), electric cyan (`#00E5FF`), fully rounded surfaces, glassmorphism, **Hanken Grotesk** (headings) + **Inter** (body/UI only — no third typeface).

## Routes

| Route | Description |
|-------|-------------|
| `/` | Club home — identity, what we do, contest teaser |
| `/hall-of-fame` | $100+ bounty/hackathon wins (managed in `/admin`) |
| `/team` | Core team (managed in `/admin`) |
| `/ledger-contest` | Contest hub |
| `/ledger-contest/signup` | Signup + social click-gate |
| `/ledger-contest/thank-you` | Personal referral link + share |
| `/ledger-contest/leaderboard` | Anonymized live rankings (poll ~45s) |
| `/admin` | Signups, Team CRUD + photo upload, Hall of Fame CRUD |
| `/api/keepalive` | Lightweight Supabase free-tier keep-alive |

Legacy paths `/signup`, `/thank-you`, `/leaderboard` redirect into `/ledger-contest/*`.

## Setup

```bash
npm install
cp .env.example .env.local
# fill env vars
npm run dev
```

### Environment variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_PASSWORD=
NEXT_PUBLIC_LEDGER_TG_LINK=   # Ledger Next Telegram invite
NEXT_PUBLIC_FBC_TG_LINK=      # FBC Telegram invite
NEXT_PUBLIC_FBC_X_LINK=       # e.g. https://x.com/BlockchainFUTO
NEXT_PUBLIC_FBC_WA_LINK=      # FBC WhatsApp community (optional, footer)
```

Defaults for community links also live in `src/lib/socials.ts` so local builds work if env is incomplete.

### Database

Schema lives in `supabase/migrations/`. Core table:

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

RLS is enabled. Public anon can insert; raw PII is not selectable via the anon key. Leaderboard and admin reads use the **service role** on the server only.

### Deploy (Vercel)

Connect the GitHub repo or run `vercel`. Set the same env vars in the Vercel project, then redeploy.

### Supabase free-tier keep-alive

Free projects pause after **7 days** with no API traffic. This repo includes:

- `GET /api/keepalive` — minimal count query (no PII)
- `.github/workflows/keepalive.yml` — cron every 3 days

In the GitHub repo, add secret **`SITE_URL`** (e.g. `https://your-deployment.vercel.app`) so the workflow can ping the site.

Leaderboard polls every **45s** (single interval, no Realtime fan-out). Admin loads once with a manual **Refresh** button.

## Content you manage in Admin

- **Team & photos:** `/admin` → Team tab (Supabase `team_members` + Storage `media`)
- **Hall of Fame:** `/admin` → Hall of Fame tab (prizes ≥ $100)
- **Signups:** `/admin` → Signups tab + CSV export

Public pages load live from the database (no demo seed fallback).

## Assumptions

- Levels: 100, 200, 300, 400, 500, Postgrad
- Niches: Development, Design, Content & Marketing, Community & Growth, Research, Trading/DeFi, Other
- Skill levels: Beginner, Intermediate, Advanced
- Admin: shared password + httpOnly session cookie
- Contest end: August 1, 2026 (WAT)
- Social verification: click-gated self-attestation only
- Hall of Fame / Team: database via admin panel

## Ownership

Built and maintained by **Iyke** ([@devIykee](https://github.com/devIykee)).
