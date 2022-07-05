import { chunk } from 'lodash';

import { batchRequest } from './batchFetch';

export const fetchExportDataByIds = ({ ky, ids, buildQuery, api, records }) => {
  const batchedIds = chunk(ids, 50);

  return batchedIds.reduce((acc, nextBatch) => {
    return acc.then(prevResp => {
      return batchRequest(
        ({ params: searchParams }) => ky.get(api, { searchParams }).json().then((resp) => resp[records]),
        nextBatch,
        buildQuery,
      ).then(nextResp => ([...prevResp, ...nextResp]));
    });
  }, Promise.resolve([]));
};
