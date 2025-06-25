import { DivinationInput, EnvironmentData } from './base-engine';
import { dynamicMessageGeneratorFinal } from './dynamic-message-generator-final';

/**
 * 動的メッセージ生成エンジン
 * 2年間重複なし保証付きの最終版を使用
 */
export class DynamicMessageGenerator {
  private templates = {
    // 時間帯による表現（拡張版）
    timeExpressions: [
      "朝の光のように", "夕日が山を染めるように", "夜空の星のように", 
      "夜明け前の静寂のように", "昼下がりの陽だまりのように", "黄昏時の美しさのように",
      "朝露が輝くように", "真昼の太陽のように", "月明かりのように",
      "暁の空のように", "宵の明星のように", "深夜の静寂のように",
      "朝焼けのように", "夕焼けのように", "星空の瞬きのように",
      "新しい朝のように", "穏やかな午後のように", "静かな夜のように",
      "日の出の瞬間のように", "月の満ち欠けのように", "流れ星のように"
    ],
    
    // 自然の比喩（拡張版）
    natureMetaphors: [
      "川の流れのように", "大地に根を張るように", "風が舞うように", 
      "海の波のように", "山が聳えるように", "花が咲くように",
      "雲が流れるように", "木が成長するように", "雨が大地を潤すように",
      "滝が流れ落ちるように", "泉が湧き出るように", "虹がかかるように",
      "蝶が羽ばたくように", "鳥が空を舞うように", "種が芽吹くように",
      "雪が舞い降りるように", "春風が吹くように", "秋の実りのように",
      "大海原のように", "森の息吹のように", "草原を渡る風のように",
      "岩が風化するように", "結晶が成長するように", "光が差し込むように",
      "潮の満ち引きのように", "季節が巡るように", "自然の摂理のように"
    ],
    
    // プロセス表現（拡張版）
    processWords: [
      "着実に", "ゆっくりと", "確実に", "自然に", "力強く", 
      "優雅に", "静かに", "堂々と", "穏やかに", "情熱的に",
      "丁寧に", "慎重に", "大胆に", "繊細に", "確かに",
      "しなやかに", "粘り強く", "誠実に", "素直に", "賢明に",
      "勇敢に", "謙虚に", "真摯に", "積極的に", "創造的に",
      "直感的に", "論理的に", "感覚的に", "実践的に", "革新的に"
    ],
    
    // 結果表現（拡張版）
    resultWords: [
      "築かれます", "育ちます", "実現します", "花開きます", "形作られます",
      "成就します", "結実します", "芽吹きます", "輝きます", "完成します",
      "開花します", "達成されます", "叶います", "現れます", "生まれます",
      "創造されます", "展開します", "発展します", "成長します", "進化します",
      "深まります", "広がります", "高まります", "強まります", "豊かになります",
      "明らかになります", "具現化します", "顕現します", "開かれます", "満たされます"
    ],
    
    // 感情的な修飾語（拡張版）
    emotionalModifiers: [
      "心から", "深く", "真に", "純粋に", "誠実に", 
      "情熱的に", "穏やかに", "力強く", "優しく", "勇敢に",
      "喜びを持って", "感謝と共に", "愛を込めて", "希望を抱いて", "信念を持って",
      "平和な心で", "明るく", "前向きに", "建設的に", "創造的に",
      "慈愛を持って", "寛容な心で", "謙虚に", "素直に", "真摯に",
      "全身全霊で", "一途に", "献身的に", "積極的に", "主体的に"
    ],
    
    // 時間的表現（拡張版）
    temporalExpressions: [
      "やがて", "いずれ", "時が来れば", "適切な時に", "運命の時に",
      "宇宙のタイミングで", "最良の時に", "時の流れと共に",
      "近い将来", "そう遠くない未来に", "機が熟せば", "準備が整えば",
      "必要な時に", "ふさわしい瞬間に", "完璧なタイミングで", "自然な流れで",
      "段階的に", "徐々に", "一歩ずつ", "着実な歩みで", "確かな道のりで"
    ]
  };

  private seasonalInfluences = {
    spring: [
      "新緑のように", "桜が咲くように", "新しい命のように",
      "春の息吹のように", "芽吹きの季節のように", "花開く季節のように",
      "春雨のように", "暖かな陽射しのように", "蝶が舞うように",
      "若葉のように", "春風に乗って", "生命力溢れる春のように"
    ],
    summer: [
      "太陽のように", "緑陰のように", "夏雲のように",
      "海のきらめきのように", "夏の生命力のように", "向日葵のように",
      "青空のように", "夏の夜空のように", "蝉の声のように",
      "入道雲のように", "夏祭りの賑わいのように", "熱い情熱のように"
    ], 
    autumn: [
      "紅葉のように", "実りのように", "豊穣のように",
      "秋風のように", "収穫の喜びのように", "黄金色の稲穂のように",
      "秋の夕暮れのように", "澄んだ空気のように", "豊かな実りのように",
      "秋雨のように", "紅葉の美しさのように", "深まる季節のように"
    ],
    winter: [
      "雪景色のように", "静寂のように", "純白のように",
      "冬の星空のように", "暖炉の温もりのように", "結晶のように",
      "凛とした空気のように", "雪の結晶のように", "静謐な冬のように",
      "冬の朝のように", "温かな灯りのように", "内なる強さのように"
    ]
  };

  private moonPhaseExpressions = {
    new: [
      "新月の始まりのように", "新たな出発のように",
      "種まきの時のように", "静かな準備のように", "内なる声に従って",
      "新しいサイクルの始まりとして", "可能性の種として", "闇から光へ向かって"
    ],
    waxing: [
      "上弦の月のように", "成長のエネルギーで",
      "満ちていく月のように", "力を蓄えながら", "前進の勢いで",
      "発展の段階として", "希望と共に成長して", "光が増していくように"
    ],
    full: [
      "満月の完成のように", "円満な形で",
      "最高潮の時として", "豊かさの象徴として", "完全なる調和の中で",
      "満ち足りた状態で", "全てが明らかになる時", "最大の力を発揮して"
    ],
    waning: [
      "下弦の月のように", "洗練されながら",
      "手放しの時期として", "内省と浄化の時", "次への準備として",
      "余分を削ぎ落として", "本質に向かって", "智慧を深めながら"
    ]
  };

  /**
   * 動的メッセージを生成（最終版に委譲）
   */
  public async generateMessage(
    baseMessage: string,
    category: string,
    userInput: DivinationInput,
    environmentData?: EnvironmentData,
    divinationType: string = 'general'
  ): Promise<string> {
    // 最終版のジェネレーターに処理を委譲
    return dynamicMessageGeneratorFinal.generateMessage(
      baseMessage,
      category,
      userInput,
      environmentData,
      divinationType
    );
  }

  /**
   * 同期版（互換性のため残す）
   */
  public generateMessageSync(
    baseMessage: string,
    category: string,
    userInput: DivinationInput,
    environmentData?: EnvironmentData
  ): string {
    
    // ユーザー固有のシードを生成
    const personalSeed = this.generatePersonalSeed(userInput);
    
    // 時間的要素を追加
    const temporalSeed = this.generateTemporalSeed();
    
    // 環境的要素を追加
    const environmentalSeed = this.generateEnvironmentalSeed(environmentData);
    
    // シード値を組み合わせ
    const combinedSeed = personalSeed + temporalSeed + environmentalSeed;
    
    // カテゴリに基づいてスタイルを決定
    const style = this.determineStyle(category, userInput.question || '');
    
    // メッセージを構築
    const dynamicMessage = this.buildDynamicMessage(
      baseMessage,
      combinedSeed,
      style,
      userInput,
      environmentData
    );
    
    return dynamicMessage;
  }

  /**
   * ユーザー固有のシード値を生成
   */
  private generatePersonalSeed(userInput: DivinationInput): number {
    let seed = 0;
    
    // 名前から生成
    for (let i = 0; i < userInput.fullName.length; i++) {
      seed += userInput.fullName.charCodeAt(i) * (i + 1);
    }
    
    // 生年月日から生成
    seed += userInput.birthDate.getFullYear();
    seed += userInput.birthDate.getMonth() * 31;
    seed += userInput.birthDate.getDate() * 12;
    
    // 質問内容から生成
    seed += (userInput.question || '').length * 7;
    
    return seed;
  }

  /**
   * 時間的シード値を生成
   */
  private generateTemporalSeed(): number {
    const now = new Date();
    let seed = 0;
    
    seed += now.getHours() * 60;
    seed += now.getMinutes();
    seed += now.getSeconds() * 100; // 秒をより強く反映
    seed += now.getDate() * 24;
    seed += Math.floor(now.getTime() / 1000) % 10000; // より大きな変動範囲
    
    return seed;
  }

  /**
   * 環境的シード値を生成
   */
  private generateEnvironmentalSeed(environmentData?: EnvironmentData): number {
    let seed = Math.floor(Math.random() * 1000); // 常にランダム要素を追加
    
    if (!environmentData) return seed;
    
    // 月相から
    if (environmentData.lunar) {
      const phase = environmentData.lunar.phase;
      seed += phase < 0.25 ? 100 : // 新月
             phase > 0.75 ? 200 : // 満月
             150; // その他
    }
    
    // 天候から
    if (environmentData.weather) {
      seed += environmentData.weather.condition === 'sunny' ? 300 :
             environmentData.weather.condition === 'rainy' ? 400 : 350;
    }
    
    return seed;
  }

  /**
   * カテゴリと質問からスタイルを決定
   */
  private determineStyle(category: string, question: string): string {
    if (category.includes('恋愛')) return 'romantic';
    if (category.includes('仕事')) return 'professional';
    if (category.includes('健康')) return 'gentle';
    if (category.includes('金運')) return 'prosperous';
    if (question && (question.includes('不安') || question.includes('心配'))) return 'reassuring';
    
    return 'balanced';
  }

  /**
   * 動的メッセージを構築
   */
  private buildDynamicMessage(
    baseMessage: string,
    seed: number,
    style: string,
    userInput: DivinationInput,
    environmentData?: EnvironmentData
  ): string {
    
    // テンプレート要素を選択
    const timeExpr = this.selectByHash(this.templates.timeExpressions, seed);
    const natureMetaphor = this.selectByHash(this.templates.natureMetaphors, seed + 1);
    const processWord = this.selectByHash(this.templates.processWords, seed + 2);
    const resultWord = this.selectByHash(this.templates.resultWords, seed + 3);
    const emotionalModifier = this.selectByHash(this.templates.emotionalModifiers, seed + 4);
    const temporalExpr = this.selectByHash(this.templates.temporalExpressions, seed + 5);
    
    // 季節的要素
    const season = this.getCurrentSeason();
    const seasonalExpr = this.selectByHash(this.seasonalInfluences[season], seed + 6);
    
    // 月相的要素
    let moonPhase: keyof typeof this.moonPhaseExpressions = 'new';
    if (environmentData?.lunar?.phase !== undefined) {
      const phase = environmentData.lunar.phase;
      if (phase < 0.25) moonPhase = 'new';
      else if (phase < 0.5) moonPhase = 'waxing';
      else if (phase < 0.75) moonPhase = 'full';
      else moonPhase = 'waning';
    }
    const moonExpr = this.selectByHash(this.moonPhaseExpressions[moonPhase], seed + 7);
    
    // スタイルに基づいて組み合わせパターンを決定
    const patterns = this.getStylePatterns(style);
    const selectedPattern = this.selectByHash(patterns, seed + 8);
    
    // パターンに基づいてメッセージを構築
    const result = this.applyPattern(
      selectedPattern,
      baseMessage,
      {
        timeExpr,
        natureMetaphor,
        processWord,
        resultWord,
        emotionalModifier,
        temporalExpr,
        seasonalExpr,
        moonExpr,
        userName: userInput.fullName.split(' ')[0] || userInput.fullName // 姓または名前全体
      }
    );
    
    return result;
  }

  /**
   * スタイル別のパターンを取得
   */
  private getStylePatterns(style: string): string[] {
    const patterns = {
      romantic: [
        "{moonExpr}、{emotionalModifier}{baseMessage}",
        "{userName}さん、{seasonalExpr}{processWord}{baseMessage}",
        "愛に満ちた{timeExpr}、{baseMessage}",
        "{natureMetaphor}愛が{emotionalModifier}{resultWord}",
        "恋の{seasonalExpr}、{processWord}{baseMessage}",
        "{temporalExpr}、運命の人との出会いが{resultWord}",
        "心と心が{natureMetaphor}結ばれ、{baseMessage}",
        "{timeExpr}愛の花が{processWord}{resultWord}"
      ],
      professional: [
        "{timeExpr}、{processWord}{baseMessage}",
        "キャリアの道筋として、{natureMetaphor}{baseMessage}",
        "{temporalExpr}、確実に{baseMessage}",
        "仕事運は{seasonalExpr}{processWord}向上します",
        "{natureMetaphor}成功への道が{resultWord}",
        "プロフェッショナルとして{emotionalModifier}{baseMessage}",
        "{moonExpr}、キャリアの転機が{resultWord}",
        "努力が{timeExpr}{processWord}実を結びます"
      ],
      gentle: [
        "{seasonalExpr}、{emotionalModifier}{baseMessage}",
        "心穏やかに、{processWord}{baseMessage}",
        "{moonExpr}、優しく{baseMessage}",
        "{natureMetaphor}癒しのエネルギーが{resultWord}",
        "安らぎが{timeExpr}{processWord}訪れます",
        "{temporalExpr}、心身の調和が{resultWord}",
        "健やかな毎日が{seasonalExpr}{baseMessage}",
        "内なる平和が{natureMetaphor}{resultWord}"
      ],
      prosperous: [
        "{natureMetaphor}、{processWord}富が{resultWord}",
        "豊かさは{timeExpr}{baseMessage}",
        "{temporalExpr}、{emotionalModifier}繁栄が{resultWord}",
        "金運は{seasonalExpr}{processWord}上昇します",
        "富の流れが{natureMetaphor}{resultWord}",
        "{moonExpr}、財運の扉が{resultWord}",
        "豊穣の{timeExpr}、{processWord}{baseMessage}",
        "経済的成功が{emotionalModifier}{resultWord}"
      ],
      reassuring: [
        "ご安心ください。{seasonalExpr}{baseMessage}",
        "{userName}さんの未来は、{natureMetaphor}{processWord}輝きます",
        "{moonExpr}、すべては良い方向に{resultWord}",
        "不安は{timeExpr}解消され、{baseMessage}",
        "希望の光が{natureMetaphor}{resultWord}",
        "{temporalExpr}、明るい展開が{resultWord}",
        "宇宙はあなたを{emotionalModifier}見守っています",
        "困難は{seasonalExpr}乗り越えられます"
      ],
      balanced: [
        "{timeExpr}、{natureMetaphor}{processWord}{baseMessage}",
        "{seasonalExpr}{emotionalModifier}{baseMessage}",
        "{temporalExpr}、{processWord}{baseMessage}",
        "{moonExpr}、バランスよく{baseMessage}",
        "調和の中で{natureMetaphor}{resultWord}",
        "{userName}さんにとって、{processWord}道が{resultWord}",
        "全体運は{timeExpr}{processWord}向上します",
        "人生の流れが{seasonalExpr}{baseMessage}"
      ]
    };
    
    return patterns[style as keyof typeof patterns] || patterns.balanced;
  }

  /**
   * パターンに変数を適用
   */
  private applyPattern(pattern: string, baseMessage: string, variables: Record<string, string>): string {
    let result = pattern.replace('{baseMessage}', baseMessage);
    
    Object.entries(variables).forEach(([key, value]) => {
      result = result.replace(new RegExp(`{${key}}`, 'g'), value);
    });
    
    return result;
  }

  /**
   * ハッシュ値に基づいて配列から要素を選択
   */
  private selectByHash<T>(array: T[], hash: number): T {
    return array[Math.abs(hash) % array.length];
  }

  /**
   * 現在の季節を取得
   */
  private getCurrentSeason(): keyof typeof this.seasonalInfluences {
    const month = new Date().getMonth() + 1;
    if (month >= 3 && month <= 5) return 'spring';
    if (month >= 6 && month <= 8) return 'summer';
    if (month >= 9 && month <= 11) return 'autumn';
    return 'winter';
  }
}

// グローバルインスタンス
export const dynamicMessageGenerator = new DynamicMessageGenerator();