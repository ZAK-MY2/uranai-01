'use client';

import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

/**
 * Hydrationエラーを防ぐための安全なクライアントコンポーネントテンプレート
 * 
 * 使用例:
 * const SafeMyComponent = createSafeClientComponent(() => import('./MyComponent'));
 * 
 * または直接使用:
 * const SafeMyComponent = dynamic(() => import('./MyComponent'), {
 *   ssr: false,
 *   loading: () => <LoadingSpinner />
 * });
 */

// ローディングコンポーネント
export const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-4">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
  </div>
);

// エラーフォールバック
export const ErrorFallback = ({ error }: { error?: Error }) => (
  <div className="p-4 bg-red-50 border border-red-200 rounded-md">
    <p className="text-red-800">コンポーネントの読み込みに失敗しました</p>
    {error && <p className="text-sm text-red-600 mt-2">{error.message}</p>}
  </div>
);

// 型定義
type DynamicComponentOptions<P = {}> = {
  loading?: ComponentType;
  error?: ComponentType<{ error?: Error }>;
  ssr?: boolean;
};

/**
 * 安全なクライアントコンポーネントを作成するヘルパー関数
 */
export function createSafeClientComponent<P = {}>(
  importFunc: () => Promise<{ default: ComponentType<P> }>,
  options: { ssr?: boolean } = {}
) {
  return dynamic(importFunc, {
    ssr: options.ssr ?? false
  });
}

/**
 * localStorageを安全に使用するフック
 */
export function useSafeLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setValue(JSON.parse(item));
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
    } finally {
      setIsLoading(false);
    }
  }, [key]);

  const setStoredValue = useCallback((newValue: T) => {
    try {
      setValue(newValue);
      window.localStorage.setItem(key, JSON.stringify(newValue));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key]);

  return { value, setValue: setStoredValue, isLoading };
}

/**
 * ブラウザAPIの使用を安全にラップするフック
 */
export function useBrowserAPI<T>(
  apiCall: () => T,
  fallback: T
): { data: T; isClient: boolean } {
  const [data, setData] = useState<T>(fallback);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    try {
      setData(apiCall());
    } catch (error) {
      console.error('Browser API error:', error);
      setData(fallback);
    }
  }, []);

  return { data, isClient };
}

// 必要なインポート（上部に追加）
import { useState, useEffect, useCallback } from 'react';

/**
 * 使用例
 */

// 1. 基本的な使用
// const SafeDashboard = createSafeClientComponent(() => import('./Dashboard'));

// 2. カスタムローディング
// const SafeDashboard = createSafeClientComponent(
//   () => import('./Dashboard'),
//   {
//     loading: () => <div>ダッシュボードを読み込み中...</div>
//   }
// );

// 3. localStorage使用コンポーネント
// function MyComponent() {
//   const { value, setValue, isLoading } = useSafeLocalStorage('user-settings', {});
//   
//   if (isLoading) return <LoadingSpinner />;
//   
//   return <div>{/* コンポーネントの内容 */}</div>;
// }

// 4. ブラウザAPI使用
// function WindowSizeComponent() {
//   const { data: windowSize, isClient } = useBrowserAPI(
//     () => ({ width: window.innerWidth, height: window.innerHeight }),
//     { width: 0, height: 0 }
//   );
//   
//   return <div>Window size: {windowSize.width} x {windowSize.height}</div>;
// }