'use client';

import React, { useState } from 'react';
import { User, Calendar, MapPin, MessageCircle, X } from 'lucide-react';

interface ParameterBadgeProps {
  fullName?: string;
  birthDate?: string;
  birthPlace?: string;
  question?: string;
}

export function ParameterBadge({ fullName, birthDate, birthPlace, question }: ParameterBadgeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState<{
    fullName: string;
    birthDate: string;
    birthPlace: string;
    question: string;
  } | null>(null);

  React.useEffect(() => {
    const savedData = localStorage.getItem('uranai_user_data');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setUserData({
          fullName: parsed.fullName || '未設定',
          birthDate: parsed.birthDate || '未設定',
          birthPlace: parsed.birthPlace || '未設定',
          question: parsed.question || '未設定'
        });
      } catch (error) {
        console.error('ユーザーデータの読み込みエラー:', error);
      }
    }
  }, []);

  const displayData = userData || {
    fullName: fullName || '未設定',
    birthDate: birthDate || '未設定',
    birthPlace: birthPlace || '未設定',
    question: question || '未設定'
  };

  return (
    <>
      {/* フローティングバッジ */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-40 group"
        aria-label="パラメータを表示"
      >
        <div className="relative">
          {/* 外側の宇宙的なリング */}
          <div className="absolute inset-[-8px] bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-purple-500/20 
                          blur-xl rounded-full animate-spin-slow" />
          
          {/* 内側のグロー効果 */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-400/40 to-blue-400/40 
                          blur-lg rounded-full animate-pulse" />
          
          {/* バッジ本体 */}
          <div className="relative bg-gradient-to-br from-purple-900/80 to-blue-900/80 
                          backdrop-blur-xl border border-white/30 rounded-full p-4 
                          hover:from-purple-800/90 hover:to-blue-800/90 hover:border-white/50 
                          transition-all duration-500 hover:scale-110 hover:rotate-12 transform
                          shadow-[0_0_30px_rgba(168,85,247,0.4)]">
            <User className="w-6 h-6 text-white animate-gentle-float" />
            
            {/* 小さな星の装飾 */}
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full animate-twinkle" />
            <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-blue-300 rounded-full animate-twinkle-delayed" />
          </div>
          
          {/* ホバー時のヒント（宇宙的スタイル） */}
          <div className="absolute -top-14 left-1/2 -translate-x-1/2 whitespace-nowrap
                          bg-gradient-to-r from-purple-900/90 to-blue-900/90 backdrop-blur-md
                          text-white text-xs px-4 py-2 rounded-full border border-white/20
                          opacity-0 group-hover:opacity-100 transition-all duration-300
                          pointer-events-none shadow-[0_0_20px_rgba(168,85,247,0.3)]">
            <span className="flex items-center gap-2">
              <span className="inline-block w-1 h-1 bg-white rounded-full animate-pulse" />
              あなたの情報
              <span className="inline-block w-1 h-1 bg-white rounded-full animate-pulse" />
            </span>
          </div>
        </div>
      </button>

      {/* ポップアップ詳細 */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* 背景オーバーレイ */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* ポップアップコンテンツ */}
          <div className="relative bg-slate-900/90 backdrop-blur-xl border border-white/20 
                          rounded-3xl p-8 max-w-md w-full shadow-2xl
                          animate-in fade-in zoom-in duration-300">
            {/* 閉じるボタン */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-white/60 hover:text-white/100 
                         transition-colors duration-200 z-10 p-2 rounded-full
                         hover:bg-white/10"
              aria-label="閉じる"
            >
              <X className="w-6 h-6" />
            </button>
            
            {/* タイトル */}
            <h3 className="text-xl font-light text-white mb-6 text-center">
              あなたの情報
            </h3>
            
            {/* パラメータ詳細 */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white/60 text-sm">お名前</p>
                  <p className="text-white">{displayData.fullName}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white/60 text-sm">生年月日</p>
                  <p className="text-white">{displayData.birthDate}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white/60 text-sm">出生地</p>
                  <p className="text-white">{displayData.birthPlace}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <MessageCircle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white/60 text-sm">ご相談内容</p>
                  <p className="text-white text-sm leading-relaxed">{displayData.question}</p>
                </div>
              </div>
            </div>
            
            {/* 装飾的な要素 */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl" />
          </div>
        </div>
      )}
    </>
  );
}