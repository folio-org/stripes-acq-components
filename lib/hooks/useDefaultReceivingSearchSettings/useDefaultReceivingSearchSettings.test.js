import { renderHook } from '@testing-library/react-hooks';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import {
  CENTRAL_ORDERING_DEFAULT_RECEIVING_SEARCH,
  CENTRAL_ORDERING_DEFAULT_RECEIVING_SEARCH_SETTINGS_KEY,
} from '../../constants';
import { useDefaultReceivingSearchSettings } from './useDefaultReceivingSearchSettings';

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const mockData = {
  id: 'cb007def-4b68-496c-ad78-ea8e039e819d',
  key: CENTRAL_ORDERING_DEFAULT_RECEIVING_SEARCH_SETTINGS_KEY,
  value: CENTRAL_ORDERING_DEFAULT_RECEIVING_SEARCH.centralOnly,
};

describe('useDefaultReceivingSearchSettings', () => {
  beforeEach(() => {
    useOkapiKy
      .mockClear()
      .mockReturnValue({
        get: () => ({
          json: () => Promise.resolve({ settings: [mockData] }),
        }),
      });
  });

  it('should fetch central ordering settings', async () => {
    const { result, waitFor } = renderHook(() => useDefaultReceivingSearchSettings(), { wrapper });

    await waitFor(() => expect(result.current.isFetching).toBeFalsy());

    expect(result.current).toEqual(expect.objectContaining({
      isFetching: false,
      data: mockData,
    }));
  });
});
