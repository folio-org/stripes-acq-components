import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { institution } from '../../../test/jest/fixtures';
import { useInstitutions } from './useInstitutions';

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useInstitutions', () => {
  beforeEach(() => {
    useOkapiKy.mockReturnValue({
      get: () => ({
        json: () => Promise.resolve({ locinsts: [institution] }),
      }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return list of institutions', async () => {
    const { result } = renderHook(() => useInstitutions(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.institutions).toEqual([institution]);
  });
});
