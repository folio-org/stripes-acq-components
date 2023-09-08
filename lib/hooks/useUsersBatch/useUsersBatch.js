import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import { USERS_API } from '../../constants';
import { batchRequest } from '../../utils';

const DEFAULT_USERS_BY_IDS = [];

export const useUsersBatch = (userIds) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'users' });

  const {
    data,
    isLoading,
  } = useQuery(
    [namespace, userIds],
    async () => {
      const response = await batchRequest(
        ({ params: searchParams }) => ky.get(USERS_API, { searchParams }).json(),
        userIds,
      );

      return response.flatMap(({ users }) => users);
    },
    { enabled: Boolean(userIds?.length) },
  );

  return {
    users: data || DEFAULT_USERS_BY_IDS,
    isLoading,
  };
};
