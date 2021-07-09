import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { renderHook } from '@testing-library/react-hooks';

import { useOkapiKy } from '@folio/stripes/core';

import { useHoldings } from './useHoldings';

const queryClient = new QueryClient();
// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useHoldings', () => {
  it('should return response array', async () => {
    useOkapiKy.mockClear().mockReturnValue({
      get: () => ({
        json: () => ({
          holdings: [{ id: 'holdingId' }],
        }),
      }),
    });

    const { result, waitFor } = renderHook(() => useHoldings('instanceId'), { wrapper });

    await waitFor(() => {
      return Boolean(result.current.data.holdings);
    });

    expect(result.current.data.holdings.length).toEqual(1);
  });
});
