'use client';

import React, { Component, ReactNode } from 'react';
import { GlassCard, GlassCardContent } from '@/components/ui/glass-card';
import Link from 'next/link';

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

      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
          <GlassCard className="max-w-md w-full p-8 text-center">
            <GlassCardContent>
              <div className="mb-6">
                <div className="text-6xl mb-4">🌌</div>
                <h2 className="text-2xl font-light text-white mb-2">
                  宇宙の調和が乱れました
                </h2>
                <p className="text-white/60">
                  申し訳ございません。予期せぬエラーが発生しました。
                </p>
              </div>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="mb-6 p-4 bg-red-500/10 rounded-lg text-left">
                  <p className="text-red-300 text-sm font-mono">
                    {this.state.error.message}
                  </p>
                </div>
              )}
              
              <div className="space-y-3">
                <button
                  onClick={() => window.location.reload()}
                  className="w-full px-6 py-3 bg-purple-600/20 border border-purple-500/50 rounded-lg text-purple-300 hover:bg-purple-600/30 transition-all"
                >
                  ページを再読み込み
                </button>
                <Link
                  href="/"
                  className="block w-full px-6 py-3 bg-blue-600/20 border border-blue-500/50 rounded-lg text-blue-300 hover:bg-blue-600/30 transition-all"
                >
                  ホームに戻る
                </Link>
              </div>
            </GlassCardContent>
          </GlassCard>
        </div>
      );
    }

    return this.props.children;
  }
}