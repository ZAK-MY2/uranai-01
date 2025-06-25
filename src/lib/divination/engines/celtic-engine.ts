import { BaseDivinationEngine, DivinationInput, EnvironmentData } from '../base-engine';

// ケルトの樹木暦（オガム文字）
const CELTIC_TREES = [
  { name: 'ベス（白樺）', ogham: 'ᚁ', dates: '12/24-1/20', element: '風', qualities: ['新しい始まり', '浄化', '再生'] },
  { name: 'ルイス（ナナカマド）', ogham: 'ᚂ', dates: '1/21-2/17', element: '火', qualities: ['保護', '洞察', '魔法'] },
  { name: 'フェルン（ハンノキ）', ogham: 'ᚃ', dates: '2/18-3/17', element: '水', qualities: ['勇気', '先駆者', '決意'] },
  { name: 'サイル（柳）', ogham: 'ᚄ', dates: '3/18-4/14', element: '水', qualities: ['直感', '月の力', '感受性'] },
  { name: 'ヌイン（トネリコ）', ogham: 'ᚅ', dates: '4/15-5/12', element: '風', qualities: ['成長', '拡大', '霊的戦士'] },
  { name: 'ウアス（サンザシ）', ogham: 'ᚆ', dates: '5/13-6/9', element: '火', qualities: ['浄化', '守護', '待機'] },
  { name: 'ドゥイル（オーク）', ogham: 'ᚇ', dates: '6/10-7/7', element: '地', qualities: ['力', '安定', '正義'] },
  { name: 'ティン（ヒイラギ）', ogham: 'ᚈ', dates: '7/8-8/4', element: '火', qualities: ['バランス', '正義', '主権'] },
  { name: 'コル（ハシバミ）', ogham: 'ᚉ', dates: '8/5-9/1', element: '風', qualities: ['知恵', '直感', '霊感'] },
  { name: 'ムイン（ブドウ）', ogham: 'ᚋ', dates: '9/2-9/29', element: '水', qualities: ['予言', '内なる声', '真実'] },
  { name: 'ゴート（ツタ）', ogham: 'ᚌ', dates: '9/30-10/27', element: '地', qualities: ['成長', '変容', '迷宮'] },
  { name: 'ンゲタル（葦）', ogham: 'ᚍ', dates: '10/28-11/24', element: '水', qualities: ['行動', '目的', '直接性'] },
  { name: 'ルイス（ニワトコ）', ogham: 'ᚏ', dates: '11/25-12/23', element: '地', qualities: ['完成', '進化', '再生'] }
];

// ケルトの動物トーテム
const CELTIC_ANIMALS = [
  { name: '鹿', meaning: '優雅、自立、再生', element: '地' },
  { name: '猫', meaning: '守護、神秘、独立', element: '風' },
  { name: 'ヘビ', meaning: '変容、再生、医術', element: '水' },
  { name: '狐', meaning: '狡猾、適応、外交', element: '火' },
  { name: '牛', meaning: '豊穣、忍耐、母性', element: '地' },
  { name: '海馬', meaning: '水の力、変化、感情', element: '水' },
  { name: '鷹', meaning: '視野、焦点、真実', element: '風' },
  { name: '魚', meaning: '深い知識、霊感、繁栄', element: '水' },
  { name: '白鳥', meaning: '愛、美、変容', element: '風' },
  { name: '蝶', meaning: '変容、魂、再生', element: '風' },
  { name: '狼', meaning: '直感、学習、社会性', element: '地' },
  { name: '鷲', meaning: 'リーダーシップ、勇気、更新', element: '風' },
  { name: 'サケ', meaning: '知恵、決意、回帰', element: '水' }
];

// ケルトの聖地・パワースポット
const CELTIC_SACRED_PLACES = {
  '丘': { energy: '天と地の接点', element: '風' },
  '泉': { energy: '癒しと洞察', element: '水' },
  '森': { energy: '古代の知恵', element: '地' },
  '石環': { energy: '時空の門', element: '全て' },
  '洞窟': { energy: '内なる旅', element: '地' },
  '島': { energy: '聖域と隔離', element: '水' },
  '十字路': { energy: '選択と変化', element: '全て' },
  '聖なる木': { energy: '世界樹', element: '地' }
};

export interface CelticReading {
  birthTree: {
    tree: typeof CELTIC_TREES[0];
    oghamMessage: string;
    seasonalInfluence: string;
  };
  animalTotem: {
    primary: typeof CELTIC_ANIMALS[0];
    secondary: typeof CELTIC_ANIMALS[0];
    message: string;
  };
  celticCross: {
    present: string;
    challenge: string;
    past: string;
    future: string;
    outcome: string;
    approach: string;
    influences: string;
    hopes: string;
    environment: string;
    finalOutcome: string;
  };
  druidsGuidance: {
    element: string;
    sacredPlace: string;
    ritual: string;
    herbs: string[];
    crystals: string[];
  };
  seasonalFestival: {
    name: string;
    date: string;
    energy: string;
    practices: string[];
  };
  personalMessage?: string;
  ancestralWisdom?: string;
}

export class CelticEngine extends BaseDivinationEngine<CelticReading> {
  calculate(): CelticReading {
    const birthTree = this.calculateBirthTree();
    const animalTotem = this.calculateAnimalTotem();
    const celticCross = this.performCelticCross();
    const druidsGuidance = this.generateDruidsGuidance(birthTree, animalTotem);
    const seasonalFestival = this.getCurrentFestival();
    
    const personalMessage = this.generatePersonalMessage(birthTree, animalTotem);
    const ancestralWisdom = this.channelAncestralWisdom();

    return {
      birthTree,
      animalTotem,
      celticCross,
      druidsGuidance,
      seasonalFestival,
      personalMessage,
      ancestralWisdom
    };
  }

  private calculateBirthTree(): CelticReading['birthTree'] {
    const birthDate = this.input.birthDate;
    const month = birthDate.getMonth() + 1;
    const day = birthDate.getDate();
    
    // 誕生日から対応する樹木を見つける
    let birthTree = CELTIC_TREES[0]; // デフォルト
    
    for (const tree of CELTIC_TREES) {
      const [startDate, endDate] = tree.dates.split('-');
      const [startMonth, startDay] = startDate.split('/').map(Number);
      const [endMonth, endDay] = endDate.split('/').map(Number);
      
      // 年をまたぐ場合の処理
      if (startMonth > endMonth) {
        if ((month === startMonth && day >= startDay) || 
            (month < startMonth && month === endMonth && day <= endDay) ||
            (month < endMonth)) {
          birthTree = tree;
          break;
        }
      } else {
        if ((month === startMonth && day >= startDay) || 
            (month > startMonth && month < endMonth) ||
            (month === endMonth && day <= endDay)) {
          birthTree = tree;
          break;
        }
      }
    }
    
    // オガム文字のメッセージ
    const oghamMessage = this.interpretOgham(birthTree);
    
    // 季節の影響
    const seasonalInfluence = this.getSeasonalInfluence(birthDate);
    
    return {
      tree: birthTree,
      oghamMessage,
      seasonalInfluence
    };
  }

  private interpretOgham(tree: typeof CELTIC_TREES[0]): string {
    const messages: Record<string, string> = {
      'ベス（白樺）': 'あなたは新しいサイクルの始まりに立っています。過去を浄化し、新たな道を歩み始める時です。',
      'ルイス（ナナカマド）': '内なる洞察力が高まっています。直感を信じ、スピリチュアルな保護を求めてください。',
      'フェルン（ハンノキ）': '勇気を持って未知の領域に踏み出す時です。あなたは道を切り開く先駆者です。',
      'サイル（柳）': '月のリズムと調和し、感情の流れに身を任せてください。夢と直感があなたを導きます。',
      'ヌイン（トネリコ）': '内なる戦士が目覚めています。正義のために立ち上がり、成長を恐れないでください。',
      'ウアス（サンザシ）': '浄化と待機の時期です。急がず、適切なタイミングを待ちましょう。',
      'ドゥイル（オーク）': '強さと安定性があなたの基盤です。リーダーシップを発揮し、正義を守ってください。',
      'ティン（ヒイラギ）': 'バランスと調和が鍵となります。対立する力を統合し、主権を確立してください。',
      'コル（ハシバミ）': '知恵の泉があなたの内にあります。瞑想と内省を通じて、隠された知識にアクセスしてください。',
      'ムイン（ブドウ）': '予言的な洞察が与えられています。内なる声に耳を傾け、真実を語ってください。',
      'ゴート（ツタ）': '螺旋状の成長パターンに従ってください。迷宮を通り抜けることで、変容がもたらされます。',
      'ンゲタル（葦）': '直接的な行動が求められています。目的に向かって真っ直ぐ進んでください。',
      'ルイス（ニワトコ）': '完成と再生の時です。古いサイクルを終え、新しい進化の段階に入ります。'
    };
    
    return messages[tree.name] || '古代の知恵があなたを導いています。';
  }

  private getSeasonalInfluence(date: Date): string {
    const month = date.getMonth();
    
    if (month >= 2 && month <= 4) {
      return '春の目覚めのエネルギーがあなたを新しい成長へと導きます。種をまき、計画を立てる時期です。';
    } else if (month >= 5 && month <= 7) {
      return '夏の豊かなエネルギーがあなたの創造性を開花させます。活動的に、情熱的に生きてください。';
    } else if (month >= 8 && month <= 10) {
      return '秋の収穫のエネルギーが実りをもたらします。感謝と共に、これまでの成果を受け取ってください。';
    } else {
      return '冬の内省のエネルギーが深い洞察をもたらします。内なる光を育て、春への準備をしてください。';
    }
  }

  private calculateAnimalTotem(): CelticReading['animalTotem'] {
    const seed = this.generateSeed();
    
    // プライマリートーテムの選択
    const primaryIndex = seed % CELTIC_ANIMALS.length;
    const primary = CELTIC_ANIMALS[primaryIndex];
    
    // セカンダリートーテムの選択（プライマリーとは異なる）
    let secondaryIndex = (seed * 2) % CELTIC_ANIMALS.length;
    if (secondaryIndex === primaryIndex) {
      secondaryIndex = (secondaryIndex + 1) % CELTIC_ANIMALS.length;
    }
    const secondary = CELTIC_ANIMALS[secondaryIndex];
    
    // メッセージの生成
    const message = this.generateTotemMessage(primary, secondary);
    
    return {
      primary,
      secondary,
      message
    };
  }

  private generateTotemMessage(primary: typeof CELTIC_ANIMALS[0], secondary: typeof CELTIC_ANIMALS[0]): string {
    return `${primary.name}の霊があなたの主要なガイドとして、${primary.meaning}の力をもたらします。` +
           `また、${secondary.name}が補助的なガイドとして、${secondary.meaning}の知恵を授けてくれます。` +
           `この二つの動物霊が協力して、あなたの人生の旅路を導いています。`;
  }

  private performCelticCross(): CelticReading['celticCross'] {
    // ケルト十字展開の各位置の意味を生成
    const positions = this.generateCelticCrossPositions();
    
    return {
      present: positions[0],
      challenge: positions[1],
      past: positions[2],
      future: positions[3],
      outcome: positions[4],
      approach: positions[5],
      influences: positions[6],
      hopes: positions[7],
      environment: positions[8],
      finalOutcome: positions[9]
    };
  }

  private generateCelticCrossPositions(): string[] {
    const seed = this.generateSeed();
    const timeModifier = this.getTimeModifier();
    
    // 各位置のメッセージテンプレート
    const templates = {
      present: [
        '現在、あなたは変容の門に立っています',
        '今この瞬間、新しい力が目覚めています',
        '現在の状況は、成長のための完璧な機会です'
      ],
      challenge: [
        '乗り越えるべき課題は、あなたの内なる恐れです',
        '外部からの抵抗が試練となっています',
        '古い習慣を手放すことが求められています'
      ],
      past: [
        '過去の経験が今の土台となっています',
        '祖先からの贈り物が影響を与えています',
        '以前の選択が現在の道を形作りました'
      ],
      future: [
        '新しい扉が開かれようとしています',
        '予期せぬ機会が訪れる兆しがあります',
        '内なる力の開花が待っています'
      ],
      outcome: [
        '努力は豊かな実りをもたらすでしょう',
        '変容は完成へと向かいます',
        '新しい自己が誕生します'
      ]
    };
    
    // シードに基づいて各位置のメッセージを選択
    const positions: string[] = [];
    let currentSeed = seed;
    
    Object.values(templates).forEach(templateArray => {
      currentSeed = (currentSeed * 1103515245 + 12345) % 2147483648;
      const index = currentSeed % templateArray.length;
      positions.push(templateArray[index]);
    });
    
    // 残りの位置も生成
    positions.push('あなたのアプローチは直感的で正しいものです');
    positions.push('周囲からの影響は概ね好意的です');
    positions.push('内なる希望が現実化しつつあります');
    positions.push('環境はあなたの成長を支えています');
    positions.push('最終的に、あなたは目的を達成し、新たな段階へと進みます');
    
    return positions;
  }

  private generateDruidsGuidance(
    birthTree: CelticReading['birthTree'],
    animalTotem: CelticReading['animalTotem']
  ): CelticReading['druidsGuidance'] {
    // 主要素の決定
    const elements = [birthTree.tree.element, animalTotem.primary.element];
    const primaryElement = this.determinePrimaryElement(elements);
    
    // 聖地の選択
    const sacredPlace = this.selectSacredPlace(primaryElement);
    
    // 儀式の提案
    const ritual = this.suggestRitual(birthTree.tree, animalTotem.primary);
    
    // ハーブの選択
    const herbs = this.selectHerbs(primaryElement, birthTree.tree);
    
    // クリスタルの選択
    const crystals = this.selectCrystals(primaryElement, animalTotem.primary);
    
    return {
      element: primaryElement,
      sacredPlace,
      ritual,
      herbs,
      crystals
    };
  }

  private determinePrimaryElement(elements: string[]): string {
    // 要素の頻度を数える
    const elementCount: Record<string, number> = {};
    elements.forEach(element => {
      elementCount[element] = (elementCount[element] || 0) + 1;
    });
    
    // 最も頻度の高い要素を返す
    let maxCount = 0;
    let primaryElement = '地';
    
    Object.entries(elementCount).forEach(([element, count]) => {
      if (count > maxCount) {
        maxCount = count;
        primaryElement = element;
      }
    });
    
    return primaryElement;
  }

  private selectSacredPlace(element: string): string {
    const placesByElement: Record<string, string[]> = {
      '地': ['森', '洞窟', '聖なる木'],
      '水': ['泉', '島'],
      '火': ['丘', '十字路'],
      '風': ['丘', '石環', '十字路']
    };
    
    const places = placesByElement[element] || ['石環'];
    const selectedPlace = places[Math.floor(Math.random() * places.length)];
    const placeEnergy = CELTIC_SACRED_PLACES[selectedPlace as keyof typeof CELTIC_SACRED_PLACES];
    
    return `${selectedPlace} - ${placeEnergy.energy}`;
  }

  private suggestRitual(tree: typeof CELTIC_TREES[0], animal: typeof CELTIC_ANIMALS[0]): string {
    return `${tree.name}の木の下で瞑想し、${animal.name}の霊を呼び出してください。` +
           `月の光の下で、あなたの意図を明確にし、自然界との調和を求めてください。`;
  }

  private selectHerbs(element: string, tree: typeof CELTIC_TREES[0]): string[] {
    const herbsByElement: Record<string, string[]> = {
      '地': ['オーク樹皮', 'マンドレイク', 'パチョリ', 'ヴェティバー'],
      '水': ['柳の樹皮', 'カモミール', 'ジャスミン', 'ムーンフラワー'],
      '火': ['シナモン', 'ドラゴンズブラッド', 'ジンジャー', 'クローブ'],
      '風': ['ラベンダー', 'ペパーミント', 'レモングラス', 'セージ']
    };
    
    const herbs = herbsByElement[element] || herbsByElement['地'];
    
    // 樹木に関連するハーブも追加
    if (tree.name.includes('オーク')) {
      herbs.push('どんぐり');
    } else if (tree.name.includes('柳')) {
      herbs.push('柳の葉');
    }
    
    return herbs.slice(0, 3);
  }

  private selectCrystals(element: string, animal: typeof CELTIC_ANIMALS[0]): string[] {
    const crystalsByElement: Record<string, string[]> = {
      '地': ['スモーキークォーツ', 'ヘマタイト', 'ジャスパー', 'ペリドット'],
      '水': ['アクアマリン', 'ムーンストーン', 'ラブラドライト', 'セレナイト'],
      '火': ['カーネリアン', 'サンストーン', 'ファイアーアゲート', 'シトリン'],
      '風': ['クリアクォーツ', 'アメジスト', 'フローライト', 'セレスタイト']
    };
    
    return crystalsByElement[element]?.slice(0, 3) || ['クリアクォーツ', 'アメジスト', 'ローズクォーツ'];
  }

  private getCurrentFestival(): CelticReading['seasonalFestival'] {
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    
    // ケルトの8つの祭り
    const festivals = [
      {
        name: 'サウィン（Samhain）',
        date: '10/31-11/1',
        energy: '祖先との交流、ヴェールが薄くなる時',
        practices: ['祖先への供物', '占い', '内省と計画']
      },
      {
        name: 'ユール（Yule）',
        date: '12/20-23',
        energy: '冬至、光の再生',
        practices: ['キャンドル儀式', '新年の誓い', '家族の集い']
      },
      {
        name: 'インボルク（Imbolc）',
        date: '2/1-2',
        energy: '浄化と新しい始まり',
        practices: ['春の掃除', 'ろうそく作り', '詩の朗読']
      },
      {
        name: 'オスタラ（Ostara）',
        date: '3/20-23',
        energy: '春分、バランスと成長',
        practices: ['種まき', '卵の装飾', '自然散策']
      },
      {
        name: 'ベルテーン（Beltane）',
        date: '4/30-5/1',
        energy: '豊穣と情熱',
        practices: ['メイポールダンス', '花冠作り', '愛の儀式']
      },
      {
        name: 'リーサ（Litha）',
        date: '6/20-23',
        energy: '夏至、太陽の頂点',
        practices: ['薬草摘み', '焚き火', '太陽への感謝']
      },
      {
        name: 'ルーナサ（Lughnasadh）',
        date: '8/1-2',
        energy: '最初の収穫、感謝',
        practices: ['パン作り', '収穫祭', '技能の披露']
      },
      {
        name: 'マボン（Mabon）',
        date: '9/20-23',
        energy: '秋分、収穫と感謝',
        practices: ['収穫の分かち合い', 'ワイン作り', '先祖への感謝']
      }
    ];
    
    // 現在の日付に最も近い祭りを見つける
    let closestFestival = festivals[0];
    let minDaysDiff = 365;
    
    festivals.forEach(festival => {
      const [startDate] = festival.date.split('-');
      const [festMonth, festDay] = startDate.split('/').map(Number);
      
      let daysDiff = Math.abs((festMonth - month) * 30 + (festDay - day));
      if (daysDiff > 180) daysDiff = 365 - daysDiff;
      
      if (daysDiff < minDaysDiff) {
        minDaysDiff = daysDiff;
        closestFestival = festival;
      }
    });
    
    return closestFestival;
  }

  private generatePersonalMessage(
    birthTree: CelticReading['birthTree'],
    animalTotem: CelticReading['animalTotem']
  ): string {
    if (!this.input.question) {
      return `${birthTree.tree.name}の子として、あなたは${birthTree.tree.qualities.join('、')}の資質を持っています。` +
             `${animalTotem.primary.name}の導きに従い、自然界との調和の中で生きてください。`;
    }
    
    const { question, questionCategory } = this.input;
    
    let message = `「${question}」について、ケルトの知恵は次のように告げています：`;
    
    const categoryMessages: Record<string, string> = {
      '恋愛・結婚': `${animalTotem.primary.name}の導きにより、愛は自然な流れの中で育まれます。${birthTree.tree.name}のように、根を深く張り、枝を広げてください。`,
      '仕事・転職': `${birthTree.tree.qualities[0]}の力を活かし、${animalTotem.primary.meaning}を体現することで、仕事での成功が訪れます。`,
      '金運・財運': `自然界の豊かさは、与えることと受け取ることのバランスから生まれます。${birthTree.tree.element}の要素と調和してください。`,
      '健康': `${birthTree.tree.name}のエネルギーと${animalTotem.primary.name}の生命力が、あなたの健康を支えています。自然のリズムに従ってください。`,
      '総合運': `ドルイドの教えでは、すべては繋がっています。${birthTree.tree.qualities.join('と')}を大切に、自然界との調和を保ってください。`
    };
    
    message += categoryMessages[questionCategory || '総合運'] || categoryMessages['総合運'];
    
    return message;
  }

  private channelAncestralWisdom(): string {
    if (!this.environment) {
      return 'あなたの祖先の霊が見守っています。彼らの知恵と力を信じてください。';
    }
    
    const moonPhase = this.environment.lunar.phase;
    let wisdom = '';
    
    if (moonPhase < 0.25) {
      wisdom = '新月の闇の中で、祖先の声がはっきりと聞こえます。新しい始まりのために、古い知恵を活用してください。';
    } else if (moonPhase < 0.5) {
      wisdom = '月が満ちていくように、祖先の力もあなたの中で強まっています。勇気を持って前進してください。';
    } else if (moonPhase < 0.75) {
      wisdom = '満月の光が祖先の道を照らしています。彼らの足跡をたどり、あなた自身の道を見出してください。';
    } else {
      wisdom = '月が欠けていく時、不要なものを手放すよう祖先が導いています。浄化と解放の時です。';
    }
    
    // 季節による追加メッセージ
    const season = this.getSeason();
    if (season === '秋' || season === '冬') {
      wisdom += ' ヴェールが薄くなるこの季節、祖先との繋がりは特に強くなります。';
    }
    
    return wisdom;
  }

  private getSeason(): string {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return '春';
    if (month >= 5 && month <= 7) return '夏';
    if (month >= 8 && month <= 10) return '秋';
    return '冬';
  }

  private generateSeed(): number {
    const birthTime = this.input.birthDate.getTime();
    const nameValue = this.input.fullName.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const questionValue = this.input.question?.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) || 0;
    const currentTime = new Date().getTime();
    
    // ケルトの聖なる数（3、5、7、9）を使用
    const celticMultiplier = 3 * 5 * 7 * 9;
    
    return Math.floor((birthTime + nameValue + questionValue + currentTime) * celticMultiplier) % 1000000;
  }
}