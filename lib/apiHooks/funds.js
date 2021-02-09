import queryString from 'query-string';
import { useQuery } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import {
  DICT_FUNDS,
  FUNDS_API,
} from '../constants';
import { fetchAllRecords } from '../utils';

export const useAllFunds = (key = DICT_FUNDS) => {
  const ky = useOkapiKy();

  const { isLoading, data } = useQuery({
    queryKey: key,
    queryFn: () => fetchAllRecords(
      {
        GET: async ({ params }) => {
          const path = typeof params === 'object' ? `${FUNDS_API}?${queryString.stringify(params)}` : FUNDS_API;
          const { funds } = await ky.get(path).json();

          return funds;
        },
      },
      'cql.allRecords=1 sortby name',
    ),
  });

  return {
    isLoading,
    funds: data,
  };
};
