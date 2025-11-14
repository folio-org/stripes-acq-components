/**
 * Batch Service - Handles batching and queuing operations
 */

export class BatchService {
  constructor(options = {}) {
    this.options = {
      enableBatching: true,
      batchDelay: 0,
      maxBatchSize: 100,
      ...options,
    };

    // Batch state
    this.batchQueue = [];
    this.isBatching = false;
    this.batchScheduled = false;
    this.batchTimeout = null;
    this.onFlushCallback = null; // Callback for flush operations

    // Statistics
    this.stats = {
      totalBatches: 0,
      totalOperations: 0,
      averageBatchSize: 0,
    };
  }

  /**
   * Start batching operations
   * @param {Function} fn - Function containing operations to batch
   * @param {Function} onFlush - Callback when batch is flushed
   */
  batch(fn, onFlush) {
    if (!this.options.enableBatching) {
      fn();

      return;
    }

    if (this.isBatching) {
      fn();

      return;
    }

    this.isBatching = true;
    this.batchQueue = [];

    try {
      fn();
    } finally {
      this.isBatching = false;

      this._flushBatch(onFlush);
    }
  }

  /**
   * Set flush callback for queued operations
   * @param {Function} onFlush - Callback when batch is flushed
   */
  setOnFlush(onFlush) {
    this.onFlushCallback = onFlush;
  }

  /**
   * Queue operation for batching
   * @param {Object} operation - Operation to queue
   */
  queueOperation(operation) {
    if (!this.options.enableBatching) {
      return;
    }

    this.batchQueue.push(operation);
    this.stats.totalOperations++;

    if (this.options.batchDelay > 0) {
      this._scheduleBatch();
    } else if (!this.batchScheduled) {
      this._scheduleMicrotaskBatch();
    }
  }

  /**
   * Schedule batch with timeout
   * @private
   */
  _scheduleBatch() {
    if (this.batchTimeout) {
      clearTimeout(this.batchTimeout);
    }

    this.batchTimeout = setTimeout(() => {
      this._flushBatch();
    }, this.options.batchDelay);
  }

  /**
   * Schedule batch with requestAnimationFrame for better batching of rapid input
   * @private
   */
  _scheduleMicrotaskBatch() {
    if (this.batchScheduled) return;

    this.batchScheduled = true;

    // Use requestAnimationFrame when batchDelay is 0 (immediate batching)
    // This allows multiple rapid input events in the same frame to be batched together
    // Better than queueMicrotask for UI events as it aligns with browser repaint cycle
    if (typeof requestAnimationFrame === 'undefined') {
      if (typeof queueMicrotask === 'undefined') {
        setTimeout(() => {
          this.batchScheduled = false;
          this._flushBatch();
        }, 0);
      } else {
        queueMicrotask(() => {
          this.batchScheduled = false;
          this._flushBatch();
        });
      }
    } else {
      requestAnimationFrame(() => {
        this.batchScheduled = false;
        this._flushBatch();
      });
    }
  }

  /**
   * Flush pending batch operations
   * @param {Function} onFlush - Callback when batch is flushed (optional, uses setOnFlush if not provided)
   * @private
   */
  _flushBatch(onFlush) {
    if (this.batchQueue.length === 0) return;

    const operations = [...this.batchQueue];

    this.batchQueue = [];

    this.stats.totalBatches++;
    this.stats.averageBatchSize = this.stats.totalOperations / this.stats.totalBatches;

    // Use provided callback or default callback from setOnFlush
    const callback = onFlush || this.onFlushCallback;

    if (callback) {
      callback(operations);
    }
  }

  /**
   * Clear all pending operations
   */
  clear() {
    this.batchQueue = [];
    if (this.batchTimeout) {
      clearTimeout(this.batchTimeout);
      this.batchTimeout = null;
    }
    this.batchScheduled = false;
  }

  /**
   * Dispose and reset internal state
   */
  dispose() {
    this.clear();
    this.stats = {
      totalBatches: 0,
      totalOperations: 0,
      averageBatchSize: 0,
    };
  }

  /**
   * Update configuration
   * @param {Object} newConfig - New configuration
   */
  updateConfig(newConfig) {
    this.options = { ...this.options, ...newConfig };
  }

  /**
   * Get service statistics
   * @returns {Object} Batch service statistics
   */
  getStats() {
    return {
      ...this.stats,
      queueSize: this.batchQueue.length,
      isBatching: this.isBatching,
      batchScheduled: this.batchScheduled,
    };
  }

  /**
   * Reset statistics
   */
  resetStats() {
    this.stats = {
      totalBatches: 0,
      totalOperations: 0,
      averageBatchSize: 0,
    };
  }
}
