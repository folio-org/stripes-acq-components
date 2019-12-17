import { VENDORS_API } from '../constants';
import { baseManifest } from './base';

export const organizationsManifest = {
  ...baseManifest,
  path: VENDORS_API,
  params: {
    query: 'cql.allRecords=1 sortby name',
  },
  records: 'organizations',
};
