import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { acqUnit } from '../../../test/jest/fixtures';
import { useAcquisitionUnits } from './useAcquisitionUnits';

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const acquisitionsUnits = [acqUnit];

describe('useAcquisitionUnits', () => {
  beforeEach(() => {
    useOkapiKy.mockReturnValue({
      get: () => ({
        json: () => Promise.resolve({ acquisitionsUnits }),
      }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return list of acquisition units', async () => {
    const { result } = renderHook(() => useAcquisitionUnits(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.acquisitionsUnits).toEqual(acquisitionsUnits);
  });
});
