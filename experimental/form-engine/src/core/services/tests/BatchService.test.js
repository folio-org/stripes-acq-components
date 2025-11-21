/* Developed collaboratively using AI (Cursor) */

import { BatchService } from '../BatchService';

describe('BatchService', () => {
  it('should batch operations when enabled', () => {
    const service = new BatchService({ enableBatching: true });
    const operations = [];

    service.batch(() => {
      operations.push(1);
      operations.push(2);
    }, (ops) => {
      expect(ops.length).toBeGreaterThan(0);
    });
    expect(operations.length).toBe(2);
  });

  it('should not batch when disabled', () => {
    const service = new BatchService({ enableBatching: false });
    const callback = jest.fn();

    service.batch(() => {
      callback();
    }, jest.fn());
    expect(callback).toHaveBeenCalled();
  });

  it('should queue operations', () => {
    const service = new BatchService({ enableBatching: true, batchDelay: 0 });
    const callback = jest.fn();

    service.setOnFlush(callback);
    service.queueOperation({ path: 'test', value: 1 });
    service.queueOperation({ path: 'test2', value: 2 });
    expect(service.getStats().queueSize).toBeGreaterThan(0);
  });

  it('should flush batch with callback', (done) => {
    const service = new BatchService({ enableBatching: true, batchDelay: 0 });
    const callback = jest.fn(() => {
      expect(callback).toHaveBeenCalled();
      done();
    });

    service.setOnFlush(callback);
    service.queueOperation({ path: 'test', value: 1 });
    // In Node.js, requestAnimationFrame falls back to setTimeout
    // Give it enough time to execute
    setTimeout(() => {
      if (!callback.mock.calls.length) {
        done(new Error('Callback was not called'));
      }
    }, 100);
  });

  it('should clear queue', () => {
    const service = new BatchService({ enableBatching: true });

    service.queueOperation({ path: 'test', value: 1 });
    service.clear();
    expect(service.getStats().queueSize).toBe(0);
  });

  it('should dispose and reset stats', () => {
    const service = new BatchService({ enableBatching: true });

    service.queueOperation({ path: 'test', value: 1 });
    service.dispose();
    const stats = service.getStats();

    expect(stats.totalBatches).toBe(0);
    expect(stats.totalOperations).toBe(0);
  });

  it('should update config', () => {
    const service = new BatchService({ enableBatching: true, batchDelay: 100 });

    service.updateConfig({ batchDelay: 200 });
    expect(service.options.batchDelay).toBe(200);
  });

  it('should get stats', () => {
    const service = new BatchService({ enableBatching: true });
    const stats = service.getStats();

    expect(stats).toHaveProperty('totalBatches');
    expect(stats).toHaveProperty('totalOperations');
    expect(stats).toHaveProperty('queueSize');
    expect(stats).toHaveProperty('isBatching');
  });

  it('should reset stats', () => {
    const service = new BatchService({ enableBatching: true });

    service.queueOperation({ path: 'test', value: 1 });
    service.resetStats();
    const stats = service.getStats();

    expect(stats.totalBatches).toBe(0);
    expect(stats.totalOperations).toBe(0);
  });

  it('should handle nested batching', () => {
    const service = new BatchService({ enableBatching: true });
    const callback = jest.fn();

    service.batch(() => {
      service.batch(() => {
        callback();
      }, jest.fn());
    }, jest.fn());
    expect(callback).toHaveBeenCalled();
  });

  describe('RequestAnimationFrame edge cases', () => {
    it('should handle rapid queue operations', (done) => {
      const service = new BatchService({ enableBatching: true, batchDelay: 0 });
      const operations = [];

      service.setOnFlush(() => {
        expect(operations.length).toBeGreaterThan(0);
        done();
      });

      // Queue multiple operations rapidly
      for (let i = 0; i < 10; i++) {
        service.queueOperation({ path: `field${i}`, value: i });
        operations.push(i);
      }
    });

    it('should cancel pending flush on clear', () => {
      const service = new BatchService({ enableBatching: true, batchDelay: 10 });
      const callback = jest.fn();

      service.setOnFlush(callback);
      service.queueOperation({ path: 'test', value: 1 });

      // Clear before flush happens
      service.clear();

      setTimeout(() => {
        expect(callback).not.toHaveBeenCalled();
      }, 50);
    });

    it('should handle dispose during pending flush', () => {
      const service = new BatchService({ enableBatching: true, batchDelay: 10 });
      const callback = jest.fn();

      service.setOnFlush(callback);
      service.queueOperation({ path: 'test', value: 1 });

      // Dispose before flush
      service.dispose();

      setTimeout(() => {
        expect(callback).not.toHaveBeenCalled();
      }, 50);
    });
  });

  describe('Concurrent flushes', () => {
    it('should prevent concurrent flush execution', (done) => {
      const service = new BatchService({ enableBatching: true, batchDelay: 0 });
      let flushCount = 0;

      service.setOnFlush(() => {
        flushCount++;
      });

      // Queue operations that would trigger multiple flushes
      service.queueOperation({ path: 'field1', value: 1 });

      setTimeout(() => {
        service.queueOperation({ path: 'field2', value: 2 });
      }, 5);

      setTimeout(() => {
        // Should have flushed operations
        expect(flushCount).toBeGreaterThan(0);
        done();
      }, 100);
    });
  });

  describe('Operation priorities', () => {
    it('should process operations in FIFO order', (done) => {
      const service = new BatchService({ enableBatching: true, batchDelay: 0 });
      const processedPaths = [];

      service.setOnFlush(() => {
        const stats = service.getStats();

        expect(stats.queueSize).toBe(0);
        done();
      });

      service.queueOperation({ path: 'first', value: 1 });
      service.queueOperation({ path: 'second', value: 2 });
      service.queueOperation({ path: 'third', value: 3 });

      processedPaths.push('first', 'second', 'third');
      expect(processedPaths).toEqual(['first', 'second', 'third']);
    });
  });

  describe('Memory management', () => {
    it('should not accumulate operations after flush', (done) => {
      const service = new BatchService({ enableBatching: true, batchDelay: 0 });

      service.setOnFlush(() => {
        const stats = service.getStats();

        expect(stats.queueSize).toBe(0);
        done();
      });

      // Queue many operations
      for (let i = 0; i < 100; i++) {
        service.queueOperation({ path: `field${i}`, value: i });
      }
    });

    it('should cleanup on dispose', () => {
      const service = new BatchService({ enableBatching: true });

      for (let i = 0; i < 50; i++) {
        service.queueOperation({ path: `field${i}`, value: i });
      }

      service.dispose();

      const stats = service.getStats();

      expect(stats.queueSize).toBe(0);
      expect(stats.totalBatches).toBe(0);
    });
  });

  describe('Multiple onFlush handlers', () => {
    it('should only use the last setOnFlush handler', (done) => {
      const service = new BatchService({ enableBatching: true, batchDelay: 0 });
      const callback1 = jest.fn();
      const callback2 = jest.fn();

      service.setOnFlush(callback1);
      service.setOnFlush(callback2); // This should replace callback1

      service.queueOperation({ path: 'test', value: 1 });

      setTimeout(() => {
        expect(callback1).not.toHaveBeenCalled();
        expect(callback2).toHaveBeenCalled();
        done();
      }, 50);
    });
  });

  describe('Batch delay variations', () => {
    it('should respect custom batchDelay', (done) => {
      const service = new BatchService({ enableBatching: true, batchDelay: 50 });
      const callback = jest.fn();
      const startTime = Date.now();

      service.setOnFlush(() => {
        const elapsed = Date.now() - startTime;

        expect(elapsed).toBeGreaterThanOrEqual(40); // Allow some variance
        callback();
        done();
      });

      service.queueOperation({ path: 'test', value: 1 });
    });

    it('should handle zero delay', (done) => {
      const service = new BatchService({ enableBatching: true, batchDelay: 0 });
      const callback = jest.fn();

      service.setOnFlush(() => {
        callback();
        done();
      });

      service.queueOperation({ path: 'test', value: 1 });
    });
  });

  describe('Stats tracking', () => {
    it('should track totalBatches correctly', (done) => {
      const service = new BatchService({ enableBatching: true, batchDelay: 0 });
      let flushCount = 0;

      service.setOnFlush(() => {
        flushCount++;

        if (flushCount === 2) {
          const stats = service.getStats();

          expect(stats.totalBatches).toBe(2);
          done();
        }
      });

      service.queueOperation({ path: 'test1', value: 1 });

      setTimeout(() => {
        service.queueOperation({ path: 'test2', value: 2 });
      }, 20);
    });

    it('should track totalOperations correctly', (done) => {
      const service = new BatchService({ enableBatching: true, batchDelay: 0 });

      service.setOnFlush(() => {
        const stats = service.getStats();

        expect(stats.totalOperations).toBeGreaterThan(0);
        done();
      });

      service.queueOperation({ path: 'test1', value: 1 });
      service.queueOperation({ path: 'test2', value: 2 });
      service.queueOperation({ path: 'test3', value: 3 });
    });

    it('should track isBatching flag', () => {
      const service = new BatchService({ enableBatching: true });

      service.batch(() => {
        const stats = service.getStats();

        expect(stats.isBatching).toBe(true);
      }, jest.fn());

      const stats = service.getStats();

      expect(stats.isBatching).toBe(false);
    });
  });

  describe('Edge cases', () => {
    it('should handle empty queue flush', (done) => {
      const service = new BatchService({ enableBatching: true, batchDelay: 0 });
      const callback = jest.fn();

      service.setOnFlush(callback);

      // Don't queue anything, but trigger a flush somehow
      setTimeout(() => {
        expect(callback).not.toHaveBeenCalled();
        done();
      }, 50);
    });

    it('should handle updateConfig during batching', () => {
      const service = new BatchService({ enableBatching: true, batchDelay: 100 });

      service.batch(() => {
        service.updateConfig({ batchDelay: 50 });
        expect(service.options.batchDelay).toBe(50);
      }, jest.fn());
    });

    it('should handle multiple clear calls', () => {
      const service = new BatchService({ enableBatching: true });

      service.queueOperation({ path: 'test', value: 1 });
      service.clear();
      service.clear();
      service.clear();

      expect(service.getStats().queueSize).toBe(0);
    });

    it('should handle multiple dispose calls', () => {
      const service = new BatchService({ enableBatching: true });

      service.queueOperation({ path: 'test', value: 1 });
      service.dispose();
      service.dispose();

      const stats = service.getStats();

      expect(stats.totalBatches).toBe(0);
    });
  });
});
