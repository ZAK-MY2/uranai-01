// 動的モックデータ生成システム
import type { 
  MockDivinationData, 
  MockDataGeneratorOptions,
  DailyVariation,
  HourlyEnergy,
  ScoreSet,
  TarotCard,
  RuneStone,
  Hexagram
} from '@/types/mock-data.types';

/**
 * 高品質な動的モックデータ生成器
 * 実際の占術理論に基づいたリアルなデータを生成
 */
export class DynamicMockGenerator {
  private seed: number;
  private locale: 'ja' | 'en';
  private complexity: 'simple' | 'detailed' | 'comprehensive';

  constructor(options: MockDataGeneratorOptions = {}) {
    this.seed = options.seed || Date.now();
    this.locale = options.locale || 'ja';
    this.complexity = options.complexity || 'detailed';
  }

  // シード値に基づく疑似ランダム生成器
  private random(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  private randomInt(min: number, max: number): number {
    return Math.floor(this.random() * (max - min + 1)) + min;
  }

  private randomChoice<T>(array: T[]): T {
    return array[Math.floor(this.random() * array.length)];
  }

  // 数秘術データ生成
  generateNumerology(): MockDivinationData['numerology'] {
    const lifePathNumber = this.randomInt(1, 9);
    const destinyNumber = this.randomInt(1, 9);
    const soulNumber = this.randomInt(1, 9);
    const personalityNumber = this.randomInt(1, 9);
    
    // 成熟数は人生の数と運命の数の合計
    const maturityNumber = this.reduceToSingleDigit(lifePathNumber + destinyNumber);
    
    const baseScore = this.randomInt(75, 95);
    const scores: ScoreSet = {
      overall: baseScore,
      career: this.randomInt(baseScore - 10, baseScore + 10),
      love: this.randomInt(baseScore - 15, baseScore + 15),
      health: this.randomInt(baseScore - 5, baseScore + 5),
      wealth: this.randomInt(baseScore - 12, baseScore + 12)
    };

    const lifePathMeanings = {
      1: "独立心旺盛なリーダー。新しい道を切り開く先駆者",
      2: "調和と協力を重んじる平和主義者。人々を結びつける役割",
      3: "創造性豊かな表現者。芸術と美を愛する自由な魂",
      4: "堅実で実用的な建設者。安定と秩序を重視する",
      5: "自由と冒険を愛する探求者。変化と多様性を楽しむ",
      6: "愛と責任感に満ちた養育者。家族と共同体を大切にする",
      7: "深い洞察力を持つ神秘主義者。真理と知恵を追求する",
      8: "物質的成功を重視する実業家。権力と達成を目指す",
      9: "普遍的な愛を持つ人道主義者。人類への奉仕を使命とする"
    };

    return {
      lifePathNumber,
      destinyNumber,
      soulNumber,
      personalityNumber,
      maturityNumber,
      birthdayNumber: this.randomInt(1, 31),
      scores,
      interpretation: {
        lifePathMeaning: lifePathMeanings[lifePathNumber as keyof typeof lifePathMeanings],
        todaysFocus: this.generateTodaysFocus(),
        advice: this.generateNumerologyAdvice(lifePathNumber)
      },
      compatibility: this.generateNumerologyCompatibility(lifePathNumber),
      luckyNumbers: this.generateLuckyNumbers(lifePathNumber, destinyNumber),
      todaysNumber: this.randomInt(1, 9)
    };
  }

  // タロットデータ生成
  generateTarot(): MockDivinationData['tarot'] {
    const majorArcana = [
      { name: "愚者", number: 0, keywords: ["新しい始まり", "冒険", "無邪気さ"] },
      { name: "魔術師", number: 1, keywords: ["意志力", "創造", "技能"] },
      { name: "女教皇", number: 2, keywords: ["直感", "神秘", "潜在意識"] },
      { name: "女帝", number: 3, keywords: ["豊穣", "創造性", "母性"] },
      { name: "皇帝", number: 4, keywords: ["権威", "安定", "秩序"] },
      { name: "教皇", number: 5, keywords: ["精神的指導", "伝統", "学習"] },
      { name: "恋人", number: 6, keywords: ["愛", "選択", "結合"] },
      { name: "戦車", number: 7, keywords: ["意志力", "勝利", "コントロール"] },
      { name: "力", number: 8, keywords: ["内なる力", "勇気", "忍耐"] },
      { name: "隠者", number: 9, keywords: ["内省", "魂の探求", "智慧"] },
      { name: "運命の輪", number: 10, keywords: ["運命", "変化", "サイクル"] },
      { name: "正義", number: 11, keywords: ["公正", "バランス", "真実"] },
      { name: "吊られた男", number: 12, keywords: ["犠牲", "解放", "新たな視点"] },
      { name: "死神", number: 13, keywords: ["変容", "終わりと始まり", "再生"] },
      { name: "節制", number: 14, keywords: ["調和", "バランス", "癒し"] },
      { name: "悪魔", number: 15, keywords: ["束縛", "誘惑", "影の側面"] },
      { name: "塔", number: 16, keywords: ["破壊", "突然の変化", "啓示"] },
      { name: "星", number: 17, keywords: ["希望", "インスピレーション", "癒し"] },
      { name: "月", number: 18, keywords: ["幻想", "潜在意識", "不安"] },
      { name: "太陽", number: 19, keywords: ["成功", "活力", "喜び"] },
      { name: "審判", number: 20, keywords: ["復活", "覚醒", "新たな人生"] },
      { name: "世界", number: 21, keywords: ["完成", "成就", "統合"] }
    ];

    const pastCard = this.randomChoice(majorArcana);
    const presentCard = this.randomChoice(majorArcana);
    const futureCard = this.randomChoice(majorArcana);

    return {
      cards: {
        past: this.createTarotCard(pastCard, "過去の影響を示しています"),
        present: this.createTarotCard(presentCard, "現在の状況を表しています"),
        future: this.createTarotCard(futureCard, "近い将来の展望を示しています")
      },
      overallMessage: this.generateTarotOverallMessage(pastCard, presentCard, futureCard),
      advice: this.generateTarotAdvice(presentCard),
      themes: this.generateTarotThemes(pastCard, presentCard, futureCard)
    };
  }

  // 西洋占星術データ生成
  generateAstrology(): MockDivinationData['astrology'] {
    const zodiacSigns = [
      "牡羊座", "牡牛座", "双子座", "蟹座", "獅子座", "乙女座",
      "天秤座", "蠍座", "射手座", "山羊座", "水瓶座", "魚座"
    ];

    const sunSign = this.randomChoice(zodiacSigns);
    const moonSign = this.randomChoice(zodiacSigns);
    const risingSign = this.randomChoice(zodiacSigns);

    const aspects = ["コンジャンクション", "セクスタイル", "スクエア", "トライン", "オポジション"];

    return {
      sunSign,
      moonSign,
      risingSign,
      planets: {
        mercury: { sign: this.randomChoice(zodiacSigns), house: this.randomInt(1, 12), aspect: this.randomChoice(aspects) },
        venus: { sign: this.randomChoice(zodiacSigns), house: this.randomInt(1, 12), aspect: this.randomChoice(aspects) },
        mars: { sign: this.randomChoice(zodiacSigns), house: this.randomInt(1, 12), aspect: this.randomChoice(aspects) },
        jupiter: { sign: this.randomChoice(zodiacSigns), house: this.randomInt(1, 12), aspect: this.randomChoice(aspects) },
        saturn: { sign: this.randomChoice(zodiacSigns), house: this.randomInt(1, 12), aspect: this.randomChoice(aspects) }
      },
      aspects: {
        favorable: this.generateFavorableAspects(),
        challenging: this.generateChallengingAspects()
      },
      todaysTransit: this.generateTodaysTransit(),
      interpretation: this.generateAstrologyInterpretation(sunSign, moonSign, risingSign),
      houses: this.generateHouses()
    };
  }

  // ルーン占いデータ生成
  generateRunes(): MockDivinationData['runes'] {
    const elderFuthark = [
      { name: "フェフ", meaning: "家畜・富", element: "地" },
      { name: "ウルズ", meaning: "野牛・力", element: "地" },
      { name: "スリサズ", meaning: "巨人・混沌", element: "火" },
      { name: "アンスズ", meaning: "神々・叡智", element: "風" },
      { name: "ライド", meaning: "旅・動き", element: "風" },
      { name: "ケン", meaning: "松明・知識", element: "火" },
      { name: "ギューフ", meaning: "贈り物・犠牲", element: "風" },
      { name: "ウィン", meaning: "喜び・調和", element: "風" },
      { name: "ハガル", meaning: "雹・破壊", element: "水" },
      { name: "ナウド", meaning: "必要・制約", element: "火" },
      { name: "イサ", meaning: "氷・停止", element: "水" },
      { name: "ヤラ", meaning: "収穫・報酬", element: "地" },
      { name: "ユール", meaning: "イチイ・防御", element: "地" },
      { name: "ペルト", meaning: "運命・神秘", element: "水" },
      { name: "エルハズ", meaning: "エルク・保護", element: "風" },
      { name: "ソウル", meaning: "太陽・勝利", element: "火" },
      { name: "ティール", meaning: "戦神・正義", element: "風" },
      { name: "ベルカナ", meaning: "樺・成長", element: "地" },
      { name: "エワズ", meaning: "馬・移動", element: "地" },
      { name: "マン", meaning: "人間・協力", element: "風" },
      { name: "ラグズ", meaning: "水・流れ", element: "水" },
      { name: "イング", meaning: "豊穣神・平和", element: "地" },
      { name: "オシラ", meaning: "故郷・遺産", element: "地" },
      { name: "ダガズ", meaning: "夜明け・変容", element: "火" }
    ];

    const drawnRunes = [
      this.randomChoice(elderFuthark),
      this.randomChoice(elderFuthark),
      this.randomChoice(elderFuthark)
    ];

    return {
      drawn: drawnRunes.map(rune => this.createRuneStone(rune)),
      interpretation: this.generateRuneInterpretation(drawnRunes),
      guidance: this.generateRuneGuidance(drawnRunes),
      timeline: this.randomChoice(['past', 'present', 'future'] as const)
    };
  }

  // I Ching データ生成
  generateIChing(): MockDivinationData['iChing'] {
    const hexagrams = [
      { number: 1, name: "乾為天", upper: "乾（天）", lower: "乾（天）", judgment: "元いに亨る。貞に利し。" },
      { number: 2, name: "坤為地", upper: "坤（地）", lower: "坤（地）", judgment: "元いに亨り、牝馬の貞に利し。" },
      { number: 14, name: "火天大有", upper: "離（火）", lower: "乾（天）", judgment: "大いなる所有。元いに亨る。" },
      { number: 29, name: "坎為水", upper: "坎（水）", lower: "坎（水）", judgment: "習坎、孚有り。心亨る。" },
      { number: 30, name: "離為火", upper: "離（火）", lower: "離（火）", judgment: "利貞、亨る。" }
    ];

    const selectedHexagram = this.randomChoice(hexagrams);
    const changingLines = this.generateChangingLines();

    return {
      hexagram: {
        number: selectedHexagram.number,
        name: selectedHexagram.name,
        upperTrigram: selectedHexagram.upper,
        lowerTrigram: selectedHexagram.lower,
        judgment: selectedHexagram.judgment,
        image: `${selectedHexagram.name}の象を表します`
      },
      changingLines,
      interpretation: this.generateIChingInterpretation(selectedHexagram),
      guidance: this.generateIChingGuidance(selectedHexagram),
      futureHexagram: changingLines.length > 0 ? this.generateFutureHexagram(selectedHexagram) : undefined
    };
  }

  // 完全なモックデータ生成
  generateComplete(): MockDivinationData {
    const baseScore = this.randomInt(80, 95);
    
    return {
      overallScore: baseScore,
      numerology: this.generateNumerology(),
      tarot: this.generateTarot(),
      astrology: this.generateAstrology(),
      runes: this.generateRunes(),
      iChing: this.generateIChing(),
      nineStarKi: this.generateNineStarKi(),
      shichuSuimei: this.generateShichuSuimei(),
      kabbalah: this.generateKabbalah(),
      vedicAstrology: this.generateVedicAstrology(),
      celticAstrology: this.generateCelticAstrology(),
      integration: this.generateIntegration()
    };
  }

  // 日別バリエーション
  getDailyVariation(): DailyVariation {
    return {
      energyShift: (this.random() - 0.5) * 2, // -1 to 1
      focusArea: this.randomChoice(['career', 'love', 'health', 'wealth', 'spiritual'] as const),
      intensityMultiplier: 0.5 + this.random() // 0.5 to 1.5
    };
  }

  // 時間帯エネルギー
  getHourlyEnergy(): HourlyEnergy {
    const hour = new Date().getHours();
    
    const energyTypes = [
      { type: "朝の清々しいエネルギー", intensity: 85, favorableActivities: ["瞑想", "計画立案", "新しい始まり"], unfavorableActivities: ["重要な判断", "感情的な話し合い"] },
      { type: "活動的なエネルギー", intensity: 95, favorableActivities: ["仕事", "運動", "積極的な行動"], unfavorableActivities: ["休息", "内省"] },
      { type: "安定したエネルギー", intensity: 80, favorableActivities: ["会議", "学習", "創作活動"], unfavorableActivities: ["冒険", "変化"] },
      { type: "創造的なエネルギー", intensity: 90, favorableActivities: ["アート", "問題解決", "新しいアイデア"], unfavorableActivities: ["ルーティンワーク"] },
      { type: "内省的なエネルギー", intensity: 75, favorableActivities: ["振り返り", "感謝", "人間関係"], unfavorableActivities: ["新しい挑戦"] },
      { type: "休息と再生のエネルギー", intensity: 60, favorableActivities: ["睡眠", "リラックス", "癒し"], unfavorableActivities: ["活発な活動", "重要な決断"] }
    ];

    const index = Math.min(Math.floor(hour / 4), energyTypes.length - 1);
    return energyTypes[index];
  }

  // ヘルパーメソッド群
  private reduceToSingleDigit(num: number): number {
    while (num > 9 && num !== 11 && num !== 22 && num !== 33) {
      num = num.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
    }
    return num;
  }

  private generateTodaysFocus(): string {
    const focuses = [
      "直感に従って行動する日",
      "新しい可能性を探る時",
      "内なる声に耳を傾ける日",
      "創造性を発揮する絶好の機会",
      "人との繋がりを大切にする時",
      "変化を受け入れる準備の日",
      "感謝の気持ちを表現する時"
    ];
    return this.randomChoice(focuses);
  }

  private generateNumerologyAdvice(lifePathNumber: number): string {
    const advices = {
      1: "独立心を活かし、新しいプロジェクトに挑戦しましょう",
      2: "協力と調和を心がけ、チームワークを大切にしてください",
      3: "創造性を表現し、芸術的な活動に時間を割きましょう",
      4: "計画的に行動し、基盤をしっかりと固めてください",
      5: "新しい経験を求め、変化を恐れずに進みましょう",
      6: "家族や友人との絆を深め、愛情を分かち合ってください",
      7: "瞑想や内省の時間を作り、精神的な成長を目指しましょう",
      8: "目標に向かって努力し、物質的な成功を追求してください",
      9: "他者への奉仕を通じて、より大きな意味を見つけましょう"
    };
    return advices[lifePathNumber as keyof typeof advices] || "自分らしい道を歩んでください";
  }

  private generateNumerologyCompatibility(lifePathNumber: number) {
    const compatibilityMap = {
      1: { best: [3, 5, 6], challenging: [4, 8] },
      2: { best: [4, 6, 8], challenging: [1, 5] },
      3: { best: [1, 5, 9], challenging: [4, 7] },
      4: { best: [2, 6, 8], challenging: [3, 5] },
      5: { best: [1, 3, 7], challenging: [2, 4] },
      6: { best: [2, 4, 9], challenging: [1, 5] },
      7: { best: [1, 5, 7], challenging: [3, 8] },
      8: { best: [2, 4, 6], challenging: [7, 9] },
      9: { best: [3, 6, 9], challenging: [4, 8] }
    };
    
    const compat = compatibilityMap[lifePathNumber as keyof typeof compatibilityMap];
    return {
      bestNumbers: compat?.best || [1, 2, 3],
      challengingNumbers: compat?.challenging || [7, 8, 9]
    };
  }

  private generateLuckyNumbers(lifePathNumber: number, destinyNumber: number): number[] {
    const baseNumbers = [lifePathNumber, destinyNumber];
    const additionalNumbers = [];
    
    for (let i = 0; i < 3; i++) {
      additionalNumbers.push(this.randomInt(1, 9));
    }
    
    return [...new Set([...baseNumbers, ...additionalNumbers])].slice(0, 5);
  }

  private createTarotCard(arcana: any, interpretation: string): TarotCard {
    return {
      name: arcana.name,
      arcana: 'major',
      number: arcana.number,
      image: arcana.name.toLowerCase(),
      keywords: arcana.keywords,
      interpretation,
      position: this.randomChoice(['upright', 'reversed'] as const)
    };
  }

  private generateTarotOverallMessage(past: any, present: any, future: any): string {
    return `${past.name}から${present.name}を経て${future.name}へと向かう流れが示されています。`;
  }

  private generateTarotAdvice(present: any): string {
    return `現在の${present.name}のエネルギーを活かし、${present.keywords[0]}に重点を置いて行動してください。`;
  }

  private generateTarotThemes(past: any, present: any, future: any): string[] {
    return [
      past.keywords[0],
      present.keywords[0],
      future.keywords[0],
      "変容と成長"
    ];
  }

  private generateFavorableAspects(): string[] {
    const aspects = [
      "太陽と木星のトライン",
      "金星と月のセクスタイル",
      "水星と天王星のコンジャンクション",
      "火星と土星のトライン"
    ];
    return [this.randomChoice(aspects), this.randomChoice(aspects)];
  }

  private generateChallengingAspects(): string[] {
    const aspects = [
      "火星と土星のスクエア",
      "太陽と海王星のオポジション",
      "月と冥王星のスクエア"
    ];
    return [this.randomChoice(aspects)];
  }

  private generateTodaysTransit(): string {
    const transits = [
      "月が第10ハウスを通過中 - キャリアに関する重要な気づきの時",
      "金星が第7ハウス入り - 人間関係に調和をもたらす",
      "火星が第1ハウスを刺激 - 行動力と積極性が高まる"
    ];
    return this.randomChoice(transits);
  }

  private generateAstrologyInterpretation(sun: string, moon: string, rising: string): string {
    return `${sun}の太陽、${moon}の月、${rising}の上昇星座の組み合わせが、あなたの複層的な性格を形成しています。`;
  }

  private generateHouses(): any {
    const houses: any = {};
    const signs = ["牡羊座", "牡牛座", "双子座", "蟹座", "獅子座", "乙女座", "天秤座", "蠍座", "射手座", "山羊座", "水瓶座", "魚座"];
    const themes = ["自己", "価値観", "コミュニケーション", "家庭", "創造性", "健康", "パートナーシップ", "変容", "哲学", "キャリア", "友情", "精神性"];
    
    for (let i = 1; i <= 12; i++) {
      houses[i] = {
        sign: this.randomChoice(signs),
        planets: [],
        theme: themes[i - 1]
      };
    }
    
    return houses;
  }

  private createRuneStone(rune: any): RuneStone {
    return {
      name: rune.name,
      meaning: rune.meaning,
      position: this.randomChoice(['upright', 'reversed'] as const),
      element: rune.element as 'fire' | 'water' | 'earth' | 'air',
      keywords: [rune.meaning, "導き", "変化"],
      interpretation: `${rune.name}は${rune.meaning}を表し、現在の状況に重要な示唆を与えています。`
    };
  }

  private generateRuneInterpretation(runes: any[]): string {
    return `${runes.map(r => r.name).join('、')}の組み合わせが示すメッセージを読み取ってください。`;
  }

  private generateRuneGuidance(runes: any[]): string {
    return `${runes[0].meaning}の力を借りて、新しい段階に進む準備をしてください。`;
  }

  private generateChangingLines(): number[] {
    const numChanging = this.randomInt(0, 3);
    const lines = [];
    for (let i = 0; i < numChanging; i++) {
      lines.push(this.randomInt(1, 6));
    }
    return [...new Set(lines)];
  }

  private generateIChingInterpretation(hexagram: any): string {
    return `${hexagram.name}は${hexagram.judgment}という判断を示し、現在の状況に深い洞察を与えています。`;
  }

  private generateIChingGuidance(hexagram: any): string {
    return `${hexagram.name}の教えに従い、自然の流れに調和して行動することが重要です。`;
  }

  private generateFutureHexagram(current: any): Hexagram {
    return {
      number: this.randomInt(1, 64),
      name: "変化後の卦",
      upperTrigram: "変化",
      lowerTrigram: "発展",
      judgment: "変化により新たな可能性が開かれる",
      image: "変容の象"
    };
  }

  // その他の占術メソッドも同様に実装...
  private generateNineStarKi(): MockDivinationData['nineStarKi'] {
    const stars = ["一白水星", "二黒土星", "三碧木星", "四緑木星", "五黄土星", "六白金星", "七赤金星", "八白土星", "九紫火星"];
    const directions = ["北", "北東", "東", "南東", "南", "南西", "西", "北西"];
    
    return {
      mainStar: this.randomChoice(stars),
      monthStar: this.randomChoice(stars),
      yearStar: this.randomChoice(stars),
      direction: {
        favorable: [this.randomChoice(directions), this.randomChoice(directions)],
        unfavorable: [this.randomChoice(directions)]
      },
      element: this.randomChoice(["木", "火", "土", "金", "水"]),
      todaysEnergy: "発展と成長のエネルギーが強い日",
      advice: "新しいプロジェクトの開始に最適",
      compatibility: {
        best: [this.randomChoice(stars), this.randomChoice(stars)],
        avoid: [this.randomChoice(stars)]
      }
    };
  }

  private generateShichuSuimei(): MockDivinationData['shichuSuimei'] {
    const stems = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
    const branches = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
    const elements = ["木", "火", "土", "金", "水"];
    
    return {
      yearPillar: { heavenlyStem: this.randomChoice(stems), earthlyBranch: this.randomChoice(branches), element: this.randomChoice(elements) },
      monthPillar: { heavenlyStem: this.randomChoice(stems), earthlyBranch: this.randomChoice(branches), element: this.randomChoice(elements) },
      dayPillar: { heavenlyStem: this.randomChoice(stems), earthlyBranch: this.randomChoice(branches), element: this.randomChoice(elements) },
      hourPillar: { heavenlyStem: this.randomChoice(stems), earthlyBranch: this.randomChoice(branches), element: this.randomChoice(elements) },
      fiveElements: {
        wood: this.randomInt(0, 3),
        fire: this.randomInt(0, 3),
        earth: this.randomInt(0, 3),
        metal: this.randomInt(0, 3),
        water: this.randomInt(0, 3)
      },
      majorCycle: {
        period: `${this.randomInt(25, 45)}-${this.randomInt(46, 65)}歳`,
        element: this.randomChoice(elements),
        fortune: this.randomChoice(["上昇期", "安定期", "調整期"])
      },
      interpretation: "五行のバランスが良く、調和の取れた運命を示しています。",
      strengths: ["洞察力", "判断力", "協調性"],
      challenges: ["優柔不断", "完璧主義", "心配性"]
    };
  }

  private generateKabbalah(): MockDivinationData['kabbalah'] {
    const sephiroth = ["ケテル", "コクマー", "ビナー", "ケセド", "ゲブラー", "ティファレト", "ネツァク", "ホド", "イェソド", "マルクト"];
    const letters = ["アレフ", "ベート", "ギメル", "ダレット", "ヘー", "ヴァヴ", "ザイン", "ヘット", "テット", "ヨッド"];
    const angels = ["ミカエル", "ガブリエル", "ラファエル", "ウリエル"];
    
    return {
      treeOfLife: {
        currentSephirah: this.randomChoice(sephiroth),
        path: this.randomInt(1, 22),
        element: this.randomChoice(["火", "水", "風", "地"])
      },
      hebrewLetter: this.randomChoice(letters),
      angelicInfluence: this.randomChoice(angels),
      interpretation: "神聖な知恵の木において、あなたは重要な位置にいます。",
      meditation: "内なる光に集中し、宇宙との繋がりを感じてください。",
      guidance: ["感謝の気持ちを持つ", "他者への奉仕", "精神的な成長"]
    };
  }

  private generateVedicAstrology(): MockDivinationData['vedicAstrology'] {
    const nakshatras = ["アシュヴィニー", "バラニー", "クリッティカー", "ローヒニー", "ムリガシラー"];
    const dashas = ["太陽期", "月期", "火星期", "ラーフ期", "木星期", "土星期", "水星期", "ケートゥ期", "金星期"];
    
    return {
      nakshatra: this.randomChoice(nakshatras),
      moonMansion: this.randomInt(1, 27),
      planetaryPeriod: {
        mahaDasha: this.randomChoice(dashas),
        antarDasha: this.randomChoice(dashas),
        yearsRemaining: parseFloat((this.random() * 10).toFixed(1))
      },
      yogas: ["ラージャ・ヨーガ", "ダナ・ヨーガ"],
      remedies: ["ルドラークシャを身につける", "マントラを唱える", "チャリティを行う"],
      interpretation: "現在の惑星期は創造性と繁栄をもたらします。",
      gemstones: ["真珠", "サファイア", "エメラルド"],
      mantras: ["オーム ナマ シヴァーヤ", "オーム ガム ガナパタイェ ナマハ"]
    };
  }

  private generateCelticAstrology(): MockDivinationData['celticAstrology'] {
    const trees = ["ナナカマド", "トネリコ", "ヘーゼル", "ブドウ", "アイビー", "ヨモギ"];
    const animals = ["鹿", "猫", "蝶", "白鳥", "蛇", "ハヤブサ"];
    const colors = ["深緑", "金色", "銀色", "紫", "青", "赤"];
    const gems = ["エメラルド", "サファイア", "オパール", "アメジスト", "トパーズ"];
    
    return {
      treeSign: this.randomChoice(trees),
      animal: this.randomChoice(animals),
      color: this.randomChoice(colors),
      gemstone: this.randomChoice(gems),
      element: this.randomChoice(["火", "水", "風", "地"]),
      qualities: ["神秘的", "直感的", "創造的", "保護的"],
      interpretation: "古代ケルトの智慧があなたを導いています。",
      season: this.randomChoice(["春", "夏", "秋", "冬"]),
      mythology: "古代の森の精霊があなたを見守っています。"
    };
  }

  private generateIntegration(): MockDivinationData['integration'] {
    const elements = ["火", "水", "風", "地"];
    const themes = ["成長", "変容", "調和", "創造", "愛", "知恵", "勇気", "癒し"];
    
    return {
      dominantElement: this.randomChoice(elements),
      dominantNumber: this.randomInt(1, 9),
      keyThemes: [
        this.randomChoice(themes),
        this.randomChoice(themes),
        this.randomChoice(themes)
      ],
      synchronicities: [
        "複数の占術で同じ数字が出現",
        "火のエレメントが強調されている",
        "新しい始まりのシンボルが多数見られる"
      ],
      guidanceMessage: "宇宙があなたに送るメッセージは明確です。直感を信じ、恐れずに前進してください。",
      actionSteps: [
        "毎日の瞑想習慣を始める",
        "創造的なプロジェクトに取り組む",
        "新しい人間関係を築く",
        "自然との繋がりを深める"
      ],
      timeframe: "今後3ヶ月間",
      confidence: this.randomInt(85, 98)
    };
  }
}

// デフォルトエクスポート
export const dynamicMockGenerator = new DynamicMockGenerator();

// ユーザーデータに基づくカスタムジェネレーター
export function createPersonalizedMockData(userData: {
  fullName: string;
  birthDate: string;
  question: string;
}): MockDivinationData {
  // ユーザーデータから一意のシード値を生成
  const seed = userData.fullName.length + 
               new Date(userData.birthDate).getTime() + 
               userData.question.length;
  
  const generator = new DynamicMockGenerator({ seed });
  return generator.generateComplete();
}