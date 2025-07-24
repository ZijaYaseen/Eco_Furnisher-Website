 import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { sendEmail } from "@/lib/sendEmail";
import * as Sentry from "@sentry/nextjs";

const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const SANITY_API_TOKEN = process.env.SANITY_API_TOKEN;
const APP_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

// Simple in-memory rate limit (per IP)
const rateLimitMap = new Map();
const RATE_LIMIT = 5; // 5 requests
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour

function isRateLimited(ip: string) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip) || { count: 0, last: now };
  if (now - entry.last > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { count: 1, last: now });
    return false;
  }
  if (entry.count >= RATE_LIMIT) return true;
  rateLimitMap.set(ip, { count: entry.count + 1, last: entry.last });
  return false;
}

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json({ success: false, error: "Too many requests. Please try again later." }, { status: 429 });
    }
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required." }, { status: 400 });
    }
    // 1. Find user by email
    const query = `*[_type == 'user' && email == $email][0]`;
    const sanityRes = await fetch(
      `https://${SANITY_PROJECT_ID}.api.sanity.io/v2021-06-07/data/query/production`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SANITY_API_TOKEN}`,
        },
        body: JSON.stringify({ query, params: { email } }),
      }
    );
    const { result: user } = await sanityRes.json();
    // Always return success for security (don't reveal if user exists)
    if (!user) {
      return NextResponse.json({ success: true, message: "If this email exist. A reset link has been sent." });
    }
    // --- Rate limiting logic per user ---
    const now = new Date();
    let resetAttempts = user.resetAttempts || 0;
    let resetWindowStart = user.resetWindowStart ? new Date(user.resetWindowStart) : null;
    const lastResetRequestTime = user.lastResetRequestTime ? new Date(user.lastResetRequestTime) : null;

    // Reset window if 24h passed
    if (!resetWindowStart || now.getTime() - resetWindowStart.getTime() > 24 * 60 * 60 * 1000) {
      resetAttempts = 0;
      resetWindowStart = now;
    }

    // 1 min cooldown
    if (lastResetRequestTime && now.getTime() - lastResetRequestTime.getTime() < 60 * 1000) {
      const retryAfter = Math.ceil((60 * 1000 - (now.getTime() - lastResetRequestTime.getTime())) / 1000);
      return NextResponse.json({
        success: false,
        error: `Please wait ${retryAfter} seconds before requesting another reset email.`,
        retryAfter,
      }, { status: 429 });
    }

    // 3 attempts in 24h
    if (resetAttempts >= 3) {
      const retryAfter = Math.ceil((resetWindowStart.getTime() + 24 * 60 * 60 * 1000 - now.getTime()) / 1000);
      return NextResponse.json({
        success: false,
        error: "You have reached the maximum number of reset attempts. Try again after 24 hours.",
        retryAfter,
      }, { status: 429 });
    }
    // 2. Generate token and expiry (1 hour)
    const resetToken = nanoid(32);
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    // 3. Save token/expiry and rate limit fields to user in Sanity
    const patchBody = {
      mutations: [
        {
          patch: {
            id: user._id,
            set: {
              resetToken,
              resetTokenExpiry,
              resetAttempts: resetAttempts + 1,
              resetWindowStart: resetWindowStart.toISOString(),
              lastResetRequestTime: now.toISOString(),
            },
          },
        },
      ],
    };
    await fetch(
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
    // 4. Send branded reset email
    const resetLink = `${APP_URL}/Account/ResetPassword?token=${resetToken}`;
    const html = `
      <div style="font-family:sans-serif;max-width:480px;margin:auto;background:#fff;border-radius:8px;padding:32px 24px;box-shadow:0 2px 8px #eee;">
        <div style="text-align:center;margin-bottom:24px;">
          <img src='https://ecofurnisher.com/logo.png' alt='EcoFurnisher Logo' style='height:48px;margin-bottom:8px;' />
          <h2 style="color:#222;font-size:24px;margin:0;">EcoFurnisher Password Reset</h2>
        </div>
        <p style="color:#444;font-size:16px;">Hello,</p>
        <p style="color:#444;font-size:16px;">We received a request to reset your EcoFurnisher account password.</p>
        <a href="${resetLink}" style="display:inline-block;margin:16px 0;padding:12px 24px;background:#111;color:#fff;border-radius:6px;text-decoration:none;font-weight:bold;">Reset Password</a>
        <p style="color:#888;font-size:14px;">If you did not request this, you can safely ignore this email.</p>
        <hr style="margin:24px 0;" />
        <p style="color:#aaa;font-size:12px;text-align:center;">&copy; ${new Date().getFullYear()} EcoFurnisher. All rights reserved.</p>
      </div>
    `;
    await sendEmail({
      to: email,
      subject: "EcoFurnisher Password Reset",
      html,
    });
    return NextResponse.json({ success: true, message: "A reset link has been sent." });
  } catch (error) {
    if (process.env.SENTRY_DSN) Sentry.captureException(error);
    console.error(error);
    return NextResponse.json({ success: false, error: "Server error. Please try again." }, { status: 500 });
  }
} 