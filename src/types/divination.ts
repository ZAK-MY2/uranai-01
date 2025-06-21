// 占術システム関連の型定義

// =============================================================================
// 数秘術 (Numerology)
// =============================================================================
export interface NumerologyInput {
  fullName: string;
  birthDate: string; // YYYY-MM-DD
}

export interface NumerologyResult {
  lifePath: number;
  destiny: number;
  soul: number;
  personality: number;
  interpretation: {
    lifePath: string;
    destiny: string;
    soul: string;
    personality: string;
    overall: string;
  };
}

// =============================================================================
// タロット (Tarot)
// =============================================================================
export interface TarotCard {
  id: number;
  name: string;
  arcana: 'major' | 'minor';
  suit?: 'cups' | 'pentacles' | 'swords' | 'wands';
  number?: number;
  keywords: string[];
  uprightMeaning: string;
  reversedMeaning: string;
  imageUrl: string;
}

export interface TarotSpread {
  name: string;
  positions: string[];
  description: string;
}

export interface TarotDrawnCard {
  card: TarotCard;
  position: string;
  isReversed: boolean;
  interpretation: string;
}

export interface TarotReading {
  spreadType: string;
  cards: TarotDrawnCard[];
  overall: string;
  advice: string;
}

export interface TarotInput {
  question: string;
  spreadType: string;
  seed?: string;
}

// =============================================================================
// 西洋占星術 (Astrology)
// =============================================================================
export interface BirthData {
  date: string;
  time: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface Planet {
  name: string;
  sign: string;
  degree: number;
  house: number;
  retrograde: boolean;
}

export interface House {
  number: number;
  sign: string;
  degree: number;
}

export interface Aspect {
  planet1: string;
  planet2: string;
  aspect: string;
  orb: number;
  exact: boolean;
}

export interface AstrologyChart {
  planets: Planet[];
  houses: House[];
  aspects: Aspect[];
  ascendant: string;
  midheaven: string;
}

export interface AstrologyResult {
  chart: AstrologyChart;
  interpretation: {
    personality: string;
    relationships: string;
    career: string;
    spiritual: string;
    overall: string;
  };
}

// =============================================================================
// 易経 (I Ching)
// =============================================================================
export interface IChingInput {
  question: string;
  method: 'three_coins' | 'yarrow_stalks';
  fullName: string;
  birthDate: string;
}

export interface IChingHexagram {
  number: number;
  name: string;
  chinese: string;
  trigrams: { upper: string; lower: string };
  keywords: string[];
  meaning: string;
  interpretation: string;
}

export interface IChingReading {
  primaryHexagram: IChingHexagram;
  changingLines?: number[];
  resultHexagram?: IChingHexagram;
  interpretation: string;
  advice: string;
}

// =============================================================================
// 四柱推命 (Shichu Suimei)
// =============================================================================
export interface ShichuInput {
  birthDate: string;
  birthTime: string;
  gender: 'male' | 'female';
  name: string;
}

export interface ShichuResult {
  pillars: {
    year: { stem: string; branch: string };
    month: { stem: string; branch: string };
    day: { stem: string; branch: string };
    hour: { stem: string; branch: string };
  };
  elements: {
    dominant: string;
    lacking: string;
    balance: string;
  };
  analysis: {
    personality: string;
    career: string;
    relationships: string;
    health: string;
    overall: string;
  };
  compatibility?: string;
}

// =============================================================================
// ルーン (Runes)
// =============================================================================
export interface RuneInput {
  question: string;
  spreadType: 'single_rune' | 'three_rune' | 'five_rune' | 'cross' | 'tree_of_life';
  casterName: string;
}

export interface RuneMeaning {
  upright: string;
  reversed: string;
  keywords: string[];
  element: string;
  deity?: string;
}

export interface DrawnRune {
  name: string;
  symbol: string;
  meaning: RuneMeaning;
  position: string;
  isReversed: boolean;
  interpretation: string;
}

export interface RuneReading {
  runes: DrawnRune[];
  spreadType: string;
  interpretation: string;
  advice: string;
}

// =============================================================================
// 手相 (Palmistry)
// =============================================================================
export interface PalmistryInput {
  hand: 'left' | 'right';
  birthDate: string;
  age: number;
  palmFeatures: {
    lines: {
      heart: { length: number; depth: string; breaks: string[]; forks: string[] };
      head: { length: number; depth: string; breaks: string[]; forks: string[] };
      life: { length: number; depth: string; breaks: string[]; curve: string };
      fate: { present: boolean; clarity: string; startPoint: string };
    };
    mounts: {
      venus: string;
      jupiter: string;
      saturn: string;
      apollo: string;
      mercury: string;
      luna: string;
      mars_positive: string;
      mars_negative: string;
    };
    fingers: {
      thumb: { flexibility: string; tip: string };
      index: { length: string; tip: string };
      middle: { length: string; tip: string };
      ring: { length: string; tip: string };
      little: { length: string; tip: string };
    };
  };
}

export interface PalmistryResult {
  analysis: {
    personality: string;
    talents: string;
    relationships: string;
    career: string;
    health: string;
    timeline: string;
  };
  interpretation: {
    overall: string;
    talents: string;
    challenges: string;
    advice: string;
  };
}

// =============================================================================
// ヴェーダ占星術 (Vedic Astrology)
// =============================================================================
export interface VedicInput {
  birthDate: string;
  birthTime: string;
  birthPlace: {
    latitude: number;
    longitude: number;
    timezone: string;
  };
  name: string;
}

export interface VedicResult {
  chart: {
    ascendant: string;
    moonSign: string;
    sunSign: string;
    nakshatra: string;
    planets: Array<{
      name: string;
      sign: string;
      nakshatra: string;
      degree: number;
    }>;
  };
  analysis: {
    personality: string;
    career: string;
    relationships: string;
    health: string;
    spirituality: string;
  };
  interpretation: {
    overall: string;
    strengths: string;
    challenges: string;
    remedies: string;
  };
  dasha: {
    current: string;
    period: string;
    description: string;
  };
}

// =============================================================================
// 統合占術システム
// =============================================================================
export interface IntegratedDivinationInput {
  // 基本情報
  fullName: string;
  birthDate: string;
  birthTime?: string;
  birthLocation?: {
    latitude: number;
    longitude: number;
    timezone: string;
    city: string;
  };
  
  // タロット用
  question: string;
  spreadType: string;
  
  // 現在位置（環境データ用）
  currentLocation?: {
    latitude: number;
    longitude: number;
  };
}

export interface IntegratedDivinationResult {
  numerology: NumerologyResult;
  tarot: TarotReading;
  astrology?: AstrologyResult;
  iching?: IChingReading;
  shichu?: ShichuResult;
  runes?: RuneReading;
  palmistry?: PalmistryResult;
  vedic?: VedicResult;
  environment: EnvironmentData;
  integration: {
    commonThemes: string[];
    contradictions: string[];
    environmentalInfluence: string;
    overallGuidance: string;
    specificAdvice: string[];
    systemCorrelations?: any;
    integratedInsights?: string;
  };
}

// =============================================================================
// API レスポンス型
// =============================================================================
export interface DivinationResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface CacheEntry {
  key: string;
  data: any;
  expiresAt: number;
}

// =============================================================================
// 環境データ詳細型（database.tsから拡張）
// =============================================================================
import { EnvironmentData, LunarData, WeatherData, AstronomicalData, PlanetaryHour } from './database';

export type { EnvironmentData, LunarData, WeatherData, AstronomicalData, PlanetaryHour };

// =============================================================================
// ユーティリティ型
// =============================================================================
export type DivinationType = 'numerology' | 'tarot' | 'astrology' | 'integrated';

export interface DivinationSession {
  id: string;
  type: DivinationType;
  input: Record<string, any>;
  result: Record<string, any>;
  createdAt: string;
  interpretation?: string;
}