import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jwt-decode';
export const config = {
  matcher: ['/', '/signin']
};
export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  const { pathname } = req.nextUrl;

  if (pathname === '/signin') {
    try {
      let cookie = req.cookies.get('token')?.value;
      const decoded = jwt(cookie as string) as any;
      if (decoded?.exp * 1000 > new Date().getTime()) {
        url.pathname = '/';

        return NextResponse.redirect(url);
      }
    } catch (error) {
      return;
    }
  } else {
    try {
      url.pathname = '/signin';
      let cookie = req.cookies.get('token')?.value;
      const decoded = jwt(cookie as string) as any;
      if (!cookie || decoded?.exp * 1000 < new Date().getTime()) {
        return NextResponse.redirect(url);
      }
    } catch (error) {
      return NextResponse.redirect(url);
    }
  }
}
