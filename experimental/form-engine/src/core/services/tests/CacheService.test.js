/* Developed collaboratively using AI (Cursor) */

import { CacheService } from '../CacheService';

describe('CacheService', () => {
  it('should cache values when enabled', () => {
    const service = new CacheService({ enableValueCache: true });
    const computeFn = jest.fn(() => 'computed');
    const key = service.createValueKey('test', { test: 'value' });
    const result1 = service.getValue(key, computeFn);
    const result2 = service.getValue(key, computeFn);
    expect(computeFn).toHaveBeenCalledTimes(1);
    expect(result1).toBe('computed');
    expect(result2).toBe('computed');
  });

  it('should not cache when disabled', () => {
    const service = new CacheService({ enableValueCache: false });
    const computeFn = jest.fn(() => 'computed');
    const key = service.createValueKey('test', { test: 'value' });
    service.getValue(key, computeFn);
    service.getValue(key, computeFn);
    expect(computeFn).toHaveBeenCalledTimes(2);
  });

  it('should cache form state', () => {
    const service = new CacheService({ enableFormStateCache: true });
    const computeFn = jest.fn(() => ({ values: {}, errors: {} }));
    const formState = { values: {}, errors: {} };
    const result1 = service.getFormState(formState, computeFn);
    const result2 = service.getFormState(formState, computeFn);
    expect(computeFn).toHaveBeenCalledTimes(1);
    expect(result1).toBe(result2);
  });

  it('should clear cache for path', () => {
    const service = new CacheService({ enableValueCache: true });
    const computeFn = jest.fn(() => 'computed');
    const key = service.createValueKey('test', { test: 'value' });
    service.getValue(key, computeFn);
    service.clearForPath('test');
    service.getValue(key, computeFn);
    expect(computeFn).toHaveBeenCalledTimes(2);
  });

  it('should clear form state cache', () => {
    const service = new CacheService({ enableFormStateCache: true });
    const computeFn = jest.fn(() => ({ values: {}, errors: {} }));
    const formState = { values: {}, errors: {} };
    service.getFormState(formState, computeFn);
    service.clearFormStateCache();
    service.getFormState(formState, computeFn);
    expect(computeFn).toHaveBeenCalledTimes(2);
  });

  it('should create value key from path and value', () => {
    const service = new CacheService();
    const key1 = service.createValueKey('test', { test: 'value' });
    const key2 = service.createValueKey('test', { test: 'value' });
    expect(key1).toBe(key2);
  });

  it('should create form state key', () => {
    const service = new CacheService();
    const formState = { values: { a: 1 }, errors: {} };
    const key = service.createFormStateKey(formState);
    expect(typeof key).toBe('string');
  });

  it('should get cache stats', () => {
    const service = new CacheService({ enableValueCache: true });
    const computeFn = jest.fn(() => 'computed');
    const key = service.createValueKey('test', { test: 'value' });
    service.getValue(key, computeFn);
    service.getValue(key, computeFn);
    const stats = service.getStats();
    expect(stats.hits).toBe(1);
    expect(stats.misses).toBe(1);
    expect(stats.hitRate).toBeDefined();
  });

  it('should limit cache size', () => {
    const service = new CacheService({ enableValueCache: true, maxCacheSize: 2 });
    const computeFn = jest.fn((idx) => `computed${idx}`);
    for (let i = 0; i < 5; i++) {
      const key = service.createValueKey(`test${i}`, { [`test${i}`]: `value${i}` });
      service.getValue(key, () => computeFn(i));
    }
    const stats = service.getStats();
    expect(stats.size).toBeLessThanOrEqual(2);
  });
});

