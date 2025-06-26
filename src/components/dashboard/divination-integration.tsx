'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  RefreshCw,
  Settings,
  Check,
  X,
  AlertCircle,
  Loader2,
  Zap,
  Clock,
  ChevronRight,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';

import UnifiedResultDisplay from '@/components/divination/unified-result-display';
import { 
  getDivinationOrchestrator, 
  DivinationType,
  DivinationResponse 
} from '@/lib/divination/divination-orchestrator';
import { DivinationInput } from '@/lib/divination/base-engine';

interface DivinationIntegrationProps {
  userInput: DivinationInput;
  onComplete?: (results: DivinationResponse) => void;
  initialTypes?: DivinationType[];
  autoStart?: boolean;
}

interface DivinationConfig {
  types: DivinationType[];
  parallel: boolean;
  useCache: boolean;
  priority: DivinationType[];
}

const defaultConfig: DivinationConfig = {
  types: ['numerology', 'tarot', 'iching'],
  parallel: true,
  useCache: true,
  priority: []
};

const allDivinationTypes: { type: DivinationType; name: string; color: string }[] = [
  { type: 'numerology', name: '数秘術', color: 'purple' },
  { type: 'tarot', name: 'タロット', color: 'indigo' },
  { type: 'celtic', name: 'ケルト', color: 'green' },
  { type: 'runes', name: 'ルーン', color: 'amber' },
  { type: 'iching', name: '易経', color: 'yellow' },
  { type: 'nine-star-ki', name: '九星気学', color: 'red' },
  { type: 'shichu-suimei', name: '四柱推命', color: 'orange' },
  { type: 'kabbalah', name: 'カバラ', color: 'violet' },
  { type: 'feng-shui', name: '風水', color: 'teal' },
  { type: 'mayan-calendar', name: 'マヤ暦', color: 'yellow' },
  { type: 'chakra', name: 'チャクラ', color: 'purple' },
  { type: 'aura-soma', name: 'オーラソーマ', color: 'pink' },
  { type: 'akashic-records', name: 'アカシック', color: 'indigo' }
];

export default function DivinationIntegration({
  userInput,
  onComplete,
  initialTypes,
  autoStart = false
}: DivinationIntegrationProps) {
  const [config, setConfig] = useState<DivinationConfig>({
    ...defaultConfig,
    types: initialTypes || defaultConfig.types
  });
  
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [results, setResults] = useState<DivinationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentType, setCurrentType] = useState<DivinationType | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [completedTypes, setCompletedTypes] = useState<DivinationType[]>([]);

  const orchestrator = getDivinationOrchestrator();

  // 自動開始
  useEffect(() => {
    if (autoStart && !isRunning && !results) {
      startDivination();
    }
  }, [autoStart]);

  /**
   * 占術実行開始
   */
  const startDivination = useCallback(async () => {
    if (config.types.length === 0) {
      setError('実行する占術を選択してください');
      return;
    }

    setIsRunning(true);
    setIsPaused(false);
    setError(null);
    setProgress(0);
    setCompletedTypes([]);
    setResults(null);

    try {
      // 進捗シミュレーション（並列実行の場合）
      if (config.parallel) {
        const progressInterval = setInterval(() => {
          setProgress(prev => {
            const next = prev + (100 / config.types.length) * 0.1;
            return Math.min(next, 95);
          });
        }, 100);

        const response = await orchestrator.executeDivinations({
          types: config.types,
          input: userInput,
          options: {
            parallel: config.parallel,
            useCache: config.useCache,
            priority: config.priority
          }
        });

        clearInterval(progressInterval);
        setProgress(100);
        setResults(response);
        setCompletedTypes(config.types);
        
        if (onComplete) {
          onComplete(response);
        }
      } else {
        // 順次実行の場合
        const totalTypes = config.types.length;
        let completed = 0;

        // 順次実行のシミュレーション
        for (const type of config.types) {
          if (isPaused) {
            await new Promise(resolve => {
              const checkPause = setInterval(() => {
                if (!isPaused) {
                  clearInterval(checkPause);
                  resolve(undefined);
                }
              }, 100);
            });
          }

          setCurrentType(type);
          
          // 単一実行
          const response = await orchestrator.executeDivinations({
            types: [type],
            input: userInput,
            options: {
              parallel: false,
              useCache: config.useCache,
              priority: config.priority
            }
          });

          completed++;
          setProgress((completed / totalTypes) * 100);
          setCompletedTypes(prev => [...prev, type]);

          // 結果を蓄積
          if (!results) {
            setResults(response);
          } else {
            setResults(prev => ({
              results: [...(prev?.results || []), ...response.results],
              metadata: {
                ...response.metadata,
                totalTime: (prev?.metadata.totalTime || 0) + response.metadata.totalTime,
                executionOrder: [...(prev?.metadata.executionOrder || []), ...response.metadata.executionOrder],
                cacheHits: [...(prev?.metadata.cacheHits || []), ...response.metadata.cacheHits]
              }
            }));
          }
        }

        if (onComplete && results) {
          onComplete(results);
        }
      }
    } catch (err) {
      console.error('Divination error:', err);
      setError('占術の実行中にエラーが発生しました');
    } finally {
      setIsRunning(false);
      setCurrentType(null);
    }
  }, [config, userInput, isPaused, results, onComplete, orchestrator]);

  /**
   * 占術タイプの切り替え
   */
  const toggleDivinationType = (type: DivinationType) => {
    setConfig(prev => ({
      ...prev,
      types: prev.types.includes(type)
        ? prev.types.filter(t => t !== type)
        : [...prev.types, type]
    }));
  };

  /**
   * 設定の切り替え
   */
  const toggleSetting = (setting: 'parallel' | 'useCache') => {
    setConfig(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  /**
   * リセット
   */
  const reset = () => {
    setIsRunning(false);
    setIsPaused(false);
    setResults(null);
    setError(null);
    setProgress(0);
    setCurrentType(null);
    setCompletedTypes([]);
  };

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            統合占術システム
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            複数の占術を組み合わせた総合的な鑑定
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* 設定ボタン */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-lg transition-all ${
              showSettings
                ? 'bg-purple-500/20 text-purple-400'
                : 'bg-black/30 text-gray-400 hover:text-white'
            }`}
          >
            <Settings className="w-5 h-5" />
          </button>

          {/* キャッシュ統計 */}
          <div className="text-xs text-gray-500">
            {results?.metadata.cacheHits.length || 0} キャッシュヒット
          </div>
        </div>
      </div>

      {/* 設定パネル */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 rounded-xl bg-black/30 border border-white/10 space-y-4">
              {/* 占術選択 */}
              <div>
                <h3 className="text-sm font-medium mb-2 text-gray-400">実行する占術</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {allDivinationTypes.map(({ type, name, color }) => {
                    const isSelected = config.types.includes(type);
                    const isCompleted = completedTypes.includes(type);
                    
                    return (
                      <button
                        key={type}
                        onClick={() => toggleDivinationType(type)}
                        disabled={isRunning}
                        className={`
                          relative px-3 py-2 rounded-lg text-sm font-medium
                          transition-all duration-200 disabled:opacity-50
                          ${isSelected
                            ? `bg-${color}-500/20 text-${color}-400 border border-${color}-400/50`
                            : 'bg-black/20 text-gray-400 border border-white/10 hover:border-white/30'
                          }
                        `}
                      >
                        <span className="flex items-center justify-between">
                          {name}
                          {isCompleted && (
                            <Check className="w-3 h-3 text-green-400" />
                          )}
                        </span>
                        {currentType === type && (
                          <motion.div
                            className="absolute inset-0 rounded-lg border-2 border-purple-400"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {config.types.length}個選択中
                </p>
              </div>

              {/* 実行オプション */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-400">実行オプション</h3>
                
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.parallel}
                    onChange={() => toggleSetting('parallel')}
                    disabled={isRunning}
                    className="w-4 h-4 rounded border-gray-600 text-purple-500 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-300">
                    並列実行（高速）
                  </span>
                  <Zap className="w-4 h-4 text-yellow-400" />
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.useCache}
                    onChange={() => toggleSetting('useCache')}
                    disabled={isRunning}
                    className="w-4 h-4 rounded border-gray-600 text-purple-500 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-300">
                    キャッシュを使用
                  </span>
                  <Clock className="w-4 h-4 text-blue-400" />
                </label>
              </div>

              {/* 優先順位（ドラッグ&ドロップは省略） */}
              {!config.parallel && config.types.length > 1 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-2">実行順序</h3>
                  <div className="space-y-1">
                    {config.types.map((type, index) => {
                      const typeInfo = allDivinationTypes.find(t => t.type === type);
                      return (
                        <div
                          key={type}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-black/20 border border-white/10"
                        >
                          <span className="text-xs text-gray-500">{index + 1}</span>
                          <ChevronRight className="w-3 h-3 text-gray-600" />
                          <span className="text-sm text-gray-300">{typeInfo?.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 実行コントロール */}
      {!results && (
        <div className="flex items-center justify-center gap-4">
          {!isRunning ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startDivination}
              disabled={config.types.length === 0}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium
                       flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play className="w-5 h-5" />
              占術を開始
            </motion.button>
          ) : (
            <>
              {!config.parallel && (
                <button
                  onClick={() => setIsPaused(!isPaused)}
                  className="p-3 rounded-full bg-amber-500/20 text-amber-400 hover:bg-amber-500/30"
                >
                  {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                </button>
              )}
              <button
                onClick={reset}
                className="p-3 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30"
              >
                <X className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      )}

      {/* エラー表示 */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-lg bg-red-500/10 border border-red-500/50 flex items-center gap-3"
        >
          <AlertCircle className="w-5 h-5 text-red-400" />
          <p className="text-sm text-red-300">{error}</p>
        </motion.div>
      )}

      {/* 進捗表示 */}
      {isRunning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          {/* プログレスバー */}
          <div className="relative h-2 rounded-full bg-black/30 overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-pink-500"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* 現在の占術 */}
          {currentType && (
            <div className="flex items-center justify-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-purple-400" />
              <span className="text-sm text-gray-300">
                {allDivinationTypes.find(t => t.type === currentType)?.name}を実行中...
              </span>
            </div>
          )}

          {/* 完了した占術 */}
          {completedTypes.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center">
              {completedTypes.map(type => {
                const typeInfo = allDivinationTypes.find(t => t.type === type);
                return (
                  <div
                    key={type}
                    className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs
                             flex items-center gap-1 border border-green-400/30"
                  >
                    <Check className="w-3 h-3" />
                    {typeInfo?.name}
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      )}

      {/* 結果表示 */}
      {results && !isRunning && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* 実行情報 */}
          <div className="flex items-center justify-between px-4 py-3 rounded-lg bg-black/30 border border-white/10">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300">
                  {(results.metadata.totalTime / 1000).toFixed(1)}秒
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-gray-300">
                  {results.results.length}個の占術
                </span>
              </div>
              {results.metadata.cacheHits.length > 0 && (
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-gray-300">
                    {results.metadata.cacheHits.length}個キャッシュ使用
                  </span>
                </div>
              )}
            </div>
            
            <button
              onClick={reset}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/20 
                       text-purple-400 hover:bg-purple-500/30 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              再実行
            </button>
          </div>

          {/* 統合結果表示 */}
          <UnifiedResultDisplay
            results={results.results}
            showComparison={true}
            showIntegration={true}
          />
        </motion.div>
      )}
    </div>
  );
}