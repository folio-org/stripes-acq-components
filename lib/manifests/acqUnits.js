import { baseManifest } from './base';

import { ACQUISITIONS_UNITS_API } from '../constants';

export const acqUnitsResource = {
  ...baseManifest,
  path: ACQUISITIONS_UNITS_API,
  params: {
    query: 'cql.allRecords=1 sortby name',
  },
  records: 'acquisitionsUnits',
};
