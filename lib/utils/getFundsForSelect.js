import { get } from 'lodash';

// eslint-disable-next-line import/prefer-default-export
export const getFundsForSelect = (resources) => get(resources, 'funds.records', []).map(({ name, code, id }) => ({
    label: name,
    value: id,
    code,
  }));