/**
 * 占術システムのオーケストレーター
 * 
 * 複数の占術エンジンを統合的に実行し、
 * 結果の集約・分析・キャッシュ管理を行う
 */

import {
  DivinationInput,
  EnvironmentData,
  WorldClassNumerologyEngine,
  WorldClassTarotEngine,
  WorldClassCelticEngine,
  WorldClassRunesEngine,
  WorldClassIChingEngine,
  WorldClassNineStarKiEngine,
  WorldClassShichuSuimeiEngine,
  WorldClassKabbalahEngine,
  WorldClassFengShuiEngine,
  WorldClassMayanCalendarEngine,
  WorldClassChakraEngine,
  WorldClassAuraSomaEngine,
  WorldClassAkashicRecordsEngine
} from './engines';

import { 
  UnifiedDivinationResult, 
  convertToUnifiedFormat 
} from '@/components/divination/unified-result-converter';

import { EnvironmentalDataService } from './environmental-data-service';
import { DivinationCache, ParallelExecutor, PerformanceMonitor } from './performance-optimizer';
import { 
  DivinationSystemError, 
  DivinationErrorType,
  ErrorClassifier, 
  RetryHandler, 
  FallbackHandler,
  ErrorLogger,
  ErrorRecoveryManager 
} from './error-handling';

export type DivinationType = 
  | 'numerology'
  | 'tarot'
  | 'celtic'
  | 'runes'
  | 'iching'
  | 'nine-star-ki'
  | 'shichu-suimei'
  | 'kabbalah'
  | 'feng-shui'
  | 'mayan-calendar'
  | 'chakra'
  | 'aura-soma'
  | 'akashic-records';

export interface DivinationRequest {
  types: DivinationType[];
  input: DivinationInput;
  options?: {
    parallel?: boolean; // 並列実行するか
    useCache?: boolean; // キャッシュを使用するか
    priority?: DivinationType[]; // 優先順位
  };
}

export interface DivinationResponse {
  results: UnifiedDivinationResult[];
  metadata: {
    totalTime: number;
    executionOrder: DivinationType[];
    environmentData: EnvironmentData;
    cacheHits: DivinationType[];
  };
}

export class DivinationOrchestrator {
  private environmentService: EnvironmentalDataService;
  private cache: DivinationCache;
  private parallelExecutor: ParallelExecutor;
  private performanceMonitor: PerformanceMonitor;

  constructor() {
    this.environmentService = new EnvironmentalDataService();
    this.cache = new DivinationCache({
      maxSize: 200,
      ttl: 60 * 60 * 1000, // 1時間
      strategy: 'LRU'
    });
    this.parallelExecutor = new ParallelExecutor(4); // 最大4並列
    this.performanceMonitor = new PerformanceMonitor();
  }

  /**
   * 複数の占術を実行
   */
  async executeDivinations(request: DivinationRequest): Promise<DivinationResponse> {
    // console.log('DivinationOrchestrator.executeDivinations called with:', request);
    const measureTotal = this.performanceMonitor.start('total_execution');
    const executionOrder: DivinationType[] = [];
    const cacheHits: DivinationType[] = [];

    // 環境データの取得（リトライ付き）
    const measureEnv = this.performanceMonitor.start('environment_fetch');
    let environmentData;
    
    try {
      environmentData = await RetryHandler.withRetry(
        () => this.environmentService.getCurrentEnvironmentData(),
        { maxAttempts: 3, delayMs: 500 }
      );
    } catch (error) {
      const classifiedError = ErrorClassifier.classify(error as Error);
      ErrorLogger.log(classifiedError, { context: 'environment_data_fetch' });
      
      // フォールバックデータを使用
      // console.warn('Using fallback environment data due to fetch error');
      environmentData = FallbackHandler.getDefaultEnvironmentData();
    }
    
    measureEnv();

    // 優先順位の決定
    const orderedTypes = this.orderDivinationTypes(
      request.types,
      request.options?.priority
    );

    // 結果格納用
    const results: UnifiedDivinationResult[] = [];

    if (request.options?.parallel) {
      // 並列実行（最適化版）
      const tasks = orderedTypes.map(type => async () => {
        const result = await this.executeSingleDivination(
          type,
          request.input,
          environmentData,
          request.options?.useCache,
          cacheHits
        );
        executionOrder.push(type);
        return result;
      });

      const parallelResults = await this.parallelExecutor.executeAll(tasks);
      results.push(...parallelResults);
    } else {
      // 順次実行
      for (const type of orderedTypes) {
        const result = await this.executeSingleDivination(
          type,
          request.input,
          environmentData,
          request.options?.useCache,
          cacheHits
        );
        results.push(result);
        executionOrder.push(type);
      }
    }

    measureTotal();
    const stats = this.performanceMonitor.getStats('total_execution');
    const totalTime = stats?.average || 0;

    return {
      results,
      metadata: {
        totalTime,
        executionOrder,
        environmentData,
        cacheHits
      }
    };
  }

  /**
   * 単一の占術を実行
   */
  private async executeSingleDivination(
    type: DivinationType,
    input: DivinationInput,
    environmentData: EnvironmentData,
    useCache?: boolean,
    cacheHits?: DivinationType[]
  ): Promise<UnifiedDivinationResult> {
    const measureSingle = this.performanceMonitor.start(`divination_${type}`);
    const cacheKey = this.generateCacheKey(type, input);

    // キャッシュチェック
    if (useCache) {
      const cached = this.cache.get(cacheKey);
      if (cached) {
        cacheHits?.push(type);
        measureSingle();
        return cached;
      }
    }

    // エンジンの実行（エラーハンドリング強化）
    try {
      const measureEngine = this.performanceMonitor.start(`engine_${type}`);
      
      // タイムアウト付き実行
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new DivinationSystemError(
          DivinationErrorType.CALCULATION_TIMEOUT,
          `${type} calculation timeout`,
          { retryable: true, fallbackAvailable: true }
        )), 30000) // 30秒タイムアウト
      );
      
      const result = await Promise.race([
        this.runDivinationEngine(type, input, environmentData),
        timeoutPromise
      ]);
      
      measureEngine();

      const unifiedResult = convertToUnifiedFormat(type, result);

      // キャッシュに保存
      if (useCache) {
        this.cache.set(cacheKey, unifiedResult);
      }

      measureSingle();
      return unifiedResult;
    } catch (error) {
      measureSingle();
      
      // console.error(`Error in divination engine ${type}:`, error);
      const classifiedError = ErrorClassifier.classify(error as Error);
      ErrorLogger.log(classifiedError, { 
        divinationType: type, 
        input, 
        environmentData 
      });
      
      // エラーリカバリーを試行
      const recoveredResult = await ErrorRecoveryManager.recover<UnifiedDivinationResult>(
        classifiedError,
        {
          divinationType: type,
          input,
          attemptNumber: 1
        }
      );
      
      if (recoveredResult) {
        return recoveredResult;
      }
      
      // 最終的なフォールバック
      const fallbackResult = FallbackHandler.getDivinationFallback(type, classifiedError);
      return convertToUnifiedFormat(type, fallbackResult);
    }
  }

  /**
   * 占術エンジンの実行（エラーハンドリング付き）
   */
  private async runDivinationEngine(
    type: DivinationType,
    input: DivinationInput,
    environmentData: EnvironmentData
  ): Promise<any> {
    // 入力データの検証
    this.validateInput(input);
    switch (type) {
      case 'numerology':
        const numerologyEngine = new WorldClassNumerologyEngine(input, environmentData);
        return numerologyEngine.calculate();

      case 'tarot':
        const tarotEngine = new WorldClassTarotEngine(input, environmentData);
        return tarotEngine.calculate();

      case 'celtic':
        const celticEngine = new WorldClassCelticEngine(input, environmentData);
        return celticEngine.calculate();

      case 'runes':
        const runesEngine = new WorldClassRunesEngine(input, environmentData);
        return runesEngine.calculate();

      case 'iching':
        const ichingEngine = new WorldClassIChingEngine(input, environmentData);
        return ichingEngine.calculate();

      case 'nine-star-ki':
        const nineStarEngine = new WorldClassNineStarKiEngine(input, environmentData);
        return nineStarEngine.calculate();

      case 'shichu-suimei':
        const shichuEngine = new WorldClassShichuSuimeiEngine(input, environmentData);
        return shichuEngine.calculate();

      case 'kabbalah':
        const kabbalahEngine = new WorldClassKabbalahEngine(input, environmentData);
        return kabbalahEngine.calculate();

      case 'feng-shui':
        const fengShuiEngine = new WorldClassFengShuiEngine(input, environmentData);
        return fengShuiEngine.calculate();

      case 'mayan-calendar':
        const mayanEngine = new WorldClassMayanCalendarEngine(input, environmentData);
        return mayanEngine.calculate();

      case 'chakra':
        const chakraEngine = new WorldClassChakraEngine(input, environmentData);
        return chakraEngine.calculate();

      case 'aura-soma':
        const auraSomaEngine = new WorldClassAuraSomaEngine(input, environmentData);
        return auraSomaEngine.calculate();

      case 'akashic-records':
        const akashicEngine = new WorldClassAkashicRecordsEngine(input, environmentData);
        return akashicEngine.calculate();

      default:
        throw new DivinationSystemError(
          DivinationErrorType.INVALID_INPUT_DATA,
          `Unknown divination type: ${type}`,
          { retryable: false, fallbackAvailable: false }
        );
    }
  }

  /**
   * 入力データの検証
   */
  private validateInput(input: DivinationInput): void {
    if (!input.fullName || input.fullName.trim() === '') {
      throw new DivinationSystemError(
        DivinationErrorType.INVALID_INPUT_DATA,
        'Name is required',
        { retryable: false, fallbackAvailable: false }
      );
    }

    if (!input.birthDate || !(input.birthDate instanceof Date)) {
      throw new DivinationSystemError(
        DivinationErrorType.INVALID_INPUT_DATA,
        'Valid birth date is required',
        { retryable: false, fallbackAvailable: false }
      );
    }

    if (!input.birthPlace || input.birthPlace.trim() === '') {
      throw new DivinationSystemError(
        DivinationErrorType.INVALID_INPUT_DATA,
        'Birth place is required',
        { retryable: false, fallbackAvailable: false }
      );
    }
  }

  /**
   * 占術タイプの実行順序を決定
   */
  private orderDivinationTypes(
    types: DivinationType[],
    priority?: DivinationType[]
  ): DivinationType[] {
    if (!priority || priority.length === 0) {
      // デフォルトの優先順位
      const defaultOrder: DivinationType[] = [
        'numerology',
        'tarot',
        'iching',
        'nine-star-ki',
        'celtic',
        'runes',
        'shichu-suimei',
        'kabbalah',
        'feng-shui',
        'mayan-calendar',
        'chakra',
        'aura-soma',
        'akashic-records'
      ];

      return types.sort((a, b) => 
        defaultOrder.indexOf(a) - defaultOrder.indexOf(b)
      );
    }

    // カスタム優先順位
    const ordered: DivinationType[] = [];
    
    // 優先順位に従って追加
    for (const p of priority) {
      if (types.includes(p)) {
        ordered.push(p);
      }
    }

    // 残りを追加
    for (const t of types) {
      if (!ordered.includes(t)) {
        ordered.push(t);
      }
    }

    return ordered;
  }

  /**
   * キャッシュキーの生成
   */
  private generateCacheKey(type: DivinationType, input: DivinationInput): string {
    const inputKey = `${input.fullName}-${input.birthDate.toISOString()}-${input.birthPlace}`;
    return `${type}:${inputKey}`;
  }

  /**
   * 占術名の取得
   */
  private getDivinationName(type: DivinationType): string {
    const names: Record<DivinationType, string> = {
      'numerology': '数秘術',
      'tarot': 'タロット',
      'celtic': 'ケルト占術',
      'runes': 'ルーン占い',
      'iching': '易経',
      'nine-star-ki': '九星気学',
      'shichu-suimei': '四柱推命',
      'kabbalah': 'カバラ数秘術',
      'feng-shui': '風水',
      'mayan-calendar': 'マヤ暦',
      'chakra': 'チャクラ診断',
      'aura-soma': 'オーラソーマ',
      'akashic-records': 'アカシックレコード'
    };

    return names[type] || type;
  }

  /**
   * キャッシュのクリア
   */
  clearCache(type?: DivinationType): void {
    if (type) {
      // 特定タイプのキャッシュをクリア
      const stats = this.cache.getStats();
      // 実装は DivinationCache 内で管理
      this.cache.clear(); // 一旦全クリア（TODO: タイプ別クリア実装）
    } else {
      // 全キャッシュをクリア
      this.cache.clear();
    }
  }

  /**
   * パフォーマンス統計情報
   */
  getPerformanceStats(): {
    cache: ReturnType<DivinationCache['getMetrics']>;
    execution: Map<string, any>;
    errors: ReturnType<typeof ErrorLogger.getRecentErrors>;
  } {
    return {
      cache: this.cache.getMetrics(),
      execution: this.performanceMonitor.getAllStats(),
      errors: ErrorLogger.getRecentErrors()
    };
  }

  /**
   * キャッシュの統計情報
   */
  getCacheStats(): ReturnType<DivinationCache['getStats']> {
    return this.cache.getStats();
  }
}

/**
 * シングルトンインスタンス
 */
let orchestratorInstance: DivinationOrchestrator | null = null;

export function getDivinationOrchestrator(): DivinationOrchestrator {
  if (!orchestratorInstance) {
    orchestratorInstance = new DivinationOrchestrator();
  }
  return orchestratorInstance;
}