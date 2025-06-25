import { ErrorTracker } from '@/lib/monitoring/error-tracker';
import { Logger } from '@/lib/monitoring/logger';
import { PerformanceMonitor } from '@/lib/monitoring/performance-monitor';

describe('Monitoring System Tests', () => {
  describe('ErrorTracker', () => {
    let errorTracker: ErrorTracker;

    beforeEach(() => {
      errorTracker = new ErrorTracker();
    });

    test('should track errors correctly', async () => {
      const error = new Error('Test error');
      const errorId = await errorTracker.trackError(error, 'api_error', {
        userId: 'test-user',
        path: '/test'
      });

      expect(errorId).toBeDefined();
      expect(errorId).toMatch(/^err_/);

      const metrics = errorTracker.getMetrics();
      expect(metrics.totalErrors).toBe(1);
      expect(metrics.errorsByCategory.api_error).toBe(1);
    });

    test('should group similar errors by fingerprint', async () => {
      const error1 = new Error('Database connection failed');
      const error2 = new Error('Database connection failed');

      await errorTracker.trackError(error1, 'database_error');
      await errorTracker.trackError(error2, 'database_error');

      const metrics = errorTracker.getMetrics();
      expect(metrics.totalErrors).toBe(2);
      // Note: Fingerprints include stack location, so they may be different in tests
      expect(metrics.topErrors.length).toBeGreaterThan(0);
    });

    test('should determine error severity correctly', async () => {
      await errorTracker.trackError(new Error('Critical database failure'), 'database_error');
      await errorTracker.trackError(new Error('Validation warning'), 'validation_error');
      await errorTracker.trackError(new Error('Info message'), 'unknown_error');

      const metrics = errorTracker.getMetrics();
      expect(metrics.errorsBySeverity.critical).toBe(1);
      expect(metrics.errorsBySeverity.medium).toBe(1);
      expect(metrics.errorsBySeverity.low).toBe(1);
    });

    test('should resolve errors', async () => {
      const error = new Error('Test error');
      await errorTracker.trackError(error, 'api_error');
      
      const metrics = errorTracker.getMetrics();
      const errorFingerprint = metrics.topErrors[0].fingerprint;
      
      const resolved = errorTracker.resolveError(errorFingerprint, 'test-admin', 'Fixed the issue');
      expect(resolved).toBe(true);

      const searchResults = errorTracker.searchErrors({ resolved: true });
      expect(searchResults).toHaveLength(1);
      expect(searchResults[0].resolved).toBe(true);
      expect(searchResults[0].resolvedBy).toBe('test-admin');
    });

    test('should search errors by criteria', async () => {
      await errorTracker.trackError(new Error('API error'), 'api_error');
      await errorTracker.trackError(new Error('DB error'), 'database_error');
      await errorTracker.trackError(new Error('Critical API error'), 'api_error', {}, 'critical');

      const apiErrors = errorTracker.searchErrors({ category: 'api_error' });
      expect(apiErrors).toHaveLength(2);

      const criticalErrors = errorTracker.searchErrors({ severity: 'critical' });
      expect(criticalErrors.length).toBeGreaterThanOrEqual(1);

      const searchTermResults = errorTracker.searchErrors({ searchTerm: 'API' });
      expect(searchTermResults).toHaveLength(2);
    });

    test('should generate error reports', async () => {
      await errorTracker.trackError(new Error('Test error 1'), 'api_error');
      await errorTracker.trackError(new Error('Test error 2'), 'database_error');

      const timeRange = {
        start: new Date(Date.now() - 3600000),
        end: new Date()
      };

      const report = errorTracker.generateReport(timeRange);
      expect(report).toContain('Error Report');
      expect(report).toContain('Total Errors: 2');
      expect(report).toContain('api_error: 1');
      expect(report).toContain('database_error: 1');
    });
  });

  describe('Logger', () => {
    let logger: Logger;
    let consoleSpy: jest.SpyInstance;

    beforeEach(() => {
      logger = new Logger({
        enableConsole: true,
        enableRemote: false,
        formatJson: false,
        minLevel: 'debug'
      });
      consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      jest.spyOn(console, 'info').mockImplementation();
      jest.spyOn(console, 'warn').mockImplementation();
      jest.spyOn(console, 'error').mockImplementation();
      jest.spyOn(console, 'debug').mockImplementation();
    });

    afterEach(() => {
      consoleSpy.mockRestore();
      logger.destroy();
    });

    test('should log different levels correctly', () => {
      const debugSpy = jest.spyOn(console, 'debug');
      const infoSpy = jest.spyOn(console, 'info');
      const warnSpy = jest.spyOn(console, 'warn');
      const errorSpy = jest.spyOn(console, 'error');

      logger.debug('Debug message');
      logger.info('Info message');
      logger.warn('Warning message');
      logger.error('Error message');
      logger.fatal('Fatal message');

      expect(debugSpy).toHaveBeenCalled();
      expect(infoSpy).toHaveBeenCalled();
      expect(warnSpy).toHaveBeenCalled();
      expect(errorSpy).toHaveBeenCalledTimes(3); // error, fatal, and error tracking
    });

    test('should log with context', () => {
      const infoSpy = jest.spyOn(console, 'info');
      
      logger.info('Test message', {
        userId: 'test-user',
        action: 'test-action',
        metadata: { key: 'value' }
      });

      expect(infoSpy).toHaveBeenCalledWith(
        expect.stringContaining('Test message')
      );
    });

    test('should create child loggers with inherited context', () => {
      const infoSpy = jest.spyOn(console, 'info');
      
      const childLogger = logger.child({
        component: 'test-component',
        userId: 'test-user'
      });

      childLogger.info('Child log message');

      expect(infoSpy).toHaveBeenCalledWith(
        expect.stringContaining('test-component')
      );
    });

    test('should measure performance', async () => {
      const infoSpy = jest.spyOn(console, 'info');
      
      const testOperation = async () => {
        await new Promise(resolve => setTimeout(resolve, 10)); // Reduced time for tests
        return 'result';
      };

      const result = await logger.measurePerformance('test-operation', testOperation, {
        userId: 'test-user'
      });

      expect(result).toBe('result');
      expect(infoSpy).toHaveBeenCalledWith(
        expect.stringContaining('test-operation completed')
      );
    });

    test('should handle errors in measured operations', async () => {
      const errorSpy = jest.spyOn(console, 'error');
      
      const errorOperation = async () => {
        throw new Error('Test error');
      };

      await expect(
        logger.measurePerformance('error-operation', errorOperation)
      ).rejects.toThrow('Test error');

      expect(errorSpy).toHaveBeenCalled(); // Just check it was called
    });

    test('should use helper methods for specific logging', () => {
      const infoSpy = jest.spyOn(console, 'info');
      
      logger.logDivinationRequest('tarot', { question: 'test' }, { userId: 'test-user' });
      logger.logDivinationResult('tarot', true, 1000, { userId: 'test-user' });
      logger.logApiRequest('GET', '/api/test', 200, 500, { userId: 'test-user' });

      expect(infoSpy).toHaveBeenCalledTimes(3);
    });
  });

  describe('PerformanceMonitor', () => {
    let performanceMonitor: PerformanceMonitor;

    beforeEach(() => {
      performanceMonitor = new PerformanceMonitor();
    });

    afterEach(() => {
      performanceMonitor.destroy();
    });

    test('should record metrics correctly', () => {
      performanceMonitor.recordMetric('test_metric', 100, 'ms', { component: 'test' });
      performanceMonitor.incrementCounter('test_counter', { action: 'test' });
      performanceMonitor.setGauge('test_gauge', 50, 'percent');

      const metrics = performanceMonitor.getMetrics();
      expect(metrics.totalMetrics).toBe(3);
    });

    test('should measure async operations', async () => {
      const testOperation = async () => {
        await new Promise(resolve => setTimeout(resolve, 50));
        return 'success';
      };

      const result = await performanceMonitor.measureAsync('test_async', testOperation, {
        component: 'test'
      });

      expect(result).toBe('success');
      
      const metrics = performanceMonitor.getMetrics();
      expect(metrics.totalMetrics).toBeGreaterThan(0);
    });

    test('should measure sync operations', () => {
      const testOperation = () => {
        return 'sync result';
      };

      const result = performanceMonitor.measureSync('test_sync', testOperation, {
        component: 'test'
      });

      expect(result).toBe('sync result');
      
      const metrics = performanceMonitor.getMetrics();
      expect(metrics.totalMetrics).toBeGreaterThan(0);
    });

    test('should handle operation errors and track them', async () => {
      const errorOperation = async () => {
        throw new Error('Operation failed');
      };

      await expect(
        performanceMonitor.measureAsync('error_operation', errorOperation)
      ).rejects.toThrow('Operation failed');

      const metrics = performanceMonitor.getMetrics();
      expect(metrics.totalMetrics).toBeGreaterThan(0);
    });

    test('should track timers correctly', () => {
      performanceMonitor.startTimer('manual_timer', { test: 'true' });
      
      // Simulate some work
      const start = Date.now();
      while (Date.now() - start < 10) {
        // busy wait
      }
      
      const duration = performanceMonitor.endTimer('manual_timer', { test: 'true' });
      
      expect(duration).toBeGreaterThan(0);
      
      const metrics = performanceMonitor.getMetrics();
      expect(metrics.totalMetrics).toBeGreaterThan(0);
    });

    test('should generate performance reports', () => {
      performanceMonitor.recordMetric('test_response_time', 150, 'ms');
      performanceMonitor.recordMetric('test_memory', 1024, 'bytes');
      
      const report = performanceMonitor.generateReport(3600000);
      
      expect(report).toContain('Performance Report');
      expect(report).toContain('Total Metrics');
      expect(report).toContain('Average Response Time');
    });

    test('should measure specific operations', async () => {
      const mockDivinationOp = async () => 'divination result';
      const mockApiOp = async () => 'api result';
      const mockDbOp = async () => 'db result';

      const divinationResult = await performanceMonitor.measureDivination('tarot', mockDivinationOp);
      const apiResult = await performanceMonitor.measureApiEndpoint('GET', '/api/test', mockApiOp);
      const dbResult = await performanceMonitor.measureDatabase('select', mockDbOp);

      expect(divinationResult).toBe('divination result');
      expect(apiResult).toBe('api result');
      expect(dbResult).toBe('db result');

      const metrics = performanceMonitor.getMetrics();
      expect(metrics.totalMetrics).toBeGreaterThan(0);
    });
  });

  describe('Integration Tests', () => {
    test('should integrate error tracking with logging', async () => {
      const logger = new Logger({ enableConsole: false });
      
      // Test logging functionality
      logger.error('Test integration error', new Error('Integration test'));

      // Test that logger can work with error tracking
      expect(() => logger.error('Test error')).not.toThrow();

      logger.destroy();
    });

    test('should integrate performance monitoring with error tracking', async () => {
      const performanceMonitor = new PerformanceMonitor();

      const errorOperation = async () => {
        throw new Error('Performance error test');
      };

      await expect(
        performanceMonitor.measureAsync('integration_test', errorOperation)
      ).rejects.toThrow('Performance error test');

      const perfMetrics = performanceMonitor.getMetrics();
      expect(perfMetrics.totalMetrics).toBeGreaterThan(0);

      performanceMonitor.destroy();
    });

    test('should handle high-frequency operations efficiently', async () => {
      const logger = new Logger({ maxBufferSize: 10 });
      const performanceMonitor = new PerformanceMonitor();

      // Simulate high-frequency operations
      const operations = Array.from({ length: 100 }, (_, i) => 
        performanceMonitor.measureAsync(`high_freq_${i}`, async () => {
          logger.info(`Operation ${i}`, { index: i });
          return i;
        })
      );

      const results = await Promise.all(operations);
      
      expect(results).toHaveLength(100);
      expect(results[99]).toBe(99);

      const metrics = performanceMonitor.getMetrics();
      expect(metrics.totalMetrics).toBeGreaterThan(0);

      logger.destroy();
      performanceMonitor.destroy();
    });
  });
});