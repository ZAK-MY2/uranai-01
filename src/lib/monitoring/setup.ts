// Monitoring system setup and initialization
import { setupGlobalErrorHandlers } from './error-tracker';
import { logger } from './logger';
import { performanceMonitor } from './performance-monitor';

/**
 * 監視システムの初期化
 */
export function initializeMonitoring(): void {
  try {
    // グローバルエラーハンドラーの設定
    setupGlobalErrorHandlers();
    
    // 初期化ログ
    logger.info('Monitoring system initialized', {
      component: 'monitoring',
      action: 'initialization',
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    });

    // パフォーマンス監視開始
    performanceMonitor.recordMetric('monitoring_initialized', 1, 'count', {
      environment: process.env.NODE_ENV || 'development'
    });

    // プロセス終了時のクリーンアップ設定
    const cleanup = () => {
      logger.info('Shutting down monitoring system');
      logger.destroy();
      performanceMonitor.destroy();
    };

    if (typeof process !== 'undefined') {
      process.on('SIGINT', cleanup);
      process.on('SIGTERM', cleanup);
      process.on('beforeExit', cleanup);
    }

    console.log('🔍 Monitoring system initialized successfully');
  } catch (error) {
    console.error('Failed to initialize monitoring system:', error);
  }
}

/**
 * 占術エンジン用のパフォーマンス測定ラッパー
 */
export function withMonitoring<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  operationName: string,
  category: string = 'divination'
): T {
  return (async (...args: Parameters<T>) => {
    return performanceMonitor.measureAsync(
      `${category}_${operationName}`,
      () => fn(...args),
      { category, operation: operationName }
    );
  }) as T;
}

/**
 * API エンドポイント用のパフォーマンス測定デコレータ
 */
export function monitorApiEndpoint(
  target: any,
  propertyName: string,
  descriptor: PropertyDescriptor
) {
  const method = descriptor.value;
  
  descriptor.value = async function (...args: any[]) {
    const request = args[0]; // Assuming first arg is request
    const path = request?.nextUrl?.pathname || propertyName;
    const httpMethod = request?.method || 'UNKNOWN';
    
    return performanceMonitor.measureApiEndpoint(
      httpMethod,
      path,
      () => method.apply(this, args)
    );
  };
  
  return descriptor;
}

/**
 * ヘルスチェック用のメトリクス取得
 */
export function getHealthMetrics(): {
  status: 'healthy' | 'degraded' | 'unhealthy';
  uptime: number;
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  performance: {
    averageResponseTime: number;
    errorRate: number;
  };
  errors: {
    total: number;
    recent: number;
  };
} {
  try {
    const perfMetrics = performanceMonitor.getMetrics(3600000); // 1 hour
    const memoryUsage = perfMetrics.memoryUsage;
    
    // ヘルス状態の判定
    let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
    
    if (perfMetrics.errorRate > 10 || perfMetrics.averageResponseTime > 5000) {
      status = 'unhealthy';
    } else if (perfMetrics.errorRate > 5 || perfMetrics.averageResponseTime > 2000) {
      status = 'degraded';
    }
    
    return {
      status,
      uptime: typeof process !== 'undefined' ? process.uptime() * 1000 : 0,
      memory: {
        used: memoryUsage?.heapUsed || 0,
        total: memoryUsage?.heapTotal || 0,
        percentage: memoryUsage ? (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100 : 0
      },
      performance: {
        averageResponseTime: perfMetrics.averageResponseTime,
        errorRate: perfMetrics.errorRate
      },
      errors: {
        total: perfMetrics.totalMetrics,
        recent: perfMetrics.recentAlerts.length
      }
    };
  } catch (error) {
    logger.error('Failed to get health metrics', error as Error);
    return {
      status: 'unhealthy',
      uptime: 0,
      memory: { used: 0, total: 0, percentage: 0 },
      performance: { averageResponseTime: 0, errorRate: 0 },
      errors: { total: 0, recent: 0 }
    };
  }
}

/**
 * 監視ダッシュボード用のデータエクスポート
 */
export function exportMonitoringData(timeWindow: number = 3600000) {
  const perfMetrics = performanceMonitor.getMetrics(timeWindow);
  const healthMetrics = getHealthMetrics();
  
  return {
    timestamp: new Date().toISOString(),
    timeWindow,
    health: healthMetrics,
    performance: perfMetrics,
    reports: {
      performance: performanceMonitor.generateReport(timeWindow)
    }
  };
}