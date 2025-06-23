// 占術モックデータ
export const mockDivinationData = {
  // 総合運勢スコア
  overallScore: 92,
  
  // 数秘術データ
  numerology: {
    lifePathNumber: 7,
    destinyNumber: 3,
    soulNumber: 9,
    personalityNumber: 5,
    maturityNumber: 1,
    birthdayNumber: 22,
    scores: {
      overall: 88,
      career: 92,
      love: 85,
      health: 90,
      wealth: 87
    },
    interpretation: {
      lifePathMeaning: "深い洞察力と精神性を持つ探求者",
      todaysFocus: "内なる声に従い、直感を信じて行動する日",
      advice: "瞑想や自然との触れ合いが幸運を引き寄せます"
    }
  },

  // タロットデータ
  tarot: {
    cards: {
      past: {
        name: "愚者",
        arcana: "major",
        number: 0,
        image: "fool",
        keywords: ["新しい始まり", "冒険", "無邪気さ"],
        interpretation: "過去において、新しい冒険への一歩を踏み出しました"
      },
      present: {
        name: "星",
        arcana: "major", 
        number: 17,
        image: "star",
        keywords: ["希望", "インスピレーション", "癒し"],
        interpretation: "現在、希望と癒しのエネルギーに包まれています"
      },
      future: {
        name: "世界",
        arcana: "major",
        number: 21,
        image: "world",
        keywords: ["完成", "成就", "統合"],
        interpretation: "近い将来、大きな成果と達成感を得るでしょう"
      }
    },
    overallMessage: "新しい旅路が実を結び、完全な成就へと向かっています"
  },

  // 西洋占星術データ
  astrology: {
    sunSign: "蠍座",
    moonSign: "魚座",
    risingSign: "獅子座",
    planets: {
      mercury: { sign: "射手座", house: 5, aspect: "トライン" },
      venus: { sign: "天秤座", house: 3, aspect: "セクスタイル" },
      mars: { sign: "牡羊座", house: 9, aspect: "コンジャンクション" },
      jupiter: { sign: "牡牛座", house: 10, aspect: "スクエア" },
      saturn: { sign: "水瓶座", house: 7, aspect: "オポジション" }
    },
    aspects: {
      favorable: ["太陽と木星のトライン", "金星と月のセクスタイル"],
      challenging: ["火星と土星のスクエア"]
    },
    todaysTransit: "月が第10ハウスを通過中 - キャリアに関する重要な気づきの時",
    interpretation: "情熱的な本質と直感的な感受性が調和し、カリスマ的な魅力を放っています"
  },

  // ルーン占いデータ
  runes: {
    drawn: [
      { name: "フェフ", meaning: "豊かさ", position: "正位置", element: "火" },
      { name: "ウルズ", meaning: "力", position: "正位置", element: "水" },
      { name: "アンスズ", meaning: "叡智", position: "逆位置", element: "風" }
    ],
    interpretation: "物質的豊かさと内なる力が高まっていますが、コミュニケーションには注意が必要です"
  },

  // 易経データ
  iChing: {
    hexagram: {
      number: 14,
      name: "火天大有",
      upperTrigram: "離（火）",
      lowerTrigram: "乾（天）",
      judgment: "大いなる所有。元いに亨る。",
      image: "火の天上に在るは大有なり。"
    },
    changingLines: [2, 5],
    interpretation: "豊かさと成功の時期。謙虚さを保ちながら、恵みを分かち合うことが大切です"
  },

  // 九星気学データ
  nineStarKi: {
    mainStar: "三碧木星",
    monthStar: "七赤金星", 
    yearStar: "一白水星",
    direction: {
      favorable: ["東", "南東"],
      unfavorable: ["西", "北西"]
    },
    element: "木",
    todaysEnergy: "発展と成長のエネルギーが強い日",
    advice: "新しいプロジェクトの開始に最適"
  },

  // 風水データ
  fengShui: {
    bagua: {
      career: { element: "水", color: "黒", enhancement: "噴水や水槽" },
      wealth: { element: "木", color: "緑", enhancement: "観葉植物" },
      fame: { element: "火", color: "赤", enhancement: "照明" },
      love: { element: "土", color: "ピンク", enhancement: "ペアの装飾品" },
      health: { element: "土", color: "黄", enhancement: "陶器" }
    },
    flyingStars: {
      prosperity: 8,
      relationship: 4,
      career: 6
    },
    advice: "北東エリアに水晶を置くと金運アップ"
  },

  // カバラ数秘術データ
  kabbalah: {
    treeOfLife: {
      currentSephirah: "ティファレト（美）",
      path: 13,
      element: "太陽"
    },
    hebrewLetter: "ヌン",
    angelicInfluence: "大天使ラファエル",
    interpretation: "調和とバランスの中心にいます。美と真実を追求する時期です"
  },

  // インド占星術データ
  vedicAstrology: {
    nakshatra: "ローヒニー",
    moonMansion: 4,
    planetaryPeriod: {
      mahaDasha: "金星期",
      antarDasha: "月期",
      yearsRemaining: 3.5
    },
    yogas: ["ラージャ・ヨーガ", "ダナ・ヨーガ"],
    remedies: ["真珠を身につける", "月曜日に白い服を着る"],
    interpretation: "創造性と美的センスが高まる幸運期"
  },

  // ケルト占星術データ
  celticAstrology: {
    treeSign: "ナナカマド",
    animal: "蝶",
    color: "灰緑色",
    gemstone: "オパール",
    element: "火",
    qualities: ["情熱的", "カリスマ的", "理想主義的"],
    interpretation: "変容と再生の時期。古いものを手放し、新しい自分を受け入れる準備ができています"
  },

  // 統合分析
  integration: {
    dominantElement: "火",
    dominantNumber: 7,
    keyThemes: ["精神的成長", "創造性", "変容", "成功"],
    synchronicities: [
      "複数の占術で「新しい始まり」のテーマが出現",
      "火のエレメントが強く、情熱と行動力が高まっている",
      "数字の7が繰り返し現れ、内省と洞察の重要性を示唆"
    ],
    guidanceMessage: "今は内なる声に従い、情熱を持って新しい道を切り開く絶好の時期です。直感を信じ、恐れずに前進してください。宇宙はあなたの成功を全力でサポートしています。",
    actionSteps: [
      "毎朝10分の瞑想で直感力を高める",
      "創造的なプロジェクトに時間を投資する",
      "東または南東の方角で重要な決断をする",
      "月光浴で感情のバランスを整える"
    ]
  }
};

// 日々の運勢変動をシミュレート
export function getDailyVariation(baseScore: number): number {
  const variation = (Math.random() - 0.5) * 10; // -5 to +5
  return Math.max(0, Math.min(100, baseScore + variation));
}

// 時間帯による運勢変動
export function getHourlyEnergy(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 8) return "朝の清々しいエネルギー";
  if (hour >= 8 && hour < 12) return "活動的なエネルギー";
  if (hour >= 12 && hour < 15) return "安定したエネルギー";
  if (hour >= 15 && hour < 18) return "創造的なエネルギー";
  if (hour >= 18 && hour < 22) return "内省的なエネルギー";
  return "休息と再生のエネルギー";
}