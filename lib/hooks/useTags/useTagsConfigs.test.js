import { renderHook } from '@testing-library/react-hooks';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

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
    useOkapiKy
      .mockClear()
      .mockReturnValue({ get: mockGet });
  });

  it('should fetch tags configs', async () => {
    const { result, waitFor } = renderHook(() => useTagsConfigs(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.configs).toEqual(configs);
    expect(mockGet).toHaveBeenCalledWith(CONFIG_API, expect.objectContaining({}));
  });
});
