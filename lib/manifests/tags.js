import {
  CONFIG_TAGS_ENABLED,
  SETTINGS_ENTRIES_API,
  SETTINGS_SCOPES,
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
  records: 'items',
  path: SETTINGS_ENTRIES_API,
  GET: {
    params: {
      query: `(scope="${SETTINGS_SCOPES.TAGS}" and key="${CONFIG_TAGS_ENABLED}")`,
    },
  },
};
