import { VENDORS_API } from '../../constants';

export const fetchOrganizations = (httpClient) => {
  return async (options) => {
    return httpClient.get(VENDORS_API, options).json();
  };
};
