import { Role } from "@prisma/client";
import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";
export default withAuth(function middleware(req) {
	// Redirect if they don't have the appropriate role
	console.log(req.nextauth.token?.role);
	if (
		req.nextUrl.pathname.startsWith("/admin") &&
		req.nextauth.token?.role !== Role.ADMIN
	) {
		return NextResponse.redirect(new URL("/", req.url));
	}
});

export const config = {
	matcher: ["/admin/:path*", "/"],
};