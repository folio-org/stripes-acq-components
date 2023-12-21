import { escapeRegExp } from 'lodash';

import { HIDDEN_FIELDS_MAP } from './constants';

export const getFieldLabels = (intl, paths, labelsMap = {}) => {
  if (!paths) return null;

  const labelsMapEntries = Object.entries(labelsMap);

  return paths.reduce((acc, path) => {
    const fieldLabel = labelsMapEntries.find(([fieldPath]) => {
      const regex = new RegExp(`^${escapeRegExp(fieldPath).replace('\\\\d', '\\d')}$`);

      return regex.test(path);
    })?.[1] || path;

    if (!HIDDEN_FIELDS_MAP[fieldLabel]) {
      acc.push(intl.formatMessage({ id: fieldLabel }));
    }

    return acc;
  }, []).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
};
