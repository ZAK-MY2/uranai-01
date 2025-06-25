// 占術システム関連の型定義

import { SystemCorrelations } from './divination-common';

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
  spread: {
    name: string;
    type: string;
  };
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
// 九星気学 (Kyusei Kigaku)
// =============================================================================
export interface KyuseiInput {
  name: string;
  birthDate: string;
  currentLocation?: {
    latitude: number;
    longitude: number;
  };
}

export interface KyuseiStar {
  number: number;
  name: string;
  element: '水' | '土' | '木' | '金' | '火';
  characteristics?: string[];
}

export interface KyuseiBoard {
  center: number;
  positions: number[][];
}

export interface DirectionAnalysis {
  direction: string;
  type: 'yoshiho' | 'kyoho';
  effect: string;
  recommendation: string;
}

export interface KyuseiResult {
  honmeisei: KyuseiStar;
  getsumeisei: KyuseiStar;
  keisha: KyuseiStar;
  boards: {
    nenban: KyuseiBoard;
    getsuban: KyuseiBoard;
    nichiban: KyuseiBoard;
  };
  directions: DirectionAnalysis[];
  timeUnyo: {
    nenun: string;
    getsuun: string;
    nichiun: string;
  };
  interpretation: {
    personality: string;
    strengths: string[];
    currentFortune: string;
    monthlyFortune: string;
    yearlyFortune: string;
    luckyDirections: string[];
    unluckyDirections: string[];
    advice: string;
    overall: string;
  };
  validationInfo?: {
    confidence: number;
    sources: string[];
    isVerified: boolean;
    recommendations?: string[];
  };
  timestamp?: string;
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
// カバラ占術 (Kabbalah)
// =============================================================================
export interface KabbalahInput {
  fullName: string;
  birthDate: string;
}

export interface KabbalahResult {
  sephirot: Record<string, number>;
  treePaths: Array<{
    from: string;
    to: string;
    value: number;
    meaning: string;
  }>;
  gematria: {
    hebrew: number;
    english: number;
    japanese: number;
  };
  personalSephira: {
    primary: string;
    secondary: string;
    characteristics: string[];
  };
  interpretation: {
    personality: string;
    spiritualPath: string;
    lifeLesson: string;
    strengths: string[];
    challenges: string[];
    advice: string;
    overall: string;
  };
  timestamp: string;
}

// =============================================================================
// ケルト占星術 (Celtic Astrology)
// =============================================================================
export interface CelticAstrologyInput {
  fullName: string;
  birthDate: string;
}

export interface CelticAstrologyResult {
  treeSign: {
    name: string;
    gaelic: string;
    period: string;
    characteristics: string[];
    mythology: string;
  };
  animalSpirit: {
    name: string;
    gaelic: string;
    element: string;
    characteristics: string[];
    guidance: string;
  };
  oghamRune: {
    symbol: string;
    name: string;
    meaning: string;
    guidance: string;
  };
  seasonalEnergy: {
    season: string;
    festival: string;
    energy: string;
    characteristics: string[];
  };
  celticElement: {
    primary: string;
    secondary: string;
    characteristics: string[];
  };
  sacredPlace: {
    name: string;
    type: string;
    energy: string;
    guidance: string;
  };
  interpretation: {
    personality: string;
    spiritualPath: string;
    lifeLesson: string;
    strengths: string[];
    challenges: string[];
    advice: string;
    overall: string;
  };
  timestamp: string;
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
  kyusei?: KyuseiResult;
  vedic?: VedicResult;
  kabbalah?: KabbalahResult;
  celtic?: CelticAstrologyResult;
  environment: EnvironmentData;
  integration: {
    commonThemes: string[];
    contradictions: string[];
    environmentalInfluence: string;
    overallGuidance: string;
    specificAdvice: string[];
    systemCorrelations?: SystemCorrelations;
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
  data: Record<string, unknown>;
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
export type DivinationType = 'numerology' | 'tarot' | 'astrology' | 'kyusei' | 'integrated';

export interface DivinationSession {
  id: string;
  type: DivinationType;
  input: Record<string, unknown>;
  result: Record<string, unknown>;
  createdAt: string;
  interpretation?: string;
}