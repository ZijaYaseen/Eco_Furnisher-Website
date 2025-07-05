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

  // 3c) Agar checkout.session.completed ho, to order create karo
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    // Get orderMeta from metadata
    let orderMeta: any = null;
    try {
      orderMeta = session.metadata?.orderMeta ? JSON.parse(session.metadata.orderMeta) : null;
    } catch (err) {
      console.error('Error parsing orderMeta:', err);
    }

    if (orderMeta) {
      try {
        // Prepare Sanity order items
        const sanityOrderItems = orderMeta.orderItems.map((item: any) => ({
          product: { _type: 'reference', _ref: item.product._ref },
          variants: item.variants.map((variant: any) => ({
            vid: variant.vid,
            quantity: variant.quantity,
            subtotal: variant.subtotal
          })),
          Total: item.Total
        }));

        // Create order in Sanity
        const newOrder = {
          _type: 'order',
          user: orderMeta.userId ? { _type: 'reference', _ref: orderMeta.userId } : undefined,
          shippingDetails: {
            ...orderMeta.shippingDetails,
            country: orderMeta.shippingDetails?.country || orderMeta.billingDetails?.country || 'USA',
          },
          paymentMethod: orderMeta.paymentMethod,
          orderItems: sanityOrderItems,
          orderTotal: orderMeta.orderTotal,
          shippingCost: orderMeta.shippingCost,
          taxAmount: orderMeta.taxAmount,
          orderStatus: 'paid',
          createdAt: new Date().toISOString(),
          paymentDetails: {
            transactionId: session.payment_intent?.toString() || '',
            paymentAmount: session.amount_total ? session.amount_total / 100 : 0,
            paymentMethod: 'Stripe',
            paymentDate: new Date().toISOString(),
          },
        };
        await client.create(newOrder);
      } catch (err) {
        console.error('Error creating order in webhook:', err);
      }
    }

    // Optionally clear cart here if needed
  }

  return NextResponse.json({ received: true })
}
