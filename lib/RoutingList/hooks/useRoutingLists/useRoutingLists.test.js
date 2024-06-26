import { renderHook } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from 'react-query';

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
    useOkapiKy.mockClear().mockReturnValue({
      get: jest.fn().mockReturnValue({ json: () => Promise.resolve({ routingLists: [], isFetching: false }) }),
    });
  });

  it('should return routing list', async () => {
    useOkapiKy.mockClear().mockReturnValue({
      get: jest.fn()
        .mockReturnValueOnce({ json: () => Promise.resolve({ routingLists: [routingList] }) })
        .mockReturnValue({ json: () => Promise.resolve({ users: [user] }) }),
    });

    const { result, waitFor } = renderHook(() => useRoutingLists(routingList.poLineId), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.routingLists).toEqual([{
      ...routingList,
      userIds: ['lastName firstName'],
    }]);
  });

  it('should return empty array if `poLineId` is `undefined`', async () => {
    const { result, waitFor } = renderHook(() => useRoutingLists(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.routingLists).toEqual([]);
  });
});
