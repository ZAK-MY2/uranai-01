'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { CosmicBackground } from '@/components/ui/cosmic-background';
import { mockDivinationData } from '@/lib/mock/divination-data';

const UserParameters = dynamic(
  () => import('@/components/divination/user-parameters').then(mod => ({ default: mod.UserParameters })),
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

// 天干地支の表示コンポーネント
const PillarDisplay = ({ 
  title, 
  heavenlyStem, 
  earthlyBranch, 
  element,
  description 
}: { 
  title: string;
  heavenlyStem: string;
  earthlyBranch: string;
  element: string;
  description: string;
}) => {
  const elementColors: { [key: string]: string } = {
    '木': 'from-green-400 to-green-600',
    '火': 'from-red-400 to-red-600',
    '土': 'from-yellow-400 to-yellow-600',
    '金': 'from-gray-300 to-gray-500',
    '水': 'from-blue-400 to-blue-600'
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
      <h3 className="text-lg font-light text-purple-300 mb-4">{title}</h3>
      <div className="flex justify-center items-center mb-4">
        <div className={`text-6xl font-bold bg-gradient-to-br ${elementColors[element]} bg-clip-text text-transparent`}>
          {heavenlyStem}{earthlyBranch}
        </div>
      </div>
      <div className="text-center">
        <p className="text-white/60 text-sm mb-2">五行: {element}性</p>
        <p className="text-white/80 text-xs">{description}</p>
      </div>
    </div>
  );
};

// 五行バランス表示
const FiveElementsBalance = ({ elements }: { elements: { [key: string]: number } }) => {
  const maxValue = Math.max(...Object.values(elements));
  const elementInfo = [
    { key: 'wood', name: '木', color: 'bg-green-500', description: '成長・発展' },
    { key: 'fire', name: '火', color: 'bg-red-500', description: '情熱・行動' },
    { key: 'earth', name: '土', color: 'bg-yellow-500', description: '安定・信頼' },
    { key: 'metal', name: '金', color: 'bg-gray-400', description: '正義・決断' },
    { key: 'water', name: '水', color: 'bg-blue-500', description: '知恵・柔軟' }
  ];

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
      <h3 className="text-xl font-light text-white mb-6">五行バランス</h3>
      <div className="space-y-4">
        {elementInfo.map(elem => (
          <div key={elem.key} className="flex items-center gap-4">
            <div className="w-12 text-white font-light">{elem.name}</div>
            <div className="flex-1 bg-white/10 rounded-full h-8 relative overflow-hidden">
              <div 
                className={`h-full ${elem.color} transition-all duration-1000 ease-out`}
                style={{ width: `${(elements[elem.key] / maxValue) * 100}%` }}
              />
              <span className="absolute inset-0 flex items-center justify-center text-white text-sm">
                {elements[elem.key]}
              </span>
            </div>
            <div className="text-white/60 text-xs w-20">{elem.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function ShichuSuimeiPage() {
  const [userInput, setUserInput] = useState<UserInputData | null>(null);
  const [shichuResult] = useState(mockDivinationData.shichuSuimei);
  const [, setShowAnimation] = useState(false);

  useEffect(() => {
    const storedData = localStorage.getItem('uranai_user_data');
    if (storedData) {
      try {
        const userData: UserInputData = JSON.parse(storedData);
        setUserInput(userData);
        // 実際の四柱推命計算をここで行う（現在はモックデータ）
        setShowAnimation(true);
      } catch (error) {
        console.error('ユーザーデータの読み込みエラー:', error);
      }
    }
  }, []);

  const { yearPillar, monthPillar, dayPillar, hourPillar, fiveElements, majorCycle, interpretation } = shichuResult;

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-slate-900 to-slate-800">
      <CosmicBackground />
      
      {/* ヘッダー */}
      <header className="relative z-20 bg-slate-900/50 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between">
          <Link href="/" className="text-white hover:text-blue-300 transition-colors">
            ← ダッシュボードに戻る
          </Link>
          <h1 className="text-2xl font-light text-white tracking-wider">四柱推命</h1>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-5 py-10">
        {/* ユーザーパラメータ表示 */}
        <UserParameters />

        {/* メインタイトル */}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-light text-white mb-4 tracking-wider">
            四柱推命
          </h2>
          <p className="text-xl text-purple-300 opacity-80">
            生年月日時から読み解く、あなたの宿命と運命
          </p>
        </div>

        {/* 四柱（命式）表示 */}
        <div className="mb-12">
          <h3 className="text-2xl font-light text-white text-center mb-8">あなたの命式</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <PillarDisplay
              title="年柱"
              heavenlyStem={yearPillar.heavenlyStem}
              earthlyBranch={yearPillar.earthlyBranch}
              element={yearPillar.element}
              description="祖先・社会運"
            />
            <PillarDisplay
              title="月柱"
              heavenlyStem={monthPillar.heavenlyStem}
              earthlyBranch={monthPillar.earthlyBranch}
              element={monthPillar.element}
              description="両親・仕事運"
            />
            <PillarDisplay
              title="日柱"
              heavenlyStem={dayPillar.heavenlyStem}
              earthlyBranch={dayPillar.earthlyBranch}
              element={dayPillar.element}
              description="自分自身・恋愛運"
            />
            <PillarDisplay
              title="時柱"
              heavenlyStem={hourPillar.heavenlyStem}
              earthlyBranch={hourPillar.earthlyBranch}
              element={hourPillar.element}
              description="子供・晩年運"
            />
          </div>
        </div>

        {/* 五行バランスと大運 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <FiveElementsBalance elements={fiveElements} />
          
          {/* 大運（現在の運勢の流れ） */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <h3 className="text-xl font-light text-white mb-6">大運（現在の運勢）</h3>
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl p-4">
                <p className="text-white/60 text-sm mb-2">期間</p>
                <p className="text-white text-xl">{majorCycle.period}</p>
              </div>
              <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl p-4">
                <p className="text-white/60 text-sm mb-2">五行</p>
                <p className="text-white text-xl">{majorCycle.element}の時期</p>
              </div>
              <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl p-4">
                <p className="text-white/60 text-sm mb-2">運勢</p>
                <p className="text-white text-xl">{majorCycle.fortune}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 総合解釈 */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 mb-12">
          <h3 className="text-2xl font-light text-white mb-6 text-center">総合解釈</h3>
          <p className="text-white/90 text-lg leading-relaxed mb-6">
            {interpretation}
          </p>
          
          {userInput && (
            <div className="mt-6 pt-6 border-t border-white/10">
              <h4 className="text-lg font-light text-purple-300 mb-3">
                「{userInput.questionCategory}」についてのアドバイス
              </h4>
              <p className="text-white/80 leading-relaxed">
                {userInput.question && `あなたの質問「${userInput.question}」について、`}
                命式から見ると、{dayPillar.element}性の日主を持つあなたは、
                {majorCycle.element}の大運期にあります。
                この時期は{majorCycle.fortune}であり、
                {userInput.questionCategory === '仕事・転職' && '新しいチャレンジに適した時期です。'}
                {userInput.questionCategory === '恋愛・結婚' && '人間関係において重要な転機を迎えています。'}
                {userInput.questionCategory === '金運・財運' && '財運の流れが変化する時期です。'}
                {userInput.questionCategory === '健康' && '心身のバランスを整えることが大切な時期です。'}
                {userInput.questionCategory === '総合運' && '全体的に安定した運気の流れにあります。'}
              </p>
            </div>
          )}
        </div>

        {/* 他の占術への導線 */}
        <div className="text-center">
          <p className="text-white/60 mb-4">さらに詳しく知りたい方は</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link 
              href="/divination/numerology"
              className="px-6 py-3 bg-purple-600/20 border border-purple-500/50 rounded-lg text-purple-300 hover:bg-purple-600/30 transition-all"
            >
              数秘術で見る
            </Link>
            <Link 
              href="/divination/nine-star-ki"
              className="px-6 py-3 bg-blue-600/20 border border-blue-500/50 rounded-lg text-blue-300 hover:bg-blue-600/30 transition-all"
            >
              九星気学で見る
            </Link>
            <Link 
              href="/divination/integrated"
              className="px-6 py-3 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-white/30 rounded-lg text-white hover:from-purple-600/30 hover:to-blue-600/30 transition-all"
            >
              統合占術で見る
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}