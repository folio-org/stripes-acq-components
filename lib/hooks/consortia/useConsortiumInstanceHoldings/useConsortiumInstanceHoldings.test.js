import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library//react';
import {
  useOkapiKy,
  useStripes,
} from '@folio/stripes/core';

import { useConsortiumInstanceHoldings } from './useConsortiumInstanceHoldings';

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const holdingsMock = [{ id: 'holdings-id' }];
const stripesMock = {
  user: {
    user: {
      consortium: {
        centralTenantId: 'consortium',
      },
    },
  },
};

describe('useConsortiumInstanceHoldings', () => {
  beforeEach(() => {
    useOkapiKy.mockReturnValue({
      get: () => ({
        json: () => Promise.resolve({ holdings: holdingsMock }),
      }),
    });
    useStripes.mockReturnValue(stripesMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch holdings', async () => {
    const { result } = renderHook(() => useConsortiumInstanceHoldings('instanceId'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.holdings).toEqual(holdingsMock);
  });
});
