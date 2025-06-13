import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
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
    useOkapiKy.mockReturnValue({
      get: mockGet,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('fetches organization integration configs', async () => {
    const { result } = renderHook(() => useIntegrationConfigs({ organizationId }), { wrapper });

    await waitFor(() => expect(result.current.isFetching).toBeFalsy());

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
