// Lazy loading system for divination engines
interface LazyLoadableModule<T> {
  loader: () => Promise<T>;
  instance?: T;
  loading?: Promise<T>;
  lastAccessed?: number;
  accessCount: number;
}

interface LazyLoaderOptions {
  preloadThreshold: number; // アクセス回数の閾値
  unloadAfter: number; // 未使用時間後にアンロード（ミリ秒）
  enablePreloading: boolean;
  enableUnloading: boolean;
}

export class LazyLoader {
  protected modules = new Map<string, LazyLoadableModule<any>>();
  private cleanupInterval?: NodeJS.Timeout;

  constructor(private options: LazyLoaderOptions = {
    preloadThreshold: 3,
    unloadAfter: 30 * 60 * 1000, // 30分
    enablePreloading: true,
    enableUnloading: true
  }) {
    if (options.enableUnloading) {
      this.startCleanupTimer();
    }
  }

  /**
   * モジュール登録
   */
  register<T>(key: string, loader: () => Promise<T>): void {
    this.modules.set(key, {
      loader,
      accessCount: 0
    });
  }

  /**
   * モジュール取得（遅延読み込み）
   */
  async get<T>(key: string): Promise<T> {
    const lazyModule = this.modules.get(key);
    if (!lazyModule) {
      throw new Error(`Module ${key} not registered`);
    }

    // アクセス統計更新
    lazyModule.accessCount++;
    lazyModule.lastAccessed = Date.now();

    // 既に読み込み済み
    if (lazyModule.instance) {
      return lazyModule.instance;
    }

    // 読み込み中
    if (lazyModule.loading) {
      return lazyModule.loading;
    }

    // 新規読み込み
    lazyModule.loading = this.loadModule(key, lazyModule);
    return lazyModule.loading;
  }

  /**
   * モジュール読み込み
   */
  private async loadModule<T>(key: string, module: LazyLoadableModule<T>): Promise<T> {
    try {
      console.log(`Loading module: ${key}`);
      const startTime = performance.now();
      
      const instance = await module.loader();
      
      const loadTime = performance.now() - startTime;
      console.log(`Module ${key} loaded in ${loadTime.toFixed(2)}ms`);

      module.instance = instance;
      module.loading = undefined;

      // プリロード判定
      if (this.options.enablePreloading && 
          module.accessCount >= this.options.preloadThreshold) {
        this.schedulePreload(key);
      }

      return instance;
    } catch (error) {
      module.loading = undefined;
      console.error(`Failed to load module ${key}:`, error);
      throw error;
    }
  }

  /**
   * プリロード予約
   */
  private schedulePreload(key: string): void {
    // 関連するモジュールを予測してプリロード
    const relatedModules = this.getRelatedModules(key);
    
    for (const relatedKey of relatedModules) {
      const relatedModule = this.modules.get(relatedKey);
      if (relatedModule && !relatedModule.instance && !relatedModule.loading) {
        // 少し遅らせてプリロード
        setTimeout(() => {
          this.get(relatedKey).catch(console.error);
        }, 100);
      }
    }
  }

  /**
   * 関連モジュール取得
   */
  private getRelatedModules(key: string): string[] {
    const relations: { [key: string]: string[] } = {
      'numerology': ['tarot'], // 数秘術使用者はタロットも使う可能性が高い
      'tarot': ['numerology'],
      'astrology': ['vedic-astrology'], // 西洋占星術とヴェーダ占星術
      'vedic-astrology': ['astrology'],
      'iching': ['runes'], // 古代占術同士
      'runes': ['iching'],
      'kyusei-kigaku': ['numerology'], // 九星気学と数秘術
      'integrator': ['numerology', 'tarot', 'astrology'] // 統合システムは基本的なものを使用
    };

    return relations[key] || [];
  }

  /**
   * 強制プリロード
   */
  async preload(keys: string[]): Promise<void> {
    const promises = keys.map(key => 
      this.get(key).catch(error => {
        console.warn(`Preload failed for ${key}:`, error);
        return null;
      })
    );

    await Promise.all(promises);
    console.log(`Preloaded ${keys.length} modules`);
  }

  /**
   * モジュールアンロード
   */
  unload(key: string): boolean {
    const lazyModule = this.modules.get(key);
    if (lazyModule && lazyModule.instance) {
      // クリーンアップ処理があれば実行
      if (typeof (lazyModule.instance as any).cleanup === 'function') {
        (lazyModule.instance as any).cleanup();
      }
      
      lazyModule.instance = undefined;
      console.log(`Module ${key} unloaded`);
      return true;
    }
    return false;
  }

  /**
   * 未使用モジュールクリーンアップ
   */
  private startCleanupTimer(): void {
    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      
      for (const [key, module] of this.modules.entries()) {
        if (module.instance && 
            module.lastAccessed && 
            now - module.lastAccessed > this.options.unloadAfter) {
          this.unload(key);
        }
      }
    }, 5 * 60 * 1000); // 5分間隔でチェック
  }

  /**
   * 統計情報取得
   */
  getStats() {
    const stats = {
      totalModules: this.modules.size,
      loadedModules: 0,
      loadingModules: 0,
      accessStats: [] as Array<{ key: string; accessCount: number; lastAccessed?: number; loaded: boolean }>
    };

    for (const [key, module] of this.modules.entries()) {
      if (module.instance) stats.loadedModules++;
      if (module.loading) stats.loadingModules++;
      
      stats.accessStats.push({
        key,
        accessCount: module.accessCount,
        lastAccessed: module.lastAccessed,
        loaded: !!module.instance
      });
    }

    // アクセス回数順にソート
    stats.accessStats.sort((a, b) => b.accessCount - a.accessCount);

    return stats;
  }

  /**
   * クリーンアップ
   */
  cleanup(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }

    // 全モジュールをアンロード
    for (const key of this.modules.keys()) {
      this.unload(key);
    }
  }
}

// 占術エンジン用遅延読み込みマネージャー
export class DivinationLazyLoader extends LazyLoader {
  constructor() {
    super({
      preloadThreshold: 2,
      unloadAfter: 20 * 60 * 1000, // 20分
      enablePreloading: true,
      enableUnloading: true
    });

    this.registerDivinationEngines();
  }

  /**
   * 占術エンジン登録
   */
  private registerDivinationEngines(): void {
    // 数秘術エンジン
    this.register('numerology', async () => {
      const { numerologyEngine } = await import('../divination/numerology');
      return numerologyEngine;
    });

    // タロットエンジン
    this.register('tarot', async () => {
      const { tarotEngine } = await import('../divination/tarot');
      return tarotEngine;
    });

    // 西洋占星術エンジン
    this.register('astrology', async () => {
      const { astrologyEngine } = await import('../divination/astrology');
      return astrologyEngine;
    });

    // 易経エンジン
    this.register('iching', async () => {
      const { iChingEngine } = await import('../divination/iching');
      return iChingEngine;
    });

    // 四柱推命エンジン
    this.register('shichu-suimei', async () => {
      const { shichuSuimeiEngine } = await import('../divination/shichu-suimei');
      return shichuSuimeiEngine;
    });

    // ルーンエンジン
    this.register('runes', async () => {
      const { runeEngine } = await import('../divination/runes');
      return runeEngine;
    });

    // 九星気学エンジン
    this.register('kyusei-kigaku', async () => {
      const { kyuseiKigakuEngine } = await import('../divination/kyusei-kigaku');
      return kyuseiKigakuEngine;
    });

    // ヴェーダ占星術エンジン
    this.register('vedic-astrology', async () => {
      const { vedicAstrologyEngine } = await import('../divination/vedic-astrology');
      return vedicAstrologyEngine;
    });

    // 高度占星術エンジン
    this.register('advanced-astrology', async () => {
      const { AdvancedAstrologyEngine } = await import('../divination/advanced-astrology');
      return new AdvancedAstrologyEngine();
    });

    // 統合エンジン
    this.register('integrator', async () => {
      const { divinationIntegrator } = await import('../divination/integrator');
      return divinationIntegrator;
    });

    // 環境データエンジン
    this.register('environment', async () => {
      const { environmentEngine } = await import('../environment');
      return environmentEngine;
    });
  }

  /**
   * よく使用される基本エンジンをプリロード
   */
  async preloadBasicEngines(): Promise<void> {
    await this.preload(['numerology', 'tarot', 'environment']);
  }

  /**
   * 統合システム用エンジンをプリロード
   */
  async preloadIntegratedEngines(): Promise<void> {
    await this.preload([
      'numerology', 'tarot', 'astrology', 
      'iching', 'environment', 'integrator'
    ]);
  }

  /**
   * 全エンジンをプリロード
   */
  async preloadAllEngines(): Promise<void> {
    const allKeys = Array.from(this.modules.keys());
    await this.preload(allKeys);
  }
}

// シングルトンインスタンス
export const divinationLazyLoader = new DivinationLazyLoader();