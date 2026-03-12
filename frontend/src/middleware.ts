import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes
  if (pathname.startsWith('/admin')) {
    const authCookie = request.cookies.get('adminAuth');

    // If not authenticated, redirect to login
    if (!authCookie || authCookie.value !== 'true') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Protect /dashboard routes for regular users
  if (pathname.startsWith('/dashboard')) {
    const userCookie = request.cookies.get('userId');

    // If no userId cookie, redirect to login
    if (!userCookie || !userCookie.value) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Prevent logged in users from accessing login page
  if (pathname === '/login') {
    const adminCookie = request.cookies.get('adminAuth');
    if (adminCookie && adminCookie.value === 'true') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    const userCookie = request.cookies.get('userId');
    if (userCookie && userCookie.value) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/login'],
};
