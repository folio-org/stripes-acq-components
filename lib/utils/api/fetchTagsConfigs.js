import {
  CONFIG_TAGS_ENABLED,
  LIMIT_MAX,
  SETTINGS_SCOPES,
} from '../../constants';
import { fetchSettingsEntries } from './fetchSettingsEntries';

export const fetchTagsConfigs = (httpClient) => {
  return async (options = {}) => {
    const searchParams = {
      query: `(scope="${SETTINGS_SCOPES.TAGS}" and key="${CONFIG_TAGS_ENABLED}")`,
      limit: LIMIT_MAX,
    };

    const { items, totalRecords } = await fetchSettingsEntries(httpClient)({ searchParams, ...options });

    return {
      items,
      totalRecords,
    };
  };
};
