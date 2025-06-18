import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { useExpenseClassOptions } from './useExpenseClassOptions';

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useExpenseClassOptions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return expense class options', async () => {
    useOkapiKy.mockReturnValue({
      get: () => ({
        json: () => Promise.resolve({
          expenseClasses: [{ id: 'id', name: 'name' }],
        }),
      }),
    });

    const { result } = renderHook(() => useExpenseClassOptions(), { wrapper });

    await waitFor(() => expect(result.current.length).toBe(1));
  });
});
