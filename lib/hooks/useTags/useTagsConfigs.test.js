import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { CONFIG_API } from '../../constants';
import { useTagsConfigs } from './useTagsConfigs';

const configs = [];

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useTagsConfigs', () => {
  const mockGet = jest.fn(() => ({
    json: () => ({ configs }),
  }));

  beforeEach(() => {
    useOkapiKy.mockReturnValue({ get: mockGet });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch tags configs', async () => {
    const { result } = renderHook(() => useTagsConfigs(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.configs).toEqual(configs);
    expect(mockGet).toHaveBeenCalledWith(CONFIG_API, expect.objectContaining({}));
  });
});
