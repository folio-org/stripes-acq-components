/**
 * DirtyFeature - Manages form dirty/pristine state
 */

import {
  DIRTY_CHECK_STRATEGY,
  EVENTS,
  FIELD_EVENT_PREFIXES,
  FORM_ENGINE_OPTIONS,
} from '../../constants';
import {
  isEqual,
  isFunction,
} from '../../utils/checks';
import { getByPath } from '../../utils/path';
import { BaseFeature } from './BaseFeature';

export class DirtyFeature extends BaseFeature {
  /**
   * Initialize dirty state
   */
  init() {
    super.init();
    this._setState('previousFormDirty', false);
    this._setState('previousFieldDirty', new Map()); // Map<path, boolean>
    this._setState('dirtyCheckScheduled', false);
    this._setState('pendingFieldDirtyChecks', new Set());
  }

  /**
   * Reset dirty state
   */
  reset() {
    super.reset();
    this._setState('previousFormDirty', false);
    this._setState('previousFieldDirty', new Map());
    this._setState('dirtyCheckScheduled', false);
    this._setState('pendingFieldDirtyChecks', new Set());
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
   * Get current and initial values for a field (DRY)
   * @param {string} path - Field path
   * @returns {{currentValue: *, initialValue: *}}
   * @private
   */
  _getFieldValues(path) {
    return {
      currentValue: this.engine.valuesFeature.get(path),
      initialValue: getByPath(this.engine.valuesFeature.initialValues, path),
    };
  }

  /**
   * Check if field is dirty
   * @param {string} path - Field path
   * @returns {boolean} True if field is dirty
   */
  isFieldDirty(path) {
    const { currentValue, initialValue } = this._getFieldValues(path);
    const isEqualFn = this._getIsEqualFunction();

    return !isEqualFn(currentValue, initialValue);
  }

  /**
   * Get all dirty fields as an object { path: boolean }
   * Returns only tracked fields (fields that have been checked at least once)
   * @returns {Object} Object with dirty field paths as keys and true as values
   */
  getAllDirtyFields() {
    const dirtyFields = {};
    const previousFieldDirty = this._getState('previousFieldDirty');

    // Iterate over tracked fields and collect dirty ones
    // Filter out invalid/empty paths
    for (const [path, isDirty] of previousFieldDirty) {
      if (isDirty && path) {
        dirtyFields[path] = true;
      }
    }

    return dirtyFields;
  }

  /**
   * Queue dirty check for a field
   * @param {string} path - Field path
   * @param {boolean} immediate - If true, check immediately instead of queuing
   */
  queueCheck(path, immediate = false) {
    const pendingFieldDirtyChecks = this._getState('pendingFieldDirtyChecks');

    pendingFieldDirtyChecks.add(path);
    if (immediate) {
      this._checkAndEmitFieldDirtyState(path);
      pendingFieldDirtyChecks.delete(path);
    } else {
      this._scheduleDirtyChecks();
    }
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
      return this.engine.touchedFeature.getTouchedCount() > 0;
    }

    // Default: VALUES strategy - form is dirty if at least one field has different value
    // We only check tracked fields (previousFieldDirty) for performance:
    // - Untracked fields haven't been changed, so they're pristine by definition
    // - Tracking starts when a field is first checked (via _checkAndEmitFieldDirtyState)
    // - This avoids expensive full-form comparison on every change
    const previousFieldDirty = this._getState('previousFieldDirty');

    for (const [, isDirty] of previousFieldDirty) {
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
    const dirtyCheckScheduled = this._getState('dirtyCheckScheduled');

    if (dirtyCheckScheduled) return;

    this._setState('dirtyCheckScheduled', true);

    // Use SchedulerService for cleaner async handling (KISS + DRY)
    // Dirty checks are expensive (value comparison), so batching is important
    this.engine.schedulerService.scheduleMicrotask(() => {
      this._flushDirtyChecks();
    });
  }

  /**
   * Flush pending dirty state checks
   * @private
   */
  _flushDirtyChecks() {
    this._setState('dirtyCheckScheduled', false);

    const pendingFieldDirtyChecks = this._getState('pendingFieldDirtyChecks');

    // Process all pending field dirty checks that were queued during batch
    // This ensures we check each field only once, even if it changed multiple times in a batch
    for (const path of pendingFieldDirtyChecks) {
      this._checkAndEmitFieldDirtyState(path);
    }
    pendingFieldDirtyChecks.clear();

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

    const { currentValue, initialValue } = this._getFieldValues(path);
    const isEqualFn = this._getIsEqualFunction();
    const currentDirty = !isEqualFn(currentValue, initialValue);

    const previousFieldDirty = this._getState('previousFieldDirty');
    const previousDirty = previousFieldDirty.get(path);

    // Only emit if state actually changed
    if (previousDirty !== undefined && previousDirty !== currentDirty) {
      // Update tracked state before emitting
      previousFieldDirty.set(path, currentDirty);

      const eventName = `${FIELD_EVENT_PREFIXES.DIRTY}${path}`;

      if (currentDirty) {
        // Field became dirty - emit dirty event
        this.engine.eventService.emit(eventName, {
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
        this.engine.eventService.emit(eventName, {
          path,
          dirty: false,
          pristine: true,
        });
      }

      // Check form state after field state changed
      this._checkAndEmitFormDirtyState();
    } else if (previousDirty === undefined) {
      // First time tracking this field - update tracked state
      const fieldDirtyMap = this._getState('previousFieldDirty');

      fieldDirtyMap.set(path, currentDirty);

      const eventName = `${FIELD_EVENT_PREFIXES.DIRTY}${path}`;

      // Always emit initial state to synchronize subscribers
      // This ensures components get the correct dirty state even if field is pristine
      // Subscribers may have been initialized with stale state, so we need to sync
      this.engine.eventService.emit(eventName, {
        path,
        dirty: currentDirty,
        pristine: !currentDirty,
      });

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
    const previousDirty = this._getState('previousFormDirty');

    // Only emit if state actually changed
    if (previousDirty !== currentDirty) {
      if (currentDirty) {
        // Form became dirty - emit dirty event
        this.engine.eventService.emit(EVENTS.DIRTY, { dirty: true, pristine: false });
      } else {
        // Form became pristine - emit both events for completeness
        this.engine.eventService.emit(EVENTS.PRISTINE, { dirty: false, pristine: true });
        this.engine.eventService.emit(EVENTS.DIRTY, { dirty: false, pristine: true });
      }
    }

    // Always update previous state, even on first check
    this._setState('previousFormDirty', currentDirty);
  }

  /**
   * Get isEqual function from options or return default
   * @returns {Function} Comparison function
   * @private
   */
  _getIsEqualFunction() {
    return isFunction(this.engine.options.isEqual)
      ? this.engine.options.isEqual
      : isEqual;
  }
}
