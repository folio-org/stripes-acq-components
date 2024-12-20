import { useQuery } from 'react-query';

import { useOkapiKy, useNamespace } from '@folio/stripes/core';

import { HOLDINGS_API } from '../../constants';
import { batchRequest } from '../../utils';

export const useLineHoldings = (holdingIds) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'line-holdings' });

  const query = useQuery(
    [namespace, holdingIds],
    ({ signal }) => {
      return batchRequest(
        ({ params: searchParams }) => ky.get(HOLDINGS_API, { searchParams, signal }).json(),
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
