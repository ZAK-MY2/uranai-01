# COSMIC ORACLE 占術アルゴリズム技術解説書

## 📖 概要

このドキュメントでは、COSMIC ORACLEプロジェクトで実装されている8つの占術システムの**新しい高精度アルゴリズム**について、中級プログラマー向けに技術的詳細を解説します。

---

## 🧮 1. 数秘術（Numerology）- ピタゴラス式数値還元アルゴリズム

### **アルゴリズム概要**
数秘術では、生年月日や名前を数値に変換し、特定の意味を持つ1桁または特別な「マスターナンバー」に還元します。

### **技術実装**

#### **ライフパスナンバー計算**
```typescript
function calculateLifePathNumber(birthDate: Date): number {
  const year = birthDate.getFullYear();
  const month = birthDate.getMonth() + 1;
  const day = birthDate.getDate();
  
  // 各数値の桁を分解して合計
  const yearSum = digitSum(year);
  const monthSum = digitSum(month);
  const daySum = digitSum(day);
  
  const total = yearSum + monthSum + daySum;
  
  // マスターナンバー（11, 22, 33）チェック
  if ([11, 22, 33].includes(total)) {
    return total;
  }
  
  // 1桁になるまで還元
  return reduceToSingleDigit(total);
}

function digitSum(num: number): number {
  return num.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
}

function reduceToSingleDigit(num: number): number {
  while (num >= 10) {
    num = digitSum(num);
  }
  return num;
}
```

**解説**: この再帰的な桁数合計アルゴリズムは、任意の数値を1桁（または特別な例外）に還元します。時間計算量はO(log n)、空間計算量はO(1)です。

---

## 🌙 2. 西洋占星術（Astrology）- Swiss Ephemeris統合システム

### **アルゴリズム概要**
高精度な天体位置計算にSwiss Ephemerisライブラリを使用し、プラシダス・ハウスシステムで12のハウスを計算します。

### **技術実装**

#### **精密月星座計算**
```typescript
import { swe_calc_ut, swe_houses_ex } from 'swisseph';

interface AstrologyCalculation {
  moonSign: string;
  ascendant: string;
  houses: number[];
}

function calculatePreciseAstrology(
  julianDay: number,
  latitude: number,
  longitude: number
): AstrologyCalculation {
  // 月の位置計算（Swiss Ephemeris）
  const moonPosition = swe_calc_ut(
    julianDay,
    SE_MOON,    // 月の天体番号
    SEFLG_SWIEPH | SEFLG_SPEED  // 高精度フラグ
  );
  
  // プラシダス・ハウス計算
  const houseData = swe_houses_ex(
    julianDay,
    SEFLG_SWIEPH,
    latitude,
    longitude,
    'P'  // Placidus system
  );
  
  return {
    moonSign: calculateZodiacSign(moonPosition.longitude),
    ascendant: calculateZodiacSign(houseData.cusps[1]),
    houses: houseData.cusps
  };
}

function calculateZodiacSign(longitude: number): string {
  const signs = ['牡羊座', '牡牛座', '双子座', /* ... */];
  const signIndex = Math.floor(longitude / 30);
  return signs[signIndex];
}
```

**解説**: Swiss Ephemerisは1ミリ秒角の精度を持つ天体暦です。プラシダス方式では、天体の日周運動を時間で3等分してハウスを決定します。

#### **上昇星座（アセンダント）の精密計算**
```typescript
function calculateAscendant(
  siderealTime: number,
  latitude: number,
  obliquity: number
): number {
  // 恒星時から上昇星座を計算
  const ramc = siderealTime * 15; // 時間を度に変換
  
  // 球面三角法による計算
  const tanAsc = Math.cos(ramc) / (Math.cos(obliquity) * Math.tan(latitude) + Math.sin(obliquity) * Math.sin(ramc));
  
  let ascendant = Math.atan(tanAsc) * 180 / Math.PI;
  
  // 象限調整
  if (Math.cos(ramc) < 0) ascendant += 180;
  if (ascendant < 0) ascendant += 360;
  
  return ascendant;
}
```

**解説**: 球面三角法を使用した数学的に正確な計算です。地球の自転と天体の見かけの動きを考慮します。

---

## 🎯 3. 易経（I Ching）- 確率論的爻生成システム

### **アルゴリズム概要**
筮竹法の伝統的確率分布を再現し、6本の爻（こう）から64卦を生成します。

### **技術実装**

#### **筮竹法確率分布**
```typescript
enum LineType {
  OLD_YIN = 6,    // 老陰（変爻）: 1/16確率
  YOUNG_YANG = 7, // 少陽（固定）: 5/16確率  
  YOUNG_YIN = 8,  // 少陰（固定）: 7/16確率
  OLD_YANG = 9    // 老陽（変爻）: 3/16確率
}

function generateYarrowStalkLine(random: () => number): LineType {
  const r = random();
  
  if (r < 1/16) return LineType.OLD_YIN;
  if (r < 6/16) return LineType.YOUNG_YANG;  // 1/16 + 5/16
  if (r < 13/16) return LineType.YOUNG_YIN; // 6/16 + 7/16
  return LineType.OLD_YANG;
}

function generateHexagram(method: 'yarrow' | 'coins'): IChingLine[] {
  const lines: IChingLine[] = [];
  
  for (let i = 0; i < 6; i++) {
    const lineValue = method === 'yarrow' ? 
      generateYarrowStalkLine(Math.random) :
      generateCoinLine(Math.random);
    
    lines.push({
      value: lineValue,
      type: lineValue % 2 === 0 ? 'yin' : 'yang',
      changing: lineValue === 6 || lineValue === 9,
      meaning: getLineMeaning(lineValue)
    });
  }
  
  return lines;
}
```

**解説**: 筮竹法と三枚銭法では確率分布が異なります。筮竹法は変爻（changing lines）の出現確率が低く、より安定した卦を生成する傾向があります。

#### **64卦マッピングアルゴリズム**
```typescript
function mapToHexagram(lines: IChingLine[]): number {
  // 下卦（初爻〜三爻）と上卦（四爻〜六爻）を8卦にマッピング
  const lowerTrigram = calculateTrigram(lines.slice(0, 3));
  const upperTrigram = calculateTrigram(lines.slice(3, 6));
  
  // King Wen順序での64卦番号計算
  return HEXAGRAM_MAPPING[upperTrigram][lowerTrigram];
}

function calculateTrigram(lines: IChingLine[]): number {
  // 3本の爻を3ビットの二進数として扱う
  let trigram = 0;
  for (let i = 0; i < 3; i++) {
    if (lines[i].type === 'yang') {
      trigram |= (1 << i);
    }
  }
  return trigram;
}
```

**解説**: 各卦は上下2つの三爻（トライグラム）で構成されます。ビット演算を使用して効率的に8卦の組み合わせを計算します。

---

## 🃏 4. タロット占い（Tarot）- 物理シャッフル・シミュレーション

### **アルゴリズム概要**
物理的なカードシャッフルをシミュレートし、実際の逆位置確率（約25%）を再現します。

### **技術実装**

#### **リフルシャッフル・シミュレーション**
```typescript
class PhysicalDeck {
  private cards: TarotCard[];
  private orientations: boolean[]; // true = upright, false = reversed
  
  riffleShhuffle(): void {
    const midpoint = Math.floor(this.cards.length / 2);
    const leftHalf = this.cards.slice(0, midpoint);
    const rightHalf = this.cards.slice(midpoint);
    
    const shuffled: TarotCard[] = [];
    const newOrientations: boolean[] = [];
    
    let leftIndex = 0, rightIndex = 0;
    
    while (leftIndex < leftHalf.length || rightIndex < rightHalf.length) {
      // リフル確率（物理的なカード落下をシミュレート）
      const dropFromLeft = Math.random() < 0.5;
      
      if (dropFromLeft && leftIndex < leftHalf.length) {
        shuffled.push(leftHalf[leftIndex]);
        // 50%の確率でカードが回転（半分をひっくり返してシャッフル）
        newOrientations.push(this.orientations[leftIndex] !== (Math.random() < 0.5));
        leftIndex++;
      } else if (rightIndex < rightHalf.length) {
        shuffled.push(rightHalf[rightIndex]);
        newOrientations.push(this.orientations[midpoint + rightIndex]);
        rightIndex++;
      }
    }
    
    this.cards = shuffled;
    this.orientations = newOrientations;
  }
}
```

**解説**: 実際のリフルシャッフルでは、デッキを半分に分けて交互に落とします。カードの向きの変化は物理的なシャッフル過程で自然に発生します。

#### **スクランブル・シャッフル（テーブル散布法）**
```typescript
function scrambleShuffle(deck: TarotCard[]): { card: TarotCard, isReversed: boolean }[] {
  const positions: Array<{x: number, y: number, rotation: number}> = [];
  
  // カードをテーブル上にランダム配置
  for (let i = 0; i < deck.length; i++) {
    positions.push({
      x: Math.random() * TABLE_WIDTH,
      y: Math.random() * TABLE_HEIGHT,
      rotation: Math.random() * 360 // 0-360度回転
    });
  }
  
  // 物理的な集め方をシミュレート（螺旋状に集める）
  const collectionOrder = calculateSpiralCollection(positions);
  
  return collectionOrder.map(index => ({
    card: deck[index],
    // 90-270度の範囲にあるカードは逆位置
    isReversed: positions[index].rotation > 90 && positions[index].rotation < 270
  }));
}
```

**解説**: テーブル散布法では、カードがランダムな向きで散らばるため、約25%が逆位置になります。これは実際の物理法則に基づいた確率です。

---

## 🀄 5. 四柱推命（Shichu Suimei）- 時差補正・暦法システム

### **アルゴリズム概要**
地方時差、夏時間、真太陽時の3段階補正を行い、正確な干支を計算します。

### **技術実装**

#### **時差補正アルゴリズム**
```typescript
interface TimeCorrection {
  localTimeDifference: number;  // 地方時差（分）
  summerTimeOffset: number;     // 夏時間補正（分）
  equationOfTime: number;       // 均時差（分）
}

function calculateTimeCorrection(
  date: Date,
  longitude: number
): TimeCorrection {
  // 1. 地方時差計算（明石市135°E基準）
  const localTimeDiff = (longitude - 135) * 4; // 1度 = 4分
  
  // 2. 夏時間補正（1948-1951年）
  const summerTimeOffset = isSummerTimePeriod(date) ? -60 : 0;
  
  // 3. 均時差計算（真太陽時補正）
  const dayOfYear = getDayOfYear(date);
  const equationOfTime = calculateEquationOfTime(dayOfYear);
  
  return {
    localTimeDifference: localTimeDiff,
    summerTimeOffset: summerTimeOffset,
    equationOfTime: equationOfTime
  };
}

function calculateEquationOfTime(dayOfYear: number): number {
  // 地球の楕円軌道による時差
  const B = 2 * Math.PI * (dayOfYear - 81) / 365;
  
  return 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);
}
```

**解説**: 地球の楕円軌道により、太陽時と平均太陽時には最大±16分のずれが生じます。これを均時差として補正します。

#### **正確な干支計算**
```typescript
function calculateStemBranch(correctedDateTime: Date): StemBranch {
  // 1. 基準日からの通日計算
  const baseDate = new Date(1984, 1, 2); // 甲子年元日
  const daysDiff = Math.floor((correctedDateTime.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // 2. 60干支サイクルでの位置
  const stemBranchIndex = ((daysDiff % 60) + 60) % 60;
  
  // 3. 節気による月の判定
  const solarTerm = calculateSolarTerm(correctedDateTime);
  const monthStemBranch = calculateMonthStemBranch(correctedDateTime.getFullYear(), solarTerm);
  
  return {
    year: calculateYearStemBranch(correctedDateTime.getFullYear()),
    month: monthStemBranch,
    day: STEM_BRANCH_COMBINATIONS[stemBranchIndex],
    hour: calculateHourStemBranch(correctedDateTime.getHours(), stemBranchIndex)
  };
}

function calculateSolarTerm(date: Date): number {
  // 二十四節気の正確な計算（天文学的定義）
  const longitude = calculateSolarLongitude(date);
  return Math.floor(longitude / 15); // 15度ずつ24等分
}
```

**解説**: 中国暦では太陽黄経15度ごとに区切られた「二十四節気」で月の境界を決定します。これは純粋に天文学的な定義です。

---

## 🔮 6. ヴェーダ占星術（Vedic Astrology）- ナクシャトラ・システム

### **アルゴリズム概要**
恒星基準（サイデリアル）の27星宿システムとダシャー期間計算を実装します。

### **技術実装**

#### **ナクシャトラ計算**
```typescript
interface Nakshatra {
  name: string;
  startDegree: number;
  ruler: string;
  pada: number; // 1-4のサブディビジョン
}

function calculateNakshatra(moonLongitude: number): Nakshatra {
  // アヤナンシャ（歳差補正）適用
  const ayanamsa = calculateLahiriAyanamsa(new Date());
  const siderealLongitude = (moonLongitude - ayanamsa + 360) % 360;
  
  // 27分割（各ナクシャトラ = 13°20'）
  const nakshatraIndex = Math.floor(siderealLongitude / (360 / 27));
  const nakshatraDegree = siderealLongitude % (360 / 27);
  
  // パダ（4分割）計算
  const pada = Math.floor(nakshatraDegree / (360 / 27 / 4)) + 1;
  
  return {
    name: NAKSHATRA_NAMES[nakshatraIndex],
    startDegree: nakshatraIndex * (360 / 27),
    ruler: NAKSHATRA_RULERS[nakshatraIndex],
    pada: pada
  };
}

function calculateLahiriAyanamsa(date: Date): number {
  // ラヒリ・アヤナンシャ（インド政府公式）
  const yearsSince1900 = (date.getFullYear() - 1900) + (getDayOfYear(date) / 365.25);
  return 22.46 + 0.0135 * yearsSince1900 + 0.000005 * yearsSince1900 * yearsSince1900;
}
```

**解説**: アヤナンシャは春分点の歳差運動による補正値です。現在約24度のずれがあり、西洋占星術との主要な違いとなっています。

#### **ダシャー期間計算**
```typescript
interface DashaPeriod {
  planet: string;
  startDate: Date;
  endDate: Date;
  subPeriods: DashaPeriod[];
}

function calculateVimsottariDasha(birthDate: Date, moonNakshatra: number): DashaPeriod[] {
  const DASHA_YEARS = [7, 20, 6, 10, 7, 18, 16, 19, 17]; // 各惑星期間（年）
  const DASHA_PLANETS = ['ケートゥ', '金星', '太陽', '月', '火星', '木星', '土星', '水星', 'ラーフ'];
  
  // 月のナクシャトラから開始惑星を決定
  const startPlanetIndex = moonNakshatra % 9;
  const periods: DashaPeriod[] = [];
  
  let currentDate = new Date(birthDate);
  
  for (let i = 0; i < 9; i++) {
    const planetIndex = (startPlanetIndex + i) % 9;
    const periodYears = DASHA_YEARS[planetIndex];
    const endDate = new Date(currentDate);
    endDate.setFullYear(endDate.getFullYear() + periodYears);
    
    periods.push({
      planet: DASHA_PLANETS[planetIndex],
      startDate: new Date(currentDate),
      endDate: endDate,
      subPeriods: calculateSubDasha(currentDate, endDate, planetIndex)
    });
    
    currentDate = endDate;
  }
  
  return periods;
}
```

**解説**: ヴィムショッタリ・ダシャーは120年周期の惑星期間システムです。各惑星に固定期間が割り当てられ、サブ期間も同じ比率で分割されます。

---

## ✋ 7. 手相占い（Palmistry）- パターン認識・システム

### **アルゴリズム概要**
主要4線のパターン解析と年齢タイムライン計算を実装します。

### **技術実装**

#### **生命線解析アルゴリズム**
```typescript
interface PalmLine {
  startPoint: Point;
  endPoint: Point;
  curve: Point[];
  length: number;
  depth: number; // 1-5スケール
  breaks: Point[];
  branches: Point[];
}

function analyzeLifeLine(handImage: ImageData): PalmLine {
  // エッジ検出による線の抽出
  const edges = applyCanny(handImage);
  
  // 生命線の開始点を特定（人差し指と親指の間）
  const startRegion = detectLifeLineStart(edges);
  
  // 輪郭追跡アルゴリズムで線を追跡
  const linePoints = traceContour(edges, startRegion);
  
  // 曲率解析
  const curvature = calculateCurvature(linePoints);
  
  // 切断・分岐の検出
  const breaks = detectBreaks(linePoints);
  const branches = detectBranches(linePoints);
  
  return {
    startPoint: linePoints[0],
    endPoint: linePoints[linePoints.length - 1],
    curve: linePoints,
    length: calculateLineLength(linePoints),
    depth: estimateDepth(handImage, linePoints),
    breaks: breaks,
    branches: branches
  };
}

function calculateLifeTimeline(lifeLine: PalmLine): Array<{age: number, event: string}> {
  const timeline: Array<{age: number, event: string}> = [];
  const totalLength = lifeLine.length;
  
  // 生命線を年齢区間に分割（一般的に80年スケール）
  for (let i = 0; i < lifeLine.curve.length; i++) {
    const age = Math.floor((i / lifeLine.curve.length) * 80);
    
    // 特徴点での予測
    if (lifeLine.breaks.some(bp => isNearPoint(bp, lifeLine.curve[i]))) {
      timeline.push({age, event: '健康上の注意が必要な時期'});
    }
    
    if (lifeLine.branches.some(br => isNearPoint(br, lifeLine.curve[i]))) {
      timeline.push({age, event: '人生の転機・新しい展開'});
    }
  }
  
  return timeline;
}
```

**解説**: コンピュータビジョンの輪郭追跡アルゴリズムを応用して手相線を解析します。Cannyエッジ検出で線を抽出し、パターンマッチングで特徴を識別します。

---

## ᚱ 8. ルーン占い（Runes）- Elder Futhark システム

### **アルゴリズム概要**
24文字のElder Futharkを使用し、伝統的な確率分布で逆位置を生成します。

### **技術実装**

#### **ルーン選択アルゴリズム**
```typescript
interface RuneSelection {
  rune: Rune;
  isReversed: boolean;
  position: string;
}

class RuneBag {
  private runes: Rune[];
  private used: Set<number> = new Set();
  
  drawRunes(count: number): RuneSelection[] {
    const drawn: RuneSelection[] = [];
    
    for (let i = 0; i < count; i++) {
      // 非復元抽出（同じルーンは引かない）
      const availableIndices = this.getAvailableIndices();
      const randomIndex = Math.floor(Math.random() * availableIndices.length);
      const runeIndex = availableIndices[randomIndex];
      
      this.used.add(runeIndex);
      
      const rune = this.runes[runeIndex];
      
      // 逆位置判定（25%確率、ただし対称ルーンは除外）
      const canReverse = this.canBeReversed(rune);
      const isReversed = canReverse && Math.random() < 0.25;
      
      drawn.push({
        rune: rune,
        isReversed: isReversed,
        position: this.getPositionName(i)
      });
    }
    
    return drawn;
  }
  
  private canBeReversed(rune: Rune): boolean {
    // 対称なルーンは逆位置が存在しない
    const symmetricalRunes = ['ᛁ', 'ᛇ', 'ᛈ', 'ᛉ', 'ᛊ', 'ᛒ', 'ᛖ', 'ᛞ'];
    return !symmetricalRunes.includes(rune.symbol);
  }
}
```

**解説**: Elder Futharkの24文字のうち、8文字は上下対称のため逆位置が存在しません。実際の物理的なルーン石の使用を再現しています。

---

## 🔄 統合システム - 相関分析アルゴリズム

### **アルゴリズム概要**
複数占術の結果を統計的に分析し、一貫性と矛盾点を抽出します。

### **技術実装**

#### **ユング的元型マッピング**
```typescript
interface ArchetalCorrelation {
  archetype: string;
  strength: number; // 0-1の相関強度
  sources: string[]; // 一致する占術名
}

function performArchetypalAnalysis(results: DivinationResults[]): ArchetalCorrelation[] {
  const archetypeMap = new Map<string, number>();
  
  // 各占術結果を元型にマッピング
  results.forEach(result => {
    const archetypes = extractArchetypes(result);
    archetypes.forEach(archetype => {
      const current = archetypeMap.get(archetype.name) || 0;
      archetypeMap.set(archetype.name, current + archetype.weight);
    });
  });
  
  // 相関強度計算
  return Array.from(archetypeMap.entries()).map(([archetype, strength]) => ({
    archetype,
    strength: strength / results.length, // 正規化
    sources: results.filter(r => hasArchetype(r, archetype)).map(r => r.type)
  }));
}

function calculateSynchronicityMatrix(results: DivinationResults[]): number[][] {
  const n = results.length;
  const matrix = Array(n).fill(null).map(() => Array(n).fill(0));
  
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      // セマンティック類似度計算
      const similarity = calculateSemanticSimilarity(
        results[i].interpretation,
        results[j].interpretation
      );
      
      matrix[i][j] = matrix[j][i] = similarity;
    }
  }
  
  return matrix;
}
```

**解説**: 自然言語処理の技術を応用し、異なる占術システム間の意味的類似度を定量化します。これにより「シンクロニシティ」を数値的に表現できます。

---

## 📊 パフォーマンス最適化

### **キャッシュ戦略**
```typescript
class DivinationCache {
  private cache = new Map<string, any>();
  private ttl = new Map<string, number>();
  
  get<T>(key: string): T | undefined {
    if (this.isExpired(key)) {
      this.cache.delete(key);
      this.ttl.delete(key);
      return undefined;
    }
    return this.cache.get(key);
  }
  
  set<T>(key: string, value: T, ttlMs: number = 3600000): void {
    this.cache.set(key, value);
    this.ttl.set(key, Date.now() + ttlMs);
  }
  
  private isExpired(key: string): boolean {
    const expiry = this.ttl.get(key);
    return expiry ? Date.now() > expiry : true;
  }
}
```

**解説**: 
- **天体計算**: 1時間キャッシュ（位置は連続的に変化）
- **干支計算**: 24時間キャッシュ（日付ベース）
- **タロット**: キャッシュなし（ランダム性重視）

---

## 🔬 テスト・検証

### **統計的検証**
```typescript
function validateProbabilityDistribution(
  generator: () => number,
  expected: number[],
  trials: number = 10000
): boolean {
  const observed = new Array(expected.length).fill(0);
  
  for (let i = 0; i < trials; i++) {
    const result = generator();
    observed[result]++;
  }
  
  // カイ二乗検定
  const chiSquare = observed.reduce((sum, obs, i) => {
    const exp = expected[i] * trials;
    return sum + Math.pow(obs - exp, 2) / exp;
  }, 0);
  
  const degreesOfFreedom = expected.length - 1;
  const criticalValue = getCriticalValue(degreesOfFreedom, 0.05);
  
  return chiSquare < criticalValue;
}
```

**解説**: 確率的な占術（易経、タロット等）では統計的検証が重要です。期待される確率分布と実際の出力を比較し、実装の正確性を検証します。

---

## 📈 時間・空間計算量

| アルゴリズム | 時間計算量 | 空間計算量 | 備考 |
|-------------|------------|------------|------|
| 数秘術 | O(log n) | O(1) | 桁数に依存 |
| 西洋占星術 | O(1) | O(1) | Swiss Ephemeris使用 |
| 易経 | O(1) | O(1) | 固定サイズ配列 |
| タロット | O(n log n) | O(n) | シャッフルアルゴリズム |
| 四柱推命 | O(1) | O(1) | 事前計算テーブル |
| ヴェーダ占星術 | O(1) | O(1) | 固定計算式 |
| 手相 | O(n²) | O(n) | 画像処理（nは画素数） |
| ルーン | O(k) | O(k) | kは選択ルーン数 |

---

## 🔒 セキュリティ考慮事項

### **ランダム性の品質**
```typescript
// 暗号学的に安全な乱数生成
function secureRandom(): number {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return array[0] / (0xffffffff + 1);
}

// シード付き疑似乱数（再現可能性のため）
class SeededRandom {
  private seed: number;
  
  constructor(seed: string) {
    this.seed = this.hashSeed(seed);
  }
  
  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }
}
```

**解説**: 占いの「運命性」を保ちつつ、必要に応じて結果の再現可能性も確保します。セキュリティが重要な用途では暗号学的ランダム性を使用します。

---

このドキュメントは、COSMIC ORACLEの技術的基盤を理解し、さらなる改良や機能拡張の参考として活用してください。