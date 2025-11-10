/**
 * ActiveFeature - Manages form active/focused field state
 */

import { EVENTS } from '../../constants';

export class ActiveFeature {
  constructor(engine) {
    this.engine = engine;
    this.active = null;
  }

  /**
   * Initialize active state
   */
  init() {
    this.active = null;
  }

  /**
   * Reset active state
   */
  reset() {
    this.active = null;
  }

  /**
   * Get active field path
   * @returns {string|null} Active field path or null
   */
  getActive() {
    return this.active;
  }

  /**
   * Focus field
   * @param {string} path - Field path
   */
  focus(path) {
    const previousActive = this.active;

    // Only emit if active field changed
    if (previousActive !== path) {
      this.active = path;
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
    const previousActive = this.active;

    // Only emit if there was an active field
    if (previousActive !== null) {
      this.active = null;
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
    return this.active === path;
  }
}

