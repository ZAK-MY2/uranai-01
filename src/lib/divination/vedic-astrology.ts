// ヴェーダ占星術エンジン
import { VedicSigns, Nakshatras, Houses, Dashas } from './vedic-data';
import { VedicInput, VedicResult } from '@/types/divination';


export interface VedicPlanet {
  name: string;
  sign: string;
  degree: number;
  house: number;
  nakshatra: string;
  pada: number;
  retrograde: boolean;
  dignity: 'exalted' | 'own' | 'friend' | 'neutral' | 'enemy' | 'debilitated';
}

export interface VedicHouse {
  number: number;
  sign: string;
  lord: string;
  planets: string[];
  signification: string[];
  strength: number;
}

export interface Nakshatra {
  name: string;
  degree: number;
  pada: number;
  lord: string;
  characteristics: string;
  symbol: string;
  deity: string;
}

export interface DashaPeriod {
  planet: string;
  startDate: string;
  endDate: string;
  subPeriods: {
    planet: string;
    startDate: string;
    endDate: string;
    duration: number; // days
  }[];
  effects: string;
}


export class VedicAstrologyEngine {
  private signs: typeof VedicSigns;
  private nakshatras: typeof Nakshatras;
  private houses: typeof Houses;
  private dashas: typeof Dashas;

  constructor() {
    this.signs = VedicSigns;
    this.nakshatras = Nakshatras;
    this.houses = Houses;
    this.dashas = Dashas;
  }

  /**
   * ヴェーダ占星術を実行
   */
  async performReading(input: VedicInput): Promise<VedicResult> {
    try {
      // 出生チャート計算
      const birthChart = this.calculateBirthChart(input);
      
      // 惑星・ハウスの強度計算
      const strengths = this.calculateStrengths(birthChart);
      
      // ドーシャ分析
      const doshas = this.analyzeDoshas(birthChart);
      
      // ダシャー期間計算
      const dashas = this.calculateDashas(input, birthChart);
      
      // ヨーガ分析
      const yogas = this.analyzeYogas(birthChart);
      
      // 予測生成
      const predictions = this.generatePredictions(birthChart, dashas, yogas);
      
      // 救済措置
      const remedies = this.generateRemedies(birthChart, doshas);
      
      // 相性分析（オプション）
      const compatibility = this.analyzeCompatibility(birthChart);

      return {
        chart: {
          ascendant: birthChart.ascendant,
          moonSign: birthChart.moonSign,
          sunSign: birthChart.sunSign,
          nakshatra: birthChart.nakshatra.name,
          planets: birthChart.planets.map((p: any) => ({
            name: p.name,
            sign: p.sign,
            nakshatra: p.nakshatra,
            degree: p.degree
          }))
        },
        analysis: {
          personality: predictions.career,
          career: predictions.career,
          relationships: predictions.marriage,
          health: predictions.health,
          spirituality: predictions.spiritual
        },
        interpretation: {
          overall: `総合的な分析によると、${birthChart.moonSign}の影響が強く、人生において精神的な成長と物質的な成功の両方を達成する可能性があります。`,
          strengths: `主な強みは${Object.entries(strengths.planetary).filter(([k,v]) => (v as number) > 70).map(([k,v]) => k).join('、')}です。`,
          challenges: doshas.description.join('、'),
          remedies: `推奨される対策: ${remedies.gemstones.concat(remedies.mantras).slice(0, 3).join('、')}`
        },
        dasha: {
          current: dashas.current.planet,
          period: `${dashas.current.startDate}から${dashas.current.endDate}まで`,
          description: dashas.current.effects
        }
      };
    } catch (error) {
      console.error('ヴェーダ占星術エラー:', error);
      throw new Error('ヴェーダ占星術の実行中にエラーが発生しました');
    }
  }

  /**
   * 出生チャート計算
   */
  private calculateBirthChart(input: VedicInput): any {
    // 実際の実装では天体計算ライブラリを使用
    // ここでは模擬データを生成
    
    const ascendant = this.calculateAscendant(input);
    const planets = this.calculatePlanetaryPositions(input);
    const houses = this.calculateHouses(ascendant, planets);
    const nakshatra = this.calculateMoonNakshatra(planets);
    
    const moonPlanet = planets.find(p => p.name === 'Moon');
    const sunPlanet = planets.find(p => p.name === 'Sun');
    
    return {
      ascendant,
      moonSign: moonPlanet?.sign || 'Aries',
      sunSign: sunPlanet?.sign || 'Aries',
      planets,
      houses,
      nakshatra
    };
  }

  /**
   * アセンダント計算
   */
  private calculateAscendant(input: VedicInput): string {
    // 簡略化された計算（実際は複雑な天体計算が必要）
    const birthDate = new Date(input.birthDate + 'T' + input.birthTime);
    const hour = birthDate.getHours();
    const minute = birthDate.getMinutes();
    const day = birthDate.getDate();
    
    // 生年月日と時刻から決定的に計算
    const totalMinutes = hour * 60 + minute;
    const dateHash = (birthDate.getFullYear() + birthDate.getMonth() * 31 + day) % 12;
    const timeHash = Math.floor(totalMinutes / 120); // 2時間間隔
    const signIndex = (dateHash + timeHash) % 12;
    
    return this.signs[signIndex].name;
  }

  /**
   * 惑星位置計算
   */
  private calculatePlanetaryPositions(input: VedicInput): VedicPlanet[] {
    const planetNames = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
    const birthDate = new Date(input.birthDate + 'T' + input.birthTime);
    const baseYear = birthDate.getFullYear();
    const dayOfYear = Math.floor((birthDate.getTime() - new Date(baseYear, 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    
    return planetNames.map((name, index) => {
      // 生年月日と惑星位置から決定的に計算
      const planetOffset = index * 43; // 各惑星の軌道周期を模擬
      const yearCycle = (baseYear - 2000) % 12; // 12年周期
      const dayFactor = (dayOfYear * 7) % 360; // 日数から度数を計算
      
      const totalDegree = (planetOffset + yearCycle * 30 + dayFactor) % 360;
      const signIndex = Math.floor(totalDegree / 30);
      const degree = totalDegree % 30;
      
      // ハウス計算（簡略化）
      const house = ((signIndex + index * 2) % 12) + 1;
      
      // ナクシャトラ計算
      const nakshatraIndex = Math.floor(totalDegree / 13.33) % 27;
      const pada = Math.floor((degree % 13.33) / 3.33) + 1;
      
      // 逆行判定（決定的）
      const retrograde = (baseYear + index * 3) % 7 < 2; // 約30%の確率で逆行
      
      return {
        name,
        sign: this.signs[signIndex].name,
        degree,
        house,
        nakshatra: this.nakshatras[nakshatraIndex].name,
        pada,
        retrograde,
        dignity: this.calculatePlanetaryDignity(name, this.signs[signIndex].name)
      };
    });
  }

  /**
   * 惑星の品位計算
   */
  private calculatePlanetaryDignity(planet: string, sign: string): VedicPlanet['dignity'] {
    const exaltationSigns: { [key: string]: string } = {
      'Sun': 'Aries',
      'Moon': 'Taurus',
      'Mars': 'Capricorn',
      'Mercury': 'Virgo',
      'Jupiter': 'Cancer',
      'Venus': 'Pisces',
      'Saturn': 'Libra'
    };
    
    const ownSigns: { [key: string]: string[] } = {
      'Sun': ['Leo'],
      'Moon': ['Cancer'],
      'Mars': ['Aries', 'Scorpio'],
      'Mercury': ['Gemini', 'Virgo'],
      'Jupiter': ['Sagittarius', 'Pisces'],
      'Venus': ['Taurus', 'Libra'],
      'Saturn': ['Capricorn', 'Aquarius']
    };
    
    const debilitationSigns: { [key: string]: string } = {
      'Sun': 'Libra',
      'Moon': 'Scorpio',
      'Mars': 'Cancer',
      'Mercury': 'Pisces',
      'Jupiter': 'Capricorn',
      'Venus': 'Virgo',
      'Saturn': 'Aries'
    };
    
    if (exaltationSigns[planet] === sign) return 'exalted';
    if (ownSigns[planet]?.includes(sign)) return 'own';
    if (debilitationSigns[planet] === sign) return 'debilitated';
    
    // 友好・中性・敵対の決定的な計算
    const signIndex = this.signs.findIndex(s => s.name === sign);
    const planetHash = planet.charCodeAt(0) + planet.length;
    const dignityIndex = (signIndex + planetHash) % 3;
    const dignities: VedicPlanet['dignity'][] = ['friend', 'neutral', 'enemy'];
    
    return dignities[dignityIndex];
  }

  /**
   * ハウス計算
   */
  private calculateHouses(ascendant: string, planets: VedicPlanet[]): VedicHouse[] {
    const ascendantIndex = this.signs.findIndex(s => s.name === ascendant);
    
    return Array.from({ length: 12 }, (_, i) => {
      const houseNumber = i + 1;
      const signIndex = (ascendantIndex + i) % 12;
      const sign = this.signs[signIndex].name;
      const housePlanets = planets.filter(p => p.house === houseNumber).map(p => p.name);
      const houseData = this.houses[i];
      
      return {
        number: houseNumber,
        sign,
        lord: this.getSignLord(sign),
        planets: housePlanets,
        signification: houseData.signification,
        strength: this.calculateHouseStrength(houseNumber, housePlanets)
      };
    });
  }

  /**
   * 星座の支配星取得
   */
  private getSignLord(sign: string): string {
    const lordMap: { [key: string]: string } = {
      'Aries': 'Mars',
      'Taurus': 'Venus',
      'Gemini': 'Mercury',
      'Cancer': 'Moon',
      'Leo': 'Sun',
      'Virgo': 'Mercury',
      'Libra': 'Venus',
      'Scorpio': 'Mars',
      'Sagittarius': 'Jupiter',
      'Capricorn': 'Saturn',
      'Aquarius': 'Saturn',
      'Pisces': 'Jupiter'
    };
    
    return lordMap[sign] || 'Unknown';
  }

  /**
   * 月のナクシャトラ計算
   */
  private calculateMoonNakshatra(planets: VedicPlanet[]): Nakshatra {
    const moonPlanet = planets.find(p => p.name === 'Moon');
    if (!moonPlanet) {
      return {
        name: 'Ashwini',
        degree: 0,
        pada: 1,
        lord: 'Ketu',
        characteristics: 'Unknown',
        symbol: 'Horse Head',
        deity: 'Ashwini Kumaras'
      };
    }
    
    const nakshatraData = this.nakshatras.find(n => n.name === moonPlanet.nakshatra);
    if (!nakshatraData) {
      return {
        name: moonPlanet.nakshatra,
        degree: moonPlanet.degree,
        pada: moonPlanet.pada,
        lord: 'Unknown',
        characteristics: 'Unknown',
        symbol: 'Unknown',
        deity: 'Unknown'
      };
    }
    
    return {
      name: nakshatraData.name,
      degree: moonPlanet.degree,
      pada: moonPlanet.pada,
      lord: nakshatraData.lord,
      characteristics: nakshatraData.characteristics,
      symbol: nakshatraData.symbol,
      deity: nakshatraData.deity
    };
  }

  /**
   * 強度計算
   */
  private calculateStrengths(birthChart: any): any {
    const planetary: { [planet: string]: number } = {};
    birthChart.planets.forEach((planet: any) => {
      let strength = 50; // ベーススコア
      
      switch (planet.dignity) {
        case 'exalted': strength += 30; break;
        case 'own': strength += 20; break;
        case 'friend': strength += 10; break;
        case 'neutral': break;
        case 'enemy': strength -= 10; break;
        case 'debilitated': strength -= 30; break;
      }
      
      if (planet.retrograde) strength -= 5;
      
      planetary[planet.name] = Math.max(0, Math.min(100, strength));
    });
    
    const house: { [house: string]: number } = {};
    birthChart.houses.forEach((h: any) => {
      house[`House ${h.number}`] = h.strength;
    });
    
    const overall = Object.values(planetary).reduce((sum, val) => sum + val, 0) / Object.keys(planetary).length;
    
    return { planetary, house, overall };
  }

  /**
   * ハウス強度計算
   */
  private calculateHouseStrength(houseNumber: number, planets: string[]): number {
    let strength = 50; // ベーススコア
    
    // 惑星の数による影響
    strength += planets.length * 10;
    
    // 特定のハウスの特別な考慮
    if ([1, 4, 7, 10].includes(houseNumber)) strength += 10; // ケンドラハウス
    if ([5, 9].includes(houseNumber)) strength += 15; // トリコーナハウス
    if ([6, 8, 12].includes(houseNumber)) strength -= 10; // ドゥシュタナハウス
    
    return Math.max(0, Math.min(100, strength));
  }

  /**
   * ドーシャ分析
   */
  private analyzeDoshas(birthChart: any): any {
    const marsPlanet = birthChart.planets.find((p: any) => p.name === 'Mars');
    const mangal = marsPlanet ? [1, 2, 4, 7, 8, 12].includes(marsPlanet.house) : false;
    
    // ラーフ・ケートゥの配置からカール・サルプ・ドーシャを判定
    const rahuPlanet = birthChart.planets.find((p: any) => p.name === 'Rahu');
    const ketuPlanet = birthChart.planets.find((p: any) => p.name === 'Ketu');
    const kaal = rahuPlanet && ketuPlanet ? 
      Math.abs(rahuPlanet.house - ketuPlanet.house) === 6 : false;
    
    // 月の配置からナディ・ドーシャを判定
    const moonPlanet = birthChart.planets.find((p: any) => p.name === 'Moon');
    const nadi = moonPlanet ? [6, 8, 12].includes(moonPlanet.house) : false;
    
    const description = [];
    if (mangal) description.push('マンガル・ドーシャ：結婚に影響する可能性があります。適切な救済措置が推奨されます。');
    if (kaal) description.push('カール・サルプ・ドーシャ：精神的な障害や遅延が起こる可能性があります。');
    if (nadi) description.push('ナディ・ドーシャ：健康問題に注意が必要です。');
    
    if (description.length === 0) {
      description.push('主要なドーシャは見つかりませんでした。良好な状態です。');
    }
    
    return { mangal, kaal, nadi, description };
  }

  /**
   * ダシャー計算
   */
  private calculateDashas(input: VedicInput, birthChart: any): any {
    const birthDate = new Date(input.birthDate);
    const currentDate = new Date();
    
    // 簡略化されたダシャー計算
    const moonNakshatra = birthChart.nakshatra;
    const dashaPlanet = moonNakshatra.lord;
    
    const current: DashaPeriod = {
      planet: dashaPlanet,
      startDate: '2020-01-01',
      endDate: '2027-01-01',
      subPeriods: [],
      effects: `${dashaPlanet}の大運期間中は、この惑星の特質が人生に強く影響します。`
    };
    
    const next: DashaPeriod = {
      planet: 'Mercury',
      startDate: '2027-01-01',
      endDate: '2044-01-01',
      subPeriods: [],
      effects: 'Mercuryの大運期間は知性と商業的成功に関連します。'
    };
    
    // 生涯のダシャー（簡略版）
    const life = [current, next];
    
    return { current, next, life };
  }

  /**
   * ヨーガ分析
   */
  private analyzeYogas(birthChart: any): any {
    const yogas = [];
    
    // ラジャ・ヨーガの検出
    const jupiter = birthChart.planets.find((p: any) => p.name === 'Jupiter');
    const venus = birthChart.planets.find((p: any) => p.name === 'Venus');
    
    if (jupiter && venus && Math.abs(jupiter.house - venus.house) <= 2) {
      yogas.push({
        name: 'ガージャ・ケサリ・ヨーガ',
        planets: ['Jupiter', 'Moon'],
        effect: '知恵、名声、富をもたらす吉祥なヨーガです。',
        strength: 'strong' as const
      });
    }
    
    // パンチャ・マハープルシャ・ヨーガ
    const mars = birthChart.planets.find((p: any) => p.name === 'Mars');
    if (mars && ['exalted', 'own'].includes(mars.dignity)) {
      yogas.push({
        name: 'ルチャカ・ヨーガ',
        planets: ['Mars'],
        effect: '勇気、リーダーシップ、軍事的才能をもたらします。',
        strength: 'moderate' as const
      });
    }
    
    if (yogas.length === 0) {
      yogas.push({
        name: '一般的な配置',
        planets: [],
        effect: '特別なヨーガは形成されていませんが、バランスの取れた配置です。',
        strength: 'weak' as const
      });
    }
    
    return yogas;
  }

  /**
   * 予測生成
   */
  private generatePredictions(
    birthChart: any,
    dashas: any,
    yogas: any
  ): any {
    return {
      career: '職業運は良好で、特に教育、金融、技術分野での成功が期待できます。現在のダシャー期間中に重要な進展があるでしょう。',
      marriage: '結婚は人生に大きな幸福をもたらします。パートナーは知的で支援的な人物になるでしょう。適切な時期は25-30歳です。',
      health: '全般的に健康は良好ですが、消化器系と神経系に注意が必要です。定期的な運動と瞑想が推奨されます。',
      wealth: '経済状況は段階的に改善します。投資と貯蓄に関する知恵があり、中年期以降に財産を築くことができます。',
      education: '学習能力に優れ、高等教育で成功します。研究や専門分野での深い知識を獲得する可能性があります。',
      family: '家族関係は調和的で、特に母親との絆が強いです。家庭は平和で安定した環境になります。',
      spiritual: '精神的な成長への強い傾向があります。瞑想、ヨーガ、宗教的実践を通じて内面的な平安を得るでしょう。'
    };
  }

  /**
   * 救済措置生成
   */
  private generateRemedies(
    birthChart: any,
    doshas: any
  ): any {
    const remedies: any = {
      gemstones: [],
      mantras: [],
      donations: [],
      fasting: [],
      worship: []
    };
    
    // アセンダントに基づく基本的な宝石
    const ascendantGems: { [key: string]: string } = {
      'Aries': 'Red Coral',
      'Taurus': 'Diamond',
      'Gemini': 'Emerald',
      'Cancer': 'Pearl',
      'Leo': 'Ruby',
      'Virgo': 'Emerald',
      'Libra': 'Diamond',
      'Scorpio': 'Red Coral',
      'Sagittarius': 'Yellow Sapphire',
      'Capricorn': 'Blue Sapphire',
      'Aquarius': 'Blue Sapphire',
      'Pisces': 'Yellow Sapphire'
    };
    
    const ascendantGem = ascendantGems[birthChart.ascendant];
    if (ascendantGem) remedies.gemstones.push(ascendantGem);
    
    // 基本的なマントラ
    remedies.mantras.push('Om Gam Ganapataye Namaha', 'Gayatri Mantra');
    
    // ドーシャに基づく特別な救済措置
    if (doshas.mangal) {
      remedies.gemstones.push('Red Coral');
      remedies.mantras.push('Om Angarakaya Namaha');
      remedies.donations.push('Red lentils on Tuesday');
      remedies.fasting.push('Tuesday fasting');
      remedies.worship.push('Lord Hanuman worship');
    }
    
    if (doshas.kaal) {
      remedies.mantras.push('Rahu-Ketu peace mantras');
      remedies.worship.push('Lord Shiva worship');
    }
    
    // 基本的な救済措置
    remedies.donations.push('Feed cows', 'Donate to poor');
    remedies.fasting.push('Ekadashi fasting');
    remedies.worship.push('Regular temple visits');
    
    return remedies;
  }

  /**
   * 相性分析
   */
  private analyzeCompatibility(birthChart: any): any {
    return {
      partner: `${birthChart.moonSign}の人は、Taurus、Virgo、Capricornの人と相性が良いです。`,
      business: '信頼できるパートナーとの協力により、ビジネスで成功する可能性があります。',
      friendship: '知的で精神的な価値観を共有する友人との絆が深まります。'
    };
  }

  /**
   * キャッシュキーの生成
   */
  generateCacheKey(input: VedicInput): string {
    const birthDateTime = input.birthDate + 'T' + input.birthTime;
    return `vedic:${birthDateTime}:${input.name}`;
  }
}

// シングルトンインスタンス
export const vedicAstrologyEngine = new VedicAstrologyEngine();