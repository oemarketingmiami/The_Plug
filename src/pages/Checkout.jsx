import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../hooks/useCart';
import { redirectToCheckout } from '../lib/stripe';
import { getCategoryImage } from '../lib/categoryImages';
import Testimonials from '../components/Testimonials';

const CONTAINER = {
  maxWidth: '1080px',
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

export default function Checkout() {
  const { items, total } = useCart();
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const originalTotal = items.reduce(
    (sum, i) => sum + Number(i.original_price || i.sale_price),
    0
  );
  const savings = originalTotal - total;

  async function handleCheckout(e) {
    e.preventDefault();
    if (!email || items.length === 0) return;
    if (email !== confirmEmail) {
      setError("Emails don't match. Please double-check before continuing.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await redirectToCheckout(items, email);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem' }}>
        <div
          style={{
            maxWidth: 460,
            width: '100%',
            textAlign: 'center',
            padding: '2.5rem',
            borderRadius: '1rem',
            background: 'var(--card)',
            border: '1px solid var(--border)',
          }}
        >
          <h1 className="font-['Anton']" style={{ fontSize: '1.5rem', letterSpacing: '0.04em', margin: 0 }}>
            CART IS EMPTY
          </h1>
          <p style={{ color: 'var(--muted-foreground)', marginTop: '0.6rem' }}>
            Add a vendor list before checking out.
          </p>
          <Link
            to="/"
            style={{
              display: 'inline-block',
              marginTop: '1.25rem',
              padding: '0.7rem 1.5rem',
              background: 'var(--primary)',
              color: 'var(--primary-foreground)',
              borderRadius: '999px',
              textDecoration: 'none',
              fontFamily: 'Anton, sans-serif',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              fontSize: '0.85rem',
            }}
          >
            Browse Vendors
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '70vh', paddingTop: 'clamp(2rem, 4vw, 3rem)', paddingBottom: 'clamp(3rem, 6vw, 5rem)' }}>
      <div style={CONTAINER}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <p style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--primary)', margin: 0 }}>
            Step 2 of 2 · Secure Checkout
          </p>
          <h1 className="font-['Anton']" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', letterSpacing: '0.03em', margin: '0.5rem 0 0' }}>
            CHECKOUT
          </h1>
          <p style={{ color: 'var(--muted-foreground)', marginTop: '0.4rem', fontSize: '0.9rem' }}>
            Your vendor list is delivered the moment payment clears.
          </p>
        </div>

        {/* Two-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_400px] gap-6">
          {/* Left: email form */}
          <motion.form
            onSubmit={handleCheckout}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: '1rem',
              padding: 'clamp(1.25rem, 3vw, 2rem)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              order: 2,
            }}
            className="md:order-1"
          >
            <div>
              <p style={{ fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--primary)', margin: 0 }}>
                Delivery
              </p>
              <h2 className="font-['Anton']" style={{ fontSize: '1.4rem', letterSpacing: '0.04em', margin: '0.25rem 0 0' }}>
                WHERE DO WE SEND IT?
              </h2>
              <p style={{ color: 'var(--muted-foreground)', fontSize: '0.85rem', marginTop: '0.4rem' }}>
                Your vendor's name, contact, discount code, and shipping process will be emailed here within 2 minutes.
              </p>
            </div>

            <label style={{ display: 'block' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted-foreground)' }}>
                Email address
              </span>
              <div style={{ position: 'relative', marginTop: '0.4rem' }}>
                <span
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: 14,
                    transform: 'translateY(-50%)',
                    color: 'var(--muted-foreground)',
                    pointerEvents: 'none',
                  }}
                >
                  <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  style={{
                    width: '100%',
                    padding: '0.95rem 1rem 0.95rem 2.5rem',
                    background: 'var(--input)',
                    border: '1px solid var(--border)',
                    borderRadius: '0.6rem',
                    color: 'var(--foreground)',
                    fontSize: '0.95rem',
                    outline: 'none',
                    transition: 'border-color 0.15s, box-shadow 0.15s',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'var(--primary)';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(52,211,153,0.18)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>
            </label>

            <label style={{ display: 'block' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted-foreground)' }}>
                Confirm email
              </span>
              <input
                type="email"
                required
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
                placeholder="Re-enter your email"
                autoComplete="email"
                style={{
                  width: '100%',
                  marginTop: '0.4rem',
                  padding: '0.95rem 1rem',
                  background: 'var(--input)',
                  border: '1px solid var(--border)',
                  borderRadius: '0.6rem',
                  color: 'var(--foreground)',
                  fontSize: '0.95rem',
                  outline: 'none',
                  transition: 'border-color 0.15s, box-shadow 0.15s',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(52,211,153,0.18)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </label>

            {error && (
              <div
                style={{
                  background: 'rgba(239,68,68,0.08)',
                  border: '1px solid rgba(239,68,68,0.4)',
                  color: '#fca5a5',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.85rem',
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: '0.5rem',
                width: '100%',
                padding: '1.1rem 1.5rem',
                background: 'var(--primary)',
                color: 'var(--primary-foreground)',
                border: 'none',
                borderRadius: '0.75rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'Anton, sans-serif',
                fontSize: '1rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                boxShadow: '0 8px 32px rgba(52,211,153,0.25)',
                opacity: loading ? 0.7 : 1,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
              }}
            >
              {loading ? (
                <>
                  <svg style={{ width: 18, height: 18, animation: 'spin 1s linear infinite' }} viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
                    <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  Redirecting to Stripe…
                </>
              ) : (
                <>🔒 Pay ${total.toFixed(2)} Securely</>
              )}
            </button>

            <p style={{ fontSize: '0.72rem', textAlign: 'center', color: 'var(--muted-foreground)', margin: 0 }}>
              Secured by Stripe. Your card details never touch our servers.
            </p>
          </motion.form>

          {/* Right: order summary */}
          <motion.aside
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: '1rem',
              padding: 'clamp(1.25rem, 3vw, 1.75rem)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem',
              order: 1,
              alignSelf: 'start',
            }}
            className="md:order-2 md:sticky md:top-6"
          >
            <p style={{ fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--primary)', margin: 0 }}>
              Order Summary
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {items.map((item) => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      flexShrink: 0,
                      borderRadius: '0.5rem',
                      overflow: 'hidden',
                      background: 'var(--card-image-bg)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    <img src={imgFor(item)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      className="font-['Anton']"
                      style={{ fontSize: '0.85rem', letterSpacing: '0.03em', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                    >
                      {item.name.toUpperCase()}
                    </p>
                    <p style={{ fontSize: '0.7rem', color: 'var(--muted-foreground)', margin: 0 }}>
                      {item.category || 'vendor'} · digital download
                    </p>
                  </div>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>${Number(item.sale_price).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {savings > 0 && (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--muted-foreground)' }}>
                    <span>Subtotal</span>
                    <span style={{ textDecoration: 'line-through' }}>${originalTotal.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--primary)' }}>
                    <span>You save</span>
                    <span>−${savings.toFixed(2)}</span>
                  </div>
                </>
              )}
              <div
                className="font-['Anton']"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  fontSize: '1.35rem',
                  letterSpacing: '0.03em',
                  marginTop: '0.4rem',
                }}
              >
                <span>TOTAL</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <Link
              to="/cart"
              style={{
                fontSize: '0.75rem',
                color: 'var(--muted-foreground)',
                textAlign: 'center',
                textDecoration: 'none',
                marginTop: '0.25rem',
              }}
            >
              ← Edit cart
            </Link>
          </motion.aside>
        </div>

        {/* Trust strip */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 'clamp(1rem, 3vw, 2rem)',
            flexWrap: 'wrap',
            marginTop: '2rem',
            fontSize: '0.7rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--muted-foreground)',
          }}
        >
          <span>⚡ Instant email delivery</span>
          <span>🔒 256-bit SSL · Stripe</span>
          <span>♻ Lifetime access</span>
        </div>
      </div>

      {/* Testimonials — social proof at the bottom of checkout */}
      <div style={{ borderTop: '1px solid var(--border)', marginTop: 'clamp(2rem, 4vw, 3rem)' }}>
        <Testimonials
          eyebrow="100,000+ buyers"
          heading="JOIN THE PLUG NETWORK"
          subheading="You're in good company — here's what other resellers are saying after they unlocked their vendor list."
        />
      </div>
    </div>
  );
}
