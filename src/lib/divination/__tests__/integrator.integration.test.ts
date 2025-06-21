// Integration tests for Divination Integrator
import { DivinationIntegrator } from '../integrator';
import type { IntegratedDivinationInput } from '@/types/divination';

describe('DivinationIntegrator', () => {
  let integrator: DivinationIntegrator;

  beforeEach(() => {
    integrator = new DivinationIntegrator();
  });

  describe('performIntegratedReading', () => {
    it('should perform complete integrated reading with minimal input', async () => {
      const input: IntegratedDivinationInput = {
        fullName: 'John Smith',
        birthDate: '1990-05-15',
        question: 'What should I focus on in my career?',
        spreadType: 'three_card'
      };

      const result = await integrator.performIntegratedReading(input);

      // Check all main results are present
      expect(result).toHaveProperty('numerology');
      expect(result).toHaveProperty('tarot');
      expect(result).toHaveProperty('environment');
      expect(result).toHaveProperty('integration');

      // Numerology should be complete
      expect(result.numerology).toHaveProperty('lifePath');
      expect(result.numerology).toHaveProperty('destiny');
      expect(result.numerology).toHaveProperty('soul');
      expect(result.numerology).toHaveProperty('personality');
      expect(result.numerology).toHaveProperty('interpretation');

      // Tarot should be complete
      expect(result.tarot).toHaveProperty('cards');
      expect(result.tarot).toHaveProperty('spreadType');
      expect(result.tarot).toHaveProperty('overall');
      expect(result.tarot.cards).toHaveLength(3);

      // Environment should be complete
      expect(result.environment).toHaveProperty('lunar');
      expect(result.environment).toHaveProperty('weather');
      expect(result.environment).toHaveProperty('date');

      // Integration should be complete
      expect(result.integration).toHaveProperty('commonThemes');
      expect(result.integration).toHaveProperty('contradictions');
      expect(result.integration).toHaveProperty('environmentalInfluence');
      expect(result.integration).toHaveProperty('overallGuidance');
      expect(result.integration).toHaveProperty('specificAdvice');
      expect(result.integration).toHaveProperty('systemCorrelations');
      expect(result.integration).toHaveProperty('integratedInsights');

      expect(Array.isArray(result.integration.commonThemes)).toBe(true);
      expect(Array.isArray(result.integration.contradictions)).toBe(true);
      expect(Array.isArray(result.integration.specificAdvice)).toBe(true);
      expect(typeof result.integration.environmentalInfluence).toBe('string');
      expect(typeof result.integration.overallGuidance).toBe('string');
      expect(typeof result.integration.integratedInsights).toBe('string');
    }, 30000); // Increased timeout for integration test

    it('should perform complete reading with full astrological data', async () => {
      const input: IntegratedDivinationInput = {
        fullName: 'Jane Doe',
        birthDate: '1985-12-01',
        birthTime: '14:30',
        birthLocation: {
          latitude: 35.6762,
          longitude: 139.6503,
          timezone: 'Asia/Tokyo'
        },
        question: 'What is my life purpose?',
        spreadType: 'celtic_cross',
        currentLocation: {
          latitude: 35.6762,
          longitude: 139.6503
        }
      };

      const result = await integrator.performIntegratedReading(input);

      // Should include astrology since birth time and location are provided
      expect(result.astrology).toBeDefined();
      if (result.astrology) {
        expect(result.astrology).toHaveProperty('chart');
        expect(result.astrology).toHaveProperty('interpretation');
      }

      // Should include all new divination systems
      expect(result.iching).toBeDefined();
      expect(result.shichu).toBeDefined();
      expect(result.runes).toBeDefined();
      expect(result.palmistry).toBeDefined();
      expect(result.vedic).toBeDefined();

      // Tarot should have 10 cards for celtic cross
      expect(result.tarot.cards).toHaveLength(10);

      // Integration should consider all systems
      expect(result.integration.systemCorrelations).toBeDefined();
      expect(result.integration.integratedInsights).toBeDefined();
    }, 30000);

    it('should handle partial data gracefully', async () => {
      const input: IntegratedDivinationInput = {
        fullName: 'Bob Johnson',
        birthDate: '1975-08-20',
        birthTime: '09:15', // Time provided but no location
        question: 'Should I change careers?',
        spreadType: 'five_card'
      };

      const result = await integrator.performIntegratedReading(input);

      // Astrology should be undefined (no location)
      expect(result.astrology).toBeUndefined();

      // Shichu should be undefined (no birth time with location)
      expect(result.shichu).toBeUndefined();

      // Vedic should be undefined (no location)
      expect(result.vedic).toBeUndefined();

      // But other systems should work
      expect(result.numerology).toBeDefined();
      expect(result.tarot).toBeDefined();
      expect(result.iching).toBeDefined();
      expect(result.runes).toBeDefined();
      expect(result.palmistry).toBeDefined();
      expect(result.environment).toBeDefined();

      // Tarot should have 5 cards
      expect(result.tarot.cards).toHaveLength(5);
    }, 30000);

    it('should validate input correctly', async () => {
      const invalidInputs = [
        {}, // Empty input
        { fullName: '', birthDate: '1990-05-15', question: 'Test', spreadType: 'three_card' }, // Empty name
        { fullName: 'John', birthDate: '', question: 'Test', spreadType: 'three_card' }, // Empty date
        { fullName: 'John', birthDate: '1990-05-15', question: '', spreadType: 'three_card' }, // Empty question
        { fullName: 'John', birthDate: '1990-05-15', question: 'Test', spreadType: '' }, // Empty spread
        { fullName: 'John', birthDate: 'invalid-date', question: 'Test', spreadType: 'three_card' }, // Invalid date
        { fullName: 'John', birthDate: '1990-05-15', question: 'Test', spreadType: 'three_card', birthTime: 'invalid-time' }, // Invalid time
      ];

      for (const input of invalidInputs) {
        await expect(integrator.performIntegratedReading(input as any)).rejects.toThrow();
      }
    });

    it('should generate consistent results for same input', async () => {
      const input: IntegratedDivinationInput = {
        fullName: 'John Smith',
        birthDate: '1990-05-15',
        question: 'What should I focus on?',
        spreadType: 'three_card'
      };

      const result1 = await integrator.performIntegratedReading(input);
      const result2 = await integrator.performIntegratedReading(input);

      // Numerology should be identical
      expect(result1.numerology.lifePath).toBe(result2.numerology.lifePath);
      expect(result1.numerology.destiny).toBe(result2.numerology.destiny);

      // Tarot should be identical (same seed derived from input)
      expect(result1.tarot.cards.map(c => c.card.id)).toEqual(result2.tarot.cards.map(c => c.card.id));

      // Environment might be slightly different due to time, but should be close
      expect(result1.environment.date.split('T')[0]).toBe(result2.environment.date.split('T')[0]); // Same date
    }, 30000);

    it('should provide meaningful integration insights', async () => {
      const input: IntegratedDivinationInput = {
        fullName: 'Alice Wonder',
        birthDate: '1988-03-10',
        question: 'How can I improve my relationships?',
        spreadType: 'three_card'
      };

      const result = await integrator.performIntegratedReading(input);

      // Check integration quality
      expect(result.integration.commonThemes.length).toBeGreaterThan(0);
      expect(result.integration.specificAdvice.length).toBeGreaterThan(0);

      result.integration.commonThemes.forEach(theme => {
        expect(typeof theme).toBe('string');
        expect(theme.length).toBeGreaterThan(10);
      });

      result.integration.specificAdvice.forEach(advice => {
        expect(typeof advice).toBe('string');
        expect(advice.length).toBeGreaterThan(10);
      });

      expect(result.integration.overallGuidance.length).toBeGreaterThan(100);
      expect(result.integration.environmentalInfluence.length).toBeGreaterThan(30);
      expect(result.integration.integratedInsights.length).toBeGreaterThan(50);

      // Should contain Japanese text
      expect(/[ひらがなカタカナ一-龯]/.test(result.integration.overallGuidance)).toBe(true);
    }, 30000);
  });

  describe('performCompleteReading', () => {
    it('should perform complete reading with advanced astrology', async () => {
      const input: IntegratedDivinationInput = {
        fullName: 'Complete Test',
        birthDate: '1992-07-15',
        birthTime: '16:45',
        birthLocation: {
          latitude: 35.6762,
          longitude: 139.6503,
          timezone: 'Asia/Tokyo'
        },
        question: 'What is my spiritual path?',
        spreadType: 'celtic_cross'
      };

      const result = await integrator.performCompleteReading(input);

      // Should include all basic systems
      expect(result.numerology).toBeDefined();
      expect(result.tarot).toBeDefined();
      expect(result.environment).toBeDefined();
      expect(result.integration).toBeDefined();

      // Should include all advanced systems
      expect(result.iching).toBeDefined();
      expect(result.shichu).toBeDefined();
      expect(result.runes).toBeDefined();
      expect(result.palmistry).toBeDefined();
      expect(result.vedic).toBeDefined();

      // Should include advanced astrology
      expect(result.advancedAstrology).toBeDefined();

      // Should include complete analysis
      expect(result.completeAnalysis).toBeDefined();
      expect(result.completeAnalysis).toHaveProperty('convergence');
      expect(result.completeAnalysis).toHaveProperty('patterns');
      expect(result.completeAnalysis).toHaveProperty('recommendations');
      expect(result.completeAnalysis).toHaveProperty('timing');
      expect(result.completeAnalysis).toHaveProperty('synthesis');
    }, 45000); // Longer timeout for complete reading
  });

  describe('cache and hash generation', () => {
    it('should generate cache keys correctly', () => {
      const input: IntegratedDivinationInput = {
        fullName: 'Test User',
        birthDate: '1990-01-01',
        question: 'Test question',
        spreadType: 'three_card'
      };

      const cacheKey = integrator.generateCacheKey(input);
      expect(typeof cacheKey).toBe('string');
      expect(cacheKey.length).toBeGreaterThan(0);
      expect(cacheKey.startsWith('integrated:')).toBe(true);
    });

    it('should generate input hashes correctly', () => {
      const input: IntegratedDivinationInput = {
        fullName: 'Test User',
        birthDate: '1990-01-01',
        question: 'Test question',
        spreadType: 'three_card'
      };

      const hash = integrator.generateInputHash(input);
      expect(typeof hash).toBe('string');
      expect(hash.length).toBeGreaterThan(0);
      expect(/^[a-zA-Z0-9]+$/.test(hash)).toBe(true);
    });

    it('should generate different cache keys for different inputs', () => {
      const input1: IntegratedDivinationInput = {
        fullName: 'User One',
        birthDate: '1990-01-01',
        question: 'Question one',
        spreadType: 'three_card'
      };

      const input2: IntegratedDivinationInput = {
        fullName: 'User Two',
        birthDate: '1990-01-01',
        question: 'Question one',
        spreadType: 'three_card'
      };

      const key1 = integrator.generateCacheKey(input1);
      const key2 = integrator.generateCacheKey(input2);
      
      expect(key1).not.toBe(key2);
    });
  });

  describe('error handling', () => {
    it('should handle errors in individual systems gracefully', async () => {
      // Create an input that might cause issues in some systems
      const input: IntegratedDivinationInput = {
        fullName: 'Error Test',
        birthDate: '1900-01-01', // Very old date
        question: 'Will this work?',
        spreadType: 'three_card'
      };

      // Should not throw error even if some subsystems have issues
      const result = await integrator.performIntegratedReading(input);

      // Core systems should still work
      expect(result.numerology).toBeDefined();
      expect(result.tarot).toBeDefined();
      expect(result.environment).toBeDefined();
      expect(result.integration).toBeDefined();
    }, 30000);

    it('should provide fallback integration when some systems fail', async () => {
      const input: IntegratedDivinationInput = {
        fullName: 'Fallback Test',
        birthDate: '1990-05-15',
        question: 'Test question',
        spreadType: 'single_card'
      };

      const result = await integrator.performIntegratedReading(input);

      // Even if some advanced systems don't work, integration should provide meaningful results
      expect(result.integration.commonThemes.length).toBeGreaterThan(0);
      expect(result.integration.overallGuidance.length).toBeGreaterThan(50);
      expect(result.integration.specificAdvice.length).toBeGreaterThan(0);
    }, 30000);
  });
});