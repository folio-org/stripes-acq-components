import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import { LINES_API } from '../../constants';

export const useOrderLine = (lineId, options = {}) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'purchase-order-line' });

  const { enabled = true, ...queryOptions } = options;

  const {
    data,
    isFetching,
    isLoading,
  } = useQuery(
    [namespace, lineId],
    () => ky.get(`${LINES_API}/${lineId}`).json(),
    {
      enabled: enabled && Boolean(lineId),
      ...queryOptions,
    },
  );

  return ({
    orderLine: data,
    isFetching,
    isLoading,
  });
};
