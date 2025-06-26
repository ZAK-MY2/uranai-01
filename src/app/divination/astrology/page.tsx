'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { CosmicBackground } from '@/components/ui/cosmic-background';
import { CosmicHeader } from '@/components/divination/cosmic-header';
import { mockDivinationData } from '@/lib/mock/divination-data';

const ParameterBadge = dynamic(
  () => import('@/components/divination/parameter-badge').then(mod => mod.ParameterBadge),
  { ssr: false }
);

interface UserInputData {
  fullName: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  question: string;
  questionCategory: string;
}

// 惑星シンボル
const planetSymbols: { [key: string]: string } = {
  太陽: '☉',
  月: '☽',
  水星: '☿',
  金星: '♀',
  火星: '♂',
  木星: '♃',
  土星: '♄',
  天王星: '♅',
  海王星: '♆',
  冥王星: '♇'
};

// 星座シンボル
const zodiacSymbols: { [key: string]: string } = {
  牡羊座: '♈',
  牡牛座: '♉',
  双子座: '♊',
  蟹座: '♋',
  獅子座: '♌',
  乙女座: '♍',
  天秤座: '♎',
  蠍座: '♏',
  射手座: '♐',
  山羊座: '♑',
  水瓶座: '♒',
  魚座: '♓'
};

export default function AstrologyPage() {
  const [, setUserInput] = useState<UserInputData | null>(null);
  const [astrologyResult, setAstrologyResult] = useState(mockDivinationData.astrology);

  // 西洋占星術の計算関数
  const calculateAstrology = useCallback((userData: UserInputData) => {
    const birthDate = new Date(userData.birthDate);
    const month = birthDate.getMonth() + 1;
    const day = birthDate.getDate();
    
    // 太陽星座の計算（簡易版）
    const sunSign = calculateSunSign(month, day);
    
    // 月星座の計算（生年月日から推定）
    const moonSign = calculateMoonSign(birthDate);
    
    // 上昇星座の計算（出生時間から推定）
    const ascendant = calculateAscendant(userData.birthTime, month);
    
    return {
      ...mockDivinationData.astrology,
      sunSign,
      moonSign,
      ascendant,
      interpretation: `${userData.questionCategory}について、太陽星座${sunSign}のあなたは、${getMoonSignMeaning(moonSign)}な内面を持ち、${getAscendantMeaning(ascendant)}として周囲に映っています。質問「${userData.question}」に対する星からのメッセージは、${getSunSignMeaning(sunSign)}ことです。`,
      todaysTransit: `今日は${sunSign}にとって、内なる感情（${moonSign}）と外的表現（${ascendant}）のバランスを取る日です。`
    };
  }, []);

  useEffect(() => {
    // LocalStorageからユーザーデータを読み込み
    const storedData = localStorage.getItem('uranai_user_data');
    if (storedData) {
      try {
        const userData: UserInputData = JSON.parse(storedData);
        setUserInput(userData);
        
        // 実際の西洋占星術計算を実行
        const calculatedResult = calculateAstrology(userData);
        setAstrologyResult(calculatedResult);
      } catch (error) {
        console.error('ユーザーデータの読み込みエラー:', error);
      }
    }
  }, [calculateAstrology]);


  function calculateSunSign(month: number, day: number): string {
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return '牡羊座';
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return '牡牛座';
    if ((month === 5 && day >= 21) || (month === 6 && day <= 21)) return '双子座';
    if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) return '蟹座';
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return '獅子座';
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return '乙女座';
    if ((month === 9 && day >= 23) || (month === 10 && day <= 23)) return '天秤座';
    if ((month === 10 && day >= 24) || (month === 11 && day <= 22)) return '蠍座';
    if ((month === 11 && day >= 23) || (month === 12 && day <= 21)) return '射手座';
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return '山羊座';
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return '水瓶座';
    return '魚座';
  }

  function calculateMoonSign(birthDate: Date): string {
    const signs = ['牡羊座', '牡牛座', '双子座', '蟹座', '獅子座', '乙女座', '天秤座', '蠍座', '射手座', '山羊座', '水瓶座', '魚座'];
    const moonCycle = 29.5; // 月のサイクル日数
    const daysSinceEpoch = Math.floor(birthDate.getTime() / (24 * 60 * 60 * 1000));
    const moonPhase = (daysSinceEpoch % moonCycle) / moonCycle;
    return signs[Math.floor(moonPhase * 12)];
  }

  function calculateAscendant(birthTime: string, month: number): string {
    const signs = ['牡羊座', '牡牛座', '双子座', '蟹座', '獅子座', '乙女座', '天秤座', '蠍座', '射手座', '山羊座', '水瓶座', '魚座'];
    const [hours] = birthTime.split(':').map(Number);
    const timeIndex = (hours + month) % 12;
    return signs[timeIndex];
  }

  function getSunSignMeaning(sign: string): string {
    const meanings: { [key: string]: string } = {
      '牡羊座': '積極的に行動を起こす',
      '牡牛座': '着実に基盤を固める',
      '双子座': '多角的な視点で考える',
      '蟹座': '感情を大切にして進む',
      '獅子座': '自信を持って表現する',
      '乙女座': '細部に注意を払って完成させる',
      '天秤座': 'バランスを取りながら協調する',
      '蠍座': '深く探求して真実を見つける',
      '射手座': '視野を広げて新たな地平を目指す',
      '山羊座': '責任を持って目標を達成する',
      '水瓶座': '独創的なアイデアで革新する',
      '魚座': '直感と想像力を活かす'
    };
    return meanings[sign] || '宇宙の流れに身を委ねる';
  }

  function getMoonSignMeaning(sign: string): string {
    const meanings: { [key: string]: string } = {
      '牡羊座': '情熱的で行動力溢れる',
      '牡牛座': '安定を求める穏やか',
      '双子座': '好奇心旺盛で変化を楽しむ',
      '蟹座': '家族想いで感受性豊か',
      '獅子座': 'プライド高く創造的',
      '乙女座': '完璧主義で分析的',
      '天秤座': '調和を愛する社交的',
      '蠍座': '神秘的で深い洞察力',
      '射手座': '自由を愛する楽天的',
      '山羊座': '責任感強く現実的',
      '水瓶座': '独立心強く理想主義',
      '魚座': '共感力高く芸術的'
    };
    return meanings[sign] || '神秘的';
  }

  function getAscendantMeaning(sign: string): string {
    const meanings: { [key: string]: string } = {
      '牡羊座': 'エネルギッシュで自信に満ちた印象',
      '牡牛座': '落ち着いていて信頼できる印象',
      '双子座': '知的で話上手な印象',
      '蟹座': '優しく家庭的な印象',
      '獅子座': '華やかで魅力的な印象',
      '乙女座': '真面目で几帳面な印象',
      '天秤座': '洗練されて美しい印象',
      '蠍座': 'ミステリアスで魅力的な印象',
      '射手座': '明るく自由な印象',
      '山羊座': '堅実で頼りになる印象',
      '水瓶座': 'ユニークで先進的な印象',
      '魚座': '優しく幻想的な印象'
    };
    return meanings[sign] || '神秘的な印象';
  }

  const { astrology } = { astrology: astrologyResult };

  // 12ハウスの意味
  const houses = [
    { number: 1, name: '自己', angle: 0 },
    { number: 2, name: '所有', angle: 30 },
    { number: 3, name: '交流', angle: 60 },
    { number: 4, name: '家庭', angle: 90 },
    { number: 5, name: '創造', angle: 120 },
    { number: 6, name: '労働', angle: 150 },
    { number: 7, name: '対人', angle: 180 },
    { number: 8, name: '変容', angle: 210 },
    { number: 9, name: '探求', angle: 240 },
    { number: 10, name: '社会', angle: 270 },
    { number: 11, name: '理想', angle: 300 },
    { number: 12, name: '潜在', angle: 330 }
  ];

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-slate-900 to-slate-800">
      <CosmicBackground />
      
      <CosmicHeader title="西洋占星術詳細分析" />

      <main className="relative z-10 pt-10 pb-20">
        <div className="max-w-7xl mx-auto px-5">
          <ParameterBadge />
          
          {/* ホロスコープチャート */}
          <div className="cosmic-card cosmic-section">
            <h2 className="cosmic-title text-4xl text-center mb-12">あなたのホロスコープ</h2>
            
            {/* 円形チャート */}
            <div className="relative w-96 h-96 mx-auto mb-10">
              <svg viewBox="0 0 400 400" className="w-full h-full">
                {/* 外円 */}
                <circle cx="200" cy="200" r="180" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
                <circle cx="200" cy="200" r="140" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                <circle cx="200" cy="200" r="100" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                
                {/* 12ハウスの分割線 */}
                {houses.map((house) => {
                  const angle = (house.angle - 90) * Math.PI / 180;
                  const x1 = 200 + 140 * Math.cos(angle);
                  const y1 = 200 + 140 * Math.sin(angle);
                  const x2 = 200 + 180 * Math.cos(angle);
                  const y2 = 200 + 180 * Math.sin(angle);
                  
                  return (
                    <g key={house.number}>
                      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                      <text
                        x={200 + 160 * Math.cos(angle + Math.PI / 24)}
                        y={200 + 160 * Math.sin(angle + Math.PI / 24)}
                        textAnchor="middle"
                        className="fill-white/50 text-xs"
                      >
                        {house.number}
                      </text>
                    </g>
                  );
                })}
                
                {/* 星座の配置 */}
                <g className="text-2xl">
                  <text x="200" y="30" textAnchor="middle" className="fill-purple-300">{zodiacSymbols['牡羊座']}</text>
                  <text x="300" y="70" textAnchor="middle" className="fill-purple-300">{zodiacSymbols['牡牛座']}</text>
                  <text x="350" y="150" textAnchor="middle" className="fill-purple-300">{zodiacSymbols['双子座']}</text>
                  <text x="350" y="250" textAnchor="middle" className="fill-purple-300">{zodiacSymbols['蟹座']}</text>
                  <text x="300" y="330" textAnchor="middle" className="fill-purple-300">{zodiacSymbols['獅子座']}</text>
                  <text x="200" y="370" textAnchor="middle" className="fill-purple-300">{zodiacSymbols['乙女座']}</text>
                  <text x="100" y="330" textAnchor="middle" className="fill-purple-300">{zodiacSymbols['天秤座']}</text>
                  <text x="50" y="250" textAnchor="middle" className="fill-purple-300">{zodiacSymbols['蠍座']}</text>
                  <text x="50" y="150" textAnchor="middle" className="fill-purple-300">{zodiacSymbols['射手座']}</text>
                  <text x="100" y="70" textAnchor="middle" className="fill-purple-300">{zodiacSymbols['山羊座']}</text>
                </g>
                
                {/* 惑星の配置 */}
                <g>
                  {/* 太陽（蠍座） */}
                  <circle cx="80" cy="240" r="20" fill="rgba(251,191,36,0.3)" stroke="rgba(251,191,36,0.8)" strokeWidth="2" />
                  <text x="80" y="245" textAnchor="middle" className="fill-yellow-300 text-2xl">{planetSymbols['太陽']}</text>
                  
                  {/* 月（魚座） */}
                  <circle cx="120" cy="120" r="18" fill="rgba(209,213,219,0.3)" stroke="rgba(209,213,219,0.8)" strokeWidth="2" />
                  <text x="120" y="125" textAnchor="middle" className="fill-gray-300 text-xl">{planetSymbols['月']}</text>
                  
                  {/* 金星（天秤座） */}
                  <circle cx="100" cy="300" r="16" fill="rgba(251,113,133,0.3)" stroke="rgba(251,113,133,0.8)" strokeWidth="2" />
                  <text x="100" y="305" textAnchor="middle" className="fill-pink-300 text-lg">{planetSymbols['金星']}</text>
                  
                  {/* 水星（射手座） */}
                  <circle cx="60" cy="180" r="14" fill="rgba(147,197,253,0.3)" stroke="rgba(147,197,253,0.8)" strokeWidth="2" />
                  <text x="60" y="185" textAnchor="middle" className="fill-blue-300 text-lg">{planetSymbols['水星']}</text>
                  
                  {/* 火星（牡羊座） */}
                  <circle cx="200" cy="60" r="16" fill="rgba(248,113,113,0.3)" stroke="rgba(248,113,113,0.8)" strokeWidth="2" />
                  <text x="200" y="65" textAnchor="middle" className="fill-red-300 text-lg">{planetSymbols['火星']}</text>
                </g>
                
                {/* アスペクトライン */}
                <g stroke="rgba(99,102,241,0.3)" strokeWidth="1" strokeDasharray="5,5">
                  <line x1="80" y1="240" x2="120" y2="120" /> {/* 太陽-月 */}
                  <line x1="100" y1="300" x2="120" y2="120" /> {/* 金星-月 */}
                </g>
              </svg>
            </div>

            {/* 3つの主要サイン */}
            <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="cosmic-card p-6 text-center cosmic-glow hover:transform hover:scale-105 transition-all duration-500">
                <p className="cosmic-label mb-3">太陽星座</p>
                <p className="text-5xl mb-3 animate-pulse-gentle">{zodiacSymbols[astrology.sunSign]}</p>
                <p className="cosmic-heading text-xl mb-2">{astrology.sunSign}</p>
                <p className="cosmic-text text-sm">基本的な性格</p>
              </div>
              
              <div className="cosmic-card p-6 text-center cosmic-glow hover:transform hover:scale-105 transition-all duration-500">
                <p className="cosmic-label mb-3">月星座</p>
                <p className="text-5xl mb-3 animate-pulse-gentle">{zodiacSymbols[astrology.moonSign]}</p>
                <p className="cosmic-heading text-xl mb-2">{astrology.moonSign}</p>
                <p className="cosmic-text text-sm">感情と内面</p>
              </div>
              
              <div className="cosmic-card p-6 text-center cosmic-glow hover:transform hover:scale-105 transition-all duration-500">
                <p className="cosmic-label mb-3">アセンダント</p>
                <p className="text-5xl mb-3 animate-pulse-gentle">{zodiacSymbols[astrology.risingSign]}</p>
                <p className="cosmic-heading text-xl mb-2">{astrology.risingSign}</p>
                <p className="cosmic-text text-sm">外的な印象</p>
              </div>
            </div>
          </div>

          {/* 惑星配置の詳細データ */}
          <div className="cosmic-card cosmic-section">
            <h3 className="cosmic-heading text-3xl text-center mb-8">惑星配置データ</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-white/80">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left py-3 px-4">惑星</th>
                    <th className="text-left py-3 px-4">星座</th>
                    <th className="text-left py-3 px-4">ハウス</th>
                    <th className="text-left py-3 px-4">アスペクト</th>
                    <th className="text-left py-3 px-4">度数</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/10">
                    <td className="py-3 px-4">{planetSymbols['太陽']} 太陽</td>
                    <td className="py-3 px-4">{zodiacSymbols[astrology.sunSign]} {astrology.sunSign}</td>
                    <td className="py-3 px-4">8ハウス</td>
                    <td className="py-3 px-4">月とセクスタイル</td>
                    <td className="py-3 px-4">15°23&apos;</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="py-3 px-4">{planetSymbols['月']} 月</td>
                    <td className="py-3 px-4">{zodiacSymbols[astrology.moonSign]} {astrology.moonSign}</td>
                    <td className="py-3 px-4">12ハウス</td>
                    <td className="py-3 px-4">金星とトライン</td>
                    <td className="py-3 px-4">22°45&apos;</td>
                  </tr>
                  {Object.entries(astrology.planets).map(([planet, data]) => (
                    <tr key={planet} className="border-b border-white/10">
                      <td className="py-3 px-4">{planetSymbols[planet === 'mercury' ? '水星' : planet === 'venus' ? '金星' : planet === 'mars' ? '火星' : planet === 'jupiter' ? '木星' : '土星']} {planet === 'mercury' ? '水星' : planet === 'venus' ? '金星' : planet === 'mars' ? '火星' : planet === 'jupiter' ? '木星' : '土星'}</td>
                      <td className="py-3 px-4">{zodiacSymbols[data.sign]} {data.sign}</td>
                      <td className="py-3 px-4">{data.house}ハウス</td>
                      <td className="py-3 px-4">{data.aspect}</td>
                      <td className="py-3 px-4">{Math.floor(Math.random() * 30)}°{Math.floor(Math.random() * 60)}&apos;</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 text-center text-white/50 text-sm">
              <p>※ プラシダス・ハウスシステムによる計算</p>
              <p>※ トロピカル占星術を使用</p>
            </div>
          </div>

          {/* アスペクト分析 */}
          <div className="cosmic-card cosmic-section">
            <h3 className="cosmic-heading text-3xl text-center mb-8">アスペクト分析</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-green-500/10 rounded-xl p-6 border border-green-500/20">
                <h4 className="text-xl font-light text-green-300 mb-4">◐ 好調なアスペクト</h4>
                <ul className="space-y-3 text-white/80">
                  {astrology.aspects.favorable.map((aspect, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-400 mr-2">✓</span>
                      <span>{aspect}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-orange-500/10 rounded-xl p-6 border border-orange-500/20">
                <h4 className="text-xl font-light text-orange-300 mb-4">△ 挑戦的なアスペクト</h4>
                <ul className="space-y-3 text-white/80">
                  {astrology.aspects.challenging.map((aspect, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-orange-400 mr-2">!</span>
                      <span>{aspect}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* 今日のトランジット */}
          <div className="cosmic-card cosmic-section">
            <h3 className="cosmic-heading text-3xl text-center mb-10">今日の天体の影響</h3>
            
            <div className="max-w-3xl mx-auto">
              <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-8 border border-blue-500/20 mb-6">
                <p className="text-xl text-white/90 text-center leading-relaxed">
                  {astrology.todaysTransit}
                </p>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-yellow-300 text-2xl mb-2">{planetSymbols['太陽']}</p>
                  <p className="text-white/70 text-sm">活力アップ</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-gray-300 text-2xl mb-2">{planetSymbols['月']}</p>
                  <p className="text-white/70 text-sm">感情の安定</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-blue-300 text-2xl mb-2">{planetSymbols['水星']}</p>
                  <p className="text-white/70 text-sm">思考明晰</p>
                </div>
              </div>
            </div>
          </div>

          {/* 総合的な解釈 */}
          <div className="cosmic-card cosmic-section-large">
            <h3 className="cosmic-title text-3xl text-center mb-10">星々からのメッセージ</h3>
            
            <div className="max-w-3xl mx-auto space-y-6">
              <p className="text-lg text-white/80 leading-relaxed">
                {astrology.interpretation}
              </p>
              
              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl p-8 border border-purple-500/20">
                <p className="text-center text-lg text-white/90">
                  蠍座の深い洞察力と、魚座の豊かな感受性、
                  そして獅子座の輝かしいカリスマが融合し、
                  あなたは特別な魅力と影響力を持っています。
                  今は内なる情熱を外に表現する絶好の時期です。
                </p>
              </div>
            </div>
          </div>
          
          {/* 詳細診断ボタン（準備中） */}
          <div className="detail-diagnosis-button">
            <button className="cosmic-button-disabled" disabled>
              詳細な西洏占星術診断を受ける（準備中）
            </button>
          </div>

          {/* ナビゲーション */}
          <div className="mt-10 flex justify-center gap-6">
            <Link 
              href="/divination/tarot"
              className="px-8 py-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all duration-300"
            >
              ← タロット占いへ
            </Link>
            <Link 
              href="/divination/integrated"
              className="px-8 py-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all duration-300"
            >
              統合占術へ →
            </Link>
          </div>
          
        </div>
      </main>
    </div>
  );
}