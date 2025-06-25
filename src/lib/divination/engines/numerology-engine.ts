import { BaseDivinationEngine, DivinationInput, EnvironmentData } from '../base-engine';
import { 
  NUMEROLOGY_MESSAGES, 
  MASTER_NUMBER_MESSAGES, 
  CYCLE_ADVICE,
  LUCKY_MESSAGE_ELEMENTS,
  getRandomMessage,
  getContextualMessage
} from '../messages/numerology-messages';

export interface NumerologyResult {
  lifePathNumber: number;
  destinyNumber: number;
  soulNumber: number;
  personalityNumber: number;
  maturityNumber: number;
  interpretation: {
    lifePathMeaning: string;
    destinyMeaning: string;
    soulMeaning: string;
    currentCycle: string;
    advice: string;
  };
  compatibility: {
    bestNumbers: number[];
    challengingNumbers: number[];
  };
  todaysNumber: number;
  luckyNumbers: number[];
  personalizedMessage?: string;
  luckyMessage?: string;
}

export class NumerologyEngine extends BaseDivinationEngine<NumerologyResult> {
  constructor(input: DivinationInput, environment?: EnvironmentData) {
    super(input, environment);
  }

  calculate(): NumerologyResult {
    
    const lifePathNumber = this.calculateLifePathNumber();
    const destinyNumber = this.calculateDestinyNumber();
    const soulNumber = this.calculateSoulNumber();
    const personalityNumber = this.calculatePersonalityNumber();
    const maturityNumber = this.calculateMaturityNumber();
    const todaysNumber = this.calculateTodaysNumber();


    const interpretation = this.generateInterpretation(
      lifePathNumber,
      destinyNumber,
      soulNumber,
      personalityNumber
    );


    const personalizedMessage = interpretation.advice;

    const luckyMessage = this.generateLuckyMessage();

    const result = {
      lifePathNumber,
      destinyNumber,
      soulNumber,
      personalityNumber,
      maturityNumber,
      interpretation,
      compatibility: this.getCompatibility(lifePathNumber),
      todaysNumber,
      luckyNumbers: this.generateLuckyNumbers(lifePathNumber, destinyNumber),
      personalizedMessage,
      luckyMessage
    };

    return result;
  }

  private calculateLifePathNumber(): number {
    return this.getBirthNumber();
  }

  private calculateDestinyNumber(): number {
    return this.getNameNumber();
  }

  private calculateSoulNumber(): number {
    // 母音から計算
    const vowels = this.input.fullName.match(/[あいうえおアイウエオaeiouAEIOU]/g) || [];
    let sum = vowels.reduce((acc, vowel) => acc + vowel.charCodeAt(0) % 9 + 1, 0);
    
    while (sum > 9 && sum !== 11 && sum !== 22) {
      sum = this.sumDigits(sum);
    }
    
    return sum;
  }

  private calculatePersonalityNumber(): number {
    // 子音から計算
    const consonants = this.input.fullName.match(/[^あいうえおアイウエオaeiouAEIOU\s]/g) || [];
    let sum = consonants.reduce((acc, consonant) => acc + consonant.charCodeAt(0) % 9 + 1, 0);
    
    while (sum > 9 && sum !== 11 && sum !== 22) {
      sum = this.sumDigits(sum);
    }
    
    return sum;
  }

  private calculateMaturityNumber(): number {
    let sum = this.calculateLifePathNumber() + this.calculateDestinyNumber();
    
    while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
      sum = this.sumDigits(sum);
    }
    
    return sum;
  }

  private calculateTodaysNumber(): number {
    const today = new Date();
    const modifier = this.getEnvironmentalModifier() * this.getTimeModifier();
    
    let sum = this.sumDigits(today.getFullYear()) + 
              this.sumDigits(today.getMonth() + 1) + 
              this.sumDigits(today.getDate());
    
    while (sum > 9) {
      sum = this.sumDigits(sum);
    }
    
    // 環境による微調整
    return Math.round(sum * modifier) % 10 || 1;
  }

  private generateInterpretation(
    lifePath: number,
    destiny: number,
    soul: number,
    personality: number
  ): NumerologyResult['interpretation'] {
    
    const lifePathMeanings: Record<number, string[]> = {
      1: [
        '独立心と創造性に富むリーダー。新しい道を切り開く先駆者',
        '革新的なアイデアで世界を変える開拓者',
        '自己の信念を貫く強い意志の持ち主',
        '独創的な視点で新たな価値を生み出す創造者'
      ],
      2: [
        '調和と協力を重んじる平和主義者。人々を結びつける架け橋',
        '繊細な感性で他者の心を理解する共感者',
        'バランスと調和を大切にする調停者',
        'パートナーシップを通じて成功する協力者'
      ],
      3: [
        '創造性と表現力に溢れる芸術家。喜びと楽観性を周囲に広げる',
        '言葉と芸術で世界を彩るクリエイター',
        'ポジティブなエネルギーで周囲を照らす太陽',
        '豊かな想像力で夢を現実にする魔法使い'
      ],
      4: [
        '堅実で信頼できる建設者。安定と秩序をもたらす',
        '着実な努力で確かな成果を築く実践者',
        '計画性と忍耐力で目標を達成する建築家',
        '伝統と革新のバランスを保つ守護者'
      ],
      5: [
        '自由と冒険を愛する探求者。変化と多様性を楽しむ',
        '好奇心旺盛で新しい体験を求める冒険家',
        '変化を恐れず進化し続ける変革者',
        '多彩な才能で人生を豊かにする万能者'
      ],
      6: [
        '愛と責任感に満ちた養育者。調和と美を大切にする',
        '深い愛情で他者を包み込む母なる存在',
        '美と調和を生活に取り入れる芸術的な魂',
        '家族と共同体の幸せを守る守護天使'
      ],
      7: [
        '深い洞察力を持つ探求者。真理と知恵を追求する',
        '内なる声に耳を傾ける神秘的な賢者',
        '哲学と精神性を探求する思想家',
        '直感と分析力を併せ持つ真理の探求者'
      ],
      8: [
        '物質的成功と権力を扱う実業家。現実世界での達成を重視',
        'ビジネスセンスと実行力で成功を掴む起業家',
        '資源を賢く活用して豊かさを創造する錬金術師',
        '権力と責任のバランスを理解する指導者'
      ],
      9: [
        '普遍的な愛と奉仕の人。人類全体の幸福を願う',
        '無私の愛で世界に貢献する博愛主義者',
        '古い魂を持ち、深い知恵を分かち合う教師',
        '全ての生命との繋がりを感じる宇宙的な存在'
      ],
      11: [
        '直感とインスピレーションの使者。高い精神性を持つ',
        '霊的な洞察力で他者を導く光の使者',
        '理想と現実の架け橋となる啓発者',
        '宇宙の真理を地上にもたらすメッセンジャー'
      ],
      22: [
        'マスタービルダー。大きなビジョンを現実化する力を持つ',
        '壮大な夢を具現化する建設的な理想主義者',
        '実践的な知恵で世界に貢献する改革者',
        '物質と精神を統合する偉大な建築家'
      ],
      33: [
        'マスターティーチャー。無条件の愛と奉仕を体現する',
        '純粋な愛で全てを包み込む慈愛の化身',
        '人類の意識を高める精神的指導者',
        '自己犠牲的な愛で世界を癒すヒーラー'
      ]
    };
    
    // ランダムに選択
    const meanings = lifePathMeanings[lifePath] || lifePathMeanings[1];
    const randomIndex = Math.floor(Math.random() * meanings.length);
    const baseLifePathMeaning = meanings[randomIndex];

    const currentAge = new Date().getFullYear() - this.input.birthDate.getFullYear();
    const currentCycle = Math.floor(currentAge / 9) + 1;

    const baseDestinyMeaning = `運命数${destiny}があなたの人生の目的を示しています`;
    const baseSoulMeaning = `魂の数${soul}があなたの内なる願いを表しています`;
    


    const advice = this.generateAdvice(lifePath, destiny, soul, personality);
    
    return {
      lifePathMeaning: baseLifePathMeaning,
      destinyMeaning: baseDestinyMeaning,
      soulMeaning: baseSoulMeaning,
      currentCycle: `現在は第${currentCycle}サイクル。${this.getCycleAdvice(currentCycle)}`,
      advice
    };
  }

  private getCycleAdvice(cycle: number): string {
    const cycleAdvices: Record<number, string> = {
      1: '基礎を築く時期。自己発見と方向性の確立が重要',
      2: '成長と拡大の時期。人間関係と協力が鍵',
      3: '実現と収穫の時期。これまでの努力が実を結ぶ',
      4: '統合と成熟の時期。経験を活かして他者を導く'
    };
    
    return cycleAdvices[Math.min(cycle, 4)] || cycleAdvices[4];
  }

  private generateAdvice(lifePath: number, destiny: number, soul: number, personality: number): string {
    const total = (lifePath + destiny + soul + personality) % 9 || 9;
    
    // 基本的なアドバイス内容（ファクト）
    const baseAdvices: Record<number, string> = {
      1: '新しいプロジェクトを始める時期です',
      2: 'パートナーシップと協力が重要です',
      3: '創造性と表現力を活かす時です',
      4: '計画的に基盤を固める段階です',
      5: '変化と新しい経験を受け入れる時です',
      6: '愛と責任を大切にする時期です',
      7: '内省と精神的成長に向かう時です',
      8: '目標達成への具体的行動の時です',
      9: '奉仕と貢献を通じて成長する時です'
    };
    
    const baseAdvice = baseAdvices[total] || baseAdvices[1];
    
    return baseAdvice;
  }

  private getCompatibility(lifePathNumber: number): { bestNumbers: number[], challengingNumbers: number[] } {
    const compatibilityMap: Record<number, { best: number[], challenging: number[] }> = {
      1: { best: [3, 5, 7], challenging: [4, 6] },
      2: { best: [4, 6, 8], challenging: [1, 5] },
      3: { best: [1, 5, 9], challenging: [4, 7] },
      4: { best: [2, 6, 8], challenging: [3, 5] },
      5: { best: [1, 3, 7], challenging: [2, 4] },
      6: { best: [2, 4, 9], challenging: [1, 5] },
      7: { best: [1, 5, 7], challenging: [3, 8] },
      8: { best: [2, 4, 6], challenging: [7, 9] },
      9: { best: [3, 6, 9], challenging: [4, 8] },
      11: { best: [2, 22, 33], challenging: [1, 8] },
      22: { best: [4, 11, 33], challenging: [5, 7] },
      33: { best: [6, 11, 22], challenging: [3, 8] }
    };
    
    const compatibility = compatibilityMap[lifePathNumber] || compatibilityMap[1];
    
    return {
      bestNumbers: compatibility.best,
      challengingNumbers: compatibility.challenging
    };
  }

  private generateLuckyNumbers(lifePath: number, destiny: number): number[] {
    const baseNumbers = [lifePath, destiny];
    const today = new Date();
    const dayNumber = today.getDate() % 9 || 9;
    const monthNumber = (today.getMonth() + 1) % 9 || 9;
    
    // 環境要因を加味
    const moonInfluence = Math.round(this.environment?.lunar.phase || 0.5 * 9);
    
    return [...new Set([...baseNumbers, dayNumber, monthNumber, moonInfluence])].slice(0, 5);
  }
  
  // 今日の幸運メッセージを生成
  generateLuckyMessage(): string {
    
    const todaysNumber = this.calculateTodaysNumber();
    const moonPhase = this.environment?.lunar?.phase || 0.5;
    const hour = new Date().getHours();
    
    
    // 数字、月相、時間帯を組み合わせてメッセージを生成
    const numberMeanings = [
      '', // 0は使わない
      '新しい始まり', '協調と調和', '創造と表現', '安定と基盤',
      '変化と自由', '愛と責任', '内省と探求', '成功と達成', '完成と奉仕'
    ];
    
    const timePeriods = {
      morning: hour >= 5 && hour < 12,
      afternoon: hour >= 12 && hour < 17,
      evening: hour >= 17 && hour < 21,
      night: hour >= 21 || hour < 5
    };
    
    const moonInfluences = {
      new: moonPhase < 0.25,
      waxing: moonPhase >= 0.25 && moonPhase < 0.5,
      full: moonPhase >= 0.5 && moonPhase < 0.75,
      waning: moonPhase >= 0.75
    };
    
    // 基本メッセージ要素
    const numberElement = numberMeanings[todaysNumber] || '特別なエネルギー';
    
    const timeElements = {
      morning: ['朝の新鮮なエネルギーが', '朝日と共に', '新しい一日の始まりに', '朝の清々しい気持ちで'],
      afternoon: ['午後の充実した時間に', '日中の活発なエネルギーで', '昼の明るい光の中で', '活動的な午後に'],
      evening: ['夕暮れの穏やかな時に', '一日の実りを感じながら', '夕方の落ち着いた時間に', '黄昏時の美しさと共に'],
      night: ['夜の静寂の中で', '星々の導きにより', '深夜の神秘的な時に', '月明かりの下で']
    };
    
    const moonElements = {
      new: ['新たなサイクルが始まり', '種まきの時期に', '可能性が芽生え', '新月のパワーで'],
      waxing: ['成長のエネルギーに満ちて', '力が増していく時期に', '上昇気流に乗って', '発展の波に乗り'],
      full: ['満月の完成したエネルギーで', '最高潮の運気で', '満ち足りた状態で', '豊かさが溢れ'],
      waning: ['手放しと浄化の時期に', '内なる智慧が深まり', '整理整頓の好機に', '本質が見えてきて']
    };
    
    const outcomes = [
      '素晴らしい出来事が待っています',
      '幸運の扉が開かれます',
      '願いが実現に向かいます',
      '新しいチャンスが訪れます',
      '喜びに満ちた瞬間が来ます',
      '期待以上の結果が得られます',
      '幸せな驚きがあるでしょう',
      'ポジティブな変化が起こります',
      '運命的な出会いがありそうです',
      '思いがけない幸運が舞い込みます',
      '心が満たされる体験ができます',
      '成功への道が開かれます',
      '愛と豊かさに包まれます',
      '直感が冴え渡る一日になります',
      '全てがうまく進む流れです'
    ];
    
    // 時間帯を特定
    let currentPeriod: keyof typeof timeElements = 'morning';
    for (const [period, isActive] of Object.entries(timePeriods)) {
      if (isActive) {
        currentPeriod = period as keyof typeof timeElements;
        break;
      }
    }
    
    // 月相を特定
    let currentMoonPhase: keyof typeof moonElements = 'new';
    for (const [phase, isActive] of Object.entries(moonInfluences)) {
      if (isActive) {
        currentMoonPhase = phase as keyof typeof moonElements;
        break;
      }
    }
    
    // ランダム要素を追加
    const randomIndex = Math.floor(Math.random() * 1000);
    
    // メッセージを構築
    const timeElement = timeElements[currentPeriod][randomIndex % timeElements[currentPeriod].length];
    const moonElement = moonElements[currentMoonPhase][randomIndex % moonElements[currentMoonPhase].length];
    const outcome = outcomes[randomIndex % outcomes.length];
    
    
    const baseMessage = `${timeElement}、${numberElement}のエネルギーと${moonElement}、${outcome}`;
    
    return baseMessage;
  }
}