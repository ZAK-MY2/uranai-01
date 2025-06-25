'use client';

import React from 'react';
import { EnvironmentData } from '@/lib/divination/base-engine';
import { evaluateEnvironmentalInfluence } from '@/hooks/use-environment-data';

interface EnvironmentDisplayProps {
  data: EnvironmentData;
  compact?: boolean;
}

export function EnvironmentDisplay({ data, compact = false }: EnvironmentDisplayProps) {
  const { favorability, factors } = evaluateEnvironmentalInfluence(data);

  if (compact) {
    return (
      <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-white/70">環境エネルギー</h4>
          <span className={`text-sm font-bold ${getFavorabilityColor(favorability)}`}>
            {favorability}%
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-center">
            <div className="text-white/50">気温</div>
            <div className="text-white">{data.weather?.temperature || 20}°C</div>
          </div>
          <div className="text-center">
            <div className="text-white/50">月相</div>
            <div className="text-white">{data.lunar.phaseName}</div>
          </div>
          <div className="text-center">
            <div className="text-white/50">惑星時</div>
            <div className="text-white">{data.planetary?.hourRuler || 'Sun'}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10"
    >
      <h3 className="text-2xl font-light text-white mb-6">現在の宇宙的環境</h3>

      {/* 総合評価 */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-lg text-white/70">環境エネルギー指数</span>
          <span className={`text-3xl font-bold ${getFavorabilityColor(favorability)}`}>
            {favorability}%
          </span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full ${getFavorabilityGradient(favorability)} transition-all duration-1000 ease-out`}
            style={{ width: `${favorability}%` }}
          />
        </div>
        {factors.length > 0 && (
          <div className="mt-3 space-y-1">
            {factors.map((factor, index) => (
              <div key={index} className="text-sm text-white/60 flex items-center">
                <span className="mr-2">•</span>
                {factor}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 詳細データ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 天候データ */}
        <div className="bg-white/5 rounded-xl p-5">
          <h4 className="text-lg font-medium text-white mb-4 flex items-center">
            <span className="mr-2">🌤️</span>
            天候エネルギー
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-white/60">気温</span>
              <span className="text-white">{data.weather?.temperature || 20}°C</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">湿度</span>
              <span className="text-white">{data.weather?.humidity || 50}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">気圧</span>
              <span className="text-white">{data.weather?.pressure || 1013}hPa</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">風向風速</span>
              <span className="text-white">{data.weather?.windDirection || 'N'} {data.weather?.windSpeed || 0}m/s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">雲量</span>
              <span className="text-white">{data.weather?.cloudCover || 0}%</span>
            </div>
          </div>
        </div>

        {/* 月相データ */}
        <div className="bg-white/5 rounded-xl p-5">
          <h4 className="text-lg font-medium text-white mb-4 flex items-center">
            <span className="mr-2">🌙</span>
            月のエネルギー
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-white/60">月相</span>
              <span className="text-white">{data.lunar.phaseName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">輝度</span>
              <span className="text-white">{Math.round(data.lunar.illumination)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">月の星座</span>
              <span className="text-white">{data.lunar.moonSign || '蟹座'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">ボイドタイム</span>
              <span className={`text-white ${data.lunar.isVoidOfCourse ? 'text-yellow-400' : ''}`}>
                {data.lunar.isVoidOfCourse ? 'ボイド中' : '通常'}
              </span>
            </div>
            {data.lunar.eclipseNearby && (
              <div className="text-yellow-400 text-xs mt-2">
                ※ 日食・月食が近づいています
              </div>
            )}
          </div>
        </div>

        {/* 惑星データ */}
        <div className="bg-white/5 rounded-xl p-5">
          <h4 className="text-lg font-medium text-white mb-4 flex items-center">
            <span className="mr-2">✨</span>
            惑星エネルギー
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-white/60">太陽の星座</span>
              <span className="text-white">{data.planetary?.sunSign || '山羊座'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">今日の守護星</span>
              <span className="text-white">{data.planetary?.dayRuler || 'Sun'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">現在の惑星時</span>
              <span className="text-white">{data.planetary?.hourRuler || 'Sun'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">逆行惑星</span>
              <span className="text-white">
                {data.planetary?.retrogradeПlanets && data.planetary.retrogradeПlanets.length > 0 
                  ? data.planetary.retrogradeПlanets.join(', ')
                  : 'なし'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 更新時刻 */}
      <div className="mt-6 text-center text-xs text-white/40">
        最終更新: {data.timestamp ? new Date(data.timestamp).toLocaleString('ja-JP') : '取得中...'}
      </div>
    </div>
  );
}

function getFavorabilityColor(value: number): string {
  if (value >= 70) return 'text-green-400';
  if (value >= 50) return 'text-blue-400';
  if (value >= 30) return 'text-yellow-400';
  return 'text-red-400';
}

function getFavorabilityGradient(value: number): string {
  if (value >= 70) return 'bg-gradient-to-r from-green-500 to-green-400';
  if (value >= 50) return 'bg-gradient-to-r from-blue-500 to-blue-400';
  if (value >= 30) return 'bg-gradient-to-r from-yellow-500 to-yellow-400';
  return 'bg-gradient-to-r from-red-500 to-red-400';
}