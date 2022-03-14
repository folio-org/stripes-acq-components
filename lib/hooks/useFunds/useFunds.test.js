import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { renderHook } from '@testing-library/react-hooks';

import { useOkapiKy } from '@folio/stripes/core';

import { useFunds } from './useFunds';

const queryClient = new QueryClient();
// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const fund = { id: '001', code: 'FUNDCODE' };

describe('useFunds', () => {
  it('should return funds', async () => {
    useOkapiKy.mockClear().mockReturnValue({
      get: () => ({
        json: () => ({
          funds: [fund],
        }),
      }),
    });

    const { result, waitFor } = renderHook(() => useFunds(), { wrapper });

    await waitFor(() => {
      return !result.current.isLoading;
    });

    expect(result.current.funds.length).toEqual(1);
  });
});
