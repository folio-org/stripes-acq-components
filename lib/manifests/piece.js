import {
  ITEMS_API,
  ORDER_PIECES_API,
  PIECES_API,
  REQUESTS_API,
} from '../constants';
import { baseManifest } from './base';

export const piecesResource = {
  ...baseManifest,
  accumulate: true,
  clientGeneratePk: false,
  fetch: false,
  path: PIECES_API,
  records: 'pieces',
};

export const pieceResource = {
  ...baseManifest,
  accumulate: true,
  clientGeneratePk: false,
  path: ORDER_PIECES_API,
};

export const itemsResource = {
  ...baseManifest,
  fetch: false,
  accumulate: true,
  path: ITEMS_API,
  records: 'items',
};

export const requestsResource = {
  ...baseManifest,
  fetch: false,
  accumulate: true,
  path: REQUESTS_API,
  records: 'requests',
};
