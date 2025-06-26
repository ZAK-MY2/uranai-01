/**
 * 占術システムのパフォーマンス最適化
 * 
 * キャッシング、並列処理、遅延実行などの最適化戦略を実装
 */

import { DivinationType } from './divination-orchestrator';
import { UnifiedDivinationResult } from '@/components/divination/unified-result-converter';

export interface CacheConfig {
  maxSize: number; // キャッシュ最大サイズ（エントリ数）
  ttl: number; // Time To Live（ミリ秒）
  strategy: 'LRU' | 'LFU' | 'FIFO'; // キャッシュ戦略
}

export interface PerformanceMetrics {
  hitRate: number;
  missRate: number;
  averageResponseTime: number;
  cacheSize: number;
  evictionCount: number;
}

interface CacheEntry {
  key: string;
  value: UnifiedDivinationResult;
  timestamp: number;
  accessCount: number;
  lastAccessed: number;
  size: number; // バイト数
}

/**
 * LRU (Least Recently Used) キャッシュ実装
 */
export class DivinationCache {
  private cache: Map<string, CacheEntry>;
  private accessOrder: string[];
  private config: CacheConfig;
  private metrics: PerformanceMetrics;

  constructor(config: CacheConfig = {
    maxSize: 100,
    ttl: 3600000, // 1時間
    strategy: 'LRU'
  }) {
    this.cache = new Map();
    this.accessOrder = [];
    this.config = config;
    this.metrics = {
      hitRate: 0,
      missRate: 0,
      averageResponseTime: 0,
      cacheSize: 0,
      evictionCount: 0
    };
  }

  /**
   * キャッシュから取得
   */
  get(key: string): UnifiedDivinationResult | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.recordMiss();
      return null;
    }

    // TTLチェック
    if (this.isExpired(entry)) {
      this.remove(key);
      this.recordMiss();
      return null;
    }

    // アクセス情報更新
    entry.lastAccessed = Date.now();
    entry.accessCount++;
    
    // LRU順序更新
    if (this.config.strategy === 'LRU') {
      this.updateAccessOrder(key);
    }

    this.recordHit();
    return entry.value;
  }

  /**
   * キャッシュに保存
   */
  set(key: string, value: UnifiedDivinationResult): void {
    // 既存エントリの削除
    if (this.cache.has(key)) {
      this.remove(key);
    }

    // キャッシュサイズチェック
    if (this.cache.size >= this.config.maxSize) {
      this.evict();
    }

    const entry: CacheEntry = {
      key,
      value,
      timestamp: Date.now(),
      accessCount: 1,
      lastAccessed: Date.now(),
      size: this.calculateSize(value)
    };

    this.cache.set(key, entry);
    this.accessOrder.push(key);
    this.updateMetrics();
  }

  /**
   * キャッシュから削除
   */
  remove(key: string): boolean {
    const result = this.cache.delete(key);
    this.accessOrder = this.accessOrder.filter(k => k !== key);
    this.updateMetrics();
    return result;
  }

  /**
   * キャッシュクリア
   */
  clear(): void {
    this.cache.clear();
    this.accessOrder = [];
    this.updateMetrics();
  }

  /**
   * キャッシュ戦略に基づいてエントリを削除
   */
  private evict(): void {
    let keyToEvict: string | undefined;

    switch (this.config.strategy) {
      case 'LRU':
        keyToEvict = this.accessOrder[0];
        break;
      
      case 'LFU':
        keyToEvict = this.getLeastFrequentlyUsed();
        break;
      
      case 'FIFO':
        keyToEvict = this.getOldest();
        break;
    }

    if (keyToEvict) {
      this.remove(keyToEvict);
      this.metrics.evictionCount++;
    }
  }

  /**
   * 有効期限チェック
   */
  private isExpired(entry: CacheEntry): boolean {
    return Date.now() - entry.timestamp > this.config.ttl;
  }

  /**
   * アクセス順序の更新
   */
  private updateAccessOrder(key: string): void {
    this.accessOrder = this.accessOrder.filter(k => k !== key);
    this.accessOrder.push(key);
  }

  /**
   * 最も使用頻度の低いキーを取得
   */
  private getLeastFrequentlyUsed(): string | undefined {
    let minCount = Infinity;
    let leastUsedKey: string | undefined;

    this.cache.forEach((entry, key) => {
      if (entry.accessCount < minCount) {
        minCount = entry.accessCount;
        leastUsedKey = key;
      }
    });

    return leastUsedKey;
  }

  /**
   * 最も古いエントリのキーを取得
   */
  private getOldest(): string | undefined {
    let oldestTime = Infinity;
    let oldestKey: string | undefined;

    this.cache.forEach((entry, key) => {
      if (entry.timestamp < oldestTime) {
        oldestTime = entry.timestamp;
        oldestKey = key;
      }
    });

    return oldestKey;
  }

  /**
   * オブジェクトサイズの概算計算
   */
  private calculateSize(obj: any): number {
    const str = JSON.stringify(obj);
    return new Blob([str]).size;
  }

  /**
   * ヒット記録
   */
  private recordHit(): void {
    const total = this.metrics.hitRate + this.metrics.missRate + 1;
    this.metrics.hitRate = ((this.metrics.hitRate * (total - 1)) + 1) / total;
    this.metrics.missRate = 1 - this.metrics.hitRate;
  }

  /**
   * ミス記録
   */
  private recordMiss(): void {
    const total = this.metrics.hitRate + this.metrics.missRate + 1;
    this.metrics.missRate = ((this.metrics.missRate * (total - 1)) + 1) / total;
    this.metrics.hitRate = 1 - this.metrics.missRate;
  }

  /**
   * メトリクス更新
   */
  private updateMetrics(): void {
    this.metrics.cacheSize = this.cache.size;
  }

  /**
   * パフォーマンスメトリクス取得
   */
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  /**
   * キャッシュ統計情報
   */
  getStats(): {
    size: number;
    totalSize: number;
    oldestEntry?: Date;
    newestEntry?: Date;
    mostAccessed?: { key: string; count: number };
  } {
    let totalSize = 0;
    let oldestTime = Infinity;
    let newestTime = 0;
    let mostAccessed = { key: '', count: 0 };

    this.cache.forEach((entry, key) => {
      totalSize += entry.size;
      
      if (entry.timestamp < oldestTime) {
        oldestTime = entry.timestamp;
      }
      
      if (entry.timestamp > newestTime) {
        newestTime = entry.timestamp;
      }
      
      if (entry.accessCount > mostAccessed.count) {
        mostAccessed = { key, count: entry.accessCount };
      }
    });

    return {
      size: this.cache.size,
      totalSize,
      oldestEntry: oldestTime < Infinity ? new Date(oldestTime) : undefined,
      newestEntry: newestTime > 0 ? new Date(newestTime) : undefined,
      mostAccessed: mostAccessed.count > 0 ? mostAccessed : undefined
    };
  }
}

/**
 * 並列処理オプティマイザー
 */
export class ParallelExecutor {
  private maxConcurrency: number;
  private queue: Array<() => Promise<any>>;
  private running: number;

  constructor(maxConcurrency: number = 4) {
    this.maxConcurrency = maxConcurrency;
    this.queue = [];
    this.running = 0;
  }

  /**
   * タスクを追加して実行
   */
  async execute<T>(task: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await task();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      
      this.processQueue();
    });
  }

  /**
   * 複数タスクの並列実行
   */
  async executeAll<T>(tasks: Array<() => Promise<T>>): Promise<T[]> {
    const promises = tasks.map(task => this.execute(task));
    return Promise.all(promises);
  }

  /**
   * キューの処理
   */
  private async processQueue(): Promise<void> {
    while (this.running < this.maxConcurrency && this.queue.length > 0) {
      const task = this.queue.shift();
      if (task) {
        this.running++;
        
        try {
          await task();
        } finally {
          this.running--;
          this.processQueue();
        }
      }
    }
  }
}

/**
 * 結果のプリロード戦略
 */
export class PreloadStrategy {
  private cache: DivinationCache;
  private commonPatterns: Map<string, DivinationType[]>;

  constructor(cache: DivinationCache) {
    this.cache = cache;
    this.commonPatterns = new Map([
      ['basic', ['numerology', 'tarot', 'iching']],
      ['eastern', ['iching', 'nine-star-ki', 'shichu-suimei', 'feng-shui']],
      ['spiritual', ['chakra', 'aura-soma', 'akashic-records']],
      ['complete', [
        'numerology', 'tarot', 'celtic', 'runes', 'iching',
        'nine-star-ki', 'shichu-suimei', 'kabbalah', 'feng-shui',
        'mayan-calendar', 'chakra', 'aura-soma', 'akashic-records'
      ]]
    ]);
  }

  /**
   * よく使われるパターンを事前ロード
   */
  async preloadCommonPatterns(
    executeFunc: (types: DivinationType[]) => Promise<UnifiedDivinationResult[]>
  ): Promise<void> {
    const executor = new ParallelExecutor(2); // 2並列で実行
    
    const tasks = Array.from(this.commonPatterns.entries()).map(
      ([pattern, types]) => async () => {
        try {
          const results = await executeFunc(types);
          // キャッシュに保存
          results.forEach(result => {
            const key = this.generateCacheKey(result.type, pattern);
            this.cache.set(key, result);
          });
        } catch (error) {
          console.error(`Failed to preload pattern ${pattern}:`, error);
        }
      }
    );

    await executor.executeAll(tasks);
  }

  /**
   * 関連する占術を予測してプリロード
   */
  async predictAndPreload(
    currentType: DivinationType,
    executeFunc: (type: DivinationType) => Promise<UnifiedDivinationResult>
  ): Promise<void> {
    const relatedTypes = this.getRelatedTypes(currentType);
    const executor = new ParallelExecutor(2);
    
    const tasks = relatedTypes.map(type => async () => {
      try {
        const result = await executeFunc(type);
        const key = this.generateCacheKey(type, 'predicted');
        this.cache.set(key, result);
      } catch (error) {
        console.error(`Failed to preload ${type}:`, error);
      }
    });

    await executor.executeAll(tasks);
  }

  /**
   * 関連する占術タイプを取得
   */
  private getRelatedTypes(type: DivinationType): DivinationType[] {
    const relations: Record<DivinationType, DivinationType[]> = {
      'numerology': ['tarot', 'kabbalah'],
      'tarot': ['numerology', 'celtic', 'kabbalah'],
      'celtic': ['tarot', 'runes'],
      'runes': ['celtic', 'tarot'],
      'iching': ['nine-star-ki', 'feng-shui'],
      'nine-star-ki': ['iching', 'shichu-suimei', 'feng-shui'],
      'shichu-suimei': ['nine-star-ki', 'feng-shui'],
      'kabbalah': ['numerology', 'tarot'],
      'feng-shui': ['iching', 'nine-star-ki', 'shichu-suimei'],
      'mayan-calendar': ['numerology'],
      'chakra': ['aura-soma', 'akashic-records'],
      'aura-soma': ['chakra', 'akashic-records'],
      'akashic-records': ['chakra', 'aura-soma']
    };

    return relations[type] || [];
  }

  /**
   * キャッシュキー生成
   */
  private generateCacheKey(type: string, context: string): string {
    return `${type}:${context}:${Date.now()}`;
  }
}

/**
 * パフォーマンスモニター
 */
export class PerformanceMonitor {
  private measurements: Map<string, number[]>;

  constructor() {
    this.measurements = new Map();
  }

  /**
   * 測定開始
   */
  start(label: string): () => void {
    const startTime = performance.now();
    
    return () => {
      const duration = performance.now() - startTime;
      this.record(label, duration);
    };
  }

  /**
   * 測定値記録
   */
  private record(label: string, duration: number): void {
    if (!this.measurements.has(label)) {
      this.measurements.set(label, []);
    }
    
    const values = this.measurements.get(label)!;
    values.push(duration);
    
    // 最大100件まで保持
    if (values.length > 100) {
      values.shift();
    }
  }

  /**
   * 統計情報取得
   */
  getStats(label: string): {
    count: number;
    average: number;
    min: number;
    max: number;
    median: number;
  } | null {
    const values = this.measurements.get(label);
    if (!values || values.length === 0) {
      return null;
    }

    const sorted = [...values].sort((a, b) => a - b);
    const sum = values.reduce((acc, val) => acc + val, 0);

    return {
      count: values.length,
      average: sum / values.length,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      median: sorted[Math.floor(sorted.length / 2)]
    };
  }

  /**
   * すべての測定結果
   */
  getAllStats(): Map<string, ReturnType<typeof this.getStats>> {
    const allStats = new Map();
    
    this.measurements.forEach((_, label) => {
      allStats.set(label, this.getStats(label));
    });
    
    return allStats;
  }

  /**
   * クリア
   */
  clear(label?: string): void {
    if (label) {
      this.measurements.delete(label);
    } else {
      this.measurements.clear();
    }
  }
}