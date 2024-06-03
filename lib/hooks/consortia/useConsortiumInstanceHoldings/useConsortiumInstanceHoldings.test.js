import { renderHook } from '@testing-library/react-hooks';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

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
    useOkapiKy
      .mockClear()
      .mockReturnValue({
        get: () => ({
          json: () => Promise.resolve({ holdings: holdingsMock }),
        }),
      });
    useStripes
      .mockClear()
      .mockReturnValue(stripesMock);
  });

  it('should fetch holdings', async () => {
    const { result, waitFor } = renderHook(() => useConsortiumInstanceHoldings('instanceId'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.holdings).toEqual(holdingsMock);
  });
});
