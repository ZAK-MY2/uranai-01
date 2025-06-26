'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Star, 
  Moon, 
  Sun, 
  Heart,
  Brain,
  Zap,
  Shield,
  Eye,
  Compass,
  Globe,
  Clock,
  ChevronDown,
  ChevronUp,
  Info,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Target,
  Layers,
  Activity
} from 'lucide-react';

import { UnifiedDivinationResult } from './unified-result-converter';

// アイコンマッピング関数
function getIconComponent(iconName: string) {
  const iconMap: Record<string, React.ComponentType<any>> = {
    Hash: Star,
    TreePine: Globe,
    Compass: Compass,
    BookOpen: Globe,
    Star: Star,
    Calendar: Calendar,
    Hexagon: Star,
    Home: Globe,
    Sun: Sun,
    Activity: Activity,
    Palette: Star,
    Globe: Globe
  };
  
  const IconComponent = iconMap[iconName] || Star;
  return <IconComponent className="w-5 h-5 text-white" />;
}

interface UnifiedResultDisplayProps {
  results: UnifiedDivinationResult[];
  primaryDivination?: string;
  showComparison?: boolean;
  showIntegration?: boolean;
}

interface DivinationResult {
  type: string;
  name: string;
  iconName: string; // アイコン名を文字列で保持
  summary: string;
  accuracy: number;
  keyInsights: KeyInsight[];
  timing?: TimingInfo;
  advice?: string;
  warnings?: string[];
  detailedResult?: any;
  timestamp: Date;
}

interface KeyInsight {
  category: string;
  message: string;
  importance: 'high' | 'medium' | 'low';
  icon?: React.ReactNode;
}

interface TimingInfo {
  favorable: string[];
  challenging: string[];
  keyDates?: Date[];
}

const categoryIcons: Record<string, React.ReactNode> = {
  love: <Heart className="w-4 h-4" />,
  career: <TrendingUp className="w-4 h-4" />,
  health: <Activity className="w-4 h-4" />,
  spiritual: <Eye className="w-4 h-4" />,
  wealth: <Star className="w-4 h-4" />,
  general: <Compass className="w-4 h-4" />
};

const importanceColors = {
  high: 'text-amber-400 border-amber-400/30 bg-amber-400/10',
  medium: 'text-blue-400 border-blue-400/30 bg-blue-400/10',
  low: 'text-gray-400 border-gray-400/30 bg-gray-400/10'
};

export default function UnifiedResultDisplay({
  results,
  primaryDivination,
  showComparison = true,
  showIntegration = true
}: UnifiedResultDisplayProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'integration'>('overview');
  const [selectedDivination, setSelectedDivination] = useState<string>(
    primaryDivination || results[0]?.type || ''
  );

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const selectedResult = results.find(r => r.type === selectedDivination);
  const averageAccuracy = results.reduce((sum, r) => sum + r.accuracy, 0) / results.length;

  // 統合分析
  const integratedInsights = generateIntegratedInsights(results);
  const commonThemes = findCommonThemes(results);
  const conflictingAdvice = findConflicts(results);

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          統合占術結果
        </h2>
        <p className="text-gray-400">
          {results.length}つの占術による多角的な洞察
        </p>
        <div className="flex items-center justify-center gap-2 text-sm">
          <Shield className="w-4 h-4 text-green-400" />
          <span className="text-gray-300">
            総合精度: {averageAccuracy.toFixed(1)}%
          </span>
        </div>
      </motion.div>

      {/* タブナビゲーション */}
      <div className="flex justify-center">
        <div className="bg-black/30 backdrop-blur-md rounded-full p-1 border border-white/10">
          <div className="flex gap-1">
            {(['overview', 'details', 'integration'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab === 'overview' && '概要'}
                {tab === 'details' && '詳細'}
                {tab === 'integration' && '統合分析'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* 概要タブ */}
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-4"
          >
            {/* 占術カード一覧 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((result) => (
                <motion.div
                  key={result.type}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => {
                    setSelectedDivination(result.type);
                    setActiveTab('details');
                  }}
                  className={`
                    relative p-6 rounded-2xl backdrop-blur-md cursor-pointer
                    border transition-all duration-300
                    ${selectedDivination === result.type
                      ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-400/50'
                      : 'bg-black/30 border-white/10 hover:border-white/30'
                    }
                  `}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                        {getIconComponent(result.iconName)}
                      </div>
                      <div>
                        <h3 className="font-bold text-white">{result.name}</h3>
                        <p className="text-xs text-gray-400">
                          精度: {result.accuracy}%
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-300 mb-4 line-clamp-3">
                    {result.summary}
                  </p>

                  {/* キーインサイト（上位2つ） */}
                  <div className="space-y-2">
                    {result.keyInsights && result.keyInsights.slice(0, 2).map((insight, idx) => (
                      <div
                        key={idx}
                        className={`text-xs px-3 py-1.5 rounded-full border ${
                          importanceColors[insight.importance]
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {categoryIcons[insight.category] || <Info className="w-3 h-3" />}
                          <span className="truncate">{insight.message}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {result.keyInsights && result.keyInsights.length > 2 && (
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      +{result.keyInsights.length - 2} その他の洞察
                    </p>
                  )}
                </motion.div>
              ))}
            </div>

            {/* クイック統合サマリー */}
            {showIntegration && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-400/30"
              >
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-purple-400" />
                  統合メッセージ
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {integratedInsights.mainMessage}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {commonThemes.slice(0, 3).map((theme, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 text-xs rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30"
                    >
                      {theme}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* 詳細タブ */}
        {activeTab === 'details' && selectedResult && (
          <motion.div
            key="details"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            {/* 占術選択 */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {results.map((result) => (
                <button
                  key={result.type}
                  onClick={() => setSelectedDivination(result.type)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap
                    transition-all duration-300
                    ${selectedDivination === result.type
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'bg-black/30 text-gray-400 hover:text-white border border-white/10'
                    }
                  `}
                >
                  {getIconComponent(result.iconName)}
                  <span className="text-sm font-medium">{result.name}</span>
                </button>
              ))}
            </div>

            {/* 選択された占術の詳細 */}
            <motion.div
              key={selectedResult.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* ヘッダー情報 */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-400/30">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/30 to-pink-500/30">
                      {getIconComponent(selectedResult.iconName)}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">{selectedResult.name}</h3>
                      <p className="text-sm text-gray-400 mt-1">
                        実施日時: {new Date(selectedResult.timestamp).toLocaleString('ja-JP')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-400">{selectedResult.accuracy}%</div>
                    <p className="text-xs text-gray-400">精度</p>
                  </div>
                </div>
                
                <p className="text-gray-300 leading-relaxed">
                  {selectedResult.summary}
                </p>
              </div>

              {/* キーインサイト */}
              <div>
                <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  重要な洞察
                </h4>
                <div className="space-y-3">
                  {selectedResult.keyInsights.map((insight, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className={`p-4 rounded-xl border ${importanceColors[insight.importance]}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          {categoryIcons[insight.category] || <Info className="w-5 h-5" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{insight.message}</p>
                          <p className="text-xs mt-1 opacity-70">
                            カテゴリー: {insight.category} | 重要度: {
                              insight.importance === 'high' ? '高' :
                              insight.importance === 'medium' ? '中' : '低'
                            }
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* タイミング情報 */}
              {selectedResult.timing && (
                <div>
                  <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-400" />
                    タイミング
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-green-500/10 border border-green-400/30">
                      <h5 className="font-medium text-green-400 mb-2 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        好機
                      </h5>
                      <ul className="space-y-1">
                        {selectedResult.timing.favorable.map((time, idx) => (
                          <li key={idx} className="text-sm text-gray-300">• {time}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-400/30">
                      <h5 className="font-medium text-amber-400 mb-2 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        注意時期
                      </h5>
                      <ul className="space-y-1">
                        {selectedResult.timing.challenging.map((time, idx) => (
                          <li key={idx} className="text-sm text-gray-300">• {time}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  {selectedResult.timing.keyDates && (
                    <div className="mt-4 p-4 rounded-xl bg-purple-500/10 border border-purple-400/30">
                      <h5 className="font-medium text-purple-400 mb-2 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        重要な日付
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {selectedResult.timing.keyDates.map((date, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 text-sm rounded-full bg-purple-500/20 text-purple-300"
                          >
                            {new Date(date).toLocaleDateString('ja-JP')}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* アドバイス */}
              {selectedResult.advice && (
                <div className="p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-green-500/10 border border-blue-400/30">
                  <h4 className="text-lg font-bold mb-3 flex items-center gap-2 text-blue-400">
                    <Target className="w-5 h-5" />
                    アドバイス
                  </h4>
                  <p className="text-gray-300 leading-relaxed">
                    {selectedResult.advice}
                  </p>
                </div>
              )}

              {/* 警告 */}
              {selectedResult.warnings && selectedResult.warnings.length > 0 && (
                <div className="p-6 rounded-xl bg-red-500/10 border border-red-400/30">
                  <h4 className="text-lg font-bold mb-3 flex items-center gap-2 text-red-400">
                    <AlertTriangle className="w-5 h-5" />
                    注意事項
                  </h4>
                  <ul className="space-y-2">
                    {selectedResult.warnings.map((warning, idx) => (
                      <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                        <span className="text-red-400 mt-0.5">•</span>
                        <span>{warning}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 詳細データ（展開可能） */}
              {selectedResult.detailedResult && (
                <div className="border border-white/10 rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleSection('detailedData')}
                    className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
                  >
                    <span className="font-medium flex items-center gap-2">
                      <Layers className="w-4 h-4" />
                      詳細データ
                    </span>
                    {expandedSections.detailedData ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                  <AnimatePresence>
                    {expandedSections.detailedData && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 border-t border-white/10">
                          <pre className="text-xs text-gray-400 overflow-x-auto">
                            {JSON.stringify(selectedResult.detailedResult, null, 2)}
                          </pre>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}

        {/* 統合分析タブ */}
        {activeTab === 'integration' && showIntegration && (
          <motion.div
            key="integration"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            {/* 統合メッセージ */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-400/30">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Globe className="w-6 h-6 text-purple-400" />
                統合的な洞察
              </h3>
              <p className="text-gray-300 leading-relaxed text-lg">
                {integratedInsights.mainMessage}
              </p>
              <div className="mt-6 grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-black/30 border border-white/10">
                  <h4 className="font-medium mb-2 text-green-400">強み・チャンス</h4>
                  <ul className="space-y-1">
                    {integratedInsights.strengths.map((strength, idx) => (
                      <li key={idx} className="text-sm text-gray-300">• {strength}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 rounded-xl bg-black/30 border border-white/10">
                  <h4 className="font-medium mb-2 text-amber-400">課題・注意点</h4>
                  <ul className="space-y-1">
                    {integratedInsights.challenges.map((challenge, idx) => (
                      <li key={idx} className="text-sm text-gray-300">• {challenge}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* 共通テーマ */}
            <div>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                共通して示されているテーマ
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {commonThemes.map((theme, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-400/30"
                  >
                    <h4 className="font-medium mb-2 text-amber-400">{theme}</h4>
                    <p className="text-sm text-gray-300">
                      {results.filter(r => 
                        r.keyInsights.some(i => i.message.includes(theme))
                      ).length} つの占術で言及
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* 占術間の比較 */}
            {showComparison && (
              <div>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-blue-400" />
                  占術間の比較分析
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left p-3 text-sm font-medium text-gray-400">占術</th>
                        <th className="text-center p-3 text-sm font-medium text-gray-400">精度</th>
                        <th className="text-left p-3 text-sm font-medium text-gray-400">主要メッセージ</th>
                        <th className="text-center p-3 text-sm font-medium text-gray-400">傾向</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((result) => (
                        <tr key={result.type} className="border-b border-white/5">
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              {getIconComponent(result.iconName)}
                              <span className="text-sm text-gray-300">{result.name}</span>
                            </div>
                          </td>
                          <td className="text-center p-3">
                            <span className={`text-sm font-medium ${
                              result.accuracy >= 90 ? 'text-green-400' :
                              result.accuracy >= 80 ? 'text-blue-400' :
                              result.accuracy >= 70 ? 'text-amber-400' :
                              'text-red-400'
                            }`}>
                              {result.accuracy}%
                            </span>
                          </td>
                          <td className="p-3">
                            <p className="text-sm text-gray-300 line-clamp-2">
                              {result.keyInsights?.[0]?.message || result.summary}
                            </p>
                          </td>
                          <td className="text-center p-3">
                            {analyzeTendency(result) === 'positive' && (
                              <span className="text-green-400">ポジティブ</span>
                            )}
                            {analyzeTendency(result) === 'neutral' && (
                              <span className="text-blue-400">中立</span>
                            )}
                            {analyzeTendency(result) === 'cautious' && (
                              <span className="text-amber-400">注意</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 矛盾点の分析 */}
            {conflictingAdvice.length > 0 && (
              <div className="p-6 rounded-xl bg-amber-500/10 border border-amber-400/30">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-amber-400">
                  <AlertTriangle className="w-5 h-5" />
                  異なる視点・注意点
                </h3>
                <p className="text-sm text-gray-300 mb-4">
                  以下の点については、占術によって異なる見解が示されています。
                  複数の可能性を考慮して判断することをお勧めします。
                </p>
                <ul className="space-y-2">
                  {conflictingAdvice.map((conflict, idx) => (
                    <li key={idx} className="text-sm text-gray-300">
                      • {conflict}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 統合的アクションプラン */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-green-500/10 to-blue-500/10 border border-green-400/30">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-green-400">
                <Target className="w-5 h-5" />
                統合的アクションプラン
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2 text-blue-400">今すぐ始められること</h4>
                  <ul className="space-y-1">
                    {integratedInsights.immediateActions.map((action, idx) => (
                      <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2 text-purple-400">中長期的な取り組み</h4>
                  <ul className="space-y-1">
                    {integratedInsights.longTermGoals.map((goal, idx) => (
                      <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                        <Target className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                        <span>{goal}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ヘルパー関数

function generateIntegratedInsights(results: DivinationResult[]) {
  // 実際の実装では、より高度な分析ロジックを使用
  const allInsights = results.flatMap(r => r.keyInsights || []).filter(insight => insight != null);
  
  const mainMessage = `複数の占術が共通して示しているのは、あなたの内なる力と可能性の開花の時期が到来していることです。
    特に${allInsights.length > 0 ? findMostCommonCategory(allInsights) : '総合運'}の領域において重要な変化が起きており、
    この流れを最大限に活かすことで、大きな成長と成功を手にすることができるでしょう。`;

  const strengths = [
    '直感力と洞察力の高まり',
    '新しいチャンスへの準備が整っている',
    '周囲からのサポートが期待できる',
    'エネルギーレベルの上昇'
  ];

  const challenges = [
    '過度な期待による焦り',
    'エネルギーの分散に注意',
    '古いパターンからの脱却が必要',
    '感情的な浮き沈みへの対処'
  ];

  const immediateActions = [
    '毎日5分の瞑想で内なる声に耳を傾ける',
    '感謝日記をつけて良いエネルギーを増幅させる',
    '不要なものを手放し、新しいスペースを作る'
  ];

  const longTermGoals = [
    '自己成長のための学習計画を立てる',
    '人間関係の質を高める取り組み',
    'ライフワークの明確化と実践'
  ];

  return {
    mainMessage,
    strengths,
    challenges,
    immediateActions,
    longTermGoals
  };
}

function findCommonThemes(results: DivinationResult[]): string[] {
  const themes: Record<string, number> = {};
  
  results.forEach(result => {
    if (result.keyInsights && Array.isArray(result.keyInsights)) {
      result.keyInsights.forEach(insight => {
        if (insight && insight.message) {
          // キーワード抽出（実際の実装ではNLP技術を使用）
          const keywords = extractKeywords(insight.message);
          keywords.forEach(keyword => {
            themes[keyword] = (themes[keyword] || 0) + 1;
          });
        }
      });
    }
  });

  return Object.entries(themes)
    .filter(([_, count]) => count >= 2)
    .sort(([, a], [, b]) => b - a)
    .map(([theme]) => theme)
    .slice(0, 6);
}

function findConflicts(results: DivinationResult[]): string[] {
  // 実際の実装では、より高度な矛盾検出ロジックを使用
  const conflicts: string[] = [];
  
  // タイミングの矛盾をチェック
  const timingAdvice = results
    .filter(r => r.timing)
    .map(r => r.timing!.favorable);
  
  if (timingAdvice.length > 1) {
    // 簡略化された例
    conflicts.push('最適なタイミングについて異なる見解があります');
  }

  return conflicts;
}

function analyzeTendency(result: DivinationResult): 'positive' | 'neutral' | 'cautious' {
  const positiveKeywords = ['成功', '幸運', 'チャンス', '成長', '達成'];
  const cautionKeywords = ['注意', '警告', '困難', '課題', '障害'];
  
  const message = result.summary + result.keyInsights.map(i => i.message).join(' ');
  
  const positiveCount = positiveKeywords.filter(k => message.includes(k)).length;
  const cautionCount = cautionKeywords.filter(k => message.includes(k)).length;
  
  if (positiveCount > cautionCount) return 'positive';
  if (cautionCount > positiveCount) return 'cautious';
  return 'neutral';
}

function findMostCommonCategory(insights: KeyInsight[]): string {
  const categories: Record<string, number> = {};
  
  insights.forEach(insight => {
    // insightが存在しない、またはcategoryがない場合はスキップ
    if (!insight || !insight.category) return;
    const category = insight.category;
    categories[category] = (categories[category] || 0) + 1;
  });
  
  const sorted = Object.entries(categories).sort(([, a], [, b]) => b - a);
  
  const categoryNames: Record<string, string> = {
    love: '恋愛・人間関係',
    career: '仕事・キャリア',
    health: '健康',
    spiritual: 'スピリチュアル',
    wealth: '金運・財運',
    general: '総合運'
  };
  
  return categoryNames[sorted[0]?.[0]] || '人生全般';
}

function extractKeywords(text: string): string[] {
  // 簡略化されたキーワード抽出
  const keywords = [
    '成長', '変化', 'チャンス', '愛', '成功', '学び',
    '調和', 'バランス', '直感', '創造性', '豊かさ',
    '癒し', '解放', '新しい始まり', '完成', '統合'
  ];
  
  return keywords.filter(keyword => text.includes(keyword));
}