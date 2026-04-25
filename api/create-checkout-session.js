import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { cartItems, customerEmail } = req.body;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    if (!customerEmail) {
      return res.status(400).json({ error: 'Customer email is required' });
    }

    // Build line items from cart
    const lineItems = cartItems.map(item => ({
      price: item.stripe_price_id,
      quantity: 1,
    }));

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: customerEmail,
      line_items: lineItems,
      success_url: `${process.env.VITE_SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.VITE_SITE_URL}/cart`,
      metadata: {
        product_ids: cartItems.map(i => i.id).join(','),
      },
    });

    // Create pending order in Supabase
    await supabase.from('orders').insert({
      customer_email: customerEmail,
      stripe_session_id: session.id,
      products: cartItems,
      total: cartItems.reduce((sum, i) => sum + Number(i.sale_price), 0),
      status: 'pending',
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Checkout error:', err);
    res.status(500).json({ error: err.message });
  }
}
