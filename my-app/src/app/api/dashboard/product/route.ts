import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';
import { getToken } from 'next-auth/jwt';

// Helper: Check if user is admin
async function isAdmin(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  return token && token.role === 'admin';
}

export async function GET(req: NextRequest) {
  if (!(await isAdmin(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  const products = await client.fetch(`*[_type == "product"] | order(_createdAt desc)`);
  return NextResponse.json({ products });
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  const data = await req.json();
  const result = await client.create({ _type: 'product', ...data });
  return NextResponse.json({ product: result });
}

export async function PATCH(req: NextRequest) {
  if (!(await isAdmin(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  const { _id, ...data } = await req.json();
  if (!_id) return NextResponse.json({ error: 'Missing product ID' }, { status: 400 });
  const result = await client.patch(_id).set(data).commit();
  return NextResponse.json({ product: result });
}

export async function DELETE(req: NextRequest) {
  if (!(await isAdmin(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  const { _id } = await req.json();
  if (!_id) return NextResponse.json({ error: 'Missing product ID' }, { status: 400 });
  await client.delete(_id);
  return NextResponse.json({ success: true });
} 