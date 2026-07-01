import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only run this security check on the admin dashboard route
  if (pathname.startsWith("/admin/dashboard")) {
    const adminToken = request.cookies.get("admin_session")?.value;
    const masterToken = process.env.ADMIN_PASS_TOKEN;

    // If there is no token, or it doesn't match your secret environment key...
    if (!adminToken || !masterToken || adminToken !== masterToken) {
      // Create a perfectly safe, absolute fallback URL using request.nextUrl
      const loginUrl = new URL("/admin/login", request.nextUrl.origin);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// Tells Next.js to only trigger the middleware for admin routes
export const config = {
  matcher: ["/admin/dashboard/:path*"],
};