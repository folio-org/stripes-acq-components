import { IDENTIFIER_TYPES_API } from '../constants';
import { baseManifest } from './base';

// eslint-disable-next-line import/prefer-default-export
export const identifierTypesManifest = {
  ...baseManifest,
  path: IDENTIFIER_TYPES_API,
  records: 'identifierTypes',
};
