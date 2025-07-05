// /app/api/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { client } from '@/sanity/lib/client';
import Stripe from 'stripe';
import { getToken } from "next-auth/jwt";
import { nanoid } from 'nanoid';

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET as string);
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-01-27.acacia',
});

interface OrderItemVariant {
  vid: string;
  quantity: number;
  image: string;
  subtotal: number;
}

interface OrderItem {
  product: {
    _ref: string;
    name: string;
    imageSet: string[];
  };
  variants: OrderItemVariant[];
  Total: number;
}

export async function POST(req: NextRequest) {
  try {
    // 1) Authentication
    const token = req.cookies.get('token')?.value;
    let userId: string | null = null;

    if (token) {
      try {
        const { payload } = await jwtVerify(token, SECRET_KEY);
        userId = (payload as { _id: string })._id;
      } catch {
        // ignore, try next-auth
      }
    }

    // 2) Try NextAuth JWT if manual JWT not found
    if (!userId) {
      const nextAuthToken = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
      if (nextAuthToken && nextAuthToken.email) {
        // Fetch user from Sanity by email
        const query = `*[_type == "user" && email == $email][0]`;
        const sanityUser = await client.fetch(query, { email: nextAuthToken.email });
        if (sanityUser && sanityUser._id) {
          userId = sanityUser._id;
        }
      }
    }

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Authentication required. Please log in.' },
        { status: 401 }
      );
    }

    // 2) Parse request body
    const { billingDetails, shippingDetails, paymentMethod, orderItems, orderTotal, shippingCost = 0, taxAmount = 0 } = await req.json();

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

    // 4) Prepare Sanity order items
    const sanityOrderItems = orderItems.map((item: OrderItem) => ({
      _key: nanoid(),
      product: { _type: 'reference', _ref: item.product._ref },
      variants: item.variants.map(variant => ({
        _key: nanoid(),
        vid: variant.vid,
        quantity: variant.quantity,
        subtotal: variant.subtotal,
        image: variant.image || item.product.imageSet?.[0] || '',
      })),
      Total: item.Total
    }));

    // 5) Create pending order in Sanity
    const newOrder = {
      _type: 'order',
      user: userId ? { _type: 'reference', _ref: userId } : undefined,
      shippingDetails: {
        ...shippingDetails,
        country: shippingDetails?.country || billingDetails.country || 'USA',
      },
      paymentMethod: paymentMethod === 'stripe' ? 'stripe' : 
                     paymentMethod === 'paypal' ? 'paypal' : 'cod',
      orderItems: sanityOrderItems,
      orderTotal,
      shippingCost,
      taxAmount,
      orderStatus: 'pending',
      createdAt: new Date().toISOString(),
    };
    const createdOrder = await client.create(newOrder);

    // 6) Handle Stripe payments
    if (paymentMethod === 'stripe') {
      try {
        // Prepare line items for Stripe
        const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
        orderItems.forEach((item: OrderItem) => {
          item.variants.forEach(variant => {
            // Calculate per-unit price
            const perUnitPrice = variant.subtotal / variant.quantity;
            lineItems.push({
              price_data: {
                currency: 'usd',
                product_data: {
                  name: `${item.product.name} (Variant: ${variant.vid})`,
                  images: [item.product.imageSet[0]],
                },
                unit_amount: Math.round(perUnitPrice * 100),
              },
              quantity: variant.quantity,
            });
          });
        });
        if (shippingCost > 0) {
          lineItems.push({
            price_data: {
              currency: 'usd',
              product_data: { name: 'Shipping' },
              unit_amount: Math.round(shippingCost * 100),
            },
            quantity: 1,
          });
        }
        if (taxAmount > 0) {
          lineItems.push({
            price_data: {
              currency: 'usd',
              product_data: { name: 'Tax' },
              unit_amount: Math.round(taxAmount * 100),
            },
            quantity: 1,
          });
        }
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: lineItems,
          mode: 'payment',
          success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/order-success?orderId=${createdOrder._id}`,
          cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout`,
          metadata: {
            sanityOrderId: createdOrder._id,
            userId: userId || '',
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
          { success: false, error: `Stripe Error: ${error instanceof Error ? error.message : String(error)}` },
          { status: 500 }
        );
      }
    }

    // 7) Handle PayPal payments
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
      { 
        success: false, 
        error: 'Checkout process failed. Please contact support.',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}