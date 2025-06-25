import { BaseDivinationEngine, DivinationInput, EnvironmentData } from '../base-engine';

// セフィロト（生命の樹の10の球）
const SEPHIROTH = [
  { number: 1, name: 'ケテル', meaning: '王冠', path: '統一', element: '純粋意識' },
  { number: 2, name: 'コクマー', meaning: '知恵', path: '力', element: '原初の男性原理' },
  { number: 3, name: 'ビナー', meaning: '理解', path: '形', element: '原初の女性原理' },
  { number: 4, name: 'ケセド', meaning: '慈悲', path: '愛', element: '拡大' },
  { number: 5, name: 'ゲブラー', meaning: '峻厳', path: '正義', element: '収縮' },
  { number: 6, name: 'ティファレト', meaning: '美', path: '調和', element: '太陽' },
  { number: 7, name: 'ネツァク', meaning: '勝利', path: '感情', element: '金星' },
  { number: 8, name: 'ホド', meaning: '栄光', path: '知性', element: '水星' },
  { number: 9, name: 'イェソド', meaning: '基礎', path: 'アストラル', element: '月' },
  { number: 10, name: 'マルクト', meaning: '王国', path: '物質', element: '地球' }
];

// ヘブライ文字と数値
const HEBREW_LETTERS = [
  { letter: 'アレフ', value: 1, meaning: '牛', element: '風' },
  { letter: 'ベート', value: 2, meaning: '家', element: '水星' },
  { letter: 'ギメル', value: 3, meaning: 'ラクダ', element: '月' },
  { letter: 'ダレット', value: 4, meaning: '扉', element: '金星' },
  { letter: 'ヘー', value: 5, meaning: '窓', element: '牡羊座' },
  { letter: 'ヴァヴ', value: 6, meaning: '釘', element: '牡牛座' },
  { letter: 'ザイン', value: 7, meaning: '剣', element: '双子座' },
  { letter: 'ヘット', value: 8, meaning: '柵', element: '蟹座' },
  { letter: 'テット', value: 9, meaning: '蛇', element: '獅子座' },
  { letter: 'ヨッド', value: 10, meaning: '手', element: '乙女座' },
  { letter: 'カフ', value: 20, meaning: '手のひら', element: '木星' },
  { letter: 'ラメド', value: 30, meaning: '牛追い棒', element: '天秤座' },
  { letter: 'メム', value: 40, meaning: '水', element: '水' },
  { letter: 'ヌン', value: 50, meaning: '魚', element: '蠍座' },
  { letter: 'サメク', value: 60, meaning: '支え', element: '射手座' },
  { letter: 'アイン', value: 70, meaning: '目', element: '山羊座' },
  { letter: 'ペー', value: 80, meaning: '口', element: '火星' },
  { letter: 'ツァディー', value: 90, meaning: '釣り針', element: '水瓶座' },
  { letter: 'コフ', value: 100, meaning: '後頭部', element: '魚座' },
  { letter: 'レーシュ', value: 200, meaning: '頭', element: '太陽' },
  { letter: 'シン', value: 300, meaning: '歯', element: '火' },
  { letter: 'タヴ', value: 400, meaning: '印', element: '土星' }
];

// 32の小径（パス）
const PATHS = {
  '1-2': { name: '至高の王冠の小径', tarot: '愚者' },
  '1-3': { name: '輝ける知性の小径', tarot: '魔術師' },
  '1-6': { name: '統一の知性の小径', tarot: '女教皇' },
  '2-3': { name: '照明の知性の小径', tarot: '女帝' },
  '2-4': { name: '測定の知性の小径', tarot: '皇帝' },
  '2-6': { name: '永遠の知性の小径', tarot: '教皇' },
  '3-5': { name: '根源的知性の小径', tarot: '恋人' },
  '3-6': { name: '影響の知性の小径', tarot: '戦車' },
  '4-5': { name: '活動の知性の小径', tarot: '力' },
  '4-6': { name: '意志の知性の小径', tarot: '隠者' },
  '4-7': { name: '望みの知性の小径', tarot: '運命の輪' },
  '5-6': { name: '均衡の知性の小径', tarot: '正義' },
  '5-8': { name: '試練の知性の小径', tarot: '吊られた男' },
  '6-7': { name: '配置の知性の小径', tarot: '死神' },
  '6-8': { name: '実験の知性の小径', tarot: '節制' },
  '6-9': { name: '更新の知性の小径', tarot: '悪魔' },
  '7-8': { name: '感覚の知性の小径', tarot: '塔' },
  '7-9': { name: '自然の知性の小径', tarot: '星' },
  '7-10': { name: '体の知性の小径', tarot: '月' },
  '8-9': { name: '完全な知性の小径', tarot: '太陽' },
  '8-10': { name: '永続の知性の小径', tarot: '審判' },
  '9-10': { name: '統括の知性の小径', tarot: '世界' }
};

// 四つの世界
const FOUR_WORLDS = [
  { name: 'アツィルト', meaning: '流出界', element: '火', level: '神性' },
  { name: 'ブリアー', meaning: '創造界', element: '水', level: '大天使' },
  { name: 'イェツィラー', meaning: '形成界', element: '風', level: '天使' },
  { name: 'アッシャー', meaning: '活動界', element: '地', level: '物質' }
];

export interface KabbalahReading {
  lifePathSephira: {
    sephira: typeof SEPHIROTH[0];
    lesson: string;
    challenge: string;
  };
  soulNumber: {
    value: number;
    hebrewLetters: Array<typeof HEBREW_LETTERS[0]>;
    meaning: string;
  };
  treeOfLifePosition: {
    currentSephira: typeof SEPHIROTH[0];
    activePath: string;
    guidance: string;
  };
  fourWorlds: {
    dominantWorld: typeof FOUR_WORLDS[0];
    balance: Record<string, number>;
    advice: string;
  };
  divineNames: {
    personalName: string;
    powerWord: string;
    protection: string;
  };
  kabbalisticMeditation: {
    focus: string;
    visualization: string;
    mantra: string;
  };
  personalMessage?: string;
  mysticalInsight?: string;
}

export class KabbalahEngine extends BaseDivinationEngine<KabbalahReading> {
  calculate(): KabbalahReading {
    const lifePathSephira = this.calculateLifePathSephira();
    const soulNumber = this.calculateSoulNumber();
    const treeOfLifePosition = this.determineTreePosition();
    const fourWorlds = this.analyzeFourWorlds();
    const divineNames = this.generateDivineNames();
    const kabbalisticMeditation = this.createMeditation(lifePathSephira, treeOfLifePosition);
    
    const personalMessage = this.generatePersonalMessage(lifePathSephira, soulNumber);
    const mysticalInsight = this.channelMysticalInsight();

    return {
      lifePathSephira,
      soulNumber,
      treeOfLifePosition,
      fourWorlds,
      divineNames,
      kabbalisticMeditation,
      personalMessage,
      mysticalInsight
    };
  }

  private calculateLifePathSephira(): KabbalahReading['lifePathSephira'] {
    // 生年月日から生命の道のセフィラを計算
    const birthDate = this.input.birthDate;
    const year = birthDate.getFullYear();
    const month = birthDate.getMonth() + 1;
    const day = birthDate.getDate();
    
    // カバラ的縮小法
    let sum = this.reduceToSingleDigit(year) + month + day;
    while (sum > 10) {
      sum = this.reduceToSingleDigit(sum);
    }
    
    // 0の場合は10（マルクト）とする
    if (sum === 0) sum = 10;
    
    const sephira = SEPHIROTH[sum - 1];
    
    // レッスンと課題の生成
    const lesson = this.generateLifeLesson(sephira);
    const challenge = this.generateLifeChallenge(sephira);
    
    return {
      sephira,
      lesson,
      challenge
    };
  }

  private reduceToSingleDigit(num: number): number {
    return Array.from(num.toString()).reduce((sum, digit) => sum + parseInt(digit), 0);
  }

  private generateLifeLesson(sephira: typeof SEPHIROTH[0]): string {
    const lessons: Record<number, string> = {
      1: '純粋な統一意識に到達し、すべての二元性を超越することを学んでください。',
      2: '宇宙の知恵にアクセスし、創造的な力を正しく使うことを学んでください。',
      3: '深い理解と受容を通じて、形に生命を与えることを学んでください。',
      4: '無条件の愛と慈悲を持って、豊かさを分かち合うことを学んでください。',
      5: '正義と力を適切に使い、必要な境界を設定することを学んでください。',
      6: '美と調和の中心となり、対立する力をバランスさせることを学んでください。',
      7: '感情の勝利を通じて、創造的な表現を実現することを学んでください。',
      8: '知的な栄光を追求し、明晰な思考で真実を見出すことを学んでください。',
      9: 'アストラル界の基礎を固め、夢と現実を橋渡しすることを学んでください。',
      10: '物質世界で神性を体現し、天と地を結ぶことを学んでください。'
    };
    
    return lessons[sephira.number] || '魂の進化の道を歩んでください。';
  }

  private generateLifeChallenge(sephira: typeof SEPHIROTH[0]): string {
    const challenges: Record<number, string> = {
      1: '孤独感と分離感を克服し、すべてとの一体性を実感する必要があります。',
      2: '知恵の誤用や傲慢さに注意し、謙虚さを保つ必要があります。',
      3: '過度の制限や硬直性を避け、流れを受け入れる必要があります。',
      4: '寛大さと自己犠牲のバランスを保ち、境界を守る必要があります。',
      5: '過度の厳格さや批判を避け、慈悲を忘れない必要があります。',
      6: 'エゴの膨張を防ぎ、真の美と偽りの輝きを識別する必要があります。',
      7: '感情的な執着を手放し、より高い愛を表現する必要があります。',
      8: '知的な傲慢さを避け、心の知恵も大切にする必要があります。',
      9: '幻想と現実を区別し、グラウンディングを保つ必要があります。',
      10: '物質主義に陥らず、霊的な目的を忘れない必要があります。'
    };
    
    return challenges[sephira.number] || '魂の成長のための試練に立ち向かってください。';
  }

  private calculateSoulNumber(): KabbalahReading['soulNumber'] {
    const name = this.input.fullName;
    let totalValue = 0;
    const usedLetters: Array<typeof HEBREW_LETTERS[0]> = [];
    
    // 名前の各文字を数値に変換（簡易的なゲマトリア）
    for (const char of name) {
      const charCode = char.charCodeAt(0);
      const letterIndex = charCode % HEBREW_LETTERS.length;
      const letter = HEBREW_LETTERS[letterIndex];
      
      totalValue += letter.value;
      if (!usedLetters.some(l => l.letter === letter.letter)) {
        usedLetters.push(letter);
      }
    }
    
    // カバラ的縮小
    while (totalValue > 999) {
      totalValue = this.reduceToSingleDigit(totalValue);
    }
    
    const meaning = this.interpretSoulNumber(totalValue, usedLetters);
    
    return {
      value: totalValue,
      hebrewLetters: usedLetters.slice(0, 3), // 最も重要な3文字
      meaning
    };
  }

  private interpretSoulNumber(value: number, letters: Array<typeof HEBREW_LETTERS[0]>): string {
    let interpretation = `あなたの魂の数は${value}です。`;
    
    // 数値の意味
    if (value < 10) {
      interpretation += `これは${SEPHIROTH[value - 1]?.name || '神秘的な'}エネルギーと共鳴します。`;
    } else if (value < 100) {
      interpretation += 'これは二桁の力強い振動を持ち、変容の可能性を示しています。';
    } else {
      interpretation += 'これは三桁の完成された振動を持ち、高次の使命を示しています。';
    }
    
    // 文字の影響
    if (letters.length > 0) {
      interpretation += `特に${letters[0].letter}（${letters[0].meaning}）の影響が強く、`;
      interpretation += `${letters[0].element}の性質があなたの魂に刻まれています。`;
    }
    
    return interpretation;
  }

  private determineTreePosition(): KabbalahReading['treeOfLifePosition'] {
    const seed = this.generateSeed();
    const currentTime = new Date();
    
    // 現在のセフィラを決定（時間と個人データから）
    const sephiraIndex = (seed + currentTime.getDate()) % 10;
    const currentSephira = SEPHIROTH[sephiraIndex];
    
    // アクティブなパスを決定
    const pathKeys = Object.keys(PATHS);
    const pathIndex = seed % pathKeys.length;
    const activePath = pathKeys[pathIndex];
    
    // ガイダンスの生成
    const guidance = this.generatePathGuidance(currentSephira, activePath);
    
    return {
      currentSephira,
      activePath,
      guidance
    };
  }

  private generatePathGuidance(sephira: typeof SEPHIROTH[0], pathKey: string): string {
    const path = PATHS[pathKey as keyof typeof PATHS];
    
    return `現在、あなたは${sephira.name}（${sephira.meaning}）にいます。` +
           `${path.name}を通じて、${path.tarot}のエネルギーが流れています。` +
           `${sephira.path}の道を歩みながら、${sephira.element}の本質を体現してください。`;
  }

  private analyzeFourWorlds(): KabbalahReading['fourWorlds'] {
    const balance: Record<string, number> = {
      'アツィルト': 0,
      'ブリアー': 0,
      'イェツィラー': 0,
      'アッシャー': 0
    };
    
    // 各世界のバランスを計算
    const seed = this.generateSeed();
    const factors = [
      this.input.birthDate.getFullYear() % 100,
      this.input.birthDate.getMonth() + 1,
      this.input.birthDate.getDate(),
      seed % 100
    ];
    
    FOUR_WORLDS.forEach((world, index) => {
      balance[world.name] = 25 + (factors[index] % 25);
    });
    
    // 合計が100%になるように正規化
    const total = Object.values(balance).reduce((sum, val) => sum + val, 0);
    Object.keys(balance).forEach(key => {
      balance[key] = Math.round((balance[key] / total) * 100);
    });
    
    // 支配的な世界を特定
    const dominantWorldName = Object.entries(balance)
      .sort(([, a], [, b]) => b - a)[0][0];
    const dominantWorld = FOUR_WORLDS.find(w => w.name === dominantWorldName)!;
    
    // アドバイスの生成
    const advice = this.generateWorldAdvice(dominantWorld, balance);
    
    return {
      dominantWorld,
      balance,
      advice
    };
  }

  private generateWorldAdvice(dominantWorld: typeof FOUR_WORLDS[0], balance: Record<string, number>): string {
    let advice = `あなたは主に${dominantWorld.name}（${dominantWorld.meaning}）で活動しています。`;
    
    const worldAdvice: Record<string, string> = {
      'アツィルト': '神性との直接的な繋がりを維持し、純粋な意図を保ってください。',
      'ブリアー': '創造的なビジョンを現実化し、大天使の導きを受け入れてください。',
      'イェツィラー': '感情と思考のバランスを保ち、天使的な調和を実現してください。',
      'アッシャー': '物質世界での使命を果たし、地に足をつけた霊性を体現してください。'
    };
    
    advice += worldAdvice[dominantWorld.name];
    
    // バランスの偏りに対するアドバイス
    const minWorld = Object.entries(balance)
      .sort(([, a], [, b]) => a - b)[0][0];
    
    if (balance[minWorld] < 15) {
      advice += `また、${minWorld}のエネルギーが不足しています。この世界との繋がりを強化してください。`;
    }
    
    return advice;
  }

  private generateDivineNames(): KabbalahReading['divineNames'] {
    const seed = this.generateSeed();
    
    // 72の神名から選択（簡易版）
    const divineNames72 = [
      'ヴェフ', 'ヨリ', 'シト', 'エレム', 'マハシ', 'レラヘ', 'アカ', 'カヘト',
      'ハジ', 'アラド', 'ラアヴ', 'ヘハ', 'イェゼ', 'メベヘ', 'ハリ', 'ハケム'
    ];
    
    const personalNameIndex = seed % divineNames72.length;
    const personalName = divineNames72[personalNameIndex];
    
    // 力の言葉（テトラグラマトンのバリエーション）
    const powerWords = ['YHVH', 'AHYH', 'AGLA', 'ADNI', 'ALHIM'];
    const powerWordIndex = (seed * 2) % powerWords.length;
    const powerWord = powerWords[powerWordIndex];
    
    // 保護の言葉
    const protectionPhrases = [
      'ミカエルが右に、ガブリエルが左に、ウリエルが前に、ラファエルが後ろに',
      '神の光が私を包み、神の愛が私を守る',
      '私は生命の樹の中心に立ち、すべての世界と調和する'
    ];
    const protectionIndex = (seed * 3) % protectionPhrases.length;
    const protection = protectionPhrases[protectionIndex];
    
    return {
      personalName,
      powerWord,
      protection
    };
  }

  private createMeditation(
    lifePathSephira: KabbalahReading['lifePathSephira'],
    treePosition: KabbalahReading['treeOfLifePosition']
  ): KabbalahReading['kabbalisticMeditation'] {
    // フォーカスポイント
    const focus = `${lifePathSephira.sephira.name}の球体に意識を集中させ、${lifePathSephira.sephira.element}のエネルギーを感じてください。`;
    
    // ビジュアライゼーション
    const visualizations: Record<number, string> = {
      1: '純白の輝く王冠があなたの頭上に浮かび、無限の光があなたを満たします。',
      2: '銀色の知恵の光があなたの右脳を活性化し、宇宙の秘密が明らかになります。',
      3: '深い藍色の理解の海があなたの左脳を満たし、すべてを包み込む母性が目覚めます。',
      4: '青い慈悲の光があなたの右肩から流れ、無限の愛が世界に広がります。',
      5: '赤い正義の炎があなたの左肩で燃え、必要な変革をもたらします。',
      6: '黄金の太陽があなたの心臓で輝き、すべてを調和させる美が放射されます。',
      7: '緑の勝利の光があなたの右腰で脈動し、感情的な成就がもたらされます。',
      8: 'オレンジの栄光があなたの左腰で振動し、明晰な知性が開花します。',
      9: '紫の月光があなたの性器で輝き、創造的な基盤が確立されます。',
      10: '虹色の地球があなたの足元で回転し、物質世界での使命が明確になります。'
    };
    
    const visualization = visualizations[lifePathSephira.sephira.number] || 
                         '生命の樹全体が光り輝き、あなたはその中心にいます。';
    
    // マントラ
    const mantras: Record<number, string> = {
      1: 'エヘイエー・アシェル・エヘイエー（私は在りて在る者）',
      2: 'ヤー（YH）',
      3: 'YHVH エロヒーム',
      4: 'エル',
      5: 'エロヒーム・ギボール',
      6: 'YHVH エロアー・ヴェダート',
      7: 'YHVH ツァバオト',
      8: 'エロヒーム・ツァバオト',
      9: 'シャダイ・エル・ハイ',
      10: 'アドナイ・ハアレツ'
    };
    
    const mantra = mantras[lifePathSephira.sephira.number] || 'YHVH';
    
    return {
      focus,
      visualization,
      mantra
    };
  }

  private generatePersonalMessage(
    lifePathSephira: KabbalahReading['lifePathSephira'],
    soulNumber: KabbalahReading['soulNumber']
  ): string {
    if (!this.input.question) {
      return `${lifePathSephira.sephira.name}の道を歩むあなたは、${lifePathSephira.lesson}` +
             `魂の数${soulNumber.value}が示すように、${soulNumber.meaning}`;
    }
    
    const { question, questionCategory } = this.input;
    
    let message = `「${question}」についてのカバラの啓示：`;
    
    const categoryMessages: Record<string, string> = {
      '恋愛・結婚': `愛は${lifePathSephira.sephira.path}の道で見つかります。相手との魂の契約を思い出し、${soulNumber.hebrewLetters[0]?.meaning || '愛'}の本質を体現してください。`,
      '仕事・転職': `${lifePathSephira.sephira.meaning}のエネルギーを仕事に活かし、${soulNumber.value}の振動と調和する職業を選んでください。`,
      '金運・財運': `物質的豊かさは${lifePathSephira.sephira.element}のバランスから生まれます。マルクト（物質界）とケテル（精神界）を結んでください。`,
      '健康': `${lifePathSephira.sephira.name}に対応する身体部位に注意し、生命の樹全体のエネルギーバランスを保ってください。`,
      '総合運': `あなたの魂の青写真は明確です。${lifePathSephira.lesson}これが今生の使命です。`
    };
    
    message += categoryMessages[questionCategory || '総合運'] || categoryMessages['総合運'];
    
    return message;
  }

  private channelMysticalInsight(): string {
    if (!this.environment) {
      return '神聖な知恵の門は常に開かれています。静寂の中で耳を傾けてください。';
    }
    
    const moonPhase = this.environment.lunar.phase;
    const planetaryHour = this.environment.planetary?.hourRuler || 'Sun';
    
    let insight = 'シェキナー（神の臨在）からのメッセージ：';
    
    // 月相による洞察
    if (moonPhase < 0.25) {
      insight += '新月の闇はビナー（理解）の深淵を映し出します。隠された知恵が明らかになる時です。';
    } else if (moonPhase < 0.5) {
      insight += '月が満ちるようにあなたのケセド（慈悲）も拡大しています。与えることで受け取ります。';
    } else if (moonPhase < 0.75) {
      insight += '満月の光はティファレト（美）を照らします。内なる太陽と外なる月が調和します。';
    } else {
      insight += '月が欠けるようにゲブラー（峻厳）が不要なものを切り離します。浄化と解放の時です。';
    }
    
    // 惑星時間による追加
    const planetaryInfluences: Record<string, string> = {
      'Sun': ' 太陽の時間はティファレトを活性化します。',
      'Moon': ' 月の時間はイェソドとの繋がりを強めます。',
      'Mercury': ' 水星の時間はホドの知的栄光を高めます。',
      'Venus': ' 金星の時間はネツァクの勝利をもたらします。',
      'Mars': ' 火星の時間はゲブラーの力を与えます。',
      'Jupiter': ' 木星の時間はケセドの慈悲を拡大します。',
      'Saturn': ' 土星の時間はビナーの理解を深めます。'
    };
    
    insight += planetaryInfluences[planetaryHour] || '';
    
    return insight;
  }

  private generateSeed(): number {
    const birthTime = this.input.birthDate.getTime();
    const nameValue = this.input.fullName.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    
    // カバラの聖なる数を使用
    const kabbalisticMultiplier = 22 * 10 * 32; // ヘブライ文字 * セフィロト * パス
    
    return Math.floor((birthTime + nameValue) * kabbalisticMultiplier) % 1000000;
  }
}