import { NextResponse } from "next/server";

// A fast, ultra-secure helper to generate a lightweight tamper-proof signature using native Web Crypto
async function generateSecureSignature(payload: object, secret: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(JSON.stringify(payload));
  const keyData = encoder.encode(secret);
  
  const key = await crypto.subtle.importKey(
    "raw", 
    keyData, 
    { name: "HMAC", hash: "SHA-256" }, 
    false, 
    ["sign"]
  );
  
  const signature = await crypto.subtle.sign("HMAC", key, data);
  return btoa(String.fromCharCode(...new Uint8Array(signature)));
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const targetEmail = process.env.ADMIN_EMAIL;
    const targetPassword = process.env.ADMIN_PASSWORD;
    const jwtSecret = process.env.JWT_SECRET;

    if (!targetEmail || !targetPassword || !jwtSecret) {
      return NextResponse.json(
        { error: "Internal Server Configuration Error." },
        { status: 500 }
      );
    }

    // Verify credentials directly against the environment vault
    if (email === targetEmail && password === targetPassword) {
      // Create a signature to prove authentication status
      const signatureToken = await generateSecureSignature({ role: "ADMIN", timestamp: Date.now() }, jwtSecret);

      const response = NextResponse.json(
        { message: "Authentication successful.", success: true },
        { status: 200 }
      );

      // Set the token securely in an HTTP-Only cookie container
      response.cookies.set("admin_token", signatureToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24, // 24 hours
        path: "/",
      });

      return response;
    }

    return NextResponse.json(
      { error: "Invalid administrative credentials." },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "An unexpected error occurred processing request." },
      { status: 500 }
    );
  }
}