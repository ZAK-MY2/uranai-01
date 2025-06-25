'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { CosmicBackground } from '@/components/ui/cosmic-background';
import { mockDivinationData } from '@/lib/mock/divination-data';

const ParameterBadge = dynamic(
  () => import('@/components/divination/parameter-badge').then(mod => mod.ParameterBadge),
  { ssr: false }
);

interface UserInputData {
  fullName: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  question: string;
  questionCategory: string;
}

// ナヴァムシャチャート（9分割図）
const NavamshaChart = ({ nakshatra }: { nakshatra: string }) => {
  const houses = Array.from({ length: 12 }, (_, i) => i + 1);
  const planets = [
    { name: '太陽', symbol: '☉', house: 10, degree: 15 },
    { name: '月', symbol: '☽', house: 4, degree: 22 },
    { name: '火星', symbol: '♂', house: 1, degree: 8 },
    { name: '水星', symbol: '☿', house: 11, degree: 28 },
    { name: '木星', symbol: '♃', house: 9, degree: 12 },
    { name: '金星', symbol: '♀', house: 5, degree: 19 },
    { name: '土星', symbol: '♄', house: 7, degree: 5 },
    { name: 'ラーフ', symbol: '☊', house: 3, degree: 17 },
    { name: 'ケートゥ', symbol: '☋', house: 9, degree: 17 }
  ];

  return (
    <div className="relative w-96 h-96 mx-auto">
      <svg viewBox="0 0 400 400" className="w-full h-full">
        {/* 外枠 */}
        <rect x="50" y="50" width="300" height="300" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
        
        {/* 12ハウスの分割（南インド式） */}
        <line x1="50" y1="150" x2="350" y2="150" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        <line x1="50" y1="250" x2="350" y2="250" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        <line x1="150" y1="50" x2="150" y2="350" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        <line x1="250" y1="50" x2="250" y2="350" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        
        {/* ハウス番号 */}
        <text x="100" y="100" textAnchor="middle" className="fill-white/50 text-sm">12</text>
        <text x="200" y="100" textAnchor="middle" className="fill-white/50 text-sm">1</text>
        <text x="300" y="100" textAnchor="middle" className="fill-white/50 text-sm">2</text>
        <text x="300" y="200" textAnchor="middle" className="fill-white/50 text-sm">3</text>
        <text x="300" y="300" textAnchor="middle" className="fill-white/50 text-sm">4</text>
        <text x="200" y="300" textAnchor="middle" className="fill-white/50 text-sm">5</text>
        <text x="100" y="300" textAnchor="middle" className="fill-white/50 text-sm">6</text>
        <text x="100" y="200" textAnchor="middle" className="fill-white/50 text-sm">7</text>
        
        {/* 中央の4ハウス */}
        <text x="175" y="175" textAnchor="middle" className="fill-white/50 text-sm">11</text>
        <text x="225" y="175" textAnchor="middle" className="fill-white/50 text-sm">10</text>
        <text x="175" y="225" textAnchor="middle" className="fill-white/50 text-sm">8</text>
        <text x="225" y="225" textAnchor="middle" className="fill-white/50 text-sm">9</text>
        
        {/* 惑星の配置 */}
        {planets.map((planet) => {
          let x, y;
          // ハウスに基づいて座標を計算
          if (planet.house === 1) { x = 200; y = 80; }
          else if (planet.house === 2) { x = 300; y = 80; }
          else if (planet.house === 3) { x = 300; y = 180; }
          else if (planet.house === 4) { x = 300; y = 280; }
          else if (planet.house === 5) { x = 200; y = 280; }
          else if (planet.house === 6) { x = 100; y = 280; }
          else if (planet.house === 7) { x = 100; y = 180; }
          else if (planet.house === 8) { x = 175; y = 210; }
          else if (planet.house === 9) { x = 225; y = 210; }
          else if (planet.house === 10) { x = 225; y = 160; }
          else if (planet.house === 11) { x = 175; y = 160; }
          else { x = 100; y = 80; }
          
          return (
            <g key={planet.name}>
              <text x={x} y={y} textAnchor="middle" className="fill-white text-lg">
                {planet.symbol}
              </text>
              <text x={x} y={y + 15} textAnchor="middle" className="fill-white/60 text-xs">
                {planet.degree}°
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default function VedicAstrologyPage() {
  const [, setUserInput] = useState<UserInputData | null>(null);
  const [vedicAstrology, setVedicAstrology] = useState(mockDivinationData.vedicAstrology);
  const [selectedTab, setSelectedTab] = useState<'birth' | 'transit' | 'dasha'>('birth');

  // ヴェーダ占星術の計算関数
  const calculateVedicAstrology = useCallback((userData: UserInputData) => {
    const birthDate = new Date(userData.birthDate);
    const year = birthDate.getFullYear();
    const month = birthDate.getMonth() + 1;
    const day = birthDate.getDate();
    
    // ナクシャトラ（月宿）の計算
    const nakshatra = calculateNakshatra(year, month, day);
    
    // ダシャー期間計算
    const planetaryPeriod = calculatePlanetaryPeriod(year, month, day);
    
    // 月宿番号計算
    const moonMansion = ((day + month * 3 + (year % 27)) % 27) + 1;
    
    return {
      ...mockDivinationData.vedicAstrology,
      nakshatra,
      moonMansion,
      planetaryPeriod,
      interpretation: generateVedicInterpretation(userData.question, nakshatra, planetaryPeriod.mahaDasha)
    };
  }, []);

  useEffect(() => {
    // LocalStorageからユーザーデータを読み込み
    const storedData = localStorage.getItem('uranai_user_data');
    if (storedData) {
      try {
        const userData: UserInputData = JSON.parse(storedData);
        setUserInput(userData);
        
        // 実際のヴェーダ占星術計算を実行
        const calculatedResult = calculateVedicAstrology(userData);
        setVedicAstrology(calculatedResult);
      } catch (error) {
        console.error('ユーザーデータの読み込みエラー:', error);
      }
    }
  }, [calculateVedicAstrology]);


  function calculateNakshatra(year: number, month: number, day: number): string {
    const nakshatras = [
      'アシュヴィニー', 'バラニー', 'クリッティカー', 'ローヒニー', 'ムリガシラー',
      'アールドラー', 'プナルヴァス', 'プシュヤ', 'アーシュレーシャー', 'マガー',
      'プールヴァ・パルグニー', 'ウッタラ・パルグニー', 'ハスタ', 'チトラー', 'スヴァーティー',
      'ヴィシャーカー', 'アヌラーダー', 'ジェーシュター', 'ムーラ', 'プールヴァ・アーシャーダー',
      'ウッタラ・アーシャーダー', 'シュラヴァナ', 'ダニシュター', 'シャタビシャー', 'プールヴァ・バードラパダー',
      'ウッタラ・バードラパダー', 'レーヴァティー'
    ];
    
    const totalDays = year * 365.25 + month * 30.44 + day;
    const nakshatraIndex = Math.floor(totalDays % 27);
    return nakshatras[nakshatraIndex];
  }

  function calculatePlanetaryPeriod(year: number, month: number, day: number) {
    const planets = ['太陽', '月', '火星', 'ラーフ', '木星', '土星', '水星', 'ケートゥ', '金星'];
    const periods = [6, 10, 7, 18, 16, 19, 17, 7, 20];
    
    const totalDays = year * 365.25 + month * 30.44 + day;
    const planetIndex = Math.floor(totalDays / 365.25) % planets.length;
    const subPlanetIndex = Math.floor((totalDays % 365.25) / 30.44) % planets.length;
    
    return {
      mahaDasha: planets[planetIndex],
      antarDasha: planets[subPlanetIndex],
      yearsRemaining: periods[planetIndex] - Math.floor((totalDays % (periods[planetIndex] * 365.25)) / 365.25)
    };
  }

  function generateVedicInterpretation(question: string, nakshatra: string, mahaDasha: string): string {
    return `${nakshatra}ナクシャトラの影響下で、現在は${mahaDasha}のマハーダシャー期にあります。「${question}」について、インドの古代叡智が示すのは、カルマの法則に従って行動することの重要性です。星々の配置は、内なる真理に従って歩むことで、最良の結果がもたらされることを示しています。`;
  }

  // 27ナクシャトラ（月宿）
  const nakshatras = [
    { name: 'アシュヴィニー', deity: '双子の馬', quality: '光' },
    { name: 'バラニー', deity: 'ヤマ', quality: '制限' },
    { name: 'クリッティカー', deity: 'アグニ', quality: '火' },
    { name: 'ローヒニー', deity: 'ブラフマー', quality: '成長' },
    { name: 'ムリガシラー', deity: 'ソーマ', quality: '探求' }
  ];

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-slate-900 to-slate-800">
      <CosmicBackground />
      
      {/* ヘッダー */}
      <header className="relative z-20 bg-slate-900/50 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-white hover:text-blue-300 transition-colors">
            ← ダッシュボードに戻る
          </Link>
          <h1 className="text-2xl font-light text-white">ヴェーダ占星術詳細分析</h1>
          <div className="w-32"></div>
        </div>
      </header>

      <main className="relative z-10 pt-10 pb-20">
        <div className="max-w-7xl mx-auto px-5">
          <ParameterBadge />
          
          {/* ジャンマ・クンダリー（出生図） */}
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-10 mb-10 border border-white/10">
            <h2 className="text-3xl font-light text-white text-center mb-10">ジャンマ・クンダリー</h2>
            
            {/* タブ切り替え */}
            <div className="flex justify-center gap-4 mb-8">
              {[
                { id: 'birth', label: '出生図' },
                { id: 'transit', label: 'トランジット' },
                { id: 'dasha', label: 'ダシャー' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id as any)}
                  className={`px-6 py-2 rounded-full transition-all ${
                    selectedTab === tab.id
                      ? 'bg-purple-500/30 text-white border-purple-400'
                      : 'bg-white/5 text-white/70 hover:bg-white/10'
                  } border border-white/20`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            
            {/* チャート表示 */}
            {selectedTab === 'birth' && (
              <div>
                <NavamshaChart nakshatra={vedicAstrology.nakshatra} />
                
                {/* ナクシャトラ情報 */}
                <div className="mt-8 bg-white/5 rounded-xl p-6 max-w-2xl mx-auto">
                  <h3 className="text-xl font-light text-white text-center mb-4">
                    月のナクシャトラ：{vedicAstrology.nakshatra}
                  </h3>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-white/50 text-sm mb-2">月宿番号</p>
                      <p className="text-white text-lg">{vedicAstrology.moonMansion}</p>
                    </div>
                    <div>
                      <p className="text-white/50 text-sm mb-2">支配神</p>
                      <p className="text-white text-lg">ブラフマー</p>
                    </div>
                    <div>
                      <p className="text-white/50 text-sm mb-2">性質</p>
                      <p className="text-white text-lg">成長</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ダシャー期間（インフォグラフィック） */}
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-10 mb-10 border border-white/10">
            <h3 className="text-2xl font-light text-white text-center mb-8">惑星期（ダシャー）</h3>
            
            <div className="relative">
              <div className="flex items-center justify-between max-w-4xl mx-auto mb-8">
                <div className="flex-1 h-2 bg-white/10 rounded-full relative overflow-hidden">
                  <div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                    style={{ width: '65%' }}
                  ></div>
                  <div className="absolute top-1/2 left-[65%] transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 bg-white rounded-full border-2 border-purple-500"></div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto">
                <div className="bg-white/5 rounded-xl p-6 text-center">
                  <p className="text-white/50 text-sm mb-2">マハーダシャー</p>
                  <p className="text-2xl text-white mb-2">{vedicAstrology.planetaryPeriod.mahaDasha}</p>
                  <p className="text-purple-300">20年周期</p>
                </div>
                <div className="bg-white/5 rounded-xl p-6 text-center border-2 border-purple-400">
                  <p className="text-white/50 text-sm mb-2">アンタルダシャー</p>
                  <p className="text-2xl text-white mb-2">{vedicAstrology.planetaryPeriod.antarDasha}</p>
                  <p className="text-pink-300">現在進行中</p>
                </div>
                <div className="bg-white/5 rounded-xl p-6 text-center">
                  <p className="text-white/50 text-sm mb-2">残り期間</p>
                  <p className="text-2xl text-white mb-2">{vedicAstrology.planetaryPeriod.yearsRemaining}</p>
                  <p className="text-blue-300">年</p>
                </div>
              </div>
            </div>
          </div>

          {/* ヨーガ（特別な配置） */}
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-10 mb-10 border border-white/10">
            <h3 className="text-2xl font-light text-white text-center mb-8">吉祥ヨーガ</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {vedicAstrology.yogas.map((yoga) => (
                <div key={yoga} className="bg-gradient-to-r from-orange-500/10 to-yellow-500/10 rounded-xl p-6 border border-orange-500/20">
                  <h4 className="text-xl font-light text-orange-300 mb-3">{yoga}</h4>
                  <p className="text-white/80">
                    {yoga === 'ラージャ・ヨーガ' 
                      ? '王者のヨーガ。権力と成功をもたらす特別な配置。'
                      : '富のヨーガ。物質的豊かさと経済的成功を示す。'}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* レメディ（改善法） */}
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-10 mb-10 border border-white/10">
            <h3 className="text-2xl font-light text-white text-center mb-8">ヴェーダの処方箋</h3>
            
            <div className="space-y-6 max-w-3xl mx-auto">
              <div className="bg-white/5 rounded-xl p-6">
                <h4 className="text-xl font-light text-white mb-4">◐ 推奨レメディ</h4>
                <ul className="space-y-3">
                  {vedicAstrology.remedies.map((remedy, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-yellow-400 mr-3">•</span>
                      <span className="text-white/80">{remedy}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/5 rounded-lg p-4 text-center">
                  <p className="text-2xl mb-2">🕉️</p>
                  <p className="text-white/70 text-sm">マントラ</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4 text-center">
                  <p className="text-2xl mb-2">💎</p>
                  <p className="text-white/70 text-sm">宝石</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4 text-center">
                  <p className="text-2xl mb-2">🪔</p>
                  <p className="text-white/70 text-sm">プージャ</p>
                </div>
              </div>
            </div>
          </div>

          {/* 総合的な解釈 */}
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-10 border border-white/10">
            <h3 className="text-2xl font-light text-white text-center mb-8">ジョーティシュからの神聖なメッセージ</h3>
            
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="text-center mb-8">
                <p className="text-3xl font-light text-white mb-4">
                  {vedicAstrology.nakshatra} - 月の宿
                </p>
                <p className="text-xl text-white/70">
                  {vedicAstrology.planetaryPeriod.mahaDasha}の恩恵期
                </p>
              </div>
              
              <div className="bg-gradient-to-r from-orange-500/10 to-yellow-500/10 rounded-xl p-8 border border-orange-500/20">
                <p className="text-lg text-white/90 leading-relaxed text-center">
                  {vedicAstrology.interpretation}
                </p>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-orange-300 text-2xl mb-2">☀️</p>
                  <p className="text-white/70 text-sm">太陽の祝福</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-blue-300 text-2xl mb-2">🌙</p>
                  <p className="text-white/70 text-sm">月の恩寵</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-purple-300 text-2xl mb-2">⭐</p>
                  <p className="text-white/70 text-sm">星の導き</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* ナビゲーション */}
          <div className="mt-10 flex justify-center gap-6">
            <Link 
              href="/divination/kabbalah"
              className="px-8 py-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all duration-300"
            >
              ← カバラ数秘術へ
            </Link>
            <Link 
              href="/divination/celtic"
              className="px-8 py-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all duration-300"
            >
              ケルト占星術へ →
            </Link>
          </div>
          
        </div>
      </main>
    </div>
  );
}