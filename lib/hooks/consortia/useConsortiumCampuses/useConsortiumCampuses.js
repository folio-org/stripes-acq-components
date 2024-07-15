import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
  useStripes,
} from '@folio/stripes/core';

import {
  CONSORTIUM_CAMPUSES_API,
  LIMIT_MAX,
} from '../../../constants';
import { getConsortiumCentralTenantId } from '../../../utils';

const DEFAULT_DATA = [];

export const useConsortiumCampuses = (options = {}) => {
  const {
    enabled = true,
    tenantId,
    ...queryOptions
  } = options;

  const stripes = useStripes();
  const centralTenantId = getConsortiumCentralTenantId(stripes);
  const [namespace] = useNamespace({ key: 'location-units-campuses' });
  const ky = useOkapiKy({ tenant: centralTenantId });

  const searchParams = {
    limit: LIMIT_MAX,
    ...(tenantId ? { tenantId } : {}),
  };

  const {
    data,
    isFetching,
    isLoading,
  } = useQuery({
    queryKey: [namespace, tenantId, centralTenantId],
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
