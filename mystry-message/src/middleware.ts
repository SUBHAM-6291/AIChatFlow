import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from "next-auth/jwt";
export { default } from 'next-auth/middleware';

// Middleware function with async and fixed syntax
export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request });
    const url = request.nextUrl;
    
    // Check if user is authenticated and trying to access auth-related or root pages
    if (token && (
        url.pathname.startsWith('/sign-in') ||
        url.pathname.startsWith('/sign-up') ||
        url.pathname.startsWith('/verify') ||
        url.pathname.startsWith('/')  // Exact match for root page
    )) //{
     //   return NextResponse.redirect(new URL('/home', request.url));
 //   }

    // Default redirect (optional, kept from your original code)
    return NextResponse.redirect(new URL('/home', request.url));
}

// Path matcher configuration
export const config = {
    matcher: [
        '/sign-in',
        '/sign-up',
        '/',
        '/dashboard/:path*',
        '/verify/:path*'
    ]
};