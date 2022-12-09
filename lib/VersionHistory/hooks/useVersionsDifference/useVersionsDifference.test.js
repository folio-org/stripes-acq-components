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
      users: [{ id: clonedAudirEvent.userId, username: clonedAudirEvent.username }],
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
});
