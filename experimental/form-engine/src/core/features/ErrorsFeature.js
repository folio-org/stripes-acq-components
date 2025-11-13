/**
 * ErrorsFeature - Manages form errors and validation state
 */

import { EVENTS, FIELD_EVENT_PREFIXES } from '../../constants';

export class ErrorsFeature {
  constructor(engine) {
    this.engine = engine;
    this.errors = Object.create(null); // { path: [{ source, error }] }
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
   * Get first error by path (for backward compatibility)
   * @param {string} path - Field path
   * @returns {string|null} Error message or null
   */
  get(path) {
    const errorList = this.errors[path];

    if (!errorList || errorList.length === 0) return null;

    return errorList[0].error;
  }

  /**
   * Get all errors for a specific field path
   * @param {string} path - Field path
   * @returns {Array<{source: string, error: string}>} Array of error objects
   */
  getErrors(path) {
    return this.errors[path] || [];
  }

  /**
   * Set error by path with source tracking
   * @param {string} path - Field path
   * @param {string|null} error - Error message or null
   * @param {string} source - Error source ('field' or 'form')
   */
  set(path, error, source = 'field') {
    if (error) {
      // Prevent setting arrays as errors - they should be converted to field paths first
      if (Array.isArray(error)) {
        // eslint-disable-next-line no-console
        console.error(
          `[ErrorsFeature.set] ERROR: Attempted to set array as error on "${path}". ` +
          'Arrays should be converted to field-level errors first. ' +
          'Use ValidationService.validateAll() which handles array conversion.',
          error,
        );
        // Don't set the array error

        return;
      }

      // Get current error list for this path
      const errorList = this.errors[path] || [];
      const previousFirstError = this._getFirstError(errorList);

      // Find existing error from this source
      const existingIndex = errorList.findIndex(e => e.source === source);

      if (existingIndex >= 0) {
        // Update existing error from this source
        errorList[existingIndex] = { source, error };
      } else {
        // Add new error from this source
        errorList.push({ source, error });
      }

      this.errors[path] = errorList;

      // Only emit if first error changed (for backward compatibility)
      const newFirstError = this._getFirstError(errorList);

      this._emitIfFirstErrorChanged(path, previousFirstError, newFirstError);
    } else {
      // Clear error from specific source
      this._clearErrorBySource(path, source);
    }
  }

  /**
   * Clear error by source
   * @private
   */
  _clearErrorBySource(path, source) {
    const errorList = this.errors[path];

    if (!errorList || errorList.length === 0) return;

    const previousFirstError = this._getFirstError(errorList);

    // Remove error from this source
    const updatedList = errorList.filter(e => e.source !== source);

    if (updatedList.length === 0) {
      delete this.errors[path];
    } else {
      this.errors[path] = updatedList;
    }

    // Only emit if first error changed
    const newFirstError = this._getFirstError(updatedList);

    this._emitIfFirstErrorChanged(path, previousFirstError, newFirstError);
  }

  /**
   * Clear error by path (clears all errors from all sources)
   * @param {string} path - Field path
   * @param {string} source - Optional: clear only errors from specific source
   */
  clear(path, source = null) {
    if (source) {
      // Clear only errors from specific source
      this._clearErrorBySource(path, source);
    } else {
      // Clear all errors for this path
      const hadError = path in this.errors;

      delete this.errors[path];

      // Only emit if error was actually cleared
      if (hadError) {
        this._emitErrorEvents(path, null);
        this._checkAndEmitFormValidState();
      }
    }
  }

  /**
   * Set all errors from validation (used by validateAll)
   * @param {Object} errors - Errors object { path: errorString }
   * @param {string} source - Source of errors ('field' or 'form')
   */
  setAll(errors, source = 'form') {
    // Check if any errors are arrays and warn about them
    Object.entries(errors).forEach(([path, error]) => {
      if (Array.isArray(error)) {
        // eslint-disable-next-line no-console
        console.error(
          `[ErrorsFeature.setAll] ERROR: Found array error on "${path}". ` +
          'Arrays should be converted to field-level errors first. ' +
          'This error will be filtered out.',
          error,
        );
      }
    });

    // Clear all previous errors from this source
    Object.keys(this.errors).forEach(path => {
      this.clear(path, source);
    });

    // For each path, update or add error from this source
    Object.entries(errors).forEach(([path, error]) => {
      if (!Array.isArray(error) && error) {
        this.set(path, error, source);
      }
    });

    this._emitAllErrors();
    this._checkAndEmitFormValidState();
  }

  /**
   * Get all errors (returns first error for each path for backward compatibility)
   * @returns {Object} All errors as { path: errorString }
   */
  getAll() {
    const result = {};

    Object.keys(this.errors).forEach(path => {
      const errorList = this.errors[path];

      if (errorList && errorList.length > 0) {
        result[path] = errorList[0].error;
      }
    });

    return result;
  }

  /**
   * Get all errors with sources
   * @returns {Object} All errors as { path: [{ source, error }] }
   */
  getAllWithSources() {
    const result = {};

    Object.keys(this.errors).forEach(path => {
      result[path] = [...this.errors[path]];
    });

    return result;
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
   * Get first error from error list
   * @param {Array} errorList - Error list [{ source, error }]
   * @returns {string|null} First error or null
   * @private
   */
  _getFirstError(errorList) {
    return errorList && errorList.length > 0 ? errorList[0].error : null;
  }

  /**
   * Emit error events if first error changed
   * @param {string} path - Field path
   * @param {string|null} previousFirstError - Previous first error
   * @param {string|null} newFirstError - New first error
   * @private
   */
  _emitIfFirstErrorChanged(path, previousFirstError, newFirstError) {
    if (previousFirstError !== newFirstError) {
      this._emitErrorEvents(path, newFirstError);
      this._checkAndEmitFormValidState();
    }
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

    // Also emit errors array for consumers that need all errors
    const errors = this.getErrors(path);

    this.engine.eventService.emit(`${FIELD_EVENT_PREFIXES.ERRORS}${path}`, errors);
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
