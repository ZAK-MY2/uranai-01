import { BaseDivinationEngine, DivinationInput, EnvironmentData } from '../base-engine';
import { hexagrams as allHexagrams, trigrams, Hexagram } from '../data/iching-hexagrams';

export interface IChingReading {
  hexagram: {
    primary: Hexagram;
    changing?: Hexagram;
    changingLines: number[];
  };
  casting: {
    method: string;
    values: number[];
    lines: Array<{
      value: number;
      type: string; // 陰、陽、変陰、変陽
      changing: boolean;
    }>;
  };
  interpretation: {
    situation: string;
    advice: string;
    warning: string;
    outcome: string;
    timing: string;
  };
  elements: {
    upperElement: string;
    lowerElement: string;
    interaction: string;
  };
  personalGuidance?: string;
  environmentalResonance?: string;
}

export class IChingEngine extends BaseDivinationEngine<IChingReading> {
  private hexagrams: Hexagram[];

  constructor(input: DivinationInput, environment?: EnvironmentData) {
    super(input, environment);
    this.hexagrams = allHexagrams;
  }

  calculate(): IChingReading {
    // 易の投擲
    const casting = this.castHexagram();
    
    // 本卦の取得
    const primaryHexagram = this.getHexagramFromLines(casting.lines);
    
    // 変爻があれば之卦を取得
    const changingLines = casting.lines
      .map((line, index) => line.changing ? index : -1)
      .filter(index => index !== -1);
    
    let changingHexagram: Hexagram | undefined;
    if (changingLines.length > 0) {
      const changedLines = casting.lines.map(line => ({
        ...line,
        value: line.changing ? (line.value === 9 ? 6 : 9) : line.value,
        type: line.changing ? (line.type.includes('陽') ? '陰' : '陽') : line.type,
        changing: false
      }));
      changingHexagram = this.getHexagramFromLines(changedLines);
    }

    // 要素分析
    const elements = this.analyzeElements(primaryHexagram);
    
    // 解釈生成
    const interpretation = this.generateInterpretation(
      primaryHexagram, 
      changingHexagram, 
      changingLines
    );
    
    // パーソナライズされたガイダンス
    const personalGuidance = this.generatePersonalGuidance(
      primaryHexagram,
      changingHexagram,
      changingLines
    );
    
    // 環境との共鳴
    const environmentalResonance = this.getEnvironmentalResonance(primaryHexagram);

    return {
      hexagram: {
        primary: primaryHexagram,
        changing: changingHexagram,
        changingLines
      },
      casting,
      interpretation,
      elements,
      personalGuidance,
      environmentalResonance
    };
  }

  private castHexagram(): IChingReading['casting'] {
    const method = '三枚硬貨法';
    const values: number[] = [];
    const lines: IChingReading['casting']['lines'] = [];
    
    // シードの生成
    const seed = this.generateSeed();
    let currentSeed = seed;
    
    // 6本の爻を下から上へ投擲
    for (let i = 0; i < 6; i++) {
      // 3枚の硬貨を投げる（表=3、裏=2）
      let lineValue = 0;
      const coinValues: number[] = [];
      
      for (let j = 0; j < 3; j++) {
        currentSeed = (currentSeed * 1103515245 + 12345) % 2147483648;
        const coin = (currentSeed % 2) === 0 ? 2 : 3;
        coinValues.push(coin);
        lineValue += coin;
      }
      
      values.push(lineValue);
      
      // 6=老陰（変陰）、7=少陽（陽）、8=少陰（陰）、9=老陽（変陽）
      const lineType = this.getLineType(lineValue);
      lines.push({
        value: lineValue,
        type: lineType,
        changing: lineValue === 6 || lineValue === 9
      });
    }
    
    return { method, values, lines };
  }

  private getLineType(value: number): string {
    switch (value) {
      case 6: return '老陰（変化）';
      case 7: return '少陽';
      case 8: return '少陰';
      case 9: return '老陽（変化）';
      default: return '不明';
    }
  }

  private getHexagramFromLines(lines: IChingReading['casting']['lines']): Hexagram {
    // 爻の値を二進数文字列に変換（陽=1、陰=0）
    const binaryString = lines.map(line => 
      (line.value === 7 || line.value === 9) ? '1' : '0'
    ).join('');
    
    const lowerBinary = binaryString.slice(0, 3);
    const upperBinary = binaryString.slice(3, 6);
    
    // 二進数文字列を八卦記号に変換
    const binaryToTrigram: Record<string, string> = {
      '111': '☰', // 乾
      '011': '☱', // 兌
      '101': '☲', // 離  
      '001': '☳', // 震
      '110': '☴', // 巽
      '010': '☵', // 坎
      '100': '☶', // 艮
      '000': '☷'  // 坤
    };
    
    const upperTrigram = binaryToTrigram[upperBinary];
    const lowerTrigram = binaryToTrigram[lowerBinary];
    
    // 上卦と下卦の記号で該当する卦を探す
    const hexagram = this.hexagrams.find(h => 
      h.upperTrigram === upperTrigram && h.lowerTrigram === lowerTrigram
    );
    
    return hexagram || this.hexagrams[0]; // 見つからない場合は乾為天を返す
  }



  private analyzeElements(hexagram: Hexagram): IChingReading['elements'] {
    const upperTrigram = trigrams[hexagram.upperTrigram as keyof typeof trigrams];
    const lowerTrigram = trigrams[hexagram.lowerTrigram as keyof typeof trigrams];
    
    const elementInteractions: Record<string, Record<string, string>> = {
      '天': {
        '天': '純粋な創造力、強大なエネルギー',
        '地': '天地の調和、大いなる成就',
        '水': '需要と供給、待つことの知恵',
        '火': '大いなる所有、豊かさ',
        '山': '大いなる蓄積、着実な成長',
        '雷': '大いなる力、決断の時',
        '風': '小さな蓄積、コツコツと',
        '沢': '決断と喜び、開放的'
      },
      // 他の要素の相互作用も定義...
    };
    
    const interaction = elementInteractions[upperTrigram?.element]?.[lowerTrigram?.element] 
      || '上下の要素が独特な関係を形成';
    
    return {
      upperElement: upperTrigram?.element || '不明',
      lowerElement: lowerTrigram?.element || '不明',
      interaction
    };
  }

  private generateInterpretation(
    primary: Hexagram,
    changing: Hexagram | undefined,
    changingLines: number[]
  ): IChingReading['interpretation'] {
    const timeModifier = this.getTimeModifier();
    const hasChangingLines = changingLines.length > 0;
    
    // 状況の解釈
    let situation = primary.interpretation;
    if (hasChangingLines) {
      situation += ' 状況は変化の過程にあり、';
      if (changingLines.length === 1) {
        situation += `特に第${changingLines[0] + 1}爻が重要な転換点を示しています。`;
      } else {
        situation += '複数の要素が同時に変化しています。';
      }
    }
    
    // アドバイス
    const advice = this.generateAdvice(primary, changingLines);
    
    // 警告
    const warning = this.generateWarning(primary, changingLines);
    
    // 結果
    let outcome = '';
    if (changing) {
      outcome = `現在の${primary.name}から${changing.name}へと状況が移行します。`;
      outcome += changing.interpretation;
    } else {
      outcome = '現在の状況が続く見込みです。' + primary.judgment + 'の精神で臨むことが大切です。';
    }
    
    // タイミング
    const timing = this.calculateTiming(primary, timeModifier);
    
    return {
      situation,
      advice,
      warning,
      outcome,
      timing
    };
  }

  private generateAdvice(hexagram: Hexagram, changingLines: number[]): string {
    let advice = '';
    
    // 卦の性質に基づくアドバイス
    if (hexagram.name.includes('乾')) {
      advice = 'リーダーシップを発揮し、主体的に行動することが求められています。';
    } else if (hexagram.name.includes('坤')) {
      advice = '受容的な姿勢で、周囲と協調することが大切です。';
    } else if (hexagram.name.includes('水')) {
      advice = '流れに身を任せつつ、本質を見失わないようにしましょう。';
    } else if (hexagram.name.includes('火')) {
      advice = '明晰な判断力を持って、光明を見出してください。';
    } else if (hexagram.name.includes('山')) {
      advice = '静かに内省し、動くべき時を待ちましょう。';
    } else if (hexagram.name.includes('雷')) {
      advice = '勇気を持って行動を起こす時です。';
    } else if (hexagram.name.includes('風')) {
      advice = '柔軟に浸透し、徐々に影響を広げていきましょう。';
    } else if (hexagram.name.includes('沢')) {
      advice = '喜びを分かち合い、開かれた心で接しましょう。';
    } else {
      advice = hexagram.image + ' - この教えに従って行動しましょう。';
    }
    
    // 変爻がある場合の追加アドバイス
    if (changingLines.length > 0) {
      advice += ' 特に';
      changingLines.forEach((line, index) => {
        if (index > 0) advice += '、';
        advice += `第${line + 1}爻`;
      });
      advice += 'の教えに注目してください。';
    }
    
    return advice;
  }

  private generateWarning(hexagram: Hexagram, changingLines: number[]): string {
    let warning = '';
    
    // 卦番号による一般的な警告
    if (hexagram.number === 29 || hexagram.number === 30) {
      warning = '困難や試練が予想されます。慎重に対処してください。';
    } else if (hexagram.number === 23 || hexagram.number === 44) {
      warning = '崩壊や衰退の兆候があります。基盤を見直す必要があります。';
    } else if (hexagram.number === 6 || hexagram.number === 47) {
      warning = '争いや困窮に注意。和解と忍耐が必要です。';
    } else {
      // 変爻による警告
      if (changingLines.includes(5)) {
        warning = '頂点に達しています。驕りは禁物です。';
      } else if (changingLines.includes(0)) {
        warning = '始まりの段階です。基礎をしっかり固めましょう。';
      } else if (changingLines.length >= 4) {
        warning = '大きな変革期です。冷静な判断を保ってください。';
      } else {
        warning = '順調に見えても油断は禁物。謙虚さを忘れずに。';
      }
    }
    
    return warning;
  }

  private calculateTiming(hexagram: Hexagram, timeModifier: number): string {
    let timing = '';
    
    // 卦の性質によるタイミング
    const fastHexagrams = [1, 51, 57]; // 乾、震、巽
    const slowHexagrams = [2, 52, 29]; // 坤、艮、坎
    
    if (fastHexagrams.includes(hexagram.number)) {
      timing = '素早い展開が予想されます。数日から数週間で結果が現れるでしょう。';
    } else if (slowHexagrams.includes(hexagram.number)) {
      timing = 'ゆっくりとした展開です。数ヶ月から半年程度の時間が必要です。';
    } else {
      timing = '通常のペースで進展します。1〜3ヶ月程度を見込んでください。';
    }
    
    // 時間修正
    if (timeModifier > 1.1) {
      timing += ' 現在は加速の時期にあり、予想より早く進む可能性があります。';
    } else if (timeModifier < 0.9) {
      timing += ' 現在は停滞の時期にあり、忍耐が必要かもしれません。';
    }
    
    return timing;
  }

  private generatePersonalGuidance(
    primary: Hexagram,
    changing: Hexagram | undefined,
    changingLines: number[]
  ): string {
    if (!this.input.question) {
      return '易経の智慧を日々の生活に活かしてください。';
    }
    
    const { question, questionCategory } = this.input;
    let guidance = `「${question}」について、${primary.name}は`;
    
    // カテゴリー別のガイダンス
    const categoryGuidance: Record<string, string> = {
      '恋愛・結婚': this.getLoveGuidance(primary, changing),
      '仕事・転職': this.getCareerGuidance(primary, changing),
      '金運・財運': this.getWealthGuidance(primary, changing),
      '健康': this.getHealthGuidance(primary, changing),
      '総合運': this.getGeneralGuidance(primary, changing)
    };
    
    guidance += categoryGuidance[questionCategory || '総合運'] || categoryGuidance['総合運'];
    
    // 変爻による追加ガイダンス
    if (changingLines.length > 0) {
      guidance += ` 特に重要なのは、${primary.lines[changingLines[0]]}`;
    }
    
    return guidance;
  }

  private getLoveGuidance(primary: Hexagram, changing?: Hexagram): string {
    const loveHexagrams: Record<number, string> = {
      1: '主導権を持って関係を築く時',
      2: '相手を受け入れ、支える姿勢が大切',
      31: '感応し合う関係、自然な流れに任せる',
      32: '恒久的な関係を築く好機',
      54: '慎重に関係を見極める必要がある'
    };
    
    return loveHexagrams[primary.number] || '相手との調和を大切に、誠実に向き合いましょう。';
  }

  private getCareerGuidance(primary: Hexagram, changing?: Hexagram): string {
    const careerHexagrams: Record<number, string> = {
      1: 'リーダーシップを発揮し、新しいプロジェクトを始める好機',
      14: '大いなる成功と富を得る可能性',
      46: '着実に昇進・成長していく時期',
      48: '基礎を固め、専門性を深める時',
      64: 'もう少しで完成、最後まで気を抜かずに'
    };
    
    return careerHexagrams[primary.number] || '現在の仕事に誠実に取り組み、機会を待ちましょう。';
  }

  private getWealthGuidance(primary: Hexagram, changing?: Hexagram): string {
    const wealthHexagrams: Record<number, string> = {
      14: '大いなる富を得る暗示',
      55: '豊かさの頂点、賢明な管理が必要',
      5: '待つことで良い機会が訪れる',
      42: '利益と成長の時期',
      23: '損失に注意、守りの姿勢が大切'
    };
    
    return wealthHexagrams[primary.number] || '堅実な財産管理と、機会を見極める目が必要です。';
  }

  private getHealthGuidance(primary: Hexagram, changing?: Hexagram): string {
    const healthHexagrams: Record<number, string> = {
      1: '活力に満ち、健康状態は良好',
      16: '楽観的な心が健康を支える',
      18: '古い問題の改善に取り組む時',
      29: '注意が必要、無理は禁物',
      58: '喜びと笑いが最良の薬'
    };
    
    return healthHexagrams[primary.number] || 'バランスの取れた生活を心がけ、心身の調和を保ちましょう。';
  }

  private getGeneralGuidance(primary: Hexagram, changing?: Hexagram): string {
    return `${primary.judgment}の精神で、${primary.image}を実践することが成功への鍵となります。`;
  }

  private getEnvironmentalResonance(hexagram: Hexagram): string {
    if (!this.environment) return '';
    
    const weather = this.environment.weather;
    const lunar = this.environment.lunar;
    
    let resonance = '環境との調和：';
    
    // 天候との関係
    const weatherResonance: Record<string, string> = {
      'Clear': '晴天は陽の気を強め、積極的な行動を後押しします。',
      'Rain': '雨は陰の気を強め、内省と浄化の時間をもたらします。',
      'Clouds': '曇天は変化の兆し、柔軟な対応が求められます。',
      'Snow': '雪は静寂と純粋さ、新たな始まりの準備期間です。'
    };
    
    if (weather) {
      const conditionMap: Record<string, string> = {
        'clear': 'Clear',
        'rain': 'Rain',
        'cloudy': 'Clouds',
        'snow': 'Snow'
      };
      const mappedCondition = conditionMap[weather.condition] || weather.condition;
      resonance += weatherResonance[mappedCondition] || '自然の流れと調和しています。';
    } else {
      resonance += '自然の流れと調和しています。';
    }
    
    // 月相との関係
    if (hexagram.name.includes('陰') || hexagram.name.includes('坤')) {
      if (lunar.phase > 0.5) {
        resonance += '月が満ちていく時期は、陰の卦にとって力を得る時です。';
      }
    } else if (hexagram.name.includes('陽') || hexagram.name.includes('乾')) {
      if (lunar.phase < 0.5) {
        resonance += '月が欠けていく時期は、陽の卦にとって内省の機会です。';
      }
    }
    
    return resonance;
  }

  private generateSeed(): number {
    const birthTime = this.input.birthDate.getTime();
    const nameValue = this.input.fullName.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const questionValue = this.input.question?.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) || 0;
    const currentTime = new Date().getTime();
    
    // 環境要因を加味
    const environmentFactor = this.environment ? 
      ((this.environment.weather?.temperature || 20) * 100 + this.environment.lunar.phase * 1000) : 0;
    
    return Math.floor(birthTime + nameValue + questionValue + currentTime + environmentFactor) % 1000000;
  }
}