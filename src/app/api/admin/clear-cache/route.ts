// API route for clearing cache
import { NextRequest, NextResponse } from 'next/server';
import { cacheManager } from '@/lib/cache/cache-manager';

export async function POST(request: NextRequest) {
  try {
    // キャッシュ統計を取得してから削除
    const statsBefore = cacheManager.getStats();
    
    // キャッシュクリア実行
    cacheManager.clear();
    
    // クリア後の統計
    const statsAfter = cacheManager.getStats();

    return NextResponse.json({
      success: true,
      message: 'キャッシュを正常にクリアしました',
      cleared: {
        entries: statsBefore.entries,
        totalSize: statsBefore.totalSize,
        memoryFreed: statsBefore.memoryUsage
      },
      after: statsAfter,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Cache clear error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to clear cache',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}