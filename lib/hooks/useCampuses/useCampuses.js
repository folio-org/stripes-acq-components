import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import {
  CAMPUSES_API,
  LIMIT_MAX_EXTENDED,
} from '../../constants';

const DEFAULT_DATA = [];

export const useCampuses = (options = {}) => {
  const { tenantId, ...restOptions } = options;
  const ky = useOkapiKy({ tenant: tenantId });
  const [namespace] = useNamespace({ key: 'location-units-campuses' });

  const searchParams = {
    limit: LIMIT_MAX_EXTENDED,
    query: 'cql.allRecords=1 sortby name',
  };

  const {
    data,
    isFetching,
    isLoading,
  } = useQuery({
    queryKey: [namespace, tenantId],
    queryFn: ({ signal }) => ky.get(CAMPUSES_API, { searchParams, signal }).json(),
    ...restOptions,
  });

  return {
    campuses: data?.loccamps || DEFAULT_DATA,
    totalRecords: data?.totalRecords,
    isFetching,
    isLoading,
  };
};
