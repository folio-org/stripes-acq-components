/**
 * SchedulerService - Handles task scheduling with different strategies
 * Follows Single Responsibility Principle (SOLID-S)
 */

export class SchedulerService {
  /**
   * Schedule a task using microtask queue
   * Best for: High-priority async tasks that should run before next render
   * @param {Function} callback - Function to execute
   */
  scheduleMicrotask(callback) {
    if (typeof queueMicrotask !== 'undefined') {
      queueMicrotask(callback);
    } else {
      // Fallback for older browsers
      Promise.resolve().then(callback);
    }
  }

  /**
   * Schedule a task using animation frame
   * Best for: Visual updates aligned with browser repaints
   * @param {Function} callback - Function to execute
   * @returns {number} Request ID that can be used to cancel
   */
  scheduleAnimationFrame(callback) {
    if (typeof requestAnimationFrame !== 'undefined') {
      return requestAnimationFrame(callback);
    }

    // Fallback for environments without requestAnimationFrame
    return setTimeout(callback, 0);
  }

  /**
   * Cancel a scheduled animation frame
   * @param {number} id - Request ID returned from scheduleAnimationFrame
   */
  cancelAnimationFrame(id) {
    if (typeof cancelAnimationFrame !== 'undefined') {
      cancelAnimationFrame(id);
    } else {
      clearTimeout(id);
    }
  }

  /**
   * Schedule a task with a delay
   * @param {Function} callback - Function to execute
   * @param {number} delay - Delay in milliseconds
   * @returns {number} Timeout ID that can be used to cancel
   */
  scheduleTimeout(callback, delay) {
    return setTimeout(callback, delay);
  }

  /**
   * Cancel a scheduled timeout
   * @param {number} id - Timeout ID returned from scheduleTimeout
   */
  cancelTimeout(id) {
    clearTimeout(id);
  }

  /**
   * Schedule immediately (synchronous execution)
   * @param {Function} callback - Function to execute
   */
  scheduleImmediate(callback) {
    callback();
  }
}
