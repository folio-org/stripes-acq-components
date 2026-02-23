import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import { fetchTenantAddressById } from '../../utils';

export const useAddress = (addressId, options = {}) => {
  const {
    enabled = true,
    tenantId,
    ...queryOptions
  } = options;

  const [namespace] = useNamespace({ key: 'tenant-address' });
  const ky = useOkapiKy({ tenant: tenantId });

  const { data, ...rest } = useQuery({
    queryKey: [namespace, tenantId, addressId],
    queryFn: ({ signal }) => {
      return fetchTenantAddressById(ky)(addressId, { signal });
    },
    enabled: enabled && Boolean(addressId),
    ...queryOptions,
  });

  return {
    address: data,
    ...rest,
  };
};
