import { CONSORTIUM_LOCATIONS_API } from '../../../constants';

export const fetchConsortiumLocations = (httpClient) => async (options) => {
  return httpClient.get(CONSORTIUM_LOCATIONS_API, options).json();
};
