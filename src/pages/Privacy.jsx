import React from 'react';

export default function Privacy() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 1.5rem', color: 'var(--muted-foreground)' }}>
      <h1 style={{ fontFamily: 'Anton, sans-serif', fontSize: '3rem', color: 'var(--foreground)', marginBottom: '2rem' }}>PRIVACY POLICY</h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', lineHeight: '1.6' }}>
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <section>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--foreground)', marginBottom: '0.5rem' }}>1. Information We Collect</h2>
          <p>We only collect the information necessary to process your transactions and deliver your digital products. This includes:</p>
          <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <li>Email address (for sending download links and receipts).</li>
            <li>Payment details (processed securely via Stripe; we do not store your full credit card number).</li>
          </ul>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--foreground)', marginBottom: '0.5rem' }}>2. How We Use Your Information</h2>
          <p>The information we collect is used in the following ways:</p>
          <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <li>To process your transactions and deliver the purchased digital goods.</li>
            <li>To send you important updates regarding your order.</li>
            <li>To respond to your customer service requests.</li>
          </ul>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--foreground)', marginBottom: '0.5rem' }}>3. Information Protection</h2>
          <p>We implement a variety of security measures to maintain the safety of your personal information when you place an order. All payment transactions are processed through a gateway provider (Stripe) and are not stored or processed on our servers.</p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--foreground)', marginBottom: '0.5rem' }}>4. Third-Party Disclosure</h2>
          <p>We do not sell, trade, or otherwise transfer your Personally Identifiable Information to outside parties. This does not include trusted third parties who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential.</p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--foreground)', marginBottom: '0.5rem' }}>5. Consent</h2>
          <p>By using our site, you consent to our website's privacy policy.</p>
        </section>
      </div>
    </div>
  );
}
