import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import { LIMIT_MAX_EXTENDED } from '../../constants';
import { fetchFunds } from '../../utils';

const DEFAULT_DATA = [];

export const useFunds = (options = {}) => {
  const {
    enabled = true,
    tenantId,
    ...queryOptions
  } = options;

  const ky = useOkapiKy({ tenant: tenantId });
  const [namespace] = useNamespace({ key: 'funds' });

  const searchParams = {
    limit: LIMIT_MAX_EXTENDED,
    query: 'cql.allRecords=1 sortby name',
  };

  const {
    data,
    isFetching,
    isLoading,
  } = useQuery({
    queryKey: [namespace],
    queryFn: ({ signal }) => fetchFunds(ky)({ searchParams, signal }),
    enabled,
    ...queryOptions,
  });

  return ({
    funds: data?.funds || DEFAULT_DATA,
    totalRecords: data?.totalRecords,
    isFetching,
    isLoading,
  });
};
