import { renderHook } from '@testing-library/react-hooks';
import { cloneDeep, set, unset } from 'lodash';

import { orderAuditEvent } from '../../../../test/jest/fixtures/orderAuditEvent';
import { FIELD_CHANGE_TYPES } from '../../../utils';
import { useVersionsDifference } from './useVersionsDifference';

describe('useVersionsDifference', () => {
  it('should return info about changed fields for each version (audit event)', async () => {
    const clonedAudirEvent = Object.assign(cloneDeep(orderAuditEvent), { id: 'clonedEventId', username: 'testuser' });

    set(clonedAudirEvent.orderSnapshot, 'acqUnitIds[0]', 'acqUnitId');
    set(clonedAudirEvent.orderSnapshot, 'poNumberPrefix', 'pr');
    unset(clonedAudirEvent.orderSnapshot, 'poNumberSuffix');

    const { result } = renderHook(() => useVersionsDifference([clonedAudirEvent, orderAuditEvent], 'orderSnapshot'));

    expect(result.current).toEqual({
      versionsMap: {
        [orderAuditEvent.id]: null,
        [clonedAudirEvent.id]: {
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
