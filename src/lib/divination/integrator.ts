// 統合占術システム
import { 
  IntegratedDivinationInput, 
  IntegratedDivinationResult, 
  NumerologyResult, 
  TarotReading, 
  AstrologyResult,
  EnvironmentData,
  IChingReading,
  ShichuResult,
  RuneReading,
  PalmistryResult,
  VedicResult
} from '@/types/divination';
import { numerologyEngine } from './numerology';
import { tarotEngine } from './tarot';
import { astrologyEngine } from './astrology';
import { iChingEngine } from './iching';
import { shichuSuimeiEngine } from './shichu-suimei';
import { runeEngine } from './runes';
import { palmistryEngine } from './palmistry';
import { vedicAstrologyEngine } from './vedic-astrology';
import { AdvancedAstrologyEngine } from './advanced-astrology';
import { environmentEngine } from '../environment';

export class DivinationIntegrator {
  private advancedAstrology = new AdvancedAstrologyEngine();

  /**
   * 統合占術の実行
   */
  async performIntegratedReading(input: IntegratedDivinationInput): Promise<IntegratedDivinationResult> {
    try {
      // 基本情報の検証
      this.validateInput(input);

      // 現在位置の設定（デフォルト: 東京）
      const location = input.currentLocation || { latitude: 35.6762, longitude: 139.6503 };

      // 並列で全ての占術を実行
      const [
        numerology, 
        tarot, 
        astrology, 
        iching, 
        shichu, 
        runes, 
        palmistry, 
        vedic, 
        environment
      ] = await Promise.all([
        this.executeNumerology(input),
        this.executeTarot(input),
        this.executeAstrology(input),
        this.executeIChing(input),
        this.executeShichuSuimei(input),
        this.executeRunes(input),
        this.executePalmistry(input),
        this.executeVedicAstrology(input),
        environmentEngine.getCurrentEnvironment(location.latitude, location.longitude)
      ]);

      // 結果を統合
      const integration = this.integrateResults(
        numerology, tarot, astrology, iching, shichu, runes, palmistry, vedic, environment, input
      );

      return {
        numerology,
        tarot,
        astrology,
        iching,
        shichu,
        runes,
        palmistry,
        vedic,
        environment,
        integration
      };
    } catch (error) {
      throw new Error(`統合占術エラー: ${error instanceof Error ? error.message : '不明なエラー'}`);
    }
  }

  /**
   * 完全統合占術の実行（全ての占術を使用）
   */
  async performCompleteReading(input: IntegratedDivinationInput): Promise<any> {
    try {
      // 基本的な統合占術を実行
      const basicReading = await this.performIntegratedReading(input);

      // 高度な占星術も追加で実行
      let advancedAstrology = undefined;
      if (input.birthTime && input.birthLocation) {
        try {
          advancedAstrology = await this.advancedAstrology.performReading({
            date: input.birthDate,
            time: input.birthTime,
            latitude: input.birthLocation.latitude,
            longitude: input.birthLocation.longitude,
            timezone: input.birthLocation.timezone
          });
        } catch (error) {
          console.log('高度占星術をスキップ:', error);
        }
      }

      // 全システムの統合分析
      const completeAnalysis = this.performCompleteAnalysis(basicReading, advancedAstrology);

      return {
        ...basicReading,
        advancedAstrology,
        completeAnalysis
      };
    } catch (error) {
      throw new Error(`完全統合占術エラー: ${error instanceof Error ? error.message : '不明なエラー'}`);
    }
  }

  /**
   * 入力データの検証
   */
  private validateInput(input: IntegratedDivinationInput): void {
    if (!input.fullName) {
      throw new Error('フルネームは必須です');
    }
    if (!input.birthDate) {
      throw new Error('生年月日は必須です');
    }
    if (!input.question) {
      throw new Error('質問は必須です');
    }
    if (!input.spreadType) {
      throw new Error('タロットスプレッドタイプは必須です');
    }

    // 日付形式の検証
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(input.birthDate)) {
      throw new Error('生年月日は YYYY-MM-DD 形式で入力してください');
    }

    // 時刻形式の検証（任意）
    if (input.birthTime) {
      const timeRegex = /^\d{2}:\d{2}$/;
      if (!timeRegex.test(input.birthTime)) {
        throw new Error('出生時刻は HH:MM 形式で入力してください');
      }
    }
  }

  /**
   * 数秘術の実行
   */
  private async executeNumerology(input: IntegratedDivinationInput): Promise<NumerologyResult> {
    return await numerologyEngine.calculate({
      fullName: input.fullName,
      birthDate: input.birthDate
    });
  }

  /**
   * タロット占いの実行
   */
  private async executeTarot(input: IntegratedDivinationInput): Promise<TarotReading> {
    return await tarotEngine.drawCards({
      question: input.question,
      spreadType: input.spreadType,
      seed: `${input.fullName}-${input.birthDate}-${input.question}` // 再現可能なシード
    });
  }

  /**
   * 西洋占星術の実行
   */
  private async executeAstrology(input: IntegratedDivinationInput): Promise<AstrologyResult | undefined> {
    // 出生時刻と場所が必要
    if (!input.birthTime || !input.birthLocation) {
      console.log('占星術には出生時刻と場所が必要です。スキップします。');
      return undefined;
    }

    return await astrologyEngine.calculateChart({
      date: input.birthDate,
      time: input.birthTime,
      latitude: input.birthLocation.latitude,
      longitude: input.birthLocation.longitude,
      timezone: input.birthLocation.timezone
    });
  }

  /**
   * 易経の実行
   */
  private async executeIChing(input: IntegratedDivinationInput): Promise<IChingReading | undefined> {
    try {
      return await iChingEngine.performReading({
        question: input.question,
        method: 'three_coins' // デフォルトは三枚銭法
      });
    } catch (error) {
      console.log('易経をスキップ:', error);
      return undefined;
    }
  }

  /**
   * 四柱推命の実行
   */
  private async executeShichuSuimei(input: IntegratedDivinationInput): Promise<ShichuResult | undefined> {
    if (!input.birthTime) {
      console.log('四柱推命には出生時刻が必要です。スキップします。');
      return undefined;
    }

    try {
      return await shichuSuimeiEngine.performReading({
        birthDate: input.birthDate,
        birthTime: input.birthTime,
        gender: 'male', // デフォルト値、後で設定可能にする
        name: input.fullName
      });
    } catch (error) {
      console.log('四柱推命をスキップ:', error);
      return undefined;
    }
  }

  /**
   * ルーン占いの実行
   */
  private async executeRunes(input: IntegratedDivinationInput): Promise<RuneReading | undefined> {
    try {
      return await runeEngine.performReading({
        question: input.question,
        spreadType: 'three_rune', // デフォルトは三ルーン法
        casterName: input.fullName
      });
    } catch (error) {
      console.log('ルーン占いをスキップ:', error);
      return undefined;
    }
  }

  /**
   * 手相占いの実行
   */
  private async executePalmistry(input: IntegratedDivinationInput): Promise<PalmistryResult | undefined> {
    try {
      // 基本的な手相情報を生成（実際のアプリでは画像解析等を使用）
      return await palmistryEngine.performReading({
        hand: 'right', // デフォルトは右手
        birthDate: input.birthDate,
        age: this.calculateAge(input.birthDate),
        palmFeatures: {
          lines: {
            heart: { length: 80, depth: 'medium', breaks: [], forks: [] },
            head: { length: 75, depth: 'deep', breaks: [], forks: ['end'] },
            life: { length: 85, depth: 'medium', breaks: [], curve: 'normal' },
            fate: { present: true, clarity: 'clear', startPoint: 'base' }
          },
          mounts: {
            venus: 'prominent',
            jupiter: 'normal',
            saturn: 'flat',
            apollo: 'normal',
            mercury: 'prominent',
            luna: 'normal',
            mars_positive: 'normal',
            mars_negative: 'normal'
          },
          fingers: {
            thumb: { flexibility: 'normal', tip: 'square' },
            index: { length: 'normal', tip: 'pointed' },
            middle: { length: 'long', tip: 'square' },
            ring: { length: 'normal', tip: 'pointed' },
            little: { length: 'short', tip: 'pointed' }
          }
        }
      });
    } catch (error) {
      console.log('手相占いをスキップ:', error);
      return undefined;
    }
  }

  /**
   * ヴェーダ占星術の実行
   */
  private async executeVedicAstrology(input: IntegratedDivinationInput): Promise<VedicResult | undefined> {
    if (!input.birthTime || !input.birthLocation) {
      console.log('ヴェーダ占星術には出生時刻と場所が必要です。スキップします。');
      return undefined;
    }

    try {
      return await vedicAstrologyEngine.performReading({
        birthDate: input.birthDate,
        birthTime: input.birthTime,
        birthPlace: {
          latitude: input.birthLocation.latitude,
          longitude: input.birthLocation.longitude,
          timezone: input.birthLocation.timezone
        },
        name: input.fullName
      });
    } catch (error) {
      console.log('ヴェーダ占星術をスキップ:', error);
      return undefined;
    }
  }

  /**
   * 年齢計算ヘルパー
   */
  private calculateAge(birthDate: string): number {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }

  /**
   * 完全統合分析
   */
  private performCompleteAnalysis(basicReading: any, advancedAstrology?: any): any {
    return {
      convergence: this.analyzeConvergence(basicReading),
      patterns: this.identifyPatterns(basicReading),
      recommendations: this.generateRecommendations(basicReading),
      timing: this.analyzeOptimalTiming(basicReading),
      synthesis: this.createFinalSynthesis(basicReading, advancedAstrology)
    };
  }

  /**
   * 収束性分析
   */
  private analyzeConvergence(reading: any): string[] {
    const convergences = [];
    
    // 各システムで共通して示される特性を分析
    if (reading.numerology && reading.shichu) {
      convergences.push('東西の数理システムが示す共通の性格傾向');
    }
    
    if (reading.astrology && reading.vedic) {
      convergences.push('西洋・インド占星術の両システムが示す運命の方向性');
    }
    
    if (reading.tarot && reading.iching && reading.runes) {
      convergences.push('三大神託システムが示す現在の状況への共通見解');
    }
    
    return convergences;
  }

  /**
   * パターン識別
   */
  private identifyPatterns(reading: any): string[] {
    const patterns = [];
    
    // 循環パターンの検出
    if (reading.environment?.lunar.phase && reading.iching) {
      patterns.push('宇宙リズムと易経の示すタイミングの同調');
    }
    
    // 成長パターンの検出
    if (reading.numerology && reading.palmistry) {
      patterns.push('生来の資質と手相が示す発達パターンの一致');
    }
    
    return patterns;
  }

  /**
   * 推奨事項生成
   */
  private generateRecommendations(reading: any): string[] {
    const recommendations = [];
    
    recommendations.push('複数の占術システムの一致点を重視して行動してください');
    recommendations.push('矛盾する情報は内面の複雑さを表しており、統合が必要です');
    recommendations.push('環境エネルギーのタイミングを意識した計画を立ててください');
    
    return recommendations;
  }

  /**
   * 最適タイミング分析
   */
  private analyzeOptimalTiming(reading: any): any {
    return {
      immediate: '今すぐ行動すべき事項',
      nearTerm: '近い将来（1-3ヶ月）の行動指針',
      longTerm: '長期的な（6ヶ月以上）目標設定'
    };
  }

  /**
   * 最終統合
   */
  private createFinalSynthesis(basicReading: any, advancedAstrology?: any): string {
    return `
全ての占術システムを通じて見えてくるあなたの真の姿は、
複層的で豊かな可能性を秘めた存在です。
各システムが示す多面的な情報を統合することで、
より深い自己理解と明確な人生の指針を得ることができます。
    `.trim();
  }

  /**
   * 結果の統合と解釈
   */
  private integrateResults(
    numerology: NumerologyResult,
    tarot: TarotReading,
    astrology: AstrologyResult | undefined,
    iching: IChingReading | undefined,
    shichu: ShichuResult | undefined,
    runes: RuneReading | undefined,
    palmistry: PalmistryResult | undefined,
    vedic: VedicResult | undefined,
    environment: EnvironmentData,
    input: IntegratedDivinationInput
  ): IntegratedDivinationResult['integration'] {
    // 共通テーマの抽出（全システム対応）
    const commonThemes = this.extractEnhancedCommonThemes(
      numerology, tarot, astrology, iching, shichu, runes, palmistry, vedic
    );

    // 矛盾の分析（全システム対応）
    const contradictions = this.analyzeEnhancedContradictions(
      numerology, tarot, astrology, iching, shichu, runes, palmistry, vedic
    );

    // 環境的影響の分析
    const environmentalInfluence = this.analyzeEnvironmentalInfluence(environment, numerology, tarot);

    // 総合的な指針（全システム対応）
    const overallGuidance = this.generateEnhancedOverallGuidance(
      numerology, tarot, astrology, iching, shichu, runes, palmistry, vedic, environment, input
    );

    // 具体的なアドバイス（全システム対応）
    const specificAdvice = this.generateEnhancedSpecificAdvice(
      numerology, tarot, astrology, iching, shichu, runes, palmistry, vedic, environment
    );

    // システム間の相関分析
    const systemCorrelations = this.analyzeSystemCorrelations(
      numerology, tarot, astrology, iching, shichu, runes, palmistry, vedic
    );

    // 統合的洞察
    const integratedInsights = this.generateIntegratedInsights(
      numerology, tarot, astrology, iching, shichu, runes, palmistry, vedic, environment
    );

    return {
      commonThemes,
      contradictions,
      environmentalInfluence,
      overallGuidance,
      specificAdvice,
      systemCorrelations,
      integratedInsights
    };
  }

  /**
   * 強化版共通テーマの抽出
   */
  private extractEnhancedCommonThemes(
    numerology: NumerologyResult,
    tarot: TarotReading,
    astrology?: AstrologyResult,
    iching?: IChingReading,
    shichu?: ShichuResult,
    runes?: RuneReading,
    palmistry?: PalmistryResult,
    vedic?: VedicResult
  ): string[] {
    const themes: string[] = [];

    // 既存のテーマ抽出
    const basicThemes = this.extractCommonThemes(numerology, tarot, astrology);
    themes.push(...basicThemes);

    // 易経との相関
    if (iching) {
      themes.push(`易経が示す変化の時: ${iching.primaryHexagram.name}の教えを重視してください`);
      if (iching.changingLines && iching.changingLines.length > 0) {
        themes.push('変化の兆しが複数の占術で確認されています');
      }
    }

    // 四柱推命との相関
    if (shichu) {
      themes.push(`四柱推命による運勢: ${shichu.analysis.personality.split('。')[0]}が重要な鍵となります`);
      if (shichu.compatibility) {
        themes.push('人間関係における調和が重要なテーマです');
      }
    }

    // ルーンとの相関
    if (runes) {
      const runeThemes = runes.runes.map(r => r.meaning.keywords).flat();
      if (runeThemes.includes('变化') || runeThemes.includes('旅程')) {
        themes.push('北欧の智慧が示す人生の転換期にあります');
      }
    }

    // 手相との相関
    if (palmistry) {
      themes.push(`手相が示す才能: ${palmistry.interpretation.talents.split('。')[0]}を活かす時期です`);
    }

    // ヴェーダ占星術との相関
    if (vedic && astrology) {
      themes.push('東西占星術が共に示す宇宙的なタイミングの重要性');
    }

    return themes.length > 0 ? themes : ['多面的な成長と発展の時期です'];
  }

  /**
   * 強化版矛盾分析
   */
  private analyzeEnhancedContradictions(
    numerology: NumerologyResult,
    tarot: TarotReading,
    astrology?: AstrologyResult,
    iching?: IChingReading,
    shichu?: ShichuResult,
    runes?: RuneReading,
    palmistry?: PalmistryResult,
    vedic?: VedicResult
  ): string[] {
    const contradictions: string[] = [];

    // 既存の矛盾分析
    const basicContradictions = this.analyzeContradictions(numerology, tarot, astrology);
    contradictions.push(...basicContradictions);

    // 東西システム間の矛盾
    if (astrology && vedic) {
      contradictions.push('西洋とヴェーダ占星術の違いは、多面的な人格の表れです');
    }

    // 理性vs直感の矛盾
    if (shichu && iching) {
      contradictions.push('論理的分析と直感的洞察のバランスを取る必要があります');
    }

    // 運命vs自由意志の矛盾
    if (palmistry && runes) {
      contradictions.push('運命的要素と自己選択の力を調和させることが重要です');
    }

    return contradictions;
  }

  /**
   * 強化版総合指針
   */
  private generateEnhancedOverallGuidance(
    numerology: NumerologyResult,
    tarot: TarotReading,
    astrology?: AstrologyResult,
    iching?: IChingReading,
    shichu?: ShichuResult,
    runes?: RuneReading,
    palmistry?: PalmistryResult,
    vedic?: VedicResult,
    environment?: EnvironmentData,
    input?: IntegratedDivinationInput
  ): string {
    let guidance = `【${input?.question || '人生の指針'}】に対する完全統合占術の指針\n\n`;

    guidance += `**基本的性格（数秘術）**: ${numerology.interpretation.lifePath}\n\n`;

    if (tarot) {
      guidance += `**現在の状況（タロット）**: ${tarot.overall}\n\n`;
    }

    if (iching) {
      guidance += `**変化の方向性（易経）**: ${iching.interpretation}\n\n`;
    }

    if (shichu) {
      guidance += `**運命の骨格（四柱推命）**: ${shichu.analysis.overall}\n\n`;
    }

    if (runes) {
      guidance += `**古代の智慧（ルーン）**: ${runes.interpretation}\n\n`;
    }

    if (palmistry) {
      guidance += `**手に刻まれた運命（手相）**: ${palmistry.interpretation.overall}\n\n`;
    }

    if (astrology) {
      guidance += `**星々の配置（西洋占星術）**: ${astrology.interpretation.overall.substring(0, 100)}...\n\n`;
    }

    if (vedic) {
      guidance += `**ヴェーダの智慧（インド占星術）**: ${vedic.interpretation.overall.substring(0, 100)}...\n\n`;
    }

    guidance += `**環境エネルギー**: ${environment?.lunar.phaseName}の影響下で、最適な行動を取ってください。\n\n`;

    guidance += `**統合的メッセージ**: 全ての占術システムが示すのは、あなたの多面的で豊かな可能性です。各システムからの洞察を統合し、バランスの取れた決断を行ってください。`;

    return guidance;
  }

  /**
   * 強化版具体的アドバイス
   */
  private generateEnhancedSpecificAdvice(
    numerology: NumerologyResult,
    tarot: TarotReading,
    astrology?: AstrologyResult,
    iching?: IChingReading,
    shichu?: ShichuResult,
    runes?: RuneReading,
    palmistry?: PalmistryResult,
    vedic?: VedicResult,
    environment?: EnvironmentData
  ): string[] {
    const advice: string[] = [];

    // 基本的なアドバイス
    const basicAdvice = this.generateSpecificAdvice(numerology, tarot, astrology, environment!);
    advice.push(...basicAdvice);

    // 追加の詳細アドバイス
    if (iching) {
      advice.push(`**易経より**: ${iching.primaryHexagram.name}の智慧を日常に活かしてください`);
    }

    if (shichu) {
      advice.push(`**四柱推命より**: あなたの天運を活かす最適な時期を意識してください`);
    }

    if (runes) {
      advice.push(`**ルーンより**: 北欧の古代智慧が示す道を信頼してください`);
    }

    if (palmistry) {
      advice.push(`**手相より**: 手に刻まれた才能線を意識して能力開発してください`);
    }

    if (vedic) {
      advice.push(`**ヴェーダ占星術より**: カルマの法則に従った行動を心がけてください`);
    }

    return advice;
  }

  /**
   * システム間相関分析
   */
  private analyzeSystemCorrelations(
    numerology: NumerologyResult,
    tarot: TarotReading,
    astrology?: AstrologyResult,
    iching?: IChingReading,
    shichu?: ShichuResult,
    runes?: RuneReading,
    palmistry?: PalmistryResult,
    vedic?: VedicResult
  ): any {
    return {
      eastWest: this.analyzeEastWestCorrelation(shichu, astrology),
      ancientModern: this.analyzeAncientModernCorrelation(iching, numerology),
      intuitionLogic: this.analyzeIntuitionLogicCorrelation(tarot, shichu),
      fateChoice: this.analyzeFateChoiceCorrelation(palmistry, runes)
    };
  }

  /**
   * 統合的洞察生成
   */
  private generateIntegratedInsights(
    numerology: NumerologyResult,
    tarot: TarotReading,
    astrology?: AstrologyResult,
    iching?: IChingReading,
    shichu?: ShichuResult,
    runes?: RuneReading,
    palmistry?: PalmistryResult,
    vedic?: VedicResult,
    environment?: EnvironmentData
  ): string {
    return `
全世界の占術システムを統合した結果、あなたの本質は多次元的な存在として浮かび上がります。
西洋の論理性、東洋の調和思想、古代の直感的智慧、そして宇宙の律動が
一つの統一されたメッセージを提示しています。

この統合的視点から見えてくるのは、あなたが単一の運命に縛られるのではなく、
多様な可能性を選択できる自由意志を持った存在であるということです。
各システムの示す道筋を参考にしながら、最終的な決断は
あなた自身の内なる智慧に委ねられています。
    `.trim();
  }

  // 相関分析のヘルパーメソッド
  private analyzeEastWestCorrelation(shichu?: ShichuResult, astrology?: AstrologyResult): string {
    return '東洋と西洋の占星術システムの相関関係';
  }

  private analyzeAncientModernCorrelation(iching?: IChingReading, numerology?: NumerologyResult): string {
    return '古代の智慧と現代数理システムの相関関係';
  }

  private analyzeIntuitionLogicCorrelation(tarot?: TarotReading, shichu?: ShichuResult): string {
    return '直感的システムと論理的システムの相関関係';
  }

  private analyzeFateChoiceCorrelation(palmistry?: PalmistryResult, runes?: RuneReading): string {
    return '運命と自由選択のバランス関係';
  }

  /**
   * 共通テーマの抽出（旧版・互換性維持）
   */
  private extractCommonThemes(
    numerology: NumerologyResult,
    tarot: TarotReading,
    astrology?: AstrologyResult
  ): string[] {
    const themes: string[] = [];

    // 数秘術とタロットの共通要素
    const numerologyKeywords = [
      numerology.lifePath, numerology.destiny, numerology.soul, numerology.personality
    ].map(n => this.numberToKeywords(n)).flat();

    const tarotKeywords = tarot.cards.map(card => card.card.keywords).flat();

    // 共通キーワードの検出
    const commonKeywords = numerologyKeywords.filter(nk => 
      tarotKeywords.some(tk => tk.includes(nk) || nk.includes(tk))
    );

    if (commonKeywords.length > 0) {
      themes.push(`創造性と表現力: ${commonKeywords.slice(0, 3).join('、')}の要素が強く表れています`);
    }

    // リーダーシップテーマ
    if (numerology.lifePath === 1 && tarot.cards.some(c => c.card.keywords.includes('リーダーシップ'))) {
      themes.push('リーダーシップ: 指導力を発揮する時期です');
    }

    // 愛情・関係性テーマ
    if (numerology.lifePath === 2 || numerology.lifePath === 6) {
      if (tarot.cards.some(c => c.card.keywords.includes('愛') || c.card.keywords.includes('関係'))) {
        themes.push('愛情と調和: 人間関係が重要な鍵となります');
      }
    }

    // 変化・成長テーマ
    if (tarot.cards.some(c => c.card.keywords.includes('変化'))) {
      themes.push('変化と成長: 新しい段階への移行期にあります');
    }

    // 占星術との統合（利用可能な場合）
    if (astrology) {
      const astrologyThemes = this.extractAstrologyThemes(astrology);
      themes.push(...astrologyThemes);
    }

    return themes.length > 0 ? themes : ['自己発見と成長の時期です'];
  }

  /**
   * 矛盾の分析
   */
  private analyzeContradictions(
    numerology: NumerologyResult,
    tarot: TarotReading,
    astrology?: AstrologyResult
  ): string[] {
    const contradictions: string[] = [];

    // 数秘術の内面と外面の矛盾
    if (Math.abs(numerology.soul - numerology.personality) > 3) {
      contradictions.push('内なる願いと外見的印象に大きな違いがあります。真の自分を表現することを意識してください。');
    }

    // タロットの逆位置カードと正位置カードの矛盾
    const reversedCards = tarot.cards.filter(c => c.isReversed);
    const uprightCards = tarot.cards.filter(c => !c.isReversed);
    
    if (reversedCards.length > uprightCards.length) {
      contradictions.push('内面での葛藤や見直しが必要な時期を示しています。焦らず内省の時間を大切にしてください。');
    }

    // 積極性vs消極性の矛盾
    const hasActiveNumerology = [1, 3, 5, 8].includes(numerology.lifePath);
    const hasPassiveTarot = tarot.cards.some(c => 
      c.card.keywords.includes('内省') || c.card.keywords.includes('受容')
    );

    if (hasActiveNumerology && hasPassiveTarot) {
      contradictions.push('積極的な性格と受容的なメッセージが示されています。バランスを取ることが重要です。');
    }

    return contradictions;
  }

  /**
   * 環境的影響の分析
   */
  private analyzeEnvironmentalInfluence(
    environment: EnvironmentData,
    numerology: NumerologyResult,
    tarot: TarotReading
  ): string {
    let influence = '現在の環境エネルギーは';

    // 月相の影響
    if (environment.lunar.phase < 0.25) {
      influence += '新月期にあり、新しい始まりや種まきに適した時期です。';
    } else if (environment.lunar.phase < 0.75) {
      influence += '満月に向かう時期で、成長と拡大のエネルギーが強まっています。';
    } else {
      influence += '満月から新月に向かう時期で、手放しと内省の時期です。';
    }

    // 天候の影響
    if (environment.weather.condition.includes('晴')) {
      influence += ' 晴天のエネルギーが積極性と明確性をサポートしています。';
    } else if (environment.weather.condition.includes('雨')) {
      influence += ' 雨のエネルギーが感情の浄化と内面の成長を促しています。';
    } else if (environment.weather.condition.includes('曇')) {
      influence += ' 曇天のエネルギーが深い思考と慎重な判断を促しています。';
    }

    // 気圧の影響
    if (environment.weather.pressure < 1000) {
      influence += ' 低気圧の影響で感受性が高まり、直感力が鋭くなっています。';
    } else if (environment.weather.pressure > 1020) {
      influence += ' 高気圧の影響で安定性と集中力が高まっています。';
    }

    // 数秘術との関連
    if (numerology.lifePath === 7 && environment.lunar.phaseName.includes('月')) {
      influence += ' あなたの探求心と月のエネルギーが共鳴し、深い洞察を得やすい時期です。';
    }

    return influence;
  }

  /**
   * 総合的な指針の生成
   */
  private generateOverallGuidance(
    numerology: NumerologyResult,
    tarot: TarotReading,
    astrology: AstrologyResult | undefined,
    environment: EnvironmentData,
    input: IntegratedDivinationInput
  ): string {
    let guidance = `【${input.question}】に対する総合的な指針\n\n`;

    guidance += `あなたの本質（ライフパス${numerology.lifePath}）は、${numerology.interpretation.lifePath}\n\n`;

    guidance += `タロットカードが示すメッセージでは、${tarot.overall}\n\n`;

    if (astrology) {
      guidance += `占星術的には、${astrology.interpretation.overall.substring(0, 100)}...\n\n`;
    }

    guidance += `現在の環境エネルギー（${environment.lunar.phaseName}、${environment.weather.condition}）が、`;
    guidance += `あなたの決断と行動をサポートしています。\n\n`;

    // 具体的な行動指針
    guidance += `**推奨される行動**:\n`;
    
    if (numerology.lifePath <= 3) {
      guidance += `1. 創造的なアプローチを取る\n`;
    } else if (numerology.lifePath <= 6) {
      guidance += `1. 協力と調和を重視する\n`;
    } else {
      guidance += `1. 深い洞察と精神性を大切にする\n`;
    }

    if (tarot.cards[0] && !tarot.cards[0].isReversed) {
      guidance += `2. 積極的に前進する（${tarot.cards[0].card.name}のエネルギー）\n`;
    } else {
      guidance += `2. 慎重に内省する時間を作る\n`;
    }

    guidance += `3. 現在の環境エネルギー（${environment.lunar.phaseName}）を活用する\n`;

    guidance += `\n全体として、あなたの本質と現在の状況が調和した、実り多い時期であることを示しています。`;

    return guidance;
  }

  /**
   * 具体的なアドバイスの生成
   */
  private generateSpecificAdvice(
    numerology: NumerologyResult,
    tarot: TarotReading,
    astrology: AstrologyResult | undefined,
    environment: EnvironmentData
  ): string[] {
    const advice: string[] = [];

    // 数秘術ベースのアドバイス
    advice.push(`**数秘術より**: ${numerology.interpretation.lifePath.split('。')[0]}を意識して行動してください。`);

    // タロットベースのアドバイス
    if (tarot.advice) {
      const firstAdvice = tarot.advice.split('\n\n')[0];
      advice.push(`**タロットより**: ${firstAdvice}`);
    }

    // 占星術ベースのアドバイス（利用可能な場合）
    if (astrology) {
      advice.push(`**占星術より**: ${astrology.interpretation.personality.split('。')[0]}を活かしてください。`);
    }

    // 環境データベースのアドバイス
    advice.push(`**環境エネルギーより**: ${environment.lunar.phaseName}の時期なので、${this.getMoonPhaseAdvice(environment.lunar.phaseName)}`);

    // 天候ベースのアドバイス
    advice.push(`**天候エネルギーより**: ${environment.weather.condition}の日は、${this.getWeatherAdvice(environment.weather.condition)}`);

    return advice;
  }

  /**
   * 数字からキーワードへの変換
   */
  private numberToKeywords(num: number): string[] {
    const keywordMap: { [key: number]: string[] } = {
      1: ['リーダーシップ', '独立', '創造'],
      2: ['協力', '調和', '感受性'],
      3: ['表現', '創造', 'コミュニケーション'],
      4: ['安定', '実用', '責任'],
      5: ['自由', '冒険', '変化'],
      6: ['愛', '奉仕', '責任'],
      7: ['探求', '精神性', '洞察'],
      8: ['成功', '権力', '物質'],
      9: ['奉仕', '完成', '智慧'],
      11: ['直感', '精神性', '洞察'],
      22: ['実現', '理想', '変革'],
      33: ['愛', '奉仕', '癒し']
    };
    return keywordMap[num] || ['成長', '発展', '調和'];
  }

  /**
   * 占星術テーマの抽出
   */
  private extractAstrologyThemes(astrology: AstrologyResult): string[] {
    const themes: string[] = [];
    
    // 太陽星座からテーマを抽出
    const sunPlanet = astrology.chart.planets.find(p => p.name === 'Sun');
    if (sunPlanet) {
      themes.push(`太陽星座の影響: ${sunPlanet.sign}的な特質が活かされます`);
    }

    return themes;
  }

  /**
   * 月相に基づくアドバイス
   */
  private getMoonPhaseAdvice(phaseName: string): string {
    if (phaseName.includes('新月')) return '新しいプロジェクトや計画を始めるのに最適です。';
    if (phaseName.includes('満月')) return '完成や収穫、感謝の気持ちを大切にしてください。';
    if (phaseName.includes('上弦')) return '積極的な行動と努力を続けてください。';
    if (phaseName.includes('下弦')) return '見直しと調整の時期です。不要なものを手放しましょう。';
    return '月のリズムに合わせて自然体で過ごしてください。';
  }

  /**
   * 天候に基づくアドバイス
   */
  private getWeatherAdvice(condition: string): string {
    if (condition.includes('晴')) return '積極的な行動と新しい挑戦に適しています。';
    if (condition.includes('雨')) return '内省と感情の整理に時間を使ってください。';
    if (condition.includes('曇')) return '慎重な判断と計画的な行動を心がけてください。';
    if (condition.includes('雪')) return '静寂の中で深い洞察を得る機会です。';
    return '現在の気候エネルギーを感じながら行動してください。';
  }

  /**
   * キャッシュキー生成
   */
  generateCacheKey(input: IntegratedDivinationInput): string {
    const baseData = `${input.fullName}:${input.birthDate}:${input.question}:${input.spreadType}`;
    const locationData = input.currentLocation ? 
      `:${input.currentLocation.latitude}:${input.currentLocation.longitude}` : '';
    return `integrated:${btoa(baseData + locationData).replace(/[^a-zA-Z0-9]/g, '')}`;
  }

  /**
   * 入力ハッシュ生成
   */
  generateInputHash(input: IntegratedDivinationInput): string {
    const data = JSON.stringify(input);
    return btoa(data).replace(/[^a-zA-Z0-9]/g, '');
  }
}

// シングルトンインスタンス
export const divinationIntegrator = new DivinationIntegrator();