import { CONFIG_API } from '../../../../lib';
import {
  createGetAll,
  createGetById,
  createPost,
  createPut,
} from './utils';

const SCHEMA_NAME = 'configs';

const configConfigs = server => {
  server.get(CONFIG_API, createGetAll(SCHEMA_NAME));
  server.get(`${CONFIG_API}/:id`, createGetById(SCHEMA_NAME));
  server.post(CONFIG_API, createPost(SCHEMA_NAME));
  server.put(`${CONFIG_API}/:id`, createPut(SCHEMA_NAME));
  server.delete(`${CONFIG_API}/:id`, SCHEMA_NAME);
};

export default configConfigs;
