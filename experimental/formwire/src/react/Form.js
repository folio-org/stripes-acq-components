/**
 * Form component - Main form wrapper
 */

import React, { useMemo, useCallback, useEffect } from 'react';
import FormEngine from '../core/FormEngine';
import { FormProvider } from './FormContext';
import { EVENTS, VALIDATION_MODES } from '../constants';
import { isFunction } from '../utils/checks';

export default function Form({
  children,
  onSubmit,
  initialValues = {},
  defaultValidateOn = 'blur',
  validate, // form-level validator: (allValues) => string | null | Promise<string|null>
  formValidateOn = 'submit', // 'change' | 'blur' | 'submit' (form-level)
  debounceDelay = 0,
  dirtyCheckStrategy,
  engine: providedEngine,
  ...rest
}) {
  // Create form engine instance or use provided one
  const engine = useMemo(() => {
    if (providedEngine) {
      return providedEngine;
    }

    const newEngine = new FormEngine();

    newEngine.init(initialValues, {
      validateOnBlur: defaultValidateOn === 'blur',
      dirtyCheckStrategy,
    });

    return newEngine;
  }, [providedEngine, initialValues, defaultValidateOn, dirtyCheckStrategy]);

  // Register and run form-level validation declaratively
  useEffect(() => {
    if (!validate) return undefined;

    if (!engine.hasValidator('$form')) {
      engine.registerValidator('$form', (_ignored, allValues) => validate(allValues), formValidateOn);
    }

    const strategies = {
      [VALIDATION_MODES.CHANGE]: () => {
        // reuse validation service strategy, including debounce if passed
        return engine.on(EVENTS.CHANGE, () => {
          engine.validationService
            .validateByMode('$form', null, engine.getValues(), VALIDATION_MODES.CHANGE, { debounceDelay })
            .then((error) => {
              if (error) engine.setError('$form', error); else engine.clearError('$form');
            });
        });
      },
      [VALIDATION_MODES.BLUR]: () => engine.on(EVENTS.BLUR, () => {
        engine.validationService
          .validateByMode('$form', null, engine.getValues(), VALIDATION_MODES.BLUR)
          .then((error) => {
            if (error) engine.setError('$form', error); else engine.clearError('$form');
          });
      }),
      [VALIDATION_MODES.SUBMIT]: () => null,
    };

    const unsubscribe = strategies[formValidateOn]?.();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [engine, validate, formValidateOn, debounceDelay]);

  // Handle form submission
  const handleSubmit = useCallback(async (e) => {
    if (isFunction(e?.preventDefault)) {
      e.preventDefault();
    }

    if (onSubmit) {
      const result = await engine.submit((values) => onSubmit(values, engine.getFormApi()));

      if (!result.success) {
        // Form submission failed - errors are handled by FormEngine
        // Could emit custom event or call error callback here
      }
    }
  }, [engine, onSubmit]);

  return (
    <FormProvider
      engine={engine}
      defaultValidateOn={defaultValidateOn}
    >
      <form
        {...rest}
        onSubmit={handleSubmit}
      >
        {children}
      </form>
    </FormProvider>
  );
}
