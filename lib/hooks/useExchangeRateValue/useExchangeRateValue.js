import { useQuery } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { fetchExchangeRateValue } from '../../utils/api';

export const useExchangeRateValue = (exchangeFrom, exchangeTo, manualExchangeRate, options = {}) => {
  const {
    enabled = true,
    tenantId,
    ...queryOptions
  } = options;

  const ky = useOkapiKy({ tenant: tenantId });

  const searchParams = {
    from: exchangeFrom,
    to: exchangeTo,
  };

  const { data, ...rest } = useQuery({
    queryKey: ['exchange-rate-value', ...Object.values(searchParams)],
    queryFn: ({ signal }) => fetchExchangeRateValue(ky)({ searchParams, signal }),
    enabled: (
      enabled
      && Boolean(exchangeFrom)
      && !manualExchangeRate
    ),
    ...queryOptions,
  });

  return ({
    exchangeRate: manualExchangeRate || data?.exchangeRate,
    ...rest,
  });
};
