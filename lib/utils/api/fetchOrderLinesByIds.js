import { batchRequest } from '../batchFetch';
import { fetchOrderLines } from './fetchOrderLines';

export const fetchOrderLinesByIds = (httpClient) => {
  return (ids, options) => {
    const requestFn = ({ params }) => {
      return fetchOrderLines(httpClient)({ ...options, searchParams: params });
    };

    return batchRequest(requestFn, ids).then((responses) => {
      return responses.reduce((acc, response) => {
        return {
          poLines: acc.poLines.concat(response.poLines),
          totalRecords: acc.totalRecords + response.totalRecords,
        };
      }, { poLines: [], totalRecords: 0 });
    });
  };
};
