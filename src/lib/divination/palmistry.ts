// 手相占術エンジン
import { PalmLines, Mounts, FingerCharacteristics } from './palmistry-data';

export interface PalmistryInput {
  hand: 'left' | 'right' | 'both';
  gender: 'male' | 'female';
  age: number;
  specificQuestions?: string[];
  photos?: {
    leftHand?: string; // Base64 画像データまたはURL
    rightHand?: string;
  };
}

export interface PalmLine {
  name: string;
  quality: 'clear' | 'faint' | 'broken' | 'chained' | 'deep';
  length: 'short' | 'medium' | 'long';
  position: string;
  branches: number;
  islands: number;
  crosses: number;
  meaning: string;
  lifespan?: {
    start: number;
    end: number;
    quality: string;
  };
}

export interface Mount {
  name: string;
  development: 'flat' | 'normal' | 'prominent' | 'very_prominent';
  characteristics: string[];
  meaning: string;
  influence: string;
}

export interface FingerAnalysis {
  finger: 'thumb' | 'index' | 'middle' | 'ring' | 'little';
  length: 'short' | 'normal' | 'long';
  shape: 'pointed' | 'square' | 'spatulate' | 'conic';
  flexibility: 'stiff' | 'normal' | 'flexible';
  nails: {
    shape: string;
    health: string;
  };
  meaning: string;
}

export interface HandShape {
  type: 'earth' | 'air' | 'water' | 'fire';
  characteristics: string[];
  personality: string;
  strengths: string[];
  weaknesses: string[];
}

export interface PalmistryResult {
  leftHand?: {
    lines: PalmLine[];
    mounts: Mount[];
    fingers: FingerAnalysis[];
    handShape: HandShape;
    interpretation: string;
  };
  rightHand?: {
    lines: PalmLine[];
    mounts: Mount[];
    fingers: FingerAnalysis[];
    handShape: HandShape;
    interpretation: string;
  };
  combined: {
    personality: string;
    careerFortune: string;
    loveLife: string;
    healthWarnings: string[];
    lifePath: string;
    strengths: string[];
    challenges: string[];
    luckyPeriods: string[];
    advice: string;
    overall: string;
  };
  timeline: {
    age: number;
    event: string;
    type: 'health' | 'career' | 'love' | 'wealth' | 'travel' | 'family';
  }[];
}

export class PalmistryEngine {
  private palmLinesData: typeof PalmLines;
  private mountsData: typeof Mounts;
  private fingerData: typeof FingerCharacteristics;

  constructor() {
    this.palmLinesData = PalmLines;
    this.mountsData = Mounts;
    this.fingerData = FingerCharacteristics;
  }

  /**
   * 手相占術を実行
   */
  async performReading(input: PalmistryInput): Promise<PalmistryResult> {
    try {
      const result: PalmistryResult = {
        combined: {
          personality: '',
          careerFortune: '',
          loveLife: '',
          healthWarnings: [],
          lifePath: '',
          strengths: [],
          challenges: [],
          luckyPeriods: [],
          advice: '',
          overall: ''
        },
        timeline: []
      };

      // 左手の分析（潜在能力・運命）
      if (input.hand === 'left' || input.hand === 'both') {
        result.leftHand = this.analyzeHand('left', input);
      }

      // 右手の分析（現実・努力の結果）
      if (input.hand === 'right' || input.hand === 'both') {
        result.rightHand = this.analyzeHand('right', input);
      }

      // 総合分析
      result.combined = this.generateCombinedAnalysis(result, input);
      
      // 人生のタイムライン作成
      result.timeline = this.generateTimeline(result, input);

      return result;
    } catch (error) {
      console.error('手相占術エラー:', error);
      throw new Error('手相占術の実行中にエラーが発生しました');
    }
  }

  /**
   * 手の分析
   */
  private analyzeHand(hand: 'left' | 'right', input: PalmistryInput) {
    // 実際の実装では画像解析を行いますが、ここでは模擬データを生成
    const lines = this.generatePalmLines();
    const mounts = this.generateMounts();
    const fingers = this.generateFingerAnalysis();
    const handShape = this.determineHandShape();
    const interpretation = this.generateHandInterpretation(hand, lines, mounts, fingers, handShape);

    return {
      lines,
      mounts,
      fingers,
      handShape,
      interpretation
    };
  }

  /**
   * 手相線の生成（模擬データ）
   */
  private generatePalmLines(): PalmLine[] {
    return this.palmLinesData.map(lineData => ({
      name: lineData.name,
      quality: this.randomChoice(['clear', 'faint', 'broken', 'chained', 'deep']) as PalmLine['quality'],
      length: this.randomChoice(['short', 'medium', 'long']) as PalmLine['length'],
      position: lineData.position,
      branches: Math.floor(Math.random() * 3),
      islands: Math.floor(Math.random() * 2),
      crosses: Math.floor(Math.random() * 2),
      meaning: lineData.meaning,
      lifespan: lineData.name === '生命線' ? {
        start: 0,
        end: 70 + Math.floor(Math.random() * 20),
        quality: '良好'
      } : undefined
    }));
  }

  /**
   * 手の丘の生成（模擬データ）
   */
  private generateMounts(): Mount[] {
    return this.mountsData.map(mountData => ({
      name: mountData.name,
      development: this.randomChoice(['flat', 'normal', 'prominent', 'very_prominent']) as Mount['development'],
      characteristics: mountData.characteristics,
      meaning: mountData.meaning,
      influence: mountData.influence
    }));
  }

  /**
   * 指の分析（模擬データ）
   */
  private generateFingerAnalysis(): FingerAnalysis[] {
    const fingers: FingerAnalysis['finger'][] = ['thumb', 'index', 'middle', 'ring', 'little'];
    
    return fingers.map(finger => {
      const fingerData = this.fingerData[finger];
      return {
        finger,
        length: this.randomChoice(['short', 'normal', 'long']) as FingerAnalysis['length'],
        shape: this.randomChoice(['pointed', 'square', 'spatulate', 'conic']) as FingerAnalysis['shape'],
        flexibility: this.randomChoice(['stiff', 'normal', 'flexible']) as FingerAnalysis['flexibility'],
        nails: {
          shape: '楕円形',
          health: '健康'
        },
        meaning: fingerData.meaning
      };
    });
  }

  /**
   * 手の形を判定
   */
  private determineHandShape(): HandShape {
    const shapes = ['earth', 'air', 'water', 'fire'] as const;
    const shapeType = this.randomChoice(shapes);
    
    const shapeCharacteristics = {
      earth: {
        characteristics: ['四角い手のひら', '短い指', '厚い手'],
        personality: '実用的で現実的な性格。安定を重視し、地に足のついた考え方をします。',
        strengths: ['実行力', '忍耐力', '信頼性', '実用性'],
        weaknesses: ['頑固さ', '変化への抵抗', '創造性の不足']
      },
      air: {
        characteristics: ['四角い手のひら', '長い指', '薄い手'],
        personality: '知的で論理的な性格。コミュニケーション能力に優れ、新しいアイデアを生み出します。',
        strengths: ['知性', 'コミュニケーション', '分析力', '適応性'],
        weaknesses: ['優柔不断', '感情の冷たさ', '非現実的']
      },
      water: {
        characteristics: ['長い手のひら', '長い指', '柔らかい手'],
        personality: '感情豊かで直感的な性格。芸術的才能があり、他人の気持ちを理解する能力に長けています。',
        strengths: ['直感力', '共感性', '創造性', '芸術的才能'],
        weaknesses: ['感情的不安定', '現実逃避', '決断力不足']
      },
      fire: {
        characteristics: ['長い手のひら', '短い指', '温かい手'],
        personality: '情熱的で積極的な性格。リーダーシップがあり、新しいことに挑戦する勇気を持っています。',
        strengths: ['情熱', 'リーダーシップ', '行動力', '楽観性'],
        weaknesses: ['衝動性', '短気', '計画性の不足']
      }
    };

    return {
      type: shapeType,
      ...shapeCharacteristics[shapeType]
    };
  }

  /**
   * 手の解釈を生成
   */
  private generateHandInterpretation(
    hand: 'left' | 'right',
    lines: PalmLine[],
    mounts: Mount[],
    fingers: FingerAnalysis[],
    handShape: HandShape
  ): string {
    const handMeaning = hand === 'left' ? '潜在能力と生まれ持った運命' : '現実の努力と獲得した能力';
    
    let interpretation = `${hand === 'left' ? '左手' : '右手'}は${handMeaning}を表しています。`;
    interpretation += `手の形は${handShape.type}タイプで、${handShape.personality}`;
    
    // 主要な線の分析
    const lifeLine = lines.find(l => l.name === '生命線');
    const headLine = lines.find(l => l.name === '頭脳線');
    const heartLine = lines.find(l => l.name === '感情線');
    
    if (lifeLine) {
      interpretation += `生命線は${lifeLine.quality}で${lifeLine.length}く、健康運と生命力を示しています。`;
    }
    
    if (headLine) {
      interpretation += `頭脳線の状態から、思考パターンと知性の特徴が読み取れます。`;
    }
    
    if (heartLine) {
      interpretation += `感情線は恋愛運と感情表現の傾向を表しています。`;
    }
    
    return interpretation;
  }

  /**
   * 総合分析を生成
   */
  private generateCombinedAnalysis(result: PalmistryResult, input: PalmistryInput): PalmistryResult['combined'] {
    return {
      personality: this.generatePersonalityAnalysis(result),
      careerFortune: this.generateCareerFortune(result),
      loveLife: this.generateLoveLifeAnalysis(result),
      healthWarnings: this.generateHealthWarnings(result),
      lifePath: this.generateLifePath(result),
      strengths: this.generateStrengths(result),
      challenges: this.generateChallenges(result),
      luckyPeriods: this.generateLuckyPeriods(input.age),
      advice: this.generateAdvice(result, input),
      overall: this.generateOverallAnalysis(result, input)
    };
  }

  private generatePersonalityAnalysis(result: PalmistryResult): string {
    const leftPersonality = result.leftHand?.handShape.personality || '';
    const rightPersonality = result.rightHand?.handShape.personality || '';
    
    if (leftPersonality && rightPersonality) {
      return `生まれ持った性格（${leftPersonality}）と現在の性格（${rightPersonality}）が融合し、バランスの取れた人格を形成しています。`;
    }
    
    return leftPersonality || rightPersonality || '安定した性格の持ち主です。';
  }

  private generateCareerFortune(result: PalmistryResult): string {
    // 運命線、太陽線、水星線などから判断
    return '仕事運は良好で、努力が実を結ぶ時期が訪れます。特に中年期以降に大きな成功を収める可能性があります。';
  }

  private generateLoveLifeAnalysis(result: PalmistryResult): string {
    // 感情線、結婚線、金星丘などから判断
    return '恋愛運は波があるものの、深い愛情に恵まれます。理解し合えるパートナーとの出会いが期待できます。';
  }

  private generateHealthWarnings(result: PalmistryResult): string[] {
    // 生命線、健康線、各丘の状態から判断
    return [
      '30代後半で体調管理に注意が必要',
      '消化器系の健康に気をつけてください',
      '定期的な運動で健康を維持しましょう'
    ];
  }

  private generateLifePath(result: PalmistryResult): string {
    return '人生の道筋は安定しており、段階的な成長を遂げていきます。困難があっても乗り越える力を持っています。';
  }

  private generateStrengths(result: PalmistryResult): string[] {
    const leftStrengths = result.leftHand?.handShape.strengths || [];
    const rightStrengths = result.rightHand?.handShape.strengths || [];
    
    return [...new Set([...leftStrengths, ...rightStrengths])];
  }

  private generateChallenges(result: PalmistryResult): string[] {
    const leftWeaknesses = result.leftHand?.handShape.weaknesses || [];
    const rightWeaknesses = result.rightHand?.handShape.weaknesses || [];
    
    return [...new Set([...leftWeaknesses, ...rightWeaknesses])];
  }

  private generateLuckyPeriods(currentAge: number): string[] {
    const periods = [];
    
    if (currentAge < 30) periods.push('20代後半から30代前半');
    if (currentAge < 40) periods.push('30代後半');
    if (currentAge < 50) periods.push('40代中頃');
    if (currentAge < 60) periods.push('50代');
    
    periods.push('人生後半期の充実');
    
    return periods;
  }

  private generateAdvice(result: PalmistryResult, input: PalmistryInput): string {
    return '手相に表れた特徴を活かし、自分らしい人生を歩んでください。困難な時期も乗り越える力が備わっています。';
  }

  private generateOverallAnalysis(result: PalmistryResult, input: PalmistryInput): string {
    return `${input.gender === 'male' ? '男性' : '女性'}として生まれ、${input.age}歳の現在、手相には豊かな可能性が示されています。両手のバランスから、運命と努力が調和した人生を歩んでいることがわかります。`;
  }

  /**
   * 人生のタイムラインを生成
   */
  private generateTimeline(result: PalmistryResult, input: PalmistryInput): PalmistryResult['timeline'] {
    const events = [];
    const currentAge = input.age;
    
    // 過去の重要なイベント（推測）
    if (currentAge > 20) events.push({ age: 18, event: '人生の転換期、新しい環境への適応', type: 'career' as const });
    if (currentAge > 25) events.push({ age: 25, event: '重要な人との出会いまたは恋愛の発展', type: 'love' as const });
    if (currentAge > 30) events.push({ age: 30, event: 'キャリアの基盤確立', type: 'career' as const });
    
    // 未来のイベント（予測）
    if (currentAge < 35) events.push({ age: 35, event: '経済的安定の確立', type: 'wealth' as const });
    if (currentAge < 40) events.push({ age: 40, event: '人生の充実期、重要な成果', type: 'career' as const });
    if (currentAge < 45) events.push({ age: 45, event: '健康管理への意識の変化', type: 'health' as const });
    if (currentAge < 50) events.push({ age: 50, event: '人生観の深化、精神的成長', type: 'family' as const });
    
    return events.sort((a, b) => a.age - b.age);
  }

  /**
   * ランダム選択ヘルパー
   */
  private randomChoice<T>(choices: T[]): T {
    return choices[Math.floor(Math.random() * choices.length)];
  }

  /**
   * キャッシュキーの生成
   */
  generateCacheKey(input: PalmistryInput): string {
    const baseKey = `palmistry:${input.hand}:${input.gender}:${input.age}`;
    const questionsKey = input.specificQuestions ? 
      `:${input.specificQuestions.join(',').replace(/\s+/g, '')}` : '';
    return baseKey + questionsKey;
  }
}

// シングルトンインスタンス
export const palmistryEngine = new PalmistryEngine();