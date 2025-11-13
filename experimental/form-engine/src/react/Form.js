/**
 * Form component - Main form wrapper
 */

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';

import { LastVisitedContext } from '@folio/stripes/core';

import {
  EVENTS,
  VALIDATION_MODES,
} from '../constants';
import FormEngine from '../core/FormEngine';
import { isFunction } from '../utils/checks';
import { handleValidationError, scheduleValidation } from '../utils/validationErrorHandler';
import { FormProvider } from './FormContext';
import { FormNavigationGuard } from './FormNavigationGuard';

export default function Form({
  children,
  onSubmit,
  initialValues = {},
  defaultValidateOn = VALIDATION_MODES.BLUR,
  validate, // form-level validator: (allValues) => string | null | Promise<string|null>
  formValidateOn = VALIDATION_MODES.SUBMIT,
  debounceDelay = 0,
  dirtyCheckStrategy,
  engine: providedEngine,
  enableBatching = true,
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

    // Merge engine options passed from props (explicit) with defaults used by Form
    const initOptions = {
      dirtyCheckStrategy,
      enableBatching,
      validateOnBlur: defaultValidateOn === VALIDATION_MODES.BLUR,
    };

    newEngine.init(initialValues, initOptions);

    return newEngine;
  }, [providedEngine, initialValues, defaultValidateOn, dirtyCheckStrategy, enableBatching]);

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
            handleValidationError(error, engine, '$form');
          });
      };

      scheduleValidation(doValidate, mode);
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

Form.propTypes = {
  children: PropTypes.node,
  onSubmit: PropTypes.func,
  initialValues: PropTypes.object,
  defaultValidateOn: PropTypes.oneOf(Object.values(VALIDATION_MODES)),
  validate: PropTypes.func,
  formValidateOn: PropTypes.oneOf(Object.values(VALIDATION_MODES)),
  debounceDelay: PropTypes.number,
  dirtyCheckStrategy: PropTypes.string,
  engine: PropTypes.object,
  enableBatching: PropTypes.bool,
  navigationCheck: PropTypes.bool,
  navigationGuardProps: PropTypes.object,
};
