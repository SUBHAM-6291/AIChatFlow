import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from "next-auth/jwt";
export { default } from 'next-auth/middleware';

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request });
    const url = request.nextUrl;
    
    // Check if user is authenticated and trying to access auth-related or root pages
    if (token && (
        url.pathname.startsWith('/sign-in') ||
        url.pathname.startsWith('/sign-up') ||
        url.pathname.startsWith('/verify') ||
        url.pathname.startsWith('/')   // Changed to exact match for root page
    )) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Removed redundant condition and fixed path consistency
    // The above condition already handles /sign-in case
}

export const config = {
    matcher: [
        '/sign-in',
        '/sign-up',
        '/',
        '/dashboard/:path*',
        '/verify/:path*'
    ]
};