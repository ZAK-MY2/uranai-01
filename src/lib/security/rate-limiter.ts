// Rate limiting system
interface RateLimitEntry {
  count: number;
  resetTime: number;
  createdAt: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime?: number;
  totalRequests: number;
}

interface RateLimitConfig {
  windowMs: number; // Window in milliseconds
  maxRequests: number; // Max requests per window
  message?: string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

export class RateLimiter {
  private store = new Map<string, RateLimitEntry>();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // 期限切れエントリのクリーンアップ（1分間隔）
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 60 * 1000);
  }

  /**
   * レート制限チェック
   */
  async check(
    key: string, 
    maxRequests: number, 
    windowSeconds: number
  ): Promise<RateLimitResult> {
    const now = Date.now();
    const windowMs = windowSeconds * 1000;
    const resetTime = now + windowMs;

    let entry = this.store.get(key);

    // エントリが存在しないか、ウィンドウが過ぎている場合は新規作成
    if (!entry || now >= entry.resetTime) {
      entry = {
        count: 1,
        resetTime,
        createdAt: now
      };
      this.store.set(key, entry);

      return {
        allowed: true,
        remaining: maxRequests - 1,
        resetTime,
        totalRequests: 1
      };
    }

    // カウント増加
    entry.count++;

    // 制限チェック
    if (entry.count > maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime,
        totalRequests: entry.count
      };
    }

    return {
      allowed: true,
      remaining: maxRequests - entry.count,
      resetTime: entry.resetTime,
      totalRequests: entry.count
    };
  }

  /**
   * 複数の制限ルールをチェック
   */
  async checkMultiple(
    key: string,
    rules: Array<{ maxRequests: number; windowSeconds: number; name: string }>
  ): Promise<{ allowed: boolean; failedRule?: string; details: RateLimitResult[] }> {
    const results: RateLimitResult[] = [];

    for (const rule of rules) {
      const ruleKey = `${key}:${rule.name}`;
      const result = await this.check(ruleKey, rule.maxRequests, rule.windowSeconds);
      results.push(result);

      if (!result.allowed) {
        return {
          allowed: false,
          failedRule: rule.name,
          details: results
        };
      }
    }

    return {
      allowed: true,
      details: results
    };
  }

  /**
   * IP別レート制限
   */
  async checkIP(
    ip: string,
    maxRequests: number,
    windowSeconds: number
  ): Promise<RateLimitResult> {
    return this.check(`ip:${ip}`, maxRequests, windowSeconds);
  }

  /**
   * ユーザー別レート制限
   */
  async checkUser(
    userId: string,
    maxRequests: number,
    windowSeconds: number
  ): Promise<RateLimitResult> {
    return this.check(`user:${userId}`, maxRequests, windowSeconds);
  }

  /**
   * エンドポイント別レート制限
   */
  async checkEndpoint(
    endpoint: string,
    ip: string,
    maxRequests: number,
    windowSeconds: number
  ): Promise<RateLimitResult> {
    return this.check(`endpoint:${endpoint}:${ip}`, maxRequests, windowSeconds);
  }

  /**
   * グローバルレート制限
   */
  async checkGlobal(
    maxRequests: number,
    windowSeconds: number
  ): Promise<RateLimitResult> {
    return this.check('global', maxRequests, windowSeconds);
  }

  /**
   * 統計情報取得
   */
  getStats(): {
    totalKeys: number;
    totalRequests: number;
    memoryUsage: string;
    topConsumers: Array<{ key: string; requests: number; resetTime: number }>;
  } {
    const entries = Array.from(this.store.entries());
    const totalRequests = entries.reduce((sum, [, entry]) => sum + entry.count, 0);
    const memoryUsage = `${(JSON.stringify(entries).length / 1024).toFixed(2)}KB`;

    // 上位10件の消費者
    const topConsumers = entries
      .map(([key, entry]) => ({ key, requests: entry.count, resetTime: entry.resetTime }))
      .sort((a, b) => b.requests - a.requests)
      .slice(0, 10);

    return {
      totalKeys: this.store.size,
      totalRequests,
      memoryUsage,
      topConsumers
    };
  }

  /**
   * 期限切れエントリのクリーンアップ
   */
  private cleanup(): void {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, entry] of this.store.entries()) {
      if (now >= entry.resetTime) {
        this.store.delete(key);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      console.log(`Rate limiter cleaned up ${cleaned} expired entries`);
    }
  }

  /**
   * 特定キーの制限をリセット
   */
  reset(key: string): boolean {
    return this.store.delete(key);
  }

  /**
   * 全ての制限をリセット
   */
  resetAll(): void {
    this.store.clear();
  }

  /**
   * クリーンアップ停止
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.store.clear();
  }
}

// 事前定義されたレート制限設定
export const RATE_LIMITS = {
  // 一般的なAPI制限
  DEFAULT: { maxRequests: 100, windowSeconds: 60 }, // 1分間に100リクエスト
  
  // 認証関連（厳しい制限）
  AUTH: { maxRequests: 5, windowSeconds: 60 }, // 1分間に5回の認証試行
  
  // 管理者API（中程度の制限）
  ADMIN: { maxRequests: 50, windowSeconds: 60 }, // 1分間に50リクエスト
  
  // 占術関連（緩い制限）
  DIVINATION: { maxRequests: 10, windowSeconds: 60 }, // 1分間に10回の占術
  
  // 重い処理（非常に厳しい制限）
  HEAVY: { maxRequests: 2, windowSeconds: 60 }, // 1分間に2回
  
  // グローバル制限
  GLOBAL: { maxRequests: 1000, windowSeconds: 60 }, // 全体で1分間に1000リクエスト
};

// 階層的レート制限ルール
export const TIERED_LIMITS = {
  // 短期・中期・長期の組み合わせ
  STRICT: [
    { name: 'burst', maxRequests: 10, windowSeconds: 10 }, // 10秒で10回
    { name: 'sustained', maxRequests: 100, windowSeconds: 300 }, // 5分で100回
    { name: 'daily', maxRequests: 1000, windowSeconds: 86400 }, // 1日で1000回
  ],
  
  // 占術専用
  DIVINATION: [
    { name: 'immediate', maxRequests: 3, windowSeconds: 30 }, // 30秒で3回
    { name: 'hourly', maxRequests: 20, windowSeconds: 3600 }, // 1時間で20回
    { name: 'daily', maxRequests: 100, windowSeconds: 86400 }, // 1日で100回
  ],
  
  // 認証専用
  AUTH: [
    { name: 'rapid', maxRequests: 3, windowSeconds: 60 }, // 1分で3回
    { name: 'hourly', maxRequests: 10, windowSeconds: 3600 }, // 1時間で10回
    { name: 'daily', maxRequests: 50, windowSeconds: 86400 }, // 1日で50回
  ],
};

// シングルトンインスタンス
export const rateLimit = new RateLimiter();