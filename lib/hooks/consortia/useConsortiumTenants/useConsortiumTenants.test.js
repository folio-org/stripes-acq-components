import { renderHook } from '@testing-library/react-hooks';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  useOkapiKy,
  useStripes,
} from '@folio/stripes/core';

import { tenants } from '../../../../test/jest/fixtures';
import { useConsortiumTenants } from './useConsortiumTenants';

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const stripesMock = {
  user: {
    user: {
      consortium: {
        id: 'consortiumId',
        centralTenantId: 'centralTenantId',
      },
    },
  },
};

describe('useConsortiumTenants', () => {
  beforeEach(() => {
    useOkapiKy
      .mockClear()
      .mockReturnValue({
        get: () => ({
          json: () => Promise.resolve({ tenants }),
        }),
      });
    useStripes
      .mockClear()
      .mockReturnValue(stripesMock);
  });

  it('should fetch central ordering settings', async () => {
    const { result, waitFor } = renderHook(() => useConsortiumTenants(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.tenants).toEqual(tenants);
  });
});
