import { renderHook } from '@testing-library/react-hooks';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { campus } from '../../../test/jest/fixtures';
import { useConsortiumCampuses } from '../consortia';
import { useCampuses } from '../useCampuses';
import { useCampusesQuery } from './useCampusesQuery';

jest.mock('../consortia', () => ({
  ...jest.requireActual('../consortia'),
  useConsortiumCampuses: jest.fn(),
  useCentralOrderingSettings: jest.fn(() => ({ enabled: false })),
}));

jest.mock('../useCampuses', () => ({
  useCampuses: jest.fn(),
}));

const campusesMock = [{ ...campus, tenantId: 'tenantId' }];

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useCampusesQuery', () => {
  beforeEach(() => {
    useConsortiumCampuses
      .mockClear()
      .mockReturnValue({ campuses: campusesMock });
    useCampuses
      .mockClear()
      .mockReturnValue({ campuses: campusesMock });
  });

  it('should return list of campuses in non-ECS mode', async () => {
    const { result, waitFor } = renderHook(
      async () => useCampusesQuery({ consortium: false }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isFetching).toBeFalsy());

    const { campuses } = await result.current;

    expect(campuses).toEqual(campusesMock);
    expect(useCampuses).toHaveBeenCalledWith(expect.objectContaining({ enabled: true }));
    expect(useConsortiumCampuses).toHaveBeenCalledWith(expect.objectContaining({ enabled: false }));
  });

  it('should return list of campuses in ECS mode', async () => {
    const { result, waitFor } = renderHook(
      async () => useCampusesQuery({ consortium: true }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isFetching).toBeFalsy());

    const { campuses } = await result.current;

    expect(campuses).toEqual(campusesMock);
    expect(useCampuses).toHaveBeenCalledWith(expect.objectContaining({ enabled: false }));
    expect(useConsortiumCampuses).toHaveBeenCalledWith(expect.objectContaining({ enabled: true }));
  });
});
