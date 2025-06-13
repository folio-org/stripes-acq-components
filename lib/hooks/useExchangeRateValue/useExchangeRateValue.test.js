import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
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
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return current exchange rate', async () => {
    useOkapiKy.mockReturnValue({
      get: () => ({
        json: () => ({
          isLoading: false,
          exchangeRate: { exchangeRate: 1.2 },
        }),
      }),
    });

    const { result } = renderHook(() => useExchangeRateValue('EUR', 'USD'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.exchangeRate.exchangeRate).toBe(1.2);
  });

  it('should not make get request since manual exchange rate is provided', async () => {
    const getMock = jest.fn();

    useOkapiKy.mockReturnValue({
      get: getMock,
    });
    const { result } = renderHook(() => useExchangeRateValue('EUR', 'USD', 1.2), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(getMock).not.toHaveBeenCalled();
  });

  it('should not make get request since exchangeFrom is not provided', async () => {
    const getMock = jest.fn();

    useOkapiKy.mockReturnValue({
      get: getMock,
    });
    const { result } = renderHook(() => useExchangeRateValue(undefined, 'USD'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(getMock).not.toHaveBeenCalled();
  });
});
