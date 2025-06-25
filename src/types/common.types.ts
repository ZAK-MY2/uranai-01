/**
 * 共通型定義ファイル
 * プロジェクト全体で使用される型をまとめて定義
 */

// 基本的なユーティリティ型
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type MaybeNull<T> = T | null | undefined;

// APIレスポンス型
export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  timestamp: string;
};

// ページネーション型
export type PaginationParams = {
  page: number;
  limit: number;
  total?: number;
};

export type PaginatedResponse<T> = {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

// 日付関連
export type DateRange = {
  start: Date;
  end: Date;
};

export type TimeSlot = {
  date: Date;
  hour: number;
  minute: number;
};

// ユーザー関連
export type UserProfile = {
  id: string;
  email: string;
  fullName: string;
  birthDate?: Date;
  birthTime?: string;
  birthPlace?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type UserPreferences = {
  theme: 'light' | 'dark' | 'cosmic';
  language: 'ja' | 'en';
  notifications: boolean;
  emailUpdates: boolean;
};

// 占術関連の共通型
export type DivinationType = 
  | 'numerology' 
  | 'tarot' 
  | 'astrology' 
  | 'runes' 
  | 'iching' 
  | 'nineStar' 
  | 'fengShui' 
  | 'kabbalah' 
  | 'vedic' 
  | 'celtic' 
  | 'integrated';

export type QuestionCategory = 
  | '総合運' 
  | '恋愛運' 
  | '仕事運' 
  | '健康運' 
  | '金運' 
  | '人間関係' 
  | '学業運' 
  | 'その他';

export type DivinationStatus = 
  | 'pending' 
  | 'calculating' 
  | 'completed' 
  | 'error';

// 環境データの安全な型定義（すべてoptional）
export type SafeEnvironmentData = {
  weather?: {
    temperature?: number;
    humidity?: number;
    pressure?: number;
    windSpeed?: number;
    windDirection?: string;
    condition?: string;
    cloudCover?: number;
  };
  lunar?: {
    phase?: number;
    phaseName?: string;
    illumination?: number;
    moonSign?: string;
    isVoidOfCourse?: boolean;
    eclipseNearby?: boolean;
  };
  planetary?: {
    sunSign?: string;
    moonSign?: string;
    risingSign?: string;
    retrogradeПlanets?: string[];
    dayRuler?: string;
    hourRuler?: string;
    planetaryHour?: number;
    planetaryHourRuler?: string;
  };
  timestamp?: Date;
  timezone?: string;
};

// エラー処理
export type ErrorLevel = 'info' | 'warning' | 'error' | 'critical';

export type AppError = {
  level: ErrorLevel;
  code: string;
  message: string;
  timestamp: Date;
  context?: Record<string, unknown>;
  stack?: string;
};

// フォーム関連
export type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export type FormField<T = string> = {
  value: T;
  error?: string;
  touched: boolean;
  required?: boolean;
};

export type FormState<T extends Record<string, any>> = {
  fields: {
    [K in keyof T]: FormField<T[K]>;
  };
  status: FormStatus;
  errors: string[];
};

// コンポーネント共通Props
export type BaseComponentProps = {
  className?: string;
  id?: string;
  testId?: string;
};

export type LayoutProps = BaseComponentProps & {
  children: React.ReactNode;
};

export type CardProps = BaseComponentProps & {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
};

// アニメーション関連
export type AnimationDuration = 'fast' | 'normal' | 'slow' | 'verySlow';

export const ANIMATION_DURATIONS: Record<AnimationDuration, number> = {
  fast: 200,
  normal: 300,
  slow: 500,
  verySlow: 1000,
};

// レスポンシブブレークポイント
export const BREAKPOINTS = {
  mobile: 0,
  tablet: 768,
  desktop: 1024,
  wide: 1280,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

// カラーテーマ
export type ColorScheme = {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  muted: string;
  error: string;
  warning: string;
  success: string;
};

// ユーティリティ関数の型
export type AsyncFunction<T = void, Args extends any[] = any[]> = 
  (...args: Args) => Promise<T>;

export type VoidFunction = () => void;
export type AsyncVoidFunction = () => Promise<void>;

// 条件付き型ヘルパー
export type ConditionalProps<T, K extends keyof T> = 
  T & { [P in K]-?: NonNullable<T[P]> };

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> =
  Pick<T, Exclude<keyof T, Keys>> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

// 型ガード関数
export const isNotNull = <T>(value: T | null): value is T => value !== null;
export const isNotUndefined = <T>(value: T | undefined): value is T => value !== undefined;
export const isNotNullOrUndefined = <T>(value: T | null | undefined): value is T => 
  value !== null && value !== undefined;

export const isDivinationType = (value: unknown): value is DivinationType => {
  const validTypes: DivinationType[] = [
    'numerology', 'tarot', 'astrology', 'runes', 'iching',
    'nineStar', 'fengShui', 'kabbalah', 'vedic', 'celtic', 'integrated'
  ];
  return typeof value === 'string' && validTypes.includes(value as DivinationType);
};

// デフォルト値
export const DEFAULT_PAGINATION: PaginationParams = {
  page: 1,
  limit: 20,
};

export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  theme: 'cosmic',
  language: 'ja',
  notifications: true,
  emailUpdates: false,
};