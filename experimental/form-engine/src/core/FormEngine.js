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
/* eslint-disable max-lines */

import {
  EVENTS,
  DEBOUNCE_DELAYS,
  FORM_ENGINE_OPTIONS,
  DIRTY_CHECK_STRATEGY,
} from '../constants';
import { isFunction, isDefined, shallowEqual } from '../utils/checks';
import { ValidationService } from './services/ValidationService';
import { CacheService } from './services/CacheService';
import { EventService } from './services/EventService';
import { BatchService } from './services/BatchService';
import {
  ValuesFeature,
  ErrorsFeature,
  TouchedFeature,
  ActiveFeature,
  SubmittingFeature,
  DirtyFeature,
} from './features';

export default class FormEngine {
  constructor(services = {}) {
    // Services (injected dependencies)
    this.validationService = services.validationService || new ValidationService();
    this.cacheService = services.cacheService || new CacheService();
    this.eventService = services.eventService || new EventService();
    this.batchService = services.batchService || new BatchService();

    // Features (injected dependencies)
    // Features get reference to engine for accessing services and other features
    this.valuesFeature = services.valuesFeature || new ValuesFeature(this);
    this.errorsFeature = services.errorsFeature || new ErrorsFeature(this);
    this.touchedFeature = services.touchedFeature || new TouchedFeature(this);
    this.activeFeature = services.activeFeature || new ActiveFeature(this);
    this.submittingFeature = services.submittingFeature || new SubmittingFeature(this);
    this.dirtyFeature = services.dirtyFeature || new DirtyFeature(this);

    // Configuration (set via init method)
    this.options = {};

    // Initialization state
    this.isInitialized = false;

    // Performance tracking
    this.operations = 0;
    this.renderCount = 0;

    // Batch callback flag
    this._batchFlushCallbackSet = false;
  }

  /**
   * Initialize form with values and configuration
   * @param {Object} initialValues - Initial form values
   * @param {Object} config - Form configuration
   */
  init(initialValues = Object.create(null), config = {}) {
    this._resetState();

    // Filter out undefined values from config to avoid overwriting defaults
    const cleanConfig = Object.keys(config).reduce((acc, key) => {
      if (isDefined(config[key])) {
        acc[key] = config[key];
      }

      return acc;
    }, {});

    this.options = {
      [FORM_ENGINE_OPTIONS.ENABLE_BATCHING]: true,
      [FORM_ENGINE_OPTIONS.BATCH_DELAY]: DEBOUNCE_DELAYS.DEFAULT,
      [FORM_ENGINE_OPTIONS.ENABLE_VALIDATION]: true,
      [FORM_ENGINE_OPTIONS.VALIDATE_ON_CHANGE]: false,
      [FORM_ENGINE_OPTIONS.VALIDATE_ON_BLUR]: true,
      [FORM_ENGINE_OPTIONS.DIRTY_CHECK_STRATEGY]: DIRTY_CHECK_STRATEGY.VALUES,
      ...cleanConfig,
    };

    // Initialize features
    this.valuesFeature.init(initialValues);
    this.errorsFeature.init();
    this.touchedFeature.init();
    this.activeFeature.init();
    this.submittingFeature.init();
    this.dirtyFeature.init();

    this._configureServices();

    this.isInitialized = true;

    this.eventService.emit(EVENTS.INIT, { values: this.valuesFeature.getAll(), config: this.options });

    return this;
  }

  /**
   * Reset form to initial state
   */
  reset() {
    if (isDefined(this.batchService) && isFunction(this.batchService.dispose)) {
      this.batchService.dispose();
    }

    // Reset features
    this.valuesFeature.reset();
    this.errorsFeature.reset();
    this.touchedFeature.reset();
    this.activeFeature.reset();
    this.submittingFeature.reset();
    this.dirtyFeature.reset();

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
      this.cacheService.createValueKey(path, this.valuesFeature.values),
      () => this.valuesFeature.get(path),
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

    // Reset submitSucceeded if form was successfully submitted but user makes changes
    // This ensures navigation guard blocks navigation again after successful submit
    if (this.submittingFeature.hasSubmitSucceeded()) {
      this.submittingFeature.setSubmitSucceeded(false);
    }

    this.valuesFeature.set(path, value);

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
      // Queue operation for batching - operations accumulate until flush
      this.batchService.queueOperation({ path, value });
      // Set flush callback only once (it's reused for all subsequent operations)
      // This avoids creating a new callback on every set() call
      if (!this._batchFlushCallbackSet) {
        this.batchService.setOnFlush((operations) => this._emitBatch(operations));
        this._batchFlushCallbackSet = true;
      }
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
    // Reset submitSucceeded if form was successfully submitted but user makes changes
    // This ensures navigation guard blocks navigation again after successful submit
    if (this.submittingFeature.hasSubmitSucceeded() && updates.length > 0) {
      this.submittingFeature.setSubmitSucceeded(false);
    }

    if (this.options[FORM_ENGINE_OPTIONS.ENABLE_BATCHING]) {
      this.batch(() => {
        updates.forEach(({ path, value }) => {
          this.valuesFeature.set(path, value);
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

    // Deduplicate operations by path - keep only the last value for each path
    // This ensures we emit the final state, not intermediate states
    const operationsByPath = {};

    operations.forEach(({ path, value }) => {
      operationsByPath[path] = { path, value };
    });
    const deduplicatedOperations = Object.values(operationsByPath);

    // Emit aggregated change event
    this.eventService.emit(EVENTS.CHANGE, { batch: true, updates: deduplicatedOperations });
    // Emit values event
    this.eventService.emit(EVENTS.VALUES, { values: this.getValues() });

    // Track nested paths already emitted to avoid duplicates
    const nestedPathsEmitted = new Set();

    // Emit per-field events and queue dirty checks (non-blocking)
    deduplicatedOperations.forEach(({ path, value }) => {
      const changeEvent = `${EVENTS.CHANGE}:${path}`;

      // Emit direct event for the changed path
      this.eventService.emit(changeEvent, value);

      // Emit events for nested paths when parent path changes
      // Example: when 'calculatedFinanceData' array changes, emit for 'calculatedFinanceData[0].budgetAfterAllocation'
      // This ensures Field components subscribed to nested paths receive updates
      // Only check if there are listeners to avoid necessary work
      if (this.eventService.hasListeners()) {
        const nestedEvents = this.eventService.getEventsWithPrefix(changeEvent);

        nestedEvents.forEach((nestedEvent) => {
          // Extract path from event name: 'change:array[0].field' -> 'array[0].field'
          const nestedPath = nestedEvent.substring(`${EVENTS.CHANGE}:`.length);

          // Track emitted paths to avoid duplicate events when multiple parent changes affect same nested path
          if (!nestedPathsEmitted.has(nestedPath)) {
            nestedPathsEmitted.add(nestedPath);

            // Get current value and emit - this ensures subscribers get the latest value after parent change
            const nestedValue = this.get(nestedPath);

            this.eventService.emit(nestedEvent, nestedValue);
          }
        });
      }

      // Queue dirty state check to avoid blocking the event loop
      this.dirtyFeature.queueCheck(path);
    });
  }

  /**
   * Get all values
   */
  getValues() {
    return this.valuesFeature.getAll();
  }

  /**
   * Get initial values
   */
  getInitialValues() {
    return this.valuesFeature.getAllInitial();
  }

  /**
   * Set field error
   * @param {string} path - Field path
   * @param {string} error - Error message
   */
  setError(path, error) {
    this.errorsFeature.set(path, error);
  }

  /**
   * Clear field error
   * @param {string} path - Field path
   */
  clearError(path) {
    this.errorsFeature.clear(path);
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
   * Unregister validator for field
   * @param {string} path
   */
  unregisterValidator(path) {
    if (this.validationService.unregisterValidator) {
      this.validationService.unregisterValidator(path);
    }
  }

  /**
   * Check if validator is registered for field
   * @param {string} path - Field path
   * @returns {boolean}
   */
  hasValidator(path) {
    if (this.validationService.hasValidator) {
      return this.validationService.hasValidator(path);
    }

    return false;
  }

  /**
   * Validate field
   * @param {string} path - Field path
   * @param {*} value - Field value
   * @private
   */
  async _validateField(path, value) {
    const error = await this.validationService.validateField(path, value, this.valuesFeature.values);

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
    const errors = await this.validationService.validateAll(this.valuesFeature.values);
    const previousErrors = this.errorsFeature.getAll();

    // Check if errors object actually changed
    const errorsChanged = !shallowEqual(previousErrors, errors);

    if (errorsChanged) {
      this.errorsFeature.setAll(errors);
      this.eventService.emit(EVENTS.VALIDATION, { errors });
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

    return this.errorsFeature.isValid();
  }

  /**
   * Get all errors
   */
  getErrors() {
    return this.errorsFeature.getAll();
  }

  /**
   * Check if field is touched
   * @param {string} path - Field path
   */
  isTouched(path) {
    return this.touchedFeature.isTouched(path);
  }

  /**
   * Mark field as touched
   * @param {string} path - Field path
   */
  touch(path) {
    this.touchedFeature.touch(path);
  }

  /**
   * Focus field
   * @param {string} path - Field path
   */
  focus(path) {
    this.activeFeature.focus(path);
  }

  /**
   * Blur field
   */
  blur() {
    this.activeFeature.blur();
  }

  /**
   * Get form state with improved WeakMap caching
   */
  getFormState() {
    this._ensureInitialized();

    const formState = {
      values: this.valuesFeature.getAll(),
      initialValues: this.valuesFeature.getAllInitial(),
      errors: this.errorsFeature.getAll(),
      touched: this.touchedFeature.getTouchedArray(),
      active: this.activeFeature.getActive(),
      submitting: this.submittingFeature.isSubmitting(),
      submitSucceeded: this.submittingFeature.hasSubmitSucceeded(),
      valid: this.errorsFeature.isValid(),
      dirty: this.dirtyFeature.isDirty(),
      pristine: this.dirtyFeature.isPristine(),
    };

    return this.cacheService.getFormState(formState, () => formState);
  }

  /**
   * Track React component state update attempt
   * Should be called from React hooks before dispatch to state update
   *
   * Note: This counts dispatch attempts, not actual React re-renders.
   * React may batch multiple updates into a single re-render, so renderCount
   * represents the number of state update attempts, which is a useful metric
   * for understanding form activity and potential performance implications.
   */
  trackRender() {
    if (this.isInitialized) {
      this.renderCount++;
    }
  }

  /**
   * Get current field state snapshot
   * @param {string} path
   */
  getFieldState(path) {
    const currentValue = this.get(path);
    const initialValue = this.valuesFeature.getInitial(path);
    const isDirty = this.dirtyFeature.isFieldDirty(path);

    return {
      name: path,
      value: currentValue,
      initialValue,
      dirty: isDirty,
      error: this.errorsFeature.get(path),
      touched: this.touchedFeature.isTouched(path),
      active: this.activeFeature.isActive(path),
      pristine: !isDirty,
    };
  }

  /**
   * Check if form is dirty
   * @returns {boolean} True if form is dirty
   */
  isDirty() {
    return this.dirtyFeature.isDirty();
  }

  /**
   * Get all dirty fields as an object { path: boolean }
   * @returns {Object} Object with field paths as keys and dirty status as values
   */
  getDirtyFields() {
    // Simply return dirty fields from DirtyFeature's internal Map
    // This is much more efficient than recursively traversing all form fields
    return this.dirtyFeature.getAllDirtyFields();
  }

  /**
   * Get list of dirty field paths
   * Useful for debugging
   * @returns {Array<string>} Array of field paths that are dirty
   */
  getDirtyFieldsList() {
    return Object.keys(this.getDirtyFields());
  }

  /**
   * Get debug information about form state
   * @returns {Object} Debug information
   */
  getDebugInfo() {
    const dirtyFields = this.getDirtyFields();
    const dirtyFieldsList = Object.keys(dirtyFields);

    return {
      formDirty: this.dirtyFeature.isDirty(),
      dirtyStrategy: this.options[FORM_ENGINE_OPTIONS.DIRTY_CHECK_STRATEGY],
      dirtyFieldsCount: dirtyFieldsList.length,
      dirtyFieldsList,
      dirtyFields,
      submitting: this.submittingFeature.isSubmitting(),
      submitSucceeded: this.submittingFeature.hasSubmitSucceeded(),
      touchedCount: this.touchedFeature.touched.size,
      touchedFields: this.touchedFeature.getTouchedArray(),
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
        getDirtyFields: () => this.getDirtyFields(),
        getDirtyFieldsList: () => this.getDirtyFieldsList(),
        getDebugInfo: () => this.getDebugInfo(),
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
    // Features are reset in reset() method
    this.operations = 0;
    this.renderCount = 0;
    this._batchFlushCallbackSet = false;
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
  async submit(onSubmit = null) {
    this._ensureInitialized();

    // Clear cache before starting submit to ensure fresh state
    this.cacheService.clearFormStateCache();

    // Set submitting state
    this.submittingFeature.start();
    this.eventService.emit(EVENTS.SUBMIT, { submitting: true });

    try {
      const values = this.getValues();

      // Run validation for all fields before submit
      const isValid = await this.validateAll();
      const errors = this.getErrors();

      if (!isValid || Object.keys(errors).length > 0) {
        // Mark all fields with errors as touched so errors are displayed
        Object.keys(errors).forEach(fieldName => {
          this.touchedFeature.touch(fieldName);
        });

        this.submittingFeature.stop();
        this.submittingFeature.setSubmitSucceeded(false);
        this.cacheService.clearFormStateCache();
        this.eventService.emit(EVENTS.SUBMIT, { submitting: false, success: false, errors });

        return { success: false, errors, values };
      }

      if (onSubmit) {
        await onSubmit(values);
      }

      this.submittingFeature.stop();
      this.submittingFeature.setSubmitSucceeded(true);
      this.cacheService.clearFormStateCache();
      this.eventService.emit(EVENTS.SUBMIT, { submitting: false, success: true, values });

      return { success: true, values };
    } catch (error) {
      this.submittingFeature.stop();
      this.submittingFeature.setSubmitSucceeded(false);
      this.cacheService.clearFormStateCache();
      this.eventService.emit(EVENTS.SUBMIT, { submitting: false, success: false, error: error.message });

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
