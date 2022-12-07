import { escapeRegExp } from 'lodash';

export const getFieldLabels = (intl, paths, labelsMap = {}) => {
  if (!paths) return [];

  const labelsMapEntries = Object.entries(labelsMap);

  return paths.map((path) => {
    const fieldLabel = labelsMapEntries.find(([fieldPath]) => {
      const regex = new RegExp(`^${escapeRegExp(fieldPath).replace('\\\\d', '\\d')}$`);

      return regex.test(path);
    })?.[1] || path;

    return intl.formatMessage({ id: fieldLabel });
  }).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
};
