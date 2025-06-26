/**
 * サーバーサイドのみで実行される計算処理
 * 
 * swissephなどのNode.js専用モジュールを使用
 */

// サーバーサイドチェック
if (typeof window !== 'undefined') {
  throw new Error('This module can only be used on the server side');
}

// swissephの動的インポート
let swisseph: any;
try {
  swisseph = require('swisseph');
} catch (e) {
  console.warn('swisseph module not available:', e);
}

export interface PlanetPosition {
  name: string;
  longitude: number;
  latitude: number;
  distance: number;
  speed: number;
  zodiacSign: string;
  degree: number;
}

export interface AstrologyCalculation {
  sun: PlanetPosition;
  moon: PlanetPosition;
  mercury: PlanetPosition;
  venus: PlanetPosition;
  mars: PlanetPosition;
  jupiter: PlanetPosition;
  saturn: PlanetPosition;
  uranus: PlanetPosition;
  neptune: PlanetPosition;
  pluto: PlanetPosition;
}

/**
 * 天体位置計算（サーバーサイドのみ）
 */
export function calculatePlanetPositions(
  birthDate: Date,
  longitude: number,
  latitude: number
): AstrologyCalculation | null {
  if (!swisseph) {
    console.warn('swisseph not available, returning mock data');
    return getMockAstrologyData(birthDate);
  }

  try {
    // Swiss Ephemerisを使用した実際の計算
    // ここに実装
    return getMockAstrologyData(birthDate); // 暫定的にモックを返す
  } catch (error) {
    console.error('Error calculating planet positions:', error);
    return getMockAstrologyData(birthDate);
  }
}

/**
 * モック天体データ（フォールバック用）
 */
function getMockAstrologyData(birthDate: Date): AstrologyCalculation {
  const baseDate = new Date('2000-01-01');
  const daysDiff = Math.floor((birthDate.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));
  
  return {
    sun: {
      name: '太陽',
      longitude: (daysDiff * 0.985) % 360,
      latitude: 0,
      distance: 1.0,
      speed: 0.985,
      zodiacSign: getZodiacSign((daysDiff * 0.985) % 360),
      degree: ((daysDiff * 0.985) % 360) % 30
    },
    moon: {
      name: '月',
      longitude: (daysDiff * 13.176) % 360,
      latitude: Math.sin(daysDiff * 0.089) * 5.145,
      distance: 0.00257,
      speed: 13.176,
      zodiacSign: getZodiacSign((daysDiff * 13.176) % 360),
      degree: ((daysDiff * 13.176) % 360) % 30
    },
    mercury: {
      name: '水星',
      longitude: (daysDiff * 4.092) % 360,
      latitude: Math.sin(daysDiff * 0.174) * 7,
      distance: 0.387,
      speed: 4.092,
      zodiacSign: getZodiacSign((daysDiff * 4.092) % 360),
      degree: ((daysDiff * 4.092) % 360) % 30
    },
    venus: {
      name: '金星',
      longitude: (daysDiff * 1.602) % 360,
      latitude: Math.sin(daysDiff * 0.138) * 3.395,
      distance: 0.723,
      speed: 1.602,
      zodiacSign: getZodiacSign((daysDiff * 1.602) % 360),
      degree: ((daysDiff * 1.602) % 360) % 30
    },
    mars: {
      name: '火星',
      longitude: (daysDiff * 0.524) % 360,
      latitude: Math.sin(daysDiff * 0.093) * 1.850,
      distance: 1.524,
      speed: 0.524,
      zodiacSign: getZodiacSign((daysDiff * 0.524) % 360),
      degree: ((daysDiff * 0.524) % 360) % 30
    },
    jupiter: {
      name: '木星',
      longitude: (daysDiff * 0.083) % 360,
      latitude: Math.sin(daysDiff * 0.048) * 1.303,
      distance: 5.203,
      speed: 0.083,
      zodiacSign: getZodiacSign((daysDiff * 0.083) % 360),
      degree: ((daysDiff * 0.083) % 360) % 30
    },
    saturn: {
      name: '土星',
      longitude: (daysDiff * 0.033) % 360,
      latitude: Math.sin(daysDiff * 0.054) * 2.485,
      distance: 9.537,
      speed: 0.033,
      zodiacSign: getZodiacSign((daysDiff * 0.033) % 360),
      degree: ((daysDiff * 0.033) % 360) % 30
    },
    uranus: {
      name: '天王星',
      longitude: (daysDiff * 0.012) % 360,
      latitude: Math.sin(daysDiff * 0.013) * 0.773,
      distance: 19.191,
      speed: 0.012,
      zodiacSign: getZodiacSign((daysDiff * 0.012) % 360),
      degree: ((daysDiff * 0.012) % 360) % 30
    },
    neptune: {
      name: '海王星',
      longitude: (daysDiff * 0.006) % 360,
      latitude: Math.sin(daysDiff * 0.009) * 1.770,
      distance: 30.069,
      speed: 0.006,
      zodiacSign: getZodiacSign((daysDiff * 0.006) % 360),
      degree: ((daysDiff * 0.006) % 360) % 30
    },
    pluto: {
      name: '冥王星',
      longitude: (daysDiff * 0.004) % 360,
      latitude: Math.sin(daysDiff * 0.025) * 17.16,
      distance: 39.482,
      speed: 0.004,
      zodiacSign: getZodiacSign((daysDiff * 0.004) % 360),
      degree: ((daysDiff * 0.004) % 360) % 30
    }
  };
}

/**
 * 度数から星座を判定
 */
function getZodiacSign(longitude: number): string {
  const signs = [
    '牡羊座', '牡牛座', '双子座', '蟹座',
    '獅子座', '乙女座', '天秤座', '蠍座',
    '射手座', '山羊座', '水瓶座', '魚座'
  ];
  const index = Math.floor(longitude / 30);
  return signs[index];
}