import { CONTRIBUTOR_NAME_TYPES_API } from '../constants';
import { baseManifest } from './base';

// eslint-disable-next-line import/prefer-default-export
export const contributorNameTypesManifest = {
  ...baseManifest,
  path: CONTRIBUTOR_NAME_TYPES_API,
  records: 'contributorNameTypes',
};
