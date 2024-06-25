import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import { ACQUISITION_METHODS_API } from '../../constants';

const DEFAULT_DATA = [];

export const useAcquisitionMethods = (options = {}) => {
  const {
    enabled = true,
    tenantId,
    ...queryOptions
  } = options;

  const [namespace] = useNamespace({ key: 'acquisition-methods' });
  const ky = useOkapiKy({ tenant: tenantId });

  const searchParams = {
    query: 'cql.allRecords=1 sortby value',
  };

  const {
    data,
    isFetching,
    isLoading,
  } = useQuery({
    queryKey: [namespace, tenantId],
    queryFn: ({ signal }) => ky.get(ACQUISITION_METHODS_API, { searchParams, signal }).json(),
    enabled,
    ...queryOptions,
  });

  return ({
    acquisitionMethods: data?.acquisitionMethods || DEFAULT_DATA,
    isFetching,
    isLoading,
  });
};
