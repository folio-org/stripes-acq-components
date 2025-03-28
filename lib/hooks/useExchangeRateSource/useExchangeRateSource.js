import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import { fetchExchangeRateSource } from '../../utils/api';

export const useExchangeRateSource = (options = {}) => {
  const {
    enabled = true,
    tenantId,
    ...queryOptions
  } = options;

  const ky = useOkapiKy({ tenant: tenantId });
  const [namespace] = useNamespace({ key: 'exchange-rate-source' });

  const {
    data,
    isFetching,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [namespace, tenantId],
    queryFn: ({ signal }) => fetchExchangeRateSource(ky)({ signal }),
    enabled,
    ...queryOptions,
  });

  return ({
    exchangeRateSource: data,
    isFetching,
    isLoading,
    refetch,
  });
};
