import { useState, useEffect } from 'react';
import { getHourlyEnergy, getDailyVariation } from '@/lib/mock/divination-data';

export interface UserInputData {
  fullName: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  currentPrefecture?: string;
  currentCity?: string;
  currentLocation?: {
    latitude: number;
    longitude: number;
  } | null;
  question: string;
  questionCategory: string;
}

interface UseDivinationDataReturn<T> {
  userInput: UserInputData | null;
  divinationResult: T;
  isLoading: boolean;
  error: string | null;
  environmentalFactors: {
    hourlyEnergy: string;
    dailyVariation: number;
  };
}

export function useDivinationData<T>(
  defaultResult: T,
  calculateFunction?: (userData: UserInputData) => T
): UseDivinationDataReturn<T> {
  const [userInput, setUserInput] = useState<UserInputData | null>(null);
  const [divinationResult, setDivinationResult] = useState<T>(defaultResult);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoading(true);
        const storedData = localStorage.getItem('uranai_user_data');
        
        if (storedData) {
          const userData: UserInputData = JSON.parse(storedData);
          setUserInput(userData);
          
          // カスタム計算関数があれば使用、なければデフォルト
          if (calculateFunction) {
            const result = calculateFunction(userData);
            setDivinationResult(result);
          }
        }
      } catch (err) {
        console.error('ユーザーデータの読み込みエラー:', err);
        setError('データの読み込みに失敗しました');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [calculateFunction, defaultResult]);

  // 環境要因（時間帯、日々の変動）
  const environmentalFactors = {
    hourlyEnergy: getHourlyEnergy(),
    dailyVariation: getDailyVariation(85) // ベーススコア85
  };

  return {
    userInput,
    divinationResult,
    isLoading,
    error,
    environmentalFactors
  };
}