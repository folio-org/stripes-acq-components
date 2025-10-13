import { CONSORTIUM_LOCATIONS_API } from '../../../constants';
import { getConsortiumCentralTenantKy } from '../../consortia';

export const fetchConsortiumLocations = (httpClient, stripes) => async (options) => {
  return getConsortiumCentralTenantKy(httpClient, stripes)
    .get(CONSORTIUM_LOCATIONS_API, options)
    .json();
};
