'use client';

import { useState, useEffect } from 'react';
import { cacheManager } from '@/lib/cache/cache-manager';
import { performanceOptimizer } from '@/lib/performance/optimizer';
import { divinationLazyLoader } from '@/lib/lazy/lazy-loader';

interface PerformanceMetrics {
  cache: any;
  performance: any;
  lazyLoader: any;
  system: {
    memoryUsage: number;
    cpuLoad: number;
    uptime: number;
  };
}

export default function PerformanceDashboard() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(5000); // 5秒

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('/api/admin/performance-metrics');
        const data = await response.json();
        setMetrics(data);
      } catch (error) {
        console.error('Failed to fetch performance metrics:', error);
      }
    };

    fetchMetrics();

    if (autoRefresh) {
      const interval = setInterval(fetchMetrics, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  const handleClearCache = async () => {
    try {
      await fetch('/api/admin/clear-cache', { method: 'POST' });
      alert('キャッシュをクリアしました');
    } catch (error) {
      console.error('Failed to clear cache:', error);
      alert('キャッシュクリアに失敗しました');
    }
  };

  const handlePreloadEngines = async () => {
    try {
      await fetch('/api/admin/preload-engines', { method: 'POST' });
      alert('エンジンのプリロードを開始しました');
    } catch (error) {
      console.error('Failed to preload engines:', error);
      alert('プリロードに失敗しました');
    }
  };

  const handleGarbageCollection = async () => {
    try {
      await fetch('/api/admin/gc', { method: 'POST' });
      alert('ガベージコレクションを実行しました');
    } catch (error) {
      console.error('Failed to run GC:', error);
      alert('ガベージコレクションに失敗しました');
    }
  };

  if (!metrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">パフォーマンスメトリクスを読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">パフォーマンスダッシュボード</h1>
        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="mr-2"
            />
            自動更新
          </label>
          <select
            value={refreshInterval}
            onChange={(e) => setRefreshInterval(Number(e.target.value))}
            className="px-3 py-1 border rounded"
            disabled={!autoRefresh}
          >
            <option value={1000}>1秒</option>
            <option value={5000}>5秒</option>
            <option value={10000}>10秒</option>
            <option value={30000}>30秒</option>
          </select>
        </div>
      </div>

      {/* システム統計 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">メモリ使用量</h3>
          <p className="text-2xl font-semibold text-blue-600">
            {metrics.system.memoryUsage.toFixed(1)}MB
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">CPU負荷</h3>
          <p className="text-2xl font-semibold text-green-600">
            {metrics.system.cpuLoad.toFixed(1)}%
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">稼働時間</h3>
          <p className="text-2xl font-semibold text-purple-600">
            {Math.floor(metrics.system.uptime / 3600)}h
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">キャッシュヒット率</h3>
          <p className="text-2xl font-semibold text-orange-600">
            {metrics.performance.cacheHitRate?.toFixed(1) || 0}%
          </p>
        </div>
      </div>

      {/* キャッシュ統計 */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">キャッシュ統計</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-500">エントリ数</p>
            <p className="text-xl font-semibold">{metrics.cache.entries}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">メモリ使用量</p>
            <p className="text-xl font-semibold">{metrics.cache.memoryUsage}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">総ヒット数</p>
            <p className="text-xl font-semibold">{metrics.cache.totalHits}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">平均ヒット数</p>
            <p className="text-xl font-semibold">{metrics.cache.averageHits.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* パフォーマンス統計 */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">パフォーマンス統計</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-500">平均実行時間</p>
            <p className="text-xl font-semibold">
              {metrics.performance.averageExecutionTime?.toFixed(2) || 0}ms
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">平均メモリ使用量</p>
            <p className="text-xl font-semibold">
              {((metrics.performance.averageMemoryUsage || 0) / 1024).toFixed(2)}KB
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">総実行回数</p>
            <p className="text-xl font-semibold">{metrics.performance.totalExecutions}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">キャッシュヒット率</p>
            <p className="text-xl font-semibold">
              {metrics.performance.cacheHitRate?.toFixed(1) || 0}%
            </p>
          </div>
        </div>
      </div>

      {/* 遅延読み込み統計 */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">モジュール読み込み統計</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500">総モジュール数</p>
            <p className="text-xl font-semibold">{metrics.lazyLoader.totalModules}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">読み込み済み</p>
            <p className="text-xl font-semibold">{metrics.lazyLoader.loadedModules}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">読み込み中</p>
            <p className="text-xl font-semibold">{metrics.lazyLoader.loadingModules}</p>
          </div>
        </div>
        
        {/* モジュール詳細 */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  モジュール
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  アクセス回数
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  最終アクセス
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  状態
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {metrics.lazyLoader.accessStats.map((stat: any) => (
                <tr key={stat.key}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {stat.key}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {stat.accessCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {stat.lastAccessed 
                      ? new Date(stat.lastAccessed).toLocaleTimeString()
                      : '-'
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      stat.loaded 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {stat.loaded ? '読み込み済み' : '未読み込み'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* アクション */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">管理アクション</h2>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={handleClearCache}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            キャッシュクリア
          </button>
          <button
            onClick={handlePreloadEngines}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            エンジンプリロード
          </button>
          <button
            onClick={handleGarbageCollection}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            ガベージコレクション
          </button>
        </div>
      </div>

      {/* パフォーマンスレポート */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">パフォーマンスレポート</h2>
        {metrics.performance.recommendations && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-yellow-800 mb-2">推奨事項</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              {metrics.performance.recommendations.map((rec: string, index: number) => (
                <li key={index}>• {rec}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}