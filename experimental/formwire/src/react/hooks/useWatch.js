/**
 * useWatch - Hook for watching specific field values
 */

import { useState, useEffect, useRef } from 'react';
import { useFormEngine } from '../FormContext';
import { FIELD_EVENT_PREFIXES } from '../../constants';

export function useWatch(name, selector = null) {
  const engine = useFormEngine();
  const [value, setValue] = useState(() => {
    const fieldValue = engine.get(name);

    return selector ? selector(fieldValue) : fieldValue;
  });

  useEffect(() => {
    const contextRef = { current: null };
    // Stable context object for this hook instance
    if (!contextRef.current) contextRef.current = {};

    const unsubscribe = engine.on(
      `${FIELD_EVENT_PREFIXES.CHANGE}${name}`,
      (newValue) => {
        setValue(selector ? selector(newValue) : newValue);
      },
      contextRef.current,
    );

    return () => {
      unsubscribe();
      // Best-effort cleanup for any missed subscriptions under this context
      if (engine.eventService && engine.eventService.cleanupContext) {
        engine.eventService.cleanupContext(contextRef.current);
      }
    };
  }, [engine, name, selector]);

  return value;
}
