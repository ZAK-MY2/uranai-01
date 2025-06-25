'use client';

import React, { useState, useEffect } from 'react';
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

// ルーンシンボルのSVGコンポーネント
// const RuneSymbol = ({ name }: { name: string }) => {
//   const runeShapes: { [key: string]: React.ReactElement } = {
//     'フェフ': (
//       <g>
//         <line x1="20" y1="80" x2="20" y2="20" stroke="white" strokeWidth="3" />
//         <line x1="20" y1="30" x2="50" y2="40" stroke="white" strokeWidth="3" />
//         <line x1="20" y1="50" x2="50" y2="60" stroke="white" strokeWidth="3" />
//       </g>
//     ),
//     'ウルズ': (
//       <g>
//         <line x1="20" y1="80" x2="20" y2="20" stroke="white" strokeWidth="3" />
//         <line x1="60" y1="80" x2="60" y2="40" stroke="white" strokeWidth="3" />
//         <line x1="20" y1="20" x2="60" y2="40" stroke="white" strokeWidth="3" />
//       </g>
//     ),
//     'アンスズ': (
//       <g>
//         <line x1="20" y1="80" x2="20" y2="20" stroke="white" strokeWidth="3" />
//         <line x1="20" y1="30" x2="50" y2="20" stroke="white" strokeWidth="3" />
//         <line x1="20" y1="50" x2="50" y2="40" stroke="white" strokeWidth="3" />
//       </g>
//     )
//   };
// 
//   return (
//     <svg viewBox="0 0 80 100" className="w-full h-full">
//       {runeShapes[name] || (
//         <text x="40" y="50" textAnchor="middle" className="fill-white text-2xl">
//           {name[0]}
//         </text>
//       )}
//     </svg>
//   );
// };

export default function RunesPage() {
  const [, setUserInput] = useState<UserInputData | null>(null);
  const [runesResult, setRunesResult] = useState(mockDivinationData.runes);
  const [selectedRune, setSelectedRune] = useState(0);

  useEffect(() => {
    const storedData = localStorage.getItem('uranai_user_data');
    if (storedData) {
      try {
        const userData: UserInputData = JSON.parse(storedData);
        setUserInput(userData);
        const calculatedResult = calculateRunes(userData);
        setRunesResult(calculatedResult);
      } catch (error) {
        console.error('ユーザーデータの読み込みエラー:', error);
      }
    }
  }, []);

  function calculateRunes(userData: UserInputData) {
    // エルダー・フサルク（24文字）ルーンシステム
    const elderFuthark = [
      { name: 'フェフ', meaning: '家畜・富', element: '地', rune: 'ᚠ', keywords: ['豊穣', '成功', '財産'] },
      { name: 'ウルズ', meaning: '原牛・力', element: '火', rune: 'ᚢ', keywords: ['強さ', '勇気', '野生'] },
      { name: 'スリサズ', meaning: '棘・巨人', element: '火', rune: 'ᚦ', keywords: ['破壊', '変革', '試練'] },
      { name: 'アンスズ', meaning: '神・口', element: '風', rune: 'ᚨ', keywords: ['叡智', '通信', '啓示'] },
      { name: 'ライドー', meaning: '旅・馬', element: '風', rune: 'ᚱ', keywords: ['旅行', '進歩', '動き'] },
      { name: 'ケナズ', meaning: '松明・火', element: '火', rune: 'ᚲ', keywords: ['創造', '情熱', '技巧'] },
      { name: 'ギフー', meaning: '贈り物', element: '風', rune: 'ᚷ', keywords: ['寛大', '犠牲', '交換'] },
      { name: 'ウンジョ', meaning: '喜び', element: '風', rune: 'ᚹ', keywords: ['幸福', '調和', '成就'] },
      { name: 'ハガラズ', meaning: '雹・破壊', element: '水', rune: 'ᚺ', keywords: ['混乱', '試練', '変化'] },
      { name: 'ナウディズ', meaning: '必要・欠乏', element: '火', rune: 'ᚾ', keywords: ['制約', '耐久', '忍耐'] },
      { name: 'イサ', meaning: '氷', element: '水', rune: 'ᛁ', keywords: ['静止', '待機', '集中'] },
      { name: 'ヤラ', meaning: '年・収穫', element: '地', rune: 'ᛃ', keywords: ['サイクル', '報い', '正義'] },
      { name: 'エイワズ', meaning: 'イチイの木', element: '地', rune: 'ᛇ', keywords: ['防御', '信頼', '忍耐'] },
      { name: 'ペルソ', meaning: '蓮の実', element: '水', rune: 'ᛈ', keywords: ['秘密', '記憶', '運命'] },
      { name: 'アルギズ', meaning: 'ヘラジカ', element: '風', rune: 'ᛉ', keywords: ['保護', '直感', '高次'] },
      { name: 'ソウィロ', meaning: '太陽', element: '火', rune: 'ᛊ', keywords: ['勝利', '成功', '指導'] },
      { name: 'ティワズ', meaning: '戦神', element: '火', rune: 'ᛏ', keywords: ['勇気', '犠牲', '正義'] },
      { name: 'ベルカナ', meaning: 'カバノキ', element: '地', rune: 'ᛒ', keywords: ['成長', '再生', '豊穣'] },
      { name: 'エワズ', meaning: '馬', element: '地', rune: 'ᛖ', keywords: ['進歩', '信頼', '協力'] },
      { name: 'マンナズ', meaning: '人間', element: '風', rune: 'ᛗ', keywords: ['自己', '協力', '文明'] },
      { name: 'ラグズ', meaning: '湖・水', element: '水', rune: 'ᛚ', keywords: ['流れ', '直感', '感情'] },
      { name: 'イングワズ', meaning: '英雄神', element: '地', rune: 'ᛜ', keywords: ['豊穣', '平和', '内なる力'] },
      { name: 'オシラ', meaning: '故郷', element: '地', rune: 'ᛟ', keywords: ['継承', '財産', '伝統'] },
      { name: 'ダガズ', meaning: '夜明け', element: '火', rune: 'ᛞ', keywords: ['啓蒙', '覚醒', '新しい始まり'] }
    ];
    
    const birthDate = new Date(userData.birthDate);
    const year = birthDate.getFullYear();
    const month = birthDate.getMonth() + 1;
    const day = birthDate.getDate();
    
    // より複雑なランダム化（生年月日 + 名前 + 質問から）
    const nameSum = userData.fullName.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const questionSum = userData.question.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const dateSum = year + month * 31 + day;
    
    // 3つのルーンを選択（過去・現在・未来）
    const seeds = [
      (dateSum + nameSum) % elderFuthark.length,
      (dateSum + questionSum) % elderFuthark.length,
      (nameSum + questionSum + day) % elderFuthark.length
    ];
    
    // 重複を避ける
    const uniqueSeeds = [...new Set(seeds)];
    while (uniqueSeeds.length < 3) {
      uniqueSeeds.push((uniqueSeeds[uniqueSeeds.length - 1] + 7) % elderFuthark.length);
    }
    
    const drawnRunes = uniqueSeeds.slice(0, 3).map((seed, index) => {
      const rune = elderFuthark[seed];
      // 位置を決定（奇数なら逆位置）
      const isReversed = (seed + index + questionSum) % 2 === 1;
      return {
        ...rune,
        position: isReversed ? '逆位置' : '正位置'
      };
    });

    return {
      ...mockDivinationData.runes,
      drawn: drawnRunes,
      interpretation: generateRuneInterpretation(userData, drawnRunes)
    };
  }

  function generateRuneInterpretation(userData: UserInputData, drawnRunes: any[]): string {
    const [pastRune, presentRune, futureRune] = drawnRunes;
    
    const positionMeaning = (rune: any, position: string) => {
      if (position === '正位置') {
        return rune.keywords[0]; // ポジティブな意味
      } else {
        return rune.keywords[1] || '停滞'; // ネガティブまたは内向きの意味
      }
    };
    
    return `「${userData.question}」について、北欧の古代ルーンが以下の道筋を示しています。

過去の影響「${pastRune.name}（${pastRune.rune}）」${pastRune.position}：
${pastRune.meaning}のエネルギーが、${positionMeaning(pastRune, pastRune.position)}として現在に影響を与えています。

現在の状況「${presentRune.name}（${presentRune.rune}）」${presentRune.position}：
${presentRune.meaning}の力が、${positionMeaning(presentRune, presentRune.position)}という形で現れています。この状況を理解し、受け入れることが重要です。

未来の可能性「${futureRune.name}（${futureRune.rune}）」${futureRune.position}：
${futureRune.meaning}のエネルギーが、${positionMeaning(futureRune, futureRune.position)}をもたらす可能性があります。

オーディンの知恵に従い、運命を受け入れながらも、自らの意志で道を切り開いてください。`;
  }

  const { runes } = { runes: runesResult };

  // エレメントの色
  const elementColors: { [key: string]: string } = {
    '火': 'from-red-500/30 to-orange-500/30',
    '水': 'from-blue-500/30 to-cyan-500/30',
    '風': 'from-gray-400/30 to-blue-400/30',
    '地': 'from-green-600/30 to-emerald-600/30'
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-slate-900 to-slate-800">
      <CosmicBackground />
      
      {/* ヘッダー */}
      <header className="relative z-20 bg-slate-900/50 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-white hover:text-blue-300 transition-colors">
            ← ダッシュボードに戻る
          </Link>
          <h1 className="text-2xl font-light text-white">ルーン占い詳細分析</h1>
          <div className="w-32"></div>
        </div>
      </header>

      <main className="relative z-10 pt-10 pb-20">
        <div className="max-w-7xl mx-auto px-5">
          <ParameterBadge />
          
          {/* ルーンストーンの配置 */}
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-10 mb-10 border border-white/10">
            <h2 className="text-3xl font-light text-white text-center mb-10">古代北欧の叡智</h2>
            
            {/* 3つのルーンストーン */}
            <div className="flex justify-center items-center gap-8 mb-10">
              {runes.drawn.map((rune, index) => (
                <div
                  key={index}
                  className={`cursor-pointer transition-all duration-500 ${
                    selectedRune === index ? 'scale-110 z-10' : 'scale-100 opacity-70 hover:opacity-100'
                  }`}
                  onClick={() => setSelectedRune(index)}
                >
                  <div className={`relative w-32 h-40 bg-gradient-to-br ${elementColors[rune.element]} backdrop-blur-md rounded-xl border border-white/20 p-4 flex flex-col`}>
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-white text-2xl font-light mb-1">{rune.name.slice(0, 2)}</p>
                        <p className="text-white/70 text-xs">{rune.element}</p>
                      </div>
                    </div>
                    <div className="text-center mt-2">
                      <p className="text-white text-sm font-medium">{rune.name}</p>
                      <p className="text-white/60 text-xs">{rune.position}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 選択されたルーンの詳細 */}
            <div className="bg-white/5 rounded-xl p-8 max-w-3xl mx-auto">
              <h3 className="text-2xl font-light text-white text-center mb-6">
                {runes.drawn[selectedRune].name} - {runes.drawn[selectedRune].meaning}
              </h3>
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="text-center">
                  <p className="text-white/50 text-sm mb-2">位置</p>
                  <p className="text-xl text-white">{runes.drawn[selectedRune].position}</p>
                </div>
                <div className="text-center">
                  <p className="text-white/50 text-sm mb-2">元素</p>
                  <p className="text-xl text-white">{runes.drawn[selectedRune].element}</p>
                </div>
              </div>
              <p className="text-lg text-white/80 text-center leading-relaxed">
                {runes.drawn[selectedRune].position === '正位置' 
                  ? `${runes.drawn[selectedRune].meaning}のエネルギーが順調に流れています。`
                  : `${runes.drawn[selectedRune].meaning}において、見直しや内省が必要な時期です。`}
              </p>
            </div>
          </div>

          {/* ルーンの配置パターン（インフォグラフィック） */}
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-10 mb-10 border border-white/10">
            <h3 className="text-2xl font-light text-white text-center mb-8">ノルンの織り成す運命</h3>
            
            <div className="relative max-w-4xl mx-auto">
              <svg viewBox="0 0 800 400" className="w-full h-auto">
                {/* 過去・現在・未来のライン */}
                <line x1="100" y1="200" x2="700" y2="200" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
                
                {/* 過去 */}
                <circle cx="200" cy="200" r="80" fill="rgba(139,92,246,0.1)" stroke="rgba(139,92,246,0.4)" strokeWidth="2" />
                <text x="200" y="100" textAnchor="middle" className="fill-white/60 text-sm">過去 (Urd)</text>
                <text x="200" y="205" textAnchor="middle" className="fill-white text-lg">基盤</text>
                
                {/* 現在 */}
                <circle cx="400" cy="200" r="100" fill="rgba(99,102,241,0.2)" stroke="rgba(99,102,241,0.6)" strokeWidth="3" />
                <text x="400" y="80" textAnchor="middle" className="fill-white/60 text-sm">現在 (Verdandi)</text>
                <text x="400" y="205" textAnchor="middle" className="fill-white text-xl">挑戦</text>
                
                {/* 未来 */}
                <circle cx="600" cy="200" r="80" fill="rgba(79,70,229,0.1)" stroke="rgba(79,70,229,0.4)" strokeWidth="2" />
                <text x="600" y="100" textAnchor="middle" className="fill-white/60 text-sm">未来 (Skuld)</text>
                <text x="600" y="205" textAnchor="middle" className="fill-white text-lg">可能性</text>
                
                {/* ルーンの配置 */}
                {runes.drawn.map((rune, index) => {
                  const x = 200 + index * 200;
                  const y = 200;
                  return (
                    <g key={index}>
                      <rect x={x - 30} y={y - 40} width="60" height="80" 
                        fill={`rgba(${index === 0 ? '139,92,246' : index === 1 ? '99,102,241' : '79,70,229'}, 0.3)`}
                        stroke="rgba(255,255,255,0.6)" strokeWidth="2" rx="8" />
                      
                      {/* ルーン文字を上部に配置 */}
                      <text x={x} y={y - 20} textAnchor="middle" className="fill-white text-lg font-light">
                        {rune.name.slice(0, 2)}
                      </text>
                      
                      {/* 元素を中央に配置 */}
                      <text x={x} y={y + 5} textAnchor="middle" className="fill-white/70 text-sm">
                        {rune.element}
                      </text>
                      
                      {/* 位置を下部に配置 */}
                      <text x={x} y={y + 25} textAnchor="middle" className="fill-white/50 text-xs">
                        {rune.position === '正位置' ? '正位置' : '逆位置'}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* エレメントバランス分析 */}
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-10 mb-10 border border-white/10">
            <h3 className="text-2xl font-light text-white text-center mb-8">元素の調和</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {['火', '水', '風', '地'].map((element) => {
                const count = runes.drawn.filter(r => r.element === element).length;
                const percentage = (count / 3) * 100;
                
                return (
                  <div key={element} className="text-center">
                    <div className="relative w-32 h-32 mx-auto mb-3">
                      <svg viewBox="0 0 100 100" className="w-full h-full">
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="rgba(255,255,255,0.1)"
                          strokeWidth="8"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke={element === '火' ? '#ef4444' : element === '水' ? '#3b82f6' : element === '風' ? '#9ca3af' : '#10b981'}
                          strokeWidth="8"
                          strokeDasharray={`${percentage * 2.51} 251`}
                          strokeLinecap="round"
                          className="transition-all duration-1000"
                          style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div>
                          <p className="text-3xl font-bold text-white">{count}</p>
                          <p className="text-xs text-white/60">{element}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-8 text-center text-white/60">
              <p>※ 元素のバランスが運命の流れを示します</p>
            </div>
          </div>

          {/* 古代の知恵（生データ） */}
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-10 mb-10 border border-white/10">
            <h3 className="text-2xl font-light text-white text-center mb-8">ルーンキャスト結果</h3>
            
            <div className="space-y-4 max-w-3xl mx-auto">
              {runes.drawn.map((rune, index) => (
                <div key={index} className="bg-white/5 rounded-xl p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-white/50 text-sm">ルーン名</p>
                      <p className="text-white text-lg">{rune.name}</p>
                    </div>
                    <div>
                      <p className="text-white/50 text-sm">意味</p>
                      <p className="text-white text-lg">{rune.meaning}</p>
                    </div>
                    <div>
                      <p className="text-white/50 text-sm">位置</p>
                      <p className="text-white text-lg">{rune.position}</p>
                    </div>
                    <div>
                      <p className="text-white/50 text-sm">元素</p>
                      <p className="text-white text-lg">{rune.element}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 text-center text-white/50 text-sm">
              <p>※ エルダー・フサルク（24文字）による伝統的解釈</p>
              <p>※ 各ルーンは古代ゲルマン語の音価と意味を持ちます</p>
            </div>
          </div>

          {/* 総合的な解釈 */}
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-10 border border-white/10">
            <h3 className="text-2xl font-light text-white text-center mb-8">オーディンの導き</h3>
            
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl p-8 border border-purple-500/20">
                <p className="text-lg text-white/90 leading-relaxed text-center">
                  {runes.interpretation}
                </p>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-red-400 text-2xl mb-2">ᚠ</p>
                  <p className="text-white/70 text-sm">豊穣の道</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-blue-400 text-2xl mb-2">ᚢ</p>
                  <p className="text-white/70 text-sm">力の源泉</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-gray-400 text-2xl mb-2">ᚨ</p>
                  <p className="text-white/70 text-sm">叡智の声</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* ナビゲーション */}
          <div className="mt-10 flex justify-center gap-6">
            <Link 
              href="/divination/nine-star-ki"
              className="px-8 py-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all duration-300"
            >
              ← 九星気学へ
            </Link>
            <Link 
              href="/divination/iching"
              className="px-8 py-3 bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-md rounded-full text-white hover:from-purple-500/30 hover:to-blue-500/30 transition-all duration-300 border border-purple-400/50"
            >
              易経へ →
            </Link>
          </div>
          
        </div>
      </main>
    </div>
  );
}