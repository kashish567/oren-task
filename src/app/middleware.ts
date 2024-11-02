import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const loggedIn = Boolean(request.cookies.get('authToken')); // Replace with actual auth check
  const url = request.nextUrl.clone();

  if (!loggedIn && url.pathname === '/dashboard') {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ['/dashboard'],
};
