'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CosmicBackground } from '@/components/ui/cosmic-background';
import { useSession } from '@/hooks/use-session';

export default function EntryPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const router = useRouter();
  const { isAuthenticated, hasCompletedInput, authenticate } = useSession();

  // 認証済みの場合は自動的に適切なページへリダイレクト
  useEffect(() => {
    if (isAuthenticated) {
      if (hasCompletedInput) {
        router.push('/dashboard');
      } else {
        router.push('/input');
      }
    }
  }, [isAuthenticated, hasCompletedInput, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = authenticate(password);
    
    if (success) {
      router.push('/input');
    } else {
      setError('呪文が違います...');
      setIsShaking(true);
      setTimeout(() => {
        setIsShaking(false);
        setError('');
      }, 1500);
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
      <CosmicBackground />
      
      <div className="relative z-10 w-full max-w-md px-6">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-light text-white mb-4 tracking-wider">
            ORACLE ECHO
          </h1>
          <p className="text-lg text-purple-300 opacity-80">
            宇宙の扉を開く呪文を唱えてください
          </p>
        </div>
        
        <form 
          onSubmit={handleSubmit}
          className={`bg-white/5 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl transition-all duration-300 ${
            isShaking ? 'animate-shake' : ''
          }`}
        >
          <div className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-light text-purple-200 mb-2">
                呪文 / Incantation
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-purple-400 focus:bg-white/15 transition-all text-base"
                placeholder="宇宙への鍵を入力..."
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
              />
            </div>
            
            {error && (
              <p className="text-red-400 text-sm text-center animate-pulse">
                {error}
              </p>
            )}
            
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 font-light tracking-wide"
            >
              扉を開く
            </button>
          </div>
        </form>
        
        <div className="mt-8 text-center">
          <p className="text-xs text-white/40">
            特別な方々のみへのプレビュー版です
          </p>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
          20%, 40%, 60%, 80% { transform: translateX(10px); }
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}