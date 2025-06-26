'use client';

import { useEffect } from 'react';
import { initializeErrorHandling } from '@/lib/error-handler';

/**
 * エラーハンドリングプロバイダー
 * 
 * グローバルエラーハンドラーの初期化を行う
 */
export function ErrorProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // クライアントサイドでのみ初期化
    initializeErrorHandling();
  }, []);

  return <>{children}</>;
}