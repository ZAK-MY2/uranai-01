// 手相データ

export interface PalmLineData {
  name: string;
  position: string;
  meaning: string;
  characteristics: {
    clear: string;
    faint: string;
    broken: string;
    chained: string;
    deep: string;
  };
  length: {
    short: string;
    medium: string;
    long: string;
  };
}

export const PalmLines: PalmLineData[] = [
  {
    name: '生命線',
    position: '親指の付け根から手首に向かって弧を描く線',
    meaning: '生命力、健康状態、人生の変化を表す最も重要な線の一つ',
    characteristics: {
      clear: '健康で活力に満ちた人生。病気に対する抵抗力が強い。',
      faint: '体力がやや不足気味。健康管理に注意が必要。',
      broken: '人生に大きな変化や健康上の問題がある可能性。',
      chained: '体調の浮き沈みが激しい。ストレスに弱い傾向。',
      deep: '非常に強い生命力。困難を乗り越える力がある。'
    },
    length: {
      short: '人生前半で大きな変化。早めの健康管理が重要。',
      medium: '平均的な生命力。バランスの取れた人生。',
      long: '長寿の相。晩年まで活力を保つ。'
    }
  },
  {
    name: '頭脳線',
    position: '人差し指と親指の間から手のひらを横切る線',
    meaning: '知性、思考パターン、判断力、学習能力を示す',
    characteristics: {
      clear: '明晰な頭脳。論理的思考と集中力に優れる。',
      faint: '直感的な思考。感情に左右されやすい。',
      broken: '思考の転換点。人生観や価値観の大きな変化。',
      chained: '心配性。優柔不断な傾向がある。',
      deep: '深い洞察力。研究や学術分野での成功。'
    },
    length: {
      short: '実践的な思考。行動力がある。',
      medium: 'バランスの取れた判断力。',
      long: '慎重で分析的。学者や研究者に向いている。'
    }
  },
  {
    name: '感情線',
    position: '小指の下から人差し指に向かって横切る線',
    meaning: '感情表現、恋愛傾向、人間関係の特徴を表す',
    characteristics: {
      clear: '感情表現が豊か。素直で開放的な性格。',
      faint: '感情を内に秘める。控えめな愛情表現。',
      broken: '恋愛関係での挫折や別れ。感情の起伏が激しい。',
      chained: '複雑な恋愛関係。感情の混乱が起こりやすい。',
      deep: '深い愛情を持つ。一途で情熱的。'
    },
    length: {
      short: '理性的な愛情。感情より論理を重視。',
      medium: '適度な感情表現。バランスの取れた恋愛。',
      long: '感情豊か。芸術的才能がある。'
    }
  },
  {
    name: '運命線',
    position: '手首から中指に向かって縦に走る線',
    meaning: '人生の方向性、キャリア、社会的地位を示す',
    characteristics: {
      clear: '明確な人生目標。安定したキャリア。',
      faint: '自由な生き方。型にはまらない人生。',
      broken: 'キャリアの転換期。職業や環境の大きな変化。',
      chained: '努力が必要な時期。障害を乗り越える必要。',
      deep: '強い意志力。大きな成功を収める可能性。'
    },
    length: {
      short: '自立が早い。若いうちから自分の道を歩む。',
      medium: '段階的な成長。中年期に安定。',
      long: '生涯にわたって活躍。晩年まで現役。'
    }
  },
  {
    name: '太陽線',
    position: '薬指の下から手のひらに向かって縦に走る線',
    meaning: '成功、名声、芸術的才能、創造性を表す',
    characteristics: {
      clear: '成功運に恵まれる。人気や名声を得る可能性。',
      faint: '控えめな成功。地道な努力が実る。',
      broken: '成功への道のりに困難。挫折からの復活。',
      chained: '努力が必要。継続的な取り組みで成功。',
      deep: '大きな成功と名声。芸術分野での才能。'
    },
    length: {
      short: '晩年の成功。人生後半で花開く。',
      medium: '中年期からの成功。実力が認められる。',
      long: '若いうちから才能を発揮。継続的な成功。'
    }
  },
  {
    name: '水星線',
    position: '小指の下から手のひらに向かって縦に走る線',
    meaning: 'コミュニケーション能力、商才、健康状態を示す',
    characteristics: {
      clear: '優れた話術。商売の才能がある。',
      faint: '控えめなコミュニケーション。誠実な性格。',
      broken: 'コミュニケーションでの誤解。健康への注意。',
      chained: '話し方に工夫が必要。慎重な言動を心がける。',
      deep: '説得力がある。営業や交渉に長けている。'
    },
    length: {
      short: '実用的なコミュニケーション。要点をつかむのが上手。',
      medium: 'バランスの取れた話術。多くの人に愛される。',
      long: '雄弁な話し手。教育や講演に向いている。'
    }
  },
  {
    name: '結婚線',
    position: '小指の付け根の側面にある短い横線',
    meaning: '結婚、恋愛関係、パートナーシップを表す',
    characteristics: {
      clear: '幸福な結婚。安定したパートナーシップ。',
      faint: '恋愛関係はあるが結婚には慎重。',
      broken: '結婚生活での困難。離婚や別れの可能性。',
      chained: '複雑な恋愛関係。三角関係の可能性。',
      deep: '深い愛情による結婚。生涯のパートナー。'
    },
    length: {
      short: '短い恋愛関係。複数の恋愛を経験。',
      medium: '適切な時期の結婚。平凡だが幸せな結婚。',
      long: '長く続く愛情。晩年まで仲の良い夫婦。'
    }
  },
  {
    name: '健康線',
    position: '手首から小指に向かって斜めに走る線',
    meaning: '健康状態、体質、病気への抵抗力を示す',
    characteristics: {
      clear: '健康に問題なし。丈夫な体質。',
      faint: 'やや虚弱体質。健康管理が重要。',
      broken: '健康上の問題が起こる可能性。定期検診を。',
      chained: '慢性的な体調不良。生活習慣の改善が必要。',
      deep: '病気に対する強い抵抗力。回復力がある。'
    },
    length: {
      short: '若いうちの健康問題。早めのケアで改善。',
      medium: '中年期の健康管理が重要。',
      long: '生涯にわたる健康への注意。予防医学を。'
    }
  }
];

export interface MountData {
  name: string;
  location: string;
  meaning: string;
  influence: string;
  characteristics: string[];
  development: {
    flat: string;
    normal: string;
    prominent: string;
    very_prominent: string;
  };
}

export const Mounts: MountData[] = [
  {
    name: '金星丘',
    location: '親指の付け根の膨らみ',
    meaning: '愛情、情熱、生命力、肉体的エネルギーを司る',
    influence: '恋愛運、家族愛、健康状態に影響',
    characteristics: ['愛情深い', '情熱的', '社交的', '生命力旺盛'],
    development: {
      flat: '感情表現が控えめ。愛情はあるが表に出しにくい。',
      normal: 'バランスの取れた愛情表現。健全な人間関係。',
      prominent: '非常に愛情深い。情熱的で魅力的。',
      very_prominent: '愛情過多。嫉妬深く、感情的になりやすい。'
    }
  },
  {
    name: '木星丘',
    location: '人差し指の付け根',
    meaning: '野心、リーダーシップ、指導力、向上心を表す',
    influence: '社会的地位、権力、成功運に影響',
    characteristics: ['野心的', 'リーダーシップ', '向上心', '正義感'],
    development: {
      flat: '野心に欠ける。消極的で満足しやすい。',
      normal: '適度な向上心。バランスの取れたリーダーシップ。',
      prominent: '強い野心を持つ。優れた指導者になる素質。',
      very_prominent: '野心過度。独裁的になりやすい。'
    }
  },
  {
    name: '土星丘',
    location: '中指の付け根',
    meaning: '責任感、忍耐力、慎重さ、運命を司る',
    influence: '人生の困難、試練、成熟度に影響',
    characteristics: ['責任感', '忍耐力', '慎重', '真面目'],
    development: {
      flat: '責任感に欠ける。楽観的すぎる傾向。',
      normal: '適度な責任感。バランスの取れた性格。',
      prominent: '非常に責任感が強い。信頼できる人物。',
      very_prominent: '過度に心配性。悲観的になりやすい。'
    }
  },
  {
    name: '太陽丘',
    location: '薬指の付け根',
    meaning: '芸術性、創造力、成功、名声を表す',
    influence: '芸術的才能、人気、成功運に影響',
    characteristics: ['芸術的', '創造的', '明朗', '人気'],
    development: {
      flat: '芸術的才能に欠ける。地味な人生。',
      normal: '適度な創造力。バランスの取れた才能。',
      prominent: '優れた芸術的才能。成功と名声を得る。',
      very_prominent: '才能過多。自己顕示欲が強すぎる。'
    }
  },
  {
    name: '水星丘',
    location: '小指の付け根',
    meaning: 'コミュニケーション、商才、知性、機転を司る',
    influence: 'ビジネス運、交渉力、学習能力に影響',
    characteristics: ['コミュニケーション力', '商才', '機転', '適応力'],
    development: {
      flat: 'コミュニケーションが苦手。商才に欠ける。',
      normal: '適度な話術。バランスの取れた交渉力。',
      prominent: '優れた話術と商才。ビジネスで成功。',
      very_prominent: 'おしゃべり過ぎ。時に嘘をつく傾向。'
    }
  },
  {
    name: '月丘',
    location: '小指側の手首近くの膨らみ',
    meaning: '想像力、直感、感受性、潜在意識を表す',
    influence: '芸術的感性、霊感、夢想力に影響',
    characteristics: ['想像力豊か', '直感的', '感受性', 'ロマンチック'],
    development: {
      flat: '想像力に欠ける。現実的すぎる。',
      normal: '適度な想像力。バランスの取れた感性。',
      prominent: '豊かな想像力と直感。芸術的才能。',
      very_prominent: '現実逃避的。夢想に耽りすぎる。'
    }
  },
  {
    name: '火星丘（第一火星丘）',
    location: '親指と人差し指の間',
    meaning: '勇気、積極性、闘争心、行動力を司る',
    influence: '勇気、挑戦精神、競争力に影響',
    characteristics: ['勇敢', '積極的', '行動力', '競争心'],
    development: {
      flat: '消極的。勇気に欠ける。',
      normal: '適度な勇気。バランスの取れた行動力。',
      prominent: '非常に勇敢。困難に立ち向かう力。',
      very_prominent: '攻撃的。短気で喧嘩っ早い。'
    }
  },
  {
    name: '火星丘（第二火星丘）',
    location: '小指側の中央部',
    meaning: '忍耐力、持久力、自制心、防御力を表す',
    influence: '忍耐力、継続力、精神的強さに影響',
    characteristics: ['忍耐力', '持久力', '自制心', '粘り強さ'],
    development: {
      flat: '忍耐力に欠ける。すぐに諦めやすい。',
      normal: '適度な忍耐力。バランスの取れた持久力。',
      prominent: '非常に忍耐強い。困難を乗り越える力。',
      very_prominent: '頑固すぎ。融通が利かない。'
    }
  }
];

export interface FingerCharacteristicData {
  meaning: string;
  length: {
    short: string;
    normal: string;
    long: string;
  };
  shape: {
    pointed: string;
    square: string;
    spatulate: string;
    conic: string;
  };
  flexibility: {
    stiff: string;
    normal: string;
    flexible: string;
  };
}

export const FingerCharacteristics: Record<string, FingerCharacteristicData> = {
  thumb: {
    meaning: '意志力、論理性、リーダーシップを表す最も重要な指',
    length: {
      short: '意志力がやや弱い。他人に流されやすい。',
      normal: 'バランスの取れた意志力。適度な自立性。',
      long: '強い意志力。リーダーシップがある。'
    },
    shape: {
      pointed: '理想主義的。芸術的感性がある。',
      square: '実用的。現実的な判断ができる。',
      spatulate: '行動力がある。独創的なアイデア。',
      conic: 'バランスが良い。適応力がある。'
    },
    flexibility: {
      stiff: '頑固。自分の意見を曲げない。',
      normal: '適度な柔軟性。バランスの取れた性格。',
      flexible: '柔軟性がある。適応力が高い。'
    }
  },
  index: {
    meaning: '野心、プライド、指導力、自信を表す指',
    length: {
      short: '謙虚。野心に欠けるが協調性がある。',
      normal: '適度な自信。バランスの取れたプライド。',
      long: '強い野心とプライド。リーダーになりたがる。'
    },
    shape: {
      pointed: '理想を追求する。精神的なリーダー。',
      square: '実践的なリーダー。組織運営が上手。',
      spatulate: '行動的なリーダー。革新的な考え。',
      conic: '調和を重視するリーダー。人望がある。'
    },
    flexibility: {
      stiff: '頑固なリーダー。独断専行しがち。',
      normal: 'バランスの取れたリーダーシップ。',
      flexible: '柔軟なリーダー。チームワークを重視。'
    }
  },
  middle: {
    meaning: '責任感、慎重さ、バランス感覚を表す指',
    length: {
      short: '責任感に欠ける。楽観的すぎる。',
      normal: '適度な責任感。バランスの取れた判断。',
      long: '非常に責任感が強い。慎重すぎる面も。'
    },
    shape: {
      pointed: '理想的な責任感。精神的な成熟。',
      square: '実務的な責任感。確実な仕事ぶり。',
      spatulate: '行動的な責任感。実践で示す。',
      conic: '調和のとれた責任感。周囲と協調。'
    },
    flexibility: {
      stiff: '融通が利かない。規則に厳格。',
      normal: 'バランスの取れた柔軟性。',
      flexible: '状況に応じて判断を変える。'
    }
  },
  ring: {
    meaning: '芸術性、創造力、美的センス、感情を表す指',
    length: {
      short: '芸術的才能に欠ける。実用性を重視。',
      normal: '適度な芸術的感性。バランスが良い。',
      long: '強い芸術的才能。美的センスが優れている。'
    },
    shape: {
      pointed: '純粋な芸術家タイプ。理想を追求。',
      square: '実用的な芸術。商業的センスもある。',
      spatulate: '革新的な芸術。新しいスタイルを創造。',
      conic: '調和のとれた美的センス。万人受けする。'
    },
    flexibility: {
      stiff: '芸術的なこだわりが強い。妥協しない。',
      normal: 'バランスの取れた芸術性。',
      flexible: '様々なスタイルに対応できる。'
    }
  },
  little: {
    meaning: 'コミュニケーション、表現力、社交性を表す指',
    length: {
      short: 'コミュニケーションが苦手。内向的。',
      normal: '適度な社交性。バランスの取れた表現力。',
      long: '優れたコミュニケーション能力。社交的。'
    },
    shape: {
      pointed: '繊細な表現力。文学的才能。',
      square: '実用的な表現力。ビジネストーク。',
      spatulate: '力強い表現力。説得力がある。',
      conic: '調和のとれた表現力。多くの人に愛される。'
    },
    flexibility: {
      stiff: '表現が硬い。形式的な話し方。',
      normal: 'バランスの取れた表現力。',
      flexible: '場に応じた表現ができる。'
    }
  }
};