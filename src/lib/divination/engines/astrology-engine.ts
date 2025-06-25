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
    personality: string;
    emotions: string;
    communication: string;
    relationships: string;
    career: string;
    spirituality: string;
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
    const interpretation = this.generateInterpretation(birthChart, houses, aspects);
    
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

  private generateInterpretation(
    birthChart: AstrologyReading['birthChart'],
    houses: AstrologyReading['houses'],
    aspects: Aspect[]
  ): AstrologyReading['interpretation'] {
    const timeModifier = this.getTimeModifier();
    const environmentModifier = this.getEnvironmentalModifier();
    
    return {
      personality: this.interpretPersonality(birthChart, aspects),
      emotions: this.interpretEmotions(birthChart, aspects),
      communication: this.interpretCommunication(birthChart, aspects),
      relationships: this.interpretRelationships(birthChart, aspects),
      career: this.interpretCareer(birthChart, houses),
      spirituality: this.interpretSpirituality(birthChart, houses),
      currentInfluences: this.interpretCurrentInfluences(birthChart, timeModifier, environmentModifier)
    };
  }

  private interpretPersonality(birthChart: AstrologyReading['birthChart'], aspects: Aspect[]): string {
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

  private interpretEmotions(birthChart: AstrologyReading['birthChart'], aspects: Aspect[]): string {
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

  private interpretCommunication(birthChart: AstrologyReading['birthChart'], aspects: Aspect[]): string {
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

  private interpretRelationships(birthChart: AstrologyReading['birthChart'], aspects: Aspect[]): string {
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

  private interpretCareer(birthChart: AstrologyReading['birthChart'], houses: AstrologyReading['houses']): string {
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

  private interpretSpirituality(birthChart: AstrologyReading['birthChart'], houses: AstrologyReading['houses']): string {
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
}