import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProduct } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { CATEGORY_IMAGES, getCategoryImage } from '../lib/categoryImages';
import { getProductImages } from '../lib/productImages';
import ProductGallery from '../components/ProductGallery';

const CONTAINER = {
  maxWidth: '1180px',
  margin: '0 auto',
  paddingLeft: 'clamp(1rem, 4vw, 3rem)',
  paddingRight: 'clamp(1rem, 4vw, 3rem)',
};

const TESTIMONIALS = [
  {
    name: 'Marcus T.',
    location: 'Atlanta, GA',
    rating: 5,
    text: 'Got my first cologne shipment in 9 days. Vendor was super professional and the discount code took 30% off my whole order. Already on my second order.',
  },
  {
    name: 'Jasmine K.',
    location: 'Brooklyn, NY',
    rating: 5,
    text: "I've spent hundreds on 'private supplier lists' that turned out to be public AliExpress links. The Plug is the real deal — direct factory contact, not a middleman.",
  },
  {
    name: 'David R.',
    location: 'Houston, TX',
    rating: 5,
    text: "Email hit my inbox 2 minutes after checkout. Vendor responded on WhatsApp the same day. Didn't expect this kind of service for under ten bucks.",
  },
];

const DELIVERABLES = [
  {
    label: 'Vendor Contact',
    title: 'Direct Vendor Info',
    body:
      "You'll receive the verified vendor's name, WhatsApp/phone number, and email — straight line, no middleman.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.37 1.9.72 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0122 16.92z" />
      </svg>
    ),
  },
  {
    label: 'Discount Code',
    title: 'Exclusive Promo Code',
    body:
      "A buyer-only code unlocks insider pricing on the vendor's catalog — typically 20–40% off retail.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
        <line x1="7" y1="7" x2="7.01" y2="7" />
      </svg>
    ),
  },
  {
    label: 'Shipping',
    title: 'Shipping & Timing',
    body:
      'Typical delivery 7–14 days to the U.S. via DHL/FedEx — full shipping methods, costs, and tracking process included.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" />
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
  },
  {
    label: 'Reorder Anytime',
    title: 'Lifetime Access',
    body:
      'Pay once. Reorder from the same vendor as many times as you want — no recurring fees, no per-order markup.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 4 23 10 17 10" />
        <polyline points="1 20 1 14 7 14" />
        <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
      </svg>
    ),
  },
];

const STEPS = [
  { n: '01', title: 'Checkout', body: 'Pay $9.99 once. No subscription, no upsells.' },
  { n: '02', title: 'Instant Email', body: 'Vendor PDF lands in your inbox within 2 minutes.' },
  { n: '03', title: 'Contact Vendor', body: 'Message on WhatsApp using the included script.' },
  { n: '04', title: 'Receive Goods', body: 'Order ships in 7–14 days with tracking.' },
];

function StarRow({ n }) {
  return (
    <div style={{ display: 'flex', gap: 2, color: 'var(--primary)' }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" width={14} height={14} fill={i < n ? 'currentColor' : 'transparent'} stroke="currentColor" strokeWidth={1.6}>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

export default function ProductDetail() {
  const { slug } = useParams();
  const { product, loading } = useProduct(slug);
  const { addItem, items } = useCart();
  const navigate = useNavigate();
  const [added, setAdded] = useState(false);

  const inCart = product ? items.some((i) => i.id === product.id) : false;

  function handleAdd() {
    addItem(product);
    setAdded(true);
  }

  function handleBuyNow() {
    if (!inCart) addItem(product);
    navigate('/cart');
  }

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--primary)', fontSize: '1.15rem' }} className="animate-pulse">
          Loading…
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
        <p style={{ color: 'var(--foreground)', fontSize: '1.25rem' }}>Product not found.</p>
        <Link to="/" style={{ color: 'var(--primary)' }}>
          ← Back to shop
        </Link>
      </div>
    );
  }

  const seed = product.id ? Number(product.id) || product.id.length : 0;
  const heroImg = product.image_url || getCategoryImage(product.category, seed);
  const galleryImages =
    CATEGORY_IMAGES[product.category]?.slice(0, 4) ||
    [getCategoryImage(product.category, seed)];

  const savings = product.original_price
    ? Math.round(((product.original_price - product.sale_price) / product.original_price) * 100)
    : null;

  return (
    <div style={{ width: '100%', color: 'var(--foreground)' }}>
      {/* Back link */}
      <div style={{ ...CONTAINER, paddingTop: '1.5rem' }}>
        <Link
          to="/"
          style={{
            color: 'var(--muted-foreground)',
            fontSize: '0.85rem',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
        >
          ← Back to shop
        </Link>
      </div>

      {/* ── HERO: Image + Buy Box ── */}
      <section style={{ ...CONTAINER, paddingTop: '1.5rem', paddingBottom: 'clamp(2rem, 5vw, 4rem)' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image gallery */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              style={{
                position: 'relative',
                borderRadius: '1rem',
                overflow: 'hidden',
                background: 'var(--card)',
                border: '1px solid var(--border)',
                aspectRatio: '4 / 5',
              }}
            >
              <img
                src={heroImg}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              {product.is_on_sale && savings && (
                <div
                  style={{
                    position: 'absolute',
                    top: 16,
                    left: 16,
                    background: 'var(--primary)',
                    color: 'var(--primary-foreground)',
                    fontFamily: 'Anton, sans-serif',
                    fontSize: '0.85rem',
                    letterSpacing: '0.1em',
                    padding: '6px 12px',
                    borderRadius: 6,
                  }}
                >
                  SAVE {savings}%
                </div>
              )}
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
              {galleryImages.map((src, i) => (
                <div
                  key={i}
                  style={{
                    aspectRatio: '1 / 1',
                    borderRadius: '0.5rem',
                    overflow: 'hidden',
                    background: 'var(--card)',
                    border: '1px solid var(--border)',
                  }}
                >
                  <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          </div>

          {/* Buy box */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  color: 'var(--primary)',
                }}
              >
                {product.category || 'vendor'} · Verified
              </span>
              {product.is_bundle && (
                <span
                  style={{
                    fontSize: '0.6rem',
                    fontWeight: 800,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    padding: '3px 8px',
                    border: '1px solid var(--primary)',
                    color: 'var(--primary)',
                    borderRadius: 4,
                  }}
                >
                  BUNDLE
                </span>
              )}
            </div>

            <h1
              className="font-['Anton']"
              style={{ fontSize: 'clamp(2rem, 4.5vw, 3rem)', lineHeight: 1.05, letterSpacing: '0.02em', margin: 0 }}
            >
              {product.name.toUpperCase()}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <StarRow n={5} />
              <span style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>
                4.9/5 · {(120 + seed % 80) + 50} happy buyers
              </span>
            </div>

            {product.description && (
              <p style={{ color: 'var(--muted-foreground)', lineHeight: 1.6 }}>{product.description}</p>
            )}

            {product.bundle_items && product.bundle_items.length > 0 && (
              <div
                style={{
                  border: '1px solid var(--border)',
                  borderRadius: '0.75rem',
                  padding: '1rem',
                  background: 'var(--card)',
                }}
              >
                <p style={{ fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.85rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  Included in this bundle
                </p>
                <ul style={{ display: 'grid', gap: '0.4rem', listStyle: 'none', padding: 0, margin: 0 }}>
                  {product.bundle_items.map((item, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--muted-foreground)' }}>
                      <svg viewBox="0 0 20 20" fill="var(--primary)" width={16} height={16}>
                        <path fillRule="evenodd" d="M16.7 5.3a1 1 0 010 1.4l-7 7a1 1 0 01-1.4 0l-4-4a1 1 0 111.4-1.4L9 11.6l6.3-6.3a1 1 0 011.4 0z" clipRule="evenodd" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Price */}
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '0.75rem',
                paddingTop: '0.5rem',
                borderTop: '1px solid var(--border)',
              }}
            >
              {product.original_price && (
                <span style={{ color: 'var(--muted-foreground)', textDecoration: 'line-through', fontSize: '1.1rem' }}>
                  ${Number(product.original_price).toFixed(2)}
                </span>
              )}
              <span className="font-['Anton']" style={{ fontSize: '2.5rem', letterSpacing: '0.02em' }}>
                ${Number(product.sale_price).toFixed(2)}
              </span>
              {savings && (
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)' }}>
                  YOU SAVE ${(product.original_price - product.sale_price).toFixed(2)}
                </span>
              )}
            </div>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                onClick={handleBuyNow}
                style={{
                  flex: '1 1 240px',
                  padding: '1rem 1.5rem',
                  background: 'var(--primary)',
                  color: 'var(--primary-foreground)',
                  border: 'none',
                  borderRadius: '0.6rem',
                  cursor: 'pointer',
                  fontFamily: 'Anton, sans-serif',
                  fontSize: '1rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  boxShadow: '0 8px 32px rgba(52,211,153,0.25)',
                }}
              >
                Get The List · ${Number(product.sale_price).toFixed(2)}
              </button>
              <button
                onClick={handleAdd}
                disabled={inCart || added}
                style={{
                  flex: '0 1 auto',
                  padding: '1rem 1.25rem',
                  background: 'transparent',
                  color: inCart || added ? 'var(--muted-foreground)' : 'var(--foreground)',
                  border: '1px solid var(--border)',
                  borderRadius: '0.6rem',
                  cursor: inCart || added ? 'default' : 'pointer',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                {inCart || added ? '✓ In Cart' : '+ Add to Cart'}
              </button>
            </div>

            {/* Trust strip */}
            <div
              style={{
                display: 'flex',
                gap: '1rem',
                flexWrap: 'wrap',
                fontSize: '0.72rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--muted-foreground)',
                paddingTop: '0.25rem',
              }}
            >
              <span>⚡ Instant email delivery</span>
              <span>🔒 Secure checkout</span>
              <span>♻ Lifetime access</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRODUCT GALLERY (vendor-specific photos) ── */}
      <ProductGallery
        images={getProductImages(product, 9)}
        eyebrow="Product Showcase"
        title={`9 PIECES FROM THIS ${(product.category || 'VENDOR').toUpperCase()}`}
        subtitle="A peek at what this vendor is shipping right now. Reorder anything, anytime, with your discount code."
      />

      {/* ── WHAT YOU GET ── */}
      <section
        style={{
          ...CONTAINER,
          paddingTop: 'clamp(2.5rem, 5vw, 4rem)',
          paddingBottom: 'clamp(2.5rem, 5vw, 4rem)',
          borderTop: '1px solid var(--border)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <p style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--primary)' }}>
            Inside Your Email
          </p>
          <h2 className="font-['Anton']" style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', letterSpacing: '0.02em', margin: '0.5rem 0 0' }}>
            EVERYTHING YOU NEED TO ORDER
          </h2>
          <p style={{ color: 'var(--muted-foreground)', maxWidth: '36rem', margin: '1rem auto 0', lineHeight: 1.6 }}>
            No fluff PDFs, no Shopify dropshippers. Just the contact info, code, and process to start ordering directly from a verified vendor.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {DELIVERABLES.map((d) => (
            <motion.div
              key={d.label}
              whileHover={{ y: -3 }}
              style={{
                padding: '1.25rem',
                borderRadius: '0.85rem',
                background: 'var(--card)',
                border: '1px solid var(--border)',
                transition: 'border-color 0.2s, box-shadow 0.2s',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.6rem',
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: 'rgba(52,211,153,0.12)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div style={{ width: 22, height: 22 }}>{d.icon}</div>
              </div>
              <p style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--primary)', margin: 0 }}>
                {d.label}
              </p>
              <h3 className="font-['Anton']" style={{ fontSize: '1.1rem', letterSpacing: '0.04em', margin: 0 }}>
                {d.title.toUpperCase()}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)', lineHeight: 1.55, margin: 0 }}>{d.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section
        style={{
          ...CONTAINER,
          paddingTop: 'clamp(2rem, 4vw, 3.5rem)',
          paddingBottom: 'clamp(2rem, 4vw, 3.5rem)',
          borderTop: '1px solid var(--border)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <p style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--primary)' }}>
            How It Works
          </p>
          <h2 className="font-['Anton']" style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', letterSpacing: '0.02em', margin: '0.5rem 0 0' }}>
            FROM CHECKOUT TO DOORSTEP IN 4 STEPS
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STEPS.map((s, i) => (
            <div
              key={s.n}
              style={{
                position: 'relative',
                padding: '1.25rem',
                borderRadius: '0.85rem',
                border: '1px solid var(--border)',
                background: 'var(--card)',
              }}
            >
              <span
                className="font-['Anton']"
                style={{
                  fontSize: '2.25rem',
                  letterSpacing: '0.04em',
                  color: 'var(--primary)',
                  display: 'block',
                  lineHeight: 1,
                  marginBottom: '0.5rem',
                }}
              >
                {s.n}
              </span>
              <h3 className="font-['Anton']" style={{ fontSize: '1rem', letterSpacing: '0.06em', margin: 0 }}>
                {s.title.toUpperCase()}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)', lineHeight: 1.55, margin: '0.4rem 0 0' }}>
                {s.body}
              </p>
              {i < STEPS.length - 1 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '50%',
                    right: -12,
                    transform: 'translateY(-50%)',
                    color: 'var(--primary)',
                    opacity: 0.4,
                  }}
                  className="hidden lg:block"
                >
                  →
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section
        style={{
          ...CONTAINER,
          paddingTop: 'clamp(2rem, 4vw, 3.5rem)',
          paddingBottom: 'clamp(2rem, 4vw, 3.5rem)',
          borderTop: '1px solid var(--border)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <p style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--primary)' }}>
            Real Buyers, Real Reviews
          </p>
          <h2 className="font-['Anton']" style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', letterSpacing: '0.02em', margin: '0.5rem 0 0' }}>
            WHAT OUR BUYERS ARE SAYING
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              style={{
                padding: '1.5rem',
                borderRadius: '0.85rem',
                background: 'var(--card)',
                border: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              <StarRow n={t.rating} />
              <p style={{ color: 'var(--foreground)', fontSize: '0.95rem', lineHeight: 1.55, margin: 0 }}>
                "{t.text}"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: 'auto', paddingTop: '0.5rem', borderTop: '1px solid var(--border)' }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: 'var(--primary)',
                    color: 'var(--primary-foreground)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'Anton, sans-serif',
                    fontSize: '0.95rem',
                  }}
                >
                  {t.name[0]}
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: '0.85rem', margin: 0 }}>{t.name}</p>
                  <p style={{ fontSize: '0.7rem', color: 'var(--muted-foreground)', margin: 0 }}>{t.location} · Verified buyer</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section
        style={{
          ...CONTAINER,
          paddingTop: 'clamp(2rem, 4vw, 3.5rem)',
          paddingBottom: 'clamp(3rem, 6vw, 5rem)',
        }}
      >
        <div
          style={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '1rem',
            border: '1px solid var(--primary)',
            padding: 'clamp(2rem, 5vw, 3.5rem)',
            background:
              'radial-gradient(circle at 20% 0%, rgba(52,211,153,0.18), transparent 60%), radial-gradient(circle at 80% 100%, rgba(52,211,153,0.10), transparent 50%), var(--card)',
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--primary)' }}>
            Limited Time
          </p>
          <h2 className="font-['Anton']" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', letterSpacing: '0.02em', margin: '0.5rem 0 0', maxWidth: '32rem', marginLeft: 'auto', marginRight: 'auto' }}>
            START SOURCING FROM A VERIFIED VENDOR TODAY
          </h2>
          <p style={{ color: 'var(--muted-foreground)', maxWidth: '32rem', margin: '0.85rem auto 0', lineHeight: 1.6 }}>
            One-time payment of ${Number(product.sale_price).toFixed(2)}. Vendor info delivered instantly. Lifetime access — reorder anytime, no extra fees.
          </p>
          <button
            onClick={handleBuyNow}
            style={{
              marginTop: '1.5rem',
              padding: '1.1rem 2.5rem',
              background: 'var(--primary)',
              color: 'var(--primary-foreground)',
              border: 'none',
              borderRadius: '999px',
              cursor: 'pointer',
              fontFamily: 'Anton, sans-serif',
              fontSize: '1rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              boxShadow: '0 12px 36px rgba(52,211,153,0.35)',
            }}
          >
            Get The List Now
          </button>
          <p style={{ fontSize: '0.7rem', color: 'var(--muted-foreground)', marginTop: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Instant delivery · Secure checkout
          </p>
        </div>
      </section>

      {/* Toast for "added to cart" */}
      {added && !inCart && (
        <div
          style={{
            position: 'fixed',
            bottom: '2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 50,
            padding: '0.875rem 1.5rem',
            borderRadius: '0.75rem',
            background: 'var(--card)',
            border: '1px solid var(--primary)',
            color: 'var(--foreground)',
            boxShadow: '0 0 32px rgba(52,211,153,0.25)',
            fontWeight: 700,
            fontSize: '0.875rem',
          }}
        >
          ✓ Added to cart
        </div>
      )}
    </div>
  );
}
