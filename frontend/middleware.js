import { NextResponse } from "next/server";

export function middleware(req) {
  const { pathname } = req.nextUrl;
  const role = req.cookies.get("role")?.value || null;

  // PUBLIC ROUTES (no login required)
  const publicRoutes = [
    "/", 
    "/login",
    "/register",
    "/forgot-password",
    "/verify-otp",
  ];

  // ALLOW PUBLIC ROUTES
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // PROTECT ROUTES BY ROLE
  if (pathname.startsWith("/master")) {
    if (role !== "admin" && role !== "super admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  if (pathname.startsWith("/employer")) {
    if (role !== "employer") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  if (pathname.startsWith("/profilepages")) {
    if (role !== "candidate") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // BLOCK ALL OTHER ROUTES IF NO LOGIN
  if (!role) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/master/:path*",
    "/employer/:path*",
    "/profilepages/:path*",
  ],
};
