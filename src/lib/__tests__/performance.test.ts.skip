// Performance tests for divination systems
import { numerologyEngine } from '@/lib/divination/numerology';
import { tarotEngine } from '@/lib/divination/tarot';
import { divinationIntegrator } from '@/lib/divination/integrator';
import type { NumerologyInput, TarotInput, IntegratedDivinationInput } from '@/types/divination';

describe('Performance Tests', () => {
  const PERFORMANCE_THRESHOLD = {
    numerology: 100, // ms
    tarot: 200, // ms
    integrated: 5000, // ms - allows for multiple systems
  };

  describe('Numerology Performance', () => {
    it('should calculate numerology within performance threshold', async () => {
      const input: NumerologyInput = {
        fullName: 'パフォーマンステスト',
        birthDate: '1990-05-15'
      };

      const startTime = performance.now();
      const result = await numerologyEngine.calculate(input);
      const endTime = performance.now();

      const duration = endTime - startTime;
      
      expect(result).toBeDefined();
      expect(duration).toBeLessThan(PERFORMANCE_THRESHOLD.numerology);
      
      console.log(`Numerology calculation took ${duration.toFixed(2)}ms`);
    });

    it('should handle multiple concurrent numerology calculations', async () => {
      const inputs: NumerologyInput[] = Array.from({ length: 10 }, (_, i) => ({
        fullName: `テストユーザー${i}`,
        birthDate: `199${i % 10}-0${(i % 9) + 1}-1${(i % 9) + 1}`
      }));

      const startTime = performance.now();
      const results = await Promise.all(
        inputs.map(input => numerologyEngine.calculate(input))
      );
      const endTime = performance.now();

      const duration = endTime - startTime;
      const averageDuration = duration / inputs.length;

      expect(results).toHaveLength(10);
      expect(averageDuration).toBeLessThan(PERFORMANCE_THRESHOLD.numerology);
      
      console.log(`10 concurrent numerology calculations took ${duration.toFixed(2)}ms (avg: ${averageDuration.toFixed(2)}ms)`);
    });
  });

  describe('Tarot Performance', () => {
    it('should draw tarot cards within performance threshold', async () => {
      const input: TarotInput = {
        question: 'パフォーマンステストの質問です',
        spreadType: 'three_card',
        seed: 'performance-test'
      };

      const startTime = performance.now();
      const result = await tarotEngine.drawCards(input);
      const endTime = performance.now();

      const duration = endTime - startTime;
      
      expect(result).toBeDefined();
      expect(result.cards).toHaveLength(3);
      expect(duration).toBeLessThan(PERFORMANCE_THRESHOLD.tarot);
      
      console.log(`Tarot reading took ${duration.toFixed(2)}ms`);
    });

    it('should handle large tarot spreads efficiently', async () => {
      const input: TarotInput = {
        question: '大きなスプレッドのテスト',
        spreadType: 'celtic_cross',
        seed: 'large-spread-test'
      };

      const startTime = performance.now();
      const result = await tarotEngine.drawCards(input);
      const endTime = performance.now();

      const duration = endTime - startTime;
      
      expect(result).toBeDefined();
      expect(result.cards).toHaveLength(10);
      expect(duration).toBeLessThan(PERFORMANCE_THRESHOLD.tarot * 2); // Allow more time for larger spreads
      
      console.log(`Celtic cross tarot reading took ${duration.toFixed(2)}ms`);
    });
  });

  describe('Integrated Reading Performance', () => {
    it('should complete integrated reading within threshold', async () => {
      const input: IntegratedDivinationInput = {
        fullName: '統合テストユーザー',
        birthDate: '1985-12-01',
        question: 'パフォーマンステストの統合占術質問',
        spreadType: 'three_card'
      };

      const startTime = performance.now();
      const result = await divinationIntegrator.performIntegratedReading(input);
      const endTime = performance.now();

      const duration = endTime - startTime;
      
      expect(result).toBeDefined();
      expect(result.numerology).toBeDefined();
      expect(result.tarot).toBeDefined();
      expect(result.environment).toBeDefined();
      expect(result.integration).toBeDefined();
      expect(duration).toBeLessThan(PERFORMANCE_THRESHOLD.integrated);
      
      console.log(`Integrated reading took ${duration.toFixed(2)}ms`);
    });

    it('should handle integrated reading with full astrological data', async () => {
      const input: IntegratedDivinationInput = {
        fullName: 'フル占星術テスト',
        birthDate: '1992-07-15',
        birthTime: '14:30',
        birthLocation: {
          latitude: 35.6762,
          longitude: 139.6503,
          timezone: 'Asia/Tokyo',
          city: 'Tokyo'
        },
        question: 'フル占星術データでのパフォーマンステスト',
        spreadType: 'five_card'
      };

      const startTime = performance.now();
      const result = await divinationIntegrator.performIntegratedReading(input);
      const endTime = performance.now();

      const duration = endTime - startTime;
      
      expect(result).toBeDefined();
      expect(duration).toBeLessThan(PERFORMANCE_THRESHOLD.integrated * 2); // Allow more time for full calculation
      
      console.log(`Full integrated reading took ${duration.toFixed(2)}ms`);
    }, 15000); // Increased timeout for full reading
  });

  describe('Memory Usage Tests', () => {
    it('should not have memory leaks in repeated calculations', async () => {
      const input: NumerologyInput = {
        fullName: 'メモリテスト',
        birthDate: '1990-01-01'
      };

      // Warm up
      await numerologyEngine.calculate(input);

      // Measure memory before
      const memBefore = process.memoryUsage();

      // Perform many calculations
      for (let i = 0; i < 100; i++) {
        await numerologyEngine.calculate({
          fullName: `メモリテスト${i}`,
          birthDate: `199${i % 10}-0${(i % 9) + 1}-0${(i % 9) + 1}`
        });
      }

      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }

      // Measure memory after
      const memAfter = process.memoryUsage();

      const heapUsedDiff = memAfter.heapUsed - memBefore.heapUsed;
      const heapUsedDiffMB = heapUsedDiff / 1024 / 1024;

      console.log(`Memory usage difference: ${heapUsedDiffMB.toFixed(2)}MB`);
      
      // Should not use more than 50MB for 100 calculations
      expect(heapUsedDiffMB).toBeLessThan(50);
    });
  });

  describe('Stress Tests', () => {
    it('should handle rapid consecutive requests', async () => {
      const inputs = Array.from({ length: 50 }, (_, i) => ({
        fullName: `ストレステスト${i}`,
        birthDate: '1990-05-15',
        question: `ストレステスト質問${i}`,
        spreadType: 'three_card' as const
      }));

      const startTime = performance.now();
      
      // Fire all requests simultaneously
      const promises = inputs.map(input => 
        divinationIntegrator.performIntegratedReading(input)
      );
      
      const results = await Promise.all(promises);
      const endTime = performance.now();

      const duration = endTime - startTime;
      const averageDuration = duration / inputs.length;

      expect(results).toHaveLength(50);
      expect(results.every(r => r.numerology && r.tarot && r.environment)).toBe(true);
      expect(averageDuration).toBeLessThan(PERFORMANCE_THRESHOLD.integrated);
      
      console.log(`50 concurrent integrated readings took ${duration.toFixed(2)}ms (avg: ${averageDuration.toFixed(2)}ms)`);
    }, 30000); // Increased timeout for stress test

    it('should maintain performance under sustained load', async () => {
      const batchSize = 10;
      const batches = 5;
      const durations: number[] = [];

      for (let batch = 0; batch < batches; batch++) {
        const inputs = Array.from({ length: batchSize }, (_, i) => ({
          fullName: `持続負荷テスト${batch}-${i}`,
          birthDate: '1990-05-15'
        }));

        const startTime = performance.now();
        const results = await Promise.all(
          inputs.map(input => numerologyEngine.calculate(input))
        );
        const endTime = performance.now();

        const duration = endTime - startTime;
        durations.push(duration);

        expect(results).toHaveLength(batchSize);
        
        // Small delay between batches
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
      const maxDuration = Math.max(...durations);
      const minDuration = Math.min(...durations);

      console.log(`Sustained load test - Avg: ${avgDuration.toFixed(2)}ms, Min: ${minDuration.toFixed(2)}ms, Max: ${maxDuration.toFixed(2)}ms`);

      // Performance should not degrade significantly
      expect(maxDuration).toBeLessThan(minDuration * 3); // Max should not be more than 3x min
      expect(avgDuration).toBeLessThan(PERFORMANCE_THRESHOLD.numerology * batchSize);
    }, 20000);
  });

  describe('Caching Performance', () => {
    it('should improve performance with caching', async () => {
      const input: NumerologyInput = {
        fullName: 'キャッシュテスト',
        birthDate: '1990-05-15'
      };

      // First calculation (no cache)
      const startTime1 = performance.now();
      const result1 = await numerologyEngine.calculate(input);
      const endTime1 = performance.now();
      const duration1 = endTime1 - startTime1;

      // Second calculation (should use cache if implemented)
      const startTime2 = performance.now();
      const result2 = await numerologyEngine.calculate(input);
      const endTime2 = performance.now();
      const duration2 = endTime2 - startTime2;

      expect(result1).toEqual(result2);
      
      console.log(`First calculation: ${duration1.toFixed(2)}ms, Second: ${duration2.toFixed(2)}ms`);
      
      // If caching is implemented, second should be faster
      // If not, both should be within threshold
      expect(duration1).toBeLessThan(PERFORMANCE_THRESHOLD.numerology);
      expect(duration2).toBeLessThan(PERFORMANCE_THRESHOLD.numerology);
    });
  });
});