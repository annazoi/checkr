import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/lib/auth/config";
import { ajGeneralLimiter, ajLoginLimiter, ajRegisterLimiter } from "@/lib/arcjet";

const { auth } = NextAuth(authConfig);

const PROTECTED_PAGE_PREFIXES = ["/report", "/profile/me", "/settings"];

function requiresPageAuth(pathname: string) {
  return PROTECTED_PAGE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

function requiresApiAuth(pathname: string, method: string) {
  if (pathname.startsWith("/api/upload/")) return true;
  if (pathname === "/api/reports" && method === "POST") return true;
  if (pathname === "/api/sources" && method === "POST") return true;
  return false;
}

function isAdminRoute(pathname: string) {
  return pathname.startsWith("/api/admin/");
}

function pickLimiter(pathname: string) {
  if (pathname.startsWith("/api/auth/register")) return ajRegisterLimiter;
  if (pathname.startsWith("/api/auth/callback/credentials")) return ajLoginLimiter;
  return ajGeneralLimiter;
}

export default auth(async (req) => {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;
  const method = req.method;

  if (pathname.startsWith("/api/")) {
    const limiter = pickLimiter(pathname);
    const decision = await limiter.protect(req);

    if (decision.isDenied()) {
      const status = decision.reason.isBot() ? 403 : 429;
      return NextResponse.json(
        { data: null, error: { message: "Too many requests. Please try again later." } },
        { status },
      );
    }
  }

  const isAuthed = !!req.auth;
  const role = req.auth?.user?.role;

  if (isAdminRoute(pathname)) {
    if (!isAuthed) {
      return NextResponse.json(
        { data: null, error: { message: "Authentication required." } },
        { status: 401 },
      );
    }
    if (role !== "moderator" && role !== "admin") {
      return NextResponse.json(
        { data: null, error: { message: "Forbidden." } },
        { status: 403 },
      );
    }
    return NextResponse.next();
  }

  if (requiresApiAuth(pathname, method) && !isAuthed) {
    return NextResponse.json(
      { data: null, error: { message: "Authentication required." } },
      { status: 401 },
    );
  }

  if (requiresPageAuth(pathname) && !isAuthed) {
    const loginUrl = new URL("/auth/login", nextUrl);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/report/:path*", "/profile/me/:path*", "/settings/:path*", "/api/:path*"],
};
