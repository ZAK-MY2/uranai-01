// API route tests for numerology endpoint
import { POST } from '../numerology/route';
import { NextRequest } from 'next/server';

// Mock the numerology engine
jest.mock('@/lib/divination/numerology', () => ({
  numerologyEngine: {
    calculate: jest.fn(),
    generateCacheKey: jest.fn(),
    generateInputHash: jest.fn(),
  },
}));

import { numerologyEngine } from '@/lib/divination/numerology';

describe('/api/numerology', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return numerology calculation for valid input', async () => {
    const mockResult = {
      lifePath: 7,
      destiny: 11,
      soul: 5,
      personality: 6,
      interpretation: {
        lifePath: 'あなたは探求心旺盛な人です。',
        destiny: '直感力に優れています。',
        soul: '自由を愛する心を持っています。',
        personality: '責任感の強い人として見られます。',
        overall: '総合的に見ると、深い洞察力を持つ人です。'
      }
    };

    (numerologyEngine.calculate as jest.Mock).mockResolvedValue(mockResult);
    (numerologyEngine.generateCacheKey as jest.Mock).mockReturnValue('cache-key-123');
    (numerologyEngine.generateInputHash as jest.Mock).mockReturnValue('hash-123');

    const request = new NextRequest('http://localhost:3000/api/numerology', {
      method: 'POST',
      body: JSON.stringify({
        fullName: 'テスト太郎',
        birthDate: '1990-05-15'
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.result).toEqual(mockResult);
    expect(data.metadata).toHaveProperty('cacheKey');
    expect(data.metadata).toHaveProperty('inputHash');
    expect(data.metadata).toHaveProperty('timestamp');

    expect(numerologyEngine.calculate).toHaveBeenCalledWith({
      fullName: 'テスト太郎',
      birthDate: '1990-05-15'
    });
  });

  it('should return 400 for missing required fields', async () => {
    const request = new NextRequest('http://localhost:3000/api/numerology', {
      method: 'POST',
      body: JSON.stringify({
        fullName: 'テスト太郎'
        // birthDate is missing
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toContain('必須');
  });

  it('should return 400 for invalid input format', async () => {
    const request = new NextRequest('http://localhost:3000/api/numerology', {
      method: 'POST',
      body: JSON.stringify({
        fullName: '', // Empty name
        birthDate: 'invalid-date'
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBeDefined();
  });

  it('should handle calculation errors gracefully', async () => {
    (numerologyEngine.calculate as jest.Mock).mockRejectedValue(new Error('計算エラー'));

    const request = new NextRequest('http://localhost:3000/api/numerology', {
      method: 'POST',
      body: JSON.stringify({
        fullName: 'テストユーザー',
        birthDate: '1990-05-15'
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.success).toBe(false);
    expect(data.error).toContain('計算中にエラーが発生しました');
  });

  it('should handle malformed JSON', async () => {
    const request = new NextRequest('http://localhost:3000/api/numerology', {
      method: 'POST',
      body: 'invalid json',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toContain('JSON');
  });

  it('should validate input types correctly', async () => {
    const request = new NextRequest('http://localhost:3000/api/numerology', {
      method: 'POST',
      body: JSON.stringify({
        fullName: 123, // Should be string
        birthDate: '1990-05-15'
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toBeDefined();
  });

  it('should handle very long names', async () => {
    const longName = 'あ'.repeat(1000); // Very long Japanese name

    const mockResult = {
      lifePath: 3,
      destiny: 5,
      soul: 7,
      personality: 2,
      interpretation: {
        lifePath: 'テスト解釈',
        destiny: 'テスト解釈',
        soul: 'テスト解釈',
        personality: 'テスト解釈',
        overall: 'テスト解釈'
      }
    };

    (numerologyEngine.calculate as jest.Mock).mockResolvedValue(mockResult);
    (numerologyEngine.generateCacheKey as jest.Mock).mockReturnValue('cache-key-long');
    (numerologyEngine.generateInputHash as jest.Mock).mockReturnValue('hash-long');

    const request = new NextRequest('http://localhost:3000/api/numerology', {
      method: 'POST',
      body: JSON.stringify({
        fullName: longName,
        birthDate: '1990-05-15'
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.result).toEqual(mockResult);
  });

  it('should include performance metadata', async () => {
    const mockResult = {
      lifePath: 1,
      destiny: 2,
      soul: 3,
      personality: 4,
      interpretation: {
        lifePath: 'テスト',
        destiny: 'テスト',
        soul: 'テスト',
        personality: 'テスト',
        overall: 'テスト'
      }
    };

    (numerologyEngine.calculate as jest.Mock).mockResolvedValue(mockResult);
    (numerologyEngine.generateCacheKey as jest.Mock).mockReturnValue('cache-key');
    (numerologyEngine.generateInputHash as jest.Mock).mockReturnValue('hash');

    const request = new NextRequest('http://localhost:3000/api/numerology', {
      method: 'POST',
      body: JSON.stringify({
        fullName: 'パフォーマンステスト',
        birthDate: '1990-05-15'
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const startTime = Date.now();
    const response = await POST(request);
    const endTime = Date.now();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.metadata).toHaveProperty('timestamp');
    expect(data.metadata).toHaveProperty('processingTime');
    expect(typeof data.metadata.processingTime).toBe('number');
    expect(data.metadata.processingTime).toBeGreaterThan(0);
    expect(data.metadata.processingTime).toBeLessThan(endTime - startTime + 100); // Allow some margin
  });
});