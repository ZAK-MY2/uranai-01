'use client';

import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-8 text-center">
              <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              
              <h1 className="text-2xl font-bold text-white mb-4">
                重大なエラーが発生しました
              </h1>
              
              <p className="text-gray-300 mb-6">
                アプリケーション全体でエラーが発生しました。
                ページを再読み込みしてください。
              </p>

              <button
                onClick={reset}
                className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                アプリケーションを再起動
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}