import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = new URL(req.url);
  if (url.pathname.startsWith("/checkout")) {
    const authCookie = req.cookies.get("auth_session");
    if (!authCookie) {
      const signInUrl = new URL("/sign-in", req.url);
      signInUrl.searchParams.set("redirectTo", "/checkout");
      return NextResponse.redirect(signInUrl);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/checkout/:path*"],
};
