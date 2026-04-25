export default function Footer() {
  return (
    <footer style={{ width: '100%', borderTop: '1px solid var(--border)', marginTop: 'auto' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', paddingLeft: 'clamp(1.5rem, 4vw, 4rem)', paddingRight: 'clamp(1.5rem, 4vw, 4rem)', paddingTop: '2rem', paddingBottom: '2rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem' }}>
        <div>
          <p style={{ fontFamily: 'Anton, sans-serif', fontSize: '1.1rem', letterSpacing: '0.05em', color: 'var(--foreground)' }}>
            THE PLUG SUPPLIERS
          </p>
          <p style={{ fontSize: '0.875rem', marginTop: '0.25rem', color: 'var(--muted-foreground)' }}>
            Premium vendor lists. Instant digital delivery.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
            © {new Date().getFullYear()} ThePlugSuppliers. All rights reserved.
          </p>
          <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', opacity: 0.6 }}>
            Digital products — no refunds after download.
          </p>
        </div>
      </div>
    </footer>
  );
}
