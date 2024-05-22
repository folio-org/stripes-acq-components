import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import { ROUTING_LIST_API } from '../../../constants';

const DEFAULT_ROUTING_LIST = {};

export const useRoutingList = (routingListId, options = {}) => {
  const { enabled = true, ...otherOptions } = options;
  const ky = useOkapiKy();
  const [namespace] = useNamespace();

  const {
    data = DEFAULT_ROUTING_LIST,
    isLoading,
  } = useQuery(
    [namespace, routingListId],
    async () => ky.get(`${ROUTING_LIST_API}/${routingListId}`).json(),
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
