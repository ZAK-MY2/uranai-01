// 統一占術API - 全占術共通インターフェース
import { numerologyEngine } from './numerology';
import { astrologyEngine } from './astrology';
import { iChingEngine } from './iching';
import { shichuSuimeiEngine } from './shichu-suimei';
import { vedicAstrologyEngine } from './vedic-astrology';
import { runesEngine } from './runes';
import { kyuseiKigakuEngine } from './kyusei-kigaku';
import { tarotEngine } from './tarot';
import { timeIntegrationEngine } from './time-integration';

export interface UnifiedDivinationInput {
  method: 'numerology' | 'astrology' | 'iching' | 'shichu' | 'vedic' | 'runes' | 'kyusei' | 'tarot';
  params: Record<string, any>;
  includeTimeEnhancement?: boolean;
}

export interface UnifiedDivinationResult {
  method: string;
  baseResult: any;
  timeEnhanced?: any;
  timestamp: string;
  cacheKey: string;
}

export class UnifiedDivinationAPI {
  /**
   * 統一占術実行
   */
  async performDivination(input: UnifiedDivinationInput): Promise<UnifiedDivinationResult> {
    try {
      // 基本占術実行
      const baseResult = await this.executeBaseDivination(input.method, input.params);
      
      // 時間連動強化（オプション）
      let timeEnhanced;
      if (input.includeTimeEnhancement && input.params.birthDate) {
        timeEnhanced = await this.enhanceWithTimeIntegration(input.method, baseResult, input.params);
      }
      
      // キャッシュキー生成
      const cacheKey = this.generateUnifiedCacheKey(input);
      
      return {
        method: input.method,
        baseResult,
        timeEnhanced,
        timestamp: new Date().toISOString(),
        cacheKey
      };
    } catch (error) {
      console.error(`統一占術API エラー [${input.method}]:`, error);
      throw new Error(`占術実行中にエラーが発生しました: ${error instanceof Error ? error.message : '不明なエラー'}`);
    }
  }

  /**
   * 複数占術同時実行
   */
  async performMultipleDivinations(
    methods: UnifiedDivinationInput[], 
    correlationAnalysis: boolean = true
  ): Promise<{
    results: UnifiedDivinationResult[];
    correlation?: any;
  }> {
    try {
      // 並列実行
      const results = await Promise.all(
        methods.map(input => this.performDivination(input))
      );
      
      // 相関分析（オプション）
      let correlation;
      if (correlationAnalysis && results.length > 1) {
        correlation = this.analyzeCorrelations(results);
      }
      
      return { results, correlation };
    } catch (error) {
      console.error('複数占術実行エラー:', error);
      throw new Error('複数占術の実行中にエラーが発生しました');
    }
  }

  /**
   * 日運・月運・年運の統一取得
   */
  async getUnifiedTimeBasedFortune(
    birthDate: string, 
    methods: Array<'numerology' | 'kyusei' | 'shichu' | 'vedic'> = ['numerology', 'kyusei']
  ): Promise<{
    daily: Record<string, any>;
    monthly: Record<string, any>;
    yearly: Record<string, any>;
    unified: {
      dailyConsensus: string;
      monthlyTheme: string;
      yearlyOutlook: string;
    };
  }> {
    try {
      const results: Record<string, any> = {};
      
      // 指定された占術の時間運勢を取得
      for (const method of methods) {
        const input: UnifiedDivinationInput = {
          method,
          params: { birthDate, name: 'TimeQuery' },
          includeTimeEnhancement: true
        };
        
        const result = await this.performDivination(input);
        results[method] = result.timeEnhanced?.timeBasedResults || result.baseResult.timeBasedResults;
      }
      
      // 統一見解の生成
      const unified = this.generateUnifiedFortune(results);
      
      return {
        daily: Object.fromEntries(Object.entries(results).map(([k, v]) => [k, v?.daily])),
        monthly: Object.fromEntries(Object.entries(results).map(([k, v]) => [k, v?.monthly])),
        yearly: Object.fromEntries(Object.entries(results).map(([k, v]) => [k, v?.yearly])),
        unified
      };
    } catch (error) {
      console.error('統一時間運勢取得エラー:', error);
      throw new Error('時間運勢の取得中にエラーが発生しました');
    }
  }

  /**
   * 基本占術実行
   */
  private async executeBaseDivination(method: string, params: any): Promise<any> {
    switch (method) {
      case 'numerology':
        return await numerologyEngine.calculate({
          fullName: params.fullName || params.name,
          birthDate: params.birthDate
        });
        
      case 'astrology':
        return await astrologyEngine.calculateChart({
          date: params.birthDate,
          time: params.birthTime || '12:00',
          latitude: params.latitude || 35.6762,
          longitude: params.longitude || 139.6503,
          timezone: params.timezone || 'Asia/Tokyo'
        });
        
      case 'iching':
        return await iChingEngine.performReading({
          question: params.question,
          method: params.method || 'three_coins',
          seed: params.seed
        });
        
      case 'shichu':
        return await shichuSuimeiEngine.performReading({
          birthDate: params.birthDate,
          birthTime: params.birthTime || '12:00',
          gender: params.gender || 'male',
          name: params.name
        });
        
      case 'vedic':
        return await vedicAstrologyEngine.performReading({
          birthDate: params.birthDate,
          birthTime: params.birthTime || '12:00',
          birthPlace: {
            latitude: params.latitude || 35.6762,
            longitude: params.longitude || 139.6503,
            timezone: params.timezone || 'Asia/Tokyo'
          },
          name: params.name
        });
        
      case 'runes':
        return await runesEngine.performReading({
          question: params.question,
          spreadType: params.spreadType || 'single_rune',
          casterName: params.name
        });
        
      case 'kyusei':
        return await kyuseiKigakuEngine.performReading({
          name: params.name,
          birthDate: params.birthDate,
          currentLocation: params.currentLocation
        });
        
      case 'tarot':
        const tarotEngine = (await import('./tarot')).tarotEngine;
        return await tarotEngine.performReading({
          question: params.question,
          spreadType: params.spreadType || 'three_card',
          seed: params.seed
        });
        
      default:
        throw new Error(`未対応の占術方法: ${method}`);
    }
  }

  /**
   * 時間統合強化
   */
  private async enhanceWithTimeIntegration(method: string, baseResult: any, params: any): Promise<any> {
    const birthDate = new Date(params.birthDate);
    const timeModel = timeIntegrationEngine.generateUniversalTimeModel(birthDate);
    
    switch (method) {
      case 'numerology':
        return timeIntegrationEngine.enhanceNumerologyWithTime(baseResult, timeModel);
      case 'astrology':
        return timeIntegrationEngine.enhanceAstrologyWithTime(baseResult, timeModel);
      case 'iching':
        return timeIntegrationEngine.enhanceIChingWithTime(baseResult, timeModel);
      case 'shichu':
        return timeIntegrationEngine.enhanceShichuWithTime(baseResult, timeModel);
      case 'vedic':
        return timeIntegrationEngine.enhanceVedicWithTime(baseResult, timeModel);
      case 'runes':
        return timeIntegrationEngine.enhanceRunesWithTime(baseResult, timeModel);
      case 'kyusei':
        return timeIntegrationEngine.enhanceKyuseiWithTime(baseResult, timeModel);
      default:
        return baseResult;
    }
  }

  /**
   * 相関分析
   */
  private analyzeCorrelations(results: UnifiedDivinationResult[]): any {
    const correlations = {
      commonThemes: this.extractCommonThemes(results),
      contradictions: this.findContradictions(results),
      strengthConsensus: this.findStrengthConsensus(results),
      timeAlignment: this.analyzeTimeAlignment(results)
    };
    
    return {
      ...correlations,
      overallHarmony: this.calculateOverallHarmony(correlations),
      recommendations: this.generateCorrelationRecommendations(correlations)
    };
  }

  /**
   * 共通テーマ抽出
   */
  private extractCommonThemes(results: UnifiedDivinationResult[]): string[] {
    const themes: Record<string, number> = {};
    
    results.forEach(result => {
      // 各占術結果からキーワードを抽出
      const keywords = this.extractKeywords(result);
      keywords.forEach(keyword => {
        themes[keyword] = (themes[keyword] || 0) + 1;
      });
    });
    
    // 複数の占術で共通するテーマを返す
    return Object.entries(themes)
      .filter(([_, count]) => count >= 2)
      .map(([theme, _]) => theme)
      .slice(0, 5);
  }

  /**
   * 矛盾点の発見
   */
  private findContradictions(results: UnifiedDivinationResult[]): string[] {
    const contradictions: string[] = [];
    
    // 簡略化された矛盾検出
    const energyLevels = results
      .map(r => r.timeEnhanced?.timeBasedResults?.daily?.energy || 50)
      .filter(e => typeof e === 'number');
    
    if (energyLevels.length > 1) {
      const max = Math.max(...energyLevels);
      const min = Math.min(...energyLevels);
      
      if (max - min > 40) {
        contradictions.push('エネルギーレベルに大きな差があります');
      }
    }
    
    return contradictions;
  }

  /**
   * 強み合意点の発見
   */
  private findStrengthConsensus(results: UnifiedDivinationResult[]): string[] {
    const strengthKeywords = ['成功', '幸運', '発展', '成長', '調和', '平和'];
    const consensus: string[] = [];
    
    results.forEach(result => {
      const text = JSON.stringify(result.baseResult).toLowerCase();
      strengthKeywords.forEach(keyword => {
        if (text.includes(keyword) && !consensus.includes(keyword)) {
          consensus.push(keyword);
        }
      });
    });
    
    return consensus.slice(0, 3);
  }

  /**
   * 時間的整合性分析
   */
  private analyzeTimeAlignment(results: UnifiedDivinationResult[]): any {
    const dailyFortunes = results
      .map(r => r.timeEnhanced?.timeBasedResults?.daily?.fortune)
      .filter(Boolean);
    
    const alignment = dailyFortunes.length > 1 ? 'partial' : 'unknown';
    
    return {
      alignment,
      count: dailyFortunes.length,
      sample: dailyFortunes[0] || 'データなし'
    };
  }

  /**
   * 全体調和度計算
   */
  private calculateOverallHarmony(correlations: any): number {
    let harmony = 50; // ベースライン
    
    // 共通テーマが多いほど調和度アップ
    harmony += correlations.commonThemes.length * 10;
    
    // 矛盾が少ないほど調和度アップ
    harmony -= correlations.contradictions.length * 15;
    
    // 強み合意が多いほど調和度アップ
    harmony += correlations.strengthConsensus.length * 8;
    
    return Math.max(0, Math.min(100, harmony));
  }

  /**
   * 相関に基づく推奨事項生成
   */
  private generateCorrelationRecommendations(correlations: any): string[] {
    const recommendations: string[] = [];
    
    if (correlations.commonThemes.length > 2) {
      recommendations.push('複数の占術で共通するテーマに注目してください');
    }
    
    if (correlations.contradictions.length > 0) {
      recommendations.push('矛盾する要素については慎重に判断することをお勧めします');
    }
    
    if (correlations.strengthConsensus.length > 1) {
      recommendations.push('共通して示される強みを活かすチャンスです');
    }
    
    return recommendations;
  }

  /**
   * キーワード抽出
   */
  private extractKeywords(result: UnifiedDivinationResult): string[] {
    const text = JSON.stringify(result.baseResult);
    const keywords = ['成功', '愛', '健康', '成長', '変化', '安定', '創造', '調和', '挑戦', '機会'];
    
    return keywords.filter(keyword => 
      text.includes(keyword) || 
      (result.timeEnhanced && JSON.stringify(result.timeEnhanced).includes(keyword))
    );
  }

  /**
   * 統一運勢生成
   */
  private generateUnifiedFortune(results: Record<string, any>): any {
    const dailyFortunes = Object.values(results)
      .map((r: any) => r?.daily?.fortune)
      .filter(Boolean);
    
    const monthlyThemes = Object.values(results)
      .map((r: any) => r?.monthly?.theme)
      .filter(Boolean);
    
    const yearlyOutlooks = Object.values(results)
      .map((r: any) => r?.yearly?.fortune)
      .filter(Boolean);
    
    return {
      dailyConsensus: this.generateConsensus(dailyFortunes, '今日'),
      monthlyTheme: this.generateConsensus(monthlyThemes, '今月'),
      yearlyOutlook: this.generateConsensus(yearlyOutlooks, '今年')
    };
  }

  /**
   * 合意見解生成
   */
  private generateConsensus(items: string[], timeframe: string): string {
    if (items.length === 0) return `${timeframe}のデータが不足しています`;
    if (items.length === 1) return items[0];
    
    // 複数の見解から共通要素を抽出（簡略版）
    const positiveWords = ['良好', '幸運', '成功', '発展', '順調', '吉'];
    const hasPositive = items.some(item => 
      positiveWords.some(word => item.includes(word))
    );
    
    if (hasPositive) {
      return `${timeframe}は全体的に良好な流れにあります。複数の占術が共通して前向きな兆候を示しています。`;
    }
    
    return `${timeframe}は慎重さが求められる時期です。複数の観点から判断することをお勧めします。`;
  }

  /**
   * 統一キャッシュキー生成
   */
  private generateUnifiedCacheKey(input: UnifiedDivinationInput): string {
    const paramHash = btoa(JSON.stringify(input.params)).replace(/[^a-zA-Z0-9]/g, '');
    const date = new Date().toISOString().split('T')[0];
    
    return `unified:${input.method}:${paramHash.substring(0, 16)}:${date}`;
  }

  /**
   * バッチ処理用の効率的な複数占術実行
   */
  async performBatchDivinations(
    baseParams: Record<string, any>,
    methods: Array<'numerology' | 'kyusei' | 'shichu' | 'vedic' | 'astrology' | 'runes' | 'iching'>
  ): Promise<Record<string, UnifiedDivinationResult>> {
    try {
      const inputs: UnifiedDivinationInput[] = methods.map(method => ({
        method,
        params: baseParams,
        includeTimeEnhancement: true
      }));
      
      const results = await Promise.all(
        inputs.map(input => this.performDivination(input))
      );
      
      return Object.fromEntries(
        results.map((result, index) => [methods[index], result])
      );
    } catch (error) {
      console.error('バッチ占術実行エラー:', error);
      throw new Error('バッチ占術の実行中にエラーが発生しました');
    }
  }

  /**
   * 占術結果の品質評価
   */
  evaluateResultQuality(result: UnifiedDivinationResult): {
    completeness: number; // 0-100
    consistency: number; // 0-100
    depth: number; // 0-100
    overall: number; // 0-100
  } {
    const completeness = this.assessCompleteness(result);
    const consistency = this.assessConsistency(result);
    const depth = this.assessDepth(result);
    const overall = (completeness + consistency + depth) / 3;
    
    return { completeness, consistency, depth, overall };
  }

  private assessCompleteness(result: UnifiedDivinationResult): number {
    let score = 50; // ベースライン
    
    if (result.baseResult) score += 20;
    if (result.timeEnhanced) score += 20;
    if (result.timestamp) score += 5;
    if (result.cacheKey) score += 5;
    
    return Math.min(100, score);
  }

  private assessConsistency(result: UnifiedDivinationResult): number {
    // 簡略化された一貫性評価
    return 80; // デフォルトで高い一貫性を仮定
  }

  private assessDepth(result: UnifiedDivinationResult): number {
    const hasTimeEnhancement = result.timeEnhanced ? 30 : 0;
    const hasDetailedInterpretation = JSON.stringify(result.baseResult).length > 500 ? 40 : 20;
    const hasSpecificAdvice = JSON.stringify(result).includes('advice') ? 30 : 0;
    
    return Math.min(100, hasTimeEnhancement + hasDetailedInterpretation + hasSpecificAdvice);
  }
}

// シングルトンインスタンス
export const unifiedDivinationAPI = new UnifiedDivinationAPI();