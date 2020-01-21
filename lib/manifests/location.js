import {
  LOCATIONS_API,
} from '../constants';

import { baseManifest } from './base';

export const locationsManifest = {
  ...baseManifest,
  path: LOCATIONS_API,
  accumulate: true,
  records: 'locations',
};
