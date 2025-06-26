import { useState, useCallback } from 'react';

interface UserData {
  fullName: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  question?: string;
}

interface DivinationResult {
  success: boolean;
  data?: any;
  error?: string;
}

export function useDivination() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getDivination = useCallback(async (type: string, userData: UserData): Promise<DivinationResult> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/divination', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type, userData }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to get divination');
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    getDivination,
    loading,
    error
  };
}