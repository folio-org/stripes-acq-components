import { get } from 'lodash';
import { DICT_FUNDS } from '../constants';

// eslint-disable-next-line import/prefer-default-export
export const getFundsForSelect = (resources) => get(resources, [DICT_FUNDS, 'records'], []).map(({ name, code, id }) => ({
  label: name,
  value: id,
  code,
}));
