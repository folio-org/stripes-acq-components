import {
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';

import { FIELD_EVENT_PREFIXES, EVENTS } from '../../constants';
import { useFormEngine } from '../FormContext';

export function useWatch(name, selector = null) {
  const engine = useFormEngine();

  const selectorRef = useRef(selector);

  selectorRef.current = selector;

  const getCurrentValue = useCallback(() => {
    const engineNotReady = !engine || (typeof engine.isReady === 'function' && !engine.isReady());

    if (engineNotReady) {
      const initialValue = undefined;
      const currentSelector = selectorRef.current;

      return currentSelector ? currentSelector(initialValue) : initialValue;
    }

    const fieldValue = engine.get(name);
    const currentSelector = selectorRef.current;

    return currentSelector ? currentSelector(fieldValue) : fieldValue;
  }, [engine, name]);

  const [value, setValue] = useState(() => getCurrentValue());

  // Recalculate value when selector changes
  useEffect(() => {
    setValue(getCurrentValue());
  }, [getCurrentValue]);

  const contextRef = useRef();

  useEffect(() => {
    if (!contextRef.current) {
      contextRef.current = {};
    }

    if (!engine || !engine.on) {
      return undefined;
    }

    let unsubscribeChange = null;

    const subscribeToChanges = () => {
      if (unsubscribeChange) return;

      unsubscribeChange = engine.on(
        `${FIELD_EVENT_PREFIXES.CHANGE}${name}`,
        (newValue) => {
          const currentSelector = selectorRef.current;

          setValue(currentSelector ? currentSelector(newValue) : newValue);
        },
        contextRef.current,
      );
    };

    const engineNotReady = typeof engine.isReady === 'function' && !engine.isReady();

    if (!engineNotReady) {
      subscribeToChanges();
    } else {
      const initUnsubscribe = engine.on(
        EVENTS.INIT,
        () => {
          setValue(getCurrentValue());
          subscribeToChanges();
        },
        contextRef.current,
      );

      return () => {
        if (initUnsubscribe) initUnsubscribe();
        if (unsubscribeChange) unsubscribeChange();

        if (engine.eventService && engine.eventService.cleanupContext) {
          engine.eventService.cleanupContext(contextRef.current);
        }
      };
    }

    return () => {
      if (unsubscribeChange) unsubscribeChange();

      if (engine.eventService && engine.eventService.cleanupContext) {
        engine.eventService.cleanupContext(contextRef.current);
      }
    };
  }, [engine, name, getCurrentValue]);

  return value;
}
