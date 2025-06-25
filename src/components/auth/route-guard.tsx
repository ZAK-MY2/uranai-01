'use client';

interface RouteGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireInput?: boolean;
  fallbackPath?: string;
}

/**
 * ルートガードコンポーネント（デモモード）
 * 認証チェックを無効化し、常にコンテンツを表示
 */
export default function RouteGuard({ 
  children
}: RouteGuardProps) {
  // デモモード: 認証チェックをスキップし、常にコンテンツを表示
  return <>{children}</>;
}