import {
  get,
  uniq,
  keyBy,
} from 'lodash';
import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import {
  LIMIT_MAX,
  ROUTING_LIST_API,
  USERS_API,
} from '../../../constants';
import { batchRequest } from '../../../utils';

const DEFAULT_DATA = [];

function getFullName(user) {
  const lastName = get(user, 'personal.lastName', '');
  const firstName = get(user, 'personal.firstName', '');

  if (lastName && firstName) {
    return `${lastName} ${firstName}`;
  }

  return user.personal.lastName;
}

export const useRoutingLists = (poLineId) => {
  const ky = useOkapiKy();
  const namespace = useNamespace({ key: 'fetch-routing-list' });

  const { isFetching, isLoading, data } = useQuery({
    queryKey: [namespace, poLineId],
    queryFn: async () => {
      const searchParams = {
        limit: LIMIT_MAX,
        query: `poLineId==${poLineId}`,
      };

      const { routingLists: routingListRes } = await ky.get(ROUTING_LIST_API, { searchParams }).json();

      const assignedUserIds = uniq(routingListRes.flatMap(({ userIds }) => userIds));

      const users = await batchRequest(
        ({ params }) => ky.get(USERS_API, { searchParams: params }).json(),
        assignedUserIds,
      ).then(responses => responses.flatMap((response) => response.users));

      const usersMap = keyBy(users, 'id');

      return routingListRes.map((routingList) => ({
        ...routingList,
        userIds: routingList.userIds.map((userId) => getFullName(usersMap[userId])),
      }));
    },
  });

  return ({
    routingLists: data || DEFAULT_DATA,
    isLoading,
    isFetching,
  });
};