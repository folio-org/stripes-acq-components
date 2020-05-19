import {
  createGetAll,
} from './utils';

import { ITEMS_API } from '../../../../lib';

const SCHEMA_NAME = 'items';

export const configItems = server => {
  server.get(`${ITEMS_API}`, createGetAll(SCHEMA_NAME));
};
