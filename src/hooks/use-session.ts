import { useState, useEffect } from 'react';
import SessionManager, { SessionData } from '@/lib/auth/session-manager';

/**
 * セッション管理用カスタムフック
 */
export function useSession() {
  const [sessionInfo, setSessionInfo] = useState({
    isAuthenticated: false,
    hasCompletedInput: false,
    timeRemaining: 0,
    needsReauth: false
  });
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 初期状態の取得
    const updateSessionInfo = () => {
      const info = SessionManager.getSessionInfo();
      setSessionInfo(info);
      setIsLoading(false);
      
      // セッション期限切れの場合はリダイレクト処理をトリガー
      if (info.needsReauth) {
        SessionManager.clearSession();
        window.location.href = '/entry';
      }
    };

    updateSessionInfo();

    // 30秒ごとにセッション状態をチェック
    const interval = setInterval(updateSessionInfo, 30 * 1000);
    
    // ページアクティビティの追跡
    const handleActivity = () => {
      if (SessionManager.isAuthenticated()) {
        SessionManager.updateActivity();
        updateSessionInfo();
      }
    };

    // ユーザーアクティビティイベント
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    return () => {
      clearInterval(interval);
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, []);

  /**
   * 呪文認証
   */
  const authenticate = (password: string): boolean => {
    const success = SessionManager.authenticate(password);
    if (success) {
      setSessionInfo(SessionManager.getSessionInfo());
    }
    return success;
  };

  /**
   * 入力完了マーク
   */
  const markInputCompleted = (inputData: any) => {
    SessionManager.markInputCompleted(inputData);
    setSessionInfo(SessionManager.getSessionInfo());
  };

  /**
   * ログアウト
   */
  const logout = () => {
    SessionManager.clearSession();
    setSessionInfo({
      isAuthenticated: false,
      hasCompletedInput: false,
      timeRemaining: 0,
      needsReauth: false
    });
  };

  return {
    ...sessionInfo,
    isLoading,
    authenticate,
    markInputCompleted,
    logout
  };
}