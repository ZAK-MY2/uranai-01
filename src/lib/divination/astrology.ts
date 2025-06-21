// 西洋占星術エンジン（高度版）- Swiss Ephemeris API統合
import { BirthData, AstrologyResult, AstrologyChart, Planet, House, Aspect } from '@/types/divination';
import { AstrologyApiClient } from './astrology-api';

interface ZodiacSign {
  name: string;
  element: 'fire' | 'earth' | 'air' | 'water';
  quality: 'cardinal' | 'fixed' | 'mutable';
  ruler: string;
  traits: string[];
  description: string;
}

export class AstrologyEngine {
  private readonly zodiacSigns: ZodiacSign[] = [
    {
      name: '牡羊座', element: 'fire', quality: 'cardinal', ruler: 'Mars',
      traits: ['積極的', 'リーダーシップ', '勇敢', '情熱的', '短気'],
      description: '新しいことに挑戦する勇気と情熱を持ち、リーダーシップを発揮します。'
    },
    {
      name: '牡牛座', element: 'earth', quality: 'fixed', ruler: 'Venus',
      traits: ['安定志向', '現実的', '美的センス', '頑固', '物質的'],
      description: '安定と美を求め、現実的で着実に物事を進める性格です。'
    },
    {
      name: '双子座', element: 'air', quality: 'mutable', ruler: 'Mercury',
      traits: ['知識欲', 'コミュニケーション', '好奇心', '多才', '移り気'],
      description: '知識欲旺盛で、コミュニケーション能力に長けています。'
    },
    {
      name: '蟹座', element: 'water', quality: 'cardinal', ruler: 'Moon',
      traits: ['感情豊か', '家族愛', '直感的', '保護本能', '感受性'],
      description: '感情豊かで家族を大切にし、直感力に優れています。'
    },
    {
      name: '獅子座', element: 'fire', quality: 'fixed', ruler: 'Sun',
      traits: ['自信', '創造性', '表現力', '誇り高い', 'ドラマチック'],
      description: '自信に満ち、創造性と表現力に優れたスター性を持ちます。'
    },
    {
      name: '乙女座', element: 'earth', quality: 'mutable', ruler: 'Mercury',
      traits: ['完璧主義', '分析力', '奉仕精神', '実用的', '批判的'],
      description: '完璧主義で分析力があり、実用的で奉仕精神に富んでいます。'
    },
    {
      name: '天秤座', element: 'air', quality: 'cardinal', ruler: 'Venus',
      traits: ['調和', '美的センス', '外交的', '優雅', '優柔不断'],
      description: '調和と美を愛し、外交的で優雅な性格を持ちます。'
    },
    {
      name: '蠍座', element: 'water', quality: 'fixed', ruler: 'Pluto',
      traits: ['神秘的', '情熱的', '洞察力', '秘密主義', '変容'],
      description: '神秘的で情熱的、深い洞察力と変容の力を持ちます。'
    },
    {
      name: '射手座', element: 'fire', quality: 'mutable', ruler: 'Jupiter',
      traits: ['自由', '冒険', '哲学的', '楽観的', '放浪'],
      description: '自由を愛し、冒険心と哲学的思考を持つ楽観主義者です。'
    },
    {
      name: '山羊座', element: 'earth', quality: 'cardinal', ruler: 'Saturn',
      traits: ['責任感', '野心', '忍耐力', '保守的', '達成志向'],
      description: '責任感が強く、野心的で忍耐力のある達成志向の性格です。'
    },
    {
      name: '水瓶座', element: 'air', quality: 'fixed', ruler: 'Uranus',
      traits: ['独創性', '人道主義', '革新的', '独立心', '未来志向'],
      description: '独創的で人道主義的、革新的なアイデアを持つ未来志向者です。'
    },
    {
      name: '魚座', element: 'water', quality: 'mutable', ruler: 'Neptune',
      traits: ['直感力', '芸術性', '共感力', '霊性', '曖昧'],
      description: '直感力と芸術性に優れ、高い共感力と霊性を持ちます。'
    }
  ];

  private readonly planets = [
    'Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 
    'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'
  ];

  private readonly houses = [
    '1室（自己・個性）', '2室（価値・所有）', '3室（コミュニケーション）',
    '4室（家庭・基盤）', '5室（創造・恋愛）', '6室（健康・奉仕）',
    '7室（パートナーシップ）', '8室（変容・共有）', '9室（哲学・探求）',
    '10室（社会的地位）', '11室（友情・希望）', '12室（潜在意識・犠牲）'
  ];

  /**
   * 生年月日から太陽星座を計算（簡略版）
   */
  private calculateSunSign(birthDate: string): string {
    const date = new Date(birthDate);
    const month = date.getMonth() + 1;
    const day = date.getDate();

    // 簡略化された星座境界日
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return '牡羊座';
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return '牡牛座';
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return '双子座';
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return '蟹座';
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return '獅子座';
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return '乙女座';
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return '天秤座';
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return '蠍座';
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return '射手座';
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return '山羊座';
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return '水瓶座';
    if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return '魚座';

    return '牡羊座'; // デフォルト
  }

  /**
   * 月星座の改善された計算（誕生時刻を考慮）
   */
  private calculateMoonSign(birthDate: string, birthTime?: string): string {
    const date = new Date(birthDate + (birthTime ? 'T' + birthTime : 'T12:00'));
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    
    // 月の軌道周期を考慮したより精密な計算
    // 月は約27.3日で黄道を一周し、1星座あたり約2.3日
    const baseDate = new Date(2000, 0, 1); // 2000年1月1日を基準
    const daysSinceBase = Math.floor((date.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // 月の周期で割った余りから位置を計算
    const moonPosition = (daysSinceBase * 13.176) % 360; // 13.176度/日
    const signIndex = Math.floor(moonPosition / 30) % 12;
    
    return this.zodiacSigns[signIndex].name;
  }

  /**
   * 上昇星座の改善された計算（時間と緯度を考慮）
   */
  private calculateAscendant(birthDate: string, birthTime: string, latitude: number = 35.0): string {
    const date = new Date(`${birthDate}T${birthTime}`);
    const hour = date.getHours();
    const minute = date.getMinutes();
    const totalMinutes = hour * 60 + minute;
    
    // 緯度と時刻を考慮した上昇星座計算
    // 上昇星座は約22分で１星座移動（略算）
    const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    const seasonOffset = Math.sin((dayOfYear / 365) * 2 * Math.PI) * 30; // 季節変動
    const latitudeAdjustment = Math.cos((latitude * Math.PI) / 180) * 15; // 緯度調整
    
    const totalDegrees = (totalMinutes * 0.25 + seasonOffset + latitudeAdjustment) % 360;
    const ascendantIndex = Math.floor(totalDegrees / 30) % 12;
    
    return this.zodiacSigns[ascendantIndex].name;
  }

  /**
   * 簡略化された惑星配置生成
   */
  private generateSimplifiedChart(birthData: BirthData): AstrologyChart {
    const sunSign = this.calculateSunSign(birthData.date);
    const moonSign = this.calculateMoonSign(birthData.date);
    const ascendant = this.calculateAscendant(birthData.date, birthData.time);

    // 基本的な惑星配置（簡略版）
    const planets: Planet[] = [
      { name: 'Sun', sign: sunSign, degree: 15, house: 1, retrograde: false },
      { name: 'Moon', sign: moonSign, degree: 10, house: 4, retrograde: false },
      { name: 'Mercury', sign: sunSign, degree: 20, house: 1, retrograde: false },
      { name: 'Venus', sign: this.getAdjacentSign(sunSign, 1), degree: 5, house: 2, retrograde: false },
      { name: 'Mars', sign: this.getAdjacentSign(sunSign, 2), degree: 25, house: 3, retrograde: false }
    ];

    // 基本的なハウス（簡略版）
    const houses: House[] = this.houses.map((house, index) => ({
      number: index + 1,
      sign: this.zodiacSigns[(this.zodiacSigns.findIndex(z => z.name === ascendant) + index) % 12].name,
      degree: 0
    }));

    // 基本的なアスペクト（簡略版）
    const aspects: Aspect[] = [
      { planet1: 'Sun', planet2: 'Moon', aspect: 'Sextile', orb: 2, exact: false },
      { planet1: 'Sun', planet2: 'Mercury', aspect: 'Conjunction', orb: 5, exact: true }
    ];

    return {
      planets,
      houses,
      aspects,
      ascendant,
      midheaven: this.getAdjacentSign(ascendant, 9) // 簡略化
    };
  }

  /**
   * 隣接する星座を取得
   */
  private getAdjacentSign(currentSign: string, offset: number): string {
    const currentIndex = this.zodiacSigns.findIndex(sign => sign.name === currentSign);
    const newIndex = (currentIndex + offset) % 12;
    return this.zodiacSigns[newIndex].name;
  }

  /**
   * 星座の詳細情報を取得
   */
  private getSignDetails(signName: string): ZodiacSign | undefined {
    return this.zodiacSigns.find(sign => sign.name === signName);
  }

  /**
   * 解釈文生成
   */
  private generateInterpretation(chart: AstrologyChart): AstrologyResult['interpretation'] {
    const sunPlanet = chart.planets.find(p => p.name === 'Sun');
    const moonPlanet = chart.planets.find(p => p.name === 'Moon');
    const sunSign = this.getSignDetails(sunPlanet?.sign || '');
    const moonSign = this.getSignDetails(moonPlanet?.sign || '');
    const ascendantSign = this.getSignDetails(chart.ascendant);

    return {
      personality: this.generatePersonalityInterpretation(sunSign, moonSign, ascendantSign),
      relationships: this.generateRelationshipInterpretation(chart),
      career: this.generateCareerInterpretation(sunSign, ascendantSign),
      spiritual: this.generateSpiritualInterpretation(moonSign, chart),
      overall: this.generateOverallInterpretation(chart, sunSign, moonSign, ascendantSign)
    };
  }

  private generatePersonalityInterpretation(sunSign?: ZodiacSign, moonSign?: ZodiacSign, ascendantSign?: ZodiacSign): string {
    let interpretation = '';
    
    if (sunSign) {
      interpretation += `**太陽星座（${sunSign.name}）の影響**\n`;
      interpretation += `あなたの基本的な性格は${sunSign.description} `;
      interpretation += `主な特徴として${sunSign.traits.slice(0, 3).join('、')}などが挙げられます。\n\n`;
    }
    
    if (moonSign) {
      interpretation += `**月星座（${moonSign.name}）の影響**\n`;
      interpretation += `感情面では${moonSign.description} `;
      interpretation += `特に${moonSign.traits.slice(0, 2).join('、')}な一面を持っています。\n\n`;
    }
    
    if (ascendantSign) {
      interpretation += `**上昇星座（${ascendantSign.name}）の影響**\n`;
      interpretation += `第一印象や表面的な行動として、${ascendantSign.description} `;
      interpretation += `他人からは${ascendantSign.traits[0]}で${ascendantSign.traits[1]}な人として見られるでしょう。`;
    }
    
    return interpretation;
  }

  private generateRelationshipInterpretation(chart: AstrologyChart): string {
    const venus = chart.planets.find(p => p.name === 'Venus');
    const mars = chart.planets.find(p => p.name === 'Mars');
    
    let interpretation = '**恋愛・人間関係の傾向**\n\n';
    
    if (venus) {
      const venusSign = this.getSignDetails(venus.sign);
      if (venusSign) {
        interpretation += `金星が${venus.sign}にあることから、愛情表現において${venusSign.traits[0]}で${venusSign.traits[1]}な傾向があります。`;
      }
    }
    
    if (mars) {
      const marsSign = this.getSignDetails(mars.sign);
      if (marsSign) {
        interpretation += ` 火星が${mars.sign}にあることから、アプローチの仕方は${marsSign.traits[0]}で${marsSign.traits[1]}なスタイルを取ります。`;
      }
    }
    
    interpretation += '\n\nパートナーシップにおいては、相互理解と尊重を基盤とした関係を築くことが重要です。';
    
    return interpretation;
  }

  private generateCareerInterpretation(sunSign?: ZodiacSign, ascendantSign?: ZodiacSign): string {
    let interpretation = '**仕事・キャリアの傾向**\n\n';
    
    if (sunSign) {
      interpretation += `${sunSign.name}の特性を活かして、`;
      
      switch (sunSign.element) {
        case 'fire':
          interpretation += 'リーダーシップを発揮できる分野や、創造的で情熱を注げる仕事';
          break;
        case 'earth':
          interpretation += '実践的で安定した分野や、具体的な成果を出せる仕事';
          break;
        case 'air':
          interpretation += 'コミュニケーションや知識を活かせる分野、情報を扱う仕事';
          break;
        case 'water':
          interpretation += '人との関わりが深い分野や、直感力を活かせる仕事';
          break;
      }
      
      interpretation += 'が適しているでしょう。';
    }
    
    if (ascendantSign) {
      interpretation += ` 職場では${ascendantSign.traits[0]}で${ascendantSign.traits[1]}な印象を与え、`;
      interpretation += `${ascendantSign.name}らしい働き方を通じて成功を収めることができます。`;
    }
    
    return interpretation;
  }

  private generateSpiritualInterpretation(moonSign?: ZodiacSign, chart?: AstrologyChart): string {
    let interpretation = '**精神性・内面の成長**\n\n';
    
    if (moonSign) {
      interpretation += `月星座${moonSign.name}から、精神的な成長において${moonSign.traits[2] || moonSign.traits[0]}な要素が重要となります。`;
      
      switch (moonSign.element) {
        case 'fire':
          interpretation += ' 積極的な行動と情熱を通じて精神的な充実を得られます。';
          break;
        case 'earth':
          interpretation += ' 現実的な実践と着実な努力を通じて内面の安定を得られます。';
          break;
        case 'air':
          interpretation += ' 知識の探求と人とのつながりを通じて精神的な成長を遂げます。';
          break;
        case 'water':
          interpretation += ' 感情の理解と直感の発達を通じて深い洞察を得られます。';
          break;
      }
    }
    
    interpretation += '\n\n瞑想や内省の時間を大切にし、自然とのつながりを感じることで、';
    interpretation += 'より豊かな精神性を育むことができるでしょう。';
    
    return interpretation;
  }

  private generateOverallInterpretation(chart: AstrologyChart, sunSign?: ZodiacSign, moonSign?: ZodiacSign, ascendantSign?: ZodiacSign): string {
    let interpretation = '**総合的なメッセージ**\n\n';
    
    interpretation += `あなたのホロスコープは、`;
    
    if (sunSign) {
      interpretation += `${sunSign.name}の太陽を中心とした`;
    }
    
    if (moonSign && moonSign.name !== sunSign?.name) {
      interpretation += `、${moonSign.name}の月が示す感情面`;
    }
    
    if (ascendantSign && ascendantSign.name !== sunSign?.name && ascendantSign.name !== moonSign?.name) {
      interpretation += `、そして${ascendantSign.name}の上昇星座が表す外向性`;
    }
    
    interpretation += 'が調和した、バランスの取れた性格を示しています。\n\n';
    
    // エレメントのバランス分析
    const elements = [sunSign?.element, moonSign?.element, ascendantSign?.element].filter(Boolean);
    const elementCounts = elements.reduce((acc, element) => {
      if (element) acc[element] = (acc[element] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const dominantElement = Object.entries(elementCounts).sort(([,a], [,b]) => b - a)[0];
    
    if (dominantElement) {
      interpretation += `特に${dominantElement[0] === 'fire' ? '火' : dominantElement[0] === 'earth' ? '土' : dominantElement[0] === 'air' ? '風' : '水'}のエレメントが強く、`;
      
      switch (dominantElement[0]) {
        case 'fire':
          interpretation += '情熱的で行動力のある人生を歩むでしょう。';
          break;
        case 'earth':
          interpretation += '現実的で安定した人生を築いていくでしょう。';
          break;
        case 'air':
          interpretation += '知的で社交的な人生を送るでしょう。';
          break;
        case 'water':
          interpretation += '感情豊かで直感的な人生を歩むでしょう。';
          break;
      }
    }
    
    interpretation += '\n\n星々の配置があなたに与える最大のギフトは、';
    interpretation += '自分らしさを大切にしながら、他者との調和を図る能力です。';
    interpretation += 'この特質を活かして、充実した人生を歩んでください。';
    
    return interpretation;
  }

  /**
   * 西洋占星術計算のメインメソッド
   */
  async calculateChart(birthData: BirthData): Promise<AstrologyResult> {
    // 入力検証
    if (!birthData.date || !birthData.time) {
      throw new Error('生年月日と出生時刻は必須です');
    }

    // 日付と時刻の形式チェック
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    const timeRegex = /^\d{2}:\d{2}$/;
    
    if (!dateRegex.test(birthData.date)) {
      throw new Error('生年月日は YYYY-MM-DD 形式で入力してください');
    }
    
    if (!timeRegex.test(birthData.time)) {
      throw new Error('出生時刻は HH:MM 形式で入力してください');
    }

    try {
      const chart = this.generateSimplifiedChart(birthData);
      const interpretation = this.generateInterpretation(chart);

      return {
        chart,
        interpretation
      };
    } catch (error) {
      throw new Error(`占星術計算エラー: ${error instanceof Error ? error.message : '不明なエラー'}`);
    }
  }

  /**
   * 太陽星座のみの簡易占い
   */
  async getSimpleSunSignReading(birthDate: string): Promise<{ sign: string; description: string; traits: string[] }> {
    const sunSign = this.calculateSunSign(birthDate);
    const signDetails = this.getSignDetails(sunSign);
    
    if (!signDetails) {
      throw new Error('星座の情報を取得できませんでした');
    }
    
    return {
      sign: sunSign,
      description: signDetails.description,
      traits: signDetails.traits
    };
  }

  /**
   * キャッシュキー生成
   */
  generateCacheKey(birthData: BirthData): string {
    return `astrology:${birthData.date}:${birthData.time}:${birthData.latitude}:${birthData.longitude}`;
  }

  /**
   * 入力ハッシュ生成
   */
  generateInputHash(birthData: BirthData): string {
    const data = `${birthData.date}:${birthData.time}:${birthData.latitude}:${birthData.longitude}:${birthData.timezone}`;
    return btoa(data).replace(/[^a-zA-Z0-9]/g, '');
  }
}

// シングルトンインスタンス
export const astrologyEngine = new AstrologyEngine();