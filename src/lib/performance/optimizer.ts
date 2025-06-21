// Performance optimization service
import { cacheManager } from '../cache/cache-manager';

interface PerformanceMetrics {
  executionTime: number;
  memoryUsage: number;
  cacheHit: boolean;
  timestamp: number;
}

interface OptimizationOptions {
  enableCaching: boolean;
  enableMemoization: boolean;
  enableBatching: boolean;
  batchSize: number;
  batchTimeout: number;
}

export class PerformanceOptimizer {
  private metrics: PerformanceMetrics[] = [];
  private pendingBatches = new Map<string, Array<{ resolve: Function; reject: Function; input: any }>>();
  private batchTimers = new Map<string, NodeJS.Timeout>();
  
  constructor(private options: OptimizationOptions = {
    enableCaching: true,
    enableMemoization: true,
    enableBatching: true,
    batchSize: 10,
    batchTimeout: 100
  }) {}

  /**
   * パフォーマンス最適化された実行
   */
  async optimizedExecution<T, R>(
    key: string,
    input: T,
    executor: (input: T) => Promise<R>,
    cacheKeyGenerator?: (input: T) => string
  ): Promise<R> {
    const startTime = performance.now();
    const startMemory = process.memoryUsage().heapUsed;

    try {
      // キャッシュチェック
      if (this.options.enableCaching) {
        const cacheKey = cacheKeyGenerator ? cacheKeyGenerator(input) : JSON.stringify(input);
        const cached = cacheManager.get<R>(cacheKey);
        
        if (cached) {
          this.recordMetrics(startTime, startMemory, true);
          return cached;
        }
      }

      // バッチ処理
      if (this.options.enableBatching) {
        const result = await this.batchedExecution(key, input, executor);
        this.recordMetrics(startTime, startMemory, false);
        return result;
      }

      // 通常実行
      const result = await executor(input);
      
      // 結果をキャッシュ
      if (this.options.enableCaching) {
        const cacheKey = cacheKeyGenerator ? cacheKeyGenerator(input) : JSON.stringify(input);
        cacheManager.set(cacheKey, result);
      }

      this.recordMetrics(startTime, startMemory, false);
      return result;

    } catch (error) {
      this.recordMetrics(startTime, startMemory, false);
      throw error;
    }
  }

  /**
   * バッチ実行
   */
  private async batchedExecution<T, R>(
    batchKey: string,
    input: T,
    executor: (input: T) => Promise<R>
  ): Promise<R> {
    return new Promise<R>((resolve, reject) => {
      // バッチに追加
      if (!this.pendingBatches.has(batchKey)) {
        this.pendingBatches.set(batchKey, []);
      }

      const batch = this.pendingBatches.get(batchKey)!;
      batch.push({ resolve, reject, input });

      // バッチサイズに達したら即座に実行
      if (batch.length >= this.options.batchSize) {
        this.executeBatch(batchKey, executor);
        return;
      }

      // タイマー設定（初回のみ）
      if (batch.length === 1) {
        const timer = setTimeout(() => {
          this.executeBatch(batchKey, executor);
        }, this.options.batchTimeout);
        
        this.batchTimers.set(batchKey, timer);
      }
    });
  }

  /**
   * バッチ実行処理
   */
  private async executeBatch<T, R>(
    batchKey: string,
    executor: (input: T) => Promise<R>
  ): Promise<void> {
    const batch = this.pendingBatches.get(batchKey);
    if (!batch || batch.length === 0) return;

    // バッチとタイマーをクリア
    this.pendingBatches.delete(batchKey);
    const timer = this.batchTimers.get(batchKey);
    if (timer) {
      clearTimeout(timer);
      this.batchTimers.delete(batchKey);
    }

    // 並列実行
    const promises = batch.map(async ({ resolve, reject, input }) => {
      try {
        const result = await executor(input);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });

    await Promise.all(promises);
  }

  /**
   * メトリクス記録
   */
  private recordMetrics(startTime: number, startMemory: number, cacheHit: boolean): void {
    const endTime = performance.now();
    const endMemory = process.memoryUsage().heapUsed;

    this.metrics.push({
      executionTime: endTime - startTime,
      memoryUsage: endMemory - startMemory,
      cacheHit,
      timestamp: Date.now()
    });

    // 古いメトリクスを削除（最新100件のみ保持）
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100);
    }
  }

  /**
   * パフォーマンス統計取得
   */
  getPerformanceStats() {
    if (this.metrics.length === 0) {
      return {
        averageExecutionTime: 0,
        averageMemoryUsage: 0,
        cacheHitRate: 0,
        totalExecutions: 0
      };
    }

    const totalExecutionTime = this.metrics.reduce((sum, m) => sum + m.executionTime, 0);
    const totalMemoryUsage = this.metrics.reduce((sum, m) => sum + m.memoryUsage, 0);
    const cacheHits = this.metrics.filter(m => m.cacheHit).length;

    return {
      averageExecutionTime: totalExecutionTime / this.metrics.length,
      averageMemoryUsage: totalMemoryUsage / this.metrics.length,
      cacheHitRate: (cacheHits / this.metrics.length) * 100,
      totalExecutions: this.metrics.length,
      recentMetrics: this.metrics.slice(-10) // 最新10件
    };
  }

  /**
   * メモ化関数作成
   */
  memoize<T extends (...args: any[]) => any>(
    fn: T,
    keyGenerator?: (...args: Parameters<T>) => string
  ): T {
    const cache = new Map<string, ReturnType<T>>();

    return ((...args: Parameters<T>): ReturnType<T> => {
      const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args);
      
      if (cache.has(key)) {
        return cache.get(key)!;
      }

      const result = fn(...args);
      cache.set(key, result);
      
      // キャッシュサイズ制限
      if (cache.size > 1000) {
        const firstKey = cache.keys().next().value;
        cache.delete(firstKey);
      }

      return result;
    }) as T;
  }

  /**
   * 非同期メモ化
   */
  memoizeAsync<T extends (...args: any[]) => Promise<any>>(
    fn: T,
    keyGenerator?: (...args: Parameters<T>) => string,
    ttl = 30 * 60 * 1000 // 30分
  ): T {
    const cache = new Map<string, { result: Promise<ReturnType<T>>; timestamp: number }>();

    return (async (...args: Parameters<T>): Promise<Awaited<ReturnType<T>>> => {
      const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args);
      const now = Date.now();
      
      // キャッシュチェック
      const cached = cache.get(key);
      if (cached && (now - cached.timestamp) < ttl) {
        return cached.result;
      }

      // 新しい実行
      const resultPromise = fn(...args);
      cache.set(key, { result: resultPromise, timestamp: now });

      // 古いキャッシュを削除
      for (const [cacheKey, entry] of cache.entries()) {
        if (now - entry.timestamp > ttl) {
          cache.delete(cacheKey);
        }
      }

      return resultPromise;
    }) as T;
  }

  /**
   * パフォーマンス監視の開始
   */
  startPerformanceMonitoring(): void {
    // メモリ使用量監視
    const memoryMonitor = setInterval(() => {
      const usage = process.memoryUsage();
      
      if (usage.heapUsed > 100 * 1024 * 1024) { // 100MB超過
        console.warn('高メモリ使用量を検出:', {
          heapUsed: `${Math.round(usage.heapUsed / 1024 / 1024)}MB`,
          heapTotal: `${Math.round(usage.heapTotal / 1024 / 1024)}MB`,
          external: `${Math.round(usage.external / 1024 / 1024)}MB`
        });
        
        // ガベージコレクション実行（可能な場合）
        if (global.gc) {
          global.gc();
        }
      }
    }, 30000); // 30秒間隔

    // CPU使用率監視（簡易版）
    const cpuMonitor = setInterval(() => {
      const stats = this.getPerformanceStats();
      
      if (stats.averageExecutionTime > 1000) { // 1秒超過
        console.warn('高CPU使用量を検出:', {
          averageExecutionTime: `${stats.averageExecutionTime.toFixed(2)}ms`,
          cacheHitRate: `${stats.cacheHitRate.toFixed(2)}%`
        });
      }
    }, 60000); // 1分間隔

    // クリーンアップ関数を返す
    return () => {
      clearInterval(memoryMonitor);
      clearInterval(cpuMonitor);
    };
  }

  /**
   * パフォーマンスレポート生成
   */
  generatePerformanceReport(): string {
    const stats = this.getPerformanceStats();
    const cacheStats = cacheManager.getStats();

    return `
パフォーマンスレポート
==================

実行統計:
- 平均実行時間: ${stats.averageExecutionTime.toFixed(2)}ms
- 平均メモリ使用量: ${(stats.averageMemoryUsage / 1024).toFixed(2)}KB
- キャッシュヒット率: ${stats.cacheHitRate.toFixed(2)}%
- 総実行回数: ${stats.totalExecutions}

キャッシュ統計:
- エントリ数: ${cacheStats.entries}
- メモリ使用量: ${cacheStats.memoryUsage}
- 総ヒット数: ${cacheStats.totalHits}
- 平均ヒット数: ${cacheStats.averageHits.toFixed(2)}

推奨事項:
${this.generateRecommendations(stats, cacheStats)}
    `.trim();
  }

  /**
   * パフォーマンス改善推奨事項
   */
  private generateRecommendations(stats: any, cacheStats: any): string {
    const recommendations = [];

    if (stats.cacheHitRate < 50) {
      recommendations.push('- キャッシュヒット率が低いです。TTLの調整またはキャッシュ戦略の見直しを検討してください。');
    }

    if (stats.averageExecutionTime > 500) {
      recommendations.push('- 平均実行時間が長いです。アルゴリズムの最適化またはバッチ処理の導入を検討してください。');
    }

    if (stats.averageMemoryUsage > 10 * 1024 * 1024) { // 10MB
      recommendations.push('- メモリ使用量が多いです。不要なデータの削除またはメモリ効率の改善を検討してください。');
    }

    if (cacheStats.entries > 800) {
      recommendations.push('- キャッシュエントリ数が多いです。キャッシュサイズの調整を検討してください。');
    }

    return recommendations.length > 0 ? recommendations.join('\n') : '- 現在のパフォーマンスは良好です。';
  }
}

// シングルトンインスタンス
export const performanceOptimizer = new PerformanceOptimizer();