import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import { renderHook } from '@testing-library/react-hooks';

import { useOkapiKy } from '@folio/stripes/core';

import { USERS_API } from '../../constants';
import { useUsersBatch } from './useUsersBatch';

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const users = [
  { id: '1', firstName: 'Luke', lastName: 'Skywalker' },
  { id: '2', firstName: 'Dart', lastName: 'Waider' },
];

describe('useUsersBatch', () => {
  const mockGet = jest.fn(() => ({
    json: () => Promise.resolve(users),
  }));

  beforeEach(() => {
    useOkapiKy.mockClear().mockReturnValue({
      get: mockGet,
    });
  });

  it('should batch fetch users by ids', async () => {
    const { result, waitFor } = renderHook(() => useUsersBatch(users.map(({ id }) => id)), { wrapper });

    await waitFor(() => !result.current.isLoading);

    expect(result.current.organization).toEqual(users);
    expect(mockGet).toHaveBeenCalledWith(USERS_API);
  });
});
