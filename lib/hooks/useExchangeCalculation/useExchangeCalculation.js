import debounce from 'lodash/debounce';
import {
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';

import { fetchCalculateExchange } from '../../utils/api';
import { useExchangeRateValue } from '../useExchangeRateValue';

const DEBOUNCE_DELAY = 500;

export const useExchangeCalculation = (params = {}, options = {}) => {
  const {
    amount,
    from,
    rate,
    to,
  } = params;

  const {
    enabled = true,
    tenantId,
    ...queryOptions
  } = options;

  const ky = useOkapiKy({ tenant: tenantId });
  const [namespace] = useNamespace({ key: 'exchange-calculation' });

  const { exchangeRate } = useExchangeRateValue(from, to, rate);

  const [searchParams, setSearchParams] = useState({
    amount,
    from,
    manual: Boolean(rate),
    rate: rate || exchangeRate,
    to,
  });

  const debounceSetSearchParams = useMemo(() => {
    return debounce(() => {
      setSearchParams({
        amount,
        from,
        manual: Boolean(rate),
        rate: rate || exchangeRate,
        to,
      });
    }, DEBOUNCE_DELAY);
  }, [amount, from, rate, to, exchangeRate]);

  useEffect(() => {
    debounceSetSearchParams();

    return () => debounceSetSearchParams.cancel();
  }, [amount, debounceSetSearchParams, from, rate, to, exchangeRate]);

  const {
    amount: amountProp,
    from: fromProp,
    rate: rateProp,
    to: toProp,
    manual,
  } = searchParams;

  const { data, ...rest } = useQuery({
    queryKey: [namespace, amountProp, fromProp, rateProp, toProp, manual],
    queryFn: ({ signal }) => fetchCalculateExchange(ky)({ searchParams, signal }),
    enabled: enabled && Boolean(amountProp && fromProp && rateProp && toProp),
    keepPreviousData: true,
    ...queryOptions,
  });

  return ({
    exchangedAmount: data,
    ...rest,
  });
};
