# Dynamite Motors

Professional website for Dynamite Motors — a local auto repair shop in Gravesend, UK.

Built with Next.js 15 (App Router), Tailwind CSS v4, Sanity CMS, and Resend for email delivery.

---

## What It Does

- **Landing page** — hero, stats, services preview, process steps, testimonials
- **Services page** — full grid of services managed in Sanity
- **Offers page** — active promotions managed in Sanity, with expiry dates
- **Contact page** — click-to-call/email business info, Google Maps embed, quote request form
- **Quote API** — `POST /api/v1/quote` validates input with Zod, rate-limits by IP, and sends an email via Resend to the shop

---

## Tech Stack

| Concern | Tool |
|---|---|
| Framework | Next.js 15 — App Router |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v4 |
| CMS | Sanity v5 |
| Email | Resend |
| Validation | Zod |
| Font | Manrope (Google Fonts) |
| Deployment | Vercel |

---

## Local Setup

### 1. Clone and install

```bash
git clone <your-repo-url>
cd dynamite-motors
npm install
```

### 2. Create a Sanity project

1. Go to [sanity.io/manage](https://sanity.io/manage) and create a new project
2. Choose the **"Production"** dataset (or create one named `production`)
3. Copy the **Project ID** from the project settings page
4. Generate an **API token** with **Editor** permissions under *Settings → API → Tokens*

### 3. Create a Resend account

1. Sign up at [resend.com](https://resend.com)
2. Verify a sending domain (or use `onboarding@resend.dev` for testing — delivers only to your Resend account email)
3. Copy your **API key** from the dashboard
4. Update the `from` address in [`src/services/email.service.ts`](src/services/email.service.ts) once your domain is verified

### 4. Configure environment variables

Copy the placeholder file and fill in your values:

```bash
cp .env.local .env.local.bak   # optional backup
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=   # Your Sanity project ID (e.g. abc123xy)
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=                # Sanity editor token — server-only, never expose
RESEND_API_KEY=                  # Resend API key — server-only, never expose
QUOTE_RECIPIENT_EMAIL=dynamitemotor@gmail.com
```

> **Never commit `.env.local`** — it is listed in `.gitignore`.

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Yes | Sanity project ID — safe to expose to the browser |
| `NEXT_PUBLIC_SANITY_DATASET` | Yes | Sanity dataset name, typically `production` |
| `SANITY_API_TOKEN` | Yes | Sanity API token with Editor role — **server-only** |
| `RESEND_API_KEY` | Yes | Resend API key for sending quote emails — **server-only** |
| `QUOTE_RECIPIENT_EMAIL` | Yes | Email address that receives quote requests |

`SANITY_API_TOKEN` and `RESEND_API_KEY` must **never** be prefixed with `NEXT_PUBLIC_` — doing so would expose them to every browser that visits the site.

---

## Sanity Studio

The Sanity Studio is embedded in the project via `sanity.config.ts`.

To run the Studio locally:

```bash
npx sanity dev
```

Or access it through the Sanity web dashboard at [sanity.io/manage](https://sanity.io/manage).

### Content types

| Type | Purpose |
|---|---|
| **Service** | Repair/service offerings shown on the Services page and in the landing page preview grid |
| **Offer** | Promotions shown on the Offers page — set `active: false` to hide without deleting |
| **Testimonial** | Customer reviews shown on the landing page |

### Deploying the Studio

```bash
npx sanity deploy
```

This publishes the Studio to a `<your-project>.sanity.studio` URL so the shop owner can manage content without running anything locally.

---

## Deploying to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

### 2. Import on Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Vercel detects Next.js automatically — no build configuration needed

### 3. Add environment variables

In your Vercel project: **Settings → Environment Variables**

Add each variable from the [reference table](#environment-variables-reference) above. Mark `SANITY_API_TOKEN` and `RESEND_API_KEY` as **Production** + **Preview** only (not exposed to the browser).

### 4. Deploy

Click **Deploy**. Subsequent pushes to `main` trigger automatic redeploys.

### Revalidation

Sanity content is cached with `revalidate: 3600` (1 hour). To flush the cache immediately after a content update, trigger a manual redeploy from the Vercel dashboard, or configure a [Sanity webhook](https://www.sanity.io/docs/webhooks) pointing at Vercel's deploy hook URL.

---

## Project Structure

```
src/
  app/                        # Next.js App Router pages
    api/v1/quote/route.ts     # POST quote handler — validates, rate-limits, emails
    contact/page.tsx
    offers/page.tsx
    services/page.tsx
    page.tsx                  # Landing page
  components/
    ui/                       # Button, Input, Badge, Card primitives
    features/                 # Page-level sections (Header, Footer, forms, grids)
  config/
    constants.ts              # Business name, address, phone, email — edit here
    env.ts                    # Zod env validation — the only file that reads process.env
  lib/
    errors.ts                 # AppError class
    resend.ts                 # Resend client
    sanity.ts                 # Sanity client
  repositories/
    sanity.repository.ts      # All GROQ queries — nowhere else
  services/
    email.service.ts          # Quote email business logic
  types/                      # TypeScript types for Sanity content and quote form
  utils/
    cn.ts                     # Tailwind class merge utility
sanity/
  schemas/                    # Sanity document schemas
```

---

## Updating Business Details

All contact details (address, phone, email, Google Maps URL) are defined in one place:

```
src/config/constants.ts
```

Edit the `BUSINESS` object there. No other file hardcodes contact information.

---

## License

Private — all rights reserved. © 2025 Dynamite Motors.
