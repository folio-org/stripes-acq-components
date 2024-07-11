import { renderHook } from '@testing-library/react-hooks';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { library } from '../../../test/jest/fixtures';
import { useLibrariesQuery } from './useLibrariesQuery';

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useLibrariesQuery', () => {
  beforeEach(() => {
    useOkapiKy
      .mockClear()
        .mockReturnValue({
          get: () => ({
            json: () => Promise.resolve({ libraries: [library] }),
          }),
        });
  });

  it('should return list of libraries', async () => {
    const { result, waitFor } = renderHook(() => useLibrariesQuery(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.libraries).toEqual([institution]);
  });
});
