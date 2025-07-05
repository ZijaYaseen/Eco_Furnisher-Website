import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { client } from '@/sanity/lib/client';
import { getToken } from 'next-auth/jwt';
import type { OrderDetails } from '@/data';

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET as string);

export async function GET(req: NextRequest) {
  try {
    // Try to get userId from JWT or next-auth
    let userId: string | null = null;
    const token = req.cookies.get('token')?.value;

    if (token) {
      try {
        const { payload } = await jwtVerify(token, SECRET_KEY);
        userId = (payload as { _id: string })._id;
      } catch {
        // ignore, try next-auth
      }
    }

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
      return NextResponse.json({ success: false, error: 'Authentication required. Please log in.' }, { status: 401 });
    }

    // Fetch all orders for this user
    const ordersQuery = `*[_type == "order" && user._ref == $userId] | order(createdAt desc) {
      _id,
      createdAt,
      orderStatus,
      orderTotal,
      shippingCost,
      taxAmount,
      paymentMethod,
      trackingNumber,
      shippingDetails,
      paymentDetails,
      orderItems[] {
        product-> {
          _id,
          productNameEn,
          productSku,
          imageSet[],
          CategoryName,
          variants[] {
            vid,
            variantImage
          }
        },
        variants[] {
          vid,
          quantity,
          subtotal,
          image
        },
        Total
      }
    }`;
    let orders: OrderDetails[] = await client.fetch(ordersQuery, { userId });

    // For each order, for each orderItem, for each variant, set the correct image from product.variants if not present
    orders = orders.map(order => ({
      ...order,
      orderItems: order.orderItems.map(item => {
        // Build a map of vid to variantImage from product
        const vidToImage = (item.product.variants || []).reduce((acc, v) => {
          acc[v.vid] = v.variantImage;
          return acc;
        }, {});
        return {
          ...item,
          variants: item.variants.map(variant => ({
            ...variant,
            image: variant.image || vidToImage[variant.vid] || (item.product.imageSet?.[0] || '')
          }))
        };
      })
    }));

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error('Order GET error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch orders' }, { status: 500 });
  }
} 