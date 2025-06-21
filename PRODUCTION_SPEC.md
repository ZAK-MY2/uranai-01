# 占いシステム「COSMIC ORACLE」本番実装仕様書

## 🎯 プロジェクト概要

### システム名
**COSMIC ORACLE** (uranai-01)

### 目標
10占術統合 + リアルタイム環境データ連携による高精度AI占いシステム

### 技術戦略
現在のNext.js + Supabase環境を活用した段階的開発
- **Phase 1**: Next.js Fullstack MVP
- **Phase 2**: Python microservices拡張

---

## 🏗️ システムアーキテクチャ

### 技術スタック（Phase 1 MVP）

```yaml
Frontend:
  - Next.js 15 (App Router)
  - TypeScript 5+
  - Tailwind CSS 4
  - Zustand (状態管理)

Backend:
  - Next.js API Routes
  - TypeScript
  - 占術計算ライブラリ

Database:
  - Supabase PostgreSQL
  - Supabase Auth
  - Supabase Storage

External APIs:
  - OpenWeatherMap (天候)
  - Astronomy APIs (天体位置)
  - Lunar Phase APIs (月相)

Deployment:
  - Vercel (Frontend + API)
  - Supabase (Database)
```

### アプリケーション構造

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/
│   │   ├── page.tsx
│   │   └── layout.tsx
│   ├── divination/
│   │   ├── page.tsx
│   │   ├── numerology/
│   │   ├── tarot/
│   │   └── astrology/
│   ├── api/
│   │   ├── divination/
│   │   │   ├── numerology/route.ts
│   │   │   ├── tarot/route.ts
│   │   │   ├── astrology/route.ts
│   │   │   └── integrated/route.ts
│   │   ├── environment/
│   │   │   ├── weather/route.ts
│   │   │   ├── lunar/route.ts
│   │   │   └── current/route.ts
│   │   └── user/
│   │       ├── profile/route.ts
│   │       └── history/route.ts
│   └── layout.tsx
├── lib/
│   ├── divination/
│   │   ├── numerology.ts
│   │   ├── tarot.ts
│   │   ├── astrology.ts
│   │   └── integrator.ts
│   ├── environment/
│   │   ├── weather.ts
│   │   ├── astronomy.ts
│   │   └── lunar.ts
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── types.ts
│   └── utils/
│       ├── calculations.ts
│       ├── formatting.ts
│       └── validation.ts
├── components/
│   ├── ui/ (shadcn/ui)
│   ├── divination/
│   │   ├── NumerologyForm.tsx
│   │   ├── TarotSpread.tsx
│   │   └── AstrologyChart.tsx
│   ├── environment/
│   │   └── EnvironmentDisplay.tsx
│   └── layout/
│       ├── Header.tsx
│       ├── Sidebar.tsx
│       └── Footer.tsx
└── types/
    ├── divination.ts
    ├── environment.ts
    └── user.ts
```

---

## 🗄️ データベース設計

### Supabase スキーマ

```sql
-- ユーザープロファイル拡張
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  birth_date date,
  birth_time time,
  birth_location jsonb, -- {lat: number, lon: number, timezone: string, city: string}
  preferences jsonb default '{}', -- {language: string, theme: string}
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 占術セッション
create table divination_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade,
  session_type text not null, -- 'numerology', 'tarot', 'astrology', 'integrated'
  input_data jsonb not null, -- ユーザー入力データ
  results jsonb not null, -- 占術計算結果
  environment_data jsonb, -- 環境データスナップショット
  interpretation text, -- AI生成解釈
  created_at timestamp with time zone default now()
);

-- 占術結果キャッシュ
create table divination_cache (
  id uuid default gen_random_uuid() primary key,
  cache_key text unique not null,
  divination_type text not null,
  input_hash text not null,
  result_data jsonb not null,
  expires_at timestamp with time zone not null,
  created_at timestamp with time zone default now()
);

-- 環境データログ
create table environment_logs (
  id uuid default gen_random_uuid() primary key,
  data_type text not null, -- 'weather', 'lunar', 'astronomical'
  location jsonb, -- {lat: number, lon: number}
  data jsonb not null,
  collected_at timestamp with time zone default now()
);

-- ユーザー設定
create table user_settings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade,
  setting_key text not null,
  setting_value jsonb not null,
  updated_at timestamp with time zone default now(),
  unique(user_id, setting_key)
);

-- インデックス作成
create index idx_divination_sessions_user_id on divination_sessions(user_id);
create index idx_divination_sessions_created_at on divination_sessions(created_at desc);
create index idx_divination_cache_key on divination_cache(cache_key);
create index idx_divination_cache_expires on divination_cache(expires_at);
create index idx_environment_logs_type_time on environment_logs(data_type, collected_at desc);

-- RLS (Row Level Security) 設定
alter table profiles enable row level security;
alter table divination_sessions enable row level security;
alter table user_settings enable row level security;

-- ポリシー作成
create policy "Users can view own profile" on profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id);

create policy "Users can view own sessions" on divination_sessions
  for select using (auth.uid() = user_id);

create policy "Users can insert own sessions" on divination_sessions
  for insert with check (auth.uid() = user_id);
```

---

## 🔮 占術エンジン実装

### 1. 数秘術エンジン

```typescript
// lib/divination/numerology.ts

export interface NumerologyInput {
  fullName: string;
  birthDate: string; // YYYY-MM-DD
}

export interface NumerologyResult {
  lifePath: number;
  destiny: number;
  soul: number;
  personality: number;
  interpretation: {
    lifePath: string;
    destiny: string;
    soul: string;
    personality: string;
    overall: string;
  };
}

export class NumerologyEngine {
  private letterValues: { [key: string]: number } = {
    A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
    J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
    S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8
  };

  calculateLifePath(birthDate: string): number {
    const digits = birthDate.replace(/-/g, '').split('').map(Number);
    return this.reduceToSingleDigit(digits.reduce((sum, digit) => sum + digit, 0));
  }

  calculateDestiny(fullName: string): number {
    const nameValue = fullName.toUpperCase()
      .replace(/[^A-Z]/g, '')
      .split('')
      .reduce((sum, letter) => sum + (this.letterValues[letter] || 0), 0);
    return this.reduceToSingleDigit(nameValue);
  }

  calculateSoul(fullName: string): number {
    const vowels = fullName.toUpperCase().match(/[AEIOU]/g) || [];
    const vowelValue = vowels.reduce((sum, vowel) => sum + this.letterValues[vowel], 0);
    return this.reduceToSingleDigit(vowelValue);
  }

  calculatePersonality(fullName: string): number {
    const consonants = fullName.toUpperCase().match(/[BCDFGHJKLMNPQRSTVWXYZ]/g) || [];
    const consonantValue = consonants.reduce((sum, consonant) => sum + this.letterValues[consonant], 0);
    return this.reduceToSingleDigit(consonantValue);
  }

  private reduceToSingleDigit(num: number): number {
    // マスターナンバー (11, 22, 33) は減らさない
    if (num === 11 || num === 22 || num === 33) return num;
    
    while (num > 9) {
      num = num.toString().split('').map(Number).reduce((sum, digit) => sum + digit, 0);
    }
    return num;
  }

  generateInterpretation(numbers: Omit<NumerologyResult, 'interpretation'>): NumerologyResult['interpretation'] {
    // 実装: 各数字の詳細解釈生成
    return {
      lifePath: this.getLifePathInterpretation(numbers.lifePath),
      destiny: this.getDestinyInterpretation(numbers.destiny),
      soul: this.getSoulInterpretation(numbers.soul),
      personality: this.getPersonalityInterpretation(numbers.personality),
      overall: this.getOverallInterpretation(numbers)
    };
  }

  async calculate(input: NumerologyInput): Promise<NumerologyResult> {
    const numbers = {
      lifePath: this.calculateLifePath(input.birthDate),
      destiny: this.calculateDestiny(input.fullName),
      soul: this.calculateSoul(input.fullName),
      personality: this.calculatePersonality(input.fullName)
    };

    const interpretation = this.generateInterpretation(numbers);

    return { ...numbers, interpretation };
  }
}
```

### 2. タロットエンジン

```typescript
// lib/divination/tarot.ts

export interface TarotCard {
  id: number;
  name: string;
  arcana: 'major' | 'minor';
  suit?: 'cups' | 'pentacles' | 'swords' | 'wands';
  number?: number;
  keywords: string[];
  uprightMeaning: string;
  reversedMeaning: string;
  imageUrl: string;
}

export interface TarotSpread {
  name: string;
  positions: string[];
  description: string;
}

export interface TarotReading {
  spread: TarotSpread;
  cards: {
    card: TarotCard;
    position: string;
    isReversed: boolean;
    meaning: string;
  }[];
  overall: string;
  advice: string;
}

export class TarotEngine {
  private deck: TarotCard[] = []; // 78枚のカードデータ
  private spreads: { [key: string]: TarotSpread } = {};

  constructor() {
    this.initializeDeck();
    this.initializeSpreads();
  }

  private initializeDeck() {
    // 大アルカナ (22枚)
    const majorArcana: TarotCard[] = [
      {
        id: 0,
        name: 'The Fool',
        arcana: 'major',
        keywords: ['new beginnings', 'innocence', 'adventure'],
        uprightMeaning: '新しい始まり、冒険への一歩',
        reversedMeaning: '軽率さ、計画性の欠如',
        imageUrl: '/tarot/major/fool.jpg'
      },
      // ... 他の21枚
    ];

    // 小アルカナ (56枚)
    // 実装: 4スート × 14枚ずつ

    this.deck = [...majorArcana /* , ...minorArcana */];
  }

  private initializeSpreads() {
    this.spreads = {
      'three-card': {
        name: '過去・現在・未来',
        positions: ['過去', '現在', '未来'],
        description: 'シンプルな3枚引きで状況を把握'
      },
      'celtic-cross': {
        name: 'ケルト十字',
        positions: [
          '現在の状況', '障害・チャレンジ', '遠い過去', '近い過去',
          '可能な未来', '近い未来', 'あなたのアプローチ', '外的影響',
          '希望と恐れ', '最終結果'
        ],
        description: '詳細な状況分析のための10枚スプレッド'
      }
    };
  }

  shuffleDeck(seed?: string): TarotCard[] {
    const shuffled = [...this.deck];
    // シード値による再現可能なシャッフル実装
    let random = this.createSeededRandom(seed || Date.now().toString());
    
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    return shuffled;
  }

  private createSeededRandom(seed: string) {
    // シンプルなシード可能な疑似乱数生成器
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      const char = seed.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // 32bit整数に変換
    }
    
    return function() {
      hash = (hash * 9301 + 49297) % 233280;
      return hash / 233280;
    };
  }

  drawCards(spreadType: string, question: string, seed?: string): TarotReading {
    const spread = this.spreads[spreadType];
    if (!spread) throw new Error(`Unknown spread type: ${spreadType}`);

    const shuffled = this.shuffleDeck(seed);
    const random = this.createSeededRandom(seed || Date.now().toString());
    
    const cards = spread.positions.map((position, index) => {
      const card = shuffled[index];
      const isReversed = random() < 0.5;
      
      return {
        card,
        position,
        isReversed,
        meaning: isReversed ? card.reversedMeaning : card.uprightMeaning
      };
    });

    return {
      spread,
      cards,
      overall: this.generateOverallReading(cards, question),
      advice: this.generateAdvice(cards, question)
    };
  }

  private generateOverallReading(cards: TarotReading['cards'], question: string): string {
    // AI生成または事前定義されたパターンベースの解釈
    return `${question}に対するカードの総合的なメッセージ...`;
  }

  private generateAdvice(cards: TarotReading['cards'], question: string): string {
    // カードの組み合わせから具体的なアドバイスを生成
    return `このリーディングからのアドバイス...`;
  }
}
```

### 3. 西洋占星術エンジン

```typescript
// lib/divination/astrology.ts

export interface BirthData {
  date: string;
  time: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface Planet {
  name: string;
  sign: string;
  degree: number;
  house: number;
  retrograde: boolean;
}

export interface AstrologyChart {
  planets: Planet[];
  houses: House[];
  aspects: Aspect[];
  ascendant: string;
  midheaven: string;
}

export interface House {
  number: number;
  sign: string;
  degree: number;
}

export interface Aspect {
  planet1: string;
  planet2: string;
  aspect: string;
  orb: number;
  exact: boolean;
}

export class AstrologyEngine {
  private readonly zodiacSigns = [
    '牡羊座', '牡牛座', '双子座', '蟹座', '獅子座', '乙女座',
    '天秤座', '蠍座', '射手座', '山羊座', '水瓶座', '魚座'
  ];

  private readonly planets = [
    'Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 
    'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'
  ];

  async calculateChart(birthData: BirthData): Promise<AstrologyChart> {
    // 外部天文計算APIまたはライブラリを使用
    const julianDay = this.dateToJulianDay(birthData.date, birthData.time);
    
    const planets = await this.calculatePlanets(julianDay, birthData);
    const houses = await this.calculateHouses(julianDay, birthData);
    const aspects = this.calculateAspects(planets);
    
    return {
      planets,
      houses,
      aspects,
      ascendant: houses[0].sign, // 1室のサインが上昇星座
      midheaven: houses[9].sign   // 10室のサインがMC
    };
  }

  private dateToJulianDay(date: string, time: string): number {
    // ユリウス日計算の実装
    const datetime = new Date(`${date}T${time}`);
    const a = Math.floor((14 - (datetime.getMonth() + 1)) / 12);
    const y = datetime.getFullYear() + 4800 - a;
    const m = (datetime.getMonth() + 1) + 12 * a - 3;
    
    let jd = datetime.getDate() + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
    
    // 時刻を加算
    const timeDecimal = (datetime.getHours() + datetime.getMinutes() / 60 + datetime.getSeconds() / 3600) / 24;
    jd += timeDecimal - 0.5;
    
    return jd;
  }

  private async calculatePlanets(julianDay: number, birthData: BirthData): Promise<Planet[]> {
    // 外部APIまたは天文計算ライブラリを使用
    // 例: Swiss Ephemeris Web API
    
    const planets: Planet[] = [];
    
    for (const planetName of this.planets) {
      // API呼び出しまたは計算
      const position = await this.getPlanetPosition(planetName, julianDay);
      
      planets.push({
        name: planetName,
        sign: this.degreeToSign(position.longitude),
        degree: position.longitude % 30,
        house: this.calculateHousePosition(position.longitude, birthData),
        retrograde: position.speed < 0
      });
    }
    
    return planets;
  }

  private degreeToSign(degree: number): string {
    const signIndex = Math.floor(degree / 30);
    return this.zodiacSigns[signIndex];
  }

  private calculateAspects(planets: Planet[]): Aspect[] {
    const aspects: Aspect[] = [];
    const aspectOrbs = {
      'Conjunction': 8,
      'Opposition': 8,
      'Trine': 8,
      'Square': 8,
      'Sextile': 6
    };

    for (let i = 0; i < planets.length; i++) {
      for (let j = i + 1; j < planets.length; j++) {
        const planet1 = planets[i];
        const planet2 = planets[j];
        
        // 角度差計算
        let angleDiff = Math.abs((planet1.degree + planet1.house * 30) - (planet2.degree + planet2.house * 30));
        if (angleDiff > 180) angleDiff = 360 - angleDiff;
        
        // アスペクト判定
        for (const [aspectName, orb] of Object.entries(aspectOrbs)) {
          const targetAngle = this.getAspectAngle(aspectName);
          const difference = Math.abs(angleDiff - targetAngle);
          
          if (difference <= orb) {
            aspects.push({
              planet1: planet1.name,
              planet2: planet2.name,
              aspect: aspectName,
              orb: difference,
              exact: difference < 1
            });
          }
        }
      }
    }

    return aspects;
  }

  private getAspectAngle(aspectName: string): number {
    const angles = {
      'Conjunction': 0,
      'Sextile': 60,
      'Square': 90,
      'Trine': 120,
      'Opposition': 180
    };
    return angles[aspectName as keyof typeof angles] || 0;
  }
}
```

---

## 🌍 環境データ連携システム

### 環境データエンジン

```typescript
// lib/environment/index.ts

export interface EnvironmentData {
  lunar: LunarData;
  weather: WeatherData;
  astronomical: AstronomicalData;
  location: LocationData;
  timestamp: string;
}

export interface LunarData {
  phase: number; // 0-1
  phaseName: string;
  illumination: number;
  nextNewMoon: string;
  nextFullMoon: string;
}

export interface WeatherData {
  condition: string;
  temperature: number;
  pressure: number;
  pressureChange: number;
  humidity: number;
  windDirection: string;
  windSpeed: number;
  cloudiness: number;
}

export interface AstronomicalData {
  sunrise: string;
  sunset: string;
  moonrise: string;
  moonset: string;
  planetaryHours: PlanetaryHour[];
}

export class EnvironmentEngine {
  async getCurrentEnvironment(lat: number, lon: number): Promise<EnvironmentData> {
    const [lunar, weather, astronomical] = await Promise.all([
      this.getLunarData(),
      this.getWeatherData(lat, lon),
      this.getAstronomicalData(lat, lon)
    ]);

    return {
      lunar,
      weather,
      astronomical,
      location: { latitude: lat, longitude: lon },
      timestamp: new Date().toISOString()
    };
  }

  private async getLunarData(): Promise<LunarData> {
    // 月相計算または外部API
    const response = await fetch(`https://api.farmsense.net/v1/moonphases/?d=${Math.floor(Date.now() / 1000)}`);
    const data = await response.json();
    
    return {
      phase: data[0].Phase,
      phaseName: this.getPhaseName(data[0].Phase),
      illumination: Math.round(data[0].Illumination * 100),
      nextNewMoon: data.find(d => d.Phase === 0)?.Date || '',
      nextFullMoon: data.find(d => d.Phase === 0.5)?.Date || ''
    };
  }

  private async getWeatherData(lat: number, lon: number): Promise<WeatherData> {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );
    const data = await response.json();

    return {
      condition: data.weather[0].description,
      temperature: data.main.temp,
      pressure: data.main.pressure,
      pressureChange: 0, // 履歴データから計算
      humidity: data.main.humidity,
      windDirection: this.degreeToDirection(data.wind.deg),
      windSpeed: data.wind.speed * 3.6, // m/s to km/h
      cloudiness: data.clouds.all
    };
  }

  private getPhaseName(phase: number): string {
    if (phase === 0) return '新月';
    if (phase < 0.25) return '上弦前';
    if (phase === 0.25) return '上弦';
    if (phase < 0.5) return '上弦後';
    if (phase === 0.5) return '満月';
    if (phase < 0.75) return '下弦前';
    if (phase === 0.75) return '下弦';
    return '下弦後';
  }
}
```

---

## 🚀 API設計

### API Routes 構造

```typescript
// app/api/divination/numerology/route.ts
export async function POST(request: Request) {
  try {
    const { fullName, birthDate } = await request.json();
    
    // バリデーション
    if (!fullName || !birthDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 占術計算
    const engine = new NumerologyEngine();
    const result = await engine.calculate({ fullName, birthDate });

    // 結果保存
    await saveSession({
      sessionType: 'numerology',
      inputData: { fullName, birthDate },
      results: result
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Calculation failed' }, { status: 500 });
  }
}
```

### 統合占術API

```typescript
// app/api/divination/integrated/route.ts
export async function POST(request: Request) {
  try {
    const input = await request.json();
    const user = await getCurrentUser();
    
    // 環境データ取得
    const environment = await environmentEngine.getCurrentEnvironment(
      input.location.latitude,
      input.location.longitude
    );

    // 複数占術並列実行
    const [numerology, tarot, astrology] = await Promise.all([
      numerologyEngine.calculate(input),
      tarotEngine.drawCards(input.spreadType, input.question),
      astrologyEngine.calculateChart(input.birthData)
    ]);

    // 結果統合
    const integrated = await integrateResults({
      numerology,
      tarot,
      astrology,
      environment,
      question: input.question
    });

    // セッション保存
    await saveSession({
      userId: user.id,
      sessionType: 'integrated',
      inputData: input,
      results: { numerology, tarot, astrology },
      environmentData: environment,
      interpretation: integrated
    });

    return NextResponse.json(integrated);
  } catch (error) {
    return NextResponse.json({ error: 'Integration failed' }, { status: 500 });
  }
}
```

---

## 🎨 フロントエンド実装

### メインダッシュボード

```typescript
// app/dashboard/page.tsx
export default function Dashboard() {
  const [environment, setEnvironment] = useState<EnvironmentData | null>(null);
  const [recentSessions, setRecentSessions] = useState([]);

  useEffect(() => {
    // 現在の環境データ取得
    getCurrentEnvironment().then(setEnvironment);
    // 最近のセッション取得
    getRecentSessions().then(setRecentSessions);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-white mb-8">COSMIC ORACLE</h1>
        
        {environment && (
          <EnvironmentDisplay data={environment} />
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <DivinationCard
            title="数秘術"
            description="あなたの名前と生年月日から人生の道筋を読み解く"
            href="/divination/numerology"
            icon="🔢"
          />
          <DivinationCard
            title="タロット"
            description="カードが示す未来への指針とメッセージ"
            href="/divination/tarot"
            icon="🃏"
          />
          <DivinationCard
            title="西洋占星術"
            description="天体の配置があなたの運命を物語る"
            href="/divination/astrology"
            icon="⭐"
          />
        </div>
        
        <IntegratedReading className="mt-12" />
        
        {recentSessions.length > 0 && (
          <RecentSessions sessions={recentSessions} className="mt-12" />
        )}
      </div>
    </div>
  );
}
```

---

## 📋 開発フェーズとマイルストーン

### Phase 1: MVP基盤 (Week 1-4)

**Week 1: 環境セットアップ**
- [ ] Supabaseスキーマ実装
- [ ] 基本API Routes作成
- [ ] 環境データ連携テスト

**Week 2: 数秘術エンジン**
- [ ] 数秘術計算ロジック実装
- [ ] UI コンポーネント作成
- [ ] テストケース作成

**Week 3: タロットエンジン**
- [ ] カードデータベース構築
- [ ] シャッフル・配置ロジック
- [ ] タロットスプレッドUI

**Week 4: 統合システム**
- [ ] 複数占術結果統合
- [ ] メインダッシュボード
- [ ] 基本デプロイ

### Phase 2: 拡張機能 (Week 5-8)

**Week 5-6: 西洋占星術**
- [ ] 天体計算API統合
- [ ] チャート生成システム
- [ ] アスペクト解釈

**Week 7: 高度環境データ**
- [ ] 地磁気・太陽活動データ
- [ ] 潮汐・地震データ統合
- [ ] 環境影響解釈

**Week 8: UI/UX改善**
- [ ] レスポンシブ対応
- [ ] アニメーション実装
- [ ] パフォーマンス最適化

### Phase 3: 商用機能 (Week 9-12)

**Week 9-10: ユーザー体験**
- [ ] ユーザー履歴機能
- [ ] お気に入り・ブックマーク
- [ ] 共有機能

**Week 11: 国際化**
- [ ] 多言語対応（英語・中国語）
- [ ] 地域別占術調整
- [ ] タイムゾーン対応

**Week 12: 本番リリース**
- [ ] パフォーマンステスト
- [ ] セキュリティ監査
- [ ] プロダクションデプロイ

---

## 🔧 開発環境とツール

### 必要な環境変数

```bash
# .env.local
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Weather API
OPENWEATHER_API_KEY=your_openweather_key

# Optional: Advanced APIs
SWISS_EPHEMERIS_API_KEY=your_ephemeris_key
NASA_API_KEY=your_nasa_key
NOAA_API_KEY=your_noaa_key
```

### パッケージ依存関係

```json
{
  "dependencies": {
    "@supabase/ssr": "^0.6.1",
    "@supabase/supabase-js": "^2.50.0",
    "next": "15.3.4",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "zustand": "^4.4.0",
    "date-fns": "^2.30.0",
    "zod": "^3.22.0",
    "@radix-ui/react-dialog": "^1.0.0",
    "@radix-ui/react-tooltip": "^1.0.0",
    "framer-motion": "^10.16.0",
    "recharts": "^2.8.0"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "typescript": "^5",
    "tailwindcss": "^4",
    "@tailwindcss/postcss": "^4",
    "vitest": "^0.34.0",
    "@testing-library/react": "^13.4.0"
  }
}
```

---

## 📊 成功指標とKPI

### 技術KPI
- [ ] API応答時間 < 3秒（統合占術）
- [ ] エラー率 < 1%
- [ ] システム稼働率 > 99.5%
- [ ] 外部API成功率 > 98%

### ユーザーKPI
- [ ] 月間アクティブユーザー > 1,000
- [ ] セッション完了率 > 80%
- [ ] ユーザー満足度 > 4.5/5.0
- [ ] リピート利用率 > 60%

---

## 🎯 次のアクション

この仕様書に基づいて、以下の順序で開発を開始します：

1. **データベーススキーマの実装**
2. **基本API構造の構築**  
3. **数秘術エンジンの実装**
4. **環境データ連携システム**
5. **フロントエンドUI開発**

準備が整いましたら、実装を開始しましょう！