import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';
import UniformCard from '../components/UniformCard';
import { AnimatedMarqueeHero } from '../components/AnimatedMarqueeHero';
import Testimonials from '../components/Testimonials';
import { HERO_MARQUEE_IMAGES } from '../lib/categoryImages';

/* Shared centered-container style — used inline so it cannot be
   overridden by Tailwind compilation or browser scrollbar quirks.  */
const CONTAINER = {
  maxWidth: '1280px',
  margin: '0 auto',
  paddingLeft:  'clamp(1.5rem, 4vw, 4rem)',
  paddingRight: 'clamp(1.5rem, 4vw, 4rem)',
};

export default function Home() {
  const { products, loading } = useProducts();
  const { addItem } = useCart();
  const [toast, setToast] = useState(null);
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('cat') || 'all';

  function handleAddToCart(product) {
    addItem(product);
    setToast(product.name);
    setTimeout(() => setToast(null), 2500);
  }

  const filtered = activeTab === 'all'
    ? products
    : products.filter(p => p.category === activeTab);

  function scrollToVendors() {
    const el = document.getElementById('vendors');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div style={{ width: '100%' }}>

      {/* ── Hero (animated marquee landing) ── */}
      <AnimatedMarqueeHero
        tagline={`${products.length || '100'}+ Verified Vendor Connects`}
        title={
          <>
            REPUTABLE VENDORS.
            <br />
            <span style={{ color: 'var(--primary)' }}>EXCLUSIVE GOODS.</span>
          </>
        }
        description="Hand-curated supplier lists for serious resellers — source jewelry, fragrances, handbags, sneakers, watches and more from vetted vendors at insider prices. Pay once, download instantly."
        ctaText="Browse Vendors"
        images={HERO_MARQUEE_IMAGES}
        onCtaClick={scrollToVendors}
      />

      {/* ── Product Grid (filtered via sidebar Categories) ── */}
      <div id="vendors" style={{ ...CONTAINER, paddingTop: 'clamp(2rem, 4vw, 3.5rem)', paddingBottom: '6rem' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '1.5rem', gap: '1rem', flexWrap: 'wrap' }}>
          <h2 className="font-['Anton']" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', letterSpacing: '0.04em', color: 'var(--foreground)', margin: 0 }}>
            {activeTab === 'all' ? 'ALL VENDORS' : activeTab.toUpperCase()}
            <span style={{ color: 'var(--muted-foreground)', marginLeft: '0.5rem', fontSize: '0.7em' }}>
              ({filtered.length})
            </span>
          </h2>
          <p style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted-foreground)', margin: 0 }}>
            Filter via the sidebar
          </p>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} style={{ borderRadius: '0.75rem', paddingBottom: '100%', background: 'var(--card)', border: '1px solid var(--border)', animation: 'pulse 1.5s infinite' }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '6rem 0', fontFamily: 'Anton, sans-serif', letterSpacing: '0.15em', fontSize: '1.25rem', color: 'var(--muted-foreground)' }}>
            NO PRODUCTS IN THIS CATEGORY
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map(product => (
              <UniformCard key={product.id} product={product} onAddToCart={handleAddToCart} />
            ))}
          </div>
        )}
      </div>

      {/* Testimonials */}
      <div style={{ borderTop: '1px solid var(--border)' }}>
        <Testimonials
          eyebrow="Testimonials"
          heading="WHAT OUR BUYERS SAY"
          subheading="Real resellers, real reviews — from cologne to sneakers, here's what they're sourcing through The Plug."
        />
      </div>

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', zIndex: 50, display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.875rem', fontWeight: 700, padding: '0.875rem 1.5rem', borderRadius: '0.75rem', backdropFilter: 'blur(8px)', background: 'var(--card)', border: '1px solid var(--primary)', color: 'var(--foreground)', boxShadow: '0 0 32px rgba(52,211,153,0.25)', whiteSpace: 'nowrap' }}>
          <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: '1rem', height: '1rem', flexShrink: 0, color: 'var(--primary)' }}>
            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
          </svg>
          Added to cart
        </div>
      )}
    </div>
  );
}
