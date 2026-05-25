// [W6] Use NextAuth built-in auth() middleware helper — no manual cookie name detection
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoginPage = pathname === "/admin/login";
  const isAuthenticated = !!req.auth;

  if (isLoginPage && isAuthenticated) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  if (!isLoginPage && !isAuthenticated) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path+"],
};
