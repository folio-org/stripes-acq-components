import { LOCATIONS_API } from '../../../../lib';

const configLocations = server => {
  server.get(LOCATIONS_API, 'location');
};

export default configLocations;
