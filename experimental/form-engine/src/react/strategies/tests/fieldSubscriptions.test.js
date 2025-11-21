/* Developed collaboratively using AI (Cursor) */

import {
  FIELD_ACTIONS,
  FIELD_EVENT_PREFIXES,
} from '../../../constants';
import { buildFieldSubscriptions } from '../fieldSubscriptions';

describe('fieldSubscriptions', () => {
  it('should build field subscriptions', () => {
    const dispatch = jest.fn();
    const subscriptions = buildFieldSubscriptions(
      'email',
      { value: true, error: true, touched: true, active: true, dirty: true },
      jest.fn(),
      dispatch,
    );

    expect(subscriptions.length).toBeGreaterThan(0);
    expect(subscriptions.some(s => s.event === `${FIELD_EVENT_PREFIXES.CHANGE}email`)).toBe(true);
  });

  it('should dispatch on value change', () => {
    const dispatch = jest.fn();
    const subscriptions = buildFieldSubscriptions(
      'email',
      { value: true },
      null,
      dispatch,
    );
    const sub = subscriptions.find(s => s.event === `${FIELD_EVENT_PREFIXES.CHANGE}email`);

    sub.cb('test');
    expect(dispatch).toHaveBeenCalledWith({ type: FIELD_ACTIONS.SET_VALUE, payload: 'test' });
  });

  it('should handle error subscriptions', () => {
    const dispatch = jest.fn();
    const subscriptions = buildFieldSubscriptions(
      'email',
      { error: true },
      jest.fn(),
      dispatch,
    );
    const sub = subscriptions.find(s => s.event === `${FIELD_EVENT_PREFIXES.ERROR}email`);

    sub.cb('Error message');
    expect(dispatch).toHaveBeenCalledWith({ type: FIELD_ACTIONS.SET_ERROR, payload: 'Error message' });
  });

  it('should handle dirty subscriptions', () => {
    const dispatch = jest.fn();
    const subscriptions = buildFieldSubscriptions(
      'email',
      { dirty: true },
      null,
      dispatch,
    );
    const sub = subscriptions.find(s => s.event === `${FIELD_EVENT_PREFIXES.DIRTY}email`);

    sub.cb({ dirty: true });
    expect(dispatch).toHaveBeenCalledWith({ type: FIELD_ACTIONS.SET_DIRTY, payload: true });
  });
});
