import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";

// 1. Specify protected and public routes
const protectedRoutes = ["/dashboard"];

export default async function middleware(req: NextRequest) {
	// 2. Check if the current route is protected or public
	const path = req.nextUrl.pathname;
	const isProtectedRoute = protectedRoutes.includes(path);

	console.log("isProtectedRoute", isProtectedRoute);
	// 3. Decrypt the session from the cookie
	const sessionCookie = getSessionCookie(req);
	console.log("sessionCookie", getSessionCookie(req));

	// 4. Redirect to /login if the user is not authenticated
	if (isProtectedRoute && !sessionCookie) {
		return NextResponse.redirect(new URL("/auth", req.nextUrl));
	}

	// 5. Redirect to /dashboard if the user is authenticated
	if (
		!isProtectedRoute &&
		sessionCookie &&
		!req.nextUrl.pathname.startsWith("/dashboard")
	) {
		return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
	}

	return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
	matcher: ["/((?!api|rpc|_next/static|_next/image|.*\\.png$).*)"],
};
