/**
 * 占術システムのエラーハンドリング
 * 
 * エラーの分類、リトライ、フォールバック戦略を実装
 */

export enum DivinationErrorType {
  // 環境データ関連
  ENVIRONMENT_DATA_FETCH_FAILED = 'ENVIRONMENT_DATA_FETCH_FAILED',
  ENVIRONMENT_DATA_INVALID = 'ENVIRONMENT_DATA_INVALID',
  
  // 計算エラー
  CALCULATION_FAILED = 'CALCULATION_FAILED',
  INVALID_INPUT_DATA = 'INVALID_INPUT_DATA',
  
  // タイムアウト
  CALCULATION_TIMEOUT = 'CALCULATION_TIMEOUT',
  API_TIMEOUT = 'API_TIMEOUT',
  
  // リソース関連
  MEMORY_LIMIT_EXCEEDED = 'MEMORY_LIMIT_EXCEEDED',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  
  // 不明なエラー
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export interface DivinationError extends Error {
  type: DivinationErrorType;
  code?: string;
  details?: any;
  retryable: boolean;
  fallbackAvailable: boolean;
}

/**
 * カスタムエラークラス
 */
export class DivinationSystemError extends Error implements DivinationError {
  type: DivinationErrorType;
  code?: string;
  details?: any;
  retryable: boolean;
  fallbackAvailable: boolean;

  constructor(
    type: DivinationErrorType,
    message: string,
    options?: {
      code?: string;
      details?: any;
      retryable?: boolean;
      fallbackAvailable?: boolean;
    }
  ) {
    super(message);
    this.name = 'DivinationSystemError';
    this.type = type;
    this.code = options?.code;
    this.details = options?.details;
    this.retryable = options?.retryable ?? false;
    this.fallbackAvailable = options?.fallbackAvailable ?? false;
  }
}

/**
 * エラー分類器
 */
export class ErrorClassifier {
  static classify(error: Error): DivinationError {
    // すでに分類済みのエラー
    if (error instanceof DivinationSystemError) {
      return error;
    }

    // ネットワークエラー
    if (error.message.includes('fetch') || error.message.includes('network')) {
      return new DivinationSystemError(
        DivinationErrorType.ENVIRONMENT_DATA_FETCH_FAILED,
        'ネットワークエラーが発生しました',
        { 
          details: error, 
          retryable: true,
          fallbackAvailable: true 
        }
      );
    }

    // タイムアウトエラー
    if (error.message.includes('timeout')) {
      return new DivinationSystemError(
        DivinationErrorType.API_TIMEOUT,
        '処理がタイムアウトしました',
        { 
          details: error, 
          retryable: true,
          fallbackAvailable: true 
        }
      );
    }

    // 入力データエラー
    if (error.message.includes('Invalid') || error.message.includes('required')) {
      return new DivinationSystemError(
        DivinationErrorType.INVALID_INPUT_DATA,
        '入力データが不正です',
        { 
          details: error, 
          retryable: false,
          fallbackAvailable: false 
        }
      );
    }

    // その他のエラー
    return new DivinationSystemError(
      DivinationErrorType.UNKNOWN_ERROR,
      error.message || '不明なエラーが発生しました',
      { 
        details: error,
        retryable: true,
        fallbackAvailable: true 
      }
    );
  }
}

/**
 * リトライ戦略
 */
export interface RetryStrategy {
  maxAttempts: number;
  delayMs: number;
  backoffMultiplier: number;
  maxDelayMs: number;
}

export class RetryHandler {
  private static defaultStrategy: RetryStrategy = {
    maxAttempts: 3,
    delayMs: 1000,
    backoffMultiplier: 2,
    maxDelayMs: 10000
  };

  /**
   * リトライ付き実行
   */
  static async withRetry<T>(
    fn: () => Promise<T>,
    strategy: Partial<RetryStrategy> = {}
  ): Promise<T> {
    const config = { ...this.defaultStrategy, ...strategy };
    let lastError: Error | null = null;
    let delay = config.delayMs;

    for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;
        
        const classifiedError = ErrorClassifier.classify(lastError);
        
        // リトライ不可能なエラーの場合は即座に失敗
        if (!classifiedError.retryable) {
          throw classifiedError;
        }

        // 最後の試行の場合
        if (attempt === config.maxAttempts) {
          throw classifiedError;
        }

        // 次の試行まで待機
        console.warn(`Retry attempt ${attempt}/${config.maxAttempts} after ${delay}ms`);
        await this.sleep(delay);
        
        // 遅延時間を増加（指数バックオフ）
        delay = Math.min(delay * config.backoffMultiplier, config.maxDelayMs);
      }
    }

    throw lastError;
  }

  private static sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * フォールバックハンドラー
 */
export class FallbackHandler {
  /**
   * 環境データのフォールバック値
   */
  static getDefaultEnvironmentData(): any {
    return {
      lunar: {
        phase: 0.5,
        phaseName: '満月',
        illumination: 100,
        moonSign: '蟹座'
      },
      weather: {
        condition: '晴れ',
        temperature: 20,
        humidity: 50
      },
      timestamp: new Date()
    };
  }

  /**
   * 占術結果のフォールバック
   */
  static getDivinationFallback(type: string, error: DivinationError): any {
    const baseResult = {
      type,
      error: true,
      errorMessage: this.getUserFriendlyMessage(error),
      fallback: true,
      timestamp: new Date()
    };

    // 占術タイプ別のフォールバック
    switch (type) {
      case 'numerology':
        return {
          ...baseResult,
          coreNumbers: {
            lifePathNumber: { value: 0, meaning: 'エラーにより計算できませんでした' },
            destinyNumber: { value: 0, meaning: 'エラーにより計算できませんでした' },
            soulUrgeNumber: { value: 0, meaning: 'エラーにより計算できませんでした' }
          },
          interpretation: {
            summary: 'システムエラーが発生したため、正確な結果を提供できません。',
            advice: 'しばらく時間をおいてから再度お試しください。'
          }
        };

      case 'tarot':
        return {
          ...baseResult,
          cards: {
            drawn: [],
            spread: 'error'
          },
          interpretation: {
            summary: 'カードを引くことができませんでした。',
            advice: '宇宙のエネルギーが安定するまでお待ちください。'
          }
        };

      default:
        return {
          ...baseResult,
          result: null,
          interpretation: {
            summary: 'エラーが発生しました。',
            advice: '時間をおいて再度お試しください。'
          }
        };
    }
  }

  /**
   * ユーザーフレンドリーなエラーメッセージ
   */
  static getUserFriendlyMessage(error: DivinationError): string {
    const messages: Record<DivinationErrorType, string> = {
      [DivinationErrorType.ENVIRONMENT_DATA_FETCH_FAILED]: 
        '環境データの取得に失敗しました。ネットワーク接続をご確認ください。',
      [DivinationErrorType.ENVIRONMENT_DATA_INVALID]: 
        '環境データが不正です。しばらくしてから再度お試しください。',
      [DivinationErrorType.CALCULATION_FAILED]: 
        '占術の計算中にエラーが発生しました。',
      [DivinationErrorType.INVALID_INPUT_DATA]: 
        '入力されたデータに問題があります。内容をご確認ください。',
      [DivinationErrorType.CALCULATION_TIMEOUT]: 
        '処理に時間がかかりすぎています。後ほど再度お試しください。',
      [DivinationErrorType.API_TIMEOUT]: 
        'サーバーへの接続がタイムアウトしました。',
      [DivinationErrorType.MEMORY_LIMIT_EXCEEDED]: 
        'メモリ不足のため処理を完了できませんでした。',
      [DivinationErrorType.RATE_LIMIT_EXCEEDED]: 
        'アクセスが集中しています。しばらくお待ちください。',
      [DivinationErrorType.UNKNOWN_ERROR]: 
        '予期しないエラーが発生しました。'
    };

    return messages[error.type] || error.message;
  }
}

/**
 * エラーロガー
 */
export class ErrorLogger {
  private static logs: Array<{
    timestamp: Date;
    error: DivinationError;
    context?: any;
  }> = [];

  static log(error: DivinationError, context?: any): void {
    const logEntry = {
      timestamp: new Date(),
      error,
      context
    };

    this.logs.push(logEntry);

    // 最大100件まで保持
    if (this.logs.length > 100) {
      this.logs.shift();
    }

    // 開発環境ではコンソールに出力
    if (process.env.NODE_ENV === 'development') {
      // console.error('DivinationError:', {
      //   type: error.type,
      //   message: error.message,
      //   details: error.details,
      //   context
      // });
    }

    // 本番環境ではエラートラッキングサービスに送信
    if (process.env.NODE_ENV === 'production') {
      this.sendToErrorTracking(logEntry);
    }
  }

  static getRecentErrors(count: number = 10): typeof this.logs {
    return this.logs.slice(-count);
  }

  static clearLogs(): void {
    this.logs = [];
  }

  private static sendToErrorTracking(logEntry: any): void {
    // TODO: Sentry, LogRocket等への送信実装
    console.log('Error tracking:', logEntry);
  }
}

/**
 * エラーリカバリーマネージャー
 */
export class ErrorRecoveryManager {
  /**
   * エラーからの回復を試みる
   */
  static async recover<T>(
    error: DivinationError,
    context: {
      divinationType: string;
      input: any;
      attemptNumber: number;
    }
  ): Promise<T | null> {
    // ログ記録
    ErrorLogger.log(error, context);

    // リトライ可能かチェック
    if (error.retryable && context.attemptNumber < 3) {
      console.log(`Attempting recovery for ${context.divinationType}, attempt ${context.attemptNumber + 1}`);
      
      // エラータイプに応じた回復戦略
      switch (error.type) {
        case DivinationErrorType.ENVIRONMENT_DATA_FETCH_FAILED:
          // デフォルト環境データを使用
          return FallbackHandler.getDefaultEnvironmentData() as T;
          
        case DivinationErrorType.API_TIMEOUT:
        case DivinationErrorType.CALCULATION_TIMEOUT:
          // より短いタイムアウトで再試行
          await RetryHandler.withRetry(
            async () => null,
            { maxAttempts: 1, delayMs: 500 }
          );
          break;
      }
    }

    // フォールバックが利用可能な場合
    if (error.fallbackAvailable) {
      return FallbackHandler.getDivinationFallback(
        context.divinationType, 
        error
      ) as T;
    }

    return null;
  }
}