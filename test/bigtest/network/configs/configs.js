import { SETTINGS_ENTRIES_API } from '../../../../lib';
import {
  createGetAll,
  createGetById,
  createPost,
  createPut,
} from './utils';

const SCHEMA_NAME = 'settings';

const configConfigs = server => {
  server.get(SETTINGS_ENTRIES_API, createGetAll(SCHEMA_NAME));
  server.get(`${SETTINGS_ENTRIES_API}/:id`, createGetById(SCHEMA_NAME));
  server.post(SETTINGS_ENTRIES_API, createPost(SCHEMA_NAME));
  server.put(`${SETTINGS_ENTRIES_API}/:id`, createPut(SCHEMA_NAME));
  server.delete(`${SETTINGS_ENTRIES_API}/:id`, SCHEMA_NAME);
};

export default configConfigs;
