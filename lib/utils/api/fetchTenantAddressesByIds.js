import { batchRequest } from '../batchFetch';
import { fetchTenantAddresses } from './fetchTenantAddresses';

export const fetchTenantAddressesByIds = (httpClient) => {
  return async (ids, options) => {
    const requestFn = ({ params }) => {
      return fetchTenantAddresses(httpClient)({ ...options, searchParams: params });
    };

    const responses = await batchRequest(requestFn, ids);

    return responses.reduce((acc, response) => {
      return {
        addresses: acc.addresses.concat(response.addresses),
        totalRecords: acc.totalRecords + response.totalRecords,
      };
    }, { addresses: [], totalRecords: 0 });
  };
};
