import { renderHook } from '@testing-library/react-hooks';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { library } from '../../../test/jest/fixtures';
import { useConsortiumLibraries } from './useConsortiumLibraries';

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useConsortiumLibraries', () => {
  beforeEach(() => {
    useOkapiKy
      .mockClear()
      .mockReturnValue({
        get: () => ({
          json: () => Promise.resolve({ libraries: [library] }),
        }),
      });
  });

  it('should return list of consortium libraries', async () => {
    const { result, waitFor } = renderHook(() => useConsortiumLibraries(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.libraries).toEqual([library]);
  });
});
