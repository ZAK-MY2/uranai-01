// Authentication and authorization middleware
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { rateLimit } from './rate-limiter';
import { securityLogger } from './security-logger';

interface AuthOptions {
  requireAuth?: boolean;
  requireRole?: string[];
  rateLimit?: {
    requests: number;
    window: number; // seconds
  };
  csrfProtection?: boolean;
  ipWhitelist?: string[];
}

export class AuthMiddleware {
  /**
   * 認証ミドルウェア
   */
  static async authenticate(
    request: NextRequest,
    options: AuthOptions = {}
  ): Promise<{ success: boolean; user?: any; error?: string; response?: NextResponse }> {
    try {
      // IP許可リストチェック
      if (options.ipWhitelist) {
        const clientIP = this.getClientIP(request);
        if (!options.ipWhitelist.includes(clientIP)) {
          await securityLogger.logSecurityEvent({
            type: 'ip_blocked',
            ip: clientIP,
            path: request.nextUrl.pathname,
            timestamp: new Date()
          });
          
          return {
            success: false,
            error: 'Access denied from this IP address',
            response: NextResponse.json({ error: 'Access denied' }, { status: 403 })
          };
        }
      }

      // レート制限チェック
      if (options.rateLimit) {
        const clientIP = this.getClientIP(request);
        const rateLimitResult = await rateLimit.check(
          `${clientIP}:${request.nextUrl.pathname}`,
          options.rateLimit.requests,
          options.rateLimit.window
        );

        if (!rateLimitResult.allowed) {
          await securityLogger.logSecurityEvent({
            type: 'rate_limit_exceeded',
            ip: clientIP,
            path: request.nextUrl.pathname,
            limit: options.rateLimit.requests,
            window: options.rateLimit.window,
            timestamp: new Date()
          });

          return {
            success: false,
            error: 'Rate limit exceeded',
            response: NextResponse.json(
              { 
                error: 'Too many requests',
                retryAfter: rateLimitResult.resetTime 
              }, 
              { 
                status: 429,
                headers: {
                  'Retry-After': rateLimitResult.resetTime?.toString() || '60',
                  'X-RateLimit-Limit': options.rateLimit.requests.toString(),
                  'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
                  'X-RateLimit-Reset': rateLimitResult.resetTime?.toString() || ''
                }
              }
            )
          };
        }
      }

      // CSRF保護
      if (options.csrfProtection && request.method !== 'GET') {
        const csrfResult = await this.validateCSRF(request);
        if (!csrfResult.valid) {
          await securityLogger.logSecurityEvent({
            type: 'csrf_violation',
            ip: this.getClientIP(request),
            path: request.nextUrl.pathname,
            userAgent: request.headers.get('user-agent') || '',
            timestamp: new Date()
          });

          return {
            success: false,
            error: 'CSRF token validation failed',
            response: NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 })
          };
        }
      }

      // 認証が不要な場合はここで終了
      if (!options.requireAuth) {
        return { success: true };
      }

      // Supabase認証チェック
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            get(name: string) {
              return request.cookies.get(name)?.value;
            },
            set() {
              // Server-side読み取り専用
            },
            remove() {
              // Server-side読み取り専用
            },
          },
        }
      );

      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user) {
        await securityLogger.logSecurityEvent({
          type: 'unauthorized_access',
          ip: this.getClientIP(request),
          path: request.nextUrl.pathname,
          error: error?.message,
          timestamp: new Date()
        });

        return {
          success: false,
          error: 'Authentication required',
          response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        };
      }

      // ロール要件チェック
      if (options.requireRole && options.requireRole.length > 0) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (!profile || !options.requireRole.includes(profile.role)) {
          await securityLogger.logSecurityEvent({
            type: 'insufficient_permissions',
            ip: this.getClientIP(request),
            path: request.nextUrl.pathname,
            userId: user.id,
            userRole: profile?.role,
            requiredRoles: options.requireRole,
            timestamp: new Date()
          });

          return {
            success: false,
            error: 'Insufficient permissions',
            response: NextResponse.json({ error: 'Forbidden' }, { status: 403 })
          };
        }
      }

      return { success: true, user };

    } catch (error) {
      console.error('Authentication error:', error);
      
      await securityLogger.logSecurityEvent({
        type: 'auth_error',
        ip: this.getClientIP(request),
        path: request.nextUrl.pathname,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date()
      });

      return {
        success: false,
        error: 'Authentication system error',
        response: NextResponse.json({ error: 'Internal server error' }, { status: 500 })
      };
    }
  }

  /**
   * クライアントIP取得
   */
  private static getClientIP(request: NextRequest): string {
    // Vercel、Cloudflare等のプロキシ経由の場合のヘッダーをチェック
    const forwarded = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');
    const vercelIP = request.headers.get('x-vercel-forwarded-for');
    
    if (forwarded) {
      return forwarded.split(',')[0].trim();
    }
    
    if (vercelIP) {
      return vercelIP.split(',')[0].trim();
    }
    
    if (realIP) {
      return realIP;
    }

    // フォールバック
    return 'unknown';
  }

  /**
   * CSRF トークン検証
   */
  private static async validateCSRF(request: NextRequest): Promise<{ valid: boolean; error?: string }> {
    try {
      const csrfToken = request.headers.get('x-csrf-token') || 
                       request.headers.get('x-xsrf-token') ||
                       request.cookies.get('csrf-token')?.value;

      if (!csrfToken) {
        return { valid: false, error: 'Missing CSRF token' };
      }

      // CSRFトークンの検証ロジック
      // 実際の実装では、セッションに保存されたトークンと照合
      const expectedToken = await this.getExpectedCSRFToken(request);
      
      if (csrfToken !== expectedToken) {
        return { valid: false, error: 'Invalid CSRF token' };
      }

      return { valid: true };

    } catch (error) {
      return { 
        valid: false, 
        error: `CSRF validation error: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
  }

  /**
   * 期待されるCSRFトークン取得
   */
  private static async getExpectedCSRFToken(request: NextRequest): Promise<string> {
    // セッションまたはデータベースから期待されるトークンを取得
    // 簡略化された実装例
    const sessionId = request.cookies.get('session-id')?.value;
    if (!sessionId) {
      throw new Error('No session found');
    }

    // 実際の実装では Redis やデータベースから取得
    return `csrf-${sessionId}`;
  }

  /**
   * セキュリティヘッダー設定
   */
  static setSecurityHeaders(response: NextResponse): void {
    // Content Security Policy
    response.headers.set(
      'Content-Security-Policy',
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com; " +
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
      "font-src 'self' https://fonts.gstatic.com; " +
      "img-src 'self' data: https:; " +
      "connect-src 'self' https://*.supabase.co; " +
      "frame-ancestors 'none';"
    );

    // その他のセキュリティヘッダー
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    
    // HSTS (HTTPS環境でのみ)
    if (process.env.NODE_ENV === 'production') {
      response.headers.set(
        'Strict-Transport-Security',
        'max-age=31536000; includeSubDomains; preload'
      );
    }
  }

  /**
   * セキュリティ監査ログ
   */
  static async auditRequest(request: NextRequest, user?: any): Promise<void> {
    const sensitiveEndpoints = [
      '/api/admin',
      '/api/auth',
      '/api/user/profile'
    ];

    const isSensitive = sensitiveEndpoints.some(endpoint => 
      request.nextUrl.pathname.startsWith(endpoint)
    );

    if (isSensitive) {
      await securityLogger.logSecurityEvent({
        type: 'sensitive_endpoint_access',
        ip: this.getClientIP(request),
        path: request.nextUrl.pathname,
        method: request.method,
        userId: user?.id,
        userAgent: request.headers.get('user-agent') || '',
        timestamp: new Date()
      });
    }
  }
}

/**
 * ミドルウェア関数エクスポート
 */
export function withAuth(options: AuthOptions = {}) {
  return async function(request: NextRequest) {
    const result = await AuthMiddleware.authenticate(request, options);
    
    if (!result.success && result.response) {
      return result.response;
    }

    // 監査ログ
    await AuthMiddleware.auditRequest(request, result.user);

    return null; // 認証成功時はnullを返して処理を続行
  };
}