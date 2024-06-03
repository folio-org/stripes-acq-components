import { renderHook } from '@testing-library/react-hooks';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { useConsortiumInstanceHoldings } from '../consortia';
import { useInstanceHoldings } from '../useInstanceHoldings';
import { useInstanceHoldingsQuery } from './useInstanceHoldingsQuery';

jest.mock('../consortia', () => ({
  ...jest.requireActual('../consortia'),
  useConsortiumInstanceHoldings: jest.fn(),
}));

jest.mock('../useInstanceHoldings', () => ({
  useInstanceHoldings: jest.fn(),
}));

const instanceId = 'instanceId';
const holdingsMock = [
  {
    id: 'holdingId',
    tenantId: 'tenantId',
    instanceId,
  },
];

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useInstanceHoldingsQuery', () => {
  beforeEach(() => {
    useConsortiumInstanceHoldings
      .mockClear()
      .mockReturnValue({ holdings: holdingsMock });
    useInstanceHoldings
      .mockClear()
      .mockReturnValue({ holdings: holdingsMock });
  });

  it('should return list of holdings in non-ECS mode', async () => {
    const { result, waitFor } = renderHook(
      async () => useInstanceHoldingsQuery(instanceId, { consortium: false }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isFetching).toBeFalsy());

    const { holdings } = await result.current;

    expect(holdings).toEqual(holdingsMock);
    expect(useInstanceHoldings).toHaveBeenCalledWith(instanceId, expect.objectContaining({ enabled: true }));
    expect(useConsortiumInstanceHoldings).toHaveBeenCalledWith(instanceId, expect.objectContaining({ enabled: false }));
  });

  it('should return list of locations in ECS mode', async () => {
    const { result, waitFor } = renderHook(
      async () => useInstanceHoldingsQuery(instanceId, { consortium: true }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isFetching).toBeFalsy());

    const { holdings } = await result.current;

    expect(holdings).toEqual(holdingsMock);
    expect(useInstanceHoldings).toHaveBeenCalledWith(instanceId, expect.objectContaining({ enabled: false }));
    expect(useConsortiumInstanceHoldings).toHaveBeenCalledWith(instanceId, expect.objectContaining({ enabled: true }));
  });
});
