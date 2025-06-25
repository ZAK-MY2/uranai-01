/**
 * COSMIC ORACLE セッション管理システム
 * 呪文認証と30分タイムアウト機能
 */

export interface SessionData {
  isAuthenticated: boolean;
  lastActivity: number;
  hasCompletedInput: boolean;
  userInputData?: any;
}

class SessionManager {
  private static readonly SESSION_KEY = 'cosmic-oracle-session';
  private static readonly TIMEOUT_DURATION = 30 * 60 * 1000; // 30分
  private static readonly SPELL_PASSWORD = 'cosmic-oracle-2024'; // 本番では環境変数化

  /**
   * セッション状態を取得
   */
  static getSession(): SessionData | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const sessionStr = localStorage.getItem(this.SESSION_KEY);
      if (!sessionStr) return null;
      
      const session: SessionData = JSON.parse(sessionStr);
      
      // タイムアウトチェック
      const now = Date.now();
      if (now - session.lastActivity > this.TIMEOUT_DURATION) {
        this.clearSession();
        return null;
      }
      
      return session;
    } catch (error) {
      console.error('Session parse error:', error);
      this.clearSession();
      return null;
    }
  }

  /**
   * セッションを更新（最終活動時刻を更新）
   */
  static updateActivity(): void {
    if (typeof window === 'undefined') return;
    
    const session = this.getSession();
    if (session) {
      session.lastActivity = Date.now();
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    }
  }

  /**
   * 呪文認証
   */
  static authenticate(password: string): boolean {
    if (password !== this.SPELL_PASSWORD) {
      return false;
    }

    const session: SessionData = {
      isAuthenticated: true,
      lastActivity: Date.now(),
      hasCompletedInput: false
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    }

    return true;
  }

  /**
   * 入力完了をマーク
   */
  static markInputCompleted(inputData: any): void {
    const session = this.getSession();
    if (session) {
      session.hasCompletedInput = true;
      session.userInputData = inputData;
      session.lastActivity = Date.now();
      
      if (typeof window !== 'undefined') {
        localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
      }
    }
  }

  /**
   * セッションクリア
   */
  static clearSession(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.SESSION_KEY);
    }
  }

  /**
   * 認証状態チェック
   */
  static isAuthenticated(): boolean {
    const session = this.getSession();
    return session?.isAuthenticated || false;
  }

  /**
   * 入力完了状態チェック
   */
  static hasCompletedInput(): boolean {
    const session = this.getSession();
    return session?.hasCompletedInput || false;
  }

  /**
   * 残り時間を取得（分単位）
   */
  static getTimeRemaining(): number {
    const session = this.getSession();
    if (!session) return 0;
    
    const elapsed = Date.now() - session.lastActivity;
    const remaining = this.TIMEOUT_DURATION - elapsed;
    
    return Math.max(0, Math.ceil(remaining / (60 * 1000)));
  }

  /**
   * セッション状態の詳細情報
   */
  static getSessionInfo(): {
    isAuthenticated: boolean;
    hasCompletedInput: boolean;
    timeRemaining: number;
    needsReauth: boolean;
  } {
    const session = this.getSession();
    const timeRemaining = this.getTimeRemaining();
    
    return {
      isAuthenticated: session?.isAuthenticated || false,
      hasCompletedInput: session?.hasCompletedInput || false,
      timeRemaining,
      needsReauth: timeRemaining === 0 && (session?.isAuthenticated || false)
    };
  }
}

export default SessionManager;