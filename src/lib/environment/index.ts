// 環境データ連携システム
import { EnvironmentData, LunarData, WeatherData, AstronomicalData, PlanetaryHour } from '@/types/divination';
import { LocationData } from '@/types/database';

export class EnvironmentEngine {
  /**
   * 現在の総合環境データを取得
   */
  async getCurrentEnvironment(lat: number, lon: number): Promise<EnvironmentData> {
    try {
      const [lunar, weather, astronomical] = await Promise.all([
        this.getLunarData().catch(() => this.getDefaultLunarData()),
        this.getWeatherData(lat, lon).catch(() => this.getDefaultWeatherData()),
        this.getAstronomicalData(lat, lon).catch(() => this.getDefaultAstronomicalData())
      ]);

      // 月と地球の距離を追加計算
      const lunarDistance = this.calculateLunarDistance();

      return {
        lunar: {
          ...lunar,
          distanceFromEarth: lunarDistance
        },
        weather,
        astronomical,
        location: { latitude: lat, longitude: lon },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('環境データ取得エラー:', error);
      return this.getDefaultEnvironmentData(lat, lon);
    }
  }

  /**
   * 月相データの取得
   */
  private async getLunarData(): Promise<LunarData> {
    try {
      // 月相計算（簡略版）
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth();
      const day = now.getDate();
      
      // 簡略化された月相計算
      const dayOfYear = Math.floor((now.getTime() - new Date(year, 0, 0).getTime()) / (86400000));
      const lunarCycle = 29.53; // 朔望月
      const phase = ((dayOfYear % lunarCycle) / lunarCycle);
      
      const phaseName = this.getMoonPhaseName(phase);
      const illumination = this.calculateIllumination(phase);
      
      // 次の新月・満月の計算（概算）
      const daysToNewMoon = Math.ceil((1 - phase) * lunarCycle);
      const daysToFullMoon = phase < 0.5 ? 
        Math.ceil((0.5 - phase) * lunarCycle) : 
        Math.ceil((1.5 - phase) * lunarCycle);
      
      const nextNewMoon = new Date(now.getTime() + daysToNewMoon * 86400000).toISOString();
      const nextFullMoon = new Date(now.getTime() + daysToFullMoon * 86400000).toISOString();

      return {
        phase,
        phaseName,
        illumination,
        nextNewMoon,
        nextFullMoon
      };
    } catch (error) {
      console.error('月相データ取得エラー:', error);
      return this.getDefaultLunarData();
    }
  }

  /**
   * 天候データの取得
   */
  private async getWeatherData(lat: number, lon: number): Promise<WeatherData> {
    // 実際の実装では環境変数からAPIキーを取得
    const apiKey = process.env.OPENWEATHER_API_KEY;
    
    if (!apiKey) {
      console.warn('OpenWeatherMap APIキーが設定されていません。デフォルトデータを使用します。');
      return this.getDefaultWeatherData();
    }

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=ja`
      );

      if (!response.ok) {
        throw new Error(`Weather API Error: ${response.status}`);
      }

      const data = await response.json();

      return {
        condition: data.weather[0].description || '不明',
        temperature: Math.round(data.main.temp || 20),
        pressure: data.main.pressure || 1013,
        pressureChange: 0, // 履歴データが必要（簡略版では0）
        humidity: data.main.humidity || 50,
        windDirection: this.degreeToDirection(data.wind?.deg || 0),
        windSpeed: Math.round((data.wind?.speed || 0) * 3.6), // m/s to km/h
        cloudiness: data.clouds?.all || 0
      };
    } catch (error) {
      console.error('天候データ取得エラー:', error);
      return this.getDefaultWeatherData();
    }
  }

  /**
   * 天体データの取得（簡略版）
   */
  private async getAstronomicalData(lat: number, lon: number): Promise<AstronomicalData> {
    try {
      const now = new Date();
      
      // 簡略化された日の出・日の入り計算
      const sunrise = this.calculateSunrise(now, lat, lon);
      const sunset = this.calculateSunset(now, lat, lon);
      const moonrise = this.calculateMoonrise(now, lat, lon);
      const moonset = this.calculateMoonset(now, lat, lon);
      
      // プラネタリーアワーの計算
      const planetaryHours = this.calculatePlanetaryHours(sunrise, sunset);

      return {
        sunrise: sunrise.toISOString(),
        sunset: sunset.toISOString(),
        moonrise: moonrise.toISOString(),
        moonset: moonset.toISOString(),
        planetaryHours
      };
    } catch (error) {
      console.error('天体データ取得エラー:', error);
      return this.getDefaultAstronomicalData();
    }
  }

  /**
   * 月相名の取得
   */
  private getMoonPhaseName(phase: number): string {
    if (phase < 0.03 || phase > 0.97) return '新月';
    if (phase < 0.22) return '三日月';
    if (phase < 0.28) return '上弦の月';
    if (phase < 0.47) return '十三夜';
    if (phase < 0.53) return '満月';
    if (phase < 0.72) return '寝待月';
    if (phase < 0.78) return '下弦の月';
    return '有明月';
  }

  /**
   * 月の照度計算
   */
  private calculateIllumination(phase: number): number {
    // 簡略化された照度計算
    if (phase <= 0.5) {
      return Math.round(phase * 200); // 0-100%
    } else {
      return Math.round((1 - phase) * 200); // 100%-0%
    }
  }

  /**
   * 風向きの度数から方向名への変換
   */
  private degreeToDirection(degree: number): string {
    const directions = ['北', '北北東', '北東', '東北東', '東', '東南東', '南東', '南南東', 
                      '南', '南南西', '南西', '西南西', '西', '西北西', '北西', '北北西'];
    const index = Math.round(degree / 22.5) % 16;
    return directions[index];
  }

  /**
   * 簡略化された日の出計算
   */
  private calculateSunrise(date: Date, lat: number, lon: number): Date {
    // 簡略化：季節と緯度を考慮した概算
    const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
    const seasonalAdjustment = Math.sin((dayOfYear - 80) * 2 * Math.PI / 365) * 1.5; // 春分を基準とした調整
    const latitudeAdjustment = (lat / 90) * 2; // 緯度による調整
    
    const baseTime = 6; // 基準時刻（6時）
    const adjustedTime = baseTime - seasonalAdjustment - latitudeAdjustment;
    
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 
                   Math.floor(adjustedTime), Math.floor((adjustedTime % 1) * 60));
  }

  /**
   * 簡略化された日の入り計算
   */
  private calculateSunset(date: Date, lat: number, lon: number): Date {
    const sunrise = this.calculateSunrise(date, lat, lon);
    const daylightHours = 12 + Math.sin((date.getMonth() - 3) * Math.PI / 6) * 4; // 季節による日照時間変化
    
    return new Date(sunrise.getTime() + daylightHours * 3600000);
  }

  /**
   * 簡略化された月の出計算
   */
  private calculateMoonrise(date: Date, lat: number, lon: number): Date {
    const sunrise = this.calculateSunrise(date, lat, lon);
    // 月は毎日約50分遅く昇る
    const daysSinceNewMoon = date.getDate() % 29;
    const moonDelay = daysSinceNewMoon * 50; // 分
    
    return new Date(sunrise.getTime() + moonDelay * 60000);
  }

  /**
   * 簡略化された月の入り計算
   */
  private calculateMoonset(date: Date, lat: number, lon: number): Date {
    const moonrise = this.calculateMoonrise(date, lat, lon);
    return new Date(moonrise.getTime() + 12 * 3600000); // 月の出から約12時間後
  }

  /**
   * プラネタリーアワーの計算
   */
  private calculatePlanetaryHours(sunrise: Date, sunset: Date): PlanetaryHour[] {
    const planets = ['太陽', '金星', '水星', '月', '土星', '木星', '火星'];
    const dayLength = sunset.getTime() - sunrise.getTime();
    const hourLength = dayLength / 12; // 昼間を12等分
    
    const planetaryHours: PlanetaryHour[] = [];
    
    for (let i = 0; i < 12; i++) {
      const startTime = new Date(sunrise.getTime() + i * hourLength);
      const endTime = new Date(sunrise.getTime() + (i + 1) * hourLength);
      
      planetaryHours.push({
        planet: planets[i % 7],
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString()
      });
    }
    
    return planetaryHours;
  }

  /**
   * デフォルトの月相データ
   */
  private getDefaultLunarData(): LunarData {
    return {
      phase: 0.5,
      phaseName: '満月',
      illumination: 100,
      nextNewMoon: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      nextFullMoon: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
    };
  }

  /**
   * デフォルトの天候データ
   */
  private getDefaultWeatherData(): WeatherData {
    return {
      condition: '晴れ',
      temperature: 20,
      pressure: 1013,
      pressureChange: 0,
      humidity: 50,
      windDirection: '北',
      windSpeed: 10,
      cloudiness: 20
    };
  }

  /**
   * デフォルトの天体データ
   */
  private getDefaultAstronomicalData(): AstronomicalData {
    const now = new Date();
    const sunrise = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 6, 0);
    const sunset = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 18, 0);
    
    return {
      sunrise: sunrise.toISOString(),
      sunset: sunset.toISOString(),
      moonrise: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 20, 0).toISOString(),
      moonset: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8, 0).toISOString(),
      planetaryHours: this.calculatePlanetaryHours(sunrise, sunset)
    };
  }

  /**
   * デフォルトの総合環境データ
   */
  private getDefaultEnvironmentData(lat: number, lon: number): EnvironmentData {
    return {
      lunar: this.getDefaultLunarData(),
      weather: this.getDefaultWeatherData(),
      astronomical: this.getDefaultAstronomicalData(),
      location: { latitude: lat, longitude: lon },
      timestamp: new Date().toISOString()
    };
  }

  /**
   * 環境データのキャッシュキー生成
   */
  generateCacheKey(lat: number, lon: number): string {
    const date = new Date().toISOString().split('T')[0]; // 日付のみ
    return `environment:${lat.toFixed(2)}:${lon.toFixed(2)}:${date}`;
  }

  /**
   * 環境データの有効期限（時間単位）
   */
  getCacheExpiration(): Date {
    return new Date(Date.now() + 60 * 60 * 1000); // 1時間
  }

  /**
   * 月と地球の距離を計算（日本時刻基準）
   */
  private calculateLunarDistance(): {
    kilometers: number;
    astronomicalUnits: number;
    earthRadii: number;
    phase: string;
    perigeeApogee: string;
  } {
    const now = new Date();
    
    // 月の軌道は楕円で、近地点（perigee）約356,500km、遠地点（apogee）約406,700km
    const avgDistance = 384400; // 平均距離 km
    const variation = 25100; // 変動幅の半分
    
    // 月の軌道周期27.32日を使用
    const orbitalPeriod = 27.32;
    const daysSincePerigee = (now.getTime() / (1000 * 60 * 60 * 24)) % orbitalPeriod;
    
    // 楕円軌道による距離変化（簡略化）
    const distanceVariation = Math.cos(2 * Math.PI * daysSincePerigee / orbitalPeriod);
    const currentDistance = avgDistance + (variation * distanceVariation);
    
    // 月の位相による距離への影響も考慮（微細）
    const lunarData = this.calculateLunarPhase(now);
    const phaseAdjustment = Math.sin(lunarData.phase * 2 * Math.PI) * 500; // 最大±500km
    
    const finalDistance = currentDistance + phaseAdjustment;
    
    // 地球半径 6,371km、天文単位 149,597,870.7km
    const earthRadius = 6371;
    const astronomicalUnit = 149597870.7;
    
    // 近地点・遠地点の判定
    let perigeeApogee: string;
    if (finalDistance < 365000) {
      perigeeApogee = '近地点接近中';
    } else if (finalDistance > 400000) {
      perigeeApogee = '遠地点接近中';
    } else {
      perigeeApogee = '平均距離';
    }
    
    // 距離による影響フェーズ
    let phase: string;
    if (finalDistance < 370000) {
      phase = '超接近期（強い重力影響）';
    } else if (finalDistance < 385000) {
      phase = '接近期（重力影響増大）';
    } else if (finalDistance > 400000) {
      phase = '遠隔期（重力影響減少）';
    } else {
      phase = '標準期（通常の重力影響）';
    }
    
    return {
      kilometers: Math.round(finalDistance),
      astronomicalUnits: parseFloat((finalDistance / astronomicalUnit).toFixed(6)),
      earthRadii: parseFloat((finalDistance / earthRadius).toFixed(2)),
      phase,
      perigeeApogee
    };
  }
  
  /**
   * 月相の位相計算（再利用）
   */
  private calculateLunarPhase(date: Date): { phase: number; phaseName: string } {
    const year = date.getFullYear();
    const dayOfYear = Math.floor((date.getTime() - new Date(year, 0, 0).getTime()) / (86400000));
    const lunarCycle = 29.53;
    const phase = ((dayOfYear % lunarCycle) / lunarCycle);
    
    return {
      phase,
      phaseName: this.getMoonPhaseName(phase)
    };
  }
}

// シングルトンインスタンス
export const environmentEngine = new EnvironmentEngine();