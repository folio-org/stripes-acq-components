import { useQuery } from 'react-query';

import { useOkapiKy, useNamespace } from '@folio/stripes/core';

import { batchRequest } from '../../utils';

export const useLineHoldings = (holdingIds) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'line-holdings' });

  const query = useQuery(
    [namespace, holdingIds],
    () => {
      return batchRequest(
        ({ params: searchParams }) => ky.get('holdings-storage/holdings', { searchParams }).json(),
        holdingIds,
      );
    },
    { enabled: Boolean(holdingIds.length) },
  );

  return ({
    holdings: query.data?.[0]?.holdingsRecords ?? [],
    ...query,
  });
};
