import { SETTINGS_ENTRIES_API } from '../../constants';

export const fetchSettingsEntries = (httpClient) => {
  return async (options) => {
    return httpClient.get(SETTINGS_ENTRIES_API, options).json();
  };
};
