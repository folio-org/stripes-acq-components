import {
  LIMIT_MAX,
  SETTINGS_SCOPES,
} from '../../constants';
import { getAddresses } from '../getAddresses';
import { fetchSettingsEntries } from './fetchSettingsEntries';

export const fetchTenantAddresses = (httpClient) => {
  return async (options = {}) => {
    const searchParams = {
      query: `(scope="${SETTINGS_SCOPES.TENANT_ADDRESSES}")`,
      limit: LIMIT_MAX,
    };

    const { items, totalRecords } = await fetchSettingsEntries(httpClient)({ searchParams, ...options });

    return ({
      addresses: getAddresses(items),
      totalRecords,
    });
  };
};
