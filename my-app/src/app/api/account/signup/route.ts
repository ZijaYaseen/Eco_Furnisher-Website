// api/signup/route.ts

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { fullName, email, password } = await req.json();

    // Checking if user already exists with given email OR fullName
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

    const sanityResult = await sanityResponse.json(); // Response ko variable me store kiya
    const userId =  sanityResult?.results[0]?._id; // Sanity ka user ID extract kiya


    // Generate JWT Token for the user
    const token = jwt.sign(
      {
        _id: userId, // Sanity se aaya hua user ID
        fullName,
        email,
        role: userData.role
      }, // JWT token me user ka email and email saved kia he.
      process.env.JWT_SECRET as string, // Secret key
      { expiresIn: "24d" } // Token expiry time
    );

    // Set token as a cookie
    const response = NextResponse.json({
      success: true,
      message: "User created successfully!",
      token,
    });
   // production me secure nhi hoga ..
   
    const isProd = process.env.NODE_ENV === "production";
    const cookieOptions = `token=${token}; HttpOnly; Path=/; Max-Age=${24 * 60 * 60}; ${isProd ? "Secure; SameSite=Strict" : "SameSite=Strict"}`;

    response.headers.set("Set-Cookie", cookieOptions);


    return response;

  } catch (error) {
    console.error("Sign-up error:", error);
    return NextResponse.json({ success: false, error: "Sign-up failed!" });
  }
}
