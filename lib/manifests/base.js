import { LIMIT_MAX } from '../constants';

// eslint-disable-next-line import/prefer-default-export
export const baseManifest = {
  throwErrors: false,
  type: 'okapi',
  perRequest: LIMIT_MAX,
};
