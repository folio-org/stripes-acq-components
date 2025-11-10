/**
 * Validation Service - External validation logic
 * Can be injected into FormEngine for custom validation behavior
 */

import { getByPath } from '../../utils/path';
import { isFunction, isDefined } from '../../utils/checks';
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
   * Register validator for field
   * @param {string} path - Field path
   * @param {Function} validator - Validation function
   * @param {string} validateOn - Validation mode ('blur', 'change', 'submit')
   */
  registerValidator(path, validator, validateOn = 'blur') {
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

      return result || null;
    } catch (error) {
      return error.message;
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
        errors[path] = error;
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
          const context = path ? this._getFieldContext(path, value, allValues) : { fieldState: undefined, api: undefined };

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

      return result || null;
    } catch (error) {
      return error.message;
    }
  }
}
