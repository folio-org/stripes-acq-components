import { TRANSACTIONS_API } from '../../constants';

export const fetchTransactions = (httpClient) => async (options) => {
  return httpClient.get(TRANSACTIONS_API, options).json();
};
