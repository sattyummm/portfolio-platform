import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ✅ Using default export satisfies both Next.js compiler conventions perfectly
export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only run this security check on the admin dashboard route
  if (pathname.startsWith("/admin/dashboard")) {
    const adminToken = request.cookies.get("admin_session")?.value;
    const masterToken = process.env.ADMIN_PASS_TOKEN;

    // If there is no token, or it doesn't match your secret environment key...
    if (!adminToken || !masterToken || adminToken !== masterToken) {
      const loginUrl = new URL("/admin/login", request.nextUrl.origin);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/dashboard/:path*"],
};