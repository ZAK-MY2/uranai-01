'use client';

import React, { Component, ReactNode } from 'react';
import Link from 'next/link';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error?: Error;
  reset?: () => void;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, reset }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 text-center">
          {/* エラーアイコン */}
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center">
                <AlertCircle className="w-10 h-10 text-red-400" />
              </div>
              <div className="absolute inset-0 bg-red-500/20 rounded-full animate-ping" />
            </div>
          </div>

          {/* エラーメッセージ */}
          <h2 className="text-2xl font-light text-white mb-4">
            エラーが発生しました
          </h2>
          <p className="text-white/70 mb-6">
            申し訳ございません。予期せぬエラーが発生しました。
          </p>

          {/* エラー詳細（開発環境のみ） */}
          {process.env.NODE_ENV === 'development' && error && (
            <div className="mb-6 p-4 bg-red-500/10 rounded-lg text-left">
              <p className="text-red-300 text-sm font-mono break-all">
                {error.message}
              </p>
            </div>
          )}

          {/* アクションボタン */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-purple-600/30 hover:bg-purple-600/50 text-white rounded-full transition-all duration-300 border border-purple-500/50"
            >
              <RefreshCw className="w-4 h-4" />
              ページを再読み込み
            </button>
            <Link
              href="/"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all duration-300"
            >
              <Home className="w-4 h-4" />
              トップへ戻る
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// 404エラーページ
export const NotFoundError: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 text-center">
          {/* 404アイコン */}
          <div className="mb-6">
            <div className="text-8xl font-light text-white/20">404</div>
          </div>

          {/* メッセージ */}
          <h2 className="text-2xl font-light text-white mb-4">
            ページが見つかりません
          </h2>
          <p className="text-white/70 mb-6">
            お探しのページは存在しないか、移動した可能性があります。
          </p>

          {/* ホームへ戻るボタン */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600/30 hover:bg-purple-600/50 text-white rounded-full transition-all duration-300 border border-purple-500/50"
          >
            <Home className="w-4 h-4" />
            トップページへ
          </Link>
        </div>
      </div>
    </div>
  );
};