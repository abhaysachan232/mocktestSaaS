import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const pathname = req.nextUrl.pathname;
  const protectedRoutes = ["/dashboard"];
  const authRoutes = ["/", "/register", "/login", "/forgot-password", "/reset-password"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isAuthRoute = authRoutes.includes(pathname);

  // Not logged in -> protected routes blocked
  if (!isLoggedIn && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Logged in -> prevent access to home/login pages
  // if (isLoggedIn && isAuthRoute) {
  //   const role = req.auth?.user?.role;

  //   return NextResponse.redirect(
  //     new URL(role === "ADMIN" ? "/admin" : "/dashboard", req.url),
  //   );
  // }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/",
    "/register",
    "/login",
    "/forgot-password",
    "/reset-password",
    // "/admin-login",
    "/dashboard/:path*",
    // "/admin/:path*",
  ],
};
