'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TarotEngine, SpreadType, TarotCard } from '@/lib/divination/engines/tarot-engine';
import { DivinationInput } from '@/lib/divination/base-engine';
import { Card } from '@/components/ui/card';

interface TarotInteractiveProps {
  input: DivinationInput;
  environment?: any;
}

export function TarotInteractive({ input, environment }: TarotInteractiveProps) {
  const [selectedSpread, setSelectedSpread] = useState<SpreadType>('three-card');
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [reading, setReading] = useState<any>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const engine = new TarotEngine(input, environment, {
    spreadType: selectedSpread,
    allowUserSelection: isSelecting,
    selectedCardIndices: selectedCards
  });

  const spreads = engine.getAvailableSpreads();
  const deckSize = engine.getDeckSize();

  const handleSpreadChange = (spread: SpreadType) => {
    setSelectedSpread(spread);
    setSelectedCards([]);
    setReading(null);
  };

  const handleCardSelect = (index: number) => {
    const spread = spreads.find(s => s.type === selectedSpread);
    if (!spread) return;

    if (selectedCards.includes(index)) {
      setSelectedCards(selectedCards.filter(i => i !== index));
    } else if (selectedCards.length < spread.cardCount) {
      setSelectedCards([...selectedCards, index]);
    }
  };

  const performReading = () => {
    const newEngine = new TarotEngine(input, environment, {
      spreadType: selectedSpread,
      allowUserSelection: isSelecting,
      selectedCardIndices: selectedCards
    });
    const result = newEngine.calculate();
    setReading(result);
  };

  const resetReading = () => {
    setSelectedCards([]);
    setReading(null);
  };

  if (reading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-purple-300 mb-2">
            {reading.spread.name}
          </h3>
          <p className="text-gray-400">{reading.spread.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reading.positions.map((position: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-4 bg-purple-900/20 border-purple-500/30">
                <h4 className="text-sm font-medium text-purple-300 mb-1">
                  {position.position}
                </h4>
                <h5 className="text-lg font-bold text-white mb-2">
                  {position.card.name}
                </h5>
                <p className="text-sm text-gray-300 mb-2">
                  {position.meaning}
                </p>
                <div className="flex flex-wrap gap-1">
                  {position.card.keywords.map((keyword: string, idx: number) => (
                    <span
                      key={idx}
                      className="text-xs bg-purple-800/40 text-purple-200 px-2 py-1 rounded"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="space-y-4 p-6 bg-purple-900/10 rounded-lg border border-purple-500/20">
          <div>
            <h4 className="text-lg font-semibold text-purple-300 mb-2">
              総合メッセージ
            </h4>
            <p className="text-gray-300">{reading.overallMessage}</p>
          </div>

          {reading.interpretation && (
            <div>
              <h4 className="text-lg font-semibold text-purple-300 mb-2">
                詳細な解釈
              </h4>
              <p className="text-gray-300 mb-2">{reading.interpretation.summary}</p>
              <p className="text-gray-300">{reading.interpretation.synthesis}</p>
            </div>
          )}

          {reading.moonPhaseInfluence && (
            <div>
              <h4 className="text-lg font-semibold text-purple-300 mb-2">
                月相の影響
              </h4>
              <p className="text-gray-300">{reading.moonPhaseInfluence}</p>
            </div>
          )}

          {reading.personalizedGuidance && (
            <div>
              <h4 className="text-lg font-semibold text-purple-300 mb-2">
                あなたへのガイダンス
              </h4>
              <p className="text-gray-300">{reading.personalizedGuidance}</p>
            </div>
          )}
        </div>

        <div className="text-center">
          <button
            onClick={resetReading}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            もう一度占う
          </button>
        </div>
      </div>
    );
  }

  const currentSpread = spreads.find(s => s.type === selectedSpread);
  const cardsNeeded = currentSpread?.cardCount || 3;
  const canPerformReading = !isSelecting || selectedCards.length === cardsNeeded;

  return (
    <div className="space-y-6">
      {/* スプレッド選択 */}
      <div>
        <h3 className="text-lg font-semibold text-purple-300 mb-3">
          スプレッドを選択
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {spreads.map((spread) => (
            <button
              key={spread.type}
              onClick={() => handleSpreadChange(spread.type)}
              className={`p-4 rounded-lg border transition-all ${
                selectedSpread === spread.type
                  ? 'bg-purple-600/30 border-purple-500 text-white'
                  : 'bg-purple-900/20 border-purple-700/50 text-gray-300 hover:bg-purple-800/30'
              }`}
            >
              <div className="font-medium">{spread.name}</div>
              <div className="text-sm opacity-80 mt-1">{spread.description}</div>
              <div className="text-xs mt-2 opacity-60">{spread.cardCount}枚使用</div>
            </button>
          ))}
        </div>
      </div>

      {/* カード選択モード */}
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isSelecting}
            onChange={(e) => {
              setIsSelecting(e.target.checked);
              setSelectedCards([]);
            }}
            className="w-4 h-4 text-purple-600 bg-purple-900/50 border-purple-500 rounded focus:ring-purple-500"
          />
          <span className="text-gray-300">カードを自分で選ぶ</span>
        </label>
        {isSelecting && (
          <span className="text-sm text-purple-300">
            {selectedCards.length} / {cardsNeeded} 枚選択済み
          </span>
        )}
      </div>

      {/* カードデッキ（選択モード時のみ表示） */}
      {isSelecting && (
        <div className="p-4 bg-purple-900/20 rounded-lg border border-purple-700/50">
          <h4 className="text-sm font-medium text-purple-300 mb-3">
            {cardsNeeded}枚のカードを選んでください
          </h4>
          <div className="grid grid-cols-8 md:grid-cols-11 gap-2">
            {Array.from({ length: deckSize }, (_, i) => (
              <motion.button
                key={i}
                onClick={() => handleCardSelect(i)}
                onHoverStart={() => setHoveredCard(i)}
                onHoverEnd={() => setHoveredCard(null)}
                disabled={!selectedCards.includes(i) && selectedCards.length >= cardsNeeded}
                className={`relative aspect-[2/3] rounded border-2 transition-all ${
                  selectedCards.includes(i)
                    ? 'bg-purple-600 border-purple-400'
                    : hoveredCard === i
                    ? 'bg-purple-800/50 border-purple-500'
                    : 'bg-purple-950/50 border-purple-800 hover:border-purple-600'
                } ${
                  !selectedCards.includes(i) && selectedCards.length >= cardsNeeded
                    ? 'opacity-50 cursor-not-allowed'
                    : 'cursor-pointer'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-xs text-purple-200">
                  {selectedCards.indexOf(i) !== -1 ? selectedCards.indexOf(i) + 1 : ''}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* 占いを実行 */}
      <div className="text-center">
        <button
          onClick={performReading}
          disabled={!canPerformReading}
          className={`px-8 py-4 rounded-lg font-medium transition-all ${
            canPerformReading
              ? 'bg-purple-600 hover:bg-purple-700 text-white'
              : 'bg-purple-900/30 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isSelecting && selectedCards.length < cardsNeeded
            ? `あと${cardsNeeded - selectedCards.length}枚選択してください`
            : 'カードを引く'}
        </button>
      </div>
    </div>
  );
}