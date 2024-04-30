import { renderHook } from '@testing-library/react-hooks';
import orderBy from 'lodash/orderBy';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  useOkapiKy,
  useStripes,
} from '@folio/stripes/core';

import { affiliations } from '../../../../test/jest/fixtures';
import {
  CONSORTIA_API,
  CONSORTIA_USER_TENANTS_API,
  LIMIT_MAX,
} from '../../../constants';
import { useUserAffiliations } from './useUserAffiliations';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useNamespace: jest.fn(() => ['test']),
  useOkapiKy: jest.fn(),
  useStripes: jest.fn(),
}));

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const response = {
  userTenants: affiliations,
  totalRecords: affiliations.length,
};

export const consortium = {
  id: 'consortium-id',
  name: 'mobius',
  centralTenantId: 'mobius',
};

const tenants = affiliations.map(({ tenantId, tenantName, isPrimary }) => ({
  id: tenantId,
  name: tenantName,
  isPrimary,
}));

describe('useUserAffiliations', () => {
  const mockGet = jest.fn(() => ({
    json: () => Promise.resolve(response),
  }));
  const kyMock = {
    get: mockGet,
  };

  beforeEach(() => {
    mockGet.mockClear();
    useOkapiKy.mockClear().mockReturnValue(kyMock);
    useStripes.mockClear().mockReturnValue({
      user: {
        user: { consortium, tenants },
      },
    });
  });

  it('should fetch user\'s consortium affiliations by user\'s id when there is consortium', async () => {
    const userId = 'usedId';
    const { result, waitFor } = renderHook(() => useUserAffiliations({ userId }), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(mockGet.mock.calls.length).toBe(1);
    expect(mockGet).toHaveBeenCalledWith(
      `${CONSORTIA_API}/${consortium.id}/${CONSORTIA_USER_TENANTS_API}`,
      expect.objectContaining({ searchParams: { userId, limit: LIMIT_MAX } }),
    );
    expect(result.current.affiliations).toEqual(orderBy(affiliations, 'tenantName'));
  });

  it('should not fetch user\'s consortium affiliations by user\'s id when there is not consortium', async () => {
    useStripes.mockClear().mockReturnValue({ a: 1 });

    const userId = 'usedId';
    const { result, waitFor } = renderHook(
      () => useUserAffiliations({ userId }, { assignedToCurrentUser: false }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(mockGet.mock.calls.length).toBe(0);
  });
});
