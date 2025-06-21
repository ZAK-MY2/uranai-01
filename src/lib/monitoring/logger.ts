// Advanced logging system with structured logging
import { errorTracker } from './error-tracker';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

export interface LogContext {
  userId?: string;
  sessionId?: string;
  requestId?: string;
  component?: string;
  action?: string;
  duration?: number;
  metadata?: Record<string, any>;
  error?: Error;
  status?: string;
  metric?: string;
  tags?: Record<string, any>;
  value?: number;
  path?: string;
  method?: string;
  ip?: string;
  userAgent?: string;
  environment?: string;
  timestamp?: string;
  // 任意の追加プロパティを許可
  [key: string]: any;
}

interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  message: string;
  context: LogContext;
  error?: Error;
  stack?: string;
}

interface LoggerConfig {
  minLevel: LogLevel;
  maxBufferSize: number;
  flushInterval: number; // milliseconds
  enableConsole: boolean;
  enableRemote: boolean;
  remoteEndpoint?: string;
  formatJson: boolean;
}

export class Logger {
  private config: LoggerConfig;
  private buffer: LogEntry[] = [];
  private flushTimer?: NodeJS.Timeout;
  private readonly levelPriority: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
    fatal: 4
  };

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = {
      minLevel: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      maxBufferSize: 100,
      flushInterval: 5000,
      enableConsole: true,
      enableRemote: process.env.NODE_ENV === 'production',
      formatJson: process.env.NODE_ENV === 'production',
      ...config
    };

    this.startFlushTimer();
  }

  /**
   * デバッグログ
   */
  debug(message: string, context: LogContext = {}): void {
    this.log('debug', message, context);
  }

  /**
   * 情報ログ
   */
  info(message: string, context: LogContext = {}): void {
    this.log('info', message, context);
  }

  /**
   * 警告ログ
   */
  warn(message: string, context: LogContext = {}): void {
    this.log('warn', message, context);
  }

  /**
   * エラーログ
   */
  error(message: string, error?: Error | string, context: LogContext = {}): void {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    this.log('error', message, { ...context, error: errorObj });
    
    // エラートラッカーにも送信
    errorTracker.trackError(errorObj, 'unknown_error', context);
  }

  /**
   * 致命的エラーログ
   */
  fatal(message: string, error?: Error | string, context: LogContext = {}): void {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    this.log('fatal', message, { ...context, error: errorObj });
    
    // エラートラッカーにも送信（重要度：critical）
    errorTracker.trackError(errorObj, 'unknown_error', context, 'critical');
    
    // 即座にフラッシュ
    this.flush();
  }

  /**
   * 構造化ログ
   */
  private log(level: LogLevel, message: string, context: LogContext = {}): void {
    // レベルチェック
    if (this.levelPriority[level] < this.levelPriority[this.config.minLevel]) {
      return;
    }

    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      message,
      context,
      ...(context.error && {
        error: context.error,
        stack: context.error.stack
      })
    };

    // コンソール出力
    if (this.config.enableConsole) {
      this.logToConsole(entry);
    }

    // バッファに追加
    this.buffer.push(entry);

    // バッファサイズチェック
    if (this.buffer.length >= this.config.maxBufferSize) {
      this.flush();
    }
  }

  /**
   * コンソールへの出力
   */
  private logToConsole(entry: LogEntry): void {
    const { timestamp, level, message, context } = entry;
    const time = timestamp.toISOString();
    
    if (this.config.formatJson) {
      // JSON形式
      const logData = {
        timestamp: time,
        level,
        message,
        ...context
      };
      console.log(JSON.stringify(logData));
    } else {
      // 人間が読みやすい形式
      const prefix = `[${time}] [${level.toUpperCase()}]`;
      const contextStr = Object.keys(context).length > 0 
        ? ` ${JSON.stringify(context)}` 
        : '';
      
      switch (level) {
        case 'debug':
          console.debug(`${prefix} ${message}${contextStr}`);
          break;
        case 'info':
          console.info(`${prefix} ${message}${contextStr}`);
          break;
        case 'warn':
          console.warn(`${prefix} ${message}${contextStr}`);
          break;
        case 'error':
        case 'fatal':
          console.error(`${prefix} ${message}${contextStr}`, entry.error);
          break;
      }
    }
  }

  /**
   * バッファのフラッシュ
   */
  private async flush(): Promise<void> {
    if (this.buffer.length === 0) return;

    const entriesToFlush = [...this.buffer];
    this.buffer = [];

    // リモートエンドポイントへの送信
    if (this.config.enableRemote && this.config.remoteEndpoint) {
      try {
        await this.sendToRemote(entriesToFlush);
      } catch (error) {
        // リモート送信エラーは無視（無限ループ防止）
        console.error('Failed to send logs to remote:', error);
      }
    }

    // データベースへの保存（実装例）
    await this.saveToDatabase(entriesToFlush);
  }

  /**
   * リモートエンドポイントへの送信
   */
  private async sendToRemote(entries: LogEntry[]): Promise<void> {
    if (!this.config.remoteEndpoint) return;

    const response = await fetch(this.config.remoteEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        entries,
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString()
      })
    });

    if (!response.ok) {
      throw new Error(`Remote logging failed: ${response.statusText}`);
    }
  }

  /**
   * データベースへの保存
   */
  private async saveToDatabase(entries: LogEntry[]): Promise<void> {
    // 実装例：Supabaseなどへの保存
    if (process.env.NODE_ENV === 'production') {
      // Production環境でのみ実行
      console.log(`Would save ${entries.length} log entries to database`);
    }
  }

  /**
   * フラッシュタイマーの開始
   */
  private startFlushTimer(): void {
    this.flushTimer = setInterval(() => {
      this.flush();
    }, this.config.flushInterval);
  }

  /**
   * クリーンアップ
   */
  destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    this.flush();
  }

  /**
   * 子ロガーの作成
   */
  child(context: LogContext): Logger {
    const childLogger = new Logger(this.config);
    
    // オーバーライドして親のコンテキストを含める
    const originalLog = childLogger.log.bind(childLogger);
    childLogger.log = (level: LogLevel, message: string, ctx: LogContext = {}) => {
      originalLog(level, message, { ...context, ...ctx });
    };
    
    return childLogger;
  }

  /**
   * パフォーマンス測定ヘルパー
   */
  async measurePerformance<T>(
    operation: string,
    fn: () => Promise<T>,
    context: LogContext = {}
  ): Promise<T> {
    const start = Date.now();
    
    try {
      const result = await fn();
      const duration = Date.now() - start;
      
      this.info(`${operation} completed`, {
        ...context,
        action: operation,
        duration,
        status: 'success'
      });
      
      return result;
    } catch (error) {
      const duration = Date.now() - start;
      
      this.error(`${operation} failed`, error as Error, {
        ...context,
        action: operation,
        duration,
        status: 'error'
      });
      
      throw error;
    }
  }

  /**
   * 占術処理のログヘルパー
   */
  logDivinationRequest(
    divinationType: string,
    input: any,
    context: LogContext = {}
  ): void {
    this.info('Divination request', {
      ...context,
      component: 'divination',
      action: divinationType,
      metadata: {
        inputSize: JSON.stringify(input).length,
        timestamp: new Date().toISOString()
      }
    });
  }

  /**
   * 占術結果のログヘルパー
   */
  logDivinationResult(
    divinationType: string,
    success: boolean,
    duration: number,
    context: LogContext = {}
  ): void {
    const level = success ? 'info' : 'error';
    
    this.log(level, `Divination ${success ? 'completed' : 'failed'}`, {
      ...context,
      component: 'divination',
      action: divinationType,
      duration,
      metadata: {
        success,
        timestamp: new Date().toISOString()
      }
    });
  }

  /**
   * API リクエストのログヘルパー
   */
  logApiRequest(
    method: string,
    path: string,
    statusCode: number,
    duration: number,
    context: LogContext = {}
  ): void {
    const level = statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'info';
    
    this.log(level, `${method} ${path} - ${statusCode}`, {
      ...context,
      component: 'api',
      action: 'request',
      duration,
      metadata: {
        method,
        path,
        statusCode,
        timestamp: new Date().toISOString()
      }
    });
  }
}

// シングルトンインスタンス
export const logger = new Logger();

// 名前空間別ロガー
export const loggers = {
  api: logger.child({ component: 'api' }),
  divination: logger.child({ component: 'divination' }),
  auth: logger.child({ component: 'auth' }),
  database: logger.child({ component: 'database' }),
  performance: logger.child({ component: 'performance' }),
  security: logger.child({ component: 'security' })
};

// エクスポート用のヘルパー関数
export const log = {
  debug: (message: string, context?: LogContext) => logger.debug(message, context),
  info: (message: string, context?: LogContext) => logger.info(message, context),
  warn: (message: string, context?: LogContext) => logger.warn(message, context),
  error: (message: string, error?: Error | string, context?: LogContext) => 
    logger.error(message, error, context),
  fatal: (message: string, error?: Error | string, context?: LogContext) => 
    logger.fatal(message, error, context)
};