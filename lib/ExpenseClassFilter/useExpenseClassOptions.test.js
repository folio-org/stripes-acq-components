import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { renderHook } from '@testing-library/react-hooks';

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
  it('should return expense class options', async () => {
    useOkapiKy.mockClear().mockReturnValue({
      get: () => ({
        json: () => ({
          isLoading: false,
          expenseClasses: [{ id: 'id', name: 'name' }],
        }),
      }),
    });

    const { result, waitFor } = renderHook(() => useExpenseClassOptions(), { wrapper });

    await waitFor(() => {
      return !result.current.isLoading;
    });

    expect(result.current.length).toBe(1);
  });
});
