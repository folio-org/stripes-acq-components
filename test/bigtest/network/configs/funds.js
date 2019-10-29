import { FUNDS_API } from '../../../../lib';
import {
  createGetAll,
  createGetById,
  createPost,
  createPut,
} from './utils';

const SCHEMA_NAME = 'funds';

const configFunds = server => {
  server.get(FUNDS_API, createGetAll(SCHEMA_NAME));
  server.get(`${FUNDS_API}/:id`, createGetById(SCHEMA_NAME));
  server.post(FUNDS_API, createPost(SCHEMA_NAME));
  server.put(`${FUNDS_API}/:id`, createPut(SCHEMA_NAME));
  server.delete(`${FUNDS_API}/:id`, SCHEMA_NAME);
};

export default configFunds;
