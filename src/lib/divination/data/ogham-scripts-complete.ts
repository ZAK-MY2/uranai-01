/**
 * 完全オガム文字システム
 * 
 * アイルランド・ウェールズ・スコットランドの古代ケルト文字
 * 樹木暦・草本・動物・色彩・音響・方位との対応
 */

// オガム文字の完全型定義
export interface OghamLetter {
  symbol: string;
  name: string;
  transcription: string;
  tree?: string;
  treeGenus: string;
  element: 'fire' | 'water' | 'air' | 'earth' | 'spirit';
  
  // 時期・季節
  timing: {
    months: string;
    season: string;
    festivals: string[];
  };
  
  // 意味・属性
  meanings: {
    keywords: string[];
    divinatory: {
      upright: string;
      reversed: string;
    };
    psychological: string;
    spiritual: string;
  };
  
  // 対応関係
  correspondences: {
    color: string;
    direction: string;
    sound: string;
    number: number;
    oghamGroup: 'aicme1' | 'aicme2' | 'aicme3' | 'aicme4' | 'forfeda';
  };
  
  // 神話・伝承
  mythology: {
    deity?: string;
    story: string;
    symbolism: string[];
  };
  
  // 実用的な用途
  practical: {
    herb?: string;
    crystal: string;
    ritual: string;
    medicinal?: string;
  };
}

// 第一アイクメ（ベス・ルイス・フェルン・サイル・ヌイン）
export const firstAicme: OghamLetter[] = [
  {
    symbol: 'ᚁ',
    name: 'Beith',
    transcription: 'B',
    tree: 'White Birch',
    treeGenus: 'Betula pendula',
    element: 'air',
    timing: {
      months: '12月24日 - 1月20日',
      season: '冬至後',
      festivals: ['Yule', 'Winter Solstice']
    },
    meanings: {
      keywords: ['新しい始まり', '浄化', '再生', '可能性', '純粋性'],
      divinatory: {
        upright: '新しいサイクルの開始。過去を浄化し、フレッシュなスタートを切る時期です。白樺の清らかなエネルギーが新しい道を照らします。',
        reversed: '新しい始まりへの恐れや抵抗。過去にとらわれて前進できない状態。浄化が不完全で障害が残っています。'
      },
      psychological: '心理的な浄化と再生。古いパターンを手放し、新しい自己アイデンティティを確立する段階。',
      spiritual: '魂の浄化と霊的な新生。高次の自己との新しい関係を築く時期。'
    },
    correspondences: {
      color: '純白・銀白',
      direction: '東',
      sound: 'b音、高い笛の音',
      number: 1,
      oghamGroup: 'aicme1'
    },
    mythology: {
      deity: 'Brigid（ブリジッド）',
      story: '白樺は世界樹の最初の枝として生まれ、他の木々の母となった。その白い樹皮は純粋さの象徴であり、ドルイドは白樺の樹皮に神聖な文字を刻んだ。',
      symbolism: ['純粋性', '新生', '可能性の扉', '清らかな心']
    },
    practical: {
      herb: 'ビーチリーフ',
      crystal: 'クリアクォーツ',
      ritual: '新月の夜に白樺の樹皮に願いを書き、川に流す浄化の儀式',
      medicinal: '白樺の樹液は血液浄化作用'
    }
  },
  {
    symbol: 'ᚂ',
    name: 'Luis',
    transcription: 'L',
    tree: 'Mountain Ash / Rowan',
    treeGenus: 'Sorbus aucuparia',
    element: 'fire',
    timing: {
      months: '1月21日 - 2月17日',
      season: '晩冬',
      festivals: ['Imbolc前期']
    },
    meanings: {
      keywords: ['保護', '魔術的防御', '洞察', '霊視', '守護'],
      divinatory: {
        upright: '強力な保護エネルギーに包まれています。直感が鋭くなり、隠された真実が見えてきます。スピリチュアルな守護が働いています。',
        reversed: '防御が弱まっている状態。負のエネルギーや悪意ある影響に注意。霊的な混乱や迷いがあります。'
      },
      psychological: '内なる直感力の覚醒。心理的な境界線の確立と自己防衛機制の強化。',
      spiritual: '霊的な保護能力の開花。高次元の存在との交流と守護霊の認識。'
    },
    correspondences: {
      color: '鮮やかな赤・オレンジ',
      direction: '南',
      sound: 'l音、鈴の音',
      number: 2,
      oghamGroup: 'aicme1'
    },
    mythology: {
      deity: 'Lugh（ルー）',
      story: 'ナナカマドは雷神ルーの聖なる木とされ、その赤い実は太陽の火を宿すといわれた。魔女や悪霊から家を守るため、戸口にナナカマドの小枝を吊るした。',
      symbolism: ['魔術的保護', '洞察力', '霊的覚醒', '火の力']
    },
    practical: {
      herb: 'ローワンベリー',
      crystal: 'ルビー',
      ritual: 'ナナカマドの小枝で五芒星を作り、家の四隅に置く保護の儀式',
      medicinal: 'ナナカマドの実は消化器系の薬草'
    }
  },
  {
    symbol: 'ᚃ',
    name: 'Fearn',
    transcription: 'F/V',
    tree: 'Alder',
    treeGenus: 'Alnus glutinosa',
    element: 'water',
    timing: {
      months: '2月18日 - 3月17日',
      season: '春の前兆',
      festivals: ['Imbolc後期', 'Spring Equinox前']
    },
    meanings: {
      keywords: ['勇気', '前進', '開拓', '決断', '犠牲'],
      divinatory: {
        upright: '勇気を持って未知の領域に踏み出す時です。困難な状況でも前進する力があります。開拓者精神が成功をもたらします。',
        reversed: '前進への恐れや優柔不断。決断を避けている状態。勇気が足りず、現状に留まってしまっています。'
      },
      psychological: '自己主張と積極性の発達。困難に立ち向かう心理的強さの獲得。',
      spiritual: '霊的な戦士としての目覚め。真理のために戦う意志の確立。'
    },
    correspondences: {
      color: '深い緑・茶色',
      direction: '西',
      sound: 'f音、風の音',
      number: 3,
      oghamGroup: 'aicme1'
    },
    mythology: {
      deity: 'Bran the Blessed（祝福されしブラン）',
      story: 'ハンノキは水辺に育ち、その木は橋や船に使われた。ブラン王の首が埋められた場所にハンノキが生え、土地を守護したという。',
      symbolism: ['勇敢な旅路', '犠牲的愛', '橋渡し', '守護']
    },
    practical: {
      herb: 'アルダーバーク',
      crystal: 'アベンチュリン',
      ritual: '川べりでハンノキの葉を流し、新しい挑戦への勇気を祈る儀式',
      medicinal: 'ハンノキの樹皮は炎症抑制作用'
    }
  },
  {
    symbol: 'ᚄ',
    name: 'Saille',
    transcription: 'S',
    tree: 'Willow',
    treeGenus: 'Salix alba',
    element: 'water',
    timing: {
      months: '3月18日 - 4月14日',
      season: '春分',
      festivals: ['Spring Equinox', 'Ostara']
    },
    meanings: {
      keywords: ['直感', '月の力', '感受性', '夢', 'サイキック能力'],
      divinatory: {
        upright: '直感と感受性が高まっています。月のリズムに従い、夢や内なる声に耳を傾けてください。サイキック能力が開花する時期です。',
        reversed: '感情の混乱や直感への不信。月の影響に振り回されている状態。サイキック能力の乱用や混乱があります。'
      },
      psychological: '感情的知性の発達。無意識との健全な関係の構築。',
      spiritual: 'サイキック能力の開花。月の女神との深いつながりの確立。'
    },
    correspondences: {
      color: '薄緑・銀',
      direction: '西',
      sound: 's音、水の流れる音',
      number: 4,
      oghamGroup: 'aicme1'
    },
    mythology: {
      deity: 'Luna（月の女神）',
      story: '柳は月の女神の聖なる木とされ、その柔軟な枝は風になびいて月の踊りを表現した。ドルイドは柳の下で夢占いを行った。',
      symbolism: ['月の神秘', '夢の世界', '柔軟性', '感受性']
    },
    practical: {
      herb: 'ウィローバーク',
      crystal: 'ムーンストーン',
      ritual: '満月の夜に柳の枝でサークルを作り、夢占いを行う儀式',
      medicinal: '柳の樹皮は解熱・鎮痛作用（アスピリンの原料）'
    }
  },
  {
    symbol: 'ᚅ',
    name: 'Nion',
    transcription: 'N',
    tree: 'Ash',
    treeGenus: 'Fraxinus excelsior',
    element: 'air',
    timing: {
      months: '4月15日 - 5月12日',
      season: '晩春',
      festivals: ['Beltane前期']
    },
    meanings: {
      keywords: ['成長', '拡大', '霊的戦士', '宇宙軸', '連結'],
      divinatory: {
        upright: '急速な成長と拡大の時期です。霊的な戦士として目覚め、宇宙とのつながりを感じます。新しい次元への扉が開かれます。',
        reversed: '成長の停滞や方向性の迷い。霊的な戦いを避けている状態。宇宙とのつながりが弱まっています。'
      },
      psychological: '自己拡大と成長意欲の高まり。リーダーシップ能力の発達。',
      spiritual: '霊的戦士としての使命の自覚。宇宙意識との統合。'
    },
    correspondences: {
      color: '薄緑・青緑',
      direction: '北',
      sound: 'n音、風が木を通る音',
      number: 5,
      oghamGroup: 'aicme1'
    },
    mythology: {
      deity: 'Yggdrasil（ユグドラシル）',
      story: 'トネリコは世界樹ユグドラシルとして知られ、九つの世界をつなぐ宇宙軸である。オーディンはこの木に九日間吊るされ、ルーン文字を得た。',
      symbolism: ['世界軸', '宇宙との連結', '智慧の探求', '犠牲と報酬']
    },
    practical: {
      herb: 'アッシュリーフ',
      crystal: 'ラピスラズリ',
      ritual: 'トネリコの木の下で瞑想し、宇宙意識との統合を図る儀式',
      medicinal: 'トネリコの葉は利尿・抗炎症作用'
    }
  }
];

// 第二アイクメ（ウアス・ドゥイル・ティン・コル・ケルト）
export const secondAicme: OghamLetter[] = [
  {
    symbol: 'ᚆ',
    name: 'Huathe',
    transcription: 'H',
    tree: 'Hawthorn',
    treeGenus: 'Crataegus monogyna',
    element: 'fire',
    timing: {
      months: '5月13日 - 6月9日',
      season: '初夏',
      festivals: ['Beltane', '聖なる結婚']
    },
    meanings: {
      keywords: ['浄化', '守護', '聖なる結婚', '希望', '保護'],
      divinatory: {
        upright: '浄化と保護のエネルギーが働いています。聖なる結婚や深い絆の形成。希望の光が見えてきます。',
        reversed: '保護の欠如や希望の喪失。浄化が必要な状況。関係性での問題や障害があります。'
      },
      psychological: '心理的な浄化と保護機制の確立。健全な関係性の構築。',
      spiritual: '聖なる結婚の体験。神聖な保護と祝福の受容。'
    },
    correspondences: {
      color: '白・薄ピンク',
      direction: '南東',
      sound: 'h音、そよ風の音',
      number: 6,
      oghamGroup: 'aicme2'
    },
    mythology: {
      deity: 'Blodeuwedd（ブロデウェッド）',
      story: 'サンザシは5月の花嫁の木とされ、ベルテーンの祭りで愛の誓いを立てる場所だった。妖精たちが住む木ともいわれ、その花は純潔を象徴した。',
      symbolism: ['純潔', '愛の誓い', '妖精の住処', '5月の花嫁']
    },
    practical: {
      herb: 'ホーソンベリー',
      crystal: 'ローズクォーツ',
      ritual: 'サンザシの花で花冠を作り、愛の誓いを立てる儀式',
      medicinal: 'サンザシの実は心臓強化作用'
    }
  },
  {
    symbol: 'ᚇ',
    name: 'Duir',
    transcription: 'D',
    tree: 'Oak',
    treeGenus: 'Quercus robur',
    element: 'earth',
    timing: {
      months: '6月10日 - 7月7日',
      season: '夏至',
      festivals: ['Summer Solstice', 'Litha']
    },
    meanings: {
      keywords: ['力', '安定', '正義', '王権', '持久力'],
      divinatory: {
        upright: '強大な力と安定性があなたを支えています。正義が勝利し、リーダーシップを発揮する時です。持久力で困難を乗り越えます。',
        reversed: '力の乱用や独裁的傾向。安定性の欠如や正義への背反。リーダーシップの放棄があります。'
      },
      psychological: '自己権威の確立。強靭な精神力と持久力の発達。',
      spiritual: '霊的な王権の獲得。神聖な正義と秩序の体現。'
    },
    correspondences: {
      color: '深緑・金色',
      direction: '中央',
      sound: 'd音、雷鳴',
      number: 7,
      oghamGroup: 'aicme2'
    },
    mythology: {
      deity: 'Dagda（ダグザ）',
      story: 'オークは森の王として他の木々を支配し、雷神の住処とされた。ドルイドの聖なる木であり、重要な儀式はオークの下で行われた。',
      symbolism: ['森の王', '神の座', '永続性', '神聖な力']
    },
    practical: {
      herb: 'オークリーフ',
      crystal: 'タイガーアイ',
      ritual: 'オークの木に手を当て、大地の力を感じる儀式',
      medicinal: 'オークの樹皮は収斂・止血作用'
    }
  },
  {
    symbol: 'ᚈ',
    name: 'Tinne',
    transcription: 'T',
    tree: 'Holly',
    treeGenus: 'Ilex aquifolium',
    element: 'fire',
    timing: {
      months: '7月8日 - 8月4日',
      season: '盛夏',
      festivals: ['Lughnasadh前期']
    },
    meanings: {
      keywords: ['バランス', '正義', '主権', '勇気', '犠牲'],
      divinatory: {
        upright: 'バランスと正義の力が働きます。主権を握り、勇気ある決断を下す時です。必要な犠牲を払う覚悟があります。',
        reversed: 'バランスの崩れや不正義。主権の濫用や勇気の欠如。不要な犠牲を強いられています。'
      },
      psychological: '内的バランスの確立。正義感と公正性の発達。',
      spiritual: '霊的な主権と責任の自覚。犠牲と奉仕の精神の体現。'
    },
    correspondences: {
      color: '深紅・緑',
      direction: '南西',
      sound: 't音、木が燃える音',
      number: 8,
      oghamGroup: 'aicme2'
    },
    mythology: {
      deity: 'Holly King（ヒイラギ王）',
      story: 'ヒイラギ王は夏至から冬至まで支配し、オーク王と永遠の戦いを続ける。その尖った葉は邪悪を寄せ付けず、赤い実は生命力を象徴する。',
      symbolism: ['永遠の戦い', '季節の王', '保護', '生命力']
    },
    practical: {
      herb: 'ホリーリーフ',
      crystal: 'ガーネット',
      ritual: 'ヒイラギの枝で円を描き、バランスの回復を祈る儀式',
      medicinal: 'ヒイラギの実は強心作用（毒性注意）'
    }
  },
  {
    symbol: 'ᚉ',
    name: 'Coll',
    transcription: 'C/K',
    tree: 'Hazel',
    treeGenus: 'Corylus avellana',
    element: 'air',
    timing: {
      months: '8月5日 - 9月1日',
      season: '晩夏',
      festivals: ['Lughnasadh', '収穫祭']
    },
    meanings: {
      keywords: ['知恵', '直感', '霊感', '詩的洞察', '占い'],
      divinatory: {
        upright: '深い知恵と霊感が授けられます。詩的な洞察力が冴え、占いや予言的能力が高まります。内なる智慧の泉が開かれます。',
        reversed: '知恵の乱用や直感への不信。霊感の混乱や誤った洞察。智慧の源が濁っています。'
      },
      psychological: '直感的知性の発達。創造的洞察力の開花。',
      spiritual: '霊感と予言能力の覚醒。宇宙の智慧との直接的交流。'
    },
    correspondences: {
      color: '金色・茶色',
      direction: '北東',
      sound: 'c音、木の実が落ちる音',
      number: 9,
      oghamGroup: 'aicme2'
    },
    mythology: {
      deity: 'Brigid（詩の女神ブリジッド）',
      story: 'ハシバミは智慧の木とされ、その実は知識を象徴した。九つのハシバミの木が聖なる井戸を囲み、その実を食べたサケが智慧を得たという。',
      symbolism: ['智慧の実', '詩の霊感', '占いの道具', '知識の源泉']
    },
    practical: {
      herb: 'ヘーゼルナッツ',
      crystal: 'シトリン',
      ritual: 'ハシバミの枝でダウジングロッドを作り、隠された真実を探る儀式',
      medicinal: 'ハシバミの実は脳機能向上作用'
    }
  },
  {
    symbol: 'ᚊ',
    name: 'Quert',
    transcription: 'Q',
    tree: 'Apple',
    treeGenus: 'Malus domestica',
    element: 'water',
    timing: {
      months: '9月2日 - 9月29日',
      season: '初秋',
      festivals: ['Mabon前期', '秋分前']
    },
    meanings: {
      keywords: ['愛', '選択', '誘惑', '不老不死', '魂の旅'],
      divinatory: {
        upright: '愛と美の力が働きます。重要な選択の時期で、魂の成長につながる決断が求められます。永遠の愛や不老不死の智慧が得られます。',
        reversed: '誘惑に負けるか、間違った選択をする危険。愛への恐れや美の軽視。魂の旅路での迷いがあります。'
      },
      psychological: '愛と選択の心理学。美への感受性の発達。',
      spiritual: '魂の不滅性の認識。愛による霊的変容の体験。'
    },
    correspondences: {
      color: '薄ピンク・金色',
      direction: '西',
      sound: 'qu音、甘い香りの風',
      number: 10,
      oghamGroup: 'aicme2'
    },
    mythology: {
      deity: 'Aphrodite（アフロディーテ）',
      story: 'リンゴは愛と美の象徴であり、アヴァロンの島では不老不死のリンゴが実った。パリスの審判でも黄金のリンゴが美の女神の印となった。',
      symbolism: ['愛の象徴', '永遠の生命', '美の選択', '魂の故郷']
    },
    practical: {
      herb: 'アップルブロッサム',
      crystal: 'プレナイト',
      ritual: 'リンゴを5つに切り、五芒星を確認して愛の誓いを立てる儀式',
      medicinal: 'リンゴは消化促進・解毒作用'
    }
  }
];

// オガムスプレッドの定義
export interface OghamSpread {
  id: string;
  name: string;
  description: string;
  positions: OghamPosition[];
  complexity: 'simple' | 'intermediate' | 'advanced';
  purpose: string;
}

export interface OghamPosition {
  number: number;
  name: string;
  meaning: string;
  element?: string;
  direction?: string;
  timeFrame?: 'past' | 'present' | 'future';
}

export const oghamSpreads: OghamSpread[] = [
  {
    id: 'single-ogham',
    name: '単一オガム',
    description: '一つの質問に対する直接的な答え',
    positions: [
      {
        number: 1,
        name: '神託',
        meaning: 'ケルトの古代智慧からの直接的なメッセージ',
        element: 'spirit'
      }
    ],
    complexity: 'simple',
    purpose: 'シンプルな質問への明確な答え'
  },
  {
    id: 'three-realms',
    name: '三界（陸・海・空）',
    description: 'ケルトの三つの世界からの洞察',
    positions: [
      {
        number: 1,
        name: '陸界（ティル）',
        meaning: '物質世界・現実的な側面',
        element: 'earth',
        timeFrame: 'present'
      },
      {
        number: 2,
        name: '海界（ムーア）',
        meaning: '感情・直感・無意識の世界',
        element: 'water',
        timeFrame: 'past'
      },
      {
        number: 3,
        name: '空界（ネイヴ）',
        meaning: '霊的世界・高次の意識',
        element: 'air',
        timeFrame: 'future'
      }
    ],
    complexity: 'intermediate',
    purpose: '包括的な人生状況の分析'
  },
  {
    id: 'four-elements',
    name: '四大元素',
    description: 'ケルトの四大元素による完全な分析',
    positions: [
      {
        number: 1,
        name: '火（テイン）',
        meaning: '情熱・行動・創造力',
        element: 'fire',
        direction: '南'
      },
      {
        number: 2,
        name: '水（ウィスケ）',
        meaning: '感情・直感・浄化',
        element: 'water',
        direction: '西'
      },
      {
        number: 3,
        name: '風（ガエス）',
        meaning: '思考・コミュニケーション・変化',
        element: 'air',
        direction: '東'
      },
      {
        number: 4,
        name: '地（タラウ）',
        meaning: '安定・実現・物質的基盤',
        element: 'earth',
        direction: '北'
      }
    ],
    complexity: 'intermediate',
    purpose: 'エレメンタルバランスの調査'
  },
  {
    id: 'sacred-grove',
    name: '聖なる森',
    description: '五つのオガム文字による深い洞察',
    positions: [
      {
        number: 1,
        name: '根（フレーフ）',
        meaning: '過去の影響・基盤・源',
        element: 'earth',
        timeFrame: 'past'
      },
      {
        number: 2,
        name: '幹（クラン）',
        meaning: '現在の状況・核心',
        element: 'earth',
        timeFrame: 'present'
      },
      {
        number: 3,
        name: '枝（ゲーグ）',
        meaning: '可能性・選択肢',
        element: 'air',
        timeFrame: 'future'
      },
      {
        number: 4,
        name: '葉（ドゥイレ）',
        meaning: '表面的な状況・見た目',
        element: 'air',
        timeFrame: 'present'
      },
      {
        number: 5,
        name: '花実（ブラース）',
        meaning: '最終結果・収穫',
        element: 'water',
        timeFrame: 'future'
      }
    ],
    complexity: 'advanced',
    purpose: '複雑な状況の深層分析'
  },
  {
    id: 'druid-wheel',
    name: 'ドルイドの車輪',
    description: '八つの方位による完全な人生分析',
    positions: [
      {
        number: 1,
        name: '東（初春）',
        meaning: '新しい始まり・希望',
        element: 'air',
        direction: '東'
      },
      {
        number: 2,
        name: '南東（晩春）',
        meaning: '成長・発展',
        element: 'fire',
        direction: '南東'
      },
      {
        number: 3,
        name: '南（盛夏）',
        meaning: '完全な力・達成',
        element: 'fire',
        direction: '南'
      },
      {
        number: 4,
        name: '南西（晩夏）',
        meaning: '成熟・責任',
        element: 'earth',
        direction: '南西'
      },
      {
        number: 5,
        name: '西（初秋）',
        meaning: '収穫・内省',
        element: 'earth',
        direction: '西'
      },
      {
        number: 6,
        name: '北西（晩秋）',
        meaning: '手放し・浄化',
        element: 'water',
        direction: '北西'
      },
      {
        number: 7,
        name: '北（冬）',
        meaning: '休息・智慧',
        element: 'water',
        direction: '北'
      },
      {
        number: 8,
        name: '北東（晩冬）',
        meaning: '準備・瞑想',
        element: 'air',
        direction: '北東'
      }
    ],
    complexity: 'advanced',
    purpose: '人生の完全なサイクル分析'
  }
];

// ケルト祭日との対応
export const celticFestivals = {
  'Samhain': { date: '10/31-11/1', ogham: ['ᚍ', 'ᚏ'], meaning: '死と再生の境界' },
  'Yule': { date: '12/20-23', ogham: ['ᚁ'], meaning: '光の再生' },
  'Imbolc': { date: '2/1-2', ogham: ['ᚂ', 'ᚃ'], meaning: '浄化と保護' },
  'Ostara': { date: '3/20-23', ogham: ['ᚄ'], meaning: 'バランスと直感' },
  'Beltane': { date: '4/30-5/1', ogham: ['ᚅ', 'ᚆ'], meaning: '聖なる結婚' },
  'Litha': { date: '6/20-23', ogham: ['ᚇ'], meaning: '力の頂点' },
  'Lughnasadh': { date: '8/1-2', ogham: ['ᚈ', 'ᚉ'], meaning: '収穫と智慧' },
  'Mabon': { date: '9/20-23', ogham: ['ᚊ'], meaning: '愛と選択の収穫' }
};

// 完全なオガム文字システム（20文字 + 5フォルフェダ）
export const completeOghamAlphabet = [
  ...firstAicme,
  ...secondAicme,
  // 第三・第四アイクメと補助文字は必要に応じて拡張
];

// オガム占いの解釈原則
export const oghamInterpretationPrinciples = {
  elements: {
    fire: '創造・情熱・行動・変革',
    water: '感情・直感・浄化・流れ',
    air: '思考・コミュニケーション・智慧・変化',
    earth: '安定・実現・持久・基盤',
    spirit: '統合・超越・神聖・完成'
  },
  
  timing: {
    immediate: 'オガムは即座の導きを提供',
    seasonal: '樹木の季節サイクルに従う',
    cyclical: 'ケルトの8つの祭日に連動',
    eternal: '時を超えた普遍的智慧'
  },
  
  methodology: {
    intuitive: '直感的解釈を重視',
    traditional: 'ケルト神話と伝承に基づく',
    elemental: '四大元素の相互作用',
    seasonal: '自然のサイクルとの調和'
  }
};