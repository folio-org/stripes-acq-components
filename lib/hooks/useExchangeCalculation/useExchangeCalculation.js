import debounce from 'lodash/debounce';
import isUndefined from 'lodash/isUndefined';
import omitBy from 'lodash/omitBy';
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
    operationMode,
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
    operationMode,
    rate: rate || exchangeRate,
    to,
  });

  const debounceSetSearchParams = useMemo(() => {
    return debounce(() => {
      setSearchParams({
        amount,
        from,
        manual: Boolean(rate),
        operationMode,
        rate: rate || exchangeRate,
        to,
      });
    }, DEBOUNCE_DELAY);
  }, [amount, from, operationMode, rate, to, exchangeRate]);

  useEffect(() => {
    debounceSetSearchParams();

    return () => debounceSetSearchParams.cancel();
  }, [amount, debounceSetSearchParams, from, rate, to, exchangeRate]);

  const {
    amount: amountProp,
    from: fromProp,
    manual,
    operationMode: operationModeParam,
    rate: rateProp,
    to: toProp,
  } = searchParams;

  const { data, ...rest } = useQuery({
    queryKey: [namespace, amountProp, fromProp, rateProp, toProp, manual, operationModeParam],
    queryFn: ({ signal }) => fetchCalculateExchange(ky)({ searchParams: omitBy(searchParams, isUndefined), signal }),
    enabled: enabled && Boolean(amountProp && fromProp && rateProp && toProp),
    keepPreviousData: true,
    ...queryOptions,
  });

  return ({
    exchangedAmount: data,
    ...rest,
  });
};
