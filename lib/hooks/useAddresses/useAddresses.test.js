import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

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
    useOkapiKy.mockReturnValue({ get: mockGet });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return addresses and totalRecords', async () => {
    const items = [
      { value: { name: 'address1' } },
      { value: { name: 'address2' } },
    ];
    const totalRecords = 2;

    mockGet.mockReturnValue({
      json: jest.fn().mockResolvedValue({ items, totalRecords }),
    });

    const { result } = renderHook(() => useAddresses(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.addresses.map(({ name }) => name)).toEqual(['address1', 'address2']);
    expect(result.current.totalRecords).toBe(2);
  });
});
