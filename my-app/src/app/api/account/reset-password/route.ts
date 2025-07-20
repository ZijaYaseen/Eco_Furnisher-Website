import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
// Sentry import
import * as Sentry from "@sentry/nextjs";

const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const SANITY_API_TOKEN = process.env.SANITY_API_TOKEN;

function isStrongPassword(pw : string) {
  return (
    typeof pw === "string" &&
    pw.length >= 8 &&
    /[0-9]/.test(pw) &&
    /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pw)
  );
}

export async function POST(req: Request) {
  try {
    const { token, newPassword } = await req.json();
    if (!token || !newPassword) {
      return NextResponse.json({ success: false, error: "Token and new password are required." }, { status: 400 });
    }
    if (!isStrongPassword(newPassword)) {
      return NextResponse.json({ success: false, error: "Password must be at least 8 characters, include a number and a special character." }, { status: 400 });
    }
    // 1. Find user by resetToken
    const query = `*[_type == 'user' && resetToken == $token][0]`;
    const sanityRes = await fetch(
      `https://${SANITY_PROJECT_ID}.api.sanity.io/v2021-06-07/data/query/production`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SANITY_API_TOKEN}`,
        },
        body: JSON.stringify({ query, params: { token } }),
      }
    );
    const { result: user } = await sanityRes.json();
    if (!user) {
      return NextResponse.json({ success: false, error: "Invalid or expired token." }, { status: 400 });
    }
    // 2. Check token expiry
    if (!user.resetTokenExpiry || new Date(user.resetTokenExpiry) < new Date()) {
      return NextResponse.json({ success: false, error: "Token has expired." }, { status: 400 });
    }
    // 3. Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    // 4. Update user: set new password, clear resetToken and expiry
    const patchBody = {
      mutations: [
        {
          patch: {
            id: user._id,
            set: {
              password: hashedPassword,
              resetToken: null,
              resetTokenExpiry: null,
            },
          },
        },
      ],
    };
    const patchRes = await fetch(
      `https://${SANITY_PROJECT_ID}.api.sanity.io/v2021-06-07/data/mutate/production`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SANITY_API_TOKEN}`,
        },
        body: JSON.stringify(patchBody),
      }
    );
    const patchResult = await patchRes.json();
    if (patchResult.error) {
      if (process.env.SENTRY_DSN) Sentry.captureException(patchResult.error);
      return NextResponse.json({ success: false, error: "Failed to update password." }, { status: 500 });
    }
    return NextResponse.json({ success: true, message: "Password reset successful!" });
  } catch (error) {
    if (process.env.SENTRY_DSN) Sentry.captureException(error);
    console.error(error);
    return NextResponse.json({ success: false, error: "Server error. Please try again." }, { status: 500 });
  }
} 