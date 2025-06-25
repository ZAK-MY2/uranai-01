/**
 * 占術エンジンの基底クラス
 * すべての占術エンジンはこのクラスを継承する
 */

export interface DivinationInput {
  fullName: string;
  birthDate: Date;
  birthTime?: string;
  birthPlace: string;
  currentLocation?: {
    latitude: number;
    longitude: number;
  };
  question?: string;
  questionCategory?: string;
}

export interface EnvironmentData {
  lunar: {
    phase: number;
    phaseName: string;
    illumination: number;
    moonSign?: string;
    isVoidOfCourse?: boolean;
    eclipseNearby?: boolean;
  };
  weather?: {
    condition: string;
    temperature: number;
    humidity: number;
    pressure?: number;
    windSpeed?: number;
    windDirection?: string;
    cloudCover?: number;
  };
  planetary?: {
    sunSign: string;
    moonSign: string;
    risingSign: string;
    retrogradeПlanets: string[];
    dayRuler: string;
    hourRuler: string;
    planetaryHour: number;
  };
  astronomical?: {
    planetaryHours: Array<{
      planet: string;
      startTime: string;
      endTime: string;
    }>;
  };
  timestamp?: Date;
}

export abstract class BaseDivinationEngine<TResult> {
  protected input: DivinationInput;
  protected environment?: EnvironmentData;

  constructor(input: DivinationInput, environment?: EnvironmentData) {
    this.input = input;
    this.environment = environment;
  }

  /**
   * 占術計算のメインメソッド
   * 各占術エンジンで実装する
   */
  abstract calculate(): TResult;

  /**
   * 環境データによる補正
   * デフォルトは1.0（補正なし）
   */
  protected getEnvironmentalModifier(): number {
    if (!this.environment) return 1.0;

    let modifier = 1.0;

    // 月相による影響（新月・満月で強まる）
    const moonPhase = this.environment.lunar.phase;
    if (moonPhase < 0.1 || moonPhase > 0.9) {
      modifier *= 1.15; // 新月
    } else if (Math.abs(moonPhase - 0.5) < 0.1) {
      modifier *= 1.10; // 満月
    }

    // 天候による影響（晴れで良好）
    if (this.environment.weather?.condition === '晴れ') {
      modifier *= 1.05;
    } else if (this.environment.weather?.condition === '雨') {
      modifier *= 0.95;
    }

    return modifier;
  }

  /**
   * 誕生日から基本的な数値を計算
   */
  protected getBirthNumber(): number {
    const date = this.input.birthDate;
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    // 生年月日の各桁を足す
    let sum = this.sumDigits(year) + this.sumDigits(month) + this.sumDigits(day);
    
    // 1桁になるまで繰り返す（マスターナンバー11, 22, 33は除く）
    while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
      sum = this.sumDigits(sum);
    }
    
    return sum;
  }

  /**
   * 名前から基本的な数値を計算
   */
  protected getNameNumber(): number {
    const name = this.input.fullName.replace(/[^ぁ-んァ-ンー一-龯a-zA-Z]/g, '');
    let sum = 0;
    
    for (let i = 0; i < name.length; i++) {
      sum += name.charCodeAt(i) % 9 + 1;
    }
    
    while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
      sum = this.sumDigits(sum);
    }
    
    return sum;
  }

  /**
   * 数値の各桁を足す
   */
  protected sumDigits(num: number): number {
    return num.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
  }

  /**
   * 質問カテゴリに応じたメッセージ生成
   */
  protected generatePersonalizedMessage(baseMessage: string): string {
    if (!this.input.question) return baseMessage;

    const category = this.input.questionCategory || '総合運';
    const categoryMessages: Record<string, string> = {
      '恋愛・結婚': '愛と調和のエネルギーが',
      '仕事・転職': 'キャリアと成長の可能性が',
      '金運・財運': '豊かさと繁栄のエネルギーが',
      '健康': '生命力と活力が',
      '人間関係': '人との繋がりと共感力が',
      '総合運': 'あなたの全体的な運気が'
    };

    const prefix = categoryMessages[category] || categoryMessages['総合運'];
    return `${prefix}高まっています。${baseMessage}`;
  }

  /**
   * 現在時刻による運勢変動
   */
  protected getTimeModifier(): number {
    const hour = new Date().getHours();
    
    // 朝（5-8時）: 1.1倍
    if (hour >= 5 && hour < 8) return 1.1;
    // 昼（11-14時）: 1.05倍
    if (hour >= 11 && hour < 14) return 1.05;
    // 夕方（17-19時）: 1.08倍
    if (hour >= 17 && hour < 19) return 1.08;
    // 深夜（23-2時）: 0.95倍
    if (hour >= 23 || hour < 2) return 0.95;
    
    return 1.0;
  }
}