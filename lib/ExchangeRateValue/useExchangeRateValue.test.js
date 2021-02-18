import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { renderHook } from '@testing-library/react-hooks';

import { useOkapiKy } from '@folio/stripes/core';

import { useExchangeRateValue } from './useExchangeRateValue';

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useExchangeRateValue', () => {
  it('should return current exchange rate', async () => {
    useOkapiKy.mockClear().mockReturnValue({
      get: () => ({
        json: () => ({
          isLoading: false,
          exchangeRate: { exchangeRate: 1.2 },
        }),
      }),
    });

    const { result, waitFor } = renderHook(() => useExchangeRateValue('EUR', 'USD'), { wrapper });

    await waitFor(() => {
      return !result.current.isLoading;
    });

    expect(result.current.exchangeRate.exchangeRate).toBe(1.2);
  });

  it('should not make get request since manual exchange rate is provided', async () => {
    const getMock = jest.fn();

    useOkapiKy.mockClear().mockReturnValue({
      get: getMock,
    });
    const { result, waitFor } = renderHook(() => useExchangeRateValue('EUR', 'USD', 1.2), { wrapper });

    await waitFor(() => {
      return !result.current.isLoading;
    });

    expect(getMock).not.toHaveBeenCalled();
  });
});
