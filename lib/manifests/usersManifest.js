import { USERS_API } from '../constants';
import { baseManifest } from './base';

export const usersManifest = {
  ...baseManifest,
  path: USERS_API,
  params: {
    query: 'cql.allRecords=1 sortby personal.firstName personal.lastName',
  },
  records: 'users',
};

export const userManifest = {
  ...baseManifest,
  accumulate: true,
  fetch: false,
  path: USERS_API,
};
