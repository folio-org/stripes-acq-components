import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import {
  CONTRIBUTOR_NAME_TYPES_API,
  LIMIT_MAX,
} from '../../constants';

const DEFAULT_DATA = [];

export const useContributorNameTypes = (options = {}) => {
  const { tenantId, ...queryOptions } = options;

  const ky = useOkapiKy({ tenant: tenantId });
  const [namespace] = useNamespace({ key: 'contributor-name-types' });

  const searchParams = {
    limit: LIMIT_MAX,
    query: 'cql.allRecords=1 sortby name',
  };

  const {
    data,
    isFetching,
    isLoading,
  } = useQuery({
    queryKey: [namespace, tenantId],
    queryFn: ({ signal }) => ky.get(CONTRIBUTOR_NAME_TYPES_API, { searchParams, signal }).json(),
    ...queryOptions,
  });

  return {
    contributorNameTypes: data?.contributorNameTypes || DEFAULT_DATA,
    totalRecords: data?.totalRecords,
    isFetching,
    isLoading,
  };
};
