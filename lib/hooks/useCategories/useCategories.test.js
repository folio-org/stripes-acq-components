import { QueryClient, QueryClientProvider } from 'react-query';

import { renderHook } from '@testing-library/react-hooks';
import { useOkapiKy } from '@folio/stripes/core';

import { useCategories } from './useCategories';

const categories = [{ id: 'categoryId' }];

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const kyMock = {
  get: jest.fn(() => ({
    json: () => Promise.resolve({ categories }),
  })),
};

describe('useCategories', () => {
  beforeEach(() => {
    kyMock.get.mockClear();
    useOkapiKy.mockClear().mockReturnValue(kyMock);
  });

  it('should fetch all categories', async () => {
    const { result, waitFor } = renderHook(() => useCategories(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.categories).toEqual(categories);
  });
});
