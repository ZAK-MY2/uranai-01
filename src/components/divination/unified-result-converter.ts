/**
 * 各占術エンジンの結果を統合表示用フォーマットに変換
 */

import {
  WorldClassNumerologyResult,
  WorldClassTarotResult,
  WorldClassCelticResult,
  WorldClassRunesResult,
  WorldClassIChingResult,
  WorldClassNineStarResult,
  WorldClassShichuSuimeiResult,
  WorldClassKabbalahResult,
  WorldClassFengShuiResult,
  WorldClassMayanResult,
  WorldClassChakraResult,
  WorldClassAuraSomaResult,
  WorldClassAkashicRecordsResult
} from '@/lib/divination/engines';

// アイコンは文字列として保存し、表示時にコンポーネントでマッピング

export interface UnifiedDivinationResult {
  type: string;
  name: string;
  iconName: string; // アイコン名を文字列で保持
  summary: string;
  accuracy: number;
  keyInsights: UnifiedKeyInsight[];
  timing?: UnifiedTimingInfo;
  advice?: string;
  warnings?: string[];
  detailedResult?: any;
  timestamp: Date;
}

export interface UnifiedKeyInsight {
  category: string;
  message: string;
  importance: 'high' | 'medium' | 'low';
  icon?: React.ReactNode;
}

export interface UnifiedTimingInfo {
  favorable: string[];
  challenging: string[];
  keyDates?: Date[];
}

/**
 * 数秘術結果の変換
 */
export function convertNumerologyResult(result: WorldClassNumerologyResult): UnifiedDivinationResult {
  const keyInsights: UnifiedKeyInsight[] = [
    {
      category: 'general',
      message: `ライフパスナンバー ${result.coreNumbers.lifePathNumber.value} - ${result.coreNumbers.lifePathNumber.interpretation.modern}`,
      importance: 'high'
    },
    {
      category: 'spiritual',
      message: `魂の衝動数 ${result.coreNumbers.soulUrgeNumber.value} - ${result.coreNumbers.soulUrgeNumber.interpretation.modern}`,
      importance: 'high'
    },
    {
      category: 'career',
      message: result.personalization.careerGuidance[0] || '仕事運の詳細は個別分析をご覧ください',
      importance: 'medium'
    }
  ];

  // 個人年サイクルからのインサイト
  if (result.cycles.personalYear) {
    keyInsights.push({
      category: 'general',
      message: `${result.cycles.personalYear.name} - ${result.cycles.personalYear.theme}`,
      importance: 'high'
    });
  }

  return {
    type: 'numerology',
    name: '数秘術',
    iconName: "Hash",
    summary: result.interpretation.modern.psychologicalProfile,
    accuracy: result.metadata.confidenceLevel,
    keyInsights,
    timing: {
      favorable: result.cycles.personalYear?.opportunities || [],
      challenging: result.cycles.personalYear?.challenges || []
    },
    advice: result.interpretation.practical.dailyApplication,
    warnings: result.cycles.challenges?.map(c => c.description) || [],
    detailedResult: result,
    timestamp: result.metadata.generatedAt
  };
}

/**
 * タロット結果の変換
 */
export function convertTarotResult(result: WorldClassTarotResult): UnifiedDivinationResult {
  const keyInsights: UnifiedKeyInsight[] = [];

  // カードごとのインサイト
  result.cards.drawn.forEach((drawnCard, index) => {
    const position = result.spread.positions[index];
    keyInsights.push({
      category: getCategoryFromPosition(position?.meaning || ''),
      message: `${position?.name || `位置${index + 1}`}: ${drawnCard.card.name}${drawnCard.isReversed ? '（逆位置）' : ''} - ${
        drawnCard.isReversed ? drawnCard.card.meanings.reversed.general : drawnCard.card.meanings.upright.general
      }`,
      importance: index === 0 ? 'high' : 'medium'
    });
  });

  return {
    type: 'tarot',
    name: 'タロット',
    iconName: "Hash",
    summary: result.interpretation.synthesis,
    accuracy: result.accuracy.overallConfidence,
    keyInsights,
    timing: {
      favorable: [result.interpretation.timing],
      challenging: []
    },
    advice: result.interpretation.advice,
    warnings: result.interpretation.warning ? [result.interpretation.warning] : [],
    detailedResult: result,
    timestamp: new Date() // Using current date as timestamp field doesn't exist in the current structure
  };
}

/**
 * ケルト十字結果の変換
 */
export function convertCelticResult(result: WorldClassCelticResult): UnifiedDivinationResult {
  const keyInsights: UnifiedKeyInsight[] = [
    {
      category: 'general',
      message: result.interpretation?.synthesis || 'ケルトの古代智慧による導き',
      importance: 'high'
    }
  ];

  // オガム文字のメッセージ
  if (result.oghamCasting?.drawnOghams) {
    result.oghamCasting.drawnOghams.forEach((drawnOgham, index) => {
      keyInsights.push({
        category: 'spiritual',
        message: `${drawnOgham.ogham.name}${drawnOgham.isReversed ? '（逆）' : ''} - ${
          result.interpretation?.oghamInterpretations?.[index]?.meaning?.general || 'オガムの智慧'
        }`,
        importance: index === 0 ? 'high' : 'medium'
      });
    });
  }

  // 樹木智慧の追加
  if (result.interpretation?.treeWisdom) {
    keyInsights.push({
      category: 'spiritual',
      message: `樹木の智慧: ${result.interpretation.treeWisdom.groveMessage}`,
      importance: 'medium'
    });
  }

  return {
    type: 'celtic',
    name: 'ケルト占術',
    iconName: "TreePine",
    summary: result.interpretation?.coreMessage || 'ケルトの智慧による洞察',
    accuracy: result.accuracy?.overallConfidence || 0.9,
    keyInsights,
    timing: {
      favorable: [result.interpretation?.timing || '自然のリズムに従って'],
      challenging: []
    },
    advice: result.interpretation?.advice || '樹木の智慧に耳を傾けてください',
    warnings: result.interpretation?.warning ? [result.interpretation.warning] : [],
    detailedResult: result,
    timestamp: result.oghamCasting?.timestamp || new Date()
  };
}

/**
 * ルーン結果の変換
 */
export function convertRunesResult(result: WorldClassRunesResult): UnifiedDivinationResult {
  const keyInsights: UnifiedKeyInsight[] = [];

  // 各ルーンのインサイト
  result.interpretation.runeInterpretations.forEach((interp, index) => {
    keyInsights.push({
      category: 'spiritual',
      message: `${interp.rune.name}${interp.isReversed ? '（逆）' : ''} - ${interp.meaning.general}`,
      importance: index === 0 ? 'high' : 'medium'
    });
  });

  // 神話的テーマ
  if (result.advancedAnalysis.mythologicalThemes.length > 0) {
    keyInsights.push({
      category: 'spiritual',
      message: `神話的テーマ: ${result.advancedAnalysis.mythologicalThemes.join(', ')}`,
      importance: 'medium'
    });
  }

  return {
    type: 'runes',
    name: 'ルーン占い',
    iconName: "Compass",
    summary: result.interpretation.synthesis,
    accuracy: result.accuracy.overallConfidence,
    keyInsights,
    timing: {
      favorable: [result.interpretation.timing],
      challenging: []
    },
    advice: result.interpretation.advice,
    warnings: result.interpretation.warning ? [result.interpretation.warning] : [],
    detailedResult: result,
    timestamp: result.casting.timestamp
  };
}

/**
 * 易経結果の変換
 */
export function convertIChingResult(result: WorldClassIChingResult): UnifiedDivinationResult {
  const keyInsights: UnifiedKeyInsight[] = [
    {
      category: 'general',
      message: `${result.hexagram.primary.name} - ${result.hexagram.primary.judgment}`,
      importance: 'high'
    }
  ];

  // 変爻がある場合
  if (result.hexagram.changing) {
    keyInsights.push({
      category: 'general',
      message: `変化後: ${result.hexagram.changing.name} - 状況は${result.interpretation.outcome}へ向かっています`,
      importance: 'high'
    });
  }

  // 陰陽バランス
  keyInsights.push({
    category: 'spiritual',
    message: `陰陽バランス: 陰${result.interpretation.yinYangBalance.yinCount} 陽${result.interpretation.yinYangBalance.yangCount} - ${result.interpretation.yinYangBalance.advice}`,
    importance: 'medium'
  });

  return {
    type: 'iching',
    name: '易経',
    iconName: "BookOpen",
    summary: result.interpretation.situation,
    accuracy: result.metadata.confidenceLevel,
    keyInsights,
    timing: {
      favorable: [result.interpretation.timing],
      challenging: []
    },
    advice: result.interpretation.advice,
    warnings: result.interpretation.warning ? [result.interpretation.warning] : [],
    detailedResult: result,
    timestamp: result.metadata.castingTimestamp
  };
}

/**
 * 九星気学結果の変換
 */
export function convertNineStarKiResult(result: WorldClassNineStarResult): UnifiedDivinationResult {
  const keyInsights: UnifiedKeyInsight[] = [
    {
      category: 'general',
      message: `本命星: ${result.mainStar.name} - ${result.mainStar.characteristics.join('、')}`,
      importance: 'high'
    }
  ];

  // 大運・小運
  if (result.fortuneCycles.currentPhase) {
    keyInsights.push({
      category: 'general',
      message: `現在の運気: ${result.fortuneCycles.currentPhase.name} - ${result.fortuneCycles.currentPhase.energy}`,
      importance: 'high'
    });
  }

  // 方位
  if (result.directionScience.currentYearDirections.bestDirection) {
    keyInsights.push({
      category: 'general',
      message: `吉方位: ${result.directionScience.currentYearDirections.bestDirection.direction} - ${result.directionScience.currentYearDirections.bestDirection.fortune}`,
      importance: 'medium'
    });
  }

  return {
    type: 'nine-star-ki',
    name: '九星気学',
    iconName: "Star",
    summary: result.interpretation.modern.psychologicalProfile,
    accuracy: result.metadata.confidenceLevel,
    keyInsights,
    timing: {
      favorable: result.directionScience.currentYearDirections.auspicious.map(d => d.timing),
      challenging: result.directionScience.currentYearDirections.inauspicious.map(d => d.timing)
    },
    advice: result.interpretation.practical.dailyApplication,
    warnings: result.personalization.healthGuidance,
    detailedResult: result,
    timestamp: result.metadata.generatedAt
  };
}

/**
 * 四柱推命結果の変換
 */
export function convertShichuSuimeiResult(result: WorldClassShichuSuimeiResult): UnifiedDivinationResult {
  const keyInsights: UnifiedKeyInsight[] = [
    {
      category: 'general',
      message: `日主: ${result.fourPillars.day.stem} - ${result.fourPillars.day.element}`,
      importance: 'high'
    }
  ];

  // 格局
  if (result.patternAnalysis?.pattern) {
    keyInsights.push({
      category: 'general',
      message: `格局: ${result.patternAnalysis.pattern.name} - ${result.patternAnalysis.pattern.description}`,
      importance: 'high'
    });
  }

  // 五行バランス
  if (result.elementalBalance) {
    keyInsights.push({
      category: 'general',
      message: `五行バランス: ${result.elementalBalance.dominant}優位 - ${result.elementalBalance.recommendations?.[0] || '調和を保つ'}`,
      importance: 'medium'
    });
  }

  return {
    type: 'shichu-suimei',
    name: '四柱推命',
    iconName: "Calendar",
    summary: result.interpretation?.modern?.psychologicalProfile || '四柱推命による詳細分析',
    accuracy: result.metadata?.confidenceLevel || 0.85,
    keyInsights,
    timing: {
      favorable: [],
      challenging: []
    },
    advice: result.interpretation?.practical?.dailyApplication || '陰陽五行のバランスを心がけてください',
    warnings: [],
    detailedResult: result,
    timestamp: result.metadata?.generatedAt || new Date()
  };
}

/**
 * カバラ結果の変換
 */
export function convertKabbalahResult(result: WorldClassKabbalahResult): UnifiedDivinationResult {
  const keyInsights: UnifiedKeyInsight[] = [
    {
      category: 'spiritual',
      message: `生命の道: ${result.personalSephirot.lifePathSephira.name} - ${result.personalSephirot.spiritualTask}`,
      importance: 'high'
    }
  ];

  // セフィロト
  result.treeOfLife.activeNodes.forEach((sephira, index) => {
    if (index < 3) {
      keyInsights.push({
        category: 'spiritual',
        message: `${sephira.name}: ${sephira.meaning}`,
        importance: index === 0 ? 'high' : 'medium'
      });
    }
  });

  // ゲマトリア洞察
  if (result.gematria.nameAnalysis) {
    keyInsights.push({
      category: 'spiritual',
      message: `名前の数秘: ${result.gematria.nameAnalysis.standardValue} - ${result.gematria.numericalSignificance}`,
      importance: 'medium'
    });
  }

  return {
    type: 'kabbalah',
    name: 'カバラ数秘術',
    iconName: "Hexagon",
    summary: result.interpretation?.overview || 'カバラの生命の樹による深い洞察',
    accuracy: result.accuracy?.overallConfidence || 0.9,
    keyInsights,
    timing: {
      favorable: [result.personalSephirot.currentLesson],
      challenging: result.treeOfLife.blockages || []
    },
    advice: result.interpretation?.practicalAdvice || result.personalSephirot.nextStage,
    warnings: result.interpretation?.warnings || [],
    detailedResult: result,
    timestamp: new Date()
  };
}

/**
 * アカシックレコード結果の変換
 */
export function convertAkashicRecordsResult(result: WorldClassAkashicRecordsResult): UnifiedDivinationResult {
  const keyInsights: UnifiedKeyInsight[] = [
    {
      category: 'spiritual',
      message: `魂の年齢: ${result.soulRecord.soulAge.category} - レベル${result.soulRecord.soulAge.level} - ${result.soulRecord.soulAge.experience}`,
      importance: 'high'
    },
    {
      category: 'spiritual',
      message: `魂のタイプ: ${result.soulRecord.soulType.role} - 周波数${result.soulRecord.soulType.frequency}`,
      importance: 'high'
    },
    {
      category: 'general',
      message: `人生の主要な目的: ${result.lifeContract.primaryPurpose}`,
      importance: 'high'
    }
  ];

  // カルマ分析からのインサイト
  if (result.karmaAnalysis.primaryKarma.length > 0) {
    keyInsights.push({
      category: 'spiritual',
      message: `主要なカルマ: ${result.karmaAnalysis.primaryKarma[0].type} - 癒しの道: ${result.karmaAnalysis.primaryKarma[0].healingPath}`,
      importance: 'medium'
    });
  }

  // スピリットガイドからのメッセージ
  if (result.higherGuidance.spiritGuides.length > 0) {
    keyInsights.push({
      category: 'spiritual',
      message: `スピリットガイド: ${result.higherGuidance.spiritGuides[0].name} - ${result.higherGuidance.spiritGuides[0].messages[0]}`,
      importance: 'medium'
    });
  }

  return {
    type: 'akashic-records',
    name: 'アカシックレコード',
    iconName: 'Globe',
    summary: result.threeLayerInterpretation.modern.psychologicalProfile,
    accuracy: result.accuracy.overallReliability,
    keyInsights,
    timing: {
      favorable: result.timelines.temporalGates.map(g => `${g.opportunity} (${new Date(g.opening).toLocaleDateString('ja-JP')})`),
      challenging: result.karmaAnalysis.healingRequired
    },
    advice: result.practicalGuidance.immediateActions[0],
    warnings: result.karmaAnalysis.healingRequired,
    detailedResult: result,
    timestamp: new Date()
  };
}

// 風水、マヤ暦、チャクラ、オーラソーマの変換は
// createBasicUnifiedResult関数で処理されます

/**
 * ヘルパー関数：タロットの位置からカテゴリを推定
 */
function getCategoryFromPosition(positionMeaning: string): string {
  const lowerMeaning = positionMeaning.toLowerCase();
  
  if (lowerMeaning.includes('恋愛') || lowerMeaning.includes('関係')) {
    return 'love';
  } else if (lowerMeaning.includes('仕事') || lowerMeaning.includes('キャリア')) {
    return 'career';
  } else if (lowerMeaning.includes('健康')) {
    return 'health';
  } else if (lowerMeaning.includes('金') || lowerMeaning.includes('財')) {
    return 'wealth';
  } else if (lowerMeaning.includes('霊') || lowerMeaning.includes('精神')) {
    return 'spiritual';
  }
  
  return 'general';
}

/**
 * 統合結果変換関数
 */
export function convertToUnifiedFormat(
  divinationType: string,
  result: any
): UnifiedDivinationResult {
  try {
    // resultが存在しない場合の早期リターン
    if (!result) {
      // console.warn(`No result provided for ${divinationType}`);
      return createBasicUnifiedResult(divinationType, {});
    }

    switch (divinationType) {
      case 'numerology':
        return convertNumerologyResult(result as WorldClassNumerologyResult);
      case 'tarot':
        return convertTarotResult(result as WorldClassTarotResult);
      case 'celtic':
        return convertCelticResult(result as WorldClassCelticResult);
      case 'runes':
        return convertRunesResult(result as WorldClassRunesResult);
      case 'iching':
        return convertIChingResult(result as WorldClassIChingResult);
      case 'nine-star-ki':
        return convertNineStarKiResult(result as WorldClassNineStarResult);
      case 'shichu-suimei':
        return convertShichuSuimeiResult(result as WorldClassShichuSuimeiResult);
      case 'kabbalah':
        return convertKabbalahResult(result as WorldClassKabbalahResult);
      case 'feng-shui':
        return createBasicUnifiedResult(divinationType, result);
      case 'mayan-calendar':
        return createBasicUnifiedResult(divinationType, result);
      case 'chakra':
        return createBasicUnifiedResult(divinationType, result);
      case 'aura-soma':
        return createBasicUnifiedResult(divinationType, result);
      case 'akashic-records':
        return convertAkashicRecordsResult(result as WorldClassAkashicRecordsResult);
      case 'integrated':
        return convertIntegratedResult(result);
      default:
        // console.warn(`Unknown divination type: ${divinationType}`);
        return createBasicUnifiedResult(divinationType, result);
    }
  } catch (error) {
    // console.warn(`Error converting ${divinationType} result:`, error);
    return createBasicUnifiedResult(divinationType, result || {});
  }
}

/**
 * 基本的な統合結果を作成
 */
function createBasicUnifiedResult(divinationType: string, result: any): UnifiedDivinationResult {
  const typeMap: Record<string, { name: string; iconName: string }> = {
    'numerology': { name: '数秘術', iconName: 'Hash' },
    'tarot': { name: 'タロット', iconName: 'Hash' },
    'celtic': { name: 'ケルト占術', iconName: 'TreePine' },
    'runes': { name: 'ルーン占い', iconName: 'Compass' },
    'iching': { name: '易経', iconName: 'BookOpen' },
    'nine-star-ki': { name: '九星気学', iconName: 'Star' },
    'shichu-suimei': { name: '四柱推命', iconName: 'Calendar' },
    'kabbalah': { name: 'カバラ数秘術', iconName: 'Hexagon' },
    'feng-shui': { name: '風水', iconName: 'Home' },
    'mayan-calendar': { name: 'マヤ暦', iconName: 'Sun' },
    'chakra': { name: 'チャクラ診断', iconName: 'Activity' },
    'aura-soma': { name: 'オーラソーマ', iconName: 'Palette' },
    'akashic-records': { name: 'アカシックレコード', iconName: 'Globe' },
    'integrated': { name: '統合占術', iconName: 'Sparkles' }
  };

  const typeInfo = typeMap[divinationType] || { name: '占術', iconName: 'Star' };

  // 基本的なキーインサイトを生成
  const keyInsights: UnifiedKeyInsight[] = [];
  
  // resultの構造を確認してキーインサイトを抽出
  if (result && typeof result === 'object') {
    // 基本情報
    keyInsights.push({
      category: 'general',
      message: `${typeInfo.name}の分析結果をご確認ください`,
      importance: 'high'
    });
    
    // interpretationがある場合
    if (result.interpretation) {
      if (result.interpretation.synthesis) {
        keyInsights.push({
          category: 'general',
          message: result.interpretation.synthesis,
          importance: 'high'
        });
      }
      if (result.interpretation.advice) {
        keyInsights.push({
          category: 'general',
          message: result.interpretation.advice,
          importance: 'medium'
        });
      }
    }
    
    // threeLayerInterpretationがある場合
    if (result.threeLayerInterpretation || result.interpretation) {
      const modernProfile = result.threeLayerInterpretation?.modern?.psychologicalProfile || 
                           result.interpretation?.modern?.psychologicalProfile;
      if (modernProfile) {
        keyInsights.push({
          category: 'spiritual',
          message: modernProfile,
          importance: 'medium'
        });
      }
    }
  }
  
  // キーインサイトが空の場合はデフォルトを追加
  if (keyInsights.length === 0) {
    keyInsights.push({
      category: 'general',
      message: `${typeInfo.name}の分析結果をご確認ください`,
      importance: 'high'
    });
  }

  return {
    type: divinationType,
    name: typeInfo.name,
    iconName: typeInfo.iconName,
    summary: result?.interpretation?.overview || 
             result?.interpretation?.synthesis || 
             result?.summary || 
             result?.threeLayerInterpretation?.modern?.psychologicalProfile || 
             result?.interpretation?.modern?.psychologicalProfile ||
             `${typeInfo.name}による洞察`,
    accuracy: result?.accuracy?.overallConfidence || 
              result?.accuracy?.overallReliability || 
              result?.metadata?.confidenceLevel || 
              85,
    keyInsights,
    timing: {
      favorable: result?.timing?.favorable || [],
      challenging: result?.timing?.challenging || []
    },
    advice: result?.interpretation?.practicalAdvice || 
            result?.interpretation?.practical?.dailyApplication ||
            result?.practicalGuidance?.immediateActions?.[0] || 
            result?.advice || 
            '詳細な分析結果をご覧ください',
    warnings: result?.warnings || 
              result?.karmaAnalysis?.healingRequired || 
              [],
    detailedResult: result || {},
    timestamp: result?.metadata?.generatedAt || new Date()
  };
}


/**
 * 統合占術結果の変換
 */
export function convertIntegratedResult(result: any): UnifiedDivinationResult {
  const keyInsights: UnifiedKeyInsight[] = [];

  // 共通テーマから洞察を生成
  if (result?.synthesis?.commonThemes?.length > 0) {
    result.synthesis.commonThemes.forEach((theme: any) => {
      keyInsights.push({
        category: 'general',
        message: `${theme.theme} (${theme.sources.join(', ')})`,
        importance: theme.strength === 'strong' ? 'high' : theme.strength === 'medium' ? 'medium' : 'low'
      });
    });
  }

  // コアメッセージを追加
  if (result?.integratedMessage?.coreMessage) {
    keyInsights.push({
      category: 'general',
      message: result.integratedMessage.coreMessage,
      importance: 'high'
    });
  }

  // エネルギープロファイル
  if (result?.synthesis?.energyProfile) {
    keyInsights.push({
      category: 'energy',
      message: `主要エネルギー: ${result.synthesis.energyProfile.dominant}, 不足: ${result.synthesis.energyProfile.lacking}`,
      importance: 'medium'
    });
  }

  // 総合運勢
  if (result?.overallFortune) {
    keyInsights.push({
      category: 'fortune',
      message: `総合運勢: ${result.overallFortune.score}点 (${result.overallFortune.trend === 'rising' ? '上昇傾向' : result.overallFortune.trend === 'declining' ? '下降傾向' : '安定'})`,
      importance: 'high'
    });
  }

  // 宇宙的視点
  if (result?.cosmicPerspective?.universalMessage) {
    keyInsights.push({
      category: 'spiritual',
      message: result.cosmicPerspective.universalMessage,
      importance: 'medium'
    });
  }

  // keyInsightsが空の場合のフォールバック
  if (keyInsights.length === 0) {
    keyInsights.push({
      category: 'general',
      message: '統合占術の結果を分析しています',
      importance: 'medium'
    });
  }

  return {
    type: 'integrated',
    name: '統合占術',
    iconName: "Sparkles",
    summary: result?.integratedMessage?.coreMessage || '複数の占術を統合した総合的な洞察',
    accuracy: result?.overallFortune?.score || 85,
    keyInsights,
    timing: {
      favorable: result?.integratedMessage?.opportunities || [],
      challenging: result?.integratedMessage?.warnings || []
    },
    advice: result?.synthesis?.energyProfile?.advice || result?.integratedMessage?.actionSteps?.[0] || '各占術の結果を総合的に考慮してください',
    warnings: result?.integratedMessage?.warnings || [],
    detailedResult: result,
    timestamp: new Date()
  };
}