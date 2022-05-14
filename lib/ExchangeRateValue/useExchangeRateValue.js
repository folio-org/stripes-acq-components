import { useQuery } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { EXCHANGE_RATE_API } from '../constants';

export const useExchangeRateValue = (exchangeFrom, exchangeTo, manualExchangeRate) => {
  const ky = useOkapiKy();

  const searchParams = {
    from: exchangeFrom,
    to: exchangeTo,
  };

  const { isLoading, data } = useQuery(
    ['exchange-rate-value', searchParams],
    () => ky.get(`${EXCHANGE_RATE_API}`, { searchParams }).json(),
    { enabled: Boolean(exchangeFrom) && !manualExchangeRate },
  );

  return ({
    exchangeRate: manualExchangeRate || data?.exchangeRate,
    isLoading,
  });
};
