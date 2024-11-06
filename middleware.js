import { NextResponse } from "next/server";
import { verify } from "jsonwebtoken";

export async function middleware(request) {
  const token = request.cookies.get("token");
  const { pathname } = request.nextUrl;

  // If trying to access protected routes without token
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      const url = new URL("/login", request.url);
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }

    try {
      verify(token.value, process.env.JWT_SECRET || "your-fallback-secret");
      return NextResponse.next();
    } catch (error) {
      // Token is invalid
      const url = new URL("/login", request.url);
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }
  }

  // If accessing login/register while already authenticated
  if ((pathname === "/login" || pathname === "/register") && token) {
    try {
      verify(token.value, process.env.JWT_SECRET || "your-fallback-secret");
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } catch (error) {
      // Invalid token, let them access login/register
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/register"],
};
