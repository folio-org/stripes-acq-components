import { escapeRegExp, keyBy } from 'lodash';

export const getFieldLabels = (intl, paths, labelsMap = {}, hiddenFields = []) => {
  if (!paths) return null;

  const labelsMapEntries = Object.entries(labelsMap);
  const hiddenFieldsMap = keyBy(hiddenFields);

  return paths.reduce((acc, path) => {
    const fieldLabel = labelsMapEntries.find(([fieldPath]) => {
      const regex = new RegExp(`^${escapeRegExp(fieldPath).replaceAll('\\\\d', '\\d')}$`);

      return regex.test(path);
    })?.[1] || path;

    if (!hiddenFieldsMap[fieldLabel]) {
      acc.push(intl.formatMessage({ id: fieldLabel }));
    }

    return acc;
  }, []).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
};
