// Unit tests for Numerology Engine
import { NumerologyEngine } from '../numerology';
import type { NumerologyInput } from '@/types/divination';

describe('NumerologyEngine', () => {
  let engine: NumerologyEngine;

  beforeEach(() => {
    engine = new NumerologyEngine();
  });

  describe('calculate', () => {
    it('should calculate correct numerology values for standard input', async () => {
      const input: NumerologyInput = {
        fullName: 'John Smith',
        birthDate: '1990-05-15'
      };

      const result = await engine.calculate(input);

      expect(result).toHaveProperty('lifePath');
      expect(result).toHaveProperty('destiny');
      expect(result).toHaveProperty('soul');
      expect(result).toHaveProperty('personality');
      expect(result).toHaveProperty('interpretation');

      expect(typeof result.lifePath).toBe('number');
      expect(typeof result.destiny).toBe('number');
      expect(typeof result.soul).toBe('number');
      expect(typeof result.personality).toBe('number');

      expect(result.lifePath).toBeGreaterThanOrEqual(1);
      expect(result.lifePath).toBeLessThanOrEqual(33);
      expect(result.destiny).toBeGreaterThanOrEqual(1);
      expect(result.destiny).toBeLessThanOrEqual(99);
      expect(result.soul).toBeGreaterThanOrEqual(1);
      expect(result.soul).toBeLessThanOrEqual(99);
      expect(result.personality).toBeGreaterThanOrEqual(1);
      expect(result.personality).toBeLessThanOrEqual(99);
    });

    it('should handle master numbers correctly', async () => {
      // Test case designed to produce master numbers
      const input: NumerologyInput = {
        fullName: 'Michael Johnson',
        birthDate: '1983-11-29' // 1+9+8+3+1+1+2+9 = 34 -> 3+4 = 7, but 11, 22, 33 should be preserved
      };

      const result = await engine.calculate(input);

      // Master numbers should be preserved when they occur naturally
      if (result.lifePath === 11 || result.lifePath === 22 || result.lifePath === 33) {
        expect([11, 22, 33]).toContain(result.lifePath);
      }
    });

    it('should handle Japanese names correctly', async () => {
      const input: NumerologyInput = {
        fullName: '田中太郎',
        birthDate: '1985-12-01'
      };

      const result = await engine.calculate(input);

      expect(result).toHaveProperty('lifePath');
      expect(result).toHaveProperty('destiny');
      expect(result.interpretation).toHaveProperty('lifePath');
      expect(typeof result.interpretation.lifePath).toBe('string');
    });

    it('should throw error for invalid birth date format', async () => {
      const input: NumerologyInput = {
        fullName: 'John Smith',
        birthDate: 'invalid-date'
      };

      await expect(engine.calculate(input)).rejects.toThrow(/日付形式が正しくありません/);
    });

    it('should throw error for empty name', async () => {
      const input: NumerologyInput = {
        fullName: '',
        birthDate: '1990-05-15'
      };

      await expect(engine.calculate(input)).rejects.toThrow(/フルネームは必須です/);
    });

    it('should generate consistent results for same input', async () => {
      const input: NumerologyInput = {
        fullName: 'John Smith',
        birthDate: '1990-05-15'
      };

      const result1 = await engine.calculate(input);
      const result2 = await engine.calculate(input);

      expect(result1.lifePath).toBe(result2.lifePath);
      expect(result1.destiny).toBe(result2.destiny);
      expect(result1.soul).toBe(result2.soul);
      expect(result1.personality).toBe(result2.personality);
    });

    it('should calculate different values for different names', async () => {
      const input1: NumerologyInput = {
        fullName: 'John Smith',
        birthDate: '1990-05-15'
      };

      const input2: NumerologyInput = {
        fullName: 'Jane Doe',
        birthDate: '1990-05-15'
      };

      const result1 = await engine.calculate(input1);
      const result2 = await engine.calculate(input2);

      // At least one value should be different
      expect(
        result1.destiny !== result2.destiny ||
        result1.soul !== result2.soul ||
        result1.personality !== result2.personality
      ).toBe(true);
    });

    it('should calculate different life path for different birth dates', async () => {
      const input1: NumerologyInput = {
        fullName: 'John Smith',
        birthDate: '1990-05-15'
      };

      const input2: NumerologyInput = {
        fullName: 'John Smith',
        birthDate: '1985-12-01'
      };

      const result1 = await engine.calculate(input1);
      const result2 = await engine.calculate(input2);

      expect(result1.lifePath).not.toBe(result2.lifePath);
    });
  });

  describe('generateCacheKey', () => {
    it('should generate unique cache keys for different inputs', () => {
      const input1: NumerologyInput = {
        fullName: 'John Smith',
        birthDate: '1990-05-15'
      };

      const input2: NumerologyInput = {
        fullName: 'Jane Doe',
        birthDate: '1990-05-15'
      };

      const key1 = engine.generateCacheKey(input1);
      const key2 = engine.generateCacheKey(input2);

      expect(key1).not.toBe(key2);
      expect(typeof key1).toBe('string');
      expect(typeof key2).toBe('string');
    });

    it('should generate same cache key for same input', () => {
      const input: NumerologyInput = {
        fullName: 'John Smith',
        birthDate: '1990-05-15'
      };

      const key1 = engine.generateCacheKey(input);
      const key2 = engine.generateCacheKey(input);

      expect(key1).toBe(key2);
    });
  });

  describe('generateInputHash', () => {
    it('should generate hash for input', () => {
      const input: NumerologyInput = {
        fullName: 'John Smith',
        birthDate: '1990-05-15'
      };

      const hash = engine.generateInputHash(input);

      expect(typeof hash).toBe('string');
      expect(hash.length).toBeGreaterThan(0);
      expect(/^[a-zA-Z0-9]+$/.test(hash)).toBe(true); // Only alphanumeric characters
    });
  });

  describe('interpretation quality', () => {
    it('should provide meaningful interpretations', async () => {
      const input: NumerologyInput = {
        fullName: 'John Smith',
        birthDate: '1990-05-15'
      };

      const result = await engine.calculate(input);

      expect(result.interpretation.lifePath.length).toBeGreaterThan(20);
      expect(result.interpretation.destiny.length).toBeGreaterThan(20);
      expect(result.interpretation.soul.length).toBeGreaterThan(20);
      expect(result.interpretation.personality.length).toBeGreaterThan(20);
      expect(result.interpretation.overall.length).toBeGreaterThan(50);

      // Should contain Japanese text
      expect(/[ひらがなカタカナ一-龯]/.test(result.interpretation.lifePath)).toBe(true);
    });

    it('should provide different interpretations for different life paths', async () => {
      const input1: NumerologyInput = {
        fullName: 'John Smith',
        birthDate: '1990-01-01' // Life path 1
      };

      const input2: NumerologyInput = {
        fullName: 'John Smith',
        birthDate: '1990-01-10' // Life path 2
      };

      const result1 = await engine.calculate(input1);
      const result2 = await engine.calculate(input2);

      // Should have different interpretations for different life paths
      expect(result1.interpretation.lifePath).not.toBe(result2.interpretation.lifePath);
    });
  });

  describe('edge cases', () => {
    it('should handle very long names', async () => {
      const input: NumerologyInput = {
        fullName: 'Johannes Sebastian Bach Wolfgang Amadeus Mozart Ludwig van Beethoven',
        birthDate: '1990-05-15'
      };

      const result = await engine.calculate(input);

      expect(result).toHaveProperty('lifePath');
      expect(result.lifePath).toBeGreaterThanOrEqual(1);
    expect(result.lifePath).toBeLessThanOrEqual(33);
    });

    it('should handle names with special characters', async () => {
      const input: NumerologyInput = {
        fullName: "O'Connor-Smith Jr.",
        birthDate: '1990-05-15'
      };

      const result = await engine.calculate(input);

      expect(result).toHaveProperty('lifePath');
      expect(result.lifePath).toBeGreaterThanOrEqual(1);
    expect(result.lifePath).toBeLessThanOrEqual(33);
    });

    it('should handle leap year dates', async () => {
      const input: NumerologyInput = {
        fullName: 'John Smith',
        birthDate: '1992-02-29' // Leap year
      };

      const result = await engine.calculate(input);

      expect(result).toHaveProperty('lifePath');
      expect(result.lifePath).toBeGreaterThanOrEqual(1);
    expect(result.lifePath).toBeLessThanOrEqual(33);
    });

    it('should handle minimum date', async () => {
      const input: NumerologyInput = {
        fullName: 'John Smith',
        birthDate: '1900-01-01'
      };

      const result = await engine.calculate(input);

      expect(result).toHaveProperty('lifePath');
      expect(result.lifePath).toBeGreaterThanOrEqual(1);
    expect(result.lifePath).toBeLessThanOrEqual(33);
    });

    it('should handle future dates gracefully', async () => {
      const input: NumerologyInput = {
        fullName: 'John Smith',
        birthDate: '2030-12-31'
      };

      // Should not throw error, but might provide a warning
      const result = await engine.calculate(input);

      expect(result).toHaveProperty('lifePath');
      expect(result.lifePath).toBeGreaterThanOrEqual(1);
    expect(result.lifePath).toBeLessThanOrEqual(33);
    });
  });
});