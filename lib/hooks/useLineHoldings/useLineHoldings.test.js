import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { renderHook } from '@testing-library/react-hooks';

import { useOkapiKy } from '@folio/stripes/core';

import { useLineHoldings } from './useLineHoldings';

const queryClient = new QueryClient();
// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useLineHoldings', () => {
  it('should return response array', async () => {
    useOkapiKy.mockClear().mockReturnValue({
      get: () => ({
        json: () => ({
          holdings: [{ id: 'holdingId' }],
        }),
      }),
    });

    const { result, waitFor } = renderHook(() => useLineHoldings(['001']), { wrapper });

    await waitFor(() => {
      return Boolean(result.current.data[0].holdings);
    });

    expect(result.current.data[0].holdings.length).toEqual(1);
  });
});
