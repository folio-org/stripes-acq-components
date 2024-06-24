import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import { ACQUISITIONS_UNIT_MEMBERSHIPS_API, LIMIT_MAX } from '../../../constants';

const DEFAULT_DATA = [];

export const useAcqUnitsMemberships = (userId, options = {}) => {
  const {
    enabled = true,
    tenantId,
    ...queryOptions
  } = options;

  const [namespace] = useNamespace({ key: 'acquisitions-units-memberships' });
  const ky = useOkapiKy({ tenant: tenantId });

  const searchParams = {
    limit: LIMIT_MAX,
    query: `userId==${userId}`,
  };

  const {
    data,
    isFetching,
    isLoading,
  } = useQuery({
    queryKey: [namespace, tenantId, userId],
    queryFn: ({ signal }) => ky.get(ACQUISITIONS_UNIT_MEMBERSHIPS_API, { searchParams, signal }).json(),
    enabled: enabled && Boolean(userId),
    ...queryOptions,
  });

  return ({
    acquisitionsUnitMemberships: data?.acquisitionsUnitMemberships || DEFAULT_DATA,
    isFetching,
    isLoading,
  });
};
