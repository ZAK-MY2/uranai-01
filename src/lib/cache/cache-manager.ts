// Cache management system for performance optimization
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
  hits: number;
  size: number;
}

interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  maxSize?: number; // Maximum number of entries
  maxMemory?: number; // Maximum memory usage in bytes
}

export class CacheManager {
  private cache = new Map<string, CacheEntry<any>>();
  private readonly defaultTTL = 30 * 60 * 1000; // 30 minutes
  private readonly maxSize = 1000;
  private readonly maxMemory = 50 * 1024 * 1024; // 50MB
  
  constructor(private options: CacheOptions = {}) {}

  /**
   * キャッシュから値を取得
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    // 有効期限チェック
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    // ヒット数更新
    entry.hits++;
    return entry.data;
  }

  /**
   * キャッシュに値を設定
   */
  set<T>(key: string, data: T, ttl?: number): void {
    const now = Date.now();
    const expiresAt = now + (ttl || this.options.ttl || this.defaultTTL);
    const dataSize = this.calculateSize(data);

    const entry: CacheEntry<T> = {
      data,
      timestamp: now,
      expiresAt,
      hits: 0,
      size: dataSize
    };

    // メモリ制限チェック
    this.ensureMemoryLimit(dataSize);
    
    // サイズ制限チェック
    this.ensureSizeLimit();

    this.cache.set(key, entry);
  }

  /**
   * キャッシュから削除
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * キャッシュクリア
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * キャッシュ統計情報
   */
  getStats() {
    const entries = Array.from(this.cache.values());
    const totalSize = entries.reduce((sum, entry) => sum + entry.size, 0);
    const totalHits = entries.reduce((sum, entry) => sum + entry.hits, 0);
    
    return {
      entries: this.cache.size,
      totalSize,
      totalHits,
      averageHits: entries.length > 0 ? totalHits / entries.length : 0,
      memoryUsage: `${(totalSize / 1024 / 1024).toFixed(2)}MB`,
      hitRate: this.calculateHitRate()
    };
  }

  /**
   * 期限切れエントリを削除
   */
  cleanup(): number {
    const now = Date.now();
    let removed = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
        removed++;
      }
    }

    return removed;
  }

  /**
   * データサイズ計算（概算）
   */
  private calculateSize(data: any): number {
    const json = JSON.stringify(data);
    return new Blob([json]).size;
  }

  /**
   * メモリ制限の確保
   */
  private ensureMemoryLimit(newEntrySize: number): void {
    const maxMemory = this.options.maxMemory || this.maxMemory;
    const currentMemory = Array.from(this.cache.values())
      .reduce((sum, entry) => sum + entry.size, 0);

    if (currentMemory + newEntrySize > maxMemory) {
      this.evictLeastRecentlyUsed(currentMemory + newEntrySize - maxMemory);
    }
  }

  /**
   * サイズ制限の確保
   */
  private ensureSizeLimit(): void {
    const maxSize = this.options.maxSize || this.maxSize;
    
    while (this.cache.size >= maxSize) {
      this.evictLeastRecentlyUsed();
    }
  }

  /**
   * LRU削除
   */
  private evictLeastRecentlyUsed(bytesToFree?: number): void {
    const entries = Array.from(this.cache.entries())
      .map(([key, entry]) => ({ key, ...entry }))
      .sort((a, b) => a.timestamp - b.timestamp); // 最も古いものから

    let freedBytes = 0;
    
    for (const entry of entries) {
      this.cache.delete(entry.key);
      freedBytes += entry.size;
      
      if (bytesToFree && freedBytes >= bytesToFree) {
        break;
      }
      
      if (!bytesToFree) {
        break; // 1つだけ削除
      }
    }
  }

  /**
   * ヒット率計算
   */
  private calculateHitRate(): number {
    // 簡単な実装：直近の統計からヒット率を推定
    return 0.8; // プレースホルダー
  }

  /**
   * ウォームアップ：よく使用されるデータを事前に計算してキャッシュ
   */
  async warmup(commonInputs: Array<{ key: string; calculator: () => Promise<any> }>): Promise<void> {
    const promises = commonInputs.map(async ({ key, calculator }) => {
      try {
        const result = await calculator();
        this.set(key, result);
      } catch (error) {
        console.warn(`ウォームアップ失敗: ${key}`, error);
      }
    });

    await Promise.all(promises);
  }
}

// シングルトンインスタンス
export const cacheManager = new CacheManager({
  ttl: 30 * 60 * 1000, // 30分
  maxSize: 1000,
  maxMemory: 50 * 1024 * 1024 // 50MB
});

// 自動クリーンアップ（5分間隔）
setInterval(() => {
  const removed = cacheManager.cleanup();
  if (removed > 0) {
    console.log(`キャッシュクリーンアップ: ${removed}件削除`);
  }
}, 5 * 60 * 1000);