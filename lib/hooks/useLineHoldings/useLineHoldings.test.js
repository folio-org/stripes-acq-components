import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { useLineHoldings } from './useLineHoldings';

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useLineHoldings', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return response array', async () => {
    useOkapiKy.mockReturnValue({
      get: () => ({
        json: () => ({
          holdings: [{ id: 'holdingId' }],
        }),
      }),
    });

    const { result } = renderHook(() => useLineHoldings(['001']), { wrapper });

    await waitFor(() => {
      return Boolean(result.current.data[0].holdings);
    });

    expect(result.current.data[0].holdings.length).toEqual(1);
  });
});
