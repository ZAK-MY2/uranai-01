import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 認証不要なパス
const publicPaths = ['/entry', '/api/public', '/_next', '/static', '/favicon.ico'];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // 公開パスはそのまま通す
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }
  
  // トップページは/entryにリダイレクト
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/entry', request.url));
  }
  
  // 他のパスはそのまま通す（認証チェックはクライアントサイドで行う）
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
};