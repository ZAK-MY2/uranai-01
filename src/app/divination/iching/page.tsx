'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { CosmicBackground } from '@/components/ui/cosmic-background';
import { mockDivinationData } from '@/lib/mock/divination-data';

const UserParameters = dynamic(
  () => import('@/components/divination/user-parameters').then(mod => mod.UserParameters),
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

// 八卦のシンボル
const Trigram = ({ lines }: { lines: boolean[] }) => {
  return (
    <div className="space-y-1">
      {lines.map((solid, index) => (
        <div key={index} className="h-2 flex justify-center">
          {solid ? (
            <div className="w-16 h-full bg-white"></div>
          ) : (
            <div className="w-16 h-full flex gap-2">
              <div className="flex-1 bg-white"></div>
              <div className="flex-1 bg-white"></div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default function IChingPage() {
  const [userInput, setUserInput] = useState<UserInputData | null>(null);
  const [iChingResult, setIChingResult] = useState(mockDivinationData.iChing);
  const [showChanging, setShowChanging] = useState(false);

  useEffect(() => {
    const storedData = localStorage.getItem('uranai_user_data');
    if (storedData) {
      try {
        const userData: UserInputData = JSON.parse(storedData);
        setUserInput(userData);
        const calculatedResult = calculateIChing(userData);
        setIChingResult(calculatedResult);
      } catch (error) {
        console.error('ユーザーデータの読み込みエラー:', error);
      }
    }
  }, []);

  function calculateIChing(userData: UserInputData) {
    const birthDate = new Date(userData.birthDate);
    const hexagrams = [
      { number: 1, name: '乾為天', upperTrigram: '乾（天）', lowerTrigram: '乾（天）', judgment: '元いに亨る。貞に利し。', image: '天行健なり。君子以って自彊して息まず。' },
      { number: 14, name: '火天大有', upperTrigram: '離（火）', lowerTrigram: '乾（天）', judgment: '大いなる所有。元いに亨る。', image: '火の天上に在るは大有なり。' },
      { number: 11, name: '地天泰', upperTrigram: '坤（地）', lowerTrigram: '乾（天）', judgment: '小往き大来る、吉にして亨る。', image: '天地交わるは泰。' },
      { number: 6, name: '天水訟', upperTrigram: '乾（天）', lowerTrigram: '坎（水）', judgment: '孚有れども塞がる。', image: '天と水と違い行くは訟。' },
      { number: 26, name: '山天大畜', upperTrigram: '艮（山）', lowerTrigram: '乾（天）', judgment: '貞に利し。', image: '天の山中に在るは大畜なり。' }
    ];
    const seed = birthDate.getTime() + userData.fullName.length;
    const hexagramIndex = seed % hexagrams.length;
    const selectedHexagram = hexagrams[hexagramIndex];

    return {
      ...mockDivinationData.iChing,
      hexagram: selectedHexagram,
      changingLines: [3, 5], // 生年月日から計算
      interpretation: `${userData.questionCategory}に関する質問「${userData.question}」について、第${selectedHexagram.number}卦「${selectedHexagram.name}」が示されました。この卦は${selectedHexagram.upperTrigram}と${selectedHexagram.lowerTrigram}の組み合わせで、変化と調和の時期を表しています。`
    };
  }

  const { iChing } = { iChing: iChingResult };

  // 八卦の対応表
  const trigramMeanings: { [key: string]: { element: string, nature: string, direction: string } } = {
    '乾（天）': { element: '天', nature: '創造', direction: '北西' },
    '離（火）': { element: '火', nature: '明晰', direction: '南' },
    '兌（沢）': { element: '沢', nature: '喜悦', direction: '西' },
    '震（雷）': { element: '雷', nature: '動揺', direction: '東' },
    '巽（風）': { element: '風', nature: '浸透', direction: '東南' },
    '坎（水）': { element: '水', nature: '険難', direction: '北' },
    '艮（山）': { element: '山', nature: '静止', direction: '北東' },
    '坤（地）': { element: '地', nature: '受容', direction: '南西' }
  };

  // 六十四卦のパターン（例として火天大有）
  const hexagramLines = [true, false, true, true, true, true]; // 下から上へ

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-slate-900 to-slate-800">
      <CosmicBackground />
      
      {/* ヘッダー */}
      <header className="relative z-20 bg-slate-900/50 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between">
          <Link href="/" className="text-white hover:text-blue-300 transition-colors">
            ← ダッシュボードに戻る
          </Link>
          <h1 className="text-2xl font-light text-white">易経詳細分析</h1>
          <div className="w-32"></div>
        </div>
      </header>

      <main className="relative z-10 pt-10 pb-20">
        <div className="max-w-7xl mx-auto px-5">
          <UserParameters />
          
          {/* 六十四卦の表示 */}
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-10 mb-10 border border-white/10">
            <h2 className="text-3xl font-light text-white text-center mb-10">
              第{iChing.hexagram.number}卦 {iChing.hexagram.name}
            </h2>
            
            {/* 卦象 */}
            <div className="flex justify-center mb-10">
              <div className="bg-white/5 rounded-xl p-8 border border-white/20">
                <div className="mb-6">
                  <p className="text-white/60 text-center mb-2">上卦</p>
                  <Trigram lines={hexagramLines.slice(3, 6).reverse()} />
                </div>
                <div className="w-20 h-px bg-white/20 mx-auto my-4"></div>
                <div>
                  <Trigram lines={hexagramLines.slice(0, 3).reverse()} />
                  <p className="text-white/60 text-center mt-2">下卦</p>
                </div>
              </div>
            </div>

            {/* 卦の構成 */}
            <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto">
              <div className="bg-white/5 rounded-xl p-6 text-center">
                <p className="text-white/50 text-sm mb-2">上卦</p>
                <p className="text-2xl text-white mb-2">{iChing.hexagram.upperTrigram}</p>
                <p className="text-white/60">
                  {trigramMeanings[iChing.hexagram.upperTrigram]?.element} - 
                  {trigramMeanings[iChing.hexagram.upperTrigram]?.nature}
                </p>
              </div>
              <div className="bg-white/5 rounded-xl p-6 text-center">
                <p className="text-white/50 text-sm mb-2">下卦</p>
                <p className="text-2xl text-white mb-2">{iChing.hexagram.lowerTrigram}</p>
                <p className="text-white/60">
                  {trigramMeanings[iChing.hexagram.lowerTrigram]?.element} - 
                  {trigramMeanings[iChing.hexagram.lowerTrigram]?.nature}
                </p>
              </div>
            </div>
          </div>

          {/* 陰陽の動き（インフォグラフィック） */}
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-10 mb-10 border border-white/10">
            <h3 className="text-2xl font-light text-white text-center mb-8">陰陽の変化</h3>
            
            <div className="relative max-w-4xl mx-auto">
              <svg viewBox="0 0 800 400" className="w-full h-auto">
                {/* 太極図 */}
                <g transform="translate(400, 200)">
                  <circle r="150" fill="white" />
                  <path d="M 0,-150 A 75,75 0 0,1 0,0 A 75,75 0 0,0 0,150 A 150,150 0 0,0 0,-150" fill="black" />
                  <circle cx="0" cy="-75" r="25" fill="white" />
                  <circle cx="0" cy="75" r="25" fill="black" />
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0"
                    to="360"
                    dur="60s"
                    repeatCount="indefinite"
                  />
                </g>
                
                {/* 変爻の表示 */}
                {iChing.changingLines.map((line, index) => {
                  const angle = (index * 120 - 90) * Math.PI / 180;
                  const x = 400 + 280 * Math.cos(angle);
                  const y = 200 + 280 * Math.sin(angle);
                  
                  return (
                    <g key={index}>
                      <circle cx={x} cy={y} r="35" fill="rgba(251,191,36,0.2)" stroke="rgba(251,191,36,0.6)" strokeWidth="2" />
                      <text x={x} y={y - 5} textAnchor="middle" className="fill-white text-sm font-light">
                        第{line}爻
                      </text>
                      <text x={x} y={y + 10} textAnchor="middle" className="fill-yellow-300 text-xs">
                        変化
                      </text>
                    </g>
                  );
                })}
                
                {/* 説明文 */}
                <text x="100" y="50" className="fill-white/60 text-sm">陽が極まれば陰となり</text>
                <text x="500" y="350" className="fill-white/60 text-sm">陰が極まれば陽となる</text>
              </svg>
            </div>
          </div>

          {/* 卦辞と爻辞 */}
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-10 mb-10 border border-white/10">
            <h3 className="text-2xl font-light text-white text-center mb-8">古代の智慧</h3>
            
            <div className="space-y-6 max-w-3xl mx-auto">
              <div className="bg-white/5 rounded-xl p-6">
                <h4 className="text-xl font-light text-white mb-3">卦辞（判断辞）</h4>
                <p className="text-lg text-white/80 mb-2 font-mono">
                  火天大有。元亨。（原文）
                </p>
                <p className="text-lg text-white/90 mb-2">
                  大有、元いに亨る。
                </p>
                <p className="text-white/60 text-sm italic leading-relaxed">
                  【意味】大いなる所有の時。根源的に通じて正しい道を得る。<br/>
                  天の下にあるものすべてが火（太陽）の恵みにより豊かに実る時期。
                  しかし、盛者必衰を心に留め、謙虚さを忘れてはならない。
                </p>
              </div>
              
              <div className="bg-white/5 rounded-xl p-6">
                <h4 className="text-xl font-light text-white mb-3">象辞（大象伝）</h4>
                <p className="text-lg text-white/80 mb-2 font-mono">
                  火在天上、大有。君子以遏惡揚善順天休命。（原文）
                </p>
                <p className="text-lg text-white/90 mb-2">
                  火、天の上に在り、大有なり。君子以て悪を遏め善を揚げ、天に順ひて命を休む。
                </p>
                <p className="text-white/60 text-sm italic leading-relaxed">
                  【意味】火が天の上にあるのが大有の形。君子はこれに法って悪を抑え善を広める。<br/>
                  太陽が中天に輝く光景が大有の象。人々を指導する立場にある者は、
                  この豊かな時期だからこそ、悪しき風潮を抑制し、善なるものを推進する責任がある。
                </p>
              </div>
              
              {/* 詳細な爻の説明 */}
              <div className="bg-white/5 rounded-xl p-6">
                <h4 className="text-xl font-light text-white mb-3">六爻の詳細</h4>
                <div className="space-y-4">
                  <div className="border-l-4 border-yellow-500 pl-4">
                    <p className="text-yellow-300 font-semibold">上九爻（第6爻）</p>
                    <p className="text-white/80">自天佑之吉无不利。天よりこれを佑け、吉にして利あらざることなし。</p>
                    <p className="text-white/60 text-sm mt-1">天の加護を受ける時。全てが順調に進む。</p>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-4">
                    <p className="text-blue-300 font-semibold">九五爻（第5爻）</p>
                    <p className="text-white/80">厥孚交如威如吉。その孚、交如威如なれば吉。</p>
                    <p className="text-white/60 text-sm mt-1">誠実さと威厳を兼ね備えた指導者の姿。</p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4">
                    <p className="text-green-300 font-semibold">九四爻（第4爻）</p>
                    <p className="text-white/80">匪其彭无咎。その彭に匪ざれば咎なし。</p>
                    <p className="text-white/60 text-sm mt-1">驕慢にならず、謙虚さを保てば問題なし。</p>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-4">
                    <p className="text-purple-300 font-semibold">九三爻（第3爻）</p>
                    <p className="text-white/80">公用亨于天子小人弗克。公、天子に亨献す。小人は克たず。</p>
                    <p className="text-white/60 text-sm mt-1">公明正大な心で上位者に仕える時。小人には不可能。</p>
                  </div>
                  <div className="border-l-4 border-pink-500 pl-4">
                    <p className="text-pink-300 font-semibold">九二爻（第2爻）</p>
                    <p className="text-white/80">大車以載有攸往无咎。大車以て載す。往く攸あり、咎なし。</p>
                    <p className="text-white/60 text-sm mt-1">大きな器量で重責を担える。進んで良し。</p>
                  </div>
                  <div className="border-l-4 border-orange-500 pl-4">
                    <p className="text-orange-300 font-semibold">初九爻（第1爻）</p>
                    <p className="text-white/80">无交害匪咎艱則无咎。交害なし。咎に匪ず、艱なれば則ち咎なし。</p>
                    <p className="text-white/60 text-sm mt-1">慎重に行動すれば災いを避けられる。</p>
                  </div>
                </div>
              </div>
              
              {showChanging && (
                <div className="bg-yellow-500/10 rounded-xl p-6 border border-yellow-500/20">
                  <h4 className="text-xl font-light text-yellow-300 mb-3">変爻</h4>
                  <div className="space-y-3">
                    {iChing.changingLines.map((line) => (
                      <p key={line} className="text-white/80">
                        第{line}爻：変化の兆しあり。慎重に行動すべし。
                      </p>
                    ))}
                  </div>
                </div>
              )}
              
              <button
                onClick={() => setShowChanging(!showChanging)}
                className="w-full py-3 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-colors"
              >
                {showChanging ? '変爻を隠す' : '変爻を表示'}
              </button>
            </div>
          </div>

          {/* 五行との関係 */}
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-10 mb-10 border border-white/10">
            <h3 className="text-2xl font-light text-white text-center mb-8">五行の相生相剋</h3>
            
            <div className="relative w-96 h-96 mx-auto">
              <svg viewBox="0 0 400 400" className="w-full h-full">
                {/* 五行の配置 */}
                {[
                  { element: '火', color: '#ef4444', x: 200, y: 50 },
                  { element: '土', color: '#eab308', x: 350, y: 150 },
                  { element: '金', color: '#e5e7eb', x: 300, y: 320 },
                  { element: '水', color: '#3b82f6', x: 100, y: 320 },
                  { element: '木', color: '#10b981', x: 50, y: 150 }
                ].map((item, index) => (
                  <g key={item.element}>
                    <circle cx={item.x} cy={item.y} r="40" fill={`${item.color}33`} stroke={item.color} strokeWidth="2" />
                    <text x={item.x} y={item.y + 5} textAnchor="middle" className="fill-white text-xl">
                      {item.element}
                    </text>
                  </g>
                ))}
                
                {/* 相生の矢印（実線） */}
                <g stroke="rgba(255,255,255,0.3)" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)">
                  <path d="M 200,90 Q 275,120 350,150" />
                  <path d="M 350,190 Q 325,255 300,280" />
                  <path d="M 260,320 Q 180,320 140,320" />
                  <path d="M 100,280 Q 75,215 50,190" />
                  <path d="M 50,150 Q 125,100 200,90" />
                </g>
                
                <defs>
                  <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="rgba(255,255,255,0.3)" />
                  </marker>
                </defs>
              </svg>
            </div>
            
            <p className="text-center text-white/60 mt-4">
              火天大有：火の要素が強く、成長と繁栄のエネルギー
            </p>
          </div>

          {/* 総合的な解釈 */}
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-10 border border-white/10">
            <h3 className="text-2xl font-light text-white text-center mb-8">周易からのメッセージ</h3>
            
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-xl p-8 border border-yellow-500/20">
                <p className="text-lg text-white/90 leading-relaxed text-center">
                  {iChing.interpretation}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white/5 rounded-lg p-6 text-center">
                  <p className="text-3xl mb-2">☰</p>
                  <p className="text-white/70">乾為天</p>
                  <p className="text-white/50 text-sm mt-2">強健なる創造力</p>
                </div>
                <div className="bg-white/5 rounded-lg p-6 text-center">
                  <p className="text-3xl mb-2">☲</p>
                  <p className="text-white/70">離為火</p>
                  <p className="text-white/50 text-sm mt-2">明晰なる洞察力</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* ナビゲーション */}
          <div className="mt-10 flex justify-center gap-6">
            <Link 
              href="/divination/runes"
              className="px-8 py-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all duration-300"
            >
              ← ルーン占いへ
            </Link>
            <Link 
              href="/divination/nine-star-ki"
              className="px-8 py-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all duration-300"
            >
              九星気学へ →
            </Link>
          </div>
          
        </div>
      </main>
    </div>
  );
}