'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  BarChart3, 
  Layers, 
  Target,
  TrendingUp,
  Zap,
  Eye,
  RefreshCw,
  ChevronRight,
  Info,
  Play
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { DivinationInput } from '@/lib/divination/base-engine';
import { DivinationType } from '@/lib/divination/divination-orchestrator';

// Dynamic import for heavy component
const DivinationIntegration = dynamic(
  () => import('./divination-integration'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-purple-500"></div>
      </div>
    )
  }
);

interface EnhancedIntegrationPanelProps {
  userData?: any;
}

export function EnhancedIntegrationPanel({ userData }: EnhancedIntegrationPanelProps) {
  const [showIntegration, setShowIntegration] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<DivinationType[]>(['numerology', 'tarot', 'iching']);
  const [isInitialized, setIsInitialized] = useState(false);
  const [userInput, setUserInput] = useState<DivinationInput | null>(null);

  // ユーザーデータから入力情報を構築
  useEffect(() => {
    const storedData = localStorage.getItem('uranai_user_data');
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        const input: DivinationInput = {
          fullName: parsed.fullName || '名無しの探求者',
          birthDate: new Date(parsed.birthDate || new Date()),
          birthTime: parsed.birthTime,
          birthPlace: parsed.birthPlace || '日本',
          currentLocation: parsed.currentLocation,
          question: parsed.question || '総合的な運勢について教えてください',
          questionCategory: parsed.questionCategory || '総合運'
        };
        setUserInput(input);
        setIsInitialized(true);
      } catch (e) {
        console.error('Failed to parse user data:', e);
      }
    }
  }, []);

  // クイック占術選択
  const quickSelections = [
    {
      name: '基本3占術',
      types: ['numerology', 'tarot', 'iching'] as DivinationType[],
      description: '数秘術・タロット・易経の基本セット',
      icon: <Sparkles className="w-4 h-4" />
    },
    {
      name: '東洋占術',
      types: ['iching', 'nine-star-ki', 'shichu-suimei', 'feng-shui'] as DivinationType[],
      description: '東洋の伝統的な占術を統合',
      icon: <Eye className="w-4 h-4" />
    },
    {
      name: 'スピリチュアル',
      types: ['chakra', 'aura-soma', 'akashic-records'] as DivinationType[],
      description: '霊的・エネルギー的な分析',
      icon: <Zap className="w-4 h-4" />
    },
    {
      name: '全占術統合',
      types: [
        'numerology', 'tarot', 'celtic', 'runes', 'iching',
        'nine-star-ki', 'shichu-suimei', 'kabbalah', 'feng-shui',
        'mayan-calendar', 'chakra', 'aura-soma', 'akashic-records'
      ] as DivinationType[],
      description: '13種類すべての占術を実行',
      icon: <Layers className="w-4 h-4" />
    }
  ];

  const handleQuickSelect = (types: DivinationType[]) => {
    setSelectedTypes(types);
    setShowIntegration(true);
  };

  if (!isInitialized || !userInput) {
    return (
      <section 
        className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20"
        role="region"
        aria-label="統合分析"
      >
        <div className="text-center py-8">
          <p className="text-gray-400">ユーザー情報を読み込んでいます...</p>
        </div>
      </section>
    );
  }

  return (
    <section 
      className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20"
      role="region"
      aria-label="統合分析"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2" id="integration-title">
            <Layers className="w-6 h-6 text-purple-400" />
            統合占術分析
          </h2>
          <p className="text-gray-400 mt-1">複数の占術を組み合わせた高精度な総合鑑定</p>
        </div>
        
        {showIntegration && (
          <button
            onClick={() => setShowIntegration(false)}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            閉じる
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!showIntegration ? (
          <motion.div
            key="selection"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* 統合分析の説明 */}
            <div className="bg-purple-500/10 rounded-xl p-6 border border-purple-500/30">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-purple-500/20">
                  <Info className="w-5 h-5 text-purple-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-2">統合占術分析とは？</h3>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    複数の占術システムを同時に実行し、それぞれの結果を統合的に分析することで、
                    より深い洞察と包括的なアドバイスを提供します。共通するメッセージや
                    相補的な視点を発見し、あなたの人生により確かな指針をもたらします。
                  </p>
                  <div className="mt-4 flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2 text-green-400">
                      <BarChart3 className="w-4 h-4" />
                      <span>精度向上</span>
                    </div>
                    <div className="flex items-center gap-2 text-blue-400">
                      <Target className="w-4 h-4" />
                      <span>多角的分析</span>
                    </div>
                    <div className="flex items-center gap-2 text-purple-400">
                      <TrendingUp className="w-4 h-4" />
                      <span>相乗効果</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* クイック選択 */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">占術セットを選択</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickSelections.map((selection) => (
                  <motion.button
                    key={selection.name}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleQuickSelect(selection.types)}
                    className="group relative p-6 rounded-xl bg-black/30 border border-white/10 
                             hover:border-purple-400/50 transition-all duration-300 text-left"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-purple-500/20 group-hover:bg-purple-500/30 transition-colors">
                          {selection.icon}
                        </div>
                        <h4 className="font-semibold text-white">{selection.name}</h4>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-400 transition-colors" />
                    </div>
                    <p className="text-sm text-gray-400 mb-3">{selection.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {selection.types.length}個の占術
                      </span>
                      <Play className="w-4 h-4 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* カスタム選択への案内 */}
            <div className="text-center pt-4">
              <button
                onClick={() => setShowIntegration(true)}
                className="text-sm text-purple-400 hover:text-purple-300 transition-colors inline-flex items-center gap-2"
              >
                占術を個別に選択する
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="integration"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <DivinationIntegration
              userInput={userInput}
              initialTypes={selectedTypes}
              autoStart={false}
              onComplete={(results) => {
                console.log('統合占術完了:', results);
                // 結果の保存や通知などの処理
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}