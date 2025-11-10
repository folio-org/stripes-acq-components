/**
 * Form component - Main form wrapper
 */

import React, { useMemo, useCallback, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';

import { LastVisitedContext } from '@folio/stripes-core';

import FormEngine from '../core/FormEngine';
import { FormProvider } from './FormContext';
import { EVENTS, VALIDATION_MODES } from '../constants';
import { isFunction } from '../utils/checks';
import { FormNavigationGuard } from './FormNavigationGuard';

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
  navigationCheck = false,
  navigationGuardProps = {},
  ...rest
}) {
  const history = useHistory();
  
  // Create form engine instance or use provided one
  // Note: Engine is recreated when initialValues object reference changes.
  // This is intentional - if initialValues change, we need to reinitialize the form.
  // To prevent unnecessary recreation, ensure initialValues object reference is stable
  // (e.g., use useMemo or useState in parent component).
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

  const validateRef = useRef(validate);
  const formValidatorRegisteredRef = useRef(false);

  validateRef.current = validate;

  useEffect(() => {
    if (!engine) return undefined;

    if (!validate) {
      if (formValidatorRegisteredRef.current) {
        engine.unregisterValidator('$form');
        formValidatorRegisteredRef.current = false;
      }

      return undefined;
    }

    const validator = (_ignored, allValues) => validate(allValues);

    engine.registerValidator('$form', validator, formValidateOn);
    formValidatorRegisteredRef.current = true;

    return () => {
      engine.unregisterValidator('$form');
      formValidatorRegisteredRef.current = false;
    };
  }, [engine, validate, formValidateOn]);

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

      // Different scheduling strategies per mode for optimal UX
      if (mode === VALIDATION_MODES.CHANGE) {
        // CHANGE: Use requestAnimationFrame to align with browser repaint
        // This ensures validation doesn't block UI during rapid typing
        if (typeof requestAnimationFrame !== 'undefined') {
          requestAnimationFrame(doValidate);
        } else {
          setTimeout(doValidate, 0);
        }
      } else if (mode === VALIDATION_MODES.BLUR) {
        // BLUR: Use queueMicrotask for immediate but non-blocking execution
        // User already left the field, so validation can run quickly without blocking
        if (typeof queueMicrotask !== 'undefined') {
          queueMicrotask(doValidate);
        } else {
          Promise.resolve().then(doValidate);
        }
      } else {
        // SUBMIT: Validate immediately (blocking is acceptable for submit)
        // User expects immediate feedback on submit
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
  }, [engine, formValidateOn, debounceDelay, validate]);

  const handleSubmit = useCallback(async (e) => {
    if (isFunction(e?.preventDefault)) {
      e.preventDefault();
    }

    if (onSubmit) {
      await engine.submit((values) => onSubmit(values, engine.getFormApi()));
    }
  }, [engine, onSubmit]);

  // Render
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
        {navigationCheck && (
          <LastVisitedContext.Consumer>
            {(ctx) => (
              <FormNavigationGuard
              enabled
              history={history}
                {...navigationGuardProps}
                cachePreviousUrl={navigationGuardProps.cachePreviousUrl || ctx?.cachePreviousUrl}
              />
            )}
          </LastVisitedContext.Consumer>
        )}
      </form>
    </FormProvider>
  );
}
