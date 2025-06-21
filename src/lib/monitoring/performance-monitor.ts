// Performance monitoring and metrics collection
import { logger } from './logger';
import { errorTracker } from './error-tracker';

interface PerformanceMetric {
  name: string;
  value: number;
  unit: 'ms' | 'bytes' | 'count' | 'percent';
  timestamp: Date;
  tags: Record<string, string>;
}

interface MemoryUsage {
  rss: number; // Resident Set Size
  heapTotal: number;
  heapUsed: number;
  external: number;
  arrayBuffers?: number;
}

interface PerformanceThresholds {
  responseTime: number; // ms
  memoryUsage: number; // bytes
  cpuUsage: number; // percent
  errorRate: number; // percent
}

interface PerformanceAlert {
  metric: string;
  value: number;
  threshold: number;
  timestamp: Date;
  severity: 'warning' | 'critical';
}

export class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private alerts: PerformanceAlert[] = [];
  private readonly maxMetrics = 10000;
  private readonly maxAlerts = 1000;
  
  private readonly thresholds: PerformanceThresholds = {
    responseTime: 5000, // 5 seconds
    memoryUsage: 512 * 1024 * 1024, // 512MB
    cpuUsage: 80, // 80%
    errorRate: 5 // 5%
  };

  private timers: Map<string, number> = new Map();
  private readonly intervalId: NodeJS.Timeout;

  constructor() {
    // 定期的なシステムメトリクス収集
    this.intervalId = setInterval(() => {
      this.collectSystemMetrics();
    }, 30000); // 30秒間隔
  }

  /**
   * タイマー開始
   */
  startTimer(name: string, tags: Record<string, string> = {}): void {
    const key = `${name}:${JSON.stringify(tags)}`;
    this.timers.set(key, Date.now());
  }

  /**
   * タイマー終了とメトリクス記録
   */
  endTimer(name: string, tags: Record<string, string> = {}): number {
    const key = `${name}:${JSON.stringify(tags)}`;
    const startTime = this.timers.get(key);
    
    if (!startTime) {
      logger.warn('Timer not found', { metric: name, tags });
      return 0;
    }

    const duration = Date.now() - startTime;
    this.timers.delete(key);
    
    this.recordMetric(name, duration, 'ms', tags);
    
    // パフォーマンス閾値チェック
    if (duration > this.thresholds.responseTime) {
      this.createAlert(name, duration, this.thresholds.responseTime, 'warning');
    }
    
    return duration;
  }

  /**
   * メトリクス記録
   */
  recordMetric(
    name: string,
    value: number,
    unit: 'ms' | 'bytes' | 'count' | 'percent',
    tags: Record<string, string> = {}
  ): void {
    const metric: PerformanceMetric = {
      name,
      value,
      unit,
      timestamp: new Date(),
      tags
    };

    this.metrics.push(metric);
    
    // メモリ管理
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }

    // ログ出力
    logger.debug('Performance metric recorded', {
      component: 'performance',
      action: 'metric',
      metadata: metric
    });
  }

  /**
   * カウンターのインクリメント
   */
  incrementCounter(name: string, tags: Record<string, string> = {}): void {
    this.recordMetric(name, 1, 'count', tags);
  }

  /**
   * ゲージ値の設定
   */
  setGauge(name: string, value: number, unit: 'ms' | 'bytes' | 'count' | 'percent', tags: Record<string, string> = {}): void {
    this.recordMetric(name, value, unit, tags);
  }

  /**
   * 処理時間の測定
   */
  async measureAsync<T>(
    name: string,
    operation: () => Promise<T>,
    tags: Record<string, string> = {}
  ): Promise<T> {
    this.startTimer(name, tags);
    
    try {
      const result = await operation();
      const duration = this.endTimer(name, tags);
      
      // 成功メトリクス
      this.incrementCounter(`${name}_success`, tags);
      
      return result;
    } catch (error) {
      this.endTimer(name, tags);
      
      // エラーメトリクス
      this.incrementCounter(`${name}_error`, tags);
      
      // エラートラッカーに送信
      errorTracker.trackError(error as Error, 'performance_error', {
        component: 'performance',
        action: name,
        metadata: tags
      });
      
      throw error;
    }
  }

  /**
   * 同期処理の測定
   */
  measureSync<T>(
    name: string,
    operation: () => T,
    tags: Record<string, string> = {}
  ): T {
    this.startTimer(name, tags);
    
    try {
      const result = operation();
      this.endTimer(name, tags);
      this.incrementCounter(`${name}_success`, tags);
      return result;
    } catch (error) {
      this.endTimer(name, tags);
      this.incrementCounter(`${name}_error`, tags);
      
      errorTracker.trackError(error as Error, 'performance_error', {
        component: 'performance',
        action: name,
        metadata: tags
      });
      
      throw error;
    }
  }

  /**
   * システムメトリクスの収集
   */
  private collectSystemMetrics(): void {
    try {
      // メモリ使用量
      if (typeof process !== 'undefined' && process.memoryUsage) {
        const memory = process.memoryUsage();
        
        this.setGauge('memory_rss', memory.rss, 'bytes');
        this.setGauge('memory_heap_total', memory.heapTotal, 'bytes');
        this.setGauge('memory_heap_used', memory.heapUsed, 'bytes');
        this.setGauge('memory_external', memory.external, 'bytes');
        
        // メモリ使用率
        const usage = (memory.heapUsed / memory.heapTotal) * 100;
        this.setGauge('memory_usage_percent', usage, 'percent');
        
        // メモリ閾値チェック
        if (memory.heapUsed > this.thresholds.memoryUsage) {
          this.createAlert('memory_usage', memory.heapUsed, this.thresholds.memoryUsage, 'warning');
        }
      }

      // Node.js 特有のメトリクス
      if (typeof process !== 'undefined') {
        // プロセス稼働時間
        this.setGauge('process_uptime', process.uptime() * 1000, 'count');
        
        // イベントループラグ
        this.measureEventLoopLag();
      }

      // ガベージコレクションの統計（Node.js v14+）
      if (typeof performance !== 'undefined' && 'measureUserAgentSpecificMemory' in performance) {
        (performance as any).measureUserAgentSpecificMemory().then((result: any) => {
          this.setGauge('gc_heap_size', result.bytes, 'bytes');
        }).catch(() => {
          // Ignore errors - not all environments support this
        });
      }

    } catch (error) {
      logger.error('Failed to collect system metrics', error as Error);
    }
  }

  /**
   * イベントループラグの測定
   */
  private measureEventLoopLag(): void {
    const start = Date.now();
    setImmediate(() => {
      const lag = Date.now() - start;
      this.setGauge('event_loop_lag', lag, 'ms');
      
      if (lag > 100) { // 100ms以上のラグは警告
        this.createAlert('event_loop_lag', lag, 100, 'warning');
      }
    });
  }

  /**
   * アラートの作成
   */
  private createAlert(
    metric: string,
    value: number,
    threshold: number,
    severity: 'warning' | 'critical'
  ): void {
    const alert: PerformanceAlert = {
      metric,
      value,
      threshold,
      timestamp: new Date(),
      severity
    };

    this.alerts.push(alert);
    
    // アラート制限
    if (this.alerts.length > this.maxAlerts) {
      this.alerts = this.alerts.slice(-this.maxAlerts);
    }

    // ログ出力
    logger.warn('Performance threshold exceeded', {
      component: 'performance',
      action: 'alert',
      metadata: alert
    });

    // 重要なアラートの通知
    if (severity === 'critical') {
      this.sendCriticalAlert(alert);
    }
  }

  /**
   * 重要アラートの送信
   */
  private async sendCriticalAlert(alert: PerformanceAlert): Promise<void> {
    try {
      if (process.env.PERFORMANCE_ALERT_WEBHOOK) {
        await fetch(process.env.PERFORMANCE_ALERT_WEBHOOK, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: '🚨 Critical Performance Alert',
            attachments: [{
              color: 'danger',
              fields: [
                { title: 'Metric', value: alert.metric, short: true },
                { title: 'Value', value: `${alert.value}`, short: true },
                { title: 'Threshold', value: `${alert.threshold}`, short: true },
                { title: 'Severity', value: alert.severity, short: true }
              ],
              timestamp: alert.timestamp.toISOString()
            }]
          })
        });
      }
    } catch (error) {
      logger.error('Failed to send critical performance alert', error as Error);
    }
  }

  /**
   * メトリクス統計の取得
   */
  getMetrics(timeWindow?: number): {
    totalMetrics: number;
    averageResponseTime: number;
    errorRate: number;
    memoryUsage: MemoryUsage | null;
    recentAlerts: PerformanceAlert[];
    topSlowOperations: Array<{ name: string; averageTime: number; count: number }>;
  } {
    const now = Date.now();
    const windowStart = timeWindow ? now - timeWindow : 0;
    
    const relevantMetrics = this.metrics.filter(
      metric => metric.timestamp.getTime() >= windowStart
    );

    // レスポンス時間の平均
    const responseTimeMetrics = relevantMetrics.filter(m => m.unit === 'ms');
    const averageResponseTime = responseTimeMetrics.length > 0
      ? responseTimeMetrics.reduce((sum, m) => sum + m.value, 0) / responseTimeMetrics.length
      : 0;

    // エラー率の計算
    const successCount = relevantMetrics.filter(m => m.name.endsWith('_success')).length;
    const errorCount = relevantMetrics.filter(m => m.name.endsWith('_error')).length;
    const totalOperations = successCount + errorCount;
    const errorRate = totalOperations > 0 ? (errorCount / totalOperations) * 100 : 0;

    // 最新のメモリ使用量
    const latestMemoryMetrics = this.metrics
      .filter(m => m.name.startsWith('memory_'))
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    const memoryUsage: MemoryUsage | null = latestMemoryMetrics.length > 0 ? {
      rss: latestMemoryMetrics.find(m => m.name === 'memory_rss')?.value || 0,
      heapTotal: latestMemoryMetrics.find(m => m.name === 'memory_heap_total')?.value || 0,
      heapUsed: latestMemoryMetrics.find(m => m.name === 'memory_heap_used')?.value || 0,
      external: latestMemoryMetrics.find(m => m.name === 'memory_external')?.value || 0
    } : null;

    // 最近のアラート
    const recentAlerts = this.alerts
      .filter(alert => alert.timestamp.getTime() >= windowStart)
      .slice(-10);

    // 遅い操作のトップ
    const operationTimes = new Map<string, { total: number; count: number }>();
    responseTimeMetrics.forEach(metric => {
      const existing = operationTimes.get(metric.name) || { total: 0, count: 0 };
      operationTimes.set(metric.name, {
        total: existing.total + metric.value,
        count: existing.count + 1
      });
    });

    const topSlowOperations = Array.from(operationTimes.entries())
      .map(([name, stats]) => ({
        name,
        averageTime: stats.total / stats.count,
        count: stats.count
      }))
      .sort((a, b) => b.averageTime - a.averageTime)
      .slice(0, 10);

    return {
      totalMetrics: relevantMetrics.length,
      averageResponseTime,
      errorRate,
      memoryUsage,
      recentAlerts,
      topSlowOperations
    };
  }

  /**
   * 占術エンジンのパフォーマンス測定
   */
  measureDivination<T>(
    divinationType: string,
    operation: () => Promise<T>
  ): Promise<T> {
    return this.measureAsync(`divination_${divinationType}`, operation, {
      type: divinationType
    });
  }

  /**
   * API エンドポイントのパフォーマンス測定
   */
  measureApiEndpoint<T>(
    method: string,
    path: string,
    operation: () => Promise<T>
  ): Promise<T> {
    return this.measureAsync(`api_${method.toLowerCase()}_${path.replace(/[^a-zA-Z0-9]/g, '_')}`, operation, {
      method,
      path
    });
  }

  /**
   * データベース操作のパフォーマンス測定
   */
  measureDatabase<T>(
    operation: string,
    fn: () => Promise<T>
  ): Promise<T> {
    return this.measureAsync(`db_${operation}`, fn, {
      operation
    });
  }

  /**
   * クリーンアップ
   */
  destroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  /**
   * パフォーマンスレポートの生成
   */
  generateReport(timeWindow: number = 3600000): string { // 1時間デフォルト
    const metrics = this.getMetrics(timeWindow);
    
    return `
# Performance Report
Time Window: ${new Date(Date.now() - timeWindow).toISOString()} - ${new Date().toISOString()}

## Summary
- Total Metrics: ${metrics.totalMetrics}
- Average Response Time: ${metrics.averageResponseTime.toFixed(2)}ms
- Error Rate: ${metrics.errorRate.toFixed(2)}%
- Recent Alerts: ${metrics.recentAlerts.length}

## Memory Usage
${metrics.memoryUsage ? `
- RSS: ${(metrics.memoryUsage.rss / 1024 / 1024).toFixed(2)}MB
- Heap Total: ${(metrics.memoryUsage.heapTotal / 1024 / 1024).toFixed(2)}MB
- Heap Used: ${(metrics.memoryUsage.heapUsed / 1024 / 1024).toFixed(2)}MB
- External: ${(metrics.memoryUsage.external / 1024 / 1024).toFixed(2)}MB
` : 'No memory data available'}

## Top Slow Operations
${metrics.topSlowOperations
  .map((op, i) => `${i + 1}. ${op.name}: ${op.averageTime.toFixed(2)}ms (${op.count} calls)`)
  .join('\n')}

## Recent Alerts
${metrics.recentAlerts
  .map(alert => `- ${alert.severity.toUpperCase()}: ${alert.metric} = ${alert.value} (threshold: ${alert.threshold})`)
  .join('\n')}
    `;
  }
}

// シングルトンインスタンス
export const performanceMonitor = new PerformanceMonitor();