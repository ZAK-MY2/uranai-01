// ORACLE ECHO メッセージスタイルガイド
// 著名占星術師・カウンセラーの研究に基づく品質指針
// 
// 研究対象：
// - 石井ゆかり：ロマンチックで超越的でありながら優しい文体
// - 鏡リュウジ：心理学的、学術的でありながらアクセシブル
// - 河合隼雄：平易な語り口の中に深い洞察、ユーモア、断定しない姿勢
// - しいたけ.：やわらかく心温まるアプローチ、悪意がなく心が軽くなる
// - yuji：カジュアルで親しみやすい、現実的でセンス重視、早口で切れ味良い

export interface MessageStyleGuidelines {
  tone: 'supportive' | 'contemplative' | 'encouraging' | 'gentle';
  directness: 'subtle' | 'balanced' | 'clear';
  emotionalDepth: 'light' | 'moderate' | 'deep';
  timeframe: 'immediate' | 'near-future' | 'long-term';
  certainty: 'possibility' | 'tendency' | 'likelihood';
}

// メッセージ品質の核心原則
export const CORE_PRINCIPLES = {
  // 1年間重複回避のための多様性
  VARIETY: {
    target: 365, // 最低365パターン
    categories: ['daily', 'weekly', 'seasonal', 'cyclical'],
    rotation_method: 'intelligent_seed_based'
  },

  // リアリティと実用性
  REALISM: {
    avoid: ['断定的すぎる表現', '非現実的な約束', '過度な物質的予言'],
    prefer: ['可能性の示唆', '内面の気づき', '日常的な行動指針'],
    balance: '希望的だが現実的'
  },

  // 詩的すぎない自然な表現
  NATURALNESS: {
    avoid: ['過度な比喩', '装飾過多', '抽象的すぎる表現'],
    prefer: ['日常に根ざした言葉', '具体的なイメージ', '親しみやすい表現'],
    tone: '石井ゆかり的「美しいが自然」'
  },

  // ネガティブ回避とポジティブバランス
  POSITIVITY: {
    ratio: '80%ポジティブ:20%注意喚起',
    challenge_expression: '成長の機会として提示',
    warning_style: '河合隼雄的「やさしい気づき」',
    hope_maintenance: '必ず可能性を残す'
  },

  // 寄り添いと応援のバランス
  EMPATHY: {
    approach: '鏡リュウジ的「心理学的理解」',
    distance: '適度な距離感を保つ',
    support_style: '押し付けがましくない',
    validation: '相手の感情を認める'
  },

  // 言い切りすぎない余韻
  CONTEMPLATION: {
    certainty_level: '60-80%（断定を避ける）',
    ending_style: '...かもしれません、...でしょう',
    reflection_space: '考える余地を残す',
    open_questions: '内省を促す'
  }
};

// 語尾とトーンのパターン
export const TONE_PATTERNS = {
  GENTLE_SUGGESTION: [
    '...というサインかもしれません',
    '...の可能性を感じられそうです',
    '...に意識を向けてみると良いかもしれません',
    '...という時期にあるのかもしれません'
  ],

  ENCOURAGING_REFLECTION: [
    '...について考えてみる時間を持ってみてください',
    '...を振り返ってみることで新しい気づきがありそうです',
    '...という視点から見直してみると、何か見えてくるかもしれません',
    '...に関して、あなたなりの答えが見つかりそうです'
  ],

  SUPPORTIVE_WISDOM: [
    '...ということを、星々が静かに伝えているようです',
    '...という流れの中にいることを、宇宙は知っています',
    '...の時期であることを、そっと教えてくれています',
    '...というエネルギーに包まれているのを感じられるでしょう'
  ],

  PRACTICAL_GUIDANCE: [
    '...を心がけることで、道筋が見えてきそうです',
    '...に注意を向けることで、状況が変化するかもしれません',
    '...を大切にすることで、良い流れが生まれるでしょう',
    '...を意識することで、新しい扉が開かれそうです'
  ]
};

// 感情に寄り添う表現パターン
export const EMPATHY_EXPRESSIONS = {
  UNDERSTANDING: [
    'そんな気持ちになるのは自然なことです',
    'その想いを抱えているあなたを',
    'そのような状況にいらっしゃるのですね',
    'そんな風に感じていらっしゃるのかもしれません'
  ],

  VALIDATION: [
    'あなたの感覚は間違っていないようです',
    'その直感は大切にしたいですね',
    'あなたの気持ちはとても大切なものです',
    'そのように感じることには意味があります'
  ],

  GENTLE_CHALLENGE: [
    '別の角度から見てみると、どうでしょうか',
    '少し違った視点も考えてみませんか',
    '新しい可能性も見えてくるかもしれません',
    '別の選択肢もあるのかもしれません'
  ]
};

// 季節と時間を考慮した表現
export const TEMPORAL_EXPRESSIONS = {
  MORNING: [
    '朝の清々しいエネルギーと共に',
    '新しい一日の始まりに',
    '朝日のように新鮮な気持ちで'
  ],
  
  EVENING: [
    '一日を振り返る静かな時間に',
    '夕暮れの穏やかなエネルギーの中で',
    '今日という日に感謝しながら'
  ],

  SEASONAL: {
    spring: ['新芽のような新しい可能性', '暖かな風のような変化'],
    summer: ['太陽のような明るいエネルギー', '活力に満ちた時期'],
    autumn: ['実りの季節のような成熟', '深みのある時間'],
    winter: ['雪のような静寂の中で', '内なる温かさを大切に']
  }
};

// メッセージ生成の品質チェックリスト
export const QUALITY_CHECKLIST = {
  CONTENT: [
    '✓ 占術理論に基づいた正確な内容か',
    '✓ 1年間で重複しない多様性があるか',
    '✓ 現実的で実用的なアドバイスか',
    '✓ 詩的すぎず自然な表現か'
  ],

  TONE: [
    '✓ 寄り添う気持ちが伝わるか',
    '✓ 押し付けがましくないか',
    '✓ ネガティブすぎないか',
    '✓ 考える余地があるか'
  ],

  STRUCTURE: [
    '✓ 適切な長さ（50-150文字程度）か',
    '✓ 読みやすい文章構成か',
    '✓ 具体的なイメージがあるか',
    '✓ 希望的な締めくくりか'
  ]
};

// コンテキスト別メッセージ調整
export const CONTEXT_ADJUSTMENTS = {
  QUESTION_CATEGORY: {
    '恋愛・結婚': {
      focus: '心の繋がり、相互理解、成長',
      avoid: '具体的な時期の断定、相手の行動予測',
      tone: 'gentle_romantic'
    },
    '仕事・転職': {
      focus: '能力発揮、機会の認識、成長',
      avoid: '具体的な成功約束、他者との比較',
      tone: 'encouraging_practical'
    },
    '人間関係': {
      focus: 'コミュニケーション、理解、調和',
      avoid: '他者の責任追及、関係の断定',
      tone: 'empathetic_wise'
    },
    '健康': {
      focus: '心身のバランス、セルフケア、気づき',
      avoid: '医学的診断、具体的症状予測',
      tone: 'caring_supportive'
    },
    '金運・財運': {
      focus: '価値観、努力、機会の認識',
      avoid: '具体的金額、投資アドバイス',
      tone: 'realistic_hopeful'
    }
  }
};

// メッセージ変調システム（重複回避）
export class MessageVariationSystem {
  private usedSeedCombinations: Set<string> = new Set();
  
  generateVariation(
    baseMessage: string,
    seed: number,
    userContext: any
  ): string {
    // シード値とコンテキストから一意の組み合わせを生成
    const combination = `${seed}-${userContext.questionCategory}-${new Date().getMonth()}`;
    
    // 重複チェック
    if (this.usedSeedCombinations.has(combination)) {
      // 微調整を加えて重複を回避
      seed = (seed + 17) % 1000;
    }
    
    this.usedSeedCombinations.add(combination);
    
    // メッセージのバリエーション生成
    return this.applyVariationPattern(baseMessage, seed, userContext);
  }
  
  private applyVariationPattern(message: string, seed: number, context: any): string {
    // 文体パターンの適用
    const tonePattern = TONE_PATTERNS.GENTLE_SUGGESTION[seed % 4];
    const timeExpression = this.getTimeExpression();
    
    // コンテキストに応じた調整
    return this.adjustForContext(message, context);
  }
  
  private getTimeExpression(): string {
    const hour = new Date().getHours();
    if (hour < 12) {
      return TEMPORAL_EXPRESSIONS.MORNING[0];
    } else {
      return TEMPORAL_EXPRESSIONS.EVENING[0];
    }
  }
  
  private adjustForContext(message: string, context: any): string {
    const questionCategory = context?.questionCategory as keyof typeof CONTEXT_ADJUSTMENTS.QUESTION_CATEGORY;
    const adjustment = questionCategory ? CONTEXT_ADJUSTMENTS.QUESTION_CATEGORY[questionCategory] : null;
    if (adjustment) {
      // コンテキストに応じた微調整を適用
      return message; // 実際の調整ロジックはここに実装
    }
    return message;
  }
}

export const messageVariationSystem = new MessageVariationSystem();