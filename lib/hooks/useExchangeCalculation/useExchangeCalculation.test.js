import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { CALCULATE_EXCHANGE_API } from '../../constants';
import { useExchangeCalculation } from './useExchangeCalculation';

jest.mock('../useExchangeRateValue', () => ({
  useExchangeRateValue: jest.fn(() => ({ exchangeRate: 1.12 })),
}));

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const kyMock = {
  get: jest.fn(() => ({
    json: () => Promise.resolve(30),
  })),
};

describe('useExchangeCalculation', () => {
  beforeEach(() => {
    useOkapiKy.mockReturnValue(kyMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return calculated exchange amount (manual)', async () => {
    const params = {
      amount: 100,
      from: 'USD',
      rate: 1.2, // manual rate
      to: 'EUR',
    };

    const { result } = renderHook(() => useExchangeCalculation(params), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(kyMock.get).toHaveBeenCalledWith(
      `${CALCULATE_EXCHANGE_API}`,
      expect.objectContaining({
        searchParams: {
          ...params,
          manual: true,
        },
      }),
    );
    expect(result.current.exchangedAmount).toEqual(30);
  });

  it('should return calculated exchange amount (not manual)', async () => {
    const params = {
      amount: 100,
      from: 'USD',
      to: 'EUR',
    };

    const { result } = renderHook(() => useExchangeCalculation(params), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(kyMock.get).toHaveBeenCalledWith(
      `${CALCULATE_EXCHANGE_API}`,
      expect.objectContaining({
        searchParams: {
          ...params,
          rate: 1.12, // from exchange rate provider
          manual: false,
        },
      }),
    );
  });
});
