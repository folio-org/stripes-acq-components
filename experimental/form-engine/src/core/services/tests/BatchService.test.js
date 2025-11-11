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
});
