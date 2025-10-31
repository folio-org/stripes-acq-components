/**
 * FormEngine - Ultra-lightweight form state management with service injection
 *
 * Features:
 * - Service injection for validation, caching, and events
 * - Minimal memory footprint
 * - Zero dependencies
 * - Optimized for performance
 * - Simple and maintainable
 * - Batched updates
 * - Proper WeakMap caching
 */

import {
  EVENTS,
  DEBOUNCE_DELAYS,
  FORM_ENGINE_OPTIONS,
  DIRTY_CHECK_STRATEGY,
  FIELD_EVENT_PREFIXES,
} from '../constants';
import { getByPath, setByPath } from '../utils/path';
import { isFunction, isDefined, shallowEqual } from '../utils/checks';
import { ValidationService } from './services/ValidationService';
import { CacheService } from './services/CacheService';
import { EventService } from './services/EventService';
import { BatchService } from './services/BatchService';

export default class FormEngine {
  constructor(services = {}) {
    // Services (injected dependencies)
    this.validationService = services.validationService || new ValidationService();
    this.cacheService = services.cacheService || new CacheService();
    this.eventService = services.eventService || new EventService();
    this.batchService = services.batchService || new BatchService();

    // State (initialized via init method)
    this.values = Object.create(null);
    this.initialValues = Object.create(null);
    this.errors = Object.create(null);
    this.touched = new Set();
    this.active = null;
    this.submitting = false;
    this.batchQueue = [];
    this.isBatching = false;

    // Configuration (set via init method)
    this.options = {};

    // Initialization state
    this.isInitialized = false;

    // Performance tracking
    this.operations = 0;
    this.renderCount = 0;

    // Previous state tracking for emitting events only when state changes
    this._previousFormDirty = null;
    this._previousFieldDirty = new Map(); // Map<path, boolean>
    this._previousFormValid = null;
  }

  /**
   * Initialize form with values and configuration
   * @param {Object} initialValues - Initial form values
   * @param {Object} config - Form configuration
   */
  init(initialValues = Object.create(null), config = {}) {
    this._resetState();

    this.values = Object.assign(Object.create(null), initialValues);
    this.initialValues = Object.assign(Object.create(null), initialValues);

    this.options = {
      [FORM_ENGINE_OPTIONS.ENABLE_BATCHING]: true,
      [FORM_ENGINE_OPTIONS.BATCH_DELAY]: DEBOUNCE_DELAYS.DEFAULT,
      [FORM_ENGINE_OPTIONS.ENABLE_VALIDATION]: true,
      [FORM_ENGINE_OPTIONS.VALIDATE_ON_CHANGE]: false,
      [FORM_ENGINE_OPTIONS.VALIDATE_ON_BLUR]: true,
      [FORM_ENGINE_OPTIONS.DIRTY_CHECK_STRATEGY]: DIRTY_CHECK_STRATEGY.VALUES,
      ...config,
    };

    this._configureServices();

    this.isInitialized = true;

    // Initialize previous state tracking
    this._previousFormDirty = this._isFormDirty();
    this._previousFormValid = Object.keys(this.errors).length === 0;

    this.eventService.emit(EVENTS.INIT, { values: this.values, config: this.options });

    return this;
  }

  /**
   * Reset form to initial state
   */
  reset() {
    if (isDefined(this.batchService) && isFunction(this.batchService.dispose)) {
      this.batchService.dispose();
    }
    this._resetState();
    this.isInitialized = false;
    this.eventService.emit(EVENTS.RESET, {});

    return this;
  }

  /**
   * Check if form is initialized
   * @returns {boolean}
   */
  isReady() {
    return this.isInitialized;
  }

  /**
   * Get current configuration
   * @returns {Object}
   */
  getConfig() {
    return { ...this.options };
  }

  /**
   * Update configuration (partial update)
   * @param {Object} newConfig - New configuration options
   */
  updateConfig(newConfig) {
    this.options = { ...this.options, ...newConfig };
    this._configureServices();
    this.eventService.emit(EVENTS.CONFIG_UPDATE, { config: this.options });

    return this;
  }

  // ============================================================================
  // CORE METHODS
  // ============================================================================

  /**
   * Get value by path
   * @param {string} path - Dot notation path (e.g., 'user.name', 'items[0].title')
   */
  get(path) {
    this._ensureInitialized();
    this.operations++;

    return this.cacheService.getValue(
      this.cacheService.createValueKey(path, this.values),
      () => getByPath(this.values, path),
    );
  }

  /**
   * Set value by path
   * @param {string} path - Dot notation path
   * @param {*} value - Value to set
   * @param {Object} options - Options for setting value
   * @param {boolean} options.immediate - Emit events immediately (skip batching)
   * @param {boolean} options.silent - Don't emit CHANGE events (for programmatic updates that shouldn't trigger listeners)
   */
  set(path, value, options = {}) {
    this._ensureInitialized();
    this.operations++;

    this.values = setByPath(this.values, path, value);

    this.cacheService.clearForPath(path);

    // Run validation if enabled
    if (this.options[FORM_ENGINE_OPTIONS.ENABLE_VALIDATION] && this.options[FORM_ENGINE_OPTIONS.VALIDATE_ON_CHANGE]) {
      this._validateField(path, value);
    }

    // Skip emitting events if silent option is set
    if (options.silent) {
      return;
    }

    // Emit events
    if (this.options[FORM_ENGINE_OPTIONS.ENABLE_BATCHING] && !options.immediate) {
      // Ensure batched single updates still flush and emit events
      this.batchService.batch(
        () => {
          this._queueChange(path, value);
        },
        (operations) => this._emitBatch(operations),
      );
    } else {
      this._emitBatch([{ path, value }]);
    }
  }

  /**
   * Set multiple values in batch
   * @param {Array} updates - Array of {path, value} objects
   * @param {Object} options - Options for setting values
   * @param {boolean} options.silent - Don't emit CHANGE events
   */
  setMany(updates, options = {}) {
    if (this.options[FORM_ENGINE_OPTIONS.ENABLE_BATCHING]) {
      this.batch(() => {
        updates.forEach(({ path, value }) => {
          this.values = setByPath(this.values, path, value);
          this.cacheService.clearForPath(path);
        });
      });
      if (!options.silent) {
        this._emitBatch(updates);
      }
    } else {
      updates.forEach(({ path, value }) => {
        this.set(path, value, { immediate: true, silent: options.silent });
      });
    }
  }

  /**
   * Batch multiple operations
   * @param {Function} fn - Function containing operations to batch
   */
  batch(fn) {
    this.batchService.batch(fn, (operations) => this._emitBatch(operations));
  }

  /**
   * Emit batch and per-field change events consistently
   * @param {Array<{path: string, value: any}>} operations
   * @private
   */
  _emitBatch(operations) {
    if (!operations || operations.length === 0) return;

    // Emit aggregated change event
    this.eventService.emit(EVENTS.CHANGE, { batch: true, updates: operations });
    // Emit values event
    this.eventService.emit(EVENTS.VALUES, { values: this.getValues() });

    // Emit per-field events
    operations.forEach(({ path, value }) => {
      this.eventService.emit(`${EVENTS.CHANGE}:${path}`, value);
      // Check and emit dirty/pristine events for this field
      this._checkAndEmitFieldDirtyState(path);
    });

    // Check and emit form-level dirty/pristine events
    this._checkAndEmitFormDirtyState();
  }

  /**
   * Queue change for batching
   * @param {string} path - Field path
   * @param {*} value - Field value
   * @private
   */
  _queueChange(path, value) {
    this.batchService.queueOperation({ path, value });
  }

  /**
   * Get all values
   */
  getValues() {
    return { ...this.values };
  }

  /**
   * Get initial values
   */
  getInitialValues() {
    return { ...this.initialValues };
  }

  /**
   * Set field error
   * @param {string} path - Field path
   * @param {string} error - Error message
   */
  setError(path, error) {
    const previousError = this.errors[path];

    // Only emit if error actually changed
    if (previousError !== error) {
      this.errors[path] = error;
      this.eventService.emit(EVENTS.ERROR, { path, error });
      this.eventService.emit(`${EVENTS.ERROR}:${path}`, error);
      this._checkAndEmitFormValidState();
    }
  }

  /**
   * Clear field error
   * @param {string} path - Field path
   */
  clearError(path) {
    // Only emit if error actually existed
    if (path in this.errors) {
      delete this.errors[path];
      this.eventService.emit(EVENTS.ERROR, { path, error: null });
      this.eventService.emit(`${EVENTS.ERROR}:${path}`, null);
      this._checkAndEmitFormValidState();
    }
  }

  /**
   * Register validator for field
   * @param {string} path - Field path
   * @param {Function} validator - Validation function
   * @param {string} validateOn - Validation mode ('blur', 'change', 'submit')
   */
  registerValidator(path, validator, validateOn = 'blur') {
    this.validationService.registerValidator(path, validator, validateOn);
  }

  /**
   * Check if validator is registered for field
   * @param {string} path - Field path
   * @returns {boolean}
   */
  hasValidator(path) {
    return this.validationService.validators.has(path);
  }

  /**
   * Validate field
   * @param {string} path - Field path
   * @param {*} value - Field value
   * @private
   */
  async _validateField(path, value) {
    const error = await this.validationService.validateField(path, value, this.values);

    if (error) {
      this.setError(path, error);
    } else {
      this.clearError(path);
    }
  }

  /**
   * Validate all fields
   */
  async validateAll() {
    const errors = await this.validationService.validateAll(this.values);
    const previousErrors = this.errors;

    // Check if errors object actually changed
    const errorsChanged = !shallowEqual(previousErrors, errors);

    if (errorsChanged) {
      this.errors = errors;
      this.eventService.emit(EVENTS.VALIDATION, { errors });
      this._checkAndEmitFormValidState();
      // Emit ERROR event for changed fields
      const previousErrorKeys = Object.keys(previousErrors);
      const currentErrorKeys = Object.keys(errors);
      const allErrorKeys = new Set([...previousErrorKeys, ...currentErrorKeys]);

      allErrorKeys.forEach(path => {
        const prevError = previousErrors[path];
        const currError = errors[path];

        if (prevError !== currError) {
          this.eventService.emit(EVENTS.ERROR, { path, error: currError || null });
          this.eventService.emit(`${EVENTS.ERROR}:${path}`, currError || null);
        }
      });
    }

    return Object.keys(errors).length === 0;
  }

  /**
   * Get all errors
   */
  getErrors() {
    return { ...this.errors };
  }

  /**
   * Check if field is touched
   * @param {string} path - Field path
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
      this.eventService.emit(EVENTS.TOUCH, { path });
      this.eventService.emit(`${EVENTS.TOUCH}:${path}`, true);
    }
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
      this.eventService.emit(EVENTS.FOCUS, { path });
      this.eventService.emit(`${EVENTS.FOCUS}:${path}`, true);
      // Emit active state update
      this.eventService.emit(EVENTS.ACTIVE, { active: path });
    }
  }

  /**
   * Blur field
   */
  blur() {
    // Only emit if there was an active field
    if (this.active !== null) {
      this.active = null;
      this.eventService.emit(EVENTS.BLUR, {});
      // Emit active state update
      this.eventService.emit(EVENTS.ACTIVE, { active: null });
    }
  }

  /**
   * Check if form is dirty based on configured strategy
   * @returns {boolean}
   */
  _isFormDirty() {
    const strategy = this.options[FORM_ENGINE_OPTIONS.DIRTY_CHECK_STRATEGY];

    if (strategy === DIRTY_CHECK_STRATEGY.TOUCHED) {
      return this.touched.size > 0;
    }

    // Default: VALUES strategy - compare all values with initial
    const isEqual = this._getIsEqualFunction();

    const currentValues = this.getValues();
    const allKeys = new Set([
      ...Object.keys(currentValues),
      ...Object.keys(this.initialValues),
    ]);

    for (const key of allKeys) {
      const current = currentValues[key];
      const initial = this.initialValues[key];

      if (!isEqual(current, initial)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Get form state with improved WeakMap caching
   */
  getFormState() {
    this._ensureInitialized();

    const isDirty = this._isFormDirty();
    const formState = {
      values: this.getValues(),
      initialValues: this.getInitialValues(),
      errors: this.getErrors(),
      touched: Array.from(this.touched),
      active: this.active,
      submitting: this.submitting,
      valid: Object.keys(this.errors).length === 0,
      dirty: isDirty,
      pristine: !isDirty,
    };

    return this.cacheService.getFormState(formState, () => formState);
  }

  /**
   * Get current field state snapshot
   * @param {string} path
   */
  getFieldState(path) {
    const currentValue = this.get(path);
    const initialValue = getByPath(this.initialValues, path);
    const isEqual = this._getIsEqualFunction();

    const isDirty = !isEqual(currentValue, initialValue);

    return {
      name: path,
      value: currentValue,
      initialValue,
      dirty: isDirty,
      error: this.getErrors()[path],
      touched: this.isTouched(path),
      active: this.active === path,
      pristine: !isDirty,
    };
  }

  /**
   * Expose safe public API for consumers (no direct internals)
   */
  getFormApi() {
    if (!this._api) {
      this._api = {
        get: (p) => this.get(p),
        set: (p, v, options) => this.set(p, v, options),
        getValues: () => this.getValues(),
        getInitialValues: () => this.getInitialValues(),
        setMany: (updates, options) => this.setMany(updates, options),
        getErrors: () => this.getErrors(),
        touch: (p) => this.touch(p),
        focus: (p) => this.focus(p),
        blur: () => this.blur(),
        validateAll: () => this.validateAll(),
        getFormState: () => this.getFormState(),
        getFieldState: (p) => this.getFieldState(p),
        on: (event, cb, ctx) => this.on(event, cb, ctx),
      };
    }

    return this._api;
  }

  // ============================================================================
  // SERVICE MANAGEMENT
  // ============================================================================

  /**
   * Replace validation service
   * @param {ValidationService} service - New validation service
   */
  setValidationService(service) {
    this.validationService = service;
    this._configureServices();

    return this;
  }

  /**
   * Replace cache service
   * @param {CacheService} service - New cache service
   */
  setCacheService(service) {
    this.cacheService = service;

    return this;
  }

  /**
   * Replace event service
   * @param {EventService} service - New event service
   */
  setEventService(service) {
    this.eventService = service;

    return this;
  }

  /**
   * Get service statistics
   * @returns {Object} Statistics from all services
   */
  getServiceStats() {
    return {
      cache: this.cacheService.getStats(),
      validation: {
        validatorsCount: this.validationService.validators.size,
        options: this.validationService.options,
      },
      events: this.eventService.getStats(),
      batch: this.batchService.getStats(),
      engine: {
        operations: this.operations,
        renderCount: this.renderCount,
        isInitialized: this.isInitialized,
      },
    };
  }

  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================

  /**
   * Reset form state
   * @private
   */
  _resetState() {
    this.values = {};
    this.errors = Object.create(null);
    this.touched.clear();
    this.active = null;
    this.submitting = false;
    this.batchQueue = [];
    this.isBatching = false;
    this.operations = 0;
    this.renderCount = 0;
    this._previousFormDirty = null;
    this._previousFieldDirty.clear();
    this._previousFormValid = null;
  }

  /**
   * Configure services with current config
   * @private
   */
  _configureServices() {
    if (isDefined(this.validationService) && isFunction(this.validationService.updateConfig)) {
      this.validationService.updateConfig({
        debounceDelay: this.options[FORM_ENGINE_OPTIONS.BATCH_DELAY],
        validateOnChange: this.options[FORM_ENGINE_OPTIONS.VALIDATE_ON_CHANGE],
        validateOnBlur: this.options[FORM_ENGINE_OPTIONS.VALIDATE_ON_BLUR],
        getFieldContext: (path, _value, _allValues) => ({
          fieldState: this.getFieldState(path),
          api: this.getFormApi(),
        }),
      });
    }

    if (isDefined(this.batchService) && isFunction(this.batchService.updateConfig)) {
      this.batchService.updateConfig({
        enableBatching: this.options[FORM_ENGINE_OPTIONS.ENABLE_BATCHING],
        batchDelay: this.options[FORM_ENGINE_OPTIONS.BATCH_DELAY],
      });
    }
  }

  /**
   * Get isEqual function from options or return default (shallowEqual)
   * @returns {Function} Comparison function
   * @private
   */
  _getIsEqualFunction() {
    return isFunction(this.options.isEqual)
      ? this.options.isEqual
      : shallowEqual;
  }

  /**
   * Check and emit form-level dirty/pristine state changes
   * @private
   */
  _checkAndEmitFormDirtyState() {
    const currentDirty = this._isFormDirty();

    // Only emit if state actually changed
    if (this._previousFormDirty !== null && this._previousFormDirty !== currentDirty) {
      if (currentDirty) {
        this.eventService.emit(EVENTS.DIRTY, { dirty: true, pristine: false });
      } else {
        this.eventService.emit(EVENTS.PRISTINE, { dirty: false, pristine: true });
      }
    }

    this._previousFormDirty = currentDirty;
  }

  /**
   * Check and emit form valid state event only when state changes
   * @private
   */
  _checkAndEmitFormValidState() {
    const isValid = Object.keys(this.errors).length === 0;

    if (this._previousFormValid !== isValid) {
      this._previousFormValid = isValid;
      this.eventService.emit(EVENTS.VALID, { valid: isValid });
    }
  }

  /**
   * Check and emit field-level dirty/pristine state changes
   * @param {string} path - Field path
   * @private
   */
  _checkAndEmitFieldDirtyState(path) {
    if (!path) return;

    const currentValue = this.get(path);
    const initialValue = getByPath(this.initialValues, path);
    const isEqual = this._getIsEqualFunction();
    const currentDirty = !isEqual(currentValue, initialValue);

    const previousDirty = this._previousFieldDirty.get(path);

    // Only emit if state actually changed
    if (previousDirty !== undefined && previousDirty !== currentDirty) {
      if (currentDirty) {
        this.eventService.emit(`${FIELD_EVENT_PREFIXES.DIRTY}${path}`, {
          path,
          dirty: true,
          pristine: false,
        });
      } else {
        this.eventService.emit(`${FIELD_EVENT_PREFIXES.PRISTINE}${path}`, {
          path,
          dirty: false,
          pristine: true,
        });
      }
    }

    this._previousFieldDirty.set(path, currentDirty);
  }

  /**
   * Ensure form is initialized
   * @private
   */
  _ensureInitialized() {
    if (!this.isInitialized) {
      throw new Error('FormEngine must be initialized before use. Call init() first.');
    }
  }

  /**
   * Submit form
   * @param {Function} onSubmit - Submit handler
   */
  async submit(onSubmit) {
    this._ensureInitialized();

    // Only emit submitting events if state actually changed
    const previousSubmitting = this.submitting;

    if (!previousSubmitting) {
      this.submitting = true;
      this.eventService.emit(EVENTS.SUBMIT, { submitting: true });
      this.eventService.emit(EVENTS.SUBMITTING, { submitting: true });
    }

    try {
      const values = this.getValues();

      // Run validation for all fields before submit
      const isValid = await this.validateAll();
      const errors = this.getErrors();

      if (!isValid || Object.keys(errors).length > 0) {
        // Mark all fields with errors as touched so errors are displayed
        Object.keys(errors).forEach(fieldName => {
          this.touched.add(fieldName);
        });

        // Only emit if state changed
        if (this.submitting !== false) {
          this.submitting = false;
          this.eventService.emit(EVENTS.SUBMIT, { submitting: false, success: false, errors });
          this.eventService.emit(EVENTS.SUBMITTING, { submitting: false });
        }

        return { success: false, errors, values };
      }

      if (onSubmit) {
        await onSubmit(values);
      }

      // Only emit if state changed
      if (this.submitting !== false) {
        this.submitting = false;
        this.eventService.emit(EVENTS.SUBMIT, { submitting: false, success: true, values });
        this.eventService.emit(EVENTS.SUBMITTING, { submitting: false });
      }

      return { success: true, values };
    } catch (error) {
      // Only emit if state changed
      if (this.submitting !== false) {
        this.submitting = false;
        this.eventService.emit(EVENTS.SUBMIT, { submitting: false, success: false, error: error.message });
        this.eventService.emit(EVENTS.SUBMITTING, { submitting: false });
      }

      return { success: false, error: error.message };
    }
  }

  // ============================================================================
  // EVENT SYSTEM
  // ============================================================================

  /**
   * Subscribe to events
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   * @param {Object} context - Context for cleanup (optional)
   * @returns {Function} Unsubscribe function
   */
  on(event, callback, context = null) {
    return this.eventService.on(event, callback, context);
  }
}
