// 四柱推命占術エンジン
import { StemBranchCombinations, YearStemBranch, FortuneCycle } from './shichu-data';
import { ShichuInput, ShichuResult } from '@/types/divination';


export interface StemBranch {
  stem: string; // 天干 (甲乙丙丁戊己庚辛壬癸)
  branch: string; // 地支 (子丑寅卯辰巳午未申酉戌亥)
  element: string; // 五行 (木火土金水)
  yinYang: 'yin' | 'yang';
}

export interface FourPillars {
  year: StemBranch;   // 年柱
  month: StemBranch;  // 月柱
  day: StemBranch;    // 日柱
  hour: StemBranch;   // 時柱
}

export interface TenGods {
  dayMaster: string;      // 日主
  robWealth: string[];    // 比肩・劫財
  foodHurt: string[];     // 食神・傷官
  wealthMoney: string[];  // 正財・偏財
  officialKill: string[]; // 正官・七殺
  sealPrint: string[];    // 正印・偏印
}

export interface LuckPeriods {
  current: {
    pillar: StemBranch;
    startAge: number;
    endAge: number;
    fortune: string;
  };
  next: {
    pillar: StemBranch;
    startAge: number;
    endAge: number;
    fortune: string;
  };
  life: {
    age: number;
    pillar: StemBranch;
    fortune: string;
  }[];
}


export class ShichuSuimeiEngine {
  private stems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  private branches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  private elements = ['木', '火', '土', '金', '水'];
  private yearStemBranchData: typeof YearStemBranch;
  private combinations: typeof StemBranchCombinations;

  constructor() {
    this.yearStemBranchData = YearStemBranch;
    this.combinations = StemBranchCombinations;
  }

  /**
   * 四柱推命占術を実行
   */
  async performReading(input: ShichuInput): Promise<ShichuResult> {
    try {
      // 四柱を計算
      const fourPillars = this.calculateFourPillars(input);
      
      // 日主（日柱の天干）を取得
      const dayMaster = fourPillars.day;
      
      // 十神を分析
      const tenGods = this.analyzeTenGods(fourPillars);
      
      // 大運・流年を計算
      const luckPeriods = this.calculateLuckPeriods(input, fourPillars);
      
      // 解釈を生成
      const interpretation = this.generateInterpretation(
        fourPillars,
        dayMaster,
        tenGods,
        luckPeriods,
        input
      );
      
      // 相性分析（オプション）
      const compatibility = this.analyzeCompatibility(dayMaster);

      return {
        pillars: {
          year: { stem: fourPillars.year.stem, branch: fourPillars.year.branch },
          month: { stem: fourPillars.month.stem, branch: fourPillars.month.branch },
          day: { stem: fourPillars.day.stem, branch: fourPillars.day.branch },
          hour: { stem: fourPillars.hour.stem, branch: fourPillars.hour.branch }
        },
        elements: {
          dominant: dayMaster.element,
          lacking: this.getLackingElement(fourPillars),
          balance: this.getElementBalance(fourPillars)
        },
        analysis: {
          personality: interpretation.personality,
          career: interpretation.career,
          relationships: interpretation.relationships,
          health: interpretation.health,
          overall: interpretation.overall
        },
        compatibility: typeof compatibility === 'string' ? compatibility : compatibility ? `${(compatibility as any).partner} ${(compatibility as any).business}` : undefined
      };
    } catch (error) {
      console.error('四柱推命占術エラー:', error);
      throw new Error('四柱推命占術の実行中にエラーが発生しました');
    }
  }

  /**
   * 四柱（年月日時）を計算
   */
  private calculateFourPillars(input: ShichuInput): FourPillars {
    const date = new Date(input.birthDate + 'T' + input.birthTime);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();

    // 年柱の計算
    const yearPillar = this.getYearPillar(year);
    
    // 月柱の計算
    const monthPillar = this.getMonthPillar(year, month);
    
    // 日柱の計算
    const dayPillar = this.getDayPillar(year, month, day);
    
    // 時柱の計算
    const hourPillar = this.getHourPillar(dayPillar.stem, hour);

    return {
      year: yearPillar,
      month: monthPillar,
      day: dayPillar,
      hour: hourPillar
    };
  }

  /**
   * 年柱を取得
   */
  private getYearPillar(year: number): StemBranch {
    // 1984年（甲子）を基準とする
    const baseYear = 1984;
    const yearDiff = year - baseYear;
    const cyclePosition = ((yearDiff % 60) + 60) % 60;
    
    const stemIndex = cyclePosition % 10;
    const branchIndex = cyclePosition % 12;
    
    return this.createStemBranch(this.stems[stemIndex], this.branches[branchIndex]);
  }

  /**
   * 月柱を取得
   */
  private getMonthPillar(year: number, month: number): StemBranch {
    // 節入りを考慮した月の調整（簡略版）
    const adjustedMonth = month; // 実際は二十四節気を考慮する必要がある
    
    // 年の天干に基づく月干の計算
    const yearStem = this.getYearPillar(year).stem;
    const yearStemIndex = this.stems.indexOf(yearStem);
    
    // 月干の計算（甲己は丙寅より始まる）
    const monthStemBase = [2, 4, 6, 8, 0, 2, 4, 6, 8, 0]; // 甲=0,乙=1...
    const monthStemIndex = (monthStemBase[yearStemIndex] + adjustedMonth - 1) % 10;
    
    // 月支は固定（寅卯辰...）
    const monthBranchIndex = (adjustedMonth + 1) % 12; // 正月=寅=2
    
    return this.createStemBranch(
      this.stems[monthStemIndex],
      this.branches[monthBranchIndex]
    );
  }

  /**
   * 日柱を取得
   */
  private getDayPillar(year: number, month: number, day: number): StemBranch {
    // 1900年1月1日を甲子とする基準日計算
    const baseDate = new Date(1900, 0, 1);
    const targetDate = new Date(year, month - 1, day);
    const daysDiff = Math.floor((targetDate.getTime() - baseDate.getTime()) / (24 * 60 * 60 * 1000));
    
    // 甲子を0として60日周期で計算
    const cyclePosition = ((daysDiff % 60) + 60) % 60;
    const stemIndex = cyclePosition % 10;
    const branchIndex = cyclePosition % 12;
    
    return this.createStemBranch(this.stems[stemIndex], this.branches[branchIndex]);
  }

  /**
   * 時柱を取得
   */
  private getHourPillar(dayStem: string, hour: number): StemBranch {
    // 時支の決定（23-1時=子時、1-3時=丑時...）
    const hourBranchIndex = Math.floor((hour + 1) / 2) % 12;
    
    // 日干に基づく時干の計算
    const dayStemIndex = this.stems.indexOf(dayStem);
    const hourStemBase = [0, 2, 4, 6, 8, 0, 2, 4, 6, 8]; // 甲己日=甲子時より始まる
    const hourStemIndex = (hourStemBase[dayStemIndex] + hourBranchIndex) % 10;
    
    return this.createStemBranch(
      this.stems[hourStemIndex],
      this.branches[hourBranchIndex]
    );
  }

  /**
   * 干支オブジェクトを作成
   */
  private createStemBranch(stem: string, branch: string): StemBranch {
    const stemElement = this.getStemElement(stem);
    const branchElement = this.getBranchElement(branch);
    const stemYinYang = this.getStemYinYang(stem);
    
    return {
      stem,
      branch,
      element: stemElement,
      yinYang: stemYinYang
    };
  }

  /**
   * 天干の五行を取得
   */
  private getStemElement(stem: string): string {
    const elementMap: { [key: string]: string } = {
      '甲': '木', '乙': '木',
      '丙': '火', '丁': '火',
      '戊': '土', '己': '土',
      '庚': '金', '辛': '金',
      '壬': '水', '癸': '水'
    };
    return elementMap[stem] || '不明';
  }

  /**
   * 地支の五行を取得
   */
  private getBranchElement(branch: string): string {
    const elementMap: { [key: string]: string } = {
      '子': '水', '丑': '土', '寅': '木', '卯': '木',
      '辰': '土', '巳': '火', '午': '火', '未': '土',
      '申': '金', '酉': '金', '戌': '土', '亥': '水'
    };
    return elementMap[branch] || '不明';
  }

  /**
   * 天干の陰陽を取得
   */
  private getStemYinYang(stem: string): 'yin' | 'yang' {
    const yangStems = ['甲', '丙', '戊', '庚', '壬'];
    return yangStems.includes(stem) ? 'yang' : 'yin';
  }

  /**
   * 十神を分析
   */
  private analyzeTenGods(fourPillars: FourPillars): TenGods {
    const dayMasterStem = fourPillars.day.stem;
    const dayMasterElement = this.getStemElement(dayMasterStem);
    
    const allStems = [
      fourPillars.year.stem,
      fourPillars.month.stem,
      fourPillars.hour.stem
    ];
    
    const tenGods: TenGods = {
      dayMaster: dayMasterStem,
      robWealth: [],
      foodHurt: [],
      wealthMoney: [],
      officialKill: [],
      sealPrint: []
    };
    
    allStems.forEach(stem => {
      const relationship = this.getTenGodRelationship(dayMasterElement, this.getStemElement(stem));
      switch (relationship) {
        case '比肩':
        case '劫財':
          tenGods.robWealth.push(stem);
          break;
        case '食神':
        case '傷官':
          tenGods.foodHurt.push(stem);
          break;
        case '正財':
        case '偏財':
          tenGods.wealthMoney.push(stem);
          break;
        case '正官':
        case '七殺':
          tenGods.officialKill.push(stem);
          break;
        case '正印':
        case '偏印':
          tenGods.sealPrint.push(stem);
          break;
      }
    });
    
    return tenGods;
  }

  /**
   * 十神の関係を取得
   */
  private getTenGodRelationship(dayMasterElement: string, targetElement: string): string {
    if (dayMasterElement === targetElement) return '比肩';
    
    const relationships: { [key: string]: { [key: string]: string } } = {
      '木': { '火': '食神', '土': '正財', '金': '正官', '水': '正印' },
      '火': { '土': '食神', '金': '正財', '水': '正官', '木': '正印' },
      '土': { '金': '食神', '水': '正財', '木': '正官', '火': '正印' },
      '金': { '水': '食神', '木': '正財', '火': '正官', '土': '正印' },
      '水': { '木': '食神', '火': '正財', '土': '正官', '金': '正印' }
    };
    
    return relationships[dayMasterElement]?.[targetElement] || '不明';
  }

  /**
   * 大運・流年を計算
   */
  private calculateLuckPeriods(input: ShichuInput, fourPillars: FourPillars): LuckPeriods {
    const currentAge = this.calculateAge(input.birthDate);
    const luckStart = input.gender === 'male' ? 8 : 7; // 起運年齢
    
    // 大運の計算（10年周期）
    const currentLuckPeriod = Math.floor((currentAge - luckStart) / 10);
    const monthPillar = fourPillars.month;
    
    // 現在の大運
    const currentLuck = this.getLuckPillar(monthPillar, currentLuckPeriod);
    const nextLuck = this.getLuckPillar(monthPillar, currentLuckPeriod + 1);
    
    // 生涯の大運
    const lifeLuck = [];
    for (let i = 0; i < 8; i++) {
      const age = luckStart + i * 10;
      const pillar = this.getLuckPillar(monthPillar, i);
      lifeLuck.push({
        age,
        pillar,
        fortune: this.analyzeLuckFortune(pillar, fourPillars.day)
      });
    }
    
    return {
      current: {
        pillar: currentLuck,
        startAge: luckStart + currentLuckPeriod * 10,
        endAge: luckStart + (currentLuckPeriod + 1) * 10 - 1,
        fortune: this.analyzeLuckFortune(currentLuck, fourPillars.day)
      },
      next: {
        pillar: nextLuck,
        startAge: luckStart + (currentLuckPeriod + 1) * 10,
        endAge: luckStart + (currentLuckPeriod + 2) * 10 - 1,
        fortune: this.analyzeLuckFortune(nextLuck, fourPillars.day)
      },
      life: lifeLuck
    };
  }

  /**
   * 大運の柱を取得
   */
  private getLuckPillar(monthPillar: StemBranch, periodIndex: number): StemBranch {
    const stemIndex = (this.stems.indexOf(monthPillar.stem) + periodIndex + 1) % 10;
    const branchIndex = (this.branches.indexOf(monthPillar.branch) + periodIndex + 1) % 12;
    
    return this.createStemBranch(this.stems[stemIndex], this.branches[branchIndex]);
  }

  /**
   * 大運の吉凶を分析
   */
  private analyzeLuckFortune(luckPillar: StemBranch, dayPillar: StemBranch): string {
    const relationship = this.getTenGodRelationship(dayPillar.element, luckPillar.element);
    
    const fortuneMap: { [key: string]: string } = {
      '比肩': '平運',
      '劫財': '小凶',
      '食神': '大吉',
      '傷官': '小凶',
      '正財': '大吉',
      '偏財': '中吉',
      '正官': '大吉',
      '七殺': '大凶',
      '正印': '中吉',
      '偏印': '小凶'
    };
    
    return fortuneMap[relationship] || '平運';
  }

  /**
   * 年齢を計算
   */
  private calculateAge(birthDate: string): number {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  }

  /**
   * 解釈を生成
   */
  private generateInterpretation(
    fourPillars: FourPillars,
    dayMaster: StemBranch,
    tenGods: TenGods,
    luckPeriods: LuckPeriods,
    input: ShichuInput
  ): any {
    return {
      personality: this.generatePersonalityInterpretation(dayMaster, tenGods),
      strengths: this.generateStrengths(dayMaster, tenGods),
      weaknesses: this.generateWeaknesses(dayMaster, tenGods),
      career: this.generateCareerInterpretation(dayMaster, tenGods),
      relationships: this.generateRelationshipInterpretation(dayMaster, tenGods),
      health: this.generateHealthInterpretation(dayMaster, fourPillars),
      wealth: this.generateWealthInterpretation(tenGods),
      currentFortune: this.generateCurrentFortuneInterpretation(luckPeriods.current),
      advice: this.generateAdvice(dayMaster, luckPeriods.current),
      overall: this.generateOverallInterpretation(dayMaster, luckPeriods.current, input.name)
    };
  }

  private generatePersonalityInterpretation(dayMaster: StemBranch, tenGods: TenGods): string {
    const elementPersonalities: { [key: string]: string } = {
      '木': '成長意欲が強く、向上心にあふれた性格です。',
      '火': '情熱的で行動力があり、リーダーシップを発揮します。',
      '土': '安定を好み、信頼できる堅実な性格です。',
      '金': '規律正しく、完璧主義的な傾向があります。',
      '水': '知恵があり、柔軟性と適応力に優れています。'
    };
    
    return elementPersonalities[dayMaster.element] || '独特な魅力を持った性格です。';
  }

  private generateStrengths(dayMaster: StemBranch, tenGods: TenGods): string[] {
    const strengths = [`${dayMaster.element}の特性による強み`];
    
    if (tenGods.officialKill.length > 0) strengths.push('責任感が強い');
    if (tenGods.wealthMoney.length > 0) strengths.push('金銭管理能力');
    if (tenGods.foodHurt.length > 0) strengths.push('創造性豊か');
    if (tenGods.sealPrint.length > 0) strengths.push('学習能力が高い');
    
    return strengths;
  }

  private generateWeaknesses(dayMaster: StemBranch, tenGods: TenGods): string[] {
    const weaknesses = [];
    
    if (tenGods.robWealth.length > 2) weaknesses.push('依存傾向');
    if (tenGods.foodHurt.length > 2) weaknesses.push('感情的になりやすい');
    if (tenGods.officialKill.length > 2) weaknesses.push('プレッシャーに弱い');
    
    return weaknesses.length > 0 ? weaknesses : ['特に大きな弱点はありません'];
  }

  private generateCareerInterpretation(dayMaster: StemBranch, tenGods: TenGods): string {
    if (tenGods.officialKill.length > 0) {
      return '管理職や公務員など、責任のある職業に向いています。';
    }
    if (tenGods.wealthMoney.length > 0) {
      return '商業や金融業など、お金に関わる職業で成功できます。';
    }
    if (tenGods.foodHurt.length > 0) {
      return '芸術や創作活動など、クリエイティブな分野で才能を発揮します。';
    }
    return '多方面にわたって活躍できる可能性があります。';
  }

  private generateRelationshipInterpretation(dayMaster: StemBranch, tenGods: TenGods): string {
    return `${dayMaster.element}の性質により、調和を重視した人間関係を築きます。`;
  }

  private generateHealthInterpretation(dayMaster: StemBranch, fourPillars: FourPillars): string {
    const elementHealth: { [key: string]: string } = {
      '木': '肝臓や目の健康に注意が必要です。',
      '火': '心臓や血管系の健康管理を心がけましょう。',
      '土': '胃腸の調子を整えることが重要です。',
      '金': '呼吸器系や皮膚の健康に気をつけてください。',
      '水': '腎臓や泌尿器系の健康管理が大切です。'
    };
    
    return elementHealth[dayMaster.element] || '全般的に健康に気をつけて生活してください。';
  }

  private generateWealthInterpretation(tenGods: TenGods): string {
    if (tenGods.wealthMoney.length > 1) {
      return '金運に恵まれ、財を築く可能性が高いです。';
    }
    if (tenGods.wealthMoney.length === 1) {
      return '堅実に貯蓄を重ねることで安定した財産を築けます。';
    }
    return '金銭よりも精神的な豊かさを重視する傾向があります。';
  }

  private generateCurrentFortuneInterpretation(currentLuck: LuckPeriods['current']): string {
    return `現在は${currentLuck.fortune}の運気です。${currentLuck.pillar.stem}${currentLuck.pillar.branch}の期間で、${currentLuck.startAge}歳から${currentLuck.endAge}歳までの運勢です。`;
  }

  private generateAdvice(dayMaster: StemBranch, currentLuck: LuckPeriods['current']): string {
    return `${dayMaster.element}の特性を活かし、現在の${currentLuck.fortune}の運気を最大限に利用してください。`;
  }

  private generateOverallInterpretation(dayMaster: StemBranch, currentLuck: LuckPeriods['current'], name: string): string {
    return `${name}さんの命式は${dayMaster.stem}${dayMaster.branch}日生まれで、${dayMaster.element}の性質を持っています。現在の運気（${currentLuck.fortune}）を理解して人生を歩んでいくことが重要です。`;
  }

  /**
   * 相性分析
   */
  private analyzeCompatibility(dayMaster: StemBranch): any {
    // 簡略版の相性分析
    return {
      partner: `${dayMaster.element}と相性の良い相手は、相生関係にある五行の人です。`,
      business: '信頼関係を築ける相手との協力が成功の鍵となります。',
      friendship: '価値観を共有できる友人との絆が深まります。'
    };
  }

  /**
   * 不足している五行を取得
   */
  private getLackingElement(fourPillars: FourPillars): string {
    const elementCount = {
      '木': 0, '火': 0, '土': 0, '金': 0, '水': 0
    };
    
    // 四柱の五行をカウント
    [fourPillars.year, fourPillars.month, fourPillars.day, fourPillars.hour].forEach(pillar => {
      elementCount[pillar.element as keyof typeof elementCount]++;
    });
    
    // 最も少ない五行を特定
    let minElement = '土';
    let minCount = 4;
    Object.entries(elementCount).forEach(([element, count]) => {
      if (count < minCount) {
        minCount = count;
        minElement = element;
      }
    });
    
    return minElement;
  }

  /**
   * 五行のバランスを取得
   */
  private getElementBalance(fourPillars: FourPillars): string {
    const elementCount = {
      '木': 0, '火': 0, '土': 0, '金': 0, '水': 0
    };
    
    // 四柱の五行をカウント
    [fourPillars.year, fourPillars.month, fourPillars.day, fourPillars.hour].forEach(pillar => {
      elementCount[pillar.element as keyof typeof elementCount]++;
    });
    
    const counts = Object.values(elementCount);
    const max = Math.max(...counts);
    const min = Math.min(...counts);
    
    if (max - min <= 1) return 'バランス良好';
    if (max >= 3) return '偏りあり';
    return '適度なバランス';
  }

  /**
   * キャッシュキーの生成
   */
  generateCacheKey(input: ShichuInput): string {
    const birthDateTime = input.birthDate + 'T' + input.birthTime;
    return `shichu:${birthDateTime}:${input.gender}:${input.name}`;
  }
}

// シングルトンインスタンス
export const shichuSuimeiEngine = new ShichuSuimeiEngine();