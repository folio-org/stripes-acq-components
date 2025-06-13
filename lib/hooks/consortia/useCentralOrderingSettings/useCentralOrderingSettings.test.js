import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import {
  useOkapiKy,
  useStripes,
} from '@folio/stripes/core';

import { CENTRAL_ORDERING_SETTINGS_KEY } from '../../../constants';
import { useCentralOrderingSettings } from './useCentralOrderingSettings';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useNamespace: jest.fn(() => (['namespace'])),
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
    useOkapiKy.mockReturnValue({
      get: () => ({
        json: () => Promise.resolve({ settings: [mockData] }),
      }),
    });
    useStripes.mockReturnValue(stripesMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch central ordering settings', async () => {
    const { result } = renderHook(() => useCentralOrderingSettings(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current).toEqual(expect.objectContaining({
      enabled: true,
      isLoading: false,
      data: mockData,
    }));
  });
});
