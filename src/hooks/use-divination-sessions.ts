'use client';

import { useState, useEffect } from 'react';
import { databaseService, DivinationSession } from '@/lib/services/database-service';
import { useSession } from '@/hooks/use-session';
import { DivinationInput } from '@/lib/divination/base-engine';
import { EnvironmentData } from '@/types/database';

interface UseDivinationSessionsReturn {
  sessions: DivinationSession[];
  loading: boolean;
  error: string | null;
  saveSession: (
    divination_type: string,
    input_data: DivinationInput,
    result_data: any,
    environment_data?: EnvironmentData
  ) => Promise<string | null>;
  toggleFavorite: (sessionId: string) => Promise<boolean>;
  addNote: (sessionId: string, note: string) => Promise<boolean>;
  deleteSession: (sessionId: string) => Promise<boolean>;
  refreshSessions: () => Promise<void>;
}

export function useDivinationSessions(
  options?: {
    divination_type?: string;
    limit?: number;
    favorites_only?: boolean;
  }
): UseDivinationSessionsReturn {
  const { isAuthenticated } = useSession();
  const [sessions, setSessions] = useState<DivinationSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // デモ用のユーザーID（本番環境ではSupabase Authから取得）
  const userId = 'demo-user-001';

  // セッション取得
  const fetchSessions = async () => {
    if (!isAuthenticated) {
      setSessions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await databaseService.getSessions(userId, options);
      setSessions(data);
    } catch (err) {
      console.error('セッション取得エラー:', err);
      setError('セッションの取得に失敗しました');
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  // 初回ロードとオプション変更時の再取得
  useEffect(() => {
    fetchSessions();
  }, [isAuthenticated, options?.divination_type, options?.limit, options?.favorites_only]);

  // セッション保存
  const saveSession = async (
    divination_type: string,
    input_data: DivinationInput,
    result_data: any,
    environment_data?: EnvironmentData
  ): Promise<string | null> => {
    if (!isAuthenticated) {
      setError('ログインが必要です');
      return null;
    }

    try {
      // キャッシュに保存（非同期で実行）
      databaseService.setCachedResult(
        divination_type,
        input_data,
        result_data,
        environment_data
      ).catch(console.error);

      // セッション保存
      const sessionId = await databaseService.saveSession({
        user_id: userId,
        divination_type,
        input_data,
        result_data,
        environment_data,
        is_favorite: false
      });

      if (sessionId) {
        // セッションリストを更新
        await fetchSessions();
      }

      return sessionId;
    } catch (err) {
      console.error('セッション保存エラー:', err);
      setError('セッションの保存に失敗しました');
      return null;
    }
  };

  // お気に入り切り替え
  const toggleFavorite = async (sessionId: string): Promise<boolean> => {
    const session = sessions.find(s => s.id === sessionId);
    if (!session) return false;

    try {
      const newStatus = !session.is_favorite;
      const success = await databaseService.updateSessionFavorite(sessionId, newStatus);
      
      if (success) {
        // ローカル状態を更新
        setSessions(prev => 
          prev.map(s => 
            s.id === sessionId ? { ...s, is_favorite: newStatus } : s
          )
        );
      }

      return success;
    } catch (err) {
      console.error('お気に入り更新エラー:', err);
      setError('お気に入りの更新に失敗しました');
      return false;
    }
  };

  // メモ追加
  const addNote = async (sessionId: string, note: string): Promise<boolean> => {
    try {
      const success = await databaseService.addSessionNote(sessionId, note);
      
      if (success) {
        // ローカル状態を更新
        setSessions(prev => 
          prev.map(s => 
            s.id === sessionId ? { ...s, notes: note } : s
          )
        );
      }

      return success;
    } catch (err) {
      console.error('メモ追加エラー:', err);
      setError('メモの追加に失敗しました');
      return false;
    }
  };

  // セッション削除
  const deleteSession = async (sessionId: string): Promise<boolean> => {
    try {
      const success = await databaseService.deleteSession(sessionId);
      
      if (success) {
        // ローカル状態から削除
        setSessions(prev => prev.filter(s => s.id !== sessionId));
      }

      return success;
    } catch (err) {
      console.error('セッション削除エラー:', err);
      setError('セッションの削除に失敗しました');
      return false;
    }
  };

  return {
    sessions,
    loading,
    error,
    saveSession,
    toggleFavorite,
    addNote,
    deleteSession,
    refreshSessions: fetchSessions
  };
}

// 最新セッション取得用のヘルパーフック
export function useLatestSession(divination_type?: string): {
  session: DivinationSession | null;
  loading: boolean;
} {
  const { sessions, loading } = useDivinationSessions({
    divination_type,
    limit: 1
  });

  return {
    session: sessions[0] || null,
    loading
  };
}

// お気に入りセッション取得用のヘルパーフック
export function useFavoriteSessions(): {
  sessions: DivinationSession[];
  loading: boolean;
  error: string | null;
} {
  const { sessions, loading, error } = useDivinationSessions({
    favorites_only: true
  });

  return { sessions, loading, error };
}