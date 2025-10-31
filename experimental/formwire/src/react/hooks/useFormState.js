/**
 * useFormState - Hook for form state management
 */

import {
  useRef,
  useEffect,
  useReducer,
  startTransition,
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

  // Stabilize subscription using ref to avoid recreating on every render
  const subscriptionRef = useRef(subscription);

  subscriptionRef.current = subscription;

  // Use ref for stable subscription to avoid useEffect dependency on subscription object
  const stableSubscriptionRef = useRef({
    values: subscription.values,
    errors: subscription.errors,
    touched: subscription.touched,
    active: subscription.active,
    submitting: subscription.submitting,
    dirty: subscription.dirty,
    pristine: subscription.pristine,
    valid: subscription.valid,
  });

  // Update ref synchronously but only when values change (no useEffect needed - ref updates are cheap)
  const currentSubscription = subscriptionRef.current;

  if (
    currentSubscription.values !== stableSubscriptionRef.current.values ||
    currentSubscription.errors !== stableSubscriptionRef.current.errors ||
    currentSubscription.touched !== stableSubscriptionRef.current.touched ||
    currentSubscription.active !== stableSubscriptionRef.current.active ||
    currentSubscription.submitting !== stableSubscriptionRef.current.submitting ||
    currentSubscription.dirty !== stableSubscriptionRef.current.dirty ||
    currentSubscription.pristine !== stableSubscriptionRef.current.pristine ||
    currentSubscription.valid !== stableSubscriptionRef.current.valid
  ) {
    stableSubscriptionRef.current = {
      values: currentSubscription.values,
      errors: currentSubscription.errors,
      touched: currentSubscription.touched,
      active: currentSubscription.active,
      submitting: currentSubscription.submitting,
      dirty: currentSubscription.dirty,
      pristine: currentSubscription.pristine,
      valid: currentSubscription.valid,
    };
  }

  const prevStateRef = useRef(initialState);
  const contextRef = useRef();

  useEffect(() => {
    if (!contextRef.current) {
      contextRef.current = {};
    }

    const unsubscribers = [];

    // Separate handlers for critical vs low-priority updates
    // Critical handler - synchronous for immediate UI feedback (values, errors)
    const criticalHandler = () => {
      const nextState = engine.getFormState();
      const prevState = prevStateRef.current;

      // Skip if states are the same reference
      if (prevState === nextState) {
        return;
      }

      // Use current subscription from ref
      const activeSubscription = stableSubscriptionRef.current;

      // Only update if subscribed fields actually changed
      if (hasSubscribedChanges(prevState, nextState, activeSubscription)) {
        prevStateRef.current = nextState;
        // Use startTransition for non-urgent updates to keep UI responsive
        startTransition(() => {
          dispatch({ type: FORM_ACTIONS.UPDATE_FORM_STATE, payload: nextState });
        });
      } else {
        // Update ref even if no changes to avoid false positives in future comparisons
        prevStateRef.current = nextState;
      }
    };

    // Low-priority handler for non-critical updates (dirty, pristine, valid)
    // Uses requestAnimationFrame + startTransition for smooth async updates
    const lowPriorityHandler = () => {
      const nextState = engine.getFormState();
      const prevState = prevStateRef.current;

      // Skip if states are the same reference
      if (prevState === nextState) {
        return;
      }

      // Use current subscription from ref
      const activeSubscription = stableSubscriptionRef.current;

      const processUpdate = () => {
        // Only update if subscribed fields actually changed
        if (hasSubscribedChanges(prevState, nextState, activeSubscription)) {
          prevStateRef.current = nextState;
          // Use startTransition for low-priority updates
          startTransition(() => {
            dispatch({ type: FORM_ACTIONS.UPDATE_FORM_STATE, payload: nextState });
          });
        } else {
          // Update ref even if no changes to avoid false positives in future comparisons
          prevStateRef.current = nextState;
        }
      };

      // Use requestAnimationFrame for smooth UI updates without blocking
      if (typeof requestAnimationFrame !== 'undefined') {
        requestAnimationFrame(processUpdate);
      } else {
        // Fallback: use setTimeout for async but fast update
        setTimeout(processUpdate, 0);
      }
    };

    // Get current subscription from ref for subscriptions setup
    const activeSubscription = stableSubscriptionRef.current;

    // Subscribe to events based on subscription - use different handlers for critical vs low-priority
    // Critical updates (values, errors) - synchronous for immediate UI feedback
    if (activeSubscription.values) {
      unsubscribers.push(
        engine.on(EVENTS.VALUES, criticalHandler, contextRef.current),
      );
    }

    if (activeSubscription.errors) {
      unsubscribers.push(
        engine.on(EVENTS.ERROR, criticalHandler, contextRef.current),
      );
    }

    // Medium priority (touched, active, submitting) - synchronous but less critical
    if (activeSubscription.touched) {
      unsubscribers.push(
        engine.on(EVENTS.TOUCH, criticalHandler, contextRef.current),
      );
    }

    if (activeSubscription.active) {
      unsubscribers.push(
        engine.on(EVENTS.ACTIVE, criticalHandler, contextRef.current),
      );
    }

    // Subscribe to SUBMIT event if submitting state is needed
    // SUBMIT event already contains submitting state in payload
    if (activeSubscription.submitting) {
      unsubscribers.push(
        engine.on(EVENTS.SUBMIT, criticalHandler, contextRef.current),
      );
    }

    // Low priority (dirty, pristine, valid) - async to avoid blocking
    if (activeSubscription.dirty || activeSubscription.pristine) {
      unsubscribers.push(
        engine.on(EVENTS.DIRTY, lowPriorityHandler, contextRef.current),
        engine.on(EVENTS.PRISTINE, lowPriorityHandler, contextRef.current),
      );
    }

    if (activeSubscription.valid) {
      unsubscribers.push(
        engine.on(EVENTS.VALID, lowPriorityHandler, contextRef.current),
      );
    }

    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe());
      if (engine.eventService?.cleanupContext) {
        engine.eventService.cleanupContext(contextRef.current);
      }
    };
  }, [engine]); // Only engine as dependency - subscription handled via ref

  return formState;
}
