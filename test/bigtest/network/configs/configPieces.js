import {
  createGetAll,
  createPut,
  createPost,
} from './utils';

import {
  ORDER_PIECES_API,
  PIECES_API,
} from '../../../../lib';

const SCHEMA_NAME = 'pieces';

export const configPieces = server => {
  server.get(PIECES_API, createGetAll(SCHEMA_NAME));
  server.delete(`${ORDER_PIECES_API}/:id`, 'piece');
  server.put(`${ORDER_PIECES_API}/:id`, createPut(SCHEMA_NAME));
  server.post(ORDER_PIECES_API, createPost(SCHEMA_NAME));
};
