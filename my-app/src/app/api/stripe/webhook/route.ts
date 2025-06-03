// File: src/app/api/stripe/webhook/route.ts

import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { client } from '@/sanity/lib/client'

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

  // 3c) Agar checkout.session.completed ho, to order update and cart clear karo
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    const sanityOrderId = session.metadata?.sanityOrderId as string
    const userId        = session.metadata?.userId        as string

    if (sanityOrderId) {
      try {
        await client
          .patch(sanityOrderId)
          .set({
            paymentMethod: 'stripe',
            paymentDetails: {
              transactionId: session.payment_intent?.toString() || '',
              paymentAmount:  session.amount_total ? session.amount_total / 100 : 0,
              paymentMethod:  'Stripe',
              paymentDate:    new Date().toISOString(),
            },
            orderStatus: 'paid',
          })
          .commit()
      } catch (err) {
        console.error('Error updating order in webhook:', err)
      }
    }

    if (userId) {
      try {
        const cartQuery = `*[_type == "cart" && user._ref == $userId][0]._id`
        const cartId = await client.fetch<string>(cartQuery, { userId })
        if (cartId) {
          await client.patch(cartId).set({ items: [] }).commit()
        }
      } catch (err) {
        console.error('Error clearing cart in webhook:', err)
      }
    }
  }

  return NextResponse.json({ received: true })
}
