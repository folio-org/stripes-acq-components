/* Developed collaboratively using AI (Chat GPT) */

import { useIntl } from 'react-intl';

import { renderHook } from '@folio/jest-config-stripes/testing-library/react';
import { getFullName } from '@folio/stripes/util';

import { useVersionHistoryValueResolvers } from './useVersionHistoryValueResolvers';

jest.mock('react-intl', () => ({
  useIntl: jest.fn(),
}));

jest.mock('@folio/stripes/util', () => ({
  getFullName: jest.fn(),
}));

describe('useVersionHistoryValueResolvers', () => {
  let intlMock;

  beforeEach(() => {
    intlMock = {
      formatMessage: jest.fn(({ id }) => id),
    };
    useIntl.mockReturnValue(intlMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return object property by ID if ID and property exist in the map', () => {
    const { result } = renderHook(() => useVersionHistoryValueResolvers());

    const obj = {
      id1: { property1: 'value1', property2: 'value2' },
      id2: { property1: 'value3' },
    };

    const value = result.current.getObjectPropertyById('id1', 'property1', obj);

    expect(value).toBe('value1');
  });

  it('should return null when ID is not provided', () => {
    const { result } = renderHook(() => useVersionHistoryValueResolvers());
    const obj = { id1: { property1: 'value1' } };

    const value = result.current.getObjectPropertyById(null, 'property1', obj);

    expect(value).toBeNull();
  });

  it('should return deletedRecordLabel when ID is not found in the object', () => {
    const { result } = renderHook(() => useVersionHistoryValueResolvers());

    const obj = { id1: { property1: 'value1' } };
    const value = result.current.getObjectPropertyById('id2', 'property1', obj);

    expect(value).toBe('stripes-acq-components.versionHistory.deletedRecord');
  });

  it('should return null when ID is not provided for getUserFullNameById', () => {
    const { result } = renderHook(() => useVersionHistoryValueResolvers());
    const usersMap = { user1: { firstName: 'John', lastName: 'Doe' } };

    const value = result.current.getUserFullNameById(null, usersMap);

    expect(value).toBeNull();
  });

  it('should return user full name by ID using the users map', () => {
    getFullName.mockReturnValue('John Doe');
    const { result } = renderHook(() => useVersionHistoryValueResolvers());

    const usersMap = { user1: { firstName: 'John', lastName: 'Doe' } };
    const value = result.current.getUserFullNameById('user1', usersMap);

    expect(getFullName).toHaveBeenCalledWith(usersMap.user1);
    expect(value).toBe('John Doe');
  });

  it('should return deletedRecordLabel when ID is not found in the users map', () => {
    const { result } = renderHook(() => useVersionHistoryValueResolvers());

    const usersMap = { user1: { firstName: 'John', lastName: 'Doe' } };
    const value = result.current.getUserFullNameById('user2', usersMap);

    expect(value).toBe('stripes-acq-components.versionHistory.deletedRecord');
  });
});
