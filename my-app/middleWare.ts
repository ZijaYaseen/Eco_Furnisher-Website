import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value || "";

  try {
    jwt.verify(token, process.env.JWT_SECRET as string);
    return NextResponse.next(); // Proceed if token is valid
  } catch (error) {
    return NextResponse.redirect(new URL("/Account/Login", req.url)); //  Redirect to login if invalid
  }
}
