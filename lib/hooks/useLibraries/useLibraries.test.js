import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
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
    useOkapiKy.mockReturnValue({
      get: () => ({
        json: () => Promise.resolve({ loclibs: [library] }),
      }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return list of libraries', async () => {
    const { result } = renderHook(() => useLibraries(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.libraries).toEqual([library]);
  });
});
