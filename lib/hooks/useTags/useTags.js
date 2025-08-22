import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import {
  LIMIT_MAX,
  TAGS_API,
} from '../../constants';

const DEFAULT_DATA = [];

export const useTags = (options = {}) => {
  const {
    enabled = true,
    tenantId,
    ...queryOptions
  } = options;

  const [namespace] = useNamespace({ key: 'tags' });
  const ky = useOkapiKy({ tenant: tenantId });

  const searchParams = {
    query: 'cql.allRecords=1 sortby label',
    limit: LIMIT_MAX,
  };

  const {
    data,
    isFetching,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [namespace, tenantId],
    queryFn: ({ signal }) => ky.get(TAGS_API, { searchParams, signal }).json(),
    enabled,
    ...queryOptions,
  });

  return ({
    isFetching,
    isLoading,
    refetch,
    tags: data?.tags || DEFAULT_DATA,
  });
};
