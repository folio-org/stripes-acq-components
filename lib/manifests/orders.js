import {
  ACQUISITION_METHODS_API,
  LINES_API,
  PREFIXES_API,
  SUFFIXES_API,
} from '../constants';
import { baseManifest } from './base';

export const orderLinesResource = {
  ...baseManifest,
  path: LINES_API,
  records: 'poLines',
};

export const prefixesResource = {
  ...baseManifest,
  path: PREFIXES_API,
  params: {
    query: 'cql.allRecords=1 sortby name',
  },
  records: 'prefixes',
  shouldRefresh: () => false,
};

export const suffixesResource = {
  ...baseManifest,
  path: SUFFIXES_API,
  params: {
    query: 'cql.allRecords=1 sortby name',
  },
  records: 'suffixes',
  shouldRefresh: () => false,
};

export const acquisitionMethodsResource = {
  ...baseManifest,
  path: ACQUISITION_METHODS_API,
  params: {
    query: 'cql.allRecords=1 sortby value',
  },
  records: 'acquisitionMethods',
  shouldRefresh: () => false,
};
