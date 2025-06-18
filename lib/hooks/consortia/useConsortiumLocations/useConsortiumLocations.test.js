import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { location } from '../../../../test/jest/fixtures';
import { getConsortiumCentralTenantId } from '../../../utils';
import { useConsortiumLocations } from './useConsortiumLocations';

jest.mock('../../../utils', () => ({
  ...jest.requireActual('../../../utils'),
  getConsortiumCentralTenantId: jest.fn(),
}));

jest.mock('../usePublishCoordinator', () => ({
  usePublishCoordinator: jest.fn(),
}));

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useConsortiumLocations', () => {
  beforeEach(() => {
    getConsortiumCentralTenantId.mockReturnValue('centralTenantId');
    useOkapiKy.mockReturnValue({
      get: () => ({
        json: () => Promise.resolve({ locations: [location] }),
      }),
    });
  });

  it('should return list of consortium locations', async () => {
    const { result } = renderHook(() => useConsortiumLocations(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.locations).toEqual([location]);
  });
});
