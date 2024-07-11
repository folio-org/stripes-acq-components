import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
  useStripes,
} from '@folio/stripes/core';

import {
  CONSORTIUM_CAMPUSES_API,
  LIMIT_MAX_EXTENDED,
} from '../../../constants';

const DEFAULT_DATA = [];

export const useConsortiumCampuses = (options = {}) => {
  const {
    tenantId,
    enabled = true,
    ...queryOptions
  } = options;

  const stripes = useStripes();
  const centralTenantId = getConsortiumCentralTenantId(stripes);
  const ky = useOkapiKy({ tenant: centralTenantId });
  const [namespace] = useNamespace({ key: 'location-units-campuses' });

  const searchParams = {
    limit: LIMIT_MAX_EXTENDED,
    ...(tenantId ? { tenantId } : {}),
  };

  const {
    data,
    isFetching,
    isLoading,
  } = useQuery({
    queryKey: [namespace, centralTenantId, tenantId],
    queryFn: ({ signal }) => ky.get(CONSORTIUM_CAMPUSES_API, { searchParams, signal }).json(),
    enabled: enabled && Boolean(centralTenantId),
    ...queryOptions,
  });

  return {
    campuses: data?.campuses || DEFAULT_DATA,
    totalRecords: data?.totalRecords,
    isFetching,
    isLoading,
  };
};
