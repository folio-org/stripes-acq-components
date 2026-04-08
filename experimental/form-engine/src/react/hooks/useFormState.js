/**
 * useFormState - Hook for subscribing to form-level state changes.
 *
 * Design contract:
 *  - The engine is a persistent, non-React object that never triggers re-renders on its own.
 *  - This hook bridges the gap: it listens to engine events and translates them into React
 *    state updates only for the slice of state the caller has declared interest in.
 *  - Re-renders are suppressed when the event fires but none of the subscribed keys changed.
 */

import {
  startTransition,
  useEffect,
  useReducer,
  useRef,
} from 'react';

import {
  DEFAULT_FORM_SUBSCRIPTION,
  EVENTS,
  FORM_ACTIONS,
  FORM_ENGINE_OPTIONS,
} from '../../constants';
import { isEqual } from '../../utils/checks';
import { useFormEngine } from '../FormContext';

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

/**
 * Minimal reducer — the entire form state snapshot is replaced atomically.
 * Individual keys are never merged; the engine is the single source of truth
 * and `getFormState()` always returns a complete snapshot.
 */
const formStateReducer = (state, action) => {
  if (action.type === FORM_ACTIONS.UPDATE_FORM_STATE) {
    return action.payload;
  }

  return state;
};

// ---------------------------------------------------------------------------
// Change-detection helpers
// ---------------------------------------------------------------------------

/**
 * Returns true if `key` has a different value between the two state snapshots.
 *
 * Fast path: reference equality (`===`) handles primitives and the common case
 * where the engine returns a cached snapshot (same object reference → no change).
 *
 * Slow path: deep equality via `isEqual` handles the case where the engine
 * produced a structurally-equal but differently-referenced object (e.g. after a
 * shallow-clone in ValuesFeature.setByPath).
 */
function hasKeyChanged(key, prevState, nextState) {
  const hasPrev = key in prevState;
  const hasNext = key in nextState;

  // Key appeared or disappeared — always a change
  if (hasPrev !== hasNext) {
    return true;
  }

  if (hasPrev && hasNext) {
    const prev = prevState[key];
    const next = nextState[key];

    return prev !== next && !isEqual(prev, next);
  }

  return false;
}

/**
 * Returns true if at least one key that the caller subscribed to (`subscription[key] === true`)
 * has a different value between the two snapshots.
 *
 * This is the primary guard against unnecessary re-renders:
 * a VALUES event may fire because field "address.city" changed, but a component
 * that only subscribed to `{ dirty: true }` should not re-render.
 */
function hasSubscribedChanges(prevState, nextState, subscription) {
  // CacheService may return the same object reference when nothing changed.
  if (prevState === nextState) {
    return false;
  }

  for (const key in subscription) {
    if (subscription[key] && hasKeyChanged(key, prevState, nextState)) {
      return true;
    }
  }

  return false;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * useFormState — Subscribe to form state updates.
 *
 * The subscription object is a plain map of `{ [stateKey]: boolean }`.
 * Only keys set to `true` are watched; events that don't affect a watched key
 * will not cause a re-render.
 *
 * Subscription changes are handled correctly: each key is listed individually
 * in the effect dep array (as a primitive boolean), so React re-runs the effect
 * — tearing down old listeners and registering new ones — whenever the set of
 * subscribed keys changes.
 *
 * @param {Object} subscription - Fields to subscribe to (e.g. `{ values: true, dirty: true }`)
 * @returns {Object} Full form state snapshot; only updates when subscribed fields change
 *
 * @example
 * // Only re-renders when form becomes dirty or pristine
 * const { dirty } = useFormState({ dirty: true });
 */
export function useFormState(subscription = DEFAULT_FORM_SUBSCRIPTION) {
  const engine = useFormEngine();

  // prevStateRef tracks the last state snapshot we compared against.
  // Initialized inside the lazy-init function below so it shares the exact
  // same object reference as the reducer's initial state — no double call to
  // getFormState() and no risk of a stale baseline on the very first render.
  const prevStateRef = useRef(null);
  const [formState, dispatch] = useReducer(formStateReducer, null, () => {
    const state = engine.getFormState();

    prevStateRef.current = state;

    return state;
  });

  // Write the current subscription to a ref during the render phase — this is
  // a plain object mutation, not a state update, so it never causes a re-render
  // and is always synchronously up to date when any event handler reads it.
  // Using a ref (rather than the subscription object directly in the closure)
  // avoids stale closures without needing to re-register event listeners on
  // every render.
  const subscriptionRef = useRef(subscription);

  subscriptionRef.current = subscription;

  // ---------------------------------------------------------------------------
  // Effect 1: sync state when engine reference changes
  //
  // The engine object is recreated by <Form> only when its core props change
  // (e.g. initialValues identity changes). When that happens the old subscriptions
  // are torn down by Effect 2's cleanup, so we also need to pull a fresh snapshot
  // from the new engine and update both the reducer state and the baseline ref.
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const nextState = engine.getFormState();

    prevStateRef.current = nextState;
    dispatch({ type: FORM_ACTIONS.UPDATE_FORM_STATE, payload: nextState });
  }, [engine]);

  // ---------------------------------------------------------------------------
  // Effect 2: register event listeners based on the current subscription
  //
  // The dep array contains the engine plus every subscription key as a primitive
  // boolean. React therefore re-runs this effect (and re-registers listeners)
  // whenever any of those values changes — matching the behavior of useField,
  // which uses the same pattern.
  //
  // A single `handleChange` handler is used for all events.  Priority splitting
  // (criticalHandler vs lowPriorityHandler + rAF) was the previous approach and
  // introduced a stale-closure bug where prevState was captured synchronously but
  // compared asynchronously after the ref had already moved forward.
  // DIRTY/PRISTINE/VALID events are already deferred naturally (emitted after a
  // microtask by DirtyFeature._flushDirtyChecks), so rAF deferral is redundant.
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const handleChange = () => {
      const nextState = engine.getFormState();
      const prevState = prevStateRef.current;

      // CacheService returns the same object reference when nothing has changed.
      // Skip all further work in that case.
      if (prevState === nextState) {
        return;
      }

      // Always advance the baseline BEFORE dispatching (or deciding not to).
      // This ensures that a subsequent event fired synchronously in the same tick
      // compares against the latest engine state, not a stale snapshot.
      prevStateRef.current = nextState;

      // Bail out early if none of the keys this consumer subscribed to changed.
      // This is the main re-render suppression mechanism.
      if (!hasSubscribedChanges(prevState, nextState, subscriptionRef.current)) {
        return;
      }

      // When React 18 batching is enabled, wrap in startTransition to mark the
      // update as low-priority (deferrable), keeping the UI responsive during
      // rapid typing.  Fall back to a synchronous dispatch on React 17 or when
      // batching is disabled (e.g. in tests).
      if (engine.options[FORM_ENGINE_OPTIONS.ENABLE_BATCHING] && typeof startTransition === 'function') {
        startTransition(() => dispatch({ type: FORM_ACTIONS.UPDATE_FORM_STATE, payload: nextState }));
      } else {
        dispatch({ type: FORM_ACTIONS.UPDATE_FORM_STATE, payload: nextState });
      }
    };

    // Read the current subscription snapshot once to decide which events to
    // register. If a key is false/undefined we skip registration entirely —
    // it's cheaper than registering a no-op handler that hasSubscribedChanges
    // would filter out anyway.
    const sub = subscriptionRef.current;
    const cleanups = [];

    // Critical updates — drive visible form content; dispatch synchronously
    if (sub.values) cleanups.push(engine.on(EVENTS.VALUES, handleChange));
    if (sub.errors) cleanups.push(engine.on(EVENTS.ERROR, handleChange));
    if (sub.touched) cleanups.push(engine.on(EVENTS.TOUCH, handleChange));
    if (sub.active) cleanups.push(engine.on(EVENTS.ACTIVE, handleChange));

    // Submit state — a single SUBMIT event carries both submitting and submitSucceeded
    if (sub.submitting || sub.submitSucceeded) {
      cleanups.push(engine.on(EVENTS.SUBMIT, handleChange));
    }

    // Dirty/pristine — emitted after a microtask (DirtyFeature._flushDirtyChecks),
    // so they arrive asynchronously relative to the triggering field change.
    // Both events share a single handler; hasSubscribedChanges will filter by
    // which key (dirty vs pristine) the caller actually cares about.
    if (sub.dirty || sub.pristine) {
      cleanups.push(
        engine.on(EVENTS.DIRTY, handleChange),
        engine.on(EVENTS.PRISTINE, handleChange),
      );
    }

    // Valid state — emitted by ErrorsFeature after all field errors are cleared
    if (sub.valid) cleanups.push(engine.on(EVENTS.VALID, handleChange));

    // Unregister all listeners when the effect re-runs or the component unmounts.
    // Each entry is the unsubscribe function returned by EventService.on().
    return () => {
      for (const cleanup of cleanups) {
        cleanup();
      }
    };
  }, [
    engine,
    /* Each key is a primitive boolean — React can compare them cheaply and
       re-runs the effect only when the set of active subscriptions changes. */
    subscription.values,
    subscription.errors,
    subscription.touched,
    subscription.active,
    subscription.submitting,
    subscription.submitSucceeded,
    subscription.dirty,
    subscription.pristine,
    subscription.valid,
  ]);

  return formState;
}
