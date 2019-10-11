import {
  CONFIG_API,
  TAGS_API,
} from '../constants';
import { baseManifest } from './base';

export const tagsResource = {
  ...baseManifest,
  path: TAGS_API,
  params: {
    query: 'cql.allRecords=1 sortby label',
  },
  records: 'tags',
};

export const configTags = {
  ...baseManifest,
  records: 'configs',
  path: CONFIG_API,
  GET: {
    params: {
      query: '(module=TAGS and configName=tags_enabled)',
    },
  },
};
