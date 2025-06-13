import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';

import { location } from '../../../test/jest/fixtures';
import { useConsortiumLocations } from '../consortia';
import { useLocations } from '../useLocations';
import { useLocationsQuery } from './useLocationsQuery';

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

describe('useLocationsQuery', () => {
  beforeEach(() => {
    useConsortiumLocations.mockReturnValue({ locations: locationsMock });
    useLocations.mockReturnValue({ locations: locationsMock });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return list of locations in non-ECS mode', async () => {
    const { result } = renderHook(
      async () => useLocationsQuery({ consortium: false }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isFetching).toBeFalsy());

    const { locations } = await result.current;

    expect(locations).toEqual(locationsMock);
    expect(useLocations).toHaveBeenCalledWith(expect.objectContaining({ enabled: true }));
    expect(useConsortiumLocations).toHaveBeenCalledWith(expect.objectContaining({ enabled: false }));
  });

  it('should return list of locations in ECS mode', async () => {
    const { result } = renderHook(
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
