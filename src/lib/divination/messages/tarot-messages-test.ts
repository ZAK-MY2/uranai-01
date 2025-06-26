// タロットメッセージテスト
export interface TarotCardMessage {
  uprightInterpretations: string[];
  reversedInterpretations: string[];
  positionInterpretations: {
    past: string[];
    present: string[];
    future: string[];
    advice: string[];
    obstacle: string[];
    outcome: string[];
    innerSelf: string[];
    environment: string[];
    hopes: string[];
    fears: string[];
  };
  categoryInterpretations: {
    love: string[];
    career: string[];
    health: string[];
    finance: string[];
    spiritual: string[];
    general: string[];
  };
  timingMessages: {
    morning: string[];
    afternoon: string[];
    evening: string[];
    weekly: string[];
    monthly: string[];
  };
  combinations: {
    withMajorArcana: Record<string, string>;
    withSameSuit: Record<string, string>;
    withCourtCards: Record<string, string>;
  };
  poeticExpressions: string[];
  psychologicalInsights: string[];
  practicalAdvice: string[];
}

export const TEST_MESSAGES: Record<string, TarotCardMessage> = {
  'ten-of-wands': {
    uprightInterpretations: [
      '重い責任と負担を背負いながらも、目標に向かって前進します'
    ],
    reversedInterpretations: [
      '過度の負担により、燃え尽きや体調不良のリスクが高まっています'
    ],
    positionInterpretations: {
      past: ['過去の重い責任や努力が、現在の成功の基盤となっています'],
      present: ['現在、大きな責任と負担を背負っている状況です'],
      future: ['将来、すべての努力が報われて大きな成功を収めます'],
      advice: ['適度に休息を取り、無理をしすぎないよう注意してください'],
      obstacle: ['過度の負担により、効率性や判断力が低下しています'],
      outcome: ['最終的に、すべての努力が報われて大きな成功を得ます'],
      innerSelf: ['内なる責任感と使命感が最高レベルに達しています'],
      environment: ['多くの責任と期待が集中する、重圧の高い環境です'],
      hopes: ['すべての努力が報われ、大きな成功を収めることを願っています'],
      fears: ['重い負担に押し潰され、目標達成できないことを恐れています']
    },
    categoryInterpretations: {
      love: ['関係において多くの責任を負い、パートナーを支えています'],
      career: ['職場で多くの責任を背負い、重要なプロジェクトを担当'],
      health: ['健康管理において、厳しい制限や治療を継続中'],
      finance: ['経済的責任が重く、家族や事業のために懸命に働いています'],
      spiritual: ['スピリチュアルな使命のために、重い責任を背負っています'],
      general: ['人生において多くの責任を背負い、重要な役割を果たしています']
    },
    timingMessages: {
      morning: ['朝の新鮮なエネルギーで、重い一日の始まりに備えましょう'],
      afternoon: ['午後の充実したエネルギーで、重要な作業を推進'],
      evening: ['夜の時間に、今日の努力を振り返り、進歩を確認'],
      weekly: ['今週は重い責任と負担を背負う重要な週'],
      monthly: ['今月は長期的な努力が実を結ぶ重要な月']
    },
    combinations: {
      withMajorArcana: {
        'strength': '内なる力により、重い負担を乗り越える'
      },
      withSameSuit: {
        'nine-of-wands': '最後の負担を乗り越えて、完全な達成へ'
      },
      withCourtCards: {
        'king-of-wands': '成熟したリーダーとして、重い責任を背負う'
      }
    },
    poeticExpressions: [
      '十本の重い杖を背負い、目標への最後の坂道を登り続ける'
    ],
    psychologicalInsights: [
      '責任感が過度に発達し、自己犠牲的な行動パターンが確立されています'
    ],
    practicalAdvice: [
      '今週、信頼できる人に具体的な支援を求めてみましょう'
    ]
  }
};