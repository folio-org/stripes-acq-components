import { renderHook } from '@testing-library/react-hooks';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  useOkapiKy,
  useStripes,
} from '@folio/stripes/core';

import { CENTRAL_ORDERING_SETTINGS_KEY } from '../../constants';
import { useCentralOrderingSettings } from './useCentralOrderingSettings';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useOkapiKy: jest.fn(),
  useStripes: jest.fn(),
}));

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const mockData = {
  id: 'cb007def-4b68-496c-ad78-ea8e039e819d',
  key: CENTRAL_ORDERING_SETTINGS_KEY,
  value: 'true',
};

const stripesMock = {
  user: {
    user: {
      consortium: {
        centralTenantId: 'centralTenantId',
      },
    },
  },
};

describe('useCentralOrderingSettings', () => {
  beforeEach(() => {
    useOkapiKy
      .mockClear()
      .mockReturnValue({
        get: () => ({
          json: () => Promise.resolve({ settings: [mockData] }),
        }),
      });
    useStripes
      .mockClear()
      .mockReturnValue(stripesMock);
  });

  it('should fetch central ordering settings', async () => {
    const { result, waitFor } = renderHook(() => useCentralOrderingSettings(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current).toEqual(expect.objectContaining({
      enabled: true,
      isLoading: false,
      data: mockData,
    }));
  });
});
