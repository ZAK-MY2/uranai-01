'use client';

import React from 'react';

interface CosmicLoadingProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
  fullScreen?: boolean;
}

export const CosmicLoading: React.FC<CosmicLoadingProps> = ({
  message = '太古の叡智にアクセス中...',
  size = 'medium',
  fullScreen = false
}) => {
  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24',
    large: 'w-32 h-32'
  };

  const content = (
    <div className="flex flex-col items-center justify-center gap-6">
      {/* 主要なローディングアニメーション */}
      <div className="relative">
        {/* 外側の回転する輪 */}
        <div className={`${sizeClasses[size]} relative`}>
          <svg
            className="animate-spin-slow"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="url(#gradient-outer)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="70 210"
            />
            <defs>
              <linearGradient id="gradient-outer" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="50%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* 中央の太極図 */}
        <div className={`absolute inset-0 flex items-center justify-center`}>
          <div className={`${size === 'small' ? 'w-10 h-10' : size === 'medium' ? 'w-14 h-14' : 'w-20 h-20'}`}>
            <svg
              className="animate-spin"
              style={{ animationDuration: '8s' }}
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="50" cy="50" r="40" fill="white" fillOpacity="0.1" />
              <path
                d="M 50,10 A 20,20 0 0,1 50,50 A 20,20 0 0,0 50,90 A 40,40 0 0,0 50,10"
                fill="white"
                fillOpacity="0.2"
              />
              <circle cx="50" cy="30" r="8" fill="white" fillOpacity="0.3" />
              <circle cx="50" cy="70" r="8" fill="#1e293b" />
            </svg>
          </div>
        </div>

        {/* 星々のアニメーション */}
        <div className="absolute inset-0">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
              style={{
                top: `${20 + Math.sin(i * 60 * Math.PI / 180) * 35}%`,
                left: `${50 + Math.cos(i * 60 * Math.PI / 180) * 35}%`,
                animationDelay: `${i * 0.2}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* ローディングメッセージ */}
      <div className="text-center">
        <p className="text-white/80 text-sm font-light tracking-wider">{message}</p>
        <div className="flex justify-center gap-1 mt-2">
          <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/95 backdrop-blur-md flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};

// プリセットローディングステート
export const CosmicPageLoading = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
    <CosmicLoading size="large" message="オラクルを読み込み中..." />
  </div>
);

export const CosmicInlineLoading = ({ message }: { message?: string }) => (
  <div className="flex items-center justify-center py-8">
    <CosmicLoading size="small" message={message} />
  </div>
);

export const CosmicButtonLoading = () => (
  <div className="flex items-center gap-2">
    <div className="w-4 h-4">
      <svg
        className="animate-spin"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="15 60"
        />
      </svg>
    </div>
    <span>オラクルと同期中...</span>
  </div>
);