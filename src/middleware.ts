import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // pages only for logged-out users
  const authPages = ["/auth/login", "/auth/register"];

  // Supabase stores its session cookie here:
  const hasSession =
    request.cookies.get("sb-access-token") ||
    request.cookies.get("sb-refresh-token");

  // If user is logged in → block login/register
  if (hasSession && authPages.includes(pathname)) {
    return NextResponse.redirect(new URL("/feed", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/auth/login", "/auth/register"],
};
