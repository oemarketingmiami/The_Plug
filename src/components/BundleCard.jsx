import { Link } from 'react-router-dom';

export default function BundleCard({ product, onAddToCart }) {
  return (
    <div className="relative bg-[#0f0f0f] rounded-xl border border-[#00FF88]/20 hover:border-[#00FF88]/50 hover:shadow-[0_0_32px_rgba(0,255,136,0.1)] transition-all duration-200 overflow-hidden cursor-pointer group">
      {/* Top accent bar */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#00FF88]/40 to-transparent" />

      <div className="flex flex-col sm:flex-row">
        {/* Left icon area */}
        <div className="sm:w-52 h-40 sm:h-auto flex flex-col items-center justify-center bg-[#080808] gap-3 shrink-0 p-6">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2} className="w-14 h-14 text-[#00FF88]/50">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
          </svg>
          <span className="text-[10px] font-bold tracking-[0.2em] text-[#00FF88] uppercase">Best Value</span>
        </div>

        {/* Right content */}
        <div className="flex-1 p-6 flex flex-col justify-between gap-4">
          {/* Header */}
          <div>
            <div className="flex items-start gap-3 mb-2 flex-wrap">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase px-2 py-1 bg-[#00FF88] text-black rounded">
                BUNDLE
              </span>
            </div>
            <Link to={`/product/${product.slug}`} className="block cursor-pointer">
              <h3 className="font-['Anton'] text-white text-xl tracking-wide hover:text-[#00FF88] transition-colors duration-200 leading-tight">
                {product.name.toUpperCase()}
              </h3>
            </Link>
            {product.description && (
              <p className="text-[#666] text-sm mt-1.5 leading-relaxed line-clamp-2">{product.description}</p>
            )}
          </div>

          {/* Bundle items */}
          {product.bundle_items && product.bundle_items.length > 0 && (
            <div className="grid grid-cols-2 gap-1.5">
              {product.bundle_items.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-[#888]">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-[#00FF88] shrink-0">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                  </svg>
                  <span className="truncate">{item}</span>
                </div>
              ))}
            </div>
          )}

          {/* Pricing + CTA */}
          <div className="flex items-center justify-between flex-wrap gap-3 pt-2 border-t border-white/5">
            <div className="flex items-baseline gap-2">
              {product.original_price && (
                <span className="text-[#555] line-through text-sm">
                  ${Number(product.original_price).toFixed(2)}
                </span>
              )}
              <span className="font-['Anton'] text-white text-3xl tracking-wide">
                ${Number(product.sale_price).toFixed(2)}
              </span>
            </div>
            <button
              onClick={() => onAddToCart(product)}
              className="bg-[#00FF88] text-black font-bold px-6 py-2.5 rounded-lg hover:bg-[#00CC66] transition-colors duration-150 text-sm cursor-pointer whitespace-nowrap"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
