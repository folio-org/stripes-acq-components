import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import {
  IDENTIFIER_TYPES_API,
  LIMIT_MAX,
} from '../../constants';

const DEFAULT_DATA = [];

export const useIdentifierTypes = (options = {}) => {
  const {
    tenantId,
    ...queryOptions
  } = options;

  const ky = useOkapiKy({ tenant: tenantId });
  const [namespace] = useNamespace({ key: 'identifier-types' });

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
    queryFn: ({ signal }) => ky.get(IDENTIFIER_TYPES_API, { searchParams, signal }).json(),
    ...queryOptions,
  });

  return {
    identifierTypes: data?.identifierTypes || DEFAULT_DATA,
    totalRecords: data?.totalRecords,
    isFetching,
    isLoading,
  };
};
