import { useQuery } from 'react-query';

import {
  useOkapiKy,
  useNamespace,
} from '@folio/stripes/core';

import {
  FISCAL_YEARS_API,
  LIMIT_MAX,
} from '../../constants';

const INITIAL_DATA = [];

export const useFiscalYears = (options = {}) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'fiscal-years' });

  const searchParams = {
    limit: LIMIT_MAX,
    query: 'cql.allRecords=1 sortby periodStart',
  };

  const { data, ...rest } = useQuery({
    queryKey: [namespace],
    queryFn: ({ signal }) => ky.get(FISCAL_YEARS_API, { searchParams, signal }).json(),
    ...options,
  });

  return ({
    fiscalYears: data?.fiscalYears || INITIAL_DATA,
    totalRecords: data?.totalRecords,
    ...rest,
  });
};
