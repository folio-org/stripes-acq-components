/**
 * ErrorsFeature - Manages form errors and validation state
 */

import { EVENTS } from '../../constants';

export class ErrorsFeature {
  constructor(engine) {
    this.engine = engine;
    this.errors = Object.create(null);
    this._previousFormValid = null;
  }

  /**
   * Initialize errors
   */
  init() {
    this.errors = Object.create(null);
    this._previousFormValid = true;
  }

  /**
   * Reset errors
   */
  reset() {
    this.errors = Object.create(null);
    this._previousFormValid = null;
  }

  /**
   * Get error by path
   * @param {string} path - Field path
   * @returns {string|null} Error message or null
   */
  get(path) {
    return this.errors[path] || null;
  }

  /**
   * Set error by path
   * @param {string} path - Field path
   * @param {string|null} error - Error message or null
   */
  set(path, error) {
    if (error) {
      this.errors[path] = error;
    } else {
      delete this.errors[path];
    }

    this._emitErrorEvents(path, error);
    this._checkAndEmitFormValidState();
  }

  /**
   * Clear error by path
   * @param {string} path - Field path
   */
  clear(path) {
    delete this.errors[path];
    this._emitErrorEvents(path, null);
    this._checkAndEmitFormValidState();
  }

  /**
   * Set all errors
   * @param {Object} errors - Errors object
   */
  setAll(errors) {
    this.errors = { ...errors };
    this._emitAllErrors();
    this._checkAndEmitFormValidState();
  }

  /**
   * Get all errors
   * @returns {Object} All errors
   */
  getAll() {
    return { ...this.errors };
  }

  /**
   * Check if form is valid
   * @returns {boolean} True if form is valid
   */
  isValid() {
    return Object.keys(this.errors).length === 0;
  }

  /**
   * Check if field has error
   * @param {string} path - Field path
   * @returns {boolean} True if field has error
   */
  hasError(path) {
    return path in this.errors;
  }

  /**
   * Emit error events for a field
   * @param {string} path - Field path
   * @param {string|null} error - Error message or null
   * @private
   */
  _emitErrorEvents(path, error) {
    this.engine.eventService.emit(EVENTS.ERROR, { path, error });
    this.engine.eventService.emit(`${EVENTS.ERROR}:${path}`, error);
  }

  /**
   * Emit all error events
   * @private
   */
  _emitAllErrors() {
    Object.keys(this.errors).forEach((path) => {
      this._emitErrorEvents(path, this.errors[path]);
    });
  }

  /**
   * Check and emit form valid state event only when state changes
   * @private
   */
  _checkAndEmitFormValidState() {
    const isValid = this.isValid();

    if (this._previousFormValid !== isValid) {
      this._previousFormValid = isValid;
      this.engine.eventService.emit(EVENTS.VALID, { valid: isValid });
    }
  }
}

