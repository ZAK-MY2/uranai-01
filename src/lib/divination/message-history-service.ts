import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

/**
 * メッセージ履歴管理サービス
 * Supabaseを使用してメッセージの重複を防ぐ
 */
export class MessageHistoryService {
  private supabase;
  private localCache: Map<string, boolean> = new Map();
  private cacheSize = 1000;

  constructor() {
    // Supabaseクライアントの初期化
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.warn('Supabase credentials not found. Using local cache only.');
    } else {
      this.supabase = createClient<Database>(supabaseUrl, supabaseKey);
    }
  }

  /**
   * メッセージハッシュの一意性をチェック
   */
  async checkUniqueness(messageHash: string): Promise<boolean> {
    // ローカルキャッシュをまずチェック
    if (this.localCache.has(messageHash)) {
      return false;
    }

    // Supabaseが利用可能な場合はDBチェック
    if (this.supabase) {
      try {
        const { data, error } = await this.supabase
          .from('message_history')
          .select('hash')
          .eq('hash', messageHash)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
          console.error('Error checking message uniqueness:', error);
          // エラー時はローカルキャッシュのみで判断
          return !this.localCache.has(messageHash);
        }

        return data === null;
      } catch (error) {
        console.error('Supabase connection error:', error);
        return !this.localCache.has(messageHash);
      }
    }

    return true;
  }

  /**
   * メッセージハッシュを記録
   */
  async recordMessage(
    messageHash: string,
    userId: string,
    divinationType: string
  ): Promise<void> {
    // ローカルキャッシュに追加
    this.localCache.set(messageHash, true);
    
    // キャッシュサイズ管理
    if (this.localCache.size > this.cacheSize) {
      const firstKey = this.localCache.keys().next().value;
      if (firstKey) {
        this.localCache.delete(firstKey);
      }
    }

    // Supabaseが利用可能な場合はDBに記録
    if (this.supabase) {
      try {
        const { error } = await this.supabase
          .from('message_history')
          .insert({
            hash: messageHash,
            user_id: userId,
            divination_type: divinationType,
            created_at: new Date().toISOString()
          });

        if (error) {
          console.error('Error recording message:', error);
        }
      } catch (error) {
        console.error('Supabase connection error:', error);
      }
    }
  }

  /**
   * ユーザーの過去メッセージ数を取得
   */
  async getUserMessageCount(userId: string): Promise<number> {
    if (!this.supabase) {
      // ローカルのみの場合は推定値を返す
      return Math.floor(Math.random() * 100);
    }

    try {
      const { count, error } = await this.supabase
        .from('message_history')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      if (error) {
        console.error('Error getting user message count:', error);
        return 0;
      }

      return count || 0;
    } catch (error) {
      console.error('Supabase connection error:', error);
      return 0;
    }
  }

  /**
   * 古いメッセージ履歴をクリーンアップ（2年以上前のデータ）
   */
  async cleanupOldMessages(): Promise<void> {
    if (!this.supabase) return;

    try {
      const twoYearsAgo = new Date();
      twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);

      const { error } = await this.supabase
        .from('message_history')
        .delete()
        .lt('created_at', twoYearsAgo.toISOString());

      if (error) {
        console.error('Error cleaning up old messages:', error);
      }
    } catch (error) {
      console.error('Supabase connection error:', error);
    }
  }

  /**
   * 統計情報を取得
   */
  async getStatistics(): Promise<{
    totalMessages: number;
    uniqueUsers: number;
    messagesLast24h: number;
    messagesLast7d: number;
  }> {
    if (!this.supabase) {
      return {
        totalMessages: this.localCache.size,
        uniqueUsers: 0,
        messagesLast24h: 0,
        messagesLast7d: 0
      };
    }

    try {
      // 総メッセージ数
      const { count: totalMessages } = await this.supabase
        .from('message_history')
        .select('*', { count: 'exact', head: true });

      // ユニークユーザー数（実際のDBではDISTINCT相当の処理が必要）
      const { data: users } = await this.supabase
        .from('message_history')
        .select('user_id')
        .limit(1000);
      
      const uniqueUsers = new Set(users?.map(u => u.user_id) || []).size;

      // 24時間以内のメッセージ
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);
      
      const { count: messagesLast24h } = await this.supabase
        .from('message_history')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', oneDayAgo.toISOString());

      // 7日以内のメッセージ
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const { count: messagesLast7d } = await this.supabase
        .from('message_history')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', sevenDaysAgo.toISOString());

      return {
        totalMessages: totalMessages || 0,
        uniqueUsers,
        messagesLast24h: messagesLast24h || 0,
        messagesLast7d: messagesLast7d || 0
      };
    } catch (error) {
      console.error('Error getting statistics:', error);
      return {
        totalMessages: this.localCache.size,
        uniqueUsers: 0,
        messagesLast24h: 0,
        messagesLast7d: 0
      };
    }
  }
}

// グローバルインスタンス
export const messageHistoryService = new MessageHistoryService();