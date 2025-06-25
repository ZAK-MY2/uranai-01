'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { CosmicBackground } from '@/components/ui/cosmic-background';
import { mockDivinationData } from '@/lib/mock/divination-data';
import { mockEnvironmentData } from '@/lib/mock/environment-data';
import { DivinationInput } from '@/lib/divination/base-engine';

const UserParameters = dynamic(
  () => import('@/components/divination/user-parameters').then(mod => mod.UserParameters),
  { ssr: false }
);

const TarotInteractive = dynamic(
  () => import('@/components/divination/tarot-interactive').then(mod => mod.TarotInteractive),
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

// タロットカードのシンボルコンポーネント
const TarotCardSymbol = ({ card }: { card: any }) => {
  const majorArcanaSymbols: { [key: string]: string } = {
    '愚者': '0',
    '魔術師': 'I',
    '女教皇': 'II',
    '女帝': 'III',
    '皇帝': 'IV',
    '教皇': 'V',
    '恋人': 'VI',
    '戦車': 'VII',
    '力': 'VIII',
    '隠者': 'IX',
    '運命の輪': 'X',
    '正義': 'XI',
    '吊られた男': 'XII',
    '死神': 'XIII',
    '節制': 'XIV',
    '悪魔': 'XV',
    '塔': 'XVI',
    '星': 'XVII',
    '月': 'XVIII',
    '太陽': 'XIX',
    '審判': 'XX',
    '世界': 'XXI'
  };

  return (
    <div className="relative w-48 h-72 bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-md rounded-lg border border-white/20 p-4 flex flex-col items-center justify-center">
      <div className="text-6xl font-serif text-white/80 mb-4">
        {majorArcanaSymbols[card.name] || card.number}
      </div>
      <h4 className="text-xl font-light text-white mb-2">{card.name}</h4>
      <div className="text-sm text-white/60 text-center">
        {card.keywords.map((keyword: string, index: number) => (
          <span key={index}>
            {keyword}
            {index < card.keywords.length - 1 && ' • '}
          </span>
        ))}
      </div>
    </div>
  );
};

export default function TarotPage() {
  const [, setUserInput] = useState<UserInputData | null>(null);
  const [tarotResult, setTarotResult] = useState(mockDivinationData.tarot);
  const [selectedCard, setSelectedCard] = useState<'past' | 'present' | 'future'>('present');
  const [showInteractive, setShowInteractive] = useState(false);
  const [divinationInput, setDivinationInput] = useState<DivinationInput | null>(null);

  useEffect(() => {
    // LocalStorageからユーザーデータを読み込み
    const storedData = localStorage.getItem('uranai_user_data');
    if (storedData) {
      try {
        const userData: UserInputData = JSON.parse(storedData);
        setUserInput(userData);
        
        // DivinationInput形式に変換
        const divInput: DivinationInput = {
          fullName: userData.fullName,
          birthDate: new Date(userData.birthDate),
          birthTime: userData.birthTime,
          birthPlace: userData.birthPlace,
          question: userData.question,
          questionCategory: userData.questionCategory
        };
        setDivinationInput(divInput);
        
        // 実際のタロット計算を実行
        const calculatedResult = calculateTarot(userData);
        setTarotResult(calculatedResult);
      } catch (error) {
        console.error('ユーザーデータの読み込みエラー:', error);
      }
    }
  }, []);

  // タロット占いの計算関数
  function calculateTarot(userData: UserInputData) {
    const birthDate = new Date(userData.birthDate);
    const currentDate = new Date();
    
    // 生年月日と質問内容からカードを選択（実際のアルゴリズム）
    const majorArcana = [
      { name: '愚者', number: 0, arcana: 'major', image: 'fool', keywords: ['新しい始まり', '冒険', '無邪気'], interpretation: '新たなスタートを切る時', description: '新たなスタートを切る時' },
      { name: '魔術師', number: 1, arcana: 'major', image: 'magician', keywords: ['意志の力', '創造', '実行'], interpretation: '意志の力で目標を実現する', description: '意志の力で目標を実現する' },
      { name: '女教皇', number: 2, arcana: 'major', image: 'priestess', keywords: ['直感', '内なる知恵', '秘密'], interpretation: '内なる声に耳を傾ける時', description: '内なる声に耳を傾ける時' },
      { name: '女帝', number: 3, arcana: 'major', image: 'empress', keywords: ['豊穣', '母性', '創造性'], interpretation: '豊かさと創造力の時期', description: '豊かさと創造力の時期' },
      { name: '皇帝', number: 4, arcana: 'major', image: 'emperor', keywords: ['権威', '安定', '統制'], interpretation: '秩序と安定を築く', description: '秩序と安定を築く' },
      { name: '教皇', number: 5, arcana: 'major', image: 'hierophant', keywords: ['精神的指導', '伝統', '学び'], interpretation: '精神的な成長の時', description: '精神的な成長の時' },
      { name: '恋人', number: 6, arcana: 'major', image: 'lovers', keywords: ['愛', '選択', '調和'], interpretation: '重要な選択を迫られる', description: '重要な選択を迫られる' },
      { name: '戦車', number: 7, arcana: 'major', image: 'chariot', keywords: ['勝利', '意志力', '前進'], interpretation: '困難を乗り越えて前進', description: '困難を乗り越えて前進' },
      { name: '力', number: 8, arcana: 'major', image: 'strength', keywords: ['内なる力', '勇気', '忍耐'], interpretation: '内なる力を発揮する時', description: '内なる力を発揮する時' },
      { name: '隠者', number: 9, arcana: 'major', image: 'hermit', keywords: ['内省', '探求', '導き'], interpretation: '内面を見つめ直す時期', description: '内面を見つめ直す時期' }
    ];

    // シンプルなハッシュ関数でカードを選択
    const seed = birthDate.getTime() + userData.fullName.length + userData.question.length;
    const pastIndex = seed % majorArcana.length;
    const presentIndex = (seed + 1) % majorArcana.length;
    const futureIndex = (seed + 2) % majorArcana.length;

    return {
      ...mockDivinationData.tarot,
      cards: {
        past: majorArcana[pastIndex],
        present: majorArcana[presentIndex],
        future: majorArcana[futureIndex]
      },
      interpretation: `${userData.questionCategory}について、あなたのタロットが示す道筋。過去の「${majorArcana[pastIndex].name}」から現在の「${majorArcana[presentIndex].name}」へ、そして未来の「${majorArcana[futureIndex].name}」へと向かう流れが見えます。質問「${userData.question}」に対する答えは、${majorArcana[presentIndex].description}という現在の状況を受け入れることから始まります。`
    };
  }

  const { tarot } = { tarot: tarotResult };

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-slate-900 to-slate-800">
      <CosmicBackground />
      
      {/* ヘッダー */}
      <header className="relative z-20 bg-slate-900/50 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between">
          <Link href="/" className="text-white hover:text-blue-300 transition-colors">
            ← ダッシュボードに戻る
          </Link>
          <h1 className="text-2xl font-light text-white">タロット詳細分析</h1>
          <div className="w-32"></div>
        </div>
      </header>

      <main className="relative z-10 pt-10 pb-20">
        <div className="max-w-7xl mx-auto px-5">
          <UserParameters />
          
          {/* インタラクティブモード切り替え */}
          <div className="flex justify-center mb-8">
            <button
              onClick={() => setShowInteractive(!showInteractive)}
              className="px-6 py-3 bg-purple-600/30 hover:bg-purple-600/50 text-white rounded-full transition-colors border border-purple-500/50"
            >
              {showInteractive ? '通常表示に戻る' : 'インタラクティブモードで占う'}
            </button>
          </div>
          
          {/* インタラクティブタロット */}
          {showInteractive && divinationInput ? (
            <div className="bg-white/5 backdrop-blur-md rounded-3xl p-10 mb-10 border border-white/10">
              <TarotInteractive 
                input={divinationInput} 
                environment={mockEnvironmentData}
              />
            </div>
          ) : null}
          
          {/* 3カードスプレッド（通常モード時のみ表示） */}
          {!showInteractive && (
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-10 mb-10 border border-white/10">
            <h2 className="text-3xl font-light text-white text-center mb-10">過去・現在・未来の3カードリーディング</h2>
            
            {/* カード配置 */}
            <div className="flex justify-center items-center gap-8 mb-10">
              {(['past', 'present', 'future'] as const).map((time) => {
                const card = tarot.cards[time];
                const isSelected = selectedCard === time;
                const labels = { past: '過去', present: '現在', future: '未来' };
                
                return (
                  <div
                    key={time}
                    className={`cursor-pointer transition-all duration-500 ${
                      isSelected ? 'scale-110 z-10' : 'scale-100 opacity-70 hover:opacity-100'
                    }`}
                    onClick={() => setSelectedCard(time)}
                  >
                    <p className="text-center text-white/70 mb-4">{labels[time]}</p>
                    <TarotCardSymbol card={card} />
                  </div>
                );
              })}
            </div>

            {/* 選択されたカードの詳細 */}
            <div className="bg-white/5 rounded-xl p-8 max-w-3xl mx-auto">
              <h3 className="text-2xl font-light text-white text-center mb-6">
                {tarot.cards[selectedCard].name} - {selectedCard === 'past' ? '過去' : selectedCard === 'present' ? '現在' : '未来'}
              </h3>
              <p className="text-lg text-white/80 text-center leading-relaxed">
                {tarot.cards[selectedCard].interpretation}
              </p>
            </div>
          </div>

          )}
          
          {/* カードの配置図（インフォグラフィック）（通常モード時のみ表示） */}
          {!showInteractive && (
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-10 mb-10 border border-white/10">
            <h3 className="text-2xl font-light text-white text-center mb-8">エネルギーの流れ</h3>
            
            <div className="relative max-w-4xl mx-auto">
              <svg viewBox="0 0 800 300" className="w-full h-auto">
                {/* エネルギーフローライン */}
                <path
                  d="M 100 150 Q 250 100 400 150 T 700 150"
                  fill="none"
                  stroke="url(#gradient-flow)"
                  strokeWidth="3"
                  opacity="0.5"
                />
                
                {/* 過去のエネルギー */}
                <circle cx="100" cy="150" r="60" fill="rgba(139,92,246,0.2)" stroke="rgba(139,92,246,0.6)" strokeWidth="2" />
                <text x="100" y="155" textAnchor="middle" className="fill-white text-lg font-light">過去</text>
                <text x="100" y="230" textAnchor="middle" className="fill-white/60 text-sm">新しい始まり</text>
                
                {/* 現在のエネルギー */}
                <circle cx="400" cy="150" r="80" fill="rgba(99,102,241,0.3)" stroke="rgba(99,102,241,0.8)" strokeWidth="3" />
                <text x="400" y="155" textAnchor="middle" className="fill-white text-xl font-light">現在</text>
                <text x="400" y="250" textAnchor="middle" className="fill-white/60 text-sm">希望と癒し</text>
                
                {/* 未来のエネルギー */}
                <circle cx="700" cy="150" r="60" fill="rgba(79,70,229,0.2)" stroke="rgba(79,70,229,0.6)" strokeWidth="2" />
                <text x="700" y="155" textAnchor="middle" className="fill-white text-lg font-light">未来</text>
                <text x="700" y="230" textAnchor="middle" className="fill-white/60 text-sm">完成と成就</text>
                
                <defs>
                  <linearGradient id="gradient-flow" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="50%" stopColor="#6366F1" />
                    <stop offset="100%" stopColor="#4F46E5" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          )}
          
          {/* 生データ：カード引き結果（通常モード時のみ表示） */}
          {!showInteractive && (
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-10 mb-10 border border-white/10">
            <h3 className="text-2xl font-light text-white text-center mb-8">引いたカードの詳細データ</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(tarot.cards).map(([time, card]) => (
                <div key={time} className="bg-white/5 rounded-xl p-6">
                  <p className="text-white/50 text-sm mb-2 uppercase">{time}</p>
                  <p className="text-2xl font-light text-white mb-2">{card.name}</p>
                  <p className="text-white/70 mb-3">大アルカナ {card.number}番</p>
                  
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-white/50">元素：</span>
                      <span className="text-white/80">
                        {card.number === 0 ? '風' : 
                         card.number === 17 ? '風と水' :
                         card.number === 21 ? '地' : '火'}
                      </span>
                    </div>
                    <div>
                      <span className="text-white/50">惑星：</span>
                      <span className="text-white/80">
                        {card.number === 0 ? '天王星' : 
                         card.number === 17 ? '水瓶座' :
                         card.number === 21 ? '土星' : '太陽'}
                      </span>
                    </div>
                    <div>
                      <span className="text-white/50">数秘術：</span>
                      <span className="text-white/80">
                        {card.number === 0 ? '0（無限の可能性）' : 
                         card.number === 17 ? '8（1+7）' :
                         card.number === 21 ? '3（2+1）' : '1'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 text-center text-white/50">
              <p>※ ライダー・ウェイト版タロットに基づく解釈</p>
              <p>※ 各カードの元素・惑星対応は伝統的占星術に準拠</p>
            </div>
          </div>

          )}
          
          {/* 総合メッセージ（通常モード時のみ表示） */}
          {!showInteractive && (
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-10 border border-white/10">
            <h3 className="text-2xl font-light text-white text-center mb-8">総合的なメッセージ</h3>
            
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-8">
                <p className="text-3xl font-light text-white mb-4">
                  ✦ {tarot.overallMessage} ✦
                </p>
              </div>
              
              <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-xl p-8 border border-purple-500/20">
                <p className="text-lg text-white/80 leading-relaxed">
                  愚者のカードが示す新たな冒険心と、星のカードがもたらす希望のエネルギーが、
                  世界のカードで示される完全な成就へと導いています。
                  今は恐れずに前進し、直感を信じて行動する時です。
                  宇宙はあなたの旅路を祝福し、成功へと導いています。
                </p>
              </div>
              
              <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-purple-300 text-2xl mb-2">◐</p>
                  <p className="text-white/70 text-sm">行動の時</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-blue-300 text-2xl mb-2">✦</p>
                  <p className="text-white/70 text-sm">直感を信じて</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-indigo-300 text-2xl mb-2">∞</p>
                  <p className="text-white/70 text-sm">無限の可能性</p>
                </div>
              </div>
            </div>
          </div>
          )}
          
          {/* ナビゲーション */}
          <div className="mt-10 flex justify-center gap-6">
            <Link 
              href="/divination/numerology"
              className="px-8 py-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all duration-300"
            >
              ← 数秘術へ
            </Link>
            <Link 
              href="/divination/astrology"
              className="px-8 py-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all duration-300"
            >
              西洋占星術へ →
            </Link>
          </div>
          
        </div>
      </main>
    </div>
  );
}