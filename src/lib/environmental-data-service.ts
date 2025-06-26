/**
 * 環境データ統合サービス
 * 
 * リアルタイム環境データの収集・統合・占術エンジンへの提供
 * 「ランダムではなく環境データで解釈パターンを選択」の実現
 */

export interface EnvironmentalContext {
  // 基本時間・天体データ（常に利用可能）
  timestamp: Date;
  location: {
    latitude: number;
    longitude: number;
    timezone: string;
  };
  
  // 天体・自然データ（計算可能）
  celestial: {
    lunarPhase: LunarPhase;
    lunarIllumination: number;
    season: Season;
    solarPosition: SolarPosition;
    dayNightCycle: 'dawn' | 'morning' | 'noon' | 'afternoon' | 'dusk' | 'night' | 'midnight';
  };
  
  // 気象データ（API取得）
  weather?: {
    condition: string;
    temperature: number;
    humidity: number;
    pressure: number;
    windDirection: number;
    windSpeed: number;
    visibility: number;
  };
  
  // 地磁気・宇宙天気（NASA API取得）
  space?: {
    geomagneticActivity: 'quiet' | 'unsettled' | 'active' | 'minor_storm' | 'major_storm';
    solarFlareActivity: 'none' | 'c_class' | 'm_class' | 'x_class';
    cosmicRadiation: number;
  };
  
  // 社会的コンテキスト（推定・ユーザー入力）
  social?: {
    culturalEvents: string[];
    economicSentiment: 'positive' | 'neutral' | 'negative';
    seasonalEvents: string[];
    marketConditions: 'bull' | 'bear' | 'sideways';
  };
  
  // 個人的サイクル（計算可能）
  personal: {
    birthDateDistance: number; // 誕生日からの日数
    biorhythm: {
      physical: number;   // -1 to 1
      emotional: number;  // -1 to 1
      intellectual: number; // -1 to 1
    };
    lunarPersonalCycle: number; // 個人の月サイクル位置
  };
}

export interface LunarPhase {
  name: '新月' | '上弦の月' | '満月' | '下弦の月';
  illumination: number;
  age: number; // 月齢
  phase: number; // 0-1
  nextPhase: Date;
}

export interface Season {
  name: '春' | '夏' | '秋' | '冬';
  progress: number; // 0-1（その季節での進行度）
  solsticeEquinoxDistance: number; // 最近の至点・分点からの日数
}

export interface SolarPosition {
  declination: number;
  rightAscension: number;
  azimuth: number;
  elevation: number;
  sunrise: Date;
  sunset: Date;
  solarNoon: Date;
}

/**
 * 環境データ収集・統合サービス
 */
export class EnvironmentalDataService {
  private cache: Map<string, { data: any; timestamp: Date; ttl: number }> = new Map();
  
  /**
   * 完全な環境コンテキストを生成
   */
  async generateEnvironmentalContext(
    location: { latitude: number; longitude: number },
    timestamp: Date = new Date(),
    birthDate?: Date
  ): Promise<EnvironmentalContext> {
    const context: EnvironmentalContext = {
      timestamp,
      location: {
        ...location,
        timezone: this.getTimezone(location)
      },
      celestial: await this.calculateCelestialData(location, timestamp),
      personal: this.calculatePersonalCycles(timestamp, birthDate)
    };

    // 外部APIデータを並列取得（エラー時は undefined）
    try {
      const [weather, space] = await Promise.allSettled([
        this.fetchWeatherData(location),
        this.fetchSpaceWeatherData()
      ]);

      if (weather.status === 'fulfilled') {
        context.weather = weather.value;
      }
      if (space.status === 'fulfilled') {
        context.space = space.value;
      }
    } catch (error) {
      console.log('External API data unavailable, using calculated data only');
    }

    // 社会的コンテキストを推定
    context.social = this.estimateSocialContext(timestamp);

    return context;
  }

  /**
   * 天体データ計算（常に利用可能）
   */
  private async calculateCelestialData(
    location: { latitude: number; longitude: number },
    timestamp: Date
  ): Promise<EnvironmentalContext['celestial']> {
    const lunar = this.calculateLunarPhase(timestamp);
    const season = this.calculateSeason(timestamp);
    const solar = this.calculateSolarPosition(location, timestamp);
    const dayNight = this.determineDayNightCycle(solar, timestamp);

    return {
      lunarPhase: lunar,
      lunarIllumination: lunar.illumination,
      season,
      solarPosition: solar,
      dayNightCycle: dayNight
    };
  }

  /**
   * 月相計算（高精度天文計算）
   */
  private calculateLunarPhase(date: Date): LunarPhase {
    const julianDay = this.dateToJulianDay(date);
    
    // 新月からの経過日数
    const lunarCycleLength = 29.53058868; // 平均朔望月
    const knownNewMoon = 2451550.09766; // 2000年1月6日の新月
    
    const daysSinceKnownNewMoon = julianDay - knownNewMoon;
    const cyclePosition = (daysSinceKnownNewMoon % lunarCycleLength) / lunarCycleLength;
    
    const age = cyclePosition * lunarCycleLength;
    const illumination = 0.5 * (1 - Math.cos(2 * Math.PI * cyclePosition));
    
    // 月相名の決定
    let phaseName: LunarPhase['name'];
    if (cyclePosition < 0.125 || cyclePosition >= 0.875) {
      phaseName = '新月';
    } else if (cyclePosition < 0.375) {
      phaseName = '上弦の月';
    } else if (cyclePosition < 0.625) {
      phaseName = '満月';
    } else {
      phaseName = '下弦の月';
    }

    // 次の月相の計算
    const nextPhaseTime = this.calculateNextPhaseTime(cyclePosition, julianDay);

    return {
      name: phaseName,
      illumination: Math.round(illumination * 1000) / 1000,
      age: Math.round(age * 10) / 10,
      phase: Math.round(cyclePosition * 1000) / 1000,
      nextPhase: this.julianDayToDate(nextPhaseTime)
    };
  }

  /**
   * 季節計算
   */
  private calculateSeason(date: Date): Season {
    const year = date.getFullYear();
    const dayOfYear = this.getDayOfYear(date);
    
    // 北半球の季節（南半球は6か月ずらす）
    let season: Season['name'];
    let seasonStart: number;
    
    if (dayOfYear >= 80 && dayOfYear < 172) { // 春分～夏至
      season = '春';
      seasonStart = 80; // 3月21日頃
    } else if (dayOfYear >= 172 && dayOfYear < 266) { // 夏至～秋分
      season = '夏';
      seasonStart = 172; // 6月21日頃
    } else if (dayOfYear >= 266 && dayOfYear < 355) { // 秋分～冬至
      season = '秋';
      seasonStart = 266; // 9月23日頃
    } else { // 冬至～春分
      season = '冬';
      seasonStart = dayOfYear >= 355 ? 355 : -10; // 12月22日頃～
    }

    const seasonLength = 92; // 平均的な季節の長さ
    const progress = ((dayOfYear - seasonStart + 365) % 365) / seasonLength;
    
    // 最近の至点・分点からの距離計算
    const solsticeEquinoxDays = [80, 172, 266, 355]; // 分点・至点の日
    const distances = solsticeEquinoxDays.map(day => Math.min(
      Math.abs(dayOfYear - day),
      365 - Math.abs(dayOfYear - day)
    ));
    const solsticeEquinoxDistance = Math.min(...distances);

    return {
      name: season,
      progress: Math.min(1, Math.max(0, progress)),
      solsticeEquinoxDistance
    };
  }

  /**
   * 太陽位置計算
   */
  private calculateSolarPosition(
    location: { latitude: number; longitude: number },
    date: Date
  ): SolarPosition {
    const julianDay = this.dateToJulianDay(date);
    const n = julianDay - 2451545.0;
    
    // 太陽の平均黄経
    const L = (280.460 + 0.9856474 * n) % 360;
    
    // 太陽の平均近点角
    const g = ((357.528 + 0.9856003 * n) % 360) * Math.PI / 180;
    
    // 太陽の黄経
    const lambda = (L + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g)) * Math.PI / 180;
    
    // 太陽の赤緯
    const epsilon = 23.439 * Math.PI / 180; // 黄道傾斜角
    const declination = Math.asin(Math.sin(lambda) * Math.sin(epsilon));
    
    // 太陽の赤経
    const rightAscension = Math.atan2(Math.cos(epsilon) * Math.sin(lambda), Math.cos(lambda));
    
    // 地方恒星時
    const LST = this.calculateLocalSiderealTime(location.longitude, julianDay);
    
    // 時角
    const hourAngle = LST - rightAscension;
    
    // 方位角・高度角
    const lat = location.latitude * Math.PI / 180;
    const elevation = Math.asin(
      Math.sin(lat) * Math.sin(declination) + 
      Math.cos(lat) * Math.cos(declination) * Math.cos(hourAngle)
    );
    
    const azimuth = Math.atan2(
      -Math.sin(hourAngle),
      Math.tan(declination) * Math.cos(lat) - Math.sin(lat) * Math.cos(hourAngle)
    );

    // 日の出・日の入り時刻計算
    const { sunrise, sunset, solarNoon } = this.calculateSunTimes(location, date);

    return {
      declination: declination * 180 / Math.PI,
      rightAscension: rightAscension * 180 / Math.PI,
      azimuth: (azimuth * 180 / Math.PI + 360) % 360,
      elevation: elevation * 180 / Math.PI,
      sunrise,
      sunset,
      solarNoon
    };
  }

  /**
   * 個人サイクル計算
   */
  private calculatePersonalCycles(
    timestamp: Date,
    birthDate?: Date
  ): EnvironmentalContext['personal'] {
    const birthDateDistance = birthDate ? 
      Math.floor((timestamp.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24)) : 0;

    const biorhythm = birthDate ? {
      physical: Math.sin(2 * Math.PI * birthDateDistance / 23),
      emotional: Math.sin(2 * Math.PI * birthDateDistance / 28),
      intellectual: Math.sin(2 * Math.PI * birthDateDistance / 33)
    } : { physical: 0, emotional: 0, intellectual: 0 };

    // 個人の月サイクル（誕生日からの月齢での位置）
    const lunarPersonalCycle = birthDate ? 
      (birthDateDistance % 29.53058868) / 29.53058868 : 0;

    return {
      birthDateDistance,
      biorhythm,
      lunarPersonalCycle
    };
  }

  /**
   * 気象データ取得（気象庁API使用）
   */
  private async fetchWeatherData(
    location: { latitude: number; longitude: number }
  ): Promise<EnvironmentalContext['weather']> {
    const cacheKey = `weather_${location.latitude}_${location.longitude}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp.getTime() < cached.ttl) {
      return cached.data;
    }

    try {
      // 気象庁の観測データAPIを使用（日本国内のみ）
      const response = await fetch(
        `https://www.jma.go.jp/bosai/forecast/data/forecast/weather_observation.json`
      );
      
      if (!response.ok) {
        throw new Error('Weather API unavailable');
      }

      const data = await response.json();
      
      // 最寄りの観測地点を選択（簡易実装）
      const weatherData = {
        condition: this.normalizeWeatherCondition(data.condition || 'unknown'),
        temperature: data.temperature || 20,
        humidity: data.humidity || 60,
        pressure: data.pressure || 1013,
        windDirection: data.windDirection || 0,
        windSpeed: data.windSpeed || 0,
        visibility: data.visibility || 10
      };

      // 1時間キャッシュ
      this.cache.set(cacheKey, {
        data: weatherData,
        timestamp: new Date(),
        ttl: 60 * 60 * 1000
      });

      return weatherData;
    } catch (error) {
      console.log('Weather data fetch failed, using default values');
      return undefined;
    }
  }

  /**
   * 宇宙天気データ取得（NOAA/NASA）
   */
  private async fetchSpaceWeatherData(): Promise<EnvironmentalContext['space']> {
    const cacheKey = 'space_weather';
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp.getTime() < cached.ttl) {
      return cached.data;
    }

    try {
      // NOAA Space Weather APIを使用（公開データ）
      const [geomagResponse, solarResponse] = await Promise.all([
        fetch('https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json'),
        fetch('https://services.swpc.noaa.gov/json/goes/primary/xrays-7-day.json')
      ]);

      const geomagData = geomagResponse.ok ? await geomagResponse.json() : null;
      const solarData = solarResponse.ok ? await solarResponse.json() : null;

      const spaceWeather = {
        geomagneticActivity: this.normalizeGeomagneticActivity(geomagData),
        solarFlareActivity: this.normalizeSolarActivity(solarData),
        cosmicRadiation: 100 // デフォルト値
      };

      // 30分キャッシュ
      this.cache.set(cacheKey, {
        data: spaceWeather,
        timestamp: new Date(),
        ttl: 30 * 60 * 1000
      });

      return spaceWeather;
    } catch (error) {
      console.log('Space weather data fetch failed');
      return undefined;
    }
  }

  /**
   * 社会的コンテキスト推定
   */
  private estimateSocialContext(timestamp: Date): EnvironmentalContext['social'] {
    const month = timestamp.getMonth() + 1;
    const day = timestamp.getDate();
    
    // 季節イベントの推定
    const seasonalEvents = this.getSeasonalEvents(month, day);
    
    // 文化的イベント（簡易実装）
    const culturalEvents = this.getCulturalEvents(month, day);
    
    return {
      culturalEvents,
      economicSentiment: 'neutral', // 外部データ無しではニュートラル
      seasonalEvents,
      marketConditions: 'sideways'
    };
  }

  // ユーティリティメソッド群
  private dateToJulianDay(date: Date): number {
    return (date.getTime() / 86400000) + 2440587.5;
  }

  private julianDayToDate(julianDay: number): Date {
    return new Date((julianDay - 2440587.5) * 86400000);
  }

  private getDayOfYear(date: Date): number {
    const start = new Date(date.getFullYear(), 0, 1);
    return Math.floor((date.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  }

  private calculateNextPhaseTime(currentPhase: number, julianDay: number): number {
    const phaseTargets = [0, 0.25, 0.5, 0.75, 1];
    const nextTarget = phaseTargets.find(target => target > currentPhase) || 1;
    const phaseDiff = nextTarget === 1 ? (1 - currentPhase) : (nextTarget - currentPhase);
    return julianDay + (phaseDiff * 29.53058868);
  }

  private calculateLocalSiderealTime(longitude: number, julianDay: number): number {
    const T = (julianDay - 2451545.0) / 36525;
    const GST = 280.46061837 + 360.98564736629 * (julianDay - 2451545.0) + 
                0.000387933 * T * T - T * T * T / 38710000;
    return ((GST + longitude) % 360) * Math.PI / 180;
  }

  private calculateSunTimes(
    location: { latitude: number; longitude: number },
    date: Date
  ): { sunrise: Date; sunset: Date; solarNoon: Date } {
    // 簡易計算（実際にはより正確な計算が必要）
    const julianDay = this.dateToJulianDay(date);
    const n = julianDay - 2451545.0 + 0.0008;
    const J = n - location.longitude / 360;
    
    const solarNoonTime = date;
    solarNoonTime.setHours(12, 0, 0, 0);
    
    const sunriseTime = new Date(solarNoonTime);
    sunriseTime.setHours(6, 0, 0, 0); // 簡易設定
    
    const sunsetTime = new Date(solarNoonTime);
    sunsetTime.setHours(18, 0, 0, 0); // 簡易設定

    return {
      sunrise: sunriseTime,
      sunset: sunsetTime,
      solarNoon: solarNoonTime
    };
  }

  private determineDayNightCycle(
    solar: SolarPosition,
    timestamp: Date
  ): EnvironmentalContext['celestial']['dayNightCycle'] {
    const hour = timestamp.getHours();
    
    if (hour >= 5 && hour < 7) return 'dawn';
    if (hour >= 7 && hour < 11) return 'morning';
    if (hour >= 11 && hour < 13) return 'noon';
    if (hour >= 13 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 19) return 'dusk';
    if (hour >= 19 && hour < 23) return 'night';
    return 'midnight';
  }

  private normalizeWeatherCondition(condition: string): string {
    // 気象条件の正規化
    const normalized = condition.toLowerCase();
    if (normalized.includes('rain') || normalized.includes('雨')) return '雨';
    if (normalized.includes('snow') || normalized.includes('雪')) return '雪';
    if (normalized.includes('cloud') || normalized.includes('曇')) return '曇り';
    if (normalized.includes('clear') || normalized.includes('晴')) return '晴れ';
    return '不明';
  }

  private normalizeGeomagneticActivity(data: any): 'quiet' | 'unsettled' | 'active' | 'minor_storm' | 'major_storm' {
    if (!data || !data.length) return 'quiet';
    const latestKp = data[data.length - 1]?.kp_index || 0;
    
    if (latestKp < 2) return 'quiet';
    if (latestKp < 3) return 'unsettled';
    if (latestKp < 4) return 'active';
    if (latestKp < 6) return 'minor_storm';
    return 'major_storm';
  }

  private normalizeSolarActivity(data: any): 'none' | 'c_class' | 'm_class' | 'x_class' {
    if (!data || !data.length) return 'none';
    const latestFlux = data[data.length - 1]?.flux || 0;
    
    if (latestFlux < 1e-6) return 'none';
    if (latestFlux < 1e-5) return 'c_class';
    if (latestFlux < 1e-4) return 'm_class';
    return 'x_class';
  }

  private getSeasonalEvents(month: number, day: number): string[] {
    const events: string[] = [];
    
    // 日本の季節イベント
    if (month === 1 && day === 1) events.push('新年');
    if (month === 2 && day >= 3 && day <= 4) events.push('立春');
    if (month === 3 && day >= 20 && day <= 22) events.push('春分');
    if (month === 4) events.push('新年度', '桜の季節');
    if (month === 5 && day === 5) events.push('端午の節句');
    if (month === 6 && day >= 20 && day <= 22) events.push('夏至');
    if (month === 7) events.push('七夕', '夏の始まり');
    if (month === 8) events.push('お盆');
    if (month === 9 && day >= 22 && day <= 24) events.push('秋分');
    if (month === 10) events.push('紅葉の季節');
    if (month === 11) events.push('収穫の季節');
    if (month === 12 && day >= 20 && day <= 22) events.push('冬至');
    if (month === 12 && day === 25) events.push('クリスマス');
    
    return events;
  }

  private getCulturalEvents(month: number, day: number): string[] {
    // 簡易実装：主要な文化的イベント
    const events: string[] = [];
    
    if (month === 1) events.push('新年の抱負期間');
    if (month === 4) events.push('新生活スタート');
    if (month === 12) events.push('年末振り返り期間');
    
    return events;
  }

  private getTimezone(location: { latitude: number; longitude: number }): string {
    // 簡易実装：日本時間固定
    return 'Asia/Tokyo';
  }
}

/**
 * 環境コンテキストマッチングユーティリティ
 */
export class EnvironmentalContextMatcher {
  /**
   * 環境コンテキストを歴史的パターン選択用の形式に変換
   */
  static convertToPatternMatchingFormat(context: EnvironmentalContext): {
    weather?: string;
    season: string;
    lunarPhase: string;
    socialContext?: string[];
  } {
    return {
      weather: context.weather?.condition,
      season: context.celestial.season.name,
      lunarPhase: context.celestial.lunarPhase.name,
      socialContext: [
        ...(context.social?.seasonalEvents || []),
        ...(context.social?.culturalEvents || []),
        context.celestial.dayNightCycle
      ]
    };
  }

  /**
   * バイオリズムに基づく解釈調整
   */
  static adjustInterpretationForBiorhythm(
    baseInterpretation: string,
    biorhythm: EnvironmentalContext['personal']['biorhythm']
  ): string {
    let adjusted = baseInterpretation;

    // 身体的バイオリズムの調整
    if (biorhythm.physical > 0.5) {
      adjusted += '\n\n🔋 現在、身体的エネルギーが高い時期です。行動力を活かした取り組みが効果的でしょう。';
    } else if (biorhythm.physical < -0.5) {
      adjusted += '\n\n😌 身体的エネルギーが低い時期です。休息と内省に適した時間として活用しましょう。';
    }

    // 感情的バイオリズムの調整
    if (biorhythm.emotional > 0.5) {
      adjusted += '\n💖 感情的に豊かで創造性が高まる時期です。芸術的な活動や人との深いつながりを大切にしてください。';
    } else if (biorhythm.emotional < -0.5) {
      adjusted += '\n🧘‍♀️ 感情的に落ち着いた時期です。客観的な判断や冷静な分析に適しています。';
    }

    // 知的バイオリズムの調整
    if (biorhythm.intellectual > 0.5) {
      adjusted += '\n🧠 知的活動に最適な時期です。学習、計画立案、問題解決に取り組むのに良いタイミングです。';
    } else if (biorhythm.intellectual < -0.5) {
      adjusted += '\n💭 直感を重視する時期です。論理よりも感覚に従った判断が良い結果をもたらすでしょう。';
    }

    return adjusted;
  }

  /**
   * 時間帯に基づく解釈の提案
   */
  static suggestTimingBasedOnCycle(
    cycle: EnvironmentalContext['celestial']['dayNightCycle']
  ): string {
    const suggestions = {
      dawn: '新しい始まりとリセットの時。意図設定や計画立案に最適です。',
      morning: '行動力とエネルギーが高まる時。重要な決断や新規プロジェクトの開始に適しています。',
      noon: '最も活動的な時。コミュニケーションや社交的な活動、重要な会議に良いタイミングです。',
      afternoon: '実践的な作業や細かい作業に集中できる時。計画の実行に適しています。',
      dusk: '一日の振り返りと次への準備の時。評価と調整、人間関係の深化に適しています。',
      night: '内省と精神的な活動の時。瞑想、読書、創造的な作業に向いています。',
      midnight: '潜在意識との対話の時。深い洞察や直感的な理解が得られやすい時間帯です。'
    };

    return suggestions[cycle];
  }
}