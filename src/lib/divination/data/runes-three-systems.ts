/**
 * ルーン文字3システム完全データセット
 * 
 * エルダーフサルク・ヤンガーフサルク・アングロサクソンフソルク
 * 歴史的正確性とモダン解釈の統合
 */

// ルーンの基本型定義
export interface Rune {
  symbol: string;
  name: string;
  transliteration: string;
  meaning: string;
  keywords: string[];
  element?: string;
  aett?: number; // エルダーフサルクの場合
  sound?: string;
  
  interpretations: {
    upright: {
      general: string;
      love: string;
      career: string;
      spirituality: string;
    };
    reversed: {
      general: string;
      love: string;
      career: string;
      spirituality: string;
    };
  };
  
  psychological: {
    jungianAspect: string;
    archetype: string;
    individuation: string;
    shadowWork: string;
  };
  
  mythological: {
    deity?: string;
    symbol: string;
    story: string;
    cosmology: string;
  };
  
  historical: {
    period: string;
    usage: string;
    inscription: string;
  };
}

// ルーンシステムの型定義
export interface RuneSystem {
  name: string;
  period: string;
  runeCount: number;
  description: string;
  culturalContext: string;
  runes: Rune[];
}

// エルダーフサルク（24ルーン、150-800年）
export const elderFuthark: RuneSystem = {
  name: "Elder Futhark",
  period: "150-800 CE",
  runeCount: 24,
  description: "最古で最も完全なルーン文字体系。ゲルマン民族の魔術と占いに使用。",
  culturalContext: "北欧・ゲルマン文化圏、シャーマニズム、オーディン信仰",
  runes: [
    // フレイルのエット（Freyr's Aett）
    {
      symbol: "ᚠ",
      name: "Fehu",
      transliteration: "f",
      meaning: "家畜・富・財産",
      keywords: ["豊かさ", "成功", "新しい始まり", "創造力", "エネルギー"],
      element: "火",
      aett: 1,
      sound: "f",
      interpretations: {
        upright: {
          general: "物質的な豊かさと精神的な富が訪れます。新しいプロジェクトに投資する時期です。",
          love: "関係に新しい活力が注がれます。愛情や感情を惜しみなく表現しましょう。",
          career: "収入の増加や昇進の可能性があります。才能を活かして財を築く時です。",
          spirituality: "精神的な豊かさに目覚める時期。内なる富を外に表現しましょう。"
        },
        reversed: {
          general: "財政的な問題や損失に注意。欲張りすぎると失敗します。",
          love: "関係での取り合いや嫉妬に要注意。与えることを忘れないで。",
          career: "収入源に問題が生じる可能性。浪費や投資ミスに気をつけて。",
          spirituality: "物質主義に陥っている状態。真の価値を見つめ直しましょう。"
        }
      },
      psychological: {
        jungianAspect: "創造的エネルギーと豊穣性",
        archetype: "創造者・提供者",
        individuation: "物質と精神のバランスを学ぶ段階",
        shadowWork: "貪欲さと所有欲への対処"
      },
      mythological: {
        deity: "フレイル（豊穣神）",
        symbol: "野生の雄牛の角",
        story: "富と豊穣の神フレイルが人間に農業と牧畜を教えた",
        cosmology: "ミッドガルドでの物質的創造"
      },
      historical: {
        period: "2-8世紀",
        usage: "商取引の記録、護符",
        inscription: "スウェーデン・ヴィンマーセ石碑"
      }
    },
    {
      symbol: "ᚢ",
      name: "Uruz",
      transliteration: "u",
      meaning: "野生の雄牛・力・原始的エネルギー",
      keywords: ["野生の力", "健康", "変化", "勇気", "原始的エネルギー"],
      element: "地",
      aett: 1,
      sound: "u",
      interpretations: {
        upright: {
          general: "原始的な力と野生のエネルギーが目覚めます。困難を乗り越える力があります。",
          love: "情熱的で本能的な愛情が芽生えます。自然体で接することが大切です。",
          career: "強い意志力で障害を突破できます。リーダーシップを発揮する時です。",
          spirituality: "内なる野生の智慧に目覚める時期。自然との結びつきを強めましょう。"
        },
        reversed: {
          general: "力の乱用や暴力的な傾向に注意。エネルギーが空回りしています。",
          love: "支配的になったり攻撃的になりがち。相手を尊重しましょう。",
          career: "力づくで物事を進めようとしていませんか。協調性も必要です。",
          spirituality: "怒りやフラストレーションが霊的成長を妨げています。"
        }
      },
      psychological: {
        jungianAspect: "原始的な生命力と本能",
        archetype: "戦士・野生の賢者",
        individuation: "文明化された自我と原始的本能の統合",
        shadowWork: "攻撃性と破壊的衝動の昇華"
      },
      mythological: {
        deity: "オーディン（野生の知恵）",
        symbol: "原野の雄牛",
        story: "イミル（原始巨人）の犠牲による世界創造",
        cosmology: "ユグドラシルの根元の原始的力"
      },
      historical: {
        period: "1-6世紀",
        usage: "狩猟成功の護符、戦士の印",
        inscription: "ノルウェー・トゥーン石碑"
      }
    },
    {
      symbol: "ᚦ",
      name: "Thurisaz",
      transliteration: "th",
      meaning: "巨人・トール・保護",
      keywords: ["保護", "防御", "衝突", "試練", "浄化"],
      element: "火",
      aett: 1,
      sound: "th",
      interpretations: {
        upright: {
          general: "強力な保護と浄化のエネルギー。困難は成長の機会です。",
          love: "関係を守り抜く決意が必要。試練を通じて絆が深まります。",
          career: "競争や対立があっても正義が勝ちます。原則を曲げないで。",
          spirituality: "内なる悪魔との戦い。浄化と変容のプロセスです。"
        },
        reversed: {
          general: "無防備な状態や攻撃に晒されています。注意深く行動しましょう。",
          love: "関係に破壊的な要素が入り込んでいます。境界線を明確に。",
          career: "職場での対立やハラスメントに注意。適切な対処が必要です。",
          spirituality: "邪悪な影響や負のエネルギーから身を守りましょう。"
        }
      },
      psychological: {
        jungianAspect: "防御機制と境界設定",
        archetype: "守護者・戦士",
        individuation: "外的脅威に対する健全な防御の構築",
        shadowWork: "攻撃性の建設的な活用"
      },
      mythological: {
        deity: "トール（雷神）",
        symbol: "トールのハンマー・ミョルニル",
        story: "トールが巨人族からミッドガルドを守る戦い",
        cosmology: "アースガルドとヨトゥンヘイムの境界"
      },
      historical: {
        period: "3-8世紀",
        usage: "護符、戦前の儀式",
        inscription: "デンマーク・リンドホルム石碑"
      }
    },
    {
      symbol: "ᚨ",
      name: "Ansuz",
      transliteration: "a",
      meaning: "神・オーディン・智慧",
      keywords: ["智慧", "伝達", "インスピレーション", "詩", "神託"],
      element: "風",
      aett: 1,
      sound: "a",
      interpretations: {
        upright: {
          general: "神からのメッセージや深い洞察を受け取る時期。直感を信頼しましょう。",
          love: "心からの対話と理解。真実の愛は言葉を通じて表現されます。",
          career: "コミュニケーション能力が成功の鍵。教える・伝える役割が重要です。",
          spirituality: "高次の存在からの導きを受ける時期。瞑想や祈りが効果的です。"
        },
        reversed: {
          general: "誤解や嘘、詐欺に注意。情報の真偽を確かめましょう。",
          love: "コミュニケーション不足や誤解が関係を悪化させています。",
          career: "虚偽の情報や詐欺的な提案に要注意。契約書をよく読んで。",
          spirituality: "偽りの教えや詐欺師に惑わされないよう注意しましょう。"
        }
      },
      psychological: {
        jungianAspect: "集合的無意識からの知恵",
        archetype: "賢者・伝達者",
        individuation: "高次の智慧と個人的洞察の統合",
        shadowWork: "知識の悪用や傲慢さとの対峙"
      },
      mythological: {
        deity: "オーディン（全父）",
        symbol: "オーディンの槍・グングニル",
        story: "オーディンがルーン文字を発見した9日間の犠牲",
        cosmology: "世界樹での吊られた神の智慧獲得"
      },
      historical: {
        period: "2-7世紀",
        usage: "神託、詩の呪文、祈祷文",
        inscription: "ノルウェー・エイナルスタディル石碑"
      }
    },
    {
      symbol: "ᚱ",
      name: "Raidho",
      transliteration: "r",
      meaning: "旅・騎行・リズム",
      keywords: ["旅", "動き", "進歩", "リズム", "探求"],
      element: "風",
      aett: 1,
      sound: "r",
      interpretations: {
        upright: {
          general: "人生の旅路での重要な移動や変化。新しい場所や経験に向かう時です。",
          love: "関係の新しい段階への移行。一緒に歩む旅の始まりです。",
          career: "出張や転職、新しい分野への挑戦。変化を恐れずに進みましょう。",
          spirituality: "霊的な巡礼や内なる旅路。魂の成長のための移動です。"
        },
        reversed: {
          general: "旅の遅延や予期しない障害。計画の見直しが必要かもしれません。",
          love: "関係の停滞や距離の問題。コミュニケーションを取り続けて。",
          career: "プロジェクトの遅れや移動の制限。忍耐強く対処しましょう。",
          spirituality: "霊的な迷いや方向性の混乱。内なる羅針盤を見つめ直して。"
        }
      },
      psychological: {
        jungianAspect: "人生の旅路と自己実現",
        archetype: "旅人・探求者",
        individuation: "外界での経験を通じた自己発見",
        shadowWork: "逃避や放浪癖との向き合い"
      },
      mythological: {
        deity: "スレイプニル（オーディンの八足馬）",
        symbol: "車輪・馬・船",
        story: "神々と人間の世界を旅する使者たち",
        cosmology: "九つの世界をつなぐ旅路"
      },
      historical: {
        period: "3-9世紀",
        usage: "旅の安全祈願、商人の護符",
        inscription: "スウェーデン・モーラ石碑"
      }
    },
    {
      symbol: "ᚲ",
      name: "Kenaz",
      transliteration: "k",
      meaning: "松明・知識・創造の火",
      keywords: ["知識", "創造", "芸術", "技能", "啓発"],
      element: "火",
      aett: 1,
      sound: "k",
      interpretations: {
        upright: {
          general: "創造的な炎が内側で燃えています。新しい技能や知識を習得する時期です。",
          love: "関係に新しい情熱や理解が生まれます。互いを深く知る時です。",
          career: "技術や芸術の分野で才能が開花。学習や訓練に最適な時期です。",
          spirituality: "内なる光が輝き始めています。瞑想や学習で智慧を深めましょう。"
        },
        reversed: {
          general: "創造的なブロックや学習の困難。無理をせず休息も必要です。",
          love: "関係がマンネリ化していませんか。新しい発見を求めましょう。",
          career: "技能不足や知識の欠如を感じています。基礎から学び直しを。",
          spirituality: "混乱や迷いで内なる光が見えにくい状態。静寂の中で答えを探して。"
        }
      },
      psychological: {
        jungianAspect: "創造的な自己表現と学習",
        archetype: "芸術家・教師",
        individuation: "創造性を通じた自己実現",
        shadowWork: "完璧主義や創造的恐怖の克服"
      },
      mythological: {
        deity: "ロキ（火の神）・ブラギ（詩神）",
        symbol: "松明・炉の火",
        story: "プロメテウス的な火の伝達者",
        cosmology: "ムスペルヘイムの創造の炎"
      },
      historical: {
        period: "2-8世紀",
        usage: "鍛冶師の護符、芸術家の印",
        inscription: "ノルウェー・ベルゲン木製札"
      }
    },
    {
      symbol: "ᚷ",
      name: "Gebo",
      transliteration: "g",
      meaning: "贈り物・交換・バランス",
      keywords: ["贈り物", "交換", "パートナーシップ", "調和", "相互性"],
      element: "風",
      aett: 1,
      sound: "g",
      interpretations: {
        upright: {
          general: "与えることと受け取ることのバランス。贈り物や新しい関係が訪れます。",
          love: "相互の愛と尊敬に基づく関係。結婚や契約の良い時期です。",
          career: "協力や提携が成功をもたらします。Win-Winの関係を築きましょう。",
          spirituality: "宇宙との交換関係を理解する時期。感謝の心を忘れずに。"
        },
        reversed: {
          general: "一方的な関係や不公平な取引。バランスを見直しましょう。",
          love: "与えるばかりか、受け取るばかりの関係。平等性を求めて。",
          career: "不公平な契約や一方的な要求。条件の再交渉が必要です。",
          spirituality: "宇宙への感謝を忘れていませんか。謙虚さを取り戻して。"
        }
      },
      psychological: {
        jungianAspect: "関係性と相互依存",
        archetype: "パートナー・仲介者",
        individuation: "他者との健全な関係を通じた成長",
        shadowWork: "依存や搾取的関係パターンの修正"
      },
      mythological: {
        deity: "フリッグ（結婚の女神）",
        symbol: "交差する線・結び目",
        story: "神々と人間の間の契約と贈り物",
        cosmology: "ワルハラでの戦士への贈り物"
      },
      historical: {
        period: "2-9世紀",
        usage: "結婚契約、商取引の印",
        inscription: "デンマーク・イェリング石碑"
      }
    },
    {
      symbol: "ᚹ",
      name: "Wunjo",
      transliteration: "w",
      meaning: "喜び・幸福・満足",
      keywords: ["喜び", "成功", "満足", "調和", "達成"],
      element: "風",
      aett: 1,
      sound: "w",
      interpretations: {
        upright: {
          general: "真の喜びと満足が訪れます。努力が報われ、幸福を感じる時期です。",
          love: "愛に満ちた幸せな関係。心からの喜びを分かち合えます。",
          career: "目標達成と成功の喜び。チーム全体が良い結果を得られます。",
          spirituality: "魂の平安と宇宙との調和。内なる光が輝いています。"
        },
        reversed: {
          general: "偽りの幸福や表面的な成功。真の満足を見つめ直しましょう。",
          love: "見かけだけの幸せや無理をした関係。本音で向き合って。",
          career: "成功の影にストレスや犠牲。健康的なバランスを求めて。",
          spirituality: "物質的満足に溺れて霊性を忘れていませんか。"
        }
      },
      psychological: {
        jungianAspect: "統合された自己と内的調和",
        archetype: "無邪気な子ども・祝福者",
        individuation: "自己受容と内的平安の達成",
        shadowWork: "偽りの楽観主義や現実逃避の克服"
      },
      mythological: {
        deity: "バルドル（光の神）",
        symbol: "太陽・花・旗",
        story: "ヴァルハラでの勝利の祝宴",
        cosmology: "アスガルドの黄金の館"
      },
      historical: {
        period: "3-8世紀",
        usage: "勝利の記念、祝祭の印",
        inscription: "ノルウェー・トゥネ石碑"
      }
    },

    // ハガルのエット（Hagall's Aett）
    {
      symbol: "ᚺ",
      name: "Hagalaz",
      transliteration: "h",
      meaning: "雹・破壊・変革",
      keywords: ["破壊", "変革", "試練", "浄化", "必然"],
      element: "水",
      aett: 2,
      sound: "h",
      interpretations: {
        upright: {
          general: "突然の変化や破壊的な力。これは新しい始まりのための浄化です。",
          love: "関係の根本的な変化。辛いけれども必要な試練です。",
          career: "予期しない変化や困難。しかし、これが新しい道への扉です。",
          spirituality: "古い自分の死と新しい自分の誕生。変容のプロセスです。"
        },
        reversed: {
          general: "変化への抵抗や破壊の回避。しかし、避けられない力があります。",
          love: "関係の問題を先延ばしにしています。根本的な対話が必要です。",
          career: "現状維持に固執していませんか。変化を受け入れる時です。",
          spirituality: "霊的な停滞。成長のためには古いパターンを手放す必要があります。"
        }
      },
      psychological: {
        jungianAspect: "破壊と再生のサイクル",
        archetype: "破壊者・変革者",
        individuation: "古い自己の死と新しい自己の誕生",
        shadowWork: "変化への恐怖と破壊的衝動の統合"
      },
      mythological: {
        deity: "ヘル（死の女神）",
        symbol: "雹の嵐・氷の結晶",
        story: "ラグナロク（神々の黄昏）の前兆",
        cosmology: "ニフルヘイムの氷の力"
      },
      historical: {
        period: "2-8世紀",
        usage: "保護の呪文、困難克服の護符",
        inscription: "アイスランド・エッギルスタジル护符"
      }
    },
    {
      symbol: "ᚾ",
      name: "Nauthiz",
      transliteration: "n",
      meaning: "必要性・欠乏・制約",
      keywords: ["必要性", "制約", "忍耐", "学習", "成長"],
      element: "火",
      aett: 2,
      sound: "n",
      interpretations: {
        upright: {
          general: "制約や困難の中にこそ真の学びがあります。忍耐強く取り組みましょう。",
          love: "関係での忍耐と理解が必要。困難を通じて絆が深まります。",
          career: "資源の制約や困難な条件。創意工夫で乗り越えられます。",
          spirituality: "霊的な試練期間。この経験が魂を強くします。"
        },
        reversed: {
          general: "必要のない制約や自分で作った限界。思い込みを見直しましょう。",
          love: "不必要な束縛や過度の依存。自由と自立のバランスを。",
          career: "自分で作った制限や思い込み。可能性を狭めていませんか。",
          spirituality: "偽りの謙虚さや自己卑下。真の自分の価値を認めて。"
        }
      },
      psychological: {
        jungianAspect: "制約を通じた創造性の発揮",
        archetype: "受難者・克服者",
        individuation: "限界を受け入れつつ成長する力",
        shadowWork: "被害者意識や無力感の克服"
      },
      mythological: {
        deity: "ノルン三姉妹（運命の女神）",
        symbol: "縛られた手・火打ち石",
        story: "必要性から生まれる火の発見",
        cosmology: "ウルドの泉での運命の織物"
      },
      historical: {
        period: "3-9世紀",
        usage: "困難克服の呪文、忍耐の護符",
        inscription: "デンマーク・ブラトースカディール石碑"
      }
    },
    {
      symbol: "ᛁ",
      name: "Isa",
      transliteration: "i",
      meaning: "氷・静寂・集中",
      keywords: ["静寂", "集中", "瞑想", "保存", "忍耐"],
      element: "水",
      aett: 2,
      sound: "i",
      interpretations: {
        upright: {
          general: "静寂と内省の時期。急がずに、じっくりと考える時です。",
          love: "関係の冷却期間。互いに距離を置いて考える時間が必要です。",
          career: "プロジェクトの一時停止。計画を練り直す好機です。",
          spirituality: "深い瞑想と内なる静寂。魂の声を聞く時期です。"
        },
        reversed: {
          general: "過度の孤立や感情の凍結。温かさを取り戻しましょう。",
          love: "関係の冷淡さや無関心。心を開いて感情を表現して。",
          career: "停滞や無気力状態。新しい刺激や変化が必要です。",
          spirituality: "霊的な麻痺や無感動。生命力を取り戻しましょう。"
        }
      },
      psychological: {
        jungianAspect: "内向と集中による洞察",
        archetype: "隠者・瞑想者",
        individuation: "静寂の中での自己探求",
        shadowWork: "孤立や感情の凍結への対処"
      },
      mythological: {
        deity: "ユミル（氷の巨人）",
        symbol: "氷柱・結晶・凍った湖",
        story: "ニフルヘイムとムスペルヘイムの境界",
        cosmology: "世界の根源にある氷の力"
      },
      historical: {
        period: "2-8世紀",
        usage: "冷静さの護符、瞑想の補助",
        inscription: "ノルウェー・ボルグ・ルーン石"
      }
    },
    {
      symbol: "ᛃ",
      name: "Jera",
      transliteration: "j",
      meaning: "年・収穫・サイクル",
      keywords: ["収穫", "成果", "サイクル", "時間", "報酬"],
      element: "地",
      aett: 2,
      sound: "j/y",
      interpretations: {
        upright: {
          general: "長期間の努力が実を結ぶ時期。収穫と報酬の季節です。",
          love: "関係が成熟し、深い絆を収穫します。忍耐が報われました。",
          career: "プロジェクトの完成や昇進。努力に見合った成果が得られます。",
          spirituality: "霊的成長の収穫期。これまでの修行が実を結びます。"
        },
        reversed: {
          general: "時期尚早や努力不足。もう少し忍耐が必要です。",
          love: "関係の発展に時間がかかります。急がずに育てていきましょう。",
          career: "まだ成果が出ない段階。継続的な努力を続けて。",
          spirituality: "霊的な成長は時間がかかります。焦らずに続けましょう。"
        }
      },
      psychological: {
        jungianAspect: "時間と忍耐による成熟",
        archetype: "農夫・育成者",
        individuation: "長期的視点での自己実現",
        shadowWork: "即効性への執着や焦りの克服"
      },
      mythological: {
        deity: "フリッグ（豊穣の女神）",
        symbol: "麦穂・車輪・時計",
        story: "四季のサイクルと収穫祭",
        cosmology: "ユグドラシルの年輪"
      },
      historical: {
        period: "2-9世紀",
        usage: "豊作祈願、商業成功の護符",
        inscription: "スウェーデン・ロック石碑"
      }
    },
    {
      symbol: "ᛇ",
      name: "Eihwaz",
      transliteration: "ei",
      meaning: "イチイの木・死と再生・軸",
      keywords: ["変容", "死と再生", "軸", "防御", "永続性"],
      element: "地",
      aett: 2,
      sound: "ei",
      interpretations: {
        upright: {
          general: "重要な変容の時期。死と再生のプロセスを通じて新しい自分に。",
          love: "関係の根本的な変化。古いパターンを手放して新しい愛を。",
          career: "キャリアの大きな転換点。勇気を持って変化を受け入れて。",
          spirituality: "魂の深い変容。古い自分の死と新しい自分の誕生です。"
        },
        reversed: {
          general: "変化への抵抗や停滞。必要な変容を避けようとしています。",
          love: "古い関係パターンへの固執。成長のために変化が必要です。",
          career: "変化を恐れて現状に留まっています。勇気を出して踏み出して。",
          spirituality: "霊的な成長への抵抗。古い信念を手放す時です。"
        }
      },
      psychological: {
        jungianAspect: "個性化における死と再生",
        archetype: "シャーマン・変容者",
        individuation: "古い自己の死を通じた新しい自己の誕生",
        shadowWork: "変化への恐怖と死への不安の克服"
      },
      mythological: {
        deity: "オーディン（死と再生の神）",
        symbol: "イチイの木・世界軸",
        story: "オーディンの9日間の吊下げと蘇生",
        cosmology: "ユグドラシル（世界樹）"
      },
      historical: {
        period: "2-8世紀",
        usage: "保護の護符、変容の儀式",
        inscription: "ノルウェー・クヴィーン教会木材"
      }
    },
    {
      symbol: "ᛈ",
      name: "Perthro",
      transliteration: "p",
      meaning: "サイコロ・運命・神秘",
      keywords: ["運命", "神秘", "隠された真実", "直感", "オカルト"],
      element: "水",
      aett: 2,
      sound: "p",
      interpretations: {
        upright: {
          general: "運命の神秘的な働き。隠された真実や新しい可能性が明らかに。",
          love: "運命的な出会いや関係の深い意味。直感を信頼しましょう。",
          career: "予期しない機会や隠れた才能の発見。チャンスを逃さないで。",
          spirituality: "霊的な覚醒や神秘体験。内なる智慧に耳を傾けて。"
        },
        reversed: {
          general: "運命への抵抗や神秘的なものの否定。もっと開かれた心を。",
          love: "直感を無視して論理だけで判断していませんか。心の声を聞いて。",
          career: "隠れた機会を見逃している可能性。もっと注意深く観察して。",
          spirituality: "霊的な体験への懐疑や否定。心を開いて受け入れて。"
        }
      },
      psychological: {
        jungianAspect: "無意識からの啓示と同時性",
        archetype: "神託者・占い師",
        individuation: "運命と自由意志の調和",
        shadowWork: "偶然への過度の依存や運命論の克服"
      },
      mythological: {
        deity: "ノルン三姉妹（運命の女神）",
        symbol: "サイコロ・くじ・ルーン石",
        story: "運命の織物と神々の運命",
        cosmology: "ウルドの泉での未来の察知"
      },
      historical: {
        period: "3-8世紀",
        usage: "占術、重要な決断の護符",
        inscription: "アングロサクソン・テムズ・ナイフ"
      }
    },
    {
      symbol: "ᛉ",
      name: "Algiz",
      transliteration: "z",
      meaning: "ヘラジカ・保護・守護",
      keywords: ["保護", "守護", "直感", "高次の自己", "霊的な盾"],
      element: "風",
      aett: 2,
      sound: "z",
      interpretations: {
        upright: {
          general: "強力な保護とスピリチュアルな守護。高次の力があなたを見守っています。",
          love: "関係での保護と祝福。真実の愛は守られています。",
          career: "困難な状況でも守護される。正しい道を歩んでいます。",
          spirituality: "守護霊や高次の存在との強いつながり。霊的な保護を感じて。"
        },
        reversed: {
          general: "保護が弱まっている状態。より注意深く、慎重に行動しましょう。",
          love: "関係での脆弱性や危険。自分自身をもっと大切にして。",
          career: "職場での危険や攻撃に晒されています。適切な防御が必要です。",
          spirituality: "霊的な攻撃や負のエネルギー。浄化と保護が必要です。"
        }
      },
      psychological: {
        jungianAspect: "高次の自己との接続と保護",
        archetype: "守護者・保護者",
        individuation: "スピリチュアルな保護と導きの受容",
        shadowWork: "過保護や無力感への依存の克服"
      },
      mythological: {
        deity: "ヘイムダル（虹の橋の守護者）",
        symbol: "ヘラジカの角・守護の手",
        story: "ビフロスト橋の守護と監視",
        cosmology: "アスガルドとミッドガルドの境界守護"
      },
      historical: {
        period: "2-8世紀",
        usage: "最強の護符、戦士の守護印",
        inscription: "デンマーク・ストーヴビー・ブレスレット"
      }
    },
    {
      symbol: "ᛊ",
      name: "Sowilo",
      transliteration: "s",
      meaning: "太陽・勝利・成功",
      keywords: ["成功", "勝利", "活力", "啓発", "リーダーシップ"],
      element: "火",
      aett: 2,
      sound: "s",
      interpretations: {
        upright: {
          general: "輝かしい成功と勝利。あなたの努力が光となって現れます。",
          love: "愛の勝利と関係の成功。幸福な絆が築かれます。",
          career: "目標達成と大きな成功。リーダーシップを発揮する時です。",
          spirituality: "霊的な覚醒と内なる光の輝き。真の自己が現れます。"
        },
        reversed: {
          general: "一時的な挫折や自信の欠如。しかし、太陽は再び昇ります。",
          love: "関係での誤解や一時的な困難。時間が解決してくれます。",
          career: "計画の遅れや期待外れ。しかし、諦めずに続けましょう。",
          spirituality: "霊的な迷いや混乱。内なる光を信じて進みましょう。"
        }
      },
      psychological: {
        jungianAspect: "自己実現と意識の統合",
        archetype: "英雄・指導者",
        individuation: "真の自己の発現と社会での成功",
        shadowWork: "傲慢さや優越感の制御"
      },
      mythological: {
        deity: "バルドル（光の神）・ソル（太陽の女神）",
        symbol: "太陽・稲妻・勝利の旗",
        story: "光の勝利と闇への勝利",
        cosmology: "太陽の戦車による天空の旅"
      },
      historical: {
        period: "2-9世紀",
        usage: "勝利の護符、成功の祈願",
        inscription: "ノルウェー・ベルゲン・ルーン棒"
      }
    },

    // テイルのエット（Tyr's Aett）
    {
      symbol: "ᛏ",
      name: "Tiwaz",
      transliteration: "t",
      meaning: "テイル神・正義・戦争",
      keywords: ["正義", "勇気", "指導力", "犠牲", "名誉"],
      element: "風",
      aett: 3,
      sound: "t",
      interpretations: {
        upright: {
          general: "正義と勇気の力。困難に立ち向かう強さと指導力を発揮する時です。",
          love: "関係での公正さと誠実さ。真実に基づいた愛を築きましょう。",
          career: "リーダーシップと責任感。正しい決断で困難を克服できます。",
          spirituality: "霊的な戦士として真理のために戦う時期。勇気を持って進んで。"
        },
        reversed: {
          general: "不正義や勇気の欠如。原則を曲げて安易な道を選んでいませんか。",
          love: "関係での不誠実や裏切り。正直になることから始めましょう。",
          career: "責任回避や不公正な行為。誠実さを取り戻すことが必要です。",
          spirituality: "霊的な怠惰や真理からの逃避。勇気を出して向き合って。"
        }
      },
      psychological: {
        jungianAspect: "道徳的勇気と責任感",
        archetype: "正義の戦士・指導者",
        individuation: "社会的責任と個人的成長の統合",
        shadowWork: "攻撃性の建設的活用と正義感の健全化"
      },
      mythological: {
        deity: "テイル（戦争と正義の神）",
        symbol: "剣・天秤・戦士の盾",
        story: "フェンリル狼との戦いでの片手の犠牲",
        cosmology: "グラズヘイムでの正義の審判"
      },
      historical: {
        period: "2-8世紀",
        usage: "戦士の護符、正義の誓い",
        inscription: "デンマーク・イリングサ・ダガー"
      }
    },
    {
      symbol: "ᛒ",
      name: "Berkano",
      transliteration: "b",
      meaning: "白樺・母性・成長",
      keywords: ["母性", "成長", "新生", "育成", "保護"],
      element: "地",
      aett: 3,
      sound: "b",
      interpretations: {
        upright: {
          general: "新しい成長と母性的な保護。生命力に満ちた創造的な時期です。",
          love: "関係での育成と成長。母性的な愛情で相手を包み込みましょう。",
          career: "新プロジェクトの立ち上げや部下の育成。成長を支援する役割です。",
          spirituality: "霊的な成長と内なる母性の覚醒。生命への深い愛を感じて。"
        },
        reversed: {
          general: "成長の停滞や母性の欠如。もっと自分と他者を大切にしましょう。",
          love: "関係での育成不足や冷たさ。温かい愛情を表現して。",
          career: "部下や同僚への配慮不足。もっと支援的な態度を取りましょう。",
          spirituality: "生命への感謝不足。自然や他者への愛を取り戻して。"
        }
      },
      psychological: {
        jungianAspect: "アニマの母性的側面と創造性",
        archetype: "母・育成者",
        individuation: "内なる母性と創造性の統合",
        shadowWork: "過保護や支配的な母性の調整"
      },
      mythological: {
        deity: "フリッグ（母なる女神）・フレイヤ（豊穣の女神）",
        symbol: "白樺の木・乳房・ゆりかご",
        story: "生命の木による新生と再生",
        cosmology: "ヨルズのみ懐での生命育成"
      },
      historical: {
        period: "3-9世紀",
        usage: "出産保護、成長祈願の護符",
        inscription: "ノルウェー・ブリッグ教会ポール"
      }
    },
    {
      symbol: "ᛖ",
      name: "Ehwaz",
      transliteration: "e",
      meaning: "馬・協力・信頼",
      keywords: ["協力", "信頼", "チームワーク", "移動", "調和"],
      element: "地",
      aett: 3,
      sound: "e",
      interpretations: {
        upright: {
          general: "信頼と協力の力。チームワークで大きな成果を達成できます。",
          love: "相互信頼に基づく深い絆。一緒に人生の旅路を歩みましょう。",
          career: "同僚やパートナーとの協力が成功の鍵。チームプレイを大切に。",
          spirituality: "霊的な仲間との結びつき。共に成長する道を歩んで。"
        },
        reversed: {
          general: "信頼関係の破綻や協力の欠如。関係の修復が必要です。",
          love: "パートナーとの不調和や信頼の欠如。対話を大切にして。",
          career: "チームワークの問題や協力体制の崩壊。関係の再構築を。",
          spirituality: "霊的な仲間との分離や孤立。つながりを求めて。"
        }
      },
      psychological: {
        jungianAspect: "健全な協力関係と相互依存",
        archetype: "協力者・パートナー",
        individuation: "他者との調和を通じた成長",
        shadowWork: "依存や共依存的関係パターンの調整"
      },
      mythological: {
        deity: "スレイプニル（オーディンの馬）",
        symbol: "馬・二頭立ての馬車",
        story: "神々の使者としての馬の活躍",
        cosmology: "九つの世界を結ぶ旅路"
      },
      historical: {
        period: "3-9世紀",
        usage: "旅の安全、協力関係の護符",
        inscription: "スウェーデン・スピャルレヴ石碑"
      }
    },
    {
      symbol: "ᛗ",
      name: "Mannaz",
      transliteration: "m",
      meaning: "人間・自己・意識",
      keywords: ["人間性", "自己認識", "意識", "社会", "理性"],
      element: "風",
      aett: 3,
      sound: "m",
      interpretations: {
        upright: {
          general: "人間としての成熟と自己認識。社会での役割を理解する時期です。",
          love: "人間的な成熟を基盤とした愛情。互いを完全に理解し合えます。",
          career: "人間関係のスキルと社会的責任。リーダーシップを発揮できます。",
          spirituality: "人間性と霊性の統合。地に足ついた霊的な成長です。"
        },
        reversed: {
          general: "自己認識の欠如や社会からの孤立。もっと他者との交流を。",
          love: "相手の人間性を理解していない状態。もっと深く知り合いましょう。",
          career: "人間関係のトラブルや社会性の欠如。コミュニケーションスキルを向上させて。",
          spirituality: "人間性を軽視した霊性の追求。バランスを取り戻して。"
        }
      },
      psychological: {
        jungianAspect: "自己と社会の統合された意識",
        archetype: "人間・市民",
        individuation: "個人性と社会性の調和",
        shadowWork: "反社会的傾向や極端な個人主義の修正"
      },
      mythological: {
        deity: "アスクとエムブラ（最初の人間）",
        symbol: "人の形・十字・コミュニティ",
        story: "神々による人間の創造",
        cosmology: "ミッドガルドでの人間の役割"
      },
      historical: {
        period: "2-9世紀",
        usage: "社会的結束、自己認識の護符",
        inscription: "デンマーク・コペンハーゲン・ゴールドホーン"
      }
    },
    {
      symbol: "ᛚ",
      name: "Laguz",
      transliteration: "l",
      meaning: "水・流れ・直感",
      keywords: ["直感", "流れ", "感情", "浄化", "適応"],
      element: "水",
      aett: 3,
      sound: "l",
      interpretations: {
        upright: {
          general: "直感と感情の流れに従う時期。水のように柔軟に状況に適応しましょう。",
          love: "感情の深い流れと直感的な理解。心の声に従って関係を育てて。",
          career: "状況の変化に柔軟に対応。直感的な判断が成功をもたらします。",
          spirituality: "感情の浄化と直感的な智慧。内なる声に耳を傾けて。"
        },
        reversed: {
          general: "感情の混乱や直感への不信。もっと心の声に耳を傾けましょう。",
          love: "感情の抑圧や流れの停滞。もっと自然に感情を表現して。",
          career: "変化への抵抗や硬直性。もっと柔軟な対応が必要です。",
          spirituality: "感情的な混乱や霊的な迷い。静寂の中で答えを見つけて。"
        }
      },
      psychological: {
        jungianAspect: "無意識からの感情と直感",
        archetype: "直感者・感情の導き手",
        individuation: "感情と直感の健全な統合",
        shadowWork: "感情の洪水や抑圧への対処"
      },
      mythological: {
        deity: "ニョルド（海の神）・エーギル（海の巨人）",
        symbol: "波・湖・滝",
        story: "九つの世界を流れる川",
        cosmology: "ウルドの泉とミーミルの泉"
      },
      historical: {
        period: "2-8世紀",
        usage: "水の護符、直感力向上の呪文",
        inscription: "ノルウェー・フロシャ・ボーン"
      }
    },
    {
      symbol: "ᛜ",
      name: "Ingwaz",
      transliteration: "ng",
      meaning: "イング神・豊穣・完成",
      keywords: ["完成", "豊穣", "統合", "平和", "調和"],
      element: "地",
      aett: 3,
      sound: "ng",
      interpretations: {
        upright: {
          general: "長期プロジェクトの完成と豊かな成果。内的な統合と平和を感じる時期です。",
          love: "関係の成熟と深い調和。真の愛の完成形に到達しています。",
          career: "目標の達成と安定した成功。長年の努力が実を結びます。",
          spirituality: "霊的な成熟と内なる平和。真の自己との統合を達成しています。"
        },
        reversed: {
          general: "完成への焦りや不完全な状態への不満。もう少し時間をかけて。",
          love: "関係の完成を急ぎすぎています。自然な流れに任せましょう。",
          career: "成果を急いで品質を犠牲にしていませんか。丁寧に仕上げて。",
          spirituality: "霊的な完成への執着。プロセスそのものを楽しみましょう。"
        }
      },
      psychological: {
        jungianAspect: "個性化プロセスの完成",
        archetype: "完成者・統合者",
        individuation: "内的統合と自己実現の達成",
        shadowWork: "完璧主義や達成への過度の執着"
      },
      mythological: {
        deity: "イング（フレイル）・豊穣の神",
        symbol: "種・菱形・結び目",
        story: "豊穣の神による大地の祝福",
        cosmology: "ヴァナヘイムでの平和と豊穣"
      },
      historical: {
        period: "3-7世紀",
        usage: "豊作祈願、完成の祝福",
        inscription: "アングロサクソン・フランクス・カスケット"
      }
    },
    {
      symbol: "ᛞ",
      name: "Dagaz",
      transliteration: "d",
      meaning: "夜明け・覚醒・変容",
      keywords: ["覚醒", "新しい始まり", "希望", "啓発", "変容"],
      element: "風",
      aett: 3,
      sound: "d",
      interpretations: {
        upright: {
          general: "新しい夜明けと希望の光。重要な覚醒や悟りの瞬間が訪れます。",
          love: "関係での新しい理解や愛の覚醒。真実の愛が明らかになります。",
          career: "新しい機会の到来や重要な洞察。ブレイクスルーの瞬間です。",
          spirituality: "霊的な覚醒と真理の発見。内なる光が輝き始めています。"
        },
        reversed: {
          general: "覚醒への抵抗や変化への恐れ。新しい光を受け入れる勇気を。",
          love: "新しい段階への恐れや過去への執着。前進する時です。",
          career: "変化への恐れや新しい機会の見逃し。勇気を出して踏み出して。",
          spirituality: "霊的な成長への抵抗。古い信念を手放す時期です。"
        }
      },
      psychological: {
        jungianAspect: "意識の拡大と新しい自己の誕生",
        archetype: "覚醒者・希望の担い手",
        individuation: "新しい意識レベルでの自己実現",
        shadowWork: "変化への恐怖と過去への執着の克服"
      },
      mythological: {
        deity: "バルドル（光の神）・ダグ（昼の神）",
        symbol: "夜明け・蝶・光の柱",
        story: "永遠の夜明けと光の勝利",
        cosmology: "ラグナロク後の新世界の誕生"
      },
      historical: {
        period: "3-8世紀",
        usage: "新しい始まりの祝福、変容の護符",
        inscription: "スウェーデン・リンバー石碑"
      }
    },
    {
      symbol: "ᛟ",
      name: "Othala",
      transliteration: "o",
      meaning: "家・遺産・祖先",
      keywords: ["遺産", "家族", "伝統", "ルーツ", "継承"],
      element: "地",
      aett: 3,
      sound: "o",
      interpretations: {
        upright: {
          general: "家族や祖先からの遺産と智慧。ルーツとのつながりが力をもたらします。",
          love: "家族ぐるみの関係や深い絆。共通の価値観で結ばれた愛情です。",
          career: "家業の継承や伝統的な分野での成功。過去の智慧を活かして。",
          spirituality: "祖先の智慧と霊的な遺産。家系の霊的な力を受け継いでいます。"
        },
        reversed: {
          general: "家族との断絶や伝統の拒否。ルーツとの和解が必要かもしれません。",
          love: "家族の反対や価値観の違い。理解と歩み寄りが大切です。",
          career: "伝統への反発や古いやり方の拒否。革新と伝統のバランスを。",
          spirituality: "祖先との断絶や霊的な遺産の拒否。ルーツに立ち返って。"
        }
      },
      psychological: {
        jungianAspect: "集合的無意識と家系の智慧",
        archetype: "祖先・伝統の守護者",
        individuation: "個人性と集合的アイデンティティの統合",
        shadowWork: "家族の呪縛や過度の伝統主義の克服"
      },
      mythological: {
        deity: "先祖霊・ディース（祖霊）",
        symbol: "家・囲い・菱形",
        story: "祖先の霊による子孫の守護",
        cosmology: "ヘルヘイムでの祖先との再会"
      },
      historical: {
        period: "2-8世紀",
        usage: "家族の護符、相続の印",
        inscription: "ドイツ・ピーデルボルン・フィブラ"
      }
    }
  ]
};

// ヤンガーフサルク（16ルーン、800-1100年）
export const youngerFuthark: RuneSystem = {
  name: "Younger Futhark",
  period: "800-1100 CE",
  runeCount: 16,
  description: "ヴァイキング時代の簡略化されたルーン文字。実用性を重視。",
  culturalContext: "ヴァイキング文化、スカンジナビア、ルーン石碑",
  runes: [
    {
      symbol: "ᚠ",
      name: "Fé",
      transliteration: "f",
      meaning: "家畜・富",
      keywords: ["富", "財産", "成功", "豊かさ"],
      element: "火",
      sound: "f",
      interpretations: {
        upright: {
          general: "物質的な成功と財産の増加。投資や新事業に良い時期です。",
          love: "関係に安定と豊かさが訪れます。結婚や同棲に適しています。",
          career: "収入の増加や昇進の可能性。才能が認められる時です。",
          spirituality: "霊的な豊かさと恵み。内なる富を発見する時期です。"
        },
        reversed: {
          general: "財政的な困難や損失。慎重な資金管理が必要です。",
          love: "関係での金銭問題や価値観の対立。話し合いが必要です。",
          career: "収入の減少や投資の失敗。リスク管理を見直しましょう。",
          spirituality: "物質主義への傾倒。真の価値を見つめ直して。"
        }
      },
      psychological: {
        jungianAspect: "物質的安定と自己価値",
        archetype: "提供者・富の管理者",
        individuation: "物質と精神のバランス",
        shadowWork: "強欲と所有欲の克服"
      },
      mythological: {
        deity: "フレイル（豊穣神）",
        symbol: "金・宝物・穀物",
        story: "ヴァイキングの富と略奪",
        cosmology: "ミッドガルドでの物質的繁栄"
      },
      historical: {
        period: "800-1100年",
        usage: "商業、財産記録",
        inscription: "デンマーク・イェリング石碑"
      }
    },
    {
      symbol: "ᚢ",
      name: "Úr",
      transliteration: "u",
      meaning: "鉄滓・雨",
      keywords: ["変化", "浄化", "力", "試練"],
      element: "水",
      sound: "u",
      interpretations: {
        upright: {
          general: "浄化と変化の力。困難を通じて強くなる時期です。",
          love: "関係の試練と成長。嵐の後に虹が現れます。",
          career: "厳しい状況での成長。困難を乗り越える力があります。",
          spirituality: "魂の浄化と精神的な強化。試練は成長の機会です。"
        },
        reversed: {
          general: "変化への抵抗や停滞。新しい流れを受け入れましょう。",
          love: "関係の停滞や成長の拒否。変化を恐れないで。",
          career: "現状維持への固執。革新が必要な時期です。",
          spirituality: "霊的な成長への抵抗。変容を受け入れて。"
        }
      },
      psychological: {
        jungianAspect: "変容と浄化のプロセス",
        archetype: "変革者・浄化者",
        individuation: "困難を通じた成長",
        shadowWork: "変化への恐怖の克服"
      },
      mythological: {
        deity: "トール（雷神）",
        symbol: "雨・雷・鉄",
        story: "嵐による大地の浄化",
        cosmology: "ミッドガルドの気象変化"
      },
      historical: {
        period: "800-1100年",
        usage: "天候祈願、困難克服",
        inscription: "ノルウェー・ボルグ石碑"
      }
    }
    // ... 残り14ルーン（簡略化のため一部省略）
  ]
};

// アングロサクソンフソルク（29-33ルーン、400-1100年）
export const angloSaxonFuthorc: RuneSystem = {
  name: "Anglo-Saxon Futhorc",
  period: "400-1100 CE",
  runeCount: 29,
  description: "古英語に適応された最も拡張されたルーン体系。キリスト教の影響も受けた。",
  culturalContext: "アングロサクソン・イングランド、古英語、キリスト教文化",
  runes: [
    // エルダーフサルクと同様の基本24ルーン + 追加5ルーン
    // ここでは追加ルーンのみ示す
    {
      symbol: "ᚩ",
      name: "Os",
      transliteration: "o",
      meaning: "神・口・言葉",
      keywords: ["神性", "言葉", "智慧", "伝達"],
      element: "風",
      sound: "o",
      interpretations: {
        upright: {
          general: "神からの啓示や重要なメッセージ。言葉の力を活用する時です。",
          love: "心からの対話と真実の愛。誠実なコミュニケーションが鍵です。",
          career: "教育や伝達の分野での成功。知識を共有する役割です。",
          spirituality: "神との対話と霊的な啓示。祈りと瞑想を深めましょう。"
        },
        reversed: {
          general: "偽りの言葉や誤解。真実を見極める必要があります。",
          love: "コミュニケーション不足や嘘。正直な対話が必要です。",
          career: "情報の混乱や詐欺に注意。契約内容をよく確認して。",
          spirituality: "偽りの教えや霊的な詐欺。識別力を高めましょう。"
        }
      },
      psychological: {
        jungianAspect: "神的コンプレックスと霊的交流",
        archetype: "預言者・神の言葉の伝達者",
        individuation: "高次の智慧との統合",
        shadowWork: "傲慢さや偽りの霊性の克服"
      },
      mythological: {
        deity: "キリスト・ロゴス（言葉）",
        symbol: "十字・口・聖書",
        story: "神の言葉による創造",
        cosmology: "天の王国での神的交流"
      },
      historical: {
        period: "600-1000年",
        usage: "キリスト教祈祷、神学的文書",
        inscription: "アングロサクソン・ルーン詩"
      }
    }
    // ... 他の追加ルーン
  ]
};

// キャスティング方法の定義
export interface CastingMethod {
  name: string;
  description: string;
  runeCount: number;
  pattern: string;
  interpretation: string;
}

export const castingMethods: CastingMethod[] = [
  {
    name: "単一ルーン",
    description: "一つの質問に対する直接的な答え",
    runeCount: 1,
    pattern: "一つのルーンを引く",
    interpretation: "そのルーンの意味が答えとなる"
  },
  {
    name: "三ルーン（過去・現在・未来）",
    description: "時間の流れに沿った状況分析",
    runeCount: 3,
    pattern: "左から右に三つのルーンを配置",
    interpretation: "過去の原因、現在の状況、未来の結果"
  },
  {
    name: "四ルーン（四方位）",
    description: "東西南北の四方位による総合分析",
    runeCount: 4,
    pattern: "十字形に四つのルーンを配置",
    interpretation: "東（新しい始まり）、南（成長）、西（収穫）、北（知恵）"
  },
  {
    name: "九ルーン（ノルンの織物）",
    description: "運命の三女神による複雑な運命分析",
    runeCount: 9,
    pattern: "3×3のグリッドに配置",
    interpretation: "過去・現在・未来を三層で詳細分析"
  },
  {
    name: "タキトゥス法（古典的方法）",
    description: "歴史家タキトゥスが記録した最古の方法",
    runeCount: 3,
    pattern: "白い布の上に木片を散らし、三つを選ぶ",
    interpretation: "神々からの直接的な答え"
  }
];

// ルーン占いの解釈原則
export const interpretationPrinciples = {
  historical: {
    description: "歴史的文脈に基づく伝統的解釈",
    approach: "古代ゲルマン民族の世界観と神話に基づく",
    strength: "文化的真正性と深い象徴性",
    limitation: "現代社会への適用に制限"
  },
  psychological: {
    description: "ユング心理学に基づく現代的解釈",
    approach: "元型と個性化プロセスの観点から分析",
    strength: "現代人の心理的成長に直接的に適用可能",
    limitation: "歴史的文脈の希薄化"
  },
  integrated: {
    description: "歴史的正確性と現代的適用性の統合",
    approach: "古代の智慧を現代の心理学的理解で翻訳",
    strength: "両方の利点を活用した包括的アプローチ",
    limitation: "解釈の複雑性の増加"
  }
};