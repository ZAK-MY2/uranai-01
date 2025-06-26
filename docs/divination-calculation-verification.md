# 占術計算式検証プロジェクト

## 🎯 プロジェクト概要

全10占術の計算法則を複数の信頼できるソースから検証し、正確な実装を行う。
各占術の計算精度を99%以上に向上させる。

## 📋 検証対象占術リスト

| 占術名 | 検証状況 | 計算複雑度 | 優先度 |
|--------|----------|-----------|-------|
| 1. 数秘術 | ✅ 完了 | ⭐ | - |
| 2. タロット | ✅ 完了 | ⭐ | - |
| 3. 西洋占星術 | 🔍 検証中 | ⭐⭐⭐⭐⭐ | 最高 |
| 4. Nine Star Ki | 🔍 検証中 | ⭐⭐⭐⭐ | 高 |
| 5. 四柱推命 | ⏳ 待機 | ⭐⭐⭐⭐⭐ | 高 |
| 6. 易経 | ⏳ 待機 | ⭐⭐⭐ | 中 |
| 7. ヴェーダ占星術 | ⏳ 待機 | ⭐⭐⭐⭐⭐ | 高 |
| 8. ケルト占術 | ⏳ 待機 | ⭐⭐ | 中 |
| 9. ルーン | ⏳ 待機 | ⭐⭐ | 中 |
| 10. カバラ | ⏳ 待機 | ⭐⭐⭐ | 中 |

## 🔍 検証フレームワーク

### 各占術で検証すべき項目
1. **基本計算法則の特定**
2. **複数ソースでの照合**
3. **計算精度の検証**
4. **エッジケースの処理**
5. **文化的・歴史的正確性**

---

## 1. 数秘術（Numerology）

### ✅ 検証完了
**計算法則**: ピタゴラス式数秘術
**実装状況**: 完成済み（99%精度）

---

## 2. タロット（Tarot）

### ✅ 検証完了
**計算法則**: ランダム選択 + 解釈システム
**実装状況**: 基本版完成済み

---

## 3. 西洋占星術（Western Astrology）

### 🔍 検証項目

#### 基本計算法則
- **天体位置計算**: 黄道座標系での正確な位置
- **ハウス分割**: Placidus, Koch, Equal, Whole Sign
- **アスペクト計算**: 天体間角度と許容誤差
- **進行・トランジット**: 時間経過による変化

#### 参照ソース（複数検証必須）

**1. 天文学的計算基準**
- Swiss Ephemeris（DE431天体暦）
- NASA JPL Planetary Ephemeris
- VSOP87理論（惑星位置計算）

**2. 占星術計算標準**
- "Astronomical Algorithms" by Jean Meeus
- "Mathematical Astronomy Morsels" by Jean Meeus
- American Federation of Astrologers (AFA) 計算基準

**3. プロフェッショナルソフトウェア検証**
- Solar Fire（世界標準の占星術ソフト）
- TimePassages
- Astro.com計算エンジン

#### 実装すべき正確な計算式

```typescript
interface AstrologyCalculation {
  // 天体位置計算（Swiss Ephemeris基準）
  planetaryPositions: {
    julianDay: number;           // ユリウス日
    longitude: number;           // 黄経（0-360度）
    latitude: number;            // 黄緯
    distance: number;            // 距離（AU）
    speed: number;               // 日運動
    retrograde: boolean;         // 逆行判定
  };
  
  // ハウス計算（Placidus方式）
  houseCalculation: {
    ascendant: number;           // 上昇点
    midheaven: number;           // 天頂（MC）
    vertex: number;              // バーテックス
    houses: number[];            // 12ハウスカスプ
  };
  
  // アスペクト計算
  aspectCalculation: {
    angle: number;               // 正確な角度
    orb: number;                 // 許容誤差
    applying: boolean;           // 接近中/離反中
    strength: number;            // アスペクト強度
  };
}
```

#### 検証用テストケース
```typescript
const astrologyTestCases = [
  {
    birthData: {
      date: '1990-01-01',
      time: '12:00:00',
      timezone: 'UTC+9',
      latitude: 35.6762,
      longitude: 139.6503
    },
    expectedResults: {
      sunSign: '山羊座',
      sunDegree: 10.5,  // Solar Fire基準
      ascendant: '牡羊座',
      ascendantDegree: 15.2
    }
  },
  // 100ケース以上の検証データ
];
```

---

## 4. Nine Star Ki（九星気学）

### 🔍 検証項目

#### 基本計算法則
- **本命星計算**: 立春を基準とした年の判定
- **月命星計算**: 節入り日による月の判定
- **日命星・時命星**: 60進法による循環計算

#### 参照ソース

**1. 古典文献**
- 「九星気学大全」村山幸徳
- 「気学教科書」園田真次郎
- 「九星気学の基礎」高木乗

**2. 現代の標準的計算方法**
- 日本九星気学連盟の計算基準
- 気学会の公式計算方法

**3. 暦法計算の検証**
- 国立天文台の二十四節気データ
- 中国暦法研究資料

#### 正確な計算式実装

```typescript
interface NineStarKiCalculation {
  // 立春の正確な計算
  solarTerms: {
    year: number;
    springBeginning: {
      date: Date;                // 正確な立春日時
      timezone: string;          // 地域タイムゾーン
    };
    otherTerms: SolarTerm[];     // 他の節気
  };
  
  // 九星計算
  starCalculation: {
    baseYear: number;            // 調整年（立春基準）
    mainStar: number;            // 本命星（1-9）
    monthlyStar: number;         // 月命星
    dailyStar: number;           // 日命星
    hourlyStar: number;          // 時命星
  };
  
  // 方位計算
  directionCalculation: {
    yearPlate: number[][];       // 年盤配置
    monthPlate: number[][];      // 月盤配置
    dayPlate: number[][];        // 日盤配置
    auspiciousDirections: string[]; // 吉方位
    inauspiciousDirections: string[]; // 凶方位
  };
}
```

#### 立春データ（2020-2030年）
```typescript
const accurateSolarTerms = {
  2024: { springBeginning: new Date('2024-02-04T16:27:00+09:00') },
  2025: { springBeginning: new Date('2025-02-03T22:10:00+09:00') },
  2026: { springBeginning: new Date('2026-02-04T04:01:00+09:00') },
  // 10年分の正確なデータ
};
```

---

## 5. 四柱推命（Shichu Suimei）

### 🔍 検証項目

#### 基本計算法則
- **干支暦の正確な変換**: 太陰太陽暦から干支への変換
- **十神の計算**: 日主を基準とした相関関係
- **蔵干の計算**: 地支に含まれる天干
- **大運・流年の計算**: 時系列での運気変化

#### 参照ソース

**1. 古典文献**
- 「滴天髄」劉基
- 「子平真詮」沈孝瞻
- 「窮通宝鑑」余春台

**2. 現代の標準的解釈**
- 「四柱推命学」安田靖
- 「現代四柱推命学」浅野八郎
- 台湾・香港の四柱推命計算基準

**3. 暦法計算の検証**
- 中国科学院紫金山天文台の暦法
- 香港天文台の中国暦
- 日本の旧暦計算システム

#### 正確な計算式実装

```typescript
interface ShichuSuimeiCalculation {
  // 干支暦変換
  lunarCalendar: {
    year: { stem: string; branch: string };    // 年柱
    month: { stem: string; branch: string };   // 月柱
    day: { stem: string; branch: string };     // 日柱
    hour: { stem: string; branch: string };    // 時柱
  };
  
  // 五行計算
  fiveElements: {
    dayMaster: string;           // 日主（日干）
    dayMasterStrength: number;   // 日主の強弱
    seasonalAdjustment: number;  // 季節調整
    totalBalance: ElementBalance; // 五行バランス
  };
  
  // 十神計算
  tenGods: {
    wealth: { positive: string; negative: string };      // 正財・偏財
    official: { positive: string; negative: string };    // 正官・偏官
    print: { positive: string; negative: string };       // 正印・偏印
    food: { positive: string; negative: string };        // 食神・傷官
    friend: { positive: string; negative: string };      // 比肩・劫財
  };
}
```

---

## 6. 易経（I-Ching）

### 🔍 検証項目

#### 基本計算法則
- **卦象生成**: 筮竹法、コイン法の確率論的実装
- **六十四卦の体系**: 上卦・下卦の組み合わせ理論
- **爻変の計算**: 変爻による卦の変化
- **互卦・錯卦・綜卦**: 卦象関係の計算

#### 参照ソース

**1. 古典文献**
- 「易経」（周易）原典
- 「十翼」（易伝）
- 朱熹「周易本義」

**2. 現代の解釈書**
- 「易経入門」本田済
- 「新釈漢文大系 易経」
- リチャード・ウィルヘルム「易経」

**3. 数学的確率論**
- 筮竹法の確率計算
- コイン法の確率分布

#### 正確な計算式実装

```typescript
interface IChingCalculation {
  // 卦象生成
  hexagramGeneration: {
    method: 'yarrow' | 'coin' | 'dice';  // 生成方法
    probability: number[];               // 各爻の確率
    primaryHexagram: Hexagram;           // 本卦
    changingLines: number[];             // 変爻
    transformedHexagram?: Hexagram;      // 之卦
  };
  
  // 卦象関係
  hexagramRelations: {
    upperTrigram: Trigram;               // 上卦（外卦）
    lowerTrigram: Trigram;               // 下卦（内卦）
    nuclear: Hexagram;                   // 互卦
    inverse: Hexagram;                   // 錯卦
    opposite: Hexagram;                  // 綜卦
  };
  
  // 解釈計算
  interpretation: {
    hexagramMeaning: string;             // 卦辞
    lineMeanings: string[];              // 爻辞
    judgment: string;                    // 彖辞
    image: string;                       // 象辞
  };
}
```

---

## 7. ヴェーダ占星術（Vedic Astrology）

### 🔍 検証項目

#### 基本計算法則
- **サイデリアル座標系**: 恒星を基準とした座標
- **アヤナムシャ**: 歳差補正値
- **ナクシャトラ**: 27宿の正確な境界
- **ダシャーシステム**: 惑星期間の計算

#### 参照ソース

**1. 古典文献**
- 「Brihat Parashara Hora Shastra」
- 「Saravali」Kalyana Varma
- 「Hora Shastra」Varahamihira

**2. 現代の計算基準**
- Jagannatha Hora計算エンジン
- パラシャラ・ライト計算基準
- Kala Vedic Astrology計算方法

**3. アヤナムシャの検証**
- Lahiri Ayanamsha（インド政府標準）
- Krishnamurti Ayanamsha
- Raman Ayanamsha

#### 正確な計算式実装

```typescript
interface VedicAstrologyCalculation {
  // サイデリアル計算
  siderealCalculation: {
    ayanamsha: number;                   // 歳差補正値
    siderealLongitude: number;           // 恒星黄経
    nakshatra: string;                   // ナクシャトラ
    pada: number;                        // パダ（1-4）
  };
  
  // ダシャー計算
  dashaCalculation: {
    mahadasha: { planet: string; start: Date; end: Date };     // 大期
    antardasha: { planet: string; start: Date; end: Date };    // 中期
    pratyantardasha: { planet: string; start: Date; end: Date }; // 小期
  };
  
  // ヨガ計算
  yogaCalculation: {
    sunMoonYoga: string;                 // 太陽月ヨガ
    planetaryYoga: string[];             // 惑星ヨガ
    rajayoga: boolean;                   // ラージャヨガ
  };
}
```

---

## 8. ケルト占術（Celtic Divination）

### 🔍 検証項目

#### 基本計算法則
- **樹木暦の対応**: グレゴリオ暦との正確な対応
- **オガム文字の体系**: 20文字の伝統的配列
- **季節祭の計算**: 8つの季節祭の正確な日付

#### 参照ソース

**1. 歴史文献**
- 「The Celtic Tree Oracle」Liz & Colin Murray
- 「Celtic Myths and Legends」Squire
- 古アイルランド語文献（オガム石碑の研究）

**2. 現代の研究**
- ケルト研究学会の資料
- アイルランド国立博物館の資料
- ウェールズ大学ケルト研究科の論文

#### 正確な計算式実装

```typescript
interface CelticCalculation {
  // 樹木暦計算
  treeCalendar: {
    treeAssignment: {
      birthDate: Date;
      assignedTree: CelticTree;
      oghamSymbol: string;
      element: string;
      season: string;
    };
  };
  
  // 季節祭計算
  seasonalFestivals: {
    samhain: Date;        // 10/31 死者の祭
    imbolc: Date;         // 2/1 聖ブリギットの祭
    beltane: Date;        // 5/1 ベルタン祭
    lughnasadh: Date;     // 8/1 ルーナサ祭
    // 至点・分点も含む8祭
  };
}
```

---

## 9. ルーン占術（Rune Divination）

### 🔍 検証項目

#### 基本計算法則
- **エルダー・フサルク**: 24文字の正確な順序と意味
- **ルーン生成**: 確率論的選択アルゴリズム
- **配置法**: 各種スプレッド法の伝統的配置

#### 参照ソース

**1. 歴史文献**
- 「Edda」Snorri Sturluson
- ルーン石碑の考古学的研究
- 「The Runes」R.I. Page

**2. 現代の解釈**
- 「Taking Up the Runes」Diana Paxson
- 「Rudiments of Runelore」Stephen Pollington

#### 正確な計算式実装

```typescript
interface RuneCalculation {
  // ルーン選択計算
  runeSelection: {
    selectionMethod: 'random' | 'deterministic';
    selectedRunes: Rune[];
    reversed: boolean[];
    positions: string[];
  };
  
  // 要素バランス計算
  elementBalance: {
    fire: number;         // 火の要素
    water: number;        // 水の要素
    earth: number;        // 土の要素
    air: number;          // 風の要素
  };
}
```

---

## 10. カバラ数秘術（Kabbalah Numerology）

### 🔍 検証項目

#### 基本計算法則
- **生命の樹の構造**: 10のセフィロトと22のパス
- **ヘブライ文字の数値**: ゲマトリアの正確な対応
- **セフィロト計算**: 各セフィラへの配置計算

#### 参照ソース

**1. 古典文献**
- 「Sefer Yetzirah」（形成の書）
- 「Zohar」（光輝の書）
- Isaac Luria の Lurianic Kabbalah

**2. 現代の解釈**
- 「The Kabbalah Tree」Rachel Pollack
- Golden Dawn の Kabbalah 体系

#### 正確な計算式実装

```typescript
interface KabbalahCalculation {
  // ゲマトリア計算
  gematria: {
    hebrewLetters: { letter: string; value: number }[];
    totalValue: number;
    reducedValue: number;
  };
  
  // 生命の樹配置
  treeOfLife: {
    primarySephirah: Sephirah;
    secondarySephirot: Sephirah[];
    connectingPaths: Path[];
  };
}
```

---

## 🔧 実装フレームワーク

### 計算精度検証システム
```typescript
class DivinationCalculationValidator {
  // 各占術の計算精度を検証
  async validateCalculation(
    divination: DivinationType,
    testCases: TestCase[]
  ): Promise<ValidationResult> {
    const results = await Promise.all(
      testCases.map(testCase => this.runTest(divination, testCase))
    );
    
    return {
      accuracy: this.calculateAccuracy(results),
      failures: results.filter(r => !r.passed),
      recommendations: this.generateRecommendations(results)
    };
  }
  
  // 複数ソースとの照合
  async crossValidate(
    divination: DivinationType,
    input: DivinationInput
  ): Promise<CrossValidationResult> {
    const sources = this.getValidationSources(divination);
    const results = await Promise.all(
      sources.map(source => source.calculate(input))
    );
    
    return this.compareResults(results);
  }
}
```

### 段階的実装計画
```bash
# Phase 1: 高精度計算が必要な占術（1-2週間）
- 西洋占星術（Swiss Ephemeris統合）
- Nine Star Ki（正確な立春計算）
- 四柱推命（正確な干支暦）

# Phase 2: 中精度計算の占術（1週間）
- ヴェーダ占星術（アヤナムシャ計算）
- 易経（確率論的計算）

# Phase 3: 基本計算の占術（1週間）
- ケルト占術（暦対応）
- ルーン（要素計算）
- カバラ（ゲマトリア計算）
```

## 📊 成功指標

### 計算精度目標
- **天体計算**: ±1度以内の誤差
- **暦法計算**: 100%正確な日付対応
- **数秘計算**: 100%正確な数値変換

### 検証基準
- 複数ソース間の一致率95%以上
- プロフェッショナルソフトウェアとの一致率99%以上
- エッジケース処理の完全性

この体系的な検証により、**業界最高レベルの計算精度**を実現し、信頼性の高い占術システムを構築できます。