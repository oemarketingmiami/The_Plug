# ThePlugSuppliers — Project Notes

## What This Is
A digital supplier directory marketplace (clone of shopwithcam.com) where customers buy downloadable vendor/supplier lists as PDF info products. Pay via Stripe → get a download link. No physical shipping.

---

## Tech Stack
| Layer | Tech |
|---|---|
| Frontend | React + Vite |
| Styling | Tailwind CSS + custom components |
| Routing | React Router v6 |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (admin login) |
| File Storage | Supabase Storage |
| Payments | Stripe Checkout + Webhooks |
| Deployment | Vercel (connected to GitHub) |
| API Functions | Vercel `/api` serverless |

---

## What Has Been Built

### Infrastructure
- Vite + React project scaffolded
- Tailwind CSS v4 configured via `@tailwindcss/vite`
- Google Fonts loaded: **Anton** (headings) + **Epilogue** (body)
- `.env.local` with all keys (Supabase filled in, Stripe still placeholders)
- `vercel.json` configured for SPA routing + serverless functions
- Pushed to GitHub: `github.com/oemarketingmiami/The_Plug`
- Deployed to Vercel (live URL — check Vercel dashboard)

### Supabase
- SQL schema run: `products` table + `orders` table with RLS policies
- Storage buckets created:
  - `products` (private — actual PDF files, signed URL only)
  - `product-images` (public — card thumbnails)
- Supabase keys filled into `.env.local`

### Stripe
- ⚠️ Keys are still placeholder (`pk_test_placeholder`, `sk_test_placeholder`)
- Webhook secret not yet configured

### Frontend Pages
| Page | Path | Status |
|---|---|---|
| Home | `/` | Done — hero, tabs, product grid |
| Product Detail | `/product/:slug` | Done |
| Cart | `/cart` | Done |
| Checkout | `/checkout` | Done — email + Stripe redirect |
| Success | `/success` | Done — polls for paid status, generates signed download URLs |
| Admin | `/admin` | Done — login, product CRUD, orders table, file upload |

### Components Built
- `Navbar` — sticky, cart icon with badge, cart drawer toggle
- `Footer` — minimal
- `CartDrawer` — slides in from right, remove items, checkout link
- `CategoryTabs` — Radix UI tabs (All → Toys), sticky below navbar
- `UniformCard` — horizontal landscape card with GlowCard spotlight effect
- `GlowCard` — spotlight glow border that follows mouse cursor
- `FallingPattern` — animated falling green streaks (full-page fixed background, framer-motion)
- `SaleBadge` — green pill badge
- `ProductCard`, `BundleCard`, `ProductGrid` — older versions, still in codebase but replaced by UniformCard on home page

### Hooks
- `useCart` — localStorage cart, `{ items, addItem, removeItem, clearCart, total }`
- `useProducts` — fetches from Supabase, falls back to seed data if not configured
- `useProduct(slug)` — single product lookup

### Serverless API
- `/api/create-checkout-session.js` — creates Stripe session + pending order in Supabase
- `/api/stripe-webhook.js` — listens for `checkout.session.completed`, marks order paid, generates download token

### Seed Data (13 products, no Stripe IDs yet)
Cologne Vendor, Cologne Supplier Bundle, Pods Max Vendor, Pods Vendor, Labubu Vendor, Watch Vendor, All Bag Vendor, Dyson Vendor, Glasses Vendor, Golf Club Vendor, Hoodie Supplier, Moissanite Watch Vendor, All Vendor Bundle (100+ Suppliers)

---

## What Still Needs To Be Done

### 🔴 Critical (app won't process payments without these)
1. **Stripe keys** — add real `pk_test_` / `sk_test_` (or live) keys to `.env.local` AND Vercel environment variables
2. **Create Stripe products** — go to Stripe dashboard, create a product + price for each of the 13 items, copy each `price_xxx` ID
3. **Add `stripe_price_id` to each product** — either via Admin panel or Supabase SQL editor
4. **Register Stripe webhook** — point to `https://your-vercel-url.vercel.app/api/stripe-webhook`, select events: `checkout.session.completed` + `checkout.session.expired`, copy `whsec_xxx` into Vercel env vars
5. **Upload actual PDF files** — go to Admin panel → add/edit each product → upload the PDF to Supabase Storage `products` bucket

### 🟡 Important (quality of life)
6. **Update `VITE_SITE_URL`** in Vercel env vars to your real Vercel domain (currently `http://localhost:5173`)
7. **Create admin user** — go to Supabase → Authentication → Users → Invite/create a user with your email + password so you can log into `/admin`
8. **Add product images** — upload images for each product via Admin panel → they show in the cards instead of SVG icons
9. **Test full purchase flow** — use Stripe test card `4242 4242 4242 4242`, verify order appears in Supabase with status `paid`, verify download link works on Success page

### 🟢 Nice To Have (post-launch)
10. **Email delivery** — add SendGrid or Resend to the webhook handler to email download links to customers automatically
11. **Product detail page polish** — currently functional but unstyled compared to the new home page design
12. **Cart + Checkout page styling** — functional but uses older styles, could match the new dark/glow aesthetic
13. **Admin panel styling** — functional but plain, could use the glow card design
14. **Switch Stripe to live keys** — once testing is complete, swap `pk_test_` → `pk_live_` etc.
15. **Domain** — connect a custom domain in Vercel settings

---

## Environment Variables Needed
```
# .env.local (local) AND Vercel project settings (production)
VITE_SUPABASE_URL=https://nqrhomvpltkirblbylui.supabase.co    ✅ done
VITE_SUPABASE_ANON_KEY=sb_publishable_...                      ✅ done
SUPABASE_URL=https://nqrhomvpltkirblbylui.supabase.co         ✅ done
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...                        ✅ done
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...                        ❌ needed
STRIPE_SECRET_KEY=sk_test_...                                  ❌ needed
STRIPE_WEBHOOK_SECRET=whsec_...                                ❌ needed
VITE_SITE_URL=https://your-vercel-url.vercel.app               ❌ update this
```

---

## Key File Locations
```
src/
  pages/        — Home, ProductDetail, Cart, Checkout, Success, Admin
  components/   — Navbar, Footer, UniformCard, GlowCard, FallingPattern,
                  CategoryTabs, CartDrawer, SaleBadge
  hooks/        — useCart.js, useProducts.js
  lib/          — supabaseClient.js, stripe.js
api/
  create-checkout-session.js
  stripe-webhook.js
.env.local      — all secrets (never committed to git)
vercel.json     — routing + function config
```

---

*Last updated: April 2026*
