import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import { USERS_API } from '../../constants';
import { batchRequest } from '../../utils';

const DEFAULT_USERS_BY_IDS = [];

export const useUsersBatch = (userIds, options = {}) => {
  const {
    enabled = true,
    tenantId,
    ...queryOptions
  } = options;

  const ky = useOkapiKy({ tenant: tenantId });
  const [namespace] = useNamespace({ key: 'users' });

  const {
    data,
    isLoading,
  } = useQuery(
    [namespace, userIds],
    async ({ signal }) => {
      const response = await batchRequest(
        ({ params: searchParams }) => ky.get(USERS_API, { searchParams, signal }).json(),
        userIds,
      );

      return response.flatMap(({ users }) => users);
    },
    {
      enabled: enabled && Boolean(userIds?.length),
      ...queryOptions,
    },
  );

  return {
    users: data || DEFAULT_USERS_BY_IDS,
    isLoading,
  };
};
