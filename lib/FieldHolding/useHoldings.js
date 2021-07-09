import { useQuery } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { LIMIT_MAX } from '../constants';

export const useHoldings = (instanceId, options = {}) => {
  const ky = useOkapiKy();
  const searchParams = { query: `instanceId==${instanceId}`, limit: LIMIT_MAX };

  const query = useQuery(
    ['holdings-storage/holdings', options],
    () => ky.get('holdings-storage/holdings', { searchParams, ...options }).json(),
  );

  return ({
    holdings: query.data?.holdingsRecords ?? [],
    ...query,
  });
};
