import { ORDERS_API } from '../../../../lib';
import {
  createGetAll,
  createGetById,
  createPost,
  createPut,
} from './utils';

const SCHEMA_NAME = 'orders';

function configOrders(server) {
  server.get(ORDERS_API, createGetAll(SCHEMA_NAME));
  server.get(`${ORDERS_API}/:id`, createGetById(SCHEMA_NAME));
  server.put(`${ORDERS_API}/:id`, createPut(SCHEMA_NAME));
  server.delete(`${ORDERS_API}/:id`, 'order');
  server.post(ORDERS_API, createPost(SCHEMA_NAME));
}

export default configOrders;
