import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Only protect /admin routes (not /admin/login and not API routes)
  const isLoginPage = pathname === "/admin/login";
  const isApiRoute = pathname.startsWith("/api/");
  const isAuthenticated = !!req.auth;

  // Don't touch API routes
  if (isApiRoute) return NextResponse.next();

  // If on login page and already authenticated → go to dashboard
  if (isLoginPage && isAuthenticated) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  // If on any /admin page (not login) and NOT authenticated → go to login
  if (!isLoginPage && !isAuthenticated) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  return NextResponse.next();
});

export const config = {
  // Only run middleware on /admin routes, NOT on login page to avoid loops
  matcher: ["/admin/:path+"],
};
