import { EVENTS, FIELD_EVENT_PREFIXES, FIELD_ACTIONS } from '../../constants';

export const buildFieldSubscriptions = (name, subscription, validate, dispatch) => ([
  {
    enabled: subscription.value,
    event: `${FIELD_EVENT_PREFIXES.CHANGE}${name}`,
    cb: (v) => dispatch({ type: FIELD_ACTIONS.SET_VALUE, payload: v })
  },
  {
    enabled: subscription.error,
    event: `${FIELD_EVENT_PREFIXES.ERROR}${name}`,
    cb: (e) => dispatch({ type: FIELD_ACTIONS.SET_ERROR, payload: e }),
  },
  {
    enabled: subscription.touched,
    event: `${FIELD_EVENT_PREFIXES.TOUCH}${name}`,
    cb: () => dispatch({ type: FIELD_ACTIONS.SET_TOUCHED, payload: true }),
  },
  {
    enabled: subscription.active,
    event: EVENTS.FOCUS,
    cb: ({ path }) => dispatch({ type: FIELD_ACTIONS.SET_ACTIVE, payload: path === name }),
  },
  {
    enabled: subscription.active,
    event: EVENTS.BLUR,
    cb: () => dispatch({ type: FIELD_ACTIONS.SET_ACTIVE, payload: false }),
  },
  {
    enabled: !!validate,
    event: EVENTS.VALIDATION,
    cb: ({ errors }) => errors[name] && dispatch({ type: FIELD_ACTIONS.SET_ERROR, payload: errors[name] }),
  },
  {
    enabled: !!validate,
    event: EVENTS.SUBMIT,
    cb: ({ errors }) => errors?.[name] && dispatch({ type: FIELD_ACTIONS.SET_ERROR, payload: errors[name] }),
  },
]);
