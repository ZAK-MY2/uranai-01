'use client';

import React, { Component, ReactNode, Suspense } from 'react';
import { ErrorBoundary } from '@/components/error/error-boundary';
import { Loader2 } from 'lucide-react';

interface AsyncErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  loadingFallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

/**
 * 非同期コンポーネント用のエラーバウンダリー
 * 
 * Suspenseとエラーバウンダリーを組み合わせて、
 * 非同期処理のローディングとエラーを適切に処理
 */
export function AsyncErrorBoundary({
  children,
  fallback,
  loadingFallback,
  onError
}: AsyncErrorBoundaryProps) {
  return (
    <ErrorBoundary fallback={fallback} onError={onError}>
      <Suspense fallback={loadingFallback || <DefaultLoadingFallback />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}

/**
 * デフォルトのローディング表示
 */
function DefaultLoadingFallback() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin mx-auto mb-4" />
        <p className="text-gray-400">読み込み中...</p>
      </div>
    </div>
  );
}

/**
 * 占術用の非同期エラーバウンダリー
 */
export function DivinationAsyncBoundary({ children }: { children: ReactNode }) {
  return (
    <AsyncErrorBoundary
      loadingFallback={<DivinationLoadingFallback />}
      fallback={<DivinationErrorFallback />}
    >
      {children}
    </AsyncErrorBoundary>
  );
}

/**
 * 占術用のローディング表示
 */
function DivinationLoadingFallback() {
  return (
    <div className="flex items-center justify-center p-12">
      <div className="text-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-purple-500/30 rounded-full"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-purple-500 rounded-full animate-spin border-t-transparent"></div>
        </div>
        <p className="text-purple-300 mt-4 animate-pulse">
          宇宙のエネルギーを読み取っています...
        </p>
      </div>
    </div>
  );
}

/**
 * 占術用のエラー表示
 */
function DivinationErrorFallback() {
  return (
    <div className="p-6 bg-gradient-to-br from-red-500/10 to-pink-500/10 rounded-lg border border-red-500/20 text-center">
      <p className="text-red-300">
        占術の読み込み中にエラーが発生しました。
      </p>
      <button
        onClick={() => window.location.reload()}
        className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
      >
        ページを再読み込み
      </button>
    </div>
  );
}