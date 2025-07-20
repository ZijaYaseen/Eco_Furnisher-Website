import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { client } from '@/sanity/lib/client';

/** User fields for order reference */
export interface OrderUser {
  _id: string;
  fullName: string;
  email: string;
  image?: string;
  emailVerified?: string;
}

/** Shipping details object */
export interface ShippingDetails {
  firstName: string;
  lastName: string;
  streetAddress: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  email: string;
}

/** Product variant in order item */
export interface OrderItemVariant {
  vid: string;
  quantity: number;
  subtotal: number;
  variantImage?: string;
}

/** Product variant for product and order item */
export interface ProductVariant {
  vid: string;
  variantSellPrice?: number;
  variantSugSellPrice?: number;
  variantActualSellPrice?: number;
  discountPercentage?: number;
  colors?: {
    colorName?: string;
    colorCode?: string;
  };
  variantImage?: string;
}

/** Order item */
export interface OrderItem {
  product: {
    _id: string;
    productNameEn: string;
    productImageSet?: string[];
    variants?: ProductVariant[];
  };
  variants: OrderItemVariant[];
  Total: number;
}

/** Payment details object */
export interface PaymentDetails {
  transactionId?: string;
  paymentAmount?: number;
  paymentMethod?: string;
  paymentDate?: string;
}

/** Mirror your Sanity “order” schema. */
export interface Order {
  _id: string;
  createdAt: string;
  orderStatus: string;
  trackingStatus: string;
  trackingNumber: string;
  user?: OrderUser;
  shippingDetails?: ShippingDetails;
  orderItems?: OrderItem[];
  orderTotal?: number;
  shippingCost?: number;
  taxAmount?: number;
  paymentMethod?: string;
  paymentDetails?: PaymentDetails;
}

/** Only the fields you want to PATCH (all optional). */
export type OrderPatch = Partial<Order>;

/** Helper to guard admin routes via NextAuth JWT. */
async function isAdmin(req: NextRequest): Promise<boolean> {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });
  return Boolean(token && (token as any).role === 'admin');
}

/** GET /api/dashboard/orders → list all orders (admin‑only) */
export async function GET(req: NextRequest) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  // Fetch all orders, sorted newest first, with user and orderItems details
  const orders: Order[] = await client.fetch(
    `*[_type == "order"] | order(createdAt desc){
      _id,
      createdAt,
      orderStatus,
      trackingStatus,
      trackingNumber,
      orderTotal,
      shippingCost,
      taxAmount,
      paymentMethod,
      paymentDetails,
      shippingDetails,
      user->{_id, fullName, email, image, emailVerified},
      orderItems[]{
        product->{_id, productNameEn, productImageSet,variants[]},
        variants[],
        Total
      }
    }`
  );

  return NextResponse.json({ orders });
}

/** POST /api/dashboard/orders → create a new order */
export async function POST(req: NextRequest) {
  const body = await req.json();
  // Validate required fields (add more as needed)
  if (!body.orderItems || !body.orderTotal) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }
  // Create order in Sanity
  const newOrder = await client.create({
    _type: 'order',
    ...body,
    createdAt: new Date().toISOString(),
  });
  return NextResponse.json({ order: newOrder }, { status: 201 });
}

/** PATCH /api/dashboard/orders → update status/tracking on a single order */
export async function PATCH(req: NextRequest) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const body = await req.json();
  const { _id, ...patchData } = body;

  if (!_id || typeof _id !== 'string') {
    return NextResponse.json(
      { error: 'Missing or invalid order ID' },
      { status: 400 }
    );
  }

  if (Object.keys(patchData).length === 0) {
    return NextResponse.json(
      { error: 'No valid fields to update' },
      { status: 400 }
    );
  }

  // Apply patch in Sanity
  const updated: Order = await client
    .patch(_id)
    .set(patchData)
    .commit();

  return NextResponse.json({ order: updated });
}
