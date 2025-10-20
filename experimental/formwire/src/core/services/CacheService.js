/**
 * Cache Service - External caching logic
 * Can be injected into FormEngine for custom caching behavior
 */

import { hashFormState } from '../../utils/hash';

export class CacheService {
  constructor(options = {}) {
    this.options = {
      enableValueCache: true,
      enableFormStateCache: true,
      maxCacheSize: 1000,
      ...options,
    };

    // Initialize caches
    this.valueCache = this.options.enableValueCache ? new Map() : null;
    this.formStateCache = this.options.enableFormStateCache ? new Map() : null;

    // Cache statistics
    this.stats = {
      hits: 0,
      misses: 0,
      size: 0,
    };
  }

  /**
   * Get cached value
   * @param {string} key - Cache key
   * @param {Function} computeFn - Function to compute value if not cached
   * @returns {*} Cached or computed value
   */
  getValue(key, computeFn) {
    if (!this.valueCache) {
      return computeFn();
    }

    const cachedValue = this.valueCache.get(key);

    if (cachedValue !== undefined) {
      this.stats.hits++;

      return cachedValue;
    }

    this.stats.misses++;
    const value = computeFn();

    // Check cache size limit
    if (this.valueCache.size >= this.options.maxCacheSize) {
      // Remove oldest entries (Map maintains insertion order)
      const keysToDelete = Array.from(this.valueCache.keys()).slice(0, Math.floor(this.options.maxCacheSize / 2));

      keysToDelete.forEach(cacheKeyToDelete => this.valueCache.delete(cacheKeyToDelete));
    }

    this.valueCache.set(key, value);
    this.stats.size = this.valueCache.size;

    return value;
  }

  /**
   * Get cached form state
   * @param {Object} formState - Form state object
   * @param {Function} computeFn - Function to compute state if not cached
   * @returns {Object} Cached or computed form state
   */
  getFormState(formState, computeFn) {
    if (!this.formStateCache) {
      return computeFn();
    }

    const cacheKey = hashFormState(formState);

    const cachedFormState = this.formStateCache.get(cacheKey);

    if (cachedFormState !== undefined) {
      this.stats.hits++;

      return cachedFormState;
    }

    this.stats.misses++;
    const computedState = computeFn();

    // Check cache size limit
    if (this.formStateCache.size >= this.options.maxCacheSize) {
      // Remove oldest entries (Map maintains insertion order)
      const keysToDelete = Array.from(this.formStateCache.keys()).slice(0, Math.floor(this.options.maxCacheSize / 2));

      keysToDelete.forEach(cacheKeyToDelete => this.formStateCache.delete(cacheKeyToDelete));
    }

    this.formStateCache.set(cacheKey, computedState);
    this.stats.size = this.formStateCache.size;

    return computedState;
  }

  /**
   * Clear cache for specific path
   * @param {string} path - Field path
   */
  clearForPath(_path) {
    if (this.valueCache) {
      // In a real implementation, track affected keys by path
      this.valueCache.clear();
      this.stats.size = this.valueCache.size;
    }

    if (this.formStateCache) {
      // Changing any path may affect computed form state
      this.formStateCache.clear();
    }
  }

  /**
   * Get cache statistics
   * @returns {Object} Cache statistics
   */
  getStats() {
    const total = this.stats.hits + this.stats.misses;

    return {
      ...this.stats,
      hitRate: total > 0 ? ((this.stats.hits / total) * 100).toFixed(2) + '%' : '0%',
    };
  }

  /**
   * Create cache key for value
   * @param {string} path - Field path
   * @param {Object} values - Form values
   * @returns {Object} Cache key
   */
  createValueKey(path, values) {
    return { path, values };
  }

  /**
   * Create cache key for form state
   * @param {Object} formState - Form state
   * @returns {string} Cache key
   */
  createFormStateKey(formState) {
    return hashFormState(formState);
  }
}
