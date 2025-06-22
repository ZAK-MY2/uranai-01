// ケルト占星術エンジン
import type { CelticAstrologyInput, CelticAstrologyResult } from '@/types/divination';

export class CelticAstrologyEngine {
  async performReading(input: CelticAstrologyInput): Promise<CelticAstrologyResult> {
    try {
      this.validateInput(input);

      const birthDate = new Date(input.birthDate);
      
      // ケルト樹木星座
      const treeSign = this.calculateTreeSign(birthDate);
      
      // ドルイド動物霊
      const animalSpirit = this.calculateAnimalSpirit(birthDate, input.fullName);
      
      // オガム文字
      const oghamRune = this.calculateOghamRune(birthDate);
      
      // 季節のエネルギー
      const seasonalEnergy = this.calculateSeasonalEnergy(birthDate);
      
      // ケルト元素
      const celticElement = this.calculateCelticElement(treeSign);
      
      // 聖なる場所とのつながり
      const sacredPlace = this.calculateSacredPlace(birthDate);
      
      // ケルト的解釈
      const interpretation = this.generateInterpretation(
        treeSign,
        animalSpirit,
        oghamRune,
        seasonalEnergy,
        celticElement,
        sacredPlace
      );

      return {
        treeSign,
        animalSpirit,
        oghamRune,
        seasonalEnergy,
        celticElement,
        sacredPlace,
        interpretation,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      throw new Error(`ケルト占星術の実行中にエラーが発生しました: ${error instanceof Error ? error.message : '不明なエラー'}`);
    }
  }

  private validateInput(input: CelticAstrologyInput): void {
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

  private calculateTreeSign(birthDate: Date): {
    name: string;
    gaelic: string;
    period: string;
    characteristics: string[];
    mythology: string;
  } {
    const month = birthDate.getMonth() + 1;
    const day = birthDate.getDate();
    
    // ケルト樹木暦（13の月）
    const treeSigns = [
      { 
        name: 'カバノキ', gaelic: 'Beith', period: '12/24-1/20',
        start: { month: 12, day: 24 }, end: { month: 1, day: 20 },
        characteristics: ['新しい始まり', '純粋性', '浄化', '再生'],
        mythology: 'ドルイドの聖なる樹。新年の始まりと新しい生命を象徴します。'
      },
      {
        name: 'ナナカマド', gaelic: 'Luis', period: '1/21-2/17',
        start: { month: 1, day: 21 }, end: { month: 2, day: 17 },
        characteristics: ['保護', '洞察', '予知', '魔除け'],
        mythology: '魔法の樹として知られ、悪霊から身を守る力があるとされています。'
      },
      {
        name: 'トネリコ', gaelic: 'Nion', period: '2/18-3/17',
        start: { month: 2, day: 18 }, end: { month: 3, day: 17 },
        characteristics: ['繋がり', '統合', '調和', 'バランス'],
        mythology: '世界樹ユグドラシルの樹種。天と地を繋ぐ神聖な力を持ちます。'
      },
      {
        name: 'ハンノキ', gaelic: 'Fearn', period: '3/18-4/14',
        start: { month: 3, day: 18 }, end: { month: 4, day: 14 },
        characteristics: ['勇気', '指導力', '保護', '決断'],
        mythology: '戦士の樹。盾や武器に使われ、勇気と保護の象徴です。'
      },
      {
        name: 'ヤナギ', gaelic: 'Saille', period: '4/15-5/12',
        start: { month: 4, day: 15 }, end: { month: 5, day: 12 },
        characteristics: ['直感', '感情', '月の魔法', '癒し'],
        mythology: '月の女神に捧げられた樹。感情と直感の力を高めます。'
      },
      {
        name: 'サンザシ', gaelic: 'Huathe', period: '5/13-6/9',
        start: { month: 5, day: 13 }, end: { month: 6, day: 9 },
        characteristics: ['希望', '保護', '豊穣', '清浄'],
        mythology: '5月の花の女王。希望と新しい始まりの象徴です。'
      },
      {
        name: 'オーク', gaelic: 'Duir', period: '6/10-7/7',
        start: { month: 6, day: 10 }, end: { month: 7, day: 7 },
        characteristics: ['強さ', '持久力', '名誉', '伝統'],
        mythology: 'ドルイドの最も神聖な樹。力と持久力の象徴です。'
      },
      {
        name: 'ヒイラギ', gaelic: 'Tinne', period: '7/8-8/4',
        start: { month: 7, day: 8 }, end: { month: 8, day: 4 },
        characteristics: ['バランス', '公正', '客観性', '正義'],
        mythology: '夏至の力を保持する樹。公正と正義の象徴です。'
      },
      {
        name: 'ヘーゼル', gaelic: 'Coll', period: '8/5-9/1',
        start: { month: 8, day: 5 }, end: { month: 9, day: 1 },
        characteristics: ['知恵', '学習', '詩的才能', '霊感'],
        mythology: '知恵の樹。詩人と学者に霊感を与える聖なる樹です。'
      },
      {
        name: 'ブドウ', gaelic: 'Muin', period: '9/2-9/29',
        start: { month: 9, day: 2 }, end: { month: 9, day: 29 },
        characteristics: ['収穫', '豊穣', '予言', '内なる知識'],
        mythology: '収穫の時の樹。内なる美と予言の力を表します。'
      },
      {
        name: 'ツタ', gaelic: 'Gort', period: '9/30-10/27',
        start: { month: 9, day: 30 }, end: { month: 10, day: 27 },
        characteristics: ['復活', '再生', '忠実', '永続'],
        mythology: '死と再生の神秘。永続性と忠実さの象徴です。'
      },
      {
        name: 'ヨシ', gaelic: 'Ngetal', period: '10/28-11/24',
        start: { month: 10, day: 28 }, end: { month: 11, day: 24 },
        characteristics: ['順応', '柔軟性', '音楽', '調和'],
        mythology: '音楽家の樹。調和と美しい音を創造する力があります。'
      },
      {
        name: 'ニワトコ', gaelic: 'Ruis', period: '11/25-12/23',
        start: { month: 11, day: 25 }, end: { month: 12, day: 23 },
        characteristics: ['変容', '終了', '再生', '新しいサイクル'],
        mythology: '変容の樹。古いものを終わらせ、新しいサイクルを始めます。'
      }
    ];

    for (const tree of treeSigns) {
      if (this.isDateInRange(month, day, tree.start, tree.end)) {
        return tree;
      }
    }

    // デフォルト（エラー回避）
    return treeSigns[0];
  }

  private isDateInRange(month: number, day: number, start: {month: number, day: number}, end: {month: number, day: number}): boolean {
    if (start.month === end.month) {
      return month === start.month && day >= start.day && day <= end.day;
    }
    
    if (start.month < end.month) {
      return (month === start.month && day >= start.day) || 
             (month > start.month && month < end.month) ||
             (month === end.month && day <= end.day);
    } else {
      // 年をまたぐ場合
      return (month === start.month && day >= start.day) || 
             (month > start.month) ||
             (month < end.month) ||
             (month === end.month && day <= end.day);
    }
  }

  private calculateAnimalSpirit(birthDate: Date, name: string): {
    name: string;
    gaelic: string;
    element: string;
    characteristics: string[];
    guidance: string;
  } {
    const animals = [
      {
        name: '鹿', gaelic: 'Fiadh', element: '大地',
        characteristics: ['優雅', '敏捷性', '直感', '自然との調和'],
        guidance: '静寂の中で真実を見つけ、優雅に困難を乗り越えてください。'
      },
      {
        name: '鷲', gaelic: 'Iolar', element: '風',
        characteristics: ['遠視', '高い視点', '自由', '精神的な高さ'],
        guidance: '高い視点から物事を見つめ、精神的な自由を求めてください。'
      },
      {
        name: '鮭', gaelic: 'Bradán', element: '水',
        characteristics: ['知恵', '帰郷本能', '変化', '生命力'],
        guidance: '古い知恵を求め、自分の源流に帰ることで真の力を得てください。'
      },
      {
        name: '猪', gaelic: 'Torc', element: '大地',
        characteristics: ['勇気', '決断力', '保護', '頑固さ'],
        guidance: '勇気を持って前進し、大切なものを守る決意を持ってください。'
      },
      {
        name: '白馬', gaelic: 'Each Bán', element: '風',
        characteristics: ['純粋性', '自由', '神聖', '移動'],
        guidance: '純粋な心を保ち、制約から自由になる道を見つけてください。'
      },
      {
        name: '狼', gaelic: 'Mac Tíre', element: '月',
        characteristics: ['忠実', '家族愛', '野生の知恵', '社会性'],
        guidance: '仲間との絆を大切にし、野生の直感を信じてください。'
      },
      {
        name: '烏', gaelic: 'Dubh', element: '霊',
        characteristics: ['予言', '変容', '神秘', '知識'],
        guidance: '隠された知識を求め、変容の力を受け入れてください。'
      },
      {
        name: '蛇', gaelic: 'Nathair', element: '大地',
        characteristics: ['再生', '治癒', '古い知恵', '変化'],
        guidance: '古い皮を脱ぎ捨て、新しい自分に生まれ変わってください。'
      },
      {
        name: '熊', gaelic: 'Béar', element: '大地',
        characteristics: ['強さ', '保護', '内省', '母性'],
        guidance: '内なる強さを見つけ、大切な人々を保護してください。'
      }
    ];

    const dayOfYear = this.getDayOfYear(birthDate);
    const nameValue = name.length;
    const index = (dayOfYear + nameValue) % animals.length;
    
    return animals[index];
  }

  private calculateOghamRune(birthDate: Date): {
    symbol: string;
    name: string;
    meaning: string;
    guidance: string;
  } {
    const oghamRunes = [
      { symbol: 'ᚁ', name: 'Beith', meaning: '新しい始まり', guidance: '新しいプロジェクトや関係を始める時です。' },
      { symbol: 'ᚂ', name: 'Luis', meaning: '保護', guidance: '直感を信じ、自分を守ってください。' },
      { symbol: 'ᚃ', name: 'Fearn', meaning: '指導', guidance: 'リーダーシップを発揮する時です。' },
      { symbol: 'ᚄ', name: 'Saille', meaning: '直感', guidance: '心の声に耳を傾けてください。' },
      { symbol: 'ᚅ', name: 'Nuin', meaning: '平和', guidance: '内なる平和を見つけてください。' },
      { symbol: 'ᚆ', name: 'Huathe', meaning: '清浄', guidance: '心と体を浄化してください。' },
      { symbol: 'ᚇ', name: 'Duir', meaning: '強さ', guidance: '困難に立ち向かう強さを持ってください。' },
      { symbol: 'ᚈ', name: 'Tinne', meaning: 'バランス', guidance: '人生のバランスを保ってください。' },
      { symbol: 'ᚉ', name: 'Coll', meaning: '知恵', guidance: '学習と知識の探求を続けてください。' },
      { symbol: 'ᚊ', name: 'Ceirt', meaning: '美', guidance: '美しいものに囲まれて生活してください。' },
      { symbol: 'ᚋ', name: 'Muin', meaning: '予言', guidance: '未来への洞察を深めてください。' },
      { symbol: 'ᚌ', name: 'Gort', meaning: '再生', guidance: '新しい自分に生まれ変わってください。' },
      { symbol: 'ᚍ', name: 'Ngetal', meaning: '調和', guidance: '周囲との調和を保ってください。' },
      { symbol: 'ᚎ', name: 'Straif', meaning: '困難', guidance: '試練を乗り越える準備をしてください。' },
      { symbol: 'ᚏ', name: 'Ruis', meaning: '変容', guidance: '変化を恐れず受け入れてください。' },
      { symbol: 'ᚐ', name: 'Ailm', meaning: '洞察', guidance: '内なる光を見つけてください。' },
      { symbol: 'ᚑ', name: 'Onn', meaning: '怒り', guidance: '感情をコントロールしてください。' },
      { symbol: 'ᚒ', name: 'Ur', meaning: '治癒', guidance: '癒しの力を信じてください。' },
      { symbol: 'ᚓ', name: 'Eadhadh', meaning: '忍耐', guidance: '忍耐強く目標を追い続けてください。' },
      { symbol: 'ᚔ', name: 'Iodhadh', meaning: '持久力', guidance: '長期的な視点を持ってください。' }
    ];

    const dayOfYear = this.getDayOfYear(birthDate);
    const index = dayOfYear % oghamRunes.length;
    
    return oghamRunes[index];
  }

  private calculateSeasonalEnergy(birthDate: Date): {
    season: string;
    festival: string;
    energy: string;
    characteristics: string[];
  } {
    const month = birthDate.getMonth() + 1;
    const day = birthDate.getDate();

    // ケルトの8つの祭り
    if ((month === 12 && day >= 20) || (month === 1 && day <= 31) || (month === 2 && day <= 1)) {
      return {
        season: '冬至', festival: 'ユール (Yule)', energy: '内省と再生',
        characteristics: ['深い思考', '内なる光', '希望', '静寂']
      };
    }
    if ((month === 2 && day >= 2) || (month === 3 && day <= 19)) {
      return {
        season: '春の兆し', festival: 'インボルク (Imbolc)', energy: '新生と浄化',
        characteristics: ['新しい始まり', '浄化', '成長', '希望']
      };
    }
    if ((month === 3 && day >= 20) || (month === 4 && day <= 30)) {
      return {
        season: '春分', festival: 'オスタラ (Ostara)', energy: 'バランスと成長',
        characteristics: ['バランス', '成長', '繁栄', '新鮮さ']
      };
    }
    if (month === 5 || (month === 6 && day <= 20)) {
      return {
        season: '春の盛り', festival: 'ベルテイン (Beltane)', energy: '生命力と情熱',
        characteristics: ['情熱', '豊穣', '活力', '愛']
      };
    }
    if ((month === 6 && day >= 21) || (month === 7 && day <= 31)) {
      return {
        season: '夏至', festival: 'リーザ (Litha)', energy: '最高潮の力',
        characteristics: ['完全性', '力', '成功', '明るさ']
      };
    }
    if (month === 8 || (month === 9 && day <= 21)) {
      return {
        season: '初収穫', festival: 'ルーナサ (Lughnasadh)', energy: '収穫と感謝',
        characteristics: ['収穫', '感謝', '技能', '豊かさ']
      };
    }
    if ((month === 9 && day >= 22) || (month === 10 && day <= 31)) {
      return {
        season: '秋分', festival: 'マボン (Mabon)', energy: 'バランスと準備',
        characteristics: ['バランス', '準備', '感謝', '知恵']
      };
    }
    // 11月, 12月前半
    return {
      season: '霊の季節', festival: 'サウィン (Samhain)', energy: '霊的つながり',
      characteristics: ['霊的洞察', '先祖との絆', '変容', '神秘']
    };
  }

  private calculateCelticElement(treeSign: Record<string, unknown>): {
    primary: string;
    secondary: string;
    characteristics: string[];
  } {
    const elementMapping: Record<string, { primary: string; secondary: string; characteristics: string[] }> = {
      'カバノキ': { primary: '水', secondary: '風', characteristics: ['浄化', '流動性', '再生'] },
      'ナナカマド': { primary: '火', secondary: '霊', characteristics: ['保護', '変容', '洞察'] },
      'トネリコ': { primary: '風', secondary: '霊', characteristics: ['連結', '伝達', '調和'] },
      'ハンノキ': { primary: '火', secondary: '大地', characteristics: ['勇気', '保護', '決断'] },
      'ヤナギ': { primary: '水', secondary: '月', characteristics: ['感情', '直感', '癒し'] },
      'サンザシ': { primary: '大地', secondary: '風', characteristics: ['成長', '保護', '希望'] },
      'オーク': { primary: '大地', secondary: '火', characteristics: ['力', '安定', '持久'] },
      'ヒイラギ': { primary: '火', secondary: '風', characteristics: ['バランス', '正義', '明確性'] },
      'ヘーゼル': { primary: '風', secondary: '水', characteristics: ['知恵', '学習', '霊感'] },
      'ブドウ': { primary: '水', secondary: '大地', characteristics: ['豊穣', '直感', '変容'] },
      'ツタ': { primary: '大地', secondary: '霊', characteristics: ['持続', '絆', '復活'] },
      'ヨシ': { primary: '風', secondary: '水', characteristics: ['柔軟性', '調和', '音楽'] },
      'ニワトコ': { primary: '霊', secondary: '大地', characteristics: ['変容', '終了', '再生'] }
    };

    const treeName = treeSign.name as string;
    return elementMapping[treeName] || { primary: '霊', secondary: '大地', characteristics: ['神秘', '安定', '変化'] };
  }

  private calculateSacredPlace(birthDate: Date): {
    name: string;
    type: string;
    energy: string;
    guidance: string;
  } {
    const sacredPlaces = [
      {
        name: 'ストーンヘンジ', type: '石の円環', energy: '宇宙的調和',
        guidance: '古代の知恵とつながり、宇宙のリズムに合わせて生きてください。'
      },
      {
        name: '聖なる森', type: '古い森', energy: '自然の魔法',
        guidance: '自然の中で静寂を見つけ、樹木の古い知恵を学んでください。'
      },
      {
        name: '神聖な泉', type: '聖なる水源', energy: '癒しと浄化',
        guidance: '心と体を浄化し、内なる治癒力を活性化してください。'
      },
      {
        name: '丘の上の砦', type: '古代の要塞', energy: '保護と力',
        guidance: '高い場所から人生を見渡し、自分の力を信じてください。'
      },
      {
        name: '妖精の環', type: '魔法の円', energy: '喜びと遊び心',
        guidance: '人生に遊び心と喜びを取り入れ、魔法を信じてください。'
      },
      {
        name: '古い墓地', type: '先祖の場所', energy: '先祖とのつながり',
        guidance: '先祖の知恵を尊重し、過去から学んでください。'
      },
      {
        name: '霧の湖', type: '神秘的な水域', energy: '神秘と直感',
        guidance: '直感を信じ、見えないものを感じる力を育ててください。'
      }
    ];

    const dayOfYear = this.getDayOfYear(birthDate);
    const index = dayOfYear % sacredPlaces.length;
    
    return sacredPlaces[index];
  }

  private generateInterpretation(
    treeSign: Record<string, unknown>,
    animalSpirit: Record<string, unknown>,
    oghamRune: Record<string, unknown>,
    seasonalEnergy: Record<string, unknown>,
    celticElement: Record<string, unknown>,
    sacredPlace: Record<string, unknown>
  ): {
    personality: string;
    spiritualPath: string;
    lifeLesson: string;
    strengths: string[];
    challenges: string[];
    advice: string;
    overall: string;
  } {
    const personality = `あなたは${treeSign.name}の樹の影響を受けており、${animalSpirit.name}の精霊に導かれています。` +
      `${celticElement.primary}のエネルギーが主体となり、自然との深いつながりを持った魂です。`;

    const spiritualPath = `${seasonalEnergy.festival}の時期のエネルギーがあなたの精神的な道筋を示しています。` +
      `${sacredPlace.name}の聖なる力があなたを守護し、導いています。`;

    const lifeLesson = `オガム文字${oghamRune.name}が示すように、「${oghamRune.meaning}」があなたの人生の重要な学びです。` +
      `${animalSpirit.guidance}`;

    const strengths = [
      ...(treeSign.characteristics as string[]).slice(0, 2),
      ...(animalSpirit.characteristics as string[]).slice(0, 2)
    ];

    const challenges = [
      `${celticElement.primary}エネルギーの過剰`,
      `${seasonalEnergy.season}期の影響による不安定さ`,
      '自然とのつながりの欠如'
    ];

    const advice = `${oghamRune.guidance} ${sacredPlace.guidance} ` +
      `あなたの樹である${treeSign.name}の特性を活かし、${animalSpirit.name}の導きに従ってください。`;

    const overall = `ケルトの古い魂として、あなたは自然界との深いつながりを持っています。` +
      `${treeSign.name}の樹とのつながりを大切にし、${seasonalEnergy.energy}のエネルギーを活用することで、` +
      `真の自分を発見し、スピリチュアルな成長を遂げることができるでしょう。`;

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

  private getDayOfYear(date: Date): number {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date.getTime() - start.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  generateCacheKey(input: CelticAstrologyInput): string {
    return `celtic_${input.fullName}_${input.birthDate}`;
  }

  generateInputHash(input: CelticAstrologyInput): string {
    return Buffer.from(`${input.fullName}${input.birthDate}`).toString('base64');
  }
}

export const celticAstrologyEngine = new CelticAstrologyEngine();