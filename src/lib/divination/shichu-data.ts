// 四柱推命データ

export interface YearStemBranchData {
  year: number;
  stem: string;
  branch: string;
  element: string;
  description: string;
}

export const YearStemBranch: YearStemBranchData[] = [
  // 甲子から癸亥まで60年周期のサンプル（1984-2043年）
  { year: 1984, stem: '甲', branch: '子', element: '金', description: '海中金' },
  { year: 1985, stem: '乙', branch: '丑', element: '金', description: '海中金' },
  { year: 1986, stem: '丙', branch: '寅', element: '火', description: '炉中火' },
  { year: 1987, stem: '丁', branch: '卯', element: '火', description: '炉中火' },
  { year: 1988, stem: '戊', branch: '辰', element: '木', description: '大林木' },
  { year: 1989, stem: '己', branch: '巳', element: '木', description: '大林木' },
  { year: 1990, stem: '庚', branch: '午', element: '土', description: '路傍土' },
  { year: 1991, stem: '辛', branch: '未', element: '土', description: '路傍土' },
  { year: 1992, stem: '壬', branch: '申', element: '金', description: '剣鋒金' },
  { year: 1993, stem: '癸', branch: '酉', element: '金', description: '剣鋒金' },
  { year: 1994, stem: '甲', branch: '戌', element: '火', description: '山頭火' },
  { year: 1995, stem: '乙', branch: '亥', element: '火', description: '山頭火' },
  { year: 1996, stem: '丙', branch: '子', element: '水', description: '澗下水' },
  { year: 1997, stem: '丁', branch: '丑', element: '水', description: '澗下水' },
  { year: 1998, stem: '戊', branch: '寅', element: '土', description: '城牆土' },
  { year: 1999, stem: '己', branch: '卯', element: '土', description: '城牆土' },
  { year: 2000, stem: '庚', branch: '辰', element: '金', description: '白蝋金' },
  { year: 2001, stem: '辛', branch: '巳', element: '金', description: '白蝋金' },
  { year: 2002, stem: '壬', branch: '午', element: '木', description: '楊柳木' },
  { year: 2003, stem: '癸', branch: '未', element: '木', description: '楊柳木' },
  { year: 2004, stem: '甲', branch: '申', element: '水', description: '泉中水' },
  { year: 2005, stem: '乙', branch: '酉', element: '水', description: '泉中水' },
  { year: 2006, stem: '丙', branch: '戌', element: '土', description: '屋上土' },
  { year: 2007, stem: '丁', branch: '亥', element: '土', description: '屋上土' },
  { year: 2008, stem: '戊', branch: '子', element: '火', description: '霹靂火' },
  { year: 2009, stem: '己', branch: '丑', element: '火', description: '霹靂火' },
  { year: 2010, stem: '庚', branch: '寅', element: '木', description: '松柏木' },
  { year: 2011, stem: '辛', branch: '卯', element: '木', description: '松柏木' },
  { year: 2012, stem: '壬', branch: '辰', element: '水', description: '長流水' },
  { year: 2013, stem: '癸', branch: '巳', element: '水', description: '長流水' },
  { year: 2014, stem: '甲', branch: '午', element: '金', description: '砂中金' },
  { year: 2015, stem: '乙', branch: '未', element: '金', description: '砂中金' },
  { year: 2016, stem: '丙', branch: '申', element: '火', description: '山下火' },
  { year: 2017, stem: '丁', branch: '酉', element: '火', description: '山下火' },
  { year: 2018, stem: '戊', branch: '戌', element: '木', description: '平地木' },
  { year: 2019, stem: '己', branch: '亥', element: '木', description: '平地木' },
  { year: 2020, stem: '庚', branch: '子', element: '土', description: '壁上土' },
  { year: 2021, stem: '辛', branch: '丑', element: '土', description: '壁上土' },
  { year: 2022, stem: '壬', branch: '寅', element: '金', description: '金箔金' },
  { year: 2023, stem: '癸', branch: '卯', element: '金', description: '金箔金' },
  { year: 2024, stem: '甲', branch: '辰', element: '火', description: '覆燈火' },
  { year: 2025, stem: '乙', branch: '巳', element: '火', description: '覆燈火' },
  { year: 2026, stem: '丙', branch: '午', element: '水', description: '天河水' },
  { year: 2027, stem: '丁', branch: '未', element: '水', description: '天河水' },
  { year: 2028, stem: '戊', branch: '申', element: '土', description: '大駅土' },
  { year: 2029, stem: '己', branch: '酉', element: '土', description: '大駅土' },
  { year: 2030, stem: '庚', branch: '戌', element: '金', description: '釵釧金' },
  { year: 2031, stem: '辛', branch: '亥', element: '金', description: '釵釧金' },
  { year: 2032, stem: '壬', branch: '子', element: '木', description: '桑柘木' },
  { year: 2033, stem: '癸', branch: '丑', element: '木', description: '桑柘木' },
  { year: 2034, stem: '甲', branch: '寅', element: '水', description: '大溪水' },
  { year: 2035, stem: '乙', branch: '卯', element: '水', description: '大溪水' },
  { year: 2036, stem: '丙', branch: '辰', element: '土', description: '沙中土' },
  { year: 2037, stem: '丁', branch: '巳', element: '土', description: '沙中土' },
  { year: 2038, stem: '戊', branch: '午', element: '火', description: '天上火' },
  { year: 2039, stem: '己', branch: '未', element: '火', description: '天上火' },
  { year: 2040, stem: '庚', branch: '申', element: '木', description: '石榴木' },
  { year: 2041, stem: '辛', branch: '酉', element: '木', description: '石榴木' },
  { year: 2042, stem: '壬', branch: '戌', element: '水', description: '大海水' },
  { year: 2043, stem: '癸', branch: '亥', element: '水', description: '大海水' }
];

export interface StemBranchCombination {
  stem: string;
  branch: string;
  combination: string;
  effect: string;
  fortune: 'great' | 'good' | 'neutral' | 'bad' | 'terrible';
  description: string;
}

export const StemBranchCombinations: StemBranchCombination[] = [
  // 干合
  {
    stem: '甲',
    branch: '己',
    combination: '甲己合土',
    effect: '中正',
    fortune: 'good',
    description: '中庸で安定した運勢。誠実さが評価される。'
  },
  {
    stem: '乙',
    branch: '庚',
    combination: '乙庚合金',
    effect: '義',
    fortune: 'good',
    description: '正義感が強く、リーダーシップを発揮する。'
  },
  {
    stem: '丙',
    branch: '辛',
    combination: '丙辛合水',
    effect: '威',
    fortune: 'great',
    description: '威厳があり、権威的地位を得る可能性。'
  },
  {
    stem: '丁',
    branch: '壬',
    combination: '丁壬合木',
    effect: '仁',
    fortune: 'good',
    description: '慈悲深く、人を導く力がある。'
  },
  {
    stem: '戊',
    branch: '癸',
    combination: '戊癸合火',
    effect: '智',
    fortune: 'good',
    description: '知恵と洞察力に優れ、学問で成功する。'
  },
  
  // 支合
  {
    stem: '子',
    branch: '丑',
    combination: '子丑合土',
    effect: '土生金',
    fortune: 'good',
    description: '基盤が安定し、着実な成長が期待できる。'
  },
  {
    stem: '寅',
    branch: '亥',
    combination: '寅亥合木',
    effect: '木生火',
    fortune: 'great',
    description: '創造力と行動力が融合し、大きな成功を収める。'
  },
  {
    stem: '卯',
    branch: '戌',
    combination: '卯戌合火',
    effect: '火生土',
    fortune: 'good',
    description: '情熱的で温和、多くの人に愛される。'
  },
  {
    stem: '辰',
    branch: '酉',
    combination: '辰酉合金',
    effect: '金生水',
    fortune: 'good',
    description: '知的で冷静、計画性を持って目標を達成する。'
  },
  {
    stem: '巳',
    branch: '申',
    combination: '巳申合水',
    effect: '水生木',
    fortune: 'neutral',
    description: '変化に富み、適応力があるが不安定な面も。'
  },
  {
    stem: '午',
    branch: '未',
    combination: '午未合土',
    effect: '土生金',
    fortune: 'good',
    description: '温和で協調性があり、安定した人間関係を築く。'
  },
  
  // 三合
  {
    stem: '申',
    branch: '子',
    combination: '申子辰三合水局',
    effect: '水',
    fortune: 'great',
    description: '知恵と流動性に富み、変化を活かして成功する。'
  },
  {
    stem: '寅',
    branch: '午',
    combination: '寅午戌三合火局',
    effect: '火',
    fortune: 'great',
    description: '情熱的で行動力があり、リーダーシップを発揮する。'
  },
  {
    stem: '亥',
    branch: '卯',
    combination: '亥卯未三合木局',
    effect: '木',
    fortune: 'great',
    description: '成長力と創造力に優れ、継続的な発展を遂げる。'
  },
  {
    stem: '巳',
    branch: '酉',
    combination: '巳酉丑三合金局',
    effect: '金',
    fortune: 'good',
    description: '堅実で規律正しく、確実に目標を達成する。'
  },
  
  // 六冲
  {
    stem: '子',
    branch: '午',
    combination: '子午冲',
    effect: '水火相冲',
    fortune: 'bad',
    description: '激しい変化と対立、感情の起伏が激しい。'
  },
  {
    stem: '丑',
    branch: '未',
    combination: '丑未冲',
    effect: '土土相冲',
    fortune: 'bad',
    description: '固執と変化の対立、判断に迷いやすい。'
  },
  {
    stem: '寅',
    branch: '申',
    combination: '寅申冲',
    effect: '木金相冲',
    fortune: 'bad',
    description: '成長と制約の対立、ストレスを感じやすい。'
  },
  {
    stem: '卯',
    branch: '酉',
    combination: '卯酉冲',
    effect: '木金相冲',
    fortune: 'bad',
    description: '創造性と規律の衝突、完璧主義に陥りやすい。'
  },
  {
    stem: '辰',
    branch: '戌',
    combination: '辰戌冲',
    effect: '土土相冲',
    fortune: 'bad',
    description: '保守と革新の対立、方向性に迷う。'
  },
  {
    stem: '巳',
    branch: '亥',
    combination: '巳亥冲',
    effect: '火水相冲',
    fortune: 'terrible',
    description: '極端な性格、激しい変動と不安定性。'
  }
];

export interface FortuneCycleData {
  age: number;
  period: string;
  characteristics: string[];
  advice: string;
  caution: string;
}

export const FortuneCycle: FortuneCycleData[] = [
  {
    age: 8,
    period: '第一大運（8-17歳）',
    characteristics: ['学習期', '基礎形成', '性格確立'],
    advice: '基礎学力をしっかり身につけ、良い習慣を作ることが重要です。',
    caution: '悪い環境や友人関係に注意してください。'
  },
  {
    age: 18,
    period: '第二大運（18-27歳）',
    characteristics: ['青春期', '挑戦', '恋愛'],
    advice: '積極的に挑戦し、多くの経験を積むことで成長できます。',
    caution: '無謀な冒険や軽率な判断は避けましょう。'
  },
  {
    age: 28,
    period: '第三大運（28-37歳）',
    characteristics: ['成熟期', 'キャリア形成', '結婚'],
    advice: 'キャリアを築き、人生の基盤を固める重要な時期です。',
    caution: '仕事と私生活のバランスを大切にしてください。'
  },
  {
    age: 38,
    period: '第四大運（38-47歳）',
    characteristics: ['発展期', '責任増大', '子育て'],
    advice: '責任ある立場で活躍し、社会貢献を意識しましょう。',
    caution: 'ストレスや健康管理に十分注意が必要です。'
  },
  {
    age: 48,
    period: '第五大運（48-57歳）',
    characteristics: ['充実期', '安定', '指導'],
    advice: '経験を活かして後進を指導し、社会に還元しましょう。',
    caution: '固定観念にとらわれず、新しい考えも受け入れてください。'
  },
  {
    age: 58,
    period: '第六大運（58-67歳）',
    characteristics: ['転換期', '人生の見直し', '健康重視'],
    advice: '人生を振り返り、これからの生き方を見直す時期です。',
    caution: '健康管理を最優先に、無理は禁物です。'
  },
  {
    age: 68,
    period: '第七大運（68-77歳）',
    characteristics: ['円熟期', '知恵の活用', '精神的充実'],
    advice: '培った知恵を活かし、精神的な豊かさを追求しましょう。',
    caution: '体力的な限界を認識し、適度な活動を心がけてください。'
  },
  {
    age: 78,
    period: '第八大運（78歳以降）',
    characteristics: ['安穏期', '悟り', '感謝'],
    advice: '穏やかに過ごし、これまでの人生に感謝の気持ちを持ちましょう。',
    caution: '家族や周囲の支援を素直に受け入れることが大切です。'
  }
];