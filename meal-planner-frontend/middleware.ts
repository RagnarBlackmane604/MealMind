import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET;

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret });
  const { pathname } = req.nextUrl;

  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/signup");
  const isProtectedPage = [
    "/dashboard",
    "/meal-plans",
    "/recipes",
    "/profile",
    "/settings",
  ].some((path) => pathname.startsWith(path));

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (isProtectedPage && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
