import { renderHook } from '@testing-library/react-hooks';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { library } from '../../../test/jest/fixtures';
import { useConsortiumLibraries } from '../consortia';
import { useLibraries } from '../useLibraries';
import { useLibrariesQuery } from './useLibrariesQuery';

jest.mock('../consortia', () => ({
  ...jest.requireActual('../consortia'),
  useConsortiumLibraries: jest.fn(),
  useCentralOrderingSettings: jest.fn(() => ({ enabled: false })),
}));

jest.mock('../useLibraries', () => ({
  useLibraries: jest.fn(),
}));

const librariesMock = [{ ...library, tenantId: 'tenantId' }];

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useCampusesQuery', () => {
  beforeEach(() => {
    useConsortiumLibraries
      .mockClear()
      .mockReturnValue({ libraries: librariesMock });
    useLibraries
      .mockClear()
      .mockReturnValue({ libraries: librariesMock });
  });

  it('should return list of libraries in non-ECS mode', async () => {
    const { result, waitFor } = renderHook(
      async () => useLibrariesQuery({ consortium: false }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isFetching).toBeFalsy());

    const { libraries } = await result.current;

    expect(libraries).toEqual(librariesMock);
    expect(useLibraries).toHaveBeenCalledWith(expect.objectContaining({ enabled: true }));
    expect(useConsortiumLibraries).toHaveBeenCalledWith(expect.objectContaining({ enabled: false }));
  });

  it('should return list of libraries in ECS mode', async () => {
    const { result, waitFor } = renderHook(
      async () => useLibrariesQuery({ consortium: true }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isFetching).toBeFalsy());

    const { libraries } = await result.current;

    expect(libraries).toEqual(librariesMock);
    expect(useLibraries).toHaveBeenCalledWith(expect.objectContaining({ enabled: false }));
    expect(useConsortiumLibraries).toHaveBeenCalledWith(expect.objectContaining({ enabled: true }));
  });
});
