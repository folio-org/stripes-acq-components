import {
  LOCATIONS_API,
} from '../constants';

import { baseManifest } from './base';

export const locationsManifest = {
  ...baseManifest,
  path: LOCATIONS_API,
  accumulate: true,
  params: {
    query: 'cql.allRecords=1 sortby name',
  },
  records: 'locations',
};
