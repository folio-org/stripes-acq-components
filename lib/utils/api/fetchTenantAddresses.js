import { TENANT_ADDRESSES_API } from '../../constants';

export const fetchTenantAddresses = (httpClient) => {
  return async (options = {}) => {
    return httpClient.get(TENANT_ADDRESSES_API, options).json();
  };
};
