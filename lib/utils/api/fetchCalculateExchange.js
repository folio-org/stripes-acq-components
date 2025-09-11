import { CALCULATE_EXCHANGE_API } from '../../constants';

export const fetchCalculateExchange = (httpClient) => async (options) => {
  return httpClient.get(CALCULATE_EXCHANGE_API, options).json();
};
