import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { client } from '@/sanity/lib/client';

/** Mirror your Sanity “order” schema. */
export interface Order {
  _id: string;
  createdAt: string;
  orderStatus: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  trackingStatus: 'not_started' | 'in_transit' | 'delivered';
  trackingNumber: string;
  // ─ add any other fields you fetch/return below
}

/** Only the fields you want to PATCH (all optional). */
export type OrderPatch = Partial<Pick<
  Order,
  'orderStatus' | 'trackingStatus' | 'trackingNumber'
>>;

/** Helper to guard admin routes via NextAuth JWT. */
async function isAdmin(req: NextRequest): Promise<boolean> {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });
  return Boolean(token && (token as any).role === 'admin');
}

/** GET /api/orders → list all orders (admin‑only) */
export async function GET(req: NextRequest) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  // Fetch all orders, sorted newest first
  const orders: Order[] = await client.fetch(
    `*[_type == "order"] | order(createdAt desc){
       _id,
       createdAt,
       orderStatus,
       trackingStatus,
       trackingNumber
       // …any other fields
     }`
  );

  return NextResponse.json({ orders });
}

/** PATCH /api/orders → update status/tracking on a single order */
export async function PATCH(req: NextRequest) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const body = await req.json();
  const { _id, orderStatus, trackingStatus, trackingNumber } = body;

  if (!_id || typeof _id !== 'string') {
    return NextResponse.json(
      { error: 'Missing or invalid order ID' },
      { status: 400 }
    );
  }

  // Build only the fields we actually got
  const patchData: OrderPatch = {};

  if (orderStatus) {
    patchData.orderStatus = orderStatus;
  }
  if (trackingStatus) {
    patchData.trackingStatus = trackingStatus;
  }
  if (trackingNumber) {
    patchData.trackingNumber = trackingNumber;
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
