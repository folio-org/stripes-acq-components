import { EVENTS, FIELD_EVENT_PREFIXES, FIELD_ACTIONS } from '../../constants';
import { isDefined } from '../../utils/checks';

/**
 * Create error handler for validation and submit events
 * @param {string} name - Field name
 * @param {Function} dispatch - Dispatch function
 * @returns {Function} Error handler
 */
const createErrorHandler = (name, dispatch) => ({ errors }) => {
  if (isDefined(errors) && isDefined(errors[name])) {
    dispatch({ type: FIELD_ACTIONS.SET_ERROR, payload: errors[name] });
  }
};

export const buildFieldSubscriptions = (name, subscription, validate, dispatch, engine) => {
  // Wrap dispatch to track React re-renders
  const trackedDispatch = (action) => {
    if (engine) {
      engine.trackRender();
    }
    dispatch(action);
  };

  const errorHandler = validate ? createErrorHandler(name, trackedDispatch) : null;

  return [
    {
      enabled: subscription.value,
      event: `${FIELD_EVENT_PREFIXES.CHANGE}${name}`,
      cb: (v) => trackedDispatch({ type: FIELD_ACTIONS.SET_VALUE, payload: v }),
    },
    {
      enabled: subscription.error,
      event: `${FIELD_EVENT_PREFIXES.ERROR}${name}`,
      cb: (e) => trackedDispatch({ type: FIELD_ACTIONS.SET_ERROR, payload: e }),
    },
    {
      enabled: subscription.touched,
      event: `${FIELD_EVENT_PREFIXES.TOUCH}${name}`,
      cb: () => trackedDispatch({ type: FIELD_ACTIONS.SET_TOUCHED, payload: true }),
    },
    {
      enabled: subscription.active,
      event: EVENTS.FOCUS,
      cb: ({ path }) => trackedDispatch({ type: FIELD_ACTIONS.SET_ACTIVE, payload: path === name }),
    },
    {
      enabled: subscription.active,
      event: EVENTS.BLUR,
      cb: () => trackedDispatch({ type: FIELD_ACTIONS.SET_ACTIVE, payload: false }),
    },
    {
      enabled: subscription.dirty ?? true,
      event: `${FIELD_EVENT_PREFIXES.DIRTY}${name}`,
      cb: ({ dirty }) => trackedDispatch({ type: FIELD_ACTIONS.SET_DIRTY, payload: dirty }),
    },
    {
      enabled: !!validate,
      event: EVENTS.VALIDATION,
      cb: errorHandler,
    },
    {
      enabled: !!validate,
      event: EVENTS.SUBMIT,
      cb: errorHandler,
    },
  ];
};
