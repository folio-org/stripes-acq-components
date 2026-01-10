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
   * @param {Object} options - Listener options (optional)
   * @param {boolean} options.bubble - If true, listener receives events from nested fields (e.g., 'foo' receives 'foo.bar' changes)
   * @returns {Function} Unsubscribe function
   */
  on(event, callback, context = null, options = {}) {
    const listenerData = {
      callback,
      options: {
        bubble: options.bubble === true,
      },
    };

    // Store listener in Map for event emission
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(listenerData);
    this.stats.totalListeners++;

    // Track context for cleanup if enabled
    if (this.options.enableContextTracking && context) {
      let contextMap = this.contexts.get(context);

      if (!contextMap) {
        contextMap = new Map(); // Map<event, Set<listenerData>>
        this.contexts.set(context, contextMap);
        this.stats.contextsCount++;
      }

      if (!contextMap.has(event)) {
        contextMap.set(event, new Set());
      }

      contextMap.get(event).add(listenerData);
    }

    return () => {
      // Remove from primary Map
      const listeners = this.listeners.get(event);

      if (listeners) {
        listeners.delete(listenerData);
        this.stats.totalListeners--;
      }

      // Remove from context tracking
      if (this.options.enableContextTracking && context) {
        const contextMap = this.contexts.get(context);

        if (!contextMap) return;

        const setForEvent = contextMap.get(event);

        if (!setForEvent) return;

        setForEvent.delete(listenerData);
        if (setForEvent.size === 0) {
          contextMap.delete(event);
        }
      }
    };
  }

  /**
   * Handle listener error
   * @param {Error} error - Error object
   * @param {string} event - Event name
   * @param {*} data - Event data
   * @private
   */
  _handleListenerError(error, event, data) {
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

  /**
   * Emit event
   * @param {string} event - Event name
   * @param {*} data - Event data
   */
  emit(event, data) {
    this.stats.totalEvents++;

    const listeners = this.listeners.get(event);

    if (!listeners) return;

    // Track listeners to remove if they repeatedly fail
    const listenersToRemove = [];

    for (const listenerData of listeners) {
      try {
        listenerData.callback(data);
        // Reset error count on successful execution
        if (listenerData.errorCount) {
          listenerData.errorCount = 0;
        }
      } catch (error) {
        this._handleListenerError(error, event, data);

        // Track consecutive errors
        listenerData.errorCount = (listenerData.errorCount || 0) + 1;

        // Remove listener after 3 consecutive errors to prevent memory leaks from broken listeners
        if (listenerData.errorCount >= 3) {
          listenersToRemove.push(listenerData);
        }
      }
    }

    // Clean up broken listeners
    for (const listenerData of listenersToRemove) {
      listeners.delete(listenerData);
      this.stats.totalListeners--;
    }

    // Clean up event entry if no more listeners
    if (listeners.size === 0) {
      this.listeners.delete(event);
    }
  }

  /**
   * Cleanup all listeners registered under a context
   * @param {Object} context - Context object used during subscription
   */
  /**
   * Remove listeners for an event
   * @param {string} event - Event name
   * @param {Set} callbacks - Callbacks to remove
   * @returns {number} Number of removed listeners
   * @private
   */
  _removeEventListeners(event, callbacks) {
    const listeners = this.listeners.get(event);

    if (!listeners) return 0;

    let removed = 0;

    for (const cb of callbacks) {
      if (listeners.delete(cb)) {
        removed++;
        this.stats.totalListeners--;
      }
    }

    if (listeners.size === 0) {
      this.listeners.delete(event);
    }

    return removed;
  }

  cleanupContext(context) {
    if (!this.options.enableContextTracking || !context) return 0;

    const contextMap = this.contexts.get(context);

    if (!contextMap) return 0;

    let removed = 0;

    for (const [event, callbacks] of contextMap) {
      removed += this._removeEventListeners(event, callbacks);
    }

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
   * Check if there are listeners for a specific event
   * @param {string} eventName - Event name
   * @param {Object} options - Check options
   * @param {boolean} options.onlyBubble - If true, only check for listeners with bubble:true
   * @returns {boolean} True if there are listeners for this event
   */
  hasListener(eventName, options = {}) {
    const listeners = this.listeners.get(eventName);

    if (!listeners || listeners.size === 0) return false;

    // If checking for bubble listeners, filter by bubble option
    if (options.onlyBubble) {
      for (const listenerData of listeners) {
        if (listenerData.options.bubble) {
          return true;
        }
      }

      return false;
    }

    return true;
  }

  /**
   * Get all event names that start with the given prefix
   * Used for cascading events to ancestor field listeners (bubble support)
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
