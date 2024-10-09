import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
  useStripes,
} from '@folio/stripes/core';

import {
  CONSORTIA_API,
  CONSORTIA_CONSORTIUM_TENANTS_API,
} from '../../../constants';

const DEFAULT_DATA = [];

export const useConsortiumTenants = (options = {}) => {
  const stripes = useStripes();
  const [namespace] = useNamespace({ key: 'consortium-tenants' });

  const consortium = stripes?.user?.user?.consortium;
  const {
    enabled: enabledOption = true,
    ...queryOptions
  } = options;

  const enabled = Boolean(
    consortium?.centralTenantId
    && consortium?.id
    && enabledOption,
  );

  const ky = useOkapiKy({ tenant: consortium?.centralTenantId });

  const {
    isFetching,
    isLoading,
    data,
    refetch,
  } = useQuery({
    queryKey: [namespace, consortium?.id],
    queryFn: ({ signal }) => ky.get(
      `${CONSORTIA_API}/${consortium.id}/${CONSORTIA_CONSORTIUM_TENANTS_API}?limit=1000`,
      { signal },
    ).json(),
    enabled,
    ...queryOptions,
  });

  return ({
    tenants: data?.tenants || DEFAULT_DATA,
    totalRecords: data?.totalRecords,
    isFetching,
    isLoading,
    refetch,
  });
};
