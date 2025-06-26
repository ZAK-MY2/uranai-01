/**
 * 占術エンジン統合エクスポート
 * 
 * 全10占術のworld-classエンジンと基本エンジンを統合
 */

// 基盤エンジン
export { BaseDivinationEngine } from '../base-engine';

// World-Class エンジン（商用品質・高精度実装）
export { WorldClassNumerologyEngine } from './world-class-numerology-engine';
export { WorldClassTarotEngine } from './world-class-tarot-engine';
export { WorldClassCelticEngine } from './world-class-celtic-engine';
export { WorldClassRunesEngine } from './world-class-runes-engine';
export { WorldClassIChingEngine } from './world-class-iching-engine';
export { WorldClassNineStarKiEngine } from './world-class-nine-star-ki-engine';
export { WorldClassShichuSuimeiEngine } from './world-class-shichu-suimei-engine';
export { WorldClassKabbalahEngine } from './world-class-kabbalah-engine';
export { WorldClassFengShuiEngine } from './world-class-feng-shui-engine';
export { WorldClassMayanCalendarEngine } from './world-class-mayan-calendar-engine';
export { WorldClassChakraEngine } from './world-class-chakra-engine';
export { WorldClassAuraSomaEngine } from './world-class-aura-soma-engine';
export { WorldClassAkashicRecordsEngine } from './world-class-akashic-records-engine';

// 基本エンジン（互換性維持）
export { NumerologyEngine } from './numerology-engine';
export { TarotEngine } from './tarot-engine';
export { CelticEngine } from './celtic-engine';
export { RunesEngine } from './runes-engine';
export { IChingEngine } from './iching-engine';
export { NineStarKiEngine } from './nine-star-ki-engine';
export { ShichuSuimeiEngine } from './shichu-suimei-engine';
export { VedicAstrologyEngine } from './vedic-astrology-engine';
// export { PrecisionAstrologyEngine } from './precision-astrology-engine'; // 型定義完成後に有効化
export { KabbalahEngine } from './kabbalah-engine';

// 統合システム
export { EasternIntegrationSystem } from './eastern-integration-system';
export { IntegratedEngine } from './integrated-engine';

// 型定義エクスポート
export type { DivinationInput, EnvironmentData } from '../base-engine';
export type { WorldClassNumerologyResult } from './world-class-numerology-engine';
export type { WorldClassTarotResult } from './world-class-tarot-engine';
export type { WorldClassCelticResult } from './world-class-celtic-engine';
export type { WorldClassRunesResult } from './world-class-runes-engine';
export type { WorldClassIChingResult } from './world-class-iching-engine';
export type { WorldClassNineStarResult } from './world-class-nine-star-ki-engine';
export type { WorldClassShichuSuimeiResult } from './world-class-shichu-suimei-engine';
export type { WorldClassKabbalahResult } from './world-class-kabbalah-engine';
export type { WorldClassFengShuiResult } from './world-class-feng-shui-engine';
export type { WorldClassMayanResult } from './world-class-mayan-calendar-engine';
export type { WorldClassChakraResult } from './world-class-chakra-engine';
export type { WorldClassAuraSomaResult } from './world-class-aura-soma-engine';
export type { WorldClassAkashicRecordsResult } from './world-class-akashic-records-engine';