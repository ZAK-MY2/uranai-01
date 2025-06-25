'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/hooks/use-session';

interface RouteGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireInput?: boolean;
  fallbackPath?: string;
}

/**
 * ルートガードコンポーネント
 * セッション状態に基づいてアクセス制御を行う
 */
export default function RouteGuard({ 
  children, 
  requireAuth = false, 
  requireInput = false,
  fallbackPath = '/entry'
}: RouteGuardProps) {
  const router = useRouter();
  const { isAuthenticated, hasCompletedInput, isLoading } = useSession();

  useEffect(() => {
    if (isLoading) return; // ローディング中は何もしない

    // 認証が必要だが未認証の場合
    if (requireAuth && !isAuthenticated) {
      router.push('/entry');
      return;
    }

    // 入力完了が必要だが未完了の場合
    if (requireInput && !hasCompletedInput) {
      if (!isAuthenticated) {
        router.push('/entry');
      } else {
        router.push('/input');
      }
      return;
    }

    // その他のケース（カスタムフォールバック）
    if (fallbackPath && fallbackPath !== '/entry') {
      router.push(fallbackPath);
    }
  }, [isAuthenticated, hasCompletedInput, isLoading, requireAuth, requireInput, router, fallbackPath]);

  // ローディング中の表示
  if (isLoading) {
    return (
      <div className="min-h-screen bg-cosmic-dark flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-cosmic-purple/30 border-t-cosmic-purple rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-cosmic-purple/20 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  // 認証が必要だが未認証の場合は何も表示しない（リダイレクト中）
  if (requireAuth && !isAuthenticated) {
    return null;
  }

  // 入力完了が必要だが未完了の場合は何も表示しない（リダイレクト中）
  if (requireInput && !hasCompletedInput) {
    return null;
  }

  return <>{children}</>;
}