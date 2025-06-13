import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { useRoutingLists } from './useRoutingLists';

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const routingList = {
  id: '1',
  userIds: ['1'],
  notes: 'notes',
  poLineId: '1',
};

const user = {
  id: '1',
  personal: {
    firstName: 'firstName',
    lastName: 'lastName',
    middleName: 'middleName',
  },
};

describe('useRoutingLists', () => {
  beforeEach(() => {
    useOkapiKy.mockReturnValue({
      get: jest.fn().mockReturnValue({ json: () => Promise.resolve({ routingLists: [], isFetching: false }) }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return routing list', async () => {
    useOkapiKy.mockReturnValue({
      get: jest.fn()
        .mockReturnValueOnce({ json: () => Promise.resolve({ routingLists: [routingList] }) })
        .mockReturnValue({ json: () => Promise.resolve({ users: [user] }) }),
    });

    const { result } = renderHook(() => useRoutingLists(routingList.poLineId), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.routingLists).toEqual([{
      ...routingList,
      userIds: ['lastName firstName'],
    }]);
  });

  it('should return empty array if `poLineId` is `undefined`', async () => {
    const { result } = renderHook(() => useRoutingLists(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.routingLists).toEqual([]);
  });
});
