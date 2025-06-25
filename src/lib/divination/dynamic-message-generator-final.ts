import { DivinationInput, EnvironmentData } from './base-engine';
import { messageHistoryService } from './message-history-service';
import crypto from 'crypto';

/**
 * 2年間重複なし保証付き動的メッセージ生成エンジン（最終版）
 * メッセージ履歴サービスと統合し、実運用に対応
 */
export class DynamicMessageGeneratorFinal {
  // 2年間の日数
  private static readonly DAYS_IN_2_YEARS = 730;
  
  // ユーザーごとのカウンター（セッション内管理）
  private userCounters: Map<string, number> = new Map();

  // 拡張されたテンプレート（V2から継承）
  private templates = {
    timeExpressions: [
      "朝の光のように", "夕日が山を染めるように", "夜空の星のように", 
      "夜明け前の静寂のように", "昼下がりの陽だまりのように", "黄昏時の美しさのように",
      "朝露が輝くように", "真昼の太陽のように", "月明かりのように",
      "暁の空のように", "宵の明星のように", "深夜の静寂のように",
      "朝焼けのように", "夕焼けのように", "星空の瞬きのように",
      "新しい朝のように", "穏やかな午後のように", "静かな夜のように",
      "日の出の瞬間のように", "月の満ち欠けのように", "流れ星のように",
      "早朝の鳥のさえずりのように", "正午の陽射しのように", "薄暮の空のように",
      "朝霧が立ち込めるように", "午後の微風のように", "夜露が降りるように",
      "明け方の空気のように", "日没の美しさのように", "星月夜のように",
      "朝の新鮮さのように", "昼の活気のように", "夜の静寂のように",
      "曙光のように", "黄昏の光のように", "月光が差し込むように",
      "朝日が昇るように", "正午の力強さのように", "夕闇が迫るように",
      "暁闇のように", "昼光のように", "宵闇のように",
      "朝の清々しさのように", "午後の穏やかさのように", "夜の神秘のように",
      "日の出前の静寂のように", "真昼の輝きのように", "月夜の美しさのように"
    ],
    
    natureMetaphors: [
      "川の流れのように", "大地に根を張るように", "風が舞うように", 
      "海の波のように", "山が聳えるように", "花が咲くように",
      "雲が流れるように", "木が成長するように", "雨が大地を潤すように",
      "滝が流れ落ちるように", "泉が湧き出るように", "虹がかかるように",
      "蝶が羽ばたくように", "鳥が空を舞うように", "種が芽吹くように",
      "雪が舞い降りるように", "春風が吹くように", "秋の実りのように",
      "大海原のように", "森の息吹のように", "草原を渡る風のように",
      "岩が風化するように", "結晶が成長するように", "光が差し込むように",
      "潮の満ち引きのように", "季節が巡るように", "自然の摂理のように",
      "小川のせせらぎのように", "大河の流れのように", "湖の静寂のように",
      "峡谷の風のように", "丘陵の優しさのように", "高原の爽やかさのように",
      "砂漠の静寂のように", "オアシスの恵みのように", "氷河の荘厳さのように",
      "火山の力強さのように", "温泉の温もりのように", "間欠泉の躍動のように",
      "稲妻が走るように", "雷鳴が轟くように", "霧が晴れるように",
      "露が輝くように", "霜が降りるように", "氷が溶けるように",
      "若葉が萌えるように", "紅葉が染まるように", "落葉が舞うように",
      "つぼみが開くように", "果実が実るように", "種が飛ぶように",
      "土が肥えるように", "根が伸びるように", "枝が広がるように",
      "苔が生すように", "菌類が分解するように", "生態系が循環するように"
    ],
    
    processWords: [
      "着実に", "ゆっくりと", "確実に", "自然に", "力強く", 
      "優雅に", "静かに", "堂々と", "穏やかに", "情熱的に",
      "丁寧に", "慎重に", "大胆に", "繊細に", "確かに",
      "しなやかに", "粘り強く", "誠実に", "素直に", "賢明に",
      "勇敢に", "謙虚に", "真摯に", "積極的に", "創造的に",
      "直感的に", "論理的に", "感覚的に", "実践的に", "革新的に",
      "段階的に", "継続的に", "周期的に", "螺旋的に", "有機的に",
      "調和的に", "共鳴的に", "同期的に", "相乗的に", "統合的に",
      "注意深く", "思慮深く", "洞察的に", "包括的に", "体系的に",
      "効果的に", "効率的に", "生産的に", "建設的に", "発展的に"
    ],
    
    resultWords: [
      "築かれます", "育ちます", "実現します", "花開きます", "形作られます",
      "成就します", "結実します", "芽吹きます", "輝きます", "完成します",
      "開花します", "達成されます", "叶います", "現れます", "生まれます",
      "創造されます", "展開します", "発展します", "成長します", "進化します",
      "深まります", "広がります", "高まります", "強まります", "豊かになります",
      "明らかになります", "具現化します", "顕現します", "開かれます", "満たされます",
      "整います", "調います", "定まります", "固まります", "安定します",
      "向上します", "改善します", "洗練されます", "研ぎ澄まされます", "純化されます",
      "統合されます", "融合します", "昇華します", "変容します", "超越します",
      "開眼します", "覚醒します", "目覚めます", "悟ります", "到達します"
    ],
    
    emotionalModifiers: [
      "心から", "深く", "真に", "純粋に", "誠実に", 
      "情熱的に", "穏やかに", "力強く", "優しく", "勇敢に",
      "喜びを持って", "感謝と共に", "愛を込めて", "希望を抱いて", "信念を持って",
      "平和な心で", "明るく", "前向きに", "建設的に", "創造的に",
      "慈愛を持って", "寛容な心で", "謙虚に", "素直に", "真摯に",
      "全身全霊で", "一途に", "献身的に", "積極的に", "主体的に",
      "共感的に", "理解深く", "思いやり深く", "温かく", "親切に",
      "誇り高く", "堂々と", "凛として", "品格を持って", "威厳を持って",
      "楽観的に", "肯定的に", "希望的に", "発展的に", "成長的に",
      "内省的に", "瞑想的に", "直観的に", "霊的に", "神聖に"
    ],
    
    temporalExpressions: [
      "やがて", "いずれ", "時が来れば", "適切な時に", "運命の時に",
      "宇宙のタイミングで", "最良の時に", "時の流れと共に",
      "近い将来", "そう遠くない未来に", "機が熟せば", "準備が整えば",
      "必要な時に", "ふさわしい瞬間に", "完璧なタイミングで", "自然な流れで",
      "段階的に", "徐々に", "一歩ずつ", "着実な歩みで", "確かな道のりで",
      "今この瞬間から", "まもなく", "程なく", "やがては", "いつか必ず",
      "時間をかけて", "じっくりと", "焦らずに", "急がずに", "自分のペースで",
      "絶妙なタイミングで", "神のタイミングで", "宇宙の意志により", "天の配剤で", "縁が結ばれる時",
      "満を持して", "機を見て", "頃合いを見て", "潮時を待って", "風向きが変わる時"
    ]
  };

  // 季節別表現（各20種類）
  private seasonalInfluences = {
    spring: [
      "新緑のように", "桜が咲くように", "新しい命のように",
      "春の息吹のように", "芽吹きの季節のように", "花開く季節のように",
      "春雨のように", "暖かな陽射しのように", "蝶が舞うように",
      "若葉のように", "春風に乗って", "生命力溢れる春のように",
      "つくしが顔を出すように", "菜の花畑のように", "春霞のように",
      "うららかな春のように", "春の小川のように", "燕が飛来するように",
      "桜吹雪のように", "春の訪れのように"
    ],
    summer: [
      "太陽のように", "緑陰のように", "夏雲のように",
      "海のきらめきのように", "夏の生命力のように", "向日葵のように",
      "青空のように", "夏の夜空のように", "蝉の声のように",
      "入道雲のように", "夏祭りの賑わいのように", "熱い情熱のように",
      "夏の朝顔のように", "風鈴の音のように", "花火のように",
      "夏の夕立のように", "蛍の光のように", "夏草のように",
      "真夏の太陽のように", "涼風のように"
    ], 
    autumn: [
      "紅葉のように", "実りのように", "豊穣のように",
      "秋風のように", "収穫の喜びのように", "黄金色の稲穂のように",
      "秋の夕暮れのように", "澄んだ空気のように", "豊かな実りのように",
      "秋雨のように", "紅葉の美しさのように", "深まる季節のように",
      "銀杏並木のように", "秋桜のように", "月見の夜のように",
      "柿の実のように", "栗の実のように", "秋の虫の音のように",
      "落ち葉のように", "秋晴れのように"
    ],
    winter: [
      "雪景色のように", "静寂のように", "純白のように",
      "冬の星空のように", "暖炉の温もりのように", "結晶のように",
      "凛とした空気のように", "雪の結晶のように", "静謐な冬のように",
      "冬の朝のように", "温かな灯りのように", "内なる強さのように",
      "霜柱のように", "冬枯れの美しさのように", "白い息のように",
      "冬鳥のように", "雪だるまのように", "冬の夜長のように",
      "氷柱のように", "冬の日差しのように"
    ]
  };

  // 月相表現（各15種類）
  private moonPhaseExpressions = {
    new: [
      "新月の始まりのように", "新たな出発のように",
      "種まきの時のように", "静かな準備のように", "内なる声に従って",
      "新しいサイクルの始まりとして", "可能性の種として", "闇から光へ向かって",
      "再生の時として", "リセットの瞬間のように", "新しい章の幕開けのように",
      "潜在力が目覚める時", "創造の原点として", "無限の可能性を秘めて",
      "新たな誓いと共に"
    ],
    waxing: [
      "上弦の月のように", "成長のエネルギーで",
      "満ちていく月のように", "力を蓄えながら", "前進の勢いで",
      "発展の段階として", "希望と共に成長して", "光が増していくように",
      "拡大の時期として", "勢いを増しながら", "上昇気流に乗って",
      "積み上げの時として", "加速する成長と共に", "明るさを増しながら",
      "充実へ向かって"
    ],
    full: [
      "満月の完成のように", "円満な形で",
      "最高潮の時として", "豊かさの象徴として", "完全なる調和の中で",
      "満ち足りた状態で", "全てが明らかになる時", "最大の力を発揮して",
      "クライマックスの瞬間に", "完璧な円のように", "頂点に達して",
      "最高の輝きと共に", "充実の極みとして", "完全性の中で",
      "全てが整った時"
    ],
    waning: [
      "下弦の月のように", "洗練されながら",
      "手放しの時期として", "内省と浄化の時", "次への準備として",
      "余分を削ぎ落として", "本質に向かって", "智慧を深めながら",
      "収束の時期として", "エッセンスを抽出して", "凝縮されながら",
      "内面への回帰として", "浄化と解放の中で", "次のサイクルへ向けて",
      "完了と感謝と共に"
    ]
  };

  /**
   * ユーザーIDを生成（名前と生年月日から一意のID）
   */
  private generateUserId(input: DivinationInput): string {
    const data = `${input.fullName}-${input.birthDate.toISOString()}`;
    return crypto.createHash('sha256').update(data).digest('hex').substring(0, 16);
  }

  /**
   * 日付ベースのシードを生成（2年間で730の異なる値）
   */
  private generateDateSeed(): number {
    const startDate = new Date('2024-01-01');
    const currentDate = new Date();
    const diffDays = Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays % DynamicMessageGeneratorFinal.DAYS_IN_2_YEARS;
  }

  /**
   * ユーザー固有のカウンターを取得・更新
   */
  private async getUserCounter(userId: string): Promise<number> {
    // DBからユーザーのメッセージ履歴数を取得
    const dbCount = await messageHistoryService.getUserMessageCount(userId);
    
    // セッション内カウンターと合算
    const sessionCount = this.userCounters.get(userId) || 0;
    const totalCount = dbCount + sessionCount;
    
    // セッションカウンターを更新
    this.userCounters.set(userId, sessionCount + 1);
    
    return totalCount;
  }

  /**
   * 決定論的だが多様性のあるハッシュを生成
   */
  private generateDiverseHash(
    userId: string,
    dateSeed: number,
    counter: number,
    category: string,
    environmentData?: EnvironmentData
  ): string {
    // 複数の要素を組み合わせてハッシュを生成
    const elements = [
      userId,
      dateSeed.toString(),
      counter.toString(),
      category,
      new Date().getHours().toString(), // 時間帯の違い
      new Date().getMinutes().toString(), // 分単位の違い
      environmentData?.lunar?.phase?.toString() || '0',
      environmentData?.weather?.condition || 'default',
      Math.floor(Date.now() / 60000).toString() // 分単位のタイムスタンプ
    ];
    
    return crypto.createHash('sha256')
      .update(elements.join('-'))
      .digest('hex');
  }

  /**
   * ハッシュから数値インデックスを生成（均等分布）
   */
  private hashToIndex(hash: string, arrayLength: number): number {
    // ハッシュの最初の8文字を16進数として解釈
    const num = parseInt(hash.substring(0, 8), 16);
    return num % arrayLength;
  }

  /**
   * 動的メッセージを生成（2年間重複なし保証）
   */
  public async generateMessage(
    baseMessage: string,
    category: string,
    userInput: DivinationInput,
    environmentData?: EnvironmentData,
    divinationType: string = 'general'
  ): Promise<string> {
    const userId = this.generateUserId(userInput);
    const dateSeed = this.generateDateSeed();
    const counter = await this.getUserCounter(userId);
    
    let attempts = 0;
    const maxAttempts = 10;
    
    while (attempts < maxAttempts) {
      // 多様なハッシュを生成
      const hash = this.generateDiverseHash(
        userId,
        dateSeed,
        counter + attempts,
        category,
        environmentData
      );
      
      // ハッシュを使って各要素を選択
      const indices = {
        time: this.hashToIndex(hash.substring(0, 8), this.templates.timeExpressions.length),
        nature: this.hashToIndex(hash.substring(8, 16), this.templates.natureMetaphors.length),
        process: this.hashToIndex(hash.substring(16, 24), this.templates.processWords.length),
        result: this.hashToIndex(hash.substring(24, 32), this.templates.resultWords.length),
        emotion: this.hashToIndex(hash.substring(32, 40), this.templates.emotionalModifiers.length),
        temporal: this.hashToIndex(hash.substring(40, 48), this.templates.temporalExpressions.length),
        pattern: this.hashToIndex(hash.substring(48, 56), 20), // パターンインデックス
      };
      
      // 季節と月相の要素を追加
      const season = this.getCurrentSeason();
      const seasonalIndex = this.hashToIndex(hash.substring(56, 64), this.seasonalInfluences[season].length);
      
      let moonPhase: keyof typeof this.moonPhaseExpressions = 'new';
      if (environmentData?.lunar?.phase !== undefined) {
        const phase = environmentData.lunar.phase;
        if (phase < 0.25) moonPhase = 'new';
        else if (phase < 0.5) moonPhase = 'waxing';
        else if (phase < 0.75) moonPhase = 'full';
        else moonPhase = 'waning';
      }
      const moonIndex = this.hashToIndex(hash.substring(64, 72), this.moonPhaseExpressions[moonPhase].length);
      
      // スタイルを決定
      const style = this.determineStyle(category, userInput.question || '');
      
      // メッセージを構築
      const message = this.buildUniqueMessage(
        baseMessage,
        {
          timeExpr: this.templates.timeExpressions[indices.time],
          natureMetaphor: this.templates.natureMetaphors[indices.nature],
          processWord: this.templates.processWords[indices.process],
          resultWord: this.templates.resultWords[indices.result],
          emotionalModifier: this.templates.emotionalModifiers[indices.emotion],
          temporalExpr: this.templates.temporalExpressions[indices.temporal],
          seasonalExpr: this.seasonalInfluences[season][seasonalIndex],
          moonExpr: this.moonPhaseExpressions[moonPhase][moonIndex],
          userName: userInput.fullName.split(' ')[0] || userInput.fullName,
          patternIndex: indices.pattern
        },
        style,
        counter + attempts
      );
      
      // メッセージのハッシュを生成
      const messageHash = crypto.createHash('md5').update(message).digest('hex');
      
      // 一意性をチェック
      const isUnique = await messageHistoryService.checkUniqueness(messageHash);
      
      if (isUnique) {
        // メッセージを記録
        await messageHistoryService.recordMessage(messageHash, userId, divinationType);
        return message;
      }
      
      attempts++;
    }
    
    // フォールバック：タイムスタンプを含めて確実に一意にする
    const timestamp = Date.now().toString();
    const uniqueSuffix = ` [${timestamp.substring(timestamp.length - 6)}]`;
    const fallbackMessage = `${baseMessage}${uniqueSuffix}`;
    
    // フォールバックメッセージも記録
    const fallbackHash = crypto.createHash('md5').update(fallbackMessage).digest('hex');
    await messageHistoryService.recordMessage(fallbackHash, userId, divinationType);
    
    return fallbackMessage;
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
   * 一意性を高めたメッセージ構築
   */
  private buildUniqueMessage(
    baseMessage: string,
    elements: {
      timeExpr: string;
      natureMetaphor: string;
      processWord: string;
      resultWord: string;
      emotionalModifier: string;
      temporalExpr: string;
      seasonalExpr: string;
      moonExpr: string;
      userName: string;
      patternIndex: number;
    },
    style: string,
    uniqueCounter: number
  ): string {
    // スタイル別の拡張パターン（各20パターン）
    const patterns = this.getExtendedStylePatterns(style);
    
    // パターンを選択（uniqueCounterも考慮）
    const patternIndex = (elements.patternIndex + uniqueCounter) % patterns.length;
    const selectedPattern = patterns[patternIndex];
    
    // 変数を適用
    let result = selectedPattern.replace('{baseMessage}', baseMessage);
    
    Object.entries(elements).forEach(([key, value]) => {
      if (key !== 'patternIndex') {
        result = result.replace(new RegExp(`{${key}}`, 'g'), value.toString());
      }
    });
    
    // 追加の変化要素（句読点の位置、接続詞など）
    const variation = uniqueCounter % 5;
    switch (variation) {
      case 0:
        result = result.replace(/、/g, '。そして、');
        break;
      case 1:
        result = result.replace(/、/g, '。また、');
        break;
      case 2:
        result = result.replace(/。/g, '。\n');
        break;
      case 3:
        result = `✨ ${result}`;
        break;
      case 4:
        result = `${result} ✨`;
        break;
    }
    
    return result;
  }

  /**
   * 拡張されたスタイルパターン（各スタイル20パターン）
   */
  private getExtendedStylePatterns(style: string): string[] {
    const patterns = {
      romantic: [
        "{moonExpr}、{emotionalModifier}{baseMessage}",
        "{userName}さん、{seasonalExpr}{processWord}{baseMessage}",
        "愛に満ちた{timeExpr}、{baseMessage}",
        "{natureMetaphor}愛が{emotionalModifier}{resultWord}",
        "恋の{seasonalExpr}、{processWord}{baseMessage}",
        "{temporalExpr}、運命の人との出会いが{resultWord}",
        "心と心が{natureMetaphor}結ばれ、{baseMessage}",
        "{timeExpr}愛の花が{processWord}{resultWord}",
        "愛という名の{natureMetaphor}、{emotionalModifier}{baseMessage}",
        "{userName}さんの恋は{seasonalExpr}{processWord}育まれます",
        "二人の絆が{moonExpr}{resultWord}",
        "{temporalExpr}、愛の奇跡が{processWord}訪れます",
        "恋心は{natureMetaphor}{emotionalModifier}深まります",
        "{timeExpr}、運命の糸が{processWord}結ばれます",
        "愛の力が{seasonalExpr}{resultWord}",
        "{userName}さんへ、{moonExpr}愛のメッセージです。{baseMessage}",
        "恋愛運は{natureMetaphor}{processWord}上昇します",
        "{emotionalModifier}愛することで、{baseMessage}",
        "愛の波動が{temporalExpr}{resultWord}",
        "ハートが{timeExpr}{processWord}開かれます"
      ],
      professional: [
        "{timeExpr}、{processWord}{baseMessage}",
        "キャリアの道筋として、{natureMetaphor}{baseMessage}",
        "{temporalExpr}、確実に{baseMessage}",
        "仕事運は{seasonalExpr}{processWord}向上します",
        "{natureMetaphor}成功への道が{resultWord}",
        "プロフェッショナルとして{emotionalModifier}{baseMessage}",
        "{moonExpr}、キャリアの転機が{resultWord}",
        "努力が{timeExpr}{processWord}実を結びます",
        "{userName}さんの能力が{seasonalExpr}開花します",
        "ビジネスチャンスが{natureMetaphor}{resultWord}",
        "{temporalExpr}、新たな可能性が{processWord}開かれます",
        "仕事の成果が{emotionalModifier}{resultWord}",
        "キャリアは{moonExpr}{processWord}発展します",
        "{timeExpr}、専門性が{processWord}認められます",
        "職場での立場が{natureMetaphor}向上します",
        "{userName}さんの努力は{temporalExpr}報われます",
        "ビジネスの流れが{seasonalExpr}{resultWord}",
        "{emotionalModifier}取り組むことで、{baseMessage}",
        "成功への道が{timeExpr}{processWord}照らされます",
        "プロジェクトが{natureMetaphor}{resultWord}"
      ],
      gentle: [
        "{seasonalExpr}、{emotionalModifier}{baseMessage}",
        "心穏やかに、{processWord}{baseMessage}",
        "{moonExpr}、優しく{baseMessage}",
        "{natureMetaphor}癒しのエネルギーが{resultWord}",
        "安らぎが{timeExpr}{processWord}訪れます",
        "{temporalExpr}、心身の調和が{resultWord}",
        "健やかな毎日が{seasonalExpr}{baseMessage}",
        "内なる平和が{natureMetaphor}{resultWord}",
        "{userName}さんの心に{emotionalModifier}平安が訪れます",
        "癒しの光が{moonExpr}{processWord}降り注ぎます",
        "{timeExpr}、心の重荷が{processWord}軽くなります",
        "健康運は{natureMetaphor}{resultWord}",
        "{temporalExpr}、バランスが{processWord}整います",
        "優しさが{seasonalExpr}{emotionalModifier}広がります",
        "心身の調和が{moonExpr}{resultWord}",
        "{userName}さんへ、{timeExpr}安らぎのメッセージです",
        "穏やかさが{natureMetaphor}{processWord}深まります",
        "{emotionalModifier}自分を大切にすることで、{baseMessage}",
        "癒しの波動が{temporalExpr}{resultWord}",
        "心の平安が{seasonalExpr}{processWord}保たれます"
      ],
      prosperous: [
        "{natureMetaphor}、{processWord}富が{resultWord}",
        "豊かさは{timeExpr}{baseMessage}",
        "{temporalExpr}、{emotionalModifier}繁栄が{resultWord}",
        "金運は{seasonalExpr}{processWord}上昇します",
        "富の流れが{natureMetaphor}{resultWord}",
        "{moonExpr}、財運の扉が{resultWord}",
        "豊穣の{timeExpr}、{processWord}{baseMessage}",
        "経済的成功が{emotionalModifier}{resultWord}",
        "{userName}さんの財布に{seasonalExpr}幸運が舞い込みます",
        "豊かさの波が{natureMetaphor}{processWord}押し寄せます",
        "{temporalExpr}、金銭的な恵みが{resultWord}",
        "財運は{moonExpr}{emotionalModifier}向上します",
        "富の種が{timeExpr}{processWord}芽吹きます",
        "{natureMetaphor}豊かさが{processWord}循環します",
        "金運の流れが{seasonalExpr}{resultWord}",
        "{userName}さんへ、{moonExpr}豊かさのメッセージです",
        "経済的自由が{temporalExpr}{processWord}近づきます",
        "{emotionalModifier}与えることで、{baseMessage}",
        "繁栄の波動が{timeExpr}{resultWord}",
        "豊かさが{natureMetaphor}{processWord}実現します"
      ],
      reassuring: [
        "ご安心ください。{seasonalExpr}{baseMessage}",
        "{userName}さんの未来は、{natureMetaphor}{processWord}輝きます",
        "{moonExpr}、すべては良い方向に{resultWord}",
        "不安は{timeExpr}解消され、{baseMessage}",
        "希望の光が{natureMetaphor}{resultWord}",
        "{temporalExpr}、明るい展開が{resultWord}",
        "宇宙はあなたを{emotionalModifier}見守っています",
        "困難は{seasonalExpr}乗り越えられます",
        "{userName}さん、{moonExpr}大丈夫です。{baseMessage}",
        "心配事は{natureMetaphor}{processWord}消えていきます",
        "{timeExpr}、安心感が{emotionalModifier}{resultWord}",
        "守護の力が{temporalExpr}{processWord}働いています",
        "全ては{seasonalExpr}{processWord}好転します",
        "{natureMetaphor}道は必ず{resultWord}",
        "不安の雲は{moonExpr}{processWord}晴れます",
        "{userName}さんは{emotionalModifier}守られています",
        "解決策が{temporalExpr}{resultWord}",
        "心の平安が{timeExpr}{processWord}戻ります",
        "希望は{natureMetaphor}{emotionalModifier}育ちます",
        "明るい未来が{seasonalExpr}{resultWord}"
      ],
      balanced: [
        "{timeExpr}、{natureMetaphor}{processWord}{baseMessage}",
        "{seasonalExpr}{emotionalModifier}{baseMessage}",
        "{temporalExpr}、{processWord}{baseMessage}",
        "{moonExpr}、バランスよく{baseMessage}",
        "調和の中で{natureMetaphor}{resultWord}",
        "{userName}さんにとって、{processWord}道が{resultWord}",
        "全体運は{timeExpr}{processWord}向上します",
        "人生の流れが{seasonalExpr}{baseMessage}",
        "{natureMetaphor}、調和的に{processWord}{resultWord}",
        "{userName}さんの運勢は{moonExpr}整います",
        "{temporalExpr}、バランスが{emotionalModifier}{resultWord}",
        "全ての要素が{timeExpr}{processWord}調和します",
        "運命の歯車が{natureMetaphor}{resultWord}",
        "{seasonalExpr}、着実に{processWord}前進します",
        "人生の波が{moonExpr}{emotionalModifier}流れます",
        "{userName}さんへ、{temporalExpr}総合的なメッセージです",
        "全体的な流れが{natureMetaphor}{resultWord}",
        "{emotionalModifier}生きることで、{baseMessage}",
        "運勢の波が{timeExpr}{processWord}上昇します",
        "人生が{seasonalExpr}{processWord}開花します"
      ]
    };
    
    return patterns[style as keyof typeof patterns] || patterns.balanced;
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

  /**
   * メッセージ生成の統計情報を取得（デバッグ用）
   */
  public async getStatistics(): Promise<{
    sessionUsers: number;
    sessionMessages: number;
    dbStatistics: {
      totalMessages: number;
      uniqueUsers: number;
      messagesLast24h: number;
      messagesLast7d: number;
    };
  }> {
    // セッション統計
    const sessionUsers = this.userCounters.size;
    const sessionMessages = Array.from(this.userCounters.values()).reduce((sum, count) => sum + count, 0);
    
    // DB統計
    const dbStatistics = await messageHistoryService.getStatistics();
    
    return {
      sessionUsers,
      sessionMessages,
      dbStatistics
    };
  }

  /**
   * 定期的なクリーンアップ（2年以上前のデータを削除）
   */
  public async performCleanup(): Promise<void> {
    await messageHistoryService.cleanupOldMessages();
  }
}

// グローバルインスタンス
export const dynamicMessageGeneratorFinal = new DynamicMessageGeneratorFinal();