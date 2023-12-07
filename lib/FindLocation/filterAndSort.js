import isNil from 'lodash/isNil';
import get from 'lodash/get';

import { SEARCH_PARAMETER } from '../AcqList';

const normalizeValue = (value) => value.toString().trim().toLowerCase();

/**
 * Sorts and filters an array of objects.
 * @param { Object } config - Configuration for mapping and query fields.
 * @param { Object } activeFilters - Filters to apply to the array elements.
 * @param { Array } items - Array of objects to filter and sort.
 * @returns { Array } - Filtered and sorted array of objects.
 */
export const filterAndSort = (config, activeFilters, items) => {
  const {
    sorting,
    sortingDirection,
    ...filters
  } = activeFilters;

  const filteredItems = items.filter(item => {
    return Object.entries(filters)
      .filter(entry => !isNil(entry[1]))
      .every(([key, value]) => {
        const itemKey = config.filterMap?.[key] || key;

        if (Array.isArray(value)) {
          return value.includes(item[itemKey]);
        }

        if (key === SEARCH_PARAMETER) {
          return config.queryIndexes.some(field => (
            normalizeValue(get(item, field, '')).includes(normalizeValue(value))
          ));
        }

        return get(item, itemKey, '').includes(value);
      });
  });

  if (sorting) {
    filteredItems.sort((a, b) => {
      const pathToField = config.sortingMap?.[sorting] || sorting;

      const valueA = normalizeValue(get(a, pathToField, ''));
      const valueB = normalizeValue(get(b, pathToField, ''));

      return sortingDirection === 'descending' ? valueB.localeCompare(valueA) : valueA.localeCompare(valueB);
    });
  }

  return filteredItems;
};
