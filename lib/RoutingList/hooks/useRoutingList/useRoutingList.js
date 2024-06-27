import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import { ROUTING_LIST_API } from '../../../constants';

const DEFAULT_ROUTING_LIST = {};

export const useRoutingList = (routingListId, options = {}) => {
  const {
    enabled = true,
    tenantId,
    ...otherOptions
  } = options;
  const ky = useOkapiKy({ tenantId });
  const [namespace] = useNamespace();

  const {
    data = DEFAULT_ROUTING_LIST,
    isLoading,
  } = useQuery(
    [namespace, routingListId, tenantId],
    async ({ signal }) => ky.get(`${ROUTING_LIST_API}/${routingListId}`, { signal }).json(),
    {
      enabled: Boolean(enabled && routingListId),
      ...otherOptions,
    },
  );

  return ({
    isLoading,
    routingList: data,
  });
};
