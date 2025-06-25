import { createClient } from '@/lib/supabase/client';
import { DivinationInput } from '@/lib/divination/base-engine';
import { EnvironmentData } from '@/types/database';

// データベース型定義
export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  birth_date: string;
  birth_time?: string;
  birth_place?: string;
  gender?: string;
  avatar_url?: string;
  preferences?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface DivinationSession {
  id: string;
  user_id: string;
  divination_type: string;
  input_data: DivinationInput;
  result_data: any;
  environment_data?: EnvironmentData;
  is_favorite: boolean;
  notes?: string;
  created_at: string;
}

export interface UserSettings {
  user_id: string;
  theme: 'cosmic' | 'light' | 'dark';
  language: 'ja' | 'en' | 'zh' | 'ko';
  notification_enabled: boolean;
  privacy_settings: {
    share_results: boolean;
    public_profile: boolean;
    anonymous_mode: boolean;
  };
  display_settings: {
    font_size: 'small' | 'medium' | 'large';
    animations: boolean;
    high_contrast: boolean;
    reduced_motion: boolean;
  };
  divination_preferences: {
    default_spread: string;
    auto_save: boolean;
    show_explanations: boolean;
  };
  created_at: string;
  updated_at: string;
}

export interface UserStatistics {
  user_id: string;
  total_readings: number;
  readings_by_type: Record<string, number>;
  favorite_divination_type?: string;
  most_asked_category?: string;
  lucky_elements: string[];
  unlucky_elements: string[];
  reading_patterns: Record<string, any>;
  last_reading_at?: string;
  created_at: string;
  updated_at: string;
}

export class DatabaseService {
  private supabase = createClient();

  // ========================================
  // プロファイル関連
  // ========================================
  
  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('プロファイル取得エラー:', error);
      return null;
    }

    return data;
  }

  async updateProfile(userId: string, updates: Partial<Profile>): Promise<boolean> {
    const { error } = await this.supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId);

    if (error) {
      console.error('プロファイル更新エラー:', error);
      return false;
    }

    return true;
  }

  // ========================================
  // 占術セッション関連
  // ========================================
  
  async saveSession(session: Omit<DivinationSession, 'id' | 'created_at'>): Promise<string | null> {
    const { data, error } = await this.supabase
      .from('divination_sessions')
      .insert(session)
      .select('id')
      .single();

    if (error) {
      console.error('セッション保存エラー:', error);
      return null;
    }

    // 統計も自動更新される（トリガーによる）
    return data.id;
  }

  async getSessions(
    userId: string,
    options?: {
      divination_type?: string;
      limit?: number;
      offset?: number;
      favorites_only?: boolean;
    }
  ): Promise<DivinationSession[]> {
    let query = this.supabase
      .from('divination_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (options?.divination_type) {
      query = query.eq('divination_type', options.divination_type);
    }

    if (options?.favorites_only) {
      query = query.eq('is_favorite', true);
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    const { data, error } = await query;

    if (error) {
      console.error('セッション取得エラー:', error);
      return [];
    }

    return data || [];
  }

  async updateSessionFavorite(sessionId: string, isFavorite: boolean): Promise<boolean> {
    const { error } = await this.supabase
      .from('divination_sessions')
      .update({ is_favorite: isFavorite })
      .eq('id', sessionId);

    if (error) {
      console.error('お気に入り更新エラー:', error);
      return false;
    }

    return true;
  }

  async addSessionNote(sessionId: string, note: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('divination_sessions')
      .update({ notes: note })
      .eq('id', sessionId);

    if (error) {
      console.error('メモ追加エラー:', error);
      return false;
    }

    return true;
  }

  async deleteSession(sessionId: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('divination_sessions')
      .delete()
      .eq('id', sessionId);

    if (error) {
      console.error('セッション削除エラー:', error);
      return false;
    }

    return true;
  }

  // ========================================
  // ユーザー設定関連
  // ========================================
  
  async getUserSettings(userId: string): Promise<UserSettings | null> {
    const { data, error } = await this.supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') { // レコードが存在しない場合のエラーは無視
      console.error('設定取得エラー:', error);
      return null;
    }

    // 設定が存在しない場合はデフォルトを作成
    if (!data) {
      const defaultSettings: Omit<UserSettings, 'created_at' | 'updated_at'> = {
        user_id: userId,
        theme: 'cosmic',
        language: 'ja',
        notification_enabled: true,
        privacy_settings: {
          share_results: false,
          public_profile: false,
          anonymous_mode: false
        },
        display_settings: {
          font_size: 'medium',
          animations: true,
          high_contrast: false,
          reduced_motion: false
        },
        divination_preferences: {
          default_spread: 'three-card',
          auto_save: true,
          show_explanations: true
        }
      };

      await this.updateUserSettings(userId, defaultSettings);
      return { ...defaultSettings, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    }

    return data;
  }

  async updateUserSettings(userId: string, settings: Partial<UserSettings>): Promise<boolean> {
    const { error } = await this.supabase
      .from('user_settings')
      .upsert({ user_id: userId, ...settings });

    if (error) {
      console.error('設定更新エラー:', error);
      return false;
    }

    return true;
  }

  // ========================================
  // 統計関連
  // ========================================
  
  async getUserStatistics(userId: string): Promise<UserStatistics | null> {
    const { data, error } = await this.supabase
      .from('user_statistics')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('統計取得エラー:', error);
      return null;
    }

    return data;
  }

  // ========================================
  // キャッシュ関連
  // ========================================
  
  async getCachedResult(
    divination_type: string,
    input_data: DivinationInput
  ): Promise<any | null> {
    // キャッシュキーを生成
    const cache_key = await this.generateCacheKey(divination_type, input_data);

    const { data, error } = await this.supabase
      .from('divination_cache')
      .select('result_data, environment_data, hit_count')
      .eq('cache_key', cache_key)
      .single();

    if (error || !data) {
      return null;
    }

    // ヒットカウントを増やす
    await this.supabase
      .from('divination_cache')
      .update({ hit_count: (data.hit_count || 0) + 1 })
      .eq('cache_key', cache_key);

    return {
      result_data: data.result_data,
      environment_data: data.environment_data
    };
  }

  async setCachedResult(
    divination_type: string,
    input_data: DivinationInput,
    result_data: any,
    environment_data?: EnvironmentData
  ): Promise<boolean> {
    const cache_key = await this.generateCacheKey(divination_type, input_data);
    const input_hash = this.generateInputHash(input_data);

    const { error } = await this.supabase
      .from('divination_cache')
      .upsert({
        cache_key,
        divination_type,
        input_hash,
        result_data,
        environment_data,
        hit_count: 0
      });

    if (error) {
      console.error('キャッシュ保存エラー:', error);
      return false;
    }

    return true;
  }

  private async generateCacheKey(
    divination_type: string,
    input_data: DivinationInput
  ): Promise<string> {
    // 簡易的なハッシュ生成（本番環境では crypto API を使用）
    const dataString = divination_type + '::' + JSON.stringify(input_data);
    return btoa(dataString).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32);
  }

  private generateInputHash(input_data: DivinationInput): string {
    return btoa(JSON.stringify(input_data)).substring(0, 16);
  }

  // ========================================
  // 環境データ関連
  // ========================================
  
  async saveEnvironmentLog(environmentData: EnvironmentData): Promise<boolean> {
    const { error } = await this.supabase
      .from('environment_logs')
      .insert({
        weather_data: environmentData.weather,
        lunar_data: environmentData.lunar,
        astronomical_data: environmentData.astronomical,
        location: environmentData.location
      });

    if (error) {
      console.error('環境データ保存エラー:', error);
      return false;
    }

    return true;
  }

  async getLatestEnvironmentLog(): Promise<EnvironmentData | null> {
    const { data, error } = await this.supabase
      .from('environment_logs')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      return null;
    }

    return {
      weather: data.weather_data,
      lunar: data.lunar_data,
      astronomical: data.astronomical_data,
      location: data.location,
      timestamp: data.timestamp || new Date().toISOString()
    };
  }

  // ========================================
  // お気に入りスプレッド関連
  // ========================================
  
  async saveFavoriteSpread(
    userId: string,
    name: string,
    divination_type: string,
    configuration: any
  ): Promise<boolean> {
    const { error } = await this.supabase
      .from('favorite_spreads')
      .insert({
        user_id: userId,
        name,
        divination_type,
        configuration
      });

    if (error) {
      console.error('お気に入りスプレッド保存エラー:', error);
      return false;
    }

    return true;
  }

  async getFavoriteSpreads(userId: string, divination_type?: string): Promise<any[]> {
    let query = this.supabase
      .from('favorite_spreads')
      .select('*')
      .eq('user_id', userId)
      .order('usage_count', { ascending: false });

    if (divination_type) {
      query = query.eq('divination_type', divination_type);
    }

    const { data, error } = await query;

    if (error) {
      console.error('お気に入りスプレッド取得エラー:', error);
      return [];
    }

    return data || [];
  }

  async incrementSpreadUsage(spreadId: string): Promise<boolean> {
    const { data, error: fetchError } = await this.supabase
      .from('favorite_spreads')
      .select('usage_count')
      .eq('id', spreadId)
      .single();

    if (fetchError || !data) {
      return false;
    }

    const { error: updateError } = await this.supabase
      .from('favorite_spreads')
      .update({ usage_count: data.usage_count + 1 })
      .eq('id', spreadId);

    if (updateError) {
      console.error('使用回数更新エラー:', updateError);
      return false;
    }

    return true;
  }
}

// シングルトンインスタンス
export const databaseService = new DatabaseService();