import { renderHook } from '@testing-library/react-hooks';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { LIMIT_MAX } from '../../constants';
import { useIntegrationConfigs } from './useIntegrationConfigs';

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const organizationId = 'organizationId';
const configs = [{
  id: 'configId',
  exportTypeSpecificParameters: {
    vendorEdiOrdersExportConfig: {
      vendorId: organizationId,
    },
  },
}];

describe('useIntegrationConfigs', () => {
  const mockGet = jest.fn(() => ({
    json: () => ({
      configs,
      totalRecords: configs.length,
    }),
  }));

  beforeEach(() => {
    useOkapiKy.mockClear().mockReturnValue({
      get: mockGet,
    });
  });

  it('fetches organization integration configs', async () => {
    const { result, waitFor } = renderHook(() => useIntegrationConfigs({ organizationId }), { wrapper });

    await waitFor(() => !result.current.isFetching);

    expect(result.current.integrationConfigs).toEqual(configs);
    expect(mockGet).toHaveBeenCalledWith(
      'data-export-spring/configs',
      {
        searchParams: {
          query: `configName==("CLAIMS_${organizationId}*" or "EDIFACT_ORDERS_EXPORT_${organizationId}*")`,
          limit: LIMIT_MAX,
        },
        signal: expect.any(AbortSignal),
      },
    );
  });
});
