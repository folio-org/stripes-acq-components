import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { renderHook } from '@testing-library/react-hooks';

import { useOkapiKy } from '@folio/stripes/core';

import { useFetchDonors } from './useFetchDonors';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useOkapiKy: jest.fn(),
  useNamespace: jest.fn(() => ['NameSpace']),
}));

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const org = { id: 'orgId', name: 'VENDOR' };

const getMock = jest.fn().mockReturnValue({
  json: () => Promise.resolve(({ organizations: [org], totalRecords: 1 })),
});

describe('useDonors', () => {
  beforeEach(() => {
    getMock.mockClear();

    useOkapiKy
      .mockClear()
      .mockReturnValue({
        get: getMock,
      });
  });

  it('should make a get a request with default search params', async () => {
    const { result, waitFor } = renderHook(() => useFetchDonors(), { wrapper });

    await waitFor(() => !result.current.isLoading);

    expect(getMock).not.toHaveBeenCalled();
  });

  it('should make a get a request with default search params', async () => {
    const { result, waitFor } = renderHook(() => useFetchDonors([org.id]), { wrapper });

    await waitFor(() => !result.current.isLoading);

    expect(getMock).toHaveBeenCalledWith(
      'organizations/organizations',
      { 'searchParams': { 'limit': 1000, 'query': `id==${org.id}` } },
    );
  });
});
