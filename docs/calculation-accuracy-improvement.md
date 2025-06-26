# 占術計算精度向上計画

## 🎯 現在の計算精度問題

### 占星術エンジンの問題
```typescript
// 現在の不正確な実装
const basePosition = (seed % 360);  // ❌ ランダム要素
const movement = (daysSinceBirth / period) * 360;  // ❌ 単純計算

// 必要な正確な計算要素
- 正確な天体暦データ（Swiss Ephemeris）
- 出生地の緯度経度による補正
- 春分点歳差の考慮
- 楕円軌道の離心率補正
- アスペクト角度の正確な計算
```

### Nine Star Ki計算の問題
```typescript
// 現在の簡易実装
const adjustedYear = (birthMonth < 1 || (birthMonth === 1 && birthDay < 4)) ? birthYear - 1 : birthYear;
// ❌ 立春の正確な日時を考慮していない

// 正確な立春計算が必要
- 各年の立春正確時刻
- 地域別時差の考慮
- 月命星・日命星の正確な算出
```

## 📚 信頼できる計算式ソース

### 1. 占星術
**一次ソース**:
- Swiss Ephemeris（スイス天体暦）
- NASA JPL Planetary Ephemeris
- Astronomical Algorithms (Jean Meeus)

**検証用ソース**:
- TimePassages Pro
- Solar Fire（プロ占星術ソフト）
- 日本占星術協会の計算基準

**正確な計算式**:
```typescript
// 太陽位置の正確な計算例
interface AccurateAstrologyCalculation {
  solarPosition: {
    longitude: number;        // 黄経（0-360度）
    latitude: number;         // 黄緯
    distance: number;         // 地球からの距離（AU）
    apparentLongitude: number; // 視黄経（光行差補正）
  };
  
  houseDivision: {
    system: 'Placidus' | 'Koch' | 'Equal' | 'Whole';
    ascendant: number;        // 上昇点
    midheaven: number;        // 天頂
    houses: number[];         // 12ハウスの境界度数
  };
  
  aspects: {
    orbs: Record<string, number>; // 許容誤差
    strength: number;         // アスペクトの強度
  };
}
```

### 2. Nine Star Ki
**正確な計算基準**:
```typescript
// 立春の正確な計算
interface AccurateNineStarCalculation {
  solarTerms: {
    springBeginning: Date;    // 各年の立春正確時刻
    timezone: string;         // 地域タイムゾーン
  };
  
  starCalculation: {
    mainStar: number;         // 本命星
    monthlyStar: number;      // 月命星
    dailyStar: number;        // 日命星
    hourStar: number;         // 時命星
  };
  
  directionEnergy: {
    year: Record<string, number>; // 年盤
    month: Record<string, number>; // 月盤
    day: Record<string, number>;   // 日盤
  };
}
```

### 3. 四柱推命（Shichu Suimei）
**正確な暦法計算**:
```typescript
interface AccurateShichuSuimei {
  lunarCalendar: {
    year: { stem: string; branch: string };
    month: { stem: string; branch: string };
    day: { stem: string; branch: string };
    hour: { stem: string; branch: string };
  };
  
  elements: {
    dayMaster: string;        // 日主
    strength: number;         // 強弱
    seasonalAdjustment: number; // 季節調整
  };
  
  tenGods: {
    official: string;         // 正官
    wealth: string;          // 正財
    // 他の十神
  };
}
```

## 🔧 実装計画

### Phase 1: 計算式検証システム構築
```typescript
// 計算精度テストフレームワーク
class CalculationAccuracyValidator {
  validateAstrology(input: DivinationInput): ValidationResult {
    // 複数ソースとの照合
    const swissEphemerisResult = this.calculateSwissEphemeris(input);
    const nasaJplResult = this.calculateNasaJpl(input);
    const timePassagesResult = this.referenceTimePassages(input);
    
    return this.compareResults([
      swissEphemerisResult,
      nasaJplResult,
      timePassagesResult
    ]);
  }
  
  validateNineStarKi(input: DivinationInput): ValidationResult {
    // 正確な立春計算
    const solarTerms = this.calculateSolarTerms(input.birthDate.getFullYear());
    const accurateMainStar = this.calculateAccurateMainStar(input, solarTerms);
    
    // 既存実装との比較
    const currentResult = this.currentImplementation(input);
    
    return {
      accuracy: this.calculateAccuracy(accurateMainStar, currentResult),
      corrections: this.suggestCorrections(accurateMainStar, currentResult)
    };
  }
}
```

### Phase 2: 正確な計算エンジン実装
```bash
# 外部ライブラリ活用
npm install swisseph          # Swiss Ephemeris
npm install astronomia        # 天文計算ライブラリ
npm install chinese-calendar  # 中国暦計算
npm install solar-terms       # 二十四節気計算
```

### Phase 3: 段階的精度向上
1. **Week 1**: 占星術計算精度向上（Swiss Ephemeris統合）
2. **Week 2**: Nine Star Ki立春計算修正
3. **Week 3**: 四柱推命暦法計算実装
4. **Week 4**: 全占術クロス検証完了

## 📊 検証基準

### 精度目標
- **占星術**: 天体位置誤差±1度以内
- **Nine Star Ki**: 本命星100%一致
- **四柱推命**: 干支100%一致
- **I-Ching**: 卦象変換100%一致

### 検証方法
```typescript
// 自動テストスイート
describe('計算精度テスト', () => {
  const testCases = [
    { birthDate: '1990-01-01', expected: { sunSign: '山羊座' } },
    { birthDate: '1985-07-15', expected: { nineStarKi: 7 } },
    // 100ケース以上のテストデータ
  ];
  
  testCases.forEach(testCase => {
    it(`${testCase.birthDate}の計算精度確認`, () => {
      const result = calculateAccurate(testCase.birthDate);
      expect(result).toMatchExpected(testCase.expected);
    });
  });
});
```

## 🚀 即座実行可能なアクション

### 1. 占星術精度向上（最優先）
```bash
# Swiss Ephemeris統合
npm install swisseph
# 正確な天体位置計算実装
```

### 2. Nine Star Ki立春修正
```typescript
// 正確な立春計算実装
const solarTerms2024 = {
  springBeginning: new Date('2024-02-04T16:27:00+09:00')
};
```

### 3. 計算精度テスト実装
```bash
# テストデータ準備
node scripts/generate-accuracy-test-data.js
npm test -- --grep "計算精度"
```

この計算精度向上により、**各占術の信頼性が飛躍的に向上**し、メッセージ品質と相まって市場競争力が大幅に強化されます。