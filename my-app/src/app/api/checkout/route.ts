// /app/api/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { client } from '@/sanity/lib/client';

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET as string);
interface BillingDetails {
  firstName: string;
  lastName: string;
  companyName?: string;
  country: string;
  streetAddress: string;
  town: string;
  province: string;
  zip: string;
  phone: string;
  email: string;
}

interface OrderItem {
  product: { _type: 'reference'; _ref: string }; // Reference to the product document
  selectedColor: string;
  selectedSize: string;
  quantity: number;
  subtotal: number;
}

interface PaymentDetails {
  transactionId: string;
  paymentAmount: number;
  paymentCard: string;
}

interface Order {
  _type: 'order';
  billingDetails: BillingDetails;
  paymentMethod: 'cod' | 'bank'; // Cash on Delivery or Direct Bank Transfer
  orderItems: OrderItem[];
  orderTotal: number;
  createdAt: string; // ISO 8601 format (e.g., "2025-01-17T10:00:00Z")
  orderStatus: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  user?: { _type: 'reference'; _ref: string }; // Reference to the user document
  paymentDetails?: PaymentDetails;
}


export async function POST(req: NextRequest) {
  try {
    // Check for user authentication via JWT cookie
    const token = req.cookies.get('token')?.value;
    let userId: string | null = null;
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'User not logged in. Please log in.' },
        { status: 401 }
      );
    }
    try {
      const { payload } = await jwtVerify(token, SECRET_KEY);
      userId = (payload as { _id: string })._id;
    } catch (error) {
      console.log(error);
      return NextResponse.json(
        
        { success: false, error: 'Invalid token. Please log in again.' },
        { status: 401 }
      );
    }

    // Parse checkout data from request body
    const { billingDetails, paymentMethod, orderItems, orderTotal, paymentDetails } = await req.json();

    // Validate required fields (billingDetails, paymentMethod, orderItems, orderTotal)
    if (!billingDetails || !paymentMethod || !orderItems || !orderTotal) {
      return NextResponse.json(
        { success: false, error: 'Missing required checkout data.' },
        { status: 400 }
      );
    }

    // If payment method is 'bank' (direct bank transfer), then instruct client to redirect to payment page
    if (paymentMethod === 'bank' && !paymentDetails) {
      // The client should be redirected to a payment page.
      // Once payment is complete, that page should call this same endpoint with paymentDetails.
      return NextResponse.json(
        { success: false, redirectTo: '/Payment', message: 'Redirect to payment page' },
        { status: 200 }
      );
    }

    // For COD or for bank payments that have been completed, create the Order document.
    const newOrder: Order = {
      _type: 'order',
      billingDetails,
      paymentMethod,
      orderItems,
      orderTotal,
      createdAt: new Date().toISOString(),
      orderStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
    };
    if (userId) {
      newOrder.user = { _type: 'reference', _ref: userId };
    }

    // If the payment is done via bank transfer, include the paymentDetails in the order
    if (paymentMethod === 'bank' && paymentDetails) {
      newOrder.paymentDetails = paymentDetails;
    }

    const createdOrder = await client.create(newOrder);

    return NextResponse.json({ success: true, order: createdOrder });
  } catch (error) {
    console.error('Checkout API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Checkout failed. Please try again.' },
      { status: 500 }
    );
  }
}
