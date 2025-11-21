/**
 * TouchedFeature - Manages form touched state
 */

import { EVENTS } from '../../constants';
import { BaseFeature } from './BaseFeature';

export class TouchedFeature extends BaseFeature {
  /**
   * Initialize touched state
   */
  init() {
    super.init();
    this._setState('touched', new Set());
    this._setState('touchedArrayCache', null);
    this._setState('touchedArraySize', 0);
  }

  /**
   * Reset touched state
   */
  reset() {
    super.reset();
    this._setState('touched', new Set());
    this._setState('touchedArrayCache', null);
    this._setState('touchedArraySize', 0);
  }

  /**
   * Check if field is touched
   * @param {string} path - Field path
   * @returns {boolean} True if field is touched
   */
  isTouched(path) {
    const touched = this._getState('touched');

    return touched.has(path);
  }

  /**
   * Mark field as touched
   * @param {string} path - Field path
   */
  touch(path) {
    const touched = this._getState('touched');

    // Only emit if field wasn't already touched
    if (!touched.has(path)) {
      touched.add(path);
      this._invalidateTouchCache();
      this.engine.eventService.emit(EVENTS.TOUCH, { path });
      this.engine.eventService.emit(`${EVENTS.TOUCH}:${path}`, true);
    }
  }

  /**
   * Get count of touched fields
   * @returns {number} Number of touched fields
   */
  getTouchedCount() {
    const touched = this._getState('touched');

    return touched.size;
  }

  /**
   * Get touched array (cached for performance)
   * @returns {Array<string>} Array of touched field paths
   */
  getTouchedArray() {
    const touched = this._getState('touched');
    const touchedArrayCache = this._getState('touchedArrayCache');
    const touchedArraySize = this._getState('touchedArraySize');

    // Cache touched array to avoid recreating on every getFormState call
    if (touchedArrayCache === null || touchedArraySize !== touched.size) {
      const newCache = Array.from(touched);

      this._setState('touchedArrayCache', newCache);
      this._setState('touchedArraySize', touched.size);

      return newCache;
    }

    return touchedArrayCache;
  }

  /**
   * Invalidate touched array cache
   * @private
   */
  _invalidateTouchCache() {
    this._setState('touchedArrayCache', null);
    this._setState('touchedArraySize', 0);
  }
}
