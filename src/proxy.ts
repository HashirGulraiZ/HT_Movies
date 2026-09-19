import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { sessionCookieName, verifySessionToken } from "@/lib/auth/auth";

export function proxy(request: NextRequest) {
	if (request.nextUrl.pathname.startsWith("/admin")) {
		const token = request.cookies.get(sessionCookieName)?.value;
		const session = token ? verifySessionToken(token) : null;
		if (!session || session.role !== "admin") {
			const loginUrl = new URL("/login", request.url);
			loginUrl.searchParams.set("next", request.nextUrl.pathname);
			return NextResponse.redirect(loginUrl);
		}
	}
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
  ],
};
