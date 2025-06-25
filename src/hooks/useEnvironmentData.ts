'use client';

import { useState, useEffect } from 'react';
import { EnvironmentData } from '@/types/database';

export function useEnvironmentData() {
  const [data, setData] = useState<EnvironmentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/environment');
        
        if (!response.ok) {
          throw new Error('環境データの取得に失敗しました');
        }
        
        const environmentData = await response.json();
        setData(environmentData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : '不明なエラー');
        console.error('環境データ取得エラー:', err);
      } finally {
        setLoading(false);
      }
    };

    // 初回取得
    fetchData();

    // 5分ごとに更新
    const interval = setInterval(fetchData, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return { data, loading, error, refetch: () => window.location.reload() };
}