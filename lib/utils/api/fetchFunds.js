import { FUNDS_API } from '../../constants';

export const fetchFunds = (httpClient) => async (options) => {
  return httpClient.get(FUNDS_API, options).json();
};
