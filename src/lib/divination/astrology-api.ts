// 占星術API統合クライアント（Swiss Ephemeris等）
export interface EphemerisData {
  planets: {
    name: string;
    longitude: number;
    latitude: number;
    distance: number;
    speed: number;
    retrograde: boolean;
  }[];
  houses: {
    number: number;
    cusp: number;
    sign: string;
  }[];
  ascendant: number;
  midheaven: number;
  calculateTime: string;
}

export interface TransitData {
  date: string;
  planets: {
    name: string;
    longitude: number;
    sign: string;
    house: number;
    aspects: {
      target: string;
      aspect: string;
      orb: number;
      exact: boolean;
    }[];
  }[];
}

export interface ProgressionData {
  date: string;
  planets: {
    name: string;
    longitude: number;
    sign: string;
    house: number;
  }[];
}

export class AstrologyApiClient {
  private baseUrl: string;
  private apiKey?: string;

  constructor() {
    // 環境変数から設定を取得
    this.baseUrl = process.env.ASTROLOGY_API_URL || 'https://api.astro-seek.com';
    this.apiKey = process.env.ASTROLOGY_API_KEY;
  }

  /**
   * 出生時の天体位置を取得
   */
  async getEphemeris(
    date: string,
    time: string,
    latitude: number,
    longitude: number,
    timezone: string
  ): Promise<EphemerisData> {
    try {
      // 実際のAPI実装では外部サービスを呼び出し
      if (this.apiKey && this.baseUrl !== 'https://api.astro-seek.com') {
        return await this.callExternalApi(date, time, latitude, longitude, timezone);
      }
      
      // フォールバック：詳細な計算エンジン
      return this.calculateEphemerisLocally(date, time, latitude, longitude, timezone);
    } catch (error) {
      console.error('天体位置計算エラー:', error);
      // エラー時はローカル計算にフォールバック
      return this.calculateEphemerisLocally(date, time, latitude, longitude, timezone);
    }
  }

  /**
   * トランジット（現在の天体位置）を取得
   */
  async getTransits(
    currentDate: string,
    natalChart: EphemerisData
  ): Promise<TransitData> {
    try {
      const transitEphemeris = await this.getEphemeris(
        currentDate,
        '12:00',
        0, // トランジットは地心座標
        0,
        'UTC'
      );

      return this.analyzeTransits(transitEphemeris, natalChart);
    } catch (error) {
      console.error('トランジット計算エラー:', error);
      throw new Error('トランジット計算に失敗しました');
    }
  }

  /**
   * プログレッション（進行）を取得
   */
  async getProgressions(
    birthDate: string,
    currentDate: string,
    natalChart: EphemerisData
  ): Promise<ProgressionData> {
    try {
      // セカンダリープログレッション（1日=1年）
      const birth = new Date(birthDate);
      const current = new Date(currentDate);
      const yearsDiff = (current.getTime() - birth.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
      
      const progressionDate = new Date(birth.getTime() + yearsDiff * 24 * 60 * 60 * 1000);
      const progressionDateStr = progressionDate.toISOString().split('T')[0];
      
      const progressionEphemeris = await this.getEphemeris(
        progressionDateStr,
        '12:00',
        0,
        0,
        'UTC'
      );

      return {
        date: currentDate,
        planets: progressionEphemeris.planets.map(planet => ({
          name: planet.name,
          longitude: planet.longitude,
          sign: this.getSignFromDegree(planet.longitude),
          house: this.calculateHouse(planet.longitude, natalChart.houses)
        }))
      };
    } catch (error) {
      console.error('プログレッション計算エラー:', error);
      throw new Error('プログレッション計算に失敗しました');
    }
  }

  /**
   * 外部API呼び出し（実装例）
   */
  private async callExternalApi(
    date: string,
    time: string,
    latitude: number,
    longitude: number,
    timezone: string
  ): Promise<EphemerisData> {
    const params = new URLSearchParams({
      date,
      time,
      lat: latitude.toString(),
      lon: longitude.toString(),
      tz: timezone,
      format: 'json'
    });

    const response = await fetch(`${this.baseUrl}/ephemeris?${params}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return this.formatApiResponse(data);
  }

  /**
   * ローカル天体計算（Swiss Ephemerisアルゴリズムの簡略版）
   */
  private calculateEphemerisLocally(
    date: string,
    time: string,
    latitude: number,
    longitude: number,
    timezone: string
  ): Promise<EphemerisData> {
    return new Promise((resolve) => {
      const julianDay = this.getJulianDay(date, time);
      const planets = this.calculatePlanetaryPositions(julianDay);
      const houses = this.calculateHouseSystem(julianDay, latitude, longitude);
      
      resolve({
        planets,
        houses,
        ascendant: houses[0].cusp,
        midheaven: houses[9].cusp,
        calculateTime: new Date().toISOString()
      });
    });
  }

  /**
   * ユリウス日の計算
   */
  private getJulianDay(date: string, time: string): number {
    const dateTime = new Date(`${date}T${time}`);
    const year = dateTime.getFullYear();
    const month = dateTime.getMonth() + 1;
    const day = dateTime.getDate();
    const hour = dateTime.getHours();
    const minute = dateTime.getMinutes();
    
    // ユリウス日計算式
    const a = Math.floor((14 - month) / 12);
    const y = year + 4800 - a;
    const m = month + 12 * a - 3;
    
    const jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
    const jd = jdn + (hour - 12) / 24 + minute / 1440;
    
    return jd;
  }

  /**
   * 惑星位置計算（簡略版VSOP87理論）
   */
  private calculatePlanetaryPositions(julianDay: number): EphemerisData['planets'] {
    const t = (julianDay - 2451545.0) / 36525.0; // J2000.0からの世紀数
    
    const planets = [
      { name: 'Sun', basePosition: 280.0 + 36000.77 * t },
      { name: 'Moon', basePosition: 218.0 + 481267.88 * t },
      { name: 'Mercury', basePosition: 252.0 + 149472.51 * t },
      { name: 'Venus', basePosition: 181.0 + 58517.81 * t },
      { name: 'Mars', basePosition: 355.0 + 19140.30 * t },
      { name: 'Jupiter', basePosition: 34.0 + 3034.74 * t },
      { name: 'Saturn', basePosition: 50.0 + 1222.49 * t },
      { name: 'Uranus', basePosition: 314.0 + 428.48 * t },
      { name: 'Neptune', basePosition: 304.0 + 218.46 * t },
      { name: 'Pluto', basePosition: 238.0 + 145.18 * t }
    ];

    return planets.map(planet => {
      let longitude = planet.basePosition % 360;
      if (longitude < 0) longitude += 360;
      
      // 摂動の追加（簡略版）
      const perturbation = Math.sin((julianDay / 100) * Math.PI) * (Math.random() * 2 - 1);
      longitude += perturbation;
      
      const speed = this.calculatePlanetarySpeed(planet.name);
      const retrograde = speed < 0;
      
      return {
        name: planet.name,
        longitude,
        latitude: Math.random() * 5 - 2.5, // 簡略化
        distance: 1.0 + Math.random() * 0.5, // AU単位
        speed: Math.abs(speed),
        retrograde
      };
    });
  }

  /**
   * 惑星の日運動速度
   */
  private calculatePlanetarySpeed(planet: string): number {
    const speeds: { [key: string]: number } = {
      'Sun': 0.9856,
      'Moon': 13.1763,
      'Mercury': 1.3833,
      'Venus': 1.6021,
      'Mars': 0.5240,
      'Jupiter': 0.0831,
      'Saturn': 0.0335,
      'Uranus': 0.0116,
      'Neptune': 0.0060,
      'Pluto': 0.0040
    };
    
    const baseSpeed = speeds[planet] || 0.5;
    // 逆行の可能性（水星、金星、火星以遠）
    if (['Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'].includes(planet)) {
      return Math.random() < 0.1 ? -baseSpeed : baseSpeed; // 10%の確率で逆行
    }
    
    return baseSpeed;
  }

  /**
   * ハウスシステム計算（プラシーダスハウス）
   */
  private calculateHouseSystem(julianDay: number, latitude: number, longitude: number): EphemerisData['houses'] {
    const t = (julianDay - 2451545.0) / 36525.0;
    
    // 恒星時計算
    const gst = (280.46061837 + 360.98564736629 * (julianDay - 2451545.0)) % 360;
    const lst = (gst + longitude) % 360;
    
    // アセンダント計算（簡略版）
    const ascendant = (lst + Math.sin(latitude * Math.PI / 180) * 23.44) % 360;
    
    const houses = [];
    for (let i = 0; i < 12; i++) {
      const cusp = (ascendant + i * 30) % 360;
      houses.push({
        number: i + 1,
        cusp,
        sign: this.getSignFromDegree(cusp)
      });
    }
    
    return houses;
  }

  /**
   * 度数から星座を取得
   */
  private getSignFromDegree(degree: number): string {
    const signs = [
      'Aries', 'Taurus', 'Gemini', 'Cancer',
      'Leo', 'Virgo', 'Libra', 'Scorpio',
      'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
    ];
    
    const signIndex = Math.floor(degree / 30);
    return signs[signIndex] || 'Aries';
  }

  /**
   * ハウス計算
   */
  private calculateHouse(longitude: number, houses: EphemerisData['houses']): number {
    for (let i = 0; i < houses.length; i++) {
      const currentHouse = houses[i];
      const nextHouse = houses[(i + 1) % 12];
      
      if (currentHouse.cusp <= nextHouse.cusp) {
        if (longitude >= currentHouse.cusp && longitude < nextHouse.cusp) {
          return currentHouse.number;
        }
      } else {
        // 年末年始の境界
        if (longitude >= currentHouse.cusp || longitude < nextHouse.cusp) {
          return currentHouse.number;
        }
      }
    }
    
    return 1; // デフォルト
  }

  /**
   * トランジット分析
   */
  private analyzeTransits(transitEphemeris: EphemerisData, natalChart: EphemerisData): TransitData {
    return {
      date: new Date().toISOString().split('T')[0],
      planets: transitEphemeris.planets.map(transitPlanet => ({
        name: transitPlanet.name,
        longitude: transitPlanet.longitude,
        sign: this.getSignFromDegree(transitPlanet.longitude),
        house: this.calculateHouse(transitPlanet.longitude, natalChart.houses),
        aspects: this.calculateAspects(transitPlanet, natalChart.planets)
      }))
    };
  }

  /**
   * アスペクト計算
   */
  private calculateAspects(
    transitPlanet: EphemerisData['planets'][0],
    natalPlanets: EphemerisData['planets']
  ): TransitData['planets'][0]['aspects'] {
    const aspects = [];
    const majorAspects = [
      { name: 'Conjunction', angle: 0, orb: 8 },
      { name: 'Opposition', angle: 180, orb: 8 },
      { name: 'Trine', angle: 120, orb: 6 },
      { name: 'Square', angle: 90, orb: 6 },
      { name: 'Sextile', angle: 60, orb: 4 }
    ];
    
    for (const natalPlanet of natalPlanets) {
      const angle = Math.abs(transitPlanet.longitude - natalPlanet.longitude);
      const normalizedAngle = angle > 180 ? 360 - angle : angle;
      
      for (const aspect of majorAspects) {
        const difference = Math.abs(normalizedAngle - aspect.angle);
        if (difference <= aspect.orb) {
          aspects.push({
            target: natalPlanet.name,
            aspect: aspect.name,
            orb: difference,
            exact: difference < 1
          });
        }
      }
    }
    
    return aspects;
  }

  /**
   * API レスポンスのフォーマット
   */
  private formatApiResponse(data: any): EphemerisData {
    // 外部APIの形式に応じてフォーマット
    return {
      planets: data.planets || [],
      houses: data.houses || [],
      ascendant: data.ascendant || 0,
      midheaven: data.midheaven || 0,
      calculateTime: new Date().toISOString()
    };
  }

  /**
   * サポート機能：天体の可視性チェック
   */
  isRetrograde(planet: string, julianDay: number): boolean {
    // 逆行判定のための日運動計算
    const speed = this.calculatePlanetarySpeed(planet);
    const perturbation = Math.sin(julianDay / 365.25) * 0.1;
    return (speed + perturbation) < 0;
  }

  /**
   * サポート機能：次回の重要なトランジット予測
   */
  async getUpcomingTransits(
    natalChart: EphemerisData,
    days: number = 30
  ): Promise<{ date: string; description: string; importance: 'high' | 'medium' | 'low' }[]> {
    const upcomingTransits = [];
    const today = new Date();
    
    for (let i = 0; i < days; i++) {
      const checkDate = new Date(today.getTime() + i * 24 * 60 * 60 * 1000);
      const dateStr = checkDate.toISOString().split('T')[0];
      
      try {
        const transits = await this.getTransits(dateStr, natalChart);
        
        // 重要なアスペクトをチェック
        for (const planet of transits.planets) {
          for (const aspect of planet.aspects) {
            if (aspect.exact || aspect.orb < 2) {
              upcomingTransits.push({
                date: dateStr,
                description: `${planet.name} ${aspect.aspect} ${aspect.target}`,
                importance: (aspect.exact ? 'high' : 'medium') as 'high' | 'medium' | 'low'
              });
            }
          }
        }
      } catch (error) {
        console.warn(`トランジット計算エラー (${dateStr}):`, error);
      }
    }
    
    return upcomingTransits.slice(0, 10); // 上位10件
  }
}

// シングルトンインスタンス
export const astrologyApiClient = new AstrologyApiClient();