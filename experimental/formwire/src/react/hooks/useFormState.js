/**
 * useFormState - Hook for form state management
 */

import {
  useRef,
  useEffect,
  useReducer,
  useMemo,
} from 'react';

import {
  FORM_ACTIONS,
  DEFAULT_FORM_SUBSCRIPTION,
  EVENTS,
} from '../../constants';
import { useFormEngine } from '../FormContext';
import { shallowEqual } from '../../utils/checks';

// Form state reducer
const formStateReducer = (state, action) => {
  switch (action.type) {
    case FORM_ACTIONS.UPDATE_FORM_STATE: {
      return action.payload;
    }
    default:
      return state;
  }
};

/**
 * Checks if any subscribed fields changed between two states
 */
function hasSubscribedChanges(prevState, nextState, subscription) {
  // Quick reference equality check first
  if (prevState === nextState) {
    return false;
  }

  for (const key in subscription) {
    if (!subscription[key]) {
      // Skip unsubscribed keys
      // eslint-disable-next-line no-continue
      continue;
    }

    const hasPrev = key in prevState;
    const hasNext = key in nextState;

    // If one exists and other doesn't, it's a change
    if (hasPrev !== hasNext) {
      return true;
    }

    // If neither exists, no change
    if (!hasPrev && !hasNext) {
      // eslint-disable-next-line no-continue
      continue;
    }

    const prev = prevState[key];
    const next = nextState[key];

    // Quick reference equality check
    if (prev === next) {
      // eslint-disable-next-line no-continue
      continue;
    }

    // For objects and arrays, do shallow comparison
    if (!shallowEqual(prev, next)) {
      return true;
    }
  }

  return false;
}

/**
 * useFormState - Subscribe to form state updates
 *
 * @param {Object} subscription - Fields to subscribe to (e.g., { values: true, dirty: true })
 * @returns {Object} - Full form state; updates only when subscribed fields change
 */
export function useFormState(subscription = DEFAULT_FORM_SUBSCRIPTION) {
  const engine = useFormEngine();
  const initialState = engine.getFormState();
  const [formState, dispatch] = useReducer(formStateReducer, initialState);

  const stableSubscription = useMemo(() => ({
    values: subscription.values,
    errors: subscription.errors,
    touched: subscription.touched,
    active: subscription.active,
    submitting: subscription.submitting,
    dirty: subscription.dirty,
    pristine: subscription.pristine,
    valid: subscription.valid,
  }), [
    subscription.values,
    subscription.errors,
    subscription.touched,
    subscription.active,
    subscription.submitting,
    subscription.dirty,
    subscription.pristine,
    subscription.valid,
  ]);

  const prevStateRef = useRef(initialState);
  const contextRef = useRef();

  useEffect(() => {
    if (!contextRef.current) {
      contextRef.current = {};
    }

    const unsubscribers = [];

    const handler = () => {
      const nextState = engine.getFormState();
      const prevState = prevStateRef.current;

      // Skip if states are the same reference
      if (prevState === nextState) {
        return;
      }

      // Only update if subscribed fields actually changed
      if (hasSubscribedChanges(prevState, nextState, stableSubscription)) {
        prevStateRef.current = nextState;
        dispatch({ type: FORM_ACTIONS.UPDATE_FORM_STATE, payload: nextState });
      } else {
        // Update ref even if no changes to avoid false positives in future comparisons
        prevStateRef.current = nextState;
      }
    };

    // Subscribe to events based on subscription - each field has its own event
    if (stableSubscription.values) {
      unsubscribers.push(
        engine.on(EVENTS.VALUES, handler, contextRef.current),
      );
    }

    if (stableSubscription.errors) {
      unsubscribers.push(
        engine.on(EVENTS.ERROR, handler, contextRef.current),
      );
    }

    if (stableSubscription.touched) {
      unsubscribers.push(
        engine.on(EVENTS.TOUCH, handler, contextRef.current),
      );
    }

    if (stableSubscription.active) {
      unsubscribers.push(
        engine.on(EVENTS.ACTIVE, handler, contextRef.current),
      );
    }

    if (stableSubscription.submitting) {
      unsubscribers.push(
        engine.on(EVENTS.SUBMITTING, handler, contextRef.current),
      );
    }

    if (stableSubscription.dirty || stableSubscription.pristine) {
      unsubscribers.push(
        engine.on(EVENTS.DIRTY, handler, contextRef.current),
        engine.on(EVENTS.PRISTINE, handler, contextRef.current),
      );
    }

    if (stableSubscription.valid) {
      unsubscribers.push(
        engine.on(EVENTS.VALID, handler, contextRef.current),
      );
    }

    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe());
      if (engine.eventService?.cleanupContext) {
        engine.eventService.cleanupContext(contextRef.current);
      }
    };
  }, [engine, stableSubscription]);

  return formState;
}
