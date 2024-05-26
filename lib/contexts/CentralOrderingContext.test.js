import { renderHook } from '@testing-library/react-hooks';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { useCentralOrderingSettings } from '../hooks';
import {
  CentralOrderingContextProvider,
  useCentralOrderingContext,
} from './CentralOrderingContext';

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <CentralOrderingContextProvider>
      {children}
    </CentralOrderingContextProvider>
  </QueryClientProvider>
);

jest.mock('../hooks', () => ({
  ...jest.requireActual('../hooks'),
  useCentralOrderingSettings: jest.fn(() => ({ enabled: true })),
}));

describe('useCentralOrderingContext', () => {
  it('should fetch central ordering settings', async () => {
    const { result } = renderHook(() => useCentralOrderingContext(), { wrapper });

    expect(useCentralOrderingSettings).toHaveBeenCalled();
    expect(result.current.isCentralOrderingEnabled).toBeTruthy();
  });
});
