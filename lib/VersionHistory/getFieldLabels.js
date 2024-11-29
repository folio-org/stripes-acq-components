import { escapeRegExp, keyBy } from 'lodash';

export const getFieldLabels = (intl, paths, labelsMap = {}, hiddenFields = [], systemUpdatedFields = []) => {
  if (!paths) return { changedFields: [], systemChanges: [] };

  const labelsMapEntries = Object.entries(labelsMap);
  const hiddenFieldsMap = keyBy(hiddenFields);

  const { changedFields, systemChanges } = paths.reduce((acc, path) => {
    const fieldLabel = labelsMapEntries.find(([fieldPath]) => {
      const regex = new RegExp(`^${escapeRegExp(fieldPath).replace('\\\\d', '\\d')}$`);

      return regex.test(path);
    })?.[1] || path;

    if (systemUpdatedFields.includes(path.replace(/\[\d+\]/g, ''))) {
      acc.systemChanges.push(fieldLabel);
    } else if (!hiddenFieldsMap[fieldLabel]) {
      acc.changedFields.push(intl.formatMessage({ id: fieldLabel }));
    }

    return acc;
  }, { changedFields: [], systemChanges: [] });

  return {
    changedFields: changedFields.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase())),
    systemChanges,
    isSystemChange: !changedFields.length && systemChanges.length,
  };
};
