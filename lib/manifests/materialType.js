import {
  MATERIAL_TYPE_API,
} from '../constants';

import { baseManifest } from './base';

export const materialTypesManifest = {
  ...baseManifest,
  path: MATERIAL_TYPE_API,
  params: {
    query: 'cql.allRecords=1 sortby name',
  },
  records: 'mtypes',
  accumulate: true,
};
