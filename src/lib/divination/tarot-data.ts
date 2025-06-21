// タロットカードデータベース
import { TarotCard, TarotSpread } from '@/types/divination';

/**
 * 大アルカナ（22枚）
 */
export const MAJOR_ARCANA: TarotCard[] = [
  {
    id: 0,
    name: 'The Fool',
    arcana: 'major',
    keywords: ['新しい始まり', '純粋', '冒険', '楽観'],
    uprightMeaning: '新しい始まり、純粋な心、冒険への一歩、無限の可能性、自由な精神',
    reversedMeaning: '軽率さ、計画性の欠如、無謀な行動、現実逃避、責任回避',
    imageUrl: '/tarot/major/00-fool.jpg'
  },
  {
    id: 1,
    name: 'The Magician',
    arcana: 'major',
    keywords: ['創造', '意志力', '技術', '集中'],
    uprightMeaning: '創造力、意志の力、技術と才能、集中力、実現可能性',
    reversedMeaning: '未熟さ、集中力の欠如、技術の誤用、欺瞒、操作',
    imageUrl: '/tarot/major/01-magician.jpg'
  },
  {
    id: 2,
    name: 'The High Priestess',
    arcana: 'major',
    keywords: ['直感', '神秘', '内なる知識', '受容'],
    uprightMeaning: '直感、潜在意識、内なる知識、神秘的な理解、受容的な知恵',
    reversedMeaning: '直感の無視、内なる声の無視、秘密、隠された動機',
    imageUrl: '/tarot/major/02-high-priestess.jpg'
  },
  {
    id: 3,
    name: 'The Empress',
    arcana: 'major',
    keywords: ['豊穣', '母性', '創造', '自然'],
    uprightMeaning: '豊穣、母性愛、創造性、自然との調和、繁栄',
    reversedMeaning: '過保護、依存、創造性の停滞、自然からの切り離し',
    imageUrl: '/tarot/major/03-empress.jpg'
  },
  {
    id: 4,
    name: 'The Emperor',
    arcana: 'major',
    keywords: ['権威', '父性', '統制', '構造'],
    uprightMeaning: '権威、父性的な保護、構造と秩序、統制、安定',
    reversedMeaning: '独裁、過度の統制、父性の欠如、無秩序、反逆',
    imageUrl: '/tarot/major/04-emperor.jpg'
  },
  {
    id: 5,
    name: 'The Hierophant',
    arcana: 'major',
    keywords: ['伝統', '精神的指導', '教え', '信念'],
    uprightMeaning: '精神的指導、伝統的な価値観、教えと学習、信念体系',
    reversedMeaning: '独断主義、伝統への反逆、精神的混乱、教えの拒否',
    imageUrl: '/tarot/major/05-hierophant.jpg'
  },
  {
    id: 6,
    name: 'The Lovers',
    arcana: 'major',
    keywords: ['愛', '関係', '選択', '調和'],
    uprightMeaning: '愛、パートナーシップ、重要な選択、価値観の調和',
    reversedMeaning: '関係の問題、価値観の対立、悪い選択、不調和',
    imageUrl: '/tarot/major/06-lovers.jpg'
  },
  {
    id: 7,
    name: 'The Chariot',
    arcana: 'major',
    keywords: ['意志', '前進', '統制', '勝利'],
    uprightMeaning: '強い意志、前進する力、自己統制、勝利と成功',
    reversedMeaning: '統制の欠如、意志薄弱、方向性の混乱、敗北',
    imageUrl: '/tarot/major/07-chariot.jpg'
  },
  {
    id: 8,
    name: 'Strength',
    arcana: 'major',
    keywords: ['内なる力', '勇気', '忍耐', '慈悲'],
    uprightMeaning: '内なる力、勇気、忍耐、慈悲の心、精神的な強さ',
    reversedMeaning: '弱さ、恐れ、忍耐力の欠如、内なる対立',
    imageUrl: '/tarot/major/08-strength.jpg'
  },
  {
    id: 9,
    name: 'The Hermit',
    arcana: 'major',
    keywords: ['内省', '孤独', '導き', '智慧'],
    uprightMeaning: '内省、精神的な探求、内なる導き、智慧の獲得',
    reversedMeaning: '孤立、内向的すぎる、導きの拒否、智慧の無視',
    imageUrl: '/tarot/major/09-hermit.jpg'
  },
  {
    id: 10,
    name: 'Wheel of Fortune',
    arcana: 'major',
    keywords: ['運命', '変化', 'サイクル', '機会'],
    uprightMeaning: '運命の輪、変化の時、サイクルの完了、新しい機会',
    reversedMeaning: '悪運、停滞、機会の逸失、運命への抵抗',
    imageUrl: '/tarot/major/10-wheel-of-fortune.jpg'
  },
  {
    id: 11,
    name: 'Justice',
    arcana: 'major',
    keywords: ['正義', 'バランス', '真実', '公正'],
    uprightMeaning: '正義、公正さ、バランス、真実、因果応報',
    reversedMeaning: '不正、偏見、不公平、真実の隠蔽、バランスの欠如',
    imageUrl: '/tarot/major/11-justice.jpg'
  },
  {
    id: 12,
    name: 'The Hanged Man',
    arcana: 'major',
    keywords: ['犠牲', '忍耐', '新しい視点', '放棄'],
    uprightMeaning: '犠牲、忍耐、新しい視点、手放すこと、精神的な成長',
    reversedMeaning: '無意味な犠牲、停滞、視点の固着、手放せない',
    imageUrl: '/tarot/major/12-hanged-man.jpg'
  },
  {
    id: 13,
    name: 'Death',
    arcana: 'major',
    keywords: ['変化', '終了', '再生', '変容'],
    uprightMeaning: '変化、終了と新しい始まり、変容、再生、手放し',
    reversedMeaning: '変化への抵抗、停滞、終了の恐れ、過去への執着',
    imageUrl: '/tarot/major/13-death.jpg'
  },
  {
    id: 14,
    name: 'Temperance',
    arcana: 'major',
    keywords: ['調和', '節制', 'バランス', '統合'],
    uprightMeaning: '調和、節制、バランス、統合、中庸の道',
    reversedMeaning: '不調和、過度、バランスの欠如、統合の失敗',
    imageUrl: '/tarot/major/14-temperance.jpg'
  },
  {
    id: 15,
    name: 'The Devil',
    arcana: 'major',
    keywords: ['束縛', '誘惑', '物質主義', '依存'],
    uprightMeaning: '束縛、誘惑、物質主義、依存、制限された思考',
    reversedMeaning: '解放、誘惑からの脱出、精神的な自由、制限の打破',
    imageUrl: '/tarot/major/15-devil.jpg'
  },
  {
    id: 16,
    name: 'The Tower',
    arcana: 'major',
    keywords: ['破壊', '突然の変化', '啓示', '解放'],
    uprightMeaning: '突然の変化、破壊、啓示、古い構造の崩壊',
    reversedMeaning: '変化への抵抗、内なる変革、避けられない破壊',
    imageUrl: '/tarot/major/16-tower.jpg'
  },
  {
    id: 17,
    name: 'The Star',
    arcana: 'major',
    keywords: ['希望', 'インスピレーション', '癒し', '導き'],
    uprightMeaning: '希望、インスピレーション、癒し、精神的な導き',
    reversedMeaning: '絶望、希望の欠如、方向性の喪失、癒しの拒否',
    imageUrl: '/tarot/major/17-star.jpg'
  },
  {
    id: 18,
    name: 'The Moon',
    arcana: 'major',
    keywords: ['幻想', '無意識', '不安', '直感'],
    uprightMeaning: '幻想、無意識、不安、直感、隠された真実',
    reversedMeaning: '幻想からの目覚め、真実の明確化、不安の解消',
    imageUrl: '/tarot/major/18-moon.jpg'
  },
  {
    id: 19,
    name: 'The Sun',
    arcana: 'major',
    keywords: ['成功', '喜び', '活力', '明確性'],
    uprightMeaning: '成功、喜び、活力、明確性、ポジティブエネルギー',
    reversedMeaning: '成功の遅れ、喜びの欠如、エネルギー不足、曇った判断',
    imageUrl: '/tarot/major/19-sun.jpg'
  },
  {
    id: 20,
    name: 'Judgement',
    arcana: 'major',
    keywords: ['審判', '復活', '覚醒', '呼び出し'],
    uprightMeaning: '審判、復活、精神的覚醒、高次の呼び出し',
    reversedMeaning: '審判の回避、自己批判、覚醒の拒否、呼び出しの無視',
    imageUrl: '/tarot/major/20-judgement.jpg'
  },
  {
    id: 21,
    name: 'The World',
    arcana: 'major',
    keywords: ['完成', '達成', '統合', '全体性'],
    uprightMeaning: '完成、達成、統合、全体性、サイクルの完了',
    reversedMeaning: '未完成、達成の遅れ、統合の欠如、中途半端',
    imageUrl: '/tarot/major/21-world.jpg'
  }
];

/**
 * 小アルカナ - カップ（感情・愛情）
 */
export const CUPS_CARDS: TarotCard[] = [
  {
    id: 101, name: 'Ace of Cups', arcana: 'minor', suit: 'cups', number: 1,
    keywords: ['新しい愛', '感情の始まり', '直感', '創造性'],
    uprightMeaning: '新しい愛の始まり、感情の高まり、直感の覚醒、創造的なインスピレーション',
    reversedMeaning: '感情の抑圧、愛の拒否、創造性の枯渇、直感の無視',
    imageUrl: '/tarot/cups/ace.jpg'
  },
  {
    id: 102, name: 'Two of Cups', arcana: 'minor', suit: 'cups', number: 2,
    keywords: ['パートナーシップ', '愛', '協力', '結びつき'],
    uprightMeaning: 'パートナーシップ、愛の結びつき、協力関係、相互理解',
    reversedMeaning: '関係の破綻、愛の終わり、協力の欠如、誤解',
    imageUrl: '/tarot/cups/two.jpg'
  },
  {
    id: 103, name: 'Three of Cups', arcana: 'minor', suit: 'cups', number: 3,
    keywords: ['友情', '祝祭', '共同体', '喜び'],
    uprightMeaning: '友情、祝祭、共同体での喜び、社交的な成功',
    reversedMeaning: '友情の問題、孤立、祝祭の中止、社交的な失敗',
    imageUrl: '/tarot/cups/three.jpg'
  },
  {
    id: 110, name: 'Ten of Cups', arcana: 'minor', suit: 'cups', number: 10,
    keywords: ['家族の幸せ', '感情的な充実', '調和', '満足'],
    uprightMeaning: '家族の幸せ、感情的な充実、調和、長期的な満足',
    reversedMeaning: '家族の不和、感情的な不満、調和の欠如、表面的な幸せ',
    imageUrl: '/tarot/cups/ten.jpg'
  }
];

/**
 * タロットスプレッド定義
 */
export const TAROT_SPREADS: { [key: string]: TarotSpread } = {
  'single_card': {
    name: '一枚引き',
    positions: ['メッセージ'],
    description: 'シンプルな一枚引きで今必要なメッセージを受け取ります。'
  },
  'three_card': {
    name: '過去・現在・未来',
    positions: ['過去', '現在', '未来'],
    description: 'シンプルな3枚引きで時間の流れを読み解きます。過去の影響、現在の状況、未来の可能性を示します。'
  },
  'five_card': {
    name: '5枚スプレッド',
    positions: ['現在の状況', '過去の影響', '未来の可能性', '行動指針', '最終結果'],
    description: '詳細な5枚スプレッドで状況を多角的に分析します。'
  },
  'celtic_cross': {
    name: 'ケルト十字',
    positions: [
      '現在の状況',
      '障害・チャレンジ', 
      '遠い過去',
      '近い過去',
      '可能な未来',
      '近い未来',
      'あなたのアプローチ',
      '外的影響',
      '希望と恐れ',
      '最終結果'
    ],
    description: '最も詳細な10枚スプレッド。複雑な状況を多角的に分析し、深い洞察を提供します。'
  },
  'horseshoe': {
    name: 'ホースシュー（馬蹄）',
    positions: ['過去', '現在', '隠れた影響', '障害', 'あなたの立場', '外部の影響', '最終結果'],
    description: '馬蹄型の7枚スプレッド。幅広い視点から状況を分析します。'
  }
};

/**
 * 全カードデータ（大アルカナ + 小アルカナの一部）
 * 本格実装では78枚すべてを定義
 */
export const ALL_CARDS: TarotCard[] = [
  ...MAJOR_ARCANA,
  ...CUPS_CARDS
  // 実装を簡略化のため、一部のカードのみ含める
  // 本格版では全78枚（大アルカナ22枚 + 小アルカナ56枚）を含める
];