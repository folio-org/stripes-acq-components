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

// eslint-disable-next-line import/prefer-default-export
export const batchFetch = (mutator, items, buildQuery = buildQueryByIds, _params = {}, filterParamName = 'query') => {
  mutator.reset();

  if (!items?.length) return Promise.resolve([]);

  const batchRequests = chunk(items, 25).map(itemsChunk => {
    const query = buildQuery(itemsChunk);

    if (!query) return Promise.resolve([]);

    const params = {
      limit: LIMIT_MAX,
      ..._params,
      [filterParamName]: query,
    };

    return mutator.GET({ params });
  });

  return Promise.all(batchRequests)
    .then((responses) => flatten(responses));
};
