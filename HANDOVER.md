# Dynamite Motors — AI Handover Document

**Last updated:** 2026-05-20  
**GitHub:** https://github.com/AbiolaOyedele/dynamitemotors  
**Production URL:** https://www.dynamitemotors.com  
**Local dev:** http://localhost:3000

---

## 1. What This Project Is

A marketing + booking website for **Dynamite Motors**, a local auto repair garage in Gravesend, Kent, UK. Audience skews older (elderly customers are explicitly a known demographic — keep UX simple and accessible). The website is live and actively used.

The codebase is a **Next.js 16 App Router** site with a fully custom file-based CMS (no database — content is JSON files on disk). There is a password-protected admin panel at `/dynamite`.

---

## 2. Stack

| Concern | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript strict mode |
| Styling | Tailwind CSS v4 (`@theme inline` in `globals.css`) |
| Animations | Framer Motion |
| Font | Manrope (Google Fonts) |
| CMS | Custom file-based JSON (`/content/*.json`) |
| Email | Resend (quote form submissions) |
| Image hosting | Local `public/` directory |
| Deployment | Vercel (assumed) |
| Repo | GitHub — `AbiolaOyedele/dynamitemotors` |

**Not used:** Supabase, databases, Sanity (Sanity scaffolding exists from a previous version but is not actively used for the main CMS — services/testimonials/offers still query a Sanity project but the admin panel overrides this with file-based content).

---

## 3. Project Structure

```
/
├── content/                  # File-based CMS — all editable via admin panel
│   ├── hero.json
│   ├── services.json
│   ├── testimonials.json
│   ├── offers.json
│   ├── stats.json
│   ├── process.json
│   ├── gallery.json
│   └── settings.json         # Includes brand colours + opening hours
│
├── public/
│   ├── gallery/              # Garage photos (5 real photos, compressed)
│   ├── images/services/      # Service card images
│   └── hero.jpg              # Hero background
│
├── src/
│   ├── app/
│   │   ├── layout.tsx        # Root layout — injects dynamic CSS colour vars
│   │   ├── globals.css       # Tailwind v4 @theme inline — CSS custom properties
│   │   ├── (public)/         # Route group — all public pages
│   │   │   ├── layout.tsx    # Wraps children with Header + Footer
│   │   │   ├── page.tsx      # Home page
│   │   │   ├── services/
│   │   │   ├── offers/
│   │   │   └── contact/
│   │   ├── dynamite/         # Admin panel (password protected)
│   │   │   ├── layout.tsx    # Auth gate — shows login or sidebar+content
│   │   │   ├── page.tsx      # Dashboard
│   │   │   ├── hero/
│   │   │   ├── services/
│   │   │   ├── testimonials/
│   │   │   ├── offers/
│   │   │   ├── stats/
│   │   │   ├── process/
│   │   │   ├── gallery/
│   │   │   └── settings/     # Business info + opening hours + brand colours
│   │   └── api/
│   │       ├── admin/auth/   # POST = login, DELETE = logout
│   │       ├── admin/content/# GET/PUT content sections
│   │       ├── admin/upload/ # POST image upload
│   │       └── v1/quote/     # POST sends quote email via Resend
│   │
│   ├── components/
│   │   ├── admin/            # AdminSidebar, ImageUploader, LoginFormClient
│   │   ├── features/         # Page sections: HeroSection, StatsBar, etc.
│   │   └── ui/               # Primitives: Button, Card, SectionHeader, etc.
│   │
│   ├── services/
│   │   ├── content.service.ts  # fetchHero, fetchStats, fetchProcess, fetchGallery,
│   │   │                       # fetchSettings, fetchServices, fetchTestimonials etc.
│   │   └── email.service.ts    # sendQuoteEmail()
│   │
│   ├── repositories/
│   │   └── sanity.repository.ts # Sanity queries (still used for services/testimonials/offers fallback)
│   │
│   ├── lib/
│   │   ├── content.ts        # readContent<T>(section) / writeContent(section, data)
│   │   ├── admin-auth.ts     # Cookie-based session (SHA-256 of ADMIN_PASSWORD)
│   │   ├── errors.ts         # AppError class
│   │   └── resend.ts         # Resend client
│   │
│   ├── config/
│   │   ├── env.ts            # Zod-validated env exports
│   │   └── constants.ts      # BUSINESS object + NAV_LINKS
│   │
│   └── types/                # service.types.ts, offer.types.ts, etc.
```

---

## 4. Layering Rules (MUST follow)

```
Routes → Services → Repositories
Pages call services only. Services call repositories. No skipping layers.
```

- `app/**/page.tsx` — calls service functions only
- `src/services/` — all business logic, calls repositories or `readContent`
- `src/repositories/` — all DB/external queries
- `src/lib/content.ts` — filesystem read/write only (don't call from pages directly)
- `src/config/env.ts` — only place that reads `process.env`

---

## 5. Colour System

Colours are CSS custom properties defined in `src/app/globals.css` using Tailwind v4's `@theme inline`:

```css
@theme inline {
  --color-primary:      #1ED760;   /* brand green */
  --color-primary-dark: #19b852;   /* hover green */
  --color-dark:         #1a1a1a;   /* near-black */
  --color-body:         #333333;   /* body text */
  --color-muted:        #666666;   /* muted text */
  --color-light-bg:     #F5F5F5;   /* light sections */
  --color-border:       #E8E8E8;   /* borders */
}
```

**The admin can override all 7 colours** from `/dynamite/settings`. On every server render, `src/app/layout.tsx` injects a `<style>` tag into `<head>` that overrides these variables from `content/settings.json`. Hex values are sanitised (`/^#[0-9a-fA-F]{6}$/`) before injection to prevent CSS injection.

---

## 6. Admin Panel

**URL:** `/dynamite`  
**Password:** stored in `.env.local` as `ADMIN_PASSWORD`  
**Auth:** SHA-256 cookie (`dm_admin_session`), 24-hour session  
**Note:** The API routes are still at `/api/admin/*` — only the UI moved to `/dynamite`

### Admin Pages

| Page | Path | What it controls |
|---|---|---|
| Dashboard | `/dynamite` | Stats overview + quick links |
| Hero | `/dynamite/hero` | Heading, accent line, subheading, background image |
| Services | `/dynamite/services` | Full CRUD — title, description, icon, features, image |
| Testimonials | `/dynamite/testimonials` | Full CRUD — name, review, rating, vehicle |
| Offers | `/dynamite/offers` | Full CRUD — title, badge, expiry, active toggle |
| Stats Bar | `/dynamite/stats` | 3 stats — value, suffix, label |
| Process Steps | `/dynamite/process` | 4 steps — title + description |
| Gallery | `/dynamite/gallery` | Upload/remove photos, edit alt text |
| Settings | `/dynamite/settings` | Business info, hours, **7 brand colours** |

---

## 7. Content System

All editable content lives in `/content/*.json`. The pattern:

```ts
// Read
import { readContent } from '@/lib/content'
const data = readContent<MyType>('section-name')

// Write (admin API only)
import { writeContent } from '@/lib/content'
writeContent('section-name', updatedData)
```

**Via service layer (preferred):**
```ts
import { fetchSettings, fetchGallery, fetchStats } from '@/services/content.service'
const settings = fetchSettings() // sync, with fallback defaults
```

All `fetch*` functions in `content.service.ts` are synchronous and have try/catch fallbacks to hardcoded defaults — so the site never breaks if a JSON file is missing.

---

## 8. Environment Variables

Required in `.env.local`:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=muezpf4i
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=<token>
RESEND_API_KEY=<key>
QUOTE_RECIPIENT_EMAIL=dynamitemotor@gmail.com
ADMIN_PASSWORD=<min 8 chars>
```

All validated at startup via Zod in `src/config/env.ts`. Import `env` from there — never `process.env` directly anywhere else.

---

## 9. Public Pages

| Route | File | Data sources |
|---|---|---|
| `/` | `(public)/page.tsx` | fetchHero, fetchStats, fetchServicesPreview, fetchProcess, fetchGallery, fetchTestimonials |
| `/services` | `(public)/services/page.tsx` | fetchServices |
| `/offers` | `(public)/offers/page.tsx` | fetchActiveOffers |
| `/contact` | `(public)/contact/page.tsx` | static |

All public pages have `export const revalidate = 3600` (ISR — 1 hour cache).

**Footer** receives `hours` prop (monFri/sat/sun) from `(public)/layout.tsx` via `fetchSettings()`.

---

## 10. Key Components

### `SectionHeader` (`src/components/ui/SectionHeader.tsx`)
- Props: `heading`, `description?`, `align?`, `headingId?`, `theme?`
- Heading always renders as `text-primary` (the brand colour)
- No pill/badge — removed

### `Button` / `ButtonLink` (`src/components/ui/Button.tsx`)
- Variants: `green` (primary CTA), `dark`, `outline`
- Uses `FlowButton` for the expanding circle animation + sliding arrow
- `group/btn` class required on the parent group for arrow animations

### `GarageGallery` (`src/components/features/GarageGallery.tsx`)
- Accepts `images?: GalleryImage[]` prop
- Desktop: expandable horizontal accordion (Framer Motion flex animation)
- Mobile: 2-col grid
- Lightbox with keyboard nav (Escape, ArrowLeft, ArrowRight)

### `HeroSection` (`src/components/features/HeroSection.tsx`)
- Accepts `heroData?: HeroData` prop
- Falls back to hardcoded strings if prop not provided
- `HeroData` type is exported from `content.service.ts`

---

## 11. Known Issues / Not Yet Done

- **`src/config/constants.ts` is stale** — `BUSINESS` object has hardcoded contact details that don't read from `content/settings.json`. If the user updates their phone/address in the admin, the Header's phone link and schema.org JSON-LD in `layout.tsx` won't update. These should be wired to `fetchSettings()`.
- **No image optimisation pipeline in admin** — images uploaded via the admin are stored as-is. Large uploads will affect Lighthouse scores.
- **No 2FA on admin** — password-only auth. Acceptable for now but worth noting.
- **Sanity is partially wired** — `sanity.repository.ts` still queries a Sanity project for services/testimonials/offers as a data source. The file-based admin writes to local JSON. These two sources could conflict. Long-term: migrate fully to file-based or fully to Sanity.
- **No quote inbox** — quote form submissions are emailed via Resend but not stored anywhere. If email fails, the quote is lost.
- **`RESEND_API_KEY=your_resend_api_key`** in `.env.local` — the key is a placeholder, so the quote form will fail in dev. The owner needs to plug in a real Resend key.

---

## 12. How to Run

```bash
cd "dynamite-motors copy"
npm install
npm run dev        # http://localhost:3000
```

Admin panel: http://localhost:3000/dynamite  
Password: value of `ADMIN_PASSWORD` in `.env.local`

---

## 13. Git Conventions

- Branch: `main` — direct commits, no PR workflow currently
- Commit messages describe *why*, not just what
- Never commit `.env.local` (it's gitignored)
- Don't push without being asked

---

## 14. Design Principles (from PRODUCT.md)

1. **Reliable** — nothing feels broken or untested
2. **Local** — feels like a real Gravesend business, not a generic template
3. **Clean** — uncluttered, easy to scan
4. **Accessible** — WCAG AA; elderly users are a known audience (large tap targets, clear contrast, no tiny text)
5. **Fast** — ISR caching, compressed images, no unnecessary JS

Brand tone: direct, trustworthy, no jargon.
