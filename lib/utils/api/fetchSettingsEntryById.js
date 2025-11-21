import { SETTINGS_ENTRIES_API } from '../../constants';

export const fetchSettingsEntryById = (httpClient) => {
  return async (id, options) => {
    return httpClient.get(`${SETTINGS_ENTRIES_API}/${id}`, options).json();
  };
};
