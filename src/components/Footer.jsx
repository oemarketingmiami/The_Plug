import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ width: '100%', borderTop: '1px solid var(--border)', marginTop: 'auto', background: 'var(--card)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', paddingLeft: 'clamp(1.5rem, 4vw, 4rem)', paddingRight: 'clamp(1.5rem, 4vw, 4rem)', paddingTop: '2rem', paddingBottom: '2rem', display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '2rem' }}>
        <div>
          <p style={{ fontFamily: 'Anton, sans-serif', fontSize: '1.1rem', letterSpacing: '0.05em', color: 'var(--foreground)' }}>
            THE PLUG SUPPLIERS
          </p>
          <p style={{ fontSize: '0.875rem', marginTop: '0.25rem', color: 'var(--muted-foreground)' }}>
            Premium vendor lists. Instant digital delivery.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--foreground)' }}>Legal</h4>
            <Link to="/terms" style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', textDecoration: 'none' }} onMouseEnter={e => e.target.style.color = 'var(--primary)'} onMouseLeave={e => e.target.style.color = 'var(--muted-foreground)'}>Terms of Service</Link>
            <Link to="/privacy" style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', textDecoration: 'none' }} onMouseEnter={e => e.target.style.color = 'var(--primary)'} onMouseLeave={e => e.target.style.color = 'var(--muted-foreground)'}>Privacy Policy</Link>
            <Link to="/refund" style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)', textDecoration: 'none' }} onMouseEnter={e => e.target.style.color = 'var(--primary)'} onMouseLeave={e => e.target.style.color = 'var(--muted-foreground)'}>Refund Policy</Link>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem', minWidth: '200px' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
            © {new Date().getFullYear()} ThePlugSuppliers.
          </p>
          <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', opacity: 0.6 }}>
            Digital products — no refunds after download.
          </p>
        </div>
      </div>
    </footer>
  );
}
