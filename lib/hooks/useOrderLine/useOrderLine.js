import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import { LINES_API } from '../../constants';

export const useOrderLine = (lineId, options = {}) => {
  const {
    enabled = true,
    tenantId,
    ...queryOptions
  } = options;

  const [namespace] = useNamespace({ key: 'purchase-order-line' });
  const ky = useOkapiKy({ tenant: tenantId });

  const {
    data,
    isFetching,
    isLoading,
  } = useQuery({
    queryKey: [namespace, lineId, tenantId],
    queryFn: ({ signal }) => ky.get(`${LINES_API}/${lineId}`, { signal }).json(),
    enabled: enabled && Boolean(lineId),
    ...queryOptions,
  });

  return ({
    orderLine: data,
    isFetching,
    isLoading,
  });
};
