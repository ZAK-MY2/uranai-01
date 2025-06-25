// タロットカード全78枚のデータ定義

export interface TarotCard {
  id: string;
  name: string;
  number: number;
  arcana: 'major' | 'minor';
  suit?: 'wands' | 'cups' | 'swords' | 'pentacles';
  element?: string;
  planet?: string;
  zodiac?: string;
  keywords: string[];
  uprightMeaning: string;
  reversedMeaning: string;
  description: string;
  advice: string;
  imageSymbols?: string[];
}

// メジャーアルカナ（大アルカナ）22枚
export const majorArcana: TarotCard[] = [
  {
    id: 'fool',
    name: '愚者',
    number: 0,
    arcana: 'major',
    element: '風',
    planet: '天王星',
    keywords: ['新しい始まり', '冒険', '無邪気', '自由'],
    uprightMeaning: '新たな旅立ち、無限の可能性、純粋な心、冒険への意欲',
    reversedMeaning: '無謀、軽率、リスクの無視、方向性の欠如',
    description: '崖の端に立つ若者が、太陽に向かって一歩を踏み出そうとしている。白い犬が足元で吠え、注意を促している。',
    advice: '恐れずに新しいことに挑戦しましょう。しかし、周囲の声にも耳を傾けることを忘れずに。',
    imageSymbols: ['白い太陽', '崖', '白い犬', '花', '袋']
  },
  {
    id: 'magician',
    name: '魔術師',
    number: 1,
    arcana: 'major',
    element: '全元素',
    planet: '水星',
    keywords: ['意志力', '創造', '実現', 'スキル'],
    uprightMeaning: '意志の力、目標達成能力、才能の開花、コミュニケーション',
    reversedMeaning: '操作、詐欺、才能の浪費、コミュニケーション不足',
    description: '赤いローブを着た魔術師が、祭壇の前に立ち、片手を天に、もう片手を地に向けている。テーブルには四大元素を表す道具が並ぶ。',
    advice: 'あなたには必要な全ての道具が揃っています。今こそ行動を起こす時です。',
    imageSymbols: ['無限大記号', 'ワンド', 'カップ', 'ソード', 'ペンタクル']
  },
  {
    id: 'high-priestess',
    name: '女教皇',
    number: 2,
    arcana: 'major',
    element: '水',
    planet: '月',
    keywords: ['直感', '内なる知恵', '秘密', '受容性'],
    uprightMeaning: '直感力、潜在意識、神秘的な知識、内なる声',
    reversedMeaning: '秘密の露呈、表面的な判断、直感の無視',
    description: '青いローブを纏った女性が、黒と白の柱の間に座っている。膝の上にはトーラーの巻物、背後には柘榴の幕。',
    advice: '答えは既にあなたの内側にあります。静かに瞑想し、内なる声に耳を傾けてください。',
    imageSymbols: ['月の冠', 'トーラー', '黒白の柱', '柘榴', '水']
  },
  {
    id: 'empress',
    name: '女帝',
    number: 3,
    arcana: 'major',
    element: '地',
    planet: '金星',
    zodiac: '牡牛座',
    keywords: ['豊穣', '母性', '創造性', '感覚'],
    uprightMeaning: '豊かさ、母性愛、創造力、自然との調和',
    reversedMeaning: '過保護、創造性の阻害、依存、物質主義',
    description: '豊かな自然に囲まれ、王座に座る女性。金星のシンボルが描かれた盾を持ち、小麦が実る。',
    advice: '五感を大切にし、美しいものに囲まれて過ごしましょう。創造的な活動が幸運を呼びます。',
    imageSymbols: ['12の星の冠', '金星記号', '小麦', '滝', 'クッション']
  },
  {
    id: 'emperor',
    name: '皇帝',
    number: 4,
    arcana: 'major',
    element: '火',
    planet: '火星',
    zodiac: '牡羊座',
    keywords: ['権威', '構造', '統制', '父性'],
    uprightMeaning: '権威、リーダーシップ、安定、保護',
    reversedMeaning: '暴君、硬直、支配欲、融通の利かなさ',
    description: '石の王座に座る髭を生やした皇帝。右手に生命のアンク、左手に地球を持つ。背景には荒涼とした山々。',
    advice: '責任を持って行動し、秩序を作り出しましょう。ただし、柔軟性も忘れずに。',
    imageSymbols: ['羊の頭', 'アンク', '地球', '赤いローブ', '山']
  },
  {
    id: 'hierophant',
    name: '教皇',
    number: 5,
    arcana: 'major',
    element: '地',
    planet: '木星',
    zodiac: '牡牛座',
    keywords: ['伝統', '精神性', '教え', '慣習'],
    uprightMeaning: '精神的指導、伝統の尊重、高等教育、信念体系',
    reversedMeaning: '教条主義、非伝統的、反抗、新しい方法',
    description: '宗教的な衣装を着た教皇が、二人の僧侶の前で祝福を与えている。三重冠を被り、三本の十字架を持つ。',
    advice: '伝統から学びつつ、自分自身の精神的な道を見つけてください。',
    imageSymbols: ['三重冠', '交差した鍵', '祝福の手', '二本の柱', '僧侶']
  },
  {
    id: 'lovers',
    name: '恋人',
    number: 6,
    arcana: 'major',
    element: '風',
    planet: '水星',
    zodiac: '双子座',
    keywords: ['愛', '選択', '調和', '価値観'],
    uprightMeaning: '愛、調和、パートナーシップ、重要な選択',
    reversedMeaning: '不調和、価値観の相違、誘惑、不誠実',
    description: 'エデンの園で、裸の男女が天使の祝福を受けている。女性の後ろには知恵の木、男性の後ろには生命の木。',
    advice: '心に従って選択をしましょう。真の調和は、自分自身との調和から始まります。',
    imageSymbols: ['大天使ラファエル', '太陽', '知恵の木', '生命の木', '蛇']
  },
  {
    id: 'chariot',
    name: '戦車',
    number: 7,
    arcana: 'major',
    element: '水',
    zodiac: '蟹座',
    keywords: ['勝利', '意志力', '統御', '前進'],
    uprightMeaning: '勝利、決意、自制心、前進する力',
    reversedMeaning: '方向性の喪失、攻撃性、自制心の欠如',
    description: '星の天蓋の下、鎧を着た戦士が黒と白のスフィンクスが引く戦車に乗っている。',
    advice: '対立する力を統合し、明確な目標に向かって前進しましょう。',
    imageSymbols: ['星の天蓋', 'スフィンクス', '都市', '鎧', '月と星']
  },
  {
    id: 'strength',
    name: '力',
    number: 8,
    arcana: 'major',
    element: '火',
    zodiac: '獅子座',
    keywords: ['内なる力', '勇気', '忍耐', '優しさ'],
    uprightMeaning: '内面の強さ、勇気、忍耐力、自信',
    reversedMeaning: '自信喪失、弱さ、自己疑念、力の乱用',
    description: '白い衣装の女性が、優しくライオンの口を閉じている。頭上には無限大記号が輝く。',
    advice: '真の強さは優しさの中にあります。恐れと向き合い、愛で克服しましょう。',
    imageSymbols: ['無限大記号', 'ライオン', '花輪', '山', '白い衣装']
  },
  {
    id: 'hermit',
    name: '隠者',
    number: 9,
    arcana: 'major',
    element: '地',
    planet: '水星',
    zodiac: '乙女座',
    keywords: ['内省', '探求', '孤独', '導き'],
    uprightMeaning: '内なる探求、精神的な導き、孤独の知恵、内省',
    reversedMeaning: '孤立、頑固、現実逃避、助言の拒否',
    description: '灰色のローブを着た老人が、雪山の頂上でランタンを掲げている。杖を持ち、一人で立つ。',
    advice: '答えを求めて内側を見つめてください。孤独は深い洞察をもたらします。',
    imageSymbols: ['ランタン', '六芒星', '杖', '雪山', 'グレーのローブ']
  },
  {
    id: 'wheel-of-fortune',
    name: '運命の輪',
    number: 10,
    arcana: 'major',
    element: '火',
    planet: '木星',
    keywords: ['運命', '変化', 'サイクル', 'チャンス'],
    uprightMeaning: '幸運、運命的な出来事、転換点、チャンス',
    reversedMeaning: '不運、抵抗、悪循環、コントロールの喪失',
    description: '大きな輪が回転し、その周りに神秘的なシンボルと生き物が配置されている。',
    advice: '変化を受け入れ、流れに身を任せましょう。全ては循環しています。',
    imageSymbols: ['スフィンクス', '蛇', 'アヌビス', 'TARO文字', '四元素記号']
  },
  {
    id: 'justice',
    name: '正義',
    number: 11,
    arcana: 'major',
    element: '風',
    zodiac: '天秤座',
    keywords: ['公正', 'バランス', '真実', '因果'],
    uprightMeaning: '公正、バランス、真実、正しい判断',
    reversedMeaning: '不公正、偏見、不誠実、法的問題',
    description: '王座に座る人物が、右手に剣、左手に天秤を持っている。赤いローブと冠を身に着ける。',
    advice: '客観的に状況を見つめ、公正な判断を下しましょう。行動には責任が伴います。',
    imageSymbols: ['剣', '天秤', '王座', '紫のベール', '四角い冠']
  },
  {
    id: 'hanged-man',
    name: '吊られた男',
    number: 12,
    arcana: 'major',
    element: '水',
    planet: '海王星',
    keywords: ['犠牲', '視点の転換', '待機', '悟り'],
    uprightMeaning: '自己犠牲、新しい視点、精神的成長、忍耐',
    reversedMeaning: '無意味な犠牲、停滞、視野の狭さ',
    description: 'T字型の木に片足で逆さに吊られた男。頭の周りには光輪が輝き、穏やかな表情。',
    advice: '視点を変えることで、新しい真実が見えてきます。今は待つ時期かもしれません。',
    imageSymbols: ['T字の木', '光輪', '赤いタイツ', '青い上着', '縛られた足']
  },
  {
    id: 'death',
    name: '死神',
    number: 13,
    arcana: 'major',
    element: '水',
    planet: '冥王星',
    zodiac: '蠍座',
    keywords: ['変容', '終わり', '再生', '解放'],
    uprightMeaning: '変容、終わりと始まり、解放、根本的な変化',
    reversedMeaning: '変化への抵抗、停滞、恐れ、内なる浄化',
    description: '黒い鎧を着た骸骨が白馬に乗り、黒い旗を掲げている。足元には倒れた王、立つ司教、祈る女性と子供。',
    advice: '古いものを手放すことで、新しいものが生まれます。変化を恐れないでください。',
    imageSymbols: ['白い馬', '黒い旗', '白いバラ', '太陽', '双子の塔']
  },
  {
    id: 'temperance',
    name: '節制',
    number: 14,
    arcana: 'major',
    element: '火',
    zodiac: '射手座',
    keywords: ['バランス', '調和', '忍耐', '統合'],
    uprightMeaning: '節度、バランス、忍耐、内なる平和',
    reversedMeaning: '過剰、不均衡、忍耐の欠如、不調和',
    description: '天使が二つのカップの間で水を注ぎ、片足を水に、もう片足を陸に置いている。',
    advice: '極端を避け、中道を歩みましょう。対立するものを調和させる時です。',
    imageSymbols: ['天使', '二つのカップ', '三角形', 'アイリス', '山への道']
  },
  {
    id: 'devil',
    name: '悪魔',
    number: 15,
    arcana: 'major',
    element: '地',
    planet: '土星',
    zodiac: '山羊座',
    keywords: ['束縛', '執着', '物質主義', '誘惑'],
    uprightMeaning: '束縛、執着、物質的な誘惑、依存',
    reversedMeaning: '解放、束縛からの脱出、気づき、自由への一歩',
    description: 'バフォメットが玉座に座り、鎖で繋がれた裸の男女が足元にいる。逆さの五芒星が頭上に。',
    advice: 'あなたを縛っているものは幻想かもしれません。本当の自由は内側から始まります。',
    imageSymbols: ['バフォメット', '逆五芒星', '鎖', '松明', '裸の男女']
  },
  {
    id: 'tower',
    name: '塔',
    number: 16,
    arcana: 'major',
    element: '火',
    planet: '火星',
    keywords: ['破壊', '突然の変化', '解放', '啓示'],
    uprightMeaning: '突然の変化、破壊、解放、真実の露呈',
    reversedMeaning: '災害の回避、恐れ、変化への抵抗',
    description: '雷に打たれて炎上する塔から、王冠が吹き飛ばされ、二人の人物が落下している。',
    advice: '古い構造が崩れることで、新しい可能性が開けます。変化を受け入れましょう。',
    imageSymbols: ['塔', '稲妻', '炎', '落下する人物', '王冠']
  },
  {
    id: 'star',
    name: '星',
    number: 17,
    arcana: 'major',
    element: '風',
    planet: '天王星',
    zodiac: '水瓶座',
    keywords: ['希望', '癒し', 'インスピレーション', '精神性'],
    uprightMeaning: '希望、癒し、再生、精神的な導き',
    reversedMeaning: '絶望、信仰の喪失、幻滅、ネガティブ思考',
    description: '裸の女性が水辺で二つの水瓶から水を注いでいる。空には一つの大きな星と七つの小さな星。',
    advice: '希望を持ち続けてください。宇宙はあなたを導いています。',
    imageSymbols: ['八芒星', '七つの星', '水瓶', '鳥', '水と大地']
  },
  {
    id: 'moon',
    name: '月',
    number: 18,
    arcana: 'major',
    element: '水',
    planet: '月',
    zodiac: '魚座',
    keywords: ['幻想', '不安', '直感', '潜在意識'],
    uprightMeaning: '幻想、不安、直感、隠された真実',
    reversedMeaning: '幻想からの解放、明晰さ、恐れの克服',
    description: '満月の下、犬と狼が吠え、ザリガニが池から這い出る。遠くには二つの塔。',
    advice: '全てが見えている訳ではありません。直感を信じつつ、冷静さを保ってください。',
    imageSymbols: ['満月', '犬と狼', 'ザリガニ', '二つの塔', '曲がりくねった道']
  },
  {
    id: 'sun',
    name: '太陽',
    number: 19,
    arcana: 'major',
    element: '火',
    planet: '太陽',
    keywords: ['成功', '喜び', '活力', '明晰さ'],
    uprightMeaning: '成功、幸福、活力、明るい未来',
    reversedMeaning: '過度の楽観、見栄、一時的な後退',
    description: '大きな太陽の下、裸の子供が白馬に乗っている。背景にはひまわりと壁。',
    advice: '人生を楽しみ、あなたの光を世界と分かち合いましょう。',
    imageSymbols: ['太陽', '子供', '白馬', 'ひまわり', '赤い旗']
  },
  {
    id: 'judgement',
    name: '審判',
    number: 20,
    arcana: 'major',
    element: '火',
    planet: '冥王星',
    keywords: ['復活', '覚醒', '判断', '許し'],
    uprightMeaning: '精神的覚醒、判断、許し、再生',
    reversedMeaning: '自己批判、過去への執着、許しの欠如',
    description: '天使がラッパを吹き、墓から人々が蘇っている。山々に囲まれた情景。',
    advice: '過去を許し、新しい自分として生まれ変わる時が来ました。',
    imageSymbols: ['大天使ガブリエル', 'ラッパ', '赤十字の旗', '蘇る人々', '山']
  },
  {
    id: 'world',
    name: '世界',
    number: 21,
    arcana: 'major',
    element: '地',
    planet: '土星',
    keywords: ['完成', '達成', '統合', '新たな始まり'],
    uprightMeaning: '完成、成就、全体性、新しいサイクル',
    reversedMeaning: '未完成、遅延、外的な成功の追求',
    description: '月桂樹の輪の中で、裸の女性が踊っている。四隅には四元素を表す生き物。',
    advice: '一つのサイクルが完成しました。祝福し、次の冒険に備えましょう。',
    imageSymbols: ['月桂樹の輪', '踊る女性', '四つの生き物', 'ワンド', '紫の布']
  }
];

// マイナーアルカナ - ワンド（火）
export const wandsCards: TarotCard[] = [
  {
    id: 'ace-of-wands',
    name: 'ワンドのエース',
    number: 1,
    arcana: 'minor',
    suit: 'wands',
    element: '火',
    keywords: ['新しい始まり', '創造力', '成長', 'インスピレーション'],
    uprightMeaning: '新しいプロジェクト、創造的なエネルギー、成長の可能性',
    reversedMeaning: '創造性の阻害、遅延、偽りのスタート',
    description: '雲から伸びる手が、葉が芽吹いたワンドを握っている。',
    advice: '新しいアイデアを行動に移す絶好の機会です。'
  },
  {
    id: 'two-of-wands',
    name: 'ワンドの2',
    number: 2,
    arcana: 'minor',
    suit: 'wands',
    element: '火',
    keywords: ['計画', '進歩', '決断', '可能性'],
    uprightMeaning: '長期計画、進歩、発見、パートナーシップ',
    reversedMeaning: '計画の欠如、恐れ、優柔不断',
    description: '城壁に立つ人物が地球儀を持ち、遠くを見つめている。',
    advice: '大きな視野で未来を計画しましょう。'
  },
  {
    id: 'three-of-wands',
    name: 'ワンドの3',
    number: 3,
    arcana: 'minor',
    suit: 'wands',
    element: '火',
    keywords: ['拡大', '先見性', '機会', '冒険'],
    uprightMeaning: '拡大、成長、機会、長期的な成功',
    reversedMeaning: '計画の遅延、挫折、視野の狭さ',
    description: '崖の上に立つ人物が、海を行く船を見守っている。',
    advice: '種を蒔いた努力が実を結び始めています。'
  },
  {
    id: 'four-of-wands',
    name: 'ワンドの4',
    number: 4,
    arcana: 'minor',
    suit: 'wands',
    element: '火',
    keywords: ['祝福', '調和', '達成', '安定'],
    uprightMeaning: '祝福、喜び、安定、達成',
    reversedMeaning: '不安定、移行期、未完成の祝福',
    description: '花で飾られた4本のワンドの下で人々が祝っている。',
    advice: '達成を祝い、喜びを分かち合いましょう。'
  },
  {
    id: 'five-of-wands',
    name: 'ワンドの5',
    number: 5,
    arcana: 'minor',
    suit: 'wands',
    element: '火',
    keywords: ['競争', '対立', '挑戦', '多様性'],
    uprightMeaning: '競争、対立、挑戦、意見の相違',
    reversedMeaning: '対立の回避、内なる葛藤、妥協',
    description: '5人の若者がワンドを持って争っている。',
    advice: '健全な競争は成長をもたらします。'
  },
  {
    id: 'six-of-wands',
    name: 'ワンドの6',
    number: 6,
    arcana: 'minor',
    suit: 'wands',
    element: '火',
    keywords: ['勝利', '認識', 'リーダーシップ', '成功'],
    uprightMeaning: '勝利、公的な認識、自信、リーダーシップ',
    reversedMeaning: '私的な達成、自己疑念、傲慢',
    description: '月桂冠を被った騎手が、群衆の歓呼を受けている。',
    advice: '成功を謙虚に受け止め、他者と分かち合いましょう。'
  },
  {
    id: 'seven-of-wands',
    name: 'ワンドの7',
    number: 7,
    arcana: 'minor',
    suit: 'wands',
    element: '火',
    keywords: ['防衛', '挑戦', '競争', '忍耐'],
    uprightMeaning: '防衛、挑戦への対処、競争、持続',
    reversedMeaning: '圧倒される、諦め、立場の喪失',
    description: '高台に立つ人物が、下から迫るワンドを防いでいる。',
    advice: '自分の立場を守り抜く勇気を持ちましょう。'
  },
  {
    id: 'eight-of-wands',
    name: 'ワンドの8',
    number: 8,
    arcana: 'minor',
    suit: 'wands',
    element: '火',
    keywords: ['迅速', '動き', '急速な進展', '旅行'],
    uprightMeaning: '迅速な行動、急速な進展、旅行、動き',
    reversedMeaning: '遅延、挫折、内なる動揺',
    description: '8本のワンドが空を飛んでいる。',
    advice: '物事が急速に動いています。流れに乗りましょう。'
  },
  {
    id: 'nine-of-wands',
    name: 'ワンドの9',
    number: 9,
    arcana: 'minor',
    suit: 'wands',
    element: '火',
    keywords: ['忍耐', '勇気', '持続', '最後の試練'],
    uprightMeaning: '忍耐、最後の挑戦、勇気、境界線',
    reversedMeaning: '妄想、頑固、降伏の必要性',
    description: '傷ついた戦士が、ワンドに寄りかかって立っている。',
    advice: 'もう少しで目標に到達します。最後まで諦めないで。'
  },
  {
    id: 'ten-of-wands',
    name: 'ワンドの10',
    number: 10,
    arcana: 'minor',
    suit: 'wands',
    element: '火',
    keywords: ['重荷', '責任', '努力', '達成への圧力'],
    uprightMeaning: '重い責任、重荷、努力、達成への圧力',
    reversedMeaning: '責任の委譲、重荷からの解放',
    description: '人物が10本のワンドを抱えて歩いている。',
    advice: '全てを一人で背負う必要はありません。助けを求めましょう。'
  },
  {
    id: 'page-of-wands',
    name: 'ワンドのペイジ',
    number: 11,
    arcana: 'minor',
    suit: 'wands',
    element: '火',
    keywords: ['探求', '興奮', '自由な精神', '新しいアイデア'],
    uprightMeaning: '新しいアイデア、熱意、探求心、メッセージ',
    reversedMeaning: '悪いニュース、未熟さ、無責任',
    description: '若者がワンドを掲げ、遠くを見つめている。',
    advice: '子供のような好奇心を持って新しいことに挑戦しましょう。'
  },
  {
    id: 'knight-of-wands',
    name: 'ワンドのナイト',
    number: 12,
    arcana: 'minor',
    suit: 'wands',
    element: '火',
    keywords: ['冒険', '情熱', '衝動', '行動'],
    uprightMeaning: '冒険、エネルギー、情熱、衝動的な行動',
    reversedMeaning: '怒り、衝動性、無謀さ、遅延',
    description: '炎のような馬に乗った騎士が前進している。',
    advice: '情熱を持って行動しつつ、計画性も忘れずに。'
  },
  {
    id: 'queen-of-wands',
    name: 'ワンドのクイーン',
    number: 13,
    arcana: 'minor',
    suit: 'wands',
    element: '火',
    keywords: ['自信', 'カリスマ', '決意', '創造性'],
    uprightMeaning: '自信、独立、カリスマ、社交性',
    reversedMeaning: '嫉妬、不安、自己中心的',
    description: '黒猫を従えた女王が、ひまわりで飾られた王座に座る。',
    advice: '自信を持って、あなたの光を輝かせましょう。'
  },
  {
    id: 'king-of-wands',
    name: 'ワンドのキング',
    number: 14,
    arcana: 'minor',
    suit: 'wands',
    element: '火',
    keywords: ['リーダーシップ', 'ビジョン', '起業家精神', '名誉'],
    uprightMeaning: '自然なリーダー、ビジョン、起業家精神',
    reversedMeaning: '傲慢、衝動的、高圧的',
    description: 'ライオンとサラマンダーで飾られた王座に座る王。',
    advice: 'ビジョンを持ってリードし、他者を鼓舞しましょう。'
  }
];

// マイナーアルカナ - カップ（水）
export const cupsCards: TarotCard[] = [
  {
    id: 'ace-of-cups',
    name: 'カップのエース',
    number: 1,
    arcana: 'minor',
    suit: 'cups',
    element: '水',
    keywords: ['新しい愛', '感情', '直感', '精神性'],
    uprightMeaning: '新しい愛、感情の始まり、創造性、精神的覚醒',
    reversedMeaning: '感情の抑圧、空虚感、創造性の阻害',
    description: '雲から伸びる手が、溢れる水のカップを差し出している。',
    advice: '心を開いて、愛と喜びを受け入れましょう。'
  },
  {
    id: 'two-of-cups',
    name: 'カップの2',
    number: 2,
    arcana: 'minor',
    suit: 'cups',
    element: '水',
    keywords: ['パートナーシップ', '調和', '相互理解', '愛'],
    uprightMeaning: 'パートナーシップ、相互理解、調和、愛の結合',
    reversedMeaning: '不調和、分離、コミュニケーション不足',
    description: '二人の人物がカップを交わし、上にはカドゥケウスが浮かぶ。',
    advice: '心を開いて相手と向き合い、深い絆を築きましょう。'
  },
  {
    id: 'three-of-cups',
    name: 'カップの3',
    number: 3,
    arcana: 'minor',
    suit: 'cups',
    element: '水',
    keywords: ['祝福', '友情', 'コミュニティ', '創造性'],
    uprightMeaning: '祝福、友情、創造的な協力、コミュニティ',
    reversedMeaning: '過剰な快楽、ゴシップ、孤立',
    description: '三人の女性がカップを掲げて祝っている。',
    advice: '友人と喜びを分かち合い、豊かな関係を築きましょう。'
  },
  {
    id: 'four-of-cups',
    name: 'カップの4',
    number: 4,
    arcana: 'minor',
    suit: 'cups',
    element: '水',
    keywords: ['内省', '再評価', '無関心', '機会'],
    uprightMeaning: '内省、瞑想、再評価、新しい機会への気づき',
    reversedMeaning: '新しい可能性、動機づけ、機会の受容',
    description: '木の下に座る人物に、雲から新しいカップが差し出されている。',
    advice: '内なる声に耳を傾け、新しい可能性に気づきましょう。'
  },
  {
    id: 'five-of-cups',
    name: 'カップの5',
    number: 5,
    arcana: 'minor',
    suit: 'cups',
    element: '水',
    keywords: ['悲しみ', '喪失', '後悔', '失望'],
    uprightMeaning: '悲しみ、喪失、後悔、失望',
    reversedMeaning: '受容、前進、許し、新しい始まり',
    description: '黒いマントの人物が、倒れた3つのカップを見つめている。',
    advice: '失ったものを悼みつつ、残されたものに感謝しましょう。'
  },
  {
    id: 'six-of-cups',
    name: 'カップの6',
    number: 6,
    arcana: 'minor',
    suit: 'cups',
    element: '水',
    keywords: ['懐かしさ', '子供時代', '無邪気', '喜び'],
    uprightMeaning: '懐かしさ、子供時代の思い出、無邪気さ、過去からの贈り物',
    reversedMeaning: '過去への執着、成長、未来への移行',
    description: '子供が別の子供に花の入ったカップを渡している。',
    advice: '過去の美しい思い出を大切にしつつ、現在を生きましょう。'
  },
  {
    id: 'seven-of-cups',
    name: 'カップの7',
    number: 7,
    arcana: 'minor',
    suit: 'cups',
    element: '水',
    keywords: ['選択', '幻想', '空想', '可能性'],
    uprightMeaning: '選択肢、幻想、想像力、可能性',
    reversedMeaning: '明確さ、決断、現実への回帰',
    description: '雲の中に浮かぶ7つのカップ、それぞれに異なるシンボル。',
    advice: '多くの選択肢から、現実的で心に響くものを選びましょう。'
  },
  {
    id: 'eight-of-cups',
    name: 'カップの8',
    number: 8,
    arcana: 'minor',
    suit: 'cups',
    element: '水',
    keywords: ['離脱', '探求', '手放す', '精神的成長'],
    uprightMeaning: '離脱、より深い意味の探求、物質的なものを手放す',
    reversedMeaning: '躊躇、恐れ、偽りの満足',
    description: '人物が8つのカップを残して山へ向かって歩いている。',
    advice: 'より深い充足を求めて、慣れ親しんだものを手放す勇気を。'
  },
  {
    id: 'nine-of-cups',
    name: 'カップの9',
    number: 9,
    arcana: 'minor',
    suit: 'cups',
    element: '水',
    keywords: ['満足', '願望成就', '感情的充足', '幸福'],
    uprightMeaning: '願望の成就、満足、感情的な充足、幸福',
    reversedMeaning: '物質主義、不満足、内なる幸福の欠如',
    description: '満足そうな人物が、アーチ状に並んだ9つのカップの前に座っている。',
    advice: 'あなたの願いは叶いつつあります。感謝の心を忘れずに。'
  },
  {
    id: 'ten-of-cups',
    name: 'カップの10',
    number: 10,
    arcana: 'minor',
    suit: 'cups',
    element: '水',
    keywords: ['幸福', '調和', '家族', '感情的成就'],
    uprightMeaning: '幸福、調和、家族の幸せ、感情的な成就',
    reversedMeaning: '価値観の相違、偽りの幸福、関係の問題',
    description: '虹の下で家族が喜び、10個のカップがアーチを描く。',
    advice: '真の幸福は愛する人々との絆の中にあります。'
  }
];

// マイナーアルカナ - ソード（風）
export const swordsCards: TarotCard[] = [
  {
    id: 'ace-of-swords',
    name: 'ソードのエース',
    number: 1,
    arcana: 'minor',
    suit: 'swords',
    element: '風',
    keywords: ['真実', '明晰さ', '突破', '新しいアイデア'],
    uprightMeaning: '精神的な明晰さ、真実、突破、新しいアイデア',
    reversedMeaning: '混乱、誤解、精神的な霧',
    description: '雲から伸びる手が、王冠を貫く剣を握っている。',
    advice: '真実を追求し、明晰な思考で問題を切り開きましょう。'
  },
  {
    id: 'two-of-swords',
    name: 'ソードの2',
    number: 2,
    arcana: 'minor',
    suit: 'swords',
    element: '風',
    keywords: ['困難な決定', 'ジレンマ', 'バランス', '停滞'],
    uprightMeaning: '困難な決定、ジレンマ、バランス、内なる対立',
    reversedMeaning: '優柔不断、情報不足、決断の必要性',
    description: '目隠しをした女性が、交差した二本の剣を持っている。',
    advice: '心を静めて、内なる声に耳を傾けましょう。'
  },
  {
    id: 'three-of-swords',
    name: 'ソードの3',
    number: 3,
    arcana: 'minor',
    suit: 'swords',
    element: '風',
    keywords: ['悲しみ', '痛み', '裏切り', '喪失'],
    uprightMeaning: '心の痛み、悲しみ、裏切り、分離',
    reversedMeaning: '回復、許し、痛みからの解放',
    description: '三本の剣が赤いハートを貫いている。背景は雨。',
    advice: '痛みを認め、癒しのプロセスを始めましょう。'
  },
  {
    id: 'four-of-swords',
    name: 'ソードの4',
    number: 4,
    arcana: 'minor',
    suit: 'swords',
    element: '風',
    keywords: ['休息', '回復', '内省', '準備'],
    uprightMeaning: '休息、回復、瞑想、準備期間',
    reversedMeaning: '落ち着きのなさ、燃え尽き、活動への復帰',
    description: '教会内で横たわる騎士の像、上に三本の剣。',
    advice: '休息を取り、内なる平和を取り戻しましょう。'
  },
  {
    id: 'five-of-swords',
    name: 'ソードの5',
    number: 5,
    arcana: 'minor',
    suit: 'swords',
    element: '風',
    keywords: ['対立', '敗北', '屈辱', '勝利の代償'],
    uprightMeaning: '対立、不名誉な勝利、敗北、裏切り',
    reversedMeaning: '和解、過去を手放す、許し',
    description: '勝者が剣を集め、敗者が去っていく場面。',
    advice: '勝利の代償を考え、時には引くことも大切です。'
  },
  {
    id: 'six-of-swords',
    name: 'ソードの6',
    number: 6,
    arcana: 'minor',
    suit: 'swords',
    element: '風',
    keywords: ['移行', '変化', '旅', '前進'],
    uprightMeaning: '移行、困難からの脱出、旅、前進',
    reversedMeaning: '抵抗、望まない変化、停滞',
    description: 'ボートに乗る親子、船頭が静かな水を渡る。',
    advice: '困難を後にし、より良い場所へ向かいましょう。'
  },
  {
    id: 'seven-of-swords',
    name: 'ソードの7',
    number: 7,
    arcana: 'minor',
    suit: 'swords',
    element: '風',
    keywords: ['策略', '欺瞞', '逃避', '機転'],
    uprightMeaning: '策略、欺瞞、秘密の行動、機転',
    reversedMeaning: '告白、後悔、計画の失敗',
    description: '男が5本の剣を持って忍び足でキャンプから去る。',
    advice: '正直さが最良の方策かもしれません。'
  },
  {
    id: 'eight-of-swords',
    name: 'ソードの8',
    number: 8,
    arcana: 'minor',
    suit: 'swords',
    element: '風',
    keywords: ['制限', '束縛', '無力感', '自己制限'],
    uprightMeaning: '制限、束縛、無力感、自己制限的な思考',
    reversedMeaning: '解放、新しい視点、自由への一歩',
    description: '目隠しされ縛られた女性、周りを8本の剣が囲む。',
    advice: '制限は心の中にあるかもしれません。視点を変えましょう。'
  },
  {
    id: 'nine-of-swords',
    name: 'ソードの9',
    number: 9,
    arcana: 'minor',
    suit: 'swords',
    element: '風',
    keywords: ['不安', '悪夢', '罪悪感', '心配'],
    uprightMeaning: '不安、悪夢、過度の心配、罪悪感',
    reversedMeaning: '希望、不安からの解放、癒し',
    description: 'ベッドで頭を抱える人物、壁に9本の剣。',
    advice: '不安は現実より大きく見えるもの。助けを求めましょう。'
  },
  {
    id: 'ten-of-swords',
    name: 'ソードの10',
    number: 10,
    arcana: 'minor',
    suit: 'swords',
    element: '風',
    keywords: ['終焉', '裏切り', '崩壊', '再生への準備'],
    uprightMeaning: '痛ましい終わり、裏切り、崩壊、底',
    reversedMeaning: '回復、再生、最悪期の終わり',
    description: '10本の剣が背中に刺さった人物が倒れている。',
    advice: '最悪の時期は過ぎました。再生の時が来ています。'
  }
];

// マイナーアルカナ - ペンタクル（地）
export const pentaclesCards: TarotCard[] = [
  {
    id: 'ace-of-pentacles',
    name: 'ペンタクルのエース',
    number: 1,
    arcana: 'minor',
    suit: 'pentacles',
    element: '地',
    keywords: ['新しい機会', '繁栄', '物質的成功', '顕現'],
    uprightMeaning: '新しい金銭的機会、繁栄、物質的成功、顕現',
    reversedMeaning: '機会の喪失、金銭的な計画の失敗',
    description: '雲から伸びる手が、金のペンタクルを差し出している。',
    advice: '新しい物質的な機会を掴み、地に足をつけて進みましょう。'
  },
  {
    id: 'two-of-pentacles',
    name: 'ペンタクルの2',
    number: 2,
    arcana: 'minor',
    suit: 'pentacles',
    element: '地',
    keywords: ['バランス', '適応', '時間管理', '優先順位'],
    uprightMeaning: 'バランス、適応性、時間管理、複数の責任',
    reversedMeaning: '圧倒される、バランスの喪失、組織化の必要',
    description: '人物が無限大記号で結ばれた2つのペンタクルを操っている。',
    advice: '複数の責任をうまくバランスを取って管理しましょう。'
  },
  {
    id: 'three-of-pentacles',
    name: 'ペンタクルの3',
    number: 3,
    arcana: 'minor',
    suit: 'pentacles',
    element: '地',
    keywords: ['チームワーク', 'コラボレーション', 'スキル', '計画'],
    uprightMeaning: 'チームワーク、コラボレーション、スキルの向上、計画',
    reversedMeaning: '協力の欠如、品質の低下、調和の欠如',
    description: '職人が大聖堂で作業し、他の人々が計画を確認している。',
    advice: '他者と協力し、各自の才能を活かしましょう。'
  },
  {
    id: 'four-of-pentacles',
    name: 'ペンタクルの4',
    number: 4,
    arcana: 'minor',
    suit: 'pentacles',
    element: '地',
    keywords: ['保守', '統制', '安定', '所有欲'],
    uprightMeaning: '保守、統制、安定、物質的な安全',
    reversedMeaning: 'けち、物質主義、閉鎖的',
    description: '人物が4つのペンタクルをしっかりと抱えている。',
    advice: '安全を求めつつも、過度の執着は避けましょう。'
  },
  {
    id: 'five-of-pentacles',
    name: 'ペンタクルの5',
    number: 5,
    arcana: 'minor',
    suit: 'pentacles',
    element: '地',
    keywords: ['困窮', '不安', '孤立', '物質的損失'],
    uprightMeaning: '金銭的損失、貧困、孤立、不安',
    reversedMeaning: '回復、精神的な豊かさ、困難の克服',
    description: '雪の中、二人の貧しい人が教会の窓の前を通り過ぎる。',
    advice: '困難な時期でも、助けは近くにあるかもしれません。'
  },
  {
    id: 'six-of-pentacles',
    name: 'ペンタクルの6',
    number: 6,
    arcana: 'minor',
    suit: 'pentacles',
    element: '地',
    keywords: ['寛大さ', '慈善', '公正', '分かち合い'],
    uprightMeaning: '寛大さ、慈善、公正な分配、分かち合い',
    reversedMeaning: '利己主義、借金、不公正',
    description: '裕福な商人が貧しい人々に施しをしている。',
    advice: '与えることと受け取ることのバランスを保ちましょう。'
  },
  {
    id: 'seven-of-pentacles',
    name: 'ペンタクルの7',
    number: 7,
    arcana: 'minor',
    suit: 'pentacles',
    element: '地',
    keywords: ['忍耐', '投資', '長期的視野', '成長'],
    uprightMeaning: '忍耐、投資の成果、長期的な視野、持続的な成長',
    reversedMeaning: '不安、焦り、報われない努力',
    description: '農夫が成長した植物とペンタクルを見つめている。',
    advice: '忍耐強く努力を続ければ、やがて実を結びます。'
  },
  {
    id: 'eight-of-pentacles',
    name: 'ペンタクルの8',
    number: 8,
    arcana: 'minor',
    suit: 'pentacles',
    element: '地',
    keywords: ['熟練', '献身', '品質', '職人気質'],
    uprightMeaning: '熟練、献身、品質へのこだわり、スキルの向上',
    reversedMeaning: '完璧主義、野心の欠如、品質の低下',
    description: '職人が一心にペンタクルを彫っている。',
    advice: '技術を磨き、細部にこだわることで成功へ近づきます。'
  },
  {
    id: 'nine-of-pentacles',
    name: 'ペンタクルの9',
    number: 9,
    arcana: 'minor',
    suit: 'pentacles',
    element: '地',
    keywords: ['豊かさ', '自立', '贅沢', '達成'],
    uprightMeaning: '豊かさ、自立、贅沢、個人的な達成',
    reversedMeaning: '過労、ステータスへの執着、孤独',
    description: '豊かな庭園で、優雅な女性が鷹と共にいる。',
    advice: '努力の成果を楽しみ、達成を祝いましょう。'
  },
  {
    id: 'ten-of-pentacles',
    name: 'ペンタクルの10',
    number: 10,
    arcana: 'minor',
    suit: 'pentacles',
    element: '地',
    keywords: ['遺産', '家族の富', '伝統', '長期的成功'],
    uprightMeaning: '遺産、家族の富、伝統、長期的な成功',
    reversedMeaning: '家族の対立、財産問題、伝統への反発',
    description: '三世代の家族が、ペンタクルで飾られたアーチの下にいる。',
    advice: '世代を超えて受け継がれる価値あるものを築きましょう。'
  }
];

// 全てのタロットカードを統合
export const allTarotCards: TarotCard[] = [
  ...majorArcana,
  ...wandsCards,
  ...cupsCards,
  ...swordsCards,
  ...pentaclesCards
];

// カードを検索する関数
export function getTarotCard(id: string): TarotCard | undefined {
  return allTarotCards.find(card => card.id === id);
}

// スートごとにカードを取得する関数
export function getCardsBySuit(suit: 'wands' | 'cups' | 'swords' | 'pentacles'): TarotCard[] {
  return allTarotCards.filter(card => card.suit === suit);
}

// アルカナごとにカードを取得する関数
export function getCardsByArcana(arcana: 'major' | 'minor'): TarotCard[] {
  return allTarotCards.filter(card => card.arcana === arcana);
}