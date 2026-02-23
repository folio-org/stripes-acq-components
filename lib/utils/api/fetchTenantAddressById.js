import { TENANT_ADDRESSES_API } from '../../constants';

export const fetchTenantAddressById = (httpClient) => {
  return async (id, options = {}) => {
    return httpClient.get(`${TENANT_ADDRESSES_API}/${id}`, options).json();
  };
};
