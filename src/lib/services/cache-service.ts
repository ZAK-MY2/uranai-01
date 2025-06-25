import { databaseService } from './database-service';
import { DivinationInput } from '@/lib/divination/base-engine';
import { EnvironmentData } from '@/types/database';

interface CacheEntry {
  result_data: any;
  environment_data?: EnvironmentData;
  timestamp: number;
}

export class CacheService {
  // インメモリキャッシュ（ブラウザセッション中のみ有効）
  private memoryCache: Map<string, CacheEntry> = new Map();
  
  // キャッシュ有効期限（ミリ秒）
  private readonly MEMORY_CACHE_TTL = 5 * 60 * 1000; // 5分
  private readonly DB_CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7日

  /**
   * キャッシュから結果を取得
   * メモリキャッシュ → データベースキャッシュの順で確認
   */
  async getCachedResult(
    divination_type: string,
    input_data: DivinationInput
  ): Promise<{ result_data: any; environment_data?: EnvironmentData } | null> {
    const cacheKey = this.generateCacheKey(divination_type, input_data);

    // 1. メモリキャッシュを確認
    const memoryEntry = this.memoryCache.get(cacheKey);
    if (memoryEntry && this.isValidMemoryCache(memoryEntry)) {
      console.log('メモリキャッシュヒット:', cacheKey);
      return {
        result_data: memoryEntry.result_data,
        environment_data: memoryEntry.environment_data
      };
    }

    // 2. データベースキャッシュを確認
    try {
      const dbResult = await databaseService.getCachedResult(divination_type, input_data);
      if (dbResult) {
        console.log('データベースキャッシュヒット:', cacheKey);
        
        // メモリキャッシュに保存
        this.setMemoryCache(cacheKey, dbResult.result_data, dbResult.environment_data);
        
        return dbResult;
      }
    } catch (error) {
      console.error('データベースキャッシュ取得エラー:', error);
    }

    return null;
  }

  /**
   * キャッシュに結果を保存
   * メモリキャッシュとデータベースキャッシュの両方に保存
   */
  async setCachedResult(
    divination_type: string,
    input_data: DivinationInput,
    result_data: any,
    environment_data?: EnvironmentData
  ): Promise<void> {
    const cacheKey = this.generateCacheKey(divination_type, input_data);

    // 1. メモリキャッシュに保存
    this.setMemoryCache(cacheKey, result_data, environment_data);

    // 2. データベースキャッシュに保存（非同期）
    databaseService.setCachedResult(
      divination_type,
      input_data,
      result_data,
      environment_data
    ).catch(error => {
      console.error('データベースキャッシュ保存エラー:', error);
    });
  }

  /**
   * 特定の占術タイプのキャッシュをクリア
   */
  clearCache(divination_type?: string): void {
    if (divination_type) {
      // 特定タイプのみクリア
      const keysToDelete: string[] = [];
      this.memoryCache.forEach((_, key) => {
        if (key.startsWith(divination_type + '::')) {
          keysToDelete.push(key);
        }
      });
      keysToDelete.forEach(key => this.memoryCache.delete(key));
    } else {
      // 全キャッシュクリア
      this.memoryCache.clear();
    }
  }

  /**
   * 期限切れキャッシュの削除
   */
  cleanupExpiredCache(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    this.memoryCache.forEach((entry, key) => {
      if (!this.isValidMemoryCache(entry)) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => this.memoryCache.delete(key));
    console.log(`期限切れキャッシュ削除: ${keysToDelete.length}件`);
  }

  /**
   * キャッシュ統計情報を取得
   */
  getCacheStats(): {
    memoryCacheSize: number;
    memoryCacheKeys: string[];
  } {
    return {
      memoryCacheSize: this.memoryCache.size,
      memoryCacheKeys: Array.from(this.memoryCache.keys())
    };
  }

  // ========================================
  // プライベートメソッド
  // ========================================

  private generateCacheKey(
    divination_type: string,
    input_data: DivinationInput
  ): string {
    // 入力データを正規化してキーを生成
    const normalizedInput = {
      birthDate: input_data.birthDate.toISOString().split('T')[0],
      fullName: input_data.fullName.trim().toLowerCase(),
      question: input_data.question?.trim().toLowerCase(),
      questionCategory: input_data.questionCategory
    };

    return `${divination_type}::${JSON.stringify(normalizedInput)}`;
  }

  private setMemoryCache(
    key: string,
    result_data: any,
    environment_data?: EnvironmentData
  ): void {
    this.memoryCache.set(key, {
      result_data,
      environment_data,
      timestamp: Date.now()
    });

    // キャッシュサイズ制限（最大100エントリ）
    if (this.memoryCache.size > 100) {
      // 最も古いエントリを削除
      const oldestKey = this.findOldestCacheKey();
      if (oldestKey) {
        this.memoryCache.delete(oldestKey);
      }
    }
  }

  private isValidMemoryCache(entry: CacheEntry): boolean {
    return Date.now() - entry.timestamp < this.MEMORY_CACHE_TTL;
  }

  private findOldestCacheKey(): string | null {
    let oldestKey: string | null = null;
    let oldestTimestamp = Infinity;

    this.memoryCache.forEach((entry, key) => {
      if (entry.timestamp < oldestTimestamp) {
        oldestTimestamp = entry.timestamp;
        oldestKey = key;
      }
    });

    return oldestKey;
  }
}

// シングルトンインスタンス
export const cacheService = new CacheService();

// 定期的なクリーンアップ（5分ごと）
if (typeof window !== 'undefined') {
  setInterval(() => {
    cacheService.cleanupExpiredCache();
  }, 5 * 60 * 1000);
}

// ========================================
// React Hook for Cache Management
// ========================================

import { useCallback } from 'react';

export function useDivinationCache() {
  const getCached = useCallback(async (
    divination_type: string,
    input_data: DivinationInput
  ) => {
    return cacheService.getCachedResult(divination_type, input_data);
  }, []);

  const setCached = useCallback(async (
    divination_type: string,
    input_data: DivinationInput,
    result_data: any,
    environment_data?: EnvironmentData
  ) => {
    return cacheService.setCachedResult(
      divination_type,
      input_data,
      result_data,
      environment_data
    );
  }, []);

  const clearCache = useCallback((divination_type?: string) => {
    cacheService.clearCache(divination_type);
  }, []);

  const getCacheStats = useCallback(() => {
    return cacheService.getCacheStats();
  }, []);

  return {
    getCached,
    setCached,
    clearCache,
    getCacheStats
  };
}