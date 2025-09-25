import { batchRequest } from '../batchFetch';
import { fetchFunds } from './fetchFunds';

export const fetchFundByIds = (httpClient) => {
  return (ids, options) => {
    const requestFn = ({ params }) => {
      return fetchFunds(httpClient)({ ...options, searchParams: params });
    };

    return batchRequest(requestFn, ids).then((responses) => {
      return responses.reduce((acc, response) => {
        return {
          funds: acc.funds.concat(response.funds),
          totalRecords: acc.totalRecords + response.totalRecords,
        };
      }, { funds: [], totalRecords: 0 });
    });
  };
};
