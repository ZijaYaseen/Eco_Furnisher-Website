import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  // NextAuth token get kiya cookies se
  const token = await getToken({ 
    req, 
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production"
  });

  // Agar token nahi mila, to login page pe redirect karo
  if (!token) {
    return NextResponse.redirect(new URL("/Account/Login", req.url));
  }

  // Token valid hai, request allow karo
  return NextResponse.next();
}

// Middleware ko sirf protected routes pe apply karne ke liye:
export const config = {
  matcher: ["/Dashboard/:path*"],
};
