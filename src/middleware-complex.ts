import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { AuthMiddleware } from '@/lib/security/auth-middleware';
import { InputValidator } from '@/lib/security/input-validator';
import { rateLimit, TIERED_LIMITS } from '@/lib/security/rate-limiter';
import { securityLogger } from '@/lib/security/security-logger';

// 保護されるパス設定
const PROTECTED_PATHS = {
  // 認証が必要なパス
  AUTH_REQUIRED: [
    '/dashboard',
    '/profile',
    '/api/divination',
    '/api/user'
  ],
  
  // 管理者権限が必要なパス
  ADMIN_REQUIRED: [
    '/admin',
    '/api/admin'
  ],
  
  // API パス
  API_PATHS: [
    '/api'
  ],
  
  // 静的ファイル（保護不要）
  STATIC_PATHS: [
    '/_next',
    '/favicon.ico',
    '/images',
    '/icons'
  ]
};

// レート制限設定
const RATE_LIMIT_CONFIG = {
  '/api/auth': TIERED_LIMITS.AUTH,
  '/api/divination': TIERED_LIMITS.DIVINATION,
  '/api/admin': TIERED_LIMITS.STRICT,
  'default': TIERED_LIMITS.STRICT
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  try {
    // 静的ファイルはスキップ
    if (PROTECTED_PATHS.STATIC_PATHS.some(path => pathname.startsWith(path))) {
      return NextResponse.next();
    }

    let supabaseResponse = NextResponse.next({
      request,
    })

    // セキュリティヘッダーを設定
    AuthMiddleware.setSecurityHeaders(supabaseResponse);

    // レート制限チェック
    const rateLimitResult = await checkRateLimit(request, pathname);
    if (!rateLimitResult.allowed) {
      return rateLimitResult.response!;
    }

    // API リクエストの入力検証
    if (pathname.startsWith('/api/') && request.method !== 'GET') {
      const validationResult = await validateAPIRequest(request);
      if (!validationResult.valid) {
        return validationResult.response!;
      }
    }

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            )
            supabaseResponse = NextResponse.next({
              request,
            })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    const {
      data: { user },
    } = await supabase.auth.getUser()

    // 管理者権限が必要なパスの処理
    if (PROTECTED_PATHS.ADMIN_REQUIRED.some(path => pathname.startsWith(path))) {
      if (!user) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
      }
      
      // 管理者権限チェック（プロファイルテーブルからロールを確認）
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (!profile || !['admin', 'super_admin'].includes(profile.role)) {
        await securityLogger.logSecurityEvent({
          type: 'insufficient_permissions',
          ip: getClientIP(request),
          path: pathname,
          userId: user.id,
          userRole: profile?.role,
          requiredRoles: ['admin', 'super_admin'],
          timestamp: new Date()
        });
        
        const url = request.nextUrl.clone()
        url.pathname = '/unauthorized'
        return NextResponse.redirect(url)
      }
    }

    // 認証が必要なパス（管理者以外）
    if (
      !user &&
      !request.nextUrl.pathname.startsWith('/login') &&
      !request.nextUrl.pathname.startsWith('/auth') &&
      !request.nextUrl.pathname.startsWith('/') && // ランディングページは除外
      PROTECTED_PATHS.AUTH_REQUIRED.some(path => pathname.startsWith(path))
    ) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }

    // セキュリティ監査ログ
    if (user) {
      await AuthMiddleware.auditRequest(request, user);
    }

    return supabaseResponse;

  } catch (error) {
    console.error('Middleware error:', error);
    
    // セキュリティログに記録
    await securityLogger.logSecurityEvent({
      type: 'middleware_error',
      ip: getClientIP(request),
      path: pathname,
      error: error instanceof Error ? error.message : 'Unknown middleware error',
      timestamp: new Date()
    });

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * レート制限チェック
 */
async function checkRateLimit(
  request: NextRequest, 
  pathname: string
): Promise<{ allowed: boolean; response?: NextResponse }> {
  try {
    const clientIP = getClientIP(request);
    
    // パスに応じたレート制限ルールを取得
    const rules = getRateLimitRules(pathname);
    
    const result = await rateLimit.checkMultiple(clientIP, rules);
    
    if (!result.allowed) {
      await securityLogger.logSecurityEvent({
        type: 'rate_limit_exceeded',
        ip: clientIP,
        path: pathname,
        details: {
          failedRule: result.failedRule,
          userAgent: request.headers.get('user-agent')
        },
        timestamp: new Date()
      });

      return {
        allowed: false,
        response: NextResponse.json(
          { 
            error: 'Rate limit exceeded',
            retryAfter: Math.max(...result.details.map(d => d.resetTime || 0))
          },
          { 
            status: 429,
            headers: {
              'Retry-After': '60',
              'X-RateLimit-Limit': rules[0]?.maxRequests.toString() || '10',
              'X-RateLimit-Remaining': '0'
            }
          }
        )
      };
    }

    return { allowed: true };
  } catch (error) {
    console.error('Rate limit check error:', error);
    return { allowed: true }; // エラー時は通す（フェイルオープン）
  }
}

/**
 * API リクエストの入力検証
 */
async function validateAPIRequest(
  request: NextRequest
): Promise<{ valid: boolean; response?: NextResponse }> {
  try {
    const body = await request.clone().json().catch(() => null);
    if (!body) return { valid: true }; // JSON以外はスキップ

    const clientIP = getClientIP(request);
    
    // 基本的な脅威検出
    const result = await InputValidator.validate(body, {}, {
      ip: clientIP,
      path: request.nextUrl.pathname
    });

    if (result.threats.length > 0) {
      return {
        valid: false,
        response: NextResponse.json(
          { error: 'Invalid request data' },
          { status: 400 }
        )
      };
    }

    return { valid: true };
  } catch (error) {
    console.error('API validation error:', error);
    return { valid: true }; // エラー時は通す
  }
}

/**
 * パスに応じたレート制限ルールを取得
 */
function getRateLimitRules(pathname: string): Array<{ maxRequests: number; windowSeconds: number; name: string }> {
  for (const [path, rules] of Object.entries(RATE_LIMIT_CONFIG)) {
    if (path !== 'default' && pathname.startsWith(path)) {
      return rules;
    }
  }
  return RATE_LIMIT_CONFIG.default;
}

/**
 * クライアントIPを取得
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
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}