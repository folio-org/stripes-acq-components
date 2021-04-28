import {
  chunk,
  flatten,
} from 'lodash';

import { LIMIT_MAX } from '../constants';

const buildQueryByIds = (itemsChunk) => {
  const query = itemsChunk
    .map(id => `id==${id}`)
    .join(' or ');

  return query || '';
};

export const batchRequest = (requestFn, items, buildQuery = buildQueryByIds, _params = {}, filterParamName = 'query') => {
  if (!items?.length) return Promise.resolve([]);

  const requests = chunk(items, 25).map(itemsChunk => {
    const query = buildQuery(itemsChunk);

    if (!query) return Promise.resolve([]);

    const params = {
      limit: LIMIT_MAX,
      ..._params,
      [filterParamName]: query,
    };

    return requestFn({ params });
  });

  return Promise.all(requests)
    .then((responses) => flatten(responses));
};

export const batchFetch = (mutator, items, buildQuery, _params, filterParamName) => {
  mutator.reset?.();

  return batchRequest(
    ({ params }) => mutator.GET({ params }),
    items,
    buildQuery,
    _params,
    filterParamName,
  );
};
