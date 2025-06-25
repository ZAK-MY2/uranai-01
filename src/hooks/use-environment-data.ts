'use client';

import { useState, useEffect } from 'react';
import { EnvironmentData } from '@/lib/divination/base-engine';
import { EnvironmentService } from '@/lib/services/environment-service';

export function useEnvironmentData(location: string = '東京都') {
  const [data, setData] = useState<EnvironmentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const service = EnvironmentService.getInstance();
        const environmentData = await service.getEnvironmentData(location);
        
        if (!cancelled) {
          setData(environmentData);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : '環境データの取得に失敗しました');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();

    // 15分ごとに更新
    const interval = setInterval(fetchData, 15 * 60 * 1000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [location]);

  return { data, loading, error };
}

// 環境データの概要を取得するユーティリティ関数
export function getEnvironmentSummary(data: EnvironmentData): string {
  const { weather, lunar, planetary } = data;
  
  const weatherDesc = weather 
    ? `気温${weather.temperature}°C、${getWeatherDescription(weather.condition)}`
    : '天候データなし';
  const lunarDesc = `${lunar.phaseName}（${Math.round(lunar.illumination)}%）`;
  const planetaryDesc = planetary?.retrogradeПlanets && planetary.retrogradeПlanets.length > 0 
    ? `${planetary.retrogradeПlanets.join('・')}が逆行中`
    : '惑星順行中';
  
  return `${weatherDesc} | ${lunarDesc} | ${planetaryDesc}`;
}

function getWeatherDescription(condition: string | undefined): string {
  if (!condition) return '不明';
  const descriptions: Record<string, string> = {
    clear: '晴れ',
    partly_cloudy: '晴れ時々曇り',
    cloudy: '曇り',
    rain: '雨',
    snow: '雪',
    storm: '嵐',
    fog: '霧'
  };
  return descriptions[condition] || condition;
}

// 占術に影響する環境要因を評価
export function evaluateEnvironmentalInfluence(data: EnvironmentData): {
  favorability: number; // 0-100
  factors: string[];
} {
  let favorability = 50;
  const factors: string[] = [];

  // 月相の影響
  if (data.lunar.phase < 0.1 || data.lunar.phase > 0.9) {
    favorability += 10;
    factors.push('新月のパワフルなエネルギー');
  } else if (Math.abs(data.lunar.phase - 0.5) < 0.1) {
    favorability += 5;
    factors.push('満月の豊かなエネルギー');
  }

  if (data.lunar.isVoidOfCourse) {
    favorability -= 10;
    factors.push('ボイドタイムのため注意が必要');
  }

  // 天候の影響
  if (data.weather) {
    if (data.weather.condition === 'clear') {
      favorability += 5;
      factors.push('晴天のポジティブなエネルギー');
    } else if (data.weather.condition === 'storm') {
      favorability -= 5;
      factors.push('嵐の不安定なエネルギー');
    }

    // 気圧の影響
    if (data.weather.pressure && data.weather.pressure > 1020) {
      favorability += 3;
      factors.push('高気圧の安定したエネルギー');
    } else if (data.weather.pressure && data.weather.pressure < 1000) {
      favorability -= 3;
      factors.push('低気圧の変化のエネルギー');
    }
  }

  // 惑星逆行の影響
  if (data.planetary) {
    const retrogradeCount = data.planetary.retrogradeПlanets?.length || 0;
    if (retrogradeCount === 0) {
      favorability += 5;
      factors.push('全惑星順行の調和的エネルギー');
    } else if (retrogradeCount > 3) {
      favorability -= 10;
      factors.push(`${retrogradeCount}惑星逆行による内省のエネルギー`);
    }

    // 惑星時間の影響
    const beneficHourRulers = ['Sun', 'Venus', 'Jupiter'];
    if (data.planetary.hourRuler && beneficHourRulers.includes(data.planetary.hourRuler)) {
      favorability += 3;
      factors.push(`${data.planetary.hourRuler}の吉時`);
    }
  }

  return {
    favorability: Math.max(0, Math.min(100, favorability)),
    factors
  };
}