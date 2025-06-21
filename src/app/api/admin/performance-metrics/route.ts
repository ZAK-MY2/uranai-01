// API route for performance metrics
import { NextRequest, NextResponse } from 'next/server';
import { cacheManager } from '@/lib/cache/cache-manager';
import { performanceOptimizer } from '@/lib/performance/optimizer';
import { divinationLazyLoader } from '@/lib/lazy/lazy-loader';

export async function GET(request: NextRequest) {
  try {
    // システムメトリクス取得
    const memoryUsage = process.memoryUsage();
    const systemMetrics = {
      memoryUsage: memoryUsage.heapUsed / 1024 / 1024, // MB
      cpuLoad: await getCpuUsage(),
      uptime: process.uptime()
    };

    // キャッシュ統計
    const cacheStats = cacheManager.getStats();

    // パフォーマンス統計
    const performanceStats = performanceOptimizer.getPerformanceStats();

    // 遅延読み込み統計
    const lazyLoaderStats = divinationLazyLoader.getStats();

    // パフォーマンスレポート生成
    const performanceReport = performanceOptimizer.generatePerformanceReport();

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      system: systemMetrics,
      cache: cacheStats,
      performance: {
        ...performanceStats,
        recommendations: parseRecommendations(performanceReport)
      },
      lazyLoader: lazyLoaderStats,
      report: performanceReport
    });

  } catch (error) {
    console.error('Performance metrics error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to get performance metrics',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * CPU使用率の概算取得
 */
async function getCpuUsage(): Promise<number> {
  return new Promise((resolve) => {
    const startUsage = process.cpuUsage();
    const startTime = process.hrtime();

    setTimeout(() => {
      const endUsage = process.cpuUsage(startUsage);
      const endTime = process.hrtime(startTime);

      const cpuPercent = (endUsage.user + endUsage.system) / 1000 / 
                        (endTime[0] * 1000 + endTime[1] / 1000000) * 100;

      resolve(Math.min(100, Math.max(0, cpuPercent)));
    }, 100);
  });
}

/**
 * パフォーマンスレポートから推奨事項を抽出
 */
function parseRecommendations(report: string): string[] {
  const lines = report.split('\n');
  const recommendationsStart = lines.findIndex(line => line.includes('推奨事項'));
  
  if (recommendationsStart === -1) {
    return [];
  }

  const recommendations = [];
  for (let i = recommendationsStart + 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('-')) {
      recommendations.push(line.substring(1).trim());
    }
  }

  return recommendations;
}