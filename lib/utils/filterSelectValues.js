import { escapeRegExp } from 'lodash';

// eslint-disable-next-line import/prefer-default-export
export const filterSelectValues = (value, dataOptions) => {
  const regex = new RegExp(escapeRegExp(value), 'i');

  return dataOptions.filter(({ label }) => label.search?.(regex) !== -1);
};
