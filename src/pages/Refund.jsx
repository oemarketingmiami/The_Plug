import React from 'react';

export default function Refund() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 1.5rem', color: 'var(--muted-foreground)' }}>
      <h1 style={{ fontFamily: 'Anton, sans-serif', fontSize: '3rem', color: 'var(--foreground)', marginBottom: '2rem' }}>REFUND POLICY</h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', lineHeight: '1.6' }}>
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <section>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--foreground)', marginBottom: '0.5rem' }}>1. All Sales Are Final</h2>
          <p>Due to the digital nature of our products (downloadable vendor lists and digital supplier directories), <strong>all sales are final and non-refundable</strong>.</p>
          <p style={{ marginTop: '0.5rem' }}>Once you have gained access to the digital file or download link, the product cannot be "returned," and as such, we cannot offer any refunds or exchanges.</p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--foreground)', marginBottom: '0.5rem' }}>2. Exceptional Circumstances</h2>
          <p>If you encounter an issue downloading your file, or if the file is corrupted, please contact our support team immediately. We will manually verify your purchase and ensure you receive working copies of the digital goods you purchased.</p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--foreground)', marginBottom: '0.5rem' }}>3. Unauthorized Use / Chargebacks</h2>
          <p>If a chargeback or dispute is opened after the digital product has been delivered to your email address, we reserve the right to dispute the claim by providing the payment gateway and financial institution with proof of delivery (IP logs, timestamps, and download access records).</p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--foreground)', marginBottom: '0.5rem' }}>4. Contact Us</h2>
          <p>If you have any questions or issues regarding your purchase, please contact us before initiating a dispute so that we can assist you.</p>
        </section>
      </div>
    </div>
  );
}
