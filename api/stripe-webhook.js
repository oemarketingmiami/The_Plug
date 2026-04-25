import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { buffer } from 'micro';
import crypto from 'crypto';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const sig = req.headers['stripe-signature'];
  const rawBody = await buffer(req);

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Payment succeeded — fulfill the order
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    const downloadToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 72 * 60 * 60 * 1000); // 72 hours

    const { data: order } = await supabase
      .from('orders')
      .update({
        status: 'paid',
        download_token: downloadToken,
        download_expires_at: expiresAt.toISOString(),
        stripe_payment_intent: session.payment_intent,
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_session_id', session.id)
      .select()
      .single();

    if (order) {
      console.log(`Order fulfilled: ${order.id}, token: ${downloadToken}`);
    }
  }

  // Payment failed / expired
  if (event.type === 'checkout.session.expired') {
    const session = event.data.object;
    await supabase
      .from('orders')
      .update({ status: 'failed', updated_at: new Date().toISOString() })
      .eq('stripe_session_id', session.id);
  }

  res.status(200).json({ received: true });
}
