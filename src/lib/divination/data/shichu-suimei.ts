// 四柱推命の完全データ定義

// 天干（10個）
export interface TenkanElement {
  id: string;
  name: string;
  element: string;
  yinYang: '陽' | '陰';
  number: number;
  nature: string;
  season: string;
  direction: string;
  color: string;
  organ: string;
  personality: string[];
}

export const tenkan: Record<string, TenkanElement> = {
  '甲': {
    id: 'kinoe',
    name: '甲',
    element: '木',
    yinYang: '陽',
    number: 1,
    nature: '大木、成長、向上心',
    season: '春',
    direction: '東',
    color: '青緑',
    organ: '肝臓',
    personality: ['リーダーシップ', '向上心', '正直', '頑固']
  },
  '乙': {
    id: 'kinoto',
    name: '乙',
    element: '木',
    yinYang: '陰',
    number: 2,
    nature: '草花、柔軟性、協調性',
    season: '春',
    direction: '東',
    color: '緑',
    organ: '肝臓',
    personality: ['柔軟性', '協調性', '繊細', '優柔不断']
  },
  '丙': {
    id: 'hinoe',
    name: '丙',
    element: '火',
    yinYang: '陽',
    number: 3,
    nature: '太陽、情熱、明朗',
    season: '夏',
    direction: '南',
    color: '赤',
    organ: '心臓',
    personality: ['情熱的', '明朗', '派手', '短気']
  },
  '丁': {
    id: 'hinoto',
    name: '丁',
    element: '火',
    yinYang: '陰',
    number: 4,
    nature: 'ろうそく、繊細、温かみ',
    season: '夏',
    direction: '南',
    color: '紫赤',
    organ: '心臓',
    personality: ['繊細', '温かい', '芸術的', '神経質']
  },
  '戊': {
    id: 'tsuchinoe',
    name: '戊',
    element: '土',
    yinYang: '陽',
    number: 5,
    nature: '山、安定、信頼',
    season: '土用',
    direction: '中央',
    color: '黄',
    organ: '脾臓',
    personality: ['安定', '信頼', '頑固', '保守的']
  },
  '己': {
    id: 'tsuchinoto',
    name: '己',
    element: '土',
    yinYang: '陰',
    number: 6,
    nature: '田畑、育成、包容力',
    season: '土用',
    direction: '中央',
    color: '茶',
    organ: '脾臓',
    personality: ['包容力', '世話好き', '心配性', '執着']
  },
  '庚': {
    id: 'kanoe',
    name: '庚',
    element: '金',
    yinYang: '陽',
    number: 7,
    nature: '刀剣、決断力、正義',
    season: '秋',
    direction: '西',
    color: '白',
    organ: '肺',
    personality: ['決断力', '正義感', '頑固', '批判的']
  },
  '辛': {
    id: 'kanoto',
    name: '辛',
    element: '金',
    yinYang: '陰',
    number: 8,
    nature: '宝石、繊細、美意識',
    season: '秋',
    direction: '西',
    color: '銀',
    organ: '肺',
    personality: ['美意識', '繊細', 'プライド高い', '神経質']
  },
  '壬': {
    id: 'mizunoe',
    name: '壬',
    element: '水',
    yinYang: '陽',
    number: 9,
    nature: '大河、知恵、流動性',
    season: '冬',
    direction: '北',
    color: '黒',
    organ: '腎臓',
    personality: ['知的', '流動的', '気まぐれ', '冷静']
  },
  '癸': {
    id: 'mizunoto',
    name: '癸',
    element: '水',
    yinYang: '陰',
    number: 10,
    nature: '雨露、浄化、直感',
    season: '冬',
    direction: '北',
    color: '灰',
    organ: '腎臓',
    personality: ['直感的', '浄化', '内向的', '感受性豊か']
  }
};

// 地支（12個）
export interface ChishiElement {
  id: string;
  name: string;
  animal: string;
  element: string;
  yinYang: '陽' | '陰';
  number: number;
  time: string;
  month: number;
  direction: string;
  season: string;
  hiddenStems: string[];
  personality: string[];
}

export const chishi: Record<string, ChishiElement> = {
  '子': {
    id: 'ne',
    name: '子',
    animal: '鼠',
    element: '水',
    yinYang: '陽',
    number: 1,
    time: '23:00-01:00',
    month: 11,
    direction: '北',
    season: '冬',
    hiddenStems: ['癸'],
    personality: ['機敏', '適応力', '社交的', '神経質']
  },
  '丑': {
    id: 'ushi',
    name: '丑',
    animal: '牛',
    element: '土',
    yinYang: '陰',
    number: 2,
    time: '01:00-03:00',
    month: 12,
    direction: '北北東',
    season: '冬',
    hiddenStems: ['己', '癸', '辛'],
    personality: ['忍耐強い', '努力家', '頑固', '保守的']
  },
  '寅': {
    id: 'tora',
    name: '寅',
    animal: '虎',
    element: '木',
    yinYang: '陽',
    number: 3,
    time: '03:00-05:00',
    month: 1,
    direction: '東北東',
    season: '春',
    hiddenStems: ['甲', '丙', '戊'],
    personality: ['勇敢', '行動的', '短気', '独立心']
  },
  '卯': {
    id: 'u',
    name: '卯',
    animal: '兎',
    element: '木',
    yinYang: '陰',
    number: 4,
    time: '05:00-07:00',
    month: 2,
    direction: '東',
    season: '春',
    hiddenStems: ['乙'],
    personality: ['温和', '繊細', '芸術的', '優柔不断']
  },
  '辰': {
    id: 'tatsu',
    name: '辰',
    animal: '龍',
    element: '土',
    yinYang: '陽',
    number: 5,
    time: '07:00-09:00',
    month: 3,
    direction: '東南東',
    season: '春',
    hiddenStems: ['戊', '乙', '癸'],
    personality: ['理想主義', 'カリスマ', '自信家', 'プライド高い']
  },
  '巳': {
    id: 'mi',
    name: '巳',
    animal: '蛇',
    element: '火',
    yinYang: '陰',
    number: 6,
    time: '09:00-11:00',
    month: 4,
    direction: '南南東',
    season: '夏',
    hiddenStems: ['丙', '戊', '庚'],
    personality: ['直感的', '神秘的', '執念深い', '洞察力']
  },
  '午': {
    id: 'uma',
    name: '午',
    animal: '馬',
    element: '火',
    yinYang: '陽',
    number: 7,
    time: '11:00-13:00',
    month: 5,
    direction: '南',
    season: '夏',
    hiddenStems: ['丁', '己'],
    personality: ['情熱的', '行動力', '短気', '楽観的']
  },
  '未': {
    id: 'hitsuji',
    name: '未',
    animal: '羊',
    element: '土',
    yinYang: '陰',
    number: 8,
    time: '13:00-15:00',
    month: 6,
    direction: '南南西',
    season: '夏',
    hiddenStems: ['己', '丁', '乙'],
    personality: ['温和', '芸術的', '心配性', '依存的']
  },
  '申': {
    id: 'saru',
    name: '申',
    animal: '猿',
    element: '金',
    yinYang: '陽',
    number: 9,
    time: '15:00-17:00',
    month: 7,
    direction: '西南西',
    season: '秋',
    hiddenStems: ['庚', '壬', '戊'],
    personality: ['機敏', '知的', '落ち着きない', '器用']
  },
  '酉': {
    id: 'tori',
    name: '酉',
    animal: '鶏',
    element: '金',
    yinYang: '陰',
    number: 10,
    time: '17:00-19:00',
    month: 8,
    direction: '西',
    season: '秋',
    hiddenStems: ['辛'],
    personality: ['几帳面', '美意識', '批判的', '完璧主義']
  },
  '戌': {
    id: 'inu',
    name: '戌',
    animal: '犬',
    element: '土',
    yinYang: '陽',
    number: 11,
    time: '19:00-21:00',
    month: 9,
    direction: '西北西',
    season: '秋',
    hiddenStems: ['戊', '辛', '丁'],
    personality: ['忠実', '正義感', '頑固', '心配性']
  },
  '亥': {
    id: 'i',
    name: '亥',
    animal: '猪',
    element: '水',
    yinYang: '陰',
    number: 12,
    time: '21:00-23:00',
    month: 10,
    direction: '北北西',
    season: '冬',
    hiddenStems: ['壬', '甲'],
    personality: ['正直', '情熱的', '猪突猛進', '純粋']
  }
};

// 五行相生相剋
export interface ElementRelation {
  element: string;
  generates: string;
  generatedBy: string;
  controls: string;
  controlledBy: string;
  compatible: string[];
  incompatible: string[];
}

export const elementRelations: Record<string, ElementRelation> = {
  '木': {
    element: '木',
    generates: '火',
    generatedBy: '水',
    controls: '土',
    controlledBy: '金',
    compatible: ['水', '火'],
    incompatible: ['金', '土']
  },
  '火': {
    element: '火',
    generates: '土',
    generatedBy: '木',
    controls: '金',
    controlledBy: '水',
    compatible: ['木', '土'],
    incompatible: ['水', '金']
  },
  '土': {
    element: '土',
    generates: '金',
    generatedBy: '火',
    controls: '水',
    controlledBy: '木',
    compatible: ['火', '金'],
    incompatible: ['木', '水']
  },
  '金': {
    element: '金',
    generates: '水',
    generatedBy: '土',
    controls: '木',
    controlledBy: '火',
    compatible: ['土', '水'],
    incompatible: ['火', '木']
  },
  '水': {
    element: '水',
    generates: '木',
    generatedBy: '金',
    controls: '火',
    controlledBy: '土',
    compatible: ['金', '木'],
    incompatible: ['土', '火']
  }
};

// 通変星
export interface TsuhenStar {
  name: string;
  meaning: string;
  personality: string[];
  career: string[];
  relationship: string;
}

export const tsuhenStars: Record<string, TsuhenStar> = {
  '比肩': {
    name: '比肩',
    meaning: '自我、独立、競争',
    personality: ['独立心', '自信', '競争心', '頑固'],
    career: ['起業家', '自営業', 'スポーツ選手', '営業'],
    relationship: '対等な関係を求める、独立性重視'
  },
  '劫財': {
    name: '劫財',
    meaning: '協力、社交、野心',
    personality: ['社交的', '野心的', '行動力', '浪費傾向'],
    career: ['営業', 'マーケティング', '政治家', '芸能'],
    relationship: '情熱的だが不安定、刺激を求める'
  },
  '食神': {
    name: '食神',
    meaning: '表現、創造、楽しみ',
    personality: ['楽観的', '創造的', '表現力', '享楽的'],
    career: ['芸術家', '料理人', 'エンターテイナー', 'デザイナー'],
    relationship: '楽しさ重視、自由な関係を好む'
  },
  '傷官': {
    name: '傷官',
    meaning: '才能、批判、変革',
    personality: ['才能豊か', '批判的', '完璧主義', '反骨精神'],
    career: ['専門職', '研究者', '批評家', '改革者'],
    relationship: '理想が高い、批判的になりがち'
  },
  '偏財': {
    name: '偏財',
    meaning: '副収入、人脈、変化',
    personality: ['器用', '人脈豊富', '変化を好む', '浮気性'],
    career: ['投資家', '商売人', 'フリーランス', '仲介業'],
    relationship: '自由恋愛、複数の関係を持ちやすい'
  },
  '正財': {
    name: '正財',
    meaning: '正当な収入、堅実、保守',
    personality: ['堅実', '計画的', '保守的', '倹約家'],
    career: ['会計士', '銀行員', '公務員', '経理'],
    relationship: '真面目な交際、結婚重視'
  },
  '偏官': {
    name: '偏官',
    meaning: '権力、支配、挑戦',
    personality: ['支配的', '挑戦的', '行動力', '短気'],
    career: ['経営者', '軍人', '警察官', 'スポーツ選手'],
    relationship: '支配的、情熱的だが衝突しやすい'
  },
  '正官': {
    name: '正官',
    meaning: '地位、名誉、責任',
    personality: ['責任感', '正義感', '保守的', '権威主義'],
    career: ['管理職', '官僚', '教師', '法律家'],
    relationship: '伝統的、安定した関係を求める'
  },
  '偏印': {
    name: '偏印',
    meaning: '独創性、研究、孤独',
    personality: ['独創的', '研究熱心', '内向的', '変わり者'],
    career: ['研究者', '発明家', '占い師', 'プログラマー'],
    relationship: '精神的つながり重視、独特な関係'
  },
  '印綬': {
    name: '印綬',
    meaning: '知識、学問、保護',
    personality: ['知的', '学問好き', '優しい', '依存的'],
    career: ['教師', '学者', '医師', 'カウンセラー'],
    relationship: '精神的な支えを求める、依存的'
  }
};

// 十二運
export interface JuniUn {
  name: string;
  energy: number;
  meaning: string;
  stage: string;
  advice: string;
}

export const juniUn: Record<string, JuniUn> = {
  '長生': {
    name: '長生',
    energy: 70,
    meaning: '誕生、始まり、成長',
    stage: '赤ちゃん',
    advice: '新しいことを始めるのに良い時期'
  },
  '沐浴': {
    name: '沐浴',
    energy: 40,
    meaning: '不安定、変化、迷い',
    stage: '思春期',
    advice: '焦らず自分探しの時期と受け入れる'
  },
  '冠帯': {
    name: '冠帯',
    energy: 80,
    meaning: '成人、独立、活動',
    stage: '青年期',
    advice: '積極的に行動し成果を上げる時期'
  },
  '建禄': {
    name: '建禄',
    energy: 90,
    meaning: '確立、安定、実力',
    stage: '壮年期',
    advice: '実力を発揮し地位を確立する時期'
  },
  '帝旺': {
    name: '帝旺',
    energy: 100,
    meaning: '頂点、権力、栄光',
    stage: '最盛期',
    advice: '頂点にいることを自覚し謙虚に'
  },
  '衰': {
    name: '衰',
    energy: 60,
    meaning: '衰退開始、円熟、引き際',
    stage: '初老期',
    advice: '無理せず経験を活かす時期'
  },
  '病': {
    name: '病',
    energy: 30,
    meaning: '停滞、病気、休息',
    stage: '病気',
    advice: '休息と回復に専念する時期'
  },
  '死': {
    name: '死',
    energy: 10,
    meaning: '終了、変化、再生',
    stage: '死',
    advice: '古いものを手放し新生の準備'
  },
  '墓': {
    name: '墓',
    energy: 20,
    meaning: '保管、内省、準備',
    stage: '埋葬',
    advice: '内面を見つめ力を蓄える時期'
  },
  '絶': {
    name: '絶',
    energy: 5,
    meaning: '消滅、空虚、無',
    stage: '無',
    advice: '執着を手放し新たな始まりを待つ'
  },
  '胎': {
    name: '胎',
    energy: 50,
    meaning: '妊娠、可能性、準備',
    stage: '受胎',
    advice: '新しい可能性を育む時期'
  },
  '養': {
    name: '養',
    energy: 60,
    meaning: '養育、成長、保護',
    stage: '胎児',
    advice: '焦らず着実に成長する時期'
  }
};

// 神殺
export interface Shinsat {
  name: string;
  type: 'good' | 'bad' | 'neutral';
  meaning: string;
  effect: string;
  advice: string;
}

export const shinsatList: Record<string, Shinsat> = {
  '天乙貴人': {
    name: '天乙貴人',
    type: 'good',
    meaning: '最高の吉神、貴人の助け',
    effect: '困難時に助けが現れる、幸運',
    advice: '人脈を大切にし、感謝の心を持つ'
  },
  '天徳貴人': {
    name: '天徳貴人',
    type: 'good',
    meaning: '徳を積む、人格向上',
    effect: '人徳により成功、尊敬される',
    advice: '徳を積み、人のために尽くす'
  },
  '月徳貴人': {
    name: '月徳貴人',
    type: 'good',
    meaning: '母性的な保護、安定',
    effect: '女性の助け、家庭円満',
    advice: '家族を大切にし、優しさを持つ'
  },
  '文昌貴人': {
    name: '文昌貴人',
    type: 'good',
    meaning: '学問、文才、知性',
    effect: '学業成就、文筆の才',
    advice: '学問に励み、知識を深める'
  },
  '華蓋': {
    name: '華蓋',
    type: 'neutral',
    meaning: '孤独、芸術、宗教',
    effect: '芸術的才能、精神性、孤独',
    advice: '芸術や精神世界を探求する'
  },
  '駅馬': {
    name: '駅馬',
    type: 'neutral',
    meaning: '移動、変化、旅行',
    effect: '転居、転職、海外との縁',
    advice: '変化を恐れず、行動範囲を広げる'
  },
  '桃花': {
    name: '桃花',
    type: 'neutral',
    meaning: '恋愛、魅力、人気',
    effect: '異性との縁、芸能の才',
    advice: '魅力を活かしつつ、誠実さを保つ'
  },
  '羊刃': {
    name: '羊刃',
    type: 'bad',
    meaning: '刃物、事故、激しさ',
    effect: '怪我、事故、激しい性格',
    advice: '慎重に行動し、怒りを制御する'
  },
  '劫殺': {
    name: '劫殺',
    type: 'bad',
    meaning: '強奪、損失、災難',
    effect: '金銭損失、盗難、詐欺',
    advice: '用心深く、信頼できる人を選ぶ'
  },
  '亡神': {
    name: '亡神',
    type: 'bad',
    meaning: '喪失、別離、消失',
    effect: '大切なものを失う、別離',
    advice: '執着を手放し、無常を受け入れる'
  }
};

// 六十干支
export interface Kanshi {
  number: number;
  tenkan: string;
  chishi: string;
  name: string;
  nayin: string;
  element: string;
  meaning: string;
}

export const rokujuKanshi: Kanshi[] = [
  { number: 1, tenkan: '甲', chishi: '子', name: '甲子', nayin: '海中金', element: '金', meaning: '新たな60年周期の始まり、革新と創造' },
  { number: 2, tenkan: '乙', chishi: '丑', name: '乙丑', nayin: '海中金', element: '金', meaning: '着実な成長、忍耐と努力' },
  { number: 3, tenkan: '丙', chishi: '寅', name: '丙寅', nayin: '炉中火', element: '火', meaning: '情熱的な行動、勇気と挑戦' },
  { number: 4, tenkan: '丁', chishi: '卯', name: '丁卯', nayin: '炉中火', element: '火', meaning: '繊細な創造性、芸術と美' },
  { number: 5, tenkan: '戊', chishi: '辰', name: '戊辰', nayin: '大林木', element: '木', meaning: '大きな成長、理想と現実の調和' },
  { number: 6, tenkan: '己', chishi: '巳', name: '己巳', nayin: '大林木', element: '木', meaning: '内なる成長、知恵と洞察' },
  { number: 7, tenkan: '庚', chishi: '午', name: '庚午', nayin: '路傍土', element: '土', meaning: '決断と行動、正義の実現' },
  { number: 8, tenkan: '辛', chishi: '未', name: '辛未', nayin: '路傍土', element: '土', meaning: '洗練と調和、美的感覚' },
  { number: 9, tenkan: '壬', chishi: '申', name: '壬申', nayin: '剣鋒金', element: '金', meaning: '知的な活動、機敏と適応' },
  { number: 10, tenkan: '癸', chishi: '酉', name: '癸酉', nayin: '剣鋒金', element: '金', meaning: '直感と精密、完璧の追求' },
  { number: 11, tenkan: '甲', chishi: '戌', name: '甲戌', nayin: '山頭火', element: '火', meaning: '守護と正義、忠誠心' },
  { number: 12, tenkan: '乙', chishi: '亥', name: '乙亥', nayin: '山頭火', element: '火', meaning: '柔軟な強さ、包容力' },
  { number: 13, tenkan: '丙', chishi: '子', name: '丙子', nayin: '澗下水', element: '水', meaning: '流動的な情熱、変化と革新' },
  { number: 14, tenkan: '丁', chishi: '丑', name: '丁丑', nayin: '澗下水', element: '水', meaning: '内なる光、忍耐と洞察' },
  { number: 15, tenkan: '戊', chishi: '寅', name: '戊寅', nayin: '城頭土', element: '土', meaning: '堅固な基盤、建設と保護' },
  { number: 16, tenkan: '己', chishi: '卯', name: '己卯', nayin: '城頭土', element: '土', meaning: '育成と成長、優しさと強さ' },
  { number: 17, tenkan: '庚', chishi: '辰', name: '庚辰', nayin: '白蝋金', element: '金', meaning: '純粋な意志、理想の実現' },
  { number: 18, tenkan: '辛', chishi: '巳', name: '辛巳', nayin: '白蝋金', element: '金', meaning: '洗練された知恵、内面の輝き' },
  { number: 19, tenkan: '壬', chishi: '午', name: '壬午', nayin: '楊柳木', element: '木', meaning: '柔軟な強さ、適応と成長' },
  { number: 20, tenkan: '癸', chishi: '未', name: '癸未', nayin: '楊柳木', element: '木', meaning: '優しい知恵、調和と癒し' },
  { number: 21, tenkan: '甲', chishi: '申', name: '甲申', nayin: '泉中水', element: '水', meaning: '清らかな始まり、純粋と活力' },
  { number: 22, tenkan: '乙', chishi: '酉', name: '乙酉', nayin: '泉中水', element: '水', meaning: '美的感覚、調和と完成' },
  { number: 23, tenkan: '丙', chishi: '戌', name: '丙戌', nayin: '屋上土', element: '土', meaning: '保護と情熱、家族愛' },
  { number: 24, tenkan: '丁', chishi: '亥', name: '丁亥', nayin: '屋上土', element: '土', meaning: '内なる光明、直感と包容' },
  { number: 25, tenkan: '戊', chishi: '子', name: '戊子', nayin: '霹靂火', element: '火', meaning: '突然の変化、革新的な力' },
  { number: 26, tenkan: '己', chishi: '丑', name: '己丑', nayin: '霹靂火', element: '火', meaning: '着実な変革、内なる情熱' },
  { number: 27, tenkan: '庚', chishi: '寅', name: '庚寅', nayin: '松柏木', element: '木', meaning: '不屈の精神、正義と勇気' },
  { number: 28, tenkan: '辛', chishi: '卯', name: '辛卯', nayin: '松柏木', element: '木', meaning: '洗練された美、芸術と調和' },
  { number: 29, tenkan: '壬', chishi: '辰', name: '壬辰', nayin: '長流水', element: '水', meaning: '大きな流れ、知恵と包容' },
  { number: 30, tenkan: '癸', chishi: '巳', name: '癸巳', nayin: '長流水', element: '水', meaning: '深い洞察、神秘と直感' },
  { number: 31, tenkan: '甲', chishi: '午', name: '甲午', nayin: '砂中金', element: '金', meaning: '隠れた才能、潜在能力' },
  { number: 32, tenkan: '乙', chishi: '未', name: '乙未', nayin: '砂中金', element: '金', meaning: '内なる価値、優しさと強さ' },
  { number: 33, tenkan: '丙', chishi: '申', name: '丙申', nayin: '山下火', element: '火', meaning: '活発な知性、機敏と情熱' },
  { number: 34, tenkan: '丁', chishi: '酉', name: '丁酉', nayin: '山下火', element: '火', meaning: '精密な情熱、完璧への追求' },
  { number: 35, tenkan: '戊', chishi: '戌', name: '戊戌', nayin: '平地木', element: '木', meaning: '安定した成長、信頼と保護' },
  { number: 36, tenkan: '己', chishi: '亥', name: '己亥', nayin: '平地木', element: '木', meaning: '豊かな包容力、育成と成長' },
  { number: 37, tenkan: '庚', chishi: '子', name: '庚子', nayin: '壁上土', element: '土', meaning: '新たな決断、革新的な正義' },
  { number: 38, tenkan: '辛', chishi: '丑', name: '辛丑', nayin: '壁上土', element: '土', meaning: '洗練された忍耐、美と堅実' },
  { number: 39, tenkan: '壬', chishi: '寅', name: '壬寅', nayin: '金箔金', element: '金', meaning: '流動的な勇気、知恵と行動' },
  { number: 40, tenkan: '癸', chishi: '卯', name: '癸卯', nayin: '金箔金', element: '金', meaning: '直感的な美、芸術と洞察' },
  { number: 41, tenkan: '甲', chishi: '辰', name: '甲辰', nayin: '覆灯火', element: '火', meaning: '隠された光、潜在的な力' },
  { number: 42, tenkan: '乙', chishi: '巳', name: '乙巳', nayin: '覆灯火', element: '火', meaning: '内なる炎、知恵と成長' },
  { number: 43, tenkan: '丙', chishi: '午', name: '丙午', nayin: '天河水', element: '水', meaning: '天の川の如く、壮大な情熱' },
  { number: 44, tenkan: '丁', chishi: '未', name: '丁未', nayin: '天河水', element: '水', meaning: '優しい光、調和と癒し' },
  { number: 45, tenkan: '戊', chishi: '申', name: '戊申', nayin: '大駅土', element: '土', meaning: '大きな転換点、変化と安定' },
  { number: 46, tenkan: '己', chishi: '酉', name: '己酉', nayin: '大駅土', element: '土', meaning: '完成への道、美と調和' },
  { number: 47, tenkan: '庚', chishi: '戌', name: '庚戌', nayin: '釵釧金', element: '金', meaning: '装飾的な強さ、正義と美' },
  { number: 48, tenkan: '辛', chishi: '亥', name: '辛亥', nayin: '釵釧金', element: '金', meaning: '精錬された知恵、深い洞察' },
  { number: 49, tenkan: '壬', chishi: '子', name: '壬子', nayin: '桑柘木', element: '木', meaning: '新たな成長、知恵の循環' },
  { number: 50, tenkan: '癸', chishi: '丑', name: '癸丑', nayin: '桑柘木', element: '木', meaning: '深い根、忍耐と成長' },
  { number: 51, tenkan: '甲', chishi: '寅', name: '甲寅', nayin: '大渓水', element: '水', meaning: '大河の源流、新たな始まり' },
  { number: 52, tenkan: '乙', chishi: '卯', name: '乙卯', nayin: '大渓水', element: '水', meaning: '清流の美、芸術と調和' },
  { number: 53, tenkan: '丙', chishi: '辰', name: '丙辰', nayin: '沙中土', element: '土', meaning: '隠れた情熱、潜在的な力' },
  { number: 54, tenkan: '丁', chishi: '巳', name: '丁巳', nayin: '沙中土', element: '土', meaning: '内なる火、知恵と洞察' },
  { number: 55, tenkan: '戊', chishi: '午', name: '戊午', nayin: '天上火', element: '火', meaning: '天の火、壮大な理想' },
  { number: 56, tenkan: '己', chishi: '未', name: '己未', nayin: '天上火', element: '火', meaning: '地上の光、調和と育成' },
  { number: 57, tenkan: '庚', chishi: '申', name: '庚申', nayin: '石榴木', element: '木', meaning: '実りある決断、成果と収穫' },
  { number: 58, tenkan: '辛', chishi: '酉', name: '辛酉', nayin: '石榴木', element: '木', meaning: '美しい結実、完成と調和' },
  { number: 59, tenkan: '壬', chishi: '戌', name: '壬戌', nayin: '大海水', element: '水', meaning: '広大な知恵、包容と保護' },
  { number: 60, tenkan: '癸', chishi: '亥', name: '癸亥', nayin: '大海水', element: '水', meaning: '深い海、一周期の完成と新たな始まり' }
];

// 大運計算用のヘルパー関数
export function calculateDaiun(birthYear: number, birthMonth: number, birthDay: number, gender: '男' | '女'): Array<{
  startAge: number;
  tenkan: string;
  chishi: string;
  period: string;
}> {
  // 簡略化された大運計算（実際はもっと複雑）
  const daiun = [];
  const birthKanshi = rokujuKanshi[(birthYear - 4) % 60];
  const isYangYear = ['甲', '丙', '戊', '庚', '壬'].includes(birthKanshi.tenkan);
  const forward = (gender === '男' && isYangYear) || (gender === '女' && !isYangYear);
  
  let currentIndex = rokujuKanshi.findIndex(k => k.name === birthKanshi.name);
  
  for (let i = 0; i < 8; i++) {
    const startAge = i * 10 + 5; // 簡略化
    if (forward) {
      currentIndex = (currentIndex + 10) % 60;
    } else {
      currentIndex = (currentIndex - 10 + 60) % 60;
    }
    
    const kanshi = rokujuKanshi[currentIndex];
    daiun.push({
      startAge,
      tenkan: kanshi.tenkan,
      chishi: kanshi.chishi,
      period: `${startAge}歳〜${startAge + 9}歳`
    });
  }
  
  return daiun;
}

// 相性判定
export function checkCompatibility(person1Elements: string[], person2Elements: string[]): {
  score: number;
  analysis: string;
  advice: string;
} {
  let score = 50; // 基準点
  let positives: string[] = [];
  let negatives: string[] = [];
  
  // 五行の相性をチェック
  person1Elements.forEach(elem1 => {
    person2Elements.forEach(elem2 => {
      const relation = elementRelations[elem1];
      if (relation) {
        if (relation.generates === elem2 || relation.generatedBy === elem2) {
          score += 10;
          positives.push(`${elem1}と${elem2}は相生関係`);
        } else if (relation.controls === elem2 || relation.controlledBy === elem2) {
          score -= 10;
          negatives.push(`${elem1}と${elem2}は相剋関係`);
        }
      }
    });
  });
  
  // スコアを0-100に正規化
  score = Math.max(0, Math.min(100, score));
  
  const analysis = [
    ...positives.map(p => `◎ ${p}`),
    ...negatives.map(n => `△ ${n}`)
  ].join('\n');
  
  let advice = '';
  if (score >= 80) {
    advice = '非常に良い相性です。お互いを高め合える関係です。';
  } else if (score >= 60) {
    advice = '良い相性です。お互いの違いを認め合うことで成長できます。';
  } else if (score >= 40) {
    advice = '普通の相性です。努力と理解によって良い関係を築けます。';
  } else {
    advice = '課題のある相性です。お互いの個性を尊重し、歩み寄ることが大切です。';
  }
  
  return { score, analysis, advice };
}