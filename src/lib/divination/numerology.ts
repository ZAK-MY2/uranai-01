// 数秘術エンジン - ピタゴラス式実装
import { NumerologyInput, NumerologyResult } from '@/types/divination';

export class NumerologyEngine {
  private readonly letterValues: { [key: string]: number } = {
    A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
    J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
    S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8
  };

  private readonly lifePathInterpretations: { [key: number]: string } = {
    1: "あなたは生まれながらのリーダーです。独立心が強く、新しい道を切り開く力を持っています。",
    2: "あなたは協力と調和を重視する平和主義者です。他者との関係性の中で力を発揮します。",
    3: "あなたは創造性と表現力に恵まれています。アートや表現活動で才能を発揮するでしょう。",
    4: "あなたは実直で責任感が強く、地道な努力を積み重ねる力があります。",
    5: "あなたは自由を愛し、冒険心に満ちています。変化と多様性を求める傾向があります。",
    6: "あなたは愛と奉仕の精神を持ち、家族や共同体のために尽くす傾向があります。",
    7: "あなたは探求心が強く、精神的な成長や真理の追求に関心があります。",
    8: "あなたは物質的な成功や権力に関心があり、ビジネスで成功する可能性があります。",
    9: "あなたは人道主義者で、世界をより良くしたいという願いを持っています。",
    11: "あなたは直感力が非常に強く、精神的な洞察力に恵まれたマスターナンバーです。",
    22: "あなたは大きな夢を現実化する力を持つマスタービルダーです。",
    33: "あなたは愛と奉仕を通じて人々を導くマスターティーチャーです。"
  };

  private readonly destinyInterpretations: { [key: number]: string } = {
    1: "リーダーシップを発揮し、独自の道を歩むことが運命です。",
    2: "協力と調和を通じて、人々をつなぐ架け橋となることが運命です。",
    3: "創造的な表現を通じて、世界に美と喜びをもたらすことが運命です。",
    4: "堅実な努力により、安定した基盤を築くことが運命です。",
    5: "自由な精神で多くの経験を積み、知識を広めることが運命です。",
    6: "愛と責任を持って、家族や共同体を支えることが運命です。",
    7: "深い探求により、真理や智慧を見つけることが運命です。",
    8: "物質世界で成功を収め、富と権力を得ることが運命です。",
    9: "人類への奉仕を通じて、世界に貢献することが運命です。",
    11: "直感と洞察力で人々を導き、精神的な光をもたらすことが運命です。",
    22: "実用的な方法で理想を実現し、世界に永続的な変化をもたらすことが運命です。",
    33: "無条件の愛と慈悲で人々を癒し、導くことが運命です。"
  };

  private readonly soulInterpretations: { [key: number]: string } = {
    1: "内なる自己は独立と自立を求めています。",
    2: "内なる自己は平和と調和を深く願っています。",
    3: "内なる自己は創造的な表現と喜びを求めています。",
    4: "内なる自己は安定と秩序を求めています。",
    5: "内なる自己は自由と冒険を渇望しています。",
    6: "内なる自己は愛と奉仕を通じた充実感を求めています。",
    7: "内なる自己は真理と精神的な成長を求めています。",
    8: "内なる自己は達成と成功に対する強い欲求があります。",
    9: "内なる自己は人類への貢献と奉仕を願っています。",
    11: "内なる自己は精神的な覚醒と直感的な理解を求めています。",
    22: "内なる自己は大きな理想の実現を願っています。",
    33: "内なる自己は愛と癒しを通じた奉仕を求めています。"
  };

  private readonly personalityInterpretations: { [key: number]: string } = {
    1: "他人からはリーダーシップがあり、自信に満ちた人として見られます。",
    2: "他人からは優しく、協調性のある人として見られます。",
    3: "他人からは明るく、魅力的で創造的な人として見られます。",
    4: "他人からは信頼でき、責任感の強い人として見られます。",
    5: "他人からは自由で、魅力的で変化に富んだ人として見られます。",
    6: "他人からは思いやりがあり、責任感の強い人として見られます。",
    7: "他人からは知的で、神秘的な魅力を持つ人として見られます。",
    8: "他人からは成功志向で、権威のある人として見られます。",
    9: "他人からは寛大で、人道的な人として見られます。",
    11: "他人からは直感的で、精神的な深さを持つ人として見られます。",
    22: "他人からは実用的でありながら、大きな理想を持つ人として見られます。",
    33: "他人からは愛に満ち、癒しの力を持つ人として見られます。"
  };

  /**
   * ライフパスナンバーの計算
   */
  calculateLifePath(birthDate: string): number {
    const digits = birthDate.replace(/-/g, '').split('').map(Number);
    return this.reduceToSingleDigit(digits.reduce((sum, digit) => sum + digit, 0));
  }

  /**
   * 運命数の計算
   */
  calculateDestiny(fullName: string): number {
    const nameValue = fullName.toUpperCase()
      .replace(/[^A-Z]/g, '')
      .split('')
      .reduce((sum, letter) => sum + (this.letterValues[letter] || 0), 0);
    return this.reduceToSingleDigit(nameValue);
  }

  /**
   * ソウルナンバーの計算（母音のみ）
   */
  calculateSoul(fullName: string): number {
    const vowels = fullName.toUpperCase().match(/[AEIOU]/g) || [];
    const vowelValue = vowels.reduce((sum, vowel) => sum + this.letterValues[vowel], 0);
    return this.reduceToSingleDigit(vowelValue);
  }

  /**
   * パーソナリティナンバーの計算（子音のみ）
   */
  calculatePersonality(fullName: string): number {
    const consonants = fullName.toUpperCase().match(/[BCDFGHJKLMNPQRSTVWXYZ]/g) || [];
    const consonantValue = consonants.reduce((sum, consonant) => sum + this.letterValues[consonant], 0);
    return this.reduceToSingleDigit(consonantValue);
  }

  /**
   * 数字を一桁に減らす（マスターナンバー11, 22, 33は除く）
   */
  private reduceToSingleDigit(num: number): number {
    // マスターナンバーは減らさない
    if (num === 11 || num === 22 || num === 33) return num;
    
    while (num > 9) {
      num = num.toString().split('').map(Number).reduce((sum, digit) => sum + digit, 0);
      // 計算途中でマスターナンバーになった場合も保持
      if (num === 11 || num === 22 || num === 33) return num;
    }
    return num;
  }

  /**
   * 解釈文を生成
   */
  private generateInterpretation(numbers: Omit<NumerologyResult, 'interpretation'>): NumerologyResult['interpretation'] {
    return {
      lifePath: this.lifePathInterpretations[numbers.lifePath] || "あなたの人生の道筋は特別で独特なものです。",
      destiny: this.destinyInterpretations[numbers.destiny] || "あなたの運命は特別で独特なものです。",
      soul: this.soulInterpretations[numbers.soul] || "あなたの内なる自己は特別で独特な願いを持っています。",
      personality: this.personalityInterpretations[numbers.personality] || "あなたは特別で独特な印象を他人に与えます。",
      overall: this.generateOverallInterpretation(numbers)
    };
  }

  /**
   * 総合解釈の生成
   */
  private generateOverallInterpretation(numbers: Omit<NumerologyResult, 'interpretation'>): string {
    const { lifePath, destiny, soul, personality } = numbers;
    
    let overall = `あなたの数秘術プロファイルは、`;
    
    // ライフパスによる基本的な方向性
    if (lifePath === destiny) {
      overall += `ライフパス${lifePath}と運命数${destiny}が一致しており、あなたの人生の目的と道筋が完全に調和していることを示しています。`;
    } else {
      overall += `ライフパス${lifePath}の道を歩みながら、運命数${destiny}の目的を果たす人生を示しています。`;
    }
    
    // ソウルとパーソナリティの関係
    if (soul === personality) {
      overall += ` 内なる願い（ソウル${soul}）と外見的印象（パーソナリティ${personality}）が一致しており、真の自分を表現できています。`;
    } else {
      overall += ` 内なる願い（ソウル${soul}）と外見的印象（パーソナリティ${personality}）に違いがあり、内面と外面のバランスを取ることが重要です。`;
    }
    
    // マスターナンバーの存在確認
    const masterNumbers = [lifePath, destiny, soul, personality].filter(n => n === 11 || n === 22 || n === 33);
    if (masterNumbers.length > 0) {
      overall += ` マスターナンバー（${masterNumbers.join(', ')}）を持つあなたは、特別な使命と責任を負っています。`;
    }
    
    overall += ` 全体として、あなたは独自の道を歩む特別な人生を送ることが示されています。`;
    
    return overall;
  }

  /**
   * 数秘術計算のメインメソッド
   */
  async calculate(input: NumerologyInput): Promise<NumerologyResult> {
    // 入力検証
    if (!input.fullName || !input.birthDate) {
      throw new Error('名前と生年月日は必須です');
    }

    // 生年月日の形式チェック
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(input.birthDate)) {
      throw new Error('生年月日は YYYY-MM-DD 形式で入力してください');
    }

    try {
      const numbers = {
        lifePath: this.calculateLifePath(input.birthDate),
        destiny: this.calculateDestiny(input.fullName),
        soul: this.calculateSoul(input.fullName),
        personality: this.calculatePersonality(input.fullName)
      };

      const interpretation = this.generateInterpretation(numbers);

      return { ...numbers, interpretation };
    } catch (error) {
      throw new Error(`数秘術計算エラー: ${error instanceof Error ? error.message : '不明なエラー'}`);
    }
  }

  /**
   * キャッシュキー生成
   */
  generateCacheKey(input: NumerologyInput): string {
    return `numerology:${input.fullName.toLowerCase().replace(/\s+/g, '')}:${input.birthDate}`;
  }

  /**
   * 入力ハッシュ生成
   */
  generateInputHash(input: NumerologyInput): string {
    const data = `${input.fullName}:${input.birthDate}`;
    return btoa(data).replace(/[^a-zA-Z0-9]/g, '');
  }
}

// シングルトンインスタンス
export const numerologyEngine = new NumerologyEngine();