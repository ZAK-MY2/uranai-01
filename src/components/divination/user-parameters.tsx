'use client';

import React, { useEffect, useState } from 'react';
import { Calendar, User, MapPin, MessageCircle, Clock } from 'lucide-react';

interface UserData {
  fullName: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  currentLocation: {
    latitude: number;
    longitude: number;
  } | null;
  question: string;
  questionCategory: string;
}

export function UserParameters() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedData = localStorage.getItem('uranai_user_data');
    if (savedData) {
      setUserData(JSON.parse(savedData));
    }
    setIsLoading(false);
  }, []);

  // ローディング中はnullを返してHydrationエラーを防ぐ
  if (isLoading || !userData) {
    return null;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 mb-8">
      <h3 className="text-lg font-light text-white mb-4">🌟 あなたの基本情報</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 基本情報 */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <User className="w-4 h-4 text-purple-400" />
            <div>
              <span className="text-xs text-white/50">お名前</span>
              <p className="text-white">{userData.fullName}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-purple-400" />
            <div>
              <span className="text-xs text-white/50">生年月日</span>
              <p className="text-white">{formatDate(userData.birthDate)}</p>
            </div>
          </div>
          
          {userData.birthTime && (
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-purple-400" />
              <div>
                <span className="text-xs text-white/50">生誕時刻</span>
                <p className="text-white">{userData.birthTime}</p>
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-3">
            <MapPin className="w-4 h-4 text-purple-400" />
            <div>
              <span className="text-xs text-white/50">出生地</span>
              <p className="text-white">{userData.birthPlace}</p>
            </div>
          </div>
        </div>
        
        {/* 相談内容と位置情報 */}
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <MessageCircle className="w-4 h-4 text-purple-400 mt-1" />
            <div className="flex-1">
              <span className="text-xs text-white/50">ご相談カテゴリ</span>
              <p className="text-white mb-2">{userData.questionCategory}</p>
              <span className="text-xs text-white/50">ご相談内容</span>
              <p className="text-white text-sm line-clamp-3">{userData.question}</p>
            </div>
          </div>
          
          {userData.currentLocation && (
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-green-400" />
              <div>
                <span className="text-xs text-white/50">現在地</span>
                <p className="text-white text-sm">
                  緯度: {userData.currentLocation.latitude.toFixed(4)}°<br />
                  経度: {userData.currentLocation.longitude.toFixed(4)}°
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* 環境データ使用状況 */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${userData.currentLocation ? 'bg-green-400' : 'bg-yellow-400'}`} />
          <span className="text-xs text-white/60">
            {userData.currentLocation 
              ? '現在地の環境データを使用した精密占術' 
              : '標準環境データによる占術'}
          </span>
        </div>
      </div>
    </div>
  );
}