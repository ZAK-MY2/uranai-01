/**
 * グローバルエラーハンドラー
 * 
 * アプリケーション全体のエラーを監視・記録
 */

interface ErrorLog {
  timestamp: Date;
  type: 'error' | 'unhandledRejection' | 'componentError';
  message: string;
  stack?: string;
  details?: any;
  url?: string;
  userAgent?: string;
}

class GlobalErrorHandler {
  private static instance: GlobalErrorHandler;
  private errorLogs: ErrorLog[] = [];
  private maxLogs = 100;
  private isInitialized = false;

  private constructor() {}

  static getInstance(): GlobalErrorHandler {
    if (!GlobalErrorHandler.instance) {
      GlobalErrorHandler.instance = new GlobalErrorHandler();
    }
    return GlobalErrorHandler.instance;
  }

  /**
   * エラーハンドラーの初期化
   */
  initialize(): void {
    if (this.isInitialized || typeof window === 'undefined') {
      return;
    }

    // グローバルエラーハンドラー
    window.addEventListener('error', (event) => {
      this.handleError({
        type: 'error',
        message: event.message,
        stack: event.error?.stack,
        details: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        }
      });
    });

    // Promise rejectionハンドラー
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError({
        type: 'unhandledRejection',
        message: event.reason?.message || 'Unhandled Promise Rejection',
        stack: event.reason?.stack,
        details: event.reason
      });
    });

    this.isInitialized = true;
  }

  /**
   * エラーの処理
   */
  handleError(error: Omit<ErrorLog, 'timestamp' | 'url' | 'userAgent'>): void {
    const errorLog: ErrorLog = {
      ...error,
      timestamp: new Date(),
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined
    };

    // ログに追加
    this.errorLogs.push(errorLog);
    
    // 最大ログ数を超えたら古いものを削除
    if (this.errorLogs.length > this.maxLogs) {
      this.errorLogs.shift();
    }

    // コンソールに出力（開発環境のみ）
    if (process.env.NODE_ENV === 'development') {
      console.error('Global Error Handler:', errorLog);
    }

    // エラーレポートサービスに送信（本番環境）
    if (process.env.NODE_ENV === 'production') {
      this.reportToService(errorLog);
    }

    // エラーの種類によって特別な処理
    this.handleSpecificErrors(errorLog);
  }

  /**
   * 特定のエラーに対する処理
   */
  private handleSpecificErrors(errorLog: ErrorLog): void {
    // チャンクロードエラー
    if (errorLog.message.includes('ChunkLoadError') || 
        errorLog.message.includes('Loading chunk')) {
      console.warn('Chunk loading error detected. May need to reload the page.');
      
      // ユーザーに通知（実装は別途）
      this.notifyUser({
        type: 'warning',
        message: 'アプリケーションの更新が必要です。ページを再読み込みしてください。'
      });
    }

    // メモリ不足エラー
    if (errorLog.message.includes('out of memory') || 
        errorLog.message.includes('Maximum call stack')) {
      console.warn('Memory issue detected.');
      
      // キャッシュクリアなどの対処
      this.clearCaches();
    }

    // ネットワークエラー
    if (errorLog.message.includes('NetworkError') || 
        errorLog.message.includes('fetch')) {
      console.warn('Network error detected.');
      
      // オフライン状態のチェック
      if (!navigator.onLine) {
        this.notifyUser({
          type: 'error',
          message: 'インターネット接続を確認してください。'
        });
      }
    }
  }

  /**
   * エラーレポートサービスへの送信
   */
  private reportToService(errorLog: ErrorLog): void {
    // TODO: Sentry, LogRocket等への送信実装
    // 例:
    // window.Sentry?.captureException(new Error(errorLog.message), {
    //   extra: errorLog
    // });
    
    // 一時的な実装: サーバーAPIに送信
    fetch('/api/error-report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(errorLog)
    }).catch(() => {
      // エラーレポート自体が失敗した場合は何もしない
    });
  }

  /**
   * キャッシュのクリア
   */
  private clearCaches(): void {
    // セッションストレージ
    if (typeof sessionStorage !== 'undefined') {
      try {
        sessionStorage.clear();
      } catch (e) {
        console.error('Failed to clear sessionStorage:', e);
      }
    }

    // 古いローカルストレージアイテムの削除
    if (typeof localStorage !== 'undefined') {
      try {
        const keysToKeep = ['uranai_user_data', 'theme_preference'];
        Object.keys(localStorage).forEach(key => {
          if (!keysToKeep.includes(key)) {
            localStorage.removeItem(key);
          }
        });
      } catch (e) {
        console.error('Failed to clear localStorage:', e);
      }
    }
  }

  /**
   * ユーザーへの通知（実装は別途必要）
   */
  private notifyUser(notification: { type: 'error' | 'warning' | 'info'; message: string }): void {
    // カスタムイベントを発火
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('app:notification', {
        detail: notification
      }));
    }
  }

  /**
   * エラーログの取得
   */
  getRecentErrors(count?: number): ErrorLog[] {
    const logs = [...this.errorLogs].reverse();
    return count ? logs.slice(0, count) : logs;
  }

  /**
   * エラーログのクリア
   */
  clearLogs(): void {
    this.errorLogs = [];
  }

  /**
   * エラー統計の取得
   */
  getErrorStats(): {
    total: number;
    byType: Record<string, number>;
    recentRate: number; // 直近5分間のエラー率
  } {
    const now = Date.now();
    const fiveMinutesAgo = now - 5 * 60 * 1000;
    
    const recentErrors = this.errorLogs.filter(
      log => log.timestamp.getTime() > fiveMinutesAgo
    );

    const byType = this.errorLogs.reduce((acc, log) => {
      acc[log.type] = (acc[log.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: this.errorLogs.length,
      byType,
      recentRate: recentErrors.length
    };
  }
}

// シングルトンインスタンスのエクスポート
export const globalErrorHandler = GlobalErrorHandler.getInstance();

// 初期化関数
export function initializeErrorHandling(): void {
  globalErrorHandler.initialize();
}

// React用エラーハンドラー
export function handleComponentError(error: Error, errorInfo: { componentStack: string }): void {
  globalErrorHandler.handleError({
    type: 'componentError',
    message: error.message,
    stack: error.stack,
    details: {
      componentStack: errorInfo.componentStack
    }
  });
}

// 手動エラー報告用
export function reportError(message: string, details?: any): void {
  globalErrorHandler.handleError({
    type: 'error',
    message,
    details
  });
}