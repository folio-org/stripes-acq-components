import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
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
    useOkapiKy.mockReturnValue({
      get: () => ({
        json: () => Promise.resolve({ tenants }),
      }),
    });
    useStripes.mockReturnValue(stripesMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch central ordering settings', async () => {
    const { result } = renderHook(() => useConsortiumTenants(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.tenants).toEqual(tenants);
  });
});
