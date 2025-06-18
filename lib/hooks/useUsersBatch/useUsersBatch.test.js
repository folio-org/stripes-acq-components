import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { USERS_API } from '../../constants';
import { useUsersBatch } from './useUsersBatch';

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const users = [
  { id: '1', firstName: 'Luke', lastName: 'Skywalker' },
  { id: '2', firstName: 'Dart', lastName: 'Waider' },
];
const userIds = users.map(({ id }) => id);

describe('useUsersBatch', () => {
  const mockGet = jest.fn(() => ({
    json: () => Promise.resolve({ users }),
  }));

  beforeEach(() => {
    useOkapiKy.mockReturnValue({
      get: mockGet,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should batch fetch users by ids', async () => {
    const { result } = renderHook(() => useUsersBatch(userIds), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.users).toEqual(users);
    expect(mockGet).toHaveBeenCalledWith(USERS_API, {
      searchParams: expect.objectContaining({
        query: userIds.map(id => `id==${id}`).join(' or '),
      }),
      signal: expect.any(AbortSignal),
    });
  });
});
