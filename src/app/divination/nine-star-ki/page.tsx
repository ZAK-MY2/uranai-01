'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CosmicBackground } from '@/components/ui/cosmic-background';
import { mockDivinationData } from '@/lib/mock/divination-data';

// 九星の配置図コンポーネント
const NineStarGrid = ({ mainStar }: { mainStar: string }) => {
  const stars = [
    { position: 'NW', star: '六白金星', number: 6, color: 'white' },
    { position: 'N', star: '一白水星', number: 1, color: 'blue' },
    { position: 'NE', star: '八白土星', number: 8, color: 'yellow' },
    { position: 'W', star: '七赤金星', number: 7, color: 'red' },
    { position: 'C', star: '五黄土星', number: 5, color: 'yellow' },
    { position: 'E', star: '三碧木星', number: 3, color: 'green' },
    { position: 'SW', star: '二黒土星', number: 2, color: 'black' },
    { position: 'S', star: '九紫火星', number: 9, color: 'purple' },
    { position: 'SE', star: '四緑木星', number: 4, color: 'green' }
  ];

  const gridPositions = [
    [6, 1, 8],
    [7, 5, 3],
    [2, 9, 4]
  ];

  return (
    <div className="grid grid-cols-3 gap-2 max-w-sm mx-auto">
      {gridPositions.map((row, rowIndex) => 
        row.map((num, colIndex) => {
          const star = stars.find(s => s.number === num);
          const isMainStar = star?.star === mainStar;
          
          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`aspect-square bg-white/5 rounded-lg border ${
                isMainStar ? 'border-purple-400 bg-purple-500/20' : 'border-white/20'
              } flex flex-col items-center justify-center p-4 relative`}
            >
              <p className="text-3xl font-bold text-white mb-1">{num}</p>
              <p className="text-xs text-white/70">{star?.star.slice(0, 2)}</p>
              {isMainStar && (
                <div className="absolute inset-0 bg-purple-400/20 rounded-lg animate-pulse"></div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default function NineStarKiPage() {
  const { nineStarKi } = mockDivinationData;
  const [selectedDirection, setSelectedDirection] = useState<string>('東');

  // 方位の詳細情報
  const directionDetails: { [key: string]: { element: string, season: string, time: string, meaning: string } } = {
    '東': { element: '木', season: '春', time: '5-7時', meaning: '成長・発展' },
    '南東': { element: '木', season: '初夏', time: '7-9時', meaning: '信頼・交流' },
    '南': { element: '火', season: '夏', time: '11-13時', meaning: '名誉・評価' },
    '南西': { element: '土', season: '晩夏', time: '13-15時', meaning: '努力・基盤' },
    '西': { element: '金', season: '秋', time: '17-19時', meaning: '収穫・金運' },
    '北西': { element: '金', season: '初冬', time: '19-21時', meaning: '援助・指導' },
    '北': { element: '水', season: '冬', time: '23-1時', meaning: '休息・内省' },
    '北東': { element: '土', season: '晩冬', time: '1-3時', meaning: '変化・転機' }
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-slate-900 to-slate-800">
      <CosmicBackground />
      
      {/* ヘッダー */}
      <header className="relative z-20 bg-slate-900/50 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between">
          <Link href="/" className="text-white hover:text-blue-300 transition-colors">
            ← ダッシュボードに戻る
          </Link>
          <h1 className="text-2xl font-light text-white">九星気学詳細分析</h1>
          <div className="w-32"></div>
        </div>
      </header>

      <main className="relative z-10 pt-10 pb-20">
        <div className="max-w-7xl mx-auto px-5">
          
          {/* 本命星と九星盤 */}
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-10 mb-10 border border-white/10">
            <h2 className="text-3xl font-light text-white text-center mb-10">
              あなたの本命星：{nineStarKi.mainStar}
            </h2>
            
            {/* 九星盤 */}
            <div className="mb-10">
              <NineStarGrid mainStar={nineStarKi.mainStar} />
            </div>

            {/* 三つの星 */}
            <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="bg-white/5 rounded-xl p-6 text-center">
                <p className="text-white/50 text-sm mb-2">本命星</p>
                <p className="text-2xl text-white mb-2">{nineStarKi.mainStar}</p>
                <p className="text-white/60 text-sm">基本性格・運勢</p>
              </div>
              <div className="bg-white/5 rounded-xl p-6 text-center">
                <p className="text-white/50 text-sm mb-2">月命星</p>
                <p className="text-2xl text-white mb-2">{nineStarKi.monthStar}</p>
                <p className="text-white/60 text-sm">精神性・内面</p>
              </div>
              <div className="bg-white/5 rounded-xl p-6 text-center">
                <p className="text-white/50 text-sm mb-2">年運星</p>
                <p className="text-2xl text-white mb-2">{nineStarKi.yearStar}</p>
                <p className="text-white/60 text-sm">今年の運勢</p>
              </div>
            </div>
          </div>

          {/* 方位盤（インフォグラフィック） */}
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-10 mb-10 border border-white/10">
            <h3 className="text-2xl font-light text-white text-center mb-8">吉凶方位</h3>
            
            <div className="relative w-96 h-96 mx-auto">
              <svg viewBox="0 0 400 400" className="w-full h-full">
                {/* 八方位の円 */}
                <circle cx="200" cy="200" r="180" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
                <circle cx="200" cy="200" r="120" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                <circle cx="200" cy="200" r="60" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                
                {/* 方位線 */}
                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
                  const radian = (angle - 90) * Math.PI / 180;
                  const x1 = 200 + 60 * Math.cos(radian);
                  const y1 = 200 + 60 * Math.sin(radian);
                  const x2 = 200 + 180 * Math.cos(radian);
                  const y2 = 200 + 180 * Math.sin(radian);
                  
                  return (
                    <line key={angle} x1={x1} y1={y1} x2={x2} y2={y2} 
                      stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                  );
                })}
                
                {/* 方位の表示 */}
                {[
                  { dir: '北', angle: 0, favorable: false },
                  { dir: '北東', angle: 45, favorable: false },
                  { dir: '東', angle: 90, favorable: true },
                  { dir: '南東', angle: 135, favorable: true },
                  { dir: '南', angle: 180, favorable: false },
                  { dir: '南西', angle: 225, favorable: false },
                  { dir: '西', angle: 270, favorable: false },
                  { dir: '北西', angle: 315, favorable: false }
                ].map(({ dir, angle, favorable }) => {
                  const radian = (angle - 90) * Math.PI / 180;
                  const x = 200 + 150 * Math.cos(radian);
                  const y = 200 + 150 * Math.sin(radian);
                  const isFavorable = nineStarKi.direction.favorable.includes(dir);
                  const isUnfavorable = nineStarKi.direction.unfavorable.includes(dir);
                  
                  return (
                    <g key={dir} 
                      className={`cursor-pointer ${selectedDirection === dir ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
                      onClick={() => setSelectedDirection(dir)}
                    >
                      <circle cx={x} cy={y} r="25" 
                        fill={isFavorable ? 'rgba(34,197,94,0.3)' : isUnfavorable ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.1)'}
                        stroke={isFavorable ? '#22c55e' : isUnfavorable ? '#ef4444' : 'rgba(255,255,255,0.3)'}
                        strokeWidth="2" />
                      <text x={x} y={y + 5} textAnchor="middle" className="fill-white text-sm">
                        {dir}
                      </text>
                    </g>
                  );
                })}
                
                {/* 中央の本命星 */}
                <circle cx="200" cy="200" r="40" fill="rgba(147,51,234,0.3)" stroke="rgba(147,51,234,0.8)" strokeWidth="2" />
                <text x="200" y="210" textAnchor="middle" className="fill-white text-lg">
                  {nineStarKi.mainStar.slice(0, 2)}
                </text>
              </svg>
            </div>
            
            {/* 選択された方位の詳細 */}
            <div className="mt-8 bg-white/5 rounded-xl p-6 max-w-2xl mx-auto">
              <h4 className="text-xl font-light text-white text-center mb-4">{selectedDirection}の詳細</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-white/50 text-sm">五行</p>
                  <p className="text-white">{directionDetails[selectedDirection].element}</p>
                </div>
                <div>
                  <p className="text-white/50 text-sm">季節</p>
                  <p className="text-white">{directionDetails[selectedDirection].season}</p>
                </div>
                <div>
                  <p className="text-white/50 text-sm">時刻</p>
                  <p className="text-white">{directionDetails[selectedDirection].time}</p>
                </div>
                <div>
                  <p className="text-white/50 text-sm">意味</p>
                  <p className="text-white">{directionDetails[selectedDirection].meaning}</p>
                </div>
              </div>
            </div>
          </div>

          {/* エネルギーの流れ */}
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-10 mb-10 border border-white/10">
            <h3 className="text-2xl font-light text-white text-center mb-8">今日のエネルギー</h3>
            
            <div className="space-y-6 max-w-3xl mx-auto">
              <div className="bg-white/5 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-white/70">元素：{nineStarKi.element}</p>
                  <p className="text-white/70">今日の運勢</p>
                </div>
                <div className="relative h-4 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-1000"
                    style={{ width: '85%' }}
                  ></div>
                </div>
                <p className="text-center text-white mt-4 text-lg">{nineStarKi.todaysEnergy}</p>
              </div>
              
              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl p-6 border border-green-500/20">
                <h4 className="text-xl font-light text-green-300 mb-3">◐ 開運アドバイス</h4>
                <p className="text-white/80">{nineStarKi.advice}</p>
              </div>
            </div>
          </div>

          {/* 九星の相性関係 */}
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-10 mb-10 border border-white/10">
            <h3 className="text-2xl font-light text-white text-center mb-8">九星の相関図</h3>
            
            <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto">
              {[
                { star: '一白水星', relation: '相生', compatibility: '良好' },
                { star: '二黒土星', relation: '相剋', compatibility: '注意' },
                { star: '三碧木星', relation: '比和', compatibility: '安定' },
                { star: '四緑木星', relation: '比和', compatibility: '安定' },
                { star: '五黄土星', relation: '相剋', compatibility: '注意' },
                { star: '六白金星', relation: '相生', compatibility: '良好' },
                { star: '七赤金星', relation: '相生', compatibility: '良好' },
                { star: '八白土星', relation: '相剋', compatibility: '注意' },
                { star: '九紫火星', relation: '相生', compatibility: '良好' }
              ].map((item) => (
                <div key={item.star} className="bg-white/5 rounded-lg p-4 text-center">
                  <p className="text-white text-sm mb-1">{item.star}</p>
                  <p className={`text-xs ${
                    item.compatibility === '良好' ? 'text-green-400' : 
                    item.compatibility === '注意' ? 'text-orange-400' : 
                    'text-blue-400'
                  }`}>
                    {item.relation} - {item.compatibility}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 総合的な解釈 */}
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-10 border border-white/10">
            <h3 className="text-2xl font-light text-white text-center mb-8">気学からの導き</h3>
            
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="text-center mb-8">
                <p className="text-3xl font-light text-white mb-4">
                  {nineStarKi.mainStar}の本質
                </p>
                <p className="text-xl text-white/70">
                  {nineStarKi.element}の気質を持ち、{nineStarKi.direction.favorable.join('・')}が吉方位
                </p>
              </div>
              
              <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl p-8 border border-purple-500/20">
                <p className="text-lg text-white/90 leading-relaxed text-center">
                  三碧木星は成長と発展の星。
                  若々しいエネルギーに満ち、新しいことへの挑戦を恐れません。
                  今は東と南東の方位が幸運を呼び込みます。
                  朝の時間帯に重要な決断をすると良いでしょう。
                </p>
              </div>
            </div>
          </div>
          
          {/* ナビゲーション */}
          <div className="mt-10 flex justify-center gap-6">
            <Link 
              href="/divination/iching"
              className="px-8 py-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all duration-300"
            >
              ← 易経へ
            </Link>
            <Link 
              href="/divination/feng-shui"
              className="px-8 py-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all duration-300"
            >
              風水へ →
            </Link>
          </div>
          
        </div>
      </main>
    </div>
  );
}