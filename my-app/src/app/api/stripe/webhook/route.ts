// File: src/app/api/stripe/webhook/route.ts

import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { client } from '@/sanity/lib/client'

// Type for payment details
interface PaymentDetails {
  transactionId: string;
  paymentAmount: number;
  paymentMethod: string;
  paymentDate: string;
}

// 1) Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia',
})

// 2) Batāo Next.js ko Node.js runtime me chalānā hai
export const runtime = 'nodejs'

// 3) Sirf POST handler export karo
export async function POST(request: NextRequest) {
  // 3a) Raw body le lo as text
  const rawBody = await request.text()
  const sig = request.headers.get('stripe-signature')!
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

  let event: Stripe.Event
  try {
    // 3b) signature verify karo using Buffer.from(rawBody)
    event = stripe.webhooks.constructEvent(
      Buffer.from(rawBody),
      sig,
      webhookSecret
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json(
      { error: `Webhook Error: ${err}` },
      { status: 400 }
    )
  }

  // 3c) Agar checkout.session.completed ho, to order update karo
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const sanityOrderId = session.metadata?.sanityOrderId

    if (sanityOrderId) {
      try {
        // Prepare payment details with type safety
        const paymentDetails: PaymentDetails = {
          transactionId: session.payment_intent?.toString() || '',
          paymentAmount: session.amount_total ? session.amount_total / 100 : 0,
          paymentMethod: 'Stripe',
          paymentDate: new Date().toISOString(),
        }

        // Update the existing order in Sanity
        await client.patch(sanityOrderId)
          .set({
            orderStatus: 'paid',
            paymentDetails,
          })
          .commit()

        // Clear the user's cart after payment
        const userId = session.metadata?.userId;
        console.log('Webhook: userId from session.metadata:', userId);
        const cartQuery = `*[_type == "cart" && user._ref == $userId][0]`;
        const cartDoc = await client.fetch(cartQuery, { userId });
        console.log('Webhook: cartDoc found:', cartDoc ? cartDoc._id : 'No cart found for this userId');
        if (cartDoc && cartDoc._id) {
          await client.patch(cartDoc._id)
            .set({ items: [], grandTotal: 0 })
            .commit();
          console.log('Webhook: Cart cleared for userId:', userId);
        } else {
          console.log('Webhook: No cart to clear for userId:', userId);
        }
      } catch (err) {
        console.error('Error updating order in webhook:', err)
      }
    } else {
      console.error('No sanityOrderId found in Stripe session metadata.')
    }
  }

  return NextResponse.json({ received: true })
}
