import { useQuery } from 'react-query';

import {
  useOkapiKy,
  useNamespace,
} from '@folio/stripes/core';

import { LIMIT_MAX } from '../../constants';
import { fetchFiscalYears } from '../../utils/api';

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
    queryFn: ({ signal }) => fetchFiscalYears(ky)({ searchParams, signal }),
    ...options,
  });

  return ({
    fiscalYears: data?.fiscalYears || INITIAL_DATA,
    totalRecords: data?.totalRecords,
    ...rest,
  });
};
