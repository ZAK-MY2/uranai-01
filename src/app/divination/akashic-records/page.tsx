'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { CosmicBackground } from '@/components/ui/cosmic-background';
import { CosmicHeader } from '@/components/divination/cosmic-header';
import { useEnvironmentData } from '@/hooks/use-environment-data';
import { DivinationInput } from '@/lib/divination/base-engine';
import { WorldClassAkashicRecordsEngine } from '@/lib/divination/engines/world-class-akashic-records-engine';

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

// アカシックレコード視覚化コンポーネント
const AkashicVisualization = ({ soulAge, soulType }: { soulAge: any; soulType: any }) => {
  return (
    <div className="relative w-full h-64 flex items-center justify-center">
      <svg viewBox="0 0 400 200" className="w-full h-full">
        {/* 魂の進化ステージ */}
        <defs>
          <radialGradient id="soul-gradient">
            <stop offset="0%" stopColor="#E9D5FF" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#A78BFA" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.2" />
          </radialGradient>
        </defs>
        
        {/* 中心の魂 */}
        <circle cx="200" cy="100" r="40" fill="url(#soul-gradient)" />
        <circle cx="200" cy="100" r="35" fill="none" stroke="#A78BFA" strokeWidth="1" opacity="0.8" />
        <circle cx="200" cy="100" r="30" fill="none" stroke="#C4B5FD" strokeWidth="0.5" opacity="0.6" />
        
        {/* 魂の年齢レベル表示 */}
        {[...Array(7)].map((_, i) => {
          const angle = (i - 3) * 25 - 90;
          const x = 200 + 60 * Math.cos(angle * Math.PI / 180);
          const y = 100 + 60 * Math.sin(angle * Math.PI / 180);
          const isActive = i < soulAge.level;
          
          return (
            <g key={i}>
              <circle 
                cx={x} 
                cy={y} 
                r="8" 
                fill={isActive ? "#A78BFA" : "none"}
                stroke="#A78BFA"
                strokeWidth="1"
                opacity={isActive ? 1 : 0.3}
              />
            </g>
          );
        })}
        
        {/* 魂のタイプシンボル */}
        <text x="200" y="105" textAnchor="middle" className="fill-white text-xl font-light">
          {soulType.essence.charAt(0).toUpperCase()}
        </text>
        
        {/* オーラフィールド */}
        <ellipse cx="200" cy="100" rx="120" ry="80" fill="none" stroke="#E9D5FF" strokeWidth="0.5" opacity="0.3" />
        <ellipse cx="200" cy="100" rx="100" ry="70" fill="none" stroke="#C4B5FD" strokeWidth="0.5" opacity="0.4" />
        <ellipse cx="200" cy="100" rx="80" ry="60" fill="none" stroke="#A78BFA" strokeWidth="0.5" opacity="0.5" />
      </svg>
    </div>
  );
};

// チャクラ活性化ビジュアル
const ChakraVisualization = ({ chakraStates }: { chakraStates: any[] }) => {
  const chakraColors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#8B00FF'];
  
  return (
    <div className="flex justify-center items-center gap-4">
      {chakraStates.slice(0, 7).map((chakra, index) => (
        <div key={index} className="text-center">
          <div 
            className="w-12 h-12 rounded-full relative"
            style={{
              background: `radial-gradient(circle, ${chakraColors[index]}${Math.round(chakra.activation * 2.55).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
              boxShadow: chakra.activation > 70 ? `0 0 20px ${chakraColors[index]}50` : 'none'
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">
              {chakra.activation}%
            </div>
          </div>
          <p className="text-xs text-white/60 mt-1">{index + 1}</p>
        </div>
      ))}
    </div>
  );
};

export default function AkashicRecordsPage() {
  const [userInput, setUserInput] = useState<UserInputData | null>(null);
  const [akashicResult, setAkashicResult] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'soul' | 'karma' | 'past' | 'guidance'>('soul');
  const { data: environmentData, loading: envLoading } = useEnvironmentData();

  useEffect(() => {
    // LocalStorageからユーザーデータを読み込み
    const storedData = localStorage.getItem('uranai_user_data');
    if (storedData) {
      try {
        const userData: UserInputData = JSON.parse(storedData);
        setUserInput(userData);
      } catch (error) {
        console.error('ユーザーデータの読み込みエラー:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (userInput && environmentData && !envLoading && !akashicResult && !isCalculating) {
      calculateAkashicRecords();
    }
  }, [userInput, environmentData, envLoading]);

  // アカシックレコード計算関数
  const calculateAkashicRecords = async () => {
    if (!userInput || !environmentData) return;
    
    setIsCalculating(true);
    try {
      const divInput: DivinationInput = {
        fullName: userInput.fullName,
        birthDate: new Date(userInput.birthDate),
        birthTime: userInput.birthTime,
        birthPlace: userInput.birthPlace,
        question: userInput.question,
        questionCategory: userInput.questionCategory
      };
      
      const engine = new WorldClassAkashicRecordsEngine(divInput, environmentData);
      const result = engine.calculate();
      setAkashicResult(result);
    } catch (error) {
      // console.error('アカシックレコード計算エラー:', error);
    }
    setIsCalculating(false);
  };

  if (isCalculating || !akashicResult) {
    return (
      <div className="min-h-screen relative bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <CosmicBackground />
        <div className="text-center">
          <div className="inline-block animate-spin mb-4">
            <svg className="w-16 h-16 text-purple-400" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
              <path d="M12 2 A10 10 0 0 1 22 12" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          </div>
          <p className="text-white/60">アカシックレコードにアクセス中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-slate-900 to-slate-800">
      <CosmicBackground />
      
      {/* ヘッダー */}
      <CosmicHeader title="アカシックレコード" />

      <main className="relative z-10 pt-10 pb-20">
        <div className="max-w-7xl mx-auto px-5">
          <ParameterBadge />
          
          {/* メインビジュアル */}
          <div className="cosmic-card cosmic-section mb-10">
            <h2 className="text-3xl font-light text-white text-center mb-6">宇宙意識の記録へようこそ</h2>
            <AkashicVisualization 
              soulAge={akashicResult.soulRecord.soulAge}
              soulType={akashicResult.soulRecord.soulType}
            />
            <div className="text-center mt-6">
              <p className="text-xl text-purple-300">
                魂の年齢: {akashicResult.soulRecord.soulAge.category} - レベル{akashicResult.soulRecord.soulAge.level}
              </p>
              <p className="text-lg text-blue-300 mt-2">
                魂のタイプ: {akashicResult.soulRecord.soulType.role}
              </p>
            </div>
          </div>
          
          {/* タブナビゲーション */}
          <div className="flex justify-center gap-4 mb-8">
            {[
              { id: 'soul', label: '魂の記録', icon: '🌟' },
              { id: 'karma', label: 'カルマ分析', icon: '☯️' },
              { id: 'past', label: '過去世', icon: '🌀' },
              { id: 'guidance', label: 'ガイダンス', icon: '✨' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as any)}
                className={`px-6 py-3 rounded-full transition-all duration-300 ${
                  selectedTab === tab.id
                    ? 'bg-purple-600/30 border border-purple-400 text-white'
                    : 'bg-white/5 border border-white/20 text-white/70 hover:bg-white/10'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
          
          {/* タブコンテンツ */}
          <div className="cosmic-card cosmic-section">
            {selectedTab === 'soul' && (
              <div className="space-y-8">
                <h3 className="cosmic-heading text-3xl text-center mb-6">魂の記録</h3>
                
                {/* 魂の起源 */}
                <div className="bg-white/5 rounded-xl p-6">
                  <h4 className="text-xl text-purple-300 mb-4">魂の起源</h4>
                  <p className="text-white/80 text-lg">{akashicResult.soulRecord.soulOrigin}</p>
                  <p className="text-white/60 mt-2">進化段階: {akashicResult.soulRecord.evolutionStage}/9</p>
                </div>
                
                {/* 魂のブループリント */}
                <div className="bg-white/5 rounded-xl p-6">
                  <h4 className="text-xl text-purple-300 mb-4">魂のブループリント</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-white/60 text-sm mb-2">コア資質</p>
                      <ul className="space-y-1">
                        {akashicResult.soulRecord.blueprint.coreQualities.map((quality: string, idx: number) => (
                          <li key={idx} className="text-white/80">• {quality}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-white/60 text-sm mb-2">神聖な才能</p>
                      <ul className="space-y-1">
                        {akashicResult.soulRecord.blueprint.divineGifts.map((gift: string, idx: number) => (
                          <li key={idx} className="text-white/80">• {gift}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-white/60 text-sm mb-2">進化の道筋</p>
                    <p className="text-white/80">{akashicResult.soulRecord.blueprint.evolutionaryPath}</p>
                  </div>
                </div>
                
                {/* エネルギープロファイル */}
                <div className="bg-white/5 rounded-xl p-6">
                  <h4 className="text-xl text-purple-300 mb-4">チャクラ活性化状態</h4>
                  <ChakraVisualization chakraStates={akashicResult.energeticProfile.chakraActivation} />
                  <p className="text-center text-white/60 text-sm mt-4">
                    ライトボディ発達度: {akashicResult.energeticProfile.lightBodyDevelopment}%
                  </p>
                </div>
              </div>
            )}
            
            {selectedTab === 'karma' && (
              <div className="space-y-8">
                <h3 className="cosmic-heading text-3xl text-center mb-6">カルマ分析</h3>
                
                {/* プライマリーカルマ */}
                <div className="bg-white/5 rounded-xl p-6">
                  <h4 className="text-xl text-purple-300 mb-4">主要なカルマパターン</h4>
                  {akashicResult.karmaAnalysis.primaryKarma.map((karma: any, idx: number) => (
                    <div key={idx} className="mb-4 pb-4 border-b border-white/10 last:border-0">
                      <p className="text-white font-medium">{karma.type}</p>
                      <p className="text-white/60 text-sm mt-1">強度: {karma.intensity}%</p>
                      <p className="text-white/80 text-sm mt-2">{karma.healingPath}</p>
                    </div>
                  ))}
                </div>
                
                {/* カルマ的ギフト */}
                <div className="bg-white/5 rounded-xl p-6">
                  <h4 className="text-xl text-purple-300 mb-4">カルマ的ギフト</h4>
                  {akashicResult.karmaAnalysis.karmaicGifts.map((gift: any, idx: number) => (
                    <div key={idx} className="mb-3">
                      <p className="text-white/80">{gift.nature}</p>
                      <p className="text-white/60 text-sm">活性化: {gift.activation}</p>
                    </div>
                  ))}
                </div>
                
                {/* クリアランスレベル */}
                <div className="text-center">
                  <p className="text-white/60">カルマクリアランスレベル</p>
                  <div className="relative w-full max-w-md mx-auto mt-2 h-8 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="absolute left-0 top-0 h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-1000"
                      style={{ width: `${akashicResult.karmaAnalysis.clearanceLevel}%` }}
                    />
                    <p className="absolute inset-0 flex items-center justify-center text-white font-medium">
                      {akashicResult.karmaAnalysis.clearanceLevel}%
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {selectedTab === 'past' && (
              <div className="space-y-8">
                <h3 className="cosmic-heading text-3xl text-center mb-6">過去世の記録</h3>
                
                {/* 関連する過去世 */}
                {akashicResult.pastLives.relevantLives.map((life: any, idx: number) => (
                  <div key={idx} className="bg-white/5 rounded-xl p-6">
                    <h4 className="text-xl text-purple-300 mb-2">{life.era}</h4>
                    <p className="text-white/60 mb-2">{life.location} - {life.identity}</p>
                    <p className="text-white/80 mb-3">{life.significance}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-white/60 mb-1">学んだレッスン</p>
                        <ul className="text-white/80">
                          {life.lessonsLearned.map((lesson: string, i: number) => (
                            <li key={i}>• {lesson}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-white/60 mb-1">未完了のレッスン</p>
                        <ul className="text-white/80">
                          {life.unfinishedLessons.map((lesson: string, i: number) => (
                            <li key={i}>• {lesson}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* 魂の繋がり */}
                <div className="bg-white/5 rounded-xl p-6">
                  <h4 className="text-xl text-purple-300 mb-4">魂の繋がり</h4>
                  {akashicResult.pastLives.relationshipConnections.map((connection: any, idx: number) => (
                    <div key={idx} className="mb-3">
                      <p className="text-white/80">{connection.soulName} ({connection.connectionType})</p>
                      <p className="text-white/60 text-sm">{connection.purpose}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {selectedTab === 'guidance' && (
              <div className="space-y-8">
                <h3 className="cosmic-heading text-3xl text-center mb-6">高次元ガイダンス</h3>
                
                {/* 人生の目的 */}
                <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl p-8 border border-purple-500/20">
                  <h4 className="text-xl text-purple-300 mb-4">人生の主要な目的</h4>
                  <p className="text-white text-lg leading-relaxed">
                    {akashicResult.lifeContract.primaryPurpose}
                  </p>
                </div>
                
                {/* スピリットガイド */}
                <div className="bg-white/5 rounded-xl p-6">
                  <h4 className="text-xl text-purple-300 mb-4">スピリットガイド</h4>
                  {akashicResult.higherGuidance.spiritGuides.map((guide: any, idx: number) => (
                    <div key={idx} className="mb-4">
                      <p className="text-white font-medium">{guide.name}</p>
                      <p className="text-white/60 text-sm">{guide.realm} - {guide.specialty}</p>
                      <p className="text-white/80 mt-2 italic">"{guide.messages[0]}"</p>
                    </div>
                  ))}
                </div>
                
                {/* 実践的ガイダンス */}
                <div className="bg-white/5 rounded-xl p-6">
                  <h4 className="text-xl text-purple-300 mb-4">今すぐ始められること</h4>
                  <ul className="space-y-2">
                    {akashicResult.practicalGuidance.immediateActions.map((action: string, idx: number) => (
                      <li key={idx} className="text-white/80 flex items-start">
                        <span className="text-purple-400 mr-2">✦</span>
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* アクティベーションコード */}
                <div className="text-center">
                  <h4 className="text-xl text-purple-300 mb-4">アクティベーションコード</h4>
                  <div className="flex justify-center gap-4">
                    {akashicResult.higherGuidance.activationCodes.map((code: string, idx: number) => (
                      <div key={idx} className="px-4 py-2 bg-purple-600/20 rounded-full text-white/80">
                        {code}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* 統合メッセージ */}
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-10 border border-white/10 mt-10">
            <h3 className="cosmic-heading text-3xl text-center mb-8">アカシックからのメッセージ</h3>
            
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-xl text-white/90 leading-relaxed mb-6">
                {akashicResult.threeLayerInterpretation.modern.psychologicalProfile}
              </p>
              
              <div className="grid grid-cols-3 gap-4 mt-8">
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-purple-300 text-2xl mb-2">🌟</p>
                  <p className="text-white/70 text-sm">チャネル明晰度</p>
                  <p className="text-white text-lg">{akashicResult.accuracy.channelClarity}%</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-blue-300 text-2xl mb-2">📖</p>
                  <p className="text-white/70 text-sm">情報の深さ</p>
                  <p className="text-white text-lg">{akashicResult.accuracy.informationDepth}%</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-indigo-300 text-2xl mb-2">⏰</p>
                  <p className="text-white/70 text-sm">時間的精度</p>
                  <p className="text-white text-lg">{akashicResult.accuracy.temporalAccuracy}%</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* 詳細診断ボタン（準備中） */}
          <div className="detail-diagnosis-button">
            <button className="cosmic-button-disabled" disabled>
              詳細なアカシックリーディングを受ける（準備中）
            </button>
          </div>

          {/* ナビゲーション */}
          <div className="mt-10 flex justify-center gap-6">
            <Link 
              href="/divination/chakra"
              className="px-8 py-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all duration-300"
            >
              ← チャクラ診断へ
            </Link>
            <Link 
              href="/dashboard"
              className="px-8 py-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all duration-300"
            >
              ダッシュボードへ →
            </Link>
          </div>
          
        </div>
      </main>
    </div>
  );
}