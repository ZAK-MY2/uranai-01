// カバラ占術エンジン
import type { KabbalahInput, KabbalahResult } from '@/types/divination';

export class KabbalahEngine {
  async performReading(input: KabbalahInput): Promise<KabbalahResult> {
    try {
      this.validateInput(input);

      const birthDate = new Date(input.birthDate);
      const name = input.fullName.trim();

      // セフィロトの木計算
      const sephirot = this.calculateSephirot(birthDate, name);
      
      // 生命の木のパス計算
      const treePaths = this.calculateTreeOfLifePaths(sephirot);
      
      // ゲマトリア数値計算
      const gematria = this.calculateGematria(name);
      
      // パーソナルセフィラ
      const personalSephira = this.determinePersonalSephira(birthDate, gematria);
      
      // カバラ的解釈
      const interpretation = this.generateInterpretation(
        sephirot,
        treePaths,
        gematria,
        personalSephira
      );

      return {
        sephirot,
        treePaths,
        gematria,
        personalSephira,
        interpretation,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      throw new Error(`カバラ占術の実行中にエラーが発生しました: ${error instanceof Error ? error.message : '不明なエラー'}`);
    }
  }

  private validateInput(input: KabbalahInput): void {
    if (!input.fullName || input.fullName.trim().length === 0) {
      throw new Error('フルネームは必須です');
    }

    if (!input.birthDate) {
      throw new Error('生年月日は必須です');
    }

    const birthDate = new Date(input.birthDate);
    if (isNaN(birthDate.getTime())) {
      throw new Error('日付形式が正しくありません');
    }
  }

  private calculateSephirot(birthDate: Date, name: string): Record<string, number> {
    const day = birthDate.getDate();
    const month = birthDate.getMonth() + 1;
    const year = birthDate.getFullYear();
    
    // 10セフィロトの計算
    const kether = this.reduceToRange((day + month + year) % 10, 1, 10); // 王冠
    const chokmah = this.reduceToRange((day * month) % 10, 1, 10); // 智慧
    const binah = this.reduceToRange((year % 100) % 10, 1, 10); // 理解
    const chesed = this.reduceToRange((name.length + day) % 10, 1, 10); // 慈愛
    const geburah = this.reduceToRange((month * 3 + day) % 10, 1, 10); // 峻厳
    const tiphereth = this.reduceToRange((kether + chokmah + binah) % 10, 1, 10); // 美
    const netzach = this.reduceToRange((chesed + geburah) % 10, 1, 10); // 勝利
    const hod = this.reduceToRange((day + month) % 10, 1, 10); // 栄光
    const yesod = this.reduceToRange((netzach + hod) % 10, 1, 10); // 基盤
    const malkuth = this.reduceToRange((tiphereth + yesod) % 10, 1, 10); // 王国

    return {
      kether,     // ケテル（王冠）
      chokmah,    // コクマー（智慧）
      binah,      // ビナー（理解）
      chesed,     // ケセド（慈愛）
      geburah,    // ゲブラー（峻厳）
      tiphereth,  // ティファレト（美）
      netzach,    // ネツァク（勝利）
      hod,        // ホド（栄光）
      yesod,      // イェソド（基盤）
      malkuth     // マルクト（王国）
    };
  }

  private calculateTreeOfLifePaths(sephirot: Record<string, number>): Array<{
    from: string;
    to: string;
    value: number;
    meaning: string;
  }> {
    // 22のパスを計算
    const paths = [
      { from: 'kether', to: 'chokmah', hebrew: 'アレフ', tarot: '愚者' },
      { from: 'kether', to: 'binah', hebrew: 'ベット', tarot: '魔術師' },
      { from: 'kether', to: 'tiphereth', hebrew: 'ギメル', tarot: '女教皇' },
      { from: 'chokmah', to: 'binah', hebrew: 'ダレット', tarot: '女帝' },
      { from: 'chokmah', to: 'chesed', hebrew: 'ヘー', tarot: '皇帝' },
      { from: 'chokmah', to: 'tiphereth', hebrew: 'ヴァウ', tarot: '教皇' },
      { from: 'binah', to: 'geburah', hebrew: 'ザイン', tarot: '恋人' },
      { from: 'binah', to: 'tiphereth', hebrew: 'ヘット', tarot: '戦車' },
      { from: 'chesed', to: 'geburah', hebrew: 'テット', tarot: '力' },
      { from: 'chesed', to: 'tiphereth', hebrew: 'ヨッド', tarot: '隠者' },
      { from: 'chesed', to: 'netzach', hebrew: 'カフ', tarot: '運命の輪' },
      { from: 'geburah', to: 'tiphereth', hebrew: 'ラメッド', tarot: '正義' },
      { from: 'geburah', to: 'hod', hebrew: 'メム', tarot: '吊された男' },
      { from: 'tiphereth', to: 'netzach', hebrew: 'ヌン', tarot: '死神' },
      { from: 'tiphereth', to: 'hod', hebrew: 'サメク', tarot: '節制' },
      { from: 'tiphereth', to: 'yesod', hebrew: 'アイン', tarot: '悪魔' },
      { from: 'netzach', to: 'hod', hebrew: 'ペー', tarot: '塔' },
      { from: 'netzach', to: 'yesod', hebrew: 'ツァディ', tarot: '星' },
      { from: 'netzach', to: 'malkuth', hebrew: 'コフ', tarot: '月' },
      { from: 'hod', to: 'yesod', hebrew: 'レーシュ', tarot: '太陽' },
      { from: 'hod', to: 'malkuth', hebrew: 'シン', tarot: '審判' },
      { from: 'yesod', to: 'malkuth', hebrew: 'タウ', tarot: '世界' }
    ];

    return paths.map((path, index) => ({
      from: path.from,
      to: path.to,
      value: this.reduceToRange((sephirot[path.from] + sephirot[path.to] + index) % 22, 1, 22),
      meaning: `${path.hebrew} - ${path.tarot}のエネルギー`
    }));
  }

  private calculateGematria(name: string): {
    hebrew: number;
    english: number;
    japanese: number;
  } {
    // ヘブライ語ゲマトリア（簡易版）
    const hebrewValues: Record<string, number> = {
      'a': 1, 'b': 2, 'g': 3, 'd': 4, 'h': 5, 'v': 6, 'z': 7, 'ch': 8, 't': 9,
      'y': 10, 'k': 20, 'l': 30, 'm': 40, 'n': 50, 's': 60, 'e': 70, 'p': 80,
      'tz': 90, 'q': 100, 'r': 200, 'sh': 300, 'th': 400
    };

    // 英語ゲマトリア
    const englishValues: Record<string, number> = {
      'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5, 'f': 6, 'g': 7, 'h': 8, 'i': 9,
      'j': 10, 'k': 11, 'l': 12, 'm': 13, 'n': 14, 'o': 15, 'p': 16, 'q': 17,
      'r': 18, 's': 19, 't': 20, 'u': 21, 'v': 22, 'w': 23, 'x': 24, 'y': 25, 'z': 26
    };

    const cleanName = name.toLowerCase().replace(/[^a-z\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]/g, '');

    let hebrew = 0;
    let english = 0;
    let japanese = 0;

    for (const char of cleanName) {
      // 英語文字
      if (englishValues[char]) {
        english += englishValues[char];
        hebrew += hebrewValues[char] || englishValues[char];
      }
      // 日本語文字（文字コードベース）
      else if (/[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]/.test(char)) {
        const charCode = char.charCodeAt(0);
        japanese += (charCode % 100) + 1;
      }
    }

    return {
      hebrew: this.reduceToSingleDigit(hebrew),
      english: this.reduceToSingleDigit(english),
      japanese: this.reduceToSingleDigit(japanese)
    };
  }

  private determinePersonalSephira(birthDate: Date, gematria: Record<string, number>): {
    primary: string;
    secondary: string;
    characteristics: string[];
  } {
    const sephirotNames = [
      'kether', 'chokmah', 'binah', 'chesed', 'geburah',
      'tiphereth', 'netzach', 'hod', 'yesod', 'malkuth'
    ];

    const dayNumber = birthDate.getDate();
    const gematriaSum = Object.values(gematria).reduce((sum, val) => sum + val, 0);
    
    const primaryIndex = (dayNumber + gematriaSum) % 10;
    const secondaryIndex = (dayNumber * gematriaSum) % 10;

    const primary = sephirotNames[primaryIndex];
    const secondary = sephirotNames[secondaryIndex];

    const characteristics = this.getSephiraCharacteristics(primary);

    return {
      primary,
      secondary,
      characteristics
    };
  }

  private getSephiraCharacteristics(sephira: string): string[] {
    const characteristics: Record<string, string[]> = {
      kether: ['統一性', '完全性', '神聖な意識', '純粋な存在'],
      chokmah: ['智慧', '直感', '創造的インスピレーション', '男性原理'],
      binah: ['理解', '受容', '形成力', '女性原理'],
      chesed: ['慈愛', '寛大さ', '拡張', '恩恵'],
      geburah: ['峻厳', '規律', '正義', '制限'],
      tiphereth: ['美', '調和', 'バランス', '中心性'],
      netzach: ['勝利', '感情', '芸術', '持続'],
      hod: ['栄光', '知性', '言語', '分析'],
      yesod: ['基盤', '想像力', '幻想', '記憶'],
      malkuth: ['王国', '物質界', '実現', '安定']
    };

    return characteristics[sephira] || ['未知の特性'];
  }

  private generateInterpretation(
    sephirot: Record<string, number>,
    treePaths: Array<Record<string, unknown>>,
    gematria: Record<string, number>,
    personalSephira: Record<string, unknown>
  ): {
    personality: string;
    spiritualPath: string;
    lifeLesson: string;
    strengths: string[];
    challenges: string[];
    advice: string;
    overall: string;
  } {
    const dominantSephira = Object.entries(sephirot)
      .reduce((a, b) => sephirot[a[0]] > sephirot[b[0]] ? a : b)[0];

    const personality = this.generatePersonalityInterpretation(dominantSephira, gematria);
    const spiritualPath = this.generateSpiritualPathInterpretation(personalSephira);
    const lifeLesson = this.generateLifeLessonInterpretation(treePaths);
    const strengths = this.generateStrengths(dominantSephira);
    const challenges = this.generateChallenges(dominantSephira);
    const advice = this.generateAdvice(dominantSephira, gematria);
    
    const overall = `あなたのカバラ的エッセンスは${dominantSephira}に強く影響されています。` +
      `ゲマトリア数値 ${gematria.hebrew} は、あなたの魂の深い目的を示しています。` +
      `生命の木のパスを通じて、バランスと調和を求める旅を続けてください。`;

    return {
      personality,
      spiritualPath,
      lifeLesson,
      strengths,
      challenges,
      advice,
      overall
    };
  }

  private generatePersonalityInterpretation(dominantSephira: string, gematria: Record<string, number>): string {
    const base: Record<string, string> = {
      kether: '純粋で統一された意識を持つ',
      chokmah: '智慧と直感に富んだ',
      binah: '深い理解力と包容力のある',
      chesed: '慈愛深く寛大な',
      geburah: '正義感が強く規律正しい',
      tiphereth: '美と調和を愛する',
      netzach: '感情豊かで芸術的な',
      hod: '知的で分析力に優れた',
      yesod: '想像力豊かで直感的な',
      malkuth: '現実的で安定感のある'
    };

    return `${base[dominantSephira] || '神秘的な'}性格です。ゲマトリア数値${gematria.hebrew}が示すように、あなたの本質は深いスピリチュアルな意味を持っています。`;
  }

  private generateSpiritualPathInterpretation(personalSephira: Record<string, unknown>): string {
    return `あなたのスピリチュアルな道は${personalSephira.primary}を通じて開かれ、${personalSephira.secondary}によって支えられています。この2つのセフィラのエネルギーを統合することで、魂の成長を遂げることができます。`;
  }

  private generateLifeLessonInterpretation(treePaths: Array<Record<string, unknown>>): string {
    const activePaths = treePaths.slice(0, 3);
    return `生命の木の主要なパス「${activePaths.map(p => p.meaning).join('、')}」があなたの人生の学びを象徴しています。これらのエネルギーを理解し、統合することが重要です。`;
  }

  private generateStrengths(dominantSephira: string): string[] {
    const strengths: Record<string, string[]> = {
      kether: ['高い精神性', '統合力', '純粋性'],
      chokmah: ['直感力', '創造性', '洞察力'],
      binah: ['理解力', '包容力', '安定性'],
      chesed: ['慈愛', '寛容', '拡張力'],
      geburah: ['正義感', '規律', '決断力'],
      tiphereth: ['バランス感覚', '美的センス', '調和力'],
      netzach: ['感情表現', '芸術性', '持続力'],
      hod: ['論理的思考', '分析力', '表現力'],
      yesod: ['想像力', '適応力', '直感'],
      malkuth: ['実行力', '安定性', '現実感覚']
    };

    return strengths[dominantSephira] || ['神秘的な能力'];
  }

  private generateChallenges(dominantSephira: string): string[] {
    const challenges: Record<string, string[]> = {
      kether: ['現実離れ', '孤立傾向', '完璧主義'],
      chokmah: ['衝動性', '論理軽視', '一方通行'],
      binah: ['過度な受動性', '変化への抵抗', '内向性'],
      chesed: ['甘さ', '境界の曖昧さ', '依存'],
      geburah: ['厳格さ', '批判的', '柔軟性不足'],
      tiphereth: ['自己中心性', '調和への固執', '表面性'],
      netzach: ['感情的不安定', '現実逃避', '継続性不足'],
      hod: ['分析過多', '感情軽視', '細部への固執'],
      yesod: ['現実離れ', '幻想への依存', '不安定性'],
      malkuth: ['物質主義', '精神性軽視', '変化への抵抗']
    };

    return challenges[dominantSephira] || ['未知の課題'];
  }

  private generateAdvice(dominantSephira: string, gematria: Record<string, number>): string {
    const advice: Record<string, string> = {
      kether: '地に足をつけながらも、高い理想を保ち続けてください',
      chokmah: '直感を大切にしながらも、論理的思考も育ててください',
      binah: '受容の力を活かしつつ、積極性も身につけてください',
      chesed: '慈愛の心を保ちながらも、適切な境界を設けてください',
      geburah: '正義感を活かしつつ、慈悲の心も育ててください',
      tiphereth: 'バランスを保ちながらも、時には偏ることも必要です',
      netzach: '感情を大切にしながらも、論理的思考も身につけてください',
      hod: '分析力を活かしつつ、感情的な側面も大切にしてください',
      yesod: '想像力を活かしながらも、現実とのバランスを保ってください',
      malkuth: '現実的な視点を保ちながらも、精神性も育ててください'
    };

    return `${advice[dominantSephira] || 'バランスを保つことが重要です'}。ゲマトリア数値${gematria.hebrew}が示すエネルギーを意識して行動してください。`;
  }

  private reduceToRange(num: number, min: number, max: number): number {
    const range = max - min + 1;
    return ((num - min) % range) + min;
  }

  private reduceToSingleDigit(num: number): number {
    while (num > 9) {
      num = num.toString().split('').map(Number).reduce((sum, digit) => sum + digit, 0);
    }
    return num;
  }

  generateCacheKey(input: KabbalahInput): string {
    return `kabbalah_${input.fullName}_${input.birthDate}`;
  }

  generateInputHash(input: KabbalahInput): string {
    return Buffer.from(`${input.fullName}${input.birthDate}`).toString('base64');
  }
}

export const kabbalahEngine = new KabbalahEngine();