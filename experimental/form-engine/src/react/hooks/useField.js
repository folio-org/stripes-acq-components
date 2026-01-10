/**
 * useField - Hook for field state management
 */

import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
} from 'react';

import {
  DEBOUNCE_DELAYS,
  DEFAULT_SUBSCRIPTION,
  FIELD_ACTIONS,
  VALIDATION_MODES,
} from '../../constants';
import { isFunction } from '../../utils/checks';
import { useFormEngine } from '../FormContext';
import {
  buildOnBlurCommands,
  buildOnChangeCommands,
} from '../strategies/fieldHandlers';
import { buildFieldSubscriptions } from '../strategies/fieldSubscriptions';

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

const getInitialFieldState = (initialArg) => {
  const { name: fieldName, engine: formEngine } = initialArg;

  if (!fieldName) {
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

  return formEngine.getFieldState(fieldName);
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

  const [fieldState, dispatch] = useReducer(
    fieldStateReducer,
    { name, engine },
    getInitialFieldState,
  );

  // Debounced validation function
  const debouncedValidate = useCallback((value, allValues) => {
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
  }, [validate, debounceDelay, engine, name]);

  // Sync field state when engine changes (e.g., when Form reinitializes with new initialValues)
  useEffect(() => {
    if (name) {
      const newFieldState = engine.getFieldState(name);

      dispatch({
        type: FIELD_ACTIONS.UPDATE_MULTIPLE,
        payload: newFieldState,
      });
    }
  }, [engine, name]);

  // Set up subscriptions declaratively
  useEffect(() => {
    const configs = buildFieldSubscriptions(
      name,
      {
        active: subscription.active,
        dirty: subscription.dirty,
        error: subscription.error,
        errors: subscription.errors,
        touched: subscription.touched,
        value: subscription.value,
      },
      validate,
      dispatch,
    );
    const unsubscribers = configs.filter(c => c.enabled).map(c => engine.on(c.event, c.cb));

    // Register validator on mount if provided
    // This ensures validators are available even if onChange hasn't been called yet
    // (e.g., blur validation on a field that hasn't been modified)
    if (name && validate && !engine.hasValidator(name)) {
      engine.registerValidator(name, validate, validateOn);
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

      // Unregister validator to prevent memory leaks and validation on unmounted fields
      if (name && validate && engine.hasValidator(name)) {
        engine.unregisterValidator(name);
      }

      // Remove dirty tracking for this field to prevent memory leaks
      if (name && (subscription.dirty ?? true)) {
        engine.dirtyFeature.removeFieldTracking(name);
      }
    };
  }, [
    engine,
    name,
    /* To it stable the hook depends only on primitive values */
    subscription.active,
    subscription.dirty,
    subscription.error,
    subscription.errors,
    subscription.touched,
    subscription.value,
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
    value: fieldState.value ?? '',
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
