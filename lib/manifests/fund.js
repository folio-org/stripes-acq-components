import { FUNDS_API } from '../constants';
import { baseManifest } from './base';

// eslint-disable-next-line import/prefer-default-export
export const fundsManifest = {
  ...baseManifest,
  path: FUNDS_API,
  params: {
    query: 'cql.allRecords=1 sortby name',
  },
  records: 'funds',
};
