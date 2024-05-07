import { renderHook } from '@testing-library/react-hooks';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { useStripes } from '@folio/stripes/core';

import { location } from '../../../../test/jest/fixtures';
import { usePublishCoordinator } from '../usePublishCoordinator';
import { useConsortiumLocations } from './useConsortiumLocations';

jest.mock('../usePublishCoordinator', () => ({
  usePublishCoordinator: jest.fn(),
}));

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
        id: 'consortium-id',
      },
    },
  },
};

const pcMock = {
  initPublicationRequest: jest.fn(async () => {
    return {
      publicationResults: [
        {
          tenantId: 'central',
          response: { locations: [location] },
        },
      ],
    };
  }),
};

describe('useConsortiumLocations', () => {
  beforeEach(() => {
    useStripes
      .mockClear()
      .mockReturnValue(stripesMock);
    usePublishCoordinator
      .mockClear()
      .mockReturnValue(pcMock);
  });

  it('should return list of locations', async () => {
    const { result, waitFor } = renderHook(() => useConsortiumLocations({
      tenants: ['central'],
    }), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.locations).toEqual([{ ...location, tenantId: 'central' }]);
  });
});
