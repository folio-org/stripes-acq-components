import { LINES_API } from '../constants';
import { baseManifest } from './base';

export const orderLinesResource = {
  ...baseManifest,
  path: LINES_API,
  records: 'poLines',
};
