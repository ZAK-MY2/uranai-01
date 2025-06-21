// Unit tests for Tarot Engine
import { TarotEngine } from '../tarot';
import type { TarotInput } from '@/types/divination';

describe('TarotEngine', () => {
  let engine: TarotEngine;

  beforeEach(() => {
    engine = new TarotEngine();
  });

  describe('drawCards', () => {
    it('should draw correct number of cards for three-card spread', async () => {
      const input: TarotInput = {
        question: 'What should I focus on in my career?',
        spreadType: 'three_card',
        seed: 'test-seed-123'
      };

      const result = await engine.drawCards(input);

      expect(result.cards).toHaveLength(3);
      expect(result.spreadType).toBe('three_card');
      expect(result.cards.forEach(card => {
        expect(card).toHaveProperty('card');
        expect(card).toHaveProperty('position');
        expect(card).toHaveProperty('isReversed');
        expect(card).toHaveProperty('interpretation');
      }));
    });

    it('should draw correct number of cards for celtic cross spread', async () => {
      const input: TarotInput = {
        question: 'What is my life path?',
        spreadType: 'celtic_cross',
        seed: 'test-seed-456'
      };

      const result = await engine.drawCards(input);

      expect(result.cards).toHaveLength(10);
      expect(result.spreadType).toBe('celtic_cross');
    });

    it('should draw one card for single card spread', async () => {
      const input: TarotInput = {
        question: 'What do I need to know today?',
        spreadType: 'single_card',
        seed: 'test-seed-789'
      };

      const result = await engine.drawCards(input);

      expect(result.cards).toHaveLength(1);
      expect(result.spreadType).toBe('single_card');
    });

    it('should generate consistent results with same seed', async () => {
      const input: TarotInput = {
        question: 'Test question',
        spreadType: 'three_card',
        seed: 'consistent-seed'
      };

      const result1 = await engine.drawCards(input);
      const result2 = await engine.drawCards(input);

      expect(result1.cards.map(c => c.card.id)).toEqual(result2.cards.map(c => c.card.id));
      expect(result1.cards.map(c => c.isReversed)).toEqual(result2.cards.map(c => c.isReversed));
    });

    it('should generate different results with different seeds', async () => {
      const input1: TarotInput = {
        question: 'Test question',
        spreadType: 'three_card',
        seed: 'seed-1'
      };

      const input2: TarotInput = {
        question: 'Test question',
        spreadType: 'three_card',
        seed: 'seed-2'
      };

      const result1 = await engine.drawCards(input1);
      const result2 = await engine.drawCards(input2);

      // Very unlikely to have identical cards and positions
      const cards1 = result1.cards.map(c => `${c.card.id}-${c.isReversed}`);
      const cards2 = result2.cards.map(c => `${c.card.id}-${c.isReversed}`);
      
      expect(cards1).not.toEqual(cards2);
    });

    it('should not draw duplicate cards in same reading', async () => {
      const input: TarotInput = {
        question: 'Test question',
        spreadType: 'celtic_cross',
        seed: 'test-duplicates'
      };

      const result = await engine.drawCards(input);

      const cardIds = result.cards.map(c => c.card.id);
      const uniqueCardIds = [...new Set(cardIds)];
      
      expect(cardIds).toHaveLength(uniqueCardIds.length);
    });

    it('should handle all spread types correctly', async () => {
      const spreadTypes = ['single_card', 'three_card', 'five_card', 'celtic_cross', 'horseshoe'];
      const expectedCardCounts = [1, 3, 5, 10, 7];

      for (let i = 0; i < spreadTypes.length; i++) {
        const input: TarotInput = {
          question: 'Test question',
          spreadType: spreadTypes[i] as any,
          seed: `test-${i}`
        };

        const result = await engine.drawCards(input);
        expect(result.cards).toHaveLength(expectedCardCounts[i]);
      }
    });

    it('should throw error for invalid spread type', async () => {
      const input: TarotInput = {
        question: 'Test question',
        spreadType: 'invalid_spread' as any,
        seed: 'test-invalid'
      };

      await expect(engine.drawCards(input)).rejects.toThrow();
    });

    it('should throw error for empty question', async () => {
      const input: TarotInput = {
        question: '',
        spreadType: 'three_card',
        seed: 'test-empty'
      };

      await expect(engine.drawCards(input)).rejects.toThrow(/質問は必須です/);
    });
  });

  describe('card properties', () => {
    it('should have valid card properties', async () => {
      const input: TarotInput = {
        question: 'Test question',
        spreadType: 'three_card',
        seed: 'test-properties'
      };

      const result = await engine.drawCards(input);

      result.cards.forEach(drawnCard => {
        expect(drawnCard.card).toHaveProperty('id');
        expect(drawnCard.card).toHaveProperty('name');
        expect(drawnCard.card).toHaveProperty('suit');
        expect(drawnCard.card).toHaveProperty('arcana');
        expect(drawnCard.card).toHaveProperty('number');
        expect(drawnCard.card).toHaveProperty('keywords');
        expect(drawnCard.card).toHaveProperty('upright');
        expect(drawnCard.card).toHaveProperty('reversed');
        expect(drawnCard.card).toHaveProperty('description');

        expect(typeof drawnCard.card.id).toBe('string');
        expect(typeof drawnCard.card.name).toBe('string');
        expect(['major', 'minor']).toContain(drawnCard.card.arcana);
        expect(Array.isArray(drawnCard.card.keywords)).toBe(true);
        expect(typeof drawnCard.card.upright).toBe('string');
        expect(typeof drawnCard.card.reversed).toBe('string');
        expect(typeof drawnCard.card.description).toBe('string');
      });
    });

    it('should have meaningful interpretations', async () => {
      const input: TarotInput = {
        question: 'What should I focus on?',
        spreadType: 'three_card',
        seed: 'test-interpretations'
      };

      const result = await engine.drawCards(input);

      expect(result.overall).toBeDefined();
      expect(result.overall.length).toBeGreaterThan(50);
      expect(result.advice).toBeDefined();
      expect(result.advice.length).toBeGreaterThan(30);

      result.cards.forEach(drawnCard => {
        expect(drawnCard.interpretation.length).toBeGreaterThan(20);
        expect(/[ひらがなカタカナ一-龯]/.test(drawnCard.interpretation)).toBe(true);
      });
    });

    it('should have proper position names for spreads', async () => {
      const input: TarotInput = {
        question: 'Test question',
        spreadType: 'three_card',
        seed: 'test-positions'
      };

      const result = await engine.drawCards(input);

      const expectedPositions = ['過去', '現在', '未来'];
      result.cards.forEach((card, index) => {
        expect(card.position).toBe(expectedPositions[index]);
      });
    });
  });

  describe('reversed cards', () => {
    it('should sometimes generate reversed cards', async () => {
      // Generate multiple readings to test randomness
      const promises = Array.from({ length: 20 }, (_, i) => 
        engine.drawCards({
          question: 'Test question',
          spreadType: 'three_card',
          seed: `test-reversed-${i}`
        })
      );

      const results = await Promise.all(promises);
      const allCards = results.flatMap(r => r.cards);
      const reversedCards = allCards.filter(c => c.isReversed);

      // Should have some reversed cards (not all or none)
      expect(reversedCards.length).toBeGreaterThan(0);
      expect(reversedCards.length).toBeLessThan(allCards.length);
    });

    it('should use reversed interpretation for reversed cards', async () => {
      const input: TarotInput = {
        question: 'Test question',
        spreadType: 'single_card',
        seed: 'test-reversed-interp'
      };

      // Generate multiple readings until we get a reversed card
      let hasReversed = false;
      let attempts = 0;
      const maxAttempts = 50;

      while (!hasReversed && attempts < maxAttempts) {
        const result = await engine.drawCards({
          ...input,
          seed: `test-reversed-interp-${attempts}`
        });

        if (result.cards[0].isReversed) {
          hasReversed = true;
          const card = result.cards[0];
          
          // The interpretation should be different from upright meaning
          expect(card.interpretation).not.toBe(card.card.upright);
          expect(card.interpretation.length).toBeGreaterThan(10);
        }
        attempts++;
      }

      // If we didn't find a reversed card in 50 attempts, the test might need adjustment
      // but reversed cards should occur naturally
    });
  });

  describe('generateCacheKey', () => {
    it('should generate unique cache keys for different inputs', () => {
      const input1: TarotInput = {
        question: 'Question 1',
        spreadType: 'three_card',
        seed: 'seed1'
      };

      const input2: TarotInput = {
        question: 'Question 2',
        spreadType: 'three_card',
        seed: 'seed1'
      };

      const key1 = engine.generateCacheKey(input1);
      const key2 = engine.generateCacheKey(input2);

      expect(key1).not.toBe(key2);
    });

    it('should generate same cache key for same input', () => {
      const input: TarotInput = {
        question: 'Test question',
        spreadType: 'three_card',
        seed: 'test-seed'
      };

      const key1 = engine.generateCacheKey(input);
      const key2 = engine.generateCacheKey(input);

      expect(key1).toBe(key2);
    });
  });

  describe('generateInputHash', () => {
    it('should generate hash for input', () => {
      const input: TarotInput = {
        question: 'Test question',
        spreadType: 'three_card',
        seed: 'test-seed'
      };

      const hash = engine.generateInputHash(input);

      expect(typeof hash).toBe('string');
      expect(hash.length).toBeGreaterThan(0);
      expect(/^[a-zA-Z0-9]+$/.test(hash)).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should handle very long questions', async () => {
      const longQuestion = 'This is a very long question that goes on and on and contains many words and asks about many different aspects of life including career, relationships, health, spirituality, and personal growth, and continues to elaborate extensively on each topic.';
      
      const input: TarotInput = {
        question: longQuestion,
        spreadType: 'three_card',
        seed: 'test-long-question'
      };

      const result = await engine.drawCards(input);

      expect(result.cards).toHaveLength(3);
      expect(result.overall).toBeDefined();
    });

    it('should handle questions with special characters', async () => {
      const input: TarotInput = {
        question: 'What about my career? Will I succeed? 🌟💫',
        spreadType: 'three_card',
        seed: 'test-special-chars'
      };

      const result = await engine.drawCards(input);

      expect(result.cards).toHaveLength(3);
      expect(result.overall).toBeDefined();
    });

    it('should handle seed with special characters', async () => {
      const input: TarotInput = {
        question: 'Test question',
        spreadType: 'three_card',
        seed: 'test-seed-!@#$%^&*()'
      };

      const result = await engine.drawCards(input);

      expect(result.cards).toHaveLength(3);
    });
  });
});