# Dynamite Motors — Handover Document

**Last updated:** 2026-06-07  
**GitHub:** https://github.com/AbiolaOyedele/dynamitemotors  
**Production URL:** https://www.dynamitemotors.com  
**Admin panel:** https://www.dynamitemotors.com/dynamite  
**Local dev:** http://localhost:3000

---

## 1. What This Project Is

A marketing and booking website for **Dynamite Motors**, a local auto repair garage in Gravesend, Kent, UK. The site is live, actively used, and has a password-protected admin panel the client uses to manage all content.

Known audience includes elderly customers — keep UX simple, accessible, and never add complexity to public-facing pages without good reason.

---

## 2. Stack

| Concern | Choice |
|---|---|
| Framework | Next.js 15/16 (App Router) |
| Language | TypeScript strict mode (`exactOptionalPropertyTypes: true`) |
| Styling | Tailwind CSS v4 (`@theme inline` in `globals.css`) |
| Animations | Framer Motion + Lenis (smooth scroll, public only) |
| Font | Manrope (Google Fonts) |
| CMS / Storage | **Sanity CMS** (all persistent content) |
| Image hosting | **Cloudinary** (unsigned upload preset) |
| Email | Resend (quote form → garage inbox + customer confirmation) |
| Deployment | Vercel |
| Repo | GitHub — `AbiolaOyedele/dynamitemotors` |

**Critical:** Vercel uses an **ephemeral filesystem** — file writes do not persist across deployments or serverless function invocations. All content must go through Sanity. Do not reintroduce file-based writes.

---

## 3. Environment Variables

All variables are validated at startup by Zod in `src/config/env.ts`. **Never read `process.env` directly anywhere else — always import `env` from that file.**

```env
# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=muezpf4i
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=<token with editor/write permissions>

# Email
RESEND_API_KEY=<key>
QUOTE_RECIPIENT_EMAIL=dynamitemotor@gmail.com

# Admin panel
ADMIN_PASSWORD=<min 8 chars>

# Cloudinary image uploads
CLOUDINARY_CLOUD_NAME=diud4qb2x
CLOUDINARY_UPLOAD_PRESET=dynamite_motors
```

All 8 variables must also be set in **Vercel project settings** (Environment Variables tab). Missing any one will crash the app at boot.

---

## 4. Project Structure

```
/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout — injects dynamic CSS colour vars from Sanity settings
│   │   ├── (public)/               # All public pages
│   │   │   ├── layout.tsx          # Header + Footer + LenisProvider
│   │   │   ├── page.tsx            # Home — Promise.all fetches
│   │   │   ├── services/page.tsx
│   │   │   ├── offers/page.tsx
│   │   │   └── contact/page.tsx
│   │   ├── dynamite/               # Admin panel (password protected)
│   │   │   ├── layout.tsx          # Auth gate
│   │   │   ├── page.tsx            # Dashboard with live Sanity counts
│   │   │   ├── hero/
│   │   │   ├── services/
│   │   │   ├── testimonials/
│   │   │   ├── offers/
│   │   │   ├── stats/
│   │   │   ├── process/
│   │   │   ├── gallery/
│   │   │   └── settings/
│   │   └── api/
│   │       ├── admin/auth/         # POST=login, DELETE=logout
│   │       ├── admin/content/      # GET/PUT all content sections (→ Sanity)
│   │       ├── admin/upload/       # POST image → Cloudinary
│   │       └── v1/quote/           # POST sends quote email via Resend
│   │
│   ├── components/
│   │   ├── admin/                  # AdminSidebar, ImageUploader, LoginFormClient
│   │   ├── features/               # Page section components
│   │   └── ui/                     # Primitives: Button, Card, BookingCalendar, etc.
│   │
│   ├── services/
│   │   ├── content.service.ts      # All async fetch* functions — reads from Sanity
│   │   └── email.service.ts        # sendQuoteEmail()
│   │
│   ├── repositories/
│   │   └── sanity.repository.ts    # All Sanity GROQ queries (getServices, getSingleton, etc.)
│   │
│   ├── lib/
│   │   ├── sanity.ts               # Sanity client setup
│   │   ├── admin-auth.ts           # Cookie session (SHA-256 of ADMIN_PASSWORD, 24h TTL)
│   │   ├── errors.ts               # AppError class
│   │   └── resend.ts               # Resend client
│   │
│   ├── config/
│   │   ├── env.ts                  # Zod-validated env — import from here, not process.env
│   │   └── constants.ts            # BUSINESS object + NAV_LINKS (some fields hardcoded — see Known Issues)
│   │
│   └── types/                      # service.types.ts, offer.types.ts, quote.types.ts, etc.
│
├── public/
│   ├── gallery/                    # Legacy local gallery photos
│   ├── images/services/            # Legacy local service images
│   └── hero.jpg                    # Default hero fallback
│
└── content/                        # LEGACY — no longer written to. Kept as fallback reference only.
    └── *.json
```

---

## 5. Content Architecture (Sanity)

### Singleton documents (one per type)

| Section | Sanity `_type` | Array field |
|---|---|---|
| Hero | `hero` | — (flat object) |
| Stats bar | `stats` | `items` |
| Gallery | `gallery` | `items` |
| Process steps | `process` | `steps` |
| Site settings | `siteSettings` | — (flat object) |

### Multi-documents (many per type)

| Section | Sanity `_type` |
|---|---|
| Services | `service` |
| Testimonials | `testimonial` |
| Offers | `offer` |

### How the admin API normalises data

The admin content API (`/api/admin/content`) bridges between Sanity's document structure and what the admin pages expect:

**GET** — normalises for admin:
- Singleton array-wrapped fields (`stats.items`, `gallery.items`, `process.steps`) are **unwrapped** to flat arrays
- Multi-doc `_id` is **mapped to `id`** for admin compatibility
- Internal Sanity meta fields (`_rev`, `_createdAt`, etc.) are stripped

**PUT** — denormalises before saving:
- Flat arrays are **re-wrapped** back into named fields for singleton patches
- `id`/`_id`/meta fields are **stripped** before Sanity creates new docs
- Singleton patches are **explicitly published** (not left as drafts)
- `revalidatePath()` is called for all affected pages after every save

---

## 6. Layering Rules (hard — do not violate)

```
Pages → Services → Repositories → Sanity
```

- `app/**/page.tsx` — calls service functions only, never repositories directly
- `src/services/content.service.ts` — all async, with fallback defaults if Sanity returns null
- `src/repositories/sanity.repository.ts` — all GROQ queries, nothing else
- `src/config/env.ts` — only place that touches `process.env`

---

## 7. Colour System

Colours are CSS custom properties defined in `src/app/globals.css` using Tailwind v4's `@theme inline`:

```css
@theme inline {
  --color-primary:      #1ED760;
  --color-primary-dark: #19b852;
  --color-dark:         #1a1a1a;
  --color-body:         #333333;
  --color-muted:        #666666;
  --color-light-bg:     #F5F5F5;
  --color-border:       #E8E8E8;
}
```

The admin can override all 7 colours from `/dynamite/settings`. On every server render, `src/app/layout.tsx` reads the `siteSettings` Sanity document and injects a `<style>` tag into `<head>` that overrides these variables. Hex values are sanitised (`/^#[0-9a-fA-F]{6}$/`) before injection to prevent CSS injection.

---

## 8. Admin Panel

**URL:** `/dynamite`  
**Password:** value of `ADMIN_PASSWORD` env var  
**Auth:** SHA-256 cookie (`dm_admin_session`), 24-hour session  
**API routes:** all still under `/api/admin/*`

### Admin Sections

| Page | Path | What it controls |
|---|---|---|
| Dashboard | `/dynamite` | Live counts from Sanity + quick links |
| Hero | `/dynamite/hero` | Heading, accent, subheading, hero image |
| Services | `/dynamite/services` | Full CRUD — title, description, icon, features, image |
| Testimonials | `/dynamite/testimonials` | Full CRUD — name, review, rating, vehicle |
| Offers | `/dynamite/offers` | Full CRUD — title, badge, expiry, active toggle |
| Stats Bar | `/dynamite/stats` | 3 stats — value, suffix, label |
| Process Steps | `/dynamite/process` | 4 steps — title + description |
| Gallery | `/dynamite/gallery` | Upload photos, edit alt text, remove |
| Settings | `/dynamite/settings` | Business info, hours, 7 brand colours |

Every section has a **Save Changes** button. On save:
1. PUT → `/api/admin/content?section=<name>`
2. Route writes to Sanity via REST mutations API
3. `revalidatePath` busts Next.js ISR cache
4. Change appears on live site within seconds

---

## 9. Image Uploads

Images are uploaded via `POST /api/admin/upload`:

1. Receives `multipart/form-data`
2. Forwards to Cloudinary unsigned upload endpoint
3. Returns `{ path: secure_url }` — a full Cloudinary HTTPS URL
4. Admin pages save this URL into the relevant Sanity document field

**Cloudinary account:** `diud4qb2x`  
**Upload preset:** `dynamite_motors` (unsigned, must exist in Cloudinary dashboard)

Do not revert to filesystem uploads — they will not persist on Vercel.

---

## 10. Booking Flow

The "Book a Service" modal is wired from:
- Home page hero "Book a Service" button → `ServiceQuoteModal` with `service=""`
- Services grid "Book this Service" buttons → `ServiceQuoteModal` with pre-filled service name
- Services page CTA → `ServicesPageCTA` (client component) → same modal

The modal renders `HeroQuoteForm` with an `onSuccess` prop. When `onSuccess` is present:
- Form shows date/time picker (`BookingCalendar` component)
- Submit button label is "Book a Service"
- Date restrictions: no Sundays, no past dates, Saturdays limited to Morning + Afternoon (closes 3pm)

Without `onSuccess` (standalone quote form on home hero): shows as "Get a Quote" with no date picker.

Quote submissions go to `POST /api/v1/quote` → Resend → garage email + customer confirmation.

---

## 11. Smooth Scroll

Lenis smooth scroll is initialised in `src/components/ui/LenisProvider.tsx`, which is placed in `src/(public)/layout.tsx` **only** — not the root layout. This keeps smooth scroll off the admin panel.

`LenisProvider` uses a `MutationObserver` to watch `document.body` style — when a modal sets `overflow: hidden`, Lenis is paused automatically to prevent scroll-lock conflicts.

---

## 12. Public Pages

| Route | Data fetched |
|---|---|
| `/` | hero, stats, services (preview), process, gallery, testimonials |
| `/services` | services, settings (for hero image) |
| `/offers` | active offers |
| `/contact` | static |

All public pages have `export const revalidate = 3600` (ISR, 1-hour cache). After admin saves, `revalidatePath` forces immediate refresh.

The `(public)/layout.tsx` fetches `settings` for the Footer's opening hours.  
The root `layout.tsx` fetches `settings` for brand colour injection.

---

## 13. Email

Two emails are sent on quote/booking submission:

1. **Garage notification** (`QUOTE_RECIPIENT_EMAIL`) — full job details, preferred date/time if booking
2. **Customer confirmation** — sent to the email they entered in the form

Both are plain HTML via Resend. Template lives in `src/services/email.service.ts`.

**From address:** `services@dynamitemotors.com` (domain verified in Resend)

---

## 14. Known Issues / Tech Debt

| Issue | Risk | Fix |
|---|---|---|
| `src/config/constants.ts` `BUSINESS` object has hardcoded phone/address | Admin settings changes won't update header phone link or schema.org JSON-LD | Wire to `fetchSettings()` |
| No quote inbox — submissions are email-only | If Resend fails, quote is silently lost | Add Sanity `quote` document type to persist all submissions |
| Admin is password-only (no 2FA) | Low for a local business, but worth noting | Add TOTP if requested |
| Some legacy local images in `public/images/services/` | Still served fine, just not managed via Cloudinary | Migrate when services are re-uploaded through admin |
| `content/*.json` files still present | Stale, no longer read or written | Safe to delete if confirmed not referenced anywhere |
| Vercel CLI outdated (54.7.1 → 54.9.1) | Minor compatibility gap | `npm i -g vercel@latest` |

---

## 15. How to Run Locally

```bash
cd "dynamite-motors copy"
npm install
# Ensure .env.local has all 8 required variables
npm run dev        # http://localhost:3000
```

Admin: http://localhost:3000/dynamite  
Password: value of `ADMIN_PASSWORD` in `.env.local`

**Note:** Local dev may hit Sanity DNS resolution errors if your network blocks certain CDN subdomains. This does not affect the Vercel deployment — it is a local sandbox issue.

---

## 16. Deployment

- **Vercel** — auto-deploys on push to `main`
- **Domain:** `www.dynamitemotors.com` (canonical); `dynamitemotors.vercel.app` redirects to www
- After every deploy, admin saves trigger `revalidatePath` which clears ISR cache

If the admin "Save Changes" button shows no change on the site after saving, the most likely cause is either:
1. A Sanity token permissions issue (check `SANITY_API_TOKEN` has write access)
2. A `revalidatePath` not being called for the right route (check `SECTION_PATHS` in `/api/admin/content/route.ts`)

---

## 17. Git Conventions

- Branch: `main` — direct commits, no PR workflow currently
- Commit messages describe *why*, not just what
- Never commit `.env.local` — it is gitignored
- Don't push without being asked by the user

---

## 18. Design Principles

1. **Reliable** — nothing feels broken or untested
2. **Local** — feels like a real Gravesend business, not a generic template
3. **Clean** — uncluttered, easy to scan
4. **Accessible** — WCAG AA; elderly users are a known audience (large tap targets, clear contrast, readable font sizes)
5. **Fast** — ISR caching, Cloudinary CDN images, minimal JS

Brand tone: direct, trustworthy, no jargon. No status pills, availability badges, or "live indicator chips" — ever.
