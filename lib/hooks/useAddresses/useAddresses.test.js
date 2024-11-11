import { renderHook } from '@testing-library/react-hooks';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { getAddresses } from '../../utils';
import { useAddresses } from './useAddresses';

jest.mock('../../utils', () => ({
  getAddresses: jest.fn(),
}));

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useAddresses', () => {
  const mockGet = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    useOkapiKy.mockReturnValue({
      get: mockGet,
    });
  });

  it('should return addresses and totalRecords', async () => {
    const configs = [{ value: 'address1' }, { value: 'address2' }];
    const totalRecords = 2;

    mockGet.mockReturnValue({
      json: jest.fn().mockResolvedValue({ configs, totalRecords }),
    });

    getAddresses.mockReturnValue(['address1', 'address2']);

    const { result, waitFor } = renderHook(() => useAddresses(), { wrapper });

    await waitFor(() => !result.current.isLoading);

    expect(result.current.addresses).toEqual(['address1', 'address2']);
    expect(result.current.totalRecords).toBe(2);
  });
});
