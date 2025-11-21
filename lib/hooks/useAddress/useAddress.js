import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import { SETTINGS_ENTRIES_API } from '../../constants';

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
      return ky.get(`${SETTINGS_ENTRIES_API}/${addressId}`, { signal })
        .json()
        .then((res) => ({
          address: res.value?.address,
          id: res.id,
          key: res.key,
          metadata: res.metadata,
          name: res.value?.name,
          scope: res.scope,
        }));
    },
    enabled: enabled && Boolean(addressId),
    ...queryOptions,
  });

  return {
    address: data,
    ...rest,
  };
};
