// タロット占いエンジン
import { TarotInput, TarotReading, TarotCard, TarotSpread, TarotDrawnCard } from '@/types/divination';
import { ALL_CARDS, TAROT_SPREADS } from './tarot-data';

export class TarotEngine {
  private deck: TarotCard[] = ALL_CARDS;
  private spreads: { [key: string]: TarotSpread } = TAROT_SPREADS;

  /**
   * シード値を使用した疑似乱数生成器
   */
  private createSeededRandom(seed: string): () => number {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      const char = seed.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // 32bit整数に変換
    }
    
    return function() {
      hash = (hash * 9301 + 49297) % 233280;
      return hash / 233280;
    };
  }

  /**
   * デッキをシャッフル（シード値による再現可能性）
   */
  private shuffleDeck(seed?: string): TarotCard[] {
    const shuffled = [...this.deck];
    const random = this.createSeededRandom(seed || Date.now().toString());
    
    // Fisher-Yatesシャッフル
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    return shuffled;
  }

  /**
   * カードの個別解釈生成
   */
  private generateCardInterpretation(card: TarotCard, position: string, isReversed: boolean, question: string): string {
    const baseMeaning = isReversed ? card.reversedMeaning : card.uprightMeaning;
    const direction = isReversed ? '（逆位置）' : '（正位置）';
    
    let interpretation = `**${card.name}${direction}**\n\n`;
    interpretation += `**${position}の意味**: ${baseMeaning}\n\n`;
    
    // 位置に応じた追加解釈
    switch (position) {
      case '過去':
        interpretation += `あなたの過去において、${baseMeaning.toLowerCase()}が重要な影響を与えていたことを示しています。`;
        break;
      case '現在':
        interpretation += `現在のあなたの状況は、${baseMeaning.toLowerCase()}の状態にあります。`;
        break;
      case '未来':
        interpretation += `未来に向けて、${baseMeaning.toLowerCase()}のエネルギーが働くでしょう。`;
        break;
      case 'あなたの気持ち':
        interpretation += `あなたの心の中では、${baseMeaning.toLowerCase()}の感情が働いています。`;
        break;
      case '相手の気持ち':
        interpretation += `相手の心境は、${baseMeaning.toLowerCase()}の状態にあると考えられます。`;
        break;
      case '関係の未来':
        interpretation += `お二人の関係は、${baseMeaning.toLowerCase()}の方向に向かうでしょう。`;
        break;
      default:
        interpretation += `この位置において、${baseMeaning.toLowerCase()}のメッセージが示されています。`;
    }
    
    return interpretation;
  }

  /**
   * 全体的な読み解き生成
   */
  private generateOverallReading(cards: TarotDrawnCard[], question: string): string {
    const cardNames = cards.map(c => c.card.name).join('、');
    
    let overall = `【${question}】に対するタロットの総合メッセージ\n\n`;
    overall += `引かれたカードは「${cardNames}」です。\n\n`;
    
    // カードの組み合わせ分析
    const majorCards = cards.filter(c => c.card.arcana === 'major');
    const minorCards = cards.filter(c => c.card.arcana === 'minor');
    const reversedCards = cards.filter(c => c.isReversed);
    
    if (majorCards.length > minorCards.length) {
      overall += `大アルカナが多く出現しており、この問題は人生の重要な転換点や深い意味を持つ出来事であることを示しています。`;
    } else if (minorCards.length > majorCards.length) {
      overall += `小アルカナが中心となっており、日常的な事柄や具体的な行動が重要であることを示しています。`;
    }
    
    if (reversedCards.length > cards.length / 2) {
      overall += ` 逆位置のカードが多く、内省や見直しが必要な時期であることを示唆しています。`;
    }
    
    overall += `\n\nカード全体のエネルギーから、`;
    
    // 簡単な組み合わせ解釈
    if (cards.some(c => c.card.name === 'The Fool') && cards.some(c => c.card.name === 'The World')) {
      overall += `新しい始まりから完成までの完全なサイクルを表しており、大きな成長と達成が期待できます。`;
    } else if (cards.some(c => c.card.keywords.includes('愛')) && cards.some(c => c.card.keywords.includes('成功'))) {
      overall += `愛と成功の両方を手にする可能性が示されています。`;
    } else {
      overall += `各カードのメッセージを統合して行動することで、良い結果を得られるでしょう。`;
    }
    
    return overall;
  }

  /**
   * アドバイス生成
   */
  private generateAdvice(cards: TarotDrawnCard[], question: string): string {
    let advice = "【タロットからのアドバイス】\n\n";
    
    // 最後のカードまたは最も重要な位置のカードからアドバイスを導く
    const lastCard = cards[cards.length - 1];
    const actionKeywords = lastCard.card.keywords.filter(k => 
      ['創造', '行動', '決断', '変化', '成長'].some(action => k.includes(action))
    );
    
    if (actionKeywords.length > 0) {
      advice += `1. **${actionKeywords[0]}を重視してください** - ${lastCard.card.name}のエネルギーを活用しましょう。\n\n`;
    }
    
    // 逆位置カードがある場合の注意点
    const reversedCards = cards.filter(c => c.isReversed);
    if (reversedCards.length > 0) {
      advice += `2. **注意点** - ${reversedCards[0].card.name}の逆位置が示すように、${reversedCards[0].card.reversedMeaning.split('、')[0]}に気をつけてください。\n\n`;
    }
    
    // 時期についてのアドバイス
    if (cards.some(c => c.position === '未来' || c.position === '近い未来')) {
      advice += `3. **タイミング** - 未来のカードが示すように、焦らずに適切な時期を待つことも大切です。\n\n`;
    }
    
    advice += `4. **実践的な行動** - カードのメッセージを日常生活に取り入れ、小さな変化から始めてみてください。`;
    
    return advice;
  }

  /**
   * タロットリーディングのメインメソッド
   */
  async drawCards(input: TarotInput): Promise<TarotReading> {
    // 入力検証
    if (!input.question || !input.spreadType) {
      throw new Error('質問とスプレッドタイプは必須です');
    }

    const spread = this.spreads[input.spreadType];
    if (!spread) {
      throw new Error(`不明なスプレッドタイプ: ${input.spreadType}`);
    }

    try {
      // シード値生成（再現可能性のため）
      const seed = input.seed || `${input.question}-${Date.now()}`;
      const shuffled = this.shuffleDeck(seed);
      const random = this.createSeededRandom(seed);
      
      // カードを引く
      const drawnCards: TarotDrawnCard[] = spread.positions.map((position, index) => {
        const card = shuffled[index];
        const isReversed = random() < 0.5; // 50%の確率で逆位置
        
        return {
          card,
          position,
          isReversed,
          meaning: this.generateCardInterpretation(card, position, isReversed, input.question)
        };
      });

      // 総合解釈とアドバイス生成
      const overall = this.generateOverallReading(drawnCards, input.question);
      const advice = this.generateAdvice(drawnCards, input.question);

      return {
        spread,
        cards: drawnCards,
        overall,
        advice
      };
    } catch (error) {
      throw new Error(`タロット占いエラー: ${error instanceof Error ? error.message : '不明なエラー'}`);
    }
  }

  /**
   * 利用可能なスプレッド一覧を取得
   */
  getAvailableSpreads(): { [key: string]: TarotSpread } {
    return this.spreads;
  }

  /**
   * キャッシュキー生成
   */
  generateCacheKey(input: TarotInput): string {
    return `tarot:${input.question.toLowerCase().replace(/\s+/g, '-')}:${input.spreadType}:${input.seed || 'random'}`;
  }

  /**
   * 入力ハッシュ生成
   */
  generateInputHash(input: TarotInput): string {
    const data = `${input.question}:${input.spreadType}:${input.seed || ''}`;
    return btoa(data).replace(/[^a-zA-Z0-9]/g, '');
  }

  /**
   * 単一カード占い（簡易版）
   */
  async drawSingleCard(question: string, seed?: string): Promise<TarotDrawnCard> {
    const shuffled = this.shuffleDeck(seed);
    const random = this.createSeededRandom(seed || question);
    
    const card = shuffled[0];
    const isReversed = random() < 0.5;
    
    return {
      card,
      position: '今日のメッセージ',
      isReversed,
      meaning: this.generateCardInterpretation(card, '今日のメッセージ', isReversed, question)
    };
  }

  /**
   * カード名による検索
   */
  findCardByName(name: string): TarotCard | undefined {
    return this.deck.find(card => 
      card.name.toLowerCase() === name.toLowerCase() ||
      card.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  /**
   * キーワードによるカード検索
   */
  findCardsByKeyword(keyword: string): TarotCard[] {
    return this.deck.filter(card =>
      card.keywords.some(k => k.toLowerCase().includes(keyword.toLowerCase())) ||
      card.uprightMeaning.toLowerCase().includes(keyword.toLowerCase()) ||
      card.reversedMeaning.toLowerCase().includes(keyword.toLowerCase())
    );
  }
}

// シングルトンインスタンス
export const tarotEngine = new TarotEngine();