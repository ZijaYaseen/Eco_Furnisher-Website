// File: src/app/api/stripe/webhook/route.ts

import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import {client} from "@/sanity/lib/client"

// 1) Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia',
})

// 2) Initialize Sanity client (apiVersion specify karo)
// sanity client info , 

// 3) Tell Next.js to run this route in Node.js and disable built-in body parsing
export const runtime = 'nodejs'
export const requestBodyParser = false

// 4) Named export POST (App Router requirement)
export async function POST(request: NextRequest) {
  // 4a) Raw body buffer nikaalo
// Raw body string
  const rawBody = await request.text();
  // Ab signature verify kar sakte ho, kyunki text() me exact payload mil jātā.
  const sig = request.headers.get('stripe-signature')!;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

  let event: Stripe.Event
  try {
    // 4b) Signature verify karo aur event construct karo
    event = stripe.webhooks.constructEvent(Buffer.from(rawBody), sig, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json(
      { error: `Webhook Error: ${err}` },
      { status: 400 }
    )
  }

  // 4c) Sirf checkout.session.completed handle karo
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    // 4d) Metadata se pending order ID aur userId nikaalo
    const sanityOrderId  = session.metadata?.sanityOrderId  as string
    const userId         = session.metadata?.userId         as string

    // 4e) Agar sanityOrderId hai, to existing “pending” order ko patch karke “paid” mark karo
    if (sanityOrderId) {
      try {
        await client
          .patch(sanityOrderId)
          .set({
            paymentMethod: 'stripe',
            paymentDetails: {
              transactionId: session.payment_intent?.toString() || '',
              paymentAmount:   session.amount_total ? session.amount_total / 100 : 0,
              paymentMethod:   'Stripe',
              paymentDate:     new Date().toISOString(),
            },
            orderStatus: 'paid',
          })
          .commit()
        // console.log(`Order ${sanityOrderId} updated to paid`)
      } catch (err) {
        console.error('Error updating order in webhook:', err)
      }
    }

    // 4f) User ka cart clear (empty) karo
    if (userId) {
      try {
        // Cart document ID fetch karo jahan user._ref == userId
        const cartQuery = `*[_type == "cart" && user._ref == $userId][0]._id`
        const cartId = await client.fetch<string>(cartQuery, { userId })
        if (cartId) {
          // items ko empty array set kar do
          await client.patch(cartId).set({ items: [] }).commit()
          // console.log(`Cleared cart (${cartId}) for user ${userId}`)
        }
      } catch (err) {
        console.error('Error clearing cart in webhook:', err)
      }
    }
  }

  return NextResponse.json({ received: true })
}
