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

// Helper functions moved outside component to avoid dependency issues
function calculateTreeSign(month: number, day: number): string {
  const trees = [
    { name: 'カバノキ', start: { month: 12, day: 24 }, end: { month: 1, day: 20 } },
    { name: 'ナナカマド', start: { month: 1, day: 21 }, end: { month: 2, day: 17 } },
    { name: 'トネリコ', start: { month: 2, day: 18 }, end: { month: 3, day: 17 } },
    { name: 'ハンノキ', start: { month: 3, day: 18 }, end: { month: 4, day: 14 } },
    { name: 'ヤナギ', start: { month: 4, day: 15 }, end: { month: 5, day: 12 } },
    { name: 'サンザシ', start: { month: 5, day: 13 }, end: { month: 6, day: 9 } },
    { name: 'オーク', start: { month: 6, day: 10 }, end: { month: 7, day: 7 } },
    { name: 'ヒイラギ', start: { month: 7, day: 8 }, end: { month: 8, day: 4 } },
    { name: 'ハシバミ', start: { month: 8, day: 5 }, end: { month: 9, day: 1 } },
    { name: 'ブドウ', start: { month: 9, day: 2 }, end: { month: 9, day: 29 } },
    { name: 'ツタ', start: { month: 9, day: 30 }, end: { month: 10, day: 27 } },
    { name: 'イチイ', start: { month: 10, day: 28 }, end: { month: 11, day: 24 } },
    { name: 'ニワトコ', start: { month: 11, day: 25 }, end: { month: 12, day: 23 } }
  ];
  
  for (const tree of trees) {
    if (isDateInRange(month, day, tree.start, tree.end)) {
      return tree.name;
    }
  }
  return 'オーク'; // デフォルト
}

function isDateInRange(month: number, day: number, start: {month: number, day: number}, end: {month: number, day: number}): boolean {
  if (start.month <= end.month) {
    return (month > start.month || (month === start.month && day >= start.day)) &&
           (month < end.month || (month === end.month && day <= end.day));
  } else {
    return (month > start.month || (month === start.month && day >= start.day)) ||
           (month < end.month || (month === end.month && day <= end.day));
  }
}

function calculateCelticAttributes(treeSign: string) {
  const attributes = {
    'カバノキ': { animal: '白馬', color: '白', gemstone: '水晶', element: '空気' },
    'ナナカマド': { animal: 'ワシ', color: '緑', gemstone: 'エメラルド', element: '火' },
    'トネリコ': { animal: '蛇', color: '青', gemstone: 'サファイア', element: '水' },
    'ハンノキ': { animal: 'くま', color: '紫', gemstone: 'アメジスト', element: '土' },
    'ヤナギ': { animal: '猫', color: '黄', gemstone: 'トパーズ', element: '水' },
    'サンザシ': { animal: '蚤', color: 'ピンク', gemstone: 'ローズクォーツ', element: '空気' },
    'オーク': { animal: 'ライオン', color: '金', gemstone: 'シトリン', element: '火' },
    'ヒイラギ': { animal: '馬', color: '赤', gemstone: 'ガーネット', element: '火' },
    'ハシバミ': { animal: 'リス', color: '茶', gemstone: 'タイガーアイ', element: '土' },
    'ブドウ': { animal: '白鳥', color: '紫', gemstone: 'ラピスラズリ', element: '空気' },
    'ツタ': { animal: '蛸', color: '黄緑', gemstone: 'オパール', element: '土' },
    'イチイ': { animal: '鷹', color: '黒', gemstone: 'オブシディアン', element: '土' },
    'ニワトコ': { animal: '鹿', color: '金', gemstone: 'ゴールドストーン', element: '火' }
  };
  
  return attributes[treeSign as keyof typeof attributes] || attributes['オーク'];
}

function calculateCelticQualities(treeSign: string): string[] {
  const baseQualities = {
    'カバノキ': ['情熱的', '独立心', 'カリスマ'],
    'ナナカマド': ['理想主義', '守護本能', '直感力'],
    'オーク': ['リーダーシップ', '勇気', '寛容']
  };
  
  const defaultQualities = ['初心', '成長', '変化'];
  return baseQualities[treeSign as keyof typeof baseQualities] || defaultQualities;
}

function generateCelticInterpretation(question: string, treeSign: string, animal: string): string {
  return `あなたの守護樹である${treeSign}と、魂の動物である${animal}が、「${question}」に対する古代ケルトの叡智を伝えています。ドルイドの教えによると、自然のサイクルに合わせて行動することで、真の調和と平和がもたらされます。大地のエネルギーと繋がり、内なる直感を信じて歩んでください。`;
}

// ケルトの樹木カレンダー
const CelticTreeCalendar = ({ currentTree }: { currentTree: string }) => {
  const trees = [
    { name: 'カバノキ', period: '12/24-1/20', angle: 0, symbol: '♈' },
    { name: 'ナナカマド', period: '1/21-2/17', angle: 30, symbol: '♉' },
    { name: 'トネリコ', period: '2/18-3/17', angle: 60, symbol: '♊' },
    { name: 'ハンノキ', period: '3/18-4/14', angle: 90, symbol: '♋' },
    { name: 'ヤナギ', period: '4/15-5/12', angle: 120, symbol: '♌' },
    { name: 'サンザシ', period: '5/13-6/9', angle: 150, symbol: '♍' },
    { name: 'オーク', period: '6/10-7/7', angle: 180, symbol: '♎' },
    { name: 'ヒイラギ', period: '7/8-8/4', angle: 210, symbol: '♏' },
    { name: 'ハシバミ', period: '8/5-9/1', angle: 240, symbol: '♐' },
    { name: 'ブドウ', period: '9/2-9/29', angle: 270, symbol: '♑' },
    { name: 'ツタ', period: '9/30-10/27', angle: 300, symbol: '♒' },
    { name: 'イチイ', period: '10/28-11/24', angle: 330, symbol: '♓' }
  ];

  return (
    <div className="relative w-96 h-96 mx-auto">
      <svg viewBox="0 0 400 400" className="w-full h-full">
        {/* 外円 */}
        <circle cx="200" cy="200" r="180" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
        <circle cx="200" cy="200" r="140" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        
        {/* 季節の色分け */}
        <defs>
          <radialGradient id="seasonGradient">
            <stop offset="0%" stopColor="rgba(255,255,255,0.05)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>
        
        {/* 樹木の配置 */}
        {trees.map((tree) => {
          const radian = (tree.angle - 90) * Math.PI / 180;
          const x = 200 + 160 * Math.cos(radian);
          const y = 200 + 160 * Math.sin(radian);
          const isCurrentTree = tree.name === currentTree;
          
          return (
            <g key={tree.name}>
              {/* セクターライン */}
              <line 
                x1="200" y1="200" 
                x2={200 + 180 * Math.cos(radian)} 
                y2={200 + 180 * Math.sin(radian)}
                stroke="rgba(255,255,255,0.1)" 
                strokeWidth="1" 
              />
              
              {/* 樹木名 */}
              <circle
                cx={x}
                cy={y}
                r="25"
                fill={isCurrentTree ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.1)'}
                stroke={isCurrentTree ? '#22c55e' : 'rgba(255,255,255,0.3)'}
                strokeWidth="2"
              />
              <text x={x} y={y + 5} textAnchor="middle" className="fill-white text-xs">
                {tree.name}
              </text>
            </g>
          );
        })}
        
        {/* 中央のケルト結び */}
        <g transform="translate(200, 200)">
          <path
            d="M -30,0 Q -30,-30 0,-30 Q 30,-30 30,0 Q 30,30 0,30 Q -30,30 -30,0 Z
               M 0,-30 Q -30,-30 -30,0 Q -30,30 0,30 Q 30,30 30,0 Q 30,-30 0,-30 Z"
            fill="none"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="2"
          />
        </g>
        
        {/* 季節表示 */}
        <text x="200" y="30" textAnchor="middle" className="fill-white/60 text-sm">冬</text>
        <text x="370" y="200" textAnchor="middle" className="fill-white/60 text-sm">春</text>
        <text x="200" y="380" textAnchor="middle" className="fill-white/60 text-sm">夏</text>
        <text x="30" y="200" textAnchor="middle" className="fill-white/60 text-sm">秋</text>
      </svg>
    </div>
  );
};

export default function CelticAstrologyPage() {
  const [, setUserInput] = useState<UserInputData | null>(null);
  const [celticAstrology, setCelticAstrology] = useState(mockDivinationData.celticAstrology);
  const [selectedOgham, setSelectedOgham] = useState<string>('ᚁ');

  // ケルト占星術の計算関数
  const calculateCelticAstrology = useCallback((userData: UserInputData) => {
    const birthDate = new Date(userData.birthDate);
    const month = birthDate.getMonth() + 1;
    const day = birthDate.getDate();
    
    // ケルトの樹木さん計算（ドルイド暦ベース）
    const treeSign = calculateTreeSign(month, day);
    
    // 守護動物と属性を計算
    const { animal, color, gemstone, element } = calculateCelticAttributes(treeSign);
    
    // 性質の特徴を計算
    const qualities = calculateCelticQualities(treeSign);
    
    return {
      ...mockDivinationData.celticAstrology,
      treeSign,
      animal,
      color,
      gemstone,
      element,
      qualities,
      interpretation: generateCelticInterpretation(userData.question, treeSign, animal)
    };
  }, []);

  useEffect(() => {
    // LocalStorageからユーザーデータを読み込み
    const storedData = localStorage.getItem('uranai_user_data');
    if (storedData) {
      try {
        const userData: UserInputData = JSON.parse(storedData);
        setUserInput(userData);
        
        // 実際のケルト占星術計算を実行
        const calculatedResult = calculateCelticAstrology(userData);
        setCelticAstrology(calculatedResult);
      } catch (error) {
        console.error('ユーザーデータの読み込みエラー:', error);
      }
    }
  }, [calculateCelticAstrology]);



  // オガム文字
  const oghamLetters = [
    { letter: 'ᚁ', name: 'ベイス', tree: 'カバノキ', meaning: '始まり' },
    { letter: 'ᚂ', name: 'ルイス', tree: 'ナナカマド', meaning: '保護' },
    { letter: 'ᚃ', name: 'フェルン', tree: 'ハンノキ', meaning: '導き' },
    { letter: 'ᚄ', name: 'サイル', tree: 'ヤナギ', meaning: '直感' },
    { letter: 'ᚅ', name: 'ニン', tree: 'トネリコ', meaning: '成長' },
    { letter: 'ᚆ', name: 'ウアス', tree: 'サンザシ', meaning: '浄化' },
    { letter: 'ᚇ', name: 'ダー', tree: 'オーク', meaning: '力' },
    { letter: 'ᚈ', name: 'ティン', tree: 'ヒイラギ', meaning: '挑戦' }
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
          <h1 className="text-2xl font-light text-white">ケルト占星術詳細分析</h1>
          <div className="w-32"></div>
        </div>
      </header>

      <main className="relative z-10 pt-10 pb-20">
        <div className="max-w-7xl mx-auto px-5">
          <ParameterBadge />
          
          {/* ケルトの樹木円環 */}
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-10 mb-10 border border-white/10">
            <h2 className="text-3xl font-light text-white text-center mb-10">
              あなたの守護樹：{celticAstrology.treeSign}
            </h2>
            
            <CelticTreeCalendar currentTree={celticAstrology.treeSign} />
            
            {/* 守護樹の詳細 */}
            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <p className="text-white/50 text-sm mb-2">守護動物</p>
                <p className="text-2xl mb-1">🦋</p>
                <p className="text-white">{celticAstrology.animal}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <p className="text-white/50 text-sm mb-2">聖なる色</p>
                <div className="w-8 h-8 mx-auto mb-1 rounded-full bg-gradient-to-br from-gray-500 to-green-600"></div>
                <p className="text-white">{celticAstrology.color}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <p className="text-white/50 text-sm mb-2">守護石</p>
                <p className="text-2xl mb-1">💎</p>
                <p className="text-white">{celticAstrology.gemstone}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <p className="text-white/50 text-sm mb-2">元素</p>
                <p className="text-2xl mb-1">🔥</p>
                <p className="text-white">{celticAstrology.element}</p>
              </div>
            </div>
          </div>

          {/* オガム文字（インフォグラフィック） */}
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-10 mb-10 border border-white/10">
            <h3 className="text-2xl font-light text-white text-center mb-8">古代のオガム文字</h3>
            
            <div className="grid grid-cols-4 md:grid-cols-8 gap-4 max-w-4xl mx-auto mb-8">
              {oghamLetters.map((ogham) => (
                <div
                  key={ogham.letter}
                  className={`bg-white/5 rounded-xl p-4 text-center cursor-pointer transition-all ${
                    selectedOgham === ogham.letter ? 'scale-105 border-green-400 bg-green-500/20' : 'border-white/20 hover:bg-white/10'
                  } border`}
                  onClick={() => setSelectedOgham(ogham.letter)}
                >
                  <p className="text-3xl mb-2">{ogham.letter}</p>
                  <p className="text-xs text-white/70">{ogham.name}</p>
                </div>
              ))}
            </div>
            
            {/* 選択されたオガム文字の詳細 */}
            <div className="bg-white/5 rounded-xl p-6 max-w-2xl mx-auto">
              {(() => {
                const selected = oghamLetters.find(o => o.letter === selectedOgham);
                return selected ? (
                  <>
                    <h4 className="text-xl font-light text-white text-center mb-4">
                      {selected.letter} - {selected.name}
                    </h4>
                    <p className="text-white/80 text-center">
                      {selected.tree}の樹を表し、「{selected.meaning}」の力を持ちます。
                      古代ケルトの知恵が、新たな道を照らし出すでしょう。
                    </p>
                  </>
                ) : null;
              })()}
            </div>
          </div>

          {/* ケルトの性質分析 */}
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-10 mb-10 border border-white/10">
            <h3 className="text-2xl font-light text-white text-center mb-8">樹木が示す性質</h3>
            
            <div className="max-w-3xl mx-auto">
              {/* 性質のレーダーチャート */}
              <div className="relative w-80 h-80 mx-auto mb-8">
                <svg viewBox="0 0 400 400" className="w-full h-full">
                  {/* 六角形の背景 */}
                  {[1, 2, 3, 4, 5].map((level) => (
                    <polygon
                      key={level}
                      points="200,80 320,140 320,260 200,320 80,260 80,140"
                      fill="none"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="1"
                      transform={`scale(${level * 0.2}) translate(${200 * (1 - level * 0.2)}, ${200 * (1 - level * 0.2)})`}
                    />
                  ))}
                  
                  {/* 性質の軸 */}
                  {[
                    { trait: '情熱', value: 0.9, angle: 0 },
                    { trait: 'カリスマ', value: 0.8, angle: 60 },
                    { trait: '理想主義', value: 0.95, angle: 120 },
                    { trait: '創造性', value: 0.7, angle: 180 },
                    { trait: '直感', value: 0.85, angle: 240 },
                    { trait: '忠誠心', value: 0.75, angle: 300 }
                  ].map((trait) => {
                    const angle = (trait.angle - 90) * Math.PI / 180;
                    const x = 200 + 120 * trait.value * Math.cos(angle);
                    const y = 200 + 120 * trait.value * Math.sin(angle);
                    const labelX = 200 + 140 * Math.cos(angle);
                    const labelY = 200 + 140 * Math.sin(angle);
                    
                    return (
                      <g key={trait.trait}>
                        <line x1="200" y1="200" x2={labelX} y2={labelY} 
                          stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                        <circle cx={x} cy={y} r="4" fill="#22c55e" />
                        <text x={labelX} y={labelY + 5} textAnchor="middle" 
                          className="fill-white text-sm">{trait.trait}</text>
                      </g>
                    );
                  })}
                  
                  {/* 性質の多角形 */}
                  <polygon
                    points="200,92 304,152 304,248 200,275 96,248 110,160"
                    fill="rgba(34,197,94,0.2)"
                    stroke="#22c55e"
                    strokeWidth="2"
                  />
                </svg>
              </div>
              
              {/* 特質リスト */}
              <div className="grid grid-cols-3 gap-4">
                {celticAstrology.qualities.map((quality) => (
                  <div key={quality} className="bg-white/5 rounded-lg p-3 text-center">
                    <p className="text-white/80">{quality}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ケルトの年輪（時の流れ） */}
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-10 mb-10 border border-white/10">
            <h3 className="text-2xl font-light text-white text-center mb-8">生命の年輪</h3>
            
            <div className="relative w-80 h-80 mx-auto">
              <svg viewBox="0 0 400 400" className="w-full h-full">
                {/* 年輪 */}
                {[180, 150, 120, 90, 60, 30].map((radius, index) => (
                  <circle
                    key={radius}
                    cx="200"
                    cy="200"
                    r={radius}
                    fill="none"
                    stroke={`rgba(34,197,94,${0.1 + index * 0.05})`}
                    strokeWidth="2"
                  />
                ))}
                
                {/* ライフステージ */}
                <text x="200" y="50" textAnchor="middle" className="fill-white/60 text-sm">成熟期</text>
                <text x="350" y="200" textAnchor="middle" className="fill-white/60 text-sm">収穫期</text>
                <text x="200" y="370" textAnchor="middle" className="fill-white/60 text-sm">再生期</text>
                <text x="50" y="200" textAnchor="middle" className="fill-white/60 text-sm">成長期</text>
                
                {/* 現在位置 */}
                <circle cx="280" cy="140" r="8" fill="#22c55e" className="animate-pulse" />
                <text x="280" y="120" textAnchor="middle" className="fill-white text-sm">現在</text>
              </svg>
            </div>
            
            <p className="text-center text-white/60 mt-4">
              人生の年輪は螺旋を描きながら、より深い知恵へと導きます
            </p>
          </div>

          {/* 総合的な解釈 */}
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-10 border border-white/10">
            <h3 className="text-2xl font-light text-white text-center mb-8">古代ケルトからのメッセージ</h3>
            
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="text-center mb-8">
                <p className="text-3xl font-light text-white mb-4">
                  {celticAstrology.treeSign}の守護
                </p>
                <p className="text-xl text-white/70">
                  {celticAstrology.animal}の霊が導く道
                </p>
              </div>
              
              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl p-8 border border-green-500/20">
                <p className="text-lg text-white/90 leading-relaxed text-center">
                  {celticAstrology.interpretation}
                </p>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-green-300 text-2xl mb-2">🌳</p>
                  <p className="text-white/70 text-sm">大地の力</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-blue-300 text-2xl mb-2">🌊</p>
                  <p className="text-white/70 text-sm">水の浄化</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-purple-300 text-2xl mb-2">🌙</p>
                  <p className="text-white/70 text-sm">月の導き</p>
                </div>
              </div>
              
              <div className="mt-8 p-6 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-xl border border-green-500/20">
                <p className="text-center text-lg text-white/80">
                  古代ケルトの叡智は、自然と調和し、
                  内なる変容を受け入れることの大切さを教えています。
                  あなたの守護樹が、新たな成長への道を照らし出すでしょう。
                </p>
              </div>
            </div>
          </div>
          
          {/* ナビゲーション */}
          <div className="mt-10 flex justify-center gap-6">
            <Link 
              href="/divination/vedic"
              className="px-8 py-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all duration-300"
            >
              ← ヴェーダ占星術へ
            </Link>
            <Link 
              href="/divination/integrated"
              className="px-8 py-3 bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-md rounded-full text-white hover:from-purple-500/30 hover:to-blue-500/30 transition-all duration-300 border border-purple-400/50"
            >
              統合占術分析へ →
            </Link>
          </div>
          
        </div>
      </main>
    </div>
  );
}