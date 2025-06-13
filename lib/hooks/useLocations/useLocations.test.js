import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { location } from '../../../test/jest/fixtures';
import { useLocations } from './useLocations';

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useLocations', () => {
  beforeEach(() => {
    useOkapiKy.mockReturnValue({
      get: jest.fn()
        .mockReturnValueOnce({ json: () => Promise.resolve({ locations: [location] }) })
        .mockReturnValue({ json: () => Promise.resolve({ locations: [] }) }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return list of locations', async () => {
    const { result } = renderHook(() => useLocations(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.locations).toEqual([location]);
  });
});
