import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';

import { fetchExchangeRateSource } from '../../utils/api';
import { useExchangeRateSource } from './useExchangeRateSource';

jest.mock('../../utils/api', () => ({
  fetchExchangeRateSource: jest.fn(),
}));

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useExchangeRateSource', () => {
  const exchangeRateSource = { id: 'id' };
  const fetcher = jest.fn(() => Promise.resolve(exchangeRateSource));

  beforeEach(() => {
    fetchExchangeRateSource.mockReturnValue(fetcher);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch exchange rate source', async () => {
    const { result } = renderHook(() => useExchangeRateSource(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.exchangeRateSource).toEqual(exchangeRateSource);
    expect(fetcher).toHaveBeenCalledWith({ signal: expect.any(AbortSignal) });
  });
});
