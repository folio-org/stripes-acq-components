import { ORDERS_API } from '../../constants';

export const fetchOrders = (httpClient) => async (options) => {
  return httpClient.get(ORDERS_API, options).json();
};
