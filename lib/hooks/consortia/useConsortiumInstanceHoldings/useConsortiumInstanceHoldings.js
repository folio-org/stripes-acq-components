import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
  useStripes,
} from '@folio/stripes/core';

import { SEARCH_API } from '../../../constants';
import { getConsortiumCentralTenantId } from '../../../utils';

const DEFAULT_DATA = [];

export const useConsortiumInstanceHoldings = (instanceId, options = {}) => {
  const stripes = useStripes();
  const centralTenantId = getConsortiumCentralTenantId(stripes);

  const {
    searchParams: searchParamsOption = {},
    enabled: enabledOption = true,
    ...restOptions
  } = options;

  const ky = useOkapiKy({ tenant: centralTenantId });
  const [namespace] = useNamespace({ key: 'search-tenants-holdings-by-instance-id' });

  const searchParams = {
    instanceId,
    ...searchParamsOption,
  };

  const { data, ...rest } = useQuery({
    queryKey: [namespace, centralTenantId, instanceId, ...Object.values(searchParams)],
    queryFn: () => ky.get(`${SEARCH_API}/consortium/holdings`, { searchParams }).json(),
    enabled: Boolean(enabledOption && centralTenantId && instanceId),
    ...restOptions,
  });

  return {
    holdings: data?.holdings || DEFAULT_DATA,
    totalRecords: data?.totalRecords,
    ...rest,
  };
};
