import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { orderLine } from '../../../test/jest/fixtures';
import { useOrderLine } from './useOrderLine';

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useOrderLine', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch order line by id', async () => {
    useOkapiKy.mockReturnValue({
      get: () => ({
        json: () => Promise.resolve(orderLine),
      }),
    });

    const { result } = renderHook(() => useOrderLine(orderLine.id), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.orderLine).toEqual(orderLine);
  });
});
