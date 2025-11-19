/**
 * Validation Service - External validation logic
 * Can be injected into FormEngine for custom validation behavior
 */

import { VALIDATION_MODES } from '../../constants';
import {
  isDefined,
  isFunction,
} from '../../utils/checks';
import { getByPath } from '../../utils/path';
import { createValidationModeStrategies } from './strategies/validationModes';

export class ValidationService {
  constructor(options = {}) {
    this.validators = new Map(); // Map<path, {validator, validateOn}>
    this.options = {
      debounceDelay: 300,
      validateOnChange: false,
      validateOnBlur: true,
      // Optional: function (path, value, allValues) => { fieldState, api }
      getFieldContext: null,
      ...options,
    };

    // Debounced validators cache per field
    this.debouncers = new Map(); // Map<path, Function>

    // Strategy map for validation execution per mode
    this.modeStrategies = createValidationModeStrategies(this);
  }

  /**
   * Register validator for path
   * @param {string} path - Field path
   * @param {Function} validator - Validation function
   * @param {string} validateOn - Validation mode (use VALIDATION_MODES constants)
   */
  registerValidator(path, validator, validateOn = VALIDATION_MODES.BLUR) {
    this.validators.set(path, { validator, validateOn });
  }

  /**
   * Check if validator exists for field
   * @param {string} path
   * @returns {boolean}
   */
  hasValidator(path) {
    return this.validators.has(path);
  }

  /**
   * Unregister validator for field
   * @param {string} path
   */
  unregisterValidator(path) {
    const removed = this.validators.delete(path);

    if (this.debouncers.has(path)) {
      const debouncedValidator = this.debouncers.get(path);

      if (debouncedValidator && typeof debouncedValidator.cleanup === 'function') {
        debouncedValidator.cleanup();
      }

      this.debouncers.delete(path);
    }

    return removed;
  }

  /**
   * Validate field
   * @param {string} path - Field path
   * @param {*} value - Field value
   * @param {*} allValues - All form values
   * @returns {Promise<string|null>} Error message or null
   */
  async validateField(path, value, allValues) {
    const validatorData = this.validators.get(path);

    if (!validatorData) return null;

    const { validator } = validatorData;

    try {
      const context = this._getFieldContext(path, value, allValues);

      const result = await validator(value, allValues, context.fieldState, context.api);

      // Only return null if result is explicitly null/undefined, preserve falsy values like 0, false, ''
      return result === undefined || result === null ? null : result;
    } catch (error) {
      // Safely extract error message, fallback to string conversion
      return error?.message || String(error);
    }
  }

  /**
   * Process array field errors and add them to errors object
   * @param {Array} fieldError - Array of field errors
   * @param {string} fieldPath - Base field path
   * @param {Object} errors - Errors object to populate
   * @private
   */
  _processArrayFieldError(fieldError, fieldPath, errors) {
    for (const [index, itemError] of fieldError.entries()) {
      if (itemError && typeof itemError === 'object') {
        // Nested object with field errors for this array item
        for (const subFieldName of Object.keys(itemError)) {
          const fullPath = `${fieldPath}[${index}].${subFieldName}`;

          errors[fullPath] = itemError[subFieldName];
        }
      } else if (itemError) {
        // Direct error string for this array item
        errors[`${fieldPath}[${index}]`] = itemError;
      }
    }
  }

  /**
   * Process form-level errors object and merge into errors
   * @param {Object} error - Error object from form validator
   * @param {Object} errors - Errors object to populate
   * @private
   */
  _processFormLevelErrors(error, errors) {
    for (const [fieldPath, fieldError] of Object.entries(error)) {
      if (Array.isArray(fieldError)) {
        // Field error is an array - convert to field-level errors
        this._processArrayFieldError(fieldError, fieldPath, errors);
      } else {
        // Regular field error - merge directly
        errors[fieldPath] = fieldError;
      }
    }
  }

  /**
   * Process array errors and convert to field-level errors
   * @param {Array} error - Array error from validator
   * @param {string} path - Field path
   * @param {Object} errors - Errors object to populate
   * @private
   */
  _processArrayError(error, path, errors) {
    for (const [index, itemError] of error.entries()) {
      if (itemError && typeof itemError === 'object') {
        // Nested object with field errors for this array item
        for (const fieldName of Object.keys(itemError)) {
          const fieldPath = `${path}[${index}].${fieldName}`;

          errors[fieldPath] = itemError[fieldName];
        }
      } else if (itemError) {
        // Direct error string for this array item
        errors[`${path}[${index}]`] = itemError;
      }
    }
  }

  /**
   * Validate all fields
   * @param {*} allValues - All form values
   * @returns {Promise<Object>} Errors object
   */
  async validateAll(allValues) {
    const errors = {};

    for (const [path] of this.validators) {
      const value = getByPath(allValues, path);
      const error = await this.validateField(path, value, allValues);

      if (error) {
        // If error is from form-level validator ($form) and returns an object
        // Merge the field errors instead of storing $form error
        if (path === '$form' && typeof error === 'object' && !Array.isArray(error)) {
          this._processFormLevelErrors(error, errors);
        } else if (Array.isArray(error)) {
          // Handle array errors - convert to field-level errors
          this._processArrayError(error, path, errors);
        } else {
          // Regular field error or form-level string error
          errors[path] = error;
        }
      }
    }

    return errors;
  }

  /**
   * Create debounced validator
   * @param {Function} validator - Validation function
   * @param {number} delay - Debounce delay
   * @returns {Function} Debounced validator
   */
  createDebouncedValidator(validator, delay = this.options.debounceDelay) {
    let timeoutId = null;
    let lastValue = null;

    const debouncedValidator = (value, allValues, onResult, path = null) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      if (lastValue === value) {
        return;
      }

      lastValue = value;

      timeoutId = setTimeout(async () => {
        try {
          const context = path
            ? this._getFieldContext(path, value, allValues)
            : { fieldState: undefined, api: undefined };

          const result = await validator(value, allValues, context.fieldState, context.api);

          onResult(result || null);
        } catch (error) {
          onResult(error.message);
        }
      }, delay);
    };

    debouncedValidator.cleanup = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    };

    return debouncedValidator;
  }

  /**
   * Validate by mode using strategy map
   * @param {string} path
   * @param {*} value
   * @param {*} allValues
   * @param {'change'|'blur'|'submit'} mode
   * @param {Object} options
   */
  async validateByMode(path, value, allValues, mode, options = {}) {
    const validatorData = this.validators.get(path);

    if (!validatorData) return null;

    const { validateOn } = validatorData;

    // Only validate if validator's validateOn mode matches requested mode
    // This ensures validators only run when they should (e.g., blur validator only on blur)
    if (validateOn !== mode) return null;

    const strategy = this.modeStrategies[mode];

    if (!strategy) return null;

    // Execute validation using the appropriate strategy for the mode
    // Strategies handle debouncing, timing, etc. differently per mode
    return strategy(path, value, allValues, options);
  }

  /**
   * Get field context from options if available
   * @param {string} path - Field path
   * @param {*} value - Field value
   * @param {*} allValues - All form values
   * @returns {{fieldState: *, api: *}} Field context
   * @private
   */
  _getFieldContext(path, value, allValues) {
    if (!isFunction(this.options.getFieldContext)) {
      return { fieldState: undefined, api: undefined };
    }

    const ctx = this.options.getFieldContext(path, value, allValues);

    return {
      fieldState: isDefined(ctx) ? ctx.fieldState : undefined,
      api: isDefined(ctx) ? ctx.api : undefined,
    };
  }

  /**
   * Internal: run validator immediately with context
   * @private
   */
  async _runValidator(path, value, allValues) {
    const validatorData = this.validators.get(path);

    if (!validatorData) return null;

    const { validator } = validatorData;
    const context = this._getFieldContext(path, value, allValues);

    try {
      const result = await validator(value, allValues, context.fieldState, context.api);

      // Only return null if result is explicitly null/undefined, preserve falsy values like 0, false, ''
      return result === undefined || result === null ? null : result;
    } catch (error) {
      // Safely extract error message, fallback to string conversion
      return error?.message || String(error);
    }
  }
}
