// 占星術メッセージデータベース
// 天体・星座・ハウス・アスペクトの豊富なメッセージパターン
// 数秘術・タロットと同等の商用グレード品質

export interface AstrologyMessageStructure {
  // 天体と星座の組み合わせ解釈
  planetInSign: {
    general: string[];           // 基本的な解釈（10パターン以上）
    positive: string[];          // ポジティブ側面（5パターン以上）
    challenging: string[];       // チャレンジング側面（5パターン以上）
  };
  
  // ハウス位置での解釈
  planetInHouse: {
    meaning: string[];           // ハウスでの意味（8パターン以上）
    expression: string[];        // 表現方法（5パターン以上）
    growth: string[];           // 成長の方向性（5パターン以上）
  };
  
  // 質問カテゴリ別の解釈
  categoryInterpretations: {
    love: string[];             // 恋愛に関する解釈
    career: string[];           // 仕事に関する解釈
    health: string[];           // 健康に関する解釈
    finance: string[];          // 金運に関する解釈
    spiritual: string[];        // 精神面に関する解釈
    general: string[];          // 総合運に関する解釈
  };
  
  // 時期別メッセージ
  timingMessages: {
    daily: string[];            // 日々のメッセージ
    weekly: string[];           // 週間メッセージ
    monthly: string[];          // 月間メッセージ
    yearly: string[];           // 年間メッセージ
    transit: string[];          // トランジット期間
  };
  
  // アスペクト解釈
  aspectInterpretations: {
    harmonious: string[];       // 調和的アスペクト（合、60度、120度）
    challenging: string[];      // 困難なアスペクト（90度、180度）
    growth: string[];          // 成長のためのアドバイス
  };
  
  // 詩的表現（石井ゆかり風）
  poeticExpressions: string[];
  
  // 心理学的解釈（鏡リュウジ風）
  psychologicalInsights: string[];
  
  // 実践的アドバイス
  practicalAdvice: string[];
}

// 天体別メッセージデータベース
export const PLANET_MESSAGES: Record<string, Record<string, AstrologyMessageStructure>> = {
  sun: {
    // 太陽 × 12星座の組み合わせ
    '牡羊座': {
      planetInSign: {
        general: [
          'あなたは生まれながらのリーダーとして、新しい道を切り開いていく力を持っています',
          '積極的で勇敢な性格により、困難な状況でも前向きに取り組むことができます',
          '独立心が強く、自分の信念に従って行動する強い意志の持ち主です',
          '競争心が旺盛で、常に向上心を持って目標に向かって進んでいきます',
          'エネルギッシュで行動力があり、周囲の人々を鼓舞する存在です',
          '開拓精神に富み、誰も歩いたことのない新しい分野に挑戦する勇気があります',
          '直感的で素早い判断力により、チャンスを逃さず掴むことができます',
          '熱意と情熱により、自分が信じることに全力で取り組みます',
          '子どものような純粋さと好奇心で、常に新しい経験を求めています',
          '正義感が強く、弱い者を守る騎士のような精神を持っています'
        ],
        positive: [
          'リーダーシップを発揮し、チームや組織を成功に導く力があります',
          '新しいプロジェクトや企画の立ち上げに最適な才能を持っています',
          '困難に直面しても諦めず、最後まで戦い抜く強さがあります',
          '創造性と革新性により、既存の枠を超えた価値を生み出せます',
          '自信と勇気により、他者にポジティブな影響を与えることができます'
        ],
        challenging: [
          '性急さにより、慎重な検討を怠ってしまうことがあります',
          '自我が強すぎて、他者の意見を聞き入れることが困難な場合があります',
          '短気な面があり、忍耐力を必要とする状況で苦労することがあります',
          '競争心が強すぎて、協調性を欠いてしまうことがあります',
          '衝動的な行動により、後で後悔する結果を招くことがあります'
        ]
      },
      planetInHouse: {
        meaning: [
          '第1ハウス：強烈な個性と存在感で、どこにいても注目を集める人',
          '第2ハウス：価値観や才能を積極的に活用し、経済的成功を追求',
          '第3ハウス：コミュニケーションに積極性があり、影響力のある発言をする',
          '第4ハウス：家族や家庭において主導権を握り、家族を守るリーダー',
          '第5ハウス：創造性と自己表現において、独創的で大胆な作品を生む',
          '第6ハウス：仕事や健康管理において、積極的で改革的なアプローチを取る',
          '第7ハウス：パートナーシップでリーダーシップを発揮し、関係を主導',
          '第8ハウス：変容と再生において、勇敢に深い変化に取り組む'
        ],
        expression: [
          '強いリーダーシップと決断力を通じて自己を表現します',
          '新しい挑戦や冒険を通じて個性を発揮します',
          '競争や勝負の場面で真の力を発揮します',
          '創造的なプロジェクトにおいて革新的なアイデアを提示します',
          '困難な状況において不屈の精神力を示します'
        ],
        growth: [
          '他者との協調性を学ぶことで、より大きな成果を得られます',
          '忍耐力を身につけることで、長期的な成功を築けます',
          '感情的な知性を高めることで、人間関係が改善されます',
          '謙虚さを学ぶことで、より多くの人から尊敬されるでしょう',
          '計画性を身につけることで、目標達成がより確実になります'
        ]
      },
      categoryInterpretations: {
        love: [
          '恋愛において積極的で情熱的なアプローチを取ります',
          'パートナーに対してリーダーシップを発揮し、関係を主導したがります',
          '一目惚れや運命的な出会いを体験しやすい傾向があります',
          '恋愛ゲームを楽しみ、追いかける過程にスリルを感じます',
          '相手への愛情表現が直接的で分かりやすく、隠し事を好みません'
        ],
        career: [
          '起業家精神に富み、自分のビジネスを立ち上げる才能があります',
          'リーダーシップポジションで真価を発揮し、組織を牽引します',
          '新規事業の開拓や市場開拓において優れた能力を示します',
          'セールスや営業分野で、積極性と説得力を活かして成功します',
          '競争の激しい業界で、闘争心を武器に頭角を現します'
        ],
        health: [
          '活動的で体力に恵まれ、スポーツや運動を好みます',
          '頭部や顔面のケアに特に注意を払う必要があります',
          'ストレス発散のために定期的な運動が重要です',
          '怪我をしやすい傾向があるため、安全対策を怠らないでください',
          '心臓血管系の健康維持のため、適度な運動と休息が必要です'
        ],
        finance: [
          '積極的な投資や事業投資により、大きな利益を得る可能性があります',
          '新しい金融商品や投資機会に敏感で、先行者利益を得やすい',
          '起業や独立により、大きな収入源を築く可能性があります',
          '短期的な利益を求める傾向があり、長期投資の重要性を学ぶ必要',
          '金銭管理において計画性を身につけることで、より安定した財政を築けます'
        ],
        spiritual: [
          '行動を通じて精神的成長を達成し、実践的なスピリチュアリティを追求',
          '新しい精神的な道や教えに積極的に取り組む探求者の性質',
          '瞑想よりも動的な霊的実践（ヨガ、武道など）に向いています',
          '精神的なリーダーシップを発揮し、他者を導く役割を担います',
          '直感と行動力を組み合わせて、霊的な使命を果たします'
        ],
        general: [
          '人生において常に新しい挑戦を求め、成長し続ける存在です',
          '強い意志力と行動力により、目標を確実に達成していきます',
          '困難な状況でも前向きさを失わず、周囲に希望を与えます',
          '独立性と自由を重視し、自分らしい生き方を貫きます',
          'エネルギッシュで活力に満ち、人生を最大限に楽しみます'
        ]
      },
      timingMessages: {
        daily: [
          '今日は新しいことを始めるのに最適な日です。積極的に行動を',
          '朝のエネルギーを活かして、重要な決断を下しましょう',
          'リーダーシップを発揮する機会が訪れるので、自信を持って'
        ],
        weekly: [
          '今週は新しいプロジェクトや企画をスタートさせる絶好の時期',
          '積極的な姿勢で challenges に取り組むことで、大きな成果が',
          '競争や勝負事において、あなたの真価が発揮されるでしょう'
        ],
        monthly: [
          '今月は自己実現と個人的な目標達成に最適な期間です',
          '新しい分野への挑戦により、隠れた才能が開花するかもしれません',
          'リーダーシップの機会が増え、影響力を拡大できる時期です'
        ],
        yearly: [
          '今年は人生の新しいサイクルが始まる重要な転換点です',
          '自分らしさを最大限に発揮し、独自の道を歩む年になります',
          '勇気ある決断により、長年の夢を現実化できる可能性があります'
        ],
        transit: [
          '火星のエネルギーが高まり、行動力と決断力が増している時期',
          '新月の影響で、新しい始まりに向けた準備が整っています',
          '太陽のトランジットにより、自己表現力が最高潮に達しています'
        ]
      },
      aspectInterpretations: {
        harmonious: [
          '他の天体との調和により、リーダーシップがより効果的に発揮されます',
          '協調性と積極性のバランスが取れ、理想的な人間関係を築けます',
          'エネルギーが建設的な方向に向かい、大きな成果を達成できます'
        ],
        challenging: [
          '過度な競争心や自我により、人間関係に摩擦が生じる可能性',
          '性急な判断により、重要な機会を逃してしまうリスクがあります',
          '他者との衝突を通じて、より深い自己理解を得る機会となります'
        ],
        growth: [
          '他者の意見に耳を傾けることで、より賢明なリーダーになれます',
          '忍耐力を養うことで、長期的な成功を築くことができます',
          '感情的な成熟により、より影響力のある存在となるでしょう'
        ]
      },
      poeticExpressions: [
        '朝日のように昇る魂、新しい地平線を照らし続ける',
        '炎の戦士として、正義の剣を高々と掲げて',
        '羊飼いの星座が示すように、群れを導く光となって',
        '春の最初の花のように、勇敢に世界に芽吹いていく',
        '赤い情熱の血潮が、心臓から全身に生命力を送り続ける'
      ],
      psychologicalInsights: [
        '自己効力感が高く、困難な状況でも「できる」という信念を保持',
        'アンガーマネジメントを学ぶことで、情熱をより建設的に活用可能',
        '競争心は進化の産物で、生存と成長のための重要な原動力',
        '即座の満足よりも延期された報酬の価値を理解することが成長の鍵',
        'アサーティブネスを身につけることで、より効果的なコミュニケーションが可能'
      ],
      practicalAdvice: [
        '重要な決定の前に、24時間の冷却期間を設けることを習慣にして',
        '週に一度は他者の意見を積極的に求め、視野を広げましょう',
        '身体的な運動を日課にし、エネルギーを建設的に発散させて',
        '長期目標を設定し、短期の成果と照らし合わせながら進捗確認を',
        'チームワークを重視するプロジェクトに積極的に参加してみて'
      ]
    }
    // 他の11星座も同様の構造で実装
  }
  // 他の9天体（月、水星、金星、火星、木星、土星、天王星、海王星、冥王星）も同様
};

// アスペクト専用メッセージ
export const ASPECT_MESSAGES: Record<string, Record<string, string[]>> = {
  conjunction: {
    'sun-moon': [
      '意識と無意識が統合され、内面の調和が取れた状態です',
      '自己実現への道筋が明確で、一貫した人格を保持しています',
      '感情と理性のバランスが良く、安定した判断力を持っています'
    ],
    'sun-mercury': [
      '自己表現力と知的能力が高度に統合されています',
      '創造的な思考力により、独創的なアイデアを生み出せます',
      'コミュニケーション能力が高く、人を惹きつける話術を持っています'
    ]
    // 他の天体組み合わせ
  },
  trine: {
    'sun-jupiter': [
      '楽観的で寛大な性格により、多くの人から愛されます',
      '成功と幸運に恵まれ、人生において大きな達成を得られます',
      '精神的な成長と物質的な豊かさの両方を手にすることができます'
    ]
    // 他の調和的アスペクト
  },
  square: {
    'sun-saturn': [
      '責任感と制限の中で、真の強さを身につけていきます',
      '困難を乗り越えることで、不屈の精神力を獲得します',
      '時間をかけて着実に目標を達成する忍耐力があります'
    ]
    // 他の困難なアスペクト
  }
  // sextile, opposition も同様
};

// ハウス専用メッセージ
export const HOUSE_MESSAGES: Record<number, {
  meaning: string[];
  themes: string[];
  development: string[];
}> = {
  1: {
    meaning: [
      '第1ハウスは自己同一性と個人的なアイデンティティを表します',
      'あなたが世界に向けて見せる顔と、第一印象を司る領域です',
      '生まれ持った性格と、人生における基本的なアプローチを示します'
    ],
    themes: ['自己表現', '個性', '外見', 'アイデンティティ', '第一印象'],
    development: [
      '自分らしさを恐れずに表現することで、真の魅力が輝きます',
      '他者の目を気にしすぎず、authentic な自己でいることが大切',
      '外見的な魅力と内面的な美しさの調和を目指しましょう'
    ]
  }
  // 第2〜12ハウスも同様
};

// メッセージ取得ヘルパー関数
export function getAstrologyMessage(
  planet: string,
  sign: string,
  messageType: keyof AstrologyMessageStructure,
  seed: number,
  subType?: string
): string {
  const planetData = PLANET_MESSAGES[planet];
  if (!planetData || !planetData[sign]) return '';
  
  const signData = planetData[sign];
  let messages: string[] = [];
  
  switch (messageType) {
    case 'planetInSign':
      if (subType && signData.planetInSign[subType as keyof typeof signData.planetInSign]) {
        messages = signData.planetInSign[subType as keyof typeof signData.planetInSign];
      } else {
        messages = signData.planetInSign.general;
      }
      break;
    case 'categoryInterpretations':
      if (subType && signData.categoryInterpretations[subType as keyof typeof signData.categoryInterpretations]) {
        messages = signData.categoryInterpretations[subType as keyof typeof signData.categoryInterpretations];
      }
      break;
    case 'poeticExpressions':
    case 'psychologicalInsights':
    case 'practicalAdvice':
      messages = signData[messageType];
      break;
  }
  
  if (messages.length === 0) return '';
  
  const index = Math.abs(seed) % messages.length;
  return messages[index];
}

export function getAspectMessage(aspect: string, planet1: string, planet2: string): string {
  const aspectData = ASPECT_MESSAGES[aspect];
  if (!aspectData) return '';
  
  const combination = `${planet1}-${planet2}`;
  const reverseCombo = `${planet2}-${planet1}`;
  
  return aspectData[combination]?.[0] || aspectData[reverseCombo]?.[0] || '';
}

export function getHouseMessage(houseNumber: number, messageType: 'meaning' | 'themes' | 'development'): string {
  const houseData = HOUSE_MESSAGES[houseNumber];
  if (!houseData) return '';
  
  if (messageType === 'themes') {
    return houseData.themes.join('、');
  }
  
  const messages = houseData[messageType];
  return messages[0] || '';
}