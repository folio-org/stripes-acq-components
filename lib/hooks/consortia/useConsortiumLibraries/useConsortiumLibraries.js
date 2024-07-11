import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
  useStripes,
} from '@folio/stripes/core';

import {
  CONSORTIUM_LIBRARIES_API,
  LIMIT_MAX_EXTENDED,
} from '../../../constants';
import { getConsortiumCentralTenantId } from '../../../utils';

const DEFAULT_DATA = [];

export const useConsortiumLibraries = (options = {}) => {
  const {
    tenantId,
    enabled = true,
    ...queryOptions
  } = options;

  const stripes = useStripes();
  const centralTenantId = getConsortiumCentralTenantId(stripes);
  const ky = useOkapiKy({ tenant: centralTenantId });
  const [namespace] = useNamespace({ key: 'location-units-libraries' });

  const searchParams = {
    limit: LIMIT_MAX_EXTENDED,
    ...(tenantId ? { tenantId } : {}),
  };

  const {
    data,
    isFetching,
    isLoading,
  } = useQuery({
    queryKey: [namespace, tenantId, centralTenantId],
    queryFn: ({ signal }) => ky.get(CONSORTIUM_LIBRARIES_API, { searchParams, signal }).json(),
    enabled: enabled && Boolean(centralTenantId),
    ...queryOptions,
  });

  return {
    libraries: data?.libraries || DEFAULT_DATA,
    totalRecords: data?.totalRecords,
    isFetching,
    isLoading,
  };
};
