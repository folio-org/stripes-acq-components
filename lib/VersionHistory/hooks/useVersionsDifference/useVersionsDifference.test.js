import cloneDeep from 'lodash/cloneDeep';
import set from 'lodash/set';
import unset from 'lodash/unset';

import { renderHook } from '@folio/jest-config-stripes/testing-library/react';

import { orderAuditEvent } from '../../../../test/jest/fixtures/orderAuditEvent';
import { FIELD_CHANGE_TYPES } from '../../../utils';
import { useVersionsDifference } from './useVersionsDifference';

describe('useVersionsDifference', () => {
  it('should return info about changed fields for each version (audit event)', async () => {
    const clonedAuditEvent = Object.assign(cloneDeep(orderAuditEvent), { id: 'clonedEventId', username: 'testuser' });

    set(clonedAuditEvent.orderSnapshot, 'acqUnitIds[0]', 'acqUnitId');
    set(clonedAuditEvent.orderSnapshot, 'poNumberPrefix', 'pr');
    unset(clonedAuditEvent.orderSnapshot, 'poNumberSuffix');

    const { result } = renderHook(() => useVersionsDifference([clonedAuditEvent, orderAuditEvent], 'orderSnapshot'));

    expect(result.current).toEqual({
      users: [{ id: clonedAuditEvent.userId, username: clonedAuditEvent.username }],
      versionsMap: {
        [orderAuditEvent.id]: null,
        [clonedAuditEvent.id]: {
          paths: expect.arrayContaining(['acqUnitIds[0]', 'poNumberPrefix', 'poNumberSuffix']),
          changes: expect.arrayContaining([
            { type: FIELD_CHANGE_TYPES.create, path: 'acqUnitIds[0]', values: [undefined, 'acqUnitId'] },
            { type: FIELD_CHANGE_TYPES.update, path: 'poNumberPrefix', values: [orderAuditEvent.orderSnapshot.poNumberPrefix, 'pr'] },
            { type: FIELD_CHANGE_TYPES.delete, path: 'poNumberSuffix', values: [orderAuditEvent.orderSnapshot.poNumberSuffix, undefined] },
          ]),
        },
      },
    });
  });

  it('should return paths for all created or deleted fields with nesting', () => {
    const event = {
      id: 'event-id',
      username: 'testuser',
      snapshot: {
        id: 'test-id',
        notNestingField: 'Hello',
        fieldWithNesting: {
          first: 'first field',
          second: 'second field',
        },
      },
    };

    const clonedEvent = Object.assign(cloneDeep(event), { id: 'clonedEventId', username: 'testuser' });

    set(clonedEvent.snapshot, 'fanotherFeldWithNesting', { foo: 'bar' });
    set(clonedEvent.snapshot, 'notNestingField', 'value');
    unset(clonedEvent.snapshot, 'fieldWithNesting');

    const { result } = renderHook(() => useVersionsDifference([clonedEvent, event], 'snapshot'));

    const { versionsMap } = result.current;

    expect(versionsMap[clonedEvent.id]).toEqual(expect.objectContaining({
      paths: expect.arrayContaining([
        'notNestingField',
        'fanotherFeldWithNesting.foo', // added in the object
        'fieldWithNesting.first', // removed from the object
        'fieldWithNesting.second', // removed from the object
      ]),
    }));
  });
});
