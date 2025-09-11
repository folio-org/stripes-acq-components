import { EXCHANGE_RATE_API } from '../../constants';

export const fetchExchangeRateValue = (httpClient) => async (options) => {
  return httpClient.get(EXCHANGE_RATE_API, options).json();
};
