import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../hooks/useCart';
import { getCategoryImage } from '../lib/categoryImages';

const CONTAINER = {
  maxWidth: '780px',
  margin: '0 auto',
  paddingLeft: 'clamp(1rem, 4vw, 3rem)',
  paddingRight: 'clamp(1rem, 4vw, 3rem)',
};

function imgFor(item) {
  if (item.image_url) return item.image_url;
  const seed =
    typeof item.id === 'string'
      ? item.id.split('').reduce((h, c) => ((h << 5) - h + c.charCodeAt(0)) | 0, 0)
      : Number(item.id) || 0;
  return getCategoryImage(item.category, Math.abs(seed));
}

export default function Cart() {
  const { items, removeItem, clearCart, total } = useCart();

  const originalTotal = items.reduce(
    (sum, i) => sum + Number(i.original_price || i.sale_price),
    0
  );
  const savings = originalTotal - total;

  if (items.length === 0) {
    return (
      <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            maxWidth: 460,
            width: '100%',
            textAlign: 'center',
            padding: 'clamp(2rem, 5vw, 3rem)',
            borderRadius: '1rem',
            background: 'var(--card)',
            border: '1px solid var(--border)',
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: 'rgba(52,211,153,0.10)',
              color: 'var(--primary)',
              margin: '0 auto 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg viewBox="0 0 24 24" width={32} height={32} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
              <path d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
            </svg>
          </div>
          <h1 className="font-['Anton']" style={{ fontSize: '1.75rem', letterSpacing: '0.04em', margin: 0, color: 'var(--foreground)' }}>
            YOUR CART IS EMPTY
          </h1>
          <p style={{ color: 'var(--muted-foreground)', marginTop: '0.6rem', fontSize: '0.95rem' }}>
            Browse the vendor list to find a supplier and start sourcing today.
          </p>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginTop: '1.5rem',
              padding: '0.85rem 1.75rem',
              background: 'var(--primary)',
              color: 'var(--primary-foreground)',
              borderRadius: '999px',
              textDecoration: 'none',
              fontFamily: 'Anton, sans-serif',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              fontSize: '0.9rem',
              boxShadow: '0 8px 28px rgba(52,211,153,0.25)',
            }}
          >
            Browse Vendors →
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '70vh', paddingTop: 'clamp(2rem, 4vw, 3rem)', paddingBottom: 'clamp(3rem, 6vw, 5rem)' }}>
      <div style={CONTAINER}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <p style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--primary)', margin: 0 }}>
            Step 1 of 2 · Review
          </p>
          <h1 className="font-['Anton']" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', letterSpacing: '0.03em', margin: '0.5rem 0 0', color: 'var(--foreground)' }}>
            YOUR CART
          </h1>
          <p style={{ color: 'var(--muted-foreground)', marginTop: '0.4rem', fontSize: '0.9rem' }}>
            {items.length} {items.length === 1 ? 'list' : 'lists'} ready to check out
          </p>
        </div>

        {/* Items */}
        <div
          style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: '1rem',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted-foreground)' }}>
              Items
            </span>
            <button
              onClick={clearCart}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--muted-foreground)',
                fontSize: '0.7rem',
                fontWeight: 700,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                cursor: 'pointer',
              }}
            >
              Clear all
            </button>
          </div>

          <AnimatePresence initial={false}>
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem 1.25rem',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: '0.6rem',
                      overflow: 'hidden',
                      flexShrink: 0,
                      background: 'var(--card-image-bg)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    <img
                      src={imgFor(item)}
                      alt={item.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--primary)', margin: 0 }}>
                      {item.category || 'vendor'}
                    </p>
                    <p
                      className="font-['Anton']"
                      style={{ fontSize: '1rem', letterSpacing: '0.03em', color: 'var(--foreground)', margin: '0.15rem 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                    >
                      {item.name.toUpperCase()}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginTop: '0.25rem' }}>
                      {item.original_price && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', textDecoration: 'line-through' }}>
                          ${Number(item.original_price).toFixed(2)}
                        </span>
                      )}
                      <span style={{ fontWeight: 700, color: 'var(--foreground)' }}>
                        ${Number(item.sale_price).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    aria-label="Remove item"
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '0.5rem',
                      background: 'transparent',
                      border: '1px solid var(--border)',
                      color: 'var(--muted-foreground)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'background 0.15s, color 0.15s, border-color 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'var(--destructive)';
                      e.currentTarget.style.borderColor = 'var(--destructive)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'var(--muted-foreground)';
                      e.currentTarget.style.borderColor = 'var(--border)';
                    }}
                  >
                    <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Summary inside the same card */}
          <div style={{ padding: '1.25rem' }}>
            {savings > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--muted-foreground)', marginBottom: '0.4rem' }}>
                <span>Subtotal</span>
                <span style={{ textDecoration: 'line-through' }}>${originalTotal.toFixed(2)}</span>
              </div>
            )}
            {savings > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--primary)', marginBottom: '0.4rem' }}>
                <span>You save</span>
                <span>−${savings.toFixed(2)}</span>
              </div>
            )}
            <div
              className="font-['Anton']"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                fontSize: '1.5rem',
                letterSpacing: '0.02em',
                paddingTop: '0.85rem',
                borderTop: '1px solid var(--border)',
              }}
            >
              <span>TOTAL</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <Link
              to="/checkout"
              style={{
                marginTop: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                width: '100%',
                padding: '1rem 1.5rem',
                background: 'var(--primary)',
                color: 'var(--primary-foreground)',
                borderRadius: '0.75rem',
                textDecoration: 'none',
                fontFamily: 'Anton, sans-serif',
                fontSize: '1rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                boxShadow: '0 8px 32px rgba(52,211,153,0.25)',
              }}
            >
              Continue to Checkout · ${total.toFixed(2)}
              <span aria-hidden>→</span>
            </Link>

            <Link
              to="/"
              style={{
                display: 'block',
                textAlign: 'center',
                marginTop: '0.85rem',
                color: 'var(--muted-foreground)',
                fontSize: '0.8rem',
                textDecoration: 'none',
              }}
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>

        {/* Trust strip */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 'clamp(1rem, 3vw, 2rem)',
            flexWrap: 'wrap',
            marginTop: '1.5rem',
            fontSize: '0.7rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--muted-foreground)',
          }}
        >
          <span>⚡ Instant email delivery</span>
          <span>🔒 Secure Stripe checkout</span>
          <span>♻ Lifetime access</span>
        </div>
      </div>
    </div>
  );
}
