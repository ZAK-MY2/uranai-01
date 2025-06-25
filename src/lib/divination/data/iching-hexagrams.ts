// 易経64卦の完全データ定義

export interface Hexagram {
  number: number;
  name: string;
  chineseName: string;
  upperTrigram: string;
  lowerTrigram: string;
  judgment: string;
  image: string;
  interpretation: string;
  lines: string[];
  element: string;
  season?: string;
  direction?: string;
  keywords: string[];
}

// 八卦（三爻）の定義
export const trigrams = {
  '☰': { name: '乾', element: '天', nature: '創造', direction: '北西' },
  '☱': { name: '兌', element: '沢', nature: '喜び', direction: '西' },
  '☲': { name: '離', element: '火', nature: '明晰', direction: '南' },
  '☳': { name: '震', element: '雷', nature: '動き', direction: '東' },
  '☴': { name: '巽', element: '風', nature: '浸透', direction: '東南' },
  '☵': { name: '坎', element: '水', nature: '深淵', direction: '北' },
  '☶': { name: '艮', element: '山', nature: '静止', direction: '北東' },
  '☷': { name: '坤', element: '地', nature: '受容', direction: '南西' }
};

// 64卦の完全データ
export const hexagrams: Hexagram[] = [
  {
    number: 1,
    name: '乾為天',
    chineseName: 'qián wèi tiān',
    upperTrigram: '☰',
    lowerTrigram: '☰',
    judgment: '元亨利貞',
    image: '天行健、君子以自強不息',
    interpretation: '創造的なエネルギーに満ち、大いなる成功の可能性を示す。リーダーシップを発揮する時。',
    lines: [
      '潜龍勿用 - 時期尚早、準備の時',
      '見龍在田 - 才能が認められ始める',
      '君子終日乾乾 - 慎重に進む必要あり',
      '或躍在淵 - 選択の岐路に立つ',
      '飛龍在天 - 大いなる成功の時',
      '亢龍有悔 - 頂点に達し、謙虚さが必要'
    ],
    element: '天',
    season: '秋冬',
    direction: '北西',
    keywords: ['創造', 'リーダーシップ', '力強さ', '天']
  },
  {
    number: 2,
    name: '坤為地',
    chineseName: 'kūn wèi dì',
    upperTrigram: '☷',
    lowerTrigram: '☷',
    judgment: '元亨利牝馬之貞',
    image: '地勢坤、君子以厚徳載物',
    interpretation: '受容と忍耐の時。他者をサポートし、基盤を固める時期。',
    lines: [
      '履霜堅冰至 - 小さな兆候に注意',
      '直方大 - 自然体で大きな成果',
      '含章可貞 - 内に秘めた才能を育てる',
      '括囊无咎 - 慎重に行動する',
      '黄裳元吉 - 中庸を保てば吉',
      '龍戦于野 - 対立は避けるべき'
    ],
    element: '地',
    season: '夏秋',
    direction: '南西',
    keywords: ['受容', '母性', '大地', '養育']
  },
  {
    number: 3,
    name: '水雷屯',
    chineseName: 'shuǐ léi tún',
    upperTrigram: '☵',
    lowerTrigram: '☳',
    judgment: '元亨利貞、勿用有攸往',
    image: '雲雷屯、君子以経綸',
    interpretation: '困難な始まり。忍耐と準備が必要。新しい事業の立ち上げ期。',
    lines: [
      '磐桓利居貞 - 基礎を固める時',
      '屯如邅如 - 困難が続くが忍耐が必要',
      '即鹿无虞 - 準備なしに進むのは危険',
      '乗馬班如 - 協力者を求める',
      '屯其膏 - 小さな成功から始める',
      '乗馬班如泣血 - 長期的視野が必要'
    ],
    element: '水雷',
    keywords: ['困難な始まり', '忍耐', '成長の痛み', '基礎固め']
  },
  {
    number: 4,
    name: '山水蒙',
    chineseName: 'shān shuǐ méng',
    upperTrigram: '☶',
    lowerTrigram: '☵',
    judgment: '亨、匪我求童蒙、童蒙求我',
    image: '山下出泉、君子以果行育徳',
    interpretation: '啓蒙と学習の時。謙虚に教えを受け、知識を吸収する。',
    lines: [
      '発蒙利用刑人 - 規律を持って学ぶ',
      '包蒙吉納婦吉 - 包容力を持って指導',
      '勿用取女 - 軽率な行動は避ける',
      '困蒙吝 - 孤立した学習は効果薄',
      '童蒙吉 - 素直な心で学ぶ',
      '撃蒙不利為寇 - 厳しすぎる指導は逆効果'
    ],
    element: '山水',
    keywords: ['学習', '教育', '啓蒙', '未熟']
  },
  {
    number: 5,
    name: '水天需',
    chineseName: 'shuǐ tiān xū',
    upperTrigram: '☵',
    lowerTrigram: '☰',
    judgment: '有孚、光亨貞吉、利渉大川',
    image: '雲上于天需、君子以飲食宴楽',
    interpretation: '待つことの大切さ。時機を見極め、準備を整える。',
    lines: [
      '需于郊 - 遠くで待つ、安全',
      '需于沙 - 少し近づくが慎重に',
      '需于泥 - 危険が迫る、注意',
      '需于血 - 困難な状況、忍耐',
      '需于酒食 - 休息と栄養補給',
      '入于穴 - 予期せぬ援助'
    ],
    element: '水天',
    keywords: ['待機', '時機', '忍耐', '栄養']
  },
  {
    number: 6,
    name: '天水訟',
    chineseName: 'tiān shuǐ sòng',
    upperTrigram: '☰',
    lowerTrigram: '☵',
    judgment: '有孚、窒惕中吉、終凶',
    image: '天与水違行、君子以作事謀始',
    interpretation: '争いは避け、和解を求める。対立する前に予防。',
    lines: [
      '不永所事 - 早期に争いを止める',
      '不克訟帰 - 退いて吉',
      '食旧徳 - 実績に頼る',
      '不克訟復 - 和解を求める',
      '訟元吉 - 公正な仲裁',
      '或錫之鞶帯 - 一時的な勝利'
    ],
    element: '天水',
    keywords: ['訴訟', '対立', '和解', '慎重']
  },
  {
    number: 7,
    name: '地水師',
    chineseName: 'dì shuǐ shī',
    upperTrigram: '☷',
    lowerTrigram: '☵',
    judgment: '貞、丈人吉无咎',
    image: '地中有水師、君子以容民畜衆',
    interpretation: '統率と規律。組織的な行動が成功の鍵。',
    lines: [
      '師出以律 - 規律を持って始める',
      '在師中吉 - リーダーの資質',
      '師或輿尸 - 失敗の可能性',
      '師左次 - 戦略的撤退',
      '田有禽 - 正当な理由',
      '大君有命 - 秩序の回復'
    ],
    element: '地水',
    keywords: ['軍隊', 'リーダーシップ', '規律', '組織']
  },
  {
    number: 8,
    name: '水地比',
    chineseName: 'shuǐ dì bǐ',
    upperTrigram: '☵',
    lowerTrigram: '☷',
    judgment: '吉、原筮元永貞无咎',
    image: '地上有水比、君子以建万国親諸侯',
    interpretation: '親和と協力。良い関係を築き、共に成長する。',
    lines: [
      '有孚比之 - 誠実な関係',
      '比之自内 - 内からの親和',
      '比之匪人 - 悪い仲間は避ける',
      '外比之 - 外部との協力',
      '顕比 - 明確な関係',
      '比之无首 - リーダー不在は凶'
    ],
    element: '水地',
    keywords: ['親和', '協力', '友情', '団結']
  },
  {
    number: 9,
    name: '風天小畜',
    chineseName: 'fēng tiān xiǎo xù',
    upperTrigram: '☴',
    lowerTrigram: '☰',
    judgment: '亨、密雲不雨',
    image: '風行天上小畜、君子以懿文徳',
    interpretation: '小さな蓄積。着実な準備と内面の充実。',
    lines: [
      '復自道 - 正道に戻る',
      '牽復吉 - 協力して戻る',
      '輿説輻 - 障害に遭遇',
      '有孚血去 - 誠実さで克服',
      '有孚攣如 - 信頼関係',
      '既雨既処 - 成就の時'
    ],
    element: '風天',
    keywords: ['蓄積', '準備', '内面の充実', '小さな力']
  },
  {
    number: 10,
    name: '天沢履',
    chineseName: 'tiān zé lǚ',
    upperTrigram: '☰',
    lowerTrigram: '☱',
    judgment: '履虎尾、不咥人亨',
    image: '上天下沢履、君子以弁上下定民志',
    interpretation: '慎重な行動。危険を察知し、礼儀を守って進む。',
    lines: [
      '素履往 - 簡素に行く',
      '履道坦坦 - 平坦な道',
      '眇能視 - 制限の中で努力',
      '履虎尾愬愬 - 極度の慎重さ',
      '夬履貞厲 - 決断的だが危険',
      '視履考祥 - 過去を振り返る'
    ],
    element: '天沢',
    keywords: ['礼儀', '慎重', '行動規範', '危険察知']
  },
  {
    number: 11,
    name: '地天泰',
    chineseName: 'dì tiān tài',
    upperTrigram: '☷',
    lowerTrigram: '☰',
    judgment: '小往大来、吉亨',
    image: '天地交泰、君子以財成天地之道',
    interpretation: '天地の調和。理想的な状態で、発展と繁栄の時。',
    lines: [
      '抜茅茹 - 仲間と共に進む',
      '包荒用馮河 - 大きな包容力',
      '无平不陂 - 変化への準備',
      '翩翩不富 - 謙虚さを保つ',
      '帝乙帰妹 - 大きな幸福',
      '城復于隍 - 盛極まれば衰'
    ],
    element: '地天',
    keywords: ['調和', '繁栄', '平和', '交流']
  },
  {
    number: 12,
    name: '天地否',
    chineseName: 'tiān dì pǐ',
    upperTrigram: '☰',
    lowerTrigram: '☷',
    judgment: '否之匪人、不利君子貞',
    image: '天地不交否、君子以倹徳辟難',
    interpretation: '閉塞と停滞。交流が断たれ、慎重な行動が必要。',
    lines: [
      '抜茅茹 - 仲間と共に退く',
      '包承 - 小人に従う',
      '包羞 - 恥を忍ぶ',
      '有命无咎 - 天命に従う',
      '休否 - 停滞から脱出',
      '傾否 - 否定の終わり'
    ],
    element: '天地',
    keywords: ['閉塞', '停滞', '忍耐', '内省']
  },
  {
    number: 13,
    name: '天火同人',
    chineseName: 'tiān huǒ tóng rén',
    upperTrigram: '☰',
    lowerTrigram: '☲',
    judgment: '同人于野、亨、利渉大川',
    image: '天与火同人、君子以類族弁物',
    interpretation: '志を同じくする仲間との協力。団結と協調の時。',
    lines: [
      '同人于門 - 開かれた協力',
      '同人于宗 - 内輪だけは凶',
      '伏戎于莽 - 隠れた敵意',
      '乗其墉 - 障害を越える',
      '同人先号咷 - 初めは対立',
      '同人于郊 - 広い協力'
    ],
    element: '天火',
    keywords: ['仲間', '協力', '団結', '志']
  },
  {
    number: 14,
    name: '火天大有',
    chineseName: 'huǒ tiān dà yǒu',
    upperTrigram: '☲',
    lowerTrigram: '☰',
    judgment: '元亨',
    image: '火在天上大有、君子以遏悪揚善',
    interpretation: '大いなる所有。豊かさと成功、しかし謙虚さを忘れずに。',
    lines: [
      '无交害 - 害なく始まる',
      '大車以載 - 大きな責任',
      '公用亨于天子 - 公的な成功',
      '匪其彭 - 誇示しない',
      '厥孚交如 - 誠実な交流',
      '自天祐之 - 天の助け'
    ],
    element: '火天',
    keywords: ['豊かさ', '成功', '所有', '責任']
  },
  {
    number: 15,
    name: '地山謙',
    chineseName: 'dì shān qiān',
    upperTrigram: '☷',
    lowerTrigram: '☶',
    judgment: '亨、君子有終',
    image: '地中有山謙、君子以裒多益寡',
    interpretation: '謙虚さが成功をもたらす。低姿勢で着実に進む。',
    lines: [
      '謙謙君子 - 極めて謙虚',
      '鳴謙 - 謙虚さが認められる',
      '労謙君子 - 勤勉で謙虚',
      '无不利撝謙 - 謙虚で万事順調',
      '不富以其鄰 - 富まずとも影響力',
      '鳴謙利用行師 - 謙虚なリーダー'
    ],
    element: '地山',
    keywords: ['謙虚', '謙遜', '内なる強さ', '徳']
  },
  {
    number: 16,
    name: '雷地予',
    chineseName: 'léi dì yù',
    upperTrigram: '☳',
    lowerTrigram: '☷',
    judgment: '利建侯行師',
    image: '雷出地奮予、君子以作楽崇徳',
    interpretation: '喜びと熱意。楽しみながら物事を進める好機。',
    lines: [
      '鳴予 - 自慢は凶',
      '介于石 - 堅実な喜び',
      '盱予悔 - 見上げて後悔',
      '由予大有得 - 喜びから成功',
      '貞疾恒不死 - 執着は病',
      '冥予成有渝 - 過度の楽しみ'
    ],
    element: '雷地',
    keywords: ['喜び', '熱意', '楽しみ', '準備']
  },
  {
    number: 17,
    name: '沢雷随',
    chineseName: 'zé léi suí',
    upperTrigram: '☱',
    lowerTrigram: '☳',
    judgment: '元亨利貞、无咎',
    image: '沢中有雷随、君子以嚮晦入宴息',
    interpretation: '随順と適応。流れに従い、柔軟に対応する。',
    lines: [
      '官有渝 - 変化に従う',
      '系小子 - 小を選ぶ',
      '系丈夫 - 大を選ぶ',
      '随有獲 - 従って利益',
      '孚于嘉 - 善に従う',
      '拘系之乃従 - 強制後に従う'
    ],
    element: '沢雷',
    keywords: ['適応', '柔軟性', '従順', '変化']
  },
  {
    number: 18,
    name: '山風蠱',
    chineseName: 'shān fēng gǔ',
    upperTrigram: '☶',
    lowerTrigram: '☴',
    judgment: '元亨、利渉大川',
    image: '山下有風蠱、君子以振民育徳',
    interpretation: '腐敗の改革。古い問題を解決し、新しく始める。',
    lines: [
      '幹父之蠱 - 父の誤りを正す',
      '幹母之蠱 - 母の問題に対処',
      '幹父之蠱小有悔 - 小さな後悔',
      '裕父之蠱 - 寛容に対処',
      '幹父之蠱用誉 - 名誉を得る',
      '不事王侯 - 世俗を超越'
    ],
    element: '山風',
    keywords: ['改革', '修復', '問題解決', '再生']
  },
  {
    number: 19,
    name: '地沢臨',
    chineseName: 'dì zé lín',
    upperTrigram: '☷',
    lowerTrigram: '☱',
    judgment: '元亨利貞、至于八月有凶',
    image: '沢上有地臨、君子以教思无窮',
    interpretation: '臨む・近づく。好機の到来、積極的な行動の時。',
    lines: [
      '咸臨 - 感化して臨む',
      '咸臨吉 - 共に臨んで吉',
      '甘臨 - 甘い誘惑',
      '至臨 - 至って臨む',
      '知臨 - 知恵を持って臨む',
      '敦臨 - 篤く臨む'
    ],
    element: '地沢',
    keywords: ['接近', '監督', '指導', '好機']
  },
  {
    number: 20,
    name: '風地観',
    chineseName: 'fēng dì guān',
    upperTrigram: '☴',
    lowerTrigram: '☷',
    judgment: '盥而不薦、有孚顒若',
    image: '風行地上観、君子以省方観民設教',
    interpretation: '観察と内省。状況を見極め、深く理解する。',
    lines: [
      '童観 - 幼稚な観察',
      '闚観 - 狭い視野',
      '観我生 - 自己観察',
      '観国之光 - 国の光を観る',
      '観我生 - 自己の生き方',
      '観其生 - 他者を観察'
    ],
    element: '風地',
    keywords: ['観察', '内省', '理解', '洞察']
  },
  {
    number: 21,
    name: '火雷噬嗑',
    chineseName: 'huǒ léi shì kè',
    upperTrigram: '☲',
    lowerTrigram: '☳',
    judgment: '亨、利用獄',
    image: '雷電噬嗑、君子以明罰勅法',
    interpretation: '障害を噛み砕く。困難を克服し、正義を実現。',
    lines: [
      '履校滅趾 - 軽い刑罰',
      '噬膚滅鼻 - 深く噛む',
      '噬腊肉 - 古い問題',
      '噬乾胏 - 硬い障害',
      '噬乾肉 - 困難だが成功',
      '何校滅耳 - 重い刑罰'
    ],
    element: '火雷',
    keywords: ['克服', '正義', '決断', '処罰']
  },
  {
    number: 22,
    name: '山火賁',
    chineseName: 'shān huǒ bì',
    upperTrigram: '☶',
    lowerTrigram: '☲',
    judgment: '亨、小利有攸往',
    image: '山下有火賁、君子以明庶政',
    interpretation: '装飾と文化。外見を整え、内面も充実させる。',
    lines: [
      '賁其趾 - 足元を飾る',
      '賁其須 - ひげを飾る',
      '賁如濡如 - 潤いある装飾',
      '賁如皤如 - 白く飾る',
      '賁于丘園 - 質素な美',
      '白賁 - 飾らない美'
    ],
    element: '山火',
    keywords: ['装飾', '文化', '美', '形式']
  },
  {
    number: 23,
    name: '山地剥',
    chineseName: 'shān dì bō',
    upperTrigram: '☶',
    lowerTrigram: '☷',
    judgment: '不利有攸往',
    image: '山附于地剥、君子以厚下安宅',
    interpretation: '剥落と衰退。古いものが剥がれ落ち、基礎を見直す時。',
    lines: [
      '剥床以足 - 基礎から崩れる',
      '剥床以弁 - さらに崩れる',
      '剥之无咎 - 自然な剥落',
      '剥床以膚 - 身に迫る',
      '貫魚以宮人寵 - 連鎖的な恩恵',
      '碩果不食 - 大きな実は残る'
    ],
    element: '山地',
    keywords: ['衰退', '剥落', '終焉', '転換期']
  },
  {
    number: 24,
    name: '地雷復',
    chineseName: 'dì léi fù',
    upperTrigram: '☷',
    lowerTrigram: '☳',
    judgment: '亨、出入无疾',
    image: '雷在地中復、君子以至日閉関',
    interpretation: '回復と再生。新しいサイクルの始まり、復活の時。',
    lines: [
      '不遠復 - すぐに戻る',
      '休復 - 良い回復',
      '頻復 - 何度も戻る',
      '中行独復 - 一人で戻る',
      '敦復 - 篤い回復',
      '迷復 - 迷って災い'
    ],
    element: '地雷',
    keywords: ['復活', '再生', '回帰', '新サイクル']
  },
  {
    number: 25,
    name: '天雷无妄',
    chineseName: 'tiān léi wú wàng',
    upperTrigram: '☰',
    lowerTrigram: '☳',
    judgment: '元亨利貞、其匪正有眚',
    image: '天下雷行物与无妄、君子以茂対時育万物',
    interpretation: '無為自然。作為なく自然に従い、誠実に生きる。',
    lines: [
      '无妄往吉 - 自然に進む',
      '不耕穫 - 結果を求めない',
      '无妄之災 - 予期せぬ災い',
      '可貞无咎 - 正しければ咎なし',
      '无妄之疾 - 自然治癒',
      '无妄行有眚 - 無理は災い'
    ],
    element: '天雷',
    keywords: ['自然', '無為', '誠実', '天真']
  },
  {
    number: 26,
    name: '山天大畜',
    chineseName: 'shān tiān dà xù',
    upperTrigram: '☶',
    lowerTrigram: '☰',
    judgment: '利貞、不家食吉',
    image: '天在山中大畜、君子以多識前言往行',
    interpretation: '大いなる蓄積。知識と経験を蓄え、大きな力とする。',
    lines: [
      '有厲利已 - 危険、止まる',
      '輿説輹 - 車軸が外れる',
      '良馬逐 - 良馬を追う',
      '童牛之牿 - 若い牛を制御',
      '豶豕之牙 - 猪の牙を抜く',
      '何天之衢 - 天の大道'
    ],
    element: '山天',
    keywords: ['蓄積', '学習', '制御', '大きな力']
  },
  {
    number: 27,
    name: '山雷頤',
    chineseName: 'shān léi yí',
    upperTrigram: '☶',
    lowerTrigram: '☳',
    judgment: '貞吉、観頤自求口実',
    image: '山下有雷頤、君子以慎言語節飲食',
    interpretation: '養うこと。言葉と食事に注意し、心身を養う。',
    lines: [
      '舎爾霊亀 - 霊亀を捨てる',
      '顛頤 - 逆さまに養う',
      '払頤 - 養いに背く',
      '顛頤吉 - 下を養って吉',
      '払経 - 常道に背く',
      '由頤 - 養いの源'
    ],
    element: '山雷',
    keywords: ['養育', '栄養', '言葉', '節制']
  },
  {
    number: 28,
    name: '沢風大過',
    chineseName: 'zé fēng dà guò',
    upperTrigram: '☱',
    lowerTrigram: '☴',
    judgment: '棟撓、利有攸往',
    image: '沢滅木大過、君子以独立不懼',
    interpretation: '大いなる過ぎ。極端な状況で、独立して行動する。',
    lines: [
      '藉用白茅 - 白茅を敷く',
      '枯楊生稊 - 枯れ楊に芽',
      '棟撓 - 棟木が曲がる',
      '棟隆吉 - 棟木が高い',
      '枯楊生華 - 枯れ楊に花',
      '過渉滅頂 - 深く渡って溺れる'
    ],
    element: '沢風',
    keywords: ['過度', '極端', '独立', '非常時']
  },
  {
    number: 29,
    name: '坎為水',
    chineseName: 'kǎn wèi shuǐ',
    upperTrigram: '☵',
    lowerTrigram: '☵',
    judgment: '習坎、有孚維心亨',
    image: '水洊至習坎、君子以常徳行習教事',
    interpretation: '重なる険難。危険を乗り越え、経験を積む。',
    lines: [
      '習坎入于坎窞 - 穴に落ちる',
      '坎有険 - 険難あり',
      '来之坎坎 - 険難が続く',
      '樽酒簋弐 - 質素な供物',
      '坎不盈 - 満ちない',
      '系用徽纆 - 縛られる'
    ],
    element: '水',
    keywords: ['危険', '困難', '深淵', '経験']
  },
  {
    number: 30,
    name: '離為火',
    chineseName: 'lí wèi huǒ',
    upperTrigram: '☲',
    lowerTrigram: '☲',
    judgment: '利貞、亨、畜牝牛吉',
    image: '明両作離、君子以継明照于四方',
    interpretation: '明るい光。知恵と洞察力で、周囲を照らす。',
    lines: [
      '履錯然 - 慎重に歩む',
      '黄離元吉 - 中庸の光',
      '日昃之離 - 日暮れの光',
      '突如其来如 - 突然の光',
      '出涕沱若 - 涙を流す',
      '王用出征 - 王の出征'
    ],
    element: '火',
    keywords: ['光明', '知恵', '付着', '明晰']
  },
  {
    number: 31,
    name: '沢山咸',
    chineseName: 'zé shān xián',
    upperTrigram: '☱',
    lowerTrigram: '☶',
    judgment: '亨、利貞、取女吉',
    image: '山上有沢咸、君子以虚受人',
    interpretation: '感応と交流。心が通じ合い、良い関係が生まれる。',
    lines: [
      '咸其拇 - 足の親指が動く',
      '咸其腓 - ふくらはぎが動く',
      '咸其股 - 太ももが動く',
      '貞吉悔亡 - 正しく動く',
      '咸其脢 - 背中が動く',
      '咸其輔頬舌 - 口が動く'
    ],
    element: '沢山',
    keywords: ['感応', '交流', '恋愛', '共感']
  },
  {
    number: 32,
    name: '雷風恒',
    chineseName: 'léi fēng héng',
    upperTrigram: '☳',
    lowerTrigram: '☴',
    judgment: '亨、无咎、利貞',
    image: '雷風恒、君子以立不易方',
    interpretation: '恒久と持続。変わらない真理を守り、永続する。',
    lines: [
      '浚恒 - 深く求める',
      '悔亡 - 悔いが消える',
      '不恒其徳 - 徳が一定しない',
      '田无禽 - 獲物がない',
      '恒其徳 - 徳を保つ',
      '振恒 - 振動し続ける'
    ],
    element: '雷風',
    keywords: ['恒久', '持続', '不変', '永続']
  },
  {
    number: 33,
    name: '天山遯',
    chineseName: 'tiān shān dùn',
    upperTrigram: '☰',
    lowerTrigram: '☶',
    judgment: '亨、小利貞',
    image: '天下有山遯、君子以遠小人',
    interpretation: '退避と隠遁。時機を待ち、賢明に退く。',
    lines: [
      '遯尾 - 尻尾を巻く',
      '執之用黄牛 - 黄牛で繋ぐ',
      '系遯 - 繋がれて退く',
      '好遯 - 良い退避',
      '嘉遯 - 美しい退避',
      '肥遯 - 豊かな退避'
    ],
    element: '天山',
    keywords: ['退避', '隠遁', '撤退', '時機']
  },
  {
    number: 34,
    name: '雷天大壮',
    chineseName: 'léi tiān dà zhuàng',
    upperTrigram: '☳',
    lowerTrigram: '☰',
    judgment: '利貞',
    image: '雷在天上大壮、君子以非礼弗履',
    interpretation: '大いなる力。強大な力を正しく使う時。',
    lines: [
      '壮于趾 - 足に力',
      '貞吉 - 正しければ吉',
      '小人用壮 - 小人は力を使う',
      '貞吉悔亡 - 正しく進む',
      '喪羊于易 - 羊を失う',
      '羝羊触藩 - 雄羊が垣根に突く'
    ],
    element: '雷天',
    keywords: ['強大', '力', '正義', '前進']
  },
  {
    number: 35,
    name: '火地晋',
    chineseName: 'huǒ dì jìn',
    upperTrigram: '☲',
    lowerTrigram: '☷',
    judgment: '康侯用錫馬蕃庶',
    image: '明出地上晋、君子以自昭明徳',
    interpretation: '前進と昇進。明るく輝き、着実に上昇する。',
    lines: [
      '晋如摧如 - 挫かれる前進',
      '晋如愁如 - 憂いの前進',
      '衆允 - 衆人が認める',
      '晋如鼫鼠 - 鼠のような前進',
      '悔亡失得勿恤 - 得失を気にしない',
      '晋其角 - 角で進む'
    ],
    element: '火地',
    keywords: ['昇進', '前進', '輝き', '発展']
  },
  {
    number: 36,
    name: '地火明夷',
    chineseName: 'dì huǒ míng yí',
    upperTrigram: '☷',
    lowerTrigram: '☲',
    judgment: '利艱貞',
    image: '明入地中明夷、君子以莅衆用晦而明',
    interpretation: '明かりが傷つく。暗闇の中で内なる光を保つ。',
    lines: [
      '明夷于飛 - 飛んで逃げる',
      '明夷夷于左股 - 左股を傷つく',
      '明夷于南狩 - 南へ狩りに',
      '入于左腹 - 左腹に入る',
      '箕子之明夷 - 箕子の明夷',
      '不明晦 - 明るくない闇'
    ],
    element: '地火',
    keywords: ['隠れた光', '苦難', '内なる明', '忍耐']
  },
  {
    number: 37,
    name: '風火家人',
    chineseName: 'fēng huǒ jiā rén',
    upperTrigram: '☴',
    lowerTrigram: '☲',
    judgment: '利女貞',
    image: '風自火出家人、君子以言有物而行有恒',
    interpretation: '家族と家庭。家族の調和と秩序を大切にする。',
    lines: [
      '閑有家 - 家を守る',
      '无攸遂 - 外に出ない',
      '家人嗃嗃 - 厳しい家庭',
      '富家大吉 - 豊かな家庭',
      '王仮有家 - 王が家に至る',
      '有孚威如 - 威厳と信頼'
    ],
    element: '風火',
    keywords: ['家族', '家庭', '調和', '秩序']
  },
  {
    number: 38,
    name: '火沢睽',
    chineseName: 'huǒ zé kuí',
    upperTrigram: '☲',
    lowerTrigram: '☱',
    judgment: '小事吉',
    image: '上火下沢睽、君子以同而異',
    interpretation: '対立と相違。違いを認め、小さなことから始める。',
    lines: [
      '悔亡喪馬 - 馬を失う',
      '遇主于巷 - 巷で主に会う',
      '見輿曳 - 車が引かれる',
      '睽孤遇元夫 - 孤独で出会う',
      '悔亡厥宗噬膚 - 宗族が噛む',
      '睽孤見豕 - 豚を見る'
    ],
    element: '火沢',
    keywords: ['対立', '相違', '孤独', '和解']
  },
  {
    number: 39,
    name: '水山蹇',
    chineseName: 'shuǐ shān jiǎn',
    upperTrigram: '☵',
    lowerTrigram: '☶',
    judgment: '利西南、不利東北',
    image: '山上有水蹇、君子以反身修徳',
    interpretation: '困難と障害。内面を見つめ、徳を修める。',
    lines: [
      '往蹇来誉 - 行けば困難',
      '王臣蹇蹇 - 忠臣の苦労',
      '往蹇来反 - 行かず戻る',
      '往蹇来連 - 連携して来る',
      '大蹇朋来 - 大困難に友来る',
      '往蹇来碩 - 大きな成果'
    ],
    element: '水山',
    keywords: ['困難', '障害', '内省', '修養']
  },
  {
    number: 40,
    name: '雷水解',
    chineseName: 'léi shuǐ xiè',
    upperTrigram: '☳',
    lowerTrigram: '☵',
    judgment: '利西南、往得衆',
    image: '雷雨作解、君子以赦過宥罪',
    interpretation: '解放と解決。困難が解け、新しい始まり。',
    lines: [
      '无咎 - 咎なし',
      '田獲三狐 - 三匹の狐を獲る',
      '負且乗 - 背負って乗る',
      '解而拇 - 親指を解く',
      '君子維有解 - 君子の解放',
      '公用射隼 - 隼を射る'
    ],
    element: '雷水',
    keywords: ['解放', '解決', '許し', '新開始']
  },
  {
    number: 41,
    name: '山沢損',
    chineseName: 'shān zé sǔn',
    upperTrigram: '☶',
    lowerTrigram: '☱',
    judgment: '有孚、元吉无咎',
    image: '山下有沢損、君子以懲忿窒欲',
    interpretation: '減少と節制。無駄を省き、本質に集中する。',
    lines: [
      '已事遄往 - 速やかに行く',
      '利貞征凶 - 進むは凶',
      '三人行則損一人 - 三人なら一人減',
      '損其疾 - 病を減らす',
      '或益之十朋之亀 - 十朋の亀',
      '弗損益之 - 損せず益す'
    ],
    element: '山沢',
    keywords: ['減少', '節制', '犠牲', '本質']
  },
  {
    number: 42,
    name: '風雷益',
    chineseName: 'fēng léi yì',
    upperTrigram: '☴',
    lowerTrigram: '☳',
    judgment: '利有攸往、利渉大川',
    image: '風雷益、君子以見善則遷有過則改',
    interpretation: '増加と利益。成長と発展の好機、積極的に進む。',
    lines: [
      '利用為大作 - 大事業に利用',
      '或益之十朋之亀 - 十朋の亀',
      '益之用凶事 - 凶事に益す',
      '中行告公 - 公に告げる',
      '有孚恵心 - 恵みの心',
      '莫益之或撃之 - 益さず撃つ'
    ],
    element: '風雷',
    keywords: ['増加', '利益', '成長', '改善']
  },
  {
    number: 43,
    name: '沢天夬',
    chineseName: 'zé tiān guài',
    upperTrigram: '☱',
    lowerTrigram: '☰',
    judgment: '揚于王庭、孚号有厲',
    image: '沢上于天夬、君子以施禄及下',
    interpretation: '決断と突破。果断に行動し、障害を取り除く。',
    lines: [
      '壮于前趾 - 足先に力',
      '惕号 - 警戒の叫び',
      '壮于頄 - 頬骨に力',
      '臀无膚 - 尻に肉なし',
      '莧陸夬夬 - 山羊が進む',
      '无号終有凶 - 叫ばず凶'
    ],
    element: '沢天',
    keywords: ['決断', '突破', '決別', '果断']
  },
  {
    number: 44,
    name: '天風姤',
    chineseName: 'tiān fēng gòu',
    upperTrigram: '☰',
    lowerTrigram: '☴',
    judgment: '女壮、勿用取女',
    image: '天下有風姤、君子以施命誥四方',
    interpretation: '遭遇と誘惑。予期せぬ出会い、慎重な対応が必要。',
    lines: [
      '系于金柅 - 金の止め木',
      '包有魚 - 魚を包む',
      '臀无膚 - 尻に肉なし',
      '包无魚 - 魚なし',
      '以杞包瓜 - 瓜を包む',
      '姤其角 - 角で会う'
    ],
    element: '天風',
    keywords: ['遭遇', '誘惑', '出会い', '警戒']
  },
  {
    number: 45,
    name: '沢地萃',
    chineseName: 'zé dì cuì',
    upperTrigram: '☱',
    lowerTrigram: '☷',
    judgment: '亨、王仮有廟',
    image: '沢上於地萃、君子以除戎器戒不虞',
    interpretation: '集合と団結。人々が集まり、大きな力となる。',
    lines: [
      '有孚不終 - 誠実さが続かない',
      '引吉无咎 - 引いて吉',
      '萃如嗟如 - 集まって嘆く',
      '大吉无咎 - 大吉で咎なし',
      '萃有位 - 位に集まる',
      '齎咨涕洟 - 涙を流す'
    ],
    element: '沢地',
    keywords: ['集合', '団結', '集会', '統合']
  },
  {
    number: 46,
    name: '地風升',
    chineseName: 'dì fēng shēng',
    upperTrigram: '☷',
    lowerTrigram: '☴',
    judgment: '元亨、用見大人',
    image: '地中生木升、君子以順徳積小以高大',
    interpretation: '上昇と成長。着実に積み重ね、高みを目指す。',
    lines: [
      '允升大吉 - 認められて昇る',
      '孚乃利用禴 - 誠実で祭る',
      '升虚邑 - 虚しい町に昇る',
      '王用亨于岐山 - 岐山で祭る',
      '貞吉升階 - 階段を昇る',
      '冥升 - 暗い上昇'
    ],
    element: '地風',
    keywords: ['上昇', '成長', '昇進', '発展']
  },
  {
    number: 47,
    name: '沢水困',
    chineseName: 'zé shuǐ kùn',
    upperTrigram: '☱',
    lowerTrigram: '☵',
    judgment: '亨、貞大人吉',
    image: '沢无水困、君子以致命遂志',
    interpretation: '困窮と疲弊。困難な状況でも志を貫く。',
    lines: [
      '臀困于株木 - 切り株に困る',
      '困于酒食 - 酒食に困る',
      '困于石 - 石に困る',
      '来徐徐 - ゆっくり来る',
      '劓刖 - 鼻と足を切られる',
      '困于葛藟 - 蔓草に困る'
    ],
    element: '沢水',
    keywords: ['困窮', '疲弊', '忍耐', '志']
  },
  {
    number: 48,
    name: '水風井',
    chineseName: 'shuǐ fēng jǐng',
    upperTrigram: '☵',
    lowerTrigram: '☴',
    judgment: '改邑不改井',
    image: '木上有水井、君子以労民勧相',
    interpretation: '井戸と源泉。深い知恵と資源を汲み上げる。',
    lines: [
      '井泥不食 - 泥井は飲めない',
      '井谷射鮒 - 谷井で鮒を射る',
      '井渫不食 - 清井も飲まれず',
      '井甃无咎 - 井戸を修理',
      '井冽寒泉食 - 冷たい清水',
      '井收勿幕 - 井戸を覆うな'
    ],
    element: '水風',
    keywords: ['源泉', '知恵', '資源', '深さ']
  },
  {
    number: 49,
    name: '沢火革',
    chineseName: 'zé huǒ gé',
    upperTrigram: '☱',
    lowerTrigram: '☲',
    judgment: '己日乃孚、元亨利貞',
    image: '沢中有火革、君子以治暦明時',
    interpretation: '変革と革新。古いものを改め、新しいものを創る。',
    lines: [
      '鞏用黄牛之革 - 黄牛の革で固める',
      '己日乃革之 - その日に改める',
      '征凶貞厲 - 進めば凶',
      '悔亡有孚改命 - 命を改める',
      '大人虎変 - 大人は虎変',
      '君子豹変 - 君子は豹変'
    ],
    element: '沢火',
    keywords: ['変革', '革新', '改革', '転換']
  },
  {
    number: 50,
    name: '火風鼎',
    chineseName: 'huǒ fēng dǐng',
    upperTrigram: '☲',
    lowerTrigram: '☴',
    judgment: '元吉亨',
    image: '木上有火鼎、君子以正位凝命',
    interpretation: '鼎と調理。新しいものを生み出し、養う。',
    lines: [
      '鼎顛趾 - 鼎がひっくり返る',
      '鼎有実 - 鼎に実がある',
      '鼎耳革 - 鼎の耳が変わる',
      '鼎折足 - 鼎の足が折れる',
      '鼎黄耳金鉉 - 黄金の耳と鉉',
      '鼎玉鉉 - 玉の鉉'
    ],
    element: '火風',
    keywords: ['創造', '養育', '変容', '神聖']
  },
  {
    number: 51,
    name: '震為雷',
    chineseName: 'zhèn wèi léi',
    upperTrigram: '☳',
    lowerTrigram: '☳',
    judgment: '亨、震来虩虩',
    image: '洊雷震、君子以恐懼修省',
    interpretation: '震動と覚醒。衝撃を受けて目覚め、新たに始める。',
    lines: [
      '震来虩虩 - 震えて恐れる',
      '震来厲 - 震えが来て厳しい',
      '震蘇蘇 - 震えて蘇る',
      '震遂泥 - 震えて泥に',
      '震往来厲 - 震えて往来',
      '震索索 - 震えて縮む'
    ],
    element: '雷',
    keywords: ['震動', '覚醒', '驚き', '始動']
  },
  {
    number: 52,
    name: '艮為山',
    chineseName: 'gèn wèi shān',
    upperTrigram: '☶',
    lowerTrigram: '☶',
    judgment: '艮其背、不獲其身',
    image: '兼山艮、君子以思不出其位',
    interpretation: '静止と瞑想。動きを止め、内面を見つめる。',
    lines: [
      '艮其趾 - 足を止める',
      '艮其腓 - ふくらはぎを止める',
      '艮其限 - 腰を止める',
      '艮其身 - 身を止める',
      '艮其輔 - 口を止める',
      '敦艮吉 - 篤く止まる'
    ],
    element: '山',
    keywords: ['静止', '瞑想', '不動', '内観']
  },
  {
    number: 53,
    name: '風山漸',
    chineseName: 'fēng shān jiàn',
    upperTrigram: '☴',
    lowerTrigram: '☶',
    judgment: '女帰吉、利貞',
    image: '山上有木漸、君子以居賢徳善俗',
    interpretation: '漸進と段階的発展。一歩一歩着実に進む。',
    lines: [
      '鴻漸于干 - 鴻が岸に',
      '鴻漸于磐 - 鴻が岩に',
      '鴻漸于陸 - 鴻が陸に',
      '鴻漸于木 - 鴻が木に',
      '鴻漸于陵 - 鴻が丘に',
      '鴻漸于陸 - 鴻が大陸に'
    ],
    element: '風山',
    keywords: ['漸進', '段階', '成長', '着実']
  },
  {
    number: 54,
    name: '雷沢帰妹',
    chineseName: 'léi zé guī mèi',
    upperTrigram: '☳',
    lowerTrigram: '☱',
    judgment: '征凶、无攸利',
    image: '沢上有雷帰妹、君子以永終知敝',
    interpretation: '若い娘の嫁入り。衝動的な行動は慎む。',
    lines: [
      '帰妹以娣 - 妹として嫁ぐ',
      '眇能視 - 片目でも見る',
      '帰妹以須 - 待って嫁ぐ',
      '帰妹愆期 - 期を過ぎる',
      '帝乙帰妹 - 帝乙の嫁入り',
      '女承筐无実 - 空の籠'
    ],
    element: '雷沢',
    keywords: ['衝動', '未熟', '性急', '関係']
  },
  {
    number: 55,
    name: '雷火豊',
    chineseName: 'léi huǒ fēng',
    upperTrigram: '☳',
    lowerTrigram: '☲',
    judgment: '亨、王仮之',
    image: '雷電皆至豊、君子以折獄致刑',
    interpretation: '豊かさの絶頂。栄光の時だが、永続しない。',
    lines: [
      '遇其配主 - 配偶に会う',
      '豊其蔀 - 日よけが豊か',
      '豊其沛 - 幕が豊か',
      '豊其蔀 - 日よけが豊か',
      '来章有慶誉 - 章を来して誉れ',
      '豊其屋 - 家が豊か'
    ],
    element: '雷火',
    keywords: ['豊穣', '絶頂', '栄光', '一時的']
  },
  {
    number: 56,
    name: '火山旅',
    chineseName: 'huǒ shān lǚ',
    upperTrigram: '☲',
    lowerTrigram: '☶',
    judgment: '小亨、旅貞吉',
    image: '山上有火旅、君子以明慎用刑',
    interpretation: '旅と漂泊。定住せず、柔軟に対応する。',
    lines: [
      '旅瑣瑣 - みすぼらしい旅',
      '旅即次 - 宿に着く',
      '旅焚其次 - 宿が焼ける',
      '旅于処 - 場所を得る',
      '射雉一矢亡 - 雉を射て矢を失う',
      '鳥焚其巣 - 鳥の巣が焼ける'
    ],
    element: '火山',
    keywords: ['旅', '漂泊', '一時的', '柔軟']
  },
  {
    number: 57,
    name: '巽為風',
    chineseName: 'xùn wèi fēng',
    upperTrigram: '☴',
    lowerTrigram: '☴',
    judgment: '小亨、利有攸往',
    image: '随風巽、君子以申命行事',
    interpretation: '浸透と柔順。風のように柔らかく浸透する。',
    lines: [
      '進退利武人 - 進退は武人に利',
      '巽在床下 - ベッドの下に巽',
      '頻巽吝 - 頻繁な巽は吝',
      '悔亡田獲三品 - 三品を獲る',
      '貞吉悔亡 - 正しければ吉',
      '巽在床下 - ベッドの下に巽'
    ],
    element: '風',
    keywords: ['浸透', '柔順', '影響', '従順']
  },
  {
    number: 58,
    name: '兌為沢',
    chineseName: 'duì wèi zé',
    upperTrigram: '☱',
    lowerTrigram: '☱',
    judgment: '亨、利貞',
    image: '麗沢兌、君子以朋友講習',
    interpretation: '喜びと交流。開かれた心で、喜びを分かち合う。',
    lines: [
      '和兌吉 - 和やかな喜び',
      '孚兌吉 - 誠実な喜び',
      '来兌凶 - 来る喜びは凶',
      '商兌未寧 - 商う喜び不安',
      '孚于剥 - 剥に誠実',
      '引兌 - 引く喜び'
    ],
    element: '沢',
    keywords: ['喜び', '交流', '開放', '楽しみ']
  },
  {
    number: 59,
    name: '風水渙',
    chineseName: 'fēng shuǐ huàn',
    upperTrigram: '☴',
    lowerTrigram: '☵',
    judgment: '亨、王仮有廟',
    image: '風行水上渙、君子以振民育徳',
    interpretation: '散乱と再集合。バラバラになったものを再び集める。',
    lines: [
      '用拯馬壮 - 強い馬で救う',
      '渙奔其机 - 机に走る',
      '渙其躬 - 身を散らす',
      '渙其群 - 群れを散らす',
      '渙汗其大号 - 大号令を発す',
      '渙其血去 - 血を散らす'
    ],
    element: '風水',
    keywords: ['分散', '再集合', '解散', '流動']
  },
  {
    number: 60,
    name: '水沢節',
    chineseName: 'shuǐ zé jié',
    upperTrigram: '☵',
    lowerTrigram: '☱',
    judgment: '亨、苦節不可貞',
    image: '沢上有水節、君子以制数度議徳行',
    interpretation: '節度と節制。適切な限度を守り、バランスを保つ。',
    lines: [
      '不出戸庭 - 戸庭を出ず',
      '不出門庭 - 門庭を出ず',
      '不節若 - 節せざれば',
      '安節亨 - 安んじて節す',
      '甘節吉 - 甘い節制',
      '苦節貞凶 - 苦い節制'
    ],
    element: '水沢',
    keywords: ['節度', '節制', '限度', 'バランス']
  },
  {
    number: 61,
    name: '風沢中孚',
    chineseName: 'fēng zé zhōng fú',
    upperTrigram: '☴',
    lowerTrigram: '☱',
    judgment: '豚魚吉、利渉大川',
    image: '沢上有風中孚、君子以議獄緩死',
    interpretation: '内なる誠実。真心を持って人と接する。',
    lines: [
      '虞吉有它不燕 - 備えあれば吉',
      '鳴鶴在陰 - 鶴が陰で鳴く',
      '得敵或鼓或罷 - 敵を得る',
      '月幾望 - 月ほぼ満つ',
      '有孚攣如 - 誠実につながる',
      '翰音登于天 - 鶏の声天に'
    ],
    element: '風沢',
    keywords: ['誠実', '信頼', '真心', '内なる真実']
  },
  {
    number: 62,
    name: '雷山小過',
    chineseName: 'léi shān xiǎo guò',
    upperTrigram: '☳',
    lowerTrigram: '☶',
    judgment: '亨、利貞、可小事',
    image: '山上有雷小過、君子以行過乎恭',
    interpretation: '小さな過ぎ。細かいことに注意し、謙虚に。',
    lines: [
      '飛鳥以凶 - 飛ぶ鳥は凶',
      '過其祖 - 祖を過ぎる',
      '弗過防之 - 過ぎず防ぐ',
      '无咎弗過遇之 - 過ぎず遇う',
      '密雲不雨 - 密雲雨降らず',
      '弗遇過之 - 遇わず過ぎる'
    ],
    element: '雷山',
    keywords: ['小さな過失', '注意', '謙虚', '細心']
  },
  {
    number: 63,
    name: '水火既済',
    chineseName: 'shuǐ huǒ jì jì',
    upperTrigram: '☵',
    lowerTrigram: '☲',
    judgment: '亨小利貞、初吉終乱',
    image: '水在火上既済、君子以思患而予防之',
    interpretation: '完成と達成。しかし油断せず、次の準備を。',
    lines: [
      '曳其輪 - 車輪を引く',
      '婦喪其茀 - 婦人が飾りを失う',
      '高宗伐鬼方 - 高宗が鬼方を伐つ',
      '繻有衣袽 - ぼろ衣あり',
      '東鄰殺牛 - 東隣が牛を殺す',
      '濡其首 - 首を濡らす'
    ],
    element: '水火',
    keywords: ['完成', '達成', '警戒', '次への準備']
  },
  {
    number: 64,
    name: '火水未済',
    chineseName: 'huǒ shuǐ wèi jì',
    upperTrigram: '☲',
    lowerTrigram: '☵',
    judgment: '亨、小狐汔済',
    image: '火在水上未済、君子以慎弁物居方',
    interpretation: '未完成。まだ途上にあり、慎重に進む必要。',
    lines: [
      '濡其尾 - 尾を濡らす',
      '曳其輪 - 車輪を引く',
      '未済征凶 - 征けば凶',
      '貞吉悔亡 - 正しければ吉',
      '貞吉无悔 - 正しく悔いなし',
      '有孚于飲酒 - 酒を飲んで誠実'
    ],
    element: '火水',
    keywords: ['未完成', '途上', '慎重', '可能性']
  }
];

// ヘキサグラムを番号で検索
export function getHexagramByNumber(number: number): Hexagram | undefined {
  return hexagrams.find(h => h.number === number);
}

// 上卦と下卦からヘキサグラムを検索
export function getHexagramByTrigrams(upper: string, lower: string): Hexagram | undefined {
  return hexagrams.find(h => h.upperTrigram === upper && h.lowerTrigram === lower);
}

// 名前でヘキサグラムを検索
export function getHexagramByName(name: string): Hexagram | undefined {
  return hexagrams.find(h => h.name === name || h.chineseName === name);
}