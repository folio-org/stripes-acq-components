import { renderHook } from '@testing-library/react-hooks';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { location } from '../../../test/jest/fixtures';
import { useConsortiumLocations } from '../consortia';
import { useLocations } from '../useLocations';
import { useInstanceHoldingsQuery } from './useInstanceHoldingsQuery';

jest.mock('../consortia', () => ({
  ...jest.requireActual('../consortia'),
  useConsortiumLocations: jest.fn(),
  useCentralOrderingSettings: jest.fn(() => ({ enabled: false })),
}));

jest.mock('../useLocations', () => ({
  useLocations: jest.fn(),
}));

const locationsMock = [{ ...location, tenantId: 'tenantId' }];

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useInstanceHoldingsQuery', () => {
  beforeEach(() => {
    useConsortiumLocations
      .mockClear()
      .mockReturnValue({ locations: locationsMock });
    useLocations
      .mockClear()
      .mockReturnValue({ locations: locationsMock });
  });

  it('should return list of locations in non-ECS mode', async () => {
    const { result, waitFor } = renderHook(
      async () => useLineHoldingsQuery({ consortium: false }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isFetching).toBeFalsy());

    const { locations } = await result.current;

    expect(locations).toEqual(locationsMock);
    expect(useLocations).toHaveBeenCalledWith(expect.objectContaining({ enabled: true }));
    expect(useConsortiumLocations).toHaveBeenCalledWith(expect.objectContaining({ enabled: false }));
  });

  it('should return list of locations in ECS mode', async () => {
    const { result, waitFor } = renderHook(
      async () => useLocationsQuery({ consortium: true }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isFetching).toBeFalsy());

    const { locations } = await result.current;

    expect(locations).toEqual(locationsMock);
    expect(useLocations).toHaveBeenCalledWith(expect.objectContaining({ enabled: false }));
    expect(useConsortiumLocations).toHaveBeenCalledWith(expect.objectContaining({ enabled: true }));
  });
});
