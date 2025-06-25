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
  const [, setUserInput] = useState<DivinationInput>(defaultUserInput);
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
        console.error('ユーザーデータの解析エラー:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (!envLoading && environmentData && !reading) {
      setIsCalculating(true);
      
      // 動的インポートでIntegratedEngineを遅延読み込み
      import('@/lib/divination/engines/integrated-engine').then(async ({ IntegratedEngine }) => {
        const engine = new IntegratedEngine(defaultUserInput, environmentData);
        // 非同期版を使用してより詳細な結果を取得
        const result = await engine.calculateAsync();
        setReading(result);
        setIsCalculating(false);
      }).catch(error => {
        console.error('統合占術エンジンの読み込みエラー:', error);
        // エラー時は同期版にフォールバック
        import('@/lib/divination/engines/integrated-engine').then(({ IntegratedEngine }) => {
          const engine = new IntegratedEngine(defaultUserInput, environmentData);
          const result = engine.calculate();
          setReading(result);
          setIsCalculating(false);
        }).catch(() => {
          setIsCalculating(false);
        });
      });
    }
  }, [envLoading, environmentData, reading]);

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
        title="統合占術"
        subtitle="宇宙の叡智を結集した究極の占い"
        headerTitle="統合占術"
        relatedDivinations={relatedDivinations}
      >
        <div className="text-center py-20">
          <div className="inline-block animate-spin">
            <Sparkles className="w-12 h-12 text-purple-400" />
          </div>
          <p className="text-white/60 mt-4">
            {isCalculating ? '宇宙の叡智を統合中...' : '統合占術を初期化中...'}
          </p>
        </div>
      </DivinationPageTemplate>
    );
  }

  return (
    <DivinationPageTemplate
      title="統合占術"
      subtitle="宇宙の叡智を結集した究極の占い"
      headerTitle="統合占術"
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
          className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10"
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
          className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10"
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
          className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10"
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
      <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 mb-12 border border-white/10">
        <h3 className="text-2xl font-light text-white mb-6 flex items-center">
          <Layers className="w-6 h-6 mr-3" />
          発見された共通テーマ
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reading.themes?.map((theme: any, index: number) => (
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
          <h3 className="text-xl font-light text-white flex items-center">
            <Star className="w-5 h-5 mr-2" />
            主要な占術からのメッセージ
          </h3>
          
          {reading.divinationSummaries?.slice(0, 5).map((summary: any, index: number) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10"
            >
              <h4 className="text-lg font-medium text-white mb-2 flex items-center">
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
          <h3 className="text-xl font-light text-white flex items-center">
            <Moon className="w-5 h-5 mr-2" />
            補助的な占術からの洞察
          </h3>
          
          {reading.divinationSummaries?.slice(5).map((summary: any, index: number) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10"
            >
              <h4 className="text-lg font-medium text-white mb-2 flex items-center">
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
        <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10">
          <h3 className="text-xl font-light text-white mb-6 flex items-center">
            <Eye className="w-5 h-5 mr-2" />
            注意すべき矛盾点
          </h3>
          <div className="space-y-4">
            {reading.contradictions?.map((contradiction: any, index: number) => (
              <div key={index} className="bg-yellow-500/10 rounded-xl p-4 border border-yellow-500/30">
                <p className="text-yellow-100 text-sm mb-2">{contradiction.description}</p>
                <p className="text-yellow-200 text-xs">
                  {contradiction.source1} vs {contradiction.source2}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10">
          <h3 className="text-xl font-light text-white mb-6 flex items-center">
            <Flower className="w-5 h-5 mr-2" />
            調和的な要素
          </h3>
          <div className="space-y-4">
            {reading.harmonies?.map((harmony: any, index: number) => (
              <div key={index} className="bg-green-500/10 rounded-xl p-4 border border-green-500/30">
                <p className="text-green-100 text-sm mb-2">{harmony.description}</p>
                <p className="text-green-200 text-xs">
                  {harmony.sources?.join(' × ') || ''}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 時間軸での運勢 */}
      <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 mb-12 border border-white/10">
        <h3 className="text-2xl font-light text-white mb-6 flex items-center">
          <Compass className="w-6 h-6 mr-3" />
          時間軸での運勢変化
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500/30 to-blue-600/30 mb-4">
              <span className="text-2xl">🌅</span>
            </div>
            <h4 className="text-white font-medium mb-2">短期（1-3ヶ月）</h4>
            <p className="text-white/80 text-sm">{reading.timeline?.shortTerm || '新しい始まりの時期です'}</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-500/30 to-purple-600/30 mb-4">
              <span className="text-2xl">☀️</span>
            </div>
            <h4 className="text-white font-medium mb-2">中期（3-6ヶ月）</h4>
            <p className="text-white/80 text-sm">{reading.timeline?.midTerm || '発展と成長の時期です'}</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500/30 to-indigo-600/30 mb-4">
              <span className="text-2xl">🌌</span>
            </div>
            <h4 className="text-white font-medium mb-2">長期（6-12ヶ月）</h4>
            <p className="text-white/80 text-sm">{reading.timeline?.longTerm || '大きな変化の時期です'}</p>
          </div>
        </div>
      </div>

      {/* 具体的アドバイス */}
      <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-md rounded-3xl p-8 border border-white/30">
        <h3 className="text-2xl font-light text-white mb-6 flex items-center">
          <Sun className="w-6 h-6 mr-3" />
          統合的なアドバイス
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reading.advice?.map((item: any, index: number) => (
            <div
              key={index}
              className="bg-white/10 rounded-xl p-6"
            >
              <h4 className="text-white font-medium mb-3 flex items-center">
                <span className="text-2xl mr-3">{item.icon}</span>
                {item.category}
              </h4>
              <p className="text-white/80 text-sm leading-relaxed">{item.advice}</p>
            </div>
          ))}
        </div>

        {/* 環境との調和 */}
        {reading.environmentalGuidance && (
          <div className="mt-6 p-6 bg-white/5 rounded-xl">
            <h4 className="text-white font-medium mb-3 flex items-center">
              <Sparkles className="w-5 h-5 mr-2" />
              現在の環境エネルギーとの調和
            </h4>
            <p className="text-white/80 text-sm leading-relaxed">
              {reading.environmentalGuidance}
            </p>
          </div>
        )}
      </div>
    </DivinationPageTemplate>
  );
}