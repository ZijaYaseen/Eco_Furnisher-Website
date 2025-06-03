// /app/api/checkout/route.ts (ya jahan aapka checkout API hai)

import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { client } from '@/sanity/lib/client';
import Stripe from 'stripe';

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET as string);
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-01-27.acacia',
});

interface OrderItem {
  product: {
    _ref: string;
    name: string;
    imageSet: string[];
  };
  quantity: number;
  subtotal: number;  // already includes quantity * per-unit price
}

export async function POST(req: NextRequest) {
  try {
    // 1) Authentication
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authentication required. Please log in.' },
        { status: 401 }
      );
    }

    let userId: string;
    try {
      const { payload } = await jwtVerify(token, SECRET_KEY);
      userId = (payload as { _id: string })._id;
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid session. Please log in again.' },
        { status: 401 }
      );
    }

    // 2) Parse request body
    const { billingDetails, paymentMethod, orderItems, orderTotal } = await req.json();

    // 3) Validation
    const validationErrors: string[] = [];
    if (!billingDetails?.firstName) validationErrors.push('First name required');
    if (!billingDetails?.lastName) validationErrors.push('Last name required');
    if (!billingDetails?.email) validationErrors.push('Email required');
    if (!billingDetails?.phone) validationErrors.push('Phone required');
    if (!paymentMethod) validationErrors.push('Payment method missing');
    if (!orderItems || orderItems.length === 0) validationErrors.push('Order items missing');
    if (!orderTotal || orderTotal <= 0) validationErrors.push('Invalid order total');
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: validationErrors },
        { status: 400 }
      );
    }

    // 4) Create pending order in Sanity
    const sanityOrderItems = orderItems.map((item: OrderItem) => ({
      product: { _type: 'reference', _ref: item.product._ref },
      quantity: item.quantity,
      subtotal: item.subtotal,
    }));

    const newOrder = {
      _type: 'order',
      user: { _type: 'reference', _ref: userId },
      billingDetails: {
        ...billingDetails,
        country: billingDetails.country || 'USA',
      },
      paymentMethod: paymentMethod === 'stripe' ? 'stripe' : 'paypal',
      orderItems: sanityOrderItems,
      orderTotal,
      orderStatus: 'pending',
      createdAt: new Date().toISOString(),
    };
    const createdOrder = await client.create(newOrder);

    // 5) Handle Stripe payments
    if (paymentMethod === 'stripe') {
      try {
        //    ――――――――――――――――――――――――――――――
        //    |  Yahan per-unit price calculate kar ke send karenge  |
        //    ――――――――――――――――――――――――――――――
        const lineItems = orderItems.map((item: OrderItem) => {
          // per-unit price in dollars:
          const perUnitPrice = item.subtotal / item.quantity;
          return {
            price_data: {
              currency: 'usd',
              product_data: {
                name: item.product.name,
                images: [item.product.imageSet[0]],
              },
              unit_amount: Math.round(perUnitPrice * 100), 
              // eg: item.subtotal=42.50, quantity=2 → perUnitPrice=21.25 → unit_amount=2125
            },
            quantity: item.quantity, 
            // Stripe will calculate total = 2125 * 2 = 4250 cents ($42.50)
          };
        });

        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: lineItems,
          mode: 'payment',
          success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/order-success?orderId=${createdOrder._id}`,
          cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout`,
          metadata: {
            sanityOrderId: createdOrder._id,
            userId,
          },
          customer_email: billingDetails.email,
        });

        return NextResponse.json(
          { success: true, url: session.url },
          { status: 200 }
        );
      } catch (error) {
        console.error('Stripe error:', error);
        return NextResponse.json(
          { success: false, error: `Stripe Error: ${error}` },
          { status: 500 }
        );
      }
    }

    // 6) Handle PayPal payments…
    if (paymentMethod === 'paypal') {
      return NextResponse.json(
        { 
          success: true, 
          redirectTo: `/api/paypal/create-order?orderId=${createdOrder._id}&total=${orderTotal}`,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Invalid payment method' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Checkout API error:', error);
    return NextResponse.json(
      { success: false, error: 'Checkout process failed. Please contact support.' },
      { status: 500 }
    );
  }
}
