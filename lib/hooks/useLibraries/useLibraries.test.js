import { renderHook } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { library } from '../../../test/jest/fixtures';
import { useLibraries } from './useLibraries';

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useLibraries', () => {
  beforeEach(() => {
    useOkapiKy.mockClear().mockReturnValue({
      get: () => ({
        json: () => Promise.resolve({ loclibs: [library] }),
      }),
    });
  });

  it('should return list of libraries', async () => {
    const { result, waitFor } = renderHook(() => useLibraries(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.libraries).toEqual([library]);
  });
});
