// ルーンデータ
import { Rune, RuneSpread } from './runes';

export const RuneSymbols: Rune[] = [
  // フレイヤのアエット（Freya's Aett）
  {
    name: 'フェフ（Fehu）',
    symbol: 'ᚠ',
    meaning: '富、財産、成功への道筋が開かれます。物質的な豊かさと精神的な充実が調和します。',
    reversedMeaning: '財政的な困難、損失の可能性。欲張りすぎて失敗する危険性があります。',
    element: '火',
    aett: 'フレイヤ',
    numerology: 1,
    divination: '新しい機会の始まり、投資や事業に良い時期です。',
    keywords: ['富', '財産', '成功', '新始', '創造']
  },
  {
    name: 'ウルズ（Uruz）',
    symbol: 'ᚢ',
    meaning: '野生の力、原始的なエネルギー。困難を乗り越える強さと意志力があります。',
    reversedMeaning: '暴力的な傾向、制御不能な状況。力の誤用による問題が生じます。',
    element: '土',
    aett: 'フレイヤ',
    numerology: 2,
    divination: '内なる力を信じ、困難に立ち向かう勇気を持ってください。',
    keywords: ['力', '意志', '野生', '回復', '健康']
  },
  {
    name: 'スリサズ（Thurisaz）',
    symbol: 'ᚦ',
    meaning: '守護と防御、邪悪なものからの保護。慎重さと忍耐が必要な状況です。',
    reversedMeaning: '敵意、攻撃性、破壊的な力。軽率な行動は災いを招きます。',
    element: '火',
    aett: 'フレイヤ',
    numerology: 3,
    divination: '慎重に行動し、防御を固めることが重要です。',
    keywords: ['守護', '防御', '保護', '慎重', '巨人']
  },
  {
    name: 'アンスズ（Ansuz）',
    symbol: 'ᚨ',
    meaning: '神の言葉、知恵、コミュニケーション。真実が明らかになり、理解が深まります。',
    reversedMeaning: '誤解、嘘、コミュニケーションの失敗。真実が隠されている状況です。',
    element: '風',
    aett: 'フレイヤ',
    numerology: 4,
    divination: '重要なメッセージが届きます。言葉の力を大切にしてください。',
    keywords: ['知恵', '言葉', '真実', '神', 'コミュニケーション']
  },
  {
    name: 'ライド（Raidho）',
    symbol: 'ᚱ',
    meaning: '旅路、人生の道筋。正しい方向に進んでおり、目標達成が近づいています。',
    reversedMeaning: '道に迷う、方向性の喪失。計画の見直しが必要です。',
    element: '風',
    aett: 'フレイヤ',
    numerology: 5,
    divination: '人生の旅路において、適切な判断を下すことができます。',
    keywords: ['旅路', '進歩', '方向', '道', '正義']
  },
  {
    name: 'ケナズ（Kenaz）',
    symbol: 'ᚲ',
    meaning: '知識、洞察、創造の火。新しいアイデアが生まれ、理解が深まります。',
    reversedMeaning: '無知、誤解、創造力の低下。学習機会を逃している状況です。',
    element: '火',
    aett: 'フレイヤ',
    numerology: 6,
    divination: '学習と創造活動に最適な時期です。内なる光を信じてください。',
    keywords: ['知識', '創造', '洞察', '学習', '松明']
  },
  {
    name: 'ギーボ（Gebo）',
    symbol: 'ᚷ',
    meaning: '贈り物、交換、パートナーシップ。相互利益のある関係が築かれます。',
    reversedMeaning: 'このルーンには逆位置はありません（対称的な形のため）',
    element: '風',
    aett: 'フレイヤ',
    numerology: 7,
    divination: '与えることで受け取る。寛大さが幸運を呼び込みます。',
    keywords: ['贈り物', '交換', '愛', 'パートナーシップ', '犠牲']
  },
  {
    name: 'ウンジョ（Wunjo）',
    symbol: 'ᚹ',
    meaning: '喜び、幸福、調和。願いが叶い、平和で満足のいく状況が訪れます。',
    reversedMeaning: '悲しみ、不和、失望。期待していたことが実現しない可能性があります。',
    element: '風',
    aett: 'フレイヤ',
    numerology: 8,
    divination: '幸福な時期の到来。喜びを他者と分かち合ってください。',
    keywords: ['喜び', '幸福', '調和', '成功', '満足']
  },

  // ハイムのアエット（Heimdall's Aett）
  {
    name: 'ハガラズ（Hagalaz）',
    symbol: 'ᚺ',
    meaning: '破壊と再生、突然の変化。困難を通じて成長と変革が訪れます。',
    reversedMeaning: 'このルーンには逆位置はありません（対称的な形のため）',
    element: '氷',
    aett: 'ハイム',
    numerology: 9,
    divination: '破壊的な変化の後に、新しい可能性が生まれます。',
    keywords: ['破壊', '変化', '試練', '雹', '自然力']
  },
  {
    name: 'ナウシズ（Nauthiz）',
    symbol: 'ᚾ',
    meaning: '必要性、制約、学習。困難な状況から重要な教訓を学び取ります。',
    reversedMeaning: '絶望、諦め、制約からの逃避。問題に正面から向き合う必要があります。',
    element: '火',
    aett: 'ハイム',
    numerology: 10,
    divination: '制約の中にこそ、真の自由を見つけることができます。',
    keywords: ['必要', '制約', '運命', '苦難', '学習']
  },
  {
    name: 'イーサ（Isa）',
    symbol: 'ᛁ',
    meaning: '氷、停滞、静寂。現状維持の時期、内省と準備に適しています。',
    reversedMeaning: 'このルーンには逆位置はありません（対称的な形のため）',
    element: '氷',
    aett: 'ハイム',
    numerology: 11,
    divination: '静かな時期を活用して、内面を見つめ直してください。',
    keywords: ['氷', '停滞', '静寂', '集中', '保存']
  },
  {
    name: 'ヤラ（Jera）',
    symbol: 'ᛃ',
    meaning: '収穫、サイクル、報酬。長期的な努力が実を結び、成果を得られます。',
    reversedMeaning: 'このルーンには逆位置はありません（対称的な形のため）',
    element: '土',
    aett: 'ハイム',
    numerology: 12,
    divination: '忍耐強く続けてきた努力が、ついに報われる時が来ました。',
    keywords: ['収穫', '年', 'サイクル', '報酬', '努力']
  },
  {
    name: 'エイワズ（Eihwaz）',
    symbol: 'ᛇ',
    meaning: 'イチイの木、生と死、変容。困難を乗り越えて強くなります。',
    reversedMeaning: 'このルーンには逆位置はありません（対称的な形のため）',
    element: '土',
    aett: 'ハイム',
    numerology: 13,
    divination: '困難な状況も、成長のための必要な試練です。',
    keywords: ['イチイ', '持続', '防御', '死と再生', '軸']
  },
  {
    name: 'ペルス（Perthro）',
    symbol: 'ᛈ',
    meaning: '運命、偶然、隠された知識。秘密が明らかになり、運命が変わります。',
    reversedMeaning: '秘密の暴露、不運、期待外れの結果。隠していたことが問題となります。',
    element: '水',
    aett: 'ハイム',
    numerology: 14,
    divination: '運命の神秘的な力が働いています。偶然を大切にしてください。',
    keywords: ['運命', '偶然', '秘密', '賭け', '未知']
  },
  {
    name: 'アルギズ（Algiz）',
    symbol: 'ᛉ',
    meaning: '保護、守護、高次の導き。神々の加護を受け、安全が保たれます。',
    reversedMeaning: '脆弱性、保護の欠如。警戒を怠ると危険に晒される可能性があります。',
    element: '風',
    aett: 'ハイム',
    numerology: 15,
    divination: '高次の存在があなたを守護しています。直感を信じてください。',
    keywords: ['保護', '守護', '直感', 'エルク', '神聖']
  },
  {
    name: 'ソウル（Sowilo）',
    symbol: 'ᛋ',
    meaning: '太陽、勝利、成功。強力なエネルギーがあり、すべてが好転します。',
    reversedMeaning: 'このルーンには逆位置はありません（対称的な形のため）',
    element: '火',
    aett: 'ハイム',
    numerology: 16,
    divination: '太陽のような明るいエネルギーが人生を照らします。',
    keywords: ['太陽', '勝利', '成功', 'エネルギー', '栄光']
  },

  // テュールのアエット（Tyr's Aett）
  {
    name: 'ティワズ（Tiwaz）',
    symbol: 'ᛏ',
    meaning: '戦士、勇気、正義。困難に立ち向かう勇気があり、正義が勝利します。',
    reversedMeaning: '敗北、不正、勇気の欠如。正しい道から外れている可能性があります。',
    element: '風',
    aett: 'テュール',
    numerology: 17,
    divination: '正義のために戦う勇気を持ってください。犠牲も必要です。',
    keywords: ['戦士', '勇気', '正義', '犠牲', 'テュール神']
  },
  {
    name: 'ベルカナ（Berkano）',
    symbol: 'ᛒ',
    meaning: '成長、母性、新生。新しい始まりと成長の機会に恵まれます。',
    reversedMeaning: '停滞、不妊、成長の阻害。新しいプロジェクトの遅延があります。',
    element: '土',
    aett: 'テュール',
    numerology: 18,
    divination: '新しい生命や創造的プロジェクトが芽吹く時期です。',
    keywords: ['成長', '母性', '新生', '白樺', '女性性']
  },
  {
    name: 'エワズ（Ehwaz）',
    symbol: 'ᛖ',
    meaning: '馬、パートナーシップ、進歩。協力によって目標に近づきます。',
    reversedMeaning: '協力の破綻、信頼関係の悪化。パートナーシップに問題があります。',
    element: '土',
    aett: 'テュール',
    numerology: 19,
    divination: '信頼できるパートナーとの協力が成功の鍵となります。',
    keywords: ['馬', 'パートナーシップ', '信頼', '進歩', '協力']
  },
  {
    name: 'マンナズ（Mannaz）',
    symbol: 'ᛗ',
    meaning: '人間性、社会、協調。他者との調和した関係が築かれます。',
    reversedMeaning: '孤立、反社会的行動、協調性の欠如。人間関係に問題があります。',
    element: '風',
    aett: 'テュール',
    numerology: 20,
    divination: '人間としての成長と社会との調和が重要です。',
    keywords: ['人間', '社会', '協調', '知性', '文化']
  },
  {
    name: 'ラグズ（Laguz）',
    symbol: 'ᛚ',
    meaning: '水、直感、流れ。感情と直感に従って行動することで道が開けます。',
    reversedMeaning: '混乱、感情の不安定、判断力の低下。感情に流されすぎています。',
    element: '水',
    aett: 'テュール',
    numerology: 21,
    divination: '直感と感情のバランスを保ちながら進んでください。',
    keywords: ['水', '直感', '感情', '流れ', '潜在意識']
  },
  {
    name: 'インガズ（Ingwaz）',
    symbol: 'ᛜ',
    meaning: '豊穣、完成、内的成長。内面の発達により大きな成果を得られます。',
    reversedMeaning: 'このルーンには逆位置はありません（対称的な形のため）',
    element: '土',
    aett: 'テュール',
    numerology: 22,
    divination: '内的な成長が外的な成功をもたらします。',
    keywords: ['豊穣', '完成', '内的成長', 'イング神', '種']
  },
  {
    name: 'オシラ（Othala）',
    symbol: 'ᛟ',
    meaning: '遺産、家族、伝統。先祖からの知恵と財産が受け継がれます。',
    reversedMeaning: '遺産の喪失、家族の分裂、伝統の破綻。過去との断絶があります。',
    element: '土',
    aett: 'テュール',
    numerology: 23,
    divination: '家族や伝統からの支援を受けることができます。',
    keywords: ['遺産', '家族', '伝統', '財産', '相続']
  },
  {
    name: 'ダガズ（Dagaz）',
    symbol: 'ᛞ',
    meaning: '夜明け、覚醒、変容。新しい意識レベルに到達し、転換点を迎えます。',
    reversedMeaning: 'このルーンには逆位置はありません（対称的な形のため）',
    element: '風',
    aett: 'テュール',
    numerology: 24,
    divination: '人生の新しい章の始まり。覚醒と変容の時です。',
    keywords: ['夜明け', '覚醒', '変容', '希望', '新始']
  }
];

export const RuneSpreads: RuneSpread[] = [
  {
    name: 'one_rune',
    positions: ['現在の状況'],
    description: '一つのルーンによる基本的な占い',
    usage: '簡潔なガイダンスが欲しい時や、日々の指針として使用'
  },
  {
    name: 'three_runes',
    positions: ['過去', '現在', '未来'],
    description: '時間の流れを表す三つのルーン',
    usage: '状況の全体的な流れを理解したい時'
  },
  {
    name: 'cross_spread',
    positions: ['現在の状況', '課題・障害', 'アドバイス', '結果・未来'],
    description: '十字型配置による総合的な占い',
    usage: '具体的な問題に対する詳細なガイダンスが必要な時'
  },
  {
    name: 'celtic_cross',
    positions: [
      '現在の状況',
      '課題・障害', 
      '遠い過去',
      '近い過去',
      '可能な未来',
      '近い未来',
      'あなたのアプローチ',
      '外的影響',
      '希望と恐れ',
      '最終的な結果'
    ],
    description: 'ケルト十字による包括的な占い',
    usage: '人生の重要な決断や複雑な状況の詳細な分析'
  },
  {
    name: 'nine_worlds',
    positions: [
      'アスガルド（神々の世界）',
      'アルフヘイム（妖精の世界）',
      'ヴァナヘイム（ヴァン神族の世界）',
      'ミドガルド（人間の世界）',
      'ヨトゥンヘイム（巨人の世界）',
      'スヴァルトアルフヘイム（闇妖精の世界）',
      'ムスペルヘイム（火の世界）',
      'ニヴルヘイム（霧の世界）',
      'ヘルヘイム（死者の世界）'
    ],
    description: '北欧神話の九つの世界を表現したスプレッド',
    usage: '人生の全側面にわたる深い洞察を求める時'
  }
];