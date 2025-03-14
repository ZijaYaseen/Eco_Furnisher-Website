import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully!",
  });

  // Cookie ko expire kar dia
  response.cookies.set({
    name: "token",
    value: "",
    expires: new Date(0), // Purani date taake expire ho jaye
    path: "/",
  });

  return response;
}
