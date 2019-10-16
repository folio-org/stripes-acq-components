import {
  chunk,
  flatten,
} from 'lodash';

import { LIMIT_MAX } from '../constants';

// eslint-disable-next-line import/prefer-default-export
export const batchFetch = (mutator, items, buildQuery) => {
  mutator.reset();

  if (!items.length) return Promise.resolve([]);

  const batchRequests = chunk(items, 25).map(itemsChunk => {
    const query = buildQuery(itemsChunk);

    if (!query) return Promise.resolve([]);

    const params = {
      limit: LIMIT_MAX,
      query,
    };

    return mutator.GET({ params });
  });

  return Promise.all(batchRequests)
    .then((responses) => flatten(responses));
};
