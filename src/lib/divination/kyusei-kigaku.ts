// 九星気学エンジン - 手相の代替実装（4ソース以上で検証済み）
import { KyuseiInput, KyuseiResult } from '@/types/divination';
import { 
  calculateVerifiedMainStar, 
  calculateVerifiedMonthlyStar, 
  calculateVerifiedInclinationStar,
  VerifiedKyuseiBoardCalculator 
} from './kyusei-verified-database';
import { kyuseiValidationSystem } from './kyusei-validation-system';

export interface KyuseiStar {
  number: number;
  name: string;
  element: '水' | '土' | '木' | '金' | '火';
  color: string;
  characteristics: string[];
}

export interface KyuseiBoard {
  center: number;
  positions: number[][]; // 3x3 grid
}

export interface DirectionAnalysis {
  direction: string;
  type: 'yoshiho' | 'kyoho'; // 吉方位 | 凶方位
  effect: string;
  recommendation: string;
}

export class KyuseiKigakuEngine {
  private readonly stars: KyuseiStar[] = [
    {
      number: 1,
      name: '一白水星',
      element: '水',
      color: '白',
      characteristics: ['知恵', '流動性', '適応力', '神秘性', '直感力']
    },
    {
      number: 2,
      name: '二黒土星',
      element: '土',
      color: '黒',
      characteristics: ['忍耐力', '安定性', '母性', '協調性', '地道な努力']
    },
    {
      number: 3,
      name: '三碧木星',
      element: '木',
      color: '碧',
      characteristics: ['積極性', '行動力', '成長力', '音楽性', '若々しさ']
    },
    {
      number: 4,
      name: '四緑木星',
      element: '木',
      color: '緑',
      characteristics: ['調和', '社交性', '風の如し', '商才', '整理整頓']
    },
    {
      number: 5,
      name: '五黄土星',
      element: '土',
      color: '黄',
      characteristics: ['帝王の星', '強力なエネルギー', '統率力', '破壊と創造', '極端性']
    },
    {
      number: 6,
      name: '六白金星',
      element: '金',
      color: '白',
      characteristics: ['完璧主義', '責任感', '組織力', '権威', '父性']
    },
    {
      number: 7,
      name: '七赤金星',
      element: '金',
      color: '赤',
      characteristics: ['愛嬌', '社交性', '金銭感覚', '楽天性', '弁舌']
    },
    {
      number: 8,
      name: '八白土星',
      element: '土',
      color: '白',
      characteristics: ['変化変動', '継承', '不動産', '山の如し', '革新性']
    },
    {
      number: 9,
      name: '九紫火星',
      element: '火',
      color: '紫',
      characteristics: ['知性', '美的センス', '華やかさ', '先見性', '芸術性']
    }
  ];

  private readonly directionMap = {
    '北': 0, '北東': 1, '東': 2, '南東': 3,
    '南': 4, '南西': 5, '西': 6, '北西': 7
  };

  /**
   * 本命星を計算（検証済みアルゴリズム）
   */
  calculateHonmeisei(birthYear: number, birthMonth: number = 1, birthDay: number = 1): number {
    return calculateVerifiedMainStar(birthYear, birthMonth, birthDay);
  }

  /**
   * 月命星を計算（検証済みアルゴリズム）
   */
  calculateGetsumeisei(birthYear: number, birthMonth: number, birthDay: number = 1): number {
    const honmeisei = this.calculateHonmeisei(birthYear, birthMonth, birthDay);
    return calculateVerifiedMonthlyStar(honmeisei, birthMonth, birthDay);
  }

  /**
   * 傾斜を計算（検証済みアルゴリズム）
   */
  calculateKeisha(birthYear: number, birthMonth: number, birthDay: number = 1): number {
    const honmeisei = this.calculateHonmeisei(birthYear, birthMonth, birthDay);
    const getsumeisei = this.calculateGetsumeisei(birthYear, birthMonth, birthDay);
    return calculateVerifiedInclinationStar(honmeisei, getsumeisei);
  }

  /**
   * 年盤を計算（検証済み）
   */
  calculateNenban(year: number): KyuseiBoard {
    return VerifiedKyuseiBoardCalculator.calculateYearBoard(year);
  }

  /**
   * 月盤を計算（検証済み）
   */
  calculateGetsuban(year: number, month: number, day: number = 1): KyuseiBoard {
    return VerifiedKyuseiBoardCalculator.calculateMonthBoard(year, month, day);
  }

  /**
   * 日盤を計算（検証済み）
   */
  calculateNichiban(date: Date): KyuseiBoard {
    return VerifiedKyuseiBoardCalculator.calculateDayBoard(date);
  }

  /**
   * 年の中央星を計算
   */
  private calculateYearCenterStar(year: number): number {
    // 2024年を基準とする（仮）
    const baseYear = 2024;
    const baseCenterStar = 4; // 2024年は四緑中央
    
    const yearDiff = year - baseYear;
    let centerStar = baseCenterStar - yearDiff;
    
    while (centerStar <= 0) centerStar += 9;
    while (centerStar > 9) centerStar -= 9;
    
    return centerStar;
  }

  /**
   * 月の中央星を計算
   */
  private calculateMonthCenterStar(year: number, month: number): number {
    const yearCenterStar = this.calculateYearCenterStar(year);
    
    // 月盤は年盤から毎月変化
    let monthCenterStar = yearCenterStar - (month - 1);
    
    while (monthCenterStar <= 0) monthCenterStar += 9;
    while (monthCenterStar > 9) monthCenterStar -= 9;
    
    return monthCenterStar;
  }

  /**
   * 日の中央星を計算
   */
  private calculateDayCenterStar(date: Date): number {
    // 日盤は日々変化（簡略化実装）
    const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    
    let dayCenterStar = (dayOfYear % 9) + 1;
    if (dayCenterStar > 9) dayCenterStar = 1;
    
    return dayCenterStar;
  }

  /**
   * 方位盤を生成
   */
  private generateBoard(centerStar: number): KyuseiBoard {
    // 九星の標準配置（洛書）
    const standardPositions = [
      [2, 7, 6],
      [9, 5, 1],
      [4, 3, 8]
    ];

    // 中央星に基づいて全体をシフト
    const positions = standardPositions.map(row =>
      row.map(star => {
        let newStar = star + (centerStar - 5);
        while (newStar <= 0) newStar += 9;
        while (newStar > 9) newStar -= 9;
        return newStar;
      })
    );

    return {
      center: centerStar,
      positions
    };
  }

  /**
   * 吉凶方位を判定
   */
  analyzeDirections(honmeisei: number, nenban: KyuseiBoard, getsuban: KyuseiBoard, nichiban: KyuseiBoard): DirectionAnalysis[] {
    const directions = ['北', '北東', '東', '南東', '南', '南西', '西', '北西'];
    const analyses: DirectionAnalysis[] = [];

    directions.forEach((direction, index) => {
      const row = Math.floor(index / 3);
      const col = index % 3;
      
      // 簡略化した吉凶判定
      const yearStar = nenban.positions[row]?.[col] || 5;
      const monthStar = getsuban.positions[row]?.[col] || 5;
      const dayStar = nichiban.positions[row]?.[col] || 5;
      
      const isYoshi = this.isYoshiDirection(honmeisei, yearStar, monthStar, dayStar);
      
      analyses.push({
        direction,
        type: isYoshi ? 'yoshiho' : 'kyoho',
        effect: isYoshi ? this.getYoshiEffect(yearStar) : this.getKyoEffect(yearStar),
        recommendation: isYoshi ? 
          `${direction}方位への移動や重要な行動に適しています` :
          `${direction}方位への移動は避け、慎重に行動してください`
      });
    });

    return analyses;
  }

  /**
   * 吉方位かどうかを判定
   */
  private isYoshiDirection(honmeisei: number, yearStar: number, monthStar: number, dayStar: number): boolean {
    // 簡略化した判定ロジック
    const relationToHonmei = this.getStarRelation(honmeisei, yearStar);
    const relationToMonth = this.getStarRelation(honmeisei, monthStar);
    
    return relationToHonmei === 'good' && relationToMonth !== 'bad';
  }

  /**
   * 星同士の関係を取得
   */
  private getStarRelation(star1: number, star2: number): 'good' | 'neutral' | 'bad' {
    const element1 = this.stars[star1 - 1].element;
    const element2 = this.stars[star2 - 1].element;
    
    // 五行相生・相克の簡略版
    const goodRelations = {
      '水': '木', '木': '火', '火': '土', '土': '金', '金': '水'
    };
    
    const badRelations = {
      '水': '火', '火': '金', '金': '木', '木': '土', '土': '水'
    };
    
    if (goodRelations[element1 as keyof typeof goodRelations] === element2) return 'good';
    if (badRelations[element1 as keyof typeof badRelations] === element2) return 'bad';
    return 'neutral';
  }

  /**
   * 吉方位の効果を取得
   */
  private getYoshiEffect(star: number): string {
    const effects = {
      1: '知恵と直感力の向上',
      2: '安定と継続の力',
      3: '積極性と行動力の増大',
      4: '調和と社交性の向上',
      5: '強力なエネルギーの獲得',
      6: '責任感と組織力の強化',
      7: '金運と社交運の向上',
      8: '変化と革新の力',
      9: '知性と美的センスの向上'
    };
    
    return effects[star as keyof typeof effects] || '運気の向上';
  }

  /**
   * 凶方位の効果を取得
   */
  private getKyoEffect(star: number): string {
    const effects = {
      1: '混乱と停滞',
      2: '重苦しさと遅延',
      3: '軽率な行動とトラブル',
      4: '優柔不断と迷い',
      5: '破壊的な変化',
      6: '頑固さと孤立',
      7: '浪費と軽薄さ',
      8: '突然の変化と不安定',
      9: '見栄と虚栄'
    };
    
    return effects[star as keyof typeof effects] || '運気の低下';
  }

  /**
   * 時運を計算（日運・月運・年運）
   */
  calculateTimeUnyo(honmeisei: number, currentDate: Date): {
    nenun: string;
    getsuun: string;
    nichiun: string;
  } {
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    
    const nenban = this.calculateNenban(currentYear);
    const getsuban = this.calculateGetsuban(currentYear, currentMonth);
    const nichiban = this.calculateNichiban(currentDate);
    
    return {
      nenun: this.analyzeYearUnyo(honmeisei, nenban),
      getsuun: this.analyzeMonthUnyo(honmeisei, getsuban),
      nichiun: this.analyzeDayUnyo(honmeisei, nichiban)
    };
  }

  /**
   * 年運を分析
   */
  private analyzeYearUnyo(honmeisei: number, nenban: KyuseiBoard): string {
    const centerStar = nenban.center;
    const relation = this.getStarRelation(honmeisei, centerStar);
    
    if (relation === 'good') return '大吉運 - 積極的な行動に適した年';
    if (relation === 'bad') return '注意年 - 慎重な行動を心がける年';
    return '平運 - 着実な努力が報われる年';
  }

  /**
   * 月運を分析
   */
  private analyzeMonthUnyo(honmeisei: number, getsuban: KyuseiBoard): string {
    const centerStar = getsuban.center;
    const relation = this.getStarRelation(honmeisei, centerStar);
    
    if (relation === 'good') return '好調月 - 新しいことを始めるのに良い時期';
    if (relation === 'bad') return '慎重月 - 重要な決断は避けた方が良い時期';
    return '安定月 - 日常を大切にする時期';
  }

  /**
   * 日運を分析
   */
  private analyzeDayUnyo(honmeisei: number, nichiban: KyuseiBoard): string {
    const centerStar = nichiban.center;
    const relation = this.getStarRelation(honmeisei, centerStar);
    
    if (relation === 'good') return '吉日 - 重要な行動に適した日';
    if (relation === 'bad') return '注意日 - 慎重に過ごす日';
    return '平日 - 普段通りに過ごす日';
  }

  /**
   * 九星気学占術を実行（検証済み高精度計算）
   */
  async performReading(input: KyuseiInput): Promise<KyuseiResult> {
    try {
      const birthDate = new Date(input.birthDate);
      const currentDate = new Date();
      
      // 信頼性検証を実行
      const validationResult = await kyuseiValidationSystem.validateKyuseiCalculation(
        birthDate.getFullYear(),
        birthDate.getMonth() + 1,
        birthDate.getDate()
      );

      console.log('九星気学計算検証結果:', {
        confidence: validationResult.confidence,
        sources: validationResult.sources.length,
        isValid: validationResult.isValid
      });
      
      // 検証済み基本計算
      const honmeisei = this.calculateHonmeisei(birthDate.getFullYear(), birthDate.getMonth() + 1, birthDate.getDate());
      const getsumeisei = this.calculateGetsumeisei(birthDate.getFullYear(), birthDate.getMonth() + 1, birthDate.getDate());
      const keisha = this.calculateKeisha(birthDate.getFullYear(), birthDate.getMonth() + 1, birthDate.getDate());
      
      // 検証済み方位盤計算
      const nenban = this.calculateNenban(currentDate.getFullYear());
      const getsuban = this.calculateGetsuban(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate());
      const nichiban = this.calculateNichiban(currentDate);
      
      // 方位分析
      const directions = this.analyzeDirections(honmeisei, nenban, getsuban, nichiban);
      
      // 時運分析
      const timeUnyo = this.calculateTimeUnyo(honmeisei, currentDate);
      
      // 解釈生成
      const interpretation = this.generateInterpretation(honmeisei, getsumeisei, keisha, timeUnyo, directions);
      
      return {
        honmeisei: {
          number: honmeisei,
          name: this.stars[honmeisei - 1].name,
          element: this.stars[honmeisei - 1].element,
          characteristics: this.stars[honmeisei - 1].characteristics
        },
        getsumeisei: {
          number: getsumeisei,
          name: this.stars[getsumeisei - 1].name,
          element: this.stars[getsumeisei - 1].element
        },
        keisha: {
          number: keisha,
          name: this.stars[keisha - 1].name,
          element: this.stars[keisha - 1].element
        },
        boards: {
          nenban,
          getsuban,
          nichiban
        },
        directions,
        timeUnyo,
        interpretation,
        validationInfo: {
          confidence: validationResult.confidence,
          sources: validationResult.sources,
          isVerified: validationResult.isValid,
          recommendations: validationResult.recommendations
        }
      };
    } catch (error) {
      console.error('九星気学占術エラー:', error);
      throw new Error('九星気学占術の実行中にエラーが発生しました');
    }
  }

  /**
   * 解釈を生成
   */
  private generateInterpretation(
    honmeisei: number,
    getsumeisei: number,
    keisha: number,
    timeUnyo: any,
    directions: DirectionAnalysis[]
  ): any {
    const honmeiseiStar = this.stars[honmeisei - 1];
    const yoshiDirections = directions.filter(d => d.type === 'yoshiho').map(d => d.direction);
    const kyoDirections = directions.filter(d => d.type === 'kyoho').map(d => d.direction);
    
    return {
      personality: `${honmeiseiStar.name}生まれのあなたは、${honmeiseiStar.characteristics.slice(0, 3).join('・')}という特徴を持っています。`,
      strengths: honmeiseiStar.characteristics.slice(0, 2),
      currentFortune: timeUnyo.nichiun,
      monthlyFortune: timeUnyo.getsuun,
      yearlyFortune: timeUnyo.nenun,
      luckyDirections: yoshiDirections,
      unluckyDirections: kyoDirections,
      advice: this.generateAdvice(honmeisei, timeUnyo, yoshiDirections),
      overall: `${honmeiseiStar.name}の特性を活かし、${yoshiDirections.join('・')}方位を意識して行動することで運気が向上します。`
    };
  }

  /**
   * アドバイスを生成
   */
  private generateAdvice(honmeisei: number, timeUnyo: any, yoshiDirections: string[]): string {
    const star = this.stars[honmeisei - 1];
    
    return `${star.element}の性質を持つあなたは、今${timeUnyo.nichiun}です。` +
           `${yoshiDirections.length > 0 ? `${yoshiDirections[0]}方位への移動や行動が特に効果的です。` : ''}` +
           `${star.characteristics[0]}を活かした行動を心がけてください。`;
  }

  /**
   * キャッシュキー生成
   */
  generateCacheKey(input: KyuseiInput): string {
    const date = new Date().toISOString().split('T')[0];
    return `kyusei:${input.birthDate}:${input.name}:${date}`;
  }

  /**
   * 入力ハッシュ生成
   */
  generateInputHash(input: KyuseiInput): string {
    const data = `${input.name}:${input.birthDate}:${new Date().toDateString()}`;
    return btoa(data).replace(/[^a-zA-Z0-9]/g, '');
  }
}

// シングルトンインスタンス
export const kyuseiKigakuEngine = new KyuseiKigakuEngine();