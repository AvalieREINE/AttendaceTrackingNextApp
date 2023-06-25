import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jwt-decode';
export const config = {
  matcher: ['/', '/signin', '/admin']
};
export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  const { pathname } = req.nextUrl;

  if (pathname === '/signin') {
    try {
      let cookie = req.cookies.get('token')?.value;
      const decoded = jwt(cookie as string) as any;
      if (decoded?.exp * 1000 > new Date().getTime()) {
        const role = req.cookies.get('role')?.value;
        if (role === process.env.NEXT_PUBLIC_ADMIN_ROLE_STRING) {
          url.pathname = '/admin';
        } else {
          url.pathname = '/';
        }

        return NextResponse.redirect(url);
      }
    } catch (error) {
      return;
    }
  } else if (pathname === '/admin') {
    try {
      let cookie = req.cookies.get('token')?.value;
      const decoded = jwt(cookie as string) as any;
      const role = req.cookies.get('role')?.value;
      if (decoded?.exp * 1000 > new Date().getTime()) {
        if (role !== process.env.NEXT_PUBLIC_ADMIN_ROLE_STRING) {
          url.pathname = '/';
          return NextResponse.redirect(url);
        }
      } else {
        url.pathname = '/signin';
        return NextResponse.redirect(url);
      }
    } catch (error) {
      url.pathname = '/signin';
      return NextResponse.redirect(url);
    }
  } else if (pathname === '/') {
    try {
      let cookie = req.cookies.get('token')?.value;
      const decoded = jwt(cookie as string) as any;
      const role = req.cookies.get('role')?.value;
      if (decoded?.exp * 1000 > new Date().getTime()) {
        if (role !== process.env.NEXT_PUBLIC_TEACHER_ROLE_STRING) {
          url.pathname = '/admin';
          return NextResponse.redirect(url);
        }
      } else {
        url.pathname = '/signin';
        return NextResponse.redirect(url);
      }
    } catch (error) {
      url.pathname = '/signin';

      return NextResponse.redirect(url);
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
      url.pathname = '/signin';
      return NextResponse.redirect(url);
    }
  }
}
