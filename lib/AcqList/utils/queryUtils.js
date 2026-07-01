import {
  identity,
  omit,
} from 'lodash';

import { dayjs } from '@folio/stripes/components';
import { escapeCqlValue } from '@folio/stripes/util';

import { emptyArrayFilterValue } from '../../constants';
import {
  CQLBuilder,
  CQLBuilderArrayValue,
} from '../../utils';
import {
  SEARCH_PARAMETER,
  OFFSET_PARAMETER,
  LIMIT_PARAMETER,
  ASC_DIRECTION,
  SORTING_PARAMETER,
  SORTING_DIRECTION_PARAMETER,
  SEARCH_INDEX_PARAMETER,
  DATE_RANGE_FILTER_FORMAT,
} from '../constants';

const {
  EQUAL,
  FUZZY,
} = CQLBuilder.OPERATORS;

/**
 * Builds a CQL query for filters with multiple options. If the filter value is an array, it constructs a query that checks if the field matches any of the values using "or".
 * If it's a single value, it constructs a simple equality query.
 * Different from buildArrayFieldQuery, this function does not add wildcards around the values.
 * It also supports adding modifiers to the query if provided in the options.
 * Uses CQLBuilder for constructing the query, which allows for more complex queries and proper escaping of values.
 *
 * @param {string} filterKey - The key of the filter (CQL index)
 * @param {string|string[]} filterValue - The value(s) of the filter
 * @param {object} options - Additional options for query building
 * @param {string} options.operator - The CQL operator to use (default is '=')
 * @param {object[]} options.modifiers - Modifiers to apply: object for AND-style (`{ type: 'book' }` → `/@type=book`), array for OR-style (`['author']` → `/@author`)
 * @returns {string} The constructed CQL query string
 */
export const buildMultiOptionCqlQuery = (filterKey, filterValue, options = {}) => {
  const {
    operator = FUZZY,
    modifiers,
  } = options;
  const cql = new CQLBuilder();

  const value = Array.isArray(filterValue) ? new CQLBuilderArrayValue(filterValue) : filterValue;
  const isEmptyArrayValue = value === emptyArrayFilterValue;
  const relation = isEmptyArrayValue ? EQUAL : operator;

  return cql
    .index(filterKey)
    .relation(relation, isEmptyArrayValue ? undefined : modifiers)
    .value(value)
    .build();
};

export const buildArrayFieldQuery = (filterKey, filterValue, _options = {}) => {
  if (Array.isArray(filterValue)) {
    return `${filterKey}==(${filterValue.map(v => `"*${v}*"`).join(' or ')})`;
  }

  if (filterValue === emptyArrayFilterValue) {
    return `${filterKey}==${filterValue}`;
  }

  return `${filterKey}==${`"*${filterValue}*"`}`;
};

export const buildDateRangeQuery = (filterKey, filterValue, _options = {}) => {
  const [from, to] = (Array.isArray(filterValue) ? filterValue.toString() : filterValue).split(':');
  const start = dayjs(from).startOf('day').format(DATE_RANGE_FILTER_FORMAT);
  const end = dayjs(to).endOf('day').format(DATE_RANGE_FILTER_FORMAT);

  return `(${filterKey}>="${start}" and ${filterKey}<="${end}")`;
};

export const buildNumberRangeQuery = (filterKey, filterValue, _options = {}) => {
  const [min, max] = filterValue.split('-');
  const minQuery = min ? `${filterKey} >=/number ${min}` : '';
  const maxQuery = max ? `${filterKey} <=/number ${max}` : '';

  return `(${[minQuery, maxQuery].filter(Boolean).join(' and ')})`;
};

/**
 * Builds a CQL query for date-time range filtering, taking into account timezone.
 * @param {*} filterKey
 * @param {*} filterValue
 * @param {*} options - optional parameters
 * @returns {string} CQL query string
 *
 *  There are several options how timezone can be provided:
 *  1. options.timezone - directly passed timezone string
 *  2. Default timezone from dayjs if options.timezone is not provided
 */
export const buildDateTimeRangeQuery = (filterKey, filterValue, options = {}) => {
  const [from, to] = (Array.isArray(filterValue) ? filterValue.toString() : filterValue).split(':');
  const start = dayjs.tz(from, options.timezone).startOf('day').utc().format(DATE_RANGE_FILTER_FORMAT);
  const end = dayjs.tz(to, options.timezone).endOf('day').utc().format(DATE_RANGE_FILTER_FORMAT);

  return `(${filterKey}>="${start}" and ${filterKey}<="${end}")`;
};

export const getFilterParams = (queryParams) => omit(
  queryParams,
  [SORTING_PARAMETER, SORTING_DIRECTION_PARAMETER, SEARCH_INDEX_PARAMETER, OFFSET_PARAMETER, LIMIT_PARAMETER],
);

export const getFiltersCount = (filters) => {
  return filters && Object.keys(getFilterParams(filters)).filter((k) => {
    return k === SEARCH_PARAMETER
      ? Boolean(filters[k])
      : filters[k] !== undefined;
  }).length;
};

export const buildFilterQuery = (
  queryParams,
  getSearchQuery,
  customFilterMap = {},
  escapeCql = true,
  options = {},
) => {
  const filterParams = getFilterParams(queryParams);
  const escapeFn = escapeCql ? escapeCqlValue : identity;

  return Object.keys(filterParams).map((filterKey) => {
    const filterValue = queryParams[filterKey];
    const buildCustomFilterQuery = customFilterMap[filterKey];

    if (!filterValue) return false;

    if (filterKey === SEARCH_PARAMETER && filterValue) {
      const searchQuery = getSearchQuery(escapeFn(filterValue), queryParams[SEARCH_INDEX_PARAMETER]);

      return `(${searchQuery})`;
    }

    if (buildCustomFilterQuery) {
      return buildCustomFilterQuery(filterValue, options);
    }

    if (Array.isArray(filterValue)) {
      return `${filterKey}==(${filterValue.map(v => `"${v}"`).join(' or ')})`;
    }

    return `${filterKey}=="${filterValue}"`;
  }).filter(q => q).join(' and ');
};

export const buildSortingQuery = (queryParams, customSortMap = {}) => {
  if (queryParams.sorting) {
    const key = customSortMap[queryParams.sorting] || queryParams.sorting;

    return `sortby ${key}/sort.${queryParams.sortingDirection || ASC_DIRECTION}`;
  }

  return '';
};

export const connectQuery = (filterQuery, sortingQuery) => {
  if (sortingQuery) {
    return `(${filterQuery}) ${sortingQuery}`;
  }

  return filterQuery;
};

export const makeQueryBuilder = (
  searchAllQuery,
  getSearchQuery,
  defaultSorting,
  customFilterMap,
  customSortMap,
  escapeCql,
) => {
  return (queryParams, options = {}) => {
    const filterQuery = buildFilterQuery(
      queryParams,
      getSearchQuery,
      customFilterMap,
      escapeCql,
      options,
    ) || searchAllQuery;
    const sortingQuery = buildSortingQuery(queryParams, customSortMap) || defaultSorting;

    return connectQuery(filterQuery, sortingQuery);
  };
};
