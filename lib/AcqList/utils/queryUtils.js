import {
  identity,
  omit,
} from 'lodash';

import { dayjs } from '@folio/stripes/components';
import { escapeCqlValue } from '@folio/stripes/util';

import { emptyArrayFilterValue } from '../../constants';
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
