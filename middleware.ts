import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    // Allow access if authenticated
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow /admin/login without authentication
        if (req.nextUrl.pathname === '/admin/login') {
          return true;
        }
        // All other /admin routes require authentication
        return !!token;
      },
    },
    pages: {
      signIn: '/admin/login',
    },
  }
);

// Protect all /admin routes
export const config = {
  matcher: ['/admin/:path*'],
};
