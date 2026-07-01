import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;

    const masterToken = process.env.ADMIN_PASS_TOKEN;

    // Verify if the input password matches your secret environment key
    if (!password || !masterToken || password !== masterToken) {
      return NextResponse.json(
        { success: false, message: "Access verification credentials rejected." },
        { status: 401 }
      );
    }

    // Initialize the response payload
    const response = NextResponse.json(
      { success: true, message: "Authentication sequence authorized." },
      { status: 200 }
    );

    // Inject the secure admin session cookie directly using standard Next.js parameters
    response.cookies.set("admin_session", masterToken, {
      httpOnly: true, // Prevents cross-site scripting (XSS) client attacks
      secure: process.env.NODE_ENV === "production", // Only force HTTPS in live production
      sameSite: "lax",
      path: "/", // Available across the entire administrative directory layout
      maxAge: 60 * 60 * 24 * 7, // Cookie remains valid for exactly 7 days
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: `Auth processing fault: ${error.message}` },
      { status: 500 }
    );
  }
}