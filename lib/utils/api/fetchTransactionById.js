import { TRANSACTIONS_API } from '../../constants';

export const fetchTransactionById = (httpClient) => async (transactionId, options) => {
  return httpClient.get(`${TRANSACTIONS_API}/${transactionId}`, options).json();
};
