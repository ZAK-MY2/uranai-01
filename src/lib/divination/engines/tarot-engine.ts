import { BaseDivinationEngine, DivinationInput, EnvironmentData } from '../base-engine';

export interface TarotCard {
  name: string;
  arcana: 'major' | 'minor';
  number: number;
  image: string;
  keywords: string[];
  interpretation: string;
  description?: string;
}

export interface TarotSpreadPosition {
  position: string;
  card: TarotCard;
  meaning: string;
}

export interface TarotReading {
  spread: {
    name: string;
    type: 'one-card' | 'three-card' | 'celtic-cross' | 'relationship' | 'decision';
    description: string;
  };
  positions: TarotSpreadPosition[];
  overallMessage: string;
  interpretation: {
    summary: string;
    details: string[];
    synthesis: string;
  };
  moonPhaseInfluence?: string;
  personalizedGuidance?: string;
  interactiveElements?: {
    selectedByUser: boolean;
    selectionMethod: 'random' | 'intuitive' | 'guided';
    timestamp: Date;
  };
}

export type SpreadType = 'one-card' | 'three-card' | 'celtic-cross' | 'relationship' | 'decision';

export interface TarotEngineOptions {
  spreadType?: SpreadType;
  allowUserSelection?: boolean;
  selectedCardIndices?: number[];
}

export class TarotEngine extends BaseDivinationEngine<TarotReading> {
  private deck: TarotCard[];
  private options: TarotEngineOptions;
  private spreads = {
    'one-card': {
      name: '一枚引き（今日のカード）',
      description: '今日一日や現在の状況に対する簡潔なメッセージ',
      positions: ['現在の状況']
    },
    'three-card': {
      name: '三枚引き（時系列）',
      description: '過去・現在・未来の流れを読み解く基本的な展開',
      positions: ['過去', '現在', '未来']
    },
    'celtic-cross': {
      name: 'ケルト十字展開',
      description: '最も詳細で包括的な10枚のカード展開',
      positions: [
        '現在の状況',
        '直面する課題',
        '遠い過去/根本原因',
        '近い過去',
        '可能な未来',
        '近い未来',
        'あなたの立場',
        '外部からの影響',
        '希望と恐れ',
        '最終結果'
      ]
    },
    'relationship': {
      name: '関係性スプレッド',
      description: '二人の関係性を詳しく読み解く7枚展開',
      positions: [
        'あなたの気持ち',
        '相手の気持ち',
        '関係の現状',
        '課題',
        '外部要因',
        'アドバイス',
        '関係の未来'
      ]
    },
    'decision': {
      name: '決断のスプレッド',
      description: '重要な決断を下す際の5枚展開',
      positions: [
        '現在の状況',
        '選択肢A',
        '選択肢B',
        '見落としている要素',
        '最善の道'
      ]
    }
  };

  constructor(input: DivinationInput, environment?: EnvironmentData, options?: TarotEngineOptions) {
    super(input, environment);
    this.deck = this.initializeDeck();
    this.options = options || { spreadType: 'three-card', allowUserSelection: false };
  }

  calculate(): TarotReading {
    // シードの生成（再現性のため）
    const seed = this.generateSeed();
    
    // 選択されたスプレッドタイプを取得
    const spreadType = this.options.spreadType || 'three-card';
    const spread = this.spreads[spreadType];
    
    // カードを引く
    const drawnCards = this.drawCards(seed, spread.positions.length);
    
    // スプレッドポジションを作成
    const positions: TarotSpreadPosition[] = spread.positions.map((position, index) => ({
      position,
      card: drawnCards[index],
      meaning: this.getPositionMeaning(position, drawnCards[index], spreadType)
    }));
    
    // 解釈を生成
    const interpretation = this.generateFullInterpretation(positions, spreadType);
    
    // 月相の影響
    const moonPhaseInfluence = this.getMoonPhaseInfluence();
    
    // パーソナライズされたガイダンス
    const personalizedGuidance = this.generatePersonalizedGuidance(positions, spreadType);
    
    // インタラクティブ要素の追加
    const interactiveElements = this.options.allowUserSelection ? {
      selectedByUser: true,
      selectionMethod: (this.options.selectedCardIndices ? 'intuitive' : 'random') as 'random' | 'intuitive' | 'guided',
      timestamp: new Date()
    } : undefined;

    return {
      spread: {
        name: spread.name,
        type: spreadType,
        description: spread.description
      },
      positions,
      overallMessage: this.generateOverallMessage(positions),
      interpretation,
      moonPhaseInfluence,
      personalizedGuidance,
      interactiveElements
    };
  }

  private initializeDeck(): TarotCard[] {
    // メジャーアルカナ（22枚）
    const majorArcana: TarotCard[] = [
      { name: '愚者', arcana: 'major', number: 0, image: 'fool', 
        keywords: ['新しい始まり', '冒険', '無邪気'], 
        interpretation: '新たな旅の始まり。恐れずに一歩を踏み出す時' },
      { name: '魔術師', arcana: 'major', number: 1, image: 'magician',
        keywords: ['意志の力', '創造', '実現'],
        interpretation: '全ての要素が揃った。今こそ行動の時' },
      { name: '女教皇', arcana: 'major', number: 2, image: 'priestess',
        keywords: ['直感', '内なる知恵', '秘密'],
        interpretation: '内なる声に耳を傾け、直感を信じる時' },
      { name: '女帝', arcana: 'major', number: 3, image: 'empress',
        keywords: ['豊穣', '母性', '創造性'],
        interpretation: '豊かさと愛に満ちた創造の時期' },
      { name: '皇帝', arcana: 'major', number: 4, image: 'emperor',
        keywords: ['権威', '安定', '統制'],
        interpretation: '秩序と規律をもって目標を達成する' },
      { name: '教皇', arcana: 'major', number: 5, image: 'hierophant',
        keywords: ['精神的指導', '伝統', '学び'],
        interpretation: '高次の学びと精神的成長の時' },
      { name: '恋人', arcana: 'major', number: 6, image: 'lovers',
        keywords: ['愛', '選択', '調和'],
        interpretation: '重要な選択。心の声に従う時' },
      { name: '戦車', arcana: 'major', number: 7, image: 'chariot',
        keywords: ['勝利', '意志力', '前進'],
        interpretation: '困難を乗り越えて勝利へ向かう' },
      { name: '力', arcana: 'major', number: 8, image: 'strength',
        keywords: ['内なる力', '勇気', '忍耐'],
        interpretation: '優しさと強さを兼ね備えた真の力' },
      { name: '隠者', arcana: 'major', number: 9, image: 'hermit',
        keywords: ['内省', '探求', '導き'],
        interpretation: '内なる光を見つける孤独な旅' },
      { name: '運命の輪', arcana: 'major', number: 10, image: 'wheel',
        keywords: ['変化', '運命', 'サイクル'],
        interpretation: '運命の転換点。変化を受け入れる' },
      { name: '正義', arcana: 'major', number: 11, image: 'justice',
        keywords: ['公正', 'バランス', '真実'],
        interpretation: '公正な判断と因果応報の時' },
      { name: '吊られた男', arcana: 'major', number: 12, image: 'hanged',
        keywords: ['犠牲', '視点の転換', '待機'],
        interpretation: '新しい視点から物事を見る必要性' },
      { name: '死神', arcana: 'major', number: 13, image: 'death',
        keywords: ['変容', '終わりと始まり', '再生'],
        interpretation: '古いものを手放し、新しい自分へ' },
      { name: '節制', arcana: 'major', number: 14, image: 'temperance',
        keywords: ['調和', 'バランス', '中庸'],
        interpretation: '極端を避け、中道を歩む' },
      { name: '悪魔', arcana: 'major', number: 15, image: 'devil',
        keywords: ['束縛', '欲望', '幻想'],
        interpretation: '自己の影と向き合い、解放される' },
      { name: '塔', arcana: 'major', number: 16, image: 'tower',
        keywords: ['崩壊', '啓示', '解放'],
        interpretation: '突然の変化。古い構造の崩壊' },
      { name: '星', arcana: 'major', number: 17, image: 'star',
        keywords: ['希望', 'インスピレーション', '癒し'],
        interpretation: '希望の光。導きと癒しの時' },
      { name: '月', arcana: 'major', number: 18, image: 'moon',
        keywords: ['幻想', '不安', '直感'],
        interpretation: '不確実性の中で直感を信じる' },
      { name: '太陽', arcana: 'major', number: 19, image: 'sun',
        keywords: ['成功', '喜び', '活力'],
        interpretation: '明るい未来と成功の約束' },
      { name: '審判', arcana: 'major', number: 20, image: 'judgement',
        keywords: ['再生', '覚醒', '解放'],
        interpretation: '過去からの解放と新たな始まり' },
      { name: '世界', arcana: 'major', number: 21, image: 'world',
        keywords: ['完成', '成就', '統合'],
        interpretation: 'サイクルの完成。全てが一つに' }
    ];

    return majorArcana;
  }

  private generateSeed(): number {
    const birthTime = this.input.birthDate.getTime();
    const nameValue = this.input.fullName.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const questionValue = this.input.question?.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) || 0;
    const currentTime = new Date().getTime();
    
    // 環境要因を加味
    const moonPhase = this.environment?.lunar.phase || 0.5;
    const environmentFactor = Math.floor(moonPhase * 1000);
    
    return (birthTime + nameValue + questionValue + currentTime + environmentFactor) % 1000000;
  }

  private shuffleDeck(seed: number): TarotCard[] {
    const deck = [...this.deck];
    let currentSeed = seed;
    
    // 線形合同法によるシャッフル
    for (let i = deck.length - 1; i > 0; i--) {
      currentSeed = (currentSeed * 1103515245 + 12345) % 2147483648;
      const j = Math.floor((currentSeed / 2147483648) * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    
    return deck;
  }

  private drawCards(seed: number, count: number): TarotCard[] {
    const shuffledDeck = this.shuffleDeck(seed);
    
    // ユーザーが選択したカードインデックスがある場合
    if (this.options.selectedCardIndices && this.options.selectedCardIndices.length >= count) {
      return this.options.selectedCardIndices.slice(0, count).map(index => 
        this.deck[index % this.deck.length]
      );
    }
    
    // ランダムに引く
    return shuffledDeck.slice(0, count);
  }

  private getPositionMeaning(position: string, card: TarotCard, spreadType: SpreadType): string {
    const positionMeanings: Record<string, Record<string, string>> = {
      '現在の状況': {
        'one-card': `今日のあなたに${card.name}が伝えるメッセージ`,
        'three-card': `現在のあなたの状況を${card.name}が表しています`,
        'celtic-cross': `今まさに直面している状況を${card.name}が象徴しています`,
        'relationship': `二人の関係の現状を${card.name}が示しています`,
        'decision': `決断を迫られている現状を${card.name}が表しています`
      },
      '過去': {
        'three-card': `過去の出来事や影響を${card.name}が物語っています`,
        'celtic-cross': `現状に至る過去の影響を${card.name}が示しています`
      },
      '未来': {
        'three-card': `これから起こりうる可能性を${card.name}が暗示しています`,
        'celtic-cross': `向かうべき未来の方向性を${card.name}が示しています`
      },
      '直面する課題': {
        'celtic-cross': `乗り越えるべき課題を${card.name}が明確にしています`
      },
      'あなたの気持ち': {
        'relationship': `あなたの本当の気持ちを${card.name}が映し出しています`
      },
      '相手の気持ち': {
        'relationship': `相手の心の内を${card.name}が代弁しています`
      },
      '選択肢A': {
        'decision': `第一の選択肢の結果を${card.name}が予示しています`
      },
      '選択肢B': {
        'decision': `第二の選択肢の結果を${card.name}が示唆しています`
      }
    };
    
    const defaultMeaning = `${position}における${card.name}の意味`;
    return positionMeanings[position]?.[spreadType] || defaultMeaning;
  }

  private generateFullInterpretation(positions: TarotSpreadPosition[], spreadType: SpreadType): TarotReading['interpretation'] {
    const summary = this.generateSummary(positions, spreadType);
    const details = positions.map(pos => 
      `${pos.position}：${pos.meaning}。${pos.card.interpretation}`
    );
    const synthesis = this.synthesizeFullReading(positions, spreadType);
    
    return {
      summary,
      details,
      synthesis
    };
  }

  private generateSummary(positions: TarotSpreadPosition[], spreadType: SpreadType): string {
    if (!positions || positions.length === 0) {
      return 'カードが示すメッセージ';
    }

    const summaryTemplates: Record<SpreadType, string> = {
      'one-card': positions[0]?.card ? `今日のカード${positions[0].card.name}は、${positions[0].card.keywords.join('、')}を象徴しています。` : '今日のカードからメッセージが届いています。',
      'three-card': positions[0]?.card && positions[1]?.card && positions[2]?.card ? 
        `過去の${positions[0].card.name}から現在の${positions[1].card.name}を経て、未来の${positions[2].card.name}へと続く流れが示されています。` :
        '過去・現在・未来の流れが示されています。',
      'celtic-cross': positions[0]?.card && positions[9]?.card ? 
        `ケルト十字が示す全体像：${positions[0].card.name}の現状から始まり、${positions[9].card.name}の最終結果へと向かいます。` :
        'ケルト十字があなたの全体像を示しています。',
      'relationship': positions[0]?.card && positions[1]?.card ? 
        `${positions[0].card.name}と${positions[1].card.name}が示す二人の関係性の真実。` :
        '二人の関係性について大切なメッセージがあります。',
      'decision': positions[0]?.card && positions[4]?.card ? 
        `${positions[0].card.name}が示す現状から、最善の道${positions[4].card.name}へ。` :
        '現状から最善の道筋が見えてきます。'
    };
    
    return summaryTemplates[spreadType] || 'カードが示すメッセージ';
  }

  private synthesizeFullReading(positions: TarotSpreadPosition[], spreadType: SpreadType): string {
    const timeModifier = this.getTimeModifier();
    const environmentModifier = this.getEnvironmentalModifier();
    const modifier = timeModifier * environmentModifier;
    
    // スプレッドタイプごとの統合メッセージ
    switch (spreadType) {
      case 'one-card':
        return this.synthesizeOneCard(positions[0], modifier);
      case 'three-card':
        return this.synthesizeThreeCard(positions, modifier);
      case 'celtic-cross':
        return this.synthesizeCelticCross(positions, modifier);
      case 'relationship':
        return this.synthesizeRelationship(positions, modifier);
      case 'decision':
        return this.synthesizeDecision(positions, modifier);
      default:
        return 'カードが示す全体的なメッセージ';
    }
  }

  private synthesizeOneCard(position: TarotSpreadPosition, modifier: number): string {
    const card = position.card;
    const strengthMessage = modifier > 1.1 
      ? 'このメッセージは今特に重要です。' 
      : 'じっくりとこのメッセージを受け取ってください。';
    
    return `${card.name}があなたに伝えたいことは明確です。${card.keywords.join('と')}がキーワードとなります。${strengthMessage}`;
  }

  private synthesizeThreeCard(positions: TarotSpreadPosition[], modifier: number): string {
    const [past, present, future] = positions.map(p => p.card);
    
    // カードの数値から全体的な流れを読む
    const numericalFlow = (past.number + present.number + future.number) % 22;
    
    let flowMessage = '';
    if (past.number < present.number && present.number < future.number) {
      flowMessage = '上昇の流れにあります。';
    } else if (past.number > present.number && present.number > future.number) {
      flowMessage = '内省と見直しの時期です。';
    } else {
      flowMessage = '変化と転換の時期にあります。';
    }
    
    const strengthMessage = modifier > 1.1 
      ? '今は特に強いエネルギーが働いています。' 
      : '穏やかなエネルギーの中にいます。';
    
    return `${flowMessage}${past.name}から${present.name}を経て${future.name}へと向かう流れは、
    あなたの${this.input.questionCategory || '人生'}において重要な意味を持ちます。
    ${strengthMessage}`;
  }

  private synthesizeCelticCross(positions: TarotSpreadPosition[], modifier: number): string {
    const majorArcanaCount = positions.filter(p => p.card.arcana === 'major').length;
    const coreMessage = majorArcanaCount >= 5 
      ? '運命的な転換期にあります。宇宙からの強いメッセージを受け取ってください。'
      : '日常の中で着実な変化が起きています。小さなサインを大切にしてください。';
    
    return `${coreMessage} ${positions[0].card.name}の現状から始まり、${positions[9].card.name}の結果へと向かう道筋が示されています。`;
  }

  private synthesizeRelationship(positions: TarotSpreadPosition[], modifier: number): string {
    const [yourFeelings, theirFeelings, currentState] = positions.slice(0, 3).map(p => p.card);
    const advice = positions[5].card;
    const future = positions[6].card;
    
    return `${yourFeelings.name}と${theirFeelings.name}が示す二人の心の状態から、` +
           `${currentState.name}という現在の関係性が生まれています。` +
           `${advice.name}のアドバイスに従うことで、${future.name}の未来が待っています。`;
  }

  private synthesizeDecision(positions: TarotSpreadPosition[], modifier: number): string {
    const [current, optionA, optionB, hidden, bestPath] = positions.map(p => p.card);
    
    return `${current.name}の現状において、${optionA.name}と${optionB.name}という二つの道があります。` +
           `しかし、${hidden.name}が示す見落としている要素を考慮すると、` +
           `${bestPath.name}が最善の道として浮かび上がります。`;
  }

  private getMoonPhaseInfluence(): string {
    if (!this.environment?.lunar) return '';
    
    const { phase, phaseName } = this.environment.lunar;
    
    if (phase < 0.1 || phase > 0.9) {
      return `新月の影響：新しい始まりに最適な時期。直感が冴えています。`;
    } else if (Math.abs(phase - 0.5) < 0.1) {
      return `満月の影響：感情が高まりやすい時期。大きな決断は慎重に。`;
    } else if (phase < 0.5) {
      return `上弦の月の影響：行動を起こすのに良い時期。積極的に。`;
    } else {
      return `下弦の月の影響：手放しと浄化の時期。不要なものを整理しましょう。`;
    }
  }

  private generateOverallMessage(positions: TarotSpreadPosition[]): string {
    const majorArcanaCount = positions.filter(pos => pos.card.arcana === 'major').length;
    const totalCards = positions.length;
    const majorRatio = majorArcanaCount / totalCards;
    
    if (majorRatio >= 0.6) {
      return '運命的な転機が訪れています。宇宙からの強いメッセージに耳を傾けてください。';
    } else if (majorRatio >= 0.3) {
      return '重要な変化の時期にあります。内なる声と外からのサインの両方に注意を向けてください。';
    } else {
      return '日常の中に隠された大切なメッセージがあります。小さなサインを見逃さないでください。';
    }
  }

  private generatePersonalizedGuidance(positions: TarotSpreadPosition[], spreadType: SpreadType): string {
    if (!this.input.question) {
      const defaultMessages: Record<SpreadType, string> = {
        'one-card': '今日一日、このカードのメッセージを心に留めて過ごしてください。',
        'three-card': '過去・現在・未来の流れを意識しながら、今を大切に生きてください。',
        'celtic-cross': '示された道筋を参考に、あなたの直感を信じて進んでください。',
        'relationship': '相手との関係性において、カードが示す洞察を活かしてください。',
        'decision': '決断の時が来ています。カードの導きに従って、勇気を持って選択してください。'
      };
      return defaultMessages[spreadType] || '今日一日、カードのメッセージを心に留めて過ごしてください。';
    }
    
    const { questionCategory, question } = this.input;
    
    // スプレッドタイプに応じて最も重要なカードを選択
    let keyCard: TarotCard;
    switch (spreadType) {
      case 'one-card':
        keyCard = positions[0].card;
        break;
      case 'three-card':
        keyCard = positions[1].card; // 現在
        break;
      case 'celtic-cross':
        keyCard = positions[0].card; // 現在の状況
        break;
      case 'relationship':
        keyCard = positions[5].card; // アドバイス
        break;
      case 'decision':
        keyCard = positions[4].card; // 最善の道
        break;
      default:
        keyCard = positions[0].card;
    }
    
    const categoryGuidance: Record<string, string> = {
      '恋愛・結婚': `${keyCard.name}のエネルギーは、愛において${keyCard.keywords.join('、')}を大切にすることを示しています。`,
      '仕事・転職': `${keyCard.name}は、キャリアにおいて${keyCard.keywords.join('、')}が鍵となることを教えています。`,
      '金運・財運': `${keyCard.name}のメッセージは、豊かさを得るために${keyCard.keywords.join('、')}が必要だということです。`,
      '健康': `${keyCard.name}は、心身の健康のために${keyCard.keywords.join('、')}を意識することを勧めています。`,
      '総合運': `${keyCard.name}があなたに伝えたいのは、${keyCard.keywords.join('、')}の大切さです。`
    };
    
    const baseGuidance = categoryGuidance[questionCategory || '総合運'] || categoryGuidance['総合運'];
    
    // スプレッド固有の追加メッセージ
    let additionalGuidance = '';
    if (spreadType === 'celtic-cross' && positions.length >= 10) {
      additionalGuidance = `最終的に${positions[9].card.name}が示す結果へと向かいます。`;
    } else if (spreadType === 'relationship' && positions.length >= 7) {
      additionalGuidance = `二人の未来は${positions[6].card.name}が暗示しています。`;
    } else if (spreadType === 'decision' && positions.length >= 5) {
      additionalGuidance = `${positions[4].card.name}が最善の選択を示しています。`;
    }
    
    return `「${question}」という問いに対して、${baseGuidance} ${additionalGuidance}`;
  }

  // 公開メソッド（UIからの利用用）
  public getDeckSize(): number {
    return this.deck.length;
  }

  public getCardPreview(index: number): TarotCard | null {
    if (index < 0 || index >= this.deck.length) return null;
    return this.deck[index];
  }

  public getAvailableSpreads(): Array<{ type: SpreadType; name: string; description: string; cardCount: number }> {
    return Object.entries(this.spreads).map(([type, spread]) => ({
      type: type as SpreadType,
      name: spread.name,
      description: spread.description,
      cardCount: spread.positions.length
    }));
  }
}