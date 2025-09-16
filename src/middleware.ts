import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {

    const tokenCookie = request.cookies.get('buka_token');
    const token = tokenCookie?.value;
    const isAuthenticated = !!token
  
    const { pathname } = request.nextUrl;
  
    const isPublicPath = pathname.startsWith('/auth/');


    if (!isAuthenticated && !isPublicPath) {
        const loginUrl = new URL('/auth/login', request.url);
        loginUrl.searchParams.set('from', pathname);
        return NextResponse.redirect(loginUrl);    
    }
    return NextResponse.next();
}

export const config = {
    matcher: [
      /*
       * Match all request paths except for the ones starting with:
       * - api (API routes)
       * - _next/static (static files)
       * - _next/image (image optimization files)
       * - favicon.ico (favicon file)
       */
      '/((?!api|_next/static|_next/image|favicon.ico|public|assets).*)',
    ],
};
