import { LOAN_TYPES_API } from '../constants';
import { baseManifest } from './base';

export const LOAN_TYPES = {
  ...baseManifest,
  path: LOAN_TYPES_API,
  params: {
    query: 'cql.allRecords=1 sortby name',
  },
  records: 'loantypes',
};
