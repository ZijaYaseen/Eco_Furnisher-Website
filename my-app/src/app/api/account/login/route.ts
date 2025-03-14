import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { client } from "@/sanity/lib/client";

const SECRET_KEY = process.env.JWT_SECRET as string;

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // 1. Sanity se user fetch kia
    const query = `*[_type == "user" && email == $email][0]`;
    const user = await client.fetch(query, { email });

    if (!user) {
      return NextResponse.json({ error: "Email Not Found" }, { status: 404 });
    }

    // 2. Password match kia
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json({ error: "Invalid Email or Password" }, { status: 401 });
    }

    // 3. JWT generate kia
    const token = jwt.sign(
      {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
      SECRET_KEY,
      { expiresIn: "24d" }
    );

    //  4. Token ko cookies me set kia
    const response = NextResponse.json(
      { success: true, message: "Login successful!" },
      { status: 200 }
    );

    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true, // JavaScript access nahi kar sakta (Secure)
      secure: process.env.NODE_ENV === "production"  ? true : false, // Production me secure hona chahiye
      sameSite: "strict",
      path: "/",
      maxAge: 24 * 60 * 60, // 24 hours
    });

    return response;

  } catch (error) {
    console.log(error);
    
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
