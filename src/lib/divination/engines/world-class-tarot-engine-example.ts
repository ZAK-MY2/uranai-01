/**
 * World-Class Tarot Engine 使用例
 * 
 * このファイルは、新しいworld-class-tarot-engine.tsの使用方法を示します。
 */

import { WorldClassTarotEngine } from './world-class-tarot-engine';
import { DivinationInput, EnvironmentData } from '../base-engine';

// 使用例1: 基本的な3枚引き（過去・現在・未来）
async function basicThreeCardReading() {
  const input: DivinationInput = {
    fullName: '山田太郎',
    birthDate: new Date('1990-05-15'),
    birthPlace: '東京都',
    question: '今後の仕事の展望について教えてください',
    questionCategory: '仕事・転職',
    metadata: {
      spreadType: 'three-card',
      interpretationSchool: 'rider-waite',
      includeReversed: true,
      reversalProbability: 0.3,
      context: 'career',
      depthLevel: 'intermediate',
      includeElementalDignities: true,
      includeCrossAspects: false,
      useSecureRandom: true
    }
  };

  const environment: EnvironmentData = {
    lunar: {
      phase: 0.75,
      phaseName: '下弦の月',
      illumination: 75
    },
    weather: {
      condition: '晴れ',
      temperature: 22,
      humidity: 65
    }
  };

  const engine = new WorldClassTarotEngine(input, environment);
  const reading = await engine.calculate();

  console.log('=== 3枚引きリーディング結果 ===');
  console.log(`スプレッド: ${reading.spread.name}`);
  console.log('\n--- カードポジション ---');
  
  reading.cards.drawn.forEach((drawnCard, index) => {
    const orientation = drawnCard.isReversed ? '逆位置' : '正位置';
    console.log(`${reading.spread.positions[index]?.name}: ${drawnCard.card.name} (${orientation})`);
  });

  console.log('\n--- 解釈 ---');
  console.log(reading.interpretation.synthesis);
}

// 使用例2: ケルト十字（複雑なスプレッド）
async function celticCrossReading() {
  const input: DivinationInput = {
    fullName: '佐藤花子',
    birthDate: new Date('1985-12-03'),
    birthPlace: '大阪府',
    question: '恋愛関係の今後の発展について',
    questionCategory: '恋愛・結婚',
    metadata: {
      spreadType: 'celtic-cross',
      interpretationSchool: 'jungian', // ユング心理学的解釈
      includeReversed: true,
      reversalProbability: 0.3,
      context: 'love',
      depthLevel: 'advanced',
      includeElementalDignities: true,
      includeCrossAspects: true, // ケルト十字の複雑な関係性を含む
      useSecureRandom: true
    }
  };

  const engine = new WorldClassTarotEngine(input);
  const reading = await engine.calculate();

  console.log('=== ケルト十字リーディング結果 ===');
  console.log(`スプレッド: ${reading.spread.name} (${reading.cards.drawn.length}枚)`);

  // カード詳細
  reading.cards.drawn.forEach((drawnCard, index) => {
    const position = reading.spread.positions[index];
    const orientation = drawnCard.isReversed ? '逆位置' : '正位置';
    console.log(`\n${position?.name}: ${drawnCard.card.name} (${orientation})`);
    console.log(`意味: ${position?.meaning}`);
  });

  console.log('\n--- 統合解釈 ---');
  console.log(reading.interpretation.synthesis);

  console.log('\n--- エレメンタルディグニティ ---');
  if (reading.interpretation.elementalDignities) {
    reading.interpretation.elementalDignities.forEach(dignity => {
      console.log(`${dignity.relationship}: ${dignity.interpretation}`);
    });
  }
}

// 使用例3: 流派比較リーディング
async function schoolComparisonReading() {
  const input: DivinationInput = {
    fullName: '田中次郎',
    birthDate: new Date('1992-08-20'),
    birthPlace: '名古屋市',
    question: '転職のタイミングについて',
    questionCategory: '仕事・転職'
  };

  const schools = ['rider-waite', 'marseille', 'thoth', 'jungian'] as const;
  
  console.log('=== 流派別解釈比較 ===');

  for (const school of schools) {
    input.metadata = {
      spreadType: 'single',
      interpretationSchool: school,
      includeReversed: false,
      context: 'career',
      depthLevel: 'intermediate',
      useSecureRandom: true
    };

    const engine = new WorldClassTarotEngine(input);
    const reading = await engine.calculate();

    console.log(`\n--- ${school}流派 ---`);
    console.log(`カード: ${reading.cards.drawn[0].card.name}`);
    console.log(`解釈: ${reading.interpretation.cardMeanings[0]?.meaning.general}`);
  }
}

// 使用例4: 環境データ連携リーディング
async function environmentalReading() {
  const input: DivinationInput = {
    fullName: '鈴木美咲',
    birthDate: new Date('1988-03-15'),
    birthPlace: '札幌市',
    question: '今月の全体運について',
    questionCategory: '総合運',
    metadata: {
      spreadType: 'single',
      interpretationSchool: 'rider-waite',
      includeReversed: true,
      reversalProbability: 0.25,
      context: 'general',
      depthLevel: 'intermediate',
      useSecureRandom: true
    }
  };

  // 環境データを詳細に設定
  const environment: EnvironmentData = {
    lunar: {
      phase: 0.0, // 新月
      phaseName: '新月',
      illumination: 0,
      moonSign: '牡羊座',
      isVoidOfCourse: false,
      eclipseNearby: false
    },
    weather: {
      condition: '雪',
      temperature: -5,
      humidity: 80,
      pressure: 1020,
      windSpeed: 15,
      windDirection: '北',
      cloudCover: 90
    },
    planetary: {
      sunSign: '魚座',
      moonSign: '牡羊座',
      risingSign: '獅子座',
      retrogradeПlanets: ['水星', '火星'],
      dayRuler: '木星',
      hourRuler: '水星',
      planetaryHour: 3
    }
  };

  const engine = new WorldClassTarotEngine(input, environment);
  const reading = await engine.calculate();

  console.log('=== 環境連携リーディング結果 ===');
  const firstCard = reading.cards.drawn[0];
  const orientation = firstCard.isReversed ? '逆位置' : '正位置';
  console.log(`カード: ${firstCard.card.name} (${orientation})`);
  console.log(`基本解釈: ${reading.interpretation.synthesis}`);
  
  // 環境要因の影響（環境データが提供されている場合）
  console.log(`\n--- 環境要因の影響 ---`);
  console.log(`月相効果: ${environment.lunar.phaseName}の影響により、直感力が高まっています`);
  console.log(`天候効果: ${environment.weather?.condition}により、内省的なエネルギーが強化されています`);
  console.log(`惑星効果: ${environment.planetary?.retrogradeПlanets.join('、')}の逆行により、見直しの時期です`);
}

// すべての例を実行する関数
async function runAllExamples() {
  try {
    console.log('World-Class Tarot Engine 使用例の実行を開始します...\n');
    
    await basicThreeCardReading();
    console.log('\n' + '='.repeat(60) + '\n');
    
    await celticCrossReading();
    console.log('\n' + '='.repeat(60) + '\n');
    
    await schoolComparisonReading();
    console.log('\n' + '='.repeat(60) + '\n');
    
    await environmentalReading();
    
    console.log('\nすべての例の実行が完了しました。');
  } catch (error) {
    console.error('エラーが発生しました:', error);
  }
}

// モジュールが直接実行された場合に例を実行
if (require.main === module) {
  runAllExamples();
}

export {
  basicThreeCardReading,
  celticCrossReading,
  schoolComparisonReading,
  environmentalReading,
  runAllExamples
};