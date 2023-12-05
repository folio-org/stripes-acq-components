import { QueryClient, QueryClientProvider } from 'react-query';

import { renderHook } from '@testing-library/react-hooks';
import { useFetchPrivilegedContacts } from './useFetchPrivilegedContacts';
import { DEFAULT_DATA } from '../constants';

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
      contacts: DEFAULT_DATA,
      isLoading: false,
    });
  });

  it('should return data if privileged contact ids provided', () => {
    const { result } = renderHook(() => useFetchPrivilegedContacts(['1']), { wrapper });

    expect(result.current).toEqual({
      contacts: DEFAULT_DATA,
      isLoading: true,
    });
  });
});
