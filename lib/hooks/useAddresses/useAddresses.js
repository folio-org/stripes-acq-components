import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import {
  CONFIG_API,
  LIMIT_MAX,
} from '../../constants';
import { getAddresses } from '../../utils';

const MODULE_TENANT = 'TENANT';
const CONFIG_ADDRESSES = 'tenant.addresses';
const DEFAULT_DATA = [];

export const useAddresses = (options = {}) => {
  const {
    enabled = true,
    tenantId,
    ...queryOptions
  } = options;

  const [namespace] = useNamespace({ key: 'acquisitions-units' });
  const ky = useOkapiKy({ tenant: tenantId });

  const searchParams = {
    query: `(module=${MODULE_TENANT} and configName=${CONFIG_ADDRESSES})`,
    limit: LIMIT_MAX,
  };

  const {
    data,
    isFetching,
    isLoading,
  } = useQuery({
    queryKey: [namespace, tenantId],
    queryFn: ({ signal }) => {
      return ky.get(CONFIG_API, { searchParams, signal })
        .json()
        .then(({ configs, totalRecords }) => ({
          addresses: getAddresses(configs),
          totalRecords,
        }));
    },
    enabled,
    ...queryOptions,
  });

  return ({
    addresses: data?.addresses || DEFAULT_DATA,
    totalRecords: data?.totalRecords || 0,
    isFetching,
    isLoading,
  });
};
