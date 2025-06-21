'use client';

import { useState, useEffect } from 'react';
import { securityLogger } from '@/lib/security/security-logger';
import { rateLimit } from '@/lib/security/rate-limiter';

interface SecurityStats {
  totalEvents: number;
  totalAlerts: number;
  eventsByType: Record<string, number>;
  topIPs: Array<{ ip: string; count: number }>;
  recentAlerts: Array<{
    level: 'low' | 'medium' | 'high' | 'critical';
    message: string;
    timestamp: Date;
  }>;
}

interface RateLimitStats {
  totalKeys: number;
  totalRequests: number;
  memoryUsage: string;
  topConsumers: Array<{ key: string; requests: number; resetTime: number }>;
}

export default function SecurityDashboard() {
  const [securityStats, setSecurityStats] = useState<SecurityStats | null>(null);
  const [rateLimitStats, setRateLimitStats] = useState<RateLimitStats | null>(null);
  const [timeWindow, setTimeWindow] = useState(60); // minutes
  const [refreshInterval, setRefreshInterval] = useState(30); // seconds
  const [autoRefresh, setAutoRefresh] = useState(true);

  const loadStats = () => {
    const security = securityLogger.getStats(timeWindow);
    const rateLimit_ = rateLimit.getStats();
    
    setSecurityStats(security);
    setRateLimitStats(rateLimit_);
  };

  useEffect(() => {
    loadStats();
  }, [timeWindow]);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(loadStats, refreshInterval * 1000);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  const getAlertColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-100 border-red-500 text-red-800';
      case 'high': return 'bg-orange-100 border-orange-500 text-orange-800';
      case 'medium': return 'bg-yellow-100 border-yellow-500 text-yellow-800';
      case 'low': return 'bg-blue-100 border-blue-500 text-blue-800';
      default: return 'bg-gray-100 border-gray-500 text-gray-800';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ja-JP', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">セキュリティダッシュボード</h1>
        
        <div className="flex items-center space-x-4">
          <select
            value={timeWindow}
            onChange={(e) => setTimeWindow(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value={5}>過去5分</option>
            <option value={15}>過去15分</option>
            <option value={60}>過去1時間</option>
            <option value={360}>過去6時間</option>
            <option value={1440}>過去24時間</option>
          </select>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="autoRefresh"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="autoRefresh" className="text-sm text-gray-700">
              自動更新
            </label>
          </div>
          
          <button
            onClick={loadStats}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            更新
          </button>
        </div>
      </div>

      {/* 概要統計 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">セキュリティイベント</h3>
          <p className="text-3xl font-bold text-blue-600">{securityStats?.totalEvents || 0}</p>
          <p className="text-sm text-gray-500">過去{timeWindow}分</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">アラート</h3>
          <p className="text-3xl font-bold text-red-600">{securityStats?.totalAlerts || 0}</p>
          <p className="text-sm text-gray-500">総アラート数</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">レート制限キー</h3>
          <p className="text-3xl font-bold text-yellow-600">{rateLimitStats?.totalKeys || 0}</p>
          <p className="text-sm text-gray-500">アクティブなキー</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">メモリ使用量</h3>
          <p className="text-3xl font-bold text-green-600">{rateLimitStats?.memoryUsage || '0KB'}</p>
          <p className="text-sm text-gray-500">レート制限データ</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 最近のアラート */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">最近のアラート</h3>
          <div className="space-y-3">
            {securityStats?.recentAlerts?.length ? (
              securityStats.recentAlerts.slice(0, 5).map((alert, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-md border-l-4 ${getAlertColor(alert.level)}`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{alert.level.toUpperCase()}</p>
                      <p className="text-sm">{alert.message}</p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatDate(alert.timestamp)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">アラートはありません</p>
            )}
          </div>
        </div>

        {/* イベントタイプ別統計 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">イベントタイプ別統計</h3>
          <div className="space-y-2">
            {securityStats?.eventsByType ? (
              Object.entries(securityStats.eventsByType)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 8)
                .map(([type, count]) => (
                  <div key={type} className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">{type.replace(/_/g, ' ')}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                ))
            ) : (
              <p className="text-gray-500 text-center py-4">データがありません</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 上位IP */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">上位アクセスIP</h3>
          <div className="space-y-2">
            {securityStats?.topIPs?.length ? (
              securityStats.topIPs.slice(0, 10).map((ip, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm font-mono">{ip.ip}</span>
                  <span className="font-medium">{ip.count}件</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">データがありません</p>
            )}
          </div>
        </div>

        {/* レート制限上位消費者 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">レート制限上位消費者</h3>
          <div className="space-y-2">
            {rateLimitStats?.topConsumers?.length ? (
              rateLimitStats.topConsumers.slice(0, 10).map((consumer, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="font-mono truncate">{consumer.key}</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{consumer.requests}</span>
                    <span className="text-gray-500">
                      (リセット: {formatDate(new Date(consumer.resetTime))})
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">データがありません</p>
            )}
          </div>
        </div>
      </div>

      {/* システム制御 */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">システム制御</h3>
        <div className="flex space-x-4">
          <button
            onClick={() => rateLimit.resetAll()}
            className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
          >
            全レート制限リセット
          </button>
          
          <button
            onClick={() => {
              // Clear logs (実装に応じて)
              alert('ログクリア機能は開発中です');
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            セキュリティログクリア
          </button>
          
          <button
            onClick={() => {
              // Export logs
              const data = JSON.stringify({ securityStats, rateLimitStats }, null, 2);
              const blob = new Blob([data], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `security-report-${new Date().toISOString().split('T')[0]}.json`;
              a.click();
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            レポートエクスポート
          </button>
        </div>
      </div>
    </div>
  );
}