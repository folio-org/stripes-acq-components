/**
 * Field component - High-performance field with debouncing and selective subscriptions
 */

import PropTypes from 'prop-types';
import {
  forwardRef,
  memo,
  useMemo,
  useRef,
} from 'react';

import {
  DEFAULT_SUBSCRIPTION,
  VALIDATION_MODES,
} from '../constants';
import { isFunction } from '../utils/checks';
import { useField } from './hooks';

const Field = memo(forwardRef(({
  children,
  component: Component,
  debounceDelay = 0,
  format,
  formatOnBlur = false,
  name,
  parse,
  subscription = DEFAULT_SUBSCRIPTION,
  validate,
  validateOn = VALIDATION_MODES.BLUR,
  ...rest
}, ref) => {
  // Use optimized field hook with selective subscriptions and debouncing
  const fieldState = useField(name, {
    validate,
    validateOn,
    debounceDelay,
    subscription,
    parse,
  });

  // Stabilize format function using ref
  const formatRef = useRef(format);

  formatRef.current = format;

  const formatValue = useMemo(() => {
    const currentFormat = formatRef.current;

    return isFunction(currentFormat) && (!fieldState.active || !formatOnBlur)
      ? currentFormat(fieldState.value, name)
      : (fieldState.value ?? '');
  }, [fieldState.value, fieldState.active, formatOnBlur, name]);

  const meta = fieldState.meta;

  const componentProps = useMemo(() => ({
    name,
    value: formatValue,
    onChange: fieldState.onChange,
    onBlur: fieldState.onBlur,
    onFocus: fieldState.onFocus,
    error: fieldState.error,
    meta,
    ...rest,
  }), [
    name,
    fieldState.error,
    fieldState.onChange,
    fieldState.onBlur,
    fieldState.onFocus,
    formatValue,
    meta,
    rest,
  ]);

  if (Component) {
    return <Component {...componentProps} ref={ref} />;
  }

  if (isFunction(children)) {
    return children({
      input: {
        name,
        value: formatValue,
        onChange: fieldState.onChange,
        onBlur: fieldState.onBlur,
        onFocus: fieldState.onFocus,
        ref,
      },
      meta,
      value: fieldState.value,
      error: fieldState.error,
    });
  }

  return (
    <input
      {...componentProps}
      ref={ref}
    />
  );
}));

Field.displayName = 'Field';

Field.propTypes = {
  name: PropTypes.string.isRequired,
  component: PropTypes.elementType,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
  ]),
  validate: PropTypes.func,
  validateOn: PropTypes.oneOf(Object.values(VALIDATION_MODES)),
  debounceDelay: PropTypes.number,
  subscription: PropTypes.oneOf(Object.values(DEFAULT_SUBSCRIPTION)),
  format: PropTypes.func,
  formatOnBlur: PropTypes.bool,
  parse: PropTypes.func,
};

export default Field;
