import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
  useStripes,
} from '@folio/stripes/core';

import { CONSORTIUM_LOCATIONS_API } from '../../../constants';
import { getConsortiumCentralTenantId } from '../../../utils';

const DEFAULT_DATA = [];

export const useConsortiumLocations = (options = {}) => {
  const stripes = useStripes();
  const centralTenantId = getConsortiumCentralTenantId(stripes);
  const ky = useOkapiKy({ tenant: centralTenantId });
  const [namespace] = useNamespace({ key: 'locations' });

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
    queryFn: async ({ signal }) => ky.get(CONSORTIUM_LOCATIONS_API, { searchParams, signal }).json(),
    enabled: enabled && Boolean(centralTenantId),
    ...restOptions,
  });

  return ({
    locations: data?.locations || DEFAULT_DATA,
    isFetching,
    isLoading,
  });
};
