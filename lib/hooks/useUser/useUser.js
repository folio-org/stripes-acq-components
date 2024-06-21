import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import { USERS_API } from '../../constants';

const DEFAULT_DATA = {};

export const useUser = (userId, options = {}) => {
  const {
    enabled = true,
    tenantId,
    ...queryOptions
  } = options;

  const [namespace] = useNamespace({ key: 'user' });
  const ky = useOkapiKy({ tenant: tenantId });

  const {
    data = DEFAULT_DATA,
    isFetching,
    isLoading,
  } = useQuery(
    [namespace, userId, tenantId],
    ({ signal }) => ky.get(`${USERS_API}/${userId}`, { signal }).json(),
    {
      enabled: enabled && Boolean(userId),
      ...queryOptions,
    },
  );

  return ({
    user: data,
    isFetching,
    isLoading,
  });
};
