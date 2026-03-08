import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Edge middleware — protects /admin/* routes.
 *
 * Per design spec FR-A-01 & Section 5.8:
 * "Next.js middleware.ts reads a lightweight session indicator cookie to protect
 * /admin/* routes at the edge without exposing the JWT."
 *
 * The 'session' cookie (value: '1') is set by Express on login as a non-HttpOnly,
 * SameSite=Lax cookie. It carries no sensitive data — it's just a login indicator.
 * The actual JWT validation happens on the Express API when protected endpoints are called.
 */
export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Allow /admin/login through — it's the auth page itself
    if (pathname === '/admin/login') {
        // If already logged in and hitting login page, redirect to dashboard
        const session = request.cookies.get('session');
        if (session?.value === '1') {
            return NextResponse.redirect(new URL('/admin', request.url));
        }
        return NextResponse.next();
    }

    // Protect all other /admin/* routes
    const session = request.cookies.get('session');
    if (!session || session.value !== '1') {
        const loginUrl = new URL('/admin/login', request.url);
        loginUrl.searchParams.set('callbackUrl', pathname); // Remember where they were going
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    // Only run middleware on /admin/* paths
    matcher: ['/admin/:path*'],
};
