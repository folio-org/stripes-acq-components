import { useQuery } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import {
  HOLDINGS_API,
  LIMIT_MAX,
} from '../../constants';

const DEFAULT_DATA = [];

export const useInstanceHoldings = (instanceId, options = {}) => {
  const ky = useOkapiKy();

  const { enabled = true, ...queryOptions } = options;

  const searchParams = {
    query: `instanceId==${instanceId}`,
    limit: LIMIT_MAX,
  };

  const { data, ...rest } = useQuery({
    queryKey: [instanceId],
    queryFn: () => ky.get(HOLDINGS_API, { searchParams }).json(),
    enabled: enabled && Boolean(instanceId),
    ...queryOptions,
  });

  return ({
    holdings: data?.holdingsRecords || DEFAULT_DATA,
    totalRecords: data?.totalRecords,
    ...rest,
  });
};
