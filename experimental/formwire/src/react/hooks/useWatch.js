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

  useEffect(() => {
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

      if (engine.eventService && engine.eventService.cleanupContext) {
        engine.eventService.cleanupContext(contextRef.current);
      }
    };
  }, [engine, name, selector]);

  return value;
}
