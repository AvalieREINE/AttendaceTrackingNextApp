import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jwt-decode';
export const config = {
  matcher: '/'
};
export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  url.pathname = '/signin';
  try {
    let cookie = req.cookies.get('token')?.value;
    const decoded = jwt(cookie as string) as any;
    if (!cookie || decoded?.exp * 1000 < new Date().getTime()) {
      return NextResponse.redirect('/signin');
    }
  } catch (error) {
    return NextResponse.redirect(url);
  }
}
