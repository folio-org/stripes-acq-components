import {
  useState,
  useEffect,
  useRef,
} from 'react';

import { FIELD_EVENT_PREFIXES } from '../../constants';
import { useFormEngine } from '../FormContext';

export function useWatch(name, selector = null) {
  const engine = useFormEngine();
  const [value, setValue] = useState(() => {
    const fieldValue = engine.get(name);

    return selector ? selector(fieldValue) : fieldValue;
  });

  const contextRef = useRef();
  // Stabilize selector using ref to avoid recreating subscription
  // If selector is in dependency array, subscription would recreate on every selector change
  // Using ref allows selector to change without recreating subscription
  const selectorRef = useRef(selector);

  selectorRef.current = selector;

  useEffect(() => {
    // Create context object once for cleanup tracking
    if (!contextRef.current) {
      contextRef.current = {};
    }

    const unsubscribe = engine.on(
      `${FIELD_EVENT_PREFIXES.CHANGE}${name}`,
      (newValue) => {
        // Read current selector from ref - this ensures we always use latest selector
        // even if it changed after subscription was created
        const currentSelector = selectorRef.current;

        setValue(currentSelector ? currentSelector(newValue) : newValue);
      },
      contextRef.current,
    );

    return () => {
      unsubscribe();

      if (engine.eventService && engine.eventService.cleanupContext) {
        engine.eventService.cleanupContext(contextRef.current);
      }
    };
  }, [engine, name]); // Only engine and name - selector handled via ref

  return value;
}
