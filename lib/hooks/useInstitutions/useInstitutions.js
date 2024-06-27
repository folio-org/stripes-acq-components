import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import {
  INSTITUTIONS_API,
  LIMIT_MAX_EXTENDED,
} from '../../constants';

const DEFAULT_DATA = [];

export const useInstitutions = (options = {}) => {
  const { tenantId, ...restOptions } = options;

  const ky = useOkapiKy({ tenant: tenantId });
  const [namespace] = useNamespace({ key: 'location-units-institutions' });

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
    queryFn: ({ signal }) => ky.get(INSTITUTIONS_API, { searchParams, signal }).json(),
    ...restOptions,
  });

  return {
    institutions: data?.locinsts || DEFAULT_DATA,
    totalRecords: data?.totalRecords,
    isFetching,
    isLoading,
  };
};
