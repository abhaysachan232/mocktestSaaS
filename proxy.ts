import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(
  request: NextRequest
) {
  // const pathname =
  //   request.nextUrl.pathname;

  // const token =
  //   request.cookies.get(
  //     "token"
  //   )?.value;

  // const adminToken =
  //   request.cookies.get(
  //     "adminToken"
  //   )?.value;

  // // Student routes
  // if (
  //   pathname === "/login" &&
  //   token
  // ) {
  //   return NextResponse.redirect(
  //     new URL(
  //       "/dashboard",
  //       request.url
  //     )
  //   );
  // }

  // if (
  //   pathname.startsWith(
  //     "/dashboard"
  //   ) &&
  //   !token
  // ) {
  //   return NextResponse.redirect(
  //     new URL(
  //       "/login",
  //       request.url
  //     )
  //   );
  // }

  // // Admin routes
  // if (
  //   pathname ===
  //     "/admin-login" &&
  //   adminToken
  // ) {
  //   return NextResponse.redirect(
  //     new URL(
  //       "/admin",
  //       request.url
  //     )
  //   );
  // }

  // if (
  //   pathname.startsWith(
  //     "/admin"
  //   ) &&
  //   pathname !==
  //     "/admin-login" &&
  //   !adminToken
  // ) {
  //   return NextResponse.redirect(
  //     new URL(
  //       "/admin-login",
  //       request.url
  //     )
  //   );
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/login",
    "/admin-login",
  ],
};