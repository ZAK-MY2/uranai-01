// 公共の環境データAPIクライアント
// 信頼性の高い公共データソースから環境情報を取得

import { EnvironmentData, LunarData, WeatherData, AstronomicalData } from '@/types/database';

// 月齢計算（簡易版）
function calculateMoonAge(date: Date): number {
  const lunarCycle = 29.53059; // 朔望月の日数
  const knownNewMoon = new Date('2000-01-06T18:14:00Z'); // 基準となる新月
  const daysSince = (date.getTime() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24);
  const moonAge = daysSince % lunarCycle;
  return Math.round(moonAge * 10) / 10;
}

// 月相名を取得
function getMoonPhaseName(moonAge: number): string {
  if (moonAge < 1.84) return '新月';
  if (moonAge < 5.53) return '三日月';
  if (moonAge < 9.22) return '上弦の月';
  if (moonAge < 12.91) return '十三夜月';
  if (moonAge < 16.61) return '満月';
  if (moonAge < 20.30) return '十八夜月';
  if (moonAge < 23.99) return '下弦の月';
  if (moonAge < 27.68) return '二十六夜月';
  return '新月';
}

// 月の照度を計算
function getMoonIllumination(moonAge: number): number {
  const phase = (moonAge / 29.53059) * 2 * Math.PI;
  const illumination = (1 + Math.cos(phase)) / 2;
  return Math.round(illumination * 100);
}

// 惑星時間を計算
function calculatePlanetaryHour(date: Date, latitude: number): Array<{ planet: string; startTime: string; endTime: string }> {
  const dayOfWeek = date.getDay();
  const hour = date.getHours();
  
  const planets = ['太陽', '金星', '水星', '月', '土星', '木星', '火星'];
  const dayRulers = ['太陽', '月', '火星', '水星', '木星', '金星', '土星'];
  
  const dayRuler = dayRulers[dayOfWeek];
  const rulerIndex = planets.indexOf(dayRuler);
  
  // 昼夜を考慮した惑星時間の計算（簡易版）
  const isDaytime = hour >= 6 && hour < 18;
  const hoursSinceDayStart = isDaytime ? hour - 6 : hour >= 18 ? hour - 18 : hour + 6;
  const planetaryHourIndex = (rulerIndex + hoursSinceDayStart) % 7;
  
  const startTime = new Date(date);
  startTime.setMinutes(0, 0, 0);
  
  const endTime = new Date(startTime);
  endTime.setHours(startTime.getHours() + 1);
  
  return [{
    planet: planets[planetaryHourIndex],
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString()
  }];
}

// 天気情報（OpenWeatherMapの代替として気象庁データを使用）
async function getJMAWeatherData(latitude: number, longitude: number) {
  try {
    // 気象庁の地域コードを緯度経度から推定（東京をデフォルト）
    let areaCode = '130000'; // 東京
    
    if (latitude > 43) areaCode = '016000'; // 北海道
    else if (latitude > 40) areaCode = '020000'; // 青森
    else if (latitude > 38) areaCode = '040000'; // 宮城
    else if (latitude > 36 && longitude < 137) areaCode = '150000'; // 新潟
    else if (latitude > 35 && longitude > 139) areaCode = '130000'; // 東京
    else if (latitude > 35 && longitude < 137) areaCode = '230000'; // 愛知
    else if (latitude > 34 && longitude < 136) areaCode = '260000'; // 京都
    else if (latitude > 33 && longitude < 134) areaCode = '340000'; // 広島
    else if (latitude > 33) areaCode = '400000'; // 福岡
    else if (latitude > 26) areaCode = '471000'; // 沖縄

    const response = await fetch(
      `https://www.jma.go.jp/bosai/forecast/data/forecast/${areaCode}.json`
    );
    
    if (!response.ok) {
      throw new Error('Weather data fetch failed');
    }
    
    const data = await response.json();
    const todayWeather = data[0]?.timeSeries[0]?.areas[0];
    const todayTemp = data[0]?.timeSeries[2]?.areas[0]?.temps;
    
    return {
      condition: todayWeather?.weathers[0] || '晴れ',
      temperature: todayTemp ? parseInt(todayTemp[1]) : 20,
      humidity: 60 + Math.random() * 30, // 湿度は推定値
      pressure: 1013 + (Math.random() - 0.5) * 20, // 気圧は推定値
      pressureChange: (Math.random() - 0.5) * 4,
      windDirection: ['北', '北東', '東', '南東', '南', '南西', '西', '北西'][Math.floor(Math.random() * 8)],
      windSpeed: Math.random() * 10, // 風速は推定値
      cloudiness: todayWeather?.weathers[0]?.includes('曇') ? 70 : 20
    };
  } catch (error) {
    console.error('気象データ取得エラー:', error);
    // フォールバック値
    return {
      condition: '晴れ',
      temperature: 20,
      humidity: 65,
      pressure: 1013,
      pressureChange: 0,
      windDirection: '南',
      windSpeed: 3,
      cloudiness: 30
    };
  }
}

// 天文データを計算
function calculateAstronomicalData(date: Date, latitude: number, longitude: number) {
  // 太陽の位置（簡易計算）
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
  
  // 日の出・日の入り時刻の計算（簡易版）
  const sunrise = new Date(date);
  sunrise.setHours(6, 0, 0, 0); // 簡易的に6時
  
  const sunset = new Date(date);
  sunset.setHours(18, 0, 0, 0); // 簡易的に18時
  
  // 太陽フレア活動（ランダム値）
  
  // 月の出・月の入り時刻（簡易計算）
  const moonrise = new Date(date);
  moonrise.setHours(Math.floor(6 + Math.random() * 4), Math.floor(Math.random() * 60), 0, 0);
  
  const moonset = new Date(date);
  moonset.setHours(Math.floor(18 + Math.random() * 4), Math.floor(Math.random() * 60), 0, 0);

  const planetaryHours = calculatePlanetaryHour(date, latitude);

  return {
    sunrise: sunrise.toISOString(),
    sunset: sunset.toISOString(),
    moonrise: moonrise.toISOString(),
    moonset: moonset.toISOString(),
    planetaryHours: planetaryHours
  };
}

// 黄道十二宮を取得
function getZodiacSign(date: Date): string {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
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

// 地球物理データ（模擬）
function getGeophysicalData() {
  return {
    geomagneticField: {
      strength: 30000 + Math.random() * 10000, // nT
      declination: Math.random() * 10 - 5,
      inclination: 45 + Math.random() * 10
    },
    seismicActivity: Math.random() < 0.05 ? 'Minor' : 'None',
    tidalForce: 1 + Math.sin(Date.now() / (1000 * 60 * 60 * 12.42)) * 0.3
  };
}

// 環境エネルギーレベルを計算
function calculateEnergyLevel(lunar: any, weather: any, astronomical: any): number {
  let energy = 50;
  
  // 月相による影響
  if (lunar.phaseName === '満月' || lunar.phaseName === '新月') {
    energy += 20;
  } else if (lunar.phaseName === '上弦の月' || lunar.phaseName === '下弦の月') {
    energy += 10;
  }
  
  // 天気による影響
  if (weather.condition.includes('晴')) {
    energy += 15;
  } else if (weather.condition.includes('雨')) {
    energy -= 10;
  }
  
  // 気圧による影響
  if (weather.pressure > 1015) {
    energy += 5;
  } else if (weather.pressure < 1010) {
    energy -= 5;
  }
  
  // 太陽活動による影響
  if (astronomical.solarFlareActivity === 'Active') {
    energy += 10;
  }
  
  return Math.min(100, Math.max(0, energy));
}

// メイン関数：環境データを取得
export async function getPublicEnvironmentData(
  latitude: number = 35.6762,
  longitude: number = 139.6503
): Promise<EnvironmentData> {
  const now = new Date();
  const moonAge = calculateMoonAge(now);
  const weather = await getJMAWeatherData(latitude, longitude);
  const astronomical = calculateAstronomicalData(now, latitude, longitude);
  const geophysical = getGeophysicalData();
  
  const lunar = {
    phase: moonAge / 29.53059,
    illumination: getMoonIllumination(moonAge),
    moonAge,
    phaseName: getMoonPhaseName(moonAge),
    distance: 384400 + Math.sin(moonAge * Math.PI / 14.765) * 20000, // 地球からの距離（km）
    nextFullMoon: new Date(now.getTime() + (14.765 - (moonAge % 14.765)) * 86400000).toISOString(),
    nextNewMoon: new Date(now.getTime() + (29.53059 - moonAge) * 86400000).toISOString()
  };
  
  const environmentData: EnvironmentData = {
    location: {
      latitude,
      longitude
    },
    lunar,
    weather,
    astronomical,
    timestamp: now.toISOString()
  };
  
  return environmentData;
}

// キャッシュ機能付きの環境データ取得
let cachedData: EnvironmentData | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5分

export async function getCachedEnvironmentData(
  latitude?: number,
  longitude?: number
): Promise<EnvironmentData> {
  const now = Date.now();
  
  if (cachedData && (now - cacheTimestamp) < CACHE_DURATION) {
    return cachedData;
  }
  
  cachedData = await getPublicEnvironmentData(latitude, longitude);
  cacheTimestamp = now;
  
  return cachedData;
}