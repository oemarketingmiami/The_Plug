import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';

export default function Navbar() {
  const { items } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav
      className="sticky top-0 z-40 w-full backdrop-blur-xl border-b"
      style={{ background: 'rgba(10,10,15,0.92)', borderColor: 'var(--border)' }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', paddingLeft: 'clamp(1.5rem, 4vw, 4rem)', paddingRight: 'clamp(1.5rem, 4vw, 4rem)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '4rem' }}>

        <Link to="/" className="flex items-center gap-2 group cursor-pointer shrink-0">
          <span className="w-7 h-7 rounded flex items-center justify-center shrink-0" style={{ background: 'var(--primary)' }}>
            <svg viewBox="0 0 20 20" fill="var(--primary-foreground)" className="w-4 h-4">
              <path d="M10 2L3 7v11h5v-5h4v5h5V7L10 2z" />
            </svg>
          </span>
          <span className="font-['Anton'] text-lg tracking-wide" style={{ color: 'var(--foreground)' }}>
            THE PLUG
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="hidden sm:block text-sm font-semibold transition-colors duration-200 cursor-pointer"
            style={{ color: location.pathname === '/' ? 'var(--primary)' : 'var(--muted-foreground)' }}
          >
            Shop
          </Link>
          <Link
            to="/admin"
            className="hidden sm:block text-sm font-semibold transition-colors duration-200 cursor-pointer"
            style={{ color: 'var(--muted-foreground)' }}
          >
            Admin
          </Link>

          {/* Cart → navigates to /cart page, no drawer */}
          <button
            onClick={() => navigate('/cart')}
            className="relative flex items-center justify-center w-10 h-10 rounded-lg border transition-all duration-200 cursor-pointer"
            style={{ borderColor: 'var(--border)', background: 'transparent' }}
            aria-label="View cart"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
              style={{ color: 'var(--foreground)' }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
            </svg>
            {items.length > 0 && (
              <span
                className="absolute -top-1.5 -right-1.5 text-[10px] font-black min-w-[18px] h-[18px] rounded-full flex items-center justify-center leading-none px-1"
                style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
              >
                {items.length}
              </span>
            )}
          </button>
        </div>

      </div>
    </nav>
  );
}
