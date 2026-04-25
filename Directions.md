

## 🎯 PROJECT OVERVIEW

Clone the core functionality of **shopwithcam.com** — a digital supplier directory marketplace that sells downloadable vendor/supplier lists as digital info products.

**Key mechanics:**
- Products are displayed as cards in a grid with sale pricing
- Customers pay via Stripe → receive a download link to a PDF/file
- Admin can add/edit products and view orders
- All products are digital (no physical shipping)

---

## ⚙️ TECH STACK — NON-NEGOTIABLE

| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| Styling | Tailwind CSS (utility-first, no custom CSS files) |
| Routing | React Router v6 |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| File Storage | Supabase Storage |
| Payments | Stripe Checkout + Stripe Webhooks |
| Deployment | Vercel (via GitHub CI/CD) |
| Serverless Functions | Vercel `/api` functions |
| Environment Variables | `.env.local` only — never hardcode keys |

> ❌ Do NOT use React Native — this is a web app  
> ❌ Do NOT use Next.js — use plain Vite + React  
> ❌ Do NOT use custom CSS files unless absolutely unavoidable

---

## 🎨 COLOR SCHEME

Replace all blue from the reference site with **electric green**:

```css
--color-primary: #00FF88;       /* Electric green — main accent */
--color-primary-dark: #00CC66;  /* Darker green — hover states */
--color-bg: #0a0a0a;            /* Near black — page background */
--color-card: #111111;          /* Card background */
--color-text: #FFFFFF;          /* Primary text */
--color-muted: #AAAAAA;         /* Secondary/muted text */
--color-sale-badge-bg: #0a0a0a; /* Sale badge background */
--color-sale-badge-border: #00FF88;
```

**Tailwind equivalents to use throughout:**
- `bg-[#0a0a0a]` — page background
- `bg-[#111111]` — cards
- `text-[#00FF88]` — green accent text
- `border-[#00FF88]` — green borders
- `hover:shadow-[0_0_20px_rgba(0,255,136,0.3)]` — glow on hover

---

## 📁 PROJECT STRUCTURE

Scaffold exactly this structure:

```
/
├── public/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── ProductCard.jsx
│   │   ├── ProductGrid.jsx
│   │   ├── BundleCard.jsx
│   │   ├── SaleBadge.jsx
│   │   ├── CartDrawer.jsx
│   │   └── Footer.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── ProductDetail.jsx
│   │   ├── Cart.jsx
│   │   ├── Checkout.jsx
│   │   ├── Success.jsx
│   │   └── Admin.jsx
│   ├── lib/
│   │   ├── supabaseClient.js
│   │   └── stripe.js
│   ├── hooks/
│   │   ├── useProducts.js
│   │   └── useCart.js
│   ├── App.jsx
│   └── main.jsx
├── api/
│   ├── create-checkout-session.js   ← Vercel serverless
│   └── stripe-webhook.js            ← Vercel serverless
├── .env.local                        ← All secrets here
├── vercel.json
├── tailwind.config.js
└── README.md
```

---

## 🗄️ SUPABASE SCHEMA

Run this SQL in the Supabase SQL editor:

```sql
-- ============================================================
-- PRODUCTS TABLE
-- ============================================================
CREATE TABLE products (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name             TEXT NOT NULL,
  slug             TEXT UNIQUE NOT NULL,
  description      TEXT,
  original_price   NUMERIC(10,2),
  sale_price       NUMERIC(10,2) NOT NULL,
  is_on_sale       BOOLEAN DEFAULT TRUE,
  category         TEXT,
  image_url        TEXT,
  file_url         TEXT,        -- Supabase Storage path (not public URL)
  is_bundle        BOOLEAN DEFAULT FALSE,
  bundle_items     TEXT[],      -- Array of product names in bundle
  stripe_price_id  TEXT,        -- Stripe Price ID (price_xxx)
  stripe_product_id TEXT,       -- Stripe Product ID (prod_xxx)
  active           BOOLEAN DEFAULT TRUE,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ORDERS TABLE
-- ============================================================
CREATE TABLE orders (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_email      TEXT NOT NULL,
  stripe_session_id   TEXT UNIQUE,
  stripe_payment_intent TEXT,
  products            JSONB,        -- Snapshot of purchased products
  total               NUMERIC(10,2),
  status              TEXT DEFAULT 'pending',   -- pending | paid | failed | refunded
  download_token      TEXT UNIQUE,  -- One-time download token
  download_expires_at TIMESTAMPTZ,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Public can read active products
CREATE POLICY "Public read products"
  ON products FOR SELECT
  USING (active = TRUE);

-- Only authenticated admins can write products
CREATE POLICY "Admin write products"
  ON products FOR ALL
  USING (auth.role() = 'authenticated');

-- Orders: insert allowed for anyone (checkout flow), read only own
CREATE POLICY "Insert orders"
  ON orders FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "Read own orders"
  ON orders FOR SELECT
  USING (customer_email = auth.email() OR auth.role() = 'authenticated');

-- ============================================================
-- STORAGE BUCKET
-- ============================================================
-- Create a private bucket called "products" in Supabase Storage dashboard
-- Files are served ONLY via signed URLs generated after successful payment
-- Never expose direct file paths publicly
```

---

## 💳 STRIPE INTEGRATION — FULL SETUP

### Environment Variables Required

```env
# .env.local
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_xxx      # Frontend (safe to expose)
STRIPE_SECRET_KEY=sk_live_xxx                # Backend ONLY — never in VITE_ prefix
STRIPE_WEBHOOK_SECRET=whsec_xxx             # From Stripe webhook dashboard
```

---

### `/api/create-checkout-session.js` — Vercel Serverless Function

```javascript
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY  // Service role for server-side writes
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { cartItems, customerEmail } = req.body;

    // Build line items from cart
    const lineItems = cartItems.map(item => ({
      price: item.stripe_price_id,
      quantity: 1,
    }));

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: customerEmail,
      line_items: lineItems,
      success_url: `${process.env.VITE_SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.VITE_SITE_URL}/cart`,
      metadata: {
        product_ids: cartItems.map(i => i.id).join(','),
      },
    });

    // Create pending order in Supabase
    await supabase.from('orders').insert({
      customer_email: customerEmail,
      stripe_session_id: session.id,
      products: cartItems,
      total: cartItems.reduce((sum, i) => sum + i.sale_price, 0),
      status: 'pending',
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Checkout error:', err);
    res.status(500).json({ error: err.message });
  }
}
```

---

### `/api/stripe-webhook.js` — Webhook Handler

```javascript
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { buffer } from 'micro';
import crypto from 'crypto';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const sig = req.headers['stripe-signature'];
  const rawBody = await buffer(req);

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // ✅ Payment succeeded — fulfill the order
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    // Generate a unique download token
    const downloadToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 72 * 60 * 60 * 1000); // 72 hours

    // Update order to paid + attach download token
    const { data: order } = await supabase
      .from('orders')
      .update({
        status: 'paid',
        download_token: downloadToken,
        download_expires_at: expiresAt.toISOString(),
        stripe_payment_intent: session.payment_intent,
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_session_id', session.id)
      .select()
      .single();

    if (order) {
      // Send download email (optional — add SendGrid/Resend here)
      console.log(`Order fulfilled: ${order.id}, token: ${downloadToken}`);
    }
  }

  // ❌ Payment failed
  if (event.type === 'checkout.session.expired') {
    const session = event.data.object;
    await supabase
      .from('orders')
      .update({ status: 'failed', updated_at: new Date().toISOString() })
      .eq('stripe_session_id', session.id);
  }

  res.status(200).json({ received: true });
}
```

---

### `/pages/Success.jsx` — Post-Payment Download Page

```jsx
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function Success() {
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState(null);
  const [downloadUrls, setDownloadUrls] = useState([]);
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (!sessionId) return;

    // Poll for order fulfillment (webhook may take a few seconds)
    const poll = setInterval(async () => {
      const { data } = await supabase
        .from('orders')
        .select('*')
        .eq('stripe_session_id', sessionId)
        .single();

      if (data?.status === 'paid') {
        setOrder(data);
        clearInterval(poll);

        // Generate signed download URLs for purchased products
        const urls = await Promise.all(
          data.products.map(async (product) => {
            const { data: signedUrl } = await supabase.storage
              .from('products')
              .createSignedUrl(product.file_url, 60 * 60 * 72); // 72hr expiry
            return { name: product.name, url: signedUrl?.signedUrl };
          })
        );
        setDownloadUrls(urls.filter(u => u.url));
      }
    }, 2000);

    return () => clearInterval(poll);
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-8">
      <div className="max-w-lg w-full text-center">
        {!order ? (
          <div className="text-[#00FF88] text-xl animate-pulse">
            Processing your order...
          </div>
        ) : (
          <div className="space-y-6">
            <h1 className="text-4xl font-black text-[#00FF88]">
              ✅ Payment Confirmed!
            </h1>
            <p className="text-white text-lg">
              Your supplier lists are ready to download.
            </p>
            <div className="space-y-3">
              {downloadUrls.map((item, i) => (
                <a
                  key={i}
                  href={item.url}
                  download
                  className="block w-full py-3 px-6 bg-[#00FF88] text-black font-bold rounded-lg hover:bg-[#00CC66] transition-colors"
                >
                  ⬇️ Download {item.name}
                </a>
              ))}
            </div>
            <p className="text-[#AAAAAA] text-sm">
              Download links expire in 72 hours. Save your files now.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
```

---

### `/lib/stripe.js` — Frontend Stripe Helper

```javascript
import { loadStripe } from '@stripe/stripe-js';

let stripePromise;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

export async function redirectToCheckout(cartItems, customerEmail) {
  const res = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cartItems, customerEmail }),
  });

  const { url, error } = await res.json();
  if (error) throw new Error(error);
  window.location.href = url;
}
```

---

## 🔑 FULL `.env.local` TEMPLATE

```env
# ── SUPABASE ──────────────────────────────────────
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Service role key (server-side only — NEVER prefix with VITE_)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ── STRIPE ────────────────────────────────────────
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# ── SITE ──────────────────────────────────────────
VITE_SITE_URL=https://yoursite.vercel.app
```

> ⚠️ **VITE_ prefix** = exposed to frontend browser code  
> ⚠️ **No VITE_ prefix** = server-side only (Vercel functions)  
> ❌ Never put `STRIPE_SECRET_KEY` or `SUPABASE_SERVICE_ROLE_KEY` in a VITE_ variable

---

## 🛍️ PRODUCT GRID & CARD COMPONENTS

### ProductCard.jsx behavior:
- Dark card `bg-[#111111]` with rounded corners
- Green border on hover + glow shadow
- Sale badge top-left (pill shape, green border, green text)
- Product image centered (icon/illustration style)
- Product name: **bold, italic, green** (matching site's blue italic style)
- Original price: gray, line-through
- Sale price: white, bold, large
- On hover: overlay with "Add to Cart" button

### BundleCard.jsx — different from regular card:
- Slightly larger card
- Shows list of included products with checkmarks
- Different background shade to stand out
- "BUNDLE — BEST VALUE" badge

### ProductGrid.jsx layout:
```
Mobile:  2 columns
Tablet:  3 columns
Desktop: 4 columns
```

---

## 🛒 CART SYSTEM

- Persist cart via `localStorage`
- `useCart` hook: `{ items, addItem, removeItem, clearCart, total }`
- Navbar shows cart icon with item count badge (green)
- Cart drawer slides in from right (or full `/cart` page)
- Checkout button → calls `/api/create-checkout-session` → redirects to Stripe

---

## 🌱 SEED DATA — POPULATE THESE PRODUCTS

```javascript
const seedProducts = [
  {
    name: "All Vendor Bundle (100+ Suppliers)",
    slug: "all-vendor-bundle",
    description: "The ultimate supplier bundle. Includes shirt, cologne, moissanite watch, moissanite jewelry, hoodie, and Prada suppliers — over 100 vendors total.",
    original_price: 69.99,
    sale_price: 29.99,
    is_bundle: true,
    bundle_items: ["Shirt Supplier", "Cologne Supplier", "Moissanite Watch Supplier", "Moissanite Jewelry Supplier", "Hoodie Supplier", "Prada Supplier"],
    category: "bundle"
  },
  { name: "Cologne Vendor", slug: "cologne-vendor", original_price: 19.99, sale_price: 9.99, category: "fragrance" },
  { name: "Cologne Supplier Bundle", slug: "cologne-supplier-bundle", original_price: 19.99, sale_price: 9.99, is_bundle: true, category: "fragrance" },
  { name: "Pods Max Vendor", slug: "pods-max-vendor", original_price: 19.99, sale_price: 9.99, category: "electronics" },
  { name: "Pods Vendor", slug: "pods-vendor", original_price: 22.99, sale_price: 9.99, category: "electronics" },
  { name: "Labubu Vendor", slug: "labubu-vendor", original_price: 22.99, sale_price: 9.99, category: "toys" },
  { name: "Watch Vendor", slug: "watch-vendor", original_price: 17.99, sale_price: 9.99, category: "watches" },
  { name: "All Bag Vendor", slug: "all-bag-vendor", original_price: 29.99, sale_price: 9.99, category: "bags" },
  { name: "Dyson Vendor", slug: "dyson-vendor", original_price: null, sale_price: 9.99, category: "electronics" },
  { name: "Glasses Vendor", slug: "glasses-vendor", original_price: 19.99, sale_price: 9.99, category: "accessories" },
  { name: "Golf Club Vendor", slug: "golf-club-vendor", original_price: 19.99, sale_price: 9.99, category: "sports" },
  { name: "Hoodie Supplier", slug: "hoodie-supplier", original_price: 19.99, sale_price: 9.99, category: "clothing" },
  { name: "Moissanite Watch Vendor", slug: "moissanite-watch-vendor", original_price: 23.99, sale_price: 9.99, category: "watches" }
];
```

---

## 🔐 ADMIN PANEL (`/admin`)

Protected via Supabase Auth (email/password login):

**Features:**
- Login form (Supabase Auth)
- Product list table with Edit / Delete buttons
- Add Product form: name, slug, description, prices, category, bundle toggle, bundle items
- Upload product image → Supabase Storage bucket `product-images`
- Upload product file (PDF) → Supabase Storage bucket `products` (private)
- Orders table: customer email, products, total, status, date
- Generate new signed download URL for any order (manual resend)

---

## 🚀 VERCEL CONFIG

### `vercel.json`
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "functions": {
    "api/create-checkout-session.js": {
      "memory": 256,
      "maxDuration": 10
    },
    "api/stripe-webhook.js": {
      "memory": 256,
      "maxDuration": 10
    }
  }
}
```

---

## 📋 DEPLOYMENT CHECKLIST

### Step 1 — Supabase Setup
- [ ] Create project at supabase.com
- [ ] Run SQL schema in SQL editor
- [ ] Create Storage bucket `products` (private)
- [ ] Create Storage bucket `product-images` (public)
- [ ] Copy project URL and anon key

### Step 2 — Stripe Setup
- [ ] Create products in Stripe dashboard matching seed data
- [ ] Copy each `price_xxx` ID and update `stripe_price_id` in seed data
- [ ] Register webhook endpoint: `https://yoursite.vercel.app/api/stripe-webhook`
- [ ] Select event: `checkout.session.completed` and `checkout.session.expired`
- [ ] Copy webhook signing secret (`whsec_xxx`)

### Step 3 — GitHub + Vercel
- [ ] Push repo to GitHub
- [ ] Connect repo to Vercel at vercel.com/new
- [ ] Add ALL env vars from `.env.local` to Vercel project settings
- [ ] Deploy — Vercel auto-deploys on every push to `main`

### Step 4 — Test
- [ ] Make a test purchase with Stripe test card `4242 4242 4242 4242`
- [ ] Verify order appears in Supabase `orders` table with status `paid`
- [ ] Verify signed download URL works on success page
- [ ] Switch Stripe keys from `test` to `live` when ready

---

## 🏗️ BUILD ORDER — DO THIS IN SEQUENCE

```
1.  npx create-vite@latest . --template react
2.  npm install tailwindcss @tailwindcss/vite react-router-dom @supabase/supabase-js @stripe/stripe-js stripe micro
3.  Setup Tailwind in vite.config.js and index.css
4.  Create .env.local with placeholder keys
5.  Build /lib/supabaseClient.js
6.  Build Navbar + Footer layout shells
7.  Build ProductCard and SaleBadge components
8.  Build ProductGrid with mock/seed data
9.  Build Home page (full grid)
10. Build ProductDetail page
11. Build useCart hook + localStorage persistence
12. Build CartDrawer component
13. Build /api/create-checkout-session.js
14. Build /lib/stripe.js redirectToCheckout helper
15. Build Cart page + Checkout flow
16. Build /api/stripe-webhook.js
17. Build Success page with polling + signed URL download
18. Build Admin panel with Supabase Auth
19. Configure vercel.json
20. Write README.md with deployment steps
21. Deploy to Vercel
```

---

## ⚡ START COMMAND

When referencing this file in Claude Code, start with:

```

```

---

*Last updated: April 2026 | Stack: React + Vite + Tailwind + Supabase + Stripe + Vercel*
