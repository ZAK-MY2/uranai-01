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
        <ParameterBadge />

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

        {/* 日主分析 */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 mb-12">
          <h3 className="text-2xl font-light text-white mb-6 text-center">日主分析</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                <span className="text-3xl font-bold text-white">{dayPillar.heavenlyStem}{dayPillar.earthlyBranch}</span>
              </div>
              <p className="text-white/60 mb-2">日主</p>
              <p className="text-xl text-white">{dayPillar.element}性</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                <span className="text-3xl">💚</span>
              </div>
              <p className="text-white/60 mb-2">喜神</p>
              <p className="text-xl text-green-300">木・火</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center">
                <span className="text-3xl">⚠️</span>
              </div>
              <p className="text-white/60 mb-2">忌神</p>
              <p className="text-xl text-red-300">金・水</p>
            </div>
          </div>
          
          <div className="mt-8 bg-white/5 rounded-xl p-6">
            <h4 className="text-lg text-white mb-3">日主の強弱判定</h4>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1 bg-white/10 rounded-full h-4 relative overflow-hidden">
                <div className="absolute inset-y-0 left-0 w-3/5 bg-gradient-to-r from-blue-500 to-purple-500"></div>
              </div>
              <span className="text-white">やや強い</span>
            </div>
            <p className="text-white/70 text-sm">
              日主が強い場合、抑制する五行（金・水）を活用することでバランスが取れ、
              運気が安定します。喜神を過度に強めすぎないよう注意が必要です。
            </p>
          </div>
        </div>

        {/* 詳細な性格・運勢分析 */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 mb-12">
          <h3 className="text-2xl font-light text-white mb-6 text-center">詳細分析</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-xl p-6 border border-pink-500/20">
              <h4 className="text-lg font-medium text-pink-300 mb-3">🌸 性格分析</h4>
              <p className="text-white/80 text-sm leading-relaxed">
                {dayPillar.element}性の日主を持つあなたは、
                {dayPillar.element === '金' && '正義感が強く、決断力に優れた性格です。物事を白黒はっきりさせたがる傾向があり、曖昧な状況を好みません。'}
                {dayPillar.element === '木' && '成長志向が強く、向上心に満ちた性格です。新しいことへのチャレンジを恐れず、常に前進しようとします。'}
                {dayPillar.element === '水' && '柔軟性に富み、知的好奇心が旺盛な性格です。状況に応じて臨機応変に対応でき、人の心を読む力があります。'}
                {dayPillar.element === '火' && '情熱的で行動力があり、リーダーシップを発揮する性格です。直感を大切にし、即座に行動に移す傾向があります。'}
                {dayPillar.element === '土' && '安定志向で信頼感があり、周囲から頼られる性格です。慎重に物事を進め、確実性を重視します。'}
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-6 border border-blue-500/20">
              <h4 className="text-lg font-medium text-blue-300 mb-3">💼 キャリア分析</h4>
              <p className="text-white/80 text-sm leading-relaxed">
                命式から見たあなたの適職は、
                {yearPillar.element}と{monthPillar.element}の組み合わせから、
                創造性と実務能力の両方を活かせる分野です。
                特に、人と関わる仕事や、専門性を活かせる職種で力を発揮できるでしょう。
                {majorCycle.period}の大運期は、キャリアアップのチャンスです。
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-6 border border-green-500/20">
              <h4 className="text-lg font-medium text-green-300 mb-3">💑 恋愛・結婚運</h4>
              <p className="text-white/80 text-sm leading-relaxed">
                日支と月支の関係から、あなたの恋愛傾向は
                {hourPillar.element === '水' || hourPillar.element === '木' ? '感情豊かで相手を大切にするタイプ' : '理性的で安定した関係を求めるタイプ'}です。
                パートナーとは{yearPillar.element}の要素を持つ人との相性が良く、
                お互いを高め合える関係を築けるでしょう。
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-xl p-6 border border-yellow-500/20">
              <h4 className="text-lg font-medium text-yellow-300 mb-3">💰 財運分析</h4>
              <p className="text-white/80 text-sm leading-relaxed">
                命式の財星から見ると、あなたの財運は
                {majorCycle.fortune === '吉' ? '上昇傾向にあり、積極的な投資や事業展開に適した時期' : '堅実な蓄財を心がけるべき時期'}です。
                特に{monthPillar.element}の五行を活用した分野での
                収入増加が期待できます。浪費に注意し、計画的な資産形成を。
              </p>
            </div>
          </div>
        </div>

        {/* 10年運（大運）の詳細 */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 mb-12">
          <h3 className="text-2xl font-light text-white mb-6 text-center">10年運の流れ</h3>
          
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 p-4 rounded-lg border border-purple-500/20">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white font-medium">現在の大運：{majorCycle.period}</span>
                <span className="text-purple-300">{majorCycle.element}運</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full" style={{width: '30%'}}></div>
              </div>
              <p className="text-white/70 text-sm mt-2">
                この期間は{majorCycle.fortune}となり、特に{majorCycle.element}の五行を意識した行動が吉となります。
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-white/5 rounded-lg p-4 text-center">
                <p className="text-white/60 text-sm">前の大運</p>
                <p className="text-white">2014-2024</p>
                <p className="text-white/70 text-sm">火運期</p>
              </div>
              <div className="bg-purple-500/20 rounded-lg p-4 text-center border border-purple-500/40">
                <p className="text-white/60 text-sm">現在の大運</p>
                <p className="text-white font-bold">{majorCycle.period}</p>
                <p className="text-purple-300 text-sm">{majorCycle.element}運期</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 text-center">
                <p className="text-white/60 text-sm">次の大運</p>
                <p className="text-white">2034-2044</p>
                <p className="text-white/70 text-sm">木運期</p>
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