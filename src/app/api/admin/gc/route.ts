// API route for garbage collection
import { NextRequest, NextResponse } from 'next/server';

export async function POST(_request: NextRequest) {
  try {
    // メモリ使用量（GC前）
    const memoryBefore = process.memoryUsage();
    
    // ガベージコレクション実行
    if (global.gc) {
      global.gc();
      
      // メモリ使用量（GC後）
      const memoryAfter = process.memoryUsage();
      
      const freedMemory = {
        heapUsed: memoryBefore.heapUsed - memoryAfter.heapUsed,
        heapTotal: memoryBefore.heapTotal - memoryAfter.heapTotal,
        external: memoryBefore.external - memoryAfter.external
      };

      return NextResponse.json({
        success: true,
        message: 'ガベージコレクションを実行しました',
        before: {
          heapUsed: `${Math.round(memoryBefore.heapUsed / 1024 / 1024)}MB`,
          heapTotal: `${Math.round(memoryBefore.heapTotal / 1024 / 1024)}MB`,
          external: `${Math.round(memoryBefore.external / 1024 / 1024)}MB`
        },
        after: {
          heapUsed: `${Math.round(memoryAfter.heapUsed / 1024 / 1024)}MB`,
          heapTotal: `${Math.round(memoryAfter.heapTotal / 1024 / 1024)}MB`,
          external: `${Math.round(memoryAfter.external / 1024 / 1024)}MB`
        },
        freed: {
          heapUsed: `${Math.round(freedMemory.heapUsed / 1024 / 1024)}MB`,
          heapTotal: `${Math.round(freedMemory.heapTotal / 1024 / 1024)}MB`,
          external: `${Math.round(freedMemory.external / 1024 / 1024)}MB`
        },
        timestamp: new Date().toISOString()
      });

    } else {
      return NextResponse.json({
        success: false,
        message: 'ガベージコレクションは利用できません（--expose-gc フラグが必要）',
        currentMemory: {
          heapUsed: `${Math.round(memoryBefore.heapUsed / 1024 / 1024)}MB`,
          heapTotal: `${Math.round(memoryBefore.heapTotal / 1024 / 1024)}MB`,
          external: `${Math.round(memoryBefore.external / 1024 / 1024)}MB`
        },
        timestamp: new Date().toISOString()
      }, { status: 400 });
    }

  } catch (error) {
    console.error('Garbage collection error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to run garbage collection',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}