import {
  createGetAll,
} from './utils';

import {
  PIECES_API,
} from '../../../../lib';

const SCHEMA_NAME = 'pieces';

export const configPieces = server => {
  server.get(`${PIECES_API}`, createGetAll(SCHEMA_NAME));
};
