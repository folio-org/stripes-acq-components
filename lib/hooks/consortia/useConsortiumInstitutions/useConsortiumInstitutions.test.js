import { renderHook } from '@testing-library/react-hooks';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { institution } from '../../../test/jest/fixtures';
import { useConsortiumInstitutions } from './useConsortiumInstitutions';

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useConsortiumInstitutions', () => {
  beforeEach(() => {
    useOkapiKy
      .mockClear()
      .mockReturnValue({
        get: () => ({
          json: () => Promise.resolve({ institutions: [institution] }),
        }),
      });
  });

  it('should return list of consortium institutions', async () => {
    const { result, waitFor } = renderHook(() => useConsortiumInstitutions(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.institutions).toEqual([institution]);
  });
});
