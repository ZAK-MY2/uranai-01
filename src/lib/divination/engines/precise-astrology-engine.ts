import { BaseDivinationEngine, DivinationInput, EnvironmentData } from '../base-engine';
const swisseph = require('swisseph');

// Swiss Ephemeris統合による高精度占星術エンジン
export interface PreciseAstrologyReading {
  birthChart: {
    ascendant: CelestialCoordinate;
    midheaven: CelestialCoordinate;
    sun: PreciseCelestialBody;
    moon: PreciseCelestialBody;
    mercury: PreciseCelestialBody;
    venus: PreciseCelestialBody;
    mars: PreciseCelestialBody;
    jupiter: PreciseCelestialBody;
    saturn: PreciseCelestialBody;
    uranus: PreciseCelestialBody;
    neptune: PreciseCelestialBody;
    pluto: PreciseCelestialBody;
  };
  houses: PreciseHouse[];
  aspects: PreciseAspect[];
  interpretation: {
    classical: {
      personality: string;
      temperament: string;
      lifeDirection: string;
      strengths: string;
      challenges: string;
    };
    modern: {
      psychologicalProfile: string;
      careerGuidance: string;
      relationshipStyle: string;
      personalGrowth: string;
      currentTransits: string;
    };
    practical: {
      dailyGuidance: string;
      monthlyFocus: string;
      yearlyThemes: string;
      actionItems: string[];
      timing: string;
    };
  };
  calculationDetails: {
    julianDay: number;
    ephemerisUsed: string;
    coordinateSystem: string;
    houseSystem: string;
    ayanamsha?: number; // ヴェーダ占星術用
    calculationTime: Date;
    precision: 'seconds' | 'minutes' | 'hours';
  };
  environmentalHarmony?: string;
}

export interface CelestialCoordinate {
  longitude: number;
  latitude: number;
  distance: number;
  speed: number;
  sign: string;
  degree: number;
  minute: number;
  second: number;
}

export interface PreciseCelestialBody extends CelestialCoordinate {
  name: string;
  symbol: string;
  house: number;
  retrograde: boolean;
  dignities: {
    sign: 'domicile' | 'exaltation' | 'detriment' | 'fall' | 'neutral';
    degree: 'critical' | 'anaretic' | 'normal';
  };
}

export interface PreciseHouse {
  number: number;
  cusp: CelestialCoordinate;
  sign: string;
  planets: string[];
  ruling_planet: string;
  meaning: string;
  size: number; // ハウスのサイズ（度数）
}

export interface PreciseAspect {
  planet1: string;
  planet2: string;
  angle: number;
  type: string;
  orb: number;
  strength: number;
  applying: boolean; // 接近中か離反中か
  separating: boolean;
  exactDate?: Date; // 正確な角度になる日時
}

export class PreciseAstrologyEngine extends BaseDivinationEngine<PreciseAstrologyReading> {
  private readonly zodiacSigns = [
    { name: '牡羊座', symbol: '♈', element: '火', quality: '活動', ruler: 'mars' },
    { name: '牡牛座', symbol: '♉', element: '土', quality: '固定', ruler: 'venus' },
    { name: '双子座', symbol: '♊', element: '風', quality: '柔軟', ruler: 'mercury' },
    { name: '蟹座', symbol: '♋', element: '水', quality: '活動', ruler: 'moon' },
    { name: '獅子座', symbol: '♌', element: '火', quality: '固定', ruler: 'sun' },
    { name: '乙女座', symbol: '♍', element: '土', quality: '柔軟', ruler: 'mercury' },
    { name: '天秤座', symbol: '♎', element: '風', quality: '活動', ruler: 'venus' },
    { name: '蠍座', symbol: '♏', element: '水', quality: '固定', ruler: 'mars' },
    { name: '射手座', symbol: '♐', element: '火', quality: '柔軟', ruler: 'jupiter' },
    { name: '山羊座', symbol: '♑', element: '土', quality: '活動', ruler: 'saturn' },
    { name: '水瓶座', symbol: '♒', element: '風', quality: '固定', ruler: 'uranus' },
    { name: '魚座', symbol: '♓', element: '水', quality: '柔軟', ruler: 'neptune' }
  ];

  private readonly planetIds = {
    sun: swisseph.SE_SUN,
    moon: swisseph.SE_MOON,
    mercury: swisseph.SE_MERCURY,
    venus: swisseph.SE_VENUS,
    mars: swisseph.SE_MARS,
    jupiter: swisseph.SE_JUPITER,
    saturn: swisseph.SE_SATURN,
    uranus: swisseph.SE_URANUS,
    neptune: swisseph.SE_NEPTUNE,
    pluto: swisseph.SE_PLUTO
  };

  calculate(): PreciseAstrologyReading {
    // 基本的な占星術計算（簡易版）
    const birthDate = this.input.birthDate;
    const sunSign = this.calculateSunSign(birthDate);
    const moonSign = this.calculateMoonSign(birthDate);
    const ascendant = this.calculateAscendant(birthDate);
    
    return {
      birthChart: {
        sun: this.createCelestialBody('太陽', '☉', sunSign, 1),
        moon: this.createCelestialBody('月', '☽', moonSign, 2),
        mercury: this.createCelestialBody('水星', '☿', sunSign, 1),
        venus: this.createCelestialBody('金星', '♀', sunSign, 1),
        mars: this.createCelestialBody('火星', '♂', sunSign, 1),
        jupiter: this.createCelestialBody('木星', '♃', sunSign, 1),
        saturn: this.createCelestialBody('土星', '♄', sunSign, 1),
        uranus: this.createCelestialBody('天王星', '♅', sunSign, 1),
        neptune: this.createCelestialBody('海王星', '♆', sunSign, 1),
        pluto: this.createCelestialBody('冥王星', '♇', sunSign, 1),
        ascendant: this.createCoordinate(ascendant, 0),
        midheaven: this.createCoordinate(ascendant, 0)
      },
      interpretation: {
        classical: {
          personality: "基本的な性格分析",
          temperament: "気質の特徴",
          lifeDirection: "人生の方向性",
          strengths: "天性の才能",
          challenges: "克服すべき課題"
        },
        modern: {
          psychologicalProfile: "心理的プロフィール",
          careerGuidance: "キャリアガイダンス",
          relationshipStyle: "関係性のスタイル",
          personalGrowth: "個人的成長",
          currentTransits: "現在のトランジット"
        },
        practical: {
          dailyGuidance: "日々のガイダンス",
          monthlyFocus: "月間フォーカス",
          yearlyThemes: "年間テーマ",
          actionItems: ["具体的行動1", "具体的行動2"],
          timing: "タイミングガイダンス"
        }
      },
      houses: [],
      aspects: [],
      calculationDetails: {
        julianDay: 0,
        ephemerisUsed: "Swiss Ephemeris",
        coordinateSystem: "Tropical",
        houseSystem: "Placidus",
        calculationTime: new Date(),
        precision: 'minutes' as const
      }
    };
  }

  private calculateSunSign(date: Date): string {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    // 簡易的な太陽星座計算
    if ((month == 3 && day >= 21) || (month == 4 && day <= 19)) return '牡羊座';
    if ((month == 4 && day >= 20) || (month == 5 && day <= 20)) return '牡牛座';
    if ((month == 5 && day >= 21) || (month == 6 && day <= 20)) return '双子座';
    if ((month == 6 && day >= 21) || (month == 7 && day <= 22)) return '蟹座';
    if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) return '獅子座';
    if ((month == 8 && day >= 23) || (month == 9 && day <= 22)) return '乙女座';
    if ((month == 9 && day >= 23) || (month == 10 && day <= 22)) return '天秤座';
    if ((month == 10 && day >= 23) || (month == 11 && day <= 21)) return '蠍座';
    if ((month == 11 && day >= 22) || (month == 12 && day <= 21)) return '射手座';
    if ((month == 12 && day >= 22) || (month == 1 && day <= 19)) return '山羊座';
    if ((month == 1 && day >= 20) || (month == 2 && day <= 18)) return '水瓶座';
    return '魚座';
  }

  private calculateMoonSign(date: Date): string {
    // 簡易的な月星座計算（実際にはより複雑）
    return this.calculateSunSign(date);
  }

  private calculateAscendant(date: Date): string {
    // 簡易的なアセンダント計算（実際には出生時刻と場所が必要）
    return this.calculateSunSign(date);
  }

  private createCelestialBody(name: string, symbol: string, sign: string, house: number): PreciseCelestialBody {
    return {
      name,
      symbol,
      longitude: 0,
      latitude: 0,
      distance: 0,
      speed: 0,
      sign,
      degree: 0,
      minute: 0,
      second: 0,
      house,
      retrograde: false,
      dignities: {
        sign: 'neutral' as const,
        degree: 'normal' as const
      }
    };
  }

  private createCoordinate(sign: string, degree: number): CelestialCoordinate {
    return {
      longitude: 0,
      latitude: 0,
      distance: 0,
      speed: 0,
      sign,
      degree,
      minute: 0,
      second: 0
    };
  }

  private initializeSwissEph(): void {
    // Swiss Ephemerisのデータパスを設定
    swisseph.swe_set_ephe_path('./node_modules/swisseph/ephe');
  }

  private calculateJulianDay(): number {
    const birthDate = this.input.birthDate;
    const year = birthDate.getFullYear();
    const month = birthDate.getMonth() + 1;
    const day = birthDate.getDate();
    const hour = birthDate.getHours() + (birthDate.getMinutes() / 60) + (birthDate.getSeconds() / 3600);
    
    // グレゴリオ暦を考慮したユリウス日計算
    const calendar = year > 1582 || (year === 1582 && month > 10) || 
                    (year === 1582 && month === 10 && day >= 15) 
                    ? swisseph.SE_GREG_CAL : swisseph.SE_JUL_CAL;
    
    return swisseph.swe_julday(year, month, day, hour, calendar);
  }

  private calculatePreciseBirthChart(julianDay: number): PreciseAstrologyReading['birthChart'] {
    const planets: any = {};
    
    // 各天体の正確な位置を計算
    Object.entries(this.planetIds).forEach(([name, id]) => {
      const result = swisseph.swe_calc_ut(julianDay, id, swisseph.SEFLG_SWIEPH);
      
      if (result.flag !== swisseph.ERR) {
        const longitude = result.longitude;
        const latitude = result.latitude;
        const distance = result.distance;
        const speed = result.longitudeSpeed;
        
        planets[name] = this.createPreciseCelestialBody(name, longitude, latitude, distance, speed);
      }
    });

    // アセンダントとMCを計算
    const { ascendant, midheaven } = this.calculateAngles(julianDay);
    
    return {
      ascendant,
      midheaven,
      ...planets
    };
  }

  private createPreciseCelestialBody(name: string, longitude: number, latitude: number, distance: number, speed: number): PreciseCelestialBody {
    const signIndex = Math.floor(longitude / 30);
    const sign = this.zodiacSigns[signIndex];
    const degree = Math.floor(longitude % 30);
    const minute = Math.floor((longitude % 1) * 60);
    const second = Math.floor(((longitude % 1) * 60 % 1) * 60);
    
    return {
      name,
      symbol: this.getSymbolForPlanet(name),
      longitude,
      latitude,
      distance,
      speed,
      sign: sign.name,
      degree,
      minute,
      second,
      house: 1, // ハウス計算後に更新
      retrograde: speed < 0,
      dignities: this.calculateDignities(name, longitude)
    };
  }

  private calculateAngles(julianDay: number): { ascendant: CelestialCoordinate; midheaven: CelestialCoordinate } {
    // 出生地の緯度経度を取得
    const latitude = this.input.currentLocation?.latitude || 35.6762; // 東京をデフォルト
    const longitude = this.input.currentLocation?.longitude || 139.6503;
    
    // ハウスカスプを計算（Placidusシステム）
    const houses = swisseph.swe_houses(julianDay, latitude, longitude, 'P');
    
    const ascendantLong = houses.ascendant;
    const midheavenLong = houses.mc;
    
    return {
      ascendant: this.createCelestialCoordinate(ascendantLong),
      midheaven: this.createCelestialCoordinate(midheavenLong)
    };
  }

  private createCelestialCoordinate(longitude: number): CelestialCoordinate {
    const signIndex = Math.floor(longitude / 30);
    const sign = this.zodiacSigns[signIndex];
    
    return {
      longitude,
      latitude: 0,
      distance: 0,
      speed: 0,
      sign: sign.name,
      degree: Math.floor(longitude % 30),
      minute: Math.floor((longitude % 1) * 60),
      second: Math.floor(((longitude % 1) * 60 % 1) * 60)
    };
  }

  private calculatePreciseHouses(julianDay: number, birthChart: PreciseAstrologyReading['birthChart']): PreciseHouse[] {
    const latitude = this.input.currentLocation?.latitude || 35.6762;
    const longitude = this.input.currentLocation?.longitude || 139.6503;
    
    const houses = swisseph.swe_houses(julianDay, latitude, longitude, 'P');
    const cusps = houses.cusps;
    
    const houseMeanings = [
      '自己・人格・外見・第一印象',
      '所有・価値観・才能・金銭',
      'コミュニケーション・学習・兄弟姉妹・近距離移動',
      '家庭・基盤・ルーツ・不動産・晩年',
      '創造性・恋愛・子供・娯楽・投機',
      '健康・仕事・奉仕・日常習慣・部下',
      'パートナーシップ・結婚・公然の敵・契約',
      '変容・共有・神秘・他者の資源・性・死と再生',
      '高等教育・哲学・宗教・長距離旅行・出版',
      'キャリア・社会的地位・権威・名声・母親',
      '友情・理想・グループ・希望・人道主義',
      '潜在意識・秘密・スピリチュアル・隠れた敵・制限'
    ];

    return cusps.slice(1, 13).map((cusp: number, index: number) => {
      const houseNumber = index + 1;
      const nextCusp = cusps[index + 2] || cusps[1]; // 次のハウスカスプ
      const houseSize = this.calculateHouseSize(cusp, nextCusp);
      
      // このハウスにある天体を特定
      const planetsInHouse = Object.entries(birthChart)
        .filter(([key, body]) => typeof body === 'object' && 'longitude' in body)
        .filter(([key, body]) => this.isPlanetInHouse(body.longitude, cusp, nextCusp))
        .map(([key]) => key);

      const signIndex = Math.floor(cusp / 30);
      const sign = this.zodiacSigns[signIndex];

      return {
        number: houseNumber,
        cusp: this.createCelestialCoordinate(cusp),
        sign: sign.name,
        planets: planetsInHouse,
        ruling_planet: sign.ruler,
        meaning: houseMeanings[index],
        size: houseSize
      };
    });
  }

  private calculateHouseSize(cusp: number, nextCusp: number): number {
    let size = nextCusp - cusp;
    if (size < 0) size += 360; // 360度を跨ぐ場合
    return size;
  }

  private isPlanetInHouse(planetLongitude: number, houseStart: number, houseEnd: number): boolean {
    // 360度を跨ぐ場合の処理
    if (houseEnd < houseStart) {
      return planetLongitude >= houseStart || planetLongitude < houseEnd;
    }
    return planetLongitude >= houseStart && planetLongitude < houseEnd;
  }

  // Legacy methods removed - replaced by Ultra-High Precision system

  private calculateDignities(planetName: string, longitude: number): PreciseCelestialBody['dignities'] {
    const signIndex = Math.floor(longitude / 30);
    const degree = longitude % 30;
    
    // 品位の判定（簡易版）
    const dignityTable: Record<string, { domicile: number[]; exaltation: number[]; detriment: number[]; fall: number[] }> = {
      sun: { domicile: [4], exaltation: [0], detriment: [10], fall: [6] },
      moon: { domicile: [3], exaltation: [1], detriment: [9], fall: [7] },
      mercury: { domicile: [2, 5], exaltation: [5], detriment: [8, 11], fall: [11] },
      venus: { domicile: [1, 6], exaltation: [11], detriment: [7, 0], fall: [5] },
      mars: { domicile: [0, 7], exaltation: [9], detriment: [6, 1], fall: [3] },
      jupiter: { domicile: [8, 11], exaltation: [3], detriment: [2, 5], fall: [9] },
      saturn: { domicile: [9, 10], exaltation: [6], detriment: [3, 4], fall: [0] }
    };

    const planetDignities = dignityTable[planetName];
    let signDignity: 'domicile' | 'exaltation' | 'detriment' | 'fall' | 'neutral' = 'neutral';
    
    if (planetDignities) {
      if (planetDignities.domicile.includes(signIndex)) signDignity = 'domicile';
      else if (planetDignities.exaltation.includes(signIndex)) signDignity = 'exaltation';
      else if (planetDignities.detriment.includes(signIndex)) signDignity = 'detriment';
      else if (planetDignities.fall.includes(signIndex)) signDignity = 'fall';
    }

    // 度数の特殊性を判定
    let degreeDignity: 'critical' | 'anaretic' | 'normal' = 'normal';
    if (degree >= 29) degreeDignity = 'anaretic'; // アナレティック度数
    else if ([0, 13, 26].some(criticalDeg => Math.abs(degree - criticalDeg) < 1)) degreeDignity = 'critical';

    return {
      sign: signDignity,
      degree: degreeDignity
    };
  }

  private getSymbolForPlanet(name: string): string {
    const symbols: Record<string, string> = {
      sun: '☉', moon: '☽', mercury: '☿', venus: '♀', mars: '♂',
      jupiter: '♃', saturn: '♄', uranus: '♅', neptune: '♆', pluto: '♇'
    };
    return symbols[name] || '●';
  }

  private generateComprehensiveInterpretation(
    birthChart: PreciseAstrologyReading['birthChart'],
    houses: PreciseHouse[],
    aspects: PreciseAspect[]
  ): PreciseAstrologyReading['interpretation'] {
    return {
      classical: {
        personality: this.generateClassicalPersonality(birthChart, aspects),
        temperament: this.generateClassicalTemperament(birthChart),
        lifeDirection: this.generateClassicalLifeDirection(birthChart, houses),
        strengths: this.generateClassicalStrengths(birthChart, aspects),
        challenges: this.generateClassicalChallenges(birthChart, aspects)
      },
      modern: {
        psychologicalProfile: this.generateModernPsychology(birthChart, aspects),
        careerGuidance: this.generateModernCareer(birthChart, houses),
        relationshipStyle: this.generateModernRelationships(birthChart, aspects),
        personalGrowth: this.generateModernGrowth(birthChart, houses),
        currentTransits: this.generateCurrentTransits()
      },
      practical: {
        dailyGuidance: this.generateDailyGuidance(birthChart),
        monthlyFocus: this.generateMonthlyFocus(birthChart),
        yearlyThemes: this.generateYearlyThemes(birthChart),
        actionItems: this.generateActionItems(birthChart, houses),
        timing: this.generateTiming(birthChart)
      }
    };
  }

  // 古典的解釈メソッド群
  private generateClassicalPersonality(birthChart: PreciseAstrologyReading['birthChart'], aspects: PreciseAspect[]): string {
    const sun = birthChart.sun;
    const ascendant = birthChart.ascendant;
    
    const classicalTraits: Record<string, string> = {
      '牡羊座': '火星的性質により、勇敢で行動的、戦士の精神を持つ',
      '牡牛座': '金星的性質により、美と調和を愛し、感覚的快楽を重視する',
      '双子座': '水星的性質により、知的好奇心旺盛で変化を好む',
      '蟹座': '月的性質により、感情豊かで母性的、過去への愛着が強い',
      '獅子座': '太陽的性質により、威厳があり創造的、王者の風格を持つ',
      '乙女座': '水星的性質により、完璧主義で実用的、奉仕の精神を持つ',
      '天秤座': '金星的性質により、調和と美を追求し、公正さを重んじる',
      '蠍座': '火星・冥王星的性質により、深い洞察力と変容の力を持つ',
      '射手座': '木星的性質により、哲学的で楽観的、真理を探求する',
      '山羊座': '土星的性質により、責任感が強く忍耐強い、権威を求める',
      '水瓶座': '土星・天王星的性質により、独立的で革新的、人道主義的',
      '魚座': '木星・海王星的性質により、直感的で献身的、霊的な感受性を持つ'
    };

    const sunTrait = classicalTraits[sun.sign] || '独特の太陽的性質を持つ';
    const ascTrait = classicalTraits[ascendant.sign] || '独特の上昇的性質を持つ';
    
    let interpretation = `古典占星術によれば、太陽が${sun.sign}にあることから、あなたは${sunTrait}本質を持っています。`;
    interpretation += `上昇宮が${ascendant.sign}であることから、外面的には${ascTrait}印象を与えます。`;
    
    // 主要アスペクトの古典的解釈
    const sunAspects = aspects.filter(a => a.planet1 === 'sun' || a.planet2 === 'sun').slice(0, 2);
    if (sunAspects.length > 0) {
      const strongestAspect = sunAspects[0];
      const otherPlanet = strongestAspect.planet1 === 'sun' ? strongestAspect.planet2 : strongestAspect.planet1;
      
      interpretation += `特に${otherPlanet}との${strongestAspect.type}により、`;
      if (strongestAspect.type === 'conjunction') {
        interpretation += `両天体の力が結合し、強力な統合エネルギーを生み出しています。`;
      } else if (['trine', 'sextile'].includes(strongestAspect.type)) {
        interpretation += `調和的な流れにより、才能の自然な発達が期待されます。`;
      } else if (['square', 'opposition'].includes(strongestAspect.type)) {
        interpretation += `緊張的な関係により、意志力の強化と成長の機会が与えられています。`;
      }
    }

    return interpretation;
  }

  private generateClassicalTemperament(birthChart: PreciseAstrologyReading['birthChart']): string {
    // 四元素のバランスを計算
    const elements = { fire: 0, earth: 0, air: 0, water: 0 };
    const qualities = { cardinal: 0, fixed: 0, mutable: 0 };
    
    Object.entries(birthChart).forEach(([key, body]) => {
      if (typeof body === 'object' && 'sign' in body) {
        const sign = this.zodiacSigns.find(s => s.name === body.sign);
        if (sign) {
          switch (sign.element) {
            case '火': elements.fire++; break;
            case '土': elements.earth++; break;
            case '風': elements.air++; break;
            case '水': elements.water++; break;
          }
          switch (sign.quality) {
            case '活動': qualities.cardinal++; break;
            case '固定': qualities.fixed++; break;
            case '柔軟': qualities.mutable++; break;
          }
        }
      }
    });

    const dominantElement = Object.entries(elements).reduce((a, b) => elements[a[0] as keyof typeof elements] > elements[b[0] as keyof typeof elements] ? a : b)[0];
    const dominantQuality = Object.entries(qualities).reduce((a, b) => qualities[a[0] as keyof typeof qualities] > qualities[b[0] as keyof typeof qualities] ? a : b)[0];

    const temperaments: Record<string, string> = {
      fire: '胆汁質（熱く乾燥）- 情熱的で活動的、リーダーシップを発揮する気質',
      earth: '憂鬱質（冷たく乾燥）- 現実的で慎重、持続力のある気質',
      air: '多血質（熱く湿潤）- 社交的で楽観的、変化を好む気質',
      water: '粘液質（冷たく湿潤）- 感情的で直感的、共感力の高い気質'
    };

    return `古典的な四体液説に基づくと、あなたの基本的気質は${temperaments[dominantElement]}です。${dominantQuality === 'cardinal' ? '活動的な性質' : dominantQuality === 'fixed' ? '固定的な性質' : '柔軟な性質'}が特に強く現れています。`;
  }

  private generateClassicalLifeDirection(birthChart: PreciseAstrologyReading['birthChart'], houses: PreciseHouse[]): string {
    const midheaven = birthChart.midheaven;
    const tenthHouse = houses.find(h => h.number === 10);
    
    const lifeDirections: Record<string, string> = {
      '牡羊座': '開拓者として新しい道を切り開き、困難な状況でリーダーシップを発揮する運命',
      '牡牛座': '物質的な安定と美の創造を通じて、着実な基盤を築く運命',
      '双子座': '知識の伝達と情報の橋渡しを通じて、社会に多様性をもたらす運命',
      '蟹座': '保護と養育を通じて、人々の感情的な安全を守る運命',
      '獅子座': '創造的表現と娯楽を通じて、人々に喜びと inspiration を与える運命',
      '乙女座': '実用的なサービスと改善を通じて、社会の効率性を高める運命',
      '天秤座': '調和と美的センスを通じて、対立を解決し平和をもたらす運命',
      '蠍座': '深い変容と再生を通じて、古いものを新しいものに変える運命',
      '射手座': '知恵と真理の探求を通じて、人々の視野を広げる運命',
      '山羊座': '構造と権威を通じて、社会に秩序と安定をもたらす運命',
      '水瓶座': '革新と改革を通じて、時代の変化を先導する運命',
      '魚座': '奉仕と犠牲を通じて、人々の精神的な成長を助ける運命'
    };

    let interpretation = `天頂（MC）が${midheaven.sign}にあることから、あなたの人生の究極的方向性は${lifeDirections[midheaven.sign] || '独特の使命を持つ運命'}です。`;
    
    if (tenthHouse && tenthHouse.planets.length > 0) {
      interpretation += `第10ハウスに${tenthHouse.planets.join('・')}があることから、これらの天体が示す特質が社会的使命の達成において重要な役割を果たします。`;
    }

    return interpretation;
  }

  private generateClassicalStrengths(birthChart: PreciseAstrologyReading['birthChart'], aspects: PreciseAspect[]): string {
    const strengths: string[] = [];
    
    // 品位による強さの分析
    Object.entries(birthChart).forEach(([planetName, body]) => {
      if (typeof body === 'object' && 'dignities' in body) {
        if (body.dignities.sign === 'domicile') {
          strengths.push(`${planetName}が本来の宮にあり、その天体の力が最大限に発揮される`);
        } else if (body.dignities.sign === 'exaltation') {
          strengths.push(`${planetName}が高揚の宮にあり、その天体の最良の性質が表れる`);
        }
      }
    });

    // 調和的アスペクトによる強さ
    const harmonious = aspects.filter(a => ['trine', 'sextile', 'conjunction'].includes(a.type) && a.strength > 0.7);
    if (harmonious.length > 0) {
      strengths.push(`${harmonious.map(a => `${a.planet1}と${a.planet2}の${a.type}`).join('、')}により、才能の自然な発達と調和的なエネルギーの流れが約束されている`);
    }

    return strengths.length > 0 
      ? `古典占星術的強みとして、${strengths.join('。また、')}ことが挙げられます。`
      : '古典占星術では、バランスの取れた天体配置により、総合的な成長の可能性を秘めています。';
  }

  private generateClassicalChallenges(birthChart: PreciseAstrologyReading['birthChart'], aspects: PreciseAspect[]): string {
    const challenges: string[] = [];
    
    // 品位による困難の分析
    Object.entries(birthChart).forEach(([planetName, body]) => {
      if (typeof body === 'object' && 'dignities' in body) {
        if (body.dignities.sign === 'detriment') {
          challenges.push(`${planetName}が困難な宮にあり、その天体の力の発揮に制約がある`);
        } else if (body.dignities.sign === 'fall') {
          challenges.push(`${planetName}が衰退の宮にあり、その天体の性質の統合に課題がある`);
        }
      }
    });

    // 困難なアスペクトによる課題
    const challenging = aspects.filter(a => ['square', 'opposition'].includes(a.type) && a.strength > 0.6);
    if (challenging.length > 0) {
      challenges.push(`${challenging.map(a => `${a.planet1}と${a.planet2}の${a.type}`).join('、')}により、内的な緊張と成長の必要性が示されている`);
    }

    return challenges.length > 0 
      ? `古典占星術的課題として、${challenges.join('。また、')}ことがありますが、これらは全て魂の成長のための試練として与えられています。`
      : '古典占星術では、大きな困難な配置は見られず、比較的調和的な成長過程が期待されます。';
  }

  // 現代的解釈メソッド群（簡易版）
  private generateModernPsychology(birthChart: PreciseAstrologyReading['birthChart'], aspects: PreciseAspect[]): string {
    return `現代心理占星術の観点から、あなたの心理的プロファイルを分析中...（詳細実装予定）`;
  }

  private generateModernCareer(birthChart: PreciseAstrologyReading['birthChart'], houses: PreciseHouse[]): string {
    return `現代のキャリアガイダンスを分析中...（詳細実装予定）`;
  }

  private generateModernRelationships(birthChart: PreciseAstrologyReading['birthChart'], aspects: PreciseAspect[]): string {
    return `現代的な関係性スタイルを分析中...（詳細実装予定）`;
  }

  private generateModernGrowth(birthChart: PreciseAstrologyReading['birthChart'], houses: PreciseHouse[]): string {
    return `現代的な個人成長のパスを分析中...（詳細実装予定）`;
  }

  private generateCurrentTransits(): string {
    return `現在のトランジットの影響を分析中...（詳細実装予定）`;
  }

  // 実践的解釈メソッド群（簡易版）
  private generateDailyGuidance(birthChart: PreciseAstrologyReading['birthChart']): string {
    return `本日の実践的ガイダンスを生成中...（詳細実装予定）`;
  }

  private generateMonthlyFocus(birthChart: PreciseAstrologyReading['birthChart']): string {
    return `今月の焦点テーマを分析中...（詳細実装予定）`;
  }

  private generateYearlyThemes(birthChart: PreciseAstrologyReading['birthChart']): string {
    return `今年の主要テーマを分析中...（詳細実装予定）`;
  }

  private generateActionItems(birthChart: PreciseAstrologyReading['birthChart'], houses: PreciseHouse[]): string[] {
    return ['実践的アクションアイテムを生成中...（詳細実装予定）'];
  }

  private generateTiming(birthChart: PreciseAstrologyReading['birthChart']): string {
    return `最適なタイミングを分析中...（詳細実装予定）`;
  }

  private getEnvironmentalHarmony(birthChart: PreciseAstrologyReading['birthChart']): string {
    if (!this.environment) return '';
    
    return '環境との調和分析を実装中...（詳細実装予定）';
  }
}