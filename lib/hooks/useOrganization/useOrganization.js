import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import { VENDORS_API } from '../../constants';

export const useOrganization = (id, options = {}) => {
  const {
    enabled = true,
    tenantId,
    ...queryOptions
  } = options;

  const ky = useOkapiKy({ tenant: tenantId });
  const [namespace] = useNamespace({ key: 'organization' });

  const {
    data,
    isFetching,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [namespace, id, tenantId],
    queryFn: ({ signal }) => ky.get(`${VENDORS_API}/${id}`, { signal }).json(),
    enabled: enabled && Boolean(id),
    ...queryOptions,
  });

  return ({
    organization: data,
    isFetching,
    isLoading,
    refetch,
  });
};
