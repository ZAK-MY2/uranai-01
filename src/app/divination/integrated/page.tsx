'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Brain, Heart, Compass, Layers, Infinity, Star, Moon, Sun, Eye, Zap, Flower } from 'lucide-react';
import { DivinationPageTemplate } from '@/components/divination/divination-page-template';
import { EnvironmentDisplay } from '@/components/environment/environment-display';
import { DivinationInput } from '@/lib/divination/base-engine';
import { useEnvironmentData } from '@/hooks/use-environment-data';

// デフォルトユーザー入力データ
const defaultUserInput: DivinationInput = {
  fullName: '山田太郎',
  birthDate: new Date('1990-01-01'),
  birthTime: '12:00',
  birthPlace: '東京都',
  currentLocation: {
    latitude: 35.6762,
    longitude: 139.6503
  },
  question: '私の人生の目的と進むべき道を知りたい',
  questionCategory: '総合運'
};

export default function IntegratedDivinationPage() {
  const [reading, setReading] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [userInput, setUserInput] = useState<DivinationInput>(defaultUserInput);
  const { data: environmentData, loading: envLoading } = useEnvironmentData();

  // ユーザーデータをlocalStorageから読み込み
  useEffect(() => {
    const savedUserData = localStorage.getItem('uranai_user_data');
    if (savedUserData) {
      try {
        const userData = JSON.parse(savedUserData);
        const processedInput: DivinationInput = {
          fullName: userData.fullName,
          birthDate: new Date(userData.birthDate),
          birthTime: userData.birthTime || '12:00',
          birthPlace: userData.birthPlace,
          currentLocation: userData.currentLocation || defaultUserInput.currentLocation,
          question: userData.question,
          questionCategory: userData.questionCategory
        };
        setUserInput(processedInput);
      } catch (error) {
        // console.error('ユーザーデータの解析エラー:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (!envLoading && environmentData && !reading) {
      setIsCalculating(true);
      
      // 動的インポートでIntegratedEngineを遅延読み込み
      import('@/lib/divination/engines/integrated-engine').then(async ({ IntegratedEngine }) => {
        const engine = new IntegratedEngine(userInput, environmentData);
        // 非同期版を使用してより詳細な結果を取得
        const result = await engine.calculateAsync();
        setReading(result);
        setIsCalculating(false);
      }).catch(error => {
        // console.error('Complexエンジンの読み込みエラー:', error);
        // エラー時は同期版にフォールバック
        import('@/lib/divination/engines/integrated-engine').then(({ IntegratedEngine }) => {
          const engine = new IntegratedEngine(userInput, environmentData);
          const result = engine.calculate();
          setReading(result);
          setIsCalculating(false);
        }).catch(() => {
          setIsCalculating(false);
        });
      });
    }
  }, [envLoading, environmentData, reading, userInput]);

  const relatedDivinations = [
    {
      href: '/divination/numerology',
      label: '数秘術で基本数字を見る',
      colorClass: 'bg-indigo-600/20 border border-indigo-500/50 text-indigo-300'
    },
    {
      href: '/divination/tarot',
      label: 'タロットで詳細を見る',
      colorClass: 'bg-purple-600/20 border border-purple-500/50 text-purple-300'
    },
    {
      href: '/divination/astrology',
      label: '西洋占星術で星を見る',
      colorClass: 'bg-blue-600/20 border border-blue-500/50 text-blue-300'
    }
  ];

  if (!reading || envLoading || isCalculating) {
    return (
      <DivinationPageTemplate
        title="Complex"
        subtitle="宇宙の叡智を結集した究極の占い"
        headerTitle="Complex"
        relatedDivinations={relatedDivinations}
      >
        <div className="text-center py-20">
          <div className="inline-block animate-spin">
            <Sparkles className="w-12 h-12 text-purple-400" />
          </div>
          <p className="text-white/60 mt-4">
            {isCalculating ? '宇宙の叡智を統合中...' : 'Complexを初期化中...'}
          </p>
        </div>
      </DivinationPageTemplate>
    );
  }

  return (
    <DivinationPageTemplate
      title="Complex"
      subtitle="宇宙の叡智を結集した究極の占い"
      headerTitle="Complex"
      relatedDivinations={relatedDivinations}
    >
      {/* ヒーローセクション */}
      <div className="relative mb-12 overflow-hidden rounded-3xl bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-indigo-900/20 p-8">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 animate-pulse" />
        <div className="relative z-10 text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 mb-6 rounded-full bg-gradient-to-r from-purple-500/30 to-blue-500/30 animate-pulse">
            <Infinity className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-light text-white mb-4">
            {reading.synthesis?.title || '宇宙の叡智が導く道'}
          </h2>
          <p className="text-lg text-white/80 max-w-3xl mx-auto leading-relaxed">
            {reading.synthesis?.message || 'あなたの人生には多くの可能性が秘められています。星々があなたを導いています。'}
          </p>
        </div>
      </div>

      {/* 環境データ */}
      {environmentData && (
        <div className="mb-8">
          <EnvironmentDisplay data={environmentData} />
        </div>
      )}

      {/* 統合スコア */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div
          className="cosmic-card"
        >
          <div className="flex items-center justify-between mb-4">
            <Brain className="w-8 h-8 text-indigo-400" />
            <div className="text-right">
              <div className="text-3xl font-bold text-white">{reading.scores?.mental || 85}%</div>
              <div className="text-sm text-white/60">精神的調和</div>
            </div>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full"
              style={{ width: `${reading.scores?.mental || 85}%` }}
            />
          </div>
        </div>

        <div
          className="cosmic-card"
        >
          <div className="flex items-center justify-between mb-4">
            <Heart className="w-8 h-8 text-pink-400" />
            <div className="text-right">
              <div className="text-3xl font-bold text-white">{reading.scores?.emotional || 78}%</div>
              <div className="text-sm text-white/60">感情的充実</div>
            </div>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div 
              className="h-full bg-gradient-to-r from-pink-500 to-pink-400 rounded-full"
              style={{ width: `${reading.scores?.emotional || 78}%` }}
            />
          </div>
        </div>

        <div
          className="cosmic-card"
        >
          <div className="flex items-center justify-between mb-4">
            <Zap className="w-8 h-8 text-yellow-400" />
            <div className="text-right">
              <div className="text-3xl font-bold text-white">{reading.scores?.spiritual || 92}%</div>
              <div className="text-sm text-white/60">霊的成長</div>
            </div>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div 
              className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-full"
              style={{ width: `${reading.scores?.spiritual || 92}%` }}
            />
          </div>
        </div>
      </div>

      {/* 共通テーマ */}
      <div className="cosmic-card cosmic-section">
        <h3 className="cosmic-heading text-3xl mb-6 flex items-center">
          <Layers className="w-6 h-6 mr-3" />
          発見された共通テーマ
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reading.synthesis?.commonThemes?.map((theme: any, index: number) => (
            <div
              key={index}
              className={`p-4 rounded-xl ${
                theme.strength === 'strong' 
                  ? 'bg-gradient-to-r from-purple-600/30 to-blue-600/30 border border-purple-500/50' 
                  : theme.strength === 'medium'
                  ? 'bg-white/10 border border-white/20'
                  : 'bg-white/5 border border-white/10'
              }`}
            >
              <h4 className="text-white font-medium mb-2">{theme.theme}</h4>
              <p className="text-white/60 text-sm mb-2">
                {theme.sources?.length || 0}つの占術で共通
              </p>
              <div className="flex flex-wrap gap-1">
                {theme.sources?.map((source: string, idx: number) => (
                  <span key={idx} className="text-xs bg-white/10 px-2 py-1 rounded-full text-white/80">
                    {source}
                  </span>
                )) || []}
              </div>
            </div>
          )) || []}
        </div>
      </div>

      {/* 各占術の概要 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        {/* 主要な占術結果 */}
        <div className="space-y-6">
          <h3 className="cosmic-heading text-2xl flex items-center">
            <Star className="w-5 h-5 mr-2" />
            主要な占術からのメッセージ
          </h3>
          
          {reading.divinationSummaries?.slice(0, 5).map((summary: any, index: number) => (
            <div
              key={index}
              className="cosmic-card"
            >
              <h4 className="cosmic-text text-lg font-medium mb-2 flex items-center">
                <span className="text-2xl mr-3">{summary.icon}</span>
                {summary.name}
              </h4>
              <p className="text-white/80 text-sm mb-3">{summary.keyMessage}</p>
              <div className="text-white/60 text-xs">
                重要度: <span className="text-purple-400">{summary.importance}%</span>
              </div>
            </div>
          ))}
        </div>

        {/* 補助的な占術結果 */}
        <div className="space-y-6">
          <h3 className="cosmic-heading text-2xl flex items-center">
            <Moon className="w-5 h-5 mr-2" />
            補助的な占術からの洞察
          </h3>
          
          {reading.divinationSummaries?.slice(5).map((summary: any, index: number) => (
            <div
              key={index}
              className="cosmic-card"
            >
              <h4 className="cosmic-text text-lg font-medium mb-2 flex items-center">
                <span className="text-2xl mr-3">{summary.icon}</span>
                {summary.name}
              </h4>
              <p className="text-white/80 text-sm mb-3">{summary.keyMessage}</p>
              <div className="text-white/60 text-xs">
                重要度: <span className="text-blue-400">{summary.importance}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 矛盾と調和 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        <div className="cosmic-card">
          <h3 className="cosmic-heading text-2xl mb-6 flex items-center">
            <Eye className="w-5 h-5 mr-2" />
            注意すべき矛盾点
          </h3>
          <div className="space-y-4">
            {reading.synthesis?.contradictions?.map((contradiction: any, index: number) => (
              <div key={index} className="bg-yellow-500/10 rounded-xl p-4 border border-yellow-500/30">
                <p className="text-yellow-100 text-sm mb-2">{contradiction.aspect}</p>
                <p className="text-yellow-200 text-xs">
                  {contradiction.viewpoint1?.source} vs {contradiction.viewpoint2?.source}
                </p>
                <p className="text-yellow-100 text-xs mt-2">{contradiction.resolution}</p>
              </div>
            )) || []}
          </div>
        </div>

        <div className="cosmic-card">
          <h3 className="cosmic-heading text-2xl mb-6 flex items-center">
            <Flower className="w-5 h-5 mr-2" />
            エネルギープロファイル
          </h3>
          <div className="space-y-4">
            {reading.synthesis?.energyProfile && (
              <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/30">
                <p className="text-green-100 text-sm mb-2">
                  主要: {reading.synthesis.energyProfile.dominant}
                </p>
                <p className="text-green-200 text-xs mb-2">
                  補助: {reading.synthesis.energyProfile.secondary}
                </p>
                <p className="text-green-100 text-xs">
                  アドバイス: {reading.synthesis.energyProfile.advice}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 時間軸での運勢 */}
      <div className="cosmic-card cosmic-section">
        <h3 className="cosmic-heading text-3xl mb-6 flex items-center">
          <Compass className="w-6 h-6 mr-3" />
          時間軸での運勢変化
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500/30 to-blue-600/30 mb-4">
              <span className="text-2xl">🌅</span>
            </div>
            <h4 className="text-white font-medium mb-2">過去</h4>
            <p className="text-white/80 text-sm">{reading.synthesis?.timeline?.past?.main || '過去の基盤'}</p>
            {reading.synthesis?.timeline?.past?.supporting?.slice(0, 2).map((item: string, idx: number) => (
              <p key={idx} className="text-white/60 text-xs mt-1">{item}</p>
            ))}
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-500/30 to-purple-600/30 mb-4">
              <span className="text-2xl">☀️</span>
            </div>
            <h4 className="text-white font-medium mb-2">現在</h4>
            <p className="text-white/80 text-sm">{reading.synthesis?.timeline?.present?.main || '現在の状況'}</p>
            {reading.synthesis?.timeline?.present?.supporting?.slice(0, 2).map((item: string, idx: number) => (
              <p key={idx} className="text-white/60 text-xs mt-1">{item}</p>
            ))}
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500/30 to-indigo-600/30 mb-4">
              <span className="text-2xl">🌌</span>
            </div>
            <h4 className="text-white font-medium mb-2">未来</h4>
            <p className="text-white/80 text-sm">{reading.synthesis?.timeline?.future?.main || '未来への道'}</p>
            {reading.synthesis?.timeline?.future?.supporting?.slice(0, 2).map((item: string, idx: number) => (
              <p key={idx} className="text-white/60 text-xs mt-1">{item}</p>
            ))}
          </div>
        </div>
      </div>

      {/* 統合メッセージ */}
      <div className="cosmic-card cosmic-section bg-gradient-to-r from-purple-600/20 to-blue-600/20">
        <h3 className="cosmic-heading text-3xl mb-6 flex items-center">
          <Sun className="w-6 h-6 mr-3" />
          Complexメッセージ
        </h3>
        
        {/* コアメッセージ */}
        <div className="mb-6 p-6 bg-white/10 rounded-xl">
          <h4 className="text-white font-medium mb-3">中核メッセージ</h4>
          <p className="text-white/90 leading-relaxed">
            {reading.integratedMessage?.coreMessage || '宇宙があなたに伝えたいメッセージをお届けします'}
          </p>
        </div>

        {/* アクションステップ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white/5 rounded-xl p-6">
            <h4 className="text-white font-medium mb-3 flex items-center">
              <span className="text-2xl mr-3">🎯</span>
              行動指針
            </h4>
            <ul className="space-y-2">
              {reading.integratedMessage?.actionSteps?.map((step: string, index: number) => (
                <li key={index} className="text-white/80 text-sm flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  {step}
                </li>
              )) || []}
            </ul>
          </div>

          <div className="bg-white/5 rounded-xl p-6">
            <h4 className="text-white font-medium mb-3 flex items-center">
              <span className="text-2xl mr-3">🌟</span>
              チャンス
            </h4>
            <ul className="space-y-2">
              {reading.integratedMessage?.opportunities?.map((opportunity: string, index: number) => (
                <li key={index} className="text-white/80 text-sm flex items-start">
                  <span className="text-blue-400 mr-2">•</span>
                  {opportunity}
                </li>
              )) || []}
            </ul>
          </div>
        </div>

        {/* 宇宙的な視点 */}
        {reading.cosmicPerspective && (
          <div className="mt-6 p-6 bg-white/5 rounded-xl">
            <h4 className="text-white font-medium mb-3 flex items-center">
              <Sparkles className="w-5 h-5 mr-2" />
              宇宙的な視点からのメッセージ
            </h4>
            <p className="text-white/80 text-sm leading-relaxed mb-3">
              {reading.cosmicPerspective.universalMessage}
            </p>
            <p className="text-white/70 text-xs">
              {reading.cosmicPerspective.spiritualGuidance}
            </p>
          </div>
        )}
      </div>

      {/* 詳細診断ボタン（準備中） */}
      <div className="detail-diagnosis-button">
        <button className="cosmic-button-disabled" disabled>
          詳細なComplex診断を受ける（準備中）
        </button>
      </div>
    </DivinationPageTemplate>
  );
}