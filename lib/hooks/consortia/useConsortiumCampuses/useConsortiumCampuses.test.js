import { renderHook } from '@testing-library/react-hooks';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { campus } from '../../../../test/jest/fixtures';
import { getConsortiumCentralTenantId } from '../../../utils';
import { useConsortiumCampuses } from './useConsortiumCampuses';

jest.mock('../../../utils', () => ({
  ...jest.requireActual('../../../utils'),
  getConsortiumCentralTenantId: jest.fn(),
}));

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useConsortiumCampuses', () => {
  beforeEach(() => {
    getConsortiumCentralTenantId
      .mockClear()
      .mockReturnValue('centralTenantId');
    useOkapiKy
      .mockClear()
      .mockReturnValue({
        get: () => ({
          json: () => Promise.resolve({ campuses: [campus] }),
        }),
      });
  });

  it('should return list of consortium campuses', async () => {
    const { result, waitFor } = renderHook(() => useConsortiumCampuses(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.campuses).toEqual([campus]);
  });
});
