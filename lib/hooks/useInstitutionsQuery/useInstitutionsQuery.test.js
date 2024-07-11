import { renderHook } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { institution } from '../../../test/jest/fixtures';
import { useInstitutions } from './useInstitutionsQuery';

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useInstitutions', () => {
  beforeEach(() => {
    useOkapiKy.mockClear().mockReturnValue({
      get: () => ({
        json: () => Promise.resolve({ locinsts: [institution] }),
      }),
    });
  });

  it('should return list of institutions', async () => {
    const { result, waitFor } = renderHook(() => useInstitutions(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.institutions).toEqual([institution]);
  });
});
