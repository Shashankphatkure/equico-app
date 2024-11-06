import { NextResponse } from "next/server";
import { verify } from "jsonwebtoken";

const protectedRoutes = [
  "/dashboard",
  "/profile",
  "/horses",
  "/marketplace",
  "/messages",
  "/events",
];

export async function middleware(request) {
  const token = request.cookies.get("token")?.value;

  const pathname = request.nextUrl.pathname;

  // Check if the route should be protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    if (!token) {
      const url = new URL("/login", request.url);
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }

    try {
      verify(token, process.env.JWT_SECRET);
      return NextResponse.next();
    } catch (error) {
      const url = new URL("/login", request.url);
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/horses/:path*",
    "/marketplace/:path*",
    "/messages/:path*",
    "/events/:path*",
  ],
};
