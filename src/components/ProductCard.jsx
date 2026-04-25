import { useState } from 'react';
import { Link } from 'react-router-dom';
import SaleBadge from './SaleBadge';

const CATEGORY_ICONS = {
  bundle: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-10 h-10 text-[#00FF88]/40">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
    </svg>
  ),
  fragrance: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-10 h-10 text-[#00FF88]/40">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 00.659 1.591L19.5 14.5M14.25 3.104c.251.023.501.05.75.082M19.5 14.5l-1.5 1.5m-10.5-1.5l1.5 1.5m0 0l1.5 1.5m-1.5-1.5l-1.5 1.5M6.75 19.5h10.5" />
    </svg>
  ),
  electronics: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-10 h-10 text-[#00FF88]/40">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
  ),
  watches: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-10 h-10 text-[#00FF88]/40">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  bags: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-10 h-10 text-[#00FF88]/40">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
    </svg>
  ),
  accessories: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-10 h-10 text-[#00FF88]/40">
      <circle cx="12" cy="12" r="3" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ),
  sports: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-10 h-10 text-[#00FF88]/40">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 3a9 9 0 019 9" />
    </svg>
  ),
  clothing: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-10 h-10 text-[#00FF88]/40">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 3H7L3 7l2 2 2-2v13h10V7l2 2 2-2-4-4h-2s-1 2-3 2-3-2-3-2z" />
    </svg>
  ),
  toys: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-10 h-10 text-[#00FF88]/40">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
  ),
};

const DEFAULT_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-10 h-10 text-[#00FF88]/40">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016 2.993 2.993 0 002.25-1.016 3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
  </svg>
);

export default function ProductCard({ product, onAddToCart }) {
  const [hovered, setHovered] = useState(false);

  const icon = CATEGORY_ICONS[product.category] || DEFAULT_ICON;

  return (
    <div
      className="relative bg-[#0f0f0f] rounded-xl border border-white/[0.06] hover:border-[#00FF88]/40 hover:bg-[#141414] hover:shadow-[0_0_24px_rgba(0,255,136,0.08)] transition-all duration-200 overflow-hidden cursor-pointer group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Sale badge */}
      {product.is_on_sale && (
        <div className="absolute top-3 left-3 z-10">
          <SaleBadge />
        </div>
      )}

      {/* Image / Icon area */}
      <Link to={`/product/${product.slug}`} tabIndex={-1}>
        <div className="h-36 flex items-center justify-center bg-[#0a0a0a] overflow-hidden">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-200"
              loading="lazy"
            />
          ) : (
            <div className="group-hover:scale-110 transition-transform duration-200">
              {icon}
            </div>
          )}
        </div>
      </Link>

      {/* Card body */}
      <div className="p-4 space-y-2">
        <Link to={`/product/${product.slug}`} className="block cursor-pointer">
          <h3 className="font-['Anton'] text-white text-sm leading-tight tracking-wide hover:text-[#00FF88] transition-colors duration-200 line-clamp-2">
            {product.name.toUpperCase()}
          </h3>
        </Link>

        <div className="flex items-center gap-2 pt-0.5">
          {product.original_price && (
            <span className="text-[#555] text-xs line-through">
              ${Number(product.original_price).toFixed(2)}
            </span>
          )}
          <span className="text-white font-bold text-base">
            ${Number(product.sale_price).toFixed(2)}
          </span>
        </div>
      </div>

      {/* Hover overlay */}
      <div className={`absolute inset-0 flex items-center justify-center transition-all duration-200 ${hovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        style={{ background: 'rgba(0,0,0,0.75)' }}>
        <button
          onClick={() => onAddToCart(product)}
          className="bg-[#00FF88] text-black font-bold px-5 py-2.5 rounded-lg hover:bg-[#00CC66] transition-colors duration-150 text-sm cursor-pointer"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
