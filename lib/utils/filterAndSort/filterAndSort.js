import get from 'lodash/get';
import isNil from 'lodash/isNil';

import {
  ASC_DIRECTION,
  DESC_DIRECTION,
  SEARCH_PARAMETER,
  SORTING_DIRECTION_PARAMETER,
  SORTING_PARAMETER,
} from '../../AcqList/constants';
import { FILTER_OPERATORS } from './constants';

// Normalize value based on its type
const normalize = (value, type = 'string') => {
  if (value === null || value === undefined) return '';
  switch (type) {
    case 'string':
      return value.toString().trim();
    case 'number':
      return Number(value);
    case 'boolean':
      return Boolean(value);
    case 'date':
      return new Date(value);
    default:
      return value;
  }
};

// Compare two values with support for string, number, date types
const compare = (a, b, type = 'string') => {
  const valA = normalize(a, type);
  const valB = normalize(b, type);

  if (type === 'string') {
    return valA.localeCompare(valB);
  }

  if (valA > valB) return 1;
  if (valA < valB) return -1;

  return 0;
};

// Apply the selected operator to a pair of values
const applyOperator = (itemValue, filterValue, operator, type = 'string', caseSensitive = false) => {
  if (isNil(itemValue)) return false;

  const normItem = normalize(itemValue, type);
  const normFilter = normalize(filterValue, type);

  const itemStr = caseSensitive ? normItem.toString() : normItem.toString().toLowerCase();
  const filterStr = caseSensitive ? normFilter.toString() : normFilter.toString().toLowerCase();

  switch (operator) {
    case FILTER_OPERATORS.equals:
      return itemStr === filterStr;
    case FILTER_OPERATORS.includes:
      return itemStr.includes(filterStr);
    case FILTER_OPERATORS.startsWith:
      return itemStr.startsWith(filterStr);
    case FILTER_OPERATORS.endsWith:
      return itemStr.endsWith(filterStr);
    case FILTER_OPERATORS.greaterThan:
      return normItem > normFilter;
    case FILTER_OPERATORS.lessThan:
      return normItem < normFilter;
    case FILTER_OPERATORS.greaterThanOrEqual:
      return normItem >= normFilter;
    case FILTER_OPERATORS.lessThanOrEqual:
      return normItem <= normFilter;
    default:
      return false;
  }
};

/**
 * Filters and sorts a list of items.
 *
 * @param {Object} config - Configuration for filters and sorting.
 * @param {Object} activeFilters - User-selected filters and sorting values.
 * @param {Array} items - The array of items to process.
 *
 * @returns {Array} - Filtered and sorted items.
 */
export const filterAndSort = (config, activeFilters, items) => {
  const {
    [SORTING_PARAMETER]: sorting,
    [SORTING_DIRECTION_PARAMETER]: sortingDirection = ASC_DIRECTION,
    ...filters
  } = activeFilters;

  // Step 1: Apply filters
  const filteredItems = items.filter(item => {
    return Object.entries(filters)
      .filter(([_filterKey, value]) => !isNil(value))
      .every(([filterKey, value]) => {
        // Handle full-text search field
        if (
          filterKey === (config.keywordKey || SEARCH_PARAMETER) &&
          config.searchIndexes?.length &&
          typeof value === 'string'
        ) {
          const searchValue = value.toLowerCase().trim();

          return config.searchIndexes.some(path => {
            const fieldVal = get(item, path, '');

            return fieldVal.toString().toLowerCase().includes(searchValue);
          });
        }

        // Regular filter config
        const filterCfg = config.filtersConfig?.[filterKey];

        if (!filterCfg?.field) return true;

        const itemVal = get(item, filterCfg.field);

        if (Array.isArray(value)) {
          return value.some(val => (filterCfg.customFilter
            ? filterCfg.customFilter(itemVal, val)
            : applyOperator(
              itemVal,
              val,
              filterCfg.operator || FILTER_OPERATORS.equals,
              filterCfg.type,
              filterCfg.caseSensitive,
            )));
        }

        return filterCfg.customFilter
          ? filterCfg.customFilter(itemVal, value)
          : applyOperator(
            itemVal,
            value,
            filterCfg.operator || FILTER_OPERATORS.equals,
            filterCfg.type,
            filterCfg.caseSensitive,
          );
      });
  });

  // Step 2: Apply sorting
  if (!sorting) return filteredItems;

  const sortCfg = config.sortingConfig?.[sorting];

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortCfg?.customSort) {
      return sortCfg.customSort(a, b);
    }

    const sortCfgField = sortCfg?.field || sorting;
    const sortCfgDirection = sortCfg?.direction || sortingDirection;
    const sortCfgType = sortCfg?.type || 'string';

    const valA = get(a, sortCfgField);
    const valB = get(b, sortCfgField);
    const result = compare(valA, valB, sortCfgType);

    return sortCfgDirection === DESC_DIRECTION ? -result : result;
  });

  return sortedItems;
};
