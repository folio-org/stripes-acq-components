/**
 * DirtyFeature - Manages form dirty/pristine state
 */

import { getByPath } from '../../utils/path';
import { EVENTS, DIRTY_CHECK_STRATEGY, FIELD_EVENT_PREFIXES, FORM_ENGINE_OPTIONS } from '../../constants';
import { isFunction } from '../../utils/checks';

export class DirtyFeature {
  constructor(engine) {
    this.engine = engine;
    this._previousFormDirty = null;
    this._previousFieldDirty = new Map(); // Map<path, boolean>
    this._dirtyCheckScheduled = false;
    this._pendingFieldDirtyChecks = new Set();
  }

  /**
   * Initialize dirty state
   */
  init() {
    // Initialize to null - will be set on first check
    // Don't check _isFormDirty() here because no fields are tracked yet
    this._previousFormDirty = null;
    this._previousFieldDirty.clear();
    this._dirtyCheckScheduled = false;
    this._pendingFieldDirtyChecks.clear();
  }

  /**
   * Reset dirty state
   */
  reset() {
    this._previousFormDirty = null;
    this._previousFieldDirty.clear();
    this._dirtyCheckScheduled = false;
    this._pendingFieldDirtyChecks.clear();
  }

  /**
   * Check if form is dirty
   * @returns {boolean} True if form is dirty
   */
  isDirty() {
    return this._isFormDirty();
  }

  /**
   * Check if form is pristine
   * @returns {boolean} True if form is pristine
   */
  isPristine() {
    return !this._isFormDirty();
  }

  /**
   * Check if field is dirty
   * @param {string} path - Field path
   * @returns {boolean} True if field is dirty
   */
  isFieldDirty(path) {
    const currentValue = this.engine.valuesFeature.get(path);
    const initialValue = getByPath(this.engine.valuesFeature.initialValues, path);
    const isEqual = this._getIsEqualFunction();

    return !isEqual(currentValue, initialValue);
  }

  /**
   * Queue dirty check for a field
   * @param {string} path - Field path
   */
  queueCheck(path) {
    this._pendingFieldDirtyChecks.add(path);
    this._scheduleDirtyChecks();
  }

  /**
   * Check if form is dirty (internal)
   * @returns {boolean} True if form is dirty
   * @private
   */
  _isFormDirty() {
    const strategy = this.engine.options[FORM_ENGINE_OPTIONS.DIRTY_CHECK_STRATEGY];

    if (strategy === DIRTY_CHECK_STRATEGY.TOUCHED) {
      // Form is dirty if at least one field is touched
      return this.engine.touchedFeature.touched.size > 0;
    }

    // Default: VALUES strategy - form is dirty if at least one field has different value
    // We only check tracked fields (_previousFieldDirty) for performance:
    // - Untracked fields haven't been changed, so they're pristine by definition
    // - Tracking starts when a field is first checked (via _checkAndEmitFieldDirtyState)
    // - This avoids expensive full-form comparison on every change
    for (const [, isDirty] of this._previousFieldDirty) {
      if (isDirty) {
        return true;
      }
    }

    // All tracked fields are pristine (or no fields tracked yet)
    // Form is pristine
    return false;
  }

  /**
   * Schedule dirty state checks asynchronously to avoid blocking rendering
   * @private
   */
  _scheduleDirtyChecks() {
    if (this._dirtyCheckScheduled) return;

    this._dirtyCheckScheduled = true;

    // Use queueMicrotask to defer dirty checks until after current synchronous work
    // This prevents blocking the event loop during rapid input changes
    // Dirty checks are expensive (value comparison), so batching is important
    if (typeof queueMicrotask !== 'undefined') {
      queueMicrotask(() => {
        this._flushDirtyChecks();
      });
    } else {
      // Fallback for environments without queueMicrotask (older browsers)
      Promise.resolve().then(() => {
        this._flushDirtyChecks();
      });
    }
  }

  /**
   * Flush pending dirty state checks
   * @private
   */
  _flushDirtyChecks() {
    this._dirtyCheckScheduled = false;

    // Process all pending field dirty checks that were queued during batch
    // This ensures we check each field only once, even if it changed multiple times in a batch
    this._pendingFieldDirtyChecks.forEach((path) => {
      this._checkAndEmitFieldDirtyState(path);
    });
    this._pendingFieldDirtyChecks.clear();

    // After all field checks, determine form-level dirty state
    // Form is dirty if any field is dirty
    this._checkAndEmitFormDirtyState();
  }

  /**
   * Check and emit field-level dirty/pristine state changes
   * @param {string} path - Field path
   * @private
   */
  _checkAndEmitFieldDirtyState(path) {
    if (!path) return;

    const currentValue = this.engine.valuesFeature.get(path);
    const initialValue = getByPath(this.engine.valuesFeature.initialValues, path);
    const isEqual = this._getIsEqualFunction();
    const currentDirty = !isEqual(currentValue, initialValue);

    const previousDirty = this._previousFieldDirty.get(path);

    // Only emit if state actually changed
    if (previousDirty !== undefined && previousDirty !== currentDirty) {
      // Update tracked state before emitting
      this._previousFieldDirty.set(path, currentDirty);

      if (currentDirty) {
        // Field became dirty - emit dirty event
        this.engine.eventService.emit(`${FIELD_EVENT_PREFIXES.DIRTY}${path}`, {
          path,
          dirty: true,
          pristine: false,
        });
      } else {
        // Field became pristine - emit both events for completeness
        this.engine.eventService.emit(`${FIELD_EVENT_PREFIXES.PRISTINE}${path}`, {
          path,
          dirty: false,
          pristine: true,
        });
        this.engine.eventService.emit(`${FIELD_EVENT_PREFIXES.DIRTY}${path}`, {
          path,
          dirty: false,
          pristine: true,
        });
      }

      // Check form state after field state changed
      this._checkAndEmitFormDirtyState();
    } else if (previousDirty === undefined) {
      // First time tracking this field - update tracked state
      this._previousFieldDirty.set(path, currentDirty);

      // Emit initial state only if field is dirty
      // Don't emit pristine events on first track - not needed
      if (currentDirty) {
        // Field is dirty from the start - emit dirty event
        this.engine.eventService.emit(`${FIELD_EVENT_PREFIXES.DIRTY}${path}`, {
          path,
          dirty: true,
          pristine: false,
        });
      }

      // Check form state after tracking field
      // This will emit form-level dirty state if needed
      this._checkAndEmitFormDirtyState();
    }
  }

  /**
   * Check and emit form-level dirty/pristine state changes
   * @private
   */
  _checkAndEmitFormDirtyState() {
    const currentDirty = this._isFormDirty();
    const previousDirty = this._previousFormDirty;

    // Only emit if state actually changed
    // Don't emit on first check if form is pristine - not needed
    if (previousDirty !== null && previousDirty !== currentDirty) {
      if (currentDirty) {
        // Form became dirty - emit dirty event
        this.engine.eventService.emit(EVENTS.DIRTY, { dirty: true, pristine: false });
      } else {
        // Form became pristine - emit both events for completeness
        this.engine.eventService.emit(EVENTS.PRISTINE, { dirty: false, pristine: true });
        this.engine.eventService.emit(EVENTS.DIRTY, { dirty: false, pristine: true });
      }
    } else if (previousDirty === null && currentDirty) {
      // First check and form is dirty - emit dirty event
      // This happens when first field becomes dirty
      this.engine.eventService.emit(EVENTS.DIRTY, { dirty: true, pristine: false });
    }

    // Always update previous state, even on first check
    this._previousFormDirty = currentDirty;
  }

  /**
   * Get isEqual function from options or return default
   * @returns {Function} Comparison function
   * @private
   */
  _getIsEqualFunction() {
    // eslint-disable-next-line global-require
    const { shallowEqual } = require('../../utils/checks');

    return isFunction(this.engine.options.isEqual)
      ? this.engine.options.isEqual
      : shallowEqual;
  }
}

