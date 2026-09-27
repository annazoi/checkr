import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/lib/auth/config";
import { hasRole } from "@/lib/auth/guards";

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

function isAdminApiRoute(pathname: string) {
  return pathname.startsWith("/api/admin/");
}

function isAdminPageRoute(pathname: string) {
  return pathname.startsWith("/admin");
}

export default auth(async (req) => {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;
  const method = req.method;

  const isAuthed = !!req.auth;
  const role = req.auth?.user?.role;

  if (isAdminApiRoute(pathname)) {
    if (!isAuthed) {
      return NextResponse.json(
        { data: null, error: { message: "Authentication required." } },
        { status: 401 },
      );
    }
    if (!hasRole(role, ["moderator", "admin"])) {
      return NextResponse.json(
        { data: null, error: { message: "Forbidden." } },
        { status: 403 },
      );
    }
    return NextResponse.next();
  }

  if (isAdminPageRoute(pathname)) {
    if (!isAuthed) {
      const loginUrl = new URL("/auth/login", nextUrl);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (!hasRole(role, ["moderator", "admin"])) {
      return NextResponse.redirect(new URL("/", nextUrl));
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
  matcher: [
    "/report/:path*",
    "/profile/me/:path*",
    "/settings/:path*",
    "/admin/:path*",
    "/api/:path*",
  ],
};
