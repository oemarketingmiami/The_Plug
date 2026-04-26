import { useState } from 'react';
import { Link } from 'react-router-dom';
import { GlowCard } from './GlowCard';
import { getCategoryImage } from '../lib/categoryImages';

/* ── Per-category visual identity ──
   Each category gets its own gradient palette, accent color, icon,
   and a Flickr keyword used to fetch a category-relevant placeholder photo. */
const CATEGORY_VISUALS = {
  bundle: {
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #b45309 60%, #422006 100%)',
    accent: '#fde68a',
    keyword: 'package,boxes,warehouse',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <rect x="8" y="20" width="48" height="36" rx="4" />
        <path d="M22 20v-6a10 10 0 0120 0v6" />
        <path d="M8 34h48" />
      </svg>
    ),
  },
  fragrance: {
    gradient: 'linear-gradient(135deg, #ec4899 0%, #9d174d 55%, #500724 100%)',
    accent: '#fbcfe8',
    keyword: 'perfume,cologne,fragrance',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <rect x="20" y="24" width="24" height="32" rx="4" />
        <path d="M26 24v-6h12v6" />
        <path d="M29 18v-4M35 18v-4" />
        <path d="M20 38h24" />
      </svg>
    ),
  },
  electronics: {
    gradient: 'linear-gradient(135deg, #06b6d4 0%, #0e7490 55%, #083344 100%)',
    accent: '#a5f3fc',
    keyword: 'headphones,gadgets,electronics',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path d="M22 8c0 0-4 8-4 16s4 16 4 16M42 8c0 0 4 8 4 16s-4 16-4 16M16 24h32M32 18v12M26 32l-8 16h28l-8-16" />
      </svg>
    ),
  },
  watches: {
    gradient: 'linear-gradient(135deg, #eab308 0%, #854d0e 55%, #1c1917 100%)',
    accent: '#fef08a',
    keyword: 'watch,wristwatch,luxury',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <circle cx="32" cy="32" r="16" />
        <path d="M32 20v12l8 4" />
        <path d="M26 10h12M26 54h12" />
      </svg>
    ),
  },
  bags: {
    gradient: 'linear-gradient(135deg, #b45309 0%, #78350f 55%, #292524 100%)',
    accent: '#fed7aa',
    keyword: 'handbag,leather,luxury',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <rect x="10" y="24" width="44" height="32" rx="4" />
        <path d="M22 24v-6a10 10 0 0120 0v6" />
        <path d="M10 36h44" />
      </svg>
    ),
  },
  accessories: {
    gradient: 'linear-gradient(135deg, #a855f7 0%, #6b21a8 55%, #2e1065 100%)',
    accent: '#e9d5ff',
    keyword: 'sunglasses,jewelry,accessory',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <circle cx="32" cy="32" r="8" />
        <ellipse cx="32" cy="32" rx="28" ry="12" />
      </svg>
    ),
  },
  sports: {
    gradient: 'linear-gradient(135deg, #ef4444 0%, #991b1b 55%, #450a0a 100%)',
    accent: '#fecaca',
    keyword: 'sneakers,sports,gear',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <circle cx="32" cy="32" r="22" />
        <path d="M10 32h44M20 14l8 18M44 14l-8 18M20 50l8-18M44 50l-8-18" />
      </svg>
    ),
  },
  clothing: {
    gradient: 'linear-gradient(135deg, #14b8a6 0%, #115e59 55%, #042f2e 100%)',
    accent: '#99f6e4',
    keyword: 'streetwear,clothing,fashion',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path d="M20 8l-12 12 8 8v28h32V28l8-8L44 8l-6 6a6 6 0 01-12 0L20 8z" />
      </svg>
    ),
  },
  toys: {
    gradient: 'linear-gradient(135deg, #f43f5e 0%, #9f1239 55%, #4c0519 100%)',
    accent: '#fecdd3',
    keyword: 'toy,collectible,figure',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path d="M32 10l5 14h14l-11 9 4 14L32 38 20 47l4-14L13 24h14z" />
      </svg>
    ),
  },
};

const DEFAULT_VISUAL = {
  gradient: 'linear-gradient(135deg, #475569 0%, #1e293b 55%, #020617 100%)',
  accent: '#cbd5e1',
  keyword: 'product,merchandise',
  icon: (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <rect x="8" y="20" width="48" height="36" rx="4" />
      <path d="M22 20v-6a10 10 0 0120 0v6" />
    </svg>
  ),
};

function hashSeed(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export default function UniformCard({ product, onAddToCart }) {
  const [hovered, setHovered] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);
  const visual = CATEGORY_VISUALS[product.category] || DEFAULT_VISUAL;
  const savings = product.original_price
    ? Math.round(((product.original_price - product.sale_price) / product.original_price) * 100)
    : null;

  const seed = hashSeed(product.slug || product.name || String(product.id || ''));
  const pseudoSrc = product.image_url || getCategoryImage(product.category, seed);
  const fallbackSrc = `https://picsum.photos/seed/${seed}/600/480`;

  return (
    <GlowCard
      glowColor="green"
      className="flex flex-col overflow-hidden cursor-pointer group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ── Image / pseudo-image area ── */}
      <Link
        to={`/product/${product.slug}`}
        tabIndex={-1}
        className="block relative overflow-hidden"
        style={{ paddingBottom: '80%', background: visual.gradient }}
      >
        {/* Gradient + icon as loading state / fallback when image fails */}
        {(!imgLoaded || imgFailed) && (
          <>
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: 'radial-gradient(rgba(255,255,255,0.35) 1px, transparent 1px)',
                backgroundSize: '14px 14px',
              }}
            />
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ color: visual.accent }}
            >
              <div
                className="w-20 h-20 flex items-center justify-center rounded-full"
                style={{
                  background: 'rgba(0,0,0,0.25)',
                  border: '1px solid rgba(255,255,255,0.18)',
                  backdropFilter: 'blur(2px)',
                }}
              >
                <div className="w-12 h-12">{visual.icon}</div>
              </div>
            </div>
          </>
        )}

        {/* Real / placeholder photo — fades in when loaded */}
        <img
          src={imgFailed ? fallbackSrc : pseudoSrc}
          alt={product.name}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          onError={() => {
            if (!imgFailed) {
              setImgFailed(true);
              setImgLoaded(false);
            }
          }}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
          style={{ opacity: imgLoaded ? 1 : 0 }}
        />

        {/* Subtle darkening on top of photo for text legibility */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(115deg, rgba(0,0,0,0.05) 0%, transparent 40%, rgba(0,0,0,0.15) 100%)',
            opacity: imgLoaded && !imgFailed ? 1 : 0,
            transition: 'opacity 0.4s',
          }}
        />

        {/* Badges top-left */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.is_on_sale && (
            <span style={{ fontSize: '0.6rem', fontWeight: 900, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '4px 8px', borderRadius: '4px', background: 'var(--primary)', color: 'var(--primary-foreground)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>
              SALE
            </span>
          )}
          {product.is_bundle && (
            <span style={{ fontSize: '0.6rem', fontWeight: 900, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '4px 8px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.35)', color: '#ffffff', background: 'rgba(0,0,0,0.55)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>
              BUNDLE
            </span>
          )}
        </div>

        {/* Savings badge top-right */}
        {savings && (
          <div className="absolute top-3 right-3 z-10">
            <span style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.05em', padding: '4px 7px', borderRadius: '4px', background: 'rgba(0,0,0,0.65)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.3)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>
              -{savings}%
            </span>
          </div>
        )}

        {/* Name overlay at bottom of image */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{ padding: '2.25rem 1rem 0.875rem', background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.55) 55%, transparent 100%)' }}
        >
          <p style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.25rem', color: visual.accent, opacity: 0.9 }}>
            {product.category || 'vendor'}
          </p>
          <h3
            className="font-['Anton'] line-clamp-2 transition-colors duration-200"
            style={{ fontSize: '0.875rem', lineHeight: 1.2, letterSpacing: '0.04em', color: hovered ? 'var(--primary)' : '#ffffff', margin: 0 }}
          >
            {product.name.toUpperCase()}
          </h3>
        </div>
      </Link>

      {/* ── Price / CTA bar ── */}
      <div
        className="flex items-center justify-between gap-1 sm:gap-2 p-2 sm:px-4 sm:py-2.5"
        style={{ borderTop: '1px solid var(--border)', background: 'var(--card)' }}
      >
        <div className="flex items-baseline gap-1 sm:gap-1.5 min-w-0">
          {product.original_price && (
            <span className="text-[10px] sm:text-[0.65rem] truncate" style={{ textDecoration: 'line-through', color: 'var(--muted-foreground)' }}>
              ${Number(product.original_price).toFixed(2)}
            </span>
          )}
          <span className="font-['Anton'] text-[0.85rem] sm:text-[1rem] truncate" style={{ letterSpacing: '0.04em', color: 'var(--foreground)' }}>
            ${Number(product.sale_price).toFixed(2)}
          </span>
        </div>

        <button
          onClick={(e) => { e.preventDefault(); onAddToCart(product); }}
          className="px-2 py-1.5 sm:px-3 sm:py-1.5 text-[9px] sm:text-[10px]"
          style={{ fontWeight: 900, letterSpacing: '0.1em', textTransform: 'uppercase', borderRadius: '6px', border: '1px solid var(--primary)', color: 'var(--primary)', background: 'transparent', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0, transition: 'background 0.15s, color 0.15s', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'var(--primary)';
            e.currentTarget.style.color = 'var(--primary-foreground)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = 'var(--primary)';
          }}
        >
          + Add
        </button>
      </div>
    </GlowCard>
  );
}
