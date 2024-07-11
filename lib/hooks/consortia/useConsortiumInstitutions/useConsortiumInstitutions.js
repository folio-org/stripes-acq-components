import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
  useStripes,
} from '@folio/stripes/core';

import {
  CONSORTIUM_INSTITUTIONS_API,
  LIMIT_MAX_EXTENDED,
} from '../../../constants';
import { getConsortiumCentralTenantId } from '../../../utils';

const DEFAULT_DATA = [];

export const useConsortiumInstitutions = (options = {}) => {
  const {
    tenantId,
    enabled = true,
    ...queryOptions
  } = options;

  const stripes = useStripes();
  const centralTenantId = getConsortiumCentralTenantId(stripes);
  const ky = useOkapiKy({ tenant: centralTenantId });
  const [namespace] = useNamespace({ key: 'location-units-institutions' });

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
    queryFn: ({ signal }) => ky.get(CONSORTIUM_INSTITUTIONS_API, { searchParams, signal }).json(),
    enabled: enabled && Boolean(centralTenantId),
    ...queryOptions,
  });

  return {
    institutions: data?.institutions || DEFAULT_DATA,
    totalRecords: data?.totalRecords,
    isFetching,
    isLoading,
  };
};
