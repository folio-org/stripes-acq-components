import { renderHook } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from 'react-query';

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
  it('should fetch order line by id', async () => {
    useOkapiKy
      .mockClear()
      .mockReturnValue({
        get: () => ({
          json: () => Promise.resolve(orderLine),
        }),
      });

    const { result, waitFor } = renderHook(() => useOrderLine(orderLine.id), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.orderLine).toEqual(orderLine);
  });
});
