// ルーン占術エンジン
import { RuneSymbols, RuneSpreads } from './runes-data';
import { RuneInput, RuneReading, DrawnRune, RuneMeaning } from '@/types/divination';


export interface Rune {
  name: string;
  symbol: string;
  meaning: string;
  reversedMeaning: string;
  element: string;
  aett: string; // ルーンの群（フレイヤ、ハイム、テュール）
  numerology: number;
  divination: string;
  keywords: string[];
}


export interface RuneSpread {
  name: string;
  positions: string[];
  description: string;
  usage: string;
}


export class RuneEngine {
  private runes: typeof RuneSymbols;
  private spreads: typeof RuneSpreads;
  private random: () => number;

  constructor(seed?: string) {
    this.runes = RuneSymbols;
    this.spreads = RuneSpreads;
    
    // シード付きランダム関数
    if (seed) {
      let seedValue = this.hashCode(seed);
      this.random = () => {
        seedValue = (seedValue * 9301 + 49297) % 233280;
        return seedValue / 233280;
      };
    } else {
      this.random = Math.random;
    }
  }

  /**
   * ルーン占術を実行（質問パラメータベースの決定的計算）
   */
  async performReading(input: RuneInput): Promise<RuneReading> {
    try {
      // スプレッドの取得
      const spread = this.getSpread(input.spreadType);
      
      // 質問ベースの決定的ルーンを引く
      const drawnRunes = this.drawDeterministicRunes(spread, input.question, input.casterName);
      
      // 全体的な解釈を生成
      const overallInterpretation = this.generateOverallInterpretation(
        drawnRunes,
        spread,
        input.question
      );
      
      // ルーンの導きを生成
      const runicGuidance = this.generateRunicGuidance(drawnRunes, input.question);

      return {
        runes: drawnRunes,
        spreadType: input.spreadType,
        interpretation: overallInterpretation.overall,
        advice: overallInterpretation.advice
      };
    } catch (error) {
      console.error('ルーン占術エラー:', error);
      throw new Error('ルーン占術の実行中にエラーが発生しました');
    }
  }

  /**
   * スプレッドを取得
   */
  private getSpread(spreadType: string): RuneSpread {
    const spread = this.spreads.find(s => s.name === spreadType);
    if (!spread) {
      throw new Error(`未知のスプレッドタイプ: ${spreadType}`);
    }
    return spread;
  }

  /**
   * 質問パラメータベースで決定的にルーンを引く
   */
  private drawDeterministicRunes(spread: RuneSpread, question: string, casterName?: string): DrawnRune[] {
    const drawnRunes: DrawnRune[] = [];
    const availableRunes = [...this.runes]; // コピーを作成
    
    // 質問と名前から決定的シードを生成
    const combinedSeed = this.hashCode(question + (casterName || '') + spread.name);
    let currentSeed = combinedSeed;
    
    for (let i = 0; i < spread.positions.length; i++) {
      // 決定的な疑似ランダム値生成
      currentSeed = (currentSeed * 1103515245 + 12345) & 0x7fffffff;
      const runeIndex = Math.floor((currentSeed / 0x7fffffff) * availableRunes.length);
      const selectedRune = availableRunes.splice(runeIndex, 1)[0];
      
      // 決定的な逆位置判定（質問とポジションに基づく）
      currentSeed = (currentSeed * 1103515245 + 12345) & 0x7fffffff;
      const reversed = (currentSeed / 0x7fffffff) < 0.25; // 25%の確率
      
      // 解釈を生成
      const interpretation = this.generateRuneInterpretation(
        selectedRune,
        spread.positions[i],
        reversed,
        question
      );
      
      drawnRunes.push({
        name: selectedRune.name,
        symbol: selectedRune.symbol,
        meaning: {
          upright: selectedRune.meaning,
          reversed: selectedRune.reversedMeaning,
          keywords: selectedRune.keywords,
          element: selectedRune.element,
          deity: selectedRune.aett
        },
        position: spread.positions[i],
        isReversed: reversed,
        interpretation
      });
    }
    
    return drawnRunes;
  }

  /**
   * ルーンを引く（後方互換性のため）
   */
  private drawRunes(spread: RuneSpread, question: string): DrawnRune[] {
    const drawnRunes: DrawnRune[] = [];
    const availableRunes = [...this.runes]; // コピーを作成
    
    for (let i = 0; i < spread.positions.length; i++) {
      // ランダムにルーンを選択
      const runeIndex = Math.floor(this.random() * availableRunes.length);
      const selectedRune = availableRunes.splice(runeIndex, 1)[0];
      
      // 逆位置の判定（25%の確率）
      const reversed = this.random() < 0.25;
      
      // 解釈を生成
      const interpretation = this.generateRuneInterpretation(
        selectedRune,
        spread.positions[i],
        reversed,
        question
      );
      
      drawnRunes.push({
        name: selectedRune.name,
        symbol: selectedRune.symbol,
        meaning: {
          upright: selectedRune.meaning,
          reversed: selectedRune.reversedMeaning,
          keywords: selectedRune.keywords,
          element: selectedRune.element,
          deity: selectedRune.aett
        },
        position: spread.positions[i],
        isReversed: reversed,
        interpretation
      });
    }
    
    return drawnRunes;
  }

  /**
   * 個別ルーンの解釈を生成
   */
  private generateRuneInterpretation(
    rune: Rune,
    position: string,
    reversed: boolean,
    question: string
  ): string {
    const meaning = reversed ? rune.reversedMeaning : rune.meaning;
    const context = this.getPositionContext(position);
    
    return `${rune.name}（${rune.symbol}）${reversed ? '逆位置' : ''}：${context}において、${meaning}を示しています。${rune.divination}`;
  }

  /**
   * ポジションの文脈を取得
   */
  private getPositionContext(position: string): string {
    const contexts: { [key: string]: string } = {
      '現在の状況': '現在の状況',
      '課題・障害': '直面している課題',
      'アドバイス': '取るべき行動',
      '結果・未来': '可能な結果',
      '過去': '過去の影響',
      '近い未来': '近い将来',
      '遠い未来': '長期的な展望',
      '自分': 'あなた自身',
      '環境': '周囲の環境',
      '希望と恐れ': '内心の願いと不安',
      '最終的な結果': '最終的な結果',
      '隠された影響': '隠れた要因'
    };
    
    return contexts[position] || position;
  }

  /**
   * 全体的な解釈を生成
   */
  private generateOverallInterpretation(
    drawnRunes: DrawnRune[],
    spread: RuneSpread,
    question: string
  ): any {
    const situation = this.generateSituationInterpretation(drawnRunes);
    const challenge = this.generateChallengeInterpretation(drawnRunes);
    const advice = this.generateAdviceInterpretation(drawnRunes);
    const outcome = this.generateOutcomeInterpretation(drawnRunes);
    const timing = this.generateTimingInterpretation(drawnRunes);
    const overall = this.generateOverallSummary(drawnRunes, spread, question);

    return {
      situation,
      challenge,
      advice,
      outcome,
      timing,
      overall
    };
  }

  private generateSituationInterpretation(drawnRunes: DrawnRune[]): string {
    const currentRune = drawnRunes.find(r => r.position.includes('現在') || r.position.includes('状況'));
    if (currentRune) {
      return `現在の状況は${currentRune.name}によって表されています。${currentRune.interpretation}`;
    }
    
    // 最初のルーンを状況として解釈
    const firstRune = drawnRunes[0];
    return `現在の状況は${firstRune.name}の影響を受けています。${firstRune.meaning.element}の要素が強く働いています。`;
  }

  private generateChallengeInterpretation(drawnRunes: DrawnRune[]): string {
    const challengeRune = drawnRunes.find(r => r.position.includes('課題') || r.position.includes('障害'));
    if (challengeRune) {
      return challengeRune.interpretation;
    }
    
    // 逆位置のルーンがあれば課題として解釈
    const reversedRunes = drawnRunes.filter(r => r.isReversed);
    if (reversedRunes.length > 0) {
      return `主な課題は${reversedRunes[0].name}（逆位置）が示しています。${reversedRunes[0].meaning.reversed}`;
    }
    
    return '特に大きな障害は見当たりません。現在の道のりを続けることができます。';
  }

  private generateAdviceInterpretation(drawnRunes: DrawnRune[]): string {
    const adviceRune = drawnRunes.find(r => r.position.includes('アドバイス') || r.position.includes('行動'));
    if (adviceRune) {
      return adviceRune.interpretation;
    }
    
    // アドバイス的なルーンを探す
    const guidanceRunes = drawnRunes.filter(r => 
      r.meaning.keywords.some(keyword => 
        ['導き', '知恵', '成長', '変化', '力'].includes(keyword)
      )
    );
    
    if (guidanceRunes.length > 0) {
      const rune = guidanceRunes[0];
      return `${rune.name}のエネルギーを活用してください。${rune.meaning.upright}`;
    }
    
    return '直感を信じ、内なる知恵に従って行動することが重要です。';
  }

  private generateOutcomeInterpretation(drawnRunes: DrawnRune[]): string {
    const outcomeRune = drawnRunes.find(r => 
      r.position.includes('結果') || r.position.includes('未来') || r.position.includes('最終')
    );
    
    if (outcomeRune) {
      return outcomeRune.interpretation;
    }
    
    // 最後のルーンを結果として解釈
    const lastRune = drawnRunes[drawnRunes.length - 1];
    return `結果は${lastRune.name}によって示されています。${lastRune.meaning.upright}`;
  }

  private generateTimingInterpretation(drawnRunes: DrawnRune[]): string {
    // 要素に基づくタイミング
    const elements = drawnRunes.map(r => r.meaning.element);
    const dominantElement = this.getDominantElement(elements);
    
    const timingMap: { [key: string]: string } = {
      '火': '迅速な展開が期待できます。行動は早めに。',
      '水': 'ゆっくりとした変化。時間をかけて進展します。',
      '風': '変化は予期せぬタイミングで訪れます。',
      '土': '安定した変化。着実に進歩していきます。',
      '氷': '一時的な停滞の後、大きな変化が来ます。'
    };
    
    return timingMap[dominantElement] || '適切な時期が来れば、自然に物事が動き出します。';
  }

  private generateOverallSummary(drawnRunes: DrawnRune[], spread: RuneSpread, question: string): string {
    const runeNames = drawnRunes.map(r => r.name).join('、');
    const aetts = drawnRunes.map(r => r.meaning.deity || '不明');
    const dominantAett = this.getDominantAett(aetts);
    
    let summary = `ご質問「${question}」について、${runeNames}のルーンが引かれました。`;
    summary += `${dominantAett}の影響が強く、`;
    
    const reversedCount = drawnRunes.filter(r => r.isReversed).length;
    if (reversedCount > drawnRunes.length / 2) {
      summary += '多くの課題がありますが、それらを乗り越えることで大きな成長を得られるでしょう。';
    } else {
      summary += '比較的順調な流れの中で、目標に向かって進んでいくことができます。';
    }
    
    return summary;
  }

  /**
   * 支配的な要素を取得
   */
  private getDominantElement(elements: string[]): string {
    const elementCount: { [key: string]: number } = {};
    elements.forEach(element => {
      elementCount[element] = (elementCount[element] || 0) + 1;
    });
    
    return Object.keys(elementCount).reduce((a, b) => 
      elementCount[a] > elementCount[b] ? a : b
    );
  }

  /**
   * 支配的なアエットを取得
   */
  private getDominantAett(aetts: string[]): string {
    const aettCount: { [key: string]: number } = {};
    aetts.forEach(aett => {
      aettCount[aett] = (aettCount[aett] || 0) + 1;
    });
    
    return Object.keys(aettCount).reduce((a, b) => 
      aettCount[a] > aettCount[b] ? a : b
    );
  }

  /**
   * ルーンの導きを生成
   */
  private generateRunicGuidance(drawnRunes: DrawnRune[], question: string): string {
    const totalNumerology = drawnRunes.reduce((sum, r) => {
      const originalRune = this.runes.find(rune => rune.name === r.name);
      return sum + (originalRune?.numerology || 1);
    }, 0);
    const guidanceNumber = totalNumerology % 9 + 1;
    
    const guidances = [
      '新しい始まりの時です。勇気を持って一歩踏み出してください。',
      '協力と調和が成功の鍵となります。他者との関係を大切にしてください。',
      '創造的なエネルギーが高まっています。表現力を活かしましょう。',
      '安定と基盤作りに専念する時期です。着実に歩みを進めてください。',
      '変化と冒険の時です。新しい体験を恐れず受け入れてください。',
      '愛と奉仕の精神が重要です。他者への思いやりを忘れずに。',
      '内省と学習の時期です。深い洞察を得るために静かに考えてください。',
      '物質的な成功と達成の可能性があります。努力が実を結ぶでしょう。',
      '完成と達成の時です。一つの段階が終わり、新しい始まりが待っています。'
    ];
    
    return guidances[guidanceNumber - 1];
  }

  /**
   * 文字列のハッシュコードを生成
   */
  private hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // 32bit整数に変換
    }
    return Math.abs(hash);
  }

  /**
   * キャッシュキーの生成
   */
  generateCacheKey(input: RuneInput): string {
    const questionHash = this.hashCode(input.question).toString(36);
    return `runes:${questionHash}:${input.spreadType}:${input.casterName}`;
  }
}

// シングルトンインスタンス
export const runeEngine = new RuneEngine();