import React from 'react';

export default function Terms() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 1.5rem', color: 'var(--muted-foreground)' }}>
      <h1 style={{ fontFamily: 'Anton, sans-serif', fontSize: '3rem', color: 'var(--foreground)', marginBottom: '2rem' }}>TERMS OF SERVICE</h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', lineHeight: '1.6' }}>
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <section>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--foreground)', marginBottom: '0.5rem' }}>1. Agreement to Terms</h2>
          <p>By accessing or using ThePlugSuppliers website and purchasing our digital products, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access our service.</p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--foreground)', marginBottom: '0.5rem' }}>2. Digital Products</h2>
          <p>We provide digital vendor and supplier lists in PDF or similar digital formats. These are not physical goods. Upon successful payment, you will receive a secure download link. It is your responsibility to download and save the file to your device.</p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--foreground)', marginBottom: '0.5rem' }}>3. Intellectual Property</h2>
          <p>All content provided, including but not limited to the compiled lists of vendors, text, graphics, and logos, is the property of ThePlugSuppliers. You are granted a limited, non-exclusive license to use these lists for your personal or business sourcing needs. You may not resell, redistribute, or publicly share these digital products.</p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--foreground)', marginBottom: '0.5rem' }}>4. Disclaimer of Warranties</h2>
          <p>The vendor lists are provided "as is". We do not guarantee the response times, pricing, or product quality of the third-party vendors listed in our documents. Engaging in business with any vendor on our lists is done at your own risk.</p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--foreground)', marginBottom: '0.5rem' }}>5. Limitation of Liability</h2>
          <p>In no event shall ThePlugSuppliers be liable for any indirect, incidental, special, consequential or punitive damages arising out of your access to, use of, or inability to use the information provided in our digital products.</p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--foreground)', marginBottom: '0.5rem' }}>6. Changes</h2>
          <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.</p>
        </section>
      </div>
    </div>
  );
}
