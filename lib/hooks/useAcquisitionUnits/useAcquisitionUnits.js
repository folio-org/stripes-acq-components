import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import {
  ACQUISITIONS_UNITS_API,
  LIMIT_MAX,
} from '../../constants';

const DEFAULT_DATA = [];

export const useAcquisitionUnits = (options = {}) => {
  const {
    enabled = true,
    searchParams: searchParamsOption = {},
    tenantId,
    ...queryOptions
  } = options;

  const [namespace] = useNamespace({ key: 'acquisitions-units' });
  const ky = useOkapiKy({ tenant: tenantId });

  const searchParams = {
    query: 'cql.allRecords=1 sortby name',
    limit: LIMIT_MAX,
    ...searchParamsOption,
  };

  const {
    data,
    isFetching,
    isLoading,
  } = useQuery({
    queryKey: [namespace, tenantId, ...Object.values(searchParams)],
    queryFn: ({ signal }) => ky.get(ACQUISITIONS_UNITS_API, { searchParams, signal }).json(),
    enabled,
    ...queryOptions,
  });

  return ({
    acquisitionsUnits: data?.acquisitionsUnits || DEFAULT_DATA,
    isFetching,
    isLoading,
  });
};
