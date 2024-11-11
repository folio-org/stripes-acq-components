import { batchRequest } from '../batchFetch';
import { fetchOrganizations } from './fetchOrganizations';

export const fetchOrganizationsByIds = (httpClient) => {
  return (ids, options) => {
    const requestFn = ({ params }) => {
      return fetchOrganizations(httpClient)({ ...options, searchParams: params });
    };

    return batchRequest(requestFn, ids).then((responses) => {
      return responses.reduce((acc, response) => {
        return {
          organizations: acc.organizations.concat(response.organizations),
          totalRecords: acc.totalRecords + response.totalRecords,
        };
      }, { organizations: [], totalRecords: 0 });
    });
  };
};
