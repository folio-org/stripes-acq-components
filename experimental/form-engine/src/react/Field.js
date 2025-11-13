/**
 * Field component - High-performance field with debouncing and selective subscriptions
 */

import React, { memo, useMemo, useRef, forwardRef } from 'react';
import { useField } from './hooks';
import { DEFAULT_SUBSCRIPTION } from '../constants';
import { isFunction } from '../utils/checks';

const Field = memo(forwardRef(({
  name,
  component: Component,
  children,
  validate,
  validateOn = 'blur',
  debounceDelay = 0,
  subscription = DEFAULT_SUBSCRIPTION,
  format,
  formatOnBlur = false,
  ...rest
}, ref) => {
  // Use optimized field hook with selective subscriptions and debouncing
  const fieldState = useField(name, {
    validate,
    validateOn,
    debounceDelay,
    subscription,
    parse: rest.parse,
  });

  // Stabilize format function using ref
  const formatRef = useRef(format);

  formatRef.current = format;

  const formatValue = useMemo(() => {
    const currentFormat = formatRef.current;

    return isFunction(currentFormat) && (!fieldState.active || !formatOnBlur)
      ? currentFormat(fieldState.value, name)
      : (fieldState.value || '');
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

export default Field;
