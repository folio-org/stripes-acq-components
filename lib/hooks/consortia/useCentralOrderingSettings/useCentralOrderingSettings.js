import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
  useStripes,
} from '@folio/stripes/core';

import {
  CENTRAL_ORDERING_SETTINGS_KEY,
  ORDERS_STORAGE_SETTINGS_API,
} from '../../../constants';
import { getConsortiumCentralTenantId } from '../../../utils';

export const useCentralOrderingSettings = (options = {}) => {
  const stripes = useStripes();

  const centralTenantId = getConsortiumCentralTenantId(stripes);
  const {
    enabled = true,
    queryKey = [],
    ...restOptions
  } = options;

  const ky = useOkapiKy({ tenant: centralTenantId });
  const [namespace] = useNamespace({ key: 'central-ordering-settings' });

  const searchParams = {
    limit: 1,
    query: `key=${CENTRAL_ORDERING_SETTINGS_KEY}`,
  };

  const {
    data,
    isFetching,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [namespace, centralTenantId].concat(queryKey),
    queryFn: async ({ signal }) => {
      const response = await ky.get(ORDERS_STORAGE_SETTINGS_API, { searchParams, signal }).json();

      return response?.settings?.[0];
    },
    enabled: Boolean(enabled && centralTenantId),
    ...restOptions,
  });

  return ({
    data,
    enabled: data?.value === 'true',
    isFetching,
    isLoading,
    refetch,
  });
};
