'use client';

export function EnvironmentBadge() {
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold z-50">
      開発環境
    </div>
  );
}