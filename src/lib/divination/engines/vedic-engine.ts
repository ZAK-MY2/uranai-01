import { BaseDivinationEngine, DivinationInput, EnvironmentData } from '../base-engine';

// ナクシャトラ（27宿）
const NAKSHATRAS = [
  { name: 'アシュヴィニー', deity: 'アシュヴィン双神', symbol: '馬の頭', quality: '軽快・癒し' },
  { name: 'バラニー', deity: 'ヤマ', symbol: 'ヨーニ', quality: '創造・変容' },
  { name: 'クリッティカー', deity: 'アグニ', symbol: '炎', quality: '浄化・切断' },
  { name: 'ローヒニー', deity: 'ブラフマー', symbol: '牛車', quality: '成長・美' },
  { name: 'ムリガシラー', deity: 'ソーマ', symbol: '鹿の頭', quality: '探求・優美' },
  { name: 'アールドラー', deity: 'ルドラ', symbol: '涙', quality: '激情・変化' },
  { name: 'プナルヴァス', deity: 'アディティ', symbol: '弓矢', quality: '回復・帰還' },
  { name: 'プシャ', deity: 'ブリハスパティ', symbol: '花', quality: '養育・繁栄' },
  { name: 'アーシュレーシャー', deity: 'ナーガ', symbol: '蛇', quality: '拘束・神秘' },
  { name: 'マガー', deity: 'ピトリ', symbol: '玉座', quality: '権力・伝統' },
  { name: 'プールヴァ・パールグニー', deity: 'バガ', symbol: 'ハンモック', quality: '休息・享楽' },
  { name: 'ウッタラ・パールグニー', deity: 'アリヤマン', symbol: 'ベッド', quality: '慈善・結合' },
  { name: 'ハスタ', deity: 'サヴィトリ', symbol: '手', quality: '技能・器用' },
  { name: 'チトラー', deity: 'トヴァシュトリ', symbol: '真珠', quality: '創造・美術' },
  { name: 'スヴァーティ', deity: 'ヴァーユ', symbol: '若芽', quality: '独立・柔軟' },
  { name: 'ヴィシャーカー', deity: 'インドラ・アグニ', symbol: '勝利門', quality: '目的・達成' },
  { name: 'アヌラーダー', deity: 'ミトラ', symbol: '蓮', quality: '友情・献身' },
  { name: 'ジェーシュター', deity: 'インドラ', symbol: '傘', quality: '保護・年長' },
  { name: 'ムーラ', deity: 'ニリティ', symbol: '根', quality: '破壊・探求' },
  { name: 'プールヴァ・アシャーダー', deity: 'アパス', symbol: '扇', quality: '浄化・勝利' },
  { name: 'ウッタラ・アシャーダー', deity: 'ヴィシュヴェーデーヴァ', symbol: '象の牙', quality: '普遍・勝利' },
  { name: 'シュラヴァナ', deity: 'ヴィシュヌ', symbol: '耳', quality: '聴聞・学習' },
  { name: 'ダニシュター', deity: 'ヴァス', symbol: '太鼓', quality: '富・名声' },
  { name: 'シャタビシャー', deity: 'ヴァルナ', symbol: '円', quality: '癒し・秘密' },
  { name: 'プールヴァ・バードラパダー', deity: 'アジャ・エーカパーダ', symbol: '剣', quality: '苦行・変容' },
  { name: 'ウッタラ・バードラパダー', deity: 'アヒル・ブドゥニヤ', symbol: '蛇', quality: '深遠・慈悲' },
  { name: 'レーヴァティー', deity: 'プーシャン', symbol: '魚', quality: '旅・完成' }
];

// ラーシ（12星座）
const RASHIS = [
  { name: 'メーシャ', element: '火', quality: '活動', ruler: '火星' },
  { name: 'ヴリシャバ', element: '地', quality: '固定', ruler: '金星' },
  { name: 'ミトゥナ', element: '風', quality: '変通', ruler: '水星' },
  { name: 'カルカ', element: '水', quality: '活動', ruler: '月' },
  { name: 'シンハ', element: '火', quality: '固定', ruler: '太陽' },
  { name: 'カニヤー', element: '地', quality: '変通', ruler: '水星' },
  { name: 'トゥラー', element: '風', quality: '活動', ruler: '金星' },
  { name: 'ヴリシュチカ', element: '水', quality: '固定', ruler: '火星' },
  { name: 'ダヌ', element: '火', quality: '変通', ruler: '木星' },
  { name: 'マカラ', element: '地', quality: '活動', ruler: '土星' },
  { name: 'クンバ', element: '風', quality: '固定', ruler: '土星' },
  { name: 'ミーナ', element: '水', quality: '変通', ruler: '木星' }
];

// グラハ（9惑星）
const GRAHAS = {
  surya: { name: '太陽', nature: '温熱・男性', signifies: '魂・父・権威' },
  chandra: { name: '月', nature: '冷湿・女性', signifies: '心・母・感情' },
  mangal: { name: '火星', nature: '温熱・男性', signifies: '活力・争い・兄弟' },
  budha: { name: '水星', nature: '中性', signifies: '知性・商売・コミュニケーション' },
  guru: { name: '木星', nature: '温・男性', signifies: '知恵・師・幸運' },
  shukra: { name: '金星', nature: '冷湿・女性', signifies: '愛・美・配偶者' },
  shani: { name: '土星', nature: '冷乾・中性', signifies: '制限・苦労・長寿' },
  rahu: { name: 'ラーフ', nature: '影', signifies: '欲望・幻想・外国' },
  ketu: { name: 'ケートゥ', nature: '影', signifies: '解脱・霊性・損失' }
};

export interface VedicReading {
  birthChart: {
    ascendant: string;
    moonSign: string;
    sunSign: string;
    nakshatra: typeof NAKSHATRAS[0];
    planets: Array<{
      graha: string;
      rashi: string;
      house: number;
      degree: number;
    }>;
  };
  dashas: {
    mahadasha: {
      planet: string;
      period: string;
      effects: string;
    };
    antardasha: {
      planet: string;
      period: string;
      effects: string;
    };
  };
  yogas: Array<{
    name: string;
    type: string;
    effects: string;
  }>;
  interpretation: {
    personality: string;
    dharma: string;
    artha: string;
    kama: string;
    moksha: string;
    currentPeriod: string;
  };
  remedies?: Array<{
    type: string;
    description: string;
  }>;
  muhurta?: string;
  environmentalAlignment?: string;
}

export class VedicEngine extends BaseDivinationEngine<VedicReading> {
  calculate(): VedicReading {
    const birthChart = this.calculateBirthChart();
    const dashas = this.calculateDashas(birthChart);
    const yogas = this.identifyYogas(birthChart);
    const interpretation = this.generateInterpretation(birthChart, dashas, yogas);
    
    const remedies = this.suggestRemedies(birthChart, dashas);
    const muhurta = this.calculateMuhurta();
    const environmentalAlignment = this.getEnvironmentalAlignment(birthChart);

    return {
      birthChart,
      dashas,
      yogas,
      interpretation,
      remedies,
      muhurta,
      environmentalAlignment
    };
  }

  private calculateBirthChart(): VedicReading['birthChart'] {
    const birthDate = this.input.birthDate;
    const seed = this.generateSeed();
    
    // アセンダント（ラグナ）の計算
    const ascendantIndex = seed % 12;
    const ascendant = RASHIS[ascendantIndex]?.name || 'メーシャ';
    
    // 月の位置（ジャンマ・ラーシ）
    const moonIndex = (seed * 2) % 12;
    const moonSign = RASHIS[moonIndex]?.name || 'メーシャ';
    
    // 太陽の位置
    const sunIndex = (seed * 3) % 12;
    const sunSign = RASHIS[sunIndex]?.name || 'メーシャ';
    
    // ナクシャトラ（月宿）の計算
    const nakshatraIndex = (seed * 4) % NAKSHATRAS.length;
    const nakshatra = NAKSHATRAS[nakshatraIndex] || NAKSHATRAS[0];
    
    // 各惑星の配置
    const planets = this.calculatePlanetPositions(seed);
    
    return {
      ascendant,
      moonSign,
      sunSign,
      nakshatra,
      planets
    };
  }

  private calculatePlanetPositions(seed: number): VedicReading['birthChart']['planets'] {
    const planets: VedicReading['birthChart']['planets'] = [];
    let currentSeed = seed;
    
    Object.keys(GRAHAS).forEach((grahaKey, index) => {
      currentSeed = (currentSeed * 1103515245 + 12345) % 2147483648;
      const rashiIndex = currentSeed % 12;
      const degree = (currentSeed % 30);
      const house = ((rashiIndex - (seed % 12) + 12) % 12) + 1;
      
      planets.push({
        graha: GRAHAS[grahaKey as keyof typeof GRAHAS].name,
        rashi: RASHIS[rashiIndex]?.name || 'メーシャ',
        house,
        degree
      });
    });
    
    return planets;
  }

  private calculateDashas(birthChart: VedicReading['birthChart']): VedicReading['dashas'] {
    // ヴィムショッタリ・ダシャー（120年周期）
    const dashaOrder = ['ケートゥ', '金星', '太陽', '月', '火星', 'ラーフ', '木星', '土星', '水星'];
    const dashaPeriods = [7, 20, 6, 10, 7, 18, 16, 19, 17]; // 年数
    
    // 生まれた時のナクシャトラから開始惑星を決定
    const nakshatraIndex = NAKSHATRAS.findIndex(n => n.name === birthChart.nakshatra.name);
    const startPlanetIndex = (nakshatraIndex >= 0 ? nakshatraIndex : 0) % 9;
    
    // 現在の年齢
    const age = Math.floor((Date.now() - this.input.birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    
    // 現在のマハーダシャーを計算
    let totalYears = 0;
    let currentMahadashaIndex = startPlanetIndex;
    let remainingYears = age;
    
    while (remainingYears > dashaPeriods[currentMahadashaIndex]) {
      remainingYears -= dashaPeriods[currentMahadashaIndex];
      totalYears += dashaPeriods[currentMahadashaIndex];
      currentMahadashaIndex = (currentMahadashaIndex + 1) % 9;
    }
    
    const mahadashaPlanet = dashaOrder[currentMahadashaIndex];
    const mahadashaPeriod = `${totalYears}年〜${totalYears + dashaPeriods[currentMahadashaIndex]}年`;
    
    // アンタルダシャー（副周期）
    const antardashaProgress = remainingYears / dashaPeriods[currentMahadashaIndex];
    const antardashaIndex = Math.floor(antardashaProgress * 9) % 9;
    const antardashaPlanet = dashaOrder[(currentMahadashaIndex + antardashaIndex) % 9];
    
    return {
      mahadasha: {
        planet: mahadashaPlanet,
        period: mahadashaPeriod,
        effects: this.getDashaEffects(mahadashaPlanet, 'maha')
      },
      antardasha: {
        planet: antardashaPlanet,
        period: '現在進行中',
        effects: this.getDashaEffects(antardashaPlanet, 'antar')
      }
    };
  }

  private getDashaEffects(planet: string, type: string): string {
    const effects: Record<string, string> = {
      '太陽': '権威、成功、父親との関係、健康',
      '月': '感情、母親との関係、住居の変化',
      '火星': 'エネルギー、競争、不動産、兄弟',
      '水星': '学習、商売、コミュニケーション、若々しさ',
      '木星': '幸運、精神性、師との出会い、拡大',
      '金星': '愛情、結婚、芸術、快楽、富',
      '土星': '試練、忍耐、キャリア、長期的成果',
      'ラーフ': '野心、外国、技術、予期せぬ出来事',
      'ケートゥ': '精神性、解放、損失からの学び'
    };
    
    const prefix = type === 'maha' ? '主要なテーマ：' : '現在の焦点：';
    return prefix + (effects[planet] || '人生の重要な転換期');
  }

  private identifyYogas(birthChart: VedicReading['birthChart']): VedicReading['yogas'] {
    const yogas: VedicReading['yogas'] = [];
    
    // 簡易的なヨーガ判定
    const planets = birthChart.planets;
    
    // ガジャケーサリ・ヨーガ（木星と月の関係）
    const jupiter = planets.find(p => p.graha === '木星');
    const moon = planets.find(p => p.graha === '月');
    
    if (jupiter && moon) {
      const distance = Math.abs(jupiter.house - moon.house);
      if (distance === 0 || distance === 3 || distance === 6 || distance === 9) {
        yogas.push({
          name: 'ガジャケーサリ・ヨーガ',
          type: '吉祥',
          effects: '知恵、名声、富、長寿をもたらす'
        });
      }
    }
    
    // ラージャ・ヨーガ（王のヨーガ）
    const ascendantLord = this.getHouseLord(1, birthChart);
    const ninthLord = this.getHouseLord(9, birthChart);
    
    if (ascendantLord && ninthLord && ascendantLord.house === ninthLord.house) {
      yogas.push({
        name: 'ラージャ・ヨーガ',
        type: '権力',
        effects: 'リーダーシップ、成功、高い地位'
      });
    }
    
    // ダナ・ヨーガ（富のヨーガ）
    const secondLord = this.getHouseLord(2, birthChart);
    const eleventhLord = this.getHouseLord(11, birthChart);
    
    if (secondLord && eleventhLord && this.areInGoodRelation(secondLord, eleventhLord)) {
      yogas.push({
        name: 'ダナ・ヨーガ',
        type: '財運',
        effects: '富の蓄積、経済的成功'
      });
    }
    
    return yogas;
  }

  private getHouseLord(house: number, birthChart: VedicReading['birthChart']): any {
    // 簡易的な実装
    const ascendantIndex = RASHIS.findIndex(r => r.name === birthChart.ascendant);
    const houseSignIndex = (ascendantIndex + house - 1) % 12;
    const houseSign = RASHIS[houseSignIndex];
    
    return birthChart.planets.find(p => p.graha === houseSign.ruler);
  }

  private areInGoodRelation(planet1: any, planet2: any): boolean {
    // 簡易的な判定
    const distance = Math.abs(planet1.house - planet2.house);
    return distance === 0 || distance === 4 || distance === 8 || distance === 2 || distance === 10;
  }

  private generateInterpretation(
    birthChart: VedicReading['birthChart'],
    dashas: VedicReading['dashas'],
    yogas: VedicReading['yogas']
  ): VedicReading['interpretation'] {
    return {
      personality: this.interpretPersonality(birthChart),
      dharma: this.interpretDharma(birthChart),
      artha: this.interpretArtha(birthChart),
      kama: this.interpretKama(birthChart),
      moksha: this.interpretMoksha(birthChart),
      currentPeriod: this.interpretCurrentPeriod(dashas)
    };
  }

  private interpretPersonality(birthChart: VedicReading['birthChart']): string {
    const ascendant = birthChart.ascendant;
    const moonSign = birthChart.moonSign;
    const nakshatra = birthChart.nakshatra;
    
    let interpretation = `ラグナ（アセンダント）が${ascendant}で、`;
    
    const ascendantTraits: Record<string, string> = {
      'メーシャ': '積極的でリーダーシップがあり、開拓精神に富む',
      'ヴリシャバ': '忍耐強く実用的で、美と快適さを愛する',
      'ミトゥナ': '知的で多才、コミュニケーション能力が高い',
      'カルカ': '感情豊かで養育的、家族を大切にする',
      'シンハ': '威厳があり創造的、注目を集める存在',
      'カニヤー': '分析的で完璧主義、奉仕精神がある',
      'トゥラー': '調和を愛し外交的、美的センスがある',
      'ヴリシュチカ': '情熱的で神秘的、変容の力を持つ',
      'ダヌ': '楽観的で哲学的、高い理想を持つ',
      'マカラ': '野心的で実用的、着実に目標を達成する',
      'クンバ': '独創的で人道的、革新的な考えを持つ',
      'ミーナ': '直感的で共感的、芸術的感性がある'
    };
    
    interpretation += ascendantTraits[ascendant] || '独特の個性を持つ';
    interpretation += '性格です。';
    
    interpretation += `月が${moonSign}にあることから、感情面では`;
    interpretation += ascendantTraits[moonSign] || '豊かな内面を持つ';
    interpretation += '傾向があります。';
    
    interpretation += `さらに、${nakshatra.name}のナクシャトラの影響で、${nakshatra.quality}という特質が加わります。`;
    
    return interpretation;
  }

  private interpretDharma(birthChart: VedicReading['birthChart']): string {
    // ダルマ（義務・使命）- 1、5、9ハウス
    const firstHouse = birthChart.planets.filter(p => p.house === 1);
    const fifthHouse = birthChart.planets.filter(p => p.house === 5);
    const ninthHouse = birthChart.planets.filter(p => p.house === 9);
    
    let interpretation = '人生の使命（ダルマ）：';
    
    if (ninthHouse.length > 0) {
      interpretation += `第9ハウスに${ninthHouse.map(p => p.graha).join('、')}があり、`;
      interpretation += '高い精神性と道徳的価値観を持って生きることが使命です。';
    } else {
      interpretation += 'あなたの使命は、自己の成長を通じて他者に貢献することです。';
    }
    
    if (fifthHouse.some(p => p.graha === '木星')) {
      interpretation += '教育や指導を通じて知恵を伝えることも重要な役割です。';
    }
    
    return interpretation;
  }

  private interpretArtha(birthChart: VedicReading['birthChart']): string {
    // アルタ（富・物質）- 2、6、10ハウス
    const secondHouse = birthChart.planets.filter(p => p.house === 2);
    const tenthHouse = birthChart.planets.filter(p => p.house === 10);
    
    let interpretation = '物質的成功（アルタ）：';
    
    if (tenthHouse.length > 0) {
      interpretation += `第10ハウスに${tenthHouse.map(p => p.graha).join('、')}があり、`;
      interpretation += 'キャリアにおいて重要な地位を得る可能性があります。';
    }
    
    if (secondHouse.some(p => p.graha === '金星' || p.graha === '木星')) {
      interpretation += '富の蓄積に恵まれ、経済的安定を得やすいでしょう。';
    } else if (secondHouse.some(p => p.graha === '土星')) {
      interpretation += '富は努力と忍耐によって徐々に築かれます。';
    }
    
    return interpretation;
  }

  private interpretKama(birthChart: VedicReading['birthChart']): string {
    // カーマ（欲望・関係）- 3、7、11ハウス
    const seventhHouse = birthChart.planets.filter(p => p.house === 7);
    
    let interpretation = '人間関係と欲望（カーマ）：';
    
    if (seventhHouse.length > 0) {
      interpretation += `第7ハウスに${seventhHouse.map(p => p.graha).join('、')}があり、`;
      
      if (seventhHouse.some(p => p.graha === '金星')) {
        interpretation += '愛情豊かなパートナーシップに恵まれます。';
      } else if (seventhHouse.some(p => p.graha === '火星')) {
        interpretation += '情熱的だが時に衝突もある関係になりやすいです。';
      } else {
        interpretation += 'パートナーシップが人生の重要なテーマとなります。';
      }
    } else {
      interpretation += '自立的でありながら、必要な時に適切な関係を築けます。';
    }
    
    return interpretation;
  }

  private interpretMoksha(birthChart: VedicReading['birthChart']): string {
    // モクシャ（解脱・精神性）- 4、8、12ハウス
    const twelfthHouse = birthChart.planets.filter(p => p.house === 12);
    const eighthHouse = birthChart.planets.filter(p => p.house === 8);
    
    let interpretation = '精神的解放（モクシャ）：';
    
    if (twelfthHouse.some(p => p.graha === 'ケートゥ') || eighthHouse.some(p => p.graha === 'ケートゥ')) {
      interpretation += 'ケートゥの配置により、自然に精神世界に引かれる傾向があります。';
    } else if (twelfthHouse.some(p => p.graha === '木星')) {
      interpretation += '精神的な師や教えとの出会いが魂の成長をもたらします。';
    } else {
      interpretation += '日常生活の中で瞑想や内省を通じて、内なる平和を見出すことができます。';
    }
    
    return interpretation;
  }

  private interpretCurrentPeriod(dashas: VedicReading['dashas']): string {
    const maha = dashas.mahadasha;
    const antar = dashas.antardasha;
    
    let interpretation = `現在は${maha.planet}のマハーダシャー期間中で、`;
    interpretation += `${maha.effects}がテーマとなっています。`;
    interpretation += `さらに${antar.planet}のアンタルダシャーにより、`;
    interpretation += `${antar.effects}に焦点が当たっています。`;
    
    // 惑星の組み合わせによる特別な影響
    if (maha.planet === '木星' && antar.planet === '金星') {
      interpretation += 'この組み合わせは特に幸運で、愛と豊かさがもたらされる時期です。';
    } else if (maha.planet === '土星' && antar.planet === 'ラーフ') {
      interpretation += 'この時期は挑戦的ですが、大きな変革と成長の機会でもあります。';
    }
    
    return interpretation;
  }

  private suggestRemedies(birthChart: VedicReading['birthChart'], dashas: VedicReading['dashas']): VedicReading['remedies'] {
    const remedies: VedicReading['remedies'] = [];
    
    // ダシャーの惑星に基づく処方
    const planetRemedies: Record<string, Array<{ type: string; description: string }>> = {
      '太陽': [
        { type: 'マントラ', description: 'オーム・スーリヤーヤ・ナマハ（毎朝108回）' },
        { type: '宝石', description: 'ルビーを薬指に着用' },
        { type: '慈善', description: '日曜日に小麦や赤い布を寄付' }
      ],
      '月': [
        { type: 'マントラ', description: 'オーム・チャンドラーヤ・ナマハ（月曜日の夜）' },
        { type: '宝石', description: '真珠を小指に着用' },
        { type: '慈善', description: '月曜日に白い食べ物や銀を寄付' }
      ],
      '火星': [
        { type: 'マントラ', description: 'オーム・マンガラーヤ・ナマハ（火曜日）' },
        { type: '宝石', description: '赤珊瑚を薬指に着用' },
        { type: '慈善', description: '火曜日に赤い物や武器を寄付' }
      ],
      '土星': [
        { type: 'マントラ', description: 'オーム・シャニ・デーヴァーヤ・ナマハ（土曜日）' },
        { type: '宝石', description: 'ブルーサファイアを中指に着用（要注意）' },
        { type: '慈善', description: '土曜日に黒ゴマや鉄を寄付' }
      ]
    };
    
    const currentPlanet = dashas.mahadasha.planet;
    if (planetRemedies[currentPlanet]) {
      remedies.push(...planetRemedies[currentPlanet]);
    } else {
      remedies.push({
        type: '一般的処方',
        description: '毎日のヨガと瞑想、菜食の実践'
      });
    }
    
    return remedies;
  }

  private calculateMuhurta(): string {
    // 吉日吉時（ムフールタ）の簡易計算
    const today = new Date();
    const dayOfWeek = today.getDay();
    const hour = today.getHours();
    
    const auspiciousDays: Record<number, string> = {
      0: '太陽の日 - 新しい始まり、健康に関する事柄に吉',
      1: '月の日 - 感情的な事柄、家族関係に吉',
      2: '火星の日 - 競争、法的事柄に吉',
      3: '水星の日 - 学習、商売、コミュニケーションに吉',
      4: '木星の日 - 精神的事柄、教育、結婚に最も吉',
      5: '金星の日 - 愛情、芸術、買い物に吉',
      6: '土星の日 - 困難な作業、長期計画に適す'
    };
    
    let muhurta = `本日（${['日', '月', '火', '水', '木', '金', '土'][dayOfWeek]}曜日）は`;
    muhurta += auspiciousDays[dayOfWeek];
    
    // 時間帯による吉凶
    if (hour >= 4 && hour < 6) {
      muhurta += ' ブラフマ・ムフールタ（日の出前）は特に精神的活動に最適です。';
    } else if (hour >= 10 && hour < 12) {
      muhurta += ' アビジット・ムフールタ（正午前）は成功をもたらす時間帯です。';
    }
    
    return muhurta;
  }

  private getEnvironmentalAlignment(birthChart: VedicReading['birthChart']): string {
    if (!this.environment) return '';
    
    const moonPhase = this.environment.lunar.phase;
    const weather = this.environment.weather;
    
    let alignment = 'コズミックな調和：';
    
    // 月相とナクシャトラの関係
    const nakshatra = birthChart.nakshatra;
    if (moonPhase < 0.25) {
      alignment += '新月期は新しい始まりに適し、';
      alignment += `${nakshatra.name}のエネルギーが活性化されています。`;
    } else if (moonPhase < 0.5) {
      alignment += '上弦の月は成長と拡大を促し、';
      alignment += `${nakshatra.deity}の祝福が得られやすい時期です。`;
    } else if (moonPhase < 0.75) {
      alignment += '満月期は成就と完成の時、';
      alignment += `${nakshatra.quality}の性質が最も強く現れます。`;
    } else {
      alignment += '下弦の月は解放と浄化を促し、';
      alignment += `${nakshatra.symbol}が示す教訓を学ぶ時期です。`;
    }
    
    // 天候と五大元素
    if (weather) {
      if (weather.condition === 'clear') {
        alignment += ' 晴天は火の要素を強め、活力と情熱を高めます。';
      } else if (weather.condition === 'rain') {
        alignment += ' 雨は水の要素を強め、感情の浄化と成長を促します。';
      }
    }
    
    return alignment;
  }

  private generateSeed(): number {
    const birthTime = this.input.birthDate.getTime();
    const nameValue = this.input.fullName.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    
    // ヴェーダ占星術では出生地が重要
    const locationValue = this.input.currentLocation ? 
      Math.floor(this.input.currentLocation.latitude * 1000 + this.input.currentLocation.longitude * 1000) : 
      this.input.birthPlace.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    
    return Math.floor(birthTime + nameValue + locationValue) % 1000000;
  }
}