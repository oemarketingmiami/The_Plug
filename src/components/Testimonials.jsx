import { Fragment } from 'react';
import { motion } from 'framer-motion';

const TESTIMONIALS = [
  {
    text: "Got my first cologne shipment in 9 days. Vendor was super professional and the discount code took 30% off my entire order. Already on my second restock.",
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150',
    name: 'Marcus T.',
    role: 'Fragrance Reseller · Atlanta',
  },
  {
    text: "I've spent hundreds on 'private supplier lists' that turned out to be public AliExpress links. The Plug is the real deal — direct factory contact, no middleman.",
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150',
    name: 'Jasmine K.',
    role: 'Boutique Owner · Brooklyn',
  },
  {
    text: "Email hit my inbox 2 minutes after checkout. Vendor responded on WhatsApp the same day. Didn't expect this kind of service for under ten bucks.",
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150',
    name: 'David R.',
    role: 'Sneaker Reseller · Houston',
  },
  {
    text: 'Doubled my margins on fragrance bottles. The vendor list paid for itself on my first order — and the WhatsApp script saved me from looking new.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150',
    name: 'Sasha P.',
    role: 'Beauty Reseller · Miami',
  },
  {
    text: "I was skeptical at first, but the watch vendor delivered exactly what was promised. Quality matched the photos and the code knocked 40% off retail.",
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150',
    name: 'Andre L.',
    role: 'Watch Reseller · Chicago',
  },
  {
    text: 'Finally a real plug. The shipping instructions saved me a full week of trial and error trying to figure out customs and tracking.',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150&h=150',
    name: 'Imani W.',
    role: 'Handbag Reseller · Atlanta',
  },
  {
    text: 'Eight bags into my first order — all authentic, all on time. The Plug got me set up with a vendor I still use weekly.',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150&h=150',
    name: 'Kaden S.',
    role: 'Resell Group Owner · LA',
  },
  {
    text: 'Customer service is unmatched. Hit them up about a vendor question and got a real answer in 20 minutes — not a copy-paste FAQ.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150',
    name: 'Maya O.',
    role: 'Online Boutique · Dallas',
  },
  {
    text: "Six months in and I'm still using the same vendor list weekly. Lifetime access is the real deal — no upsells, no extra fees, no recurring charges.",
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150&h=150',
    name: 'Tyler J.',
    role: 'Streetwear Reseller · NYC',
  },
];

const firstColumn = TESTIMONIALS.slice(0, 3);
const secondColumn = TESTIMONIALS.slice(3, 6);
const thirdColumn = TESTIMONIALS.slice(6, 9);

function TestimonialsColumn({ items, duration = 15, className = '' }) {
  return (
    <div className={className}>
      <motion.ul
        animate={{ translateY: '-50%' }}
        transition={{ duration, repeat: Infinity, ease: 'linear', repeatType: 'loop' }}
        style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '1.5rem', listStyle: 'none', margin: 0 }}
      >
        {[0, 1].map((dup) => (
          <Fragment key={dup}>
            {items.map((t, i) => (
              <motion.li
                key={`${dup}-${i}`}
                aria-hidden={dup === 1 ? 'true' : 'false'}
                tabIndex={dup === 1 ? -1 : 0}
                whileHover={{
                  scale: 1.03,
                  y: -8,
                  transition: { type: 'spring', stiffness: 400, damping: 17 },
                }}
                style={{
                  padding: '1.75rem',
                  borderRadius: '1.25rem',
                  border: '1px solid var(--border)',
                  background: 'var(--card)',
                  maxWidth: '20rem',
                  width: '100%',
                  boxShadow: '0 12px 32px rgba(0,0,0,0.25)',
                  cursor: 'default',
                  userSelect: 'none',
                  transition: 'box-shadow 0.3s, border-color 0.3s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(52,211,153,0.4)';
                  e.currentTarget.style.boxShadow = '0 24px 48px rgba(0,0,0,0.35), 0 0 0 1px rgba(52,211,153,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.25)';
                }}
              >
                <blockquote style={{ margin: 0, padding: 0 }}>
                  <p style={{ color: 'var(--foreground)', lineHeight: 1.6, margin: 0, fontSize: '0.95rem' }}>
                    "{t.text}"
                  </p>
                  <footer style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '1.25rem' }}>
                    <img
                      src={t.image}
                      alt=""
                      width={40}
                      height={40}
                      loading="lazy"
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '2px solid var(--border)',
                      }}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <cite style={{ fontWeight: 700, fontStyle: 'normal', letterSpacing: '0.01em', color: 'var(--foreground)', fontSize: '0.92rem', lineHeight: 1.25 }}>
                        {t.name}
                      </cite>
                      <span style={{ fontSize: '0.78rem', color: 'var(--muted-foreground)', marginTop: 2 }}>
                        {t.role}
                      </span>
                    </div>
                  </footer>
                </blockquote>
              </motion.li>
            ))}
          </Fragment>
        ))}
      </motion.ul>
    </div>
  );
}

export default function Testimonials({ heading = 'WHAT OUR BUYERS SAY', subheading = 'Real resellers, real reviews.', eyebrow = 'Testimonials' } = {}) {
  return (
    <section
      aria-labelledby="testimonials-heading"
      style={{
        position: 'relative',
        overflow: 'hidden',
        padding: 'clamp(3rem, 6vw, 5rem) 1rem',
        background: 'transparent',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 50, rotate: -2 }}
        whileInView={{ opacity: 1, y: 0, rotate: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], opacity: { duration: 0.8 } }}
        style={{ maxWidth: '1180px', margin: '0 auto', position: 'relative', zIndex: 10 }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', maxWidth: 540, margin: '0 auto 3rem' }}>
          <span
            style={{
              border: '1px solid var(--border)',
              padding: '0.25rem 0.85rem',
              borderRadius: 999,
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--primary)',
              background: 'rgba(52,211,153,0.08)',
            }}
          >
            {eyebrow}
          </span>

          <h2
            id="testimonials-heading"
            className="font-['Anton']"
            style={{
              fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
              letterSpacing: '0.02em',
              marginTop: '1.25rem',
              textAlign: 'center',
              color: 'var(--foreground)',
            }}
          >
            {heading}
          </h2>

          <p style={{ textAlign: 'center', marginTop: '0.85rem', color: 'var(--muted-foreground)', fontSize: '1rem', lineHeight: 1.6, maxWidth: 380 }}>
            {subheading}
          </p>
        </div>

        <div
          role="region"
          aria-label="Scrolling testimonials"
          className="testimonials-grid"
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1.5rem',
            marginTop: '2.5rem',
            maxHeight: 740,
            overflow: 'hidden',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
            maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
          }}
        >
          <TestimonialsColumn items={firstColumn} duration={15} />
          <TestimonialsColumn items={secondColumn} duration={19} className="testimonials-col-md" />
          <TestimonialsColumn items={thirdColumn} duration={17} className="testimonials-col-lg" />
        </div>
      </motion.div>

      <style>{`
        .testimonials-col-md { display: none; }
        .testimonials-col-lg { display: none; }
        @media (min-width: 768px) {
          .testimonials-col-md { display: block; }
        }
        @media (min-width: 1024px) {
          .testimonials-col-lg { display: block; }
        }
      `}</style>
    </section>
  );
}
