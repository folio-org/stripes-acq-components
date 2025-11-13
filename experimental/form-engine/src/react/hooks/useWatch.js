import {
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';

import { FIELD_EVENT_PREFIXES, EVENTS } from '../../constants';
import { useFormEngine } from '../FormContext';

/**
 * Watch a field value and re-render when it changes
 * @param {string} name - Field path to watch
 * @param {Object} options - Watch options
 * @param {Function} options.selector - Optional selector function to transform the value
 * @param {boolean} options.bubble - If true, also watches nested field changes (default: false)
 * @returns {*} Current field value (or transformed value if selector provided)
 *
 * @example
 * // Watch specific field
 * const email = useWatch('email');
 *
 * @example
 * // Watch with selector
 * const emailLength = useWatch('email', { selector: (v) => v?.length || 0 });
 *
 * @example
 * // Watch array and update when ANY nested field changes
 * const orders = useWatch('orders', { bubble: true });
 */
export function useWatch(name, options = {}) {
  const engine = useFormEngine();

  const { selector = null, bubble = false } = options;

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
        { bubble },
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
  }, [engine, name, getCurrentValue, bubble]);

  return value;
}
