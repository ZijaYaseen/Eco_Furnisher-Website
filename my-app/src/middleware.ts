import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Convert the secret key to Uint8Array using TextEncoder
const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET as string);

export async function middleware(req: NextRequest) {
  // Token get kiya cookies se
  const token = req.cookies.get("token")?.value;

  // Agar token nahi mila, to login page pe redirect karo
  if (!token) {
    return NextResponse.redirect(new URL("/Account/Login", req.url));
  }

  try {
    // JWT verify karo using jose
    await jwtVerify(token, SECRET_KEY);
    // console.log("Response JWT token :"  ,payload); 
    

    return NextResponse.next(); // Request allow ho jayegi
    
  } catch (error) {

    // Agar token invalid ya expire ho gaya to Home page pe redirect kar do
    console.error("JWT Verification Failed:", error);
    return NextResponse.redirect(new URL("/", req.url));
  }
}

// Middleware ko sirf protected routes pe apply karne ke liye:
export const config = {
  matcher: ["/Dashboard/:path*"],
};
