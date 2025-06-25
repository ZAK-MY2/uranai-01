import { BaseDivinationEngine, DivinationInput, EnvironmentData } from '../base-engine';

// 十干（天干）
const HEAVENLY_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const STEM_ELEMENTS = ['木', '木', '火', '火', '土', '土', '金', '金', '水', '水'];
const STEM_YIN_YANG = ['陽', '陰', '陽', '陰', '陽', '陰', '陽', '陰', '陽', '陰'];

// 十二支（地支）
const EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const BRANCH_ELEMENTS = ['水', '土', '木', '木', '土', '火', '火', '土', '金', '金', '土', '水'];
const BRANCH_YIN_YANG = ['陽', '陰', '陽', '陰', '陽', '陰', '陽', '陰', '陽', '陰', '陽', '陰'];

// 五行の相生相剋関係
const ELEMENT_RELATIONS = {
  相生: {
    '木': '火',
    '火': '土',
    '土': '金',
    '金': '水',
    '水': '木'
  },
  相剋: {
    '木': '土',
    '火': '金',
    '土': '水',
    '金': '木',
    '水': '火'
  }
};

export interface Pillar {
  stem: string;      // 天干
  branch: string;    // 地支
  element: string;   // 五行
  yinYang: string;   // 陰陽
}

export interface ShichuSuimeiReading {
  fourPillars: {
    year: Pillar;    // 年柱
    month: Pillar;   // 月柱
    day: Pillar;     // 日柱
    hour: Pillar;    // 時柱
  };
  elements: {
    wood: number;
    fire: number;
    earth: number;
    metal: number;
    water: number;
  };
  dayMaster: {
    element: string;
    strength: string; // 強い、普通、弱い
    favorable: string[]; // 喜神
    unfavorable: string[]; // 忌神
  };
  interpretation: {
    personality: string;
    career: string;
    relationships: string;
    health: string;
    wealth: string;
    overall: string;
  };
  tenYearLuck?: {
    current: string;
    period: string;
    influence: string;
  };
  yearlyFortune?: string;
  environmentalBalance?: string;
}

export class ShichuSuimeiEngine extends BaseDivinationEngine<ShichuSuimeiReading> {
  calculate(): ShichuSuimeiReading {
    const fourPillars = this.calculateFourPillars();
    const elements = this.calculateElementBalance(fourPillars);
    const dayMaster = this.analyzeDayMaster(fourPillars, elements);
    const interpretation = this.generateInterpretation(fourPillars, elements, dayMaster);
    
    const tenYearLuck = this.calculateTenYearLuck(fourPillars);
    const yearlyFortune = this.calculateYearlyFortune(fourPillars);
    const environmentalBalance = this.getEnvironmentalBalance(elements);

    return {
      fourPillars,
      elements,
      dayMaster,
      interpretation,
      tenYearLuck,
      yearlyFortune,
      environmentalBalance
    };
  }

  private calculateFourPillars(): ShichuSuimeiReading['fourPillars'] {
    const birthDate = this.input.birthDate;
    const year = birthDate.getFullYear();
    const month = birthDate.getMonth() + 1;
    const day = birthDate.getDate();
    const hour = birthDate.getHours();

    // 年柱の計算
    const yearPillar = this.calculateYearPillar(year);
    
    // 月柱の計算
    const monthPillar = this.calculateMonthPillar(year, month);
    
    // 日柱の計算
    const dayPillar = this.calculateDayPillar(year, month, day);
    
    // 時柱の計算
    const hourPillar = this.calculateHourPillar(dayPillar.stem, hour);

    return {
      year: yearPillar,
      month: monthPillar,
      day: dayPillar,
      hour: hourPillar
    };
  }

  private calculateYearPillar(year: number): Pillar {
    // 簡易計算（実際は旧暦変換が必要）
    const stemIndex = (year - 4) % 10;
    const branchIndex = (year - 4) % 12;
    
    const stem = HEAVENLY_STEMS[stemIndex];
    const branch = EARTHLY_BRANCHES[branchIndex];
    
    return {
      stem,
      branch,
      element: STEM_ELEMENTS[stemIndex],
      yinYang: STEM_YIN_YANG[stemIndex]
    };
  }

  private calculateMonthPillar(year: number, month: number): Pillar {
    // 月柱の天干は年干から導出
    const yearStemIndex = (year - 4) % 10;
    const monthStemBase = (yearStemIndex % 5) * 2;
    const monthStemIndex = (monthStemBase + month - 1) % 10;
    
    // 月支は固定（寅月から始まる）
    const monthBranchIndex = (month + 1) % 12;
    
    const stem = HEAVENLY_STEMS[monthStemIndex];
    const branch = EARTHLY_BRANCHES[monthBranchIndex];
    
    return {
      stem,
      branch,
      element: STEM_ELEMENTS[monthStemIndex],
      yinYang: STEM_YIN_YANG[monthStemIndex]
    };
  }

  private calculateDayPillar(year: number, month: number, day: number): Pillar {
    // 日柱の計算（簡易版）
    const date = new Date(year, month - 1, day);
    const daysSinceEpoch = Math.floor(date.getTime() / 86400000);
    
    const stemIndex = daysSinceEpoch % 10;
    const branchIndex = daysSinceEpoch % 12;
    
    const stem = HEAVENLY_STEMS[stemIndex];
    const branch = EARTHLY_BRANCHES[branchIndex];
    
    return {
      stem,
      branch,
      element: STEM_ELEMENTS[stemIndex],
      yinYang: STEM_YIN_YANG[stemIndex]
    };
  }

  private calculateHourPillar(dayStem: string, hour: number): Pillar {
    // 時支の計算（子時から始まる）
    const hourBranchIndex = Math.floor((hour + 1) / 2) % 12;
    
    // 時干は日干から導出
    const dayStemIndex = HEAVENLY_STEMS.indexOf(dayStem);
    const hourStemBase = (dayStemIndex % 5) * 2;
    const hourStemIndex = (hourStemBase + hourBranchIndex) % 10;
    
    const stem = HEAVENLY_STEMS[hourStemIndex];
    const branch = EARTHLY_BRANCHES[hourBranchIndex];
    
    return {
      stem,
      branch,
      element: STEM_ELEMENTS[hourStemIndex],
      yinYang: STEM_YIN_YANG[hourStemIndex]
    };
  }

  private calculateElementBalance(fourPillars: ShichuSuimeiReading['fourPillars']): ShichuSuimeiReading['elements'] {
    const elements = {
      wood: 0,
      fire: 0,
      earth: 0,
      metal: 0,
      water: 0
    };

    // 各柱の五行を集計
    Object.values(fourPillars).forEach(pillar => {
      const stemElement = pillar.element;
      const branchElement = BRANCH_ELEMENTS[EARTHLY_BRANCHES.indexOf(pillar.branch)];
      
      this.addElement(elements, stemElement);
      this.addElement(elements, branchElement);
    });

    return elements;
  }

  private addElement(elements: ShichuSuimeiReading['elements'], element: string) {
    switch (element) {
      case '木': elements.wood++; break;
      case '火': elements.fire++; break;
      case '土': elements.earth++; break;
      case '金': elements.metal++; break;
      case '水': elements.water++; break;
    }
  }

  private analyzeDayMaster(
    fourPillars: ShichuSuimeiReading['fourPillars'],
    elements: ShichuSuimeiReading['elements']
  ): ShichuSuimeiReading['dayMaster'] {
    const dayElement = fourPillars.day.element;
    const totalElements = Object.values(elements).reduce((sum, count) => sum + count, 0);
    
    // 日主の強弱判定
    let strength = '普通';
    const dayElementCount = this.getElementCount(elements, dayElement);
    const ratio = dayElementCount / totalElements;
    
    if (ratio > 0.35) {
      strength = '強い';
    } else if (ratio < 0.2) {
      strength = '弱い';
    }

    // 喜神・忌神の判定
    const favorable: string[] = [];
    const unfavorable: string[] = [];

    if (strength === '強い') {
      // 日主が強い場合は剋す五行と洩らす五行が喜神
      favorable.push(this.getControllingElement(dayElement));
      favorable.push(this.getProducedElement(dayElement));
      unfavorable.push(this.getProducingElement(dayElement));
      unfavorable.push(dayElement);
    } else {
      // 日主が弱い場合は生じる五行と同じ五行が喜神
      favorable.push(this.getProducingElement(dayElement));
      favorable.push(dayElement);
      unfavorable.push(this.getControllingElement(dayElement));
      unfavorable.push(this.getProducedElement(dayElement));
    }

    return {
      element: dayElement,
      strength,
      favorable,
      unfavorable
    };
  }

  private getElementCount(elements: ShichuSuimeiReading['elements'], element: string): number {
    switch (element) {
      case '木': return elements.wood;
      case '火': return elements.fire;
      case '土': return elements.earth;
      case '金': return elements.metal;
      case '水': return elements.water;
      default: return 0;
    }
  }

  private getProducingElement(element: string): string {
    const producing: Record<string, string> = {
      '木': '水',
      '火': '木',
      '土': '火',
      '金': '土',
      '水': '金'
    };
    return producing[element] || element;
  }

  private getProducedElement(element: string): string {
    return ELEMENT_RELATIONS.相生[element as keyof typeof ELEMENT_RELATIONS.相生] || element;
  }

  private getControllingElement(element: string): string {
    const controlling: Record<string, string> = {
      '木': '金',
      '火': '水',
      '土': '木',
      '金': '火',
      '水': '土'
    };
    return controlling[element] || element;
  }

  private generateInterpretation(
    fourPillars: ShichuSuimeiReading['fourPillars'],
    elements: ShichuSuimeiReading['elements'],
    dayMaster: ShichuSuimeiReading['dayMaster']
  ): ShichuSuimeiReading['interpretation'] {
    return {
      personality: this.interpretPersonality(fourPillars, dayMaster),
      career: this.interpretCareer(fourPillars, dayMaster, elements),
      relationships: this.interpretRelationships(fourPillars, elements),
      health: this.interpretHealth(elements, dayMaster),
      wealth: this.interpretWealth(fourPillars, dayMaster),
      overall: this.interpretOverall(fourPillars, elements, dayMaster)
    };
  }

  private interpretPersonality(
    fourPillars: ShichuSuimeiReading['fourPillars'],
    dayMaster: ShichuSuimeiReading['dayMaster']
  ): string {
    const dayElement = dayMaster.element;
    const dayYinYang = fourPillars.day.yinYang;
    
    const elementTraits: Record<string, Record<string, string>> = {
      '木': {
        '陽': '積極的でリーダーシップがあり、正義感が強く成長を求める',
        '陰': '柔軟で協調性があり、芸術的センスと思いやりを持つ'
      },
      '火': {
        '陽': '情熱的で明るく、人を惹きつける魅力とカリスマ性がある',
        '陰': '温かく優しく、細やかな配慮と豊かな感受性を持つ'
      },
      '土': {
        '陽': '信頼できて安定感があり、責任感と包容力に富む',
        '陰': '慎重で堅実、計画的で周囲との調和を大切にする'
      },
      '金': {
        '陽': '決断力があり正義感が強く、リーダーとしての資質を持つ',
        '陰': '繊細で美的センスがあり、完璧主義的な面がある'
      },
      '水': {
        '陽': '知的で柔軟、適応力が高く創造的な発想力を持つ',
        '陰': '内省的で直感的、深い洞察力と共感能力がある'
      }
    };

    let interpretation = `日主${dayElement}（${dayYinYang}）の特性から、`;
    interpretation += elementTraits[dayElement]?.[dayYinYang] || '独特の個性を持つ';
    interpretation += '性格です。';

    if (dayMaster.strength === '強い') {
      interpretation += '日主が強いため、自信に満ちリーダーシップを発揮しやすいですが、時に頑固になることも。';
    } else if (dayMaster.strength === '弱い') {
      interpretation += '日主が弱いため、協調性があり柔軟ですが、自信を持つことが課題かもしれません。';
    }

    return interpretation;
  }

  private interpretCareer(
    fourPillars: ShichuSuimeiReading['fourPillars'],
    dayMaster: ShichuSuimeiReading['dayMaster'],
    elements: ShichuSuimeiReading['elements']
  ): string {
    const monthElement = fourPillars.month.element;
    
    const careerElements: Record<string, string> = {
      '木': '教育、医療、出版、環境関連、成長産業',
      '火': 'エンターテインメント、IT、マーケティング、照明、エネルギー産業',
      '土': '不動産、建設、農業、行政、安定した組織',
      '金': '金融、法律、製造業、貴金属、精密機器',
      '水': '流通、通信、観光、海運、柔軟性が求められる仕事'
    };

    let interpretation = `月柱の${monthElement}は仕事運を表し、`;
    interpretation += careerElements[monthElement] || '多様な分野';
    interpretation += 'での活躍が期待できます。';

    // 財運の星を探す
    const wealthElement = this.getControlledElement(dayMaster.element);
    const wealthCount = this.getElementCount(elements, wealthElement);
    
    if (wealthCount >= 2) {
      interpretation += `財を表す${wealthElement}が豊富なため、経済的な成功を収めやすいでしょう。`;
    } else if (wealthCount === 0) {
      interpretation += `財を表す${wealthElement}が不足しているため、金銭管理には注意が必要です。`;
    }

    return interpretation;
  }

  private getControlledElement(element: string): string {
    return ELEMENT_RELATIONS.相剋[element as keyof typeof ELEMENT_RELATIONS.相剋] || element;
  }

  private interpretRelationships(
    fourPillars: ShichuSuimeiReading['fourPillars'],
    elements: ShichuSuimeiReading['elements']
  ): string {
    const hourElement = fourPillars.hour.element;
    const yearElement = fourPillars.year.element;
    
    let interpretation = `配偶者宮を表す日支の${fourPillars.day.branch}と、`;
    interpretation += `子供宮を表す時柱の${hourElement}から、`;

    // 五行のバランスから相性を判断
    const balance = Math.max(...Object.values(elements)) - Math.min(...Object.values(elements));
    
    if (balance <= 2) {
      interpretation += '五行のバランスが良く、円満な人間関係を築きやすいでしょう。';
    } else {
      interpretation += '五行のバランスに偏りがあるため、相手を理解する努力が大切です。';
    }

    // 年柱と日柱の関係
    if (this.isHarmonious(yearElement, fourPillars.day.element)) {
      interpretation += '家族との関係も良好で、支え合える関係を築けるでしょう。';
    }

    return interpretation;
  }

  private isHarmonious(element1: string, element2: string): boolean {
    return ELEMENT_RELATIONS.相生[element1 as keyof typeof ELEMENT_RELATIONS.相生] === element2 || 
           ELEMENT_RELATIONS.相生[element2 as keyof typeof ELEMENT_RELATIONS.相生] === element1 ||
           element1 === element2;
  }

  private interpretHealth(
    elements: ShichuSuimeiReading['elements'],
    dayMaster: ShichuSuimeiReading['dayMaster']
  ): string {
    const elementHealth: Record<string, string> = {
      '木': '肝臓、胆嚢、目、筋肉、神経系',
      '火': '心臓、小腸、舌、血管、循環器系',
      '土': '脾臓、胃、口、消化器系、免疫系',
      '金': '肺、大腸、鼻、呼吸器系、皮膚',
      '水': '腎臓、膀胱、耳、泌尿器系、生殖器系'
    };

    let interpretation = '健康面では、';
    
    // 不足している五行を特定
    const minElement = Object.entries(elements).reduce((min, [key, value]) => 
      value < elements[min as keyof typeof elements] ? key : min, 'wood');
    
    const elementMap: Record<string, string> = {
      'wood': '木', 'fire': '火', 'earth': '土', 'metal': '金', 'water': '水'
    };
    
    const weakElement = elementMap[minElement];
    interpretation += `${weakElement}が不足しているため、`;
    interpretation += elementHealth[weakElement] || '対応する臓器';
    interpretation += 'に注意が必要です。';

    if (dayMaster.strength === '弱い') {
      interpretation += '日主が弱いため、無理をせず休養を十分に取ることが大切です。';
    }

    return interpretation;
  }

  private interpretWealth(
    fourPillars: ShichuSuimeiReading['fourPillars'],
    dayMaster: ShichuSuimeiReading['dayMaster']
  ): string {
    const wealthElement = this.getControlledElement(dayMaster.element);
    let interpretation = `財を表す${wealthElement}の状態から、`;

    // 年柱は早年、月柱は青年期、日柱は中年、時柱は晩年を表す
    const pillars = ['年柱', '月柱', '日柱', '時柱'];
    const pillarElements = [
      fourPillars.year.element,
      fourPillars.month.element,
      fourPillars.day.element,
      fourPillars.hour.element
    ];

    const wealthPeriods = pillarElements.map((element, index) => 
      element === wealthElement ? pillars[index] : null
    ).filter(Boolean);

    if (wealthPeriods.length > 0) {
      interpretation += `${wealthPeriods.join('、')}に財運が巡ってきます。`;
    } else {
      interpretation += '着実な努力により財を築いていくタイプです。';
    }

    if (dayMaster.favorable.includes(wealthElement)) {
      interpretation += `${wealthElement}は喜神なので、財運に恵まれやすいでしょう。`;
    }

    return interpretation;
  }

  private interpretOverall(
    fourPillars: ShichuSuimeiReading['fourPillars'],
    elements: ShichuSuimeiReading['elements'],
    dayMaster: ShichuSuimeiReading['dayMaster']
  ): string {
    const timeModifier = this.getTimeModifier();
    const environmentModifier = this.getEnvironmentalModifier();
    
    let interpretation = '総合的に見て、';
    
    // 格局の判定（簡易版）
    const uniqueElements = new Set(Object.values(fourPillars).map(p => p.element)).size;
    
    if (uniqueElements <= 2) {
      interpretation += '特殊な格局を持ち、特定の分野で大きな成功を収める可能性があります。';
    } else if (Math.max(...Object.values(elements)) - Math.min(...Object.values(elements)) <= 2) {
      interpretation += '五行のバランスが取れた命式で、安定した人生を送りやすいでしょう。';
    } else {
      interpretation += '個性的な命式で、自分の強みを活かすことで成功への道が開けます。';
    }

    // 環境要因の影響
    if (environmentModifier > 1.1) {
      interpretation += '現在の環境エネルギーがあなたの運気を後押ししています。';
    }

    // 喜神のアドバイス
    interpretation += `運気を高めるには、${dayMaster.favorable.join('、')}の要素を生活に取り入れることが大切です。`;

    return interpretation;
  }

  private calculateTenYearLuck(fourPillars: ShichuSuimeiReading['fourPillars']): ShichuSuimeiReading['tenYearLuck'] {
    const age = Math.floor((Date.now() - this.input.birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    const luckCycle = Math.floor(age / 10);
    
    // 大運の計算（簡易版）
    const luckElements = ['木', '火', '土', '金', '水'];
    const currentElement = luckElements[luckCycle % 5];
    
    const startAge = luckCycle * 10;
    const endAge = startAge + 9;
    
    return {
      current: currentElement,
      period: `${startAge}歳〜${endAge}歳`,
      influence: `現在の大運は${currentElement}の影響下にあり、${this.getLuckInfluence(currentElement, fourPillars.day.element)}`
    };
  }

  private getLuckInfluence(luckElement: string, dayElement: string): string {
    if (this.isHarmonious(luckElement, dayElement)) {
      return '順調な発展が期待できる時期です。';
    } else if (this.getControllingElement(dayElement) === luckElement) {
      return '試練と成長の時期ですが、それが将来の糧となります。';
    } else {
      return '新しい変化と機会が訪れる時期です。';
    }
  }

  private calculateYearlyFortune(fourPillars: ShichuSuimeiReading['fourPillars']): string {
    const currentYear = new Date().getFullYear();
    const yearPillar = this.calculateYearPillar(currentYear);
    
    let fortune = `今年（${currentYear}年）の`;
    fortune += `${yearPillar.stem}${yearPillar.branch}年は、`;
    
    if (this.isHarmonious(yearPillar.element, fourPillars.day.element)) {
      fortune += 'あなたにとって追い風となる年です。新しいことにチャレンジする好機。';
    } else if (yearPillar.element === fourPillars.day.element) {
      fortune += '自分自身を見つめ直し、基盤を固める年です。';
    } else {
      fortune += '変化と調整の年。柔軟な対応が成功の鍵となります。';
    }
    
    return fortune;
  }

  private getEnvironmentalBalance(elements: ShichuSuimeiReading['elements']): string {
    if (!this.environment) return '';
    
    const season = this.getSeason();
    const seasonElement = this.getSeasonElement(season);
    
    let balance = `現在の季節（${season}）は${seasonElement}の気が強く、`;
    
    const elementName = this.getElementName(seasonElement);
    const elementCount = this.getElementCount(elements, seasonElement);
    
    if (elementCount >= 3) {
      balance += 'あなたの命式と共鳴し、運気が高まっています。';
    } else if (elementCount === 0) {
      balance += 'あなたの命式に不足している要素を補ってくれています。';
    } else {
      balance += 'あなたの命式とバランスよく調和しています。';
    }
    
    return balance;
  }

  private getSeason(): string {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return '春';
    if (month >= 5 && month <= 7) return '夏';
    if (month >= 8 && month <= 10) return '秋';
    return '冬';
  }

  private getSeasonElement(season: string): string {
    const seasonElements: Record<string, string> = {
      '春': '木',
      '夏': '火',
      '秋': '金',
      '冬': '水'
    };
    return seasonElements[season] || '土';
  }

  private getElementName(element: string): string {
    const names: Record<string, string> = {
      '木': 'wood',
      '火': 'fire',
      '土': 'earth',
      '金': 'metal',
      '水': 'water'
    };
    return names[element] || 'earth';
  }
}