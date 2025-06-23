// api/signup/route.ts

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET as string;

export async function POST(req: Request) {
  try {
    const { fullName, email, password } = await req.json();

    // Checking if user already exists with given email
    const query = `*[_type == "user" && (email == $email)][0]`;
    const sanityCheckResponse = await fetch(
      `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v2021-06-07/data/query/production`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.SANITY_API_TOKEN}`,
        },
        body: JSON.stringify({ query, params: { email } }),
      }
    );

    const { result } = await sanityCheckResponse.json();

    if (result) {
      return NextResponse.json({
        success: false,
        error: `This email address already exists. Please try another.`,
      });
    }

    // **Encrypt (Hash) the Password Before Storing**
    const hashedPassword = await bcrypt.hash(password, 10);

    // If user doesn't exist, create a new one
    const userData = {
      _type: "user",
      fullName,
      email,
      password: hashedPassword,
      role: "user",
      provider: "credentials",
      emailVerified: new Date().toISOString(),
    };

    const sanityResponse = await fetch(
      `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v2021-06-07/data/mutate/production`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.SANITY_API_TOKEN}`,
        },
        body: JSON.stringify({ mutations: [{ create: userData }] }),
      }
    );

    const sanityResult = await sanityResponse.json();
    console.log("Sanity create user result:", sanityResult);
    const userId = sanityResult?.results?.[0]?._id;

    // Defensive: If userId not found, but no error in response, still return success
    if ((!userId && !sanityResult.error) || (sanityResult.transactionId && !userId)) {
      const token = jwt.sign(
        {
          fullName: fullName,
          email: email,
          role: "user",
        },
        SECRET_KEY,
        { expiresIn: "24d" }
      );
      const response = NextResponse.json({
        success: true,
        message: "User created (id not returned, but no error from Sanity)",
        user: {
          name: fullName,
          email: email,
          role: "user",
        },
      });
      response.cookies.set({
        name: "token",
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production" ? true : false,
        sameSite: "strict",
        path: "/",
        maxAge: 24 * 60 * 60, // 24 hours
      });
      return response;
    }

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: "Failed to create user in database",
        details: sanityResult,
      });
    }

    // JWT generate karo (same as login)
    const token = jwt.sign(
      {
        _id: userId,
        fullName: fullName,
        email: email,
        role: "user",
      },
      SECRET_KEY,
      { expiresIn: "24d" }
    );

    // Token ko cookies me set karo
    const response = NextResponse.json({
      success: true,
      message: "User created successfully!",
      user: {
        id: userId,
        name: fullName,
        email: email,
        role: "user",
      },
    });

    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: "strict",
      path: "/",
      maxAge: 24 * 60 * 60, // 24 hours
    });

    return response;
  } catch (error) {
    return NextResponse.json({ success: false, error: "Sign-up failed!" });
  }
}
