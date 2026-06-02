# AURA MUSIC — Music Agency SaaS Platform

A production-ready music agency platform built with **Next.js (App Router)**, **Tailwind CSS**, **Lucide Icons**, **Supabase**, and **Stripe**.

## Features

- **Premium luxury UI** — Pitch-black (#000000) backgrounds, charcoal cards (#121212), crisp white typography, glowing borders
- **Auth** — Supabase email/password login & signup
- **Middleware** — Protects dashboard routes; requires valid session + active $25/mo Stripe subscription
- **Command Center** — Overview dashboard with algorithm score, playlist adds, TikTok velocity, streams charts
- **Campaign Launcher** — 4-step flow: metadata → assets → tier selection → checkout
- **Stripe** — Recurring subscription + one-time campaign tier payments
- **Database** — Supabase schema for profiles, campaigns, subscription events

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

Copy `.env.example` to `.env.local` and fill in:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role (webhooks) |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_SUBSCRIPTION_PRICE_ID` | Stripe Price ID for $25/mo plan |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `NEXT_PUBLIC_APP_URL` | e.g. `http://localhost:3000` |

### 3. Database setup

Run the migration in Supabase SQL Editor:

```bash
supabase/migrations/001_initial_schema.sql
```

### 4. Stripe setup

1. Create a **$25/month** recurring Product + Price in Stripe Dashboard
2. Set `STRIPE_SUBSCRIPTION_PRICE_ID` to the Price ID
3. Add webhook endpoint: `https://your-domain.com/api/webhooks/stripe`
4. Listen for: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`

### 5. Run locally

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── api/stripe/          # Checkout session handlers
│   ├── api/webhooks/stripe/ # Subscription & payment webhooks
│   ├── dashboard/           # Protected app pages
│   └── login/               # Auth page
├── components/
│   ├── auth/
│   ├── billing/
│   ├── campaign/
│   ├── dashboard/
│   ├── layout/
│   └── ui/
├── lib/
│   ├── supabase/
│   ├── constants.ts
│   └── stripe.ts
└── middleware.ts
supabase/migrations/         # SQL schema
```

## Campaign Tiers

| Tier | Price |
|------|-------|
| Emerging Push | $500 |
| Chart Accelerator | $1,250 |
| Global Domination | $2,500 |

## License

MIT
