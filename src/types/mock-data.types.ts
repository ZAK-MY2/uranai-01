// モックデータ用の型定義

export interface ScoreSet {
  overall: number;
  career: number;
  love: number;
  health: number;
  wealth: number;
}

export interface NumerologyMockData {
  lifePathNumber: number;
  destinyNumber: number;
  soulNumber: number;
  personalityNumber: number;
  maturityNumber: number;
  birthdayNumber: number;
  scores: ScoreSet;
  interpretation: {
    lifePathMeaning: string;
    todaysFocus: string;
    advice: string;
  };
  compatibility: {
    bestNumbers: number[];
    challengingNumbers: number[];
  };
  luckyNumbers: number[];
  todaysNumber: number;
}

export interface TarotCard {
  name: string;
  arcana: 'major' | 'minor';
  number: number;
  suit?: 'cups' | 'wands' | 'swords' | 'pentacles';
  image: string;
  keywords: string[];
  interpretation: string;
  position?: 'upright' | 'reversed';
}

export interface TarotMockData {
  cards: {
    past: TarotCard;
    present: TarotCard;
    future: TarotCard;
  };
  overallMessage: string;
  advice: string;
  themes: string[];
}

export interface PlanetPosition {
  sign: string;
  house: number;
  aspect: string;
  degrees?: number;
}

export interface AstrologyMockData {
  sunSign: string;
  moonSign: string;
  risingSign: string;
  planets: {
    mercury: PlanetPosition;
    venus: PlanetPosition;
    mars: PlanetPosition;
    jupiter: PlanetPosition;
    saturn: PlanetPosition;
  };
  aspects: {
    favorable: string[];
    challenging: string[];
  };
  todaysTransit: string;
  interpretation: string;
  houses: {
    [key: number]: {
      sign: string;
      planets: string[];
      theme: string;
    };
  };
}

export interface RuneStone {
  name: string;
  meaning: string;
  position: 'upright' | 'reversed';
  element: 'fire' | 'water' | 'earth' | 'air';
  keywords: string[];
  interpretation: string;
}

export interface RunesMockData {
  drawn: RuneStone[];
  interpretation: string;
  guidance: string;
  timeline: 'past' | 'present' | 'future';
}

export interface Hexagram {
  number: number;
  name: string;
  upperTrigram: string;
  lowerTrigram: string;
  judgment: string;
  image: string;
  lines?: boolean[]; // true = yang, false = yin
}

export interface IChingMockData {
  hexagram: Hexagram;
  changingLines: number[];
  interpretation: string;
  guidance: string;
  futureHexagram?: Hexagram;
}

export interface NineStarKiMockData {
  mainStar: string;
  monthStar: string;
  yearStar: string;
  direction: {
    favorable: string[];
    unfavorable: string[];
  };
  element: string;
  todaysEnergy: string;
  advice: string;
  compatibility: {
    best: string[];
    avoid: string[];
  };
}

export interface Pillar {
  heavenlyStem: string;
  earthlyBranch: string;
  element: string;
  meaning?: string;
}

export interface ShichuSuimeiMockData {
  yearPillar: Pillar;
  monthPillar: Pillar;
  dayPillar: Pillar;
  hourPillar: Pillar;
  fiveElements: {
    wood: number;
    fire: number;
    earth: number;
    metal: number;
    water: number;
  };
  majorCycle: {
    period: string;
    element: string;
    fortune: string;
  };
  interpretation: string;
  strengths: string[];
  challenges: string[];
}

export interface KabbalahMockData {
  treeOfLife: {
    currentSephirah: string;
    path: number;
    element: string;
  };
  hebrewLetter: string;
  angelicInfluence: string;
  interpretation: string;
  meditation: string;
  guidance: string[];
}

export interface VedicAstrologyMockData {
  nakshatra: string;
  moonMansion: number;
  planetaryPeriod: {
    mahaDasha: string;
    antarDasha: string;
    yearsRemaining: number;
  };
  yogas: string[];
  remedies: string[];
  interpretation: string;
  gemstones: string[];
  mantras: string[];
}

export interface CelticAstrologyMockData {
  treeSign: string;
  animal: string;
  color: string;
  gemstone: string;
  element: string;
  qualities: string[];
  interpretation: string;
  season: string;
  mythology: string;
}

export interface IntegrationMockData {
  dominantElement: string;
  dominantNumber: number;
  keyThemes: string[];
  synchronicities: string[];
  guidanceMessage: string;
  actionSteps: string[];
  timeframe: string;
  confidence: number; // 0-100
}

export interface MockDivinationData {
  overallScore: number;
  numerology: NumerologyMockData;
  tarot: TarotMockData;
  astrology: AstrologyMockData;
  runes: RunesMockData;
  iChing: IChingMockData;
  nineStarKi: NineStarKiMockData;
  shichuSuimei: ShichuSuimeiMockData;
  kabbalah: KabbalahMockData;
  vedicAstrology: VedicAstrologyMockData;
  celticAstrology: CelticAstrologyMockData;
  integration: IntegrationMockData;
}

// 動的生成用のヘルパー型
export interface MockDataGeneratorOptions {
  seed?: number;
  locale?: 'ja' | 'en';
  complexity?: 'simple' | 'detailed' | 'comprehensive';
  includeAdvice?: boolean;
  includeCompatibility?: boolean;
}

// 日別バリエーション
export interface DailyVariation {
  energyShift: number; // -1 to 1
  focusArea: 'career' | 'love' | 'health' | 'wealth' | 'spiritual';
  intensityMultiplier: number; // 0.5 to 1.5
}

// 時間帯エネルギー
export interface HourlyEnergy {
  type: string;
  intensity: number;
  favorableActivities: string[];
  unfavorableActivities: string[];
}