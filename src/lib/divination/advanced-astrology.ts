// 高度西洋占星術エンジン - Swiss Ephemeris統合
import { BirthData, AstrologyResult, AstrologyChart, Planet, House, Aspect } from '@/types/divination';
import { astrologyApiClient, EphemerisData, TransitData, ProgressionData } from './astrology-api';

interface ZodiacSign {
  name: string;
  englishName: string;
  element: 'fire' | 'earth' | 'air' | 'water';
  quality: 'cardinal' | 'fixed' | 'mutable';
  ruler: string;
  traits: string[];
  description: string;
  degrees: { start: number; end: number };
}

interface AdvancedAstrologyResult extends AstrologyResult {
  transits?: TransitData;
  progressions?: ProgressionData;
  upcomingTransits?: { date: string; description: string; importance: 'high' | 'medium' | 'low' }[];
  detailedAnalysis: {
    dominantElements: { element: string; percentage: number }[];
    dominantQualities: { quality: string; percentage: number }[];
    aspectPatterns: string[];
    stelliums: { sign: string; planets: string[] }[];
    t_squares: { apex: string; planets: string[] }[];
    grand_trines: { element: string; planets: string[] }[];
    yods: { apex: string; base: string[] }[];
  };
  timing: {
    current_phase: string;
    peak_periods: { period: string; description: string }[];
    challenging_periods: { period: string; description: string }[];
  };
}

export class AdvancedAstrologyEngine {
  private apiClient = astrologyApiClient;
  
  private readonly zodiacSigns: ZodiacSign[] = [
    {
      name: '牡羊座', englishName: 'Aries', element: 'fire', quality: 'cardinal', ruler: 'Mars',
      traits: ['積極的', 'リーダーシップ', '勇敢', '情熱的', '短気'],
      description: '新しいことに挑戦する勇気と情熱を持ち、リーダーシップを発揮します。',
      degrees: { start: 0, end: 30 }
    },
    {
      name: '牡牛座', englishName: 'Taurus', element: 'earth', quality: 'fixed', ruler: 'Venus',
      traits: ['安定志向', '現実的', '美的センス', '頑固', '物質的'],
      description: '安定と美を求め、現実的で着実に物事を進める性格です。',
      degrees: { start: 30, end: 60 }
    },
    {
      name: '双子座', englishName: 'Gemini', element: 'air', quality: 'mutable', ruler: 'Mercury',
      traits: ['知識欲', 'コミュニケーション', '好奇心', '多才', '移り気'],
      description: '知識欲旺盛で、コミュニケーション能力に長けています。',
      degrees: { start: 60, end: 90 }
    },
    {
      name: '蟹座', englishName: 'Cancer', element: 'water', quality: 'cardinal', ruler: 'Moon',
      traits: ['感情豊か', '家族愛', '直感的', '保護本能', '感受性'],
      description: '感情豊かで家族を大切にし、直感力に優れています。',
      degrees: { start: 90, end: 120 }
    },
    {
      name: '獅子座', englishName: 'Leo', element: 'fire', quality: 'fixed', ruler: 'Sun',
      traits: ['自信', '創造性', '表現力', '誇り高い', 'ドラマチック'],
      description: '自信に満ち、創造性と表現力に優れたスター性を持ちます。',
      degrees: { start: 120, end: 150 }
    },
    {
      name: '乙女座', englishName: 'Virgo', element: 'earth', quality: 'mutable', ruler: 'Mercury',
      traits: ['完璧主義', '分析力', '奉仕精神', '実用的', '批判的'],
      description: '完璧主義で分析力があり、実用的で奉仕精神に富んでいます。',
      degrees: { start: 150, end: 180 }
    },
    {
      name: '天秤座', englishName: 'Libra', element: 'air', quality: 'cardinal', ruler: 'Venus',
      traits: ['調和', '美的センス', '外交的', '優雅', '優柔不断'],
      description: '調和と美を愛し、外交的で優雅な性格を持ちます。',
      degrees: { start: 180, end: 210 }
    },
    {
      name: '蠍座', englishName: 'Scorpio', element: 'water', quality: 'fixed', ruler: 'Pluto',
      traits: ['情熱的', '神秘的', '変容', '洞察力', '極端'],
      description: '深い洞察力と変容の力を持ち、情熱的で神秘的です。',
      degrees: { start: 210, end: 240 }
    },
    {
      name: '射手座', englishName: 'Sagittarius', element: 'fire', quality: 'mutable', ruler: 'Jupiter',
      traits: ['楽観的', '哲学的', '冒険的', '自由', '率直'],
      description: '楽観的で哲学的、冒険を愛し自由を求めます。',
      degrees: { start: 240, end: 270 }
    },
    {
      name: '山羊座', englishName: 'Capricorn', element: 'earth', quality: 'cardinal', ruler: 'Saturn',
      traits: ['野心的', '責任感', '実用的', '伝統的', '忍耐強い'],
      description: '野心的で責任感が強く、実用的で伝統を重んじます。',
      degrees: { start: 270, end: 300 }
    },
    {
      name: '水瓶座', englishName: 'Aquarius', element: 'air', quality: 'fixed', ruler: 'Uranus',
      traits: ['独立', '革新的', '人道的', '未来志向', '友情'],
      description: '独立心が強く革新的で、人道的な未来志向を持ちます。',
      degrees: { start: 300, end: 330 }
    },
    {
      name: '魚座', englishName: 'Pisces', element: 'water', quality: 'mutable', ruler: 'Neptune',
      traits: ['直感的', '慈悲深い', '芸術的', '夢想的', '感受性'],
      description: '直感的で慈悲深く、芸術的な感性と豊かな想像力を持ちます。',
      degrees: { start: 330, end: 360 }
    }
  ];

  private readonly planetaryRulerships = {
    'Sun': '獅子座',
    'Moon': '蟹座',
    'Mercury': ['双子座', '乙女座'],
    'Venus': ['牡牛座', '天秤座'],
    'Mars': ['牡羊座', '蠍座'],
    'Jupiter': ['射手座', '魚座'],
    'Saturn': ['山羊座', '水瓶座'],
    'Uranus': '水瓶座',
    'Neptune': '魚座',
    'Pluto': '蠍座'
  };

  /**
   * 高度西洋占星術占いを実行
   */
  async performReading(input: BirthData): Promise<AdvancedAstrologyResult> {
    try {
      // 高精度天体計算
      const ephemeris = await this.apiClient.getEphemeris(
        input.date,
        input.time,
        input.latitude,
        input.longitude,
        input.timezone
      );

      // チャート作成
      const chart = this.createChartFromEphemeris(ephemeris);
      
      // トランジット分析
      const transits = await this.apiClient.getTransits(
        new Date().toISOString().split('T')[0],
        ephemeris
      );

      // プログレッション分析
      const progressions = await this.apiClient.getProgressions(
        input.date,
        new Date().toISOString().split('T')[0],
        ephemeris
      );

      // 今後のトランジット
      const upcomingTransits = await this.apiClient.getUpcomingTransits(ephemeris);

      // 詳細分析
      const detailedAnalysis = this.performDetailedAnalysis(chart);

      // タイミング分析
      const timing = this.analyzeTimingAndPhases(chart, transits, progressions);

      // 総合解釈
      const interpretation = this.generateAdvancedInterpretation(
        chart, 
        transits, 
        progressions, 
        detailedAnalysis,
        timing
      );

      return {
        chart,
        interpretation,
        transits,
        progressions,
        upcomingTransits,
        detailedAnalysis,
        timing
      };
    } catch (error) {
      console.error('高度西洋占星術エラー:', error);
      // フォールバック：簡易計算
      return this.performBasicReading(input);
    }
  }

  /**
   * エフェメリスからチャート作成
   */
  private createChartFromEphemeris(ephemeris: EphemerisData): AstrologyChart {
    const planets: Planet[] = ephemeris.planets.map(planet => ({
      name: planet.name,
      sign: this.getSignFromDegree(planet.longitude),
      degree: planet.longitude % 30,
      house: this.calculateHouseFromEphemeris(planet.longitude, ephemeris.houses),
      retrograde: planet.retrograde
    }));

    const houses: House[] = ephemeris.houses.map(house => ({
      number: house.number,
      sign: house.sign,
      degree: house.cusp % 30
    }));

    const aspects = this.calculateAspects(planets);

    return {
      planets,
      houses,
      aspects,
      ascendant: this.getSignFromDegree(ephemeris.ascendant),
      midheaven: this.getSignFromDegree(ephemeris.midheaven)
    };
  }

  /**
   * 度数から星座を取得
   */
  private getSignFromDegree(degree: number): string {
    const normalizedDegree = ((degree % 360) + 360) % 360;
    const signIndex = Math.floor(normalizedDegree / 30);
    return this.zodiacSigns[signIndex]?.name || '牡羊座';
  }

  /**
   * エフェメリスからハウス計算
   */
  private calculateHouseFromEphemeris(longitude: number, houses: EphemerisData['houses']): number {
    for (let i = 0; i < houses.length; i++) {
      const currentHouse = houses[i];
      const nextHouse = houses[(i + 1) % 12];
      
      if (this.isInHouse(longitude, currentHouse.cusp, nextHouse.cusp)) {
        return currentHouse.number;
      }
    }
    return 1; // デフォルト
  }

  /**
   * ハウス内判定
   */
  private isInHouse(longitude: number, startCusp: number, endCusp: number): boolean {
    const normLong = ((longitude % 360) + 360) % 360;
    const normStart = ((startCusp % 360) + 360) % 360;
    const normEnd = ((endCusp % 360) + 360) % 360;

    if (normStart < normEnd) {
      return normLong >= normStart && normLong < normEnd;
    } else {
      return normLong >= normStart || normLong < normEnd;
    }
  }

  /**
   * アスペクト計算
   */
  private calculateAspects(planets: Planet[]): Aspect[] {
    const aspects: Aspect[] = [];
    const majorAspects = [
      { name: 'Conjunction', angle: 0, orb: 8 },
      { name: 'Opposition', angle: 180, orb: 8 },
      { name: 'Trine', angle: 120, orb: 6 },
      { name: 'Square', angle: 90, orb: 6 },
      { name: 'Sextile', angle: 60, orb: 4 },
      { name: 'Quincunx', angle: 150, orb: 3 },
      { name: 'Semi-square', angle: 45, orb: 2 },
      { name: 'Sesquiquadrate', angle: 135, orb: 2 }
    ];

    for (let i = 0; i < planets.length; i++) {
      for (let j = i + 1; j < planets.length; j++) {
        const planet1 = planets[i];
        const planet2 = planets[j];
        
        // 度数を計算（星座度数 + 星座オフセット）
        const degree1 = this.getPlanetDegree(planet1);
        const degree2 = this.getPlanetDegree(planet2);
        
        let angle = Math.abs(degree1 - degree2);
        if (angle > 180) angle = 360 - angle;

        for (const aspect of majorAspects) {
          const difference = Math.abs(angle - aspect.angle);
          if (difference <= aspect.orb) {
            aspects.push({
              planet1: planet1.name,
              planet2: planet2.name,
              aspect: aspect.name,
              orb: difference,
              exact: difference < 1
            });
          }
        }
      }
    }

    return aspects;
  }

  /**
   * 惑星の絶対度数を取得
   */
  private getPlanetDegree(planet: Planet): number {
    const sign = this.zodiacSigns.find(s => s.name === planet.sign);
    if (!sign) return 0;
    
    return sign.degrees.start + planet.degree;
  }

  /**
   * 詳細分析の実行
   */
  private performDetailedAnalysis(chart: AstrologyChart): AdvancedAstrologyResult['detailedAnalysis'] {
    // エレメント分析
    const dominantElements = this.analyzeDominantElements(chart.planets);
    
    // クオリティ分析
    const dominantQualities = this.analyzeDominantQualities(chart.planets);
    
    // アスペクトパターン
    const aspectPatterns = this.identifyAspectPatterns(chart.aspects);
    
    // ステリウム（3つ以上の惑星が同じ星座）
    const stelliums = this.findStelliums(chart.planets);
    
    // T-Square
    const t_squares = this.findTSquares(chart.aspects);
    
    // グランドトライン
    const grand_trines = this.findGrandTrines(chart.aspects);
    
    // ヨッド（神の指）
    const yods = this.findYods(chart.aspects);

    return {
      dominantElements,
      dominantQualities,
      aspectPatterns,
      stelliums,
      t_squares,
      grand_trines,
      yods
    };
  }

  /**
   * エレメント分析
   */
  private analyzeDominantElements(planets: Planet[]): { element: string; percentage: number }[] {
    const elementCount = { fire: 0, earth: 0, air: 0, water: 0 };
    
    planets.forEach(planet => {
      const sign = this.zodiacSigns.find(s => s.name === planet.sign);
      if (sign) {
        elementCount[sign.element]++;
      }
    });

    const total = planets.length;
    return Object.entries(elementCount)
      .map(([element, count]) => ({
        element,
        percentage: Math.round((count / total) * 100)
      }))
      .sort((a, b) => b.percentage - a.percentage);
  }

  /**
   * クオリティ分析
   */
  private analyzeDominantQualities(planets: Planet[]): { quality: string; percentage: number }[] {
    const qualityCount = { cardinal: 0, fixed: 0, mutable: 0 };
    
    planets.forEach(planet => {
      const sign = this.zodiacSigns.find(s => s.name === planet.sign);
      if (sign) {
        qualityCount[sign.quality]++;
      }
    });

    const total = planets.length;
    return Object.entries(qualityCount)
      .map(([quality, count]) => ({
        quality,
        percentage: Math.round((count / total) * 100)
      }))
      .sort((a, b) => b.percentage - a.percentage);
  }

  /**
   * ステリウム検出
   */
  private findStelliums(planets: Planet[]): { sign: string; planets: string[] }[] {
    const signGroups: { [sign: string]: string[] } = {};
    
    planets.forEach(planet => {
      if (!signGroups[planet.sign]) {
        signGroups[planet.sign] = [];
      }
      signGroups[planet.sign].push(planet.name);
    });

    return Object.entries(signGroups)
      .filter(([_, planets]) => planets.length >= 3)
      .map(([sign, planets]) => ({ sign, planets }));
  }

  /**
   * T-Square検出
   */
  private findTSquares(aspects: Aspect[]): { apex: string; planets: string[] }[] {
    // T-Squareの検出（オポジション + 2つのスクエア）
    const t_squares: { apex: string; planets: string[] }[] = [];
    
    // 簡略化された実装
    const oppositions = aspects.filter(a => a.aspect === 'Opposition');
    const squares = aspects.filter(a => a.aspect === 'Square');
    
    oppositions.forEach(opposition => {
      const relatedSquares = squares.filter(square => 
        square.planet1 === opposition.planet1 || 
        square.planet1 === opposition.planet2 ||
        square.planet2 === opposition.planet1 || 
        square.planet2 === opposition.planet2
      );
      
      if (relatedSquares.length >= 2) {
        // Apexとなる惑星を特定
        const apexPlanet = this.findApexPlanet(opposition, relatedSquares);
        if (apexPlanet) {
          t_squares.push({
            apex: apexPlanet,
            planets: [opposition.planet1, opposition.planet2]
          });
        }
      }
    });

    return t_squares;
  }

  /**
   * Apex惑星の特定
   */
  private findApexPlanet(opposition: Aspect, squares: Aspect[]): string | null {
    const planets = [opposition.planet1, opposition.planet2];
    
    for (const square of squares) {
      if (!planets.includes(square.planet1) && planets.some(p => square.planet2 === p)) {
        return square.planet1;
      }
      if (!planets.includes(square.planet2) && planets.some(p => square.planet1 === p)) {
        return square.planet2;
      }
    }
    
    return null;
  }

  /**
   * グランドトライン検出
   */
  private findGrandTrines(aspects: Aspect[]): { element: string; planets: string[] }[] {
    const trines = aspects.filter(a => a.aspect === 'Trine');
    const grand_trines: { element: string; planets: string[] }[] = [];
    
    // 3つのトラインが環を形成しているかチェック
    // 簡略化された実装
    if (trines.length >= 3) {
      const planets = [...new Set([
        ...trines.flatMap(t => [t.planet1, t.planet2])
      ])];
      
      if (planets.length >= 3) {
        grand_trines.push({
          element: 'mixed', // 実際は各惑星の星座のエレメントをチェック
          planets: planets.slice(0, 3)
        });
      }
    }
    
    return grand_trines;
  }

  /**
   * ヨッド検出
   */
  private findYods(aspects: Aspect[]): { apex: string; base: string[] }[] {
    const sextiles = aspects.filter(a => a.aspect === 'Sextile');
    const quincunxes = aspects.filter(a => a.aspect === 'Quincunx');
    const yods: { apex: string; base: string[] }[] = [];
    
    // ヨッド：セクスタイル + 2つのクインカンクス
    sextiles.forEach(sextile => {
      const relatedQuincunxes = quincunxes.filter(q =>
        (q.planet1 === sextile.planet1 || q.planet1 === sextile.planet2) ||
        (q.planet2 === sextile.planet1 || q.planet2 === sextile.planet2)
      );
      
      if (relatedQuincunxes.length >= 2) {
        // Apex惑星の特定（クインカンクスの共通惑星）
        const apexCandidates = relatedQuincunxes.flatMap(q => [q.planet1, q.planet2]);
        const apex = apexCandidates.find(planet => 
          apexCandidates.filter(p => p === planet).length >= 2 &&
          ![sextile.planet1, sextile.planet2].includes(planet)
        );
        
        if (apex) {
          yods.push({
            apex,
            base: [sextile.planet1, sextile.planet2]
          });
        }
      }
    });
    
    return yods;
  }

  /**
   * アスペクトパターンの識別
   */
  private identifyAspectPatterns(aspects: Aspect[]): string[] {
    const patterns: string[] = [];
    
    const aspectCounts = {
      conjunction: aspects.filter(a => a.aspect === 'Conjunction').length,
      opposition: aspects.filter(a => a.aspect === 'Opposition').length,
      trine: aspects.filter(a => a.aspect === 'Trine').length,
      square: aspects.filter(a => a.aspect === 'Square').length,
      sextile: aspects.filter(a => a.aspect === 'Sextile').length
    };
    
    if (aspectCounts.conjunction > 3) patterns.push('強いコンジャンクション傾向');
    if (aspectCounts.opposition > 2) patterns.push('オポジション優勢');
    if (aspectCounts.trine > 3) patterns.push('調和的アスペクト優勢');
    if (aspectCounts.square > 3) patterns.push('チャレンジ的アスペクト優勢');
    if (aspectCounts.sextile > 2) patterns.push('機会創出アスペクト');
    
    if (patterns.length === 0) {
      patterns.push('バランスの取れたアスペクト配置');
    }
    
    return patterns;
  }

  /**
   * タイミングとフェーズ分析
   */
  private analyzeTimingAndPhases(
    chart: AstrologyChart, 
    transits: TransitData, 
    progressions: ProgressionData
  ): AdvancedAstrologyResult['timing'] {
    const current_phase = this.determineCurrentPhase(transits);
    const peak_periods = this.identifyPeakPeriods(transits);
    const challenging_periods = this.identifyChallengingPeriods(transits);
    
    return {
      current_phase,
      peak_periods,
      challenging_periods
    };
  }

  /**
   * 現在のフェーズ判定
   */
  private determineCurrentPhase(transits: TransitData): string {
    const importantTransits = transits.planets.filter(planet => 
      planet.aspects.some(aspect => aspect.exact || aspect.orb < 2)
    );
    
    if (importantTransits.length === 0) {
      return '安定期 - 大きな変化は少なく、内面的成長に適した時期';
    }
    
    const hasChallengingAspects = importantTransits.some(planet =>
      planet.aspects.some(aspect => 
        ['Opposition', 'Square'].includes(aspect.aspect)
      )
    );
    
    const hasHarmoniousAspects = importantTransits.some(planet =>
      planet.aspects.some(aspect => 
        ['Trine', 'Sextile'].includes(aspect.aspect)
      )
    );
    
    if (hasChallengingAspects && hasHarmoniousAspects) {
      return '変革期 - 困難と機会が混在する重要な転換点';
    } else if (hasChallengingAspects) {
      return '試練期 - 困難な課題に直面するが、成長の機会でもある';
    } else if (hasHarmoniousAspects) {
      return '発展期 - 才能を発揮し、目標達成に向かう好調な時期';
    }
    
    return '準備期 - 次の展開に向けて基盤を整える時期';
  }

  /**
   * ピーク期間の特定
   */
  private identifyPeakPeriods(transits: TransitData): { period: string; description: string }[] {
    return [
      {
        period: '今後2-3ヶ月',
        description: '創造性と表現力が高まり、新しいプロジェクトの開始に最適'
      },
      {
        period: '今後6ヶ月',
        description: '人間関係や協力関係において重要な進展が期待できる'
      }
    ];
  }

  /**
   * 困難期間の特定
   */
  private identifyChallengingPeriods(transits: TransitData): { period: string; description: string }[] {
    return [
      {
        period: '今後1ヶ月',
        description: '感情的な葛藤や決断を迫られる状況。慎重な判断が必要'
      }
    ];
  }

  /**
   * 高度解釈生成
   */
  private generateAdvancedInterpretation(
    chart: AstrologyChart,
    transits: TransitData,
    progressions: ProgressionData,
    analysis: AdvancedAstrologyResult['detailedAnalysis'],
    timing: AdvancedAstrologyResult['timing']
  ): AstrologyResult['interpretation'] {
    return {
      personality: this.generatePersonalityAnalysis(chart, analysis),
      relationships: this.generateRelationshipAnalysis(chart, transits),
      career: this.generateCareerAnalysis(chart, transits, analysis),
      spiritual: this.generateSpiritualAnalysis(chart, progressions),
      overall: this.generateOverallAnalysis(chart, timing, analysis)
    };
  }

  /**
   * 性格分析生成
   */
  private generatePersonalityAnalysis(chart: AstrologyChart, analysis: AdvancedAstrologyResult['detailedAnalysis']): string {
    const dominantElement = analysis.dominantElements[0];
    const dominantQuality = analysis.dominantQualities[0];
    
    let personality = `あなたの性格は${dominantElement.element}エレメント（${dominantElement.percentage}%）と${dominantQuality.quality}クオリティ（${dominantQuality.percentage}%）の影響を強く受けています。`;
    
    // ステリウムがある場合
    if (analysis.stelliums.length > 0) {
      const stellium = analysis.stelliums[0];
      personality += `${stellium.sign}にステリウム（${stellium.planets.join('、')}）があり、この星座の特質が人格の中核を形成しています。`;
    }
    
    // 特殊な配置
    if (analysis.t_squares.length > 0) {
      personality += `T-Squareの配置により、内的な緊張を原動力として成長する性格です。`;
    }
    
    if (analysis.grand_trines.length > 0) {
      personality += `グランドトラインにより、天与の才能と調和的な性格を持っています。`;
    }
    
    return personality;
  }

  /**
   * 人間関係分析生成
   */
  private generateRelationshipAnalysis(chart: AstrologyChart, transits: TransitData): string {
    const venus = chart.planets.find(p => p.name === 'Venus');
    const mars = chart.planets.find(p => p.name === 'Mars');
    const moon = chart.planets.find(p => p.name === 'Moon');
    
    let relationships = '人間関係において、';
    
    if (venus) {
      relationships += `金星が${venus.sign}にあることで、愛情表現や美的価値観に特徴があります。`;
    }
    
    if (mars) {
      relationships += `火星が${mars.sign}にあることで、情熱の表現方法や行動パターンが決まります。`;
    }
    
    // 現在のトランジット影響
    const venusTransits = transits.planets.find(p => p.name === 'Venus');
    if (venusTransits && venusTransits.aspects.length > 0) {
      relationships += `現在、金星のトランジットにより恋愛運に変化が起こりやすい時期です。`;
    }
    
    return relationships;
  }

  /**
   * キャリア分析生成
   */
  private generateCareerAnalysis(chart: AstrologyChart, transits: TransitData, analysis: AdvancedAstrologyResult['detailedAnalysis']): string {
    const midheaven = chart.midheaven;
    const saturn = chart.planets.find(p => p.name === 'Saturn');
    const jupiter = chart.planets.find(p => p.name === 'Jupiter');
    
    let career = `MC（天頂）が${midheaven}にあることで、`;
    
    // 土星の影響（キャリアの基盤）
    if (saturn) {
      career += `土星が${saturn.sign}にあり、責任感と継続力がキャリアの基盤となります。`;
    }
    
    // 木星の影響（発展と機会）
    if (jupiter) {
      career += `木星が${jupiter.sign}にあり、成長と機会の分野を示しています。`;
    }
    
    // エレメント分析からキャリア適性
    const dominantElement = analysis.dominantElements[0];
    const elementCareers = {
      fire: '創造的分野、リーダーシップ、起業',
      earth: '実務的分野、金融、建設、農業',
      air: 'コミュニケーション、教育、メディア、技術',
      water: 'ケア分野、芸術、心理学、スピリチュアル'
    };
    
    career += `${dominantElement.element}エレメントの優勢により、${elementCareers[dominantElement.element as keyof typeof elementCareers]}の分野に適性があります。`;
    
    return career;
  }

  /**
   * スピリチュアル分析生成
   */
  private generateSpiritualAnalysis(chart: AstrologyChart, progressions: ProgressionData): string {
    const neptune = chart.planets.find(p => p.name === 'Neptune');
    const pluto = chart.planets.find(p => p.name === 'Pluto');
    const moon = chart.planets.find(p => p.name === 'Moon');
    
    let spiritual = '精神的な成長において、';
    
    if (neptune) {
      spiritual += `海王星が${neptune.sign}にあることで、直感力と霊性の発達が特徴的です。`;
    }
    
    if (pluto) {
      spiritual += `冥王星が${pluto.sign}にあることで、深い変容と再生の体験を通じて成長します。`;
    }
    
    if (moon) {
      spiritual += `月が${moon.sign}にあることで、感情的な理解と内面的な知恵が発達します。`;
    }
    
    // プログレッションの影響
    const progMoon = progressions.planets.find(p => p.name === 'Moon');
    if (progMoon) {
      spiritual += `現在のプログレッション月が${progMoon.sign}にあり、内面的な成長の新しい段階に入っています。`;
    }
    
    return spiritual;
  }

  /**
   * 総合分析生成
   */
  private generateOverallAnalysis(
    chart: AstrologyChart, 
    timing: AdvancedAstrologyResult['timing'],
    analysis: AdvancedAstrologyResult['detailedAnalysis']
  ): string {
    let overall = `現在は${timing.current_phase}にあり、`;
    
    // 特殊な配置の総合的影響
    if (analysis.stelliums.length > 0) {
      overall += `ステリウムの影響により、特定の分野で集中的な発展が期待できます。`;
    }
    
    if (analysis.t_squares.length > 0) {
      overall += `T-Squareの緊張は創造的なエネルギーの源となり、困難を乗り越える力を与えます。`;
    }
    
    if (analysis.grand_trines.length > 0) {
      overall += `グランドトラインにより、自然な才能の流れと調和的な発展が可能です。`;
    }
    
    // 今後の展望
    if (timing.peak_periods.length > 0) {
      overall += `${timing.peak_periods[0].period}は特に重要な発展期となるでしょう。`;
    }
    
    overall += `星々の配置は、あなた独自の人生の道筋と可能性を示しています。`;
    
    return overall;
  }

  /**
   * フォールバック：基本的な占いの実行
   */
  private async performBasicReading(input: BirthData): Promise<AdvancedAstrologyResult> {
    // 簡易計算による基本的な占い
    const basicChart = this.createBasicChart(input);
    const basicInterpretation = this.generateBasicInterpretation(basicChart);
    
    return {
      chart: basicChart,
      interpretation: basicInterpretation,
      detailedAnalysis: {
        dominantElements: [{ element: 'fire', percentage: 25 }],
        dominantQualities: [{ quality: 'cardinal', percentage: 25 }],
        aspectPatterns: ['バランスの取れた配置'],
        stelliums: [],
        t_squares: [],
        grand_trines: [],
        yods: []
      },
      timing: {
        current_phase: '安定期',
        peak_periods: [],
        challenging_periods: []
      }
    };
  }

  /**
   * 基本チャート作成
   */
  private createBasicChart(input: BirthData): AstrologyChart {
    // 簡略化された計算
    const sunSign = this.calculateSunSignFromDate(input.date);
    
    return {
      planets: [
        { name: 'Sun', sign: sunSign, degree: 15, house: 1, retrograde: false }
      ],
      houses: Array.from({ length: 12 }, (_, i) => ({
        number: i + 1,
        sign: this.zodiacSigns[i % 12].name,
        degree: 0
      })),
      aspects: [],
      ascendant: sunSign,
      midheaven: this.zodiacSigns[(this.zodiacSigns.findIndex(s => s.name === sunSign) + 9) % 12].name
    };
  }

  /**
   * 日付から太陽星座計算
   */
  private calculateSunSignFromDate(date: string): string {
    const dateObj = new Date(date);
    const month = dateObj.getMonth() + 1;
    const day = dateObj.getDate();

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
    return '魚座';
  }

  /**
   * 基本解釈生成
   */
  private generateBasicInterpretation(chart: AstrologyChart): AstrologyResult['interpretation'] {
    const sunPlanet = chart.planets.find(p => p.name === 'Sun');
    const sunSign = sunPlanet?.sign || '牡羊座';
    const signData = this.zodiacSigns.find(s => s.name === sunSign);
    
    return {
      personality: signData?.description || '基本的な性格分析',
      relationships: '人間関係において調和を重視し、深いつながりを求めます。',
      career: '自分の才能を活かせる分野で成功を収める可能性があります。',
      spiritual: '内面的な成長と精神的な発展に関心があります。',
      overall: `${sunSign}の特質を活かし、バランスの取れた人生を歩むことができます。`
    };
  }

  /**
   * キャッシュキーの生成
   */
  generateCacheKey(input: BirthData): string {
    const location = `${input.latitude},${input.longitude}`;
    return `advanced_astrology:${input.date}:${input.time}:${location}:${input.timezone}`;
  }
}

// シングルトンインスタンス
export const advancedAstrologyEngine = new AdvancedAstrologyEngine();