import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Protect /admin routes
  if (path.startsWith("/admin") && path !== "/admin/login") {
    const session = request.cookies.get("admin_session")?.value;

    if (!session || session !== "authenticated") {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // Redirect /admin/login to /admin if already authenticated
  if (path === "/admin/login") {
    const session = request.cookies.get("admin_session")?.value;
    if (session === "authenticated") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
