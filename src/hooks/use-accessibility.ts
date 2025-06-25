'use client';

import { useEffect, useState } from 'react';

export const useAccessibility = () => {
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'extra-large'>('normal');

  useEffect(() => {
    // 高コントラストモードの検出
    const highContrastQuery = window.matchMedia('(prefers-contrast: high)');
    setIsHighContrast(highContrastQuery.matches);

    const handleHighContrastChange = (e: MediaQueryListEvent) => {
      setIsHighContrast(e.matches);
    };

    highContrastQuery.addEventListener('change', handleHighContrastChange);

    // 動きの削減設定の検出
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(reducedMotionQuery.matches);

    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };

    reducedMotionQuery.addEventListener('change', handleReducedMotionChange);

    // ローカルストレージから設定を読み込み
    const savedFontSize = localStorage.getItem('fontSize') as 'normal' | 'large' | 'extra-large' | null;
    if (savedFontSize) {
      setFontSize(savedFontSize);
      document.documentElement.classList.add(`font-${savedFontSize}`);
    }

    return () => {
      highContrastQuery.removeEventListener('change', handleHighContrastChange);
      reducedMotionQuery.removeEventListener('change', handleReducedMotionChange);
    };
  }, []);

  const changeFontSize = (size: 'normal' | 'large' | 'extra-large') => {
    // 既存のフォントサイズクラスを削除
    document.documentElement.classList.remove('font-normal', 'font-large', 'font-extra-large');
    
    // 新しいフォントサイズクラスを追加
    if (size !== 'normal') {
      document.documentElement.classList.add(`font-${size}`);
    }
    
    setFontSize(size);
    localStorage.setItem('fontSize', size);
  };

  const announceToScreenReader = (message: string) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  return {
    isHighContrast,
    isReducedMotion,
    fontSize,
    changeFontSize,
    announceToScreenReader
  };
};