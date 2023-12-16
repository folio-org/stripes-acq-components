import { renderHook } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from 'react-query';

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
    useOkapiKy.mockClear().mockReturnValue({
      get: () => ({
        json: () => Promise.resolve({ loccamps: [campus] }),
      }),
    });
  });

  it('should return list of campuses', async () => {
    const { result, waitFor } = renderHook(() => useCampuses(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.campuses).toEqual([campus]);
  });
});
