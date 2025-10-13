import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
  useStripes,
} from '@folio/stripes/core';

import { getConsortiumCentralTenantId } from '../../../utils';
import { fetchConsortiumLocations } from '../../../utils/api';

const DEFAULT_DATA = [];

export const useConsortiumLocations = (options = {}) => {
  const stripes = useStripes();
  const centralTenantId = getConsortiumCentralTenantId(stripes);
  const ky = useOkapiKy({ tenant: centralTenantId });
  const [namespace] = useNamespace({ key: 'consortium-locations' });

  const {
    enabled = true,
    tenantId,
    ...restOptions
  } = options;

  const searchParams = {
    ...(tenantId ? { tenantId } : {}),
  };

  const {
    data,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: [namespace, centralTenantId, tenantId],
    queryFn: async ({ signal }) => fetchConsortiumLocations(ky, stripes)({ searchParams, signal }),
    enabled: enabled && Boolean(centralTenantId),
    ...restOptions,
  });

  return ({
    locations: data?.locations || DEFAULT_DATA,
    isFetching,
    isLoading,
  });
};
