/**
 * useField - Hook for field state management
 */

import { useEffect, useCallback, useMemo, useReducer } from 'react';
import { useFormEngine } from '../FormContext';
import { FIELD_ACTIONS, VALIDATION_MODES, DEFAULT_SUBSCRIPTION, DEBOUNCE_DELAYS } from '../../constants';
import { buildFieldSubscriptions } from '../strategies/fieldSubscriptions';
import { buildOnBlurCommands, buildOnChangeCommands } from '../strategies/fieldHandlers';
import { isFunction } from '../../utils/checks';

// Field state reducer
const fieldStateReducer = (state, action) => {
  switch (action.type) {
    case FIELD_ACTIONS.SET_VALUE:
      return { ...state, value: action.payload };
    case FIELD_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload };
    case FIELD_ACTIONS.SET_ERRORS:
      return { ...state, errors: action.payload };
    case FIELD_ACTIONS.SET_TOUCHED:
      return { ...state, touched: action.payload };
    case FIELD_ACTIONS.SET_ACTIVE:
      return { ...state, active: action.payload };
    case FIELD_ACTIONS.SET_DIRTY:
      return {
        ...state,
        dirty: action.payload,
        pristine: !action.payload,
      };
    case FIELD_ACTIONS.UPDATE_MULTIPLE:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export function useField(name, options = {}) {
  const engine = useFormEngine();
  const {
    validate,
    validateOn = VALIDATION_MODES.BLUR,
    debounceDelay = DEBOUNCE_DELAYS.DEFAULT,
    subscription = DEFAULT_SUBSCRIPTION,
    parse,
  } = options;

  // Get initial state with useReducer
  // Use getFieldState for consistent state initialization from single source of truth
  const [fieldState, dispatch] = useReducer(fieldStateReducer, () => {
    if (!name) {
      return {
        value: undefined,
        error: undefined,
        errors: [],
        touched: false,
        active: false,
        dirty: false,
        pristine: true,
      };
    }

    const engineState = engine.getFieldState(name);

    return {
      value: engineState.value,
      error: engineState.error,
      errors: engineState.errors || [],
      touched: engineState.touched,
      active: engineState.active,
      dirty: engineState.dirty,
      pristine: engineState.pristine,
    };
  });

  // Debounced validation function
  const debouncedValidate = useCallback(
    (value, allValues) => {
      if (!validate) return;

      const mode = VALIDATION_MODES.CHANGE;

      engine.validationService
        .validateByMode(name, value, allValues, mode, { debounceDelay })
        .then(error => {
          if (error) {
            engine.setError(name, error);
          } else {
            engine.clearError(name);
          }
        });
    },
    [validate, debounceDelay, engine, name],
  );

  // Set up subscriptions declaratively
  useEffect(() => {
    const configs = buildFieldSubscriptions(name, subscription, validate, dispatch);
    const unsubscribers = configs.filter(c => c.enabled).map(c => engine.on(c.event, c.cb));

    // Register validator on mount if provided
    // This ensures validators are available even if onChange hasn't been called yet
    // (e.g., blur validation on a field that hasn't been modified)
    if (name && validate && !engine.hasValidator(name)) {
      engine.registerValidator(name, validate, validateOn);
    }

    // Sync initial value from engine if subscription is enabled
    // This ensures Field displays the correct initial value even if subscription hasn't fired yet
    if (name && subscription.value) {
      const currentValue = engine.get(name);

      if (currentValue !== undefined) {
        dispatch({ type: FIELD_ACTIONS.SET_VALUE, payload: currentValue });
      }
    }

    // Initialize dirty tracking for this field if subscription is enabled
    // This ensures DirtyFeature tracks the field from the start and can detect changes
    // Call queueCheck with immediate=true SYNCHRONOUSLY after subscriptions are set up
    // This establishes baseline tracking immediately, ensuring previousDirty is set
    // before any user interactions can occur
    if (name && (subscription.dirty ?? true)) {
      // Synchronous call ensures baseline is established before any changes
      // The event emitted here will synchronize component state with engine state
      engine.dirtyFeature.queueCheck(name, true);
    }

    return () => {
      for (const unsub of unsubscribers) {
        unsub();
      }
    };
  }, [
    engine,
    name,
    subscription,
    validate,
    validateOn,
  ]);

  // Field handlers
  const handlers = useMemo(() => ({
    onChange: (event) => {
      const rawValue = event.target ? event.target.value : event;
      const newValue = isFunction(parse) ? parse(rawValue, name) : rawValue;
      const commands = buildOnChangeCommands({ engine, name, validate, validateOn, debouncedValidate, newValue });

      for (const run of commands) {
        run();
      }
    },
    onBlur: () => {
      const commands = buildOnBlurCommands({ engine, name, validate, validateOn });

      for (const run of commands) {
        run();
      }
    },
    onFocus: () => {
      engine.focus(name);
    },
  }), [engine, name, validate, validateOn, debouncedValidate, parse]);

  // Input props
  const input = useMemo(() => ({
    name,
    value: fieldState.value || '',
    onChange: handlers.onChange,
    onBlur: handlers.onBlur,
    onFocus: handlers.onFocus,
  }), [name, fieldState.value, handlers]);

  // Meta props
  const meta = useMemo(() => {
    const dirty = fieldState.dirty || false;

    return {
      error: fieldState.error,
      errors: fieldState.errors || [],
      touched: fieldState.touched || false,
      active: fieldState.active,
      dirty,
      pristine: !dirty,
    };
  }, [fieldState.error, fieldState.errors, fieldState.touched, fieldState.active, fieldState.dirty]);

  return {
    ...input,
    ...meta,
    input,
    meta,
  };
}
