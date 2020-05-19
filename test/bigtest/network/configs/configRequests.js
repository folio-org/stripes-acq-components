import {
  createGetAll,
} from './utils';

import { REQUESTS_API } from '../../../../lib';

const SCHEMA_NAME = 'requests';

export const configRequests = server => {
  server.get(`${REQUESTS_API}`, createGetAll(SCHEMA_NAME));
};
