import { renderHook } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { HOLDINGS_API } from '../../constants';
import { useInstanceHoldings } from './useInstanceHoldings';

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const holdingsRecords = [
  { id: 'holdingId-1' },
  { id: 'holdingId-2' },
];
const kyMock = {
  get: jest.fn(() => ({
    json: () => Promise.resolve({
      holdingsRecords,
      totalRecords: holdingsRecords.length,
    }),
  })),
};

describe('useInstanceHoldings', () => {
  beforeEach(() => {
    kyMock.get.mockClear();
    useOkapiKy
      .mockClear()
      .mockReturnValue(kyMock);
  });

  it('should return instance holdings', async () => {
    const instanceId = 'instanceId';
    const { result, waitFor } = renderHook(() => useInstanceHoldings(instanceId), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(kyMock.get).toHaveBeenCalledWith(
      HOLDINGS_API,
      {
        searchParams: expect.objectContaining({ query: `instanceId==${instanceId}` }),
      },
    );
    expect(result.current.holdings).toEqual(holdingsRecords);
  });
});
