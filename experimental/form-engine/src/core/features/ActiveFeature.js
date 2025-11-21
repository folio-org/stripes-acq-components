/**
 * ActiveFeature - Manages form active/focused field state
 */

import { EVENTS } from '../../constants';
import { BaseFeature } from './BaseFeature';

export class ActiveFeature extends BaseFeature {
  /**
   * Initialize active state
   */
  init() {
    super.init();
    this._setState('active', null);
  }

  /**
   * Reset active state
   */
  reset() {
    super.reset();
    this._setState('active', null);
  }

  /**
   * Get active field path
   * @returns {string|null} Active field path or null
   */
  getActive() {
    return this._getState('active');
  }

  /**
   * Focus field
   * @param {string} path - Field path
   */
  focus(path) {
    const previousActive = this._getState('active');

    // Only emit if active field changed
    if (previousActive !== path) {
      this._setState('active', path);
      // Emit FOCUS event for field-specific subscriptions
      this.engine.eventService.emit(EVENTS.FOCUS, { path });
      // Emit ACTIVE event for form-level active state tracking
      this.engine.eventService.emit(EVENTS.ACTIVE, { active: path });
    }
  }

  /**
   * Blur field
   */
  blur() {
    const previousActive = this._getState('active');

    // Only emit if there was an active field
    if (previousActive !== null) {
      this._setState('active', null);
      // Emit BLUR event for field-specific subscriptions
      this.engine.eventService.emit(EVENTS.BLUR, { path: previousActive });
      // Emit ACTIVE event for form-level active state tracking
      this.engine.eventService.emit(EVENTS.ACTIVE, { active: null });
    }
  }

  /**
   * Check if field is active
   * @param {string} path - Field path
   * @returns {boolean} True if field is active
   */
  isActive(path) {
    const active = this._getState('active');

    return active === path;
  }
}
