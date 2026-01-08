import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import { fetchTenantAddresses } from '../../utils/api';

const DEFAULT_DATA = [];

export const useAddresses = (options = {}) => {
  const {
    enabled = true,
    tenantId,
    ...queryOptions
  } = options;

  const [namespace] = useNamespace({ key: 'tenant-addresses' });
  const ky = useOkapiKy({ tenant: tenantId });

  const { data, ...rest } = useQuery({
    queryKey: [namespace, tenantId],
    queryFn: ({ signal }) => fetchTenantAddresses(ky)({ signal }),
    enabled,
    ...queryOptions,
  });

  return ({
    addresses: data?.addresses || DEFAULT_DATA,
    totalRecords: data?.totalRecords || 0,
    ...rest,
  });
};
