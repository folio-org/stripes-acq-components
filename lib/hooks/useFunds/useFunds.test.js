import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { useFunds } from './useFunds';

const queryClient = new QueryClient();
// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const fund = { id: '001', code: 'FUNDCODE' };

describe('useFunds', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return funds', async () => {
    useOkapiKy.mockReturnValue({
      get: () => ({
        json: () => ({
          funds: [fund],
        }),
      }),
    });

    const { result } = renderHook(() => useFunds(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.funds.length).toEqual(1);
  });
});
