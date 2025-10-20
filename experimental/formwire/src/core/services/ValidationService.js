/**
 * Validation Service - External validation logic
 * Can be injected into FormEngine for custom validation behavior
 */

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
   * Register validator for field
   * @param {string} path - Field path
   * @param {Function} validator - Validation function
   * @param {string} validateOn - Validation mode ('blur', 'change', 'submit')
   */
  registerValidator(path, validator, validateOn = 'blur') {
    this.validators.set(path, { validator, validateOn });
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
      let fieldState;
      let api;

      if (typeof this.options.getFieldContext === 'function') {
        const ctx = this.options.getFieldContext(path, value, allValues);

        fieldState = ctx && ctx.fieldState;
        api = ctx && ctx.api;
      }

      const result = await validator(value, allValues, fieldState, api);

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
          let fieldState;
          let api;

          if (typeof this.options.getFieldContext === 'function' && path) {
            const ctx = this.options.getFieldContext(path, value, allValues);

            fieldState = ctx && ctx.fieldState;
            api = ctx && ctx.api;
          }

          const result = await validator(value, allValues, fieldState, api);

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

    if (validateOn !== mode) return null;

    const strategy = this.modeStrategies[mode];

    if (!strategy) return null;

    return strategy(path, value, allValues, options);
  }

  /**
   * Internal: run validator immediately with context
   * @private
   */
  async _runValidator(path, value, allValues) {
    const validatorData = this.validators.get(path);

    if (!validatorData) return null;

    const { validator } = validatorData;

    let fieldState;
    let api;

    if (typeof this.options.getFieldContext === 'function') {
      const ctx = this.options.getFieldContext(path, value, allValues);

      fieldState = ctx && ctx.fieldState;
      api = ctx && ctx.api;
    }

    try {
      const result = await validator(value, allValues, fieldState, api);

      return result || null;
    } catch (error) {
      return error.message;
    }
  }
}
