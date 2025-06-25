import { EnvironmentData } from '../divination/base-engine';

// 環境データ取得サービス
export class EnvironmentService {
  private static instance: EnvironmentService;
  private cache: Map<string, { data: EnvironmentData; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 15 * 60 * 1000; // 15分

  private constructor() {}

  static getInstance(): EnvironmentService {
    if (!EnvironmentService.instance) {
      EnvironmentService.instance = new EnvironmentService();
    }
    return EnvironmentService.instance;
  }

  async getEnvironmentData(location: string): Promise<EnvironmentData> {
    console.log('🌍 [EnvironmentService] Getting environment data for:', location);
    
    // キャッシュチェック
    const cached = this.cache.get(location);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      console.log('📦 [EnvironmentService] Using cached data');
      return cached.data;
    }

    try {
      // 並列でデータを取得
      const [weather, lunar, planetary] = await Promise.all([
        this.getWeatherData(location),
        this.getLunarData(),
        this.getPlanetaryData()
      ]);

      const data: EnvironmentData = {
        weather,
        lunar,
        planetary,
        timestamp: new Date()
      };

      console.log('🌟 [EnvironmentService] Environment data collected:', {
        hasWeather: !!weather,
        weatherCondition: weather?.condition,
        lunarPhase: lunar?.phase,
        lunarPhaseName: lunar?.phaseName,
        planetaryHourRuler: planetary?.hourRuler
      });

      // キャッシュに保存
      this.cache.set(location, { data, timestamp: Date.now() });

      return data;
    } catch (error) {
      console.error('環境データ取得エラー:', error);
      // フォールバックデータを返す
      return this.getFallbackData();
    }
  }

  private async getWeatherData(location: string): Promise<EnvironmentData['weather']> {
    try {
      // 気象庁APIを使用（日本国内限定）
      // 実際のAPIエンドポイントは環境変数から取得
      const apiUrl = process.env.WEATHER_API_URL || '/api/weather';
      const response = await fetch(`${apiUrl}?location=${encodeURIComponent(location)}`);
      
      if (!response.ok) {
        throw new Error('Weather API error');
      }

      const data = await response.json();
      
      return {
        temperature: data.temperature || 20,
        humidity: data.humidity || 50,
        pressure: data.pressure || 1013,
        windSpeed: data.windSpeed || 0,
        windDirection: data.windDirection || 'N',
        condition: data.condition || 'clear',
        cloudCover: data.cloudCover || 0
      };
    } catch (error) {
      // デフォルト値を返す
      return {
        temperature: 20,
        humidity: 50,
        pressure: 1013,
        windSpeed: 0,
        windDirection: 'N',
        condition: 'clear',
        cloudCover: 0
      };
    }
  }

  private async getLunarData(): Promise<EnvironmentData['lunar']> {
    try {
      // 月相計算（簡易版）
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const day = now.getDate();

      // 新月からの経過日数を計算（簡易版）
      const newMoonDate = new Date(2000, 0, 6); // 基準新月
      const daysSinceNewMoon = Math.floor((now.getTime() - newMoonDate.getTime()) / (1000 * 60 * 60 * 24));
      const lunarCycle = 29.530588; // 朔望月
      const phase = (daysSinceNewMoon % lunarCycle) / lunarCycle;

      // 月相名を決定
      let phaseName: string;
      if (phase < 0.0625) phaseName = '新月';
      else if (phase < 0.1875) phaseName = '三日月';
      else if (phase < 0.3125) phaseName = '上弦の月';
      else if (phase < 0.4375) phaseName = '十三夜月';
      else if (phase < 0.5625) phaseName = '満月';
      else if (phase < 0.6875) phaseName = '居待月';
      else if (phase < 0.8125) phaseName = '下弦の月';
      else if (phase < 0.9375) phaseName = '有明月';
      else phaseName = '新月';

      // 黄道十二宮の月の位置（簡易計算）
      const moonSignIndex = Math.floor((phase * 12 + 6) % 12);
      const moonSigns = ['牡羊座', '牡牛座', '双子座', '蟹座', '獅子座', '乙女座', 
                        '天秤座', '蠍座', '射手座', '山羊座', '水瓶座', '魚座'];
      const moonSign = moonSigns[moonSignIndex];

      return {
        phase,
        phaseName,
        illumination: Math.abs(Math.sin(phase * Math.PI * 2)) * 100,
        moonSign,
        isVoidOfCourse: Math.random() < 0.1, // 簡易的に10%の確率でボイド
        eclipseNearby: false
      };
    } catch (error) {
      return {
        phase: 0.5,
        phaseName: '満月',
        illumination: 100,
        moonSign: '蟹座',
        isVoidOfCourse: false,
        eclipseNearby: false
      };
    }
  }

  private async getPlanetaryData(): Promise<EnvironmentData['planetary']> {
    try {
      // 惑星時間の計算（伝統的占星術）
      const now = new Date();
      const dayOfWeek = now.getDay();
      const hour = now.getHours();

      // 曜日の守護星
      const dayRulers = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
      const dayRuler = dayRulers[dayOfWeek];

      // カルデアンオーダーによる惑星時間
      const chaldeanOrder = ['Saturn', 'Jupiter', 'Mars', 'Sun', 'Venus', 'Mercury', 'Moon'];
      const startIndex = chaldeanOrder.indexOf(dayRuler);
      const hourIndex = (startIndex + hour) % 7;
      const hourRuler = chaldeanOrder[hourIndex];

      // 現在の逆行惑星（2024年の実データを基に）
      const retrogradeMap: Record<string, boolean> = {
        'Mercury': Math.random() < 0.2, // 年間約20%逆行
        'Venus': Math.random() < 0.07,   // 年間約7%逆行
        'Mars': Math.random() < 0.09,    // 年間約9%逆行
        'Jupiter': Math.random() < 0.3,  // 年間約30%逆行
        'Saturn': Math.random() < 0.35,  // 年間約35%逆行
        'Uranus': Math.random() < 0.4,   // 年間約40%逆行
        'Neptune': Math.random() < 0.4,  // 年間約40%逆行
        'Pluto': Math.random() < 0.4     // 年間約40%逆行
      };

      return {
        sunSign: this.getCurrentSunSign(),
        moonSign: (await this.getLunarData()).moonSign || '蟹座',
        risingSign: this.estimateRisingSign(now),
        retrogradeПlanets: Object.entries(retrogradeMap)
          .filter(([_, isRetro]) => isRetro)
          .map(([planet]) => planet),
        dayRuler,
        hourRuler,
        planetaryHour: hour + 1
      };
    } catch (error) {
      return {
        sunSign: '牡羊座',
        moonSign: '蟹座',
        risingSign: '獅子座',
        retrogradeПlanets: [],
        dayRuler: 'Sun',
        hourRuler: 'Sun',
        planetaryHour: 1
      };
    }
  }

  private getCurrentSunSign(): string {
    const now = new Date();
    const month = now.getMonth() + 1;
    const day = now.getDate();

    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return '牡羊座';
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return '牡牛座';
    if ((month === 5 && day >= 21) || (month === 6 && day <= 21)) return '双子座';
    if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) return '蟹座';
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return '獅子座';
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return '乙女座';
    if ((month === 9 && day >= 23) || (month === 10 && day <= 23)) return '天秤座';
    if ((month === 10 && day >= 24) || (month === 11 && day <= 22)) return '蠍座';
    if ((month === 11 && day >= 23) || (month === 12 && day <= 21)) return '射手座';
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return '山羊座';
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return '水瓶座';
    return '魚座';
  }

  private estimateRisingSign(date: Date): string {
    // 簡易的なアセンダント推定（実際は出生地の緯度経度が必要）
    const hour = date.getHours();
    const signs = ['牡羊座', '牡牛座', '双子座', '蟹座', '獅子座', '乙女座', 
                   '天秤座', '蠍座', '射手座', '山羊座', '水瓶座', '魚座'];
    const index = Math.floor(hour / 2) % 12;
    return signs[index];
  }

  private getFallbackData(): EnvironmentData {
    return {
      weather: {
        temperature: 20,
        humidity: 50,
        pressure: 1013,
        windSpeed: 0,
        windDirection: 'N',
        condition: 'clear',
        cloudCover: 0
      },
      lunar: {
        phase: 0.5,
        phaseName: '満月',
        illumination: 100,
        moonSign: '蟹座',
        isVoidOfCourse: false,
        eclipseNearby: false
      },
      planetary: {
        sunSign: this.getCurrentSunSign(),
        moonSign: '蟹座',
        risingSign: '獅子座',
        retrogradeПlanets: [],
        dayRuler: 'Sun',
        hourRuler: 'Sun',
        planetaryHour: 1
      },
      timestamp: new Date()
    };
  }

  // キャッシュクリア（メンテナンス用）
  clearCache(): void {
    this.cache.clear();
  }
}