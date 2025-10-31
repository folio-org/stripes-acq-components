/**
 * Form component - Main form wrapper
 */

import React, { useMemo, useCallback, useEffect, useRef } from 'react';
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

  // Stabilize validate function using ref
  const validateRef = useRef(validate);

  validateRef.current = validate;

  // Register and run form-level validation declaratively
  // Use requestIdleCallback for low-priority validation tasks to avoid blocking
  useEffect(() => {
    const currentValidate = validateRef.current;

    if (!currentValidate) return undefined;

    if (!engine.hasValidator('$form')) {
      engine.registerValidator('$form', (_ignored, allValues) => currentValidate(allValues), formValidateOn);
    }

    const runValidation = (mode, delay = 0) => {
      const doValidate = () => {
        engine.validationService
          .validateByMode('$form', null, engine.getValues(), mode, { debounceDelay: delay })
          .then((error) => {
            if (error) {
              engine.setError('$form', error);
            } else {
              engine.clearError('$form');
            }
          });
      };

      // For low-priority validations (CHANGE mode), use requestAnimationFrame for smoother UX
      // This ensures validation runs without blocking the UI thread
      if (mode === VALIDATION_MODES.CHANGE) {
        if (typeof requestAnimationFrame !== 'undefined') {
          requestAnimationFrame(doValidate);
        } else {
          setTimeout(doValidate, 0);
        }
      } else {
        // For BLUR and SUBMIT, validate immediately
        doValidate();
      }
    };

    const strategies = {
      [VALIDATION_MODES.CHANGE]: () => engine.on(
        EVENTS.CHANGE,
        () => runValidation(VALIDATION_MODES.CHANGE, debounceDelay),
      ),
      [VALIDATION_MODES.BLUR]: () => engine.on(EVENTS.BLUR, () => runValidation(VALIDATION_MODES.BLUR)),
      [VALIDATION_MODES.SUBMIT]: () => null,
    };

    const unsubscribe = strategies[formValidateOn]?.();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [engine, formValidateOn, debounceDelay]); // validate handled via ref

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
