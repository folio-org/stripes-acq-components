import { renderHook } from '@testing-library/react-hooks';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

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
    useOkapiKy
      .mockClear()
      .mockReturnValue({
        get: () => ({
          json: () => Promise.resolve({ acquisitionsUnitMemberships }),
        }),
      });
  });

  it('should return list of acquisition units memberships', async () => {
    const { result, waitFor } = renderHook(() => useAcqUnitsMemberships('userId'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.acquisitionsUnitMemberships).toEqual(acquisitionsUnitMemberships);
  });
});
