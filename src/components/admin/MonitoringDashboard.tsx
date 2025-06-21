'use client';

import { useState, useEffect } from 'react';
import { errorTracker } from '@/lib/monitoring/error-tracker';
import { performanceMonitor } from '@/lib/monitoring/performance-monitor';

interface ErrorMetrics {
  totalErrors: number;
  errorsByCategory: Record<string, number>;
  errorsBySeverity: Record<string, number>;
  errorRate: number;
  topErrors: Array<{
    fingerprint: string;
    message: string;
    count: number;
    category: string;
  }>;
  recentErrors: Array<{
    id: string;
    message: string;
    category: string;
    severity: string;
    timestamp: Date;
  }>;
}

interface PerformanceMetrics {
  totalMetrics: number;
  averageResponseTime: number;
  errorRate: number;
  memoryUsage: {
    rss: number;
    heapTotal: number;
    heapUsed: number;
    external: number;
  } | null;
  recentAlerts: Array<{
    metric: string;
    value: number;
    threshold: number;
    severity: string;
    timestamp: Date;
  }>;
  topSlowOperations: Array<{
    name: string;
    averageTime: number;
    count: number;
  }>;
}

export default function MonitoringDashboard() {
  const [errorMetrics, setErrorMetrics] = useState<ErrorMetrics | null>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null);
  const [timeWindow, setTimeWindow] = useState(3600000); // 1 hour
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30); // seconds

  const loadMetrics = () => {
    const errorData = errorTracker.getMetrics(timeWindow);
    const perfData = performanceMonitor.getMetrics(timeWindow);
    
    setErrorMetrics(errorData);
    setPerformanceMetrics(perfData);
  };

  useEffect(() => {
    loadMetrics();
  }, [timeWindow]);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(loadMetrics, refreshInterval * 1000);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  const formatBytes = (bytes: number) => {
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  const formatTime = (ms: number) => {
    return `${ms.toFixed(2)} ms`;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'divination_error': 'bg-purple-100 text-purple-800',
      'api_error': 'bg-red-100 text-red-800',
      'database_error': 'bg-orange-100 text-orange-800',
      'validation_error': 'bg-yellow-100 text-yellow-800',
      'authentication_error': 'bg-pink-100 text-pink-800',
      'external_service_error': 'bg-indigo-100 text-indigo-800',
      'performance_error': 'bg-green-100 text-green-800',
      'security_error': 'bg-red-100 text-red-800',
      'unknown_error': 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">監視ダッシュボード</h1>
        
        <div className="flex items-center space-x-4">
          <select
            value={timeWindow}
            onChange={(e) => setTimeWindow(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value={300000}>過去5分</option>
            <option value={1800000}>過去30分</option>
            <option value={3600000}>過去1時間</option>
            <option value={21600000}>過去6時間</option>
            <option value={86400000}>過去24時間</option>
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
            onClick={loadMetrics}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            更新
          </button>
        </div>
      </div>

      {/* 概要統計 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">エラー数</h3>
          <p className="text-3xl font-bold text-red-600">{errorMetrics?.totalErrors || 0}</p>
          <p className="text-sm text-gray-500">
            エラーレート: {errorMetrics?.errorRate.toFixed(2) || 0}/min
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">平均レスポンス時間</h3>
          <p className="text-3xl font-bold text-blue-600">
            {formatTime(performanceMetrics?.averageResponseTime || 0)}
          </p>
          <p className="text-sm text-gray-500">過去の期間</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">メモリ使用量</h3>
          <p className="text-3xl font-bold text-green-600">
            {performanceMetrics?.memoryUsage ? 
              formatBytes(performanceMetrics.memoryUsage.heapUsed) : 'N/A'}
          </p>
          <p className="text-sm text-gray-500">
            {performanceMetrics?.memoryUsage ? 
              `/${formatBytes(performanceMetrics.memoryUsage.heapTotal)}` : ''}
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">アラート</h3>
          <p className="text-3xl font-bold text-yellow-600">
            {performanceMetrics?.recentAlerts.length || 0}
          </p>
          <p className="text-sm text-gray-500">最近のアラート</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* エラー分析 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">エラー分析</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">カテゴリー別</h4>
              <div className="space-y-2">
                {errorMetrics?.errorsByCategory && Object.entries(errorMetrics.errorsByCategory)
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 5)
                  .map(([category, count]) => (
                    <div key={category} className="flex justify-between items-center">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getCategoryColor(category)}`}>
                        {category.replace(/_/g, ' ')}
                      </span>
                      <span className="font-medium">{count}</span>
                    </div>
                  ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-700 mb-2">重要度別</h4>
              <div className="space-y-2">
                {errorMetrics?.errorsBySeverity && Object.entries(errorMetrics.errorsBySeverity)
                  .sort(([,a], [,b]) => b - a)
                  .map(([severity, count]) => (
                    <div key={severity} className="flex justify-between items-center">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getSeverityColor(severity)}`}>
                        {severity.toUpperCase()}
                      </span>
                      <span className="font-medium">{count}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* パフォーマンス分析 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">パフォーマンス分析</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">遅い操作 Top 5</h4>
              <div className="space-y-2">
                {performanceMetrics?.topSlowOperations.slice(0, 5).map((op, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span className="truncate">{op.name}</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{formatTime(op.averageTime)}</span>
                      <span className="text-gray-500">({op.count}回)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {performanceMetrics?.memoryUsage && (
              <div>
                <h4 className="font-medium text-gray-700 mb-2">メモリ詳細</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>RSS</span>
                    <span>{formatBytes(performanceMetrics.memoryUsage.rss)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Heap Total</span>
                    <span>{formatBytes(performanceMetrics.memoryUsage.heapTotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Heap Used</span>
                    <span>{formatBytes(performanceMetrics.memoryUsage.heapUsed)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>External</span>
                    <span>{formatBytes(performanceMetrics.memoryUsage.external)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 最近のエラー */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">最近のエラー</h3>
          <div className="space-y-3">
            {errorMetrics?.recentErrors?.slice(0, 10).map((error) => (
              <div key={error.id} className="border-l-4 border-red-400 pl-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {error.message}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getCategoryColor(error.category)}`}>
                        {error.category}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getSeverityColor(error.severity)}`}>
                        {error.severity}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 ml-2">
                    {new Date(error.timestamp).toLocaleTimeString('ja-JP')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 最近のパフォーマンスアラート */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">パフォーマンスアラート</h3>
          <div className="space-y-3">
            {performanceMetrics?.recentAlerts?.slice(0, 10).map((alert, index) => (
              <div key={index} className="border-l-4 border-yellow-400 pl-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {alert.metric}
                    </p>
                    <p className="text-sm text-gray-600">
                      値: {alert.value} / 閾値: {alert.threshold}
                    </p>
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded mt-1 ${getSeverityColor(alert.severity)}`}>
                      {alert.severity.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 ml-2">
                    {new Date(alert.timestamp).toLocaleTimeString('ja-JP')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* アクション */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">アクション</h3>
        <div className="flex space-x-4">
          <button
            onClick={() => {
              const perfReport = performanceMonitor.generateReport(timeWindow);
              const blob = new Blob([perfReport], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `performance-report-${new Date().toISOString().split('T')[0]}.txt`;
              a.click();
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            パフォーマンスレポート
          </button>
          
          <button
            onClick={() => {
              const errorReport = errorTracker.generateReport({
                start: new Date(Date.now() - timeWindow),
                end: new Date()
              });
              const blob = new Blob([errorReport], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `error-report-${new Date().toISOString().split('T')[0]}.txt`;
              a.click();
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            エラーレポート
          </button>
          
          <button
            onClick={() => {
              if (confirm('本当にメトリクスをクリアしますか？')) {
                // Clear metrics functionality would go here
                alert('メトリクスクリア機能は開発中です');
              }
            }}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            メトリクスクリア
          </button>
        </div>
      </div>
    </div>
  );
}