import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { campus } from '../../../test/jest/fixtures';
import { useCampuses } from './useCampuses';

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useCampuses', () => {
  beforeEach(() => {
    useOkapiKy.mockReturnValue({
      get: () => ({
        json: () => Promise.resolve({ loccamps: [campus] }),
      }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return list of campuses', async () => {
    const { result } = renderHook(() => useCampuses(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.campuses).toEqual([campus]);
  });
});
