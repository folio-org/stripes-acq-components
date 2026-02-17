import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { useAddress } from './useAddress';

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useAddress', () => {
  const mockGet = jest.fn();

  beforeEach(() => {
    useOkapiKy.mockReturnValue({ get: mockGet });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return address', async () => {
    const address = {
      name: 'address1',
    };

    mockGet.mockReturnValue({
      json: jest.fn().mockResolvedValue(address),
    });

    const { result } = renderHook(() => useAddress('address1'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.address).toEqual({ name: 'address1' });
  });
});
