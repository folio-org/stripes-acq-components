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
  VALIDATION_MODES,
  ERROR_SOURCES,
} from '../constants';
import { isFunction, isDefined, isEqual } from '../utils/checks';
import { ValidationService } from './services/ValidationService';
import { CacheService } from './services/CacheService';
import { EventService } from './services/EventService';
import { BatchService } from './services/BatchService';
import { SchedulerService } from './services/SchedulerService';
import { FeatureFactory } from './factories/FeatureFactory';
import { safeCall } from '../utils/helpers';

export default class FormEngine {
  constructor(services = {}) {
    // Services (injected dependencies)
    this.validationService = services.validationService || new ValidationService();
    this.cacheService = services.cacheService || new CacheService();
    this.eventService = services.eventService || new EventService();
    this.batchService = services.batchService || new BatchService();
    this.schedulerService = services.schedulerService || new SchedulerService();

    // Features (injected dependencies)
    // Use factory to create all features in a cleaner way (KISS + DRY)
    const features = FeatureFactory.createFeatures(this, services);

    Object.assign(this, features);

    // Configuration (set via init method)
    this.options = {};

    // Initialization state
    this.isInitialized = false;

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

    // Initialize all features using factory
    const features = {
      valuesFeature: this.valuesFeature,
      errorsFeature: this.errorsFeature,
      touchedFeature: this.touchedFeature,
      activeFeature: this.activeFeature,
      submittingFeature: this.submittingFeature,
      dirtyFeature: this.dirtyFeature,
    };

    FeatureFactory.initializeFeatures(features, initialValues);

    this._configureServices();

    this.isInitialized = true;

    this.eventService.emit(EVENTS.INIT, { values: this.valuesFeature.getAll(), config: this.options });

    return this;
  }

  /**
   * Reset form to initial state
   */
  reset() {
    // Use safeCall for cleaner disposal (DRY principle)
    safeCall(this.batchService, 'dispose');

    // Reset all features using factory method (DRY principle)
    const features = {
      valuesFeature: this.valuesFeature,
      errorsFeature: this.errorsFeature,
      touchedFeature: this.touchedFeature,
      activeFeature: this.activeFeature,
      submittingFeature: this.submittingFeature,
      dirtyFeature: this.dirtyFeature,
    };

    FeatureFactory.resetFeatures(features);

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
        for (const { path, value } of updates) {
          this.valuesFeature.set(path, value);
          this.cacheService.clearForPath(path);
        }
      });
      if (!options.silent) {
        this._emitBatch(updates);
      }
    } else {
      for (const { path, value } of updates) {
        this.set(path, value, { immediate: true, silent: options.silent });
      }
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
   * Get parent paths for a given path
   * Examples:
   *   'foo[0].field' -> ['foo[0]', 'foo']
   *   'foo.bar.baz' -> ['foo.bar', 'foo']
   *   'foo' -> []
   * @param {string} path - Field path
   * @returns {Array<string>} Array of parent paths from immediate to root
   * @private
   */
  _getParentPaths(path) {
    const parents = [];
    let currentPath = path;
    let lastSep = -1;

    do {
      // Find last separator (. or [)
      const lastDot = currentPath.lastIndexOf('.');
      const lastBracket = currentPath.lastIndexOf('[');

      lastSep = Math.max(lastDot, lastBracket);

      if (lastSep !== -1) {
        currentPath = currentPath.substring(0, lastSep);
        parents.push(currentPath);
      }
    } while (lastSep !== -1);

    return parents;
  }

  /**
   * Touch all fields with errors (excluding form-level errors)
   * @param {Object} errors - Errors object
   * @private
   */
  _touchFieldsWithErrors(errors) {
    // Skip $form (form-level error marker) - it's not an actual field
    for (const fieldName of Object.keys(errors)) {
      if (fieldName !== '$form') {
        this.touchedFeature.touch(fieldName);
      }
    }
  }

  /**
   * Emit field change events including nested and parent events
   * @param {string} path - Field path
   * @param {*} value - Field value
   * @param {Set} nestedPathsEmitted - Tracker for nested paths already emitted
   * @param {Set} parentPathsEmitted - Tracker for parent paths already emitted
   * @private
   */
  _emitFieldChangeEvents(path, value, nestedPathsEmitted, parentPathsEmitted) {
    const changeEvent = `${EVENTS.CHANGE}:${path}`;

    // Emit direct event for the changed path
    this.eventService.emit(changeEvent, value);

    if (!this.eventService.hasListeners()) return;

    // Emit events for nested paths when parent path changes
    this._emitNestedPathEvents(changeEvent, nestedPathsEmitted);

    // Emit events for parent paths when nested field changes
    this._emitParentPathEvents(path, parentPathsEmitted);
  }

  /**
   * Emit events for nested paths
   * @param {string} changeEvent - Change event name
   * @param {Set} nestedPathsEmitted - Tracker for nested paths already emitted
   * @private
   */
  _emitNestedPathEvents(changeEvent, nestedPathsEmitted) {
    const nestedEvents = this.eventService.getEventsWithPrefix(changeEvent);

    for (const nestedEvent of nestedEvents) {
      // Extract path from event name: 'change:array[0].field' -> 'array[0].field'
      const nestedPath = nestedEvent.substring(`${EVENTS.CHANGE}:`.length);

      // Track emitted paths to avoid duplicate events
      if (!nestedPathsEmitted.has(nestedPath)) {
        nestedPathsEmitted.add(nestedPath);

        // Get current value and emit
        const nestedValue = this.get(nestedPath);

        this.eventService.emit(nestedEvent, nestedValue);
      }
    }
  }

  /**
   * Emit events for parent paths
   * @param {string} path - Field path
   * @param {Set} parentPathsEmitted - Tracker for parent paths already emitted
   * @private
   */
  _emitParentPathEvents(path, parentPathsEmitted) {
    const parentPaths = this._getParentPaths(path);

    for (const parentPath of parentPaths) {
      const parentEvent = `${EVENTS.CHANGE}:${parentPath}`;

      // Only emit if there are listeners with bubble:true and not already emitted
      const shouldEmit = !parentPathsEmitted.has(parentPath) &&
        this.eventService.hasListener(parentEvent, { onlyBubble: true });

      if (shouldEmit) {
        parentPathsEmitted.add(parentPath);

        // Get current parent value and emit
        const parentValue = this.get(parentPath);

        this.eventService.emit(parentEvent, parentValue);
      }
    }
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

    for (const { path, value } of operations) {
      operationsByPath[path] = { path, value };
    }
    const deduplicatedOperations = Object.values(operationsByPath);

    // Emit aggregated change event
    this.eventService.emit(EVENTS.CHANGE, { batch: true, updates: deduplicatedOperations });
    // Emit values event
    this.eventService.emit(EVENTS.VALUES, { values: this.getValues() });

    // Track nested paths already emitted to avoid duplicates
    const nestedPathsEmitted = new Set();
    const parentPathsEmitted = new Set();

    // Emit per-field events and queue dirty checks (non-blocking)
    for (const { path, value } of deduplicatedOperations) {
      this._emitFieldChangeEvents(path, value, nestedPathsEmitted, parentPathsEmitted);
      // Queue dirty state check to avoid blocking the event loop
      this.dirtyFeature.queueCheck(path);
    }
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
   * @param {string} source - Error source (use ERROR_SOURCES constants)
   */
  setError(path, error, source = ERROR_SOURCES.FIELD) {
    this.errorsFeature.set(path, error, source);
  }

  /**
   * Clear field error
   * @param {string} path - Field path
   * @param {string} source - Optional: clear only errors from specific source
   */
  clearError(path, source = null) {
    this.errorsFeature.clear(path, source);
  }

  /**
   * Get all errors for a specific field (with sources)
   * @param {string} path - Field path
   * @returns {Array<{source: string, error: string}>} Array of error objects
   */
  getFieldErrors(path) {
    return this.errorsFeature.getErrors(path);
  }

  /**
   * Register validator for field
   * @param {string} path - Field path
   * @param {Function} validator - Validation function
   * @param {string} validateOn - Validation mode (use VALIDATION_MODES constants)
   */
  registerValidator(path, validator, validateOn = VALIDATION_MODES.BLUR) {
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
   * Internal method to validate a single field
   * @param {string} path - Field path
   * @param {*} value - Field value
   * @returns {Promise<string|null>} Error message or null if valid
   * @private
   */
  async _validateField(path, value) {
    const error = await this.validationService.validateField(path, value, this.valuesFeature.values);

    if (error) {
      this.setError(path, error);
    } else {
      this.clearError(path);
    }

    return error;
  }

  /**
   * Validate a specific field programmatically
   * @param {string} path - Field path
   * @returns {Promise<string|null>} Error message or null if valid
   */
  async validateField(path) {
    this._ensureInitialized();
    const value = this.get(path);

    return this._validateField(path, value);
  }

  /**
   * Validate all fields
   */
  async validateAll() {
    const errors = await this.validationService.validateAll(this.valuesFeature.values);
    const previousErrors = this.errorsFeature.getAll();

    // Check if errors object actually changed
    const errorsChanged = !isEqual(previousErrors, errors);

    if (errorsChanged) {
      this.errorsFeature.setAll(errors);
      this.eventService.emit(EVENTS.VALIDATION, { errors });
      // Emit ERROR event for changed fields
      const previousErrorKeys = Object.keys(previousErrors);
      const currentErrorKeys = Object.keys(errors);
      const allErrorKeys = new Set([...previousErrorKeys, ...currentErrorKeys]);

      for (const path of allErrorKeys) {
        const prevError = previousErrors[path];
        const currError = errors[path];

        if (prevError !== currError) {
          this.eventService.emit(EVENTS.ERROR, { path, error: currError || null });
          this.eventService.emit(`${EVENTS.ERROR}:${path}`, currError || null);
        }
      }
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
      error: this.errorsFeature.get(path), // First error (backward compatible)
      errors: this.errorsFeature.getErrors(path), // All errors with sources
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
    const errors = this.getErrors();
    // Filter out $form from field errors - it's a form-level error marker
    const errorsList = Object.keys(errors).filter(path => path !== '$form');
    const fieldErrors = Object.fromEntries(
      Object.entries(errors).filter(([path]) => path !== '$form'),
    );
    const formError = errors.$form != null ? errors.$form : null;

    return {
      // Validity information
      formValid: this.errorsFeature.isValid(),
      errorsCount: errorsList.length,
      errorsList,
      errors: fieldErrors,
      formError, // Separate form-level error if any
      // Dirty tracking
      formDirty: this.dirtyFeature.isDirty(),
      dirtyStrategy: this.options[FORM_ENGINE_OPTIONS.DIRTY_CHECK_STRATEGY],
      dirtyFieldsCount: dirtyFieldsList.length,
      dirtyFieldsList,
      dirtyFields,
      // Form state
      submitting: this.submittingFeature.isSubmitting(),
      submitSucceeded: this.submittingFeature.hasSubmitSucceeded(),
      touchedCount: this.touchedFeature.getTouchedCount(),
      touchedFields: this.touchedFeature.getTouchedArray().filter(path => path !== '$form'),
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
        validateField: (p) => this.validateField(p),
        validateAll: () => this.validateAll(),
        getFormState: () => this.getFormState(),
        getFieldState: (p) => this.getFieldState(p),
        getDirtyFields: () => this.getDirtyFields(),
        getDirtyFieldsList: () => this.getDirtyFieldsList(),
        getDebugInfo: () => this.getDebugInfo(),
        on: (event, cb, ctx, options) => this.on(event, cb, ctx, options),
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

      const hasErrors = !isValid || Object.keys(errors).length > 0;

      if (hasErrors) {
        // Mark all fields with errors as touched so errors are displayed
        this._touchFieldsWithErrors(errors);

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
   * @param {Object} options - Listener options (optional)
   * @param {boolean} options.bubble - If true, listener wants parent path events
   * @returns {Function} Unsubscribe function
   */
  on(event, callback, context = null, options = {}) {
    return this.eventService.on(event, callback, context, options);
  }
}
