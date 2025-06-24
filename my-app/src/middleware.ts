import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export const runtime = 'experimental-edge';

export async function middleware(req: NextRequest) {
  try {
    const token = await getToken({ 
      req, 
      secret: process.env.NEXTAUTH_SECRET,
      // Explicitly specify cookie name
      cookieName: "next-auth.session-token",
      secureCookie: process.env.NODE_ENV === "production"
    });

    if (!token) {
      return NextResponse.redirect(new URL("/Account/Login", req.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.redirect(new URL("/Account/Login", req.url));
  }
}

export const config = {
  matcher: ["/Dashboard/:path*"],
};