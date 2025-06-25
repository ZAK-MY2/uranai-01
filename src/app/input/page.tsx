'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CosmicBackground } from '@/components/ui/cosmic-background';
import RouteGuard from '@/components/auth/route-guard';
import { useSession } from '@/hooks/use-session';

interface UserInput {
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

function UserInputPageContent() {
  const router = useRouter();
  const { markInputCompleted } = useSession();
  const [formData, setFormData] = useState<UserInput>({
    fullName: '',
    birthDate: '',
    birthTime: '',
    birthPlace: '',
    currentLocation: null,
    question: '',
    questionCategory: '総合運'
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [locationStatus, setLocationStatus] = useState<'none' | 'requesting' | 'granted' | 'denied'>('none');
  const [useLocation, setUseLocation] = useState(false);

  const questionCategories = [
    '総合運', '恋愛・結婚', '仕事・転職', '人間関係', 
    '健康', '金運・財運', '学業', '家族', '引越し・移住', 'その他'
  ];

  // 位置情報取得
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('お使いのブラウザでは位置情報がサポートされていません');
      return;
    }

    setLocationStatus('requesting');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({
          ...prev,
          currentLocation: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }
        }));
        setLocationStatus('granted');
      },
      (error) => {
        console.error('位置情報取得エラー:', error);
        setLocationStatus('denied');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  };

  // フォーム送信
  const handleSubmit = () => {
    setIsLoading(true);
    
    // ローカルストレージに保存
    localStorage.setItem('uranai_user_data', JSON.stringify(formData));
    
    // セッションに入力完了をマーク
    markInputCompleted(formData);
    
    // ダッシュボードへリダイレクト（Complexは別途アクセス）
    setTimeout(() => {
      router.push('/');
    }, 1000);
  };

  // バリデーション
  const isStepComplete = (step: number) => {
    switch (step) {
      case 1:
        return formData.fullName && formData.birthDate && formData.birthPlace;
      case 2:
        return formData.question && formData.questionCategory;
      case 3:
        return true; // 位置情報は任意
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-slate-900 to-slate-800">
      <CosmicBackground />
      
      {/* ヘッダー */}
      <header className="relative z-20 bg-slate-900/50 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-white hover:text-blue-300 transition-colors">
              ← ダッシュボードに戻る
            </Link>
            <button
              onClick={() => {
                localStorage.removeItem('uranai_user_data');
                window.location.reload();
              }}
              className="text-white/70 hover:text-white transition-colors text-sm"
            >
              🔄 入力をリセット
            </button>
          </div>
          <h1 className="text-2xl font-light text-white">COSMIC ORACLE 占術診断</h1>
          <div className="w-32"></div>
        </div>
      </header>

      <main className="relative z-10 pt-10 pb-20">
        <div className="max-w-4xl mx-auto px-5">
          
          {/* プログレスバー */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    currentStep >= step 
                      ? 'bg-purple-500 border-purple-500 text-white' 
                      : 'border-white/30 text-white/50'
                  }`}>
                    {step}
                  </div>
                  {step < 3 && (
                    <div className={`w-20 h-1 mx-4 ${
                      currentStep > step ? 'bg-purple-500' : 'bg-white/20'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
            <div className="text-center text-white/70">
              {currentStep === 1 && "基本情報"}
              {currentStep === 2 && "ご相談内容"}
              {currentStep === 3 && "環境設定"}
            </div>
          </div>

          {/* ステップ1: 基本情報 */}
          {currentStep === 1 && (
            <div className="bg-white/5 backdrop-blur-md rounded-3xl p-10 border border-white/10">
              <h2 className="text-3xl font-light text-white text-center mb-8">基本情報をお聞かせください</h2>
              
              <div className="space-y-6 max-w-2xl mx-auto">
                <div>
                  <label className="block text-white text-lg font-light mb-3">
                    お名前（フルネーム）*
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    className="w-full px-6 py-4 bg-white/10 border border-white/30 rounded-xl text-white text-lg placeholder-gray-300 focus:outline-none focus:border-purple-400"
                    placeholder="山田太郎"
                  />
                </div>

                <div>
                  <label className="block text-white text-lg font-light mb-3">
                    生年月日*
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <select
                        value={formData.birthDate.split('-')[0] || ''}
                        onChange={(e) => {
                          const [, month, day] = formData.birthDate.split('-');
                          setFormData({...formData, birthDate: `${e.target.value}-${month || '01'}-${day || '01'}`});
                        }}
                        className="w-full px-4 py-4 bg-white/10 border border-white/30 rounded-xl text-white text-lg focus:outline-none focus:border-purple-400"
                      >
                        <option value="">年</option>
                        {Array.from({length: 100}, (_, i) => {
                          const year = new Date().getFullYear() - i;
                          return (
                            <option key={year} value={year} className="bg-slate-800 text-white">
                              {year}年
                            </option>
                          );
                        })}
                      </select>
                    </div>
                    <div>
                      <select
                        value={formData.birthDate.split('-')[1] || ''}
                        onChange={(e) => {
                          const [year, , day] = formData.birthDate.split('-');
                          setFormData({...formData, birthDate: `${year || '2000'}-${e.target.value.padStart(2, '0')}-${day || '01'}`});
                        }}
                        className="w-full px-4 py-4 bg-white/10 border border-white/30 rounded-xl text-white text-lg focus:outline-none focus:border-purple-400"
                      >
                        <option value="">月</option>
                        {Array.from({length: 12}, (_, i) => (
                          <option key={i + 1} value={(i + 1).toString().padStart(2, '0')} className="bg-slate-800 text-white">
                            {i + 1}月
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <select
                        value={formData.birthDate.split('-')[2] || ''}
                        onChange={(e) => {
                          const [year, month] = formData.birthDate.split('-');
                          setFormData({...formData, birthDate: `${year || '2000'}-${month || '01'}-${e.target.value.padStart(2, '0')}`});
                        }}
                        className="w-full px-4 py-4 bg-white/10 border border-white/30 rounded-xl text-white text-lg focus:outline-none focus:border-purple-400"
                      >
                        <option value="">日</option>
                        {Array.from({length: 31}, (_, i) => (
                          <option key={i + 1} value={(i + 1).toString().padStart(2, '0')} className="bg-slate-800 text-white">
                            {i + 1}日
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div>

                  <div>
                    <label className="block text-white text-lg font-light mb-3">
                      生誕時刻
                    </label>
                    <input
                      type="time"
                      value={formData.birthTime}
                      onChange={(e) => setFormData({...formData, birthTime: e.target.value})}
                      className="w-full px-6 py-4 bg-white/10 border border-white/30 rounded-xl text-white text-lg focus:outline-none focus:border-purple-400"
                    />
                    <p className="text-blue-300 text-sm mt-2">
                      正確な時刻がわからない場合は空欄でも結構です
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-white text-lg font-light mb-3">
                    出生地*
                  </label>
                  <input
                    type="text"
                    value={formData.birthPlace}
                    onChange={(e) => setFormData({...formData, birthPlace: e.target.value})}
                    className="w-full px-6 py-4 bg-white/10 border border-white/30 rounded-xl text-white text-lg placeholder-gray-300 focus:outline-none focus:border-purple-400"
                    placeholder="東京都渋谷区"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-10">
                <button
                  onClick={() => setCurrentStep(2)}
                  disabled={!isStepComplete(1)}
                  className="px-10 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-lg rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  次へ進む
                </button>
              </div>
            </div>
          )}

          {/* ステップ2: 相談内容 */}
          {currentStep === 2 && (
            <div className="bg-white/5 backdrop-blur-md rounded-3xl p-10 border border-white/10">
              <h2 className="text-3xl font-light text-white text-center mb-8">ご相談内容をお聞かせください</h2>
              
              <div className="space-y-6 max-w-2xl mx-auto">
                <div>
                  <label className="block text-white text-lg font-light mb-3">
                    相談カテゴリ*
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {questionCategories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setFormData({...formData, questionCategory: category})}
                        className={`px-4 py-3 rounded-lg text-sm transition-all ${
                          formData.questionCategory === category
                            ? 'bg-purple-500/30 text-white border-purple-400'
                            : 'bg-white/5 text-white/70 hover:bg-white/10'
                        } border border-white/20`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-white text-lg font-light mb-3">
                    具体的なご相談内容*
                  </label>
                  <textarea
                    value={formData.question}
                    onChange={(e) => setFormData({...formData, question: e.target.value})}
                    className="w-full px-6 py-4 bg-white/10 border border-white/30 rounded-xl text-white text-lg placeholder-gray-300 h-32 focus:outline-none focus:border-purple-400 resize-none"
                    placeholder="どのようなことでお悩みでしょうか？詳しくお聞かせください。"
                  />
                </div>
              </div>

              <div className="flex justify-between mt-10">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-10 py-4 bg-white/10 text-white text-lg rounded-xl hover:bg-white/20 transition-all duration-300"
                >
                  前に戻る
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  disabled={!isStepComplete(2)}
                  className="px-10 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-lg rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  次へ進む
                </button>
              </div>
            </div>
          )}

          {/* ステップ3: 環境設定 */}
          {currentStep === 3 && (
            <div className="bg-white/5 backdrop-blur-md rounded-3xl p-10 border border-white/10">
              <h2 className="text-3xl font-light text-white text-center mb-8">環境データ設定</h2>
              
              <div className="space-y-6 max-w-2xl mx-auto">
                <div className="text-center">
                  <p className="text-white/70 mb-6">
                    より正確な占術結果のため、現在地の環境データ（月相・天候・天体情報）の使用を選択できます。
                  </p>
                  
                  {/* 位置情報使用チェックボックス */}
                  <div className="mb-6">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={useLocation}
                        onChange={(e) => {
                          setUseLocation(e.target.checked);
                          if (!e.target.checked) {
                            setFormData({...formData, currentLocation: null});
                            setLocationStatus('none');
                          }
                        }}
                        className="w-5 h-5 text-purple-600 bg-white/10 border-white/30 rounded focus:ring-purple-500 focus:ring-2"
                      />
                      <span className="ml-3 text-white text-lg">現在地の環境データを使用する（任意）</span>
                    </label>
                  </div>
                  
                  {useLocation && locationStatus === 'none' && (
                    <button
                      onClick={getCurrentLocation}
                      className="px-8 py-4 bg-green-600 text-white text-lg rounded-xl hover:bg-green-700 transition-all duration-300"
                    >
                      📍 現在地を取得する
                    </button>
                  )}
                  
                  {useLocation && locationStatus === 'requesting' && (
                    <div className="text-blue-300">
                      位置情報を取得中...
                    </div>
                  )}
                  
                  {useLocation && locationStatus === 'granted' && formData.currentLocation && (
                    <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4">
                      <div className="text-green-100">
                        ✅ 位置情報が取得されました<br />
                        緯度: {formData.currentLocation.latitude.toFixed(4)}°<br />
                        経度: {formData.currentLocation.longitude.toFixed(4)}°
                      </div>
                    </div>
                  )}
                  
                  {useLocation && locationStatus === 'denied' && (
                    <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4">
                      <div className="text-yellow-100">
                        位置情報の取得に失敗しました。<br />
                        一般的な環境データで占術を実行いたします。
                      </div>
                    </div>
                  )}
                  
                  {!useLocation && (
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                      <div className="text-blue-200">
                        位置情報を使用しない場合、標準的な環境設定で占術を実行します。
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between mt-10">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-10 py-4 bg-white/10 text-white text-lg rounded-xl hover:bg-white/20 transition-all duration-300"
                >
                  前に戻る
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="px-10 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-lg rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? '宇宙と対話中...' : '✨ 占術を開始する'}
                </button>
              </div>
            </div>
          )}

          {/* 注意事項 */}
          <div className="mt-8 text-center">
            <p className="text-blue-300 text-sm">
              占いは娯楽・参考目的であり、重要な人生の決断は慎重にご検討ください
            </p>
          </div>
          
        </div>
      </main>
    </div>
  );
}

export default function UserInputPage() {
  return (
    <RouteGuard requireAuth={true}>
      <UserInputPageContent />
    </RouteGuard>
  );
}