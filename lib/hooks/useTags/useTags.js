import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import { TAGS_API } from '../../constants';

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
  };

  const {
    data,
    isFetching,
    isLoading,
  } = useQuery({
    queryKey: [namespace, tenantId],
    queryFn: ({ signal }) => ky.get(TAGS_API, { searchParams, signal }).json(),
    enabled,
    ...queryOptions,
  });

  return ({
    tags: data?.tags || DEFAULT_DATA,
    isFetching,
    isLoading,
  });
};
