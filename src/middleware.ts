import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('refreshToken')?.value;  

  // Check if token exists and user is on the login or signup page
  if (token && (req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/signup')) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // If no token and trying to access dashboard, redirect to login
  if (!token && req.nextUrl.pathname === '/dashboard') {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard', '/login', '/signup'],
};
