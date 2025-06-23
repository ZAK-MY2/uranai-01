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

// 八卦図コンポーネント
const BaguaMap = ({ selectedArea, onSelectArea }: { selectedArea: string, onSelectArea: (area: string) => void }) => {
  const areas = [
    { id: 'career', name: '事業', position: 'bottom', trigram: '☵' },
    { id: 'knowledge', name: '知識', position: 'bottom-left', trigram: '☶' },
    { id: 'family', name: '家族', position: 'left', trigram: '☳' },
    { id: 'wealth', name: '財運', position: 'top-left', trigram: '☴' },
    { id: 'fame', name: '名声', position: 'top', trigram: '☲' },
    { id: 'love', name: '恋愛', position: 'top-right', trigram: '☷' },
    { id: 'creativity', name: '創造', position: 'right', trigram: '☱' },
    { id: 'helpful', name: '援助', position: 'bottom-right', trigram: '☰' },
    { id: 'health', name: '健康', position: 'center', trigram: '☯' }
  ];

  const positions: { [key: string]: { x: number, y: number } } = {
    'bottom': { x: 150, y: 250 },
    'bottom-left': { x: 75, y: 225 },
    'left': { x: 50, y: 150 },
    'top-left': { x: 75, y: 75 },
    'top': { x: 150, y: 50 },
    'top-right': { x: 225, y: 75 },
    'right': { x: 250, y: 150 },
    'bottom-right': { x: 225, y: 225 },
    'center': { x: 150, y: 150 }
  };

  return (
    <svg viewBox="0 0 300 300" className="w-full h-full max-w-md mx-auto">
      {/* 八角形の背景 */}
      <polygon
        points="150,30 230,70 270,150 230,230 150,270 70,230 30,150 70,70"
        fill="none"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="2"
      />
      
      {/* 各エリア */}
      {areas.map((area) => {
        const pos = positions[area.position];
        const isSelected = selectedArea === area.id;
        
        return (
          <g key={area.id} 
            className={`cursor-pointer ${isSelected ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
            onClick={() => onSelectArea(area.id)}
          >
            <circle
              cx={pos.x}
              cy={pos.y}
              r="35"
              fill={isSelected ? 'rgba(147,51,234,0.3)' : 'rgba(255,255,255,0.1)'}
              stroke={isSelected ? '#9333ea' : 'rgba(255,255,255,0.3)'}
              strokeWidth="2"
            />
            <text x={pos.x} y={pos.y - 5} textAnchor="middle" className="fill-white text-2xl">
              {area.trigram}
            </text>
            <text x={pos.x} y={pos.y + 15} textAnchor="middle" className="fill-white text-xs">
              {area.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

export default function FengShuiPage() {
  const [userInput, setUserInput] = useState<UserInputData | null>(null);
  const [fengShui, setFengShui] = useState(mockDivinationData.fengShui);
  const [selectedArea, setSelectedArea] = useState<string>('wealth');

  useEffect(() => {
    // LocalStorageからユーザーデータを読み込み
    const storedData = localStorage.getItem('uranai_user_data');
    if (storedData) {
      try {
        const userData: UserInputData = JSON.parse(storedData);
        setUserInput(userData);
        
        // 実際の風水計算を実行
        const calculatedResult = calculateFengShui(userData);
        setFengShui(calculatedResult);
      } catch (error) {
        console.error('ユーザーデータの読み込みエラー:', error);
      }
    }
  }, []);

  // 風水の計算関数
  function calculateFengShui(userData: UserInputData) {
    const birthDate = new Date(userData.birthDate);
    const year = birthDate.getFullYear();
    const month = birthDate.getMonth() + 1;
    const day = birthDate.getDate();
    
    // 五行属性を計算
    const element = calculateWuXingElement(year);
    
    // フライングスターの配置を計算
    const flyingStars = calculateFlyingStars(year);
    
    // バグアのエリア別属性を計算
    const bagua = calculateBaguaAreas(userData.fullName, element);
    
    return {
      ...mockDivinationData.fengShui,
      element,
      flyingStars,
      bagua,
      advice: generateFengShuiAdvice(userData.question, element, userData.questionCategory)
    };
  }

  function calculateWuXingElement(year: number): string {
    const elements = ['木', '火', '土', '金', '水'];
    const elementIndex = (year % 10) % 5;
    return elements[elementIndex];
  }

  function calculateFlyingStars(year: number) {
    // 2024年ベースのフライングスター計算
    const baseYear = 2024;
    const yearDiff = year - baseYear;
    
    return {
      prosperity: ((8 + yearDiff) % 9) + 1, // 財運星
      relationship: ((4 + yearDiff) % 9) + 1, // 人間関係星
      career: ((1 + yearDiff) % 9) + 1 // 仕事運星
    };
  }

  function calculateBaguaAreas(fullName: string, element: string) {
    // 名前と五行に基づいてバグアエリアを計算
    const nameValue = fullName.length * 7; // 簡単なハッシュ
    
    const baseElements = {
      '木': { element: '木', color: '緑', enhancement: '観葉植物' },
      '火': { element: '火', color: '赤', enhancement: 'キャンドル' },
      '土': { element: '土', color: '黄', enhancement: '水晶' },
      '金': { element: '金', color: '白', enhancement: '金属製品' },
      '水': { element: '水', color: '青', enhancement: '水槽' }
    };
    
    const base = baseElements[element as keyof typeof baseElements] || baseElements['土'];
    
    return {
      career: { ...base, enhancement: '置物と水' },
      wealth: { ...base, enhancement: '植物と紫水晶' },
      fame: { ...base, enhancement: '赤いアイテム' },
      love: { ...base, enhancement: 'ペアの装飾品' },
      health: { ...base, enhancement: '竹や緑の植物' }
    };
  }

  function generateFengShuiAdvice(question: string, element: string, category: string): string {
    const elementAdvice = {
      '木': '成長と新しい始まりのエネルギーが強い時期',
      '火': '情熱とエネルギーに満ちた行動力の時期',
      '土': '安定と基盤を固める重要な時期',
      '金': '結実と收穫、富を築く時期',
      '水': '柔軟性と流れを意識する時期'
    };
    
    return `「${question}」に関して、あなたの五行属性「${element}」から、${elementAdvice[element as keyof typeof elementAdvice]}であることが読み取れます。気の流れを整え、特に${category}に関するエリアを活性化させることで、願いの実現に近づくでしょう。`;
  }

  const areaDetails = {
    career: fengShui.bagua.career,
    wealth: fengShui.bagua.wealth,
    fame: fengShui.bagua.fame,
    love: fengShui.bagua.love,
    health: fengShui.bagua.health,
    knowledge: { element: '土', color: '青', enhancement: '書籍や学習道具' },
    family: { element: '木', color: '緑', enhancement: '家族写真' },
    creativity: { element: '金', color: '白', enhancement: '芸術作品' },
    helpful: { element: '金', color: '灰', enhancement: '旅行の写真' }
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
          <h1 className="text-2xl font-light text-white">風水詳細分析</h1>
          <div className="w-32"></div>
        </div>
      </header>

      <main className="relative z-10 pt-10 pb-20">
        <div className="max-w-7xl mx-auto px-5">
          <UserParameters />
          
          {/* 八卦マップ */}
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-10 mb-10 border border-white/10">
            <h2 className="text-3xl font-light text-white text-center mb-10">あなたの風水バグアマップ</h2>
            
            <BaguaMap selectedArea={selectedArea} onSelectArea={setSelectedArea} />
            
            {/* 選択エリアの詳細 */}
            <div className="mt-10 bg-white/5 rounded-xl p-6 max-w-2xl mx-auto">
              <h3 className="text-xl font-light text-white text-center mb-4">
                {selectedArea === 'career' ? '事業運' :
                 selectedArea === 'wealth' ? '財運' :
                 selectedArea === 'fame' ? '名声運' :
                 selectedArea === 'love' ? '恋愛運' :
                 selectedArea === 'health' ? '健康運' :
                 selectedArea === 'knowledge' ? '知識運' :
                 selectedArea === 'family' ? '家族運' :
                 selectedArea === 'creativity' ? '創造運' :
                 '援助運'}のエリア
              </h3>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-white/50 text-sm mb-2">五行</p>
                  <p className="text-white text-lg">{areaDetails[selectedArea as keyof typeof areaDetails].element}</p>
                </div>
                <div>
                  <p className="text-white/50 text-sm mb-2">ラッキーカラー</p>
                  <p className="text-white text-lg">{areaDetails[selectedArea as keyof typeof areaDetails].color}</p>
                </div>
                <div>
                  <p className="text-white/50 text-sm mb-2">開運アイテム</p>
                  <p className="text-white text-lg">{areaDetails[selectedArea as keyof typeof areaDetails].enhancement}</p>
                </div>
              </div>
            </div>
          </div>

          {/* フライングスター（玄空飛星） */}
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-10 mb-10 border border-white/10">
            <h3 className="text-2xl font-light text-white text-center mb-8">フライングスター配置</h3>
            
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-8">
              {[
                [4, 9, 2],
                [3, 5, 7],
                [8, 1, 6]
              ].map((row, rowIndex) => 
                row.map((star, colIndex) => {
                  const isProsperity = star === fengShui.flyingStars.prosperity;
                  const isRelationship = star === fengShui.flyingStars.relationship;
                  const isCareer = star === fengShui.flyingStars.career;
                  
                  return (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className={`aspect-square bg-white/5 rounded-lg border ${
                        isProsperity ? 'border-yellow-400 bg-yellow-500/20' :
                        isRelationship ? 'border-pink-400 bg-pink-500/20' :
                        isCareer ? 'border-blue-400 bg-blue-500/20' :
                        'border-white/20'
                      } flex flex-col items-center justify-center`}
                    >
                      <p className="text-3xl font-bold text-white">{star}</p>
                      <p className="text-xs text-white/70 mt-1">
                        {isProsperity ? '財運' :
                         isRelationship ? '人間関係' :
                         isCareer ? '仕事運' : ''}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
            
            <div className="text-center text-white/60">
              <p>※ 2024年の年運飛星配置</p>
              <p className="text-sm mt-2">8番星（財運）が北西に位置し、金運上昇の年</p>
            </div>
          </div>

          {/* 五行の相生相剋（インフォグラフィック） */}
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-10 mb-10 border border-white/10">
            <h3 className="text-2xl font-light text-white text-center mb-8">五行のエネルギーフロー</h3>
            
            <div className="relative w-96 h-96 mx-auto">
              <svg viewBox="0 0 400 400" className="w-full h-full">
                {/* 五行の配置 */}
                {[
                  { element: '木', color: '#10b981', x: 200, y: 50, enhancement: '観葉植物・竹' },
                  { element: '火', color: '#ef4444', x: 350, y: 150, enhancement: '照明・キャンドル' },
                  { element: '土', color: '#eab308', x: 300, y: 320, enhancement: '陶器・水晶' },
                  { element: '金', color: '#e5e7eb', x: 100, y: 320, enhancement: '金属製品・鈴' },
                  { element: '水', color: '#3b82f6', x: 50, y: 150, enhancement: '水槽・噴水' }
                ].map((item) => (
                  <g key={item.element}>
                    <circle cx={item.x} cy={item.y} r="50" 
                      fill={`${item.color}33`} 
                      stroke={item.color} 
                      strokeWidth="2" />
                    <text x={item.x} y={item.y - 5} textAnchor="middle" className="fill-white text-xl font-bold">
                      {item.element}
                    </text>
                    <text x={item.x} y={item.y + 15} textAnchor="middle" className="fill-white/60 text-xs">
                      {item.enhancement}
                    </text>
                  </g>
                ))}
                
                {/* 相生の矢印 */}
                <g stroke="rgba(255,255,255,0.3)" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)">
                  <path d="M 200,100 Q 275,125 300,200" /> {/* 木→火 */}
                  <path d="M 320,190 Q 310,255 280,280" /> {/* 火→土 */}
                  <path d="M 250,320 Q 175,320 150,320" /> {/* 土→金 */}
                  <path d="M 100,280 Q 75,215 50,200" /> {/* 金→水 */}
                  <path d="M 50,150 Q 125,100 180,80" /> {/* 水→木 */}
                </g>
                
                <defs>
                  <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="rgba(255,255,255,0.3)" />
                  </marker>
                </defs>
              </svg>
            </div>
          </div>

          {/* 風水改善提案 */}
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-10 mb-10 border border-white/10">
            <h3 className="text-2xl font-light text-white text-center mb-8">あなたへの風水改善提案</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-xl p-6 border border-yellow-500/20">
                <h4 className="text-xl font-light text-yellow-300 mb-3">◐ 財運アップ</h4>
                <p className="text-white/80 mb-3">{fengShui.advice}</p>
                <ul className="space-y-2 text-white/70 text-sm">
                  <li>• 玄関を常に清潔に保つ</li>
                  <li>• 財位（南東）に観葉植物を置く</li>
                  <li>• 水晶やシトリンを飾る</li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-r from-pink-500/10 to-rose-500/10 rounded-xl p-6 border border-pink-500/20">
                <h4 className="text-xl font-light text-pink-300 mb-3">✦ 恋愛運アップ</h4>
                <p className="text-white/80 mb-3">南西エリアを活性化して良縁を引き寄せる</p>
                <ul className="space-y-2 text-white/70 text-sm">
                  <li>• ペアの装飾品を飾る</li>
                  <li>• ピンクや赤の小物を配置</li>
                  <li>• 花（特に牡丹や薔薇）を飾る</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 総合的な風水診断 */}
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-10 border border-white/10">
            <h3 className="text-2xl font-light text-white text-center mb-8">風水からの開運メッセージ</h3>
            
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="text-center mb-8">
                <p className="text-3xl font-light text-white mb-4">
                  調和とバランスが鍵
                </p>
              </div>
              
              <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl p-8 border border-purple-500/20">
                <p className="text-lg text-white/90 leading-relaxed text-center">
                  あなたの空間には豊かな可能性が秘められています。
                  特に財運の星（8番）が巡ってきており、北東エリアの活性化が重要です。
                  五行のバランスを整え、気の流れを良くすることで、
                  全体運が大きく向上するでしょう。
                  小さな改善から始めて、徐々に理想の空間を作り上げてください。
                </p>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-yellow-300 text-2xl mb-2">☰</p>
                  <p className="text-white/70 text-sm">天の気</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-green-300 text-2xl mb-2">☷</p>
                  <p className="text-white/70 text-sm">地の気</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-blue-300 text-2xl mb-2">☯</p>
                  <p className="text-white/70 text-sm">人の気</p>
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
              href="/divination/kabbalah"
              className="px-8 py-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all duration-300"
            >
              カバラ数秘術へ →
            </Link>
          </div>
          
        </div>
      </main>
    </div>
  );
}