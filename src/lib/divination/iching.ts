// 易経（I Ching）占術エンジン
import { IChing64Hexagrams } from './iching-data';
import { IChingHexagram, IChingReading } from '@/types/divination';

export interface IChingInput {
  question: string;
  method?: 'three_coins' | 'yarrow_stalks' | 'modern_random';
  seed?: string;
}

export interface IChingLine {
  value: number; // 6, 7, 8, 9
  type: 'yin' | 'yang';
  changing: boolean;
  meaning: string;
}

export class IChingEngine {
  private hexagrams: typeof IChing64Hexagrams;
  private random: () => number;

  constructor(seed?: string) {
    this.hexagrams = IChing64Hexagrams;
    
    // シード付きランダム関数
    if (seed) {
      let seedValue = this.hashCode(seed);
      this.random = () => {
        seedValue = (seedValue * 9301 + 49297) % 233280;
        return seedValue / 233280;
      };
    } else {
      this.random = Math.random;
    }
  }

  /**
   * 易経占術を実行（質問パラメータベースの決定的計算）
   */
  async performReading(input: IChingInput): Promise<IChingReading> {
    try {
      // 質問から決定的シードを生成
      const questionSeed = this.generateQuestionSeed(input.question);
      
      // 卦の生成（決定的）
      const lines = this.generateDeterministicHexagramLines(questionSeed, input.method || 'three_coins');
      const originalHexagram = this.createHexagram(lines);
      
      // 変爻の特定
      const changingLines = lines
        .map((line, index) => line.changing ? index + 1 : null)
        .filter(index => index !== null) as number[];

      // 変爻がある場合、変卦を生成
      let changedHexagram: IChingHexagram | undefined;
      if (changingLines.length > 0) {
        const changedLines = lines.map(line => ({
          ...line,
          type: line.changing ? (line.type === 'yin' ? 'yang' : 'yin') as 'yin' | 'yang' : line.type,
          changing: false
        }));
        changedHexagram = this.createHexagram(changedLines);
      }

      // 解釈の生成
      const interpretation = this.generateInterpretation(
        originalHexagram,
        changedHexagram,
        changingLines,
        input.question
      );

      return {
        primaryHexagram: originalHexagram,
        changingLines,
        resultHexagram: changedHexagram,
        interpretation: interpretation.overall,
        advice: interpretation.advice
      };
    } catch (error) {
      console.error('易経占術エラー:', error);
      throw new Error('易経占術の実行中にエラーが発生しました');
    }
  }

  /**
   * 質問から決定的シードを生成
   */
  private generateQuestionSeed(question: string): number {
    let seed = 0;
    for (let i = 0; i < question.length; i++) {
      const char = question.charCodeAt(i);
      seed = ((seed << 5) - seed + char) & 0x7fffffff;
    }
    return seed;
  }

  /**
   * 決定的な卦の爻を生成
   */
  private generateDeterministicHexagramLines(seed: number, method: string): IChingLine[] {
    const lines: IChingLine[] = [];
    let currentSeed = seed;

    for (let i = 0; i < 6; i++) {
      let value: number;
      
      // シードベースの疑似ランダム値生成
      currentSeed = (currentSeed * 1103515245 + 12345) & 0x7fffffff;
      const randomValue = currentSeed / 0x7fffffff;
      
      switch (method) {
        case 'three_coins':
          value = this.deterministicThreeCoinsMethod(randomValue);
          break;
        case 'yarrow_stalks':
          value = this.deterministicYarrowStalksMethod(randomValue);
          break;
        default:
          value = this.deterministicModernRandomMethod(randomValue);
      }

      const type: 'yin' | 'yang' = (value === 6 || value === 8) ? 'yin' : 'yang';
      const changing = (value === 6 || value === 9);

      lines.push({
        value,
        type,
        changing,
        meaning: this.getLineMeaning(type, changing, i + 1)
      });
    }

    return lines;
  }

  /**
   * 卦の爻を生成（後方互換性のため）
   */
  private generateHexagramLines(method: string): IChingLine[] {
    const lines: IChingLine[] = [];

    for (let i = 0; i < 6; i++) {
      let value: number;
      
      switch (method) {
        case 'three_coins':
          value = this.threeCoinsMethod();
          break;
        case 'yarrow_stalks':
          value = this.yarrowStalksMethod();
          break;
        default:
          value = this.modernRandomMethod();
      }

      const type: 'yin' | 'yang' = (value === 6 || value === 8) ? 'yin' : 'yang';
      const changing = (value === 6 || value === 9);

      lines.push({
        value,
        type,
        changing,
        meaning: this.getLineMeaning(type, changing, i + 1)
      });
    }

    return lines;
  }

  /**
   * 決定的三枚硬貨法
   */
  private deterministicThreeCoinsMethod(randomValue: number): number {
    let total = 0;
    let seed = Math.floor(randomValue * 1000000);
    
    for (let i = 0; i < 3; i++) {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      const coinValue = (seed / 0x7fffffff) < 0.5 ? 2 : 3; // 表=2, 裏=3
      total += coinValue;
    }
    return total;
  }

  /**
   * 決定的筮竹法
   */
  private deterministicYarrowStalksMethod(randomValue: number): number {
    // 筮竹法の確率を模倣
    if (randomValue < 0.0625) return 6;  // 老陰 (1/16)
    if (randomValue < 0.25) return 8;    // 少陰 (3/16)
    if (randomValue < 0.8125) return 7;  // 少陽 (9/16)
    return 9;                            // 老陽 (3/16)
  }

  /**
   * 決定的現代ランダム法
   */
  private deterministicModernRandomMethod(randomValue: number): number {
    const values = [6, 7, 8, 9];
    return values[Math.floor(randomValue * values.length)];
  }

  /**
   * 三枚硬貨法（後方互換性のため）
   */
  private threeCoinsMethod(): number {
    let total = 0;
    for (let i = 0; i < 3; i++) {
      total += this.random() < 0.5 ? 2 : 3; // 表=2, 裏=3
    }
    return total;
  }

  /**
   * 筮竹法（簡略版）
   */
  private yarrowStalksMethod(): number {
    // 筮竹法の確率を模倣
    const rand = this.random();
    if (rand < 0.0625) return 6;  // 老陰 (1/16)
    if (rand < 0.25) return 8;    // 少陰 (3/16)
    if (rand < 0.8125) return 7;  // 少陽 (9/16)
    return 9;                     // 老陽 (3/16)
  }

  /**
   * 現代的ランダム法
   */
  private modernRandomMethod(): number {
    const values = [6, 7, 8, 9];
    return values[Math.floor(this.random() * values.length)];
  }

  /**
   * 爻の意味を取得
   */
  private getLineMeaning(type: 'yin' | 'yang', changing: boolean, position: number): string {
    const base = type === 'yang' ? '陽爻' : '陰爻';
    const change = changing ? '（変爻）' : '';
    const pos = ['初', '二', '三', '四', '五', '上'][position - 1];
    
    return `${pos}${base}${change}`;
  }

  /**
   * 卦を作成
   */
  private createHexagram(lines: IChingLine[]): IChingHexagram {
    // 卦の番号を計算（下から上へ）
    let hexagramNumber = 0;
    for (let i = 0; i < 6; i++) {
      if (lines[i].type === 'yang') {
        hexagramNumber += Math.pow(2, i);
      }
    }

    // 64卦のマッピング（簡略化）
    const hexagramIndex = this.mapToHexagramIndex(lines);
    const hexagramData = this.hexagrams[hexagramIndex] || this.hexagrams[0];

    return {
      number: hexagramIndex + 1,
      name: hexagramData.name,
      chinese: hexagramData.chineseName,
      trigrams: {
        upper: this.getTrigram(lines.slice(3)),
        lower: this.getTrigram(lines.slice(0, 3))
      },
      keywords: [hexagramData.name, this.getTrigram(lines.slice(3)), this.getTrigram(lines.slice(0, 3))],
      meaning: hexagramData.judgment,
      interpretation: hexagramData.interpretation
    };
  }

  /**
   * 八卦の名前を取得
   */
  private getTrigram(lines: IChingLine[]): string {
    const pattern = lines.map(line => line.type === 'yang' ? 1 : 0).join('');
    const trigramMap: { [key: string]: string } = {
      '111': '乾', '000': '坤', '100': '震', '010': '坎',
      '001': '艮', '101': '巽', '011': '離', '110': '兌'
    };
    return trigramMap[pattern] || '不明';
  }

  /**
   * 64卦のインデックスにマッピング
   */
  private mapToHexagramIndex(lines: IChingLine[]): number {
    // King Wenの配列順序に変換
    const upper = lines.slice(3).map(line => line.type === 'yang' ? 1 : 0);
    const lower = lines.slice(0, 3).map(line => line.type === 'yang' ? 1 : 0);
    
    const upperValue = upper[0] * 4 + upper[1] * 2 + upper[2];
    const lowerValue = lower[0] * 4 + lower[1] * 2 + lower[2];
    
    // 64卦表での位置を計算
    const kingWenOrder = [
      [1, 34, 5, 26, 11, 9, 14, 43],
      [25, 51, 3, 27, 24, 42, 21, 17],
      [6, 40, 29, 4, 7, 59, 64, 47],
      [33, 62, 39, 52, 15, 53, 56, 31],
      [12, 16, 8, 23, 2, 20, 35, 45],
      [44, 32, 48, 18, 46, 57, 50, 28],
      [13, 55, 63, 22, 36, 37, 30, 49],
      [10, 54, 60, 41, 19, 61, 38, 58]
    ];
    
    const hexagramNumber = kingWenOrder[upperValue][lowerValue];
    return hexagramNumber - 1; // 0-based index
  }

  /**
   * 解釈を生成
   */
  private generateInterpretation(
    original: IChingHexagram,
    changed: IChingHexagram | undefined,
    changingLines: number[],
    question: string
  ): { situation: string; advice: string; outcome: string; timing: string; overall: string } {
    const situation = this.generateSituationInterpretation(original, question);
    const advice = this.generateAdviceInterpretation(original, changingLines);
    const outcome = changed ? 
      this.generateOutcomeInterpretation(original, changed) :
      this.generateStaticOutcomeInterpretation(original);
    const timing = this.generateTimingInterpretation(original, changingLines);
    const overall = this.generateOverallInterpretation(original, changed, question);

    return {
      situation,
      advice,
      outcome,
      timing,
      overall
    };
  }

  private generateSituationInterpretation(hexagram: IChingHexagram, question: string): string {
    return `現在の状況は「${hexagram.name}」の卦が示しています。${hexagram.meaning}`;
  }

  private generateAdviceInterpretation(hexagram: IChingHexagram, changingLines: number[]): string {
    if (changingLines.length === 0) {
      return `${hexagram.name}の教えに従い、現状を維持することが重要です。`;
    }
    return `変爻が${changingLines.length}本あります。変化の時期であり、柔軟な対応が求められています。`;
  }

  private generateOutcomeInterpretation(original: IChingHexagram, changed: IChingHexagram): string {
    return `現在の「${original.name}」から「${changed.name}」へと変化していきます。${changed.meaning}`;
  }

  private generateStaticOutcomeInterpretation(hexagram: IChingHexagram): string {
    return `「${hexagram.name}」の状態が安定しており、大きな変化は期待できませんが、現状に満足することができるでしょう。`;
  }

  private generateTimingInterpretation(hexagram: IChingHexagram, changingLines: number[]): string {
    if (changingLines.length === 0) {
      return '変化の時期はまだ来ていません。時を待つことが重要です。';
    }
    if (changingLines.length <= 2) {
      return '変化の時期が近づいています。準備を整えておきましょう。';
    }
    return '大きな変化の真っ只中にあります。即座の行動が必要です。';
  }

  private generateOverallInterpretation(
    original: IChingHexagram, 
    changed: IChingHexagram | undefined, 
    question: string
  ): string {
    let interpretation = `ご質問「${question}」について、易経は「${original.name}」の卦で答えています。`;
    
    if (changed) {
      interpretation += `変化により「${changed.name}」へと移行し、`;
    }
    
    interpretation += `${original.interpretation} この教えを心に留めて行動することで、良い結果を得ることができるでしょう。`;
    
    return interpretation;
  }

  /**
   * 文字列のハッシュコードを生成
   */
  private hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // 32bit整数に変換
    }
    return Math.abs(hash);
  }

  /**
   * キャッシュキーの生成
   */
  generateCacheKey(input: IChingInput): string {
    const questionHash = this.hashCode(input.question).toString(36);
    const seedPart = input.seed ? `:${input.seed}` : '';
    return `iching:${questionHash}:${input.method || 'three_coins'}${seedPart}`;
  }
}

// Export singleton instance
export const iChingEngine = new IChingEngine();