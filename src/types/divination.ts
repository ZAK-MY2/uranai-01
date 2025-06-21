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
  meaning: string;
}

export interface TarotReading {
  spread: TarotSpread;
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
  environment: EnvironmentData;
  integration: {
    commonThemes: string[];
    contradictions: string[];
    environmentalInfluence: string;
    overallGuidance: string;
    specificAdvice: string[];
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