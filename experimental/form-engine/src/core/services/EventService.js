/**
 * Event Service - External event management
 * Can be injected into FormEngine for custom event behavior
 */

import { isFunction } from '../../utils/checks';

export class EventService {
  constructor(options = {}) {
    this.options = {
      enableContextTracking: true,
      enableErrorHandling: true,
      logErrors: true,
      onListenerError: null,
      ...options,
    };

    // Event system
    // listeners: Map<event, Set<callback>> for fast emit
    this.listeners = new Map();
    // contexts: WeakMap<contextObject, Map<event, Set<callback>>> for cleanup without retaining contexts
    this.contexts = new WeakMap();

    // Statistics
    this.stats = {
      totalEvents: 0,
      totalListeners: 0,
      contextsCount: 0,
    };
  }

  /**
   * Subscribe to events
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   * @param {Object} context - Context for cleanup (optional)
   * @returns {Function} Unsubscribe function
   */
  on(event, callback, context = null) {
    // Store listener in Map for event emission
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
    this.stats.totalListeners++;

    // Track context for cleanup if enabled
    if (this.options.enableContextTracking && context) {
      let contextMap = this.contexts.get(context);

      if (!contextMap) {
        contextMap = new Map(); // Map<event, Set<callback>>
        this.contexts.set(context, contextMap);
        this.stats.contextsCount++;
      }

      if (!contextMap.has(event)) {
        contextMap.set(event, new Set());
      }

      contextMap.get(event).add(callback);
    }

    return () => {
      // Remove from primary Map
      const listeners = this.listeners.get(event);

      if (listeners) {
        listeners.delete(callback);
        this.stats.totalListeners--;
      }

      // Remove from context tracking
      if (this.options.enableContextTracking && context) {
        const contextMap = this.contexts.get(context);

        if (!contextMap) return;

        const setForEvent = contextMap.get(event);

        if (!setForEvent) return;

        setForEvent.delete(callback);
        if (setForEvent.size === 0) {
          contextMap.delete(event);
        }
      }
    };
  }

  /**
   * Emit event
   * @param {string} event - Event name
   * @param {*} data - Event data
   */
  emit(event, data) {
    this.stats.totalEvents++;

    const listeners = this.listeners.get(event);

    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          if (!this.options.enableErrorHandling) {
            throw error;
          }

          if (isFunction(this.options.onListenerError)) {
            this.options.onListenerError(error, { event, data });
          } else if (this.options.logErrors) {
            // eslint-disable-next-line no-console
            console.error(`Error in event listener for ${event}:`, error);
          }
        }
      });
    }
  }

  /**
   * Cleanup all listeners registered under a context
   * @param {Object} context - Context object used during subscription
   */
  cleanupContext(context) {
    if (!this.options.enableContextTracking || !context) return 0;

    const contextMap = this.contexts.get(context);

    if (!contextMap) return 0;

    let removed = 0;

    contextMap.forEach((callbacks, event) => {
      const listeners = this.listeners.get(event);

      if (listeners) {
        callbacks.forEach(cb => {
          if (listeners.delete(cb)) {
            removed++;
            this.stats.totalListeners--;
          }
        });
        if (listeners.size === 0) {
          this.listeners.delete(event);
        }
      }
    });

    this.contexts.delete(context);
    this.stats.contextsCount = Math.max(0, this.stats.contextsCount - 1);

    return removed;
  }

  /**
   * Remove all listeners
   * @returns {number} Total number of listeners removed
   */
  removeAllListeners() {
    let totalRemoved = 0;

    for (const [, listeners] of this.listeners) {
      totalRemoved += listeners.size;
      listeners.clear();
    }

    this.listeners.clear();
    this.stats.totalListeners = 0;
    this.stats.contextsCount = 0;

    return totalRemoved;
  }

  /**
   * Check if there are any listeners registered
   * @returns {boolean} True if there are any listeners
   */
  hasListeners() {
    return this.listeners.size > 0;
  }

  /**
   * Get all event names that start with the given prefix
   * Used for cascading events when parent path changes
   * @param {string} prefix - Event name prefix
   * @returns {Array<string>} Array of event names matching the prefix
   */
  getEventsWithPrefix(prefix) {
    const matches = [];

    // Fast iteration through Map keys
    for (const event of this.listeners.keys()) {
      // Match events that start with prefix and continue with path separator
      // Examples: prefix='change:array' matches 'change:array[0].field' (nextChar='[')
      //           prefix='change:array[0]' matches 'change:array[0].field' (nextChar='.')
      // This ensures we only match actual nested paths, not unrelated events
      if (event.startsWith(prefix) && event.length > prefix.length) {
        const nextChar = event[prefix.length];

        if (nextChar === '.' || nextChar === '[') {
          matches.push(event);
        }
      }
    }

    return matches;
  }

  /**
   * Get service statistics
   * @returns {Object} Event service statistics
   */
  getStats() {
    return {
      ...this.stats,
      eventsCount: this.listeners.size,
      averageListenersPerEvent: this.listeners.size > 0
        ? (this.stats.totalListeners / this.listeners.size).toFixed(2)
        : 0,
    };
  }
}
