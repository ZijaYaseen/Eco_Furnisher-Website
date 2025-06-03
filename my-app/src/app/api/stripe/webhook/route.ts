import { buffer } from 'micro';
import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { createClient } from '@sanity/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia',
});

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const buf = await buffer(req);
    const sig = req.headers['stripe-signature']!;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    } catch (err) {
      console.error(`Webhook error: ${err}`);
      return res.status(400).send(`Webhook Error: ${err}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      const billingDetails = JSON.parse(session.metadata?.billingDetails || '{}');
      const orderItems = JSON.parse(session.metadata?.orderItems || '[]');

      try {
        const orderDoc = {
          _type: 'order',
          stripeSessionId: session.id,
          customerEmail: billingDetails.email,
          billingDetails,
          orderItems,
          orderTotal: session.amount_total ? session.amount_total / 100 : 0,
          paymentMethod: 'stripe',
          paymentDetails: {
            transactionId: session.payment_intent?.toString() || '',
            paymentAmount: session.amount_total ? session.amount_total / 100 : 0,
            paymentMethod: 'Stripe',
            paymentDate: new Date().toISOString(),
          },
          orderStatus: 'paid',  // Corrected field
          createdAt: new Date().toISOString(),
        };

        await client.create(orderDoc);
        console.log('Order saved to Sanity:', orderDoc);
      } catch (error) {
        console.error('Error saving order to Sanity:', error);
      }
    }

    res.status(200).json({ received: true });
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
