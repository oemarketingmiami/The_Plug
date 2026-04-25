import { useEffect, useState } from 'react';
import { NavLink, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useProducts } from '../hooks/useProducts';

const CATEGORY_LABELS = [
  { value: 'all',         label: 'All' },
  { value: 'bundle',      label: 'Bundles' },
  { value: 'fragrance',   label: 'Fragrance' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'watches',     label: 'Watches' },
  { value: 'bags',        label: 'Bags' },
  { value: 'clothing',    label: 'Clothing' },
  { value: 'accessories', label: 'Accessories' },
  { value: 'sports',      label: 'Sports' },
  { value: 'toys',        label: 'Toys' },
];

const ADMIN_VIEWS = [
  {
    value: 'dashboard',
    label: 'Dashboard',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="9" rx="1" />
        <rect x="14" y="3" width="7" height="5" rx="1" />
        <rect x="14" y="12" width="7" height="9" rx="1" />
        <rect x="3" y="16" width="7" height="5" rx="1" />
      </svg>
    ),
  },
  {
    value: 'products',
    label: 'Products',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
  },
  {
    value: 'orders',
    label: 'Orders',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="9" y1="13" x2="15" y2="13" />
        <line x1="9" y1="17" x2="15" y2="17" />
      </svg>
    ),
  },
  {
    value: 'customers',
    label: 'Customers',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
  {
    value: 'settings',
    label: 'Settings',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z" />
      </svg>
    ),
  },
];

const ICONS = {
  logo: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path d="M10 2L3 7v11h5v-5h4v5h5V7L10 2z" />
    </svg>
  ),
  shop: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l1.5-5h15L21 9" />
      <path d="M3 9v11a1 1 0 001 1h16a1 1 0 001-1V9" />
      <path d="M9 9a3 3 0 006 0" />
    </svg>
  ),
  cart: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
    </svg>
  ),
  admin: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20a7.5 7.5 0 0115 0" />
    </svg>
  ),
  chevron: (open) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'transform 0.2s', transform: open ? 'rotate(0deg)' : 'rotate(180deg)' }}>
      <polyline points="15 18 9 12 15 6" />
    </svg>
  ),
  menu: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),
  close: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
};

export default function Sidebar() {
  const { items } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { products } = useProducts();

  const [expanded, setExpanded] = useState(() => {
    if (typeof window === 'undefined') return true;
    const saved = localStorage.getItem('sb-expanded');
    return saved === null ? true : saved === 'true';
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdmin = location.pathname === '/admin';
  const activeCat = location.pathname === '/' ? (searchParams.get('cat') || 'all') : null;
  const activeView = isAdmin ? (searchParams.get('view') || 'dashboard') : null;

  const counts = products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});
  const availableCategories = CATEGORY_LABELS.filter(
    (c) => c.value === 'all' || counts[c.value] > 0
  );

  function selectCategory(value) {
    const path = value === 'all' ? '/' : `/?cat=${value}`;
    navigate(path);
    setMobileOpen(false);
  }

  function selectAdminView(value) {
    navigate(value === 'dashboard' ? '/admin' : `/admin?view=${value}`);
    setMobileOpen(false);
  }

  useEffect(() => {
    localStorage.setItem('sb-expanded', String(expanded));
    document.documentElement.style.setProperty(
      '--sb-width-desktop',
      expanded ? '240px' : '72px'
    );
  }, [expanded]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [mobileOpen]);

  function closeMobile() {
    setMobileOpen(false);
  }

  const cartCount = items.length;

  const navItem = ({ to, icon, label, badge }) => (
    <NavLink
      key={to}
      to={to}
      onClick={closeMobile}
      end={to === '/'}
      className="sb-item"
    >
      {({ isActive }) => (
        <span className="sb-item-inner" data-active={isActive ? 'true' : 'false'}>
          <span className="sb-item-bar" />
          <span className="sb-item-icon">{icon}</span>
          <span className="sb-item-label">{label}</span>
          {badge != null && badge > 0 && (
            <span className="sb-item-badge">{badge}</span>
          )}
        </span>
      )}
    </NavLink>
  );

  return (
    <>
      {/* Mobile hamburger — only shows when drawer closed on small screens */}
      <button
        className="sb-mobile-toggle"
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
        data-hidden={mobileOpen ? 'true' : 'false'}
      >
        {ICONS.menu}
      </button>

      {/* Mobile backdrop */}
      <div
        className="sb-backdrop"
        data-open={mobileOpen ? 'true' : 'false'}
        onClick={closeMobile}
      />

      <aside
        className="sb-root"
        data-expanded={expanded ? 'true' : 'false'}
        data-mobile-open={mobileOpen ? 'true' : 'false'}
      >
        {/* Brand */}
        <div className="sb-brand">
          <NavLink to="/" onClick={closeMobile} className="sb-brand-link">
            <span className="sb-brand-mark">{ICONS.logo}</span>
            <span className="sb-brand-text">THE PLUG</span>
          </NavLink>

          {/* Mobile close button */}
          <button
            className="sb-mobile-close"
            onClick={closeMobile}
            aria-label="Close menu"
          >
            {ICONS.close}
          </button>
        </div>

        {/* Section label */}
        <div className="sb-section-label">MENU</div>

        {/* Nav items */}
        <nav className="sb-nav">
          {navItem({ to: '/', icon: ICONS.shop, label: 'Shop' })}
          {navItem({ to: '/cart', icon: ICONS.cart, label: 'Cart', badge: cartCount })}
          {navItem({ to: '/admin', icon: ICONS.admin, label: 'Admin' })}
        </nav>

        {/* Admin nav (when on /admin) */}
        {isAdmin && (
          <>
            <div className="sb-admin-badge">ADMIN MODE</div>
            <div className="sb-section-label sb-section-label-spaced">WORKSPACE</div>
            <nav className="sb-nav">
              {ADMIN_VIEWS.map((v) => {
                const isActive = activeView === v.value;
                return (
                  <button
                    key={v.value}
                    onClick={() => selectAdminView(v.value)}
                    className="sb-item"
                    type="button"
                  >
                    <span className="sb-item-inner" data-active={isActive ? 'true' : 'false'}>
                      <span className="sb-item-bar" />
                      <span className="sb-item-icon">{v.icon}</span>
                      <span className="sb-item-label">{v.label}</span>
                    </span>
                  </button>
                );
              })}
            </nav>
          </>
        )}

        {/* Categories (when on shop) */}
        {!isAdmin && (
          <>
            <div className="sb-section-label sb-section-label-spaced">CATEGORIES</div>
            <nav className="sb-nav sb-nav-scroll">
              {availableCategories.map((cat) => {
                const isActive = activeCat === cat.value;
                const count = cat.value === 'all' ? products.length : counts[cat.value] || 0;
                return (
                  <button
                    key={cat.value}
                    onClick={() => selectCategory(cat.value)}
                    className="sb-item sb-cat-item"
                    type="button"
                  >
                    <span className="sb-item-inner" data-active={isActive ? 'true' : 'false'}>
                      <span className="sb-item-bar" />
                      <span className="sb-cat-dot" data-active={isActive ? 'true' : 'false'} />
                      <span className="sb-item-label">{cat.label}</span>
                      <span className="sb-cat-count">{count}</span>
                    </span>
                  </button>
                );
              })}
            </nav>
          </>
        )}

        {/* Spacer */}
        <div style={{ flex: 1, minHeight: '1rem' }} />

        {/* CTA */}
        <button
          className="sb-cta"
          onClick={() => {
            navigate('/cart');
            closeMobile();
          }}
          data-hidden={cartCount === 0 ? 'true' : 'false'}
        >
          <span className="sb-item-icon">{ICONS.cart}</span>
          <span className="sb-item-label">Checkout · {cartCount}</span>
        </button>

        {/* Desktop collapse toggle */}
        <button
          className="sb-toggle"
          onClick={() => setExpanded((v) => !v)}
          aria-label={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {ICONS.chevron(expanded)}
        </button>
      </aside>

      <SidebarStyles />
    </>
  );
}

function SidebarStyles() {
  return (
    <style>{`
      .sb-root {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        width: var(--sb-width-desktop, 240px);
        background: var(--card);
        border-right: 1px solid var(--border);
        display: flex;
        flex-direction: column;
        z-index: 50;
        transition: width 0.22s ease, transform 0.25s ease;
        overflow: hidden;
      }
      /* Inner scroll for tall sidebars */
      .sb-root::after {
        content: '';
      }
      .sb-nav-scroll {
        overflow-y: auto;
        max-height: 50vh;
        scrollbar-width: thin;
      }
      .sb-nav-scroll::-webkit-scrollbar { width: 6px; }
      .sb-nav-scroll::-webkit-scrollbar-thumb {
        background: var(--border);
        border-radius: 3px;
      }
      .sb-section-label-spaced { padding-top: 1.25rem; }

      .sb-admin-badge {
        margin: 0.85rem 1rem 0;
        padding: 0.4rem 0.65rem;
        font-size: 0.6rem;
        font-weight: 800;
        letter-spacing: 0.2em;
        text-align: center;
        color: var(--primary);
        background: rgba(52,211,153,0.10);
        border: 1px solid rgba(52,211,153,0.35);
        border-radius: 0.4rem;
        white-space: nowrap;
        opacity: 1;
        transition: opacity 0.15s, padding 0.15s;
      }
      .sb-root[data-expanded="false"] .sb-admin-badge {
        opacity: 0;
        padding: 0;
        margin-top: 0;
        height: 0;
        border: none;
      }

      .sb-cat-item {
        background: transparent;
        border: none;
        text-align: left;
        padding: 0;
        cursor: pointer;
        font: inherit;
        color: inherit;
        width: 100%;
      }
      .sb-cat-item .sb-item-inner {
        padding: 0.4rem 0.65rem;
        gap: 0.65rem;
      }
      .sb-cat-item .sb-item-label {
        font-size: 0.78rem;
        font-weight: 500;
        letter-spacing: 0.02em;
      }
      .sb-cat-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--border);
        flex-shrink: 0;
        margin-left: 0.35rem;
        transition: background 0.15s, box-shadow 0.15s;
      }
      .sb-cat-dot[data-active="true"] {
        background: var(--primary);
        box-shadow: 0 0 8px var(--primary);
      }
      .sb-cat-count {
        font-size: 0.62rem;
        font-weight: 700;
        color: var(--muted-foreground);
        background: var(--accent);
        padding: 1px 6px;
        border-radius: 999px;
        min-width: 20px;
        text-align: center;
        flex-shrink: 0;
        opacity: 1;
        transition: opacity 0.15s;
      }
      .sb-root[data-expanded="false"] .sb-cat-count { opacity: 0; pointer-events: none; }
      .sb-root[data-expanded="false"] .sb-cat-dot { margin-left: 0.45rem; }
      .sb-cat-item .sb-item-inner[data-active="true"] .sb-cat-count {
        background: var(--primary);
        color: var(--primary-foreground);
      }

      .sb-brand {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.5rem;
        padding: 1rem;
        border-bottom: 1px solid var(--border);
        min-height: 64px;
      }
      .sb-brand-link {
        display: flex;
        align-items: center;
        gap: 0.625rem;
        text-decoration: none;
        color: var(--foreground);
        flex: 1;
        min-width: 0;
      }
      .sb-brand-mark {
        width: 32px;
        height: 32px;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        background: var(--primary);
        color: var(--primary-foreground);
      }
      .sb-brand-text {
        font-family: 'Anton', sans-serif;
        font-size: 1.05rem;
        letter-spacing: 0.06em;
        white-space: nowrap;
        opacity: 1;
        transition: opacity 0.15s;
      }
      .sb-root[data-expanded="false"] .sb-brand-text { opacity: 0; pointer-events: none; }

      .sb-section-label {
        padding: 1rem 1rem 0.5rem;
        font-size: 0.6rem;
        letter-spacing: 0.25em;
        text-transform: uppercase;
        color: var(--muted-foreground);
        white-space: nowrap;
        opacity: 1;
        transition: opacity 0.15s;
      }
      .sb-root[data-expanded="false"] .sb-section-label { opacity: 0; }

      .sb-nav {
        display: flex;
        flex-direction: column;
        padding: 0 0.5rem;
        gap: 0.125rem;
      }

      .sb-item {
        text-decoration: none;
        color: var(--muted-foreground);
        border-radius: 0.5rem;
        position: relative;
      }
      .sb-item-inner {
        display: flex;
        align-items: center;
        gap: 0.85rem;
        padding: 0.65rem 0.75rem;
        border-radius: 0.5rem;
        transition: background 0.15s, color 0.15s;
        position: relative;
      }
      .sb-item-inner:hover {
        background: var(--accent);
        color: var(--foreground);
      }
      .sb-item-inner[data-active="true"] {
        background: rgba(52,211,153,0.10);
        color: var(--primary);
      }
      .sb-item-bar {
        position: absolute;
        left: -0.5rem;
        top: 0.4rem;
        bottom: 0.4rem;
        width: 3px;
        border-radius: 2px;
        background: transparent;
        transition: background 0.15s;
      }
      .sb-item-inner[data-active="true"] .sb-item-bar { background: var(--primary); }
      .sb-item-icon {
        width: 22px;
        height: 22px;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .sb-item-icon svg { width: 22px; height: 22px; }
      .sb-item-label {
        font-size: 0.92rem;
        font-weight: 600;
        letter-spacing: 0.01em;
        white-space: nowrap;
        flex: 1;
        opacity: 1;
        transition: opacity 0.15s;
      }
      .sb-root[data-expanded="false"] .sb-item-label { opacity: 0; pointer-events: none; }

      .sb-item-badge {
        background: var(--primary);
        color: var(--primary-foreground);
        font-size: 0.65rem;
        font-weight: 800;
        min-width: 20px;
        height: 20px;
        padding: 0 6px;
        border-radius: 999px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        line-height: 1;
      }
      .sb-root[data-expanded="false"] .sb-item-badge {
        position: absolute;
        top: 0.25rem;
        right: 0.35rem;
        min-width: 16px;
        height: 16px;
        font-size: 0.6rem;
        padding: 0 4px;
      }

      .sb-cta {
        margin: 0.5rem;
        padding: 0.65rem 0.75rem;
        display: flex;
        align-items: center;
        gap: 0.85rem;
        border: 1px solid var(--primary);
        background: var(--primary);
        color: var(--primary-foreground);
        border-radius: 0.5rem;
        cursor: pointer;
        font-family: 'Anton', sans-serif;
        font-size: 0.85rem;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        transition: opacity 0.15s, transform 0.15s;
      }
      .sb-cta:hover { transform: translateY(-1px); }
      .sb-cta[data-hidden="true"] { display: none; }
      .sb-root[data-expanded="false"] .sb-cta { justify-content: center; padding: 0.65rem 0; }
      .sb-root[data-expanded="false"] .sb-cta .sb-item-label { display: none; }

      .sb-toggle {
        margin: 0.5rem;
        padding: 0.5rem;
        background: transparent;
        border: 1px solid var(--border);
        border-radius: 0.5rem;
        color: var(--muted-foreground);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.15s, color 0.15s;
      }
      .sb-toggle:hover { background: var(--accent); color: var(--foreground); }
      .sb-toggle svg { width: 18px; height: 18px; }

      /* Mobile-only elements hidden on desktop */
      .sb-mobile-toggle, .sb-mobile-close, .sb-backdrop { display: none; }

      @media (max-width: 767px) {
        :root { --sb-width: 0px; }

        .sb-root {
          width: 280px !important;
          transform: translateX(-100%);
          box-shadow: 0 0 40px rgba(0,0,0,0.5);
        }
        .sb-root[data-mobile-open="true"] { transform: translateX(0); }
        /* On mobile, always show full labels regardless of "expanded" */
        .sb-root .sb-brand-text,
        .sb-root .sb-section-label,
        .sb-root .sb-item-label { opacity: 1 !important; pointer-events: auto !important; }
        .sb-root .sb-item-badge {
          position: static !important;
          min-width: 20px !important;
          height: 20px !important;
          font-size: 0.65rem !important;
          padding: 0 6px !important;
        }
        .sb-root .sb-cta { justify-content: flex-start; padding: 0.65rem 0.75rem; }
        .sb-root .sb-cta .sb-item-label { display: inline !important; }

        .sb-toggle { display: none; }

        .sb-mobile-toggle {
          display: flex;
          position: fixed;
          top: 0.85rem;
          left: 0.85rem;
          z-index: 60;
          width: 42px;
          height: 42px;
          align-items: center;
          justify-content: center;
          border-radius: 0.6rem;
          background: var(--card);
          border: 1px solid var(--border);
          color: var(--foreground);
          cursor: pointer;
          backdrop-filter: blur(8px);
          transition: opacity 0.2s;
        }
        .sb-mobile-toggle[data-hidden="true"] { opacity: 0; pointer-events: none; }
        .sb-mobile-toggle svg { width: 22px; height: 22px; }

        .sb-mobile-close {
          display: flex;
          width: 36px;
          height: 36px;
          align-items: center;
          justify-content: center;
          border-radius: 0.5rem;
          background: transparent;
          border: 1px solid var(--border);
          color: var(--foreground);
          cursor: pointer;
          flex-shrink: 0;
        }
        .sb-mobile-close svg { width: 18px; height: 18px; }

        .sb-backdrop {
          display: block;
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.6);
          z-index: 40;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.2s;
        }
        .sb-backdrop[data-open="true"] { opacity: 1; pointer-events: auto; }
      }
    `}</style>
  );
}
