/**
 * useFormState - Hook for form state management
 */

import { useEffect, useReducer } from 'react';
import { useFormEngine } from '../FormContext';
import { FORM_ACTIONS, DEFAULT_FORM_SUBSCRIPTION, EVENTS } from '../../constants';

// Form state reducer
const formStateReducer = (state, action) => {
  switch (action.type) {
    case FORM_ACTIONS.UPDATE_FORM_STATE:
      return action.payload;
    default:
      return state;
  }
};

export function useFormState(subscription = DEFAULT_FORM_SUBSCRIPTION) {
  const engine = useFormEngine();
  const [formState, dispatch] = useReducer(formStateReducer, engine.getFormState());

  // Set up subscriptions
  useEffect(() => {
    const contextRef = { current: {} };
    const unsubscribers = [];

    if (subscription.values) {
      unsubscribers.push(
        engine.on(EVENTS.CHANGE, () => {
          dispatch({ type: FORM_ACTIONS.UPDATE_FORM_STATE, payload: engine.getFormState() });
        }, contextRef.current),
      );
    }

    if (subscription.errors) {
      unsubscribers.push(
        engine.on(EVENTS.ERROR, () => {
          dispatch({ type: FORM_ACTIONS.UPDATE_FORM_STATE, payload: engine.getFormState() });
        }, contextRef.current),
      );
    }

    if (subscription.touched) {
      unsubscribers.push(
        engine.on(EVENTS.TOUCH, () => {
          dispatch({ type: FORM_ACTIONS.UPDATE_FORM_STATE, payload: engine.getFormState() });
        }, contextRef.current),
      );
    }

    if (subscription.active) {
      unsubscribers.push(
        engine.on(EVENTS.FOCUS, () => {
          dispatch({ type: FORM_ACTIONS.UPDATE_FORM_STATE, payload: engine.getFormState() });
        }, contextRef.current),
      );
      unsubscribers.push(
        engine.on(EVENTS.BLUR, () => {
          dispatch({ type: FORM_ACTIONS.UPDATE_FORM_STATE, payload: engine.getFormState() });
        }, contextRef.current),
      );
    }

    if (subscription.submitting) {
      unsubscribers.push(
        engine.on(EVENTS.SUBMIT, () => {
          dispatch({ type: FORM_ACTIONS.UPDATE_FORM_STATE, payload: engine.getFormState() });
        }, contextRef.current),
      );
    }

    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe());
      if (engine.eventService && engine.eventService.cleanupContext) {
        engine.eventService.cleanupContext(contextRef.current);
      }
    };
  }, [engine, subscription]);

  return formState;
}
