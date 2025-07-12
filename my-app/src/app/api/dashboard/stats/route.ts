import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';
import { getToken } from 'next-auth/jwt';

export type DashboardPeriod = 'today' | 'week' | 'month' | 'year' | 'total';

export interface DashboardStatsResponse {
  users: number;
  orders: number;
  revenue: number;
  expenses: number;
  profit: number;
  percentageChange: {
    users: number;
    orders: number;
    revenue: number;
    expenses: number;
    profit: number;
  };
}

export interface StatsVariant {
  vid: string;
  quantity?: number;
  variantSellPrice?: number;
}
export interface StatsOrderItem {
  variants?: StatsVariant[];
}
export interface StatsOrder {
  orderTotal?: number;
  orderItems?: StatsOrderItem[];
}

function getPeriodRange(period: DashboardPeriod): { start: Date; end: Date; prevStart: Date; prevEnd: Date } {
  const now = new Date();
  let start: Date, end: Date, prevStart: Date, prevEnd: Date;
  switch (period) {
    case 'today': {
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
      prevStart = new Date(start.getTime() - 24 * 60 * 60 * 1000);
      prevEnd = start;
      break;
    }
    case 'week': {
      const day = now.getDay();
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - day);
      end = new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000);
      prevStart = new Date(start.getTime() - 7 * 24 * 60 * 60 * 1000);
      prevEnd = start;
      break;
    }
    case 'month': {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      prevStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      prevEnd = start;
      break;
    }
    case 'year': {
      start = new Date(now.getFullYear(), 0, 1);
      end = new Date(now.getFullYear() + 1, 0, 1);
      prevStart = new Date(now.getFullYear() - 1, 0, 1);
      prevEnd = start;
      break;
    }
    case 'total':
    default: {
      start = new Date(0);
      end = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      prevStart = new Date(0);
      prevEnd = start;
      break;
    }
  }
  return { start, end, prevStart, prevEnd };
}

function percentChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; lastRequest: number }>();
const WINDOW_SIZE = 60 * 1000; // 1 minute
const MAX_REQUESTS = 10; // 10 requests per minute per IP
async function rateLimit(identifier: string): Promise<{ success: boolean }> {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);
  if (!entry || now - entry.lastRequest > WINDOW_SIZE) {
    rateLimitMap.set(identifier, { count: 1, lastRequest: now });
    return { success: true };
  }
  if (entry.count < MAX_REQUESTS) {
    entry.count += 1;
    entry.lastRequest = now;
    rateLimitMap.set(identifier, entry);
    return { success: true };
  }
  return { success: false };
}

// Remove [0...1000] from the query, add offset and limit
const BATCH_SIZE = 1000;
const ordersQuery = (from: Date, to: Date, offset: number) => `
*[_type == "order" && orderStatus == "paid" && createdAt >= "${from.toISOString()}" && createdAt < "${to.toISOString()}"] | order(createdAt asc) [${offset}...${offset + BATCH_SIZE}]{
  orderTotal,
  orderItems[]{
    variants[]{
      vid,
      quantity,
      "variantSellPrice": select(
        defined(^.product->variants[vid == ^.vid][0].variantSellPrice) => ^.product->variants[vid == ^.vid][0].variantSellPrice,
        0
      )
    }
  }
}`;

// Utility to get users count between two dates
function usersQuery(from: Date, to: Date): string {
  return `count(*[_type == "user" && _createdAt >= "${from.toISOString()}" && _createdAt < "${to.toISOString()}"])`;
}

// Batching function to aggregate all orders for a period
async function aggregateAllOrders(from: Date, to: Date): Promise<{ orders: number; revenue: number; expenses: number; profit: number }> {
  let offset = 0;
  let totalOrders = 0, totalRevenue = 0, totalExpenses = 0;
  while (true) {
    const batch: StatsOrder[] = await client.fetch(ordersQuery(from, to, offset));
    if (!batch.length) break;
    for (const order of batch) {
      totalRevenue += order.orderTotal || 0;
      totalOrders++;
      for (const item of order.orderItems || []) {
        for (const v of item.variants || []) {
          totalExpenses += (v.variantSellPrice || 0) * (v.quantity || 1);
        }
      }
    }
    if (batch.length < BATCH_SIZE) break;
    offset += BATCH_SIZE;
  }
  return { orders: totalOrders, revenue: totalRevenue, expenses: totalExpenses, profit: totalRevenue - totalExpenses };
}

async function isAdmin(req: NextRequest): Promise<boolean> {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  return Boolean(token && (token).role === 'admin');
}

export async function GET(req: NextRequest) {
  try {
    // Rate limiting
    const identifier = req.headers.get('x-forwarded-for') || req.ip || '127.0.0.1';
    const { success } = await rateLimit(identifier);
    if (!success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    if (!(await isAdmin(req))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const period = (searchParams.get('period') as DashboardPeriod) || 'today';
    const { start, end, prevStart, prevEnd } = getPeriodRange(period);

    // Fetch users count
    const users: number = await client.fetch<number>(usersQuery(start, end));
    const prevUsers: number = await client.fetch<number>(usersQuery(prevStart, prevEnd));

    // Fetch orders and aggregate in batches
    const currentAgg = await aggregateAllOrders(start, end);
    const prevAgg = await aggregateAllOrders(prevStart, prevEnd);

    const profitMargin = currentAgg.revenue > 0 ? (currentAgg.profit / currentAgg.revenue) * 100 : 0;

    const response: DashboardStatsResponse & { profitMargin: number } = {
      users,
      orders: currentAgg.orders,
      revenue: currentAgg.revenue,
      expenses: currentAgg.expenses,
      profit: currentAgg.profit,
      percentageChange: {
        users: percentChange(users, prevUsers),
        orders: percentChange(currentAgg.orders, prevAgg.orders),
        revenue: percentChange(currentAgg.revenue, prevAgg.revenue),
        expenses: percentChange(currentAgg.expenses, prevAgg.expenses),
        profit: percentChange(currentAgg.profit, prevAgg.profit),
      },
      profitMargin,
    };

    return NextResponse.json(response);
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: 'Server Error',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: process.env.NODE_ENV === 'development' && error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
