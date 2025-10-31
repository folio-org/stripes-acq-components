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
    case FIELD_ACTIONS.SET_TOUCHED:
      return { ...state, touched: action.payload };
    case FIELD_ACTIONS.SET_ACTIVE:
      return { ...state, active: action.payload };
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
  const [fieldState, dispatch] = useReducer(fieldStateReducer, {
    value: engine.get(name),
    error: name ? engine.getErrors()[name] : undefined,
    touched: engine.isTouched(name),
    active: engine.active === name,
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

    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }, [engine, name, subscription.value, subscription.error, subscription.touched, subscription.active, validate]);

  // Field handlers
  const handlers = useMemo(() => ({
    onChange: (event) => {
      const rawValue = event.target ? event.target.value : event;
      const newValue = isFunction(parse) ? parse(rawValue, name) : rawValue;
      const commands = buildOnChangeCommands({ engine, name, validate, validateOn, debouncedValidate, newValue });

      commands.forEach(run => run());
    },
    onBlur: () => {
      const commands = buildOnBlurCommands({ engine, name, validate, validateOn });

      commands.forEach(run => run());
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
  const meta = useMemo(() => ({
    error: fieldState.error,
    touched: fieldState.touched,
    active: fieldState.active,
  }), [fieldState.error, fieldState.touched, fieldState.active]);

  return {
    value: input.value,
    onChange: input.onChange,
    onBlur: input.onBlur,
    onFocus: input.onFocus,
    error: meta.error,
    touched: meta.touched,
    active: meta.active,
    input,
    meta,
  };
}
