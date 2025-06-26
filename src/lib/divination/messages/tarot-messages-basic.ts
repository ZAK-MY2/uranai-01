// タロットメッセージ基本版（構文エラー回避）
// 完全版は自動生成システムで実装予定

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

// 大アルカナメッセージ（既存から移行）
export const MAJOR_ARCANA_MESSAGES: Record<string, TarotCardMessage> = {
  'the-fool': {
    uprightInterpretations: [
      '新しい冒険が始まる予感。純粋な心で一歩を踏み出す時が来ました',
      '既成概念にとらわれない自由な発想が、思わぬ幸運を引き寄せるでしょう'
    ],
    reversedInterpretations: [
      '慎重さが必要な時期。無謀な行動は避け、よく考えてから動きましょう',
      '現実を見つめ直し、地に足をつけた行動を心がけることが大切です'
    ],
    positionInterpretations: {
      past: ['過去の無邪気さや純粋さが、今のあなたの土台となっています'],
      present: ['今まさに新しいスタートラインに立っています'],
      future: ['新たな冒険があなたを待っています'],
      advice: ['心の声に従って、勇気を持って一歩踏み出してください'],
      obstacle: ['恐れや不安が新しい挑戦を妨げています'],
      outcome: ['純粋な気持ちで始めた冒険が、素晴らしい結果をもたらします'],
      innerSelf: ['内なる子どものような好奇心が蘇っています'],
      environment: ['周囲が新しい始まりを後押ししています'],
      hopes: ['自由で制約のない人生を望んでいます'],
      fears: ['失敗や批判を恐れています']
    },
    categoryInterpretations: {
      love: ['新しい恋愛の始まり。純粋な気持ちで相手と向き合って'],
      career: ['転職や新しいプロジェクトに挑戦する絶好のタイミング'],
      health: ['新しい健康習慣を始めるのに最適な時期'],
      finance: ['新しい投資や収入源の開拓に向いています'],
      spiritual: ['スピリチュアルな探求の新しい段階に入ります'],
      general: ['人生の新しいサイクルが始まる重要な時期']
    },
    timingMessages: {
      morning: ['朝の新鮮なエネルギーと共に、新しい一日を始めましょう'],
      afternoon: ['午後の活動的な時間に、新しいアイデアを実行に移して'],
      evening: ['夜の静けさの中で、明日への新しい計画を立てましょう'],
      weekly: ['今週は新しいことを始めるのに最適な期間です'],
      monthly: ['今月は人生の新しい章が始まる重要な月になります']
    },
    combinations: {
      withMajorArcana: {
        'the-magician': '新しい始まりと実現力の完璧な組み合わせ',
        'the-empress': '創造性と豊かさに満ちた新しいスタート'
      },
      withSameSuit: {},
      withCourtCards: {
        'page-of-cups': '純粋な感情と新しい始まりの美しい融合'
      }
    },
    poeticExpressions: [
      '崖っぷちに立つ若者、無限の可能性を背負って空に舞う',
      '白いバラを手に、未知なる世界への扉を開く冒険者'
    ],
    psychologicalInsights: [
      '新しい経験への開放性が高く、学習能力に優れています',
      '直感的な判断力と楽観的な世界観を持っています'
    ],
    practicalAdvice: [
      '計画しすぎず、直感に従って行動することが大切です',
      '新しい環境や人々との出会いを積極的に求めてください'
    ]
  }
  // 他の大アルカナは省略（既存のものを使用）
};

// 小アルカナ - ワンド（基本版）
export const WANDS_MESSAGES_BASIC: Record<string, TarotCardMessage> = {
  'ace-of-wands': {
    uprightInterpretations: [
      '創造的なエネルギーが爆発的に湧き上がる時。新しいプロジェクトの開始に最適',
      '情熱の炎が燃え上がり、行動への強い衝動を感じるでしょう'
    ],
    reversedInterpretations: [
      'エネルギーが分散し、焦点を絞れない状態。計画の見直しが必要',
      '創造力が枯渇気味。休息を取って内なる火を再び燃やして'
    ],
    positionInterpretations: {
      past: ['過去の情熱的な体験が現在の基盤となっています'],
      present: ['今こそ行動を起こすべき時です'],
      future: ['創造的なプロジェクトが成功します'],
      advice: ['情熱に従って積極的に行動してください'],
      obstacle: ['エネルギーの分散が妨げとなっています'],
      outcome: ['新しい創造的な成果を得られます'],
      innerSelf: ['内なる炎が燃え上がっています'],
      environment: ['創造性を支援する環境に恵まれています'],
      hopes: ['創造的な自己実現を望んでいます'],
      fears: ['エネルギーの枯渇を恐れています']
    },
    categoryInterpretations: {
      love: ['新しい恋愛の始まり。情熱的な関係が期待できます'],
      career: ['新しいプロジェクトや起業に最適なタイミング'],
      health: ['エネルギーレベルが高く、活力に満ちています'],
      finance: ['新しい収入源や投資機会が現れます'],
      spiritual: ['創造的なスピリチュアル実践が開花します'],
      general: ['新しいサイクルの始まりで、可能性が無限大です']
    },
    timingMessages: {
      morning: ['朝の力強いエネルギーで新しいことを始めましょう'],
      afternoon: ['午後の活動的な時間に創造的作業を'],
      evening: ['夜は明日のプロジェクトの準備を'],
      weekly: ['今週は新しい挑戦を始める最適な期間'],
      monthly: ['今月は創造的エネルギーが最高潮に達します']
    },
    combinations: {
      withMajorArcana: {
        'the-fool': '新しい始まりと創造的エネルギーの完璧な融合'
      },
      withSameSuit: {
        'two-of-wands': '計画と実行の完璧なバランス'
      },
      withCourtCards: {
        'king-of-wands': 'リーダーシップと創造性の強力な組み合わせ'
      }
    },
    poeticExpressions: [
      '雲から差し伸べられた手が、炎の杖を差し出している',
      '新しい創造の火種が、心の奥底で静かに燃え始める'
    ],
    psychologicalInsights: [
      '創造的な衝動と実行力が高いレベルで統合されています',
      '新しいアイデアを形にする能力に優れています'
    ],
    practicalAdvice: [
      '今すぐにでも新しいプロジェクトを開始してください',
      '創造的な活動に時間とエネルギーを投資しましょう'
    ]
  }
};

// 統合メッセージ（基本版）
export const ALL_TAROT_MESSAGES_BASIC: Record<string, TarotCardMessage> = {
  ...MAJOR_ARCANA_MESSAGES,
  ...WANDS_MESSAGES_BASIC
};

// ヘルパー関数
export function getTarotCardMessage(cardId: string): TarotCardMessage | null {
  return ALL_TAROT_MESSAGES_BASIC[cardId] || null;
}

export function selectTarotMessage(
  cardId: string,
  messageType: keyof TarotCardMessage,
  seed: number,
  subType?: string
): string {
  const cardMessages = getTarotCardMessage(cardId);
  if (!cardMessages) return '';
  
  let messages: string[] = [];
  
  switch (messageType) {
    case 'uprightInterpretations':
    case 'reversedInterpretations':
    case 'poeticExpressions':
    case 'psychologicalInsights':
    case 'practicalAdvice':
      messages = cardMessages[messageType];
      break;
    case 'positionInterpretations':
    case 'categoryInterpretations':
    case 'timingMessages':
      if (subType && cardMessages[messageType] && typeof cardMessages[messageType] === 'object') {
        const subMessages = (cardMessages[messageType] as any)[subType];
        if (subMessages && Array.isArray(subMessages)) {
          messages = subMessages;
        }
      }
      break;
    case 'combinations':
      return '';
  }
  
  if (messages.length === 0) return '';
  
  const index = Math.abs(seed) % messages.length;
  return messages[index];
}