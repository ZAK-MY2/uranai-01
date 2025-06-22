// データベース型定義
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          birth_date: string | null;
          birth_time: string | null;
          birth_location: BirthLocation | null;
          preferences: UserPreferences;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          birth_date?: string | null;
          birth_time?: string | null;
          birth_location?: BirthLocation | null;
          preferences?: UserPreferences;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          birth_date?: string | null;
          birth_time?: string | null;
          birth_location?: BirthLocation | null;
          preferences?: UserPreferences;
          created_at?: string;
          updated_at?: string;
        };
      };
      divination_sessions: {
        Row: {
          id: string;
          user_id: string;
          session_type: SessionType;
          input_data: Record<string, unknown>;
          results: Record<string, unknown>;
          environment_data: EnvironmentData | null;
          interpretation: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          session_type: SessionType;
          input_data: Record<string, unknown>;
          results: Record<string, unknown>;
          environment_data?: EnvironmentData | null;
          interpretation?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          session_type?: SessionType;
          input_data?: Record<string, unknown>;
          results?: Record<string, unknown>;
          environment_data?: EnvironmentData | null;
          interpretation?: string | null;
          created_at?: string;
        };
      };
      divination_cache: {
        Row: {
          id: string;
          cache_key: string;
          divination_type: string;
          input_hash: string;
          result_data: Record<string, unknown>;
          expires_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          cache_key: string;
          divination_type: string;
          input_hash: string;
          result_data: Record<string, unknown>;
          expires_at: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          cache_key?: string;
          divination_type?: string;
          input_hash?: string;
          result_data?: Record<string, unknown>;
          expires_at?: string;
          created_at?: string;
        };
      };
      environment_logs: {
        Row: {
          id: string;
          data_type: string;
          location: LocationData | null;
          data: Record<string, unknown>;
          collected_at: string;
        };
        Insert: {
          id?: string;
          data_type: string;
          location?: LocationData | null;
          data: Record<string, unknown>;
          collected_at?: string;
        };
        Update: {
          id?: string;
          data_type?: string;
          location?: LocationData | null;
          data?: Record<string, unknown>;
          collected_at?: string;
        };
      };
      user_settings: {
        Row: {
          id: string;
          user_id: string;
          setting_key: string;
          setting_value: Record<string, unknown>;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          setting_key: string;
          setting_value: Record<string, unknown>;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          setting_key?: string;
          setting_value?: Record<string, unknown>;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

// 関連する型定義
export interface BirthLocation {
  lat: number;
  lon: number;
  timezone: string;
  city: string;
}

export interface UserPreferences {
  language?: string;
  theme?: string;
  defaultLocation?: BirthLocation;
}

export interface LocationData {
  latitude: number;
  longitude: number;
}

export type SessionType = 'numerology' | 'tarot' | 'astrology' | 'kyusei' | 'integrated';

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
  distanceFromEarth?: {
    kilometers: number;
    astronomicalUnits: number;
    earthRadii: number;
    phase: string;
    perigeeApogee: string;
  };
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

export interface PlanetaryHour {
  planet: string;
  startTime: string;
  endTime: string;
}