/**
 * TouchedFeature - Manages form touched state
 */

import { EVENTS } from '../../constants';

export class TouchedFeature {
  constructor(engine) {
    this.engine = engine;
    this.touched = new Set();
    this._touchedArrayCache = null;
    this._touchedArraySize = 0;
  }

  /**
   * Initialize touched state
   */
  init() {
    this.touched.clear();
    this._touchedArrayCache = null;
    this._touchedArraySize = 0;
  }

  /**
   * Reset touched state
   */
  reset() {
    this.touched.clear();
    this._touchedArrayCache = null;
    this._touchedArraySize = 0;
  }

  /**
   * Check if field is touched
   * @param {string} path - Field path
   * @returns {boolean} True if field is touched
   */
  isTouched(path) {
    return this.touched.has(path);
  }

  /**
   * Mark field as touched
   * @param {string} path - Field path
   */
  touch(path) {
    // Only emit if field wasn't already touched
    if (!this.touched.has(path)) {
      this.touched.add(path);
      this._invalidateCache();
      this.engine.eventService.emit(EVENTS.TOUCH, { path });
      this.engine.eventService.emit(`${EVENTS.TOUCH}:${path}`, true);
    }
  }

  /**
   * Get touched array (cached for performance)
   * @returns {Array<string>} Array of touched field paths
   */
  getTouchedArray() {
    // Cache touched array to avoid recreating on every getFormState call
    if (this._touchedArrayCache === null || this._touchedArraySize !== this.touched.size) {
      this._touchedArrayCache = Array.from(this.touched);
      this._touchedArraySize = this.touched.size;
    }

    return this._touchedArrayCache;
  }

  /**
   * Invalidate touched array cache
   * @private
   */
  _invalidateCache() {
    this._touchedArrayCache = null;
    this._touchedArraySize = 0;
  }
}

