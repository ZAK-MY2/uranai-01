// ヴェーダ占星術データ

export interface VedicSignData {
  name: string;
  element: string;
  quality: string;
  lord: string;
  characteristics: string[];
  strengths: string[];
  weaknesses: string[];
}

export const VedicSigns: VedicSignData[] = [
  {
    name: 'Aries',
    element: 'Fire',
    quality: 'Cardinal',
    lord: 'Mars',
    characteristics: ['積極的', '勇敢', 'リーダー気質', '行動的'],
    strengths: ['勇気', '決断力', 'パイオニア精神', '独立性'],
    weaknesses: ['衝動的', '短気', '自己中心的', '忍耐力不足']
  },
  {
    name: 'Taurus',
    element: 'Earth',
    quality: 'Fixed',
    lord: 'Venus',
    characteristics: ['安定', '実用的', '美を愛する', '忍耐強い'],
    strengths: ['信頼性', '持続力', '実用性', '美的センス'],
    weaknesses: ['頑固', '変化を嫌う', '物質主義', '遅い']
  },
  {
    name: 'Gemini',
    element: 'Air',
    quality: 'Mutable',
    lord: 'Mercury',
    characteristics: ['知的', 'コミュニケーション', '好奇心', '多様性'],
    strengths: ['適応性', '知性', '表現力', '学習能力'],
    weaknesses: ['一貫性不足', '表面的', '神経質', '集中力不足']
  },
  {
    name: 'Cancer',
    element: 'Water',
    quality: 'Cardinal',
    lord: 'Moon',
    characteristics: ['感情的', '直感的', '保護的', '家庭的'],
    strengths: ['共感性', '直感力', '養育本能', '記憶力'],
    weaknesses: ['感情的不安定', '過敏', '防御的', '過去にとらわれる']
  },
  {
    name: 'Leo',
    element: 'Fire',
    quality: 'Fixed',
    lord: 'Sun',
    characteristics: ['自信', '創造的', '寛大', 'リーダーシップ'],
    strengths: ['自信', '創造性', '寛大さ', 'カリスマ'],
    weaknesses: ['プライド', '自己中心的', '支配的', '見栄っ張り']
  },
  {
    name: 'Virgo',
    element: 'Earth',
    quality: 'Mutable',
    lord: 'Mercury',
    characteristics: ['分析的', '完璧主義', '実用的', '奉仕的'],
    strengths: ['分析力', '効率性', '実用性', '責任感'],
    weaknesses: ['完璧主義', '批判的', '心配性', '細かすぎる']
  },
  {
    name: 'Libra',
    element: 'Air',
    quality: 'Cardinal',
    lord: 'Venus',
    characteristics: ['調和', '美的', '社交的', 'バランス'],
    strengths: ['調和', '美的センス', '公平性', '社交性'],
    weaknesses: ['優柔不断', '対立回避', '依存的', '表面的']
  },
  {
    name: 'Scorpio',
    element: 'Water',
    quality: 'Fixed',
    lord: 'Mars',
    characteristics: ['強烈', '神秘的', '変容', '深い'],
    strengths: ['洞察力', '決意', '変容力', '忠誠心'],
    weaknesses: ['嫉妬', '復讐心', '秘密主義', '極端']
  },
  {
    name: 'Sagittarius',
    element: 'Fire',
    quality: 'Mutable',
    lord: 'Jupiter',
    characteristics: ['楽観的', '哲学的', '冒険的', '自由'],
    strengths: ['楽観性', '知恵', '冒険心', '正直さ'],
    weaknesses: ['無責任', '誇張', '軽率', '約束を守らない']
  },
  {
    name: 'Capricorn',
    element: 'Earth',
    quality: 'Cardinal',
    lord: 'Saturn',
    characteristics: ['野心的', '実用的', '責任感', '伝統的'],
    strengths: ['野心', '実用性', '責任感', '持続力'],
    weaknesses: ['悲観的', '厳格', '物質主義', '感情抑制']
  },
  {
    name: 'Aquarius',
    element: 'Air',
    quality: 'Fixed',
    lord: 'Saturn',
    characteristics: ['独立', '革新的', '人道的', '未来志向'],
    strengths: ['独立性', '革新性', '人道主義', 'ビジョン'],
    weaknesses: ['感情的距離', '頑固', '予測不能', '孤立']
  },
  {
    name: 'Pisces',
    element: 'Water',
    quality: 'Mutable',
    lord: 'Jupiter',
    characteristics: ['直感的', '慈悲深い', '芸術的', '精神的'],
    strengths: ['直感力', '慈悲', '創造性', '精神性'],
    weaknesses: ['現実逃避', '優柔不断', '犠牲的', '境界が曖昧']
  }
];

export interface NakshatraData {
  name: string;
  startDegree: number;
  endDegree: number;
  lord: string;
  symbol: string;
  deity: string;
  characteristics: string;
  qualities: string[];
  career: string[];
  compatibility: string[];
}

export const Nakshatras: NakshatraData[] = [
  {
    name: 'Ashwini',
    startDegree: 0,
    endDegree: 13.33,
    lord: 'Ketu',
    symbol: 'Horse Head',
    deity: 'Ashwini Kumaras',
    characteristics: '素早い、治癒力がある、冒険的な性格を持ちます。',
    qualities: ['迅速性', '治癒力', '冒険心', '独立性'],
    career: ['医療', '獣医学', '交通業', 'スポーツ'],
    compatibility: ['Bharani', 'Krittika', 'Punarvasu']
  },
  {
    name: 'Bharani',
    startDegree: 13.33,
    endDegree: 26.67,
    lord: 'Venus',
    symbol: 'Yoni',
    deity: 'Yama',
    characteristics: '創造性と破壊性を併せ持つ、強い意志力があります。',
    qualities: ['創造力', '意志力', '責任感', '忍耐力'],
    career: ['芸術', '娯楽業', '法律', '農業'],
    compatibility: ['Ashwini', 'Krittika', 'Rohini']
  },
  {
    name: 'Krittika',
    startDegree: 26.67,
    endDegree: 40,
    lord: 'Sun',
    symbol: 'Knife/Razor',
    deity: 'Agni',
    characteristics: '鋭い知性と判断力、リーダーシップの資質があります。',
    qualities: ['鋭い知性', '判断力', 'リーダーシップ', '純粋性'],
    career: ['軍事', '料理', '金属業', '教育'],
    compatibility: ['Ashwini', 'Bharani', 'Rohini']
  },
  {
    name: 'Rohini',
    startDegree: 40,
    endDegree: 53.33,
    lord: 'Moon',
    symbol: 'Cart/Chariot',
    deity: 'Brahma',
    characteristics: '美的センスがあり、物質的な豊かさを享受します。',
    qualities: ['美的センス', '魅力', '豊かさ', '安定性'],
    career: ['芸術', 'ファッション', '農業', '銀行業'],
    compatibility: ['Bharani', 'Krittika', 'Mrigashira']
  },
  {
    name: 'Mrigashira',
    startDegree: 53.33,
    endDegree: 66.67,
    lord: 'Mars',
    symbol: 'Deer Head',
    deity: 'Soma',
    characteristics: '探求心が強く、知識を求める傾向があります。',
    qualities: ['探求心', '好奇心', '敏感性', '適応性'],
    career: ['研究', '旅行業', '狩猟', '探偵'],
    compatibility: ['Rohini', 'Ardra', 'Punarvasu']
  },
  {
    name: 'Ardra',
    startDegree: 66.67,
    endDegree: 80,
    lord: 'Rahu',
    symbol: 'Teardrop',
    deity: 'Rudra',
    characteristics: '変化と変革を通じて成長する、強い精神力があります。',
    qualities: ['変革力', '精神力', '知性', '適応性'],
    career: ['技術', '科学', '薬学', '心理学'],
    compatibility: ['Mrigashira', 'Punarvasu', 'Pushya']
  },
  {
    name: 'Punarvasu',
    startDegree: 80,
    endDegree: 93.33,
    lord: 'Jupiter',
    symbol: 'Bow and Quiver',
    deity: 'Aditi',
    characteristics: '再生と回復の力があり、楽観的な性格です。',
    qualities: ['再生力', '楽観性', '保護性', '知恵'],
    career: ['教育', '宗教', '旅行業', '不動産'],
    compatibility: ['Ashwini', 'Mrigashira', 'Ardra']
  },
  {
    name: 'Pushya',
    startDegree: 93.33,
    endDegree: 106.67,
    lord: 'Saturn',
    symbol: 'Cow Udder',
    deity: 'Brihaspati',
    characteristics: '養育的で保護的、精神的な成長を重視します。',
    qualities: ['養育性', '保護性', '精神性', '責任感'],
    career: ['教育', '宗教', '政治', '社会奉仕'],
    compatibility: ['Ardra', 'Punarvasu', 'Ashlesha']
  },
  {
    name: 'Ashlesha',
    startDegree: 106.67,
    endDegree: 120,
    lord: 'Mercury',
    symbol: 'Serpent',
    deity: 'Nagas',
    characteristics: '洞察力があり、神秘的な知識を持ちます。',
    qualities: ['洞察力', '神秘性', '知性', '変容力'],
    career: ['医療', '占い', '心理学', '研究'],
    compatibility: ['Punarvasu', 'Pushya', 'Magha']
  },
  {
    name: 'Magha',
    startDegree: 120,
    endDegree: 133.33,
    lord: 'Ketu',
    symbol: 'Royal Throne',
    deity: 'Pitrs',
    characteristics: '高貴で威厳があり、先祖への敬意を持ちます。',
    qualities: ['高貴性', '威厳', '権威', '伝統重視'],
    career: ['政治', '管理職', '王室関連', '歴史研究'],
    compatibility: ['Ashlesha', 'Purva Phalguni', 'Uttara Phalguni']
  },
  {
    name: 'Purva Phalguni',
    startDegree: 133.33,
    endDegree: 146.67,
    lord: 'Venus',
    symbol: 'Front legs of bed',
    deity: 'Bhaga',
    characteristics: '創造的で芸術的、愛と美を追求します。',
    qualities: ['創造性', '芸術性', '愛情', '美的センス'],
    career: ['芸術', '娯楽', 'ファッション', '美容'],
    compatibility: ['Magha', 'Uttara Phalguni', 'Hasta']
  },
  {
    name: 'Uttara Phalguni',
    startDegree: 146.67,
    endDegree: 160,
    lord: 'Sun',
    symbol: 'Back legs of bed',
    deity: 'Aryaman',
    characteristics: '寛大で親切、社会的な責任を重視します。',
    qualities: ['寛大さ', '親切さ', '責任感', '友情'],
    career: ['社会奉仕', '医療', '教育', '慈善事業'],
    compatibility: ['Magha', 'Purva Phalguni', 'Hasta']
  },
  {
    name: 'Hasta',
    startDegree: 160,
    endDegree: 173.33,
    lord: 'Moon',
    symbol: 'Hand',
    deity: 'Savitar',
    characteristics: '器用で技巧的、手先が非常に器用です。',
    qualities: ['器用さ', '技巧性', '実用性', '癒し'],
    career: ['工芸', '医療', 'マッサージ', 'アート'],
    compatibility: ['Purva Phalguni', 'Uttara Phalguni', 'Chitra']
  },
  {
    name: 'Chitra',
    startDegree: 173.33,
    endDegree: 186.67,
    lord: 'Mars',
    symbol: 'Bright jewel',
    deity: 'Tvashtar',
    characteristics: '創造的で美的センスがあり、完璧主義者です。',
    qualities: ['創造性', '美的センス', '完璧主義', '技術力'],
    career: ['建築', 'デザイン', '技術', '宝石商'],
    compatibility: ['Hasta', 'Swati', 'Vishakha']
  },
  {
    name: 'Swati',
    startDegree: 186.67,
    endDegree: 200,
    lord: 'Rahu',
    symbol: 'Young shoot of plant',
    deity: 'Vayu',
    characteristics: '独立心が強く、自由を愛する性格です。',
    qualities: ['独立性', '自由', '適応性', '移動性'],
    career: ['貿易', '旅行', '航空', '通信'],
    compatibility: ['Chitra', 'Vishakha', 'Anuradha']
  },
  {
    name: 'Vishakha',
    startDegree: 200,
    endDegree: 213.33,
    lord: 'Jupiter',
    symbol: 'Triumphal arch',
    deity: 'Indra-Agni',
    characteristics: '野心的で目標達成への強い意志があります。',
    qualities: ['野心', '決意', '達成力', 'エネルギー'],
    career: ['政治', 'ビジネス', '軍事', 'スポーツ'],
    compatibility: ['Swati', 'Anuradha', 'Jyeshtha']
  },
  {
    name: 'Anuradha',
    startDegree: 213.33,
    endDegree: 226.67,
    lord: 'Saturn',
    symbol: 'Lotus flower',
    deity: 'Mitra',
    characteristics: '友情を重視し、調和を愛する性格です。',
    qualities: ['友情', '調和', '献身', '精神性'],
    career: ['外交', '宗教', '心理学', 'カウンセリング'],
    compatibility: ['Vishakha', 'Jyeshtha', 'Mula']
  },
  {
    name: 'Jyeshtha',
    startDegree: 226.67,
    endDegree: 240,
    lord: 'Mercury',
    symbol: 'Circular amulet',
    deity: 'Indra',
    characteristics: '年長者の知恵があり、保護的な性格です。',
    qualities: ['知恵', '保護性', '責任感', '権威'],
    career: ['管理職', '軍事', '警察', '年長者のケア'],
    compatibility: ['Anuradha', 'Mula', 'Purva Ashadha']
  },
  {
    name: 'Mula',
    startDegree: 240,
    endDegree: 253.33,
    lord: 'Ketu',
    symbol: 'Bunch of roots',
    deity: 'Nirriti',
    characteristics: '根本的な真理を探求し、深い洞察力があります。',
    qualities: ['探求心', '洞察力', '根本的思考', '変革力'],
    career: ['研究', '哲学', 'スピリチュアル', '医学'],
    compatibility: ['Jyeshtha', 'Purva Ashadha', 'Uttara Ashadha']
  },
  {
    name: 'Purva Ashadha',
    startDegree: 253.33,
    endDegree: 266.67,
    lord: 'Venus',
    symbol: 'Elephant tusk',
    deity: 'Apas',
    characteristics: '説得力があり、人を鼓舞する能力があります。',
    qualities: ['説得力', '鼓舞力', '美的センス', '浄化力'],
    career: ['教育', '政治', '芸術', '治療'],
    compatibility: ['Mula', 'Uttara Ashadha', 'Shravana']
  },
  {
    name: 'Uttara Ashadha',
    startDegree: 266.67,
    endDegree: 280,
    lord: 'Sun',
    symbol: 'Elephant tusk',
    deity: 'Vishvadevas',
    characteristics: '勝利と成功を収める能力があり、正義感が強いです。',
    qualities: ['勝利', '成功', '正義感', 'リーダーシップ'],
    career: ['政治', '法律', '軍事', '管理職'],
    compatibility: ['Purva Ashadha', 'Shravana', 'Dhanishta']
  },
  {
    name: 'Shravana',
    startDegree: 280,
    endDegree: 293.33,
    lord: 'Moon',
    symbol: 'Ear',
    deity: 'Vishnu',
    characteristics: '聞く能力があり、学習と知識を重視します。',
    qualities: ['聴力', '学習能力', '知識', '伝達力'],
    career: ['教育', 'メディア', '通信', '音楽'],
    compatibility: ['Uttara Ashadha', 'Dhanishta', 'Shatabhisha']
  },
  {
    name: 'Dhanishta',
    startDegree: 293.33,
    endDegree: 306.67,
    lord: 'Mars',
    symbol: 'Drum',
    deity: 'Eight Vasus',
    characteristics: '音楽的才能があり、富と名声を得る能力があります。',
    qualities: ['音楽性', '富', '名声', 'リズム感'],
    career: ['音楽', '芸能', '不動産', 'スポーツ'],
    compatibility: ['Shravana', 'Shatabhisha', 'Purva Bhadrapada']
  },
  {
    name: 'Shatabhisha',
    startDegree: 306.67,
    endDegree: 320,
    lord: 'Rahu',
    symbol: 'Empty circle',
    deity: 'Varuna',
    characteristics: '癒しの能力があり、神秘的な知識を持ちます。',
    qualities: ['癒し', '神秘性', '独立性', '探求心'],
    career: ['医療', '研究', '占星術', '薬学'],
    compatibility: ['Dhanishta', 'Purva Bhadrapada', 'Uttara Bhadrapada']
  },
  {
    name: 'Purva Bhadrapada',
    startDegree: 320,
    endDegree: 333.33,
    lord: 'Jupiter',
    symbol: 'Swords or two front legs of funeral cot',
    deity: 'Aja Ekapada',
    characteristics: '二面性があり、変革的な性格です。',
    qualities: ['二面性', '変革', '情熱', 'スピリチュアル'],
    career: ['宗教', '研究', '神秘学', '治療'],
    compatibility: ['Shatabhisha', 'Uttara Bhadrapada', 'Revati']
  },
  {
    name: 'Uttara Bhadrapada',
    startDegree: 333.33,
    endDegree: 346.67,
    lord: 'Saturn',
    symbol: 'Serpent in the water',
    deity: 'Ahir Budhnya',
    characteristics: '深い智慧があり、精神的な成長を重視します。',
    qualities: ['智慧', '精神性', '忍耐', '深さ'],
    career: ['教育', '宗教', '心理学', '研究'],
    compatibility: ['Purva Bhadrapada', 'Revati', 'Ashwini']
  },
  {
    name: 'Revati',
    startDegree: 346.67,
    endDegree: 360,
    lord: 'Mercury',
    symbol: 'Fish',
    deity: 'Pushan',
    characteristics: '保護的で養育的、旅行を愛する性格です。',
    qualities: ['保護性', '養育性', '旅行愛', '完成'],
    career: ['旅行', '輸送', '保育', 'ガイド'],
    compatibility: ['Uttara Bhadrapada', 'Ashwini', 'Bharani']
  }
];

export interface HouseData {
  number: number;
  name: string;
  signification: string[];
  naturalSignificator: string;
  bodyPart: string[];
  keywords: string[];
}

export const Houses: HouseData[] = [
  {
    number: 1,
    name: 'Tanu Bhava',
    signification: ['自己', '外見', '性格', '健康', '体質'],
    naturalSignificator: 'Sun',
    bodyPart: ['頭', '脳', '顔'],
    keywords: ['アイデンティティ', 'ペルソナリティ', '第一印象']
  },
  {
    number: 2,
    name: 'Dhana Bhava',
    signification: ['富', '家族', '言葉', '食べ物', '価値観'],
    naturalSignificator: 'Jupiter',
    bodyPart: ['顔', '右目', '舌', '歯'],
    keywords: ['物質的富', '家族の絆', 'コミュニケーション']
  },
  {
    number: 3,
    name: 'Sahaja Bhava',
    signification: ['兄弟姉妹', '勇気', '短期旅行', '努力'],
    naturalSignificator: 'Mars',
    bodyPart: ['肩', '腕', '手'],
    keywords: ['勇気', '努力', '技能', '兄弟関係']
  },
  {
    number: 4,
    name: 'Sukha Bhava',
    signification: ['母', '家', '幸福', '不動産', '教育'],
    naturalSignificator: 'Moon',
    bodyPart: ['胸', '心臓', '肺'],
    keywords: ['家庭', '快適さ', '感情的安定']
  },
  {
    number: 5,
    name: 'Putra Bhava',
    signification: ['子供', '創造性', '知性', '投機', 'ロマンス'],
    naturalSignificator: 'Jupiter',
    bodyPart: ['胃', '上腹部'],
    keywords: ['創造性', '子供', '楽しみ', '恋愛']
  },
  {
    number: 6,
    name: 'Ari Bhava',
    signification: ['敵', '病気', '負債', '奉仕', '競争'],
    naturalSignificator: 'Mars',
    bodyPart: ['腸', '腎臓'],
    keywords: ['困難', '奉仕', '健康問題', '競争']
  },
  {
    number: 7,
    name: 'Kalatra Bhava',
    signification: ['結婚', 'パートナーシップ', 'ビジネス', '他者'],
    naturalSignificator: 'Venus',
    bodyPart: ['腰', '生殖器'],
    keywords: ['関係', 'パートナーシップ', '協力']
  },
  {
    number: 8,
    name: 'Ayur Bhava',
    signification: ['長寿', '変革', '隠された事', '遺産', '神秘'],
    naturalSignificator: 'Saturn',
    bodyPart: ['生殖器', '排泄器官'],
    keywords: ['変革', '神秘', '突然の変化', '隠された富']
  },
  {
    number: 9,
    name: 'Bhagya Bhava',
    signification: ['運', '宗教', '高等教育', '長距離旅行', '父'],
    naturalSignificator: 'Jupiter',
    bodyPart: ['腰', '太もも'],
    keywords: ['幸運', '精神性', '知恵', '指導者']
  },
  {
    number: 10,
    name: 'Karma Bhava',
    signification: ['職業', '名声', '権威', '政府', '母'],
    naturalSignificator: 'Mercury',
    bodyPart: ['膝', '関節'],
    keywords: ['キャリア', '社会的地位', '責任', '名声']
  },
  {
    number: 11,
    name: 'Labha Bhava',
    signification: ['利益', '友人', '願望', '収入', '年上の兄弟'],
    naturalSignificator: 'Jupiter',
    bodyPart: ['足首', 'ふくらはぎ'],
    keywords: ['利益', '友情', '希望', 'ネットワーク']
  },
  {
    number: 12,
    name: 'Vyaya Bhava',
    signification: ['損失', '支出', '外国', '解脱', '隠遁'],
    naturalSignificator: 'Saturn',
    bodyPart: ['足', '左目'],
    keywords: ['精神性', '犠牲', '隠された敵', '外国']
  }
];

export interface DashaData {
  planet: string;
  years: number;
  characteristics: string[];
  effects: {
    positive: string[];
    negative: string[];
  };
  remedies: string[];
}

export const Dashas: DashaData[] = [
  {
    planet: 'Ketu',
    years: 7,
    characteristics: ['精神的成長', '過去世の影響', '突然の変化'],
    effects: {
      positive: ['精神的洞察', '神秘的知識', '解脱への道'],
      negative: ['混乱', '突然の損失', '健康問題']
    },
    remedies: ['Ganesha worship', '瞑想', 'Ketu mantra']
  },
  {
    planet: 'Venus',
    years: 20,
    characteristics: ['愛', '美', '芸術', '物質的快楽'],
    effects: {
      positive: ['結婚', '芸術的成功', '快適な生活', '美的満足'],
      negative: ['過度の贅沢', '愛情問題', '怠惰']
    },
    remedies: ['Lakshmi worship', 'Diamond', 'Friday fasting']
  },
  {
    planet: 'Sun',
    years: 6,
    characteristics: ['権威', 'リーダーシップ', '名声', '政府との関係'],
    effects: {
      positive: ['社会的地位', '権力', '名声', '政府からの支援'],
      negative: ['自我の問題', '父親との問題', '高血圧']
    },
    remedies: ['Surya worship', 'Ruby', 'Sunday fasting']
  },
  {
    planet: 'Moon',
    years: 10,
    characteristics: ['感情', '母性', '人気', '精神的平和'],
    effects: {
      positive: ['人気', '精神的平和', '母親との良好な関係', '直感力'],
      negative: ['感情的不安定', '心の病気', '変動性']
    },
    remedies: ['Chandra worship', 'Pearl', 'Monday fasting']
  },
  {
    planet: 'Mars',
    years: 7,
    characteristics: ['エネルギー', '勇気', '競争', '兄弟'],
    effects: {
      positive: ['勇気', '競争での勝利', '不動産獲得', '技術的成功'],
      negative: ['事故', '争い', '血液の病気', '怒り']
    },
    remedies: ['Hanuman worship', 'Red Coral', 'Tuesday fasting']
  },
  {
    planet: 'Rahu',
    years: 18,
    characteristics: ['物質的欲望', '外国', '技術', '突然の変化'],
    effects: {
      positive: ['外国での成功', '技術的革新', '突然の利益', '名声'],
      negative: ['混乱', '詐欺', '健康問題', '精神的苦痛']
    },
    remedies: ['Durga worship', 'Hessonite', 'Rahu mantra']
  },
  {
    planet: 'Jupiter',
    years: 16,
    characteristics: ['知恵', '精神性', '教育', '子供', '富'],
    effects: {
      positive: ['教育での成功', '精神的成長', '子供の幸福', '富の増加'],
      negative: ['過度の楽観主義', '体重増加', '怠惰']
    },
    remedies: ['Brihaspati worship', 'Yellow Sapphire', 'Thursday fasting']
  },
  {
    planet: 'Saturn',
    years: 19,
    characteristics: ['制限', '遅延', '努力', '奉仕', '老人'],
    effects: {
      positive: ['忍耐力', '責任感', '長期的成功', '奉仕精神'],
      negative: ['遅延', '困難', '慢性病', '孤独感']
    },
    remedies: ['Shani worship', 'Blue Sapphire', 'Saturday fasting']
  },
  {
    planet: 'Mercury',
    years: 17,
    characteristics: ['知性', 'コミュニケーション', '商業', '学習'],
    effects: {
      positive: ['知的成功', 'ビジネスの成功', 'コミュニケーション能力', '学習'],
      negative: ['神経質', '優柔不断', '皮膚の問題']
    },
    remedies: ['Vishnu worship', 'Emerald', 'Wednesday fasting']
  }
];