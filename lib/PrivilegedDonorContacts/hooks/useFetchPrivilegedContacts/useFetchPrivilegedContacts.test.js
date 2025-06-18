import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { renderHook } from '@folio/jest-config-stripes/testing-library/react';

import { useFetchPrivilegedContacts } from './useFetchPrivilegedContacts';

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useFetchPrivilegedContacts', () => {
  it('should return default data if no privileged contact ids provided', () => {
    const { result } = renderHook(() => useFetchPrivilegedContacts(), { wrapper });

    expect(result.current).toEqual({
      contacts: [],
      isLoading: false,
    });
  });

  it('should return data if privileged contact ids provided', () => {
    const { result } = renderHook(() => useFetchPrivilegedContacts(['1']), { wrapper });

    expect(result.current).toEqual({
      contacts: [],
      isLoading: true,
    });
  });
});
