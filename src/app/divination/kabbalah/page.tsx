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

// 生命の樹（セフィロト）コンポーネント
const TreeOfLife = ({ currentSephirah }: { currentSephirah: string }) => {
  const sephiroth = [
    { id: 1, name: 'ケテル', hebrew: 'כתר', meaning: '王冠', x: 200, y: 50 },
    { id: 2, name: 'コクマー', hebrew: 'חכמה', meaning: '知恵', x: 300, y: 120 },
    { id: 3, name: 'ビナー', hebrew: 'בינה', meaning: '理解', x: 100, y: 120 },
    { id: 4, name: 'ケセド', hebrew: 'חסד', meaning: '慈悲', x: 300, y: 200 },
    { id: 5, name: 'ゲブラー', hebrew: 'גבורה', meaning: '峻厳', x: 100, y: 200 },
    { id: 6, name: 'ティファレト', hebrew: 'תפארת', meaning: '美', x: 200, y: 280 },
    { id: 7, name: 'ネツァク', hebrew: 'נצח', meaning: '勝利', x: 300, y: 360 },
    { id: 8, name: 'ホド', hebrew: 'הוד', meaning: '栄光', x: 100, y: 360 },
    { id: 9, name: 'イェソド', hebrew: 'יסוד', meaning: '基礎', x: 200, y: 440 },
    { id: 10, name: 'マルクト', hebrew: 'מלכות', meaning: '王国', x: 200, y: 520 }
  ];

  const paths = [
    { from: 1, to: 2 }, { from: 1, to: 3 }, { from: 2, to: 3 },
    { from: 2, to: 4 }, { from: 2, to: 6 }, { from: 3, to: 5 },
    { from: 3, to: 6 }, { from: 4, to: 5 }, { from: 4, to: 6 },
    { from: 4, to: 7 }, { from: 5, to: 6 }, { from: 5, to: 8 },
    { from: 6, to: 7 }, { from: 6, to: 8 }, { from: 6, to: 9 },
    { from: 7, to: 8 }, { from: 7, to: 9 }, { from: 7, to: 10 },
    { from: 8, to: 9 }, { from: 8, to: 10 }, { from: 9, to: 10 }
  ];

  return (
    <svg viewBox="0 0 400 600" className="w-full h-full max-w-md mx-auto">
      {/* パス（セフィロト間の接続） */}
      {paths.map((path, index) => {
        const from = sephiroth.find(s => s.id === path.from);
        const to = sephiroth.find(s => s.id === path.to);
        if (!from || !to) return null;
        
        return (
          <line
            key={index}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="2"
          />
        );
      })}
      
      {/* セフィロト */}
      {sephiroth.map((sephirah) => {
        const isCurrent = sephirah.name === currentSephirah.split('（')[0];
        
        return (
          <g key={sephirah.id}>
            <circle
              cx={sephirah.x}
              cy={sephirah.y}
              r="35"
              fill={isCurrent ? 'rgba(147,51,234,0.3)' : 'rgba(255,255,255,0.1)'}
              stroke={isCurrent ? '#9333ea' : 'rgba(255,255,255,0.3)'}
              strokeWidth="2"
            />
            <text x={sephirah.x} y={sephirah.y - 10} textAnchor="middle" className="fill-white text-lg">
              {sephirah.id}
            </text>
            <text x={sephirah.x} y={sephirah.y + 5} textAnchor="middle" className="fill-white text-xs">
              {sephirah.name}
            </text>
            <text x={sephirah.x} y={sephirah.y + 18} textAnchor="middle" className="fill-white/60 text-xs">
              {sephirah.meaning}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

export default function KabbalahPage() {
  const [, setUserInput] = useState<UserInputData | null>(null);
  const [kabbalah, setKabbalah] = useState(mockDivinationData.kabbalah);
  const [selectedPath, setSelectedPath] = useState<number>(mockDivinationData.kabbalah.treeOfLife.path);

  // カバラ数秘術の計算関数
  const calculateKabbalah = useCallback((userData: UserInputData) => {
    const birthDate = new Date(userData.birthDate);
    const year = birthDate.getFullYear();
    const month = birthDate.getMonth() + 1;
    const day = birthDate.getDate();
    
    // ゲマトリア数値計算
    const gematria = calculateGematria(userData.fullName);
    
    // 生命の樹のパスを計算
    const path = calculateTreeOfLifePath(year, month, day);
    
    // 現在のセフィラーを計算
    const currentSephirah = calculateCurrentSephirah(gematria, path);
    
    // ヘブライ文字を計算
    const hebrewLetter = calculateHebrewLetter(userData.fullName, path);
    
    // 天使の影響を計算
    const angelicInfluence = calculateAngelicInfluence(currentSephirah);
    
    return {
      ...mockDivinationData.kabbalah,
      gematria,
      hebrewLetter,
      angelicInfluence,
      treeOfLife: {
        path,
        currentSephirah,
        element: calculateSephirahElement(currentSephirah)
      },
      interpretation: generateKabbalahInterpretation(userData.question, currentSephirah, hebrewLetter)
    };
  }, []);

  useEffect(() => {
    // LocalStorageからユーザーデータを読み込み
    const storedData = localStorage.getItem('uranai_user_data');
    if (storedData) {
      try {
        const userData: UserInputData = JSON.parse(storedData);
        setUserInput(userData);
        
        // 実際のカバラ数秘術計算を実行
        const calculatedResult = calculateKabbalah(userData);
        setKabbalah(calculatedResult);
        setSelectedPath(calculatedResult.treeOfLife.path);
      } catch (error) {
        console.error('ユーザーデータの読み込みエラー:', error);
      }
    }
  }, [calculateKabbalah]);


  function calculateGematria(fullName: string): number {
    // ヘブライ文字の数値対応表（簡略版）
    const hebrewValues: { [key: string]: number } = {
      'あ': 1, 'か': 20, 'さ': 60, 'た': 9, 'な': 50, 'は': 80, 'ま': 40, 'や': 10, 'ら': 200, 'わ': 6,
      'い': 10, 'き': 20, 'し': 300, 'ち': 9, 'に': 50, 'ひ': 80, 'み': 40, 'ゆ': 10, 'り': 200, 'を': 6,
      'う': 6, 'く': 100, 'す': 60, 'つ': 90, 'ぬ': 50, 'ふ': 80, 'む': 40, 'よ': 10, 'る': 200, 'ん': 50,
      'え': 70, 'け': 100, 'せ': 60, 'て': 400, 'ね': 50, 'へ': 5, 'め': 40, 'れ': 200,
      'お': 70, 'こ': 100, 'そ': 60, 'と': 400, 'の': 50, 'ほ': 5, 'も': 40, 'ろ': 200
    };
    
    let sum = 0;
    for (const char of fullName) {
      sum += hebrewValues[char] || 1;
    }
    return sum;
  }

  function calculateTreeOfLifePath(year: number, month: number, day: number): number {
    const totalDays = year + month * 30 + day;
    return ((totalDays % 22) + 1);
  }

  function calculateCurrentSephirah(gematria: number, path: number): string {
    const sephiroth = [
      'ケテル（王冠）', 'コクマー（知恵）', 'ビナー（理解）', 'ケセド（慈悲）', 'ゲブラー（峻厳）',
      'ティファレト（美）', 'ネツァク（勝利）', 'ホド（栄光）', 'イェソド（基礎）', 'マルクト（王国）'
    ];
    
    const index = (gematria + path) % 10;
    return sephiroth[index];
  }

  function calculateHebrewLetter(fullName: string, path: number): string {
    const hebrewLetters = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י', 'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ', 'ק', 'ר', 'ש', 'ת'];
    const nameLength = fullName.length;
    const index = (nameLength + path) % 22;
    return hebrewLetters[index];
  }

  function calculateAngelicInfluence(sephirah: string): string {
    const angels = {
      'ケテル（王冠）': 'メタトロン',
      'コクマー（知恵）': 'ラツィエル',
      'ビナー（理解）': 'ザフキエル',
      'ケセド（慈悲）': 'ツァドキエル',
      'ゲブラー（峻厳）': 'カマエル',
      'ティファレト（美）': 'ラファエル',
      'ネツァク（勝利）': 'ハニエル',
      'ホド（栄光）': 'ミカエル',
      'イェソド（基礎）': 'ガブリエル',
      'マルクト（王国）': 'サンダルフォン'
    };
    
    return angels[sephirah as keyof typeof angels] || 'ラファエル';
  }

  function calculateSephirahElement(sephirah: string): string {
    const elements = {
      'ケテル（王冠）': '神性',
      'コクマー（知恵）': '火',
      'ビナー（理解）': '水',
      'ケセド（慈悲）': '火',
      'ゲブラー（峻厳）': '水',
      'ティファレト（美）': '空気',
      'ネツァク（勝利）': '火',
      'ホド（栄光）': '水',
      'イェソド（基礎）': '空気',
      'マルクト（王国）': '土'
    };
    
    return elements[sephirah as keyof typeof elements] || '空気';
  }

  function generateKabbalahInterpretation(question: string, sephirah: string, hebrewLetter: string): string {
    return `生命の樹の${sephirah}の高みから、神聖なるヘブライ文字「${hebrewLetter}」が、「${question}」に対する答えを示しています。カバラの古代の叡智によると、あなたの魂は現在、高次元の意識と繋がる時期にあります。内なる光を信じ、神の意志と調和することで、真の道が開かれるでしょう。セフィロトの光があなたを導いています。`;
  }

  // 22のパスとヘブライ文字の対応
  const hebrewPaths = [
    { path: 1, letter: 'א', name: 'アレフ', meaning: '牛', tarot: '愚者' },
    { path: 2, letter: 'ב', name: 'ベート', meaning: '家', tarot: '魔術師' },
    { path: 3, letter: 'ג', name: 'ギメル', meaning: 'ラクダ', tarot: '女教皇' },
    { path: 13, letter: 'נ', name: 'ヌン', meaning: '魚', tarot: '死神' },
    { path: 14, letter: 'ס', name: 'サメク', meaning: '支柱', tarot: '節制' },
    { path: 19, letter: 'ק', name: 'コフ', meaning: '後頭部', tarot: '太陽' },
    { path: 21, letter: 'ש', name: 'シン', meaning: '歯', tarot: '審判' },
    { path: 22, letter: 'ת', name: 'タウ', meaning: '十字', tarot: '世界' }
  ];

  const currentPath = hebrewPaths.find(p => p.path === selectedPath) || hebrewPaths[3];

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-slate-900 to-slate-800">
      <CosmicBackground />
      
      {/* ヘッダー */}
      <header className="relative z-20 bg-slate-900/50 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between">
          <Link href="/" className="text-white hover:text-blue-300 transition-colors">
            ← ダッシュボードに戻る
          </Link>
          <h1 className="text-2xl font-light text-white">カバラ数秘術詳細分析</h1>
          <div className="w-32"></div>
        </div>
      </header>

      <main className="relative z-10 pt-10 pb-20">
        <div className="max-w-7xl mx-auto px-5">
          <ParameterBadge />
          
          {/* 生命の樹 */}
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-10 mb-10 border border-white/10">
            <h2 className="text-3xl font-light text-white text-center mb-10">セフィロトの樹</h2>
            
            <TreeOfLife currentSephirah={kabbalah.treeOfLife.currentSephirah} />
            
            {/* 現在のセフィラー詳細 */}
            <div className="mt-10 bg-white/5 rounded-xl p-6 max-w-2xl mx-auto">
              <h3 className="text-xl font-light text-white text-center mb-4">
                現在のセフィラー：{kabbalah.treeOfLife.currentSephirah}
              </h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-white/50 text-sm mb-2">パス番号</p>
                  <p className="text-white text-lg">{kabbalah.treeOfLife.path}</p>
                </div>
                <div>
                  <p className="text-white/50 text-sm mb-2">対応元素</p>
                  <p className="text-white text-lg">{kabbalah.treeOfLife.element}</p>
                </div>
                <div>
                  <p className="text-white/50 text-sm mb-2">守護天使</p>
                  <p className="text-white text-lg">{kabbalah.angelicInfluence}</p>
                </div>
              </div>
            </div>
          </div>

          {/* ヘブライ文字とパス（インフォグラフィック） */}
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-10 mb-10 border border-white/10">
            <h3 className="text-2xl font-light text-white text-center mb-8">神聖なる22の径</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
              {hebrewPaths.map((path) => (
                <div
                  key={path.path}
                  className={`bg-white/5 rounded-xl p-4 text-center cursor-pointer transition-all ${
                    selectedPath === path.path ? 'scale-105 border-purple-400 bg-purple-500/20' : 'border-white/20 hover:bg-white/10'
                  } border`}
                  onClick={() => setSelectedPath(path.path)}
                >
                  <p className="text-4xl mb-2">{path.letter}</p>
                  <p className="text-white text-sm">{path.name}</p>
                  <p className="text-white/60 text-xs">{path.meaning}</p>
                  <p className="text-purple-300 text-xs mt-1">{path.tarot}</p>
                </div>
              ))}
            </div>
            
            {/* 選択されたパスの詳細 */}
            <div className="bg-white/5 rounded-xl p-6">
              <h4 className="text-xl font-light text-white text-center mb-4">
                パス {selectedPath}: {currentPath.letter} - {currentPath.name}
              </h4>
              <p className="text-white/80 text-center">
                「{currentPath.meaning}」を象徴し、タロットの「{currentPath.tarot}」と対応。
                このパスは変容と成長の道を示しています。
              </p>
            </div>
          </div>

          {/* ゲマトリア計算 */}
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-10 mb-10 border border-white/10">
            <h3 className="text-2xl font-light text-white text-center mb-8">ゲマトリア数値解析</h3>
            
            <div className="space-y-6 max-w-3xl mx-auto">
              <div className="bg-white/5 rounded-xl p-6">
                <p className="text-white/50 text-sm mb-2">あなたの名前の数値</p>
                <div className="font-mono text-2xl text-purple-300 mb-4 text-center">
                  מ (40) + ש (300) + ה (5) = 345
                </div>
                <p className="text-white/70 text-center">
                  345は「神の名」を表し、神聖な保護と導きを示します
                </p>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/5 rounded-lg p-4 text-center">
                  <p className="text-3xl text-yellow-300 mb-2">72</p>
                  <p className="text-white/70 text-sm">神の72の名</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4 text-center">
                  <p className="text-3xl text-blue-300 mb-2">216</p>
                  <p className="text-white/70 text-sm">創造の数</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4 text-center">
                  <p className="text-3xl text-green-300 mb-2">358</p>
                  <p className="text-white/70 text-sm">メシアの数</p>
                </div>
              </div>
            </div>
          </div>

          {/* 四つの世界 */}
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-10 mb-10 border border-white/10">
            <h3 className="text-2xl font-light text-white text-center mb-8">四つの世界</h3>
            
            <div className="relative">
              <svg viewBox="0 0 800 400" className="w-full h-auto max-w-4xl mx-auto">
                {/* 四つの世界の層 */}
                {[
                  { world: 'アツィルト', subtitle: '流出界', color: 'rgba(147,51,234,0.2)', y: 50, desc: '神性の世界' },
                  { world: 'ブリアー', subtitle: '創造界', color: 'rgba(99,102,241,0.2)', y: 150, desc: '大天使の世界' },
                  { world: 'イェツィラー', subtitle: '形成界', color: 'rgba(59,130,246,0.2)', y: 250, desc: '天使の世界' },
                  { world: 'アッシャー', subtitle: '活動界', color: 'rgba(16,185,129,0.2)', y: 350, desc: '物質の世界' }
                ].map((world) => (
                  <g key={world.world}>
                    <rect x="100" y={world.y - 40} width="600" height="80" 
                      fill={world.color} stroke="rgba(255,255,255,0.3)" strokeWidth="1" rx="10" />
                    <text x="400" y={world.y} textAnchor="middle" className="fill-white text-xl">
                      {world.world}（{world.subtitle}）
                    </text>
                    <text x="400" y={world.y + 25} textAnchor="middle" className="fill-white/60 text-sm">
                      {world.desc}
                    </text>
                  </g>
                ))}
                
                {/* 光の流れ */}
                <path d="M 400,50 L 400,350" stroke="url(#gradient)" strokeWidth="3" opacity="0.5" />
                
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#9333ea" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          {/* 総合的な解釈 */}
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-10 border border-white/10">
            <h3 className="text-2xl font-light text-white text-center mb-8">カバラからの神秘的メッセージ</h3>
            
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="text-center mb-8">
                <p className="text-3xl font-light text-white mb-4">
                  {kabbalah.hebrewLetter} - {kabbalah.treeOfLife.currentSephirah}の道
                </p>
              </div>
              
              <div className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-xl p-8 border border-purple-500/20">
                <p className="text-lg text-white/90 leading-relaxed text-center">
                  {kabbalah.interpretation}
                </p>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-purple-300 text-2xl mb-2">☉</p>
                  <p className="text-white/70 text-sm">神性の光</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-blue-300 text-2xl mb-2">♃</p>
                  <p className="text-white/70 text-sm">慈悲の力</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-yellow-300 text-2xl mb-2">✡</p>
                  <p className="text-white/70 text-sm">均衡の印</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* ナビゲーション */}
          <div className="mt-10 flex justify-center gap-6">
            <Link 
              href="/divination/shichu-suimei"
              className="px-8 py-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all duration-300"
            >
              ← 四柱推命へ
            </Link>
            <Link 
              href="/divination/vedic"
              className="px-8 py-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all duration-300"
            >
              ヴェーダ占星術へ →
            </Link>
          </div>
          
        </div>
      </main>
    </div>
  );
}