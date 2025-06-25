// Common type definitions for divination system to replace 'any' types

import {
  NumerologyResult,
  TarotReading,
  AstrologyResult,
  IChingReading,
  ShichuResult,
  RuneReading,
  KyuseiResult,
  VedicResult,
  KabbalahResult,
  CelticAstrologyResult,
  EnvironmentData,
  LunarData,
  WeatherData,
  AstronomicalData,
  PlanetaryHour
} from './divination';

// =============================================================================
// Divination Result Map - for integrated-engine.ts
// =============================================================================
export interface DivinationResultMap {
  numerology: NumerologyResult;
  tarot: TarotReading;
  astrology?: AstrologyResult;
  shichuSuimei?: ShichuResult;
  iChing?: IChingReading;
  nineStarKi?: KyuseiResult;
  runes?: RuneReading;
  vedic?: VedicResult;
  celtic?: CelticAstrologyResult;
  kabbalah?: KabbalahResult;
}

// Actual engine result map - what the engines really return
export interface EngineResultMap {
  numerology: any; // NumerologyReading
  tarot: any; // TarotEngineReading
  astrology: any; // AstrologyReading
  shichuSuimei: any; // ShichuSuimeiReading
  iChing: any; // IChingEngineReading
  nineStarKi: any; // NineStarKiReading
  runes: any; // RunicReading
  vedic: any; // VedicReading
  celtic: any; // CelticReading
  kabbalah: any; // KabbalahReading
}

// Mock result structure for lightweight sync version
export interface MockDivinationResults {
  numerology: {
    lifePathNumber: number;
    interpretation: {
      lifePathMeaning: string;
    };
  };
  tarot: {
    positions: Array<{
      card: {
        name: string;
        keywords: string[];
      };
    }>;
  };
  astrology: {
    birthChart: {
      sun: { sign: string };
      moon: { sign: string };
    };
  };
  shichuSuimei: {
    fourPillars: {
      dayPillar: {
        stem: string;
        branch: string;
      };
    };
  };
  iChing: {
    hexagram: {
      number: number;
      name: string;
    };
  };
  nineStarKi: {
    mainStar: {
      name: string;
    };
  };
  runes: {
    spread: {
      positions: Array<{
        name: string;
      }>;
    };
  };
  vedic: {
    birthChart: {
      moonNakshatra: {
        name: string;
      };
    };
  };
  celtic: {
    birthTree: {
      tree: {
        name: string;
      };
    };
  };
  kabbalah: {
    lifePathSephira: {
      sephira: {
        name: string;
      };
    };
  };
}

// =============================================================================
// Environment Data Map - for environment integration
// =============================================================================
export interface EnvironmentDataMap {
  weather: WeatherData;
  lunar: LunarData;
  astronomical: AstronomicalData;
  planetaryHour: PlanetaryHour;
}

// =============================================================================
// Time Integration Data - for time-integration.ts
// =============================================================================
export interface TimeIntegrationData {
  moment: {
    date: Date;
    lunarDay: number;
    solarDay: number;
    planetaryHour: string;
  };
  cycles: {
    personal: PersonalCycles;
    cosmic: CosmicCycles;
    elemental: ElementalCycles;
  };
}

export interface PersonalCycles {
  lifePhase: number;
  personalYear: number;
  personalMonth: number;
  personalDay: number;
  biorhythm: {
    physical: number;
    emotional: number;
    intellectual: number;
  };
}

export interface CosmicCycles {
  lunarPhase: number;
  solarSeason: number;
  planetaryTransits: string[];
  galacticAlignment: number;
}

export interface ElementalCycles {
  dominant: '木' | '火' | '土' | '金' | '水';
  secondary: '木' | '火' | '土' | '金' | '水';
  balance: Record<string, number>;
  flow: 'generating' | 'consuming' | 'balanced';
}

// =============================================================================
// Integrator Results - for integrator.ts
// =============================================================================
export interface IntegratorAnalysis {
  convergence: string[];
  patterns: string[];
  recommendations: string[];
  timing: {
    immediate: string;
    nearTerm: string;
    longTerm: string;
  };
  synthesis: string;
}

export interface SystemCorrelations {
  eastWest: string;
  ancientModern: string;
  intuitionLogic: string;
  fateChoice: string;
}

// =============================================================================
// Shichu Suimei Specific Types
// =============================================================================
export interface ShichuCurrentPillars {
  message: string;
}

export interface ShichuRyunen {
  fortune: string;
  theme: string;
  phase: string;
  events: string[];
}

export interface ShichuRyugetsu {
  fortune: string;
  theme: string;
  challenges: string[];
  opportunities: string[];
}

export interface ShichuRyujitsu {
  fortune: string;
  advice: string;
  element: string;
  energy: number;
}

// =============================================================================
// Vedic Astrology Specific Types
// =============================================================================
export interface VedicDasha {
  planet: string;
  period: string;
}

export interface VedicGochar {
  transits: string[];
}

// =============================================================================
// Astrology Transit and Progression Types
// =============================================================================
export interface AstrologyTransits {
  message: string;
  [key: string]: unknown;
}

export interface AstrologyProgressions {
  message: string;
  [key: string]: unknown;
}

// =============================================================================
// I Ching Time Hexagram
// =============================================================================
export interface IChingTimeHexagram {
  number: number;
  name: string;
}

// =============================================================================
// Rune Time Type
// =============================================================================
export interface RuneTime {
  name: string;
  element: string;
}

// =============================================================================
// Enhanced Result Types for each divination method
// =============================================================================
export interface EnhancedNumerologyResult extends NumerologyResult {
  timeBasedResults?: TimeBasedResult;
}

export interface EnhancedAstrologyResult extends AstrologyResult {
  transits?: AstrologyTransits;
  progressions?: AstrologyProgressions;
  timeBasedResults?: TimeBasedResult;
}

export interface EnhancedIChingResult extends IChingReading {
  timeHexagram?: IChingTimeHexagram;
  timeBasedResults?: TimeBasedResult;
}

export interface EnhancedShichuResult extends ShichuResult {
  currentPillars?: ShichuCurrentPillars;
  timeBasedResults?: TimeBasedResult;
}

export interface EnhancedVedicResult extends VedicResult {
  currentDasha?: VedicDasha;
  gochar?: VedicGochar;
  timeBasedResults?: TimeBasedResult;
}

export interface EnhancedRuneResult extends RuneReading {
  timeRune?: RuneTime;
  timeBasedResults?: TimeBasedResult;
}

export interface EnhancedKyuseiResult extends KyuseiResult {
  timeBasedResults?: TimeBasedResult;
}

// =============================================================================
// Time Based Result Structure
// =============================================================================
export interface TimeBasedResult {
  daily: {
    fortune: string;
    advice: string;
    luckyColor: string;
    luckyNumber: number;
    energy: number;
  };
  monthly: {
    fortune: string;
    theme: string;
    challenges: string[];
    opportunities: string[];
  };
  yearly: {
    fortune: string;
    majorTheme: string;
    lifePhase: string;
    keyEvents: string[];
  };
}

// =============================================================================
// Category-based Type Mappings
// =============================================================================
export type QuestionCategory = '恋愛・結婚' | '仕事・転職' | '金運・財運' | '健康' | '総合運';

export interface CategoryWeights {
  [category: string]: Record<string, number>;
}

export interface CategoryMessages {
  [category: string]: string;
}

// =============================================================================
// Theme and Pattern Types
// =============================================================================
export interface CommonTheme {
  theme: string;
  sources: string[];
  strength: 'strong' | 'medium' | 'subtle';
}

export interface Contradiction {
  aspect: string;
  viewpoint1: {
    source: string;
    interpretation: string;
  };
  viewpoint2: {
    source: string;
    interpretation: string;
  };
  resolution: string;
}

export interface Timeline {
  past: {
    main: string;
    supporting: string[];
  };
  present: {
    main: string;
    supporting: string[];
  };
  future: {
    main: string;
    supporting: string[];
  };
}

export interface EnergyProfile {
  dominant: string;
  secondary: string;
  lacking: string;
  advice: string;
}

// =============================================================================
// Priority Divination Type
// =============================================================================
export interface PriorityDivination {
  name: string;
  reason: string;
  weight: number;
}

// =============================================================================
// Overall Fortune Type
// =============================================================================
export interface OverallFortune {
  score: number;
  trend: 'rising' | 'stable' | 'declining';
  keyFactors: string[];
}

// =============================================================================
// Cosmic Perspective Type
// =============================================================================
export interface CosmicPerspective {
  universalMessage: string;
  synchronicities: string[];
  spiritualGuidance: string;
}

// =============================================================================
// Helper Type Guards
// =============================================================================
export function isDivinationResult(value: unknown): value is DivinationResultMap {
  return typeof value === 'object' && value !== null && 'numerology' in value && 'tarot' in value;
}

export function isTimeIntegrationData(value: unknown): value is TimeIntegrationData {
  return typeof value === 'object' && value !== null && 'moment' in value && 'cycles' in value;
}

export function hasTimeBasedResults(value: unknown): value is { timeBasedResults: TimeBasedResult } {
  return typeof value === 'object' && value !== null && 'timeBasedResults' in value;
}

// Type guard functions for mock vs full results
export function isMockResults(results: AnyDivinationResults): results is MockDivinationResults {
  return 'numerology' in results && 'lifePathNumber' in results.numerology;
}

export function isFullResults(results: AnyDivinationResults): results is DivinationResultMap {
  return 'numerology' in results && 'lifePath' in results.numerology;
}

export function isEngineResults(results: AnyDivinationResults): results is EngineResultMap {
  return 'numerology' in results && 'lifePathNumber' in (results.numerology as any);
}

// Union type for all results
export type AnyDivinationResults = DivinationResultMap | MockDivinationResults | EngineResultMap | any;

// Helper functions to safely access properties
export function getNumerologyLifePath(results: AnyDivinationResults): number {
  if (isMockResults(results)) {
    return results.numerology.lifePathNumber;
  }
  return results.numerology.lifePath;
}

export function getTarotCardName(results: AnyDivinationResults, index: number): string | undefined {
  if (isMockResults(results) && 'positions' in results.tarot) {
    return results.tarot.positions[index]?.card?.name;
  }
  if (isFullResults(results) && results.tarot.cards[index]) {
    return results.tarot.cards[index].card.name;
  }
  return undefined;
}

export function getAstrologySign(results: AnyDivinationResults, type: 'sun' | 'moon'): string | undefined {
  if (!results.astrology) return undefined;
  
  if (isMockResults(results) && 'birthChart' in results.astrology) {
    return type === 'sun' ? results.astrology.birthChart.sun.sign : results.astrology.birthChart.moon.sign;
  }
  if (isFullResults(results) && results.astrology && 'chart' in results.astrology) {
    const planet = results.astrology.chart.planets.find(p => p.name === (type === 'sun' ? 'Sun' : 'Moon'));
    return planet?.sign;
  }
  return undefined;
}