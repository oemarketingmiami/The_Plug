import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { GlowCard } from '../components/GlowCard';

// ⚠️ Local-testing bypass — DO NOT ship to production.
// These credentials skip Supabase auth entirely so the admin UI is reachable
// without a real auth user. Strip this block before deploying.
const DEV_EMAIL = 'bmgaccident@gmail.com';
const DEV_PASSWORD = '1234';
const DEV_SESSION_KEY = 'theplug_dev_admin';
const DEV_SESSION = { user: { email: DEV_EMAIL, id: 'dev-admin' }, _dev: true };

export default function Admin() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const view = searchParams.get('view') || 'dashboard';
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(defaultForm());
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [productFile, setProductFile] = useState(null);

  function setView(v) {
    if (v === 'dashboard') setSearchParams({});
    else setSearchParams({ view: v });
  }

  // Check auth on mount
  useEffect(() => {
    // Restore the dev session first if it was set previously
    if (typeof window !== 'undefined' && localStorage.getItem(DEV_SESSION_KEY) === 'true') {
      setSession(DEV_SESSION);
      return;
    }
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => listener.subscription.unsubscribe();
  }, []);

  // Load data when logged in
  useEffect(() => {
    if (!session) return;
    fetchProducts();
    fetchOrders();
  }, [session]);

  async function fetchProducts() {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    setProducts(data || []);
  }

  async function fetchOrders() {
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    setOrders(data || []);
  }

  async function handleLogin(e) {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);

    // Local-testing bypass — accept hardcoded creds without hitting Supabase.
    if (email === DEV_EMAIL && password === DEV_PASSWORD) {
      localStorage.setItem(DEV_SESSION_KEY, 'true');
      setSession(DEV_SESSION);
      setAuthLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setAuthError(error.message);
    setAuthLoading(false);
  }

  async function handleLogout() {
    if (session?._dev) {
      localStorage.removeItem(DEV_SESSION_KEY);
      setSession(null);
      return;
    }
    await supabase.auth.signOut();
  }

  async function handleSaveProduct(e) {
    e.preventDefault();
    setSaving(true);

    let image_url = formData.image_url;
    let file_url = formData.file_url;

    // Upload image
    if (imageFile) {
      const ext = imageFile.name.split('.').pop();
      const path = `${Date.now()}.${ext}`;
      await supabase.storage.from('product-images').upload(path, imageFile, { upsert: true });
      const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(path);
      image_url = urlData.publicUrl;
    }

    // Upload product file
    if (productFile) {
      const ext = productFile.name.split('.').pop();
      const path = `${Date.now()}.${ext}`;
      await supabase.storage.from('products').upload(path, productFile, { upsert: true });
      file_url = path;
    }

    const payload = {
      ...formData,
      image_url,
      file_url,
      original_price: formData.original_price ? Number(formData.original_price) : null,
      sale_price: Number(formData.sale_price),
      bundle_items: formData.bundle_items
        ? formData.bundle_items.split('\n').map(s => s.trim()).filter(Boolean)
        : [],
      updated_at: new Date().toISOString(),
    };

    if (formData.id) {
      await supabase.from('products').update(payload).eq('id', formData.id);
    } else {
      delete payload.id;
      await supabase.from('products').insert(payload);
    }

    setSaving(false);
    setShowForm(false);
    setFormData(defaultForm());
    fetchProducts();
  }

  async function handleDelete(id) {
    if (!confirm('Delete this product?')) return;
    await supabase.from('products').delete().eq('id', id);
    fetchProducts();
  }

  async function handleResendDownload(order) {
    const urls = await Promise.all(
      (order.products || []).map(async (p) => {
        if (!p.file_url) return null;
        const { data } = await supabase.storage.from('products').createSignedUrl(p.file_url, 3600 * 72);
        return data?.signedUrl;
      })
    );
    alert('Signed URLs (72h):\n' + urls.filter(Boolean).join('\n'));
  }

  function editProduct(product) {
    setFormData({
      ...product,
      bundle_items: Array.isArray(product.bundle_items) ? product.bundle_items.join('\n') : '',
    });
    setShowForm(true);
  }

  // ── Login Screen ───────────────────────────────────────────────
  if (!session) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'var(--background)' }}>

        {/* Logo mark */}
        <div style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.5rem', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 20 20" fill="var(--primary-foreground)" style={{ width: '1.25rem', height: '1.25rem' }}>
              <path d="M10 2L3 7v11h5v-5h4v5h5V7L10 2z" />
            </svg>
          </div>
          <span style={{ fontFamily: 'Anton, sans-serif', fontSize: '0.85rem', letterSpacing: '0.15em', color: 'var(--muted-foreground)', textTransform: 'uppercase' }}>
            The Plug Suppliers
          </span>
        </div>

        <div style={{ width: '100%', maxWidth: '22rem' }}>
        <GlowCard glowColor="green">
          <div style={{ padding: '2rem' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <h1 style={{ fontFamily: 'Anton, sans-serif', fontSize: '1.75rem', letterSpacing: '0.04em', color: 'var(--foreground)', margin: 0 }}>
              WELCOME BACK
            </h1>
            <p style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)', marginTop: '0.4rem', letterSpacing: '0.05em' }}>
              Admin access only
            </p>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Email */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              <label style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted-foreground)' }}>
                Email
              </label>
              <input
                type="email"
                required
                placeholder="admin@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ width: '100%', background: 'rgba(0,0,0,0.35)', border: '1px solid var(--border)', borderRadius: '0.5rem', padding: '0.65rem 0.875rem', color: 'var(--foreground)', fontSize: '0.875rem', outline: 'none', transition: 'border-color 0.15s', boxSizing: 'border-box' }}
                onFocus={e => { e.target.style.borderColor = 'var(--primary)'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--border)'; }}
              />
            </div>

            {/* Password */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              <label style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted-foreground)' }}>
                Password
              </label>
              <AdminPasswordField value={password} onChange={e => setPassword(e.target.value)} />
            </div>

            {/* Error */}
            {authError && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.625rem 0.875rem', borderRadius: '0.5rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
                <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: '0.875rem', height: '0.875rem', flexShrink: 0, color: '#f87171' }}>
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p style={{ fontSize: '0.8rem', color: '#f87171', margin: 0 }}>{authError}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={authLoading}
              style={{ marginTop: '0.25rem', width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: 'none', background: authLoading ? 'rgba(52,211,153,0.5)' : 'var(--primary)', color: 'var(--primary-foreground)', fontFamily: 'Anton, sans-serif', fontSize: '0.95rem', letterSpacing: '0.12em', cursor: authLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'background 0.15s' }}
              onMouseEnter={e => { if (!authLoading) e.currentTarget.style.background = '#10b981'; }}
              onMouseLeave={e => { if (!authLoading) e.currentTarget.style.background = 'var(--primary)'; }}
            >
              {authLoading ? (
                <>
                  <svg style={{ width: '1rem', height: '1rem', animation: 'spin 1s linear infinite' }} viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
                    <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  SIGNING IN...
                </>
              ) : 'SIGN IN'}
            </button>
          </form>
          </div>
        </GlowCard>
        </div>

        <p style={{ marginTop: '1.5rem', fontSize: '0.7rem', color: 'var(--muted-foreground)', opacity: 0.5, letterSpacing: '0.05em' }}>
          Restricted area — authorised personnel only
        </p>
      </div>
    );
  }

  // ── CRM Dashboard ──────────────────────────────────────────────
  const VIEW_META = {
    dashboard: { title: 'Dashboard', subtitle: 'Overview of your store performance' },
    products:  { title: 'Products',  subtitle: 'Manage vendor lists and bundles' },
    orders:    { title: 'Orders',    subtitle: 'All checkout sessions and fulfillment' },
    customers: { title: 'Customers', subtitle: 'Buyers ranked by lifetime value' },
    settings:  { title: 'Settings',  subtitle: 'Session and environment info' },
  };

  // Derived metrics
  const paidOrders = orders.filter(o => o.status === 'paid');
  const revenue = paidOrders.reduce((s, o) => s + Number(o.total || 0), 0);
  const customers = (() => {
    const map = new Map();
    paidOrders.forEach(o => {
      const email = o.customer_email || 'unknown';
      const prev = map.get(email) || { email, orders: 0, total: 0, last: null };
      prev.orders += 1;
      prev.total += Number(o.total || 0);
      const at = o.created_at ? new Date(o.created_at) : null;
      if (at && (!prev.last || at > prev.last)) prev.last = at;
      map.set(email, prev);
    });
    return Array.from(map.values()).sort((a, b) => b.total - a.total);
  })();

  const KPI = [
    { label: 'Revenue',   value: `$${revenue.toFixed(2)}`, sub: `${paidOrders.length} paid orders`, accent: 'var(--primary)' },
    { label: 'Orders',    value: orders.length,            sub: `${paidOrders.length} paid · ${orders.length - paidOrders.length} pending` },
    { label: 'Customers', value: customers.length,         sub: 'Unique buyers' },
    { label: 'Products',  value: products.length,          sub: `${products.filter(p => p.active).length} active` },
  ];

  const meta = VIEW_META[view] || VIEW_META.dashboard;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)', color: 'var(--foreground)' }}>
      {/* Top header bar */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 20,
          backdropFilter: 'blur(16px)',
          background: 'rgba(10,10,15,0.85)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: 'clamp(1rem, 2vw, 1.25rem) clamp(1rem, 4vw, 2.5rem)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <p style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--primary)', margin: 0 }}>
              CRM · {session?.user?.email || 'admin'}
            </p>
            <h1 className="font-['Anton']" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.1rem)', letterSpacing: '0.03em', margin: '0.15rem 0 0' }}>
              {meta.title.toUpperCase()}
            </h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)', margin: '0.15rem 0 0' }}>
              {meta.subtitle}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <Link
              to="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.6rem 0.9rem',
                background: 'transparent',
                color: 'var(--foreground)',
                border: '1px solid var(--border)',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                fontSize: '0.78rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21V9a2 2 0 012-2h2a2 2 0 012 2v12" />
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
              View Store
            </Link>
            <button
              onClick={handleLogout}
              style={{
                padding: '0.6rem 0.9rem',
                background: 'transparent',
                color: 'var(--muted-foreground)',
                border: '1px solid var(--border)',
                borderRadius: '0.5rem',
                fontSize: '0.78rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                cursor: 'pointer',
              }}
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: 'clamp(1.5rem, 3vw, 2.5rem) clamp(1rem, 4vw, 2.5rem)' }}>
        {/* ── DASHBOARD ── */}
        {view === 'dashboard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* KPI tiles */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {KPI.map((k) => (
                <div
                  key={k.label}
                  style={{
                    padding: '1.1rem 1.25rem',
                    background: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '0.85rem',
                  }}
                >
                  <p style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted-foreground)', margin: 0 }}>
                    {k.label}
                  </p>
                  <p
                    className="font-['Anton']"
                    style={{ fontSize: 'clamp(1.5rem, 3vw, 2.1rem)', letterSpacing: '0.02em', margin: '0.4rem 0 0', color: k.accent || 'var(--foreground)' }}
                  >
                    {k.value}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', margin: '0.25rem 0 0' }}>{k.sub}</p>
                </div>
              ))}
            </div>

            {/* Recent activity grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
              {/* Recent orders */}
              <div style={{ ...adminCardStyle, gridColumn: 'span 2' }} className="lg:col-span-2">
                <div style={cardHeaderStyle}>
                  <h2 className="font-['Anton']" style={{ fontSize: '1.05rem', letterSpacing: '0.05em', margin: 0 }}>RECENT ORDERS</h2>
                  <button onClick={() => setView('orders')} style={linkButtonStyle}>View all →</button>
                </div>
                {orders.length === 0 ? (
                  <EmptyState text="No orders yet" />
                ) : (
                  <CrmTable
                    rows={orders.slice(0, 6).map(o => [
                      o.customer_email || '—',
                      `$${Number(o.total || 0).toFixed(2)}`,
                      <StatusPill status={o.status} />,
                      o.created_at ? new Date(o.created_at).toLocaleDateString() : '—',
                    ])}
                    headers={['Customer', 'Total', 'Status', 'Date']}
                  />
                )}
              </div>

              {/* Top customers */}
              <div style={adminCardStyle}>
                <div style={cardHeaderStyle}>
                  <h2 className="font-['Anton']" style={{ fontSize: '1.05rem', letterSpacing: '0.05em', margin: 0 }}>TOP CUSTOMERS</h2>
                  <button onClick={() => setView('customers')} style={linkButtonStyle}>View all →</button>
                </div>
                {customers.length === 0 ? (
                  <EmptyState text="No customers yet" />
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {customers.slice(0, 6).map((c, i) => (
                      <div key={c.email} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.65rem 1rem', borderTop: i === 0 ? 'none' : '1px solid var(--border)' }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--accent)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.75rem', flexShrink: 0 }}>
                          {c.email[0]?.toUpperCase() || '?'}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: '0.8rem', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {c.email}
                          </p>
                          <p style={{ fontSize: '0.7rem', color: 'var(--muted-foreground)', margin: 0 }}>
                            {c.orders} order{c.orders !== 1 ? 's' : ''}
                          </p>
                        </div>
                        <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>${c.total.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── PRODUCTS ── */}
        {view === 'products' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)', margin: 0 }}>
                {products.length} total · {products.filter(p => p.active).length} active
              </p>
              <button
                onClick={() => { setFormData(defaultForm()); setShowForm(true); }}
                style={primaryButtonStyle}
              >
                + Add Product
              </button>
            </div>

            {/* Product form */}
            {showForm && (
              <form onSubmit={handleSaveProduct} style={{ ...adminCardStyle, padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', borderColor: 'var(--primary)' }}>
                <h2 className="font-['Anton']" style={{ fontSize: '1.1rem', letterSpacing: '0.04em', margin: 0, color: 'var(--primary)' }}>
                  {formData.id ? 'EDIT PRODUCT' : 'NEW PRODUCT'}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Name" required>
                    <input required value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} className="admin-input" />
                  </Field>
                  <Field label="Slug" required>
                    <input required value={formData.slug} onChange={e => setFormData(p => ({ ...p, slug: e.target.value }))} className="admin-input" />
                  </Field>
                  <Field label="Original Price">
                    <input type="number" step="0.01" value={formData.original_price} onChange={e => setFormData(p => ({ ...p, original_price: e.target.value }))} className="admin-input" />
                  </Field>
                  <Field label="Sale Price" required>
                    <input type="number" step="0.01" required value={formData.sale_price} onChange={e => setFormData(p => ({ ...p, sale_price: e.target.value }))} className="admin-input" />
                  </Field>
                  <Field label="Category">
                    <input value={formData.category} onChange={e => setFormData(p => ({ ...p, category: e.target.value }))} className="admin-input" />
                  </Field>
                  <Field label="Stripe Price ID">
                    <input value={formData.stripe_price_id} onChange={e => setFormData(p => ({ ...p, stripe_price_id: e.target.value }))} className="admin-input" placeholder="price_xxx" />
                  </Field>
                </div>

                <Field label="Description">
                  <textarea rows={3} value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} className="admin-input" style={{ resize: 'none' }} />
                </Field>

                <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
                  {[['is_bundle', 'Is Bundle'], ['is_on_sale', 'On Sale'], ['active', 'Active']].map(([key, label]) => (
                    <label key={key} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--muted-foreground)', cursor: 'pointer' }}>
                      <input type="checkbox" checked={formData[key]} onChange={e => setFormData(p => ({ ...p, [key]: e.target.checked }))} />
                      {label}
                    </label>
                  ))}
                </div>

                {formData.is_bundle && (
                  <Field label="Bundle Items (one per line)">
                    <textarea rows={4} value={formData.bundle_items} onChange={e => setFormData(p => ({ ...p, bundle_items: e.target.value }))} className="admin-input" style={{ resize: 'none' }} placeholder={'Shirt Supplier\nCologne Supplier'} />
                  </Field>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Product Image">
                    <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} style={{ color: 'var(--muted-foreground)', fontSize: '0.85rem' }} />
                  </Field>
                  <Field label="Product File (PDF)">
                    <input type="file" accept=".pdf,.xlsx,.csv,.zip" onChange={e => setProductFile(e.target.files[0])} style={{ color: 'var(--muted-foreground)', fontSize: '0.85rem' }} />
                  </Field>
                </div>

                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  <button type="submit" disabled={saving} style={{ ...primaryButtonStyle, opacity: saving ? 0.6 : 1 }}>
                    {saving ? 'Saving…' : 'Save Product'}
                  </button>
                  <button type="button" onClick={() => setShowForm(false)} style={ghostButtonStyle}>
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Products table */}
            <div style={{ ...adminCardStyle, padding: 0 }}>
              {products.length === 0 ? (
                <EmptyState text="No products yet — click '+ Add Product' to create one." padding />
              ) : (
                <CrmTable
                  headers={['Name', 'Price', 'Category', 'Status', '']}
                  rows={products.map((p) => [
                    <span style={{ fontWeight: 700 }}>{p.name}</span>,
                    `$${Number(p.sale_price).toFixed(2)}`,
                    p.category || '—',
                    <StatusPill status={p.active ? 'active' : 'inactive'} />,
                    <div style={{ display: 'flex', gap: '0.6rem' }}>
                      <button onClick={() => editProduct(p)} style={tinyLinkStyle}>Edit</button>
                      <button onClick={() => handleDelete(p.id)} style={{ ...tinyLinkStyle, color: 'var(--destructive)' }}>Delete</button>
                    </div>,
                  ])}
                />
              )}
            </div>
          </div>
        )}

        {/* ── ORDERS ── */}
        {view === 'orders' && (
          <div style={{ ...adminCardStyle, padding: 0 }}>
            {orders.length === 0 ? (
              <EmptyState text="No orders yet." padding />
            ) : (
              <CrmTable
                headers={['Customer', 'Total', 'Status', 'Date', '']}
                rows={orders.map((o) => [
                  o.customer_email || '—',
                  `$${Number(o.total || 0).toFixed(2)}`,
                  <StatusPill status={o.status} />,
                  o.created_at ? new Date(o.created_at).toLocaleDateString() : '—',
                  o.status === 'paid' ? (
                    <button onClick={() => handleResendDownload(o)} style={tinyLinkStyle}>Resend</button>
                  ) : null,
                ])}
              />
            )}
          </div>
        )}

        {/* ── CUSTOMERS ── */}
        {view === 'customers' && (
          <div style={{ ...adminCardStyle, padding: 0 }}>
            {customers.length === 0 ? (
              <EmptyState text="No customers yet — orders will populate this view." padding />
            ) : (
              <CrmTable
                headers={['Customer', 'Orders', 'Lifetime Value', 'Last Order']}
                rows={customers.map((c) => [
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--accent)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.7rem' }}>
                      {c.email[0]?.toUpperCase() || '?'}
                    </div>
                    {c.email}
                  </div>,
                  c.orders,
                  `$${c.total.toFixed(2)}`,
                  c.last ? c.last.toLocaleDateString() : '—',
                ])}
              />
            )}
          </div>
        )}

        {/* ── SETTINGS ── */}
        {view === 'settings' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div style={adminCardStyle}>
              <div style={cardHeaderStyle}>
                <h2 className="font-['Anton']" style={{ fontSize: '1.05rem', letterSpacing: '0.05em', margin: 0 }}>SESSION</h2>
              </div>
              <div style={{ padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
                <Row k="Email" v={session?.user?.email || '—'} />
                <Row k="User ID" v={session?.user?.id || '—'} />
                <Row k="Mode" v={session?._dev ? 'Dev bypass (testing)' : 'Supabase auth'} />
              </div>
            </div>

            <div style={adminCardStyle}>
              <div style={cardHeaderStyle}>
                <h2 className="font-['Anton']" style={{ fontSize: '1.05rem', letterSpacing: '0.05em', margin: 0 }}>STORE</h2>
              </div>
              <div style={{ padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
                <Row k="Active products" v={products.filter(p => p.active).length} />
                <Row k="Total products" v={products.length} />
                <Row k="Paid orders" v={paidOrders.length} />
                <Row k="Lifetime revenue" v={`$${revenue.toFixed(2)}`} />
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .admin-input {
          width: 100%;
          background: var(--input);
          border: 1px solid var(--border);
          border-radius: 0.5rem;
          padding: 0.6rem 0.85rem;
          color: var(--foreground);
          font-size: 0.875rem;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
          box-sizing: border-box;
        }
        .admin-input:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(52,211,153,0.18);
        }
      `}</style>
    </div>
  );
}

// ── Small helpers ─────────────────────────────────────────────
const adminCardStyle = {
  background: 'var(--card)',
  border: '1px solid var(--border)',
  borderRadius: '0.85rem',
  overflow: 'hidden',
};
const cardHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0.85rem 1.25rem',
  borderBottom: '1px solid var(--border)',
};
const linkButtonStyle = {
  background: 'transparent',
  border: 'none',
  color: 'var(--primary)',
  fontSize: '0.75rem',
  fontWeight: 700,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  cursor: 'pointer',
};
const primaryButtonStyle = {
  padding: '0.65rem 1.25rem',
  background: 'var(--primary)',
  color: 'var(--primary-foreground)',
  border: 'none',
  borderRadius: '0.5rem',
  fontFamily: 'Anton, sans-serif',
  fontSize: '0.85rem',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  cursor: 'pointer',
};
const ghostButtonStyle = {
  padding: '0.65rem 1.25rem',
  background: 'transparent',
  color: 'var(--muted-foreground)',
  border: '1px solid var(--border)',
  borderRadius: '0.5rem',
  fontSize: '0.8rem',
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  cursor: 'pointer',
};
const tinyLinkStyle = {
  background: 'transparent',
  border: 'none',
  color: 'var(--primary)',
  fontSize: '0.75rem',
  fontWeight: 700,
  cursor: 'pointer',
  padding: 0,
};

function StatusPill({ status }) {
  const map = {
    paid:    { bg: 'rgba(52,211,153,0.15)', fg: 'var(--primary)',  label: 'Paid' },
    active:  { bg: 'rgba(52,211,153,0.15)', fg: 'var(--primary)',  label: 'Active' },
    pending: { bg: 'rgba(250,204,21,0.15)', fg: '#facc15',         label: 'Pending' },
    failed:  { bg: 'rgba(239,68,68,0.15)',  fg: '#f87171',         label: 'Failed' },
    inactive:{ bg: 'rgba(239,68,68,0.10)',  fg: '#f87171',         label: 'Inactive' },
  };
  const s = map[status] || { bg: 'var(--accent)', fg: 'var(--muted-foreground)', label: status || '—' };
  return (
    <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: 999, background: s.bg, color: s.fg }}>
      {s.label}
    </span>
  );
}

function CrmTable({ headers, rows }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th
                key={i}
                style={{
                  textAlign: 'left',
                  padding: '0.7rem 1rem',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: 'var(--muted-foreground)',
                  borderBottom: '1px solid var(--border)',
                  background: 'rgba(255,255,255,0.02)',
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
              {row.map((cell, j) => (
                <td key={j} style={{ padding: '0.75rem 1rem', color: 'var(--foreground)' }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EmptyState({ text, padding }) {
  return (
    <p style={{ textAlign: 'center', padding: padding ? '2.5rem 1rem' : '1.25rem', color: 'var(--muted-foreground)', fontSize: '0.9rem', margin: 0 }}>
      {text}
    </p>
  );
}

function Row({ k, v }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
      <span style={{ color: 'var(--muted-foreground)' }}>{k}</span>
      <span style={{ fontWeight: 600, textAlign: 'right', wordBreak: 'break-all' }}>{v}</span>
    </div>
  );
}

function defaultForm() {
  return {
    id: null,
    name: '',
    slug: '',
    description: '',
    original_price: '',
    sale_price: '',
    is_on_sale: true,
    category: '',
    image_url: '',
    file_url: '',
    is_bundle: false,
    bundle_items: '',
    stripe_price_id: '',
    stripe_product_id: '',
    active: true,
  };
}

function Field({ label, required, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
      <label style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted-foreground)' }}>
        {label}{required && <span style={{ color: 'var(--primary)' }}> *</span>}
      </label>
      {children}
    </div>
  );
}

function AdminPasswordField({ value, onChange }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <input
        type={show ? 'text' : 'password'}
        required
        placeholder="Enter your password"
        value={value}
        onChange={onChange}
        style={{ width: '100%', background: 'rgba(0,0,0,0.35)', border: '1px solid var(--border)', borderRadius: '0.5rem', padding: '0.65rem 2.75rem 0.65rem 0.875rem', color: 'var(--foreground)', fontSize: '0.875rem', outline: 'none', transition: 'border-color 0.15s', boxSizing: 'border-box' }}
        onFocus={e => { e.target.style.borderColor = 'var(--primary)'; }}
        onBlur={e => { e.target.style.borderColor = 'var(--border)'; }}
      />
      <button
        type="button"
        onClick={() => setShow(s => !s)}
        tabIndex={-1}
        style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted-foreground)', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        aria-label={show ? 'Hide password' : 'Show password'}
      >
        {show ? (
          /* Eye-off */
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} style={{ width: '1rem', height: '1rem' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
          </svg>
        ) : (
          /* Eye */
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} style={{ width: '1rem', height: '1rem' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        )}
      </button>
    </div>
  );
}
