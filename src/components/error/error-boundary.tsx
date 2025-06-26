'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetKeys?: Array<string | number>;
  resetOnPropsChange?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorCount: number;
}

/**
 * エラーバウンダリーコンポーネント
 * 
 * 子コンポーネントで発生したエラーをキャッチし、
 * クラッシュを防ぎつつユーザーフレンドリーなエラー画面を表示
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // エラー情報を更新
    this.setState(prevState => ({
      error,
      errorInfo,
      errorCount: prevState.errorCount + 1
    }));

    // カスタムエラーハンドラーがあれば実行
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // 本番環境ではエラーをサーバーに送信
    if (process.env.NODE_ENV === 'production') {
      this.logErrorToService(error, errorInfo);
    }
  }

  componentDidUpdate(prevProps: Props) {
    const { resetKeys, resetOnPropsChange } = this.props;
    const { hasError } = this.state;
    
    // resetKeysが変更された場合、エラー状態をリセット
    if (hasError && prevProps.resetKeys !== resetKeys) {
      if (resetKeys?.some((key, idx) => key !== prevProps.resetKeys?.[idx])) {
        this.resetErrorBoundary();
      }
    }
    
    // props変更時のリセット
    if (hasError && resetOnPropsChange && prevProps.children !== this.props.children) {
      this.resetErrorBoundary();
    }
  }

  private logErrorToService(error: Error, errorInfo: ErrorInfo) {
    // エラートラッキングサービスへの送信
    const errorData = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown',
      url: typeof window !== 'undefined' ? window.location.href : 'unknown',
      errorCount: this.state.errorCount
    };

    // TODO: 実際のエラートラッキングサービスへの送信
    console.log('Error logged:', errorData);
  }

  public resetErrorBoundary = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  private handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      // カスタムフォールバックがあれば使用
      if (this.props.fallback) {
        return <>{this.props.fallback}</>;
      }

      // エラー回数が多い場合の特別な処理
      if (this.state.errorCount > 3) {
        return (
          <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-900/20 to-pink-900/20">
            <div className="max-w-md w-full text-center">
              <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-white mb-4">
                繰り返しエラーが発生しています
              </h1>
              <p className="text-gray-300 mb-6">
                申し訳ございません。アプリケーションに問題が発生しているようです。
                ブラウザを再起動するか、しばらく時間をおいてからアクセスしてください。
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                <Home className="w-4 h-4" />
                ホームに戻る
              </Link>
            </div>
          </div>
        );
      }

      // デフォルトのエラー画面
      return (
        <div className="min-h-[400px] flex items-center justify-center p-8">
          <div className="max-w-md w-full">
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 text-center backdrop-blur-sm">
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              
              <h2 className="text-xl font-semibold text-white mb-2">
                申し訳ございません
              </h2>
              
              <p className="text-gray-300 mb-6">
                予期しないエラーが発生しました。
                問題が続く場合は、サポートまでお問い合わせください。
              </p>

              {/* 開発環境でのみエラー詳細を表示 */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mb-6 text-left">
                  <summary className="cursor-pointer text-sm text-gray-400 hover:text-gray-300">
                    エラー詳細（開発用）
                  </summary>
                  <div className="mt-2 p-3 bg-black/30 rounded text-xs font-mono overflow-auto max-h-64">
                    <p className="text-red-400 mb-2">{this.state.error.message}</p>
                    <pre className="text-gray-400 whitespace-pre-wrap">
                      {this.state.error.stack}
                    </pre>
                    {this.state.errorInfo && (
                      <div className="mt-4 pt-4 border-t border-gray-700">
                        <p className="text-gray-500 mb-2">Component Stack:</p>
                        <pre className="text-gray-400 whitespace-pre-wrap">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              )}

              <div className="flex gap-3 justify-center">
                <button
                  onClick={this.resetErrorBoundary}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  再試行
                </button>
                
                <button
                  onClick={this.handleReload}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  ページを再読み込み
                </button>
              </div>

              {this.state.errorCount > 1 && (
                <p className="mt-4 text-sm text-gray-400">
                  エラー発生回数: {this.state.errorCount}回
                </p>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * 占術専用エラーバウンダリー
 */
export class DivinationErrorBoundary extends ErrorBoundary {
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20 backdrop-blur-sm">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2">
                占術の実行中にエラーが発生しました
              </h3>
              <p className="text-gray-300 mb-4">
                運命のエネルギーが一時的に不安定になっているようです。
                しばらく時間をおいてから再度お試しください。
              </p>
              
              {/* エラーの種類に応じたメッセージ */}
              {this.state.error?.message.includes('timeout') && (
                <p className="text-sm text-gray-400 mb-4">
                  ※ 処理に時間がかかりすぎたため、中断されました。
                </p>
              )}
              
              {this.state.error?.message.includes('network') && (
                <p className="text-sm text-gray-400 mb-4">
                  ※ ネットワーク接続に問題がある可能性があります。
                </p>
              )}
              
              <div className="flex gap-3">
                <button
                  onClick={this.resetErrorBoundary}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm"
                >
                  もう一度占う
                </button>
                
                <Link
                  href="/dashboard"
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm"
                >
                  ダッシュボードに戻る
                </Link>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * useErrorBoundary フック
 * 関数コンポーネントでエラーバウンダリーを使用するためのフック
 */
export function useErrorBoundary() {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = () => setError(null);

  const captureError = (error: Error) => {
    setError(error);
  };

  // エラーがある場合は再スロー（ErrorBoundaryでキャッチされる）
  if (error) {
    throw error;
  }

  return { captureError, resetError };
}