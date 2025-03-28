import { EXCHANGE_RATE_SOURCE_API } from '../../constants';

export const fetchExchangeRateSource = (httpClient) => async (options) => {
  return httpClient.get(EXCHANGE_RATE_SOURCE_API, options).json();
};
