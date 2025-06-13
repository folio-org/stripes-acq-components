import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';

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
    useConsortiumInstanceHoldings.mockReturnValue({ holdings: holdingsMock });
    useInstanceHoldings.mockReturnValue({ holdings: holdingsMock });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return list of holdings in non-ECS mode', async () => {
    const { result } = renderHook(
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
    const { result } = renderHook(
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
