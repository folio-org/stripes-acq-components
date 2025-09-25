import { batchRequest } from '../batchFetch';
import { fetchTransactions } from './fetchTransactions';

export const fetchTransactionByIds = (httpClient) => {
  return (ids, options) => {
    const requestFn = ({ params }) => {
      return fetchTransactions(httpClient)({ ...options, searchParams: params });
    };

    return batchRequest(requestFn, ids).then((responses) => {
      return responses.reduce((acc, response) => {
        return {
          transactions: acc.transactions.concat(response.transactions),
          totalRecords: acc.totalRecords + response.totalRecords,
        };
      }, { transactions: [], totalRecords: 0 });
    });
  };
};
