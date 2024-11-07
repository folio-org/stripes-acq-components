import { LINES_API } from '../../constants';

export const fetchOrderLines = (httpClient) => async (options) => {
  return httpClient.get(LINES_API, options).json();
};
