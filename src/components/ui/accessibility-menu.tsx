'use client';

import React, { useState } from 'react';
import { Settings, Eye, Move, Type, X } from 'lucide-react';
import { useAccessibility } from '@/hooks/use-accessibility';

interface AccessibilityMenuProps {
  onClose?: () => void;
}

export const AccessibilityMenu: React.FC<AccessibilityMenuProps> = ({ onClose }) => {
  const [isOpen, setIsOpen] = useState(true); // ハンバーガーメニューから呼ばれるので初期状態はtrue
  const { fontSize, changeFontSize, isHighContrast, isReducedMotion } = useAccessibility();

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  if (!isOpen) return null;

  return (
    <>

      {/* アクセシビリティメニューパネル */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* オーバーレイ */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
            aria-hidden="true"
          />

          {/* メニューコンテンツ */}
          <div 
            className="relative bg-white/10 backdrop-blur-md rounded-2xl p-6 max-w-md w-full border border-white/20"
            role="dialog"
            aria-labelledby="accessibility-title"
            aria-modal="true"
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
              aria-label="閉じる"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 id="accessibility-title" className="text-xl font-light text-white mb-6">
              アクセシビリティ設定
            </h2>

            {/* 文字サイズ設定 */}
            <div className="mb-6">
              <h3 className="flex items-center gap-2 text-white/80 mb-3">
                <Type className="w-4 h-4" />
                文字サイズ
              </h3>
              <div className="flex gap-3">
                <button
                  onClick={() => changeFontSize('normal')}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    fontSize === 'normal' 
                      ? 'bg-purple-600/50 text-white' 
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                  aria-pressed={fontSize === 'normal'}
                >
                  標準
                </button>
                <button
                  onClick={() => changeFontSize('large')}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    fontSize === 'large' 
                      ? 'bg-purple-600/50 text-white' 
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                  aria-pressed={fontSize === 'large'}
                >
                  大
                </button>
                <button
                  onClick={() => changeFontSize('extra-large')}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    fontSize === 'extra-large' 
                      ? 'bg-purple-600/50 text-white' 
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                  aria-pressed={fontSize === 'extra-large'}
                >
                  特大
                </button>
              </div>
            </div>

            {/* システム設定の表示 */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-white/80">
                <Eye className="w-4 h-4" />
                <span>高コントラストモード:</span>
                <span className={isHighContrast ? 'text-green-400' : 'text-white/50'}>
                  {isHighContrast ? '有効' : '無効'}
                </span>
              </div>
              <div className="flex items-center gap-3 text-white/80">
                <Move className="w-4 h-4" />
                <span>動きの削減:</span>
                <span className={isReducedMotion ? 'text-green-400' : 'text-white/50'}>
                  {isReducedMotion ? '有効' : '無効'}
                </span>
              </div>
            </div>

            {/* 説明 */}
            <p className="mt-4 text-sm text-white/60">
              高コントラストモードと動きの削減は、システムの設定に従います。
            </p>
          </div>
        </div>
      )}
    </>
  );
};