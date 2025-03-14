// app/api/account/user/route.ts
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Convert secret key to Uint8Array
const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET as string);

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    // Return only non-sensitive details
    const { fullName, role } = payload as { fullName: string; role: string };
    return NextResponse.json({ fullName, role });
  } catch (error) {
    console.log(error);
    
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
