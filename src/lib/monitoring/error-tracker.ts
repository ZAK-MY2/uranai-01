// Error tracking and monitoring system
import { securityLogger } from '@/lib/security/security-logger';

export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';
export type ErrorCategory = 
  | 'divination_error'
  | 'api_error'
  | 'database_error'
  | 'validation_error'
  | 'authentication_error'
  | 'external_service_error'
  | 'performance_error'
  | 'security_error'
  | 'unknown_error';

interface ErrorContext {
  userId?: string;
  sessionId?: string;
  requestId?: string;
  path?: string;
  method?: string;
  userAgent?: string;
  ip?: string;
  component?: string;
  action?: string;
  metadata?: Record<string, any>;
}

interface TrackedError {
  id: string;
  timestamp: Date;
  message: string;
  stack?: string;
  category: ErrorCategory;
  severity: ErrorSeverity;
  context: ErrorContext;
  fingerprint: string;
  count: number;
  firstSeen: Date;
  lastSeen: Date;
  resolved: boolean;
  resolvedAt?: Date;
  resolvedBy?: string;
  notes?: string[];
}

interface ErrorMetrics {
  totalErrors: number;
  errorsByCategory: Record<ErrorCategory, number>;
  errorsBySeverity: Record<ErrorSeverity, number>;
  errorRate: number; // errors per minute
  topErrors: Array<{
    fingerprint: string;
    message: string;
    count: number;
    category: ErrorCategory;
  }>;
  recentErrors: TrackedError[];
}

export class ErrorTracker {
  private errors: Map<string, TrackedError> = new Map();
  private errorLog: TrackedError[] = [];
  private readonly maxErrors = 10000;
  private readonly maxErrorLogSize = 1000;
  private errorRateWindow = new Map<number, number>(); // timestamp -> count

  /**
   * エラーを追跡
   */
  async trackError(
    error: Error | string,
    category: ErrorCategory = 'unknown_error',
    context: ErrorContext = {},
    severity?: ErrorSeverity
  ): Promise<string> {
    try {
      const errorMessage = error instanceof Error ? error.message : error;
      const errorStack = error instanceof Error ? error.stack : undefined;
      
      // エラーの重要度を自動判定
      if (!severity) {
        severity = this.determineSeverity(errorMessage, category);
      }

      // フィンガープリントを生成（同じエラーをグループ化）
      const fingerprint = this.generateFingerprint(errorMessage, category, errorStack);
      
      const timestamp = new Date();
      const errorId = this.generateErrorId();

      // 既存のエラーかチェック
      const existingError = this.errors.get(fingerprint);
      
      if (existingError) {
        // 既存エラーの更新
        existingError.count++;
        existingError.lastSeen = timestamp;
        
        // コンテキストをマージ
        existingError.context = {
          ...existingError.context,
          ...context
        };
      } else {
        // 新規エラーの作成
        const trackedError: TrackedError = {
          id: errorId,
          timestamp,
          message: errorMessage,
          stack: errorStack,
          category,
          severity,
          context,
          fingerprint,
          count: 1,
          firstSeen: timestamp,
          lastSeen: timestamp,
          resolved: false
        };
        
        this.errors.set(fingerprint, trackedError);
        this.errorLog.push(trackedError);
        
        // メモリ管理
        this.cleanup();
      }

      // エラーレート追跡
      this.trackErrorRate(timestamp);

      // 重大なエラーの場合、即座に通知
      if (severity === 'critical' || severity === 'high') {
        await this.notifyCriticalError(errorMessage, category, severity, context);
      }

      // セキュリティ関連エラーはセキュリティログにも記録
      if (category === 'security_error' || category === 'authentication_error') {
        await this.logSecurityError(errorMessage, context);
      }

      // 外部監視サービスに送信（本番環境）
      if (process.env.NODE_ENV === 'production') {
        await this.sendToExternalMonitoring(error, category, severity, context);
      }

      return errorId;

    } catch (trackingError) {
      console.error('Error tracking failed:', trackingError);
      return 'error-tracking-failed';
    }
  }

  /**
   * エラーの重要度を自動判定
   */
  private determineSeverity(message: string, category: ErrorCategory): ErrorSeverity {
    // カテゴリーベースの判定
    const criticalCategories: ErrorCategory[] = ['database_error', 'security_error'];
    const highCategories: ErrorCategory[] = ['authentication_error', 'api_error'];
    const mediumCategories: ErrorCategory[] = ['validation_error', 'external_service_error'];
    
    if (criticalCategories.includes(category)) return 'critical';
    if (highCategories.includes(category)) return 'high';
    if (mediumCategories.includes(category)) return 'medium';

    // メッセージベースの判定
    const criticalKeywords = ['fatal', 'crash', 'critical', 'emergency'];
    const highKeywords = ['error', 'failed', 'unauthorized', 'forbidden'];
    const mediumKeywords = ['warning', 'deprecated', 'slow', 'timeout'];
    
    const lowerMessage = message.toLowerCase();
    
    if (criticalKeywords.some(keyword => lowerMessage.includes(keyword))) return 'critical';
    if (highKeywords.some(keyword => lowerMessage.includes(keyword))) return 'high';
    if (mediumKeywords.some(keyword => lowerMessage.includes(keyword))) return 'medium';
    
    return 'low';
  }

  /**
   * エラーのフィンガープリント生成
   */
  private generateFingerprint(message: string, category: ErrorCategory, stack?: string): string {
    // スタックトレースから位置情報を抽出
    let location = '';
    if (stack) {
      const match = stack.match(/at\s+(.+?)\s+\((.+?):(\d+):(\d+)\)/);
      if (match) {
        location = `${match[2]}:${match[3]}`;
      }
    }

    // メッセージから動的な部分を除去
    const normalizedMessage = message
      .replace(/\b\d+\b/g, 'N') // 数字を置換
      .replace(/\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi, 'UUID') // UUIDを置換
      .replace(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, 'IP'); // IPアドレスを置換

    return `${category}:${normalizedMessage}:${location}`;
  }

  /**
   * エラーIDの生成
   */
  private generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * エラーレートの追跡
   */
  private trackErrorRate(timestamp: Date): void {
    const minute = Math.floor(timestamp.getTime() / 60000);
    this.errorRateWindow.set(minute, (this.errorRateWindow.get(minute) || 0) + 1);
    
    // 古いエントリーを削除（1時間以上前）
    const hourAgo = minute - 60;
    for (const [key] of this.errorRateWindow) {
      if (key < hourAgo) {
        this.errorRateWindow.delete(key);
      }
    }
  }

  /**
   * クリーンアップ
   */
  private cleanup(): void {
    // エラーログのサイズ制限
    if (this.errorLog.length > this.maxErrorLogSize) {
      this.errorLog = this.errorLog.slice(-this.maxErrorLogSize);
    }

    // エラーマップのサイズ制限
    if (this.errors.size > this.maxErrors) {
      // 古いエラーから削除
      const sortedErrors = Array.from(this.errors.entries())
        .sort((a, b) => a[1].lastSeen.getTime() - b[1].lastSeen.getTime());
      
      const toRemove = sortedErrors.slice(0, this.errors.size - this.maxErrors);
      toRemove.forEach(([fingerprint]) => this.errors.delete(fingerprint));
    }
  }

  /**
   * 重大エラーの通知
   */
  private async notifyCriticalError(
    message: string,
    category: ErrorCategory,
    severity: ErrorSeverity,
    context: ErrorContext
  ): Promise<void> {
    console.error(`[${severity.toUpperCase()} ERROR] ${category}: ${message}`, context);
    
    // 外部通知サービスへの送信
    if (process.env.CRITICAL_ERROR_WEBHOOK_URL) {
      try {
        await fetch(process.env.CRITICAL_ERROR_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: `🚨 ${severity.toUpperCase()} ERROR`,
            attachments: [{
              color: severity === 'critical' ? 'danger' : 'warning',
              fields: [
                { title: 'Category', value: category, short: true },
                { title: 'Message', value: message, short: false },
                { title: 'User ID', value: context.userId || 'N/A', short: true },
                { title: 'Path', value: context.path || 'N/A', short: true }
              ],
              timestamp: new Date().toISOString()
            }]
          })
        });
      } catch (notifyError) {
        console.error('Failed to send critical error notification:', notifyError);
      }
    }
  }

  /**
   * セキュリティエラーのログ
   */
  private async logSecurityError(message: string, context: ErrorContext): Promise<void> {
    await securityLogger.logSecurityEvent({
      type: 'security_error',
      ip: context.ip || 'unknown',
      path: context.path,
      method: context.method,
      userId: context.userId,
      userAgent: context.userAgent,
      error: message,
      details: context.metadata,
      timestamp: new Date()
    });
  }

  /**
   * 外部監視サービスへの送信
   */
  private async sendToExternalMonitoring(
    error: Error | string,
    category: ErrorCategory,
    severity: ErrorSeverity,
    context: ErrorContext
  ): Promise<void> {
    // Sentry
    if (process.env.SENTRY_DSN) {
      // Sentry SDK integration
      console.log('Would send to Sentry:', { error, category, severity, context });
    }

    // Custom monitoring endpoint
    if (process.env.ERROR_MONITORING_ENDPOINT) {
      try {
        await fetch(process.env.ERROR_MONITORING_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            error: error instanceof Error ? {
              message: error.message,
              stack: error.stack,
              name: error.name
            } : { message: error },
            category,
            severity,
            context,
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV
          })
        });
      } catch (sendError) {
        console.error('Failed to send to monitoring service:', sendError);
      }
    }
  }

  /**
   * エラーメトリクスの取得
   */
  getMetrics(timeWindow?: number): ErrorMetrics {
    const now = Date.now();
    const windowStart = timeWindow ? now - timeWindow : 0;
    
    // 時間窓内のエラーをフィルタ
    const relevantErrors = Array.from(this.errors.values())
      .filter(error => error.lastSeen.getTime() >= windowStart);

    // カテゴリー別集計
    const errorsByCategory = relevantErrors.reduce((acc, error) => {
      acc[error.category] = (acc[error.category] || 0) + error.count;
      return acc;
    }, {} as Record<ErrorCategory, number>);

    // 重要度別集計
    const errorsBySeverity = relevantErrors.reduce((acc, error) => {
      acc[error.severity] = (acc[error.severity] || 0) + error.count;
      return acc;
    }, {} as Record<ErrorSeverity, number>);

    // エラーレート計算（過去5分間）
    const fiveMinutesAgo = Math.floor(now / 60000) - 5;
    let recentErrorCount = 0;
    for (const [minute, count] of this.errorRateWindow) {
      if (minute >= fiveMinutesAgo) {
        recentErrorCount += count;
      }
    }
    const errorRate = recentErrorCount / 5; // per minute

    // トップエラー
    const topErrors = relevantErrors
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
      .map(error => ({
        fingerprint: error.fingerprint,
        message: error.message,
        count: error.count,
        category: error.category
      }));

    // 最近のエラー
    const recentErrors = this.errorLog
      .filter(error => error.timestamp.getTime() >= windowStart)
      .slice(-20);

    return {
      totalErrors: relevantErrors.reduce((sum, error) => sum + error.count, 0),
      errorsByCategory,
      errorsBySeverity,
      errorRate,
      topErrors,
      recentErrors
    };
  }

  /**
   * エラーの解決
   */
  resolveError(fingerprint: string, resolvedBy: string, notes?: string): boolean {
    const error = this.errors.get(fingerprint);
    if (!error) return false;

    error.resolved = true;
    error.resolvedAt = new Date();
    error.resolvedBy = resolvedBy;
    if (notes) {
      error.notes = error.notes || [];
      error.notes.push(notes);
    }

    return true;
  }

  /**
   * エラーの検索
   */
  searchErrors(criteria: {
    category?: ErrorCategory;
    severity?: ErrorSeverity;
    resolved?: boolean;
    searchTerm?: string;
    timeRange?: { start: Date; end: Date };
  }): TrackedError[] {
    let results = Array.from(this.errors.values());

    if (criteria.category) {
      results = results.filter(error => error.category === criteria.category);
    }

    if (criteria.severity) {
      results = results.filter(error => error.severity === criteria.severity);
    }

    if (criteria.resolved !== undefined) {
      results = results.filter(error => error.resolved === criteria.resolved);
    }

    if (criteria.searchTerm) {
      const term = criteria.searchTerm.toLowerCase();
      results = results.filter(error => 
        error.message.toLowerCase().includes(term) ||
        error.context.component?.toLowerCase().includes(term) ||
        error.context.action?.toLowerCase().includes(term)
      );
    }

    if (criteria.timeRange) {
      results = results.filter(error => 
        error.lastSeen >= criteria.timeRange!.start &&
        error.lastSeen <= criteria.timeRange!.end
      );
    }

    return results.sort((a, b) => b.lastSeen.getTime() - a.lastSeen.getTime());
  }

  /**
   * エラーパターンの分析
   */
  analyzePatterns(): {
    recurringPatterns: Array<{ pattern: string; errors: TrackedError[]; }>;
    correlations: Array<{ error1: string; error2: string; correlation: number; }>;
    trends: Array<{ category: ErrorCategory; trend: 'increasing' | 'decreasing' | 'stable'; }>;
  } {
    // 実装は簡略化
    return {
      recurringPatterns: [],
      correlations: [],
      trends: []
    };
  }

  /**
   * エラーレポートの生成
   */
  generateReport(timeRange: { start: Date; end: Date }): string {
    const errors = this.searchErrors({ timeRange });
    const metrics = this.getMetrics(timeRange.end.getTime() - timeRange.start.getTime());

    return `
# Error Report
Period: ${timeRange.start.toISOString()} - ${timeRange.end.toISOString()}

## Summary
- Total Errors: ${metrics.totalErrors}
- Error Rate: ${metrics.errorRate.toFixed(2)} errors/minute
- Unique Errors: ${errors.length}

## By Category
${Object.entries(metrics.errorsByCategory)
  .map(([cat, count]) => `- ${cat}: ${count}`)
  .join('\n')}

## By Severity
${Object.entries(metrics.errorsBySeverity)
  .map(([sev, count]) => `- ${sev}: ${count}`)
  .join('\n')}

## Top Errors
${metrics.topErrors
  .map((err, i) => `${i + 1}. ${err.message} (${err.count} occurrences)`)
  .join('\n')}
    `;
  }
}

// シングルトンインスタンス
export const errorTracker = new ErrorTracker();

// エラーハンドラー登録状態の追跡
let handlersRegistered = false;

// グローバルエラーハンドラー
export function setupGlobalErrorHandlers(): void {
  // 重複登録の防止
  if (handlersRegistered) {
    return;
  }

  if (typeof window !== 'undefined') {
    // ブラウザ環境
    const errorHandler = (event: ErrorEvent) => {
      errorTracker.trackError(
        event.error || new Error(event.message),
        'unknown_error',
        {
          path: window.location.pathname,
          userAgent: navigator.userAgent,
          component: 'window',
          metadata: {
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno
          }
        }
      );
    };

    const rejectionHandler = (event: PromiseRejectionEvent) => {
      errorTracker.trackError(
        new Error(`Unhandled Promise Rejection: ${event.reason}`),
        'unknown_error',
        {
          path: window.location.pathname,
          userAgent: navigator.userAgent,
          component: 'promise'
        }
      );
    };

    window.addEventListener('error', errorHandler);
    window.addEventListener('unhandledrejection', rejectionHandler);
  } else if (typeof process !== 'undefined') {
    // Node.js環境
    const uncaughtExceptionHandler = (error: Error) => {
      errorTracker.trackError(error, 'unknown_error', {
        component: 'process',
        action: 'uncaughtException'
      });
    };

    const unhandledRejectionHandler = (reason: any) => {
      errorTracker.trackError(
        new Error(`Unhandled Promise Rejection: ${reason}`),
        'unknown_error',
        {
          component: 'process',
          action: 'unhandledRejection'
        }
      );
    };

    process.on('uncaughtException', uncaughtExceptionHandler);
    process.on('unhandledRejection', unhandledRejectionHandler);
  }

  handlersRegistered = true;
}