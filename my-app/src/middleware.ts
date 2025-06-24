import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export const runtime = 'experimental-edge';

export async function middleware(req: NextRequest) {
  try {
    // Determine cookie name based on environment
    const isProd = process.env.NODE_ENV === "production";
    const sessionCookieName = isProd 
      ? "__Secure-next-auth.session-token" 
      : "next-auth.session-token";

    const token = await getToken({ 
      req, 
      secret: process.env.NEXTAUTH_SECRET,
      cookieName: sessionCookieName, // CRITICAL FIX
      secureCookie: isProd
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