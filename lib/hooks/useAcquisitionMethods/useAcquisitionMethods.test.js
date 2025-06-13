import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
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
    useOkapiKy.mockReturnValue({
      get: () => ({
        json: () => Promise.resolve({ acquisitionMethods }),
      }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return list of acquisition methods', async () => {
    const { result } = renderHook(() => useAcquisitionMethods(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.acquisitionMethods).toEqual(acquisitionMethods);
  });
});
