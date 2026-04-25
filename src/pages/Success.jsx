import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { useCart } from '../hooks/useCart';

const CONTAINER = {
  maxWidth: '760px',
  margin: '0 auto',
  paddingLeft: 'clamp(1rem, 4vw, 3rem)',
  paddingRight: 'clamp(1rem, 4vw, 3rem)',
};

function joinNames(names) {
  if (names.length === 0) return '';
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(', ')}, and ${names[names.length - 1]}`;
}

export default function Success() {
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState(null);
  const [downloadUrls, setDownloadUrls] = useState([]);
  const [timedOut, setTimedOut] = useState(false);
  const sessionId = searchParams.get('session_id');
  const { items, clearCart } = useCart();

  // Use cart items as a fallback for product names while we wait for the order
  // to be confirmed by the webhook. Names are nicer than "your products."
  const fallbackNames = items.map((i) => i.name);

  useEffect(() => {
    if (!sessionId) return;

    let attempts = 0;
    const maxAttempts = 15; // 30 seconds

    const poll = setInterval(async () => {
      attempts++;
      if (attempts > maxAttempts) {
        clearInterval(poll);
        setTimedOut(true);
        return;
      }

      try {
        const { data } = await supabase
          .from('orders')
          .select('*')
          .eq('stripe_session_id', sessionId)
          .single();

        if (data?.status === 'paid') {
          setOrder(data);
          clearCart();
          clearInterval(poll);

          if (data.products && data.products.length > 0) {
            const urls = await Promise.all(
              data.products.map(async (product) => {
                if (!product.file_url) return { name: product.name, url: null };
                const { data: signedUrl } = await supabase.storage
                  .from('products')
                  .createSignedUrl(product.file_url, 60 * 60 * 72);
                return { name: product.name, url: signedUrl?.signedUrl };
              })
            );
            setDownloadUrls(urls.filter((u) => u.url));
          }
        }
      } catch {
        // Keep polling
      }
    }, 2000);

    return () => clearInterval(poll);
  }, [sessionId]);

  if (!sessionId) {
    return (
      <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
        <p style={{ color: 'var(--foreground)', fontSize: '1.1rem' }}>No session found.</p>
        <Link to="/" style={{ color: 'var(--primary)' }}>← Back to shop</Link>
      </div>
    );
  }

  // Pull product names from order (post-confirmation) or cart (pre-confirmation)
  const productNames = order?.products?.map((p) => p.name) || fallbackNames;
  const productList = joinNames(productNames);
  const customerEmail = order?.email || order?.customer_email || null;

  return (
    <div style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', paddingTop: 'clamp(2rem, 4vw, 3rem)', paddingBottom: 'clamp(3rem, 6vw, 5rem)' }}>
      <div style={{ ...CONTAINER, width: '100%' }}>
        {/* Processing state */}
        {!order && !timedOut && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: '1rem',
              padding: 'clamp(2.5rem, 6vw, 4rem) 2rem',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                margin: '0 auto 1.25rem',
                borderRadius: '50%',
                border: '3px solid rgba(52,211,153,0.2)',
                borderTopColor: 'var(--primary)',
                animation: 'spin 1s linear infinite',
              }}
            />
            <h1 className="font-['Anton']" style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)', letterSpacing: '0.03em', margin: 0 }}>
              CONFIRMING YOUR PAYMENT
            </h1>
            <p style={{ color: 'var(--muted-foreground)', marginTop: '0.75rem' }}>
              Hold tight — this usually takes a few seconds.
            </p>
          </motion.div>
        )}

        {/* Timed out state */}
        {timedOut && !order && (
          <div
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: '1rem',
              padding: 'clamp(2rem, 5vw, 3rem)',
              textAlign: 'center',
            }}
          >
            <h1 className="font-['Anton']" style={{ fontSize: '1.5rem', letterSpacing: '0.03em', margin: 0, color: '#facc15' }}>
              STILL PROCESSING
            </h1>
            <p style={{ color: 'var(--muted-foreground)', marginTop: '0.85rem', lineHeight: 1.6 }}>
              Your payment was received. Check your email for the download link, or contact support if it doesn't arrive in 5 minutes.
            </p>
            <Link to="/" style={{ color: 'var(--primary)', display: 'inline-block', marginTop: '1.25rem', textDecoration: 'none' }}>
              ← Back to shop
            </Link>
          </div>
        )}

        {/* Success state */}
        {order && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '1.25rem',
              border: '1px solid var(--primary)',
              background:
                'radial-gradient(circle at 20% 0%, rgba(52,211,153,0.18), transparent 60%), radial-gradient(circle at 80% 100%, rgba(52,211,153,0.10), transparent 50%), var(--card)',
              padding: 'clamp(2rem, 5vw, 3.5rem) clamp(1.5rem, 4vw, 3rem)',
              textAlign: 'center',
            }}
          >
            {/* Animated checkmark badge */}
            <motion.div
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 15 }}
              style={{
                width: 88,
                height: 88,
                borderRadius: '50%',
                background: 'var(--primary)',
                color: 'var(--primary-foreground)',
                margin: '0 auto 1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 40px rgba(52,211,153,0.5)',
              }}
            >
              <svg viewBox="0 0 24 24" width={44} height={44} fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                <motion.polyline
                  points="20 6 9 17 4 12"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.35, duration: 0.4 }}
                />
              </svg>
            </motion.div>

            <p style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--primary)', margin: 0 }}>
              Payment Confirmed
            </p>

            <h1
              className="font-['Anton']"
              style={{
                fontSize: 'clamp(2rem, 5vw, 3.25rem)',
                letterSpacing: '0.02em',
                lineHeight: 1.05,
                margin: '0.6rem 0 0',
              }}
            >
              CONGRATULATIONS!
            </h1>

            <p style={{ color: 'var(--foreground)', maxWidth: '34rem', margin: '1rem auto 0', lineHeight: 1.6, fontSize: '1.05rem' }}>
              Check your{' '}
              {customerEmail ? (
                <>
                  inbox at <strong style={{ color: 'var(--primary)' }}>{customerEmail}</strong>
                </>
              ) : (
                <strong style={{ color: 'var(--primary)' }}>email</strong>
              )}
              {' '}for{' '}
              {productList ? (
                <strong style={{ color: 'var(--foreground)' }}>{productList}</strong>
              ) : (
                <strong>your vendor list</strong>
              )}
              .
            </p>

            <p style={{ color: 'var(--muted-foreground)', maxWidth: '32rem', margin: '0.75rem auto 0', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Inside you'll find the vendor's name, WhatsApp/contact, your exclusive discount code, and shipping instructions. Reach out and start sourcing today.
            </p>

            {/* Download buttons */}
            {downloadUrls.length > 0 && (
              <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', maxWidth: 460, marginLeft: 'auto', marginRight: 'auto' }}>
                <p style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted-foreground)', margin: 0 }}>
                  Or download now
                </p>
                {downloadUrls.map((item, i) => (
                  <a
                    key={i}
                    href={item.url}
                    download
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.6rem',
                      width: '100%',
                      padding: '0.95rem 1.25rem',
                      background: 'var(--primary)',
                      color: 'var(--primary-foreground)',
                      textDecoration: 'none',
                      borderRadius: '0.75rem',
                      fontFamily: 'Anton, sans-serif',
                      letterSpacing: '0.12em',
                      fontSize: '0.9rem',
                      textTransform: 'uppercase',
                      boxShadow: '0 8px 28px rgba(52,211,153,0.3)',
                    }}
                  >
                    <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    Download {item.name}
                  </a>
                ))}
                <p style={{ fontSize: '0.7rem', color: 'var(--muted-foreground)', margin: '0.4rem 0 0' }}>
                  Links expire in 72 hours — save your file.
                </p>
              </div>
            )}

            {/* Next steps */}
            <div
              style={{
                marginTop: '2.5rem',
                paddingTop: '1.75rem',
                borderTop: '1px solid var(--border)',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '1rem',
                textAlign: 'left',
              }}
            >
              {[
                { n: '01', t: 'Check Your Email', b: 'Vendor PDF + discount code lands in 2 min.' },
                { n: '02', t: 'Message the Vendor', b: 'Use the WhatsApp script we included.' },
                { n: '03', t: 'Place Your Order', b: 'Apply the code, ship in 7–14 days.' },
              ].map((s) => (
                <div key={s.n}>
                  <p className="font-['Anton']" style={{ fontSize: '1.5rem', color: 'var(--primary)', letterSpacing: '0.04em', margin: 0, lineHeight: 1 }}>
                    {s.n}
                  </p>
                  <p className="font-['Anton']" style={{ fontSize: '0.85rem', letterSpacing: '0.06em', textTransform: 'uppercase', margin: '0.5rem 0 0.25rem' }}>
                    {s.t}
                  </p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--muted-foreground)', margin: 0, lineHeight: 1.55 }}>
                    {s.b}
                  </p>
                </div>
              ))}
            </div>

            <Link
              to="/"
              style={{
                display: 'inline-block',
                marginTop: '2rem',
                color: 'var(--muted-foreground)',
                textDecoration: 'none',
                fontSize: '0.85rem',
              }}
            >
              ← Back to shop
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
