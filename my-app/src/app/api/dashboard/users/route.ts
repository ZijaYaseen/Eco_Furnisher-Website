import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';
import { getToken } from 'next-auth/jwt';

async function isAdmin(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  return token && token.role === 'admin';
}

export async function GET(req: NextRequest) {
  if (!(await isAdmin(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  const users = await client.fetch(`*[_type == "user"] {
    _id,
    fullName,
    email,
    image,
    role,
    provider,
    emailVerified,
    _createdAt
  } | order(_createdAt desc)`);
  return NextResponse.json({ users });
}

export async function PATCH(req: NextRequest) {
  if (!(await isAdmin(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  const { _id, role } = await req.json();
  if (!_id || !role) return NextResponse.json({ error: 'Missing user ID or role' }, { status: 400 });
  const result = await client.patch(_id).set({ role }).commit();
  return NextResponse.json({ user: result });
} 