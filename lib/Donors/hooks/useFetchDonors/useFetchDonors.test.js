import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
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
    useOkapiKy.mockReturnValue({
      get: getMock,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should make a get a request with default search params', async () => {
    const { result } = renderHook(() => useFetchDonors(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(getMock).not.toHaveBeenCalled();
  });

  it('should make a get a request with default search params', async () => {
    const { result } = renderHook(() => useFetchDonors([org.id]), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(getMock).toHaveBeenCalledWith(
      'organizations/organizations',
      { 'searchParams': { 'limit': 1000, 'query': `id==${org.id}` } },
    );
  });
});
