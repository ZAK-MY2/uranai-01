import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * 本番環境用シンプル・確実なミドルウェア
 * セキュリティを保ちつつ、依存関係を最小化
 */

// シンプルなレート制限（メモリベース）
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15分
const RATE_LIMIT_MAX = 100; // 15分で100リクエスト

// 保護されるパス設定
const PROTECTED_PATHS = [
  '/profile',
  '/api/divination',
  '/api/user'
];

const ADMIN_PATHS = [
  '/admin',
  '/api/admin'
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  try {
    // 静的ファイルはスキップ
    if (pathname.startsWith('/_next') || 
        pathname.startsWith('/favicon') || 
        pathname.includes('.')) {
      return NextResponse.next();
    }

    // レスポンス作成
    let response = NextResponse.next();

    // セキュリティヘッダー設定
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    // CSP（本番用：厳格）
    if (process.env.NODE_ENV === 'production') {
      response.headers.set('Content-Security-Policy', 
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com; " +
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
        "img-src 'self' data: blob: https://www.google-analytics.com; " +
        "font-src 'self' data: https://fonts.gstatic.com; " +
        "connect-src 'self' https://*.supabase.co https://*.supabase.in https://www.google-analytics.com;"
      );
    }

    // レート制限チェック
    const clientIP = getClientIP(request);
    if (!checkRateLimit(clientIP)) {
      return NextResponse.json(
        { error: 'Too Many Requests' },
        { 
          status: 429,
          headers: { 'Retry-After': '900' } // 15分
        }
      );
    }

    // Supabaseクライアント作成
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    // ユーザー認証チェック
    const { data: { user } } = await supabase.auth.getUser()

    // 管理者パスの保護
    if (ADMIN_PATHS.some(path => pathname.startsWith(path))) {
      if (!user) {
        return NextResponse.redirect(new URL('/login', request.url))
      }
      
      // 簡易管理者チェック（メールドメインベース）
      const isAdmin = user.email?.includes('@admin.') || 
                     user.email?.includes('@cosmic-oracle.') ||
                     user.user_metadata?.role === 'admin';
      
      if (!isAdmin) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 403 }
        )
      }
    }

    // 認証保護パス
    if (PROTECTED_PATHS.some(path => pathname.startsWith(path))) {
      // 本番環境では認証必須、ただしデモ用スキップ可能
      if (process.env.NODE_ENV === 'production' && !process.env.SKIP_AUTH_FOR_DEMO && !user) {
        return NextResponse.redirect(new URL('/login', request.url))
      }
    }

    return response;

  } catch (error) {
    console.error('Middleware error:', error);
    
    // エラー時は通す（フェイルオープン）
    return NextResponse.next();
  }
}

/**
 * シンプルなレート制限実装
 */
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW;
  
  // 古いエントリをクリーンアップ
  for (const [key, value] of rateLimitMap.entries()) {
    if (value.resetTime < windowStart) {
      rateLimitMap.delete(key);
    }
  }
  
  const current = rateLimitMap.get(ip);
  if (!current) {
    rateLimitMap.set(ip, { count: 1, resetTime: now });
    return true;
  }
  
  if (current.resetTime < windowStart) {
    rateLimitMap.set(ip, { count: 1, resetTime: now });
    return true;
  }
  
  current.count++;
  return current.count <= RATE_LIMIT_MAX;
}

/**
 * クライアントIP取得（Vercel対応）
 */
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const vercelIP = request.headers.get('x-vercel-forwarded-for');
  
  if (forwarded) return forwarded.split(',')[0].trim();
  if (vercelIP) return vercelIP.split(',')[0].trim();
  if (realIP) return realIP;
  
  return '127.0.0.1';
}

export const config = {
  matcher: [
    /*
     * 以下を除くすべてのパスにマッチ:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}