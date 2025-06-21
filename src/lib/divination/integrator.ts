// 統合占術システム
import { 
  IntegratedDivinationInput, 
  IntegratedDivinationResult, 
  NumerologyResult, 
  TarotReading, 
  AstrologyResult,
  EnvironmentData 
} from '@/types/divination';
import { numerologyEngine } from './numerology';
import { tarotEngine } from './tarot';
import { astrologyEngine } from './astrology';
import { environmentEngine } from '../environment';

export class DivinationIntegrator {
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
      const [numerology, tarot, astrology, environment] = await Promise.all([
        this.executeNumerology(input),
        this.executeTarot(input),
        this.executeAstrology(input),
        environmentEngine.getCurrentEnvironment(location.latitude, location.longitude)
      ]);

      // 結果を統合
      const integration = this.integrateResults(numerology, tarot, astrology, environment, input);

      return {
        numerology,
        tarot,
        astrology,
        environment,
        integration
      };
    } catch (error) {
      throw new Error(`統合占術エラー: ${error instanceof Error ? error.message : '不明なエラー'}`);
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
   * 結果の統合と解釈
   */
  private integrateResults(
    numerology: NumerologyResult,
    tarot: TarotReading,
    astrology: AstrologyResult | undefined,
    environment: EnvironmentData,
    input: IntegratedDivinationInput
  ): IntegratedDivinationResult['integration'] {
    // 共通テーマの抽出
    const commonThemes = this.extractCommonThemes(numerology, tarot, astrology);

    // 矛盾の分析
    const contradictions = this.analyzeContradictions(numerology, tarot, astrology);

    // 環境的影響の分析
    const environmentalInfluence = this.analyzeEnvironmentalInfluence(environment, numerology, tarot);

    // 総合的な指針
    const overallGuidance = this.generateOverallGuidance(numerology, tarot, astrology, environment, input);

    // 具体的なアドバイス
    const specificAdvice = this.generateSpecificAdvice(numerology, tarot, astrology, environment);

    return {
      commonThemes,
      contradictions,
      environmentalInfluence,
      overallGuidance,
      specificAdvice
    };
  }

  /**
   * 共通テーマの抽出
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