// API route for preloading engines
import { NextRequest, NextResponse } from 'next/server';
import { divinationLazyLoader } from '@/lib/lazy/lazy-loader';

export async function POST(_request: NextRequest) {
  try {
    const startTime = performance.now();
    
    // 統計を取得（プリロード前）
    const statsBefore = divinationLazyLoader.getStats();
    
    // 基本エンジンをプリロード
    await divinationLazyLoader.preloadBasicEngines();
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    // 統計を取得（プリロード後）
    const statsAfter = divinationLazyLoader.getStats();

    return NextResponse.json({
      success: true,
      message: '基本エンジンのプリロードが完了しました',
      duration: `${duration.toFixed(2)}ms`,
      before: {
        loadedModules: statsBefore.loadedModules,
        totalModules: statsBefore.totalModules
      },
      after: {
        loadedModules: statsAfter.loadedModules,
        totalModules: statsAfter.totalModules
      },
      preloaded: statsAfter.loadedModules - statsBefore.loadedModules,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Engine preload error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to preload engines',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}