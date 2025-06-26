import { BaseDivinationEngine, DivinationInput, EnvironmentData } from '../base-engine';
import { allTarotCards, TarotCard as TarotCardData } from '../data/tarot-cards';
import { 
  getTarotCardMessage, 
  selectTarotMessage,
  TarotCardMessage 
} from '../messages/tarot-messages-basic';

export interface TarotCard extends TarotCardData {
  image: string;
  interpretation: string;
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
    // 全78枚のタロットカードをインポートして使用
    return allTarotCards.map(card => {
      // 新しいメッセージシステムから豊富な解釈を取得
      const seed = Math.floor(Math.random() * 1000);
      const interpretation = selectTarotMessage(
        card.id,
        'uprightInterpretations',
        seed
      ) || card.uprightMeaning;
      
      return {
        ...card,
        image: card.id,
        interpretation
      };
    });
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
    // 新しいメッセージシステムからポジション固有のメッセージを取得
    const seed = this.generateSeed();
    const positionKey = this.mapPositionToMessageKey(position);
    
    const message = selectTarotMessage(
      card.id,
      'positionInterpretations',
      seed,
      positionKey
    );
    
    if (message) {
      return message;
    }
    
    // フォールバック: 従来のテンプレートベースのメッセージ
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
  
  private mapPositionToMessageKey(position: string): string {
    const positionMap: Record<string, string> = {
      '現在の状況': 'present',
      '過去': 'past',
      '未来': 'future',
      '直面する課題': 'obstacle',
      'あなたの気持ち': 'innerSelf',
      '相手の気持ち': 'innerSelf',
      '選択肢A': 'advice',
      '選択肢B': 'advice',
      '遠い過去/根本原因': 'past',
      '近い過去': 'past',
      '可能な未来': 'future',
      '近い未来': 'future',
      'あなたの立場': 'innerSelf',
      '外部からの影響': 'environment',
      '希望と恐れ': 'hopes',
      '最終結果': 'outcome',
      '関係の現状': 'present',
      '課題': 'obstacle',
      '外部要因': 'environment',
      'アドバイス': 'advice',
      '関係の未来': 'future',
      '見落としている要素': 'obstacle',
      '最善の道': 'advice'
    };
    
    return positionMap[position] || 'present';
  }

  private generateFullInterpretation(positions: TarotSpreadPosition[], spreadType: SpreadType): TarotReading['interpretation'] {
    const summary = this.generateSummary(positions, spreadType);
    const seed = this.generateSeed();
    
    // 各ポジションに対して豊富な解釈を生成
    const details = positions.map((pos, index) => {
      // カテゴリ別の解釈を取得
      const categoryMessage = selectTarotMessage(
        pos.card.id,
        'categoryInterpretations',
        seed + index,
        this.input.questionCategory || 'general'
      );
      
      // 詩的表現を追加（20%の確率）
      const includePoetic = (seed + index) % 5 === 0;
      const poeticMessage = includePoetic ? selectTarotMessage(
        pos.card.id,
        'poeticExpressions',
        seed + index + 1000
      ) : '';
      
      return `${pos.position}：${pos.meaning}。${categoryMessage || pos.card.interpretation}${poeticMessage ? ` ${poeticMessage}` : ''}`;
    });
    
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
    const seed = this.generateSeed();
    
    // 時間帯に応じたメッセージを選択
    const hour = new Date().getHours();
    let timingType: 'morning' | 'afternoon' | 'evening';
    if (hour < 12) timingType = 'morning';
    else if (hour < 18) timingType = 'afternoon';
    else timingType = 'evening';
    
    // 最も重要なカードからタイミングメッセージを取得
    const keyCard = this.getKeyCard(positions, spreadType);
    const timingMessage = selectTarotMessage(
      keyCard.id,
      'timingMessages',
      seed,
      timingType
    );
    
    if (!this.input.question) {
      // デフォルトメッセージも新しいシステムから取得
      const practicalAdvice = selectTarotMessage(
        keyCard.id,
        'practicalAdvice',
        seed + 500
      );
      
      if (practicalAdvice) {
        return `${timingMessage || ''} ${practicalAdvice}`;
      }
      
      const defaultMessages: Record<SpreadType, string> = {
        'one-card': '今日一日、このカードのメッセージを心に留めて過ごしてください。',
        'three-card': '過去・現在・未来の流れを意識しながら、今を大切に生きてください。',
        'celtic-cross': '示された道筋を参考に、あなたの直感を信じて進んでください。',
        'relationship': '相手との関係性において、カードが示す洞察を活かしてください。',
        'decision': '決断の時が来ています。カードの導きに従って、勇気を持って選択してください。'
      };
      return `${timingMessage || ''} ${defaultMessages[spreadType] || '今日一日、カードのメッセージを心に留めて過ごしてください。'}`;
    }

    const { questionCategory, question } = this.input;
    
    // 新しいメッセージシステムから心理学的洞察を取得
    const psychologicalInsight = selectTarotMessage(
      keyCard.id,
      'psychologicalInsights',
      seed + 200
    );
    
    // カテゴリ別の具体的なアドバイスを取得
    const categoryAdvice = selectTarotMessage(
      keyCard.id,
      'categoryInterpretations',
      seed + 300,
      questionCategory || 'general'
    );
    
    const baseGuidance = categoryAdvice || `${keyCard.name}があなたに伝えたいのは、${keyCard.keywords.join('、')}の大切さです。`;
    
    // スプレッド固有の追加メッセージ
    let additionalGuidance = '';
    if (spreadType === 'celtic-cross' && positions.length >= 10) {
      additionalGuidance = `最終的に${positions[9].card.name}が示す結果へと向かいます。`;
    } else if (spreadType === 'relationship' && positions.length >= 7) {
      additionalGuidance = `二人の未来は${positions[6].card.name}が暗示しています。`;
    } else if (spreadType === 'decision' && positions.length >= 5) {
      additionalGuidance = `${positions[4].card.name}が最善の選択を示しています。`;
    }
    
    // 総合的なガイダンスを構築
    const guidanceParts = [
      timingMessage,
      `「${question}」という問いに対して、`,
      baseGuidance,
      psychologicalInsight,
      additionalGuidance
    ].filter(part => part && part.length > 0);
    
    return guidanceParts.join(' ');
  }

  private getKeyCard(positions: TarotSpreadPosition[], spreadType: SpreadType): TarotCard {
    // スプレッドタイプに応じて最も重要なカードを選択
    switch (spreadType) {
      case 'one-card':
        return positions[0].card;
      case 'three-card':
        return positions[1].card; // 現在
      case 'celtic-cross':
        return positions[0].card; // 現在の状況
      case 'relationship':
        return positions[5] ? positions[5].card : positions[0].card; // アドバイス
      case 'decision':
        return positions[4] ? positions[4].card : positions[0].card; // 最善の道
      default:
        return positions[0].card;
    }
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