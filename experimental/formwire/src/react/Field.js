/**
 * Field component - High-performance field with debouncing and selective subscriptions
 */

import React, { memo, useMemo, useRef, forwardRef } from 'react';
import { useField } from './hooks';
import { isFunction } from '../utils/checks';

const Field = memo(forwardRef(({
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

  // Memoize component props to prevent unnecessary re-renders
  // Use ref for format to avoid recreating on every render
  const formatValue = useMemo(() => {
    const currentFormat = formatRef.current;

    return isFunction(currentFormat) && (!fieldState.active || !formatOnBlur)
      ? currentFormat(fieldState.value, name)
      : (fieldState.value || '');
  }, [fieldState.value, fieldState.active, formatOnBlur, name]); // format handled via ref

  // Component props - handlers from useField are stable (from ref), so we can safely include them
  // rest is intentionally excluded to avoid unnecessary re-renders when parent re-renders
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
  }), [
    name,
    fieldState.error,
    fieldState.touched,
    fieldState.active,
    fieldState.value,
    formatValue,
    fieldState.onChange,
    fieldState.onBlur,
    fieldState.onFocus,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    rest, // rest intentionally excluded - usually contains stable props
  ]);

  // Render with component
  if (Component) {
    // If Component accepts ref (class component or forwardRef), pass it
    // For functional components that need ref, they should use forwardRef
    return <Component {...componentProps} ref={ref} />;
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
        ref, // Pass ref in input object for children function
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

  // Default input - pass ref directly
  return (
    <input
      {...componentProps}
      ref={ref}
    />
  );
}));

Field.displayName = 'Field';

export default Field;
