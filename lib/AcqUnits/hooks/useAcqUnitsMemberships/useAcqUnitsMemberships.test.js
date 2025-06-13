import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { useAcqUnitsMemberships } from './useAcqUnitsMemberships';

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const acquisitionsUnitMemberships = [
  {
    id: 'id',
    userId: 'userId',
    acquisitionsUnitId: 'acquisitionsUnitId',
  },
];

describe('useAcqUnitsMemberships', () => {
  beforeEach(() => {
    useOkapiKy.mockReturnValue({
      get: () => ({
        json: () => Promise.resolve({ acquisitionsUnitMemberships }),
      }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return list of acquisition units memberships', async () => {
    const { result } = renderHook(() => useAcqUnitsMemberships('userId'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.acquisitionsUnitMemberships).toEqual(acquisitionsUnitMemberships);
  });
});
