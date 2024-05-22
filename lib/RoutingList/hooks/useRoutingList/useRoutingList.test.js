import { renderHook } from '@testing-library/react-hooks';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { useRoutingList } from './useRoutingList';

const routingList = {
  id: '9465105a-e8a1-470c-9817-142d33bc4fcd',
  notes: 'test',
  name: 'test',
  userIds: ['test'],
};

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useRoutingList', () => {
  it('should fetch routing list configuration', async () => {
    useOkapiKy
      .mockClear()
      .mockReturnValue({
        get: () => ({
          json: () => routingList,
        }),
      });

    const { result, waitFor } = renderHook(() => useRoutingList(routingList.userIds), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.routingList).toEqual(routingList);
  });
});
