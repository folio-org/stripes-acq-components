import { batchRequest } from '../batchFetch';
import { fetchOrders } from './fetchOrders';

export const fetchOrdersByIds = (httpClient) => {
  return (ids, options) => {
    const requestFn = ({ params }) => {
      return fetchOrders(httpClient)({ ...options, searchParams: params });
    };

    return batchRequest(requestFn, ids).then((responses) => {
      return responses.reduce((acc, response) => {
        return {
          purchaseOrders: acc.purchaseOrders.concat(response.purchaseOrders),
          totalRecords: acc.totalRecords + response.totalRecords,
        };
      }, { purchaseOrders: [], totalRecords: 0 });
    });
  };
};
