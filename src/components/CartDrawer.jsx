import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';

function CartDrawerContent({ items, onRemove, onClose }) {
  const panelRef = useRef(null);

  // Close on backdrop click (not panel click)
  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) onClose();
  }

  // Close on Escape key
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    // Prevent body scroll while drawer is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const total = items.reduce((sum, i) => sum + Number(i.sale_price), 0);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-stretch justify-end"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(2px)' }}
      onClick={handleBackdropClick}
    >
      {/* Slide-in panel */}
      <div
        ref={panelRef}
        className="relative w-full max-w-sm flex flex-col border-l"
        style={{
          background: 'var(--background)',
          borderColor: 'var(--border)',
          boxShadow: '-8px 0 40px rgba(0,0,0,0.5)',
          animation: 'slideInRight 0.22s cubic-bezier(0.25,0.46,0.45,0.94)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5 border-b shrink-0"
          style={{ borderColor: 'var(--border)' }}
        >
          <div>
            <h2 className="font-['Anton'] text-xl tracking-wide" style={{ color: 'var(--foreground)' }}>
              YOUR CART
            </h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg border transition-all duration-200 cursor-pointer hover:opacity-70"
            style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}
            aria-label="Close cart"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-16">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2} className="w-14 h-14" style={{ color: 'var(--border)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0Zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0Z" />
              </svg>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Your cart is empty</p>
            </div>
          ) : (
            items.map(item => (
              <div
                key={item.id}
                className="flex items-start gap-3 rounded-xl p-4 border"
                style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
              >
                <div className="flex-1 min-w-0">
                  <p className="font-['Anton'] text-sm tracking-wide truncate" style={{ color: 'var(--card-foreground)' }}>
                    {item.name.toUpperCase()}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {item.original_price && (
                      <span className="text-xs line-through" style={{ color: 'var(--muted-foreground)' }}>
                        ${Number(item.original_price).toFixed(2)}
                      </span>
                    )}
                    <span className="font-bold text-sm" style={{ color: 'var(--primary)' }}>
                      ${Number(item.sale_price).toFixed(2)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => onRemove(item.id)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg border transition-all duration-200 cursor-pointer hover:opacity-70 shrink-0"
                  style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}
                  aria-label={`Remove ${item.name}`}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-5 border-t space-y-3 shrink-0" style={{ borderColor: 'var(--border)' }}>
          <div className="flex justify-between items-baseline">
            <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Total</span>
            <span className="font-['Anton'] text-2xl tracking-wide" style={{ color: 'var(--foreground)' }}>
              ${total.toFixed(2)}
            </span>
          </div>
          <Link
            to="/checkout"
            onClick={onClose}
            className={`block w-full text-center py-3.5 rounded-xl font-bold text-sm transition-opacity duration-200 cursor-pointer ${items.length === 0 ? 'pointer-events-none opacity-40' : ''}`}
            style={{
              background: items.length > 0 ? 'var(--primary)' : 'var(--muted)',
              color: items.length > 0 ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
            }}
          >
            Checkout — ${total.toFixed(2)}
          </Link>
          <Link
            to="/cart"
            onClick={onClose}
            className="block w-full text-center py-2 text-xs transition-colors duration-200 cursor-pointer"
            style={{ color: 'var(--muted-foreground)' }}
          >
            View full cart
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0.6; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default function CartDrawer({ items, onRemove, onClose }) {
  return createPortal(
    <CartDrawerContent items={items} onRemove={onRemove} onClose={onClose} />,
    document.body
  );
}
