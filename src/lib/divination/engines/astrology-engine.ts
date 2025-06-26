import { BaseDivinationEngine, DivinationInput, EnvironmentData } from '../base-engine';

// 天体の定義
export interface CelestialBody {
  name: string;
  symbol: string;
  position: number; // 黄道上の度数（0-360）
  sign: string; // 星座
  house: number; // ハウス
  retrograde: boolean;
}

// アスペクト（天体間の角度関係）
export interface Aspect {
  planet1: string;
  planet2: string;
  angle: number;
  type: string; // conjunction, sextile, square, trine, opposition
  orb: number; // 許容誤差
  strength: number; // 影響の強さ
}

// 占星術の結果
export interface AstrologyReading {
  birthChart: {
    ascendant: string; // アセンダント（上昇宮）
    midheaven: string; // MC（天頂）
    sun: CelestialBody;
    moon: CelestialBody;
    mercury: CelestialBody;
    venus: CelestialBody;
    mars: CelestialBody;
    jupiter: CelestialBody;
    saturn: CelestialBody;
    uranus: CelestialBody;
    neptune: CelestialBody;
    pluto: CelestialBody;
  };
  houses: Array<{
    number: number;
    sign: string;
    planets: string[];
    meaning: string;
  }>;
  aspects: Aspect[];
  interpretation: {
    personality: {
      classical: string;
      modern: string;
      psychological: string;
    };
    emotions: {
      classical: string;
      modern: string;
      psychological: string;
    };
    communication: {
      classical: string;
      modern: string;
      practical: string;
    };
    relationships: {
      classical: string;
      modern: string;
      compatibility: string;
    };
    career: {
      classical: string;
      modern: string;
      practical: string;
    };
    spirituality: {
      classical: string;
      modern: string;
      newAge: string;
    };
    currentInfluences: string;
  };
  transitInfluence?: string;
  environmentalSynchronicity?: string;
}

export class AstrologyEngine extends BaseDivinationEngine<AstrologyReading> {
  private readonly zodiacSigns = [
    '牡羊座', '牡牛座', '双子座', '蟹座', '獅子座', '乙女座',
    '天秤座', '蠍座', '射手座', '山羊座', '水瓶座', '魚座'
  ];

  private readonly planetSymbols: Record<string, string> = {
    sun: '☉', moon: '☽', mercury: '☿', venus: '♀', mars: '♂',
    jupiter: '♃', saturn: '♄', uranus: '♅', neptune: '♆', pluto: '♇'
  };

  private readonly aspectTypes = [
    { name: 'conjunction', symbol: '☌', angle: 0, orb: 8, nature: 'neutral' },
    { name: 'sextile', symbol: '⚹', angle: 60, orb: 6, nature: 'harmonious' },
    { name: 'square', symbol: '□', angle: 90, orb: 8, nature: 'challenging' },
    { name: 'trine', symbol: '△', angle: 120, orb: 8, nature: 'harmonious' },
    { name: 'opposition', symbol: '☍', angle: 180, orb: 8, nature: 'challenging' }
  ];

  calculate(): AstrologyReading {
    const birthChart = this.calculateBirthChart();
    const houses = this.calculateHouses(birthChart);
    const aspects = this.calculateAspects(birthChart);
    const interpretation = this.generateComprehensiveInterpretation(birthChart, houses, aspects);
    
    const transitInfluence = this.calculateTransitInfluence();
    const environmentalSynchronicity = this.getEnvironmentalSynchronicity();

    return {
      birthChart,
      houses,
      aspects,
      interpretation,
      transitInfluence,
      environmentalSynchronicity
    };
  }

  private calculateBirthChart(): AstrologyReading['birthChart'] {
    // 簡易的な天体位置計算（実際は天文暦が必要）
    const birthTime = this.input.birthDate.getTime();
    const seed = this.generateSeed();
    
    // アセンダントの計算（簡易版）
    const ascendantDegree = (seed % 360);
    const ascendant = this.getZodiacSign(ascendantDegree);
    
    // MCの計算
    const mcDegree = (ascendantDegree + 270) % 360;
    const midheaven = this.getZodiacSign(mcDegree);

    // 各天体の位置を計算（簡易的なシミュレーション）
    const planets = {
      sun: this.calculatePlanetPosition('sun', birthTime, seed),
      moon: this.calculatePlanetPosition('moon', birthTime, seed * 2),
      mercury: this.calculatePlanetPosition('mercury', birthTime, seed * 3),
      venus: this.calculatePlanetPosition('venus', birthTime, seed * 4),
      mars: this.calculatePlanetPosition('mars', birthTime, seed * 5),
      jupiter: this.calculatePlanetPosition('jupiter', birthTime, seed * 6),
      saturn: this.calculatePlanetPosition('saturn', birthTime, seed * 7),
      uranus: this.calculatePlanetPosition('uranus', birthTime, seed * 8),
      neptune: this.calculatePlanetPosition('neptune', birthTime, seed * 9),
      pluto: this.calculatePlanetPosition('pluto', birthTime, seed * 10)
    };

    return {
      ascendant,
      midheaven,
      ...planets
    };
  }

  private calculatePlanetPosition(planet: string, birthTime: number, seed: number): CelestialBody {
    // 各天体の公転周期（日）
    const orbitalPeriods: Record<string, number> = {
      sun: 365.25,
      moon: 27.32,
      mercury: 87.97,
      venus: 224.70,
      mars: 686.98,
      jupiter: 4332.59,
      saturn: 10759.22,
      uranus: 30688.5,
      neptune: 60182,
      pluto: 90560
    };

    const period = orbitalPeriods[planet] || 365.25;
    const daysSinceBirth = (Date.now() - birthTime) / (1000 * 60 * 60 * 24);
    
    // 位置計算（簡易版）
    const basePosition = (seed % 360);
    const movement = (daysSinceBirth / period) * 360;
    const position = (basePosition + movement) % 360;
    
    // 逆行の判定（簡易版）
    const retrograde = (seed % 10) > 7 && planet !== 'sun' && planet !== 'moon';
    
    // ハウスの計算
    const house = Math.floor(position / 30) + 1;

    return {
      name: planet,
      symbol: this.planetSymbols[planet],
      position: Math.round(position),
      sign: this.getZodiacSign(position),
      house,
      retrograde
    };
  }

  private getZodiacSign(degree: number): string {
    const signIndex = Math.floor(degree / 30);
    return this.zodiacSigns[signIndex];
  }

  private calculateHouses(birthChart: AstrologyReading['birthChart']): AstrologyReading['houses'] {
    const houses: AstrologyReading['houses'] = [];
    const houseMeanings = [
      '自己・人格・外見',
      '所有・価値観・才能',
      'コミュニケーション・学習',
      '家庭・基盤・ルーツ',
      '創造性・恋愛・子供',
      '健康・仕事・奉仕',
      'パートナーシップ・結婚',
      '変容・共有・神秘',
      '高等教育・哲学・旅行',
      'キャリア・社会的地位',
      '友情・理想・グループ',
      '潜在意識・秘密・スピリチュアル'
    ];

    // 各ハウスの情報を生成
    for (let i = 0; i < 12; i++) {
      const houseNumber = i + 1;
      const houseDegree = (parseFloat(birthChart.ascendant) + i * 30) % 360;
      const sign = this.getZodiacSign(houseDegree);
      
      // このハウスにある天体を探す
      const planets: string[] = [];
      Object.entries(birthChart).forEach(([key, value]) => {
        if (typeof value === 'object' && 'house' in value && value.house === houseNumber) {
          planets.push(key);
        }
      });

      houses.push({
        number: houseNumber,
        sign,
        planets,
        meaning: houseMeanings[i]
      });
    }

    return houses;
  }

  private calculateAspects(birthChart: AstrologyReading['birthChart']): Aspect[] {
    const aspects: Aspect[] = [];
    const planets = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];
    
    // 各天体間のアスペクトを計算
    for (let i = 0; i < planets.length; i++) {
      for (let j = i + 1; j < planets.length; j++) {
        const planet1 = planets[i];
        const planet2 = planets[j];
        const body1 = birthChart[planet1 as keyof typeof birthChart] as CelestialBody;
        const body2 = birthChart[planet2 as keyof typeof birthChart] as CelestialBody;
        
        if (body1 && body2) {
          const angle = this.calculateAngle(body1.position, body2.position);
          const aspect = this.identifyAspect(angle);
          
          if (aspect) {
            aspects.push({
              planet1,
              planet2,
              angle,
              type: aspect.name,
              orb: Math.abs(angle - aspect.angle),
              strength: 1 - (Math.abs(angle - aspect.angle) / aspect.orb)
            });
          }
        }
      }
    }
    
    // 強度順にソート
    return aspects.sort((a, b) => b.strength - a.strength);
  }

  private calculateAngle(pos1: number, pos2: number): number {
    let angle = Math.abs(pos1 - pos2);
    if (angle > 180) {
      angle = 360 - angle;
    }
    return angle;
  }

  private identifyAspect(angle: number): typeof this.aspectTypes[0] | null {
    for (const aspectType of this.aspectTypes) {
      if (Math.abs(angle - aspectType.angle) <= aspectType.orb) {
        return aspectType;
      }
    }
    return null;
  }

  private generateComprehensiveInterpretation(
    birthChart: AstrologyReading['birthChart'],
    houses: AstrologyReading['houses'],
    aspects: Aspect[]
  ): AstrologyReading['interpretation'] {
    const timeModifier = this.getTimeModifier();
    const environmentModifier = this.getEnvironmentalModifier();
    
    return {
      personality: {
        classical: this.interpretPersonalityClassical(birthChart, aspects),
        modern: this.interpretPersonalityModern(birthChart, aspects),
        psychological: this.interpretPersonalityPsychological(birthChart, aspects)
      },
      emotions: {
        classical: this.interpretEmotionsClassical(birthChart, aspects),
        modern: this.interpretEmotionsModern(birthChart, aspects),
        psychological: this.interpretEmotionsPsychological(birthChart, aspects)
      },
      communication: {
        classical: this.interpretCommunicationClassical(birthChart, aspects),
        modern: this.interpretCommunicationModern(birthChart, aspects),
        practical: this.interpretCommunicationPractical(birthChart, aspects)
      },
      relationships: {
        classical: this.interpretRelationshipsClassical(birthChart, aspects),
        modern: this.interpretRelationshipsModern(birthChart, aspects),
        compatibility: this.interpretRelationshipsCompatibility(birthChart, aspects)
      },
      career: {
        classical: this.interpretCareerClassical(birthChart, houses),
        modern: this.interpretCareerModern(birthChart, houses),
        practical: this.interpretCareerPractical(birthChart, houses)
      },
      spirituality: {
        classical: this.interpretSpiritualityClassical(birthChart, houses),
        modern: this.interpretSpiritualityModern(birthChart, houses),
        newAge: this.interpretSpiritualityNewAge(birthChart, houses)
      },
      currentInfluences: this.interpretCurrentInfluences(birthChart, timeModifier, environmentModifier)
    };
  }

  private interpretPersonalityClassical(birthChart: AstrologyReading['birthChart'], aspects: Aspect[]): string {
    const sun = birthChart.sun;
    const ascendant = birthChart.ascendant;
    
    let interpretation = `太陽が${sun.sign}にあり、アセンダントが${ascendant}のあなたは、`;
    
    // 太陽星座の基本性質
    const sunSignTraits: Record<string, string> = {
      '牡羊座': '積極的で開拓精神に富み、リーダーシップを発揮する',
      '牡牛座': '堅実で忍耐強く、美的センスに優れている',
      '双子座': '知的好奇心が強く、コミュニケーション能力が高い',
      '蟹座': '感受性豊かで、家族や仲間を大切にする',
      '獅子座': '創造的で自信に満ち、人を惹きつける魅力がある',
      '乙女座': '分析的で完璧主義、細部にこだわる',
      '天秤座': '調和を重んじ、美的センスと社交性に優れる',
      '蠍座': '情熱的で洞察力があり、深い絆を求める',
      '射手座': '楽観的で冒険心があり、自由を愛する',
      '山羊座': '責任感が強く、着実に目標を達成する',
      '水瓶座': '独創的で人道主義的、既成概念にとらわれない',
      '魚座': '直感的で共感力が高く、芸術的センスがある'
    };
    
    interpretation += sunSignTraits[sun.sign] || '独自の個性を持つ';
    interpretation += '性質があります。';
    
    // 主要なアスペクトの影響
    const sunAspects = aspects.filter(a => a.planet1 === 'sun' || a.planet2 === 'sun');
    if (sunAspects.length > 0) {
      const strongestAspect = sunAspects[0];
      const otherPlanet = strongestAspect.planet1 === 'sun' ? strongestAspect.planet2 : strongestAspect.planet1;
      
      if (strongestAspect.type === 'conjunction') {
        interpretation += `特に${otherPlanet}との合の影響で、その特質が強調されています。`;
      } else if (strongestAspect.type === 'trine' || strongestAspect.type === 'sextile') {
        interpretation += `${otherPlanet}との調和的な関係により、才能が開花しやすいでしょう。`;
      } else if (strongestAspect.type === 'square' || strongestAspect.type === 'opposition') {
        interpretation += `${otherPlanet}との緊張関係が、成長のための課題となっています。`;
      }
    }
    
    return interpretation;
  }

  private interpretEmotionsClassical(birthChart: AstrologyReading['birthChart'], aspects: Aspect[]): string {
    const moon = birthChart.moon;
    
    const moonSignEmotions: Record<string, string> = {
      '牡羊座': '感情表現が直接的で、すぐに行動に移す',
      '牡牛座': '感情が安定しており、変化を好まない',
      '双子座': '感情が変わりやすく、理性的に処理する',
      '蟹座': '感情豊かで、家族や親しい人を大切にする',
      '獅子座': '感情表現が豊かで、注目を求める',
      '乙女座': '感情を分析し、実用的に対処する',
      '天秤座': '感情のバランスを保ち、調和を求める',
      '蠍座': '感情が深く激しく、変容を経験する',
      '射手座': '楽観的で、感情を哲学的に捉える',
      '山羊座': '感情を抑制し、責任感を持って対処する',
      '水瓶座': '感情から距離を置き、客観的に見る',
      '魚座': '共感力が高く、他者の感情を吸収する'
    };
    
    let interpretation = `月が${moon.sign}にあるあなたは、`;
    interpretation += moonSignEmotions[moon.sign] || '独特の感情パターンを持つ';
    interpretation += '傾向があります。';
    
    if (moon.house === 4 || moon.house === 12) {
      interpretation += '特に家庭環境や潜在意識が感情生活に大きく影響しています。';
    }
    
    return interpretation;
  }

  private interpretCommunicationClassical(birthChart: AstrologyReading['birthChart'], aspects: Aspect[]): string {
    const mercury = birthChart.mercury;
    
    let interpretation = `水星が${mercury.sign}にあることから、`;
    
    const mercurySignTraits: Record<string, string> = {
      '牡羊座': '直接的で素早い思考、議論を好む',
      '牡牛座': '実用的で着実な思考、じっくり考える',
      '双子座': '多才で柔軟な思考、情報収集が得意',
      '蟹座': '感情的で直感的な思考、記憶力が良い',
      '獅子座': '創造的で自信に満ちた表現、ドラマチック',
      '乙女座': '分析的で詳細な思考、批判的精神',
      '天秤座': '公平でバランスの取れた思考、外交的',
      '蠍座': '深く洞察的な思考、秘密を見抜く',
      '射手座': '哲学的で楽観的な思考、大局を見る',
      '山羊座': '実際的で構造的な思考、目標志向',
      '水瓶座': '独創的で革新的な思考、既成概念を破る',
      '魚座': '直感的で想像力豊かな思考、詩的表現'
    };
    
    interpretation += mercurySignTraits[mercury.sign] || '独自の思考パターンを持つ';
    interpretation += 'コミュニケーションスタイルです。';
    
    if (mercury.retrograde) {
      interpretation += '水星が逆行していることから、内省的で慎重な思考プロセスを持っています。';
    }
    
    return interpretation;
  }

  private interpretRelationshipsClassical(birthChart: AstrologyReading['birthChart'], aspects: Aspect[]): string {
    const venus = birthChart.venus;
    const mars = birthChart.mars;
    
    let interpretation = `金星が${venus.sign}、火星が${mars.sign}にあることから、`;
    
    const venusSignLove: Record<string, string> = {
      '牡羊座': '情熱的で積極的な愛し方',
      '牡牛座': '官能的で所有欲の強い愛し方',
      '双子座': '知的で変化を楽しむ愛し方',
      '蟹座': '保護的で感情的な愛し方',
      '獅子座': 'ロマンチックで劇的な愛し方',
      '乙女座': '献身的で実用的な愛し方',
      '天秤座': '調和的でパートナーシップを重視する愛し方',
      '蠍座': '深く激しく変容的な愛し方',
      '射手座': '自由で冒険的な愛し方',
      '山羊座': '責任感があり長期的な愛し方',
      '水瓶座': '友情的で独立した愛し方',
      '魚座': '献身的で自己犠牲的な愛し方'
    };
    
    interpretation += venusSignLove[venus.sign] || '独特の愛情表現';
    interpretation += 'をします。';
    
    // 金星と火星のアスペクト
    const venusMArsAspect = aspects.find(a => 
      (a.planet1 === 'venus' && a.planet2 === 'mars') || 
      (a.planet1 === 'mars' && a.planet2 === 'venus')
    );
    
    if (venusMArsAspect) {
      if (venusMArsAspect.type === 'conjunction' || venusMArsAspect.type === 'trine') {
        interpretation += '愛と情熱が調和し、魅力的な人間関係を築きやすいでしょう。';
      } else if (venusMArsAspect.type === 'square' || venusMArsAspect.type === 'opposition') {
        interpretation += '愛と欲望の間で葛藤を経験することがありますが、それが成長につながります。';
      }
    }
    
    return interpretation;
  }

  private interpretCareerClassical(birthChart: AstrologyReading['birthChart'], houses: AstrologyReading['houses']): string {
    const midheaven = birthChart.midheaven;
    const tenthHouse = houses.find(h => h.number === 10);
    
    let interpretation = `MCが${midheaven}にあることから、`;
    
    const mcSignCareer: Record<string, string> = {
      '牡羊座': 'リーダーシップを発揮する開拓的なキャリア',
      '牡牛座': '安定した収入と実用的な価値を生むキャリア',
      '双子座': 'コミュニケーションや情報を扱うキャリア',
      '蟹座': '人々の世話や保護に関わるキャリア',
      '獅子座': '創造性や自己表現を活かすキャリア',
      '乙女座': '分析や改善、サービスに関わるキャリア',
      '天秤座': '調和や美、パートナーシップに関わるキャリア',
      '蠍座': '変容や深い洞察を必要とするキャリア',
      '射手座': '教育や哲学、国際的なキャリア',
      '山羊座': '権威や構造、長期的目標を持つキャリア',
      '水瓶座': '革新的で人道的なキャリア',
      '魚座': '芸術的で霊的、奉仕的なキャリア'
    };
    
    interpretation += mcSignCareer[midheaven] || '独自の道を切り開くキャリア';
    interpretation += 'が適しています。';
    
    if (tenthHouse && tenthHouse.planets.length > 0) {
      interpretation += `第10ハウスに${tenthHouse.planets.join('、')}があることから、`;
      interpretation += 'これらの天体が示す特質が仕事で重要な役割を果たします。';
    }
    
    return interpretation;
  }

  private interpretSpiritualityClassical(birthChart: AstrologyReading['birthChart'], houses: AstrologyReading['houses']): string {
    const neptune = birthChart.neptune;
    const twelfthHouse = houses.find(h => h.number === 12);
    
    let interpretation = `海王星が${neptune.sign}にあることから、`;
    interpretation += 'スピリチュアルな側面では';
    
    const neptuneSignSpirit: Record<string, string> = {
      '牡羊座': '直感的で勇敢な霊的探求',
      '牡牛座': '感覚的で地に足の着いた霊性',
      '双子座': '知的で多様な霊的アプローチ',
      '蟹座': '感情的で養育的な霊性',
      '獅子座': '創造的で自己表現的な霊性',
      '乙女座': '実用的で浄化を求める霊性',
      '天秤座': '調和とバランスを求める霊性',
      '蠍座': '変容と再生を求める深い霊性',
      '射手座': '哲学的で拡大を求める霊性',
      '山羊座': '構造的で達成を求める霊性',
      '水瓶座': '革新的で普遍的な霊性',
      '魚座': '無限で溶解的な霊性'
    };
    
    interpretation += neptuneSignSpirit[neptune.sign] || '独自の霊的道';
    interpretation += 'を歩みます。';
    
    if (twelfthHouse && twelfthHouse.planets.length > 0) {
      interpretation += `第12ハウスの影響により、潜在意識や隠れた才能が重要な役割を果たします。`;
    }
    
    return interpretation;
  }

  private interpretCurrentInfluences(
    birthChart: AstrologyReading['birthChart'],
    timeModifier: number,
    environmentModifier: number
  ): string {
    const currentDate = new Date();
    const moonPhase = this.environment?.lunar?.phase || 0.5;
    
    let interpretation = '現在の宇宙的影響：';
    
    // 月相の影響
    if (moonPhase < 0.25) {
      interpretation += '新月から上弦の月への成長期にあり、新しい始まりに適しています。';
    } else if (moonPhase < 0.5) {
      interpretation += '上弦の月から満月への充実期にあり、行動と実現の時期です。';
    } else if (moonPhase < 0.75) {
      interpretation += '満月から下弦の月への解放期にあり、手放しと感謝の時期です。';
    } else {
      interpretation += '下弦の月から新月への浄化期にあり、内省と準備の時期です。';
    }
    
    // 環境要因
    if (environmentModifier > 1.1) {
      interpretation += '環境エネルギーが高まっており、変化や成長のチャンスが訪れています。';
    } else if (environmentModifier < 0.9) {
      interpretation += '環境エネルギーが落ち着いており、内面の充実に適した時期です。';
    }
    
    return interpretation;
  }

  private calculateTransitInfluence(): string {
    // 現在の天体配置による影響（簡易版）
    const currentDate = new Date();
    const dayOfYear = Math.floor((currentDate.getTime() - new Date(currentDate.getFullYear(), 0, 0).getTime()) / 86400000);
    
    const transitMessages = [
      '木星の恩恵により、拡大と成長の機会が訪れています。',
      '土星の試練により、忍耐と構築が求められています。',
      '天王星の革新により、予期せぬ変化が起こりやすい時期です。',
      '海王星の霊感により、直感と創造性が高まっています。',
      '冥王星の変容により、深い変化と再生の時期にあります。'
    ];
    
    return transitMessages[dayOfYear % transitMessages.length];
  }

  private getEnvironmentalSynchronicity(): string {
    if (!this.environment) return '';
    
    const weather = this.environment.weather;
    const lunar = this.environment.lunar;
    
    let sync = '環境との共鳴：';
    
    if (weather) {
      if (weather.condition === 'clear') {
        sync += '晴れやかな天気があなたの太陽的な側面を活性化しています。';
      } else if (weather.condition === 'rain') {
        sync += '雨が感情の浄化と新たな成長をもたらしています。';
      } else if (weather.condition === 'cloudy') {
        sync += '曇り空が内省と熟考を促しています。';
      }
    }
    
    if (lunar.phaseName.includes('新月')) {
      sync += '新月のエネルギーが新しいサイクルの始まりを告げています。';
    } else if (lunar.phaseName.includes('満月')) {
      sync += '満月のエネルギーが完成と解放を促しています。';
    }
    
    return sync;
  }

  private generateSeed(): number {
    const birthTime = this.input.birthDate.getTime();
    const nameValue = this.input.fullName.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const locationValue = this.input.currentLocation ? 
      this.input.currentLocation.latitude * 1000 + this.input.currentLocation.longitude * 1000 : 
      this.input.birthPlace.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    
    return Math.floor(birthTime + nameValue + locationValue) % 1000000;
  }

  // 現代心理占星術の解釈メソッド群
  private interpretPersonalityModern(birthChart: AstrologyReading['birthChart'], aspects: Aspect[]): string {
    const sun = birthChart.sun;
    const ascendant = birthChart.ascendant;
    
    const modernSunTraits: Record<string, string> = {
      '牡羊座': 'エンターテイナー型の人格で、リーダーシップと革新性を併せ持つ',
      '牡牛座': '安定志向で物質的価値を重視し、美的センスに優れた実務家',
      '双子座': '情報処理能力が高く、マルチタスクが得意な現代的コミュニケーター',
      '蟹座': '共感力と直感力に優れ、チームの心理的安全性を重視する',
      '獅子座': '自己表現力と創造性を活かし、ブランディング能力に長ける',
      '乙女座': 'データ分析と効率化を得意とし、品質管理に対する鋭い感覚を持つ',
      '天秤座': '調和とバランスを重視し、現代の多様性を受け入れる柔軟性がある',
      '蠍座': '心理学的洞察力に優れ、深い変容と再生の力を持つ',
      '射手座': 'グローバル視点と哲学的思考を持ち、多文化への適応力がある',
      '山羊座': '戦略的思考と長期計画の立案能力に長け、組織運営に優れる',
      '水瓶座': 'テクノロジーと人道主義を融合し、社会革新を推進する',
      '魚座': '高い共感力とクリエイティビティで、ヒーリングや芸術分野で活躍'
    };

    return `現代心理占星術では、太陽が${sun.sign}にあることから、あなたは${modernSunTraits[sun.sign] || '独自の現代的個性を持つ'}タイプです。21世紀の価値観に合った自己実現の道を歩んでいます。`;
  }

  private interpretPersonalityPsychological(birthChart: AstrologyReading['birthChart'], aspects: Aspect[]): string {
    const sun = birthChart.sun;
    
    const psychologicalTraits: Record<string, string> = {
      '牡羊座': 'ユング心理学の「英雄」原型を体現し、自己実現への強い動機を持つ',
      '牡牛座': '安全欲求と美的欲求のバランスを取りながら、段階的成長を重視',
      '双子座': '認知的柔軟性が高く、情報統合能力と適応能力に優れる',
      '蟹座': '愛着理論における安全な基地を提供する能力と、情緒的知性が高い',
      '獅子座': '自己効力感と創造的自己表現を通じて、自尊心を育む',
      '乙女座': '完璧主義と分析的思考により、継続的改善を行う',
      '天秤座': '対人関係における協調性と、審美的価値観を重視',
      '蠍座': '深層心理への洞察力と、トラウマから の回復力を持つ',
      '射手座': '意味探求と成長動機が強く、実存的価値観を重視',
      '山羊座': '目標達成動機と責任感により、長期的成功を追求',
      '水瓶座': '独立性と社会貢献への動機を併せ持つ',
      '魚座': '高い共感力と直感力により、他者との深いつながりを築く'
    };

    return `心理学的観点では、${psychologicalTraits[sun.sign] || '独特の心理的特性を持つ'}傾向があります。これらの特性を理解することで、より効果的な自己成長が可能になります。`;
  }

  private interpretEmotionsModern(birthChart: AstrologyReading['birthChart'], aspects: Aspect[]): string {
    const moon = birthChart.moon;
    
    const modernEmotionalPatterns: Record<string, string> = {
      '牡羊座': '感情を迅速に処理し、ストレス発散が得意。マインドフルネスが効果的',
      '牡牛座': '感情の安定性を重視し、ルーティンとセルフケアで心のバランスを保つ',
      '双子座': '感情を言語化し、SNSやコミュニティで共有することで処理する',
      '蟹座': '感情の深さと豊かさを大切にし、家族や親しい人との絆で安定を得る',
      '獅子座': '感情を創造的に表現し、承認欲求を健全に満たすことで成長する',
      '乙女座': '感情を分析し、実用的なソリューションで問題解決する',
      '天秤座': '感情のバランスを重視し、美的環境で心の調和を保つ',
      '蠍座': '感情の変容を受け入れ、深い自己探求を通じて成長する',
      '射手座': '感情を哲学的に捉え、新しい体験で心の拡張を図る',
      '山羊座': '感情をコントロールし、目標達成のためのエネルギーに変換する',
      '水瓶座': '感情から客観的距離を保ち、論理的アプローチで対処する',
      '魚座': '感情の流れを受け入れ、芸術や瞑想で心の浄化を行う'
    };

    return `現代のメンタルヘルス観点では、月が${moon.sign}にあることから、${modernEmotionalPatterns[moon.sign] || '独自の感情パターンを持つ'}傾向があります。`;
  }

  private interpretEmotionsPsychological(birthChart: AstrologyReading['birthChart'], aspects: Aspect[]): string {
    const moon = birthChart.moon;
    
    const psychologicalEmotions: Record<string, string> = {
      '牡羊座': '感情調節において行動化を用いる傾向があり、運動療法が効果的',
      '牡牛座': '感覚統合を通じた感情調節を行い、身体的接触や自然環境が安定をもたらす',
      '双子座': '認知的再評価による感情調節を得意とし、言語化が治療的効果を持つ',
      '蟹座': '愛着パターンが感情調節に大きく影響し、安全な関係性が回復の鍵',
      '獅子座': '自己肯定感と感情が密接に関連し、創造的表現が感情の統合に役立つ',
      '乙女座': '完璧主義と不安の関連性があり、現実的な目標設定が感情安定に重要',
      '天秤座': '対人関係の質が感情状態に直結し、境界設定のスキルが必要',
      '蠍座': '感情の強度が高く、トラウマインフォームドケアのアプローチが有効',
      '射手座': '意味づけと感情が連動し、価値観の明確化が感情の安定につながる',
      '山羊座': 'コントロール欲求と感情が関連し、適応的コーピングの学習が重要',
      '水瓶座': '感情の知性化傾向があり、感情と思考の統合が成長の課題',
      '魚座': '境界の曖昧さが感情に影響し、グラウンディング技法が効果的'
    };

    return `臨床心理学的には、${psychologicalEmotions[moon.sign] || '独特の感情プロファイルを示す'}特徴があります。`;
  }

  private interpretCommunicationModern(birthChart: AstrologyReading['birthChart'], aspects: Aspect[]): string {
    const mercury = birthChart.mercury;
    
    const modernCommTraits: Record<string, string> = {
      '牡羊座': 'デジタルネイティブ的な直接的コミュニケーション、SNSでの発信力が高い',
      '牡牛座': '実用的で信頼性の高い情報を重視、動画コンテンツとの相性が良い',
      '双子座': 'マルチプラットフォームでの情報発信、トレンドの早期キャッチが得意',
      '蟹座': '共感型コミュニケーション、オンラインコミュニティでの居場所作りが上手',
      '獅子座': 'インフルエンサー的な表現力、ビジュアルコンテンツでの自己表現が得意',
      '乙女座': 'ファクトチェックと詳細な分析、データドリブンなコミュニケーション',
      '天秤座': 'バランスの取れた意見表明、調停的なオンライン対話が得意',
      '蠍座': '深い洞察と本質的な議論、一対一の密度の高いコミュニケーション',
      '射手座': 'グローバルな視点でのコミュニケーション、多文化間の橋渡し役',
      '山羊座': '戦略的で目的志向のコミュニケーション、ビジネス分野での影響力',
      '水瓶座': 'イノベーティブなコミュニケーション手法、新技術の積極的活用',
      '魚座': '直感的で感情に訴えるコミュニケーション、芸術的表現との融合'
    };

    return `デジタル時代においては、水星が${mercury.sign}にあることから、${modernCommTraits[mercury.sign] || '独自のコミュニケーション能力を持つ'}スタイルです。`;
  }

  private interpretCommunicationPractical(birthChart: AstrologyReading['birthChart'], aspects: Aspect[]): string {
    const mercury = birthChart.mercury;
    
    const practicalAdvice: Record<string, string> = {
      '牡羊座': 'プレゼンテーションは簡潔に。重要なポイントを最初に伝える',
      '牡牛座': '具体例とデータを用意。時間をかけて信頼関係を築く',
      '双子座': '複数の情報源を活用。ネットワーキングで情報収集する',
      '蟹座': '相手の感情に配慮した表現。プライベートな関係性を大切にする',
      '獅子座': 'ストーリーテリングを活用。聴衆を巻き込む表現を心がける',
      '乙女座': '事前準備を徹底する。詳細な資料と論理的構成を重視する',
      '天秤座': '相手の立場を考慮した表現。対立を避け、合意形成を目指す',
      '蠍座': '本音での対話を重視。表面的でない深いコミュニケーションを',
      '射手座': '大局的な視点を提示。多様な価値観を受け入れる姿勢を示す',
      '山羊座': '目標と成果を明確に。段階的で実現可能な計画を提示する',
      '水瓶座': '創新的なアイデアを提案。従来の枠にとらわれない発想を',
      '魚座': '共感を重視した表現。相手の気持ちに寄り添う姿勢を示す'
    };

    return `実践的には、${practicalAdvice[mercury.sign] || '独自のアプローチを取る'}ことが効果的です。`;
  }

  // 古典・現代・実践的解釈のパターンを他の分野にも適用
  private interpretRelationshipsModern(birthChart: AstrologyReading['birthChart'], aspects: Aspect[]): string {
    const venus = birthChart.venus;
    
    return `現代の恋愛観では、金星が${venus.sign}にあることから、マッチングアプリでは${this.getModernDatingStyle(venus.sign)}タイプとして魅力を発揮します。`;
  }

  private interpretRelationshipsCompatibility(birthChart: AstrologyReading['birthChart'], aspects: Aspect[]): string {
    const venus = birthChart.venus;
    const mars = birthChart.mars;
    
    return `相性分析では、金星${venus.sign}と火星${mars.sign}の組み合わせにより、${this.getCompatibilityProfile(venus.sign, mars.sign)}特徴を持ちます。`;
  }

  private interpretCareerModern(birthChart: AstrologyReading['birthChart'], houses: AstrologyReading['houses']): string {
    const midheaven = birthChart.midheaven;
    
    const modernCareers: Record<string, string> = {
      '牡羊座': 'スタートアップ創業、フリーランス、プロジェクトマネージャー',
      '牡牛座': '金融、不動産、サステナビリティ関連、アート投資',
      '双子座': 'デジタルマーケティング、コンテンツクリエーター、データアナリスト',
      '蟹座': 'カスタマーサクセス、ヘルスケア、チャイルドケア',
      '獅子座': 'ブランドマネージャー、エンターテイメント、パーソナルブランディング',
      '乙女座': 'プロダクトマネージャー、品質管理、ヘルスアドバイザー',
      '天秤座': 'UX/UIデザイナー、調停専門家、PR・広報',
      '蠍座': 'データサイエンティスト、心理カウンセラー、セキュリティ専門家',
      '射手座': 'グローバルビジネス、教育テック、トラベルライター',
      '山羊座': 'コンサルタント、プロジェクトマネージャー、投資アドバイザー',
      '水瓶座': 'ソーシャルイノベーター、テック系、NPO運営',
      '魚座': 'セラピスト、アートセラピー、ソーシャルワーカー'
    };

    return `現代のキャリアでは、MC${midheaven}により${modernCareers[midheaven] || '独自の専門分野'}が適職です。`;
  }

  private interpretCareerPractical(birthChart: AstrologyReading['birthChart'], houses: AstrologyReading['houses']): string {
    const midheaven = birthChart.midheaven;
    
    return `実践的なキャリア戦略として、${this.getPracticalCareerAdvice(midheaven)}ことをお勧めします。`;
  }

  private interpretSpiritualityModern(birthChart: AstrologyReading['birthChart'], houses: AstrologyReading['houses']): string {
    const neptune = birthChart.neptune;
    
    return `現代スピリチュアリティでは、海王星${neptune.sign}により、マインドフルネス、ヨガ、エネルギーワークなど${this.getModernSpiritualPractices(neptune.sign)}が適しています。`;
  }

  private interpretSpiritualityNewAge(birthChart: AstrologyReading['birthChart'], houses: AstrologyReading['houses']): string {
    const neptune = birthChart.neptune;
    
    return `ニューエイジ的観点では、${this.getNewAgePractices(neptune.sign)}を通じて高次の意識とつながることができます。`;
  }

  // ヘルパーメソッド群
  private getModernDatingStyle(venusSign: string): string {
    const styles: Record<string, string> = {
      '牡羊座': 'アクティブで直接的',
      '牡牛座': '安定志向で感覚的',
      '双子座': '知的で多様性重視',
      '蟹座': '感情重視で家庭的',
      '獅子座': 'ロマンチックで表現豊か',
      '乙女座': '慎重で実用的',
      '天秤座': 'バランス重視で美的',
      '蠍座': '深く激しい',
      '射手座': '自由で冒険的',
      '山羊座': '真剣で長期的',
      '水瓶座': '独立的で友好的',
      '魚座': '直感的で献身的'
    };
    return styles[venusSign] || '独特';
  }

  private getCompatibilityProfile(venusSign: string, marsSign: string): string {
    return `${venusSign}的な愛情表現と${marsSign}的な行動パターンを併せ持つ`;
  }

  private getPracticalCareerAdvice(mcSign: string): string {
    const advice: Record<string, string> = {
      '牡羊座': 'リーダーシップを発揮できるポジションを積極的に求め',
      '牡牛座': '安定した収入源を確保しながら専門性を深め',
      '双子座': '複数のスキルを組み合わせて差別化を図り',
      '蟹座': '人をサポートする役割で信頼関係を築き',
      '獅子座': '創造性と表現力を活かせるフィールドで活躍し',
      '乙女座': '細部への注意力と分析力を武器にし',
      '天秤座': '調整力と美的センスを活かした仕事を選び',
      '蠍座': '深い専門知識と洞察力で他者との差別化を図り',
      '射手座': 'グローバルな視点と哲学的思考を活用し',
      '山羊座': '長期的な目標設定と段階的な昇進を心がけ',
      '水瓶座': '革新的なアイデアと社会貢献を組み合わせ',
      '魚座': '直感力と共感力を活かしたサービス業で力を発揮し'
    };
    return advice[mcSign] || '独自の強みを活かし';
  }

  private getModernSpiritualPractices(neptuneSign: string): string {
    const practices: Record<string, string> = {
      '牡羊座': '動的瞑想とアクティブスピリチュアリティ',
      '牡牛座': 'アーシングと自然療法',
      '双子座': 'ガイド瞑想と知識の統合',
      '蟹座': 'ファミリーコンステレーションと感情解放',
      '獅子座': 'クリエイティブ表現と自己愛ワーク',
      '乙女座': 'ヒーリングハーブとデトックス',
      '天秤座': 'パートナーシップワークとバランス調整',
      '蠍座': 'シャーマニズムと変容ワーク',
      '射手座': '多文化スピリチュアリティと哲学探求',
      '山羊座': '実践的スピリチュアリティとビジネス倫理',
      '水瓶座': 'テクノロジーと意識の融合',
      '魚座': 'チャネリングと芸術療法'
    };
    return practices[neptuneSign] || '独自のスピリチュアルパス';
  }

  private getNewAgePractices(neptuneSign: string): string {
    const newAge: Record<string, string> = {
      '牡羊座': 'クンダリーニ覚醒とエネルギーの活性化',
      '牡牛座': 'クリスタルヒーリングとアース・コネクション',
      '双子座': 'チャネリングと多次元コミュニケーション',
      '蟹座': 'アカシックレコードと過去世ヒーリング',
      '獅子座': 'ライトワークとスターシード覚醒',
      '乙女座': 'エネルギー調整とオーラクレンジング',
      '天秤座': 'ツインフレームとソウルメート探求',
      '蠍座': 'カルマ解除とソウル・リトリーバル',
      '射手座': 'アセンション・プロセスと高次元意識',
      '山羊座': 'マニフェステーションとグラウンディング',
      '水瓶座': 'スターゲートとコズミック・コンシャスネス',
      '魚座': 'チャネリングとユニバーサル・ラブ'
    };
    return newAge[neptuneSign] || '独自のライトワーク';
  }
}