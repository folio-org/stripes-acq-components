/**
 * BaseFeature - Base class for all form features
 * Follows DRY and Open/Closed Principles (SOLID)
 */

import { createCleanObject } from '../../utils/helpers';

export class BaseFeature {
  /**
   * @param {Object} engine - Reference to form engine
   */
  constructor(engine) {
    this.engine = engine;
    this._state = createCleanObject();
  }

  /**
   * Initialize feature state
   * Can be overridden by subclasses for custom initialization
   */
  init() {
    this._clearState();
  }

  /**
   * Reset feature to initial state
   * Can be overridden by subclasses for custom reset logic
   */
  reset() {
    this._clearState();
  }

  /**
   * Clear all state (DRY - shared by init and reset)
   * @private
   */
  _clearState() {
    this._state = createCleanObject();
  }

  /**
   * Get copy of current state
   * @returns {Object} Copy of current state
   */
  getState() {
    return { ...this._state };
  }

  /**
   * Set state value
   * @param {string} key - State key
   * @param {*} value - State value
   * @protected
   */
  _setState(key, value) {
    this._state[key] = value;
  }

  /**
   * Get state value
   * @param {string} key - State key
   * @returns {*} State value
   * @protected
   */
  _getState(key) {
    return this._state[key];
  }
}
