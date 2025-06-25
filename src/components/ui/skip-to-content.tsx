'use client';

import React from 'react';

export const SkipToContent: React.FC = () => {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 px-4 py-2 bg-purple-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
    >
      メインコンテンツへスキップ
    </a>
  );
};