import { BaseDivinationEngine, DivinationInput, EnvironmentData } from '../base-engine';

// 九星の定義
const NINE_STARS = {
  1: { name: '一白水星', element: '水', color: '白', nature: '柔軟性・適応力', direction: '北' },
  2: { name: '二黒土星', element: '土', color: '黒', nature: '母性・育成', direction: '南西' },
  3: { name: '三碧木星', element: '木', color: '碧', nature: '発展・躍動', direction: '東' },
  4: { name: '四緑木星', element: '木', color: '緑', nature: '調和・信頼', direction: '東南' },
  5: { name: '五黄土星', element: '土', color: '黄', nature: '中心・支配', direction: '中央' },
  6: { name: '六白金星', element: '金', color: '白', nature: '完璧・権威', direction: '北西' },
  7: { name: '七赤金星', element: '金', color: '赤', nature: '楽観・社交', direction: '西' },
  8: { name: '八白土星', element: '土', color: '白', nature: '変革・蓄積', direction: '北東' },
  9: { name: '九紫火星', element: '火', color: '紫', nature: '情熱・華麗', direction: '南' }
};

// 五行の相性関係
const ELEMENT_COMPATIBILITY = {
  '木': { good: ['水', '火'], bad: ['金'] },
  '火': { good: ['木', '土'], bad: ['水'] },
  '土': { good: ['火', '金'], bad: ['木'] },
  '金': { good: ['土', '水'], bad: ['火'] },
  '水': { good: ['金', '木'], bad: ['土'] }
};

export interface NineStarReading {
  mainStar: {
    number: number;
    name: string;
    element: string;
    characteristics: string[];
    strengths: string[];
    weaknesses: string[];
    calculationDetails?: {
      accurateMethod: {
        adjustedYear: number;
        starNumber: number;
        springBeginning: Date;
      };
      traditionalMethod: {
        adjustedYear: number;
        starNumber: number;
        note: string;
      };
      difference: string;
    };
  };
  monthlyStar: {
    number: number;
    name: string;
    influence: string;
  };
  dailyStar: {
    number: number;
    name: string;
    influence: string;
  };
  directionFortune: {
    auspicious: string[];
    inauspicious: string[];
    bestDirection: string;
    avoidDirection: string;
  };
  yearlyFortune: {
    overall: string;
    career: string;
    relationships: string;
    health: string;
    timing: string;
  };
  compatibility: {
    excellentWith: number[];
    goodWith: number[];
    challengingWith: number[];
  };
  personalGuidance?: string;
  environmentalHarmony?: string;
}

export class NineStarKiEngine extends BaseDivinationEngine<NineStarReading> {
  calculate(): NineStarReading {
    const mainStar = this.calculateMainStar();
    const monthlyStar = this.calculateMonthlyStar();
    const dailyStar = this.calculateDailyStar();
    const directionFortune = this.calculateDirectionFortune(mainStar.number);
    const yearlyFortune = this.calculateYearlyFortune(mainStar.number);
    const compatibility = this.calculateCompatibility(mainStar.number);
    
    const personalGuidance = this.generatePersonalGuidance(mainStar, monthlyStar, dailyStar);
    const environmentalHarmony = this.getEnvironmentalHarmony(mainStar);

    return {
      mainStar,
      monthlyStar,
      dailyStar,
      directionFortune,
      yearlyFortune,
      compatibility,
      personalGuidance,
      environmentalHarmony
    };
  }

  private calculateMainStar(): NineStarReading['mainStar'] {
    const birthYear = this.input.birthDate.getFullYear();
    
    // 正確な立春を考慮した年の判定
    const adjustedYear = this.getAccurateAdjustedYear(this.input.birthDate);
    
    // 従来の簡易計算も併記
    const birthMonth = this.input.birthDate.getMonth();
    const birthDay = this.input.birthDate.getDate();
    const simpleAdjustedYear = (birthMonth < 1 || (birthMonth === 1 && birthDay < 4)) ? birthYear - 1 : birthYear;
    
    // 本命星の計算（正確な立春基準）
    let starNumber = 11 - (adjustedYear % 9);
    if (starNumber > 9) starNumber -= 9;
    if (starNumber === 0) starNumber = 9;
    
    // 従来計算での結果も記録
    let simpleStarNumber = 11 - (simpleAdjustedYear % 9);
    if (simpleStarNumber > 9) simpleStarNumber -= 9;
    if (simpleStarNumber === 0) simpleStarNumber = 9;
    
    const star = NINE_STARS[starNumber as keyof typeof NINE_STARS];
    
    return {
      number: starNumber,
      name: star.name,
      element: star.element,
      characteristics: this.getCharacteristics(starNumber),
      strengths: this.getStrengths(starNumber),
      weaknesses: this.getWeaknesses(starNumber),
      calculationDetails: {
        accurateMethod: {
          adjustedYear,
          starNumber,
          springBeginning: this.getSpringBeginning(birthYear)
        },
        traditionalMethod: {
          adjustedYear: simpleAdjustedYear,
          starNumber: simpleStarNumber,
          note: '2月4日固定基準'
        },
        difference: starNumber !== simpleStarNumber ? '正確な立春計算により結果が異なります' : '両計算方法で一致'
      }
    };
  }

  private getCharacteristics(starNumber: number): string[] {
    const characteristics: Record<number, string[]> = {
      1: ['柔軟性がある', '適応力が高い', '思慮深い', '内向的', '慎重'],
      2: ['母性的', '世話好き', '堅実', '保守的', '忍耐強い'],
      3: ['積極的', '行動的', '楽観的', '直感的', '新しもの好き'],
      4: ['穏やか', '協調的', '信頼できる', '几帳面', '優柔不断'],
      5: ['リーダー気質', '支配的', '自信家', '頑固', '中心的存在'],
      6: ['完璧主義', '責任感が強い', '正義感がある', '威厳がある', 'プライドが高い'],
      7: ['社交的', '楽観的', '話上手', '享楽的', '気分屋'],
      8: ['変革を好む', '目標志向', '現実的', '蓄財上手', '慎重'],
      9: ['情熱的', '華やか', '直感的', '芸術的', '気が短い']
    };
    
    return characteristics[starNumber] || ['独特の個性を持つ'];
  }

  private getStrengths(starNumber: number): string[] {
    const strengths: Record<number, string[]> = {
      1: ['環境適応能力', '柔軟な思考', '協調性', '洞察力'],
      2: ['面倒見の良さ', '堅実さ', '忍耐力', '育成能力'],
      3: ['行動力', '開拓精神', '明るさ', '発想力'],
      4: ['信頼性', '調和能力', '計画性', '継続力'],
      5: ['統率力', '決断力', '影響力', '安定感'],
      6: ['責任感', '組織力', '正確性', '権威性'],
      7: ['コミュニケーション能力', '楽天性', '人脈', '説得力'],
      8: ['目標達成力', '改革力', '経済観念', '粘り強さ'],
      9: ['情熱', '創造性', '魅力', '直感力']
    };
    
    return strengths[starNumber] || ['独自の強みを持つ'];
  }

  private getWeaknesses(starNumber: number): string[] {
    const weaknesses: Record<number, string[]> = {
      1: ['優柔不断', '流されやすい', '内向的すぎる', '心配性'],
      2: ['変化を嫌う', 'くよくよしやすい', '執着心', '受け身'],
      3: ['短気', '飽きっぽい', '計画性不足', '軽率'],
      4: ['優柔不断', '八方美人', '心配性', '決断力不足'],
      5: ['頑固', '傲慢', '融通が利かない', '支配的'],
      6: ['完璧主義すぎる', '批判的', '柔軟性不足', '孤立しやすい'],
      7: ['浪費癖', '飽きっぽい', '表面的', '無責任'],
      8: ['頑固', '変化を恐れる', '物質主義', '疑い深い'],
      9: ['短気', '感情的', '派手好き', '持続力不足']
    };
    
    return weaknesses[starNumber] || ['改善の余地がある'];
  }

  private calculateMonthlyStar(): NineStarReading['monthlyStar'] {
    const currentDate = new Date();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    
    // 月命星の計算（簡易版）
    let monthlyStarNumber = (year * 12 + month) % 9;
    if (monthlyStarNumber === 0) monthlyStarNumber = 9;
    
    const star = NINE_STARS[monthlyStarNumber as keyof typeof NINE_STARS];
    
    return {
      number: monthlyStarNumber,
      name: star.name,
      influence: this.getMonthlyInfluence(monthlyStarNumber)
    };
  }

  private getMonthlyInfluence(starNumber: number): string {
    const influences: Record<number, string> = {
      1: '内省と計画の月。新しいアイデアを温める時期',
      2: '基盤作りの月。地道な努力が実を結ぶ',
      3: '活動的な月。新しいことを始めるのに最適',
      4: '人間関係の月。信頼関係を築く好機',
      5: '中心となる月。リーダーシップを発揮する時',
      6: '完成の月。これまでの努力が形になる',
      7: '収穫の月。成果を楽しみ、次に備える',
      8: '変化の月。新旧交代、方向転換の時期',
      9: '華やかな月。注目を集め、表現する時'
    };
    
    return influences[starNumber] || '独特のエネルギーが流れる月';
  }

  private calculateDailyStar(): NineStarReading['dailyStar'] {
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    
    // 日命星の計算（簡易版）
    let dailyStarNumber = dayOfYear % 9;
    if (dailyStarNumber === 0) dailyStarNumber = 9;
    
    const star = NINE_STARS[dailyStarNumber as keyof typeof NINE_STARS];
    
    return {
      number: dailyStarNumber,
      name: star.name,
      influence: this.getDailyInfluence(dailyStarNumber)
    };
  }

  private getDailyInfluence(starNumber: number): string {
    const influences: Record<number, string> = {
      1: '柔軟に対応する日。流れに身を任せて',
      2: 'サポートに徹する日。他者を支える',
      3: '積極的に動く日。チャンスを掴む',
      4: '信頼を築く日。約束を大切に',
      5: '中心に立つ日。決断を下す',
      6: '責任を果たす日。完璧を目指す',
      7: '楽しむ日。人との交流を大切に',
      8: '見直す日。改善点を探る',
      9: '輝く日。自己表現を大切に'
    };
    
    return influences[starNumber] || '特別なエネルギーの日';
  }

  private calculateDirectionFortune(mainStarNumber: number): NineStarReading['directionFortune'] {
    const currentYear = new Date().getFullYear();
    const yearNumber = (currentYear - 2000) % 9 || 9;
    
    // 吉方位の計算（簡易版）
    const auspiciousDirections: Record<number, string[]> = {
      1: ['東', '東南', '南'],
      2: ['北', '南', '西'],
      3: ['北', '南', '東南'],
      4: ['北', '東', '南'],
      5: ['北東', '南西', '北西', '東南'],
      6: ['北', '東', '南西'],
      7: ['東', '東南', '北西'],
      8: ['南', '西', '北西'],
      9: ['東', '北', '東南']
    };
    
    const inauspiciousDirections: Record<number, string[]> = {
      1: ['南西', '北東'],
      2: ['東', '東南'],
      3: ['西', '北西'],
      4: ['南西', '北西'],
      5: ['すべて注意'],
      6: ['南', '東南'],
      7: ['北', '北東'],
      8: ['東', '北東'],
      9: ['西', '南西']
    };
    
    const auspicious = auspiciousDirections[mainStarNumber] || [];
    const inauspicious = inauspiciousDirections[mainStarNumber] || [];
    
    return {
      auspicious,
      inauspicious,
      bestDirection: auspicious[0] || '北',
      avoidDirection: inauspicious[0] || '南'
    };
  }

  private calculateYearlyFortune(mainStarNumber: number): NineStarReading['yearlyFortune'] {
    const currentYear = new Date().getFullYear();
    const yearCycle = (currentYear + mainStarNumber) % 9;
    
    // 年運のサイクル
    const fortuneCycles: Record<number, { overall: string; career: string; relationships: string; health: string; timing: string }> = {
      1: {
        overall: '新しい始まりの年。種をまく時期',
        career: '新規プロジェクトの立ち上げに最適',
        relationships: '新しい出会いが期待できる',
        health: '体調管理を怠らないように',
        timing: '春から夏にかけて運気上昇'
      },
      2: {
        overall: '準備と基盤作りの年',
        career: '地道な努力が必要な時期',
        relationships: '既存の関係を深める',
        health: '無理は禁物、休養も大切',
        timing: '秋から冬が充実期'
      },
      3: {
        overall: '発展と成長の年',
        career: '積極的な行動が吉',
        relationships: '社交的になれる時期',
        health: '活動的で健康的',
        timing: '年間を通じて好調'
      },
      4: {
        overall: '安定と信頼構築の年',
        career: '信用を積み重ねる',
        relationships: '長期的な関係を築く',
        health: 'ストレス管理が重要',
        timing: '夏が最も良い時期'
      },
      5: {
        overall: '転換と変革の年',
        career: '大きな決断の時',
        relationships: '関係の見直し時期',
        health: '体調の変化に注意',
        timing: '変化は避けられない'
      },
      6: {
        overall: '完成と達成の年',
        career: 'これまでの努力が実る',
        relationships: '関係が深まる',
        health: '健康状態良好',
        timing: '秋が収穫の時期'
      },
      7: {
        overall: '収穫と楽しみの年',
        career: '成果を享受する時',
        relationships: '楽しい交流が増える',
        health: '楽観的で健康的',
        timing: '年末に向けて上昇'
      },
      8: {
        overall: '見直しと改革の年',
        career: '方向転換の好機',
        relationships: '関係の整理時期',
        health: '健康診断を受ける',
        timing: '春に大きな変化'
      },
      9: {
        overall: '完結と新たな準備の年',
        career: '総括と次への準備',
        relationships: '縁の整理と新しい出会い',
        health: '心身のリセット必要',
        timing: '年の後半が重要'
      }
    };
    
    return fortuneCycles[yearCycle] || fortuneCycles[1];
  }

  private calculateCompatibility(mainStarNumber: number): NineStarReading['compatibility'] {
    const star = NINE_STARS[mainStarNumber as keyof typeof NINE_STARS];
    const element = star.element;
    
    const excellentWith: number[] = [];
    const goodWith: number[] = [];
    const challengingWith: number[] = [];
    
    // 各星との相性を判定
    Object.entries(NINE_STARS).forEach(([num, otherStar]) => {
      const starNum = parseInt(num);
      if (starNum === mainStarNumber) return;
      
      const compatibility = ELEMENT_COMPATIBILITY[element as keyof typeof ELEMENT_COMPATIBILITY];
      
      if (compatibility.good.includes(otherStar.element)) {
        excellentWith.push(starNum);
      } else if (compatibility.bad.includes(otherStar.element)) {
        challengingWith.push(starNum);
      } else if (otherStar.element === element) {
        goodWith.push(starNum);
      } else {
        goodWith.push(starNum);
      }
    });
    
    return { excellentWith, goodWith, challengingWith };
  }

  private generatePersonalGuidance(
    mainStar: NineStarReading['mainStar'],
    monthlyStar: NineStarReading['monthlyStar'],
    dailyStar: NineStarReading['dailyStar']
  ): string {
    const { question, questionCategory } = this.input;
    
    if (!question) {
      return `${mainStar.name}のあなたは、${mainStar.characteristics.join('、')}という特性を活かして人生を歩んでください。`;
    }
    
    let guidance = `「${question}」について、`;
    
    // カテゴリー別アドバイス
    const categoryAdvice: Record<string, string> = {
      '恋愛・結婚': this.getLoveAdvice(mainStar.number, monthlyStar.number),
      '仕事・転職': this.getCareerAdvice(mainStar.number, monthlyStar.number),
      '金運・財運': this.getWealthAdvice(mainStar.number, monthlyStar.number),
      '健康': this.getHealthAdvice(mainStar.number, dailyStar.number),
      '総合運': this.getGeneralAdvice(mainStar.number, monthlyStar.number, dailyStar.number)
    };
    
    guidance += categoryAdvice[questionCategory || '総合運'] || categoryAdvice['総合運'];
    
    return guidance;
  }

  private getLoveAdvice(mainStar: number, monthlyStar: number): string {
    const loveAdvice: Record<number, string> = {
      1: '相手の気持ちに寄り添い、柔軟に対応することが大切',
      2: '献身的な愛情で相手を包み込みましょう',
      3: '積極的にアプローチし、明るく接することが吉',
      4: '信頼関係を大切に、誠実な態度で',
      5: 'リードする立場で関係を築いていく',
      6: '理想を追求しすぎず、相手を受け入れる',
      7: '楽しい時間を共有し、会話を大切に',
      8: '変化を恐れず、新しい関係性を模索',
      9: '情熱的に、でも相手のペースも尊重して'
    };
    
    return loveAdvice[mainStar] + `今月は${NINE_STARS[monthlyStar as keyof typeof NINE_STARS].name}の影響で、${this.getMonthlyInfluence(monthlyStar)}`;
  }

  private getCareerAdvice(mainStar: number, monthlyStar: number): string {
    const careerAdvice: Record<number, string> = {
      1: '状況に応じて柔軟に対応し、サポート役として活躍',
      2: '堅実に仕事を進め、信頼を積み重ねる',
      3: '新しいプロジェクトに積極的に参加する',
      4: 'チームワークを大切に、調整役として活躍',
      5: 'リーダーシップを発揮し、全体を統括',
      6: '完璧を目指し、責任を持って取り組む',
      7: 'コミュニケーションを活かし、人脈を広げる',
      8: '改革や改善に取り組み、新しい価値を創造',
      9: '創造性を発揮し、注目を集める仕事を'
    };
    
    return careerAdvice[mainStar] + `現在の運気は仕事面で${this.getMonthlyInfluence(monthlyStar)}`;
  }

  private getWealthAdvice(mainStar: number, monthlyStar: number): string {
    const wealthAdvice: Record<number, string> = {
      1: '流動的な資産運用で柔軟に対応',
      2: '堅実な貯蓄と安定した投資を心がける',
      3: '新しい収入源を積極的に開拓',
      4: '信頼できる人のアドバイスを参考に',
      5: '大きな決断は慎重に、でも勇気を持って',
      6: '計画的な資産管理で着実に増やす',
      7: '楽しみながらも浪費には注意',
      8: '投資の見直しと新しい運用方法を検討',
      9: '直感を信じつつ、派手な投資は控えめに'
    };
    
    return wealthAdvice[mainStar] || '堅実な金銭管理を心がけましょう。';
  }

  private getHealthAdvice(mainStar: number, dailyStar: number): string {
    const healthFocus: Record<number, string> = {
      1: '腎臓・膀胱・水分代謝に注意',
      2: '胃腸・消化器系を大切に',
      3: '肝臓・神経系のケアを',
      4: '呼吸器系・アレルギーに注意',
      5: '全身のバランスを整える',
      6: '肺・大腸・呼吸を意識',
      7: '口腔・喉のケアを大切に',
      8: '関節・骨格系に注意',
      9: '心臓・血管系の健康管理'
    };
    
    return healthFocus[mainStar] + `本日は${NINE_STARS[dailyStar as keyof typeof NINE_STARS].name}の日なので、${this.getDailyInfluence(dailyStar)}`;
  }

  private getGeneralAdvice(mainStar: number, monthlyStar: number, dailyStar: number): string {
    return `${NINE_STARS[mainStar as keyof typeof NINE_STARS].name}の特性を活かし、` +
           `今月の${NINE_STARS[monthlyStar as keyof typeof NINE_STARS].name}のエネルギーと、` +
           `本日の${NINE_STARS[dailyStar as keyof typeof NINE_STARS].name}の流れに乗って行動することが成功の鍵です。`;
  }

  private getEnvironmentalHarmony(mainStar: NineStarReading['mainStar']): string {
    if (!this.environment) return '';
    
    const weather = this.environment.weather;
    const element = mainStar.element;
    
    let harmony = '環境との調和：';
    
    // 天候と五行の関係
    const weatherElement: Record<string, string> = {
      'Clear': '火',
      'Rain': '水',
      'Clouds': '土',
      'Snow': '水',
      'Wind': '木'
    };
    
    const conditionMap: Record<string, string> = {
      'clear': 'Clear',
      'rain': 'Rain',
      'cloudy': 'Clouds',
      'snow': 'Snow',
      'storm': 'Storm'
    };
    const mappedCondition = weather ? (conditionMap[weather.condition] || 'Clear') : 'Clear';
    const currentWeatherElement = weatherElement[mappedCondition] || '土';
    const compatibility = ELEMENT_COMPATIBILITY[element as keyof typeof ELEMENT_COMPATIBILITY];
    
    if (compatibility.good.includes(currentWeatherElement)) {
      harmony += `現在の天候はあなたの${element}の気と調和し、運気を高めています。`;
    } else if (compatibility.bad.includes(currentWeatherElement)) {
      harmony += `現在の天候はあなたの${element}の気と相克関係にあるため、慎重な行動を。`;
    } else {
      harmony += `現在の天候とあなたの気は中立的な関係です。`;
    }
    
    // 気温による影響
    if (weather && weather.temperature !== undefined) {
      if (weather.temperature > 25) {
        harmony += element === '火' ? '暑さがあなたのエネルギーを増幅させます。' : 
                   element === '水' ? '暑さで消耗しやすいので、休息を大切に。' : '';
      } else if (weather.temperature < 10) {
        harmony += element === '水' ? '寒さがあなたの本質と調和します。' :
                   element === '火' ? '寒さで活力が低下しやすいので、温かく過ごして。' : '';
      }
    }
    
    return harmony;
  }

  /**
   * 正確な立春を考慮した年の判定
   */
  private getAccurateAdjustedYear(birthDate: Date): number {
    const birthYear = birthDate.getFullYear();
    const springBeginning = this.getSpringBeginning(birthYear);
    
    // 生年月日が立春より前の場合は前年扱い
    return birthDate.getTime() < springBeginning.getTime() ? birthYear - 1 : birthYear;
  }

  /**
   * 各年の正確な立春日時を取得
   */
  private getSpringBeginning(year: number): Date {
    // 2020-2030年の正確な立春データ（日本標準時）
    const accurateSpringDates: Record<number, string> = {
      2020: '2020-02-04T17:03:00+09:00',
      2021: '2021-02-03T22:59:00+09:00',
      2022: '2022-02-04T04:51:00+09:00',
      2023: '2023-02-04T10:43:00+09:00',
      2024: '2024-02-04T16:27:00+09:00',
      2025: '2025-02-03T22:10:00+09:00',
      2026: '2026-02-04T04:01:00+09:00',
      2027: '2027-02-04T09:46:00+09:00',
      2028: '2028-02-04T15:31:00+09:00',
      2029: '2029-02-03T21:20:00+09:00',
      2030: '2030-02-04T03:09:00+09:00'
    };

    if (accurateSpringDates[year]) {
      return new Date(accurateSpringDates[year]);
    }

    // データがない年は近似計算（2月4日午前10時として概算）
    return new Date(year, 1, 4, 10, 0, 0);
  }
}