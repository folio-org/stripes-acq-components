import { renderHook } from '@testing-library/react-hooks';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { useAcquisitionMethods } from './useAcquisitionMethods';

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const acquisitionMethods = [{ id: 'acq-method-id' }];

describe('useAcquisitionMethods', () => {
  beforeEach(() => {
    useOkapiKy
      .mockClear()
      .mockReturnValue({
        get: () => ({
          json: () => Promise.resolve({ acquisitionMethods }),
        }),
      });
  });

  it('should return list of acquisition methods', async () => {
    const { result, waitFor } = renderHook(() => useAcquisitionMethods(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.acquisitionMethods).toEqual(acquisitionMethods);
  });
});
