import { BaseDivinationEngine, DivinationInput, EnvironmentData } from '../base-engine';

// ルーン文字の定義（エルダー・フサルク24文字）
const RUNES = [
  { name: 'Fehu', symbol: 'ᚠ', meaning: '富・家畜', element: '火', interpretation: '物質的豊かさ、新しい始まり' },
  { name: 'Uruz', symbol: 'ᚢ', meaning: '野牛・力', element: '土', interpretation: '原始的な力、健康、活力' },
  { name: 'Thurisaz', symbol: 'ᚦ', meaning: '巨人・トール', element: '火', interpretation: '保護、警告、強力な力' },
  { name: 'Ansuz', symbol: 'ᚨ', meaning: '神・オーディン', element: '風', interpretation: 'コミュニケーション、知恵、インスピレーション' },
  { name: 'Raidho', symbol: 'ᚱ', meaning: '旅・車輪', element: '風', interpretation: '旅、動き、リズム' },
  { name: 'Kenaz', symbol: 'ᚲ', meaning: '松明・火', element: '火', interpretation: '知識、創造性、変容' },
  { name: 'Gebo', symbol: 'ᚷ', meaning: '贈り物', element: '風', interpretation: 'パートナーシップ、交換、バランス' },
  { name: 'Wunjo', symbol: 'ᚹ', meaning: '喜び', element: '土', interpretation: '幸福、調和、願望成就' },
  { name: 'Hagalaz', symbol: 'ᚺ', meaning: '雹', element: '水', interpretation: '破壊と再生、試練、変化' },
  { name: 'Nauthiz', symbol: 'ᚾ', meaning: '必要・制約', element: '火', interpretation: '必要性、制限、忍耐' },
  { name: 'Isa', symbol: 'ᛁ', meaning: '氷', element: '水', interpretation: '停滞、内省、明晰さ' },
  { name: 'Jera', symbol: 'ᛃ', meaning: '年・収穫', element: '土', interpretation: 'サイクル、報酬、正しいタイミング' },
  { name: 'Eihwaz', symbol: 'ᛇ', meaning: 'イチイの木', element: '全て', interpretation: '保護、忍耐、信頼性' },
  { name: 'Perthro', symbol: 'ᛈ', meaning: '運命・子宮', element: '水', interpretation: '運命、神秘、隠れたもの' },
  { name: 'Algiz', symbol: 'ᛉ', meaning: '保護・ヘラジカ', element: '風', interpretation: '保護、防御、高次の自己' },
  { name: 'Sowilo', symbol: 'ᛊ', meaning: '太陽', element: '火', interpretation: '成功、生命力、全体性' },
  { name: 'Tiwaz', symbol: 'ᛏ', meaning: 'ティール神・正義', element: '風', interpretation: '正義、犠牲、勇気' },
  { name: 'Berkano', symbol: 'ᛒ', meaning: '白樺・成長', element: '土', interpretation: '新しい始まり、成長、豊穣' },
  { name: 'Ehwaz', symbol: 'ᛖ', meaning: '馬', element: '土', interpretation: '動き、進歩、信頼' },
  { name: 'Mannaz', symbol: 'ᛗ', meaning: '人間', element: '風', interpretation: '自己、人類、協力' },
  { name: 'Laguz', symbol: 'ᛚ', meaning: '水・湖', element: '水', interpretation: '流れ、感情、直感' },
  { name: 'Ingwaz', symbol: 'ᛜ', meaning: 'イング神・豊穣', element: '土', interpretation: '豊穣、内なる成長、完成' },
  { name: 'Dagaz', symbol: 'ᛞ', meaning: '日・夜明け', element: '火', interpretation: '突破、変容、覚醒' },
  { name: 'Othala', symbol: 'ᛟ', meaning: '祖先・遺産', element: '土', interpretation: '遺産、家、伝統' }
];

export interface RuneReading {
  spread: {
    type: string;
    positions: Array<{
      position: string;
      rune: typeof RUNES[0];
      reversed: boolean;
      interpretation: string;
    }>;
  };
  elements: {
    fire: number;
    water: number;
    earth: number;
    wind: number;
  };
  overall: {
    message: string;
    guidance: string;
    challenges: string;
    opportunities: string;
  };
  timing: string;
  personalMessage?: string;
  environmentalInfluence?: string;
}

export class RunesEngine extends BaseDivinationEngine<RuneReading> {
  calculate(): RuneReading {
    // ルーンキャスト
    const spread = this.castRunes();
    
    // 要素分析
    const elements = this.analyzeElements(spread.positions);
    
    // 総合的な解釈
    const overall = this.generateOverallInterpretation(spread, elements);
    
    // タイミング
    const timing = this.calculateTiming(spread);
    
    // パーソナルメッセージ
    const personalMessage = this.generatePersonalMessage(spread);
    
    // 環境的影響
    const environmentalInfluence = this.getEnvironmentalInfluence(spread);

    return {
      spread,
      elements,
      overall,
      timing,
      personalMessage,
      environmentalInfluence
    };
  }

  private castRunes(): RuneReading['spread'] {
    const seed = this.generateSeed();
    let currentSeed = seed;
    
    // スプレッドタイプの決定（3ルーンスプレッド）
    const spreadType = 'ノルンの三姉妹（過去・現在・未来）';
    const positionNames = ['過去（ウルズ）', '現在（ヴェルザンディ）', '未来（スクルド）'];
    
    const positions: RuneReading['spread']['positions'] = [];
    const usedIndices = new Set<number>();
    
    for (let i = 0; i < 3; i++) {
      // ルーンを選ぶ
      let runeIndex: number;
      do {
        currentSeed = (currentSeed * 1103515245 + 12345) % 2147483648;
        runeIndex = Math.floor((currentSeed / 2147483648) * RUNES.length);
      } while (usedIndices.has(runeIndex));
      
      usedIndices.add(runeIndex);
      const rune = RUNES[runeIndex];
      
      // 逆位置の判定
      currentSeed = (currentSeed * 1103515245 + 12345) % 2147483648;
      const reversed = (currentSeed % 2) === 0;
      
      // 位置ごとの解釈
      const interpretation = this.interpretRuneInPosition(rune, positionNames[i], reversed);
      
      positions.push({
        position: positionNames[i],
        rune,
        reversed,
        interpretation
      });
    }
    
    return { type: spreadType, positions };
  }

  private interpretRuneInPosition(rune: typeof RUNES[0], position: string, reversed: boolean): string {
    let baseInterpretation = rune.interpretation;
    
    // 逆位置の場合
    if (reversed) {
      const reversedMeanings: Record<string, string> = {
        'Fehu': '損失、欲望の支配、物質主義への警告',
        'Uruz': '弱さ、病気、機会の喪失',
        'Thurisaz': '危険、悪意、無謀な行動',
        'Ansuz': '誤解、コミュニケーション不足、欺瞞',
        'Raidho': '停滞、計画の遅延、方向性の喪失',
        'Kenaz': '創造性の枯渇、病気、関係の終わり',
        'Gebo': '不均衡、犠牲、依存',
        'Wunjo': '悲しみ、失望、満たされない願望',
        'Hagalaz': '（逆位置なし - 常に変化を示す）',
        'Nauthiz': '極度の制限、貧困、絶望',
        'Isa': '（逆位置なし - 常に停滞を示す）',
        'Jera': '（逆位置なし - 常にサイクルを示す）',
        'Eihwaz': '混乱、不信、弱さ',
        'Perthro': '失望、秘密の暴露、閉塞感',
        'Algiz': '脆弱性、危険への無防備、警告の無視',
        'Sowilo': '（逆位置なし - 常に光を示す）',
        'Tiwaz': '不正義、紛争、臆病',
        'Berkano': '成長の停滞、不妊、家族問題',
        'Ehwaz': '不信、停滞、無謀な変化',
        'Mannaz': '自己中心性、孤立、操作',
        'Laguz': '感情の混乱、恐れ、毒された井戸',
        'Ingwaz': '（逆位置なし - 常に内的成長を示す）',
        'Dagaz': '（逆位置なし - 常に変容を示す）',
        'Othala': '疎外感、伝統の拒絶、ホームレス'
      };
      
      baseInterpretation = reversedMeanings[rune.name] || `${rune.interpretation}の逆の意味`;
    }
    
    // 位置による解釈の調整
    let positionInterpretation = '';
    
    if (position.includes('過去')) {
      positionInterpretation = `過去において、${baseInterpretation}という経験や影響がありました。`;
    } else if (position.includes('現在')) {
      positionInterpretation = `現在、${baseInterpretation}という状況にあります。`;
    } else if (position.includes('未来')) {
      positionInterpretation = `未来に向けて、${baseInterpretation}という展開が予想されます。`;
    }
    
    return positionInterpretation;
  }

  private analyzeElements(positions: RuneReading['spread']['positions']): RuneReading['elements'] {
    const elements = {
      fire: 0,
      water: 0,
      earth: 0,
      wind: 0
    };
    
    positions.forEach(pos => {
      switch (pos.rune.element) {
        case '火': elements.fire++; break;
        case '水': elements.water++; break;
        case '土': elements.earth++; break;
        case '風': elements.wind++; break;
        case '全て': 
          // Eihwazは全ての要素を含む
          elements.fire += 0.25;
          elements.water += 0.25;
          elements.earth += 0.25;
          elements.wind += 0.25;
          break;
      }
    });
    
    return elements;
  }

  private generateOverallInterpretation(
    spread: RuneReading['spread'],
    elements: RuneReading['elements']
  ): RuneReading['overall'] {
    const past = spread.positions[0];
    const present = spread.positions[1];
    const future = spread.positions[2];
    
    // 全体的なメッセージ
    let message = `${past.rune.name}（${past.rune.meaning}）から${present.rune.name}（${present.rune.meaning}）を経て、`;
    message += `${future.rune.name}（${future.rune.meaning}）へと向かう流れが示されています。`;
    
    // ガイダンス
    const guidance = this.generateGuidance(spread.positions);
    
    // 課題
    const challenges = this.identifyChallenges(spread.positions);
    
    // 機会
    const opportunities = this.identifyOpportunities(spread.positions);
    
    return { message, guidance, challenges, opportunities };
  }

  private generateGuidance(positions: RuneReading['spread']['positions']): string {
    const presentRune = positions[1];
    const futureRune = positions[2];
    
    let guidance = '';
    
    // 現在のルーンに基づくアドバイス
    const runeGuidance: Record<string, string> = {
      'Fehu': '物質的な基盤を大切にしながら、精神的な豊かさも追求しましょう',
      'Uruz': '内なる力を信じて、勇気を持って前進してください',
      'Thurisaz': '慎重さと大胆さのバランスを保ちながら行動しましょう',
      'Ansuz': 'コミュニケーションを大切にし、知恵を求めてください',
      'Raidho': '人生の旅を楽しみ、正しいリズムを見つけましょう',
      'Kenaz': '創造的なエネルギーを活用し、内なる光を輝かせてください',
      'Gebo': '与えることと受け取ることのバランスを保ちましょう',
      'Wunjo': '喜びを見つけ、それを他者と分かち合ってください',
      'Hagalaz': '変化を受け入れ、破壊から新しい創造が生まれることを信じましょう',
      'Nauthiz': '制限の中に学びがあることを理解し、忍耐強く進みましょう',
      'Isa': '一時的な停滞を内省の機会として活用してください',
      'Jera': '適切なタイミングを待ち、努力の実りを信じましょう',
      'Eihwaz': '信頼できる基盤を築き、着実に前進してください',
      'Perthro': '運命の流れを信頼し、直感に従って行動しましょう',
      'Algiz': '高次の自己とつながり、スピリチュアルな保護を求めてください',
      'Sowilo': '内なる太陽を輝かせ、成功への道を照らしましょう',
      'Tiwaz': '正義と勇気を持って、必要な犠牲を恐れずに進んでください',
      'Berkano': '新しい成長を育み、母なる地球とのつながりを大切にしましょう',
      'Ehwaz': 'パートナーシップを大切にし、信頼関係を築いてください',
      'Mannaz': '人間性を大切にし、他者との協力を求めましょう',
      'Laguz': '感情の流れに身を任せ、直感を信じてください',
      'Ingwaz': '内なる種を育て、適切な時期の開花を待ちましょう',
      'Dagaz': '新しい夜明けを迎える準備をし、変容を歓迎してください',
      'Othala': '自分のルーツを大切にし、受け継いだ遺産を活用しましょう'
    };
    
    guidance = runeGuidance[presentRune.rune.name] || '現在の状況を受け入れ、内なる知恵に従ってください。';
    
    // 逆位置の場合の追加アドバイス
    if (presentRune.reversed) {
      guidance += 'また、現在は挑戦的な時期ですが、これは成長の機会でもあります。';
    }
    
    // 未来に向けてのアドバイス
    if (!futureRune.reversed) {
      guidance += `未来の${futureRune.rune.name}が示す${futureRune.rune.meaning}に向けて準備を整えましょう。`;
    } else {
      guidance += '未来の課題に備えて、今から対策を講じることが大切です。';
    }
    
    return guidance;
  }

  private identifyChallenges(positions: RuneReading['spread']['positions']): string {
    const reversedRunes = positions.filter(p => p.reversed);
    
    if (reversedRunes.length === 0) {
      return '大きな障害は見当たりませんが、油断は禁物です。';
    }
    
    let challenges = '注意すべき課題：';
    reversedRunes.forEach((pos, index) => {
      if (index > 0) challenges += '、';
      challenges += `${pos.position}における${pos.rune.meaning}の逆の影響`;
    });
    
    return challenges;
  }

  private identifyOpportunities(positions: RuneReading['spread']['positions']): string {
    const positiveRunes = positions.filter(p => !p.reversed);
    
    if (positiveRunes.length === 0) {
      return '困難な時期ですが、それが大きな学びと成長の機会となります。';
    }
    
    let opportunities = '活用すべき機会：';
    
    // 特に吉兆とされるルーン
    const auspiciousRunes = ['Fehu', 'Wunjo', 'Jera', 'Sowilo', 'Dagaz', 'Ingwaz'];
    const hasAuspicious = positiveRunes.some(p => auspiciousRunes.includes(p.rune.name));
    
    if (hasAuspicious) {
      opportunities += '特に幸運なルーンが現れています。';
    }
    
    positiveRunes.forEach((pos, index) => {
      if (index === 0) {
        opportunities += `${pos.rune.meaning}のエネルギーを最大限に活用し`;
      } else {
        opportunities += `、${pos.rune.meaning}`;
      }
    });
    
    opportunities += 'を通じて成長してください。';
    
    return opportunities;
  }

  private calculateTiming(spread: RuneReading['spread']): string {
    const futureRune = spread.positions[2];
    
    // ルーンによるタイミングの示唆
    const timingIndicators: Record<string, string> = {
      'Fehu': '1〜2ヶ月以内に動きがあるでしょう',
      'Uruz': '力強い変化は3ヶ月以内に現れます',
      'Thurisaz': '突然の展開に備えてください（数週間以内）',
      'Ansuz': 'メッセージは近日中に届きます',
      'Raidho': '旅や移動は2〜3ヶ月後が最適',
      'Kenaz': '創造的な成果は6週間後に現れます',
      'Gebo': 'パートナーシップは1ヶ月以内に形成されます',
      'Wunjo': '喜びは間もなく訪れます（2〜3週間）',
      'Hagalaz': '変化は予測不能ですが、確実に訪れます',
      'Nauthiz': '忍耐が必要な期間は3〜6ヶ月',
      'Isa': '停滞期間は1〜2ヶ月続きます',
      'Jera': '収穫の時期は半年〜1年後',
      'Eihwaz': '着実な進展には4〜5ヶ月かかります',
      'Perthro': '運命的な出来事は予測不能な時期に',
      'Algiz': '保護期間は向こう3ヶ月間',
      'Sowilo': '成功は1〜2ヶ月以内に明らかに',
      'Tiwaz': '正義の実現には2〜4ヶ月',
      'Berkano': '新しい始まりは春（または3ヶ月後）',
      'Ehwaz': '進展は着実に、2ヶ月ごとに確認を',
      'Mannaz': '人間関係の変化は6週間以内',
      'Laguz': '感情的な解決には2〜3ヶ月',
      'Ingwaz': '内的成長の完成には半年',
      'Dagaz': '突破口は夜明けと共に（または1ヶ月以内）',
      'Othala': '遺産や伝統に関する事柄は長期的視点で'
    };
    
    let timing = timingIndicators[futureRune.rune.name] || '時期は流動的ですが、3ヶ月以内に明確になるでしょう。';
    
    if (futureRune.reversed) {
      timing += ' ただし、逆位置のため遅延や障害が予想されます。';
    }
    
    return timing;
  }

  private generatePersonalMessage(spread: RuneReading['spread']): string {
    if (!this.input.question) {
      return 'ルーンの古代の知恵があなたの道を照らしています。';
    }
    
    const { question, questionCategory } = this.input;
    const presentRune = spread.positions[1].rune;
    
    let message = `「${question}」について、${presentRune.name}（${presentRune.meaning}）のルーンは`;
    
    // カテゴリー別のメッセージ
    const categoryMessages: Record<string, string> = {
      '恋愛・結婚': this.getLoveMessage(spread),
      '仕事・転職': this.getCareerMessage(spread),
      '金運・財運': this.getWealthMessage(spread),
      '健康': this.getHealthMessage(spread),
      '総合運': this.getGeneralMessage(spread)
    };
    
    message += categoryMessages[questionCategory || '総合運'] || categoryMessages['総合運'];
    
    return message;
  }

  private getLoveMessage(spread: RuneReading['spread']): string {
    const present = spread.positions[1];
    const future = spread.positions[2];
    
    const loveRunes: Record<string, string> = {
      'Gebo': 'パートナーシップの本質を理解することが鍵です',
      'Wunjo': '喜びと調和に満ちた関係が築けるでしょう',
      'Berkano': '新しい関係の始まりや成長の時期です',
      'Mannaz': '相手を一人の人間として理解することが大切',
      'Laguz': '感情の流れに身を任せ、直感を信じてください'
    };
    
    let message = loveRunes[present.rune.name] || `${present.rune.meaning}のエネルギーが恋愛に影響しています。`;
    
    if (!future.reversed && future.rune.name === 'Gebo') {
      message += '将来的に素晴らしいパートナーシップが築けるでしょう。';
    }
    
    return message;
  }

  private getCareerMessage(spread: RuneReading['spread']): string {
    const present = spread.positions[1];
    
    const careerRunes: Record<string, string> = {
      'Fehu': '経済的成功と新しいプロジェクトの始まり',
      'Raidho': 'キャリアの旅路において正しい方向に進んでいます',
      'Kenaz': '創造的な才能を仕事に活かす時',
      'Jera': 'これまでの努力が実を結ぶ収穫の時期',
      'Tiwaz': 'リーダーシップと正義を持って進む時'
    };
    
    return careerRunes[present.rune.name] || `${present.rune.meaning}の質が仕事に反映されています。`;
  }

  private getWealthMessage(spread: RuneReading['spread']): string {
    const present = spread.positions[1];
    const future = spread.positions[2];
    
    const wealthRunes: Record<string, string> = {
      'Fehu': '物質的豊かさが訪れる兆し',
      'Jera': '投資や努力の成果が現れる時期',
      'Othala': '遺産や不動産に関する幸運',
      'Ingwaz': '将来の豊かさのための種まきの時'
    };
    
    let message = wealthRunes[present.rune.name] || `${present.rune.meaning}が財運に影響しています。`;
    
    if (present.reversed || future.reversed) {
      message += 'ただし、慎重な金銭管理が必要です。';
    }
    
    return message;
  }

  private getHealthMessage(spread: RuneReading['spread']): string {
    const present = spread.positions[1];
    
    const healthRunes: Record<string, string> = {
      'Uruz': '強い生命力と健康に恵まれています',
      'Kenaz': '病気からの回復、健康の改善',
      'Sowilo': '活力とエネルギーに満ちた状態',
      'Berkano': '癒しと再生のエネルギー'
    };
    
    return healthRunes[present.rune.name] || `${present.rune.meaning}の状態が健康に反映されています。`;
  }

  private getGeneralMessage(spread: RuneReading['spread']): string {
    const allRunes = spread.positions.map(p => p.rune.name).join('、');
    return `${allRunes}の組み合わせが、あなたの人生の現在の章を物語っています。古代の知恵に耳を傾けてください。`;
  }

  private getEnvironmentalInfluence(spread: RuneReading['spread']): string {
    if (!this.environment) return '';
    
    const weather = this.environment.weather;
    const season = this.getSeason();
    
    let influence = '自然環境との共鳴：';
    
    // 季節とルーンの関係
    const seasonalRunes: Record<string, string[]> = {
      '春': ['Berkano', 'Ingwaz', 'Jera'],
      '夏': ['Sowilo', 'Dagaz', 'Fehu'],
      '秋': ['Jera', 'Othala', 'Hagalaz'],
      '冬': ['Isa', 'Nauthiz', 'Eihwaz']
    };
    
    const currentSeasonRunes = seasonalRunes[season] || [];
    const hasSeasonalRune = spread.positions.some(p => currentSeasonRunes.includes(p.rune.name));
    
    if (hasSeasonalRune) {
      influence += `現在の${season}と調和するルーンが現れており、自然の流れに乗っています。`;
    }
    
    // 天候とルーンの関係
    if (weather) {
      if (weather.condition === 'clear' && spread.positions.some(p => p.rune.name === 'Sowilo')) {
        influence += '晴天とソウェイロ（太陽）のルーンが共鳴し、成功のエネルギーが高まっています。';
      } else if (weather.condition === 'rain' && spread.positions.some(p => p.rune.name === 'Laguz')) {
        influence += '雨とラグズ（水）のルーンが調和し、感情的な浄化が促されています。';
      }
    }
    
    return influence;
  }

  private getSeason(): string {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return '春';
    if (month >= 5 && month <= 7) return '夏';
    if (month >= 8 && month <= 10) return '秋';
    return '冬';
  }

  private generateSeed(): number {
    const birthTime = this.input.birthDate.getTime();
    const nameValue = this.input.fullName.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const questionValue = this.input.question?.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) || 0;
    const currentTime = new Date().getTime();
    
    // 北欧の緯度を意識した環境要因
    const environmentFactor = this.environment ? 
      ((this.environment.weather?.temperature || 10) * 50 + this.environment.lunar.phase * 500) : 0;
    
    return Math.floor(birthTime + nameValue + questionValue + currentTime + environmentFactor) % 1000000;
  }
}