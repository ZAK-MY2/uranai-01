import { BaseDivinationEngine, DivinationInput, EnvironmentData } from '../base-engine';
import {
  DivinationResultMap,
  MockDivinationResults,
  CommonTheme,
  Contradiction,
  Timeline,
  EnergyProfile,
  PriorityDivination,
  OverallFortune,
  CosmicPerspective,
  CategoryWeights,
  CategoryMessages,
  QuestionCategory,
  AnyDivinationResults,
  isMockResults,
  isFullResults,
  getNumerologyLifePath,
  getTarotCardName,
  getAstrologySign
} from '@/types/divination-common';

export interface IntegratedReading {
  // 各占術の要約
  summaries: {
    numerology: string;
    tarot: string;
    astrology: string;
    shichuSuimei: string;
    iChing: string;
    nineStarKi: string;
    runes: string;
    vedic: string;
    celtic: string;
    kabbalah: string;
  };
  
  // 統合分析
  synthesis: {
    // 共通テーマ
    commonThemes: Array<{
      theme: string;
      sources: string[];
      strength: 'strong' | 'medium' | 'subtle';
    }>;
    
    // 相反する要素
    contradictions: Array<{
      aspect: string;
      viewpoint1: { source: string; interpretation: string };
      viewpoint2: { source: string; interpretation: string };
      resolution: string;
    }>;
    
    // 時系列の流れ
    timeline: {
      past: { main: string; supporting: string[] };
      present: { main: string; supporting: string[] };
      future: { main: string; supporting: string[] };
    };
    
    // エネルギーの質
    energyProfile: {
      dominant: string;
      secondary: string;
      lacking: string;
      advice: string;
    };
  };
  
  // パーソナライズされた統合メッセージ
  integratedMessage: {
    coreMessage: string;
    actionSteps: string[];
    warnings: string[];
    opportunities: string[];
  };
  
  // 優先度の高い占術（質問に最も適した占術）
  priorityDivinations: Array<{
    name: string;
    reason: string;
    weight: number;
  }>;
  
  // 総合的な幸運度（0-100）
  overallFortune: {
    score: number;
    trend: 'rising' | 'stable' | 'declining';
    keyFactors: string[];
  };
  
  // 宇宙的な視点
  cosmicPerspective: {
    universalMessage: string;
    synchronicities: string[];
    spiritualGuidance: string;
  };
}

export class IntegratedEngine extends BaseDivinationEngine<IntegratedReading> {
  constructor(input: DivinationInput, environment?: EnvironmentData) {
    super(input, environment);
  }

  calculate(): IntegratedReading {
    // 同期版は軽量な計算結果を返す
    return this.calculateSync();
  }

  // 非同期版で動的インポートを使用
  async calculateAsync(): Promise<IntegratedReading> {
    // 動的インポートで各エンジンを読み込み
    const [
      { NumerologyEngine },
      { TarotEngine },
      { AstrologyEngine },
      { ShichuSuimeiEngine },
      { IChingEngine },
      { NineStarKiEngine },
      { RunesEngine },
      { VedicEngine },
      { CelticEngine },
      { KabbalahEngine }
    ] = await Promise.all([
      import('./numerology-engine'),
      import('./tarot-engine'),
      import('./astrology-engine'),
      import('./shichu-suimei-engine'),
      import('./iching-engine'),
      import('./nine-star-ki-engine'),
      import('./runes-engine'),
      import('./vedic-engine'),
      import('./celtic-engine'),
      import('./kabbalah-engine')
    ]);

    // エンジンを初期化
    const engines = {
      numerology: new NumerologyEngine(this.input, this.environment),
      tarot: new TarotEngine(this.input, this.environment),
      astrology: new AstrologyEngine(this.input, this.environment),
      shichuSuimei: new ShichuSuimeiEngine(this.input, this.environment),
      iChing: new IChingEngine(this.input, this.environment),
      nineStarKi: new NineStarKiEngine(this.input, this.environment),
      runes: new RunesEngine(this.input, this.environment),
      vedic: new VedicEngine(this.input, this.environment),
      celtic: new CelticEngine(this.input, this.environment),
      kabbalah: new KabbalahEngine(this.input, this.environment)
    };

    // 各占術の結果を計算
    const results = {
      numerology: engines.numerology.calculate(),
      tarot: engines.tarot.calculate(),
      astrology: engines.astrology.calculate(),
      shichuSuimei: engines.shichuSuimei.calculate(),
      iChing: engines.iChing.calculate(),
      nineStarKi: engines.nineStarKi.calculate(),
      runes: engines.runes.calculate(),
      vedic: engines.vedic.calculate(),
      celtic: engines.celtic.calculate(),
      kabbalah: engines.kabbalah.calculate()
    };

    // 各占術の要約を生成
    const summaries = this.generateSummaries(results);
    
    // 統合分析
    const synthesis = this.synthesizeResults(results);
    
    // パーソナライズされた統合メッセージ
    const integratedMessage = this.generateIntegratedMessage(results, synthesis);
    
    // 優先度の高い占術を決定
    const priorityDivinations = this.determinePriorityDivinations(results);
    
    // 総合的な幸運度を計算
    const overallFortune = this.calculateOverallFortune(results, synthesis);
    
    // 宇宙的な視点を生成
    const cosmicPerspective = this.generateCosmicPerspective(results, synthesis);

    return {
      summaries,
      synthesis,
      integratedMessage,
      priorityDivinations,
      overallFortune,
      cosmicPerspective
    };
  }

  // 軽量な同期版（バンドルサイズ最適化のため）
  private calculateSync(): IntegratedReading {
    // 基本的な占術結果をシミュレートする軽量版
    const mockResults = this.generateMockResults();
    
    // 各占術の要約を生成
    const summaries = this.generateSummaries(mockResults);
    
    // 統合分析
    const synthesis = this.synthesizeResults(mockResults);
    
    // パーソナライズされた統合メッセージ
    const integratedMessage = this.generateIntegratedMessage(mockResults, synthesis);
    
    // 優先度の高い占術を決定
    const priorityDivinations = this.determinePriorityDivinations(mockResults);
    
    // 総合的な幸運度を計算
    const overallFortune = this.calculateOverallFortune(mockResults, synthesis);
    
    // 宇宙的な視点を生成
    const cosmicPerspective = this.generateCosmicPerspective(mockResults, synthesis);

    return {
      summaries,
      synthesis,
      integratedMessage,
      priorityDivinations,
      overallFortune,
      cosmicPerspective
    };
  }

  // 軽量なモック結果生成
  private generateMockResults(): MockDivinationResults {
    const seed = this.generateSeed();
    
    return {
      numerology: {
        lifePathNumber: (seed % 9) + 1,
        interpretation: {
          lifePathMeaning: '人生の道筋を示す重要な数字です。'
        }
      },
      tarot: {
        positions: [{
          card: { name: '太陽', keywords: ['成功', '喜び', '活力'] }
        }]
      },
      astrology: {
        birthChart: {
          sun: { sign: '獅子座' },
          moon: { sign: '蟹座' }
        }
      },
      shichuSuimei: {
        fourPillars: {
          dayPillar: { stem: '甲', branch: '子' }
        }
      },
      iChing: {
        hexagram: { number: 1, name: '乾為天' }
      },
      nineStarKi: {
        mainStar: { name: '一白水星' }
      },
      runes: {
        spread: {
          positions: [{ name: 'フェフ' }]
        }
      },
      vedic: {
        birthChart: {
          moonNakshatra: { name: 'アシュヴィニー' }
        }
      },
      celtic: {
        birthTree: {
          tree: { name: 'オーク' }
        }
      },
      kabbalah: {
        lifePathSephira: {
          sephira: { name: 'ティファレト' }
        }
      }
    };
  }

  private generateSummaries(results: AnyDivinationResults): IntegratedReading['summaries'] {
    return {
      numerology: `生命数${results.numerology.lifePathNumber}が示す${results.numerology.interpretation?.lifePathMeaning?.split('。')[0] || '生命の道筋'}`,
      tarot: results.tarot.positions?.[0]?.card ? `${results.tarot.positions[0].card.name}から${results.tarot.positions[results.tarot.positions.length - 1]?.card?.name || '最終カード'}への流れ` : 'タロットの導き',
      astrology: `${results.astrology.birthChart?.sun?.sign || '太陽座'}の太陽と${results.astrology.birthChart?.moon?.sign || '月座'}の月の調和`,
      shichuSuimei: `${results.shichuSuimei?.fourPillars?.dayPillar?.stem || '甲'}${results.shichuSuimei?.fourPillars?.dayPillar?.branch || '子'}の命式`,
      iChing: `${results.iChing?.hexagram?.number || 1}番${results.iChing?.hexagram?.name || '乾為天'}の導き`,
      nineStarKi: `${results.nineStarKi?.mainStar?.name || '一白水星'}の本命星の影響`,
      runes: `${results.runes?.spread?.positions?.[0]?.name || 'フェフ'}のルーンが示す方向性`,
      vedic: `${results.vedic?.birthChart?.moonNakshatra?.name || 'アシュヴィニー'}のナクシャトラの恵み`,
      celtic: `${results.celtic?.birthTree?.tree?.name || 'オーク'}の樹木が持つ力`,
      kabbalah: `${results.kabbalah?.lifePathSephira?.sephira?.name || 'ティファレト'}のセフィラの教え`
    };
  }

  private synthesizeResults(results: AnyDivinationResults): IntegratedReading['synthesis'] {
    // 共通テーマを抽出
    const commonThemes = this.extractCommonThemes(results);
    
    // 相反する要素を見つける
    const contradictions = this.findContradictions(results);
    
    // 時系列の流れを統合
    const timeline = this.integrateTimeline(results);
    
    // エネルギープロファイルを作成
    const energyProfile = this.createEnergyProfile(results);

    return {
      commonThemes,
      contradictions,
      timeline,
      energyProfile
    };
  }

  private extractCommonThemes(results: AnyDivinationResults): IntegratedReading['synthesis']['commonThemes'] {
    const themes: Map<string, Set<string>> = new Map();
    
    // 各占術から主要なテーマを抽出
    // 数秘術
    if (results.numerology.lifePathNumber === 1 || results.numerology.destinyNumber === 1) {
      this.addTheme(themes, 'リーダーシップ', '数秘術');
    }
    if (results.numerology.lifePathNumber === 7 || results.numerology.soulNumber === 7) {
      this.addTheme(themes, '精神性', '数秘術');
    }
    
    // タロット
    const tarotPositions = 'positions' in results.tarot ? results.tarot.positions : [];
    tarotPositions.forEach((pos: any) => {
      if (pos?.card?.name?.includes('皇帝') || pos?.card?.name?.includes('戦車')) {
        this.addTheme(themes, 'リーダーシップ', 'タロット');
      }
      if (pos?.card?.name?.includes('隠者') || pos?.card?.name?.includes('月')) {
        this.addTheme(themes, '内省', 'タロット');
      }
    });
    
    // 西洋占星術
    const sunSign = results.astrology?.birthChart?.sun?.sign || '';
    if (sunSign.includes('獅子') || sunSign.includes('牡羊')) {
      this.addTheme(themes, 'リーダーシップ', '西洋占星術');
    }
    
    // より多くのテーマ抽出ロジック...
    
    // 強度を判定してテーマを配列に変換
    return Array.from(themes.entries()).map(([theme, sources]) => ({
      theme,
      sources: Array.from(sources),
      strength: (sources.size >= 4 ? 'strong' : sources.size >= 2 ? 'medium' : 'subtle') as 'strong' | 'medium' | 'subtle'
    })).sort((a, b) => b.sources.length - a.sources.length);
  }

  private addTheme(themes: Map<string, Set<string>>, theme: string, source: string) {
    if (!themes.has(theme)) {
      themes.set(theme, new Set());
    }
    themes.get(theme)!.add(source);
  }

  private findContradictions(results: AnyDivinationResults): IntegratedReading['synthesis']['contradictions'] {
    const contradictions: IntegratedReading['synthesis']['contradictions'] = [];
    
    // 例: タロットと易経の見解が異なる場合
    if (results.tarot?.interpretation?.synthesis?.includes('前進') && 
        results.iChing?.interpretation?.advice?.includes('待機')) {
      contradictions.push({
        aspect: '行動のタイミング',
        viewpoint1: {
          source: 'タロット',
          interpretation: '今は積極的に前進する時期'
        },
        viewpoint2: {
          source: '易経',
          interpretation: '慎重に待機し、時機を見計らうべき'
        },
        resolution: '内なる準備を整えながら、小さな一歩から始める'
      });
    }
    
    return contradictions;
  }

  private integrateTimeline(results: AnyDivinationResults): IntegratedReading['synthesis']['timeline'] {
    return {
      past: {
        main: '過去の経験が現在の土台となっている',
        supporting: [
          results.tarot.positions?.[0]?.card?.name || '過去のカード',
          results.celtic?.celticCross?.past || '過去の影響',
          `四柱推命の大運: ${results.shichuSuimei?.majorCycles?.past?.stem || '過去'}`
        ]
      },
      present: {
        main: '転換期にあり、新たな方向性を模索中',
        supporting: [
          results.numerology?.personalYear ? `パーソナルイヤー${results.numerology.personalYear.number}` : '現在',
          results.nineStarKi?.currentCycle?.energy || '現在のエネルギー',
          results.vedic?.currentDasha?.planetName || '現在の星の影響'
        ]
      },
      future: {
        main: '大きな成長と発展の可能性',
        supporting: [
          results.tarot.positions?.[results.tarot.positions?.length - 1]?.card?.name || '未来のカード',
          results.astrology?.forecast?.nextMonth || '来月の展望',
          results.iChing?.changingHexagram?.name || '変化の方向'
        ]
      }
    };
  }

  private createEnergyProfile(results: AnyDivinationResults): IntegratedReading['synthesis']['energyProfile'] {
    // エネルギーの分析（簡略版）
    const elements = {
      fire: 0,
      earth: 0,
      air: 0,
      water: 0
    };
    
    // 各占術からエレメントを集計
    // 西洋占星術
    if (results.astrology?.birthChart?.sunSign?.includes('牡羊') || 
        results.astrology?.birthChart?.sunSign?.includes('獅子') || 
        results.astrology?.birthChart?.sunSign?.includes('射手')) {
      elements.fire++;
    }
    
    // ケルト占術
    if (results.celtic?.birthTree?.tree?.element === '火') elements.fire++;
    if (results.celtic?.birthTree?.tree?.element === '地') elements.earth++;
    if (results.celtic?.birthTree?.tree?.element === '風') elements.air++;
    if (results.celtic?.birthTree?.tree?.element === '水') elements.water++;
    
    // 最も強い要素と弱い要素を特定
    const sorted = Object.entries(elements).sort((a, b) => b[1] - a[1]);
    const dominant = sorted[0][0];
    const lacking = sorted[3][0];
    
    return {
      dominant,
      secondary: sorted[1][0],
      lacking,
      advice: `${dominant}のエネルギーを活かしつつ、${lacking}の要素を意識的に取り入れましょう`
    };
  }

  private generateIntegratedMessage(
    results: AnyDivinationResults, 
    synthesis: IntegratedReading['synthesis']
  ): IntegratedReading['integratedMessage'] {
    const { question, questionCategory } = this.input;
    
    // カテゴリーごとのコアメッセージ
    const categoryMessages: CategoryMessages = {
      '恋愛・結婚': '愛の道は複雑ですが、あなたの内なる光が正しい方向を照らしています。',
      '仕事・転職': 'キャリアの転換点にあり、新たな可能性が開かれようとしています。',
      '金運・財運': '豊かさは内面から始まります。価値観の変革が物質的な豊かさをもたらします。',
      '健康': '心身のバランスを整えることで、自然治癒力が高まります。',
      '総合運': '宇宙はあなたの成長を支援しています。信頼して前進してください。'
    };
    
    const coreMessage = categoryMessages[questionCategory || '総合運'] || categoryMessages['総合運'];
    
    // アクションステップを生成
    const actionSteps = this.generateActionSteps(results, synthesis);
    
    // 警告事項
    const warnings = this.generateWarnings(results, synthesis);
    
    // 機会
    const opportunities = this.generateOpportunities(results, synthesis);
    
    return {
      coreMessage: `${question ? `「${question}」に対して、` : ''}${coreMessage}`,
      actionSteps,
      warnings,
      opportunities
    };
  }

  private generateActionSteps(results: AnyDivinationResults, synthesis: IntegratedReading['synthesis']): string[] {
    const steps: string[] = [];
    
    // 共通テーマに基づくアクション
    synthesis.commonThemes.forEach(theme => {
      if (theme.strength === 'strong') {
        switch (theme.theme) {
          case 'リーダーシップ':
            steps.push('リーダーシップを発揮する機会を積極的に求める');
            break;
          case '精神性':
            steps.push('瞑想や内省の時間を毎日設ける');
            break;
          case '変革':
            steps.push('古い習慣を手放し、新しいアプローチを試す');
            break;
        }
      }
    });
    
    // エネルギープロファイルに基づくアクション
    switch (synthesis.energyProfile.lacking) {
      case 'water':
        steps.push('感情的な繋がりを深め、直感を信頼する');
        break;
      case 'earth':
        steps.push('現実的な計画を立て、着実に実行する');
        break;
      case 'air':
        steps.push('新しいアイデアを積極的に取り入れ、コミュニケーションを増やす');
        break;
      case 'fire':
        steps.push('情熱を持って行動し、勇気を出して挑戦する');
        break;
    }
    
    return steps.slice(0, 3); // 最大3つのアクション
  }

  private generateWarnings(results: AnyDivinationResults, synthesis: IntegratedReading['synthesis']): string[] {
    const warnings: string[] = [];
    
    // 矛盾から生じる注意点
    synthesis.contradictions.forEach(contradiction => {
      warnings.push(`${contradiction.aspect}において慎重な判断が必要`);
    });
    
    // 各占術からの警告
    const tarotPositions = 'positions' in results.tarot ? results.tarot.positions : [];
    if (tarotPositions.some((p: any) => p?.card?.name === '塔')) {
      warnings.push('急激な変化に備える必要があります');
    }
    
    if (results.shichuSuimei?.warnings?.length > 0) {
      warnings.push(...results.shichuSuimei.warnings.slice(0, 1));
    }
    
    return warnings.slice(0, 2); // 最大2つの警告
  }

  private generateOpportunities(results: AnyDivinationResults, synthesis: IntegratedReading['synthesis']): string[] {
    const opportunities: string[] = [];
    
    // タイムラインから機会を抽出
    if (synthesis.timeline.future.main.includes('成長')) {
      opportunities.push('個人的な成長と発展の大きなチャンス');
    }
    
    // 幸運な惑星配置
    if ('astrology' in results && results.astrology && 'currentTransits' in results.astrology && 
        Array.isArray((results.astrology as any).currentTransits) && 
        (results.astrology as any).currentTransits.some((t: string) => t?.includes('木星'))) {
      opportunities.push('拡大と幸運のエネルギーが味方している');
    }
    
    // 数秘術のサイクル
    if (results.numerology?.personalYear?.number === 1) {
      opportunities.push('新しいプロジェクトを始める絶好のタイミング');
    }
    
    return opportunities.slice(0, 3); // 最大3つの機会
  }

  private determinePriorityDivinations(results: AnyDivinationResults): IntegratedReading['priorityDivinations'] {
    const { questionCategory } = this.input;
    
    // カテゴリーごとの占術の重み付け
    const weights: CategoryWeights = {
      '恋愛・結婚': {
        tarot: 0.9,
        astrology: 0.8,
        numerology: 0.7,
        celtic: 0.6,
        vedic: 0.5
      },
      '仕事・転職': {
        numerology: 0.9,
        shichuSuimei: 0.8,
        iChing: 0.7,
        nineStarKi: 0.6,
        kabbalah: 0.5
      },
      '金運・財運': {
        shichuSuimei: 0.9,
        nineStarKi: 0.8,
        numerology: 0.7,
        iChing: 0.6,
        vedic: 0.5
      },
      '健康': {
        nineStarKi: 0.9,
        celtic: 0.8,
        vedic: 0.7,
        shichuSuimei: 0.6,
        kabbalah: 0.5
      },
      '総合運': {
        numerology: 0.8,
        tarot: 0.8,
        astrology: 0.8,
        shichuSuimei: 0.7,
        iChing: 0.7
      }
    };
    
    const categoryWeights = weights[questionCategory || '総合運'] || weights['総合運'];
    
    return Object.entries(categoryWeights)
      .map(([name, weight]) => ({
        name: this.getDivinationDisplayName(name),
        reason: this.getDivinationReason(name, questionCategory || '総合運'),
        weight
      }))
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 3);
  }

  private getDivinationDisplayName(key: string): string {
    const names: Record<string, string> = {
      numerology: '数秘術',
      tarot: 'タロット',
      astrology: '西洋占星術',
      shichuSuimei: '四柱推命',
      iChing: '易経',
      nineStarKi: '九星気学',
      runes: 'ルーン',
      vedic: 'ヴェーダ占星術',
      celtic: 'ケルト占術',
      kabbalah: 'カバラ'
    };
    return names[key] || key;
  }

  private getDivinationReason(divination: string, category: string): string {
    const reasons: Record<string, Record<string, string>> = {
      '恋愛・結婚': {
        tarot: '恋愛の深層心理と未来の可能性を映し出す',
        astrology: '相性と恋愛運のタイミングを正確に示す'
      },
      '仕事・転職': {
        numerology: '才能と適職を数値的に明確化',
        shichuSuimei: '命式から見る天職と成功時期'
      }
      // 他のカテゴリー...
    };
    
    return reasons[category]?.[divination] || '総合的な視点を提供';
  }

  private calculateOverallFortune(
    results: AnyDivinationResults, 
    synthesis: IntegratedReading['synthesis']
  ): IntegratedReading['overallFortune'] {
    let score = 50; // 基準値
    const keyFactors: string[] = [];
    
    // ポジティブな要因
    if (synthesis.commonThemes.some(t => t.strength === 'strong' && t.theme === '成功')) {
      score += 15;
      keyFactors.push('強い成功の兆し');
    }
    
    if (results.numerology?.personalYear?.number === 1 || results.numerology?.personalYear?.number === 8) {
      score += 10;
      keyFactors.push('幸運なパーソナルイヤー');
    }
    
    const tarotPositions2 = 'positions' in results.tarot ? results.tarot.positions : [];
    if (tarotPositions2.some((p: any) => p?.card?.name === '太陽' || p?.card?.name === '世界')) {
      score += 10;
      keyFactors.push('幸運のタロットカード');
    }
    
    // ネガティブな要因
    if (synthesis.contradictions.length > 2) {
      score -= 10;
      keyFactors.push('複数の矛盾要素');
    }
    
    if (results.shichuSuimei?.currentLuck?.pillar?.includes('沖')) {
      score -= 5;
      keyFactors.push('運気の衝突');
    }
    
    // トレンドの判定
    let trend: 'rising' | 'stable' | 'declining' = 'stable';
    if (synthesis.timeline.future.main.includes('成長') || synthesis.timeline.future.main.includes('発展')) {
      trend = 'rising';
    } else if (synthesis.timeline.present.main.includes('停滞') || synthesis.timeline.present.main.includes('困難')) {
      trend = 'declining';
    }
    
    return {
      score: Math.max(0, Math.min(100, score)),
      trend,
      keyFactors
    };
  }

  private generateCosmicPerspective(
    results: AnyDivinationResults,
    synthesis: IntegratedReading['synthesis']
  ): IntegratedReading['cosmicPerspective'] {
    // 宇宙的なメッセージ
    const universalMessage = this.createUniversalMessage(results, synthesis);
    
    // シンクロニシティ
    const synchronicities = this.findSynchronicities(results);
    
    // スピリチュアルガイダンス
    const spiritualGuidance = this.generateSpiritualGuidance(results, synthesis);
    
    return {
      universalMessage,
      synchronicities,
      spiritualGuidance
    };
  }

  private createUniversalMessage(results: AnyDivinationResults, synthesis: IntegratedReading['synthesis']): string {
    const moonPhase = this.environment?.lunar.phase || 0.5;
    let message = '';
    
    if (moonPhase < 0.25) {
      message = '新月のエネルギーが新しい始まりを後押ししています。';
    } else if (moonPhase < 0.5) {
      message = '月が満ちていくように、あなたの可能性も拡大しています。';
    } else if (moonPhase < 0.75) {
      message = '満月の光があなたの真実を照らし出しています。';
    } else {
      message = '月が欠けていく時、不要なものを手放す勇気が与えられます。';
    }
    
    if (synthesis.commonThemes[0]?.strength === 'strong') {
      message += `特に${synthesis.commonThemes[0].theme}のテーマが、宇宙からの重要なメッセージとして響いています。`;
    }
    
    return message;
  }

  private findSynchronicities(results: AnyDivinationResults): string[] {
    const synchronicities: string[] = [];
    
    // 同じ数字の繰り返し
    if (results.numerology?.lifePathNumber === results.numerology?.destinyNumber) {
      synchronicities.push(`生命数と運命数が同じ${results.numerology.lifePathNumber}で共鳴`);
    }
    
    // 同じ要素の繰り返し
    const elements: string[] = [];
    if (results.celtic?.birthTree?.tree?.element) elements.push(results.celtic.birthTree.tree.element);
    if (results.celtic?.animalTotem?.primary?.element) elements.push(results.celtic.animalTotem.primary.element);
    
    const elementCounts = elements.reduce((acc: Record<string, number>, el) => {
      acc[el] = (acc[el] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    Object.entries(elementCounts).forEach(([element, count]) => {
      if (count >= 3) {
        synchronicities.push(`${element}の要素が複数の占術で顕現`);
      }
    });
    
    // 特定のシンボルの繰り返し
    const tarotPositions3 = 'positions' in results.tarot ? results.tarot.positions : [];
    if (tarotPositions3.some((p: any) => p?.card?.name?.includes('星')) &&
        results.nineStarKi?.mainStar?.name?.includes('星')) {
      synchronicities.push('「星」のシンボルが複数現れ、導きの光を示す');
    }
    
    return synchronicities;
  }

  private generateSpiritualGuidance(
    results: AnyDivinationResults,
    synthesis: IntegratedReading['synthesis']
  ): string {
    const guidances: string[] = [
      '宇宙はあなたの最高の善のために働いています。',
      'すべての経験は魂の成長のための贈り物です。',
      '内なる声に耳を傾け、直感を信頼してください。',
      '今この瞬間に感謝し、存在の奇跡を感じてください。',
      'あなたは宇宙の一部であり、無限の可能性を秘めています。'
    ];
    
    // 最も適切なガイダンスを選択
    if (synthesis.energyProfile.dominant === 'fire') {
      return '情熱の炎を燃やし続けながら、他者への思いやりも忘れずに。';
    } else if (synthesis.energyProfile.dominant === 'water') {
      return '感情の流れに身を任せながら、内なる平和を保ってください。';
    } else if (synthesis.energyProfile.dominant === 'air') {
      return '思考の翼を広げて飛翔しながら、地に足をつけることも大切に。';
    } else if (synthesis.energyProfile.dominant === 'earth') {
      return '大地のように安定した基盤を築きながら、柔軟性も保ってください。';
    }
    
    // デフォルト
    const seed = this.generateSeed();
    return guidances[seed % guidances.length];
  }

  private generateSeed(): number {
    const birthTime = this.input.birthDate.getTime();
    const nameValue = this.input.fullName.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const currentTime = new Date().getTime();
    
    return Math.floor((birthTime + nameValue + currentTime) * 10) % 1000000;
  }
}