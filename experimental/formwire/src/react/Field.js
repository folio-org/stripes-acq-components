/**
 * Field component - High-performance field with debouncing and selective subscriptions
 */

import React, { memo, useMemo } from 'react';
import { useField } from './hooks';
import { isFunction } from '../utils/checks';

const Field = memo(({
  name,
  component: Component,
  children,
  validate,
  validateOn = 'blur',
  debounceDelay = 0,
  subscription = { value: true, error: true, touched: true, active: false },
  format,
  formatOnBlur = false,
  ...rest
}) => {
  // Use optimized field hook with selective subscriptions and debouncing
  const fieldState = useField(name, {
    validate,
    validateOn,
    debounceDelay,
    subscription,
    parse: rest.parse,
  });

  // console.log('fieldState', fieldState);

  // Memoize component props to prevent unnecessary re-renders
  const formatValue = useMemo(() => {
    return isFunction(format) && (!fieldState.active || !formatOnBlur)
      ? format(fieldState.value, name)
      : (fieldState.value || '');
  }, [format, fieldState.value, fieldState.active, formatOnBlur, name]);

  const componentProps = useMemo(() => ({
    name,
    value: formatValue,
    onChange: fieldState.onChange,
    onBlur: fieldState.onBlur,
    onFocus: fieldState.onFocus,
    error: fieldState.error,
    meta: {
      error: fieldState.error,
      touched: fieldState.touched,
      active: fieldState.active,
      dirty: fieldState.touched && fieldState.value !== '',
    },
    ...rest,
  }), [name, fieldState, rest, formatValue]);

  // Render with component
  if (Component) {
    return <Component {...componentProps} />;
  }

  // Render with children function
  if (isFunction(children)) {
    return children({
      input: {
        name,
        value: formatValue,
        onChange: fieldState.onChange,
        onBlur: fieldState.onBlur,
        onFocus: fieldState.onFocus,
      },
      meta: {
        error: fieldState.error,
        touched: fieldState.touched,
        active: fieldState.active,
        dirty: fieldState.touched && fieldState.value !== '',
      },
      value: fieldState.value,
      error: fieldState.error,
    });
  }

  // Default input
  return (
    <input
      {...componentProps}
    />
  );
});

Field.displayName = 'Field';

export default Field;
